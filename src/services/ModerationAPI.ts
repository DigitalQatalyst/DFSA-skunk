import { supabase } from '../supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { safeFetch } from '../utils/safeFetch';
export interface ModerationMetrics {
  totalReports: number;
  activeReports: number;
  resolvedReports: number;
  actionsTaken: number;
}
export interface ModerationReport {
  id: string;
  reportType: 'post' | 'comment';
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  reporterUsername: string;
  reporterAvatar: string | null;
  communityName: string;
  communityId: string;
  reason: string | null;
  targetId: string;
}
export interface RecentAction {
  id: string;
  actionType: string;
  description: string;
  createdAt: string;
  moderatorUsername: string;
  moderatorAvatar: string | null;
  targetType: string;
  targetId: string;
}
export interface TargetPreview {
  type: 'post' | 'comment';
  title?: string;
  content: string;
  authorUsername: string;
  authorAvatar: string | null;
  createdAt: string;
}
export interface ReportFilters {
  communityId?: string;
  status?: 'pending' | 'resolved' | 'dismissed';
  search?: string;
  page?: number;
  pageSize?: number;
}
export interface ActionParams {
  reportId?: string;
  targetType?: 'post' | 'comment';
  targetId?: string;
  action: 'approve' | 'hide' | 'warn' | 'dismiss' | 'delete' | 'restore';
  reason?: string;
  visibility?: 'hidden' | 'deleted';
  message?: string;
}
class ModerationAPIService {
  private subscriptions: Map<string, RealtimeChannel> = new Map();

  /**
   * Get moderation metrics/stats for dashboard header
   */
  async getMetrics(params: {
    communityId?: string;
  } = {}): Promise<ModerationMetrics | null> {
    try {
      const {
        communityId
      } = params;

      // Use reports_with_details view to bypass RLS issues
      let reportsQuery = supabase.from('reports_with_details').select('status');
      let actionsQuery = supabase.from('moderation_actions_with_details').select('id');
      if (communityId && communityId !== 'all') {
        reportsQuery = reportsQuery.eq('community_id', communityId);
        actionsQuery = actionsQuery.eq('community_id', communityId);
      }
      const [reportsData, actionsData] = await Promise.all([safeFetch(reportsQuery), safeFetch(actionsQuery)]);
      if (!reportsData[0]) return null;
      const reports = reportsData[0] as any[];
      const actions = actionsData[0] as any[] || [];
      return {
        totalReports: reports.length,
        activeReports: reports.filter(r => r.status === 'pending').length,
        resolvedReports: reports.filter(r => r.status === 'resolved').length,
        actionsTaken: actions.length
      };
    } catch (error) {
      console.error('Failed to fetch moderation metrics:', error);
      return null;
    }
  }

  /**
   * List reports with filters and pagination
   */
  async listReports(filters: ReportFilters = {}): Promise<ModerationReport[]> {
    try {
      const {
        communityId,
        status,
        search,
        page = 1,
        pageSize = 50
      } = filters;
      let query = supabase.from('reports_with_details').select('*').order('created_at', {
        ascending: false
      }).range((page - 1) * pageSize, page * pageSize - 1);
      if (communityId && communityId !== 'all') {
        query = query.eq('community_id', communityId);
      }
      if (status) {
        query = query.eq('status', status);
      }
      const [data] = await safeFetch(query);
      if (!data) return [];
      return data.map((item: any) => ({
        id: item.id,
        reportType: item.report_type,
        status: item.status,
        createdAt: item.created_at,
        reporterUsername: item.reporter_username || 'Unknown',
        reporterAvatar: item.reporter_avatar,
        communityName: item.community_name || 'Unknown',
        communityId: item.community_id,
        reason: item.reason,
        targetId: item.post_id || item.comment_id
      }));
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      return [];
    }
  }

  /**
   * Get recent moderation actions
   */
  async getRecentActions(params: {
    communityId?: string;
    limit?: number;
  } = {}): Promise<RecentAction[]> {
    try {
      const {
        communityId,
        limit = 10
      } = params;
      let query = supabase.from('moderation_actions_with_details').select('*').order('created_at', {
        ascending: false
      }).limit(limit);
      if (communityId && communityId !== 'all') {
        query = query.eq('community_id', communityId);
      }
      const [data] = await safeFetch(query);
      if (!data) return [];
      return data.map((item: any) => ({
        id: item.id,
        actionType: item.action_type,
        description: item.description,
        createdAt: item.created_at,
        moderatorUsername: item.moderator_username || 'Unknown',
        moderatorAvatar: item.moderator_avatar,
        targetType: item.target_type,
        targetId: item.target_id
      }));
    } catch (error) {
      console.error('Failed to fetch recent actions:', error);
      return [];
    }
  }

