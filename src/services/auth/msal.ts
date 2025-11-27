import {
  PublicClientApplication,
  Configuration,
  BrowserCacheLocation,
  LogLevel,
} from "@azure/msal-browser";

// Support both NEXT_PUBLIC_* and VITE_* envs
const env = (import.meta as any).env as Record<string, string | undefined>;

const CLIENT_ID = "f996140d-d79b-419d-a64c-f211d23a38ad";
const REDIRECT_URI =  window.location.origin;
const POST_LOGOUT_REDIRECT_URI = REDIRECT_URI;
// const API_SCOPES = (env.NEXT_PUBLIC_API_SCOPES || env.VITE_AZURE_SCOPES || "")
//   .split(/[\s,]+/)
//   .map((s) => s.trim())
//   .filter(Boolean);

// Always request standard OIDC scopes; include email to avoid UPN-only claims and offline_access for refresh tokens
const DEFAULT_OIDC_SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
] as const;

// Vite exposes only VITE_* via import.meta.env (not process.env)
const TENANT_NAME = "dqproj";
// const POLICY_SIGNUP_SIGNIN = "F1_CustomerSUSILocal_KF";
// Optional dedicated Sign-Up policy/user flow
const POLICY_SIGNUP =
  env.NEXT_PUBLIC_B2C_POLICY_SIGNUP || env.VITE_B2C_POLICY_SIGNUP;

// Select correct login host. Prefer explicit host; default to B2C (b2clogin.com).
// If you are using Entra External Identities (CIAM), set NEXT_PUBLIC_IDENTITY_HOST or VITE_IDENTITY_HOST
// to e.g. "yourtenant.ciamlogin.com".

const SUB = env.NEXT_PUBLIC_CIAM_SUBDOMAIN || env.VITE_AZURE_SUBDOMAIN;

const LOGIN_HOST = `dqproj.ciamlogin.com`;
const AUTHORITY_SIGNUP_SIGNIN = `https://${LOGIN_HOST}/${TENANT_NAME}.onmicrosoft.com/`;
const AUTHORITY_SIGNUP = POLICY_SIGNUP ? `https://${LOGIN_HOST}/${TENANT_NAME}.onmicrosoft.com/${POLICY_SIGNUP}` : AUTHORITY_SIGNUP_SIGNIN;

let computedAuthority: string;
computedAuthority = `https://${SUB}.ciamlogin.com/`;



export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: AUTHORITY_SIGNUP_SIGNIN,
    knownAuthorities: [LOGIN_HOST],
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
    // Stay on the redirectUri after login instead of bouncing back
    // to the page where login was initiated.
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message) => {
        if (level >= LogLevel.Error) console.error(message);
      },
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Optionally include Graph User.Read for email resolution fallback (see AuthContext)
const ENABLE_GRAPH_USER_READ =
  (env.VITE_MSAL_ENABLE_GRAPH_FALLBACK ||
    env.NEXT_PUBLIC_MSAL_ENABLE_GRAPH_FALLBACK) === "true";
const GRAPH_SCOPES: string[] = ENABLE_GRAPH_USER_READ ? ["User.Read"] : [];

export const defaultLoginRequest = {
  scopes: Array.from(new Set([...DEFAULT_OIDC_SCOPES, ...GRAPH_SCOPES])),
  authority: AUTHORITY_SIGNUP_SIGNIN,
};

export const signupRequest = {
  scopes: Array.from(new Set([...DEFAULT_OIDC_SCOPES, ...GRAPH_SCOPES])),
  authority: AUTHORITY_SIGNUP,
};
