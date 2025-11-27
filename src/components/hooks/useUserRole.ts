import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
export type UserRole = 'admin' | 'moderator' | 'member';
export function useUserRole(userId: string | undefined) {
  const [role, setRole] = useState<UserRole>('member');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const fetchRole = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('user_roles').select('role').eq('user_id', userId);
        if (error) {
          console.error('Error fetching user role:', error);
          setRole('member');
        } else {
          // Get highest priority role (admin > moderator > member)
          const roles = (data || []).map(r => r.role as UserRole);
          const highestRole = roles.includes('admin') ? 'admin' : roles.includes('moderator') ? 'moderator' : roles.includes('member') ? 'member' : 'member';
          setRole(highestRole);
        }
      } catch (err) {
        console.error('Unexpected error fetching role:', err);
        setRole('member');
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [userId]);
  return {
    role,
    loading
  };
}
export function getRoleBadgeVariant(role: UserRole): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case 'admin':
      return 'default';
    case 'moderator':
      return 'secondary';
    default:
      return 'outline';
  }
}
export function formatRole(role: UserRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}