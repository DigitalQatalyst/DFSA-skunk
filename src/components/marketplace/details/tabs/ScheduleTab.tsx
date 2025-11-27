import React, { useMemo } from "react";
import { Calendar, MapPin } from "lucide-react";

export interface ScheduleTabProps {
  item: any;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ item }) => {
  const formattedStartDate = useMemo(() => {
    if (!item?.startDate) return "";
    try {
      const d = new Date(item.startDate);
      if (isNaN(d.getTime())) return String(item.startDate);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return String(item.startDate);
    }
  }, [item?.startDate]);

  const steps: Array<{ title: string; description?: string; cost?: string | number }> = useMemo(() => {
    const ap = Array.isArray(item?.applicationProcess) ? item.applicationProcess : [];
    return ap
      .map((s: any) => ({
        title: s?.title || (typeof s?.week === "number" ? `Week ${s.week}` : ""),
        description: typeof s?.description === "string" ? s.description : "",
        cost: s?.cost,
      }))
      .filter((s) => s.title);
  }, [item?.applicationProcess]);

  const formatCost = (val: any) => {
    if (val === undefined || val === null || val === "") return undefined;
    const num = typeof val === "number" ? val : parseFloat(String(val));
    if (!isNaN(num)) {
      const rounded = Math.round(num);
      return `AED ${rounded.toLocaleString()}`;
    }
    // Fallback to raw string
    return `AED ${String(val)}`;
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-lg mb-6">Here's the complete schedule and timeline for this course.</p>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center mb-6 bg-blue-50 p-3 rounded-lg">
          <div className="flex-grow flex items-center">
            <Calendar className="text-blue-600 mr-3" size={18} />
            <div>
              <p className="font-medium text-gray-800">
                Start Date: <span className="text-blue-700">{formattedStartDate}</span>
              </p>
              <p className="text-sm text-gray-600">Duration: {item.duration}</p>
            </div>
          </div>
          <div className="mt-2 md:mt-0 md:ml-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
              {item.deliveryMode}
            </span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Timeline</h3>
        <div className="space-y-4">
          {steps.length > 0 ? (
            steps.map((s, idx) => (
              <div key={idx} className={`relative pl-8 ${idx < steps.length - 1 ? "pb-4" : ""} border-l-2 border-blue-200`}>
                <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                <h4 className="font-semibold text-gray-900">{s.title}</h4>
                {s.description && (
                  <p className="text-gray-700">{s.description}</p>
                )}
                {formatCost(s.cost) && (
                  <p className="text-gray-600 text-sm mt-1">Cost: {formatCost(s.cost)}</p>
                )}
              </div>
            ))
          ) : (
            <>
              <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
                <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                <h4 className="font-semibold text-gray-900">Week 1</h4>
                <p className="text-gray-700">Introduction and foundation concepts</p>
              </div>
              <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
                <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                <h4 className="font-semibold text-gray-900">Week 2</h4>
                <p className="text-gray-700">Core principles and practical exercises</p>
              </div>
            </>
          )}
        </div>
        {item.location && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <MapPin className="text-blue-600 mr-2" size={16} />
              Location Details
            </h4>
            <p className="text-gray-700 ml-6">{item.location}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleTab;
