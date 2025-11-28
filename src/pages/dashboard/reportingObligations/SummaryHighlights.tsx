import React from "react";
import {
  FileTextIcon,
  CheckIcon,
  ClockIcon,
  AlertCircleIcon,
} from "lucide-react";
export function SummaryHighlights({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900">Summary</h2>
        <p className="text-sm text-gray-600">
          Overview of your reporting activity and compliance status
        </p>
      </div>
      <div className="p-6">
        {/* KPIs in a grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Reports */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#9b18232a' }}>
                <FileTextIcon size={20} style={{ color: '#9b1823' }} />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Total Reports
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {data.totalReports}
            </div>
          </div>
          {/* Completed */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <CheckIcon size={20} className="text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Completed
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {data.completed}
            </div>
          </div>
          {/* Pending */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <ClockIcon size={20} className="text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Pending</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {data.pending}
            </div>
          </div>
          {/* Overdue */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <AlertCircleIcon size={20} className="text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {data.overdue}
            </div>
          </div>
        </div>
        {/* Compliance Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium text-gray-800">
              Compliance Rate
            </h3>
            <div className="flex items-center">
              <span className="text-2xl font-bold" style={{ color: '#9b1823' }}>
                {data.complianceRate}%
              </span>
              <span className="text-sm text-gray-500 ml-2">/ 100%</span>
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: `${data.complianceRate}%`,
                backgroundColor: '#9b1823'
              }}
            ></div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#9b1823' }}></div>
              <span className="text-xs text-gray-600">Current Rate</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 border border-dashed rounded-full mr-2" style={{ borderColor: '#9b1823' }}></div>
              <span className="text-xs text-gray-600">Target (100%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
