import { useState, useEffect } from 'react';
import { getServiceTypes } from '../../utils/serviceCategoryMapping';

export const useServiceTypesList = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setData(getServiceTypes());
    } catch (error) {
      console.error('Failed to fetch service types:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading };
};
