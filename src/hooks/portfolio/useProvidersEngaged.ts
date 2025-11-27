import { useState, useEffect } from 'react';
import { useOrganizationInfo } from '../useOrganizationInfo';
import { API_BASE_URL } from '../../config/analytics_api';

export const useProvidersEngaged = (groupBy?: string, startDate?: string, endDate?: string, serviceCategory?: string, providerId?: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { organization } = useOrganizationInfo();

  useEffect(() => {
    setData(null);
    setLoading(true);
    const fetchData = async () => {
      const azureId = organization?.azureid;
      if (!azureId) return;
      try {
        const params = new URLSearchParams({ azureId });
        if (groupBy) params.append('groupBy', groupBy);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (serviceCategory && serviceCategory !== 'all') params.append('serviceCategory', serviceCategory);
        if (providerId && providerId !== 'all') params.append('providerId', providerId);
        
        const url = `${API_BASE_URL}/api/portfolio/providers-engaged?${params.toString()}`;
        console.log('Providers Engaged API Call:', url, { providerId });
        const response = await fetch(url);
        const result = await response.json();
        console.log('Providers Engaged Response:', result);
        setData(result.data);
      } catch (error) {
        console.error('Failed to fetch providers engaged:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [organization?.azureid, groupBy, startDate, endDate, serviceCategory, providerId]);

  return { data, loading };
};
