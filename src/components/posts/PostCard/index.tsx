import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostCardBase } from './PostCardBase';
import { PostCardText } from './PostCardText';
import { PostCardMedia } from './PostCardMedia';
import { PostCardPoll } from './PostCardPoll';
import { PostCardEvent } from './PostCardEvent';
import { PostCardAnnouncement } from './PostCardAnnouncement';
import { BasePost } from '../types';
import { usePermissions } from '../../hooks/usePermissions';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/UnifiedAuthProvider';
import { supabase } from '../../../supabase/client';
interface PostCardProps {
  post: BasePost;
  onActionComplete?: () => void;
}
export function PostCard({
  post,
  onActionComplete
}: PostCardProps) {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [helpfulCount, setHelpfulCount] = useState(post.helpful_count || 0);
  const [insightfulCount, setInsightfulCount] = useState(post.insightful_count || 0);
  const [hasReactedHelpful, setHasReactedHelpful] = useState(false);
  const [hasReactedInsightful, setHasReactedInsightful] = useState(false);
  const {
    canModeratePosts
  } = usePermissions(user?.role as 'admin' | 'moderator' | 'member' | undefined);

  // Check if post is hidden/flagged and user is not a moderator
  const isHiddenFromUser = (post.status === 'flagged' || post.status === 'deleted') && !canModeratePosts;
  useEffect(() => {
    if (user) {
      checkUserReactions();
    }
  }, [user, post.id]);
  const checkUserReactions = async () => {
    if (!user) return;
    const {
      data
    } = await supabase.from('reactions').select('reaction_type').eq('post_id', post.id).eq('user_id', user.id);
    if (data) {
      setHasReactedHelpful(data.some(r => r.reaction_type === 'helpful'));
      setHasReactedInsightful(data.some(r => r.reaction_type === 'insightful'));
    }
  };
  const handleReaction = async (type: 'helpful' | 'insightful') => {
    if (!user) {
      navigate('/');
      return;
    }
    const hasReacted = type === 'helpful' ? hasReactedHelpful : hasReactedInsightful;
    if (hasReacted) {
      await supabase.from('reactions').delete().eq('post_id', post.id).eq('user_id', user.id).eq('reaction_type', type);
      if (type === 'helpful') {
        setHelpfulCount(prev => prev - 1);
        setHasReactedHelpful(false);
      } else {
        setInsightfulCount(prev => prev - 1);
        setHasReactedInsightful(false);
      }
    } else {
      await supabase.from('reactions').insert({
        post_id: post.id,
        user_id: user.id,
        reaction_type: type
      });
      if (type === 'helpful') {
        setHelpfulCount(prev => prev + 1);
        setHasReactedHelpful(true);
      } else {
        setInsightfulCount(prev => prev + 1);
        setHasReactedInsightful(true);
      }
    }
  };
  const renderPostContent = () => {
    switch (post.post_type) {
      case 'media':
        return <PostCardMedia post={post} />;
      case 'poll':
        return <PostCardPoll post={post} />;
      case 'event':
        return <PostCardEvent post={post} />;
      case 'announcement':
        return <PostCardAnnouncement post={post} />;
      case 'article':
      case 'text':
      default:
        return <PostCardText post={post} />;
    }
  };

  // Show collapsed placeholder for hidden posts (non-moderators)
  if (isHiddenFromUser) {
    return <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 font-medium">⚠️ This post is under review</p>
        <p className="text-sm text-gray-500 mt-1">
          This content has been flagged for moderation and is not currently visible.
        </p>
      </div>;
  }
  return <PostCardBase post={post} onReaction={handleReaction} hasReactedHelpful={hasReactedHelpful} hasReactedInsightful={hasReactedInsightful} helpfulCount={helpfulCount} insightfulCount={insightfulCount} highlightBorder={post.post_type === 'announcement'} onActionComplete={onActionComplete}>
      {renderPostContent()}
    </PostCardBase>;
}