import "./index.css";
import React from "react";
import { AppRouter } from "./AppRouter";
import { createRoot, type Root } from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./services/auth/msal";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./components/Header";
import { queryClient } from "./lib/react-query";
import type { AuthenticationResult } from "@azure/msal-browser";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://90va0q4bccgp.share.zrok.io/services-api",
    // Avoid ngrok browser warning interstitials from breaking preflight
    headers: { skip_zrok_interstitial: "1" },
    // Ensure CORS mode
    fetchOptions: { mode: "cors" },
  }),
  cache: new InMemoryCache(),
});

declare global {
  interface Window {
    __MZN_APP_ROOT__?: Root;
    /** Flag set when user came from explicit signup flow */
    __EJ_IS_SIGNUP__?: boolean;
    /** Return path from login state */
    __EJ_RETURN_PATH__?: string;
  }
}

/**
 * Parse MSAL redirect state to extract signup flag and return path.
 * State format: "ej-signup|ej-return=/some/path" or "ej-return=/some/path"
 */
function parseAuthState(state?: string): {
  isSignup: boolean;
  returnPath?: string;
} {
  if (!state) return { isSignup: false };

  const isSignup = state.includes("ej-signup");
  const returnMatch = state.match(/ej-return=([^|]+)/);
  const returnPath = returnMatch ? decodeURIComponent(returnMatch[1]) : undefined;

  return { isSignup, returnPath };
}

/**
 * Check if user is new based on ID token claims.
 * B2C/CIAM may include newUser claim on first authentication.
 */
function isNewUserFromClaims(result: AuthenticationResult | null): boolean {
  if (!result?.idTokenClaims) return false;
  const claims = result.idTokenClaims as Record<string, unknown>;
  return claims.newUser === true || claims.newUser === "true";
}

const container = document.getElementById("root");
if (container) {
  if (!window.__MZN_APP_ROOT__) {
    window.__MZN_APP_ROOT__ = createRoot(container);
  }
  const root = window.__MZN_APP_ROOT__;

  // Ensure MSAL is initialized and redirect response handled before rendering app
  msalInstance
    .initialize()
    .then(() => msalInstance.handleRedirectPromise())
    .then((result) => {
      // Set active account if we have one from redirect
      if (result?.account) {
        msalInstance.setActiveAccount(result.account);
      } else {
        // Otherwise set it if there's only one account
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length === 1) {
          msalInstance.setActiveAccount(accounts[0]);
        }
      }

      // Parse state from redirect to detect signup flow and return path
      const { isSignup, returnPath } = parseAuthState(result?.state);
      const isNewUser = isNewUserFromClaims(result);

      // Store flags for downstream routing (AuthContext/ProtectedRoute can use these)
      if (isSignup || isNewUser) {
        window.__EJ_IS_SIGNUP__ = true;
        console.log("[MSAL] Signup flow detected - will route to onboarding");
      }
      if (returnPath) {
        window.__EJ_RETURN_PATH__ = returnPath;
      }

      // Route to onboarding for new signups (if not already on onboarding path)
      if ((isSignup || isNewUser) && result?.account) {
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/onboarding")) {
          // Let the app render first, then navigate via router
          // The ProtectedRoute/useUnifiedAuthFlow will handle the actual redirect
          console.log("[MSAL] New user detected, onboarding routing will be handled by ProtectedRoute");
        }
      }

      root.render(
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={client}>
            <MsalProvider instance={msalInstance}>
              <AuthProvider>
                <AppRouter />
              </AuthProvider>
            </MsalProvider>
          </ApolloProvider>
        </QueryClientProvider>
      );
    })
    .catch((e) => {
      console.error("MSAL initialization failed:", e);
      // Still render app even if MSAL init fails, so user can see error
      root?.render(
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={client}>
            <MsalProvider instance={msalInstance}>
              <AuthProvider>
                <AppRouter />
              </AuthProvider>
            </MsalProvider>
          </ApolloProvider>
        </QueryClientProvider>
      );
    });
}
