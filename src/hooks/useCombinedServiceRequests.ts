import { useQuery } from "@tanstack/react-query";
import { useServiceRequests } from "./useServiceRequests";
import { fsApplicationService } from "../services/fsApplicationSupabaseService";
import { ServiceRequest } from "../types";

/**
 * Combined service requests hook that fetches both regular service requests
 * and financial services applications from Supabase
 */
export function useCombinedServiceRequests(
  accountId: string | undefined,
  page: number = 1,
  pageSize: number = 10,
  enabled: boolean = true
) {
  // Fetch regular service requests
  const {
    data: regularRequests,
    isLoading: regularLoading,
    error: regularError,
  } = useServiceRequests(accountId, page, pageSize, enabled);

  // Fetch financial services applications from Supabase
  const {
    data: fsApplications,
    isLoading: fsLoading,
    error: fsError,
  } = useQuery({
    queryKey: ["fsApplications", "user"],
    queryFn: async () => {
      return await fsApplicationService.getUserApplications();
    },
    enabled: enabled,
  });

  // Transform FS applications to ServiceRequest format
  const transformedFSApplications: ServiceRequest[] = (fsApplications || []).map((app: any): ServiceRequest => ({
    id: app.id,
    serviceName: `Financial Services Application - ${app.firm_name || 'Draft Application'}`,
    category: "Financial Services Authorization",
    status: mapFSStatusToServiceRequestStatus(app.status),
    submittedDate: app.created_at,
    lastUpdated: app.updated_at,
    description: `Application Reference: ${app.application_ref || 'Pending'} - Progress: ${app.progress_percent || 0}%`,
    entityType: "case" as const,
    requestedBy: {
      id: "current-user",
      name: "Current User",
      email: "",
      company: app.firm_name || "Unknown",
      fullname: "Current User",
      hasAccount: false,
      hasContact: false,
      hasOnboarding: false,
      fetchedAt: new Date().toISOString(),
    },
  }));

  // Combine and sort all requests by submission date (most recent first)
  const allRequests = [
    ...(regularRequests?.serviceRequests || []),
    ...transformedFSApplications,
  ].sort((a, b) => {
    const aDate = new Date(a.submittedDate).getTime();
    const bDate = new Date(b.submittedDate).getTime();
    return bDate - aDate;
  });

  // Apply pagination to combined results
  const startIndex = (page - 1) * pageSize;
  const paginatedRequests = allRequests.slice(startIndex, startIndex + pageSize);

  return {
    data: {
      serviceRequests: paginatedRequests,
      totalCount: allRequests.length,
      totalPages: Math.ceil(allRequests.length / pageSize),
      currentPage: page,
    },
    isLoading: regularLoading || fsLoading,
    error: regularError || fsError,
  };
}

/**
 * Map FS application status to ServiceRequest status
 */
function mapFSStatusToServiceRequestStatus(fsStatus: string): ServiceRequest["status"] {
  switch (fsStatus) {
    case "draft":
      return "in-progress";
    case "submitted":
      return "submitted";
    case "under_review":
      return "in-progress";
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    default:
      return "in-progress";
  }
}
