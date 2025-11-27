import { useState, useEffect } from 'react';
import { useOrganizationInfo } from '../useOrganizationInfo';
import { API_BASE_URL } from '../../config/analytics_api';
import { getServiceCategoryLabel, getSubServiceTypes } from '../../utils/serviceCategoryMapping';

export const useSubServicesList = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { organization } = useOrganizationInfo();

  useEffect(() => {
    const fetchData = async () => {
      const azureId = organization?.azureid;
      if (!azureId) return;
      try {
        const subServiceTypes = getSubServiceTypes();
        const mappedData = subServiceTypes.map((item: any) => ({
          value: item.value,
          label: getServiceCategoryLabel(item.value)
        }));
        setData(mappedData);
      } catch (error) {
        console.error('Failed to fetch sub-services list:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [organization?.azureid]);

  return { data, loading };
};
