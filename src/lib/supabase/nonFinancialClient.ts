import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ltzpypiozakhxfsunlaq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0enB5cGlvemFraHhmc3VubGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjQzMjEsImV4cCI6MjA4MDE0MDMyMX0.Qh2K8KYIVO6t_VHkiW-27salZjSfF9fCh-DtHG6CBQ4'

let _client: SupabaseClient | null = null

export function getNonFinancialSupabase(): SupabaseClient {
  if (_client) return _client
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  return _client
}
