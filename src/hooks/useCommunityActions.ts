import { useCallback, useState, useEffect } from 'react';
import { useAuth } from '../context/UnifiedAuthProvider';
import { supabase } from '../supabase/client';

interface CommunityMembership {
  community_id: string;
  is_member: boolean;
  is_owner?: boolean;
  member_count?: number;
}

export const useCommunityActions = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [memberships, setMemberships] = useState<Record<string, CommunityMembership>>({});

  // Fetch all memberships for the current user
  const fetchMemberships = useCallback(async () => {
    if (!user) return {};

    try {
      const { data, error: fetchError } = await supabase
        .from('memberships')
        .select('community_id, communities (id, created_by)')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const membershipMap = data.reduce((acc, { community_id, communities }) => ({
        ...acc,
        [community_id]: {
          community_id,
          is_member: true,
          is_owner: communities?.created_by === user.id,
        },
      }), {});

      setMemberships(membershipMap);
      return membershipMap;
    } catch (err) {
      console.error('Failed to fetch memberships:', err);
      return {};
    }
  }, [user]);

  // Check membership for a specific community
  const checkMembership = useCallback(async (communityId: string) => {
    if (!user) return { is_member: false, is_owner: false };

    try {
      const { data, error: fetchError } = await supabase
        .from('memberships')
        .select('community_id, communities (id, created_by)')
        .eq('user_id', user.id)
        .eq('community_id', communityId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const membership = {
        community_id: communityId,
        is_member: !!data,
        is_owner: data?.communities?.created_by === user.id,
      };

      setMemberships(prev => ({
        ...prev,
        [communityId]: membership,
      }));

      return membership;
    } catch (err) {
      console.error('Failed to check membership:', err);
      return { is_member: false, is_owner: false };
    }
  }, [user]);

  // Get community with membership status
  const getCommunityWithMembership = useCallback(async (communityId: string) => {
    try {
      const { data, error } = await supabase
        .from('communities_with_counts')
        .select('*')
        .eq('id', communityId)
        .single();

      if (error) throw error;
      if (!data) return null;

      const membership = await checkMembership(communityId);
      
      return {
        ...data,
        is_member: membership.is_member,
        is_owner: membership.is_owner,
      };
    } catch (err) {
      console.error('Failed to fetch community:', err);
      return null;
    }
  }, [checkMembership]);

  // Join a community
  const joinCommunity = useCallback(async (communityId: string) => {
    if (!user) {
      throw new Error('User must be logged in to join a community');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if already a member
      const { is_member } = await checkMembership(communityId);
      if (is_member) return true;

      const { error } = await supabase
        .from('memberships')
        .insert({
          user_id: user.id,
          community_id: communityId,
        });

      if (error) throw error;

      // Update local state
      setMemberships(prev => ({
        ...prev,
        [communityId]: {
          community_id: communityId,
          is_member: true,
          is_owner: false,
        },
      }));

      return true;
    } catch (err) {
      console.error('Failed to join community:', err);
      setError(err instanceof Error ? err.message : 'Failed to join community');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, checkMembership]);

  // Leave a community
  const leaveCommunity = useCallback(async (communityId: string) => {
    if (!user) {
      throw new Error('User must be logged in to leave a community');
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('memberships')
        .delete()
        .eq('user_id', user.id)
        .eq('community_id', communityId);

      if (error) throw error;

      // Update local state
      setMemberships(prev => ({
        ...prev,
        [communityId]: {
          community_id: communityId,
          is_member: false,
          is_owner: false,
        },
      }));

      return true;
    } catch (err) {
      console.error('Failed to leave community:', err);
      setError(err instanceof Error ? err.message : 'Failed to leave community');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Toggle membership status
  const toggleCommunityMembership = useCallback(async (communityId: string) => {
    const isMember = memberships[communityId]?.is_member;
    return isMember 
      ? await leaveCommunity(communityId)
      : await joinCommunity(communityId);
  }, [joinCommunity, leaveCommunity, memberships]);

  // Check if user is a member of a community
  const isCommunityMember = useCallback((communityId: string): boolean => {
    return memberships[communityId]?.is_member || false;
  }, [memberships]);

  // Check if user is the owner of a community
  const isCommunityOwner = useCallback((communityId: string): boolean => {
    return memberships[communityId]?.is_owner || false;
  }, [memberships]);

  // Initialize memberships on mount and when user changes
  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships]);

  return {
    // Core actions
    joinCommunity,
    leaveCommunity,
    toggleCommunityMembership,
    
    // Membership checks
    checkMembership,
    isCommunityMember,
    isCommunityOwner,
    memberships,
    
    // Community data
    getCommunityWithMembership,
    
    // State
    isLoading,
    error,
  };
};

export default useCommunityActions;
