import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  UserIcon,
  ArrowUpRightIcon,
  AlertCircleIcon,
  ClockIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Can } from "../../../components/RBAC/Can";
export function UpcomingObligations({ obligations }) {
  // Function to determine status styling
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "overdue":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircleIcon size={12} className="mr-1" />
            Overdue
          </span>
        );
      case "due soon":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <ClockIcon size={12} className="mr-1" />
            Due Soon
          </span>
        );
      case "upcoming":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#9b18232a', color: '#9b1823' }}>
            <CalendarIcon size={12} className="mr-1" />
            Upcoming
          </span>
        );
    }
  };
  // Function to determine action button based on status
  const getActionButton = (obligation) => {
    switch (obligation.status.toLowerCase()) {
      case "overdue":
        return (
          <Can I="create" a="user-reporting">
            <button
              className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center"
              onClick={() => console.log("Submit report", obligation.id)}
            >
              Submit Now
              <ArrowUpRightIcon size={12} className="ml-1" />
            </button>
          </Can>
        );
      case "due soon":
        return (
          <Can I="create" a="user-reporting">
            <button
              className="px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-colors flex items-center"
              style={{ backgroundColor: '#9b1823' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a1319'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9b1823'}
              onClick={() => console.log("Prepare report", obligation.id)}
            >
              Prepare
              <ArrowUpRightIcon size={12} className="ml-1" />
            </button>
          </Can>
        );
      case "upcoming":
      default:
        return (
          <Can I="read" a="user-reporting">
            <button
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center"
              style={{ color: '#9b1823' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9b18232a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
              onClick={() => console.log("View report", obligation.id)}
            >
              View
              <ArrowUpRightIcon size={12} className="ml-1" />
            </button>
          </Can>
        );
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm h-full w-full flex flex-col border border-gray-200">
      <div className="border-b border-gray-200 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Upcoming Obligations
          </h2>
          <p className="text-sm text-gray-600">Reports you need to file soon</p>
        </div>
        <Can I="read" a="user-reporting">
          <Link
            to="/dashboard/reporting-obligations/obligations"
            className="text-sm font-bold whitespace-nowrap flex items-center"
            style={{ color: '#9b1823' }}
          >
            View All
            <ChevronRightIcon size={14} className="ml-1" />
          </Link>
        </Can>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        {obligations.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No upcoming obligations found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {obligations.map((obligation) => (
              <div
                key={obligation.id}
                className="p-3 bg-white rounded-xl border border-gray-200 transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9b18232a'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1 flex-1 mr-3">
                    {obligation.name}
                  </h3>
                  {getStatusBadge(obligation.status)}
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col space-y-1 text-xs text-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon
                        size={12}
                        className="mr-1.5 text-gray-400"
                      />
                      <span>Due: {obligation.dueDate}</span>
                    </div>
                    <div className="flex items-center">
                      <UserIcon size={12} className="mr-1.5 text-gray-400" />
                      <span>Assigned to: {obligation.assignedTo}</span>
                    </div>
                  </div>
                  <div>{getActionButton(obligation)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
