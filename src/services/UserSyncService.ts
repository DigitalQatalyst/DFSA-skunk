/**
 * UserSyncService - Synchronizes MSAL user data with Supabase
 * 
 * This service ensures that MSAL authenticated users are stored in the Supabase
 * users table so they can participate in community features (join, post, moderate, etc.)
 */

import { supabase } from '../supabase/client';

export interface MSALUser {
  id: string;           // MSAL localAccountId
  email: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
}

export interface SyncedUser {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  given_name: string | null;
  family_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

class UserSyncService {
  /**
   * Sync MSAL user data to Supabase users table
   * Creates a new user if they don't exist, updates if they do
   */
  async syncUser(msalUser: MSALUser): Promise<SyncedUser | null> {
    try {
      // Check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', msalUser.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching user:', fetchError);
        return null;
      }

      // Prepare user data
      const userData = {
        id: msalUser.id,
        email: msalUser.email,
        name: msalUser.name || null,
        username: msalUser.name || msalUser.email.split('@')[0],
        given_name: msalUser.givenName || null,
        family_name: msalUser.familyName || null,
        avatar_url: msalUser.picture || null,
      };

      if (existingUser) {
        // Update existing user
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            email: userData.email,
            name: userData.name,
            username: userData.username,
            given_name: userData.given_name,
            family_name: userData.family_name,
            avatar_url: userData.avatar_url,
          })
          .eq('id', msalUser.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user:', updateError);
          return null;
        }

        return updatedUser as SyncedUser;
      } else {
        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert(userData)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
          return null;
        }

        console.log('Created new user in Supabase:', newUser.id);
        return newUser as SyncedUser;
      }
    } catch (error) {
      console.error('Unexpected error syncing user:', error);
      return null;
    }
  }

  /**
   * Get user from Supabase by ID
   */
  async getUserById(userId: string): Promise<SyncedUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user by ID:', error);
        return null;
      }

      return data as SyncedUser;
    } catch (error) {
      console.error('Unexpected error fetching user:', error);
      return null;
    }
  }

  /**
   * Get user from Supabase by email
   */
  async getUserByEmail(email: string): Promise<SyncedUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user by email:', error);
        return null;
      }

      return data as SyncedUser;
    } catch (error) {
      console.error('Unexpected error fetching user:', error);
      return null;
    }
  }

  /**
   * Get user roles (global roles)
   */
  async getUserRoles(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return (data || []).map(r => r.role);
    } catch (error) {
      console.error('Unexpected error fetching roles:', error);
      return [];
    }
  }

  /**
   * Get community-specific roles for a user
   */
  async getCommunityRoles(userId: string, communityId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('community_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('community_id', communityId);

      if (error) {
        console.error('Error fetching community roles:', error);
        return [];
      }

      return (data || []).map(r => r.role);
    } catch (error) {
      console.error('Unexpected error fetching community roles:', error);
      return [];
    }
  }

  /**
   * Assign a global role to a user
   */
  async assignUserRole(userId: string, role: 'admin' | 'moderator' | 'member'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });

      if (error) {
        console.error('Error assigning user role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error assigning role:', error);
      return false;
    }
  }

  /**
   * Assign a community-specific role to a user
   */
  async assignCommunityRole(
    userId: string,
    communityId: string,
    role: 'admin' | 'moderator'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('community_roles')
        .upsert(
          { user_id: userId, community_id: communityId, role },
          { onConflict: 'user_id,community_id,role' }
        );

      if (error) {
        console.error('Error assigning community role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error assigning community role:', error);
      return false;
    }
  }

  /**
   * Remove a role from a user
   */
  async removeUserRole(userId: string, role: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) {
        console.error('Error removing user role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error removing role:', error);
      return false;
    }
  }

  /**
   * Remove a community role from a user
   */
  async removeCommunityRole(userId: string, communityId: string, role: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('community_roles')
        .delete()
        .eq('user_id', userId)
        .eq('community_id', communityId)
        .eq('role', role);

      if (error) {
        console.error('Error removing community role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error removing community role:', error);
      return false;
    }
  }
}

// Export singleton instance
export const userSyncService = new UserSyncService();


