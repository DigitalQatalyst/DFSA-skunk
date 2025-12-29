import React from 'react';
import { BasePost } from '../types';
import { Pin } from 'lucide-react';
import { Badge } from '../../ui/badge';
interface PostCardAnnouncementProps {
  post: BasePost;
}
export const PostCardAnnouncement: React.FC<PostCardAnnouncementProps> = ({
  post
}) => {
  const contentPreview = post.content?.substring(0, 200) || '';
  const hasMore = (post.content?.length || 0) > 200;
  return <div className="space-y-2">
      {/* Pinned indicator */}
      <div className="flex items-center gap-1.5 text-amber-700">
        <Pin className="h-4 w-4 fill-current" />
        <span className="text-xs font-semibold uppercase">Pinned Announcement</span>
      </div>
      
      <p className="text-sm text-gray-900 line-clamp-3 leading-relaxed font-medium">
        {contentPreview}
        {hasMore && '...'}
      </p>
      
      {post.metadata?.attachments && post.metadata.attachments.length > 0 && <Badge variant="outline" className="text-xs">
          {post.metadata.attachments.length} attachment{post.metadata.attachments.length > 1 ? 's' : ''}
        </Badge>}
    </div>;
};