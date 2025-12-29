import { useState, useEffect } from 'react';
import { getDateRanges } from '../../utils/serviceCategoryMapping';

export const useDateRangesList = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setData(getDateRanges());
    } catch (error) {
      console.error('Failed to fetch date ranges:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading };
};
