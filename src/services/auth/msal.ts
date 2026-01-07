import {
  PublicClientApplication,
  Configuration,
  BrowserCacheLocation,
  LogLevel,
} from "@azure/msal-browser";

// Support both NEXT_PUBLIC_* and VITE_* envs for flexibility
const env = (import.meta as any).env as Record<string, string | undefined>;

// ─────────────────────────────────────────────────────────────────────────────
// Required Configuration
// ─────────────────────────────────────────────────────────────────────────────
const CLIENT_ID =
  env.NEXT_PUBLIC_AAD_CLIENT_ID ||
  env.VITE_AZURE_CLIENT_ID ||
  "f996140d-d79b-419d-a64c-f211d23a38ad"; // fallback for dev

const REDIRECT_URI =
  env.NEXT_PUBLIC_REDIRECT_URI ||
  env.VITE_AZURE_REDIRECT_URI ||
  window.location.origin;

const POST_LOGOUT_REDIRECT_URI =
  env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI ||
  env.VITE_AZURE_POST_LOGOUT_REDIRECT_URI ||
  REDIRECT_URI;

// ─────────────────────────────────────────────────────────────────────────────
// Scopes Configuration
// ─────────────────────────────────────────────────────────────────────────────
// Always request standard OIDC scopes
const DEFAULT_OIDC_SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
] as const;

// Parse additional API scopes from env
const API_SCOPES = (env.NEXT_PUBLIC_API_SCOPES || env.VITE_AZURE_SCOPES || "")
  .split(/[\s,]+/)
  .map((s) => s.trim())
  .filter(Boolean);

// Optionally include Graph User.Read for email resolution fallback
const ENABLE_GRAPH_USER_READ =
  (env.VITE_MSAL_ENABLE_GRAPH_FALLBACK ||
    env.NEXT_PUBLIC_MSAL_ENABLE_GRAPH_FALLBACK) === "true";
const GRAPH_SCOPES: string[] = ENABLE_GRAPH_USER_READ ? ["User.Read"] : [];

// ─────────────────────────────────────────────────────────────────────────────
// Identity Host Configuration (CIAM / B2C / AAD)
// ─────────────────────────────────────────────────────────────────────────────
// Priority:
// 1. Explicit host override (IDENTITY_HOST)
// 2. CIAM subdomain -> <sub>.ciamlogin.com
// 3. B2C tenant name -> <tenant>.b2clogin.com
// 4. Fallback to hardcoded CIAM host

const CIAM_SUBDOMAIN =
  env.NEXT_PUBLIC_CIAM_SUBDOMAIN || env.VITE_AZURE_SUBDOMAIN;
const IDENTITY_HOST_OVERRIDE =
  env.NEXT_PUBLIC_IDENTITY_HOST || env.VITE_IDENTITY_HOST;
const B2C_TENANT_NAME =
  env.NEXT_PUBLIC_B2C_TENANT_NAME || env.VITE_B2C_TENANT_NAME;

// B2C Policies
const POLICY_SIGNUP_SIGNIN =
  env.NEXT_PUBLIC_B2C_POLICY_SIGNUP_SIGNIN || env.VITE_B2C_POLICY_SIGNUP_SIGNIN;
const POLICY_SIGNUP =
  env.NEXT_PUBLIC_B2C_POLICY_SIGNUP || env.VITE_B2C_POLICY_SIGNUP;

// Compute login host based on configuration priority
let LOGIN_HOST: string;
let TENANT_NAME: string;

if (IDENTITY_HOST_OVERRIDE) {
  // Explicit host override takes precedence
  LOGIN_HOST = IDENTITY_HOST_OVERRIDE;
  TENANT_NAME = CIAM_SUBDOMAIN || B2C_TENANT_NAME || "dqproj";
} else if (CIAM_SUBDOMAIN) {
  // CIAM (Entra External Identities)
  LOGIN_HOST = `${CIAM_SUBDOMAIN}.ciamlogin.com`;
  TENANT_NAME = CIAM_SUBDOMAIN;
} else if (B2C_TENANT_NAME) {
  // Azure AD B2C
  LOGIN_HOST = `${B2C_TENANT_NAME}.b2clogin.com`;
  TENANT_NAME = B2C_TENANT_NAME;
} else {
  // Fallback to hardcoded CIAM host for backward compatibility
  LOGIN_HOST = "dqproj.ciamlogin.com";
  TENANT_NAME = "dqproj";
}

// ─────────────────────────────────────────────────────────────────────────────
// Authority URLs
// ─────────────────────────────────────────────────────────────────────────────
// For CIAM: https://<sub>.ciamlogin.com/<tenant>.onmicrosoft.com/
// For B2C with policy: https://<tenant>.b2clogin.com/<tenant>.onmicrosoft.com/<policy>
// For AAD: https://login.microsoftonline.com/<tenantId>/ (adapt manually if needed)

const buildAuthority = (policy?: string): string => {
  const base = `https://${LOGIN_HOST}/${TENANT_NAME}.onmicrosoft.com`;
  return policy ? `${base}/${policy}` : `${base}/`;
};

const AUTHORITY_SIGNUP_SIGNIN = POLICY_SIGNUP_SIGNIN
  ? buildAuthority(POLICY_SIGNUP_SIGNIN)
  : buildAuthority();

const AUTHORITY_SIGNUP = POLICY_SIGNUP
  ? buildAuthority(POLICY_SIGNUP)
  : AUTHORITY_SIGNUP_SIGNIN;

// ─────────────────────────────────────────────────────────────────────────────
// MSAL Configuration
// ─────────────────────────────────────────────────────────────────────────────
export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: AUTHORITY_SIGNUP_SIGNIN,
    knownAuthorities: [LOGIN_HOST],
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
    // Stay on the redirectUri after login instead of bouncing back
    // to the page where login was initiated. This simplifies post-login routing.
    navigateToLoginRequestUrl: false,
  },
  cache: {
    // LocalStorage provides predictable session caching in SPAs
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message) => {
        if (level >= LogLevel.Error) console.error("[MSAL]", message);
      },
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

// ─────────────────────────────────────────────────────────────────────────────
// Login/Signup Requests
// ─────────────────────────────────────────────────────────────────────────────
const allScopes = Array.from(
  new Set([...DEFAULT_OIDC_SCOPES, ...API_SCOPES, ...GRAPH_SCOPES])
);

export const defaultLoginRequest = {
  scopes: allScopes,
  authority: AUTHORITY_SIGNUP_SIGNIN,
};

export const signupRequest = {
  scopes: allScopes,
  authority: AUTHORITY_SIGNUP,
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports for debugging/configuration inspection
// ─────────────────────────────────────────────────────────────────────────────
export const msalDebugConfig = {
  clientId: CLIENT_ID,
  loginHost: LOGIN_HOST,
  tenantName: TENANT_NAME,
  authoritySignupSignin: AUTHORITY_SIGNUP_SIGNIN,
  authoritySignup: AUTHORITY_SIGNUP,
  redirectUri: REDIRECT_URI,
  postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
  enableGraphFallback: ENABLE_GRAPH_USER_READ,
  scopes: allScopes,
};
