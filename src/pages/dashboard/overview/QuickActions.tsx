import React from "react";
import {
  FileUpIcon,
  FileTextIcon,
  ClipboardListIcon,
  HelpCircleIcon,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { Can } from "../../../components/RBAC/Can";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  // Handle navigation to home page services section with scrolling
  const handleCreateRequest = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate({ pathname: '/', hash: '#services-marketplaces' });
  };

  const actions = [
    {
      id: "submit-request",
      label: "Create Request",
      icon: <FileTextIcon className="h-5 w-5" />,
      onClick: handleCreateRequest,
      primary: true,
      to: "/",
      customHandler: true,
    },
    {
      id: "upload-documents",
      label: "Upload Document",
      icon: <FileUpIcon className="h-5 w-5" />,
      onClick: () => console.log("Upload Documents clicked"),
      primary: true,
      to: "/dashboard/documents",
      customHandler: false,
    },
    {
      id: "view-requests",
      label: "View Requests",
      icon: <ClipboardListIcon className="h-5 w-5" />,
      onClick: () => console.log("View Requests clicked"),
      primary: false,
      to: "/dashboard/requests",
      customHandler: false,
    },
    {
      id: "contact-support",
      label: "Contact Support",
      icon: <HelpCircleIcon className="h-5 w-5" />,
      onClick: () => console.log("Contact Support clicked"),
      primary: false,
      to: "/dashboard/support",
      customHandler: false,
    },
  ];

  // Determine permission subject and action for each action
  const getPermissionForAction = (actionId: string) => {
    switch (actionId) {
      case "submit-request":
        return {
          I: "create" as const,
          a: "user-requests" as const,
          tooltip: "You don't have permission to create requests",
        };
      case "upload-documents":
        return {
          I: "create" as const,
          a: "user-documents" as const,
          tooltip: "You don't have permission to upload documents",
        };
      case "view-requests":
        return {
          I: "read" as const,
          a: "user-requests" as const,
          tooltip: "You don't have permission to view requests",
        };
      case "contact-support":
        return {
          I: "read" as const,
          a: "user-dashboard" as const,
          tooltip: "You don't have permission to contact support",
        };
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const permission = getPermissionForAction(action.id);
        const actionClassName = `flex flex-col items-center justify-center p-4 rounded-lg transition-colors w-full ${
          action.primary
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-white border border-gray-200 hover:border-blue-300 hover:bg-gray-50"
        }`;
        const iconClassName = `p-2 rounded-full mb-3 `;
        const labelClassName = `text-sm font-medium ${
          action.primary ? "text-white" : "text-gray-700"
        }`;

        if (action.customHandler) {
          if (!permission) {
            // No permission check needed, render normally
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className={actionClassName}
              >
                <div className={iconClassName}>{action.icon}</div>
                <span className={labelClassName}>{action.label}</span>
              </button>
            );
          }

          return (
            <Can key={action.id} I={permission.I} a={permission.a} passThrough>
              {(allowed) => {
                const disabledClassName = !allowed
                  ? "opacity-50 cursor-not-allowed"
                  : "";
                const button = (
                  <button
                    onClick={allowed ? action.onClick : undefined}
                    disabled={!allowed}
                    className={`${actionClassName} ${disabledClassName}`.trim()}
                    aria-disabled={!allowed}
                  >
                    <div className={iconClassName}>{action.icon}</div>
                    <span className={labelClassName}>{action.label}</span>
                  </button>
                );

                if (!allowed) {
                  return (
                    <TooltipProvider key={action.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-full">{button}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{permission.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                }

                return button;
              }}
            </Can>
          );
        }

        if (!permission) {
          // No permission check needed, render normally
          return (
            <Link
              to={action.to}
              key={action.id}
              onClick={action.onClick}
              className={actionClassName}
            >
              <div className={iconClassName}>{action.icon}</div>
              <span className={labelClassName}>{action.label}</span>
            </Link>
          );
        }

        return (
          <Can key={action.id} I={permission.I} a={permission.a} passThrough>
            {(allowed) => {
              const disabledClassName = !allowed
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : "";
              const link = (
                <Link
                  to={allowed ? action.to : "#"}
                  onClick={allowed ? action.onClick : (e) => e.preventDefault()}
                  className={`${actionClassName} ${disabledClassName}`.trim()}
                  aria-disabled={!allowed}
                >
                  <div className={iconClassName}>{action.icon}</div>
                  <span className={labelClassName}>{action.label}</span>
                </Link>
              );

              if (!allowed) {
                return (
                  <TooltipProvider key={action.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full">{link}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{permission.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }


              
              return link;
            }}
          </Can>
        );
      })}
    </div>
  );
};
