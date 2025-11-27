import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../admin-ui/utils/database.types'

const rawUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL_KH
const rawKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY_KH
const SUPABASE_URL = typeof rawUrl === 'string' ? rawUrl.trim() : 'https://nywlgmvnpaeemyxlhttx.supabase.co'
const SUPABASE_ANON_KEY = typeof rawKey === 'string' ? rawKey.trim() : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55d2xnbXZucGFlZW15eGxodHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNDExNzIsImV4cCI6MjA3NzgxNzE3Mn0.W78FPYT6sO4Cetr1lZXdJhTKpirVcBXGtjcrpml-dQM'

let _client: SupabaseClient<Database> | null = null

export const isSupabaseConfigured = () =>
  Boolean(SUPABASE_URL && /^https?:\/\//i.test(SUPABASE_URL) && SUPABASE_ANON_KEY)

export function getSupabase(): SupabaseClient<Database> {
  if (_client) return _client
  if (!isSupabaseConfigured()) {
    const msg = `Supabase not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local (current url: "${SUPABASE_URL || 'undefined'}"). Restart the dev server after changes.`
    throw new Error(msg)
  }
  _client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
  return _client
}

// Optional lightweight read-only schema check (non-blocking when used)
let _schemaChecked = false
export async function verifyKnowledgeHubSchema(): Promise<boolean> {
  if (_schemaChecked) return true
  try {
    const supabase = getSupabase()
    // ping key views/tables with a tiny read
    await supabase.from('v_media_public').select('id').limit(1)
    await supabase.from('v_media_public_grid').select('id').limit(1)
    _schemaChecked = true
    return true
  } catch {
    // Do not crash app on verification failure; leave to runtime fetch errors
    return false
  }
}
