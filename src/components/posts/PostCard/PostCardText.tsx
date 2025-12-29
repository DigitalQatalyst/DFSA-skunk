import React from 'react';
import { BasePost } from '../types';
import { Button } from '../../ui/button';
interface PostCardTextProps {
  post: BasePost;
}
export const PostCardText: React.FC<PostCardTextProps> = ({
  post
}) => {
  const contentPreview = post.content?.substring(0, 250) || '';
  const hasMore = (post.content?.length || 0) > 250;
  return <div className="space-y-2">
      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
        {contentPreview}
        {hasMore && '...'}
      </p>
      {hasMore && <Button variant="link" className="px-0 h-auto text-sm text-primary hover:text-primary/80 font-medium">
          Read more →
        </Button>}
    </div>;
};