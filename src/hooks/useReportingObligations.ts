import { useState, useEffect } from 'react';
import { Obligation } from '../pages/dashboard/overview/ObligationsDeadlines';
import { API_BASE_URL } from '../config/apiBase';

interface ApiObligation {
  id?: string;
  kf_reportingobligationid?: string;
  kf_name?: string;
  name?: string;
  kf_duedate?: string;
  dueDate?: string;
  statuscode?: number;
  kf_obligationtype?: string;
  type?: string;
  kf_actionurl?: string;
  actionUrl?: string;
  // Add more potential field variations based on API response
  [key: string]: any;
}

interface UseReportingObligationsReturn {
  obligations: Obligation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch reporting obligations from the API
 * @param limit - Number of obligations to fetch (defaults to 3 for overview)
 */
export const useReportingObligations = (limit = 3): UseReportingObligationsReturn => {
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObligations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/reports/reportingobligations`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        // Silently handle errors - will show empty state
        console.warn('Reporting obligations endpoint returned error:', response.status);
        setObligations([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('📦 [useReportingObligations] Raw API response:', data);
      
      // Handle different response structures
      let apiObligations: ApiObligation[] = [];
      if (Array.isArray(data)) {
        apiObligations = data;
      } else if (data.data && Array.isArray(data.data)) {
        apiObligations = data.data;
      } else if (data.obligations && Array.isArray(data.obligations)) {
        apiObligations = data.obligations;
      } else if (data.value && Array.isArray(data.value)) {
        apiObligations = data.value;
      }

      console.log('🔄 [useReportingObligations] Extracted obligations array:', apiObligations);

      // Transform API data to match our Obligation interface
      const transformedObligations: Obligation[] = apiObligations
        .map((item: ApiObligation) => {
          const transformed = {
            id: item.id || item.kf_reportingobligationid || '',
            title: item.kf_name || item.name || 'Untitled Obligation',
            dueDate: item.kf_duedate || item.dueDate || '',
            status: mapStatusCodeToStatus(item.statuscode),
            type: mapObligationType(item.kf_obligationtype || item.type),
            actionUrl: item.kf_actionurl || item.actionUrl || '/dashboard/reporting-obligations',
          };
          console.log('🔄 [useReportingObligations] Transformed item:', { original: item, transformed });
          return transformed;
        })
        .filter((obligation) => {
          // Filter for upcoming obligations only
          if (!obligation.id || !obligation.title) {
            console.log('❌ [useReportingObligations] Filtered out (missing id/title):', obligation);
            return false;
          }
          const dueDate = new Date(obligation.dueDate);
          if (obligation.status === 'completed' || isNaN(dueDate.getTime())) {
            console.log('❌ [useReportingObligations] Filtered out (completed/invalid date):', obligation);
            return false;
          }
          console.log('✅ [useReportingObligations] Keeping obligation:', obligation);
          return true;
        })
        .sort((a, b) => {
          // Sort by due date (earliest first)
          const dateA = new Date(a.dueDate).getTime();
          const dateB = new Date(b.dueDate).getTime();
          return dateA - dateB;
        })
        .slice(0, limit); // Limit results for overview

      console.log('✅ [useReportingObligations] Final transformed obligations:', transformedObligations);
      setObligations(transformedObligations);
    } catch (err) {
      console.error('Error fetching reporting obligations:', err);
      // Silently fail - will show empty state UI
      setObligations([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObligations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  return {
    obligations,
    loading,
    error,
    refetch: fetchObligations,
  };
};

/**
 * Map Dataverse status code to obligation status
 */
function mapStatusCodeToStatus(statuscode?: number): 'overdue' | 'upcoming' | 'completed' {
  if (!statuscode) return 'upcoming';
  
  // Common Dataverse status codes
  // Adjust these based on your actual Dataverse configuration
  switch (statuscode) {
    case 1: // Active/Open
      return 'upcoming';
    case 2: // Completed
      return 'completed';
    case 3: // Overdue
      return 'overdue';
    default:
      return 'upcoming';
  }
}

/**
 * Map obligation type from API to our type system
 */
function mapObligationType(type?: string): 'reporting' | 'review' | 'license' {
  if (!type) return 'reporting';
  
  const lowerType = type.toLowerCase();
  
  if (lowerType.includes('report')) return 'reporting';
  if (lowerType.includes('review')) return 'review';
  if (lowerType.includes('license')) return 'license';
  
  return 'reporting'; // Default
}
