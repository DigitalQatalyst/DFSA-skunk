import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
};

export const KPICardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-10 w-24 mb-2" />
      <Skeleton className="h-3 w-full mb-4" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
};

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = '450px' }) => {
  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm" style={{ height }}>
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-full mb-6" />
      <Skeleton className="h-full w-full" />
    </div>
  );
};
