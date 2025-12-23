import { getNonFinancialSupabase } from '../lib/supabase/nonFinancialClient';

export interface FormSchema {
  id: string;
  service_id: string;
  service_name: string;
  json_schema: any;
  ui_schema?: any;
  metadata?: {
    service_stage?: string;
    service_segment?: string;
    sub_segment?: string;
    fees?: string;
    processing_time?: string;
    required_documents?: string[];
  };
  created_at: string;
  updated_at: string;
}

export async function fetchFormSchemaByServiceId(serviceId: string): Promise<FormSchema | null> {
  const supabase = getNonFinancialSupabase();
  
  const { data, error } = await supabase
    .from('service_form_schemas')
    .select('*')
    .eq('service_id', serviceId)
    .single();
  
  if (error) {
    console.error(`Error fetching form schema for service ${serviceId}:`, error);
    return null;
  }
  
  return data as FormSchema;
}

export async function upsertFormSchema(schema: Omit<FormSchema, 'id' | 'created_at' | 'updated_at'>): Promise<FormSchema | null> {
  const supabase = getNonFinancialSupabase();
  
  const { data, error } = await supabase
    .from('service_form_schemas')
    .upsert({
      ...schema,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'service_id'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting form schema:', error);
    return null;
  }
  
  return data as FormSchema;
}
