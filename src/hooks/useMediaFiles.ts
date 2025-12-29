import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

interface MediaFile {
  id: string;
  file_url: string;
  file_type: string;
  caption?: string;
  display_order?: number;
}

export function useMediaFiles(postId: string) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMediaFiles();
  }, [postId]);

  const fetchMediaFiles = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('media_files')
      .select('*')
      .eq('post_id', postId)
      .order('display_order', { ascending: true });

    if (data) {
      setMediaFiles(data as MediaFile[]);
    }
    setLoading(false);
  };

  return {
    mediaFiles,
    loading,
    refetch: fetchMediaFiles,
  };
}
