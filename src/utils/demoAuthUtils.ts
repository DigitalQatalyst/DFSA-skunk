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
 * Check if demo authentication bypass is enabled.
 * In production, require an explicit allow flag.
 */
export function isDemoModeEnabled(): boolean {
  const isBypassRequested = import.meta.env.VITE_DEMO_AUTH_BYPASS === 'true';
  const allowProdBypass = import.meta.env.VITE_DEMO_AUTH_ALLOW_PROD === 'true';

  if (import.meta.env.PROD && !allowProdBypass) {
    return false;
  }

  if (isBypassRequested && !demoWarningLogged) {
    const mode = import.meta.env.PROD ? 'PROD' : 'DEV';
    console.warn(`DEMO AUTH BYPASS ENABLED (${mode})`);
    demoWarningLogged = true;
  }

  return isBypassRequested;
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
