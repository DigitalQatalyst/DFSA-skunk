import React from "react";
import { CalendarIcon, AlertTriangleIcon, FileClockIcon } from "lucide-react";

import { Link } from "react-router-dom";

export interface Obligation {
  id: string;
  title: string;
  dueDate: string;
  status: 'overdue' | 'upcoming' | 'completed';
  type: 'reporting' | 'review' | 'license';
  actionUrl?: string;
}

interface ObligationsDeadlinesProps {
  isLoading: boolean;
  obligations?: Obligation[]; // Accept obligations from API (optional for now)
  error?: string | null;
  filters?: {
    window?: '30d' | 'overdue' | 'all';
  };
  onFilterChange?: (filters: { window?: '30d' | 'overdue' | 'all' }) => void;
}

export const ObligationsDeadlines: React.FC<ObligationsDeadlinesProps> = ({
  isLoading,
  obligations,
  error,
}) => {
  console.log('🎯 [ObligationsDeadlines] Received props:', {
    isLoading,
    obligationsCount: obligations?.length,
    obligations,
    error
  });
  const getStatusIcon = (status: string) => {
    if (status === "overdue") {
      return <AlertTriangleIcon className="h-5 w-5 text-red-500" />;
    }
    return <CalendarIcon className="h-5 w-5 text-dfsa-teal" />;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-16 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 p-4 bg-red-50 rounded-lg">
        <div className="flex items-center">
          <AlertTriangleIcon className="h-5 w-5 mr-2" />
          <span>Failed to load obligations: {error}</span>
        </div>
      </div>
    );
  }

  if (!obligations || obligations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <CalendarIcon className="h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600 mb-2">No obligations found</p>
        <p className="text-sm text-gray-500">You're all caught up! No upcoming obligations.</p>
      </div>
    );
  }

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Obligation
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Due Date
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {obligations.map((obligation) => (
              <tr key={obligation.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-2">
                      {getStatusIcon(obligation.status)}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        obligation.status === "overdue"
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {obligation.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">
                      {formatDate(obligation.dueDate)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                  <Link
                    to={obligation.actionUrl || "/dashboard/reporting-obligations"}
                    className="px-3 py-1 border border-primary-300 rounded-md text-xs text-primary hover:text-white hover:bg-primary hover:border-primary inline-block transition-all"
                  >
                    Take Action
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <Link
          to="/dashboard/reporting-obligations"
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          View All Obligations
        </Link>
      </div>
    </div>
  );
};
