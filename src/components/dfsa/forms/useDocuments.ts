/**
 * DFSA Financial Services Application - Document Management Hook
 *
 * React hook for managing document uploads in form steps.
 * Provides state management and callbacks for document operations.
 *
 * Requirements: 4.1, 4.2, 4.4, 4.5
 */

import { useState, useEffect, useCallback } from 'react';
import {
  StoredDocument,
  getDocumentsFromStorage,
  getDocumentsByStep,
  uploadDocument as uploadDocumentToStorage,
  deleteDocument as deleteDocumentFromStorage,
  clearAllDocuments,
  validateFile,
  DocumentValidationResult,
  DocumentUploadResult
} from './documentStorage';

export interface UseDocumentsOptions {
  /** Filter documents by step ID */
  stepId?: string;
  /** Filter documents by field ID */
  fieldId?: string;
  /** Auto-refresh interval in ms (0 to disable) */
  refreshInterval?: number;
}

export interface UseDocumentsState {
  /** List of documents */
  documents: StoredDocument[];
  /** Whether documents are loading */
  isLoading: boolean;
  /** Current error message */
  error: string | null;
  /** Whether an upload is in progress */
  isUploading: boolean;
  /** Total count of documents */
  totalCount: number;
}

export interface UseDocumentsActions {
  /** Upload a file */
  uploadFile: (file: File, stepId: string, fieldId: string, documentType: string) => Promise<DocumentUploadResult>;
  /** Delete a document by ID */
  deleteDocument: (documentId: string) => boolean;
  /** Validate a file without uploading */
  validateFile: (file: File) => DocumentValidationResult;
  /** Refresh the document list */
  refresh: () => void;
  /** Clear all documents */
  clearAll: () => boolean;
  /** Get documents for a specific step */
  getByStep: (stepId: string, fieldId?: string) => StoredDocument[];
}

export interface UseDocumentsReturn extends UseDocumentsState, UseDocumentsActions {}

/**
 * Hook for managing document uploads
 *
 * @param options - Configuration options
 * @returns Document state and actions
 */
export function useDocuments(options: UseDocumentsOptions = {}): UseDocumentsReturn {
  const { stepId, fieldId, refreshInterval = 0 } = options;

  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load documents
  const loadDocuments = useCallback(() => {
    try {
      let docs: StoredDocument[];
      if (stepId) {
        docs = getDocumentsByStep(stepId, fieldId);
      } else {
        docs = getDocumentsFromStorage();
      }
      setDocuments(docs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, [stepId, fieldId]);

  // Initial load
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(loadDocuments, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, loadDocuments]);

  // Upload file
  const uploadFile = useCallback(async (
    file: File,
    uploadStepId: string,
    uploadFieldId: string,
    documentType: string
  ): Promise<DocumentUploadResult> => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadDocumentToStorage(file, uploadStepId, uploadFieldId, documentType);

      if (result.success) {
        loadDocuments(); // Refresh list
      } else {
        setError(result.error || 'Upload failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  }, [loadDocuments]);

  // Delete document
  const deleteDoc = useCallback((documentId: string): boolean => {
    const success = deleteDocumentFromStorage(documentId);
    if (success) {
      loadDocuments(); // Refresh list
    } else {
      setError('Failed to delete document');
    }
    return success;
  }, [loadDocuments]);

  // Validate file
  const validate = useCallback((file: File): DocumentValidationResult => {
    return validateFile(file);
  }, []);

  // Refresh
  const refresh = useCallback(() => {
    setIsLoading(true);
    loadDocuments();
  }, [loadDocuments]);

  // Clear all
  const clearAll = useCallback((): boolean => {
    const success = clearAllDocuments();
    if (success) {
      setDocuments([]);
    }
    return success;
  }, []);

  // Get by step
  const getByStep = useCallback((getStepId: string, getFieldId?: string): StoredDocument[] => {
    return getDocumentsByStep(getStepId, getFieldId);
  }, []);

  return {
    // State
    documents,
    isLoading,
    error,
    isUploading,
    totalCount: documents.length,

    // Actions
    uploadFile,
    deleteDocument: deleteDoc,
    validateFile: validate,
    refresh,
    clearAll,
    getByStep
  };
}

export default useDocuments;
