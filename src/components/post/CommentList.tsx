import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { safeFetch } from '../../utils/safeFetch';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Skeleton } from '../../components/ui/skeleton';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { HiddenContentPlaceholder } from '../../components/moderation/HiddenContentPlaceholder';
import { usePermissions } from '../../hooks/usePermissions';
interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_username: string;
  author_avatar: string | null;
  status: string;
}
interface CommentListProps {
  postId: string;
  refreshKey?: number;
  communityId?: string;
}
export function CommentList({
  postId,
  refreshKey,
  communityId
}: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const permissions = usePermissions(communityId);
  useEffect(() => {
    fetchComments();
  }, [postId, refreshKey]);
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    const query = supabase.from('comments').select(`
        id,
        content,
        status,
        created_at,
        created_by,
        users_local!comments_created_by_fkey (
          username,
          avatar_url
        )
      `).eq('post_id', postId).order('created_at', {
      ascending: true
    });
    const [data, err] = await safeFetch(query);
    if (err) {
      setError('Failed to load comments');
      setLoading(false);
      return;
    }
    if (data) {
      const formattedComments: Comment[] = data.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        status: comment.status || 'active',
        created_at: comment.created_at,
        author_username: comment.users_local?.username || 'Unknown',
        author_avatar: comment.users_local?.avatar_url || null
      }));
      setComments(formattedComments);
    }
    setLoading(false);
  };
  if (loading) {
    return <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="flex items-start gap-3 py-4 border-t first:border-t-0">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          </div>)}
      </div>;
  }
  if (error) {
    return <div className="border border-yellow-200 bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchComments}>
          Retry
        </Button>
      </div>;
  }
  if (comments.length === 0) {
    return <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
        <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          No comments yet. Be the first to share your thoughts!
        </p>
      </div>;
  }
  return <div className="space-y-4">
      {comments.map(comment => <div key={comment.id} className="flex items-start gap-3 py-4 border-t border-border first:border-t-0">
            <Avatar className="h-9 w-9">
              <AvatarImage src={comment.author_avatar || undefined} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {comment.author_username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="font-semibold text-foreground">
                  {comment.author_username}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-xs">
                  {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              
              {comment.status === 'flagged' || comment.status === 'deleted' ? <HiddenContentPlaceholder contentType="comment" canModerate={permissions.canModeratePosts}>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </HiddenContentPlaceholder> : <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>}
            </div>
        </div>)}
    </div>;
}