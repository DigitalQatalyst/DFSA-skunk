import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type KHEnv = Record<string, string | undefined>;
const env = (import.meta as any).env as KHEnv;

// KH-specific environment variables (browser-safe anon key only)
const KH_URL = env.NEXT_PUBLIC_SUPABASE_URL_KH || env.VITE_SUPABASE_URL_KH;
const KH_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY_KH || env.VITE_SUPABASE_ANON_KEY_KH;

let khClientSingleton: SupabaseClient<any> | null = null;

export function isSupabaseKHConfigured(): boolean {
  return Boolean(KH_URL && /^https?:\/\//i.test(String(KH_URL)) && KH_ANON_KEY);
}

export function getSupabaseKnowledgeHub(): SupabaseClient<any> {
  // Dev banner to confirm which client is used
  if ((import.meta as any).env?.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[supabase:kh] using KH client');
  }
  if (!isSupabaseKHConfigured()) {
    const url = KH_URL || 'undefined';
    const msg = `Knowledge Hub Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL_KH and NEXT_PUBLIC_SUPABASE_ANON_KEY_KH (or VITE_* equivalents). Current url: "${url}".`;
    throw new Error(msg);
  }

  // CSR: keep a singleton; SSR: return a new client per call
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser) {
    if (!khClientSingleton) {
      khClientSingleton = createClient(KH_URL as string, KH_ANON_KEY as string, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    }
    return khClientSingleton;
  }
  // SSR path
  return createClient(KH_URL as string, KH_ANON_KEY as string);
}

