/**
 * React Query hook for fetching onboarding status
 * 
 * This hook provides:
 * - Cached onboarding status with automatic refetching
 * - Proper error handling and retry logic
 * - Cache invalidation support
 * - Role-aware: Only checks onboarding for admin users
 */

import { useQuery, UseQueryOptions, useQueryClient } from '@tanstack/react-query';
import { checkOnboardingStatus, OnboardingState } from '../services/onboardingStatus';
import { useAbilityContext } from '../context/AbilityContext';

export interface OnboardingStatusResponse {
  state: OnboardingState;
  accountId: string;
  checkedAt: string;
}

/**
 * React Query hook for onboarding status
 * 
 * @param accountId - The account ID to check onboarding status for
 * @param options - Optional React Query options
 * @returns Query result with onboarding state, loading, error, and refetch function
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useOnboardingStatus(accountId);
 * 
 * if (isLoading) return <Loader />;
 * if (data?.state === 'completed') {
 *   // Show dashboard
 * }
 * ```
 */
export function useOnboardingStatus(
  accountId: string | undefined | null,
  options?: Omit<UseQueryOptions<OnboardingStatusResponse, Error>, 'queryKey' | 'queryFn'>
) {
  const { role } = useAbilityContext();
  const isAdmin = role === 'admin';
  const queryClient = useQueryClient();

  // Log when hook is called
  console.log('🔍 [USE_ONBOARDING_STATUS] Hook called:', {
    accountId: accountId || 'MISSING',
    role: role || 'undefined',
    isAdmin,
    enabled: !!accountId && isAdmin,
  });

  return useQuery<OnboardingStatusResponse, Error>({
    queryKey: ['onboarding', 'status', accountId],
    queryFn: async (): Promise<OnboardingStatusResponse> => {
      console.log('📞 [USE_ONBOARDING_STATUS] Query function called');
      
      if (!accountId) {
        console.log('⚠️ [USE_ONBOARDING_STATUS] No accountId - returning not_completed');
        return {
          state: 'not_completed',
          accountId: '',
          checkedAt: new Date().toISOString(),
        };
      }

      console.log('✅ [USE_ONBOARDING_STATUS] Calling checkOnboardingStatus API...');
      const state = await checkOnboardingStatus(accountId);
      console.log('✅ [USE_ONBOARDING_STATUS] API returned state:', state);
      
      return {
        state,
        accountId,
        checkedAt: new Date().toISOString(),
      };
    },
    enabled: !!accountId && isAdmin, // Only fetch for admins with accountId
    staleTime: 30 * 1000, // 30 seconds - status can change, so keep it fresh
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch on window focus
    ...options,
  });
}

/**
 * Invalidate onboarding status cache
 * Call this after onboarding is completed or updated
 * 
 * @param accountId - Optional account ID to invalidate specific cache entry
 */
export function invalidateOnboardingStatus(accountId?: string) {
  const queryClient = useQueryClient();
  if (accountId) {
    queryClient.invalidateQueries({ queryKey: ['onboarding', 'status', accountId] });
  } else {
    queryClient.invalidateQueries({ queryKey: ['onboarding', 'status'] });
  }
}

/**
 * Set onboarding status in cache optimistically
 * Useful when you know the status has changed (e.g., after submission)
 * 
 * @param accountId - The account ID
 * @param state - The new onboarding state
 */
export function setOnboardingStatusCache(
  accountId: string,
  state: OnboardingState
) {
  const queryClient = useQueryClient();
  queryClient.setQueryData<OnboardingStatusResponse>(
    ['onboarding', 'status', accountId],
    {
      state,
      accountId,
      checkedAt: new Date().toISOString(),
    }
  );
}