  /**
   * Get preview of reported content
   */
  async getTargetPreview(targetType: 'post' | 'comment', targetId: string): Promise<TargetPreview | null> {
    try {
      if (targetType === 'post') {
        const query = supabase.from('posts').select(`
            title,
            content,
            created_at,
            users_local!posts_created_by_fkey (
              username,
              avatar_url
            )
          `).eq('id', targetId).maybeSingle();
        const [data] = await safeFetch(query);
        if (!data) return null;
        return {
          type: 'post',
          title: data.title,
          content: data.content || '',
          authorUsername: data.users_local?.username || 'Unknown',
          authorAvatar: data.users_local?.avatar_url,
          createdAt: data.created_at
        };
      } else {
        const query = supabase.from('comments').select(`
            content,
            created_at,
            users_local!comments_created_by_fkey (
              username,
              avatar_url
            )
          `).eq('id', targetId).maybeSingle();
        const [data] = await safeFetch(query);
        if (!data) return null;
        return {
          type: 'comment',
          content: data.content || '',
          authorUsername: data.users_local?.username || 'Unknown',
          authorAvatar: data.users_local?.avatar_url,
          createdAt: data.created_at
        };
      }
    } catch (error) {
      console.error('Failed to fetch target preview:', error);
      return null;
    }
  }

