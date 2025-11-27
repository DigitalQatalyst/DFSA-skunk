import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { GradientAvatar } from '../ui/gradient-avatar';
import { AlertCircle, Users, ChevronRight } from 'lucide-react';
import { safeFetch } from '../../utils/safeFetch';
interface Member {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  joined_at: string;
}
interface MemberListProps {
  communityId: string;
  limit?: number;
  hideHeader?: boolean;
}
export function MemberList({
  communityId,
  limit = 10,
  hideHeader = false
}: MemberListProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchMembers();
  }, [communityId, limit]);
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    const query = supabase.from('memberships').select(`
        id,
        user_id,
        joined_at,
        users_local!memberships_user_id_fkey (
          id,
          username,
          avatar_url
        )
      `).eq('community_id', communityId).order('joined_at', {
      ascending: false
    }).limit(limit);
    const [data, err] = await safeFetch(query);
    if (err) {
      setError('Failed to load members');
      setLoading(false);
      return;
    }
    if (data) {
      const membersList = data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        username: item.users_local?.username || 'Unknown',
        avatar_url: item.users_local?.avatar_url || null,
        joined_at: item.joined_at
      }));
      setMembers(membersList);
    }
    setLoading(false);
  };
  const renderContent = () => {
    if (loading) {
      return <div className="p-4 space-y-3">
          {Array.from({
          length: 5
        }).map((_, i) => <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>)}
        </div>;
    }
    if (error) {
      return <div className="p-4">
          <div className="flex items-center gap-2 text-yellow-800 bg-yellow-50 p-3 rounded-md border border-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>;
    }
    return <div className="divide-y divide-gray-100">
        {members.length === 0 ? <div className="p-4 text-center text-sm text-gray-500">
            No members yet
          </div> : <>
            <div className="max-h-[400px] overflow-y-auto">
              {members.map(member => <Link key={member.id} to={`/profile/${member.user_id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src={member.avatar_url || undefined} />
                    <AvatarFallback className="relative overflow-hidden">
                      <GradientAvatar seed={member.user_id} className="absolute inset-0" />
                      <span className="relative z-10 text-white font-semibold text-sm">
                        {member.username.charAt(0).toUpperCase()}
                      </span>
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {member.username}
                    </p>
                  </div>
                </Link>)}
            </div>
            <div className="p-3 bg-gray-50">
              <Link to={`/community/${communityId}/members`}>
                <Button variant="ghost" size="sm" className="w-full justify-center text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  View All Members
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </>}
      </div>;
  };
  // If hideHeader is true, don't render the outer card container with header
  if (hideHeader) {
    return renderContent();
  }
  // Otherwise, render the complete component with its own card container
  return <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-700" />
          <h3 className="font-bold text-gray-900">Members</h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {members.length} shown
        </span>
      </div>
      {renderContent()}
    </div>;
}