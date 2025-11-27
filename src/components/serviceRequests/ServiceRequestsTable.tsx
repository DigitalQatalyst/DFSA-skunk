import { useState, useEffect, useRef } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Search,
  Download,
  Plus,
  X,
  MoreVerticalIcon,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ServiceRequestDetails } from "./ServiceRequestDetails";
import {
  ServiceRequest,
  ServiceRequestStatus,
  DateRangeFilter,
} from "../../types";
import { getServiceEditRoute } from "./serviceFormRoutes";
import { EmptyState } from "./EmptyState";
import { ExportService } from "../../utils/exportUtils";
import { useDeleteServiceRequest } from "../../hooks/useServiceRequests";
import { Can } from "../RBAC";

interface ServiceRequestsTableProps {
  requests: ServiceRequest[];
  sortConfig: {
    key: keyof ServiceRequest;
    direction: "asc" | "desc";
  };
  onSort: (key: keyof ServiceRequest, direction?: "asc" | "desc") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentStatus: ServiceRequestStatus | "all";
  onStatusChange: (status: ServiceRequestStatus | "all") => void;
  currentCategory: "all" | "financial" | "non-financial";
  onCategoryChange: (category: "all" | "financial" | "non-financial") => void;
  dateRange: DateRangeFilter;
  onDateRangeChange: (dateRange: DateRangeFilter) => void;
  onRequestNewService: () => void;
  hasFilters: boolean;
  onClearFilters: () => void;
  onRefresh?: () => Promise<void>;
  // Server-side pagination props
  currentPage?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
}

