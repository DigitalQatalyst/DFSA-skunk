import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../components/Header/context/AuthContext";
import { useServiceRequests, serviceRequestKeys } from "../../../hooks/useServiceRequests";
import { useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "../../../hooks/useOrganization";
import { ServiceRequest } from "../../../types";
import { Can } from "../../../components/RBAC";

interface ServiceRequestsTableProps {
  isLoading: boolean;
  maxItems?: number; // how many latest requests to show
  requests?: ServiceRequest[]; // Accept requests from API (optional for now)
  error?: string | null;
  onViewAll?: () => void;
}

const DEFAULT_MAX = 3;

export const ServiceRequestsTable: React.FC<ServiceRequestsTableProps> = ({
  isLoading: _isLoading,
  maxItems = DEFAULT_MAX,
  requests: propRequests,
  error: propError,
  // onViewAll reserved for future use when "View All" button is added
}) => {
  const { organizationInfo } = useAuth(); // still used for role-based access if needed
  const { accountId, isLoading: orgLoading, error: orgError } = useOrganization();
  const navigate = useNavigate();
  
  const queryClient = useQueryClient();
  const effectiveAccountId = accountId || organizationInfo?.organization?.accountId;
  
  // Debug logging
  React.useEffect(() => {
    console.log('[ServiceRequestsTable] Debug Info:', {
      accountId,
      organizationInfo: organizationInfo?.organization,
      hasOrgInfo: !!organizationInfo,
      hasAccount: !!organizationInfo?.organization,
      hasAccountId: !!accountId,
      fullOrgData: organizationInfo,
    });
  }, [accountId, organizationInfo]);
  
  // Fetch service requests using React Query hook (only when we have an effective account id)
  const { data, isLoading: queryLoading, error: queryError } = useServiceRequests(
    effectiveAccountId,
    1, // page 1
    maxItems, // fetch only the number we need
    !!effectiveAccountId // only fetch if accountId exists
  );

  // Debug logging for query results
  React.useEffect(() => {
    console.log('[ServiceRequestsTable] Query Results:', {
      isLoading: queryLoading,
      hasData: !!data,
      requestsCount: data?.serviceRequests?.length || 0,
      error: queryError,
      errorMessage: queryError ? String(queryError) : null,
      fullData: data,
      effectiveAccountId,
    });
  }, [data, queryLoading, queryError, effectiveAccountId]);

  // Use prop requests if provided, otherwise use fetched data
  // Sort requests by submittedDate desc for consistency (even if API already sorted)
  const rawRequests = propRequests || data?.serviceRequests || [];
  const displayRequests = rawRequests.slice().sort((a, b) => {
    const aDate = new Date(a.submittedDate || '').getTime();
    const bDate = new Date(b.submittedDate || '').getTime();
    return bDate - aDate;
  });
  const displayError = propError || (queryError instanceof Error ? queryError.message : queryError ? String(queryError) : null);
  const isLoading = queryLoading;
  
  // Show loading state while organization info is being fetched
  const isWaitingForAccountId = !effectiveAccountId && !propRequests;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "approved":
            case "Approved":
                return "text-green-700";
            case "in-progress":
            case "In Progress":
            case "under-review":
                return "text-blue-700";
            case "pending-review":
            case "Pending Review":
                return "text-amber-700";
            case "on-hold":
            case "On Hold":
                return "text-gray-700";
            case "completed":
            case "Completed":
                return "text-purple-700";
            default:
                return "text-gray-700";
        }
    };

    const formatStatusLabel = (status: string) => {
        // Convert kebab-case or camelCase to Title Case
        return status
            .split(/[-_]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

  // No useEffect needed - React Query handles data fetching

  if (isLoading || isWaitingForAccountId || orgLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-16 bg-gray-200 rounded w-full mb-2"
          ></div>
        ))}
        {isWaitingForAccountId && (
          <p className="mt-4 text-xs text-gray-500 text-center">Resolving account information...</p>
        )}
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="text-sm text-red-600 p-4 bg-red-50 rounded-lg">
        <div className="flex items-center">
          <span className="mr-2">⚠️</span>
          <span>Failed to load requests: {displayError}</span>
        </div>
      </div>
    );
  }

  if (!displayRequests || displayRequests.length === 0) {
    console.log('[ServiceRequestsTable] Empty state - Debug:', {
      displayRequestsExists: !!displayRequests,
      displayRequestsLength: displayRequests?.length,
      propRequests,
      dataServiceRequests: data?.serviceRequests,
      accountId: effectiveAccountId,
      isLoading,
      queryError,
    });
    
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2">No service requests found</p>
          <p className="text-sm text-gray-500">
            {effectiveAccountId 
              ? "Get started by creating your first request" 
              : "Waiting for account information..."}
          </p>
          {/* Debug info in development */}
          {/* {import.meta.env.DEV && effectiveAccountId && (
            <p className="text-xs text-gray-400 mt-2">
              Account ID: {effectiveAccountId}
            </p>
          )} */}
        </div>
        {/* Manual reload for debugging */}
        {/* {effectiveAccountId && (
          <button
            onClick={() => {
              queryClient.invalidateQueries(serviceRequestKeys.list(effectiveAccountId, 1, maxItems));
            }}
            className="mb-4 px-3 py-1 border border-gray-300 rounded-md text-xs text-gray-600 hover:text-blue-600 hover:border-blue-300"
          >
            Retry Load
          </button>
        )} */}
        <Can I="create" a="user-requests">
          <button
            onClick={() => {
              navigate({ pathname: '/', hash: '#services-marketplaces' });
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Request
          </button>
        </Can>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Service Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Submitted Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayRequests.map((request) => (
              <tr key={request.id || request.serviceName} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.serviceName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.category || request.serviceName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                      className={`text-xs font-medium ${getStatusStyle(
                          request.status as string
                      )}`}
                  >
                    {formatStatusLabel(request.status)}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(request.submittedDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                <Link
                                    to="/dashboard/requests"
                                    className="px-3 py-1 border border-gray-300 rounded-md text-xs text-gray-600 hover:text-blue-600 hover:border-blue-300 inline-block"
                                >
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-end">
                <Link
                    to="/dashboard/requests"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    View All Requests
                </Link>
            </div>
        </div>
    );
};
