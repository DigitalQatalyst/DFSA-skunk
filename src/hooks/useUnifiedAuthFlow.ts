import { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/UnifiedAuthProvider';
import { useOrganizationInfo } from './useOrganizationInfo';
import { OnboardingState } from '../services/onboardingStatus';
import { useAbilityContext } from '../context/AbilityContext';
import { useOnboardingStatus } from './useOnboardingStatus';
import { isDemoModeEnabled } from '../utils/demoAuthUtils';

/**
 * Unified hook that combines:
 * - Authentication state (from UnifiedAuthProvider)
 * - Organization info fetching
 * - Onboarding status check
 * - Automatic routing based on state
 * 
 * This is the single source of truth for auth/onboarding flow.
 */
export interface UnifiedAuthFlowState {
  // Auth state
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  
  // Organization state
  organization: ReturnType<typeof useOrganizationInfo>['organization'];
  isLoadingOrg: boolean;
  orgError: string | null;
  
  // Onboarding state
  onboardingState: OnboardingState;
  isCheckingOnboarding: boolean;
  
  // Computed loading state (true if any check is in progress)
  isLoading: boolean;
  
  // Computed: is everything ready?
  isReady: boolean;
  
  // Account ID (from organization)
  accountId: string | undefined;
  
  // Refetch functions
  refetchOrg: () => Promise<void>;
  refetchOnboarding: () => Promise<void>;
}

export function useUnifiedAuthFlow(): UnifiedAuthFlowState {
  const { user, isLoading: authLoading } = useAuth();
  const { organization, isLoading: orgLoading, error: orgError, refetch: refetchOrg } = useOrganizationInfo();
  const { role } = useAbilityContext(); // Get role from AbilityContext (which comes from organization info)
  const navigate = useNavigate();
  const location = useLocation();

  const accountId = organization?.accountId;
  const isAdmin = role === 'admin';

  // Check if user is explicitly revisiting onboarding via URL parameter
  const searchParams = new URLSearchParams(location.search);
  const isRevisiting = searchParams.get('revisit') === 'true';

  // Use React Query hook for onboarding status (only for admins)
  const {
    data: onboardingData,
    isLoading: isCheckingOnboarding,
    refetch: refetchOnboardingQuery,
  } = useOnboardingStatus(accountId, {
    enabled: isAdmin && !!accountId && !orgLoading, // Only fetch for admins with accountId
  });

  // Extract onboarding state from React Query result
  const onboardingState: OnboardingState = useMemo(() => {
    if (!isAdmin) {
      return 'not_completed'; // Non-admins always return not_completed
    }
    return onboardingData?.state ?? 'not_completed';
  }, [isAdmin, onboardingData?.state]);

  // Refetch onboarding status (wraps React Query refetch)
  const refetchOnboarding = async () => {
    await refetchOnboardingQuery();
  };

  // Handle automatic routing based on role and onboarding state
  // This is the global onboarding access logic:
  // 1. Non-admins: Never see onboarding - redirect to overview immediately
  // 2. Admins: Only see onboarding if they don't have a record, otherwise redirect to overview
  useEffect(() => {
    // Skip all routing logic in demo mode
    if (isDemoModeEnabled()) {
      return;
    }

    // Don't redirect while checks are in progress
    if (authLoading || orgLoading || !user) {
      return;
    }

    // Wait for role to be determined before making routing decisions
    // If role is undefined, wait for it (it comes from organization info)
    if (role === undefined && !orgLoading) {
      // Role not yet determined - wait
      return;
    }

    // Log user and role information
    console.log('===== ONBOARDING ROUTING CHECK =====');
    console.log('🔐 Signed-in user:', user?.email || user?.name || 'Unknown');
    console.log('🪪 Role detected:', role || 'undefined');
    console.log('🏢 accountId:', accountId || 'MISSING');
    console.log('📍 Current path:', location.pathname);

    const isOnboardingRoute = location.pathname.startsWith('/dashboard/onboarding');

    // Rule 1: Non-admins should NEVER see onboarding - redirect immediately
    // This must happen before any onboarding state checks
    if (!isAdmin && isOnboardingRoute) {
      console.log('🚫 [ROUTING] Non-admin user on onboarding route - redirecting to overview');
      console.log('===================================');
      navigate('/dashboard/overview', { replace: true });
      return;
    }

    // Ensure non-admins always land on overview when hitting the dashboard root
    if (!isAdmin && location.pathname === '/dashboard') {
      console.log('🚫 [ROUTING] Non-admin user on dashboard root - redirecting to overview');
      console.log('===================================');
      navigate('/dashboard/overview', { replace: true });
      return;
    }

    // For non-admins, skip onboarding checks entirely
    if (!isAdmin) {
      console.log('✅ [ROUTING] Non-admin user - skipping onboarding check');
      console.log('===================================');
      return;
    }

    // For admins, wait for onboarding check to complete before redirecting
    if (isAdmin && isCheckingOnboarding) {
      console.log('⏳ [ROUTING] Admin user - waiting for onboarding check to complete...');
      return;
    }

    // Log onboarding check result for admins
    if (isAdmin) {
      console.log('🔍 Onboarding check triggered');
      console.log('📊 Onboarding state:', onboardingState);
      console.log('🎯 Onboarding completed:', onboardingState === 'completed');
    }

    // Log if admin is revisiting onboarding
    if (isAdmin && isRevisiting) {
      console.log('🔄 [ROUTING] Admin is revisiting onboarding - bypassing completion guard');
    }

    // Rule 2: Admins - if onboarding is completed and user is on onboarding page, redirect to overview
    // UNLESS they are explicitly revisiting (via ?revisit=true parameter)
    if (isAdmin && onboardingState === 'completed' && isOnboardingRoute && !isRevisiting) {
      console.log('✅ [ROUTING] Admin with completed onboarding on onboarding page - redirecting to overview');
      console.log('===================================');
      navigate('/dashboard/overview', { replace: true });
      return;
    }

    // Rule 3: Admins - if onboarding is not completed and user is on dashboard (not onboarding), redirect to onboarding
    // Non-admins are not affected by this rule (they should always see overview)
    // Note: /dashboard (exact match) is handled by ProtectedRoute, so we don't need to handle it here
    // This prevents redirect loops
    if (isAdmin && onboardingState === 'not_completed' && !isOnboardingRoute && location.pathname.startsWith('/dashboard') && location.pathname !== '/dashboard') {
      console.log('📝 [ROUTING] Admin with incomplete onboarding on dashboard - redirecting to onboarding');
      console.log('===================================');
      navigate('/dashboard/onboarding', { replace: true });
      return;
    }

    if (isAdmin) {
      console.log('✅ [ROUTING] Admin user - routing check complete, no redirect needed');
      console.log('===================================');
    }
  }, [
    authLoading,
    orgLoading,
    isCheckingOnboarding,
    user,
    role,
    isAdmin,
    onboardingState,
    location.pathname,
    navigate,
    accountId,
  ]);

  // Computed states
  const isLoading = useMemo(
    () => isDemoModeEnabled() ? false : (authLoading || orgLoading || isCheckingOnboarding),
    [authLoading, orgLoading, isCheckingOnboarding]
  );

  const isReady = useMemo(
    () => isDemoModeEnabled()
      ? !!user // In demo mode, just check if user exists
      : (!isLoading && !!user && !!organization && !orgError),
    [isLoading, user, organization, orgError]
  );

  return {
    isAuthenticated: !!user,
    isLoadingAuth: authLoading,
    organization,
    isLoadingOrg: orgLoading,
    orgError,
    onboardingState,
    isCheckingOnboarding,
    isLoading,
    isReady,
    accountId,
    refetchOrg,
    refetchOnboarding,
  };
}

