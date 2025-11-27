import React, { useState } from 'react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Shield, EyeOff, Check, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/UnifiedAuthProvider';
import { toast } from 'sonner';
interface ModeratorToolbarProps {
  postId: string;
  communityId: string;
  currentStatus?: string;
  onActionComplete?: () => void;
}
export function ModeratorToolbar({
  postId,
  communityId,
  currentStatus,
  onActionComplete
}: ModeratorToolbarProps) {
  const {
    user
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleAction = async (action: 'approve' | 'hide' | 'delete' | 'warn') => {
    if (!user) return;
    setLoading(true);

    // Log the moderation action using secure RPC
    const {
      data: actionResult,
      error: actionError
    } = await supabase.rpc('create_moderation_action_secure', {
      p_moderator_email: user.email,
      p_action_type: action,
      p_target_type: 'post',
      p_target_id: postId,
      p_community_id: communityId,
      p_description: `${action} by moderator`,
      p_reason: `${action} by moderator`
    });
    const result = actionResult as {
      success: boolean;
      error?: string;
    } | null;
    if (actionError || result && !result.success) {
      toast.error(result?.error || 'Failed to perform action');
      setLoading(false);
      return;
    }

    // Update post status based on action
    if (action === 'hide' || action === 'delete') {
      const newStatus = action === 'delete' ? 'deleted' : 'flagged';
      const {
        error: updateError
      } = await supabase.from('posts').update({
        status: newStatus
      }).eq('id', postId);
      if (updateError) {
        toast.error('Failed to update post status');
      } else {
        toast.success(`Post ${action}d successfully`);
        onActionComplete?.();
      }
    } else if (action === 'approve') {
      const {
        error: updateError
      } = await supabase.from('posts').update({
        status: 'active'
      }).eq('id', postId);
      if (updateError) {
        toast.error('Failed to approve post');
      } else {
        toast.success('Post approved');
        onActionComplete?.();
      }
    } else if (action === 'warn') {
      toast.success('Warning sent to author');
    }
    setLoading(false);
  };
  return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={loading}>
          <Shield className="h-4 w-4" />
          Moderate
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleAction('approve')} className="gap-2">
          <Check className="h-4 w-4 text-green-600" />
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('hide')} className="gap-2">
          <EyeOff className="h-4 w-4 text-amber-600" />
          Hide
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('warn')} className="gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          Warn User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('delete')} className="gap-2 text-red-600">
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>;
}