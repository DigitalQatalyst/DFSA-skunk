import React from 'react';
import { Calendar, MapPin, ImageIcon, BarChart3 } from 'lucide-react';
interface PostTypeContentProps {
  post: {
    post_type?: string;
    content: string;
    metadata?: any;
  };
}
export function PostTypeContent({
  post
}: PostTypeContentProps) {
  // Media posts - show image thumbnail and caption
  if (post.post_type === 'media' && post.metadata?.media_url) {
    return <div className="space-y-2">
        <img src={post.metadata.media_url} alt={post.metadata.caption || 'Media post'} className="w-full h-48 object-cover rounded-lg" loading="lazy" onError={e => {
        e.currentTarget.style.display = 'none';
      }} />
        {post.metadata.caption && <p className="text-sm text-gray-600">{post.metadata.caption}</p>}
      </div>;
  }

  // Event posts - show event details with icons
  if (post.post_type === 'event' && post.metadata) {
    const startDate = post.metadata.start_datetime ? new Date(post.metadata.start_datetime) : null;
    return <div className="space-y-3">
        {post.metadata.image && <img src={post.metadata.image} alt="Event cover" className="w-full h-32 object-cover rounded-lg" loading="lazy" onError={e => {
        e.currentTarget.style.display = 'none';
      }} />}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          {startDate && <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-green-600" />
              <span>{startDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}</span>
            </div>}
          {post.metadata.location && <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="truncate max-w-[200px]">{post.metadata.location}</span>
            </div>}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
      </div>;
  }

  // Poll posts - show poll summary
  if (post.post_type === 'poll') {
    return <div className="space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Tap to vote in this poll</span>
        </div>
      </div>;
  }

  // Default text post - show content preview
  return <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
      {post.content?.substring(0, 200)}
      {post.content?.length > 200 && '...'}
    </p>;
}