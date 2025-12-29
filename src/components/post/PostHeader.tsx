import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { GradientAvatar } from '../../components/ui/gradient-avatar';
interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by?: string;
  author_username: string;
  author_avatar: string | null;
  community_id: string;
  community_name: string;
}
interface PostHeaderProps {
  post: Post;
}
export function PostHeader({
  post
}: PostHeaderProps) {
  return <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <Avatar className="h-8 w-8 border border-gray-200">
            <AvatarImage src={post.author_avatar || undefined} />
            <AvatarFallback className="p-0 overflow-hidden">
              <GradientAvatar seed={post.author_username} className="h-full w-full" />
            </AvatarFallback>
          </Avatar>
          {post.created_by ? <Link to={`/profile/${post.created_by}`} className="font-medium text-gray-700 hover:text-[#0030E3] transition-colors">
              {post.author_username}
            </Link> : <span className="font-medium text-gray-700">
              {post.author_username}
            </span>}
          <span className="text-gray-400">•</span>
          <Link to={`/community/${post.community_id}`} className="text-blue-600 hover:text-blue-700 transition-colors">
            {post.community_name}
          </Link>
          <span className="text-gray-400">•</span>
          <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      </div>
    </div>;
}