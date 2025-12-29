import React, { useState } from 'react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Textarea } from '../ui/textarea';
import { Shield, EyeOff, Check, Trash2, AlertTriangle, Copy, Eye, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/UnifiedAuthProvider';
import { toast } from 'sonner';
import { ModerationAPI } from '../../services/ModerationAPI';
import { useNavigate } from 'react-router-dom';
interface InlineModeratorControlsProps {
  postId: string;
  communityId: string;
  currentStatus?: string;
  onActionComplete?: () => void;
}
export function InlineModeratorControls({
  postId,
  communityId,
  currentStatus = 'active',
  onActionComplete
}: InlineModeratorControlsProps) {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState<'hide' | 'warn' | 'delete' | 'restore' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const handleQuickAction = async (action: 'approve' | 'restore') => {
    if (!user) return;
    setLoading(true);
    const result = await ModerationAPI.takeAction({
      targetType: 'post',
      targetId: postId,
      action,
      reason: 'Quick moderation action'
    }, user.email);
    if (result.success) {
      toast.success(`Content ${action}d successfully`);
      onActionComplete?.();
    } else {
      toast.error(result.error || 'Failed to perform action');
    }
    setLoading(false);
  };
  const handleActionWithReason = async () => {
    if (!user || !currentAction) return;
    setLoading(true);
    const result = await ModerationAPI.takeAction({
      targetType: 'post',
      targetId: postId,
      action: currentAction,
      reason: actionReason || undefined,
      message: currentAction === 'warn' ? actionReason : undefined
    }, user.email);
    if (result.success) {
      toast.success(`Content ${currentAction === 'delete' ? 'deleted' : currentAction === 'warn' ? 'warning sent' : `${currentAction}d`} successfully`);
      setActionReason('');
      setShowActionDialog(false);
      setCurrentAction(null);
      onActionComplete?.();
    } else {
      toast.error(result.error || 'Failed to perform action');
    }
    setLoading(false);
  };
  const openActionDialog = (action: 'hide' | 'warn' | 'delete' | 'restore') => {
    setCurrentAction(action);
    setActionReason('');
    setShowActionDialog(true);
  };
  const copyPostLink = () => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };
  const getActionDialogContent = () => {
    switch (currentAction) {
      case 'hide':
        return {
          title: 'Hide Content',
          description: 'Hide this post from public view. It will only be visible to moderators.',
          buttonText: 'Hide Content',
          buttonClass: 'bg-orange-600 hover:bg-orange-700'
        };
      case 'warn':
        return {
          title: 'Warn User',
          description: 'Send a warning to the content author. The content will be flagged but remain visible.',
          buttonText: 'Send Warning',
          buttonClass: 'bg-amber-600 hover:bg-amber-700'
        };
      case 'delete':
        return {
          title: 'Delete Content',
          description: 'Delete this post. Content can be restored later by moderators.',
          buttonText: 'Delete Content',
          buttonClass: 'bg-red-600 hover:bg-red-700'
        };
      case 'restore':
        return {
          title: 'Restore Content',
          description: 'Restore this post and make it visible to all users again.',
          buttonText: 'Restore Content',
          buttonClass: 'bg-green-600 hover:bg-green-700'
        };
      default:
        return {
          title: '',
          description: '',
          buttonText: '',
          buttonClass: ''
        };
    }
  };
  const dialogContent = getActionDialogContent();
  return <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-2 hover:bg-gray-100" disabled={loading}>
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm">Moderate</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white">
          <DropdownMenuItem onClick={() => navigate(`/moderation?postId=${postId}`)} className="gap-2">
            <Eye className="h-4 w-4 text-gray-600" />
            View Reports
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {currentStatus === 'active' ? <>
              <DropdownMenuItem onClick={() => openActionDialog('hide')} className="gap-2">
                <EyeOff className="h-4 w-4 text-orange-600" />
                Hide
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openActionDialog('warn')} className="gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Warn User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openActionDialog('delete')} className="gap-2 text-red-600">
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </> : <>
              <DropdownMenuItem onClick={() => handleQuickAction('approve')} className="gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickAction('restore')} className="gap-2">
                <RotateCcw className="h-4 w-4 text-blue-600" />
                Restore
              </DropdownMenuItem>
            </>}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyPostLink} className="gap-2">
            <Copy className="h-4 w-4 text-gray-600" />
            Copy Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Action Dialog */}
      <AlertDialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-gray-900 mb-2 block">
              Reason {currentAction === 'delete' || currentAction === 'warn' ? '(required)' : '(optional)'}
            </label>
            <Textarea value={actionReason} onChange={e => setActionReason(e.target.value)} placeholder="Explain the moderation action..." className="min-h-[80px]" />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleActionWithReason} disabled={loading || (currentAction === 'delete' || currentAction === 'warn') && !actionReason.trim()} className={`${dialogContent.buttonClass} text-white`}>
              {loading ? 'Processing...' : dialogContent.buttonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>;
}