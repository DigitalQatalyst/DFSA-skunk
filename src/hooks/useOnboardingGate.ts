import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UnifiedAuthProvider';
import { useOrganizationInfo } from './useOrganizationInfo';
import {
  checkOnboardingStatus,
  OnboardingState,
} from '../services/onboardingStatus';

export function useOnboardingGate() {
  const { user, isLoading: authLoading } = useAuth();
  const { organization, isLoading: orgLoading } = useOrganizationInfo();
  const [status, setStatus] = useState<OnboardingState>('not_completed');
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is explicitly revisiting onboarding via URL parameter
  const searchParams = new URLSearchParams(location.search);
  const isRevisiting = searchParams.get('revisit') === 'true';

  const accountId = organization?.accountId;

  useEffect(() => {
    let cancelled = false;

    async function guard() {
      if (!user) {
        if (!cancelled) {
          setStatus('not_completed');
          setChecking(false);
        }
        return;
      }

      if (!accountId) {
        if (!orgLoading && !cancelled) {
          setStatus('not_completed');
          setChecking(false);
          maybeRedirect('not_completed');
        }
        return;
      }

      setChecking(true);
      const nextState = await checkOnboardingStatus(accountId);
      if (!cancelled) {
        setStatus(nextState);
        setChecking(false);
        maybeRedirect(nextState);
      }
    }

    function maybeRedirect(next: OnboardingState) {
      const onOnboardingRoute = location.pathname.startsWith(
        '/dashboard/onboarding'
      );

      // Don't redirect if user is explicitly revisiting onboarding
      if (next === 'completed' && onOnboardingRoute && !isRevisiting) {
        navigate('/dashboard/overview', { replace: true });
        return;
      }

      if (next === 'not_completed' && !onOnboardingRoute) {
        navigate('/dashboard/onboarding', { replace: true });
      }
    }

    guard();

    return () => {
      cancelled = true;
    };
  }, [
    user?.id,
    accountId,
    orgLoading,
    location.pathname,
    navigate,
  ]);

  const isChecking = useMemo(
    () => authLoading || orgLoading || checking,
    [authLoading, orgLoading, checking]
  );

  return { onboardingState: status, isChecking };
}

