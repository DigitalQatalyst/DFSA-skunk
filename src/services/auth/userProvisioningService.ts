/**
 * User Provisioning Service for MS Entra External Identities
 * 
 * Handles syncing MS Entra users to the local users_local table.
 * Matches users by entra_id first, then email, and creates new records as needed.
 */

import { supabase } from '../../supabase/client';

export interface EntraUserProfile {
  id: string; // Entra localAccountId
  email: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
}

export interface DbUser {
  id: string; // Database UUID
  email: string;
  username: string | null;
  role: string | null;
  avatar_url: string | null;
  external_id: string | null;
  auth_provider: string | null;
  email_verified: boolean | null;
  last_sign_in_at: string | null;
  created_at: string | null;
}

export interface SyncResult {
  success: boolean;
  user?: DbUser;
  error?: string;
  isNewUser?: boolean;
}

/**
 * Find user by external ID (Entra ID)
 */
async function findUserByExternalId(externalId: string): Promise<DbUser | null> {
  try {
    const { data, error } = await supabase
      .from('users_local')
      .select('*')
      .eq('external_id', externalId)
      .maybeSingle();

    if (error) {
      console.error('Error finding user by external_id:', error);
      return null;
    }

    return data as DbUser | null;
  } catch (err) {
    console.error('Exception finding user by external_id:', err);
    return null;
  }
}

/**
 * Find user by email
 */
async function findUserByEmail(email: string): Promise<DbUser | null> {
  try {
    const { data, error } = await supabase
      .from('users_local')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error finding user by email:', error);
      return null;
    }

    return data as DbUser | null;
  } catch (err) {
    console.error('Exception finding user by email:', err);
    return null;
  }
}

/**
 * Create new Entra user in database
 */
async function createEntraUser(entraProfile: EntraUserProfile): Promise<DbUser | null> {
  try {
    const username = entraProfile.name || 
                     entraProfile.givenName || 
                     entraProfile.email.split('@')[0];

    const { data, error } = await supabase
      .from('users_local')
      .insert({
        email: entraProfile.email,
        external_id: entraProfile.id,
        username: username,
        avatar_url: entraProfile.picture || null,
        password: null, // No password for Entra users
        auth_provider: 'entra',
        email_verified: true, // Entra users are verified by Microsoft
        role: 'member', // Default role
        last_sign_in_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating Entra user:', error);
      return null;
    }

    return data as DbUser;
  } catch (err) {
    console.error('Exception creating Entra user:', err);
    return null;
  }
}

/**
 * Update existing user with external ID (Entra ID)
 */
async function updateExternalId(userId: string, externalId: string): Promise<DbUser | null> {
  try {
    const { data, error } = await supabase
      .from('users_local')
      .update({
        external_id: externalId,
        auth_provider: 'entra',
        email_verified: true,
        last_sign_in_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user with external_id:', error);
      return null;
    }

    return data as DbUser;
  } catch (err) {
    console.error('Exception updating user with external_id:', err);
    return null;
  }
}

/**
 * Main sync function - find or create user in database
 * 
 * Flow:
 * 1. Check if user exists by external_id (Entra ID)
 * 2. If not found, check by email
 * 3. If found by email, update with external_id
 * 4. If not found at all, create new user
 */
export async function syncEntraUser(entraProfile: EntraUserProfile): Promise<SyncResult> {
  try {
    // Step 1: Try to find by external ID (Entra ID)
    let user = await findUserByExternalId(entraProfile.id);
    
    if (user) {
      console.log('[UserProvisioning] User found by external_id:', user.id);
      // Update last sign-in time
      await supabase
        .from('users_local')
        .update({ last_sign_in_at: new Date().toISOString() })
        .eq('id', user.id);
      
      return { success: true, user, isNewUser: false };
    }

    // Step 2: Try to find by email
    user = await findUserByEmail(entraProfile.email);

    if (user) {
      console.log('[UserProvisioning] User found by email, linking to Entra ID:', user.id);
      // Update existing user with external ID
      const updatedUser = await updateExternalId(user.id, entraProfile.id);
      
      if (!updatedUser) {
        return {
          success: false,
          error: 'Failed to link existing user to Entra ID'
        };
      }

      return { success: true, user: updatedUser, isNewUser: false };
    }

    // Step 3: Create new user
    console.log('[UserProvisioning] Creating new Entra user:', entraProfile.email);
    const newUser = await createEntraUser(entraProfile);

    if (!newUser) {
      return {
        success: false,
        error: 'Failed to create new user'
      };
    }

    return { success: true, user: newUser, isNewUser: true };
  } catch (err) {
    console.error('[UserProvisioning] Sync error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

/**
 * Get user by database ID
 */
export async function getUserById(userId: string): Promise<DbUser | null> {
  try {
    const { data, error } = await supabase
      .from('users_local')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting user by id:', error);
      return null;
    }

    return data as DbUser;
  } catch (err) {
    console.error('Exception getting user by id:', err);
    return null;
  }
}

