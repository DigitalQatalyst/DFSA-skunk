import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  EyeIcon,
  DownloadIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { Can } from "../../../components/RBAC/Can";
export function SubmittedReports({ reports }) {
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;
  const [expandedRows, setExpandedRows] = useState([]);
  // Calculate pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(reports.length / reportsPerPage);
  // Toggle row expansion for mobile view
  const toggleRowExpansion = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon size={12} className="mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon size={12} className="mr-1" />
            Rejected
          </span>
        );
      case "pending review":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <ClockIcon size={12} className="mr-1" />
            Pending Review
          </span>
        );
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full border border-gray-200">
      <div className="border-b border-gray-200 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Submitted Reports</h2>
          <p className="text-sm text-gray-600">
            Reports you've filed with regulatory authorities
          </p>
        </div>
        <Can I="read" a="user-reporting">
          <Link
            to="/dashboard/reporting-obligations/submitted"
            className="text-sm font-bold whitespace-nowrap flex items-center"
            style={{ color: '#9b1823' }}
          >
            View All
            <ChevronRightIcon size={14} className="ml-1" />
          </Link>
        </Can>
      </div>
      <div className="p-6">
        {reports.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No submitted reports found.</p>
          </div>
        ) : (
          <>
            {/* Desktop view */}
            <div className="hidden md:block">
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Report Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Submitted Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Reviewer
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {report.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {report.type}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {report.submittedDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {report.reviewer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <Can I="read" a="user-reporting">
                            <button
                              className="mr-3"
                              style={{ color: '#9b1823' }}
                              onClick={() =>
                                console.log("View report", report.id)
                              }
                            >
                              <EyeIcon size={16} />
                            </button>
                          </Can>
                          <Can I="read" a="user-reporting">
                            <button
                              style={{ color: '#9b1823' }}
                              onClick={() =>
                                console.log("Download report", report.id)
                              }
                            >
                              <DownloadIcon size={16} />
                            </button>
                          </Can>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Mobile view */}
            <div className="md:hidden space-y-3">
              {currentReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => toggleRowExpansion(report.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {report.name}
                        </h3>
                        <div className="mb-2">
                          {getStatusBadge(report.status)}
                        </div>
                        <p className="text-xs text-gray-500">
                          {report.type} • {report.submittedDate}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {expandedRows.includes(report.id) ? (
                          <ChevronUpIcon size={16} className="text-gray-400" />
                        ) : (
                          <ChevronDownIcon
                            size={16}
                            className="text-gray-400"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedRows.includes(report.id) && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500 mb-2">
                        Reviewer: {report.reviewer}
                      </p>
                      <div className="flex justify-end space-x-2 mt-3">
                        <Can I="read" a="user-reporting">
                          <button
                            className="px-3 py-1.5 text-xs bg-white border rounded-lg font-bold"
                            style={{ color: '#9b1823', borderColor: '#9b18232a' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9b18232a'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("View report", report.id);
                            }}
                          >
                            <EyeIcon size={14} className="inline mr-1" />
                            View
                          </button>
                        </Can>
                        <Can I="read" a="user-reporting">
                          <button
                            className="px-3 py-1.5 text-xs bg-white border rounded-lg font-bold"
                            style={{ color: '#9b1823', borderColor: '#9b18232a' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9b18232a'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Download report", report.id);
                            }}
                          >
                            <DownloadIcon size={14} className="inline mr-1" />
                            Download
                          </button>
                        </Can>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstReport + 1} to{" "}
                  {Math.min(indexOfLastReport, reports.length)} of{" "}
                  {reports.length} reports
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-1 rounded-md ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeftIcon size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === i + 1
                          ? ""
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                      style={currentPage === i + 1 ? { backgroundColor: '#9b18232a', color: '#9b1823' } : {}}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-1 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRightIcon size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
