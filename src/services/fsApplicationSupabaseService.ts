/**
 * DFSA Financial Services Application Supabase Service
 * Handles all database operations for the FS application form
 */

import { supabase } from '../supabase/client';
import type {
  FSApplicationFormData,
  FSApplication,
  DocumentMetadata,
  SaveResult,
  SubmitResult,
  ValidationResult
} from '../types/dfsa';

export class FSApplicationSupabaseService {
  /**
   * Save application data (create or update)
   */
  async saveApplication(
    formData: FSApplicationFormData,
    currentStep: string,
    completedSteps: string[],
    applicationId?: string
  ): Promise<SaveResult> {
    try {
      const progressPercent = Math.round((completedSteps.length / 26) * 100);

      // Extract key fields for filtering
      const applicationData = {
        form_data: formData,
        current_step: currentStep,
        completed_steps: completedSteps,
        progress_percent: progressPercent,
        firm_name: formData.firmName,
        legal_status: formData.legalStatus,
        is_representative_office: formData.isRepresentativeOffice || false,
        contact_name: formData.primaryContactName,
        contact_email: formData.primaryContactEmail,
        contact_phone: formData.primaryContactPhone,
        endorsements: formData.endorsementSelections,
        financial_services_matrix: formData.financialServicesMatrix,
        updated_at: new Date().toISOString()
      };

      let result;

      if (applicationId) {
        // Update existing application
        const { data, error } = await supabase
          .from('fs_applications')
          .update(applicationData)
          .eq('id', applicationId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new application
        const { data, error } = await supabase
          .from('fs_applications')
          .insert({
            ...applicationData,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            status: 'draft'
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return {
        success: true,
        applicationId: result.id,
        applicationRef: result.application_ref,
        progressPercent: result.progress_percent
      };
    } catch (error) {
      console.error('Error saving application:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Load application by ID or reference
   */
  async loadApplication(idOrRef: string): Promise<FSApplication | null> {
    try {
      const { data, error } = await supabase
        .from('fs_applications')
        .select('*')
        .or(`id.eq.${idOrRef},application_ref.eq.${idOrRef}`)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw error;
      }

      return {
        id: data.id,
        applicationRef: data.application_ref,
        status: data.status,
        formData: data.form_data,
        currentStep: data.current_step,
        completedSteps: data.completed_steps || [],
        progressPercent: data.progress_percent,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        submittedAt: data.submitted_at
      };
    } catch (error) {
      console.error('Error loading application:', error);
      return null;
    }
  }

  /**
   * Submit application for review
   */
  async submitApplication(applicationId: string): Promise<SubmitResult> {
    try {
      // Update application status
      const { data: appData, error: appError } = await supabase
        .from('fs_applications')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .select()
        .single();

      if (appError) throw appError;

      // Log status change in audit trail
      const { error: historyError } = await supabase
        .from('fs_application_status_history')
        .insert({
          application_id: applicationId,
          previous_status: 'draft',
          new_status: 'submitted',
          changed_by: (await supabase.auth.getUser()).data.user?.id,
          reason: 'Application submitted by user'
        });

      if (historyError) {
        console.warn('Failed to log status change:', historyError);
      }

      return {
        success: true,
        applicationRef: appData.application_ref,
        submittedAt: appData.submitted_at
      };
    } catch (error) {
      console.error('Error submitting application:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Upload document file
   */
  async uploadDocument(
    applicationId: string,
    file: File,
    metadata: DocumentMetadata
  ): Promise<string> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      // Generate storage path
      const filePath = `${user.id}/${applicationId}/${metadata.stepId}/${file.name}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('fs-application-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Save document metadata
      const { error: dbError } = await supabase
        .from('fs_application_documents')
        .insert({
          application_id: applicationId,
          storage_path: filePath,
          document_type: metadata.documentType,
          document_name: metadata.documentName,
          file_name: file.name,
          mime_type: file.type,
          file_size: file.size,
          step_id: metadata.stepId,
          field_id: metadata.fieldId
        });

      if (dbError) throw dbError;

      return filePath;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  /**
   * Get documents for an application
   */
  async getApplicationDocuments(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('fs_application_documents')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      // Get document info first
      const { data: doc, error: fetchError } = await supabase
        .from('fs_application_documents')
        .select('storage_path')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('fs-application-documents')
        .remove([doc.storage_path]);

      if (storageError) throw storageError;

      // Delete metadata record
      const { error: dbError } = await supabase
        .from('fs_application_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  /**
   * Get application status history
   */
  async getStatusHistory(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('fs_application_status_history')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching status history:', error);
      return [];
    }
  }

  /**
   * Get user's applications
   */
  async getUserApplications() {
    try {
      const { data, error } = await supabase
        .from('fs_applications')
        .select('id, application_ref, status, firm_name, progress_percent, created_at, updated_at')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user applications:', error);
      return [];
    }
  }
}

// Export singleton instance
export const fsApplicationService = new FSApplicationSupabaseService();
