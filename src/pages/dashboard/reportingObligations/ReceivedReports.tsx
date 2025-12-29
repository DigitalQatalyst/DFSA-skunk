import React from "react";
import { Link } from "react-router-dom";
import {
  DownloadIcon,
  ArchiveIcon,
  EyeIcon,
  FileTextIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Can } from "../../../components/RBAC/Can";
export function ReceivedReports({ reports }) {
  return (
    <div className="bg-white rounded-lg shadow-sm h-full w-full flex flex-col border border-gray-200">
      <div className="border-b border-gray-200 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Received Reports</h2>
          <p className="text-sm text-gray-600">
            Reports sent to you by regulatory authorities and partners
          </p>
        </div>
        <Can I="read" a="user-reporting">
          <Link
            to="/dashboard/reporting-obligations/received"
            className="text-sm font-bold whitespace-nowrap flex items-center"
            style={{ color: '#9b1823' }}
          >
            View All
            <ChevronRightIcon size={14} className="ml-1" />
          </Link>
        </Can>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        {reports.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No received reports found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9b18232a'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#9b18232a' }}>
                    <FileTextIcon size={18} style={{ color: '#9b1823' }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">
                      {report.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      From: {report.source}
                    </div>
                    <div className="text-xs text-gray-500">
                      Received: {report.receivedDate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Can I="read" a="user-reporting">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      style={{ color: '#9b1823' }}
                      onClick={() => console.log("Download report", report.id)}
                      title="Download"
                    >
                      <DownloadIcon size={16} />
                    </button>
                  </Can>
                  <Can I="update" a="user-reporting">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      style={{ color: '#9b1823' }}
                      onClick={() => console.log("Archive report", report.id)}
                      title="Archive"
                    >
                      <ArchiveIcon size={16} />
                    </button>
                  </Can>
                  <Can I="read" a="user-reporting">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      style={{ color: '#9b1823' }}
                      onClick={() => console.log("View report", report.id)}
                      title="View"
                    >
                      <EyeIcon size={16} />
                    </button>
                  </Can>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
