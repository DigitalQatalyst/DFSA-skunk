import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth as useMsalAuthHook } from '../components/Header/context/AuthContext';
import { syncEntraUser, type DbUser } from '../services/auth/userProvisioningService';
import { isDemoModeEnabled, getDemoUser } from '../utils/demoAuthUtils';

interface UnifiedUser {
  id: string; // Database UUID from users_local
  email: string;
  name?: string;
  username?: string | null;
  role?: string | null;
  avatar_url?: string | null;
  givenName?: string;
  familyName?: string;
  picture?: string;
  external_id?: string | null;
  email_verified?: boolean | null;
}

interface UnifiedAuthContextType {
  // User data (from MSAL + database)
  user: UnifiedUser | null;
  
  // Loading states
  isLoading: boolean;
  loading: boolean; // Alias for compatibility
  
  // MSAL methods
  login: () => void;
  signup: () => void;
  logout: () => void;
  
  // Auth source indicator
  authSource: 'msal' | null;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export function UnifiedAuthProvider({ children }: { children: ReactNode }) {
  const msalAuth = useMsalAuthHook();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Sync MSAL user to database when authenticated
  useEffect(() => {
    // Skip user provisioning in demo mode
    if (isDemoModeEnabled()) {
      const demoUser = getDemoUser();
      setDbUser({
        id: demoUser.id,
        email: demoUser.email,
        username: demoUser.username,
        role: demoUser.role,
        avatar_url: demoUser.avatar_url,
        external_id: demoUser.external_id,
        email_verified: demoUser.email_verified,
      } as DbUser);
      return;
    }

    async function provisionUser() {
      if (!msalAuth.user || syncing) return;

      setSyncing(true);
      console.log('[UnifiedAuth] Syncing Entra user to database:', msalAuth.user.email);

      const result = await syncEntraUser({
        id: msalAuth.user.id,
        email: msalAuth.user.email,
        name: msalAuth.user.name,
        givenName: msalAuth.user.givenName,
        familyName: msalAuth.user.familyName,
        picture: msalAuth.user.picture,
      });

      if (result.success && result.user) {
        console.log('[UnifiedAuth] User provisioned successfully:', result.user.id);
        setDbUser(result.user);
      } else {
        console.error('[UnifiedAuth] User provisioning failed:', result.error);
        setDbUser(null);
      }

      setSyncing(false);
    }

    if (msalAuth.user) {
      provisionUser();
    } else {
      setDbUser(null);
    }
  }, [msalAuth.user?.id, msalAuth.user?.email]); // Only re-sync if user ID or email changes

  // Determine auth source
  const authSource: 'msal' | null = msalAuth.user ? 'msal' : null;

  // Merge MSAL profile with database user data
  // In demo mode, return demo user directly
  const user: UnifiedUser | null = isDemoModeEnabled()
    ? getDemoUser() as UnifiedUser
    : (msalAuth.user && dbUser
      ? {
          // Use database UUID as primary ID
          id: dbUser.id,
          email: dbUser.email,
          // Prefer database username, fallback to MSAL name
          username: dbUser.username || msalAuth.user.name,
          // Database fields
          role: dbUser.role,
          avatar_url: dbUser.avatar_url,
          external_id: dbUser.external_id,
          email_verified: dbUser.email_verified,
          // MSAL fields for compatibility
          name: msalAuth.user.name,
          givenName: msalAuth.user.givenName,
          familyName: msalAuth.user.familyName,
          picture: msalAuth.user.picture,
        }
      : null);

  // In demo mode, never show loading state
  const isLoading = isDemoModeEnabled() ? false : (msalAuth.isLoading || syncing);

  const contextValue: UnifiedAuthContextType = {
    user,
    isLoading,
    loading: isLoading,
    
    // MSAL methods
    login: msalAuth.login,
    signup: msalAuth.signup,
    logout: msalAuth.logout,
    
    authSource,
  };

  return (
    <UnifiedAuthContext.Provider value={contextValue}>
      {children}
    </UnifiedAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(UnifiedAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within UnifiedAuthProvider');
  }
  return context;
}
