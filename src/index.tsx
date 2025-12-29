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
  }
}

const container = document.getElementById("root");
if (container) {
  if (!window.__MZN_APP_ROOT__) {
    window.__MZN_APP_ROOT__ = createRoot(container);
  }
  const root = window.__MZN_APP_ROOT__;
  // Ensure MSAL is initialized and redirect response handled before rendering app
  // Note: All auth/onboarding checks and routing are now handled by ProtectedRoute
  // via useUnifiedAuthFlow hook, so we don't need to do manual redirects here
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
      root.render(
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={client}>
            <MsalProvider instance={msalInstance}>
              <AuthProvider>
                <AppRouter />
                {/* {process.env.NODE_ENV === 'development' && (
                  <ReactQueryDevtools initialIsOpen={false} />
                )} */}
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
