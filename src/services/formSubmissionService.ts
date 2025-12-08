import { getNonFinancialSupabase } from '../lib/supabase/nonFinancialClient';

export interface FormSubmission {
  id?: string;
  service_id: string;
  service_name: string;
  user_id?: string;
  user_email: string;
  form_data: any;
  uploaded_files: UploadedFile[];
  status?: string;
  submitted_at?: string;
  updated_at?: string;
}

export interface UploadedFile {
  field_name: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

export async function uploadFile(file: File, serviceId: string, fieldName: string): Promise<UploadedFile | null> {
  const supabase = getNonFinancialSupabase();
  
  // Generate unique file path
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${serviceId}/${timestamp}_${sanitizedFileName}`;
  
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('form-documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }
  
  return {
    field_name: fieldName,
    file_name: file.name,
    file_path: data.path,
    file_size: file.size,
    file_type: file.type,
    uploaded_at: new Date().toISOString()
  };
}

export async function submitForm(submission: Omit<FormSubmission, 'id' | 'submitted_at' | 'updated_at'>): Promise<FormSubmission | null> {
  const supabase = getNonFinancialSupabase();
  
  const { data, error } = await supabase
    .from('form_submissions')
    .insert({
      service_id: submission.service_id,
      service_name: submission.service_name,
      user_email: submission.user_email,
      form_data: submission.form_data,
      uploaded_files: submission.uploaded_files,
      status: 'pending'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error submitting form:', error);
    return null;
  }
  
  return data as FormSubmission;
}

export async function getSubmissionsByEmail(email: string): Promise<FormSubmission[]> {
  const supabase = getNonFinancialSupabase();
  
  const { data, error } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('user_email', email)
    .order('submitted_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
  
  return data as FormSubmission[];
}

export async function getAllSubmissions(): Promise<FormSubmission[]> {
  const supabase = getNonFinancialSupabase();
  
  const { data, error } = await supabase
    .from('form_submissions')
    .select('*')
    .order('submitted_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching all submissions:', error);
    return [];
  }
  
  return data as FormSubmission[];
}

export async function getFileUrl(filePath: string): Promise<string | null> {
  const supabase = getNonFinancialSupabase();
  
  const { data } = supabase.storage
    .from('form-documents')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}

export async function downloadFile(filePath: string): Promise<Blob | null> {
  const supabase = getNonFinancialSupabase();
  
  const { data, error } = await supabase.storage
    .from('form-documents')
    .download(filePath);
  
  if (error) {
    console.error('Error downloading file:', error);
    return null;
  }
  
  return data;
}
