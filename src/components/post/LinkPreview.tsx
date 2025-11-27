import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
interface LinkPreviewProps {
  url: string;
  onRemove: () => void;
}
interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}
export function LinkPreview({
  url,
  onRemove
}: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simple metadata extraction (in production, use an API service)
    const fetchMetadata = async () => {
      try {
        // For now, just show a basic preview
        // In production, you'd call an OpenGraph scraper API
        setMetadata({
          title: url,
          description: 'Link preview',
          siteName: new URL(url).hostname
        });
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, [url]);
  if (loading) {
    return <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        <span className="text-xs text-gray-500">Loading preview...</span>
      </div>;
  }
  if (!metadata) return null;
  return <div className="border border-gray-200 rounded-lg overflow-hidden bg-white group hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-3 p-3">
        {metadata.image && <img src={metadata.image} alt={metadata.title} className="w-16 h-16 object-cover rounded flex-shrink-0" />}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {metadata.title || url}
              </p>
              {metadata.description && <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                  {metadata.description}
                </p>}
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                {metadata.siteName || new URL(url).hostname}
              </p>
            </div>
            
            <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>;
}