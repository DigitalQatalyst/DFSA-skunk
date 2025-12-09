/**
 * React Query Hooks for Profile Module
 * Follows pattern from useDocumentsQuery.ts
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { getAuthToken } from '../utils/getAuthToken';

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  domains: () => [...profileKeys.all, 'domains'] as const,
  domain: (domainKey: string) => [...profileKeys.all, 'domain', domainKey] as const,
  summary: () => [...profileKeys.all, 'summary'] as const,
};

// Types
export interface ProfileDomainResponse {
  schema: any;
  data: Record<string, any>;
  completion: number;
}

/**
 * Get the API base URL for profile requests
 * In production: Uses VITE_API_BASE_URL environment variable (should point to deployed Express API)
 * In development: Falls back to '/api' which uses Vite proxy to localhost:5000
 */
function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // If no env variable, use proxy in development
  if (!envUrl) {
    return '/api';
  }
  
  // If URL already ends with /api/v1, use as-is
  if (envUrl.endsWith('/api/v1')) {
    return envUrl;
  }
  
  // If URL ends with /api, add /v1
  if (envUrl.endsWith('/api')) {
    return `${envUrl}/v1`;
  }
  
  // Otherwise, add /api/v1
  return `${envUrl}/api/v1`;
}

export interface UpdateProfileDomainVariables {
  domainKey: string;
  data: Record<string, any>;
}

/**
 * Fetch profile domain data
 */
async function fetchProfileDomain(
  token: string | null,
  domainKey: string
): Promise<ProfileDomainResponse> {
  if (!token) {
    throw new Error('Authentication required');
  }

  const API_BASE_URL = getApiBaseUrl();
  const response = await fetch(`${API_BASE_URL}/profile/domains/${domainKey}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch profile domain' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Update profile domain data
 */
async function updateProfileDomain(
  token: string | null,
  domainKey: string,
  data: Record<string, any>
): Promise<ProfileDomainResponse> {
  if (!token) {
    throw new Error('Authentication required');
  }

  const API_BASE_URL = getApiBaseUrl();
  const response = await fetch(`${API_BASE_URL}/profile/domains/${domainKey}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update profile domain' }));
    // Return error object with details for better error handling
    const errorMessage = new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    (errorMessage as any).response = error; // Attach full error response
    (errorMessage as any).status = response.status; // Attach status code
    throw errorMessage;
  }

  return await response.json();
}

/**
 * React Query hook to fetch profile domain
 */
export function useProfileDomainQuery(
  domainKey: string,
  options?: Omit<UseQueryOptions<ProfileDomainResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ProfileDomainResponse, Error>({
    queryKey: profileKeys.domain(domainKey),
    queryFn: async () => {
      const token = await getAuthToken();
      return fetchProfileDomain(token, domainKey);
    },
    enabled: !!domainKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * React Query mutation hook to update profile domain
 */
export function useUpdateProfileDomainMutation(
  domainKey: string,
  options?: Omit<UseMutationOptions<ProfileDomainResponse, Error, Record<string, any>>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  // Extract callbacks to merge properly
  const customOnSuccess = options?.onSuccess;
  const customOnError = options?.onError;

  // Remove callbacks from options to avoid conflicts
  const { onSuccess: _, onError: __, ...restOptions } = options || {};

  return useMutation<ProfileDomainResponse, Error, Record<string, any>>({
    mutationFn: async (data) => {
      const token = await getAuthToken();
      return updateProfileDomain(token, domainKey, data);
    },
    onSuccess: (responseData, variables, context) => {
      // Update query cache immediately with the response data
      // Note: PUT response has { data, completion } but GET response has { schema, data, completion }
      // So we need to preserve schema from oldData
      queryClient.setQueryData<ProfileDomainResponse>(
        profileKeys.domain(domainKey),
        (oldData) => {
          if (!oldData) {
            // If no old data, we need to fetch it or return minimal structure
            // But this shouldn't happen in normal flow
            console.warn(`[useProfileQueries] No old data found for ${domainKey}, cache update may be incomplete`);
            return {
              schema: null, // Will be loaded from config fallback
              data: responseData.data || {},
              completion: responseData.completion || 0,
            };
          }
          // Replace data with response data (PUT returns full updated data, not just changes)
          // Preserve schema from oldData since PUT response doesn't include it
          const updated = {
            ...oldData,
            data: responseData.data, // Replace with full updated data
            completion: responseData.completion,
          };
          console.log(`[useProfileQueries] Updated cache for ${domainKey}:`, {
            completion: updated.completion,
            dataKeys: Object.keys(updated.data),
          });
          return updated;
        }
      );
      
      // Also update summary cache if it exists
      if (domainKey === 'profile_summary') {
        queryClient.setQueryData<ProfileDomainResponse>(
          profileKeys.summary(),
          (oldData) => {
            if (!oldData) {
              return {
                schema: null,
                data: responseData.data || {},
                completion: responseData.completion || 0,
              };
            }
            return {
              ...oldData,
              data: responseData.data, // Replace with full updated data
              completion: responseData.completion,
            };
          }
        );
      }
      
      // Invalidate queries to ensure fresh data (but cache is already updated)
      queryClient.invalidateQueries({ queryKey: profileKeys.domain(domainKey) });
      queryClient.invalidateQueries({ queryKey: profileKeys.summary() });
      
      // Then call custom onSuccess if provided
      customOnSuccess?.(responseData, variables, context);
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      customOnError?.(error, variables, context);
    },
    // Spread other options (excluding callbacks)
    ...restOptions,
  });
}

/**
 * Convenience hook for Profile Summary
 */
export function useProfileSummaryQuery(
  options?: Omit<UseQueryOptions<ProfileDomainResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useProfileDomainQuery('profile_summary', options);
}

/**
 * Convenience mutation hook for Profile Summary
 */
export function useUpdateProfileSummaryMutation(
  options?: Omit<UseMutationOptions<ProfileDomainResponse, Error, Record<string, any>>, 'mutationFn'>
) {
  // Extract custom callbacks
  const customOnSuccess = options?.onSuccess;
  const customOnError = options?.onError;

  // Merge callbacks to ensure both default (query invalidation) and custom callbacks are called
  const mergedOptions: typeof options = {
    ...options,
    onSuccess: (data, variables, context) => {
      // First call the custom onSuccess (which includes toast notification)
      customOnSuccess?.(data, variables, context);
      // Query invalidation is handled by useUpdateProfileDomainMutation's default onSuccess
    },
    onError: (error, variables, context) => {
      // Call custom onError
      customOnError?.(error, variables, context);
    },
  };

  return useUpdateProfileDomainMutation('profile_summary', mergedOptions);
}

