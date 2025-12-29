import { useState, useEffect } from 'react';
import { useOrganizationInfo } from '../useOrganizationInfo';
import { API_BASE_URL } from '../../config/analytics_api';

export const useProviderCoverage = (startDate?: string, endDate?: string, serviceCategory?: string, providerId?: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { organization } = useOrganizationInfo();

  useEffect(() => {
    setLoading(true);
    setData(null);
    const fetchData = async () => {
      const azureId = organization?.azureid;
      if (!azureId) return;
      try {
        const params = new URLSearchParams({ azureId });
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (serviceCategory && serviceCategory !== 'all') params.append('serviceCategory', serviceCategory);
        if (providerId && providerId !== 'all') params.append('providerId', providerId);
        const response = await fetch(`${API_BASE_URL}/api/portfolio/provider-coverage/?${params}`);
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Failed to fetch provider coverage:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [organization?.azureid, startDate, endDate, serviceCategory, providerId]);

  return { data, loading };
};
