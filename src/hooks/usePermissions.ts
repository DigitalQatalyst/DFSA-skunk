import { useState, useEffect } from 'react';
import { useAuth } from '../context/UnifiedAuthProvider';
import { supabase } from '../supabase/client';
export type UserRole = 'admin' | 'moderator' | 'member';
export interface Permissions {
  canModeratePosts: boolean;
  canModerateUsers: boolean;
  canAssignModerators: boolean;
  canViewReports: boolean;
  canModerate: boolean; // Shorthand for canModeratePosts || canViewReports
  userRole: UserRole | null;
  loading: boolean;
}



export function usePermissions(communityId?: string): Permissions {
  const {
    user
  } = useAuth();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<Omit<Permissions, 'loading'>>({
    canModeratePosts: false,
    canModerateUsers: false,
    canAssignModerators: false,
    canViewReports: false,
    canModerate: false,
    userRole: null
  });
  useEffect(() => {
    const checkPermissions = async () => {
      setLoading(true);
      if (!user) {
        setPermissions({
          canModeratePosts: false,
          canModerateUsers: false,
          canAssignModerators: false,
          canViewReports: false,
          canModerate: false,
          userRole: null
        });
        setLoading(false);
        return;
      }

      // Get user data including role from users_local table
      const {
        data: localUser
      } = await supabase.from('users_local').select('id, role').eq('email', user.email).maybeSingle();
      
      console.log('usePermissions Debug:', {
        userEmail: user.email,
        localUser,
        communityId
      });

      if (!localUser) {
        console.log('usePermissions: No local user found');
        setPermissions({
          canModeratePosts: false,
          canModerateUsers: false,
          canAssignModerators: false,
          canViewReports: false,
          canModerate: false,
          userRole: null
        });
        setLoading(false);
        return;
      }

      // Get role directly from users_local table
      const role: UserRole | null = localUser.role as UserRole || null;
      console.log('usePermissions: User role =', role);

      // Admin has all permissions
      if (role === 'admin') {
        setPermissions({
          canModeratePosts: true,
          canModerateUsers: true,
          canAssignModerators: true,
          canViewReports: true,
          canModerate: true,
          userRole: role
        });
        setLoading(false);
        return;
      }

      // For moderators, check community-specific roles using memberships table
      if (role === 'moderator' && communityId && localUser) {
        const {
          data: membership
        } = await supabase.from('memberships').select('role').eq('user_id', localUser.id).eq('community_id', communityId).in('role', ['admin', 'moderator']).maybeSingle();
        if (membership) {
          setPermissions({
            canModeratePosts: true,
            canModerateUsers: false,
            canAssignModerators: membership.role === 'admin',
            canViewReports: true,
            canModerate: true,
            userRole: role
          });
          setLoading(false);
          return;
        }
      }

      // Default member permissions
      setPermissions({
        canModeratePosts: false,
        canModerateUsers: false,
        canAssignModerators: false,
        canViewReports: false,
        canModerate: false,
        userRole: role
      });
      setLoading(false);
    };
    checkPermissions();
  }, [user?.id, communityId]); // Only depend on user.id, not entire user object

  return {
    ...permissions,
    loading
  };
}