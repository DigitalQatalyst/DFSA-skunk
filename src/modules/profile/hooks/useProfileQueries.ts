import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    saveVisionStrategySection,
    saveProductsSection, saveSalesSection, saveCustomerExperienceSection, saveSupplyAndLogisticsSection,
    saveServiceRequestsSection, savePeopleAndGovernanceSection,
} from "../../../components/BusinessProfile/services/ProfileApiService";

// Query keys for profile data
export const profileKeys = {
  all: ["profile"] as const,
  business: (accountId: string) => ["profile", "business", accountId] as const,
};

// Hook to fetch business profile data
// Note: The actual fetching is handled by DashboardLayout, so this is a placeholder
// for future direct queries if needed
export function useBusinessProfileQuery(
  accountId: string | undefined,
  initialData?: any
) {
  return useQuery({
    queryKey: accountId
      ? profileKeys.business(accountId)
      : ["profile", "business", "unknown"],
    queryFn: async () => {
      // This would be the actual fetch function if we were fetching directly
      // For now, we rely on the data being set by DashboardLayout
      return initialData;
    },
    enabled: !!accountId && !!initialData,
    initialData,
  });
}

// Mutation hook for saving Vision & Strategy section
export function useSaveVisionStrategyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      accountId,
      sectionData,
    }: {
      accountId: string;
      sectionData: any;
    }) => {
      return await saveVisionStrategySection(accountId, sectionData);
    },
    onSuccess: (data, variables) => {
      // Invalidate the profile query to refetch the data
      queryClient.invalidateQueries({
        queryKey: profileKeys.business(variables.accountId),
      });
    },
  });
}

// Mutation hook for saving Products section
export function useSaveProductsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      accountId,
      sectionData,
    }: {
      accountId: string;
      sectionData: any;
    }) => {
      return await saveProductsSection(accountId, sectionData);
    },
    onSuccess: (data, variables) => {
      // Invalidate the profile query to refetch the data
      queryClient.invalidateQueries({
        queryKey: profileKeys.business(variables.accountId),
      });
    },
  });
}


// Mutation hook for saving Sales section
export function useSaveSalesMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               accountId,
                               sectionData,
                           }: {
            accountId: string;
            sectionData: any;
        }) => {
            return await saveSalesSection(accountId, sectionData);
        },
        onSuccess: (data, variables) => {
            // Invalidate the profile query to refetch the data
            queryClient.invalidateQueries({
                queryKey: profileKeys.business(variables.accountId),
            });
        },
    });
}


// Mutation hook for saving Supply and Logistics section
export function useSaveSupplyAndLogisticsMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               accountId,
                               sectionData,
                           }: {
            accountId: string;
            sectionData: any;
        }) => {
            return await saveSupplyAndLogisticsSection(accountId, sectionData);
        },
        onSuccess: (data, variables) => {
            // Invalidate the profile query to refetch the data
            queryClient.invalidateQueries({
                queryKey: profileKeys.business(variables.accountId),
            });
        },
    });
}

// Mutation hook for saving Customer Experience section
export function useSaveCustomerExperienceMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               accountId,
                               sectionData,
                           }: {
            accountId: string;
            sectionData: any;
        }) => {
            return await saveCustomerExperienceSection(accountId, sectionData);
        },
        onSuccess: (data, variables) => {
            // Invalidate the profile query to refetch the data
            queryClient.invalidateQueries({
                queryKey: profileKeys.business(variables.accountId),
            });
        },
    });
}

// Mutation hook for saving Service Requests section
export function useSaveServiceRequestsMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               accountId,
                               sectionData,
                           }: {
            accountId: string;
            sectionData: any;
        }) => {
            return await saveServiceRequestsSection(accountId, sectionData);
        },
        onSuccess: (data, variables) => {
            // Invalidate the profile query to refetch the data
            queryClient.invalidateQueries({
                queryKey: profileKeys.business(variables.accountId),
            });
        },
    });
}


// Mutation hook for saving People & Governance section
export function useSavePeopleAndGovernanceMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               accountId,
                               sectionData,
                           }: {
            accountId: string;
            sectionData: any;
        }) => {
            return await savePeopleAndGovernanceSection(accountId, sectionData);
        },
        onSuccess: (data, variables) => {
            // Invalidate the profile query to refetch the data
            queryClient.invalidateQueries({
                queryKey: profileKeys.business(variables.accountId),
            });
        },
    });
}