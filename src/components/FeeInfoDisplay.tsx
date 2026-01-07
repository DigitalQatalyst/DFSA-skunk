import React from 'react';
import { DollarSign, Info } from 'lucide-react';

interface FeeInfo {
  id: string;
  type: string;
  amount: string;
  description: string;
}

interface FeeInfoDisplayProps {
  fees: FeeInfo[];
}

export const FeeInfoDisplay: React.FC<FeeInfoDisplayProps> = ({ fees }) => {
  if (!fees || fees.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-xs font-medium text-gray-600 px-2 flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-green-600" />
        Fee Information
      </div>

      <div className="grid grid-cols-1 gap-2">
        {fees.map((fee) => (
          <div
            key={fee.id}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{fee.type}</h4>
              <span className="text-lg font-bold text-green-600">{fee.amount}</span>
            </div>
            <p className="text-sm text-gray-700 flex gap-2">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>{fee.description}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
