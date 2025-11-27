import React, { useState } from "react";
import {
  XIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  BuildingIcon,
  FileTextIcon,
  MessageSquareIcon,
  CheckIcon,
  InfoIcon,
  EditIcon,
} from "lucide-react";
import { ServiceRequest } from "../../types";
interface ServiceRequestDetailsProps {
  request: ServiceRequest | null;
  onClose: () => void;
  allowEdit?: boolean;
  allowCancel?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
}
export function ServiceRequestDetails({
  request,
  onClose,
  allowEdit = false,
  allowCancel = false,
  onEdit,
  onCancel,
}: ServiceRequestDetailsProps) {
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  if (!request) return null;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case "rejected":
        return <XCircleIcon size={16} className="text-red-500" />;
      case "pending":
      default:
        return <ClockIcon size={16} className="text-yellow-500" />;
    }
  };
  // Determine the current step in the process
  const getCurrentStep = () => {
    switch (request.status) {
      case "submitted":
        return 0; // Application submitted
      case "in-progress":
        return 1; // In progress
      case "approved":
      case "rejected":
        return 2; // Final decision made
      default:
        return 0;
    }
  };
  // Get step status: 0 = pending, 1 = active, 2 = completed
  const getStepStatus = (stepIndex: number) => {
    const currentStep = getCurrentStep();

    // If current step is greater than this step, it's completed
    if (currentStep > stepIndex) {
      return 2; // completed
    }

    // If current step equals this step, it's active
    if (currentStep === stepIndex) {
      return 1; // active
    }

    // Otherwise it's pending
    return 0; // pending
  };

  // Old logic kept for reference but not used
  const getStepStatusOld = (stepIndex: number) => {
    // For submitted status, only first step is active
    if (request.status === "submitted") {
      return stepIndex === 0 ? 1 : 0;
    }

    // Step 0: Application Submitted - completed for all non-submitted statuses
    if (stepIndex === 0) {
      return 2; // completed
    }

    // Step 1: In Progress - active if in-progress
    if (stepIndex === 1) {
      if (request.status === "in-progress") {
        return 1; // active
      } else if (
        request.status === "approved" ||
        request.status === "rejected" ||
        request.status === "completed"
      ) {
        return 2; // completed
      }
      return 0; // pending
    }

    // Step 2: Final Decision - active/completed if approved, rejected, or completed
    if (stepIndex === 2) {
      if (request.status === "approved" || request.status === "rejected") {
        return 2; // completed
      }
      return 0; // pending
    }

    return 0; // default pending
  };
  // Generate activity timeline
  const generateTimeline = () => {
    const timeline: any = [];
    // For all requests, first event should be "Request Submitted"
    timeline.push({
      date: request.submittedDate,
      title: "Request Submitted",
      description: `${request.serviceName} request was submitted by ${request.requestedBy.name}`,
      icon: <FileTextIcon size={16} />,
      type: "info",
    });

    // Add appropriate events based on request status
    if (request.approvers) {
      if (request.status === "submitted") {
        // For under-review requests, show only one pending review event
        // with all pending approvers listed in the description
        const pendingApprovers = request.approvers
          .filter((approver) => approver.status === "pending")
          .map((approver) => `${approver.name} (${approver.role})`)
          .join(", ");
        // If there are pending approvers, add a single pending review event
        if (pendingApprovers) {
          timeline.push({
            date: request.submittedDate,
            title: "Pending Review",
            description: `Awaiting review from ${pendingApprovers}`,
            icon: <ClockIcon size={16} />,
            type: "pending",
          });
        }
      } else if (request.status === "approved") {
        // For approved requests, show approval events
        request.approvers.forEach((approver) => {
          if (approver.date) {
            timeline.push({
              date: approver.date,
              title: `Approved by ${approver.role}`,
              description:
                approver.comments || `${approver.name} approved the request`,
              icon: <CheckCircleIcon size={16} />,
              type: "approved",
            });
          }
        });
      } else if (request.status === "rejected") {
        // For rejected requests, show rejection event
        const rejector = request.approvers.find((a) => a.status === "rejected");
        if (rejector && rejector.date) {
          timeline.push({
            date: rejector.date,
            title: `Rejected by ${rejector.role}`,
            description:
              rejector.comments || `${rejector.name} rejected the request`,
            icon: <XCircleIcon size={16} />,
            type: "rejected",
          });
        }
      }
    }
    // Sort by date (oldest first to maintain chronological flow)
    return timeline.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };
  // Get the last updated date
  const getLastUpdatedDate = () => {
    // Use the lastUpdated field from the request if available
    return request.lastUpdated || request.submittedDate;
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center">
            <button
              className="mr-2 p-2 rounded-full hover:bg-gray-100 lg:hidden"
              onClick={onClose}
            >
              <ArrowLeftIcon size={20} className="text-gray-500" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {request.serviceName}
            </h2>
          </div>
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {/* Success/Info Banner */}
          {showSuccessBanner && (
            <div className="mx-6 mt-4 p-4 rounded-md bg-green-50 border border-green-200 flex items-start">
              <CheckCircleIcon
                size={20}
                className="text-green-500 mr-3 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
              <button
                onClick={() => setShowSuccessBanner(false)}
                className="text-green-500 hover:text-green-700"
              >
                <XIcon size={16} />
              </button>
            </div>
          )}

          {/* Status and Progress Section */}
          <div className="px-6 py-5 border-b border-gray-100">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-6">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
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
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <CalendarIcon size={14} className="mr-1.5" />
                Last updated: {formatDate(getLastUpdatedDate())}
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center justify-between">
              {["Application Submitted", "In Progress", "Final Decision"].map(
                (step, index) => {
                  const status = getStepStatus(index);
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center relative"
                      style={{
                        width: index === 1 ? "34%" : "33%",
                      }}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          status === 2
                            ? "bg-green-100 text-green-600"
                            : status === 1
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {status === 2 ? (
                          <CheckIcon size={16} />
                        ) : (
                          <span className="text-xs font-medium">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-2 text-xs font-medium text-center ${
                          status === 2
                            ? "text-green-600"
                            : status === 1
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step}
                      </p>
                      {/* Connecting line */}
                      {index < 2 && (
                        <div
                          className={`hidden sm:block absolute h-[2px] top-4 w-full ${
                            status === 2 ? "bg-green-500" : "bg-gray-200"
                          }`}
                          style={{
                            left: "60%",
                            width: "80%",
                          }}
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Request details */}
              <div className="space-y-6">
                {/* Service Request Summary */}
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Request Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="flex items-start">
                      <TagIcon
                        size={16}
                        className="text-gray-400 mt-0.5 mr-2.5"
                      />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Category</p>
                        <p className="font-medium text-sm">
                          {request.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BuildingIcon
                        size={16}
                        className="text-gray-400 mt-0.5 mr-2.5"
                      />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Service Provider
                        </p>
                        <p className="font-medium text-sm">
                          {request.serviceProvider || "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CalendarIcon
                        size={16}
                        className="text-gray-400 mt-0.5 mr-2.5"
                      />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Submitted Date
                        </p>
                        <p className="font-medium text-sm">
                          {formatDate(request.submittedDate)}
                        </p>
                      </div>
                    </div>
                    {request.sla && (
                      <div className="flex items-start">
                        <ClockIcon
                          size={16}
                          className="text-gray-400 mt-0.5 mr-2.5"
                        />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">SLA</p>
                          <p className="font-medium text-sm">
                            {request.sla} days
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* {request.description && (
                                        <div className="mt-5 pt-4 border-t border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1.5">
                                                Description
                                            </p>
                                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
                                                {request.description}
                                            </p>
                                        </div>
                                    )} */}
                </div>
                {/* Requester Information */}
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Requester Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="flex items-start">
                      <UserIcon
                        size={16}
                        className="text-gray-400 mt-0.5 mr-2.5"
                      />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Name</p>
                        <p className="font-medium text-sm">
                          {request.requestedBy.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <TagIcon
                        size={16}
                        className="text-gray-400 mt-0.5 mr-2.5 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-medium break-all">
                          {request.requestedBy.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BuildingIcon
                        size={16}
                        className="text-gray-400 mt-0.5 mr-2.5"
                      />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Company</p>
                        <p className="text-sm font-medium">
                          {request.requestedBy.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - Activity timeline */}
              {/* <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-5 border border-gray-200 sticky top-20">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Activity Timeline
                  </h3>
                  <div className="space-y-4">
                    {generateTimeline().map((event, index) => (
                      <div key={index} className="relative pl-6 pb-4">
                        <div
                          className={`absolute left-0 top-0 w-4 h-4 rounded-full ${
                            event.type === "approved"
                              ? "bg-green-100"
                              : event.type === "rejected"
                              ? "bg-red-100"
                              : "bg-blue-100"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              event.type === "approved"
                                ? "bg-green-500"
                                : event.type === "rejected"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          />
                        </div>
                        {index < generateTimeline().length - 1 && (
                          <div className="absolute left-2 top-4 bottom-0 w-[1px] bg-gray-200" />
                        )}
                        <div>
                          <div className="flex items-center">
                            <span
                              className={`mr-2 ${
                                event.type === "approved"
                                  ? "text-green-500"
                                  : event.type === "rejected"
                                  ? "text-red-500"
                                  : "text-blue-500"
                              }`}
                            >
                              {event.icon}
                            </span>
                            <p className="font-medium text-sm">{event.title}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDateTime(event.date)}
                          </p>
                          {event.description && (
                            <p className="text-sm text-gray-700 mt-1">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {generateTimeline().length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No activity recorded yet
                      </p>
                    )}
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
