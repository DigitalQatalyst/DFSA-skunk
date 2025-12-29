/**
 * DFSA Financial Services Application - Document Upload Field Component
 *
 * Combined component that includes document upload and document list functionality.
 * Provides a complete document management experience for form fields.
 *
 * Requirements: 4.1, 4.2, 4.4, 4.5
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DocumentUpload, DocumentUploadProps } from './DocumentUpload';
import { DocumentList } from './DocumentList';
import {
  StoredDocument,
  getDocumentsByStep
} from './documentStorage';

export interface DocumentUploadFieldProps extends Omit<DocumentUploadProps, 'onUploadComplete' | 'onUploadError'> {
  /** Callback when documents change (upload or delete) */
  onDocumentsChange?: (documents: StoredDocument[]) => void;
  /** Whether to show the document list */
  showList?: boolean;
  /** Whether to use compact list view */
  compactList?: boolean;
  /** Maximum number of documents allowed */
  maxDocuments?: number;
  /** Custom empty message for the list */
  emptyListMessage?: string;
}

/**
 * Document Upload Field Component
 *
 * Combines upload functionality with document listing for a complete
 * document management experience within form fields.
 */
export const DocumentUploadField: React.FC<DocumentUploadFieldProps> = ({
  stepId,
  fieldId,
  documentType,
  label,
  required = false,
  helpText,
  error,
  disabled = false,
  accept,
  maxSizeMB,
  multiple = false,
  onDocumentsChange,
  showList = true,
  compactList = true,
  maxDocuments,
  emptyListMessage = 'No documents uploaded'
}) => {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Load documents on mount and when stepId/fieldId changes
  useEffect(() => {
    const loadedDocs = getDocumentsByStep(stepId, fieldId);
    setDocuments(loadedDocs);
  }, [stepId, fieldId]);

  // Handle successful upload
  const handleUploadComplete = useCallback((_document: StoredDocument) => {
    setUploadError(null);
    // Reload documents from storage to ensure consistency
    const updatedDocs = getDocumentsByStep(stepId, fieldId);
    setDocuments(updatedDocs);
    onDocumentsChange?.(updatedDocs);
  }, [stepId, fieldId, onDocumentsChange]);

  // Handle upload error
  const handleUploadError = useCallback((errorMessage: string) => {
    setUploadError(errorMessage);
  }, []);

  // Handle document deletion
  const handleDocumentDeleted = useCallback((_documentId: string) => {
    // Reload documents from storage
    const updatedDocs = getDocumentsByStep(stepId, fieldId);
    setDocuments(updatedDocs);
    onDocumentsChange?.(updatedDocs);
  }, [stepId, fieldId, onDocumentsChange]);

  // Check if max documents reached
  const maxReached = maxDocuments !== undefined && documents.length >= maxDocuments;

  // Determine if upload should be disabled
  const isUploadDisabled = disabled || maxReached;

  // Build help text
  let displayHelpText = helpText;
  if (maxDocuments !== undefined) {
    const countText = `${documents.length}/${maxDocuments} documents`;
    displayHelpText = helpText ? `${helpText} (${countText})` : countText;
  }

  return (
    <div className="space-y-4">
      {/* Upload Component */}
      {!maxReached && (
        <DocumentUpload
          stepId={stepId}
          fieldId={fieldId}
          documentType={documentType}
          label={label}
          required={required && documents.length === 0}
          helpText={displayHelpText}
          error={error || uploadError || undefined}
          disabled={isUploadDisabled}
          accept={accept}
          maxSizeMB={maxSizeMB}
          multiple={multiple}
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
      )}

      {/* Max Documents Reached Message */}
      {maxReached && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && (
              <span className="text-red-600 ml-1" aria-label="required">*</span>
            )}
          </label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Maximum number of documents ({maxDocuments}) reached.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Delete an existing document to upload a new one.
            </p>
          </div>
        </div>
      )}

      {/* Document List */}
      {showList && documents.length > 0 && (
        <DocumentList
          documents={documents}
          onDocumentDeleted={handleDocumentDeleted}
          allowDelete={!disabled}
          allowDownload={true}
          allowPreview={true}
          readOnly={disabled}
          compact={compactList}
          title="Uploaded Documents"
        />
      )}

      {/* Empty State (only show if list is enabled and no documents) */}
      {showList && documents.length === 0 && !maxReached && (
        <div className="text-center py-4 text-gray-400 text-sm">
          {emptyListMessage}
        </div>
      )}
    </div>
  );
};

export default DocumentUploadField;
