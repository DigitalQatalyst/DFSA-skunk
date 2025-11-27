import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService, OrganizationUser } from "../services/userService";
import { useOrganizationInfo } from "./useOrganizationInfo";

// Query keys
export const organizationUsersKeys = {
  all: ["organization-users"] as const,
  byOrg: (accountId: string) => [...organizationUsersKeys.all, accountId] as const,
};

interface UseOrganizationUsersReturn {
  users: OrganizationUser[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch users belonging to the current organization
 *
 * Uses the organization's accountId from useOrganizationInfo
 * and fetches all users associated with that organization
 */
export function useOrganizationUsers(): UseOrganizationUsersReturn {
  const { organization, isLoading: orgLoading } = useOrganizationInfo();
  const queryClient = useQueryClient();
  const accountId = organization?.accountId;

  const {
    data: users = [],
    error,
    isLoading: queryLoading,
    refetch: refetchQuery,
  } = useQuery<OrganizationUser[], Error>({
    queryKey: organizationUsersKeys.byOrg(accountId || ""),
    queryFn: async () => {
      if (!accountId) {
        throw new Error("No account ID available");
      }

      console.log("🔍 [useOrganizationUsers] Fetching users for:", accountId);
      return await userService.getUsersByOrganization(accountId);
    },
    enabled: !!accountId && !orgLoading,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  const refetch = () => {
    refetchQuery();
  };

  // Show loading if organization is loading OR query is loading
  const isLoading = orgLoading || (queryLoading && !!accountId);

  return {
    users,
    isLoading,
    error: error || null,
    refetch,
  };
}

/**
 * Hook to manually invalidate the organization users cache
 * Useful after inviting a new user or updating user information
 */
export function useInvalidateOrganizationUsers() {
  const queryClient = useQueryClient();
  const { organization } = useOrganizationInfo();

  return () => {
    if (organization?.accountId) {
      queryClient.invalidateQueries({
        queryKey: organizationUsersKeys.byOrg(organization.accountId),
      });
    }
  };
}
