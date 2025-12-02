import { getNonFinancialSupabase } from '../lib/supabase/nonFinancialClient'

export interface NonFinancialService {
  id: string
  name: string
  slug: string
  description: string
  service_type: string
  service_category: string
  entity_type: string
  processing_time: string
  tags: string[]
  long_description: string
  benefits: string[]
  requirements: string[]
  process_steps: Array<{ title: string; description: string }>
  created_at: string
  updated_at: string
}

export async function fetchNonFinancialServices() {
  console.log('[NonFinancial] Fetching services...')
  const supabase = getNonFinancialSupabase()
  const { data, error } = await supabase
    .from('non_financial_services')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('[NonFinancial] Error fetching services:', error)
    throw error
  }
  
  console.log(`[NonFinancial] Successfully fetched ${data?.length || 0} services`)
  return data as NonFinancialService[]
}

export async function fetchNonFinancialServiceBySlug(slug: string) {
  console.log(`[NonFinancial] Fetching service by slug: ${slug}`)
  const supabase = getNonFinancialSupabase()
  const { data, error } = await supabase
    .from('non_financial_services')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error(`[NonFinancial] Error fetching service ${slug}:`, error)
    throw error
  }
  
  console.log(`[NonFinancial] Successfully fetched service: ${data?.name}`)
  return data as NonFinancialService
}
