/**
 * Service for fetching user profile and account information
 */

import { API_BASE_URL } from '../config/apiBase';

export interface OrganizationInfo {
  azureid: string;
  useremail: string;
  contactId: string | null;
  accountId: string | null;
  accountName: string | null;
  hasAccount: boolean;
  hasContact: boolean;
  fetchedAt?: string;
  // Add other fields as needed from response
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  name?: string;
}

export interface UserProfileResponse {
  success: boolean;
  organization?: OrganizationInfo;
  profile?: OrganizationInfo; // Support old format too
  message?: string;
}

/**
 * Fetches organization info from the backend API using Azure ID and email
 * @param azureId - The Azure AD user ID (from MSAL)
 * @param userEmail - The user's email address (from MSAL)
 * @returns The account ID from the organization info
 * @throws Error if the API call fails or accountId is not found
 */
export async function getAccountIdFromAzureId(azureId: string, userEmail?: string): Promise<string> {
  try {
    console.log('🔵 Fetching account ID for Azure ID:', azureId);
    console.log('   User email:', userEmail || 'not provided');

    const response = await fetch(`${API_BASE_URL}/auth/organization-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        azureid: azureId,
        useremail: userEmail || ''
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to fetch organization info: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: UserProfileResponse = await response.json();
    console.log('📦 Organization info response:', JSON.stringify(data, null, 2));

    // Extract accountId from response (check organization object first, then fallbacks)
    const accountId = data?.organization?.accountId || data?.profile?.accountId || (data as any)?.accountId;

    if (!accountId || accountId === null) {
      console.error('❌ No account ID found in response:', data);
      console.log('   Response structure:', {
        hasOrganization: !!data?.organization,
        hasProfile: !!data?.profile,
        organizationAccountId: data?.organization?.accountId,
        hasAccount: data?.organization?.hasAccount,
        hasContact: data?.organization?.hasContact
      });
      throw new Error('No account associated with your user ID. Please contact support to link your account.');
    }

    console.log('✅ Account ID retrieved successfully:', accountId);
    return accountId;

  } catch (error) {
    console.error('🔴 Error fetching account ID:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to retrieve account ID. Please try again later.');
  }
}

/**
 * Fetches full user profile from the backend API
 * @param azureId - The Azure AD user ID (from MSAL)
 * @param userEmail - The user's email address (optional)
 * @returns The user profile response
 */
export async function getUserProfile(azureId: string, userEmail?: string): Promise<UserProfileResponse> {
  try {
    console.log('🔵 Fetching organization info for Azure ID:', azureId);

    const response = await fetch(`${API_BASE_URL}/auth/organization-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        azureid: azureId,
        useremail: userEmail || ''
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to fetch organization info: ${response.status} - ${errorText}`);
    }

    const data: UserProfileResponse = await response.json();
    
    if (!data.organization && !data.profile) {
      throw new Error('Invalid organization data received from server');
    }

    console.log('✅ Organization info retrieved successfully');
    return data;

  } catch (error) {
    console.error('🔴 Error fetching organization info:', error);
    throw error;
  }
}

/**
 * Cache for account IDs to avoid repeated API calls
 * Key: Azure ID, Value: Account ID
 */
const accountIdCache = new Map<string, { accountId: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Gets account ID with caching to reduce API calls
 * @param azureId - The Azure AD user ID
 * @param userEmail - The user's email address (optional)
 * @returns The cached or freshly fetched account ID
 */
export async function getCachedAccountId(azureId: string, userEmail?: string): Promise<string> {
  // Check cache first
  const cached = accountIdCache.get(azureId);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    console.log('✅ Using cached account ID');
    return cached.accountId;
  }

  // Fetch fresh account ID
  const accountId = await getAccountIdFromAzureId(azureId, userEmail);
  
  // Update cache
  accountIdCache.set(azureId, { accountId, timestamp: now });
  
  return accountId;
}

/**
 * Clears the account ID cache for a specific Azure ID or all
 * @param azureId - Optional Azure ID to clear, if not provided clears all
 */
export function clearAccountIdCache(azureId?: string): void {
  if (azureId) {
    accountIdCache.delete(azureId);
    console.log('🗑️ Cleared cache for Azure ID:', azureId);
  } else {
    accountIdCache.clear();
    console.log('🗑️ Cleared all account ID cache');
  }
}



