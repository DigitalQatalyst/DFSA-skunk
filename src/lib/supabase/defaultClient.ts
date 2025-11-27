import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Vite automatically loads VITE_* prefixed variables from .env.local and .env files
// Access them via import.meta.env (not import.meta.env.env)
const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// Updated to use new database: nywlgmvnpaeemyxlhttx
// NOTE: Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local for production
const SUPABASE_URL = typeof rawUrl === 'string' && rawUrl.trim() ? rawUrl.trim() : 'https://nywlgmvnpaeemyxlhttx.supabase.co'
// IMPORTANT: Replace this with the actual anon key from Supabase dashboard
// Get it from: Supabase Dashboard → Settings → API → anon/public key
const SUPABASE_ANON_KEY = typeof rawKey === 'string' && rawKey.trim() ? rawKey.trim() : ''

const withNoStoreFetch = (input: RequestInfo, init?: RequestInit) => {
  const headers = new Headers(init?.headers ?? {})
  if (!headers.has('cache-control')) {
    headers.set('cache-control', 'no-cache')
  }
  if (!headers.has('pragma')) {
    headers.set('pragma', 'no-cache')
  }
  return fetch(input, {
    ...init,
    headers,
    cache: 'no-store',
  })
}

let _client: SupabaseClient<Database> | null = null

export const isSupabaseConfigured = () =>
  Boolean(SUPABASE_URL && /^https?:\/\//i.test(SUPABASE_URL) && SUPABASE_ANON_KEY)

export function getSupabase(): SupabaseClient<Database> {
  if (_client) return _client
  if (!isSupabaseConfigured()) {
    const msg = `Supabase not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local (current url: "${SUPABASE_URL || 'undefined'}"). Restart the dev server after changes.`
    throw new Error(msg)
  }
  _client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      fetch: withNoStoreFetch,
    },
  })
  return _client
}

