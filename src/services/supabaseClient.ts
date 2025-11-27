// Re-export from the main supabaseClient to avoid multiple client instances
// This ensures all parts of the app use the same Supabase client singleton
import { getSupabase, isSupabaseConfigured as checkConfigured } from '../lib/supabase/defaultClient';

export { getSupabase as getSupabaseClient };
export const isSupabaseConfigured = checkConfigured;

// For backward compatibility, export a default client getter
// This uses the same singleton from lib/supabase/defaultClient
// to prevent "Multiple GoTrueClient instances" warning
export const supabase = (() => {
  try {
    // Use the same singleton instance from getSupabase()
    return getSupabase();
  } catch (error) {
    // Return null if not configured (matches old behavior)
    return null as any;
  }
})();


