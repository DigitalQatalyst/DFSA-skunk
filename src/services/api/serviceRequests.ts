import { ServiceRequest } from "../../types";
import { API_BASE_URL } from "../../config/apiBase";

export interface ApiServiceRequest {
  // Original fields
  id?: string;
  _id?: string;
  serviceName?: string;
  service_name?: string;
  category?: string;
  status?: string;
  submittedDate?: string;
  submitted_date?: string;
  createdAt?: string;
  sla?: number;
  serviceProvider?: string;
  service_provider?: string;
  description?: string;
  requestedBy?: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  department?: string;
  approvers?: Array<{
    id: string;
    name: string;
    role: string;
    status: "pending" | "approved" | "rejected";
    date?: string;
    comments?: string;
  }>;

  // Dynamics CRM fields
  kf_requestformembershipformid?: string;
  kf_cancelloanformid?: string; // Cancel loan form ID
  kf_servicename?: string;
  kf_name?: string;
  kf_category?: string;
  kf_status?: string;
  kf_serviceprovider?: string;
  kf_serviceproviders?: string; // Alternative field name
  createdon?: string;
  modifiedon?: string;
  statuscode?: number;
  statecode?: number;
  _createdby_value?: string;
  _ownerid_value?: string;

  // Nested structure from API
  name?: string;
  success?: boolean;
  data?: {
    value?: ApiServiceRequest[];
  };
}

export interface ApiResponse {
  userId: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalRecords: number;
  serviceRequests: ApiServiceRequest[];
}

export async function fetchServiceRequests(
  userId: string
): Promise<ServiceRequest[]> {
  const response = await fetch(
    `${API_BASE_URL}/service-request/all-service-requests/${userId}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch service requests: ${response.status} ${response.statusText}`
    );
  }

  const responseData: ApiResponse = await response.json();

  // Extract service requests from the nested structure
  const serviceRequestsArray = responseData.serviceRequests || [];

  // Flatten all the nested data
  const allServiceRequests: ApiServiceRequest[] = [];

  serviceRequestsArray.forEach((serviceRequest) => {
    if (
      serviceRequest.data &&
      serviceRequest.data.value &&
      Array.isArray(serviceRequest.data.value) &&
      serviceRequest.data.value.length > 0
    ) {
      // Add the service name from the parent object to each item
      const itemsWithServiceName = serviceRequest.data.value.map((item) => ({
        ...item,
        parentServiceName: serviceRequest.name,
      }));
      allServiceRequests.push(...itemsWithServiceName);
    }
  });

  // If no data, return empty array
  if (allServiceRequests.length === 0) {
    return [];
  }

  // Transform API data to match ServiceRequest interface
  return allServiceRequests.map((item, index): ServiceRequest => {
    // Map status codes to readable status
    let status = "draft";
    if (item.statuscode === 1) status = "draft";
    else if (item.statuscode === 2) status = "under-review";
    else if (item.statuscode === 3) status = "approved";
    else if (item.statuscode === 4) status = "rejected";
    else if (item.status) status = item.status;

    return {
      id:
        item.kf_requestformembershipformid ||
        item.kf_cancelloanformid ||
        item.id ||
        item._id ||
        `temp-${index}`,
      serviceName:
        item.kf_servicename ||
        item.kf_name ||
        (item as any).parentServiceName ||
        "Unknown Service",
      category: item.kf_category || item.category || "General",
      status: status as any,
      submittedDate:
        item.createdon ||
        item.modifiedon ||
        item.submittedDate ||
        new Date().toISOString(),
      sla: item.sla,
      serviceProvider:
        item.kf_serviceprovider ||
        item.kf_serviceproviders ||
        item.serviceProvider,
      description: item.description,
      requestedBy: item.requestedBy || {
        id: item._createdby_value || item._ownerid_value || userId,
        name: item.kf_name || "Unknown User",
        email: (item as any).cr85d_emailaddress || "",
        department: item.department || "Unknown Department",
      },
      approvers: item.approvers,
    };
  });
}
