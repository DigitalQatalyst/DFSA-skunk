/**
 * React Query Hooks for Profile Module
 * Follows pattern from useDocumentsQuery.ts
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { getAuthToken } from '../utils/getAuthToken';
import { isDemoModeEnabled, DEMO_ORG_ID, DEMO_USER_ID } from '../utils/demoAuthUtils';

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
 *
 * Note: Products is intentionally special-cased to prevent accidentally hitting the frontend
 * serverless handler (which has a different persistence model for unified matrices).
 */
function getApiBaseUrl(domainKey?: string): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // If no env variable, use proxy in development
  if (!envUrl) {
    if (domainKey === 'products' && !import.meta.env.DEV) {
      throw new Error(
        'Products must be served by the Express API. Set VITE_API_BASE_URL to your Express base (e.g. http://localhost:5000/api/v1).'
      );
    }
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
function buildProfileHeaders(token: string | null, isDemoMode: boolean): Record<string, string> {
  if (isDemoMode) {
    return {
      'Content-Type': 'application/json',
      'x-demo-org-id': DEMO_ORG_ID,
      'x-demo-user-id': DEMO_USER_ID,
    };
  }
  if (!token) {
    throw new Error('Authentication required');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function fetchProfileDomain(
  token: string | null,
  domainKey: string
): Promise<ProfileDomainResponse> {
  const isDemoMode = isDemoModeEnabled();
  const headers = buildProfileHeaders(token, isDemoMode);

  const API_BASE_URL = getApiBaseUrl(domainKey);
  const response = await fetch(`${API_BASE_URL}/profile/domains/${domainKey}`, {
    method: 'GET',
    headers,
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
  const isDemoMode = isDemoModeEnabled();
  const headers = buildProfileHeaders(token, isDemoMode);

  const API_BASE_URL = getApiBaseUrl(domainKey);
  const response = await fetch(`${API_BASE_URL}/profile/domains/${domainKey}`, {
    method: 'PUT',
    headers,
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
      const isDemoMode = isDemoModeEnabled();
      const token = isDemoMode ? null : await getAuthToken();
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
      const isDemoMode = isDemoModeEnabled();
      const token = isDemoMode ? null : await getAuthToken();
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
          // Filter out Supabase metadata fields (organisation_id, created_at, updated_at, etc.)
          const { organisation_id, created_at, updated_at, ...cleanData } = responseData.data || {};
          const updated = {
            ...oldData,
            data: cleanData, // Replace with clean updated data (without Supabase metadata)
            completion: responseData.completion,
          };
          console.log(`[useProfileQueries] Updated cache for ${domainKey}:`, {
            completion: updated.completion,
            dataKeys: Object.keys(updated.data),
            matrixFields: Object.keys(updated.data).filter(k => k.includes('_matrix')),
            sampleMatrix: updated.data.banking_investment_activities_matrix ? {
              keys: Object.keys(updated.data.banking_investment_activities_matrix),
              sampleRow: Object.keys(updated.data.banking_investment_activities_matrix)[0] ? {
                rowKey: Object.keys(updated.data.banking_investment_activities_matrix)[0],
                rowData: updated.data.banking_investment_activities_matrix[Object.keys(updated.data.banking_investment_activities_matrix)[0]],
              } : null,
            } : null,
          });
          return updated;
        }
      );

      // If any domain is updated, Profile Summary may need to refresh
      if (domainKey !== 'profile_summary') {
        queryClient.invalidateQueries({ queryKey: profileKeys.domain('profile_summary') });
      }
      
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

/**
 * Convenience hook for Products
 */
export function useProductsQuery(
  options?: Omit<UseQueryOptions<ProfileDomainResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useProfileDomainQuery('products', options);
}

/**
 * Convenience mutation hook for Products
 */
export function useUpdateProductsMutation(
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

  return useUpdateProfileDomainMutation('products', mergedOptions);
}
