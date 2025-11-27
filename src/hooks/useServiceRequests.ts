import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiServiceRequestService } from "../services/apiServiceRequestService";
import { ServiceRequest } from "../types";

// Query keys
export const serviceRequestKeys = {
  all: ["serviceRequests"] as const,
  lists: () => [...serviceRequestKeys.all, "list"] as const,
  list: (accountId: string, page: number, pageSize: number) =>
    [...serviceRequestKeys.lists(), accountId, page, pageSize] as const,
  detail: (id: string, entityType: "opportunity" | "case") =>
    [...serviceRequestKeys.all, "detail", entityType, id] as const,
};

/**
 * Hook to fetch paginated service requests
 */
export function useServiceRequests(
  accountId: string | undefined,
  page: number = 1,
  pageSize: number = 10,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: serviceRequestKeys.list(accountId || "", page, pageSize),
    queryFn: async () => {
      if (!accountId) {
        throw new Error("Account ID is required");
      }
      return await apiServiceRequestService.getServiceRequestsForUser(
        accountId,
        page,
        pageSize
      );
    },
    enabled: enabled && !!accountId,
  });
}

/**
 * Hook to fetch a single service request by ID
 * (Note: Endpoint not implemented yet, returns null)
 */
export function useServiceRequestById(
  id: string | undefined,
  entityType: "opportunity" | "case" | undefined,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: serviceRequestKeys.detail(id || "", entityType || "opportunity"),
    queryFn: async () => {
      if (!id || !entityType) {
        throw new Error("ID and entity type are required");
      }
      return await apiServiceRequestService.getServiceRequestById(id, entityType);
    },
    enabled: enabled && !!id && !!entityType,
  });
}

/**
 * Hook to delete a service request (soft delete)
 */
export function useDeleteServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      entityType,
    }: {
      requestId: string;
      entityType: "opportunity" | "case";
    }) => {
      return await apiServiceRequestService.deleteServiceRequest(
        requestId,
        entityType
      );
    },
    onSuccess: () => {
      // Invalidate all service request queries to trigger refetch
      queryClient.invalidateQueries({
        queryKey: serviceRequestKeys.lists(),
      });
    },
  });
}