export function ServiceRequestsTable({
  requests: propRequests,
  sortConfig,
  onSort,
  searchQuery,
  onSearchChange,
  currentStatus,
  onStatusChange,
  currentCategory,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  onRequestNewService,
  hasFilters,
  onClearFilters,
  onRefresh,
  // Server-side pagination props
  currentPage: serverCurrentPage,
  totalPages: serverTotalPages,
  totalRecords: serverTotalRecords,
  onPageChange,
}: ServiceRequestsTableProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sortOption, setSortOption] = useState<string>("newest");
  const requests = propRequests;
  const menuRef = useRef<HTMLDivElement>(null);

  // React Query delete mutation
  const deleteMutation = useDeleteServiceRequest();

  // Determine if we're using server-side or client-side pagination
  const isServerSidePagination = onPageChange !== undefined;

  // Use server-side pagination values if available, otherwise use client-side
  const currentPage = isServerSidePagination ? serverCurrentPage || 1 : page;
  const totalPages = isServerSidePagination
    ? serverTotalPages || 1
    : Math.ceil(requests.length / rowsPerPage);
  const totalRecords = isServerSidePagination
    ? serverTotalRecords || requests.length
    : requests.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionMenuOpen) {
        const target = event.target as Element;
        // Check if click is on any menu or menu button
        const isMenuClick =
          target.closest('[role="menu"]') ||
          target.closest('[aria-haspopup="true"]') ||
          target.closest(".fixed.w-48"); // Our menu class

        if (!isMenuClick) {
          console.log("ðŸ”¥ Click outside detected, closing menu");
          setActionMenuOpen(null);
        } else {
          console.log("ðŸ”¥ Click inside menu detected, keeping open");
        }
      }
    }

    if (actionMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionMenuOpen]);

  // Clear selection when requests change (due to filtering, etc.)
  useEffect(() => {
    setSelectedIds(new Set());
  }, [requests]);

  // Sync sortOption with sortConfig
  useEffect(() => {
    if (sortConfig.key === "submittedDate") {
      setSortOption(sortConfig.direction === "desc" ? "newest" : "oldest");
    } else if (sortConfig.key === "serviceName") {
      setSortOption(sortConfig.direction === "asc" ? "name-asc" : "name-desc");
    }
  }, [sortConfig]);

  // Handle escape key to close date picker
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showDatePicker) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showDatePicker]);

  // Close action menu on scroll (with debouncing to avoid interfering with clicks)
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (actionMenuOpen) {
        const currentScrollY = window.scrollY;
        const scrollDifference = Math.abs(currentScrollY - lastScrollY);

        // Only close menu if there's significant scroll movement (more than 5px)
        if (scrollDifference > 5) {
          clearTimeout(scrollTimer);
          scrollTimer = setTimeout(() => {
            setActionMenuOpen(null);
          }, 100); // Small delay to ensure it's real scrolling
        }

        lastScrollY = currentScrollY;
      }
    };

    if (actionMenuOpen) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      document.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      clearTimeout(scrollTimer);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [actionMenuOpen]);

  // For server-side pagination, all requests are already the current page
  // For client-side pagination, we slice the requests array
  const startIndex = isServerSidePagination ? 0 : (page - 1) * rowsPerPage;
  const paginatedRequests = isServerSidePagination
    ? requests
    : requests.slice(startIndex, startIndex + rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      if (isServerSidePagination && onPageChange) {
        onPageChange(currentPage + 1);
      } else {
        setPage(page + 1);
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      if (isServerSidePagination && onPageChange) {
        onPageChange(currentPage - 1);
      } else {
        setPage(page - 1);
      }
    }
  };

  const handlePageClick = (pageNumber: number) => {
    if (isServerSidePagination && onPageChange) {
      onPageChange(pageNumber);
    } else {
      setPage(pageNumber);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const toggleActionMenu = (requestId: string) => {
    setActionMenuOpen(actionMenuOpen === requestId ? null : requestId);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedRequests.map((request) => request.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (requestId: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(requestId);
    } else {
      newSelectedIds.delete(requestId);
    }
    setSelectedIds(newSelectedIds);
  };

  const isAllSelected =
    paginatedRequests.length > 0 &&
    paginatedRequests.every((request) => selectedIds.has(request.id));
  const isIndeterminate = selectedIds.size > 0 && !isAllSelected;

  const formatDateForDisplay = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString();
  };

  const getDateRangeLabel = () => {
    if (dateRange.startDate && dateRange.endDate) {
      return `${formatDateForDisplay(
        dateRange.startDate
      )} - ${formatDateForDisplay(dateRange.endDate)}`;
    } else if (dateRange.startDate) {
      return `From ${formatDateForDisplay(dateRange.startDate)}`;
    } else if (dateRange.endDate) {
      return `Until ${formatDateForDisplay(dateRange.endDate)}`;
    }
    return "Date Range";
  };

  const handleAction = async (action: string, request: ServiceRequest) => {
    console.log("ðŸ”¥ handleAction called:", action, request.serviceName);
    setActionMenuOpen(null);

    try {
      if (action === "view") {
        setSelectedRequest(request);
      } else if (action === "edit") {
        const editRoute = getServiceEditRoute(request.serviceName, request.id);
        navigate(editRoute);
      } else if (action === "delete") {
        // Handle deletion with confirmation
        if (
          window.confirm(
            `Are you sure you want to cancel "${request.serviceName}"?`
          )
        ) {
          // Use the entityType from the request, with fallback logic
          const entityType =
            request.entityType ||
            (request.serviceProvider?.toLowerCase().includes("support")
              ? "case"
              : "opportunity");

          // Call React Query mutation to delete
          await deleteMutation.mutateAsync({
            requestId: request.id,
            entityType,
          });

          // Refresh will happen automatically via query invalidation
          // But we can also call onRefresh if provided for consistency
          if (onRefresh) {
            await onRefresh();
          }
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} service request:`, error);
      alert(`Failed to ${action} service request. Please try again.`);
    }
  };

  const renderSortIcon = (key: keyof ServiceRequest) => {
    if (sortConfig.key !== key) {
      return (
        <ChevronDownIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
      );
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUpIcon className="w-4 h-4 text-gray-700" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 text-gray-700" />
    );
  };

  const canEdit = (request: ServiceRequest) => {
    return request.status === "submitted";
  };

  const canCancel = (request: ServiceRequest) => {
    return request.status === "submitted" || request.status === "in-progress";
  };

  const handleExport = async () => {
    const selectedRequests = requests.filter((request) =>
      selectedIds.has(request.id)
    );

    if (selectedRequests.length === 0) {
      alert("Please select items to export");
      return;
    }

    setIsExporting(true);

    try {
      // Use the export service to handle the export
      ExportService.exportData(selectedRequests, {
        format: "csv",
        filename: `service-requests-${
          new Date().toISOString().split("T")[0]
        }.csv`,
        includeHeaders: true,
      });

      // Show success message with summary
      const summary = ExportService.getExportSummary(selectedRequests);
      console.log(`Export completed: ${summary}`);

      // Clear selection after successful export
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Export failed:", error);
      alert(
        `Export failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      {/* Header Section */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              Service Request Management
            </h3>
            <p className="text-sm text-gray-600">
              Manage and track all your service requests in one place
            </p>
          </div>
          <Can I="create" a="user-requests">
            <button
              onClick={() => {
                console.log("ðŸ”¥ Button clicked in ServiceRequestsTable!");
                onRequestNewService();
              }}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Request New Service
            </button>
          </Can>
        </div>
      </div>
      {/* Search and Filter Controls */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Row - Mobile Responsive */}
        <div className="space-y-3 lg:space-y-0">
          {/* Mobile: Two rows, Desktop: One row */}
          <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3">
            <select
              value={currentStatus}
              onChange={(e) =>
                onStatusChange(e.target.value as ServiceRequestStatus | "all")
              }
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="in-progress">In Progress</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={currentCategory}
              onChange={(e) =>
                onCategoryChange(
                  e.target.value as "all" | "financial" | "non-financial"
                )
              }
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="financial">Financial</option>
              <option value="non-financial">Non-Financial</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => {
                const value = e.target.value;
                setSortOption(value);

                switch (value) {
                  case "newest":
                    onSort("submittedDate", "desc");
                    break;
                  case "oldest":
                    onSort("submittedDate", "asc");
                    break;
                  case "name-asc":
                    onSort("serviceName", "asc");
                    break;
                  case "name-desc":
                    onSort("serviceName", "desc");
                    break;
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>

            {/* Date Range and Export buttons - Same row on desktop, separate row on mobile */}
            <button
              onClick={() => setShowDatePicker(true)}
              className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                dateRange.startDate || dateRange.endDate
                  ? "text-blue-700 bg-blue-50 border-blue-300"
                  : "text-gray-700 bg-white"
              } hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 col-span-2 lg:col-span-1`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {getDateRangeLabel()}
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting || selectedIds.size === 0}
              className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                isExporting || selectedIds.size === 0
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white hover:bg-gray-50"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 col-span-2 lg:col-span-1`}
            >
              <Download
                className={`w-4 h-4 mr-2 ${isExporting ? "animate-pulse" : ""}`}
              />
              {isExporting
                ? `Exporting ${selectedIds.size} records...`
                : selectedIds.size > 0
                ? `Export (${selectedIds.size})`
                : "Export"}
            </button>

            {/* Clear Filters - Desktop only (mobile has it separate) */}
            {hasFilters && (
              <button
                onClick={onClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium hidden lg:block"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Clear Filters - Mobile only (desktop has it inline) */}
          <div className="flex flex-wrap items-center gap-3 lg:hidden">
            {hasFilters && (
              <button
                onClick={onClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedIds.size > 0 && (
        <div className="px-6 py-2 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""}{" "}
              selected
            </span>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Table or Empty State */}
      {paginatedRequests.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto relative">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => onSort("serviceName")}
                  >
                    <div className="flex items-center">
                      Service Name
                      <span className="ml-1">
                        {renderSortIcon("serviceName")}
                      </span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => onSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      <span className="ml-1">{renderSortIcon("category")}</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => onSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      <span className="ml-1">{renderSortIcon("status")}</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => onSort("serviceProvider")}
                  >
                    <div className="flex items-center">
                      Service Provider
                      <span className="ml-1">
                        {renderSortIcon("serviceProvider")}
                      </span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => onSort("submittedDate")}
                  >
                    <div className="flex items-center">
                      Submitted Date
                      <span className="ml-1">
                        {renderSortIcon("submittedDate")}
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(request.id)}
                        onChange={(e) =>
                          handleSelectRow(request.id, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <button
                          className="hover:text-blue-600 focus:outline-none focus:text-blue-600"
                          onClick={() => setSelectedRequest(request)}
                        >
                          {request.serviceName}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {request.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : request.status === "submitted"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {request.status === "in-progress"
                          ? "In Progress"
                          : request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.serviceProvider || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.submittedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          data-menu-id={request.id}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 p-3 rounded-full hover:bg-gray-100 touch-manipulation"
                          onClick={() => toggleActionMenu(request.id)}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            toggleActionMenu(request.id);
                          }}
                          aria-label="Actions menu"
                          aria-haspopup="true"
                          aria-expanded={actionMenuOpen === request.id}
                        >
                          <MoreVerticalIcon className="h-5 w-5" />
                        </button>
                        {actionMenuOpen === request.id && (
                          <div
                            ref={menuRef}
                            className="fixed w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[9999]"
                            style={{
                              top: (() => {
                                const button = document.querySelector(
                                  `[data-menu-id="${request.id}"]`
                                );
                                if (!button) return 0;
                                const rect = button.getBoundingClientRect();
                                return rect.bottom + 8;
                              })(),
                              left: (() => {
                                const button = document.querySelector(
                                  `[data-menu-id="${request.id}"]`
                                );
                                if (!button) return 0;
                                const rect = button.getBoundingClientRect();
                                const dropdownWidth = 192;
                                let left = rect.right - dropdownWidth;

                                // Ensure it doesn't go off screen
                                if (left < 8) {
                                  left = rect.left;
                                }
                                if (
                                  left + dropdownWidth >
                                  window.innerWidth - 8
                                ) {
                                  left = window.innerWidth - dropdownWidth - 8;
                                }

                                return Math.max(8, left);
                              })(),
                            }}
                          >
                            <div
                              className="py-1"
                              role="menu"
                              aria-orientation="vertical"
                            >
                              <button
                                onClick={(e) => {
                                  console.log("ðŸ”¥ View Details clicked!");
                                  e.stopPropagation();
                                  handleAction("view", request);
                                }}
                                onTouchEnd={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAction("view", request);
                                }}
                                className="block w-full text-left px-4 py-4 lg:py-3 text-sm text-gray-700 hover:bg-gray-100 touch-manipulation"
                                role="menuitem"
                              >
                                View Details
                              </button>
                              {/* {request.status === "draft" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction("edit", request);
                                  }}
                                  onTouchEnd={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAction("edit", request);
                                  }}
                                  className="block w-full text-left px-4 py-4 lg:py-3 text-sm text-gray-700 hover:bg-gray-100 touch-manipulation"
                                  role="menuitem"
                                >
                                  Edit Request
                                </button>
                              )} */}

                              <Can I="delete" a="user-requests">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction("delete", request);
                                  }}
                                  onTouchEnd={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAction("delete", request);
                                  }}
                                  className="block w-full text-left px-4 py-4 lg:py-3 text-sm text-red-600 hover:bg-gray-100 touch-manipulation"
                                  role="menuitem"
                                >
                                  Cancel
                                </button>
                              </Can>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4 p-4">
            {paginatedRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(request.id)}
                      onChange={(e) =>
                        handleSelectRow(request.id, e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <button
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 focus:outline-none focus:text-blue-600 text-left"
                      onClick={() => setSelectedRequest(request)}
                    >
                      {request.serviceName}
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      data-menu-id={request.id}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 p-2 rounded-full hover:bg-gray-100 touch-manipulation"
                      onClick={() => toggleActionMenu(request.id)}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        toggleActionMenu(request.id);
                      }}
                      aria-label="Actions menu"
                      aria-haspopup="true"
                      aria-expanded={actionMenuOpen === request.id}
                    >
                      <MoreVerticalIcon className="h-5 w-5" />
                    </button>
                    {actionMenuOpen === request.id && (
                      <div
                        ref={menuRef}
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[9999]"
                      >
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          <button
                            onClick={(e) => {
                              console.log("ðŸ”¥ Mobile View Details clicked!");
                              e.stopPropagation();
                              handleAction("view", request);
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAction("view", request);
                            }}
                            className="block w-full text-left px-4 py-4 lg:py-3 text-sm text-gray-700 hover:bg-gray-100 touch-manipulation"
                            role="menuitem"
                          >
                            View Details
                          </button>
                          {/* {request.status === "draft" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction("edit", request);
                              }}
                              onTouchEnd={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAction("edit", request);
                              }}
                              className="block w-full text-left px-4 py-4 lg:py-3 text-sm text-gray-700 hover:bg-gray-100 touch-manipulation"
                              role="menuitem"
                            >
                              Edit Request
                            </button>
                          )} */}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction("delete", request);
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAction("delete", request);
                            }}
                            className="block w-full text-left px-4 py-4 lg:py-3 text-sm text-red-600 hover:bg-gray-100 touch-manipulation"
                            role="menuitem"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Category</span>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {request.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status</span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : request.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : request.status === "submitted"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {request.status === "in-progress"
                        ? "In Progress"
                        : request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Submitted</span>
                    <span className="text-xs text-gray-900">
                      {formatDate(request.submittedDate)}
                    </span>
                  </div>

                  {request.serviceProvider && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Provider</span>
                      <span className="text-xs text-gray-900">
                        {request.serviceProvider}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="p-6">
          <EmptyState
            hasFilters={hasFilters}
            onClearFilters={onClearFilters}
            onRequestNewService={onRequestNewService}
          />
        </div>
      )}

      {selectedRequest && (
        <ServiceRequestDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          allowEdit={canEdit(selectedRequest)}
          allowCancel={canCancel(selectedRequest)}
          onEdit={() => handleAction("edit", selectedRequest)}
          onCancel={() => handleAction("delete", selectedRequest)}
        />
      )}

      {/* Pagination - only show when there are results */}
      {paginatedRequests.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {isServerSidePagination
                  ? (currentPage - 1) * rowsPerPage + 1
                  : startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {isServerSidePagination
                  ? Math.min(currentPage * rowsPerPage, totalRecords)
                  : Math.min(startIndex + rowsPerPage, requests.length)}
              </span>{" "}
              of <span className="font-medium">{totalRecords}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`p-2 border border-gray-300 rounded-md ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>

              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageClick(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNumber
                        ? "text-white bg-blue-600"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-3 py-2 text-sm text-gray-500">...</span>
                  <button
                    onClick={() => handlePageClick(totalPages)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 border border-gray-300 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Range Picker Modal */}
      {showDatePicker && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDatePicker(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-96 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Date Range
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate || ""}
                  onChange={(e) =>
                    onDateRangeChange({
                      ...dateRange,
                      startDate: e.target.value || null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate || ""}
                  onChange={(e) =>
                    onDateRangeChange({
                      ...dateRange,
                      endDate: e.target.value || null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => {
                    onDateRangeChange({ startDate: null, endDate: null });
                    setShowDatePicker(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
