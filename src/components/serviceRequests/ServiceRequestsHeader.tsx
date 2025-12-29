import React from "react";
import { PlusIcon, MenuIcon, XIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {useSidebar} from "../../context/SidebarContext";
import { Can } from "../RBAC/Can";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ServiceRequestsHeaderProps {
  onRequestNewService: () => void;
}
export function ServiceRequestsHeader({
  onRequestNewService,
}: ServiceRequestsHeaderProps) {
    const { isOpen: sidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-6 pb-3 pl-5">
      <div className="flex gap-4">
        <div className="lg:hidden">
            <button
                className="lg:hidden text-gray-600 flex-shrink-0 z-40 mt-2"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar">
                {sidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
      </div>

      {/* Mobile: Icon-only button, Desktop: Full button with text */}
      <Can I="create" a="user-requests" passThrough>
        {(allowed) => {
          const link = (
            <Link
              to={allowed ? "/services-marketplaces" : "#"}
              onClick={allowed ? onRequestNewService : (e) => e.preventDefault()}
              className={`inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                !allowed ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`}
              aria-label="Request new service"
              aria-disabled={!allowed}
            >
              <PlusIcon className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Request New Service</span>
              <span className="inline sm:hidden">New Request</span>
            </Link>
          );

          if (!allowed) {
            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">{link}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You don't have permission to create requests</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return link;
        }}
      </Can>
    </div>
  );
}
