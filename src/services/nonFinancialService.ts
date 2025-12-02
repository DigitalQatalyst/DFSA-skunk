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
  const supabase = getNonFinancialSupabase()
  const { data, error } = await supabase
    .from('non_financial_services')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data as NonFinancialService[]
}

export async function fetchNonFinancialServiceBySlug(slug: string) {
  const supabase = getNonFinancialSupabase()
  const { data, error } = await supabase
    .from('non_financial_services')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data as NonFinancialService
}
