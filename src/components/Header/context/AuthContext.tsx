import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { EventType, AuthenticationResult } from "@azure/msal-browser";
import {
  defaultLoginRequest,
  signupRequest,
} from "../../../services/auth/msal";
import { mapRoleValueToRole, logRoleDebug } from "../../../services/roleMapper";
import { type ProfileApiResponse } from "../../../types";
import { type Role } from "../../../config/abilities";
import { fetchOrganizationInfo } from "../../../services/organizationService";
import { type OrganizationInfoRequest, type OrganizationInfoResponse } from "../../../types/organization";
import { API_BASE_URL } from "../../../config/apiBase";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  userRole?: string | null; // Legacy field - role is now primarily extracted from API kf_accessroles
}

interface UserProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  azureId?: string;
  phone?: string;
  enterpriseName?: string;
}

interface NewUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  azureId?: string;
  phone?: string;
  enterpriseName?: string;
}

interface AuthContextType {
  crmprofile:UserProfile| null;
  user: UserProfile | null;
  userProfileData: UserProfileData | null;
  newUserData: NewUserData | null;
  userRole: Role | undefined;
  isLoading: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
  organizationInfo: OrganizationInfoResponse | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(true);
  const [crmprofile, setCrmprofile] = useState<any>(null)
  const [emailOverride, setEmailOverride] = useState<string | undefined>(
    undefined
  );
  
  const [userProfileData, setUserProfileData] =
    useState<UserProfileData | null>(null);
  const [newUserData, setNewUserData] = useState<NewUserData | null>(null);
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfoResponse | null>(null);
  const [userRole, setUserRole] = useState<Role | undefined>(undefined);
  const viteEnv = (import.meta as any).env as Record<
    string,
    string | undefined
  >;
  const enableGraphFallback =
    (viteEnv?.VITE_MSAL_ENABLE_GRAPH_FALLBACK ||
      viteEnv?.NEXT_PUBLIC_MSAL_ENABLE_GRAPH_FALLBACK) === "true";

  // Ensure active account is set for convenience
  useEffect(() => {
    const active = instance.getActiveAccount();
    if (!active && accounts.length === 1) {
      instance.setActiveAccount(accounts[0]);
    }
  }, [instance, accounts]);

