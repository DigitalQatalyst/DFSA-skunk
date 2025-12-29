/**
 * Helper to get authentication token for API calls
 */

import { msalInstance } from '../services/auth/msal';

export interface TokenInfo {
  token: string;
  azureId?: string;
  email?: string;
  claims?: any;
}

/**
 * Get access token from MSAL with user info
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const account = msalInstance.getActiveAccount();
    if (!account) {
      return null;
    }

    // Try to acquire token silently
    const response = await msalInstance.acquireTokenSilent({
      account,
      scopes: ['openid', 'profile', 'email'],
    });

    return response.accessToken || response.idToken || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Get token with user information
 */
export async function getAuthTokenWithInfo(): Promise<TokenInfo | null> {
  try {
    const account = msalInstance.getActiveAccount();
    if (!account) {
      return null;
    }

    const response = await msalInstance.acquireTokenSilent({
      account,
      scopes: ['openid', 'profile', 'email'],
    });

    const token = response.accessToken || response.idToken;
    if (!token) return null;

    // Decode token to get claims
    let claims: any = {};
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      claims = JSON.parse(jsonPayload);
    } catch (e) {
      console.warn('Could not decode token claims:', e);
    }

    return {
      token,
      azureId: account.localAccountId || account.homeAccountId || claims.oid || claims.sub,
      email: account.username || claims.email || claims.preferred_username,
      claims,
    };
  } catch (error) {
    console.error('Error getting auth token with info:', error);
    return null;
  }
}

