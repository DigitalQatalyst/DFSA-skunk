import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
export type CommunityRole = 'owner' | 'moderator' | 'member';
export function useCommunityRole(userId: string | undefined, communityId: string | undefined) {
  const [role, setRole] = useState<CommunityRole | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId || !communityId) {
      setLoading(false);
      return;
    }
    const fetchRole = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('community_roles').select('role').eq('user_id', userId).eq('community_id', communityId).maybeSingle();
        if (error) {
          console.error('Error fetching community role:', error);
          setRole(null);
        } else {
          setRole(data?.role as CommunityRole || null);
        }
      } catch (err) {
        console.error('Unexpected error fetching community role:', err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [userId, communityId]);
  return {
    role,
    loading
  };
}
export function getCommunityRoleBadgeVariant(role: CommunityRole): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case 'owner':
      return 'default';
    case 'moderator':
      return 'secondary';
    default:
      return 'outline';
  }
}
export function formatCommunityRole(role: CommunityRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}