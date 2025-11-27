import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react'

export interface Metric {
  id: string;
  label: string;
  value: number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    period: string;
  };
  navigateTo: string;
  theme?: {
    bgColor: string;
    borderColor: string;
    labelColor: string;
    valueColor: string;
    trendColor: string;
  };
}

interface MetricsOverviewProps {
  isLoading: boolean;
  metrics?: Metric[];
  error?: string | null;
  period?: '30d' | '90d' | '12m';
  onPeriodChange?: (period: '30d' | '90d' | '12m') => void;
  enterpriseId?: string; // Enterprise ID for fetching real data
}

// API function to fetch metrics
const fetchMetric = async (endpoint: string, enterpriseId: string): Promise<Metric | null> => {
  try {
    const response = await fetch(`http://localhost:5000/api/metrics/${endpoint}/${enterpriseId}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error(`Failed to fetch ${endpoint}:`, result.error);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
};

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  isLoading,
  metrics,
  error,
  period = '30d',
  onPeriodChange,
  enterpriseId, // Must come from logged-in user
}) => {
  const navigate = useNavigate();
  const [realMetrics, setRealMetrics] = useState<Metric[]>([]);
  const [fetchingMetrics, setFetchingMetrics] = useState(false);
  
  // Fetch real metrics from backend
  useEffect(() => {
    const loadRealMetrics = async () => {
      if (!enterpriseId) {
        console.warn('[MetricsOverview] No enterprise ID available');
        return;
      }
      
      setFetchingMetrics(true);
      
      const [serviceRequests, pendingApplications, reportingObligations, approvalsPending] = await Promise.all([
        fetchMetric('service-requests', enterpriseId),
        fetchMetric('pending-applications', enterpriseId),
        fetchMetric('reporting-obligations', enterpriseId),
        fetchMetric('approvals-pending', enterpriseId)
      ]);
      
      const loadedMetrics: Metric[] = [];
      
      // Add real metrics from API
      if (serviceRequests) loadedMetrics.push(serviceRequests);
      if (pendingApplications) loadedMetrics.push(pendingApplications);
      if (reportingObligations) loadedMetrics.push(reportingObligations);
      if (approvalsPending) loadedMetrics.push(approvalsPending);
      

      setRealMetrics(loadedMetrics);
      setFetchingMetrics(false);
    };
    
    loadRealMetrics();
  }, [enterpriseId]);
  
  // Handle card click navigation
  const handleCardClick = (cardId: string) => {
    const metric = displayMetrics.find(m => m.id === cardId);
    if (metric?.navigateTo) {
      navigate(metric.navigateTo);
    }
  };

  // Use real metrics if available, otherwise fall back to provided metrics or empty array
  const displayMetrics = realMetrics.length > 0 ? realMetrics : (metrics || []);

  if (isLoading || fetchingMetrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white p-4 rounded-lg shadow-sm animate-pulse"
          >
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 p-4 bg-red-50 rounded-lg">
        <div className="flex items-center">
          <TrendingUpIcon className="h-5 w-5 mr-2" />
          <span>Failed to load metrics: {error}</span>
        </div>
      </div>
    );
  }

  if (!displayMetrics || displayMetrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <p className="text-gray-600 mb-2">No metrics available</p>
        <p className="text-sm text-gray-500">Metrics will appear here once data is available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          {period === '30d' ? 'Last 30 days' : period === '90d' ? 'Last 90 days' : 'Last 12 months'}
          {enterpriseId && <span className="ml-2 text-xs">(Enterprise: {enterpriseId.substring(0, 8)}...)</span>}
        </div>
        {onPeriodChange && (
          <div className="flex gap-2">
            {(['30d', '90d', '12m'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`text-xs px-2 py-1 rounded ${
                  period === p
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {p === '30d' ? '30d' : p === '90d' ? '90d' : '12m'}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {displayMetrics.map((card) => {
          // Generate theme colors if not provided
          const theme = card.theme || {
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            labelColor: 'text-blue-700',
            valueColor: 'text-blue-900',
            trendColor: 'text-blue-600',
          };
          
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`${theme.bgColor} p-4 rounded-lg border ${theme.borderColor} transition-all hover:shadow-md hover:shadow-lg cursor-pointer hover:scale-105 transform`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(card.id);
                }
              }}
              aria-label={`Navigate to ${card.label} page`}
            >
              <div className={`text-sm font-medium ${theme.labelColor} mb-1`}>
                {card.label}
              </div>
              <div className={`text-3xl font-bold ${theme.valueColor} mb-2`}>
                {card.value}
              </div>
              {card.trend && (
                <div
                  className={`flex items-center text-xs font-medium ${theme.trendColor}`}
                >
                  {card.trend.direction === 'up' && (
                    <TrendingUpIcon className="h-4 w-4 mr-1" />
                  )}
                  {card.trend.direction === 'down' && (
                    <TrendingDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span>
                    {card.trend.value} {card.trend.period}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
