import React from "react";
import { PlusIcon, SearchXIcon } from "lucide-react";
import { Can } from "../RBAC/Can";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
interface EmptyStateProps {
  onRequestNewService: () => void;
  hasFilters: boolean;
  onClearFilters: () => void;
}
export function EmptyState({
  onRequestNewService,
  hasFilters,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
      {hasFilters ? (
        <>
          <SearchXIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No matching requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            We couldn't find any service requests matching your current filters.
          </p>
          <div className="mt-6">
            <button
              onClick={onClearFilters}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear all filters
            </button>
          </div>
        </>
      ) : (
        <>
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No service requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first service request.
          </p>
          <div className="mt-6">
            <Can I="create" a="user-requests" passThrough>
              {(allowed) => {
                const button = (
                  <button
                    onClick={allowed ? onRequestNewService : undefined}
                    type="button"
                    disabled={!allowed}
                    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      !allowed ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-disabled={!allowed}
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Request New Service
                  </button>
                );

                if (!allowed) {
                  return (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block">{button}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>You don't have permission to create requests</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                }

                return button;
              }}
            </Can>
          </div>
        </>
      )}
    </div>
  );
}
