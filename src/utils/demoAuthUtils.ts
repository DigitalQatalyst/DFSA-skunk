/**
 * Demo Authentication Utilities
 *
 * Provides utilities for bypassing authentication in demo mode.
 * This is intended for temporary demo purposes only.
 */

/**
 * Check if demo authentication bypass is enabled
 */
export function isDemoModeEnabled(): boolean {
  const isEnabled = import.meta.env.VITE_DEMO_AUTH_BYPASS === 'true';
  console.log('[DEMO MODE] Environment variable:', import.meta.env.VITE_DEMO_AUTH_BYPASS);
  console.log('[DEMO MODE] Demo mode enabled:', isEnabled);
  return isEnabled;
}

/**
 * Get a mock demo user object with all required fields
 * for ProtectedRoute, UnifiedAuthProvider, and AbilityContext
 */
export function getDemoUser() {
  return {
    // Core user fields
    id: "demo-user-123",
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
      oid: "demo-user-123",
      given_name: "Demo",
      family_name: "User",
      email: "demo@dfsa-demo.local",
      emails: ["demo@dfsa-demo.local"],
    }
  };
}
