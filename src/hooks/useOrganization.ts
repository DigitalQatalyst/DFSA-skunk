// useOrganization Hook
// React hook for accessing organization information

import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import {
  organizationService,
  OrganizationInfo,
} from "../services/organizationService";
import { extractUserInfoFromClaims, validateClaims } from "../utils/authUtils";

export interface UseOrganizationResult {
  organization: OrganizationInfo | null;
  accountId: string | null;
  contactId: string | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage organization information
 */
export function useOrganization(): UseOrganizationResult {
  const { instance, accounts } = useMsal();
  const [organization, setOrganization] = useState<OrganizationInfo | null>(
    null
  );
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganization = async (retryCount = 0) => {
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1000; // 1 second

    try {
      setIsLoading(true);
      setError(null);

      // Get the active account and extract claims
      const account = instance.getActiveAccount() || accounts[0];
      if (!account) {
        throw new Error("No active account found");
      }

      const claims = account.idTokenClaims;
      if (!validateClaims(claims)) {
        throw new Error("Invalid or missing claims in token");
      }

      // Extract user info from claims
      const userInfo = extractUserInfoFromClaims(claims);

      // Always get account ID (with fallback if API fails)
      const fetchedAccountId = await organizationService.getAccountId(
        userInfo.azureId,
        userInfo.email
      );
      setAccountId(fetchedAccountId);

      // Try to fetch full organization info (optional)
      try {
        const orgInfo = await organizationService.getOrganizationInfo(
          userInfo.azureId,
          userInfo.email
        );
        setOrganization(orgInfo);
      } catch (orgError) {
        // Organization fetch failed, but we already have account ID from fallback
        console.warn(
          "Could not fetch full organization info, using fallback account ID"
        );
      }
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to fetch organization info");

      // Retry logic for 404 errors on first login
      if (retryCount < MAX_RETRIES && error.message.includes("404")) {
        console.log(
          `Retrying organization fetch (attempt ${
            retryCount + 1
          }/${MAX_RETRIES})...`
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return fetchOrganization(retryCount + 1);
      }

      setError(error);
      console.error("Error fetching organization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check cache first
    const cached = organizationService.getCachedOrganization();
    if (cached) {
      setOrganization(cached);
      setAccountId(cached.accountId || null);
      setIsLoading(false);
      return;
    }

    // Fetch if not cached
    fetchOrganization();
  }, [instance, accounts]);

  return {
    organization,
    accountId,
    contactId: organization?.contactId || null,
    isLoading,
    error,
    refetch: fetchOrganization,
  };
}
