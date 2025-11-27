import { useState, useEffect } from 'react';
import { useOrganizationInfo } from '../useOrganizationInfo';
import { API_BASE_URL } from '../../config/analytics_api';

export const useNewVsRepeatOverTime = (year?: number, serviceCategory?: string, providerId?: string) => {
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
        const yearParam = year ? `&year=${year}` : '';
        const categoryParam = (serviceCategory && serviceCategory !== 'all') ? `&serviceCategory=${serviceCategory}` : '';
        const providerParam = (providerId && providerId !== 'all') ? `&providerId=${providerId}` : '';
        const response = await fetch(`${API_BASE_URL}/api/portfolio/new-vs-repeat/?azureId=${azureId}${yearParam}${categoryParam}${providerParam}`);
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Failed to fetch new vs repeat over time:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [organization?.azureid, year, serviceCategory, providerId]);

  return { data, loading };
};
