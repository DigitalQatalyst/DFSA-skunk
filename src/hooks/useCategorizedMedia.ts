import { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '../services/supabaseClientKH';

// Known tags to categorize data
const TAGS = ['Article', 'Knowledge', 'Technology & Innovation'];

// Hook to fetch and categorize media items based on tags
export function useCategorizedMedia() {
  const [categorizedData, setCategorizedData] = useState({
    Article: [],
    Knowledge: [],
    'Technology & Innovation': [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategorizedData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch media items from Supabase
      const { data, error } = await getSupabase()
        .from('media_items')
        .select('*')
        .not('tags', 'is', null);  // Ensures that tags are not null

      if (error) throw error;

      // Categorize the data based on tags
      const categorized = {
        Article: [],
        Knowledge: [],
        'Technology & Innovation': [],
      };

      // Loop through the fetched items and categorize them
      data.forEach((item) => {
        item.tags.forEach((tag) => {
          if (TAGS.includes(tag)) {
            categorized[tag].push(item);
          }
        });
      });

      setCategorizedData(categorized);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching categorized data:', err);
      setError(err);
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCategorizedData();
  }, [fetchCategorizedData]);

  return {
    categorizedData,
    isLoading,
    error,
  };
}
