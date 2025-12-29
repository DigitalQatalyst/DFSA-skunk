import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import { safeFetch } from '@/utils/safeFetch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, FileText, Eye, ChevronRight, ThumbsUp, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
interface Post {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  author: string | null;
  author_id: string | null;
  author_avatar: string | null;
  community_name: string;
  community_id: string;
}
interface PostListProps {
  communityId: string;
  refreshKey?: number;
  hideCommunityName?: boolean;
}
export function PostList({
  communityId,
  refreshKey = 0,
  hideCommunityName = false
}: PostListProps) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchPosts();
  }, [communityId, refreshKey]);
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    const query = supabase.from('posts').select(`
        id,
        title,
        content,
        created_at,
        community_id,
        users_local (
          id,
          username,
          avatar_url
        ),
        communities (
          id,
          name
        )
      `).eq('community_id', communityId).order('created_at', {
      ascending: false
    });
    const [data, err] = await safeFetch(query);
    if (err) {
      setError('Failed to load posts');
      setLoading(false);
      return;
    }
    if (data) {
      const postList = data.map((p: any) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        created_at: p.created_at,
        author: p.users_local?.username || 'Unknown',
        author_id: p.users_local?.id || null,
        author_avatar: p.users_local?.avatar_url || null,
        community_name: p.communities?.name || 'Unknown',
        community_id: p.communities?.id || communityId
      }));
      setPosts(postList);
    }
    setLoading(false);
  };
  if (loading) {
    return <div className="space-y-6">
        {[...Array(3)].map((_, i) => <Card key={i} className="shadow-sm border-gray-200/60 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>)}
      </div>;
  }
  if (error) {
    return <Card className="shadow-sm border-red-200 bg-red-50/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 flex-1">{error}</p>
            <Button size="sm" variant="outline" onClick={fetchPosts}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>;
  }
  if (posts.length === 0) {
    return <Card className="shadow-sm border-gray-200/60">
        <CardContent className="pt-6">
          <div className="border-dashed border-2 border-gray-200 rounded-xl p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No posts yet
            </h3>
            <p className="text-sm text-gray-500">
              Start the conversation by creating the first post!
            </p>
          </div>
        </CardContent>
      </Card>;
  }
  return <div className="space-y-6">
      {posts.map(post => <Card key={post.id} className="shadow-sm border-gray-200/60 hover:shadow-md transition-all overflow-hidden cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
          <div className="h-1 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl leading-tight hover:text-indigo-600 transition-colors">
              {post.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1.5">
              <Avatar className="h-5 w-5">
                <AvatarImage src={post.author_avatar || undefined} />
                <AvatarFallback className="text-xs bg-indigo-100 text-indigo-600">
                  {post.author?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <button className="hover:text-indigo-600 transition-colors font-medium" onClick={e => {
            e.stopPropagation();
            if (post.author_id) {
              navigate(`/profile/${post.author_id}`);
            }
          }}>
                {post.author}
              </button>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true
            })}
              </span>
              {/* Only show community name if not hidden */}
              {!hideCommunityName && <>
                  <span>•</span>
                  <button className="text-gray-600 font-medium hover:text-indigo-600 transition-colors" onClick={e => {
              e.stopPropagation();
              navigate(`/community/${post.community_id}`);
            }}>
                    {post.community_name}
                  </button>
                </>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 line-clamp-3">
              {post.content || 'No content'}
            </p>
            <div className="flex items-center justify-between pt-2">
              {/* Interaction metrics */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{Math.floor(Math.random() * 25)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  <span>{Math.floor(Math.random() * 10)}</span>
                </div>
              </div>
              {/* Read link */}
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={e => {
            e.stopPropagation();
            navigate(`/post/${post.id}`);
          }}>
                Read <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>)}
    </div>;
}