import { useState, useEffect } from 'react';
import { useOrganizationInfo } from '../useOrganizationInfo';
import { API_BASE_URL } from '../../config/analytics_api';

export const usePartnersList = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { organization } = useOrganizationInfo();

  useEffect(() => {
    const fetchData = async () => {
      const azureId = organization?.azureid;
      if (!azureId) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/portfolio/partners-list?azureId=${azureId}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch partners list:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [organization?.azureid]);

  return { data, loading };
};
