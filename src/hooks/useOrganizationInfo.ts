import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../components/Header";
import { fetchOrganizationInfo } from "../services/organizationService";
import {
  OrganizationInfo,
  OrganizationInfoResponse,
} from "../types/organization";
import { isDemoModeEnabled } from "../utils/demoAuthUtils";

interface UseOrganizationInfoReturn {
  organization: OrganizationInfo | null;
  profile: Record<string, any> | null;
  response: OrganizationInfoResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage organization information
 *
 * Automatically fetches organization info when user is authenticated
 * Uses Azure AD claims (oid for azureid, preferred_username for email)
 *
 * @returns Organization data, loading state, error, and refetch function
 */
export function useOrganizationInfo(): UseOrganizationInfoReturn {
  const { user } = useAuth();
  const hasUserIdentity = Boolean(user?.id && user?.email);
  const azureid = user?.id ?? "";
  const useremail = user?.email ?? "";

  const {
    data,
    error,
    isLoading: queryLoading,
    isFetching,
    refetch: refetchQuery,
  } = useQuery<OrganizationInfoResponse, Error>({
    queryKey: ["organization-info", azureid],
    queryFn: async () => {
      if (!hasUserIdentity) {
        throw new Error("Missing required user information (azureid or email)");
      }

      console.log("🔍 [ORG INFO] Fetching organization info for:", {
        useremail,
        azureid,
      });

      const response = await fetchOrganizationInfo({
        useremail,
        azureid,
      });

      console.log(response, "response organization");
      return response;
    },
    enabled: hasUserIdentity && !isDemoModeEnabled(),
    staleTime: 60 * 1000, // keep fresh for 1 minute
    gcTime: 5 * 60 * 1000,
    retry: 1,

  });

  // In demo mode, return mock organization data to prevent API calls
  if (isDemoModeEnabled()) {
    return {
      organization: {
        accountId: "demo-account-id",
        name: "Demo Organization",
      } as OrganizationInfo,
      profile: {
        kf_accessroles: 123950000, // Admin role value
      },
      response: {
        success: true,
        organization: {
          accountId: "demo-account-id",
          name: "Demo Organization",
        } as OrganizationInfo,
        profile: {
          kf_accessroles: 123950000,
        },
      } as OrganizationInfoResponse,
      isLoading: false,
      error: null,
      refetch: async () => {},
    };
  }

  const organization = hasUserIdentity ? data?.organization ?? null : null;
  const profile = hasUserIdentity ? data?.profile ?? null : null;
  const response = hasUserIdentity ? data ?? null : null;
  const errorMessage = error ? error.message : null;
  // Only show loading if we're actually fetching and don't have data yet
  // Once we have data (even if incomplete), stop showing loading
  const isLoading = hasUserIdentity
    ? queryLoading || (isFetching && !data)
    : false;

  const refetch = useCallback(async () => {
    if (!hasUserIdentity) {
      return;
    }
    await refetchQuery();
  }, [hasUserIdentity, refetchQuery]);

  return {
    organization,
    profile,
    response,
    isLoading,
    error: hasUserIdentity ? errorMessage : null,
    refetch,
  };
}