  /**
   * Take moderation action on a report
   */
  async takeAction(params: ActionParams, userEmail: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const {
        reportId,
        targetType: paramTargetType,
        targetId: paramTargetId,
        action,
        reason = '',
        message
      } = params;
      let targetId: string;
      let targetType: 'post' | 'comment';
      let communityId: string;

      // If reportId is provided, fetch report details
      if (reportId) {
        const reportQuery = supabase.from('reports_with_details').select('report_type, post_id, comment_id, community_id').eq('id', reportId).maybeSingle();
        const [report] = await safeFetch(reportQuery);
        if (!report) {
          return {
            success: false,
            error: 'Report not found'
          };
        }
        targetId = report.post_id || report.comment_id;
        targetType = report.report_type;
        communityId = report.community_id;
      }
      // Otherwise, use direct target parameters
      else if (paramTargetType && paramTargetId) {
        targetType = paramTargetType;
        targetId = paramTargetId;

        // Fetch community_id from the target
        if (targetType === 'post') {
          const postQuery = supabase.from('posts').select('community_id').eq('id', targetId).maybeSingle();
          const [post] = await safeFetch(postQuery);
          communityId = post?.community_id || '';
        } else {
          const commentQuery = supabase.from('comments').select('post_id').eq('id', targetId).maybeSingle();
          const [comment] = await safeFetch(commentQuery);
          if (comment?.post_id) {
            const postQuery = supabase.from('posts').select('community_id').eq('id', comment.post_id).maybeSingle();
            const [post] = await safeFetch(postQuery);
            communityId = post?.community_id || '';
          } else {
            communityId = '';
          }
        }
      } else {
        return {
          success: false,
          error: 'Either reportId or targetType/targetId must be provided'
        };
      }
      if (!targetId) {
        return {
          success: false,
          error: 'Target content not found'
        };
      }

      // Map action to moderation action type
      let actionType: string = action;
      let updateStatus: 'resolved' | 'dismissed' = 'resolved';
      let contentStatus: 'active' | 'flagged' | 'deleted' | undefined;
      switch (action) {
        case 'approve':
        case 'restore':
          actionType = action;
          updateStatus = 'resolved';
          contentStatus = 'active';
          break;
        case 'hide':
          actionType = 'hide';
          updateStatus = 'resolved';
          contentStatus = 'flagged';
          break;
        case 'warn':
          actionType = 'warn';
          updateStatus = 'resolved';
          contentStatus = 'flagged';
          break;
        case 'dismiss':
          actionType = 'dismissed';
          updateStatus = 'dismissed';
          break;
        case 'delete':
          actionType = 'delete';
          updateStatus = 'resolved';
          contentStatus = 'deleted';
          break;
      }

      // Content status update is now handled by the RPC function
      // (moved to server-side to bypass RLS policies)
      console.log('📝 Action will update content status to:', contentStatus || 'unchanged');

      // Call the secure moderation action RPC
      const actionDescription = message || `${action.charAt(0).toUpperCase() + action.slice(1)} ${targetType}${reason ? `: ${reason}` : ''}`;
      const {
        data: result,
        error
      } = await supabase.rpc('create_moderation_action_secure', {
        p_moderator_email: userEmail,
        p_action_type: actionType,
        p_target_type: targetType,
        p_target_id: targetId,
        p_community_id: communityId,
        p_description: actionDescription,
        p_reason: reason || null
      });
      if (error) {
        console.error('RPC error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // Type-safe check of the result
      const resultData = result as any;
      if (!resultData?.success) {
        return {
          success: false,
          error: resultData?.error || 'Failed to create moderation action'
        };
      }

      // Update report status if reportId was provided
      if (reportId) {
        console.log('Updating report status:', reportId, 'to', updateStatus);

        // Get current user ID
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        const {
          data: updateResult,
          error: updateError
        } = await supabase.rpc('update_report_status_secure', {
          p_report_id: reportId,
          p_status: updateStatus,
          p_resolved_by: user?.id || null
        });
        if (updateError) {
          console.error('Failed to update report status:', updateError);
          // Don't fail the whole operation
        } else if (updateResult && !(updateResult as any).success) {
          console.error('Report update failed:', (updateResult as any).error);
        } else {
          console.log('Report status updated successfully:', updateResult);
        }
      }
      return {
        success: true
      };
    } catch (error) {
      console.error('Failed to take action:', error);
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Check if a post has a warning
   */
  async getPostWarning(postId: string, userId: string): Promise<{ hasWarning: boolean; reason?: string }> {
    try {
      console.log('🔎 getPostWarning called for postId:', postId, 'userId:', userId);
      
      if (!userId) {
        console.log('❌ No user ID provided');
        return { hasWarning: false };
      }

      // Call the RPC function that bypasses RLS
      const { data, error } = await supabase
        .rpc('get_post_warning_for_author', {
          p_post_id: postId,
          p_user_id: userId
        })
        .single();
      
      console.log('🔎 RPC result - data:', data, 'error:', error);

      if (error) {
        console.error('RPC error:', error);
        return { hasWarning: false };
      }

      if (data?.has_warning) {
        console.log('✅ Warning found:', data);
        return {
          hasWarning: true,
          reason: data.reason ?? undefined,
        };
      }

      console.log('❌ No warning found');
      return { hasWarning: false };
    } catch (error) {
      console.error('Failed to check post warning:', error);
      return { hasWarning: false };
    }
  }

  /**
   * Subscribe to realtime updates for reports and actions
   */
  subscribe(communityIds: string[], onUpdate: (event: 'report' | 'action', data: any) => void): () => void {
    if (communityIds.length === 0) return () => {};
    const channelId = `moderation-${communityIds.join('-')}`;

    // Clean up existing subscription
    if (this.subscriptions.has(channelId)) {
      this.unsubscribe(channelId);
    }
    const channel = supabase.channel(channelId).on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'reports',
      filter: `community_id=in.(${communityIds.join(',')})`
    }, payload => {
      onUpdate('report', payload.new);
    }).on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'moderation_actions',
      filter: `community_id=in.(${communityIds.join(',')})`
    }, payload => {
      onUpdate('action', payload.new);
    }).subscribe();
    this.subscriptions.set(channelId, channel);

    // Return unsubscribe function
    return () => this.unsubscribe(channelId);
  }

  /**
   * Unsubscribe from realtime updates
   */
  private unsubscribe(channelId: string): void {
    const channel = this.subscriptions.get(channelId);
    if (channel) {
      supabase.removeChannel(channel);
      this.subscriptions.delete(channelId);
    }
  }

  /**
   * Clean up all subscriptions
   */
  cleanup(): void {
    this.subscriptions.forEach(channel => {
      supabase.removeChannel(channel);
    });
    this.subscriptions.clear();
  }
}
export const ModerationAPI = new ModerationAPIService();