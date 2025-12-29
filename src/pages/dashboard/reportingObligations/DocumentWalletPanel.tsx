import React from "react";
import { Link } from "react-router-dom";
import {
  FileTextIcon,
  DownloadIcon,
  EyeIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Can } from "../../../components/RBAC/Can";
export function DocumentWalletPanel({ documents }) {
  return (
    <div className="bg-white rounded-lg shadow-sm h-full w-full flex flex-col border border-gray-200">
      <div className="border-b border-gray-200 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Document Wallet</h2>
          <p className="text-sm text-gray-600">
            Your uploaded report documents
          </p>
        </div>
        <Can I="read" a="user-reporting">
          <Link
            to="/dashboard/documents"
            className="text-sm font-bold whitespace-nowrap flex items-center"
            style={{ color: '#9b1823' }}
          >
            View All
            <ChevronRightIcon size={14} className="ml-1" />
          </Link>
        </Can>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No documents found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
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
                      {doc.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {doc.category} • {doc.fileSize}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Can I="read" a="user-reporting">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      style={{ color: '#9b1823' }}
                      onClick={() => console.log("Download doc", doc.id)}
                      title="Download"
                    >
                      <DownloadIcon size={16} />
                    </button>
                  </Can>
                  <Can I="read" a="user-reporting">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      style={{ color: '#9b1823' }}
                      onClick={() => console.log("View doc", doc.id)}
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
