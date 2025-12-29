/**
 * Demo Authentication Utilities
 *
 * Provides utilities for bypassing authentication in demo mode.
 * This is intended for temporary demo purposes only.
 */

export const DEMO_ORG_ID = '11111111-1111-1111-1111-111111111111';
export const DEMO_USER_ID = '22222222-2222-2222-2222-222222222222';

let demoWarningLogged = false;

/**
 * Check if demo authentication bypass is enabled (dev-only).
 */
export function isDemoModeEnabled(): boolean {
  if (import.meta.env.PROD) {
    return false;
  }
  const isEnabled = import.meta.env.VITE_DEMO_AUTH_BYPASS === 'true';
  if (isEnabled && !demoWarningLogged) {
    console.warn('DEMO AUTH BYPASS ENABLED');
    demoWarningLogged = true;
  }
  return isEnabled;
}

/**
 * Get a mock demo user object with all required fields
 * for ProtectedRoute, UnifiedAuthProvider, and AbilityContext
 */
export function getDemoUser() {
  return {
    // Core user fields
    id: DEMO_USER_ID,
    email: "demo@dfsa-demo.local",
    name: "Demo User",
    username: "demo-user",
    givenName: "Demo",
    familyName: "User",

    // Role and permissions
    role: "admin",
    userRole: "admin",

    // Profile fields
    avatar_url: null,
    external_id: "demo-external-id",
    email_verified: true,
    picture: undefined,

    // MSAL compatibility fields
    idTokenClaims: {
      oid: DEMO_USER_ID,
      given_name: "Demo",
      family_name: "User",
      email: "demo@dfsa-demo.local",
      emails: ["demo@dfsa-demo.local"],
    }
  };
}
