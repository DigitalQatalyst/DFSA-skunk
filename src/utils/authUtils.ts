// Authentication Utilities
// Helper functions to extract user information from Azure AD claims

export interface AzureAdClaims {
  oid?: string; // Object ID (User ID)
  sub?: string; // Subject
  preferred_username?: string; // Email
  email?: string; // Alternative email field
  name?: string; // Display name
  upn?: string; // User Principal Name
  [key: string]: any;
}

export interface UserInfo {
  azureId: string;
  email: string;
  name?: string;
}

/**
 * Gets the user ID of the currently logged-in user
 * Priority: localStorage > sessionStorage
 * Returns undefined if no user ID is found
 */
export const getCurrentUserId = (): string | undefined => {
  const localStorageId =
    localStorage.getItem("userId") || localStorage.getItem("userContactId");
  if (localStorageId && localStorageId.trim()) return localStorageId.trim();

  const sessionStorageId =
    sessionStorage.getItem("userId") || sessionStorage.getItem("userContactId");
  if (sessionStorageId && sessionStorageId.trim())
    return sessionStorageId.trim();

  return undefined;
};

/**
 * Gets the Azure ID of the currently logged-in user
 * Priority: localStorage > sessionStorage
 * Returns undefined if no Azure ID is found
 */
export const getCurrentUserAzureId = (): string | undefined => {
  const localStorageId = localStorage.getItem("azureId");
  if (localStorageId && localStorageId.trim()) return localStorageId.trim();

  const sessionStorageId = sessionStorage.getItem("azureId");
  if (sessionStorageId && sessionStorageId.trim())
    return sessionStorageId.trim();

  return undefined;
};

/**
 * Extract user information from Azure AD claims
 * Validates presence of required identifiers (oid/sub) and email fields.
 */
export function extractUserInfoFromClaims(claims: AzureAdClaims): UserInfo {
  const azureId = claims.oid || claims.sub;
  if (!azureId) {
    throw new Error("Azure ID (oid or sub) not found in claims");
  }

  const email = claims.preferred_username || claims.email || claims.upn;
  if (!email) {
    throw new Error("Email not found in claims");
  }

  return {
    azureId,
    email,
    name: claims.name,
  };
}

/**
 * Validate that required claims are present
 */
export function validateClaims(claims: any): claims is AzureAdClaims {
  if (!claims || typeof claims !== "object") return false;

  if (!claims.oid && !claims.sub) return false;

  if (!claims.preferred_username && !claims.email && !claims.upn) {
    return false;
  }

  return true;
}
