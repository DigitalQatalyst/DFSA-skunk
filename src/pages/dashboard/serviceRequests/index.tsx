import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DateRangeFilter,
  ServiceRequest,
  ServiceRequestStatus,
} from "../../../types";
import { ServiceRequestsTable } from "../../../components/serviceRequests/ServiceRequestsTable";
import { useAuth } from "../../../components/Header/context/AuthContext";
import { PageLayout, BreadcrumbItem } from "../../../components/PageLayout";
import { useOrganization } from "../../../hooks/useOrganization";
import { useServiceRequests } from "../../../hooks/useServiceRequests";

export function ServiceRequestsPage() {
  const { user } = useAuth();
  const {
    organization,
    accountId,
    isLoading: isLoadingOrg,
    error: orgError,
  } = useOrganization();

  const [currentStatus, setCurrentStatus] = useState<
    ServiceRequestStatus | "all"
  >("all");
  const [currentCategory, setCurrentCategory] = useState<
    "all" | "financial" | "business-services"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: null,
    endDate: null,
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ServiceRequest;
    direction: "asc" | "desc";
  }>({
    key: "submittedDate",
    direction: "desc",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch service requests using React Query
  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useServiceRequests(
    accountId || undefined,
    currentPage,
    pageSize,
    !isLoadingOrg && !!accountId
  );

  // Enrich and filter requests in memory
  const { requests, filteredRequests } = useMemo(() => {
    if (!data?.serviceRequests) {
      return { requests: [], filteredRequests: [] };
    }

    // Update requestedBy with current user info if missing
    const enrichedRequests = data.serviceRequests.map((request) => {
      const finalName =
        request.requestedBy.name !== "Unknown User" &&
        request.requestedBy.name !== "Customer"
          ? request.requestedBy.name
          : user?.name || "Unknown User";

      return {
        ...request,
        requestedBy: {
          ...request.requestedBy,
          name: finalName,
          email:
            request.requestedBy.email &&
            request.requestedBy.email !== "customer@example.com"
              ? request.requestedBy.email
              : user?.email || "",
          company:
            request.requestedBy.company !== "Unknown Company"
              ? request.requestedBy.company
              : organization?.accountName || "Unknown Company",
        },
      };
    });

    // Apply filters
    let filtered = [...enrichedRequests];

    // Filter by status
    if (currentStatus !== "all") {
      filtered = filtered.filter((request) => request.status === currentStatus);
    }

    // Filter by category
    if (currentCategory !== "all") {
      filtered = filtered.filter((request) => {
        const categoryLower = request.category.toLowerCase();
        if (currentCategory === "financial") {
          return categoryLower === "financial";
        } else {
          return categoryLower === "business-services" || categoryLower === "non-financial";
        }
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.serviceName.toLowerCase().includes(query) ||
          request.category.toLowerCase().includes(query) ||
          request.serviceProvider?.toLowerCase().includes(query)
      );
    }

    // Filter by date range
    if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter((request) => {
        const requestDate = new Date(request.submittedDate);
        if (dateRange.startDate && dateRange.endDate) {
          const start = new Date(dateRange.startDate);
          const end = new Date(dateRange.endDate);
          return requestDate >= start && requestDate <= end;
        }
        if (dateRange.startDate) {
          const start = new Date(dateRange.startDate);
          return requestDate >= start;
        }
        if (dateRange.endDate) {
          const end = new Date(dateRange.endDate);
          return requestDate <= end;
        }
        return true;
      });
    }

    // Sort filtered requests
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue && bValue) {
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
      }
      return 0;
    });

    return { requests: enrichedRequests, filteredRequests: filtered };
  }, [
    data,
    user,
    organization,
    currentStatus,
    currentCategory,
    searchQuery,
    dateRange,
    sortConfig,
  ]);

  // Define breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Service Requests",
      current: true,
    },
  ];

  // Handle sort
  const handleSort = (
    key: keyof ServiceRequest,
    direction?: "asc" | "desc"
  ) => {
    if (direction) {
      setSortConfig({ key, direction });
    } else {
      setSortConfig((prevConfig) => ({
        key,
        direction:
          prevConfig.key === key && prevConfig.direction === "asc"
            ? "desc"
            : "asc",
      }));
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    await refetch();
  };

  // Handle new service request - redirect to landing page
  const navigate = useNavigate();

  const handleRequestNewService = () => {
    navigate("/#services");
  };

  // Determine error message
  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "Failed to load service requests"
    : orgError
    ? "Unable to load account information. Please try again."
    : null;

  if (isLoading || !user || isLoadingOrg) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!user
              ? "Authenticating..."
              : isLoadingOrg
              ? "Loading account information..."
              : "Loading service requests..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-lg mb-2">Error</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleRefresh}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <PageLayout title="Service Requests" breadcrumbs={breadcrumbs}>
      <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-6">
        <ServiceRequestsTable
          requests={filteredRequests}
          sortConfig={sortConfig}
          onSort={handleSort}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentStatus={currentStatus}
          onStatusChange={setCurrentStatus}
          currentCategory={currentCategory}
          onCategoryChange={setCurrentCategory}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onRequestNewService={handleRequestNewService}
          onRefresh={handleRefresh}
          hasFilters={
            currentStatus !== "all" ||
            currentCategory !== "all" ||
            !!searchQuery ||
            !!(dateRange.startDate || dateRange.endDate)
          }
          onClearFilters={() => {
            setCurrentStatus("all");
            setCurrentCategory("all");
            setSearchQuery("");
            setDateRange({
              startDate: null,
              endDate: null,
            });
          }}
          // Server-side pagination props
          currentPage={currentPage}
          totalPages={data?.pagination.totalPages || 0}
          totalRecords={data?.pagination.totalRecords || 0}
          onPageChange={setCurrentPage}
        />
      </div>
    </PageLayout>
  );
}
