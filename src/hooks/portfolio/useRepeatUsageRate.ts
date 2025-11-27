import { useState, useEffect } from 'react';
import { useOrganizationInfo } from '../useOrganizationInfo';
import { API_BASE_URL } from '../../config/analytics_api';

export const useRepeatUsageRate = (startDate?: string, endDate?: string, serviceCategory?: string, providerId?: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { organization } = useOrganizationInfo();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const azureId = organization?.azureid;
      if (!azureId) return;
      try {
        let url = `${API_BASE_URL}/api/portfolio/active-services/repeat-usage-rate?azureId=${azureId}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        if (serviceCategory && serviceCategory !== 'all') url += `&serviceCategory=${serviceCategory}`;
        if (providerId && providerId !== 'all') url += `&providerId=${providerId}`;
        
        const response = await fetch(url);
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Failed to fetch repeat usage rate:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [organization?.azureid, startDate, endDate, serviceCategory, providerId]);

  return { data, loading };
};
