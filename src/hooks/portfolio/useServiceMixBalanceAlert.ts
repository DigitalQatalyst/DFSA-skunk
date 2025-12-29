import { useState, useEffect } from 'react';
import { useOrganizationInfo } from '../useOrganizationInfo';
import { API_BASE_URL } from '../../config/analytics_api';

export const useServiceMixBalanceAlert = (startDate?: string, endDate?: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { organization } = useOrganizationInfo();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const azureId = organization?.azureid;
      if (!azureId) return;
      try {
        let url = `${API_BASE_URL}/api/portfolio/service-mix-balance-alert?azureId=${azureId}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch service mix balance alert:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [organization?.azureid, startDate, endDate]);

  return { data, loading };
};