  // Ensure active account is set on successful login/redirect events
  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        event.eventType === EventType.SSO_SILENT_SUCCESS
      ) {
        const payload = event.payload as AuthenticationResult | null;
        const account = payload?.account;
        if (account) {
          instance.setActiveAccount(account);
        }
      }
    });
    return () => {
      if (callbackId) instance.removeEventCallback(callbackId);
    };
  }, [instance]);

  const user: UserProfile | null = useMemo(() => {
    const account = instance.getActiveAccount() || accounts[0];
    if (!account) return null;
    const claims = account.idTokenClaims as any;
    // Log ID token claims for debugging in the browser console
    try {
      console.log("[AuthContext] idTokenClaims:", claims);
    } catch (error) {
      console.log(error);
    }
    const name = account.name || claims?.name || "";
    // Prefer real email claims over UPN/preferred_username when available
    const email =
      claims?.emails?.[0] ||
      claims?.email ||
      claims?.preferred_username ||
      account.username ||
      "";
    
    // Get Azure Object ID from claims (oid or sub)
    const azureObjectId = claims?.oid || claims?.sub;
    
    // Store azureId in localStorage immediately when available
    if (azureObjectId) {
      localStorage.setItem("azureId", azureObjectId);
      console.log("[AuthContext] Azure ID stored from claims:", azureObjectId);
    }
    
    return {
      id: azureObjectId || account.localAccountId,
      name,
      email: emailOverride || email,
      givenName: claims?.given_name,
      familyName: claims?.family_name,
      picture: undefined,
    };
  }, [accounts, instance, emailOverride]);

  // Set loading to false once authentication state is determined
  useEffect(() => {
    setIsLoading(false);
  }, [isAuthenticated, accounts]);

  // Reset fetch tracking when user logs out
  useEffect(() => {
    if (!isAuthenticated || accounts.length === 0) {
      lastFetchedAccountIdRef.current = null;
      isFetchingUserDataRef.current = false;
    }
  }, [isAuthenticated, accounts.length]);

  // Heuristic to detect synthetic/UPN-like emails we want to improve
  const looksSynthetic = useCallback((value?: string) => {
    if (!value) return true;
    const onMs = /@.*\.onmicrosoft\.com$/i.test(value);
    const guidLocal = /^[0-9a-f-]{36}@/i.test(value) || value.includes("#EXT#");
    return onMs || guidLocal;
  }, []);

  // Track if we've already fetched user data for this account to prevent infinite loops
  const lastFetchedAccountIdRef = React.useRef<string | null>(null);
  const isFetchingUserDataRef = React.useRef(false);

  // Optional: resolve better email via Microsoft Graph if configured and necessary
  useEffect(() => {
    if (!enableGraphFallback) return;
    const account = instance.getActiveAccount() || accounts[0];
    if (!account) return;
    
    // Prevent re-fetching if we're already fetching or have already fetched for this account
    const accountId = account.localAccountId;
    if (isFetchingUserDataRef.current || lastFetchedAccountIdRef.current === accountId) {
      return;
    }

    const claims = account.idTokenClaims as any;
    const current = (claims?.emails?.[0] ||
      claims?.email ||
      claims?.preferred_username ||
      account.username) as string | undefined;
    if (current && !looksSynthetic(current)) {
      // Email is already good, mark as fetched to prevent re-runs
      lastFetchedAccountIdRef.current = accountId;
      return;
    }

    // Mark as fetching
    isFetchingUserDataRef.current = true;
    lastFetchedAccountIdRef.current = accountId;

    let cancelled = false;
    (async () => {
      try {
        const result = await instance.acquireTokenSilent({
          account,
          scopes: ["User.Read"],
        });
        // console.log("Token:", result.accessToken);
        const r = await fetch(
          "https://graph.microsoft.com/v1.0/me?$select=mail,userPrincipalName,otherMails",
          {
            headers: { Authorization: `Bearer ${result.accessToken}` },
          }
        );
        if (!r.ok) return;
        const me = await r.json();
        const resolved: string | undefined =
          me.mail ||
          (me.otherMails && me.otherMails[0]) ||
          me.userPrincipalName ||
          current;
        if (!cancelled && resolved && !looksSynthetic(resolved)) {
          setEmailOverride(resolved);
        }
      } catch (e) {
        // ignore failures silently; fallback remains
      }

      // Get full user data from Microsoft Graph
      try {
        const endresult = await instance.acquireTokenSilent({
          account,
          scopes: ["User.Read"],
        });
        const res = await fetch("https://graph.microsoft.com/v1.0/me", {
          headers: { Authorization: `Bearer ${endresult.accessToken}` },
        });
        if (!res.ok) return;

        const user = await res.json();
        
        // Store Microsoft Graph user data in crmprofile
        if (!cancelled) {
          setCrmprofile(user);
          console.log("[AuthContext] Microsoft Graph user data loaded:", user);
          
          // Store azureId in localStorage for form submissions
          if (user?.id) {
            localStorage.setItem("azureId", user.id);
            console.log("[AuthContext] Azure ID stored in localStorage:", user.id);
          }
        }

        // Get user email for organization info API
        const userEmail = user?.userPrincipalName || "";

        // Fetch organization info to get user role
        const fetchUserRole = async () => {
          try {
            if (!user?.id || !userEmail) {
              console.warn(
                "[AuthContext] Missing azureId or email for organization info"
              );
              return;
            }

            const orgRequest: OrganizationInfoRequest = {
              azureid: user.id,
              useremail: userEmail,
            };

            const orgData = await fetchOrganizationInfo(orgRequest);

            console.log("orgData", orgData);

            if (orgData?.success && !cancelled) {
              setOrganizationInfo(orgData as OrganizationInfoResponse);
              const profileAccessRole = (orgData as any)?.profile?.kf_accessroles;
              const roleSource =
                profileAccessRole ??
                orgData.organization?.kf_accessroles ??
                null;

              if (roleSource !== null && roleSource !== undefined) {
                const mappedRole = mapRoleValueToRole(roleSource);
                if (mappedRole) {
                  console.log(
                    `[AuthContext] Mapped role from organization info: ${roleSource} -> ${mappedRole}`
                  );
                  logRoleDebug(
                    roleSource,
                    mappedRole,
                    "AuthContext:organization-info"
                  );
                  setUserRole(mappedRole);
                } else {
                  console.warn(
                    `[AuthContext] Could not map role value from organization info: ${roleSource}`
                  );
                  logRoleDebug(
                    roleSource,
                    undefined,
                    "AuthContext:organization-info"
                  );
                  setUserRole(undefined);
                }
              } else {
                console.warn(
                  "[AuthContext] No kf_accessroles found in organization or profile data"
                );
                logRoleDebug(
                  "missing:kf_accessroles",
                  undefined,
                  "AuthContext:organization-info"
                );
                setUserRole(undefined);
              }
            }
          } catch (error) {
            console.error(
              "[AuthContext] Error fetching organization info:",
              error
            );
            setUserRole(undefined);
          }
        };

        // Get user profile from your API (for other profile data, not roles)
        const getUserProfile = async () => {
          try {
            const body = { azureid: user?.id };
            console.log("[AuthContext] Fetching user profile with body:", body);
            const response = await fetch(
              `${API_BASE_URL}/auth/get-user-profile`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              }
            );
            const data: ProfileApiResponse = await response.json();
            console.log("[AuthContext] User profile API response:", data);
            
            // Extract the actual profile data from the response
            const profileData = data?.profile ?? null;
            console.log("[AuthContext] Extracted profile data:", profileData);
            
            if (!cancelled) {
              if (profileData) {
                setUserProfileData(profileData as any);
                console.log("[AuthContext] ✅ User profile data set successfully");
              } else {
                setUserProfileData(null);
                console.warn("[AuthContext] ⚠️ No profile data found in API response");
              }
            }
            return data;
          } catch (error) {
            console.error("[AuthContext] ❌ Error fetching user profile:", error);
            return null;
          }
        };

        // Fetch role from organization-info API
        await fetchUserRole();

        // Also fetch user profile (for other data)
        await getUserProfile();

        // Create new user object for potential signup (only stored, not automatically sent)
        const newuser = {
          firstName: user?.givenName,
          lastName: user?.surname,
          email: user?.mail,
          azureId: user?.id,
        };

        // Store the new user data in state (for use by signup forms, not automatic API calls)
        if (!cancelled) {
          setNewUserData(newuser);
        }

        // NOTE: Signup API should ONLY be called during explicit signup flow, NOT on every login
        // The signup endpoint is called by:
        // - SignupForm component when user explicitly signs up
        // - SignupPage component when user explicitly signs up
        // It should NOT be called automatically here after login
        // 
        // If user profile fetch succeeds, the user already exists in the system
        // If it fails, the user can still proceed and signup will be handled by the signup forms
      } catch (e) {
        console.log("Failed to get full user data", e);
        // Reset fetch flag on error so we can retry if needed
        if (!cancelled) {
          lastFetchedAccountIdRef.current = null;
        }
      } finally {
        // Always reset fetching flag
        if (!cancelled) {
          isFetchingUserDataRef.current = false;
        }
      }
    })();
    return () => {
      cancelled = true;
      isFetchingUserDataRef.current = false;
    };
  }, [accounts, instance, enableGraphFallback, looksSynthetic]);

  const login = useCallback(() => {
    const startPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    // Encode a return target so the redirect handler can navigate back
    const state = `ej-return=${encodeURIComponent(startPath)}`;
    instance.loginRedirect({
      ...defaultLoginRequest,
      state,
      // Kept for clarity; honored when navigateToLoginRequestUrl is true
      redirectStartPage: window.location.href,
    });
  }, [instance]);

  // For B2C with a combined SUSI policy, signup is the same as login
  const signup = useCallback(() => {
    const startPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    // Combine signup tag with return target; handler prioritizes signup
    const state = `ej-signup|ej-return=${encodeURIComponent(startPath)}`;
    instance.loginRedirect({
      ...signupRequest,
      state,
      redirectStartPage: window.location.href,
    });
  }, [instance]);

  const logout = useCallback(() => {
    const account = instance.getActiveAccount() || accounts[0];
    // Clear azureId from localStorage on logout
    localStorage.removeItem("azureId");
    console.log("[AuthContext] Azure ID cleared from localStorage");
    instance.logoutRedirect({ account: account });
  }, [instance, accounts]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      userProfileData,
      newUserData,
      userRole,
      isLoading,
      login,
      signup,
      logout,
      crmprofile,
      organizationInfo
    }),
    [user, userProfileData, newUserData, organizationInfo, userRole, isLoading, login, signup, logout, crmprofile]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
