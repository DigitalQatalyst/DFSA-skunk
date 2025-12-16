/**
 * DFSA Financial Services Application - Document Upload Component
 *
 * File upload component with drag-and-drop support, file validation,
 * and localStorage-based storage.
 *
 * Requirements: 4.1, 4.2
 */

import React, { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import { Upload, FileIcon, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import {
  validateFile,
  uploadDocument,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
  StoredDocument,
  formatFileSize
} from './documentStorage';

export interface DocumentUploadProps {
  /** Step ID where the document is being uploaded */
  stepId: string;
  /** Field ID for the document */
  fieldId: string;
  /** Document type/category */
  documentType: string;
  /** Label for the upload field */
  label: string;
  /** Whether the field is required */
  required?: boolean;
  /** Help text to display */
  helpText?: string;
  /** Error message to display */
  error?: string;
  /** Whether the field is disabled/read-only */
  disabled?: boolean;
  /** Callback when upload completes */
  onUploadComplete?: (document: StoredDocument) => void;
  /** Callback when upload fails */
  onUploadError?: (error: string) => void;
  /** Accepted file types (defaults to DFSA allowed types) */
  accept?: string;
  /** Maximum file size in MB (defaults to 10MB) */
  maxSizeMB?: number;
  /** Whether to allow multiple files */
  multiple?: boolean;
}

// File extension string for input accept attribute
const DEFAULT_ACCEPT = '.pdf,.docx,.xlsx,.jpg,.jpeg,.png';

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  stepId,
  fieldId,
  documentType,
  label,
  required = false,
  helpText,
  error,
  disabled = false,
  onUploadComplete,
  onUploadError,
  accept = DEFAULT_ACCEPT,
  maxSizeMB = MAX_FILE_SIZE_MB,
  multiple = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fieldUniqueId = `doc-upload-${stepId}-${fieldId}`;
  const errorId = `${fieldUniqueId}-error`;
  const helpId = `${fieldUniqueId}-help`;

  // Reset success state after a delay
  const showSuccessTemporarily = useCallback(() => {
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;

    setLocalError(null);
    setIsUploading(true);
    setUploadProgress('Validating file...');

    const filesToProcess = multiple ? Array.from(files) : [files[0]];

    for (const file of filesToProcess) {
      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        setLocalError(validation.error || 'Invalid file');
        setIsUploading(false);
        setUploadProgress(null);
        onUploadError?.(validation.error || 'Invalid file');
        return;
      }

      setUploadProgress(`Uploading ${file.name}...`);

      // Upload file
      const result = await uploadDocument(file, stepId, fieldId, documentType);

      if (!result.success) {
        setLocalError(result.error || 'Upload failed');
        setIsUploading(false);
        setUploadProgress(null);
        onUploadError?.(result.error || 'Upload failed');
        return;
      }

      if (result.document) {
        onUploadComplete?.(result.document);
      }
    }

    setIsUploading(false);
    setUploadProgress(null);
    showSuccessTemporarily();

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [stepId, fieldId, documentType, disabled, multiple, onUploadComplete, onUploadError, showSuccessTemporarily]);

  // Handle input change
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  }, [handleFileSelect]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [disabled, handleFileSelect]);

  // Click to open file dialog
  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  // Determine display error
  const displayError = error || localError;

  return (
    <div className="mb-4">
      {/* Label */}
      <label
        htmlFor={fieldUniqueId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && (
          <span className="text-red-600 ml-1" aria-label="required">*</span>
        )}
      </label>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative w-full border-2 border-dashed rounded-lg px-4 py-6 min-h-[120px]
          flex flex-col items-center justify-center cursor-pointer
          transition-all duration-200
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
          ${displayError ? 'border-red-400 bg-red-50' : ''}
          ${isDragging ? 'border-[#9b1823] bg-[#9b18230d] scale-[1.02]' : ''}
          ${uploadSuccess ? 'border-green-400 bg-green-50' : ''}
          ${!displayError && !isDragging && !uploadSuccess && !disabled ? 'border-gray-300 bg-white hover:border-[#9b1823] hover:bg-[#9b18230d]' : ''}
        `}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Upload ${label}`}
        aria-describedby={displayError ? errorId : helpText ? helpId : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Uploading State */}
        {isUploading && (
          <div className="flex flex-col items-center">
            <Loader2 size={32} className="animate-spin text-[#9b1823] mb-2" />
            <p className="text-sm text-[#9b1823] font-medium">{uploadProgress}</p>
          </div>
        )}

        {/* Success State */}
        {!isUploading && uploadSuccess && (
          <div className="flex flex-col items-center">
            <CheckCircle size={32} className="text-green-600 mb-2" />
            <p className="text-sm text-green-700 font-medium">Upload successful!</p>
          </div>
        )}

        {/* Default State */}
        {!isUploading && !uploadSuccess && (
          <>
            <Upload
              size={32}
              className={`mb-2 ${isDragging ? 'text-[#9b1823]' : 'text-gray-400'}`}
            />
            <p className="text-sm text-gray-600 text-center">
              <span className="font-medium text-[#9b1823]">Click to upload</span>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1 text-center">
              PDF, DOCX, XLSX, JPG, PNG (max {maxSizeMB}MB)
            </p>
          </>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          id={fieldUniqueId}
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleInputChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled || isUploading}
          aria-required={required}
          aria-invalid={!!displayError}
        />
      </div>

      {/* Error Message */}
      {displayError && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-red-600 mt-1 flex items-center gap-1"
        >
          <AlertCircle size={12} />
          {displayError}
        </p>
      )}

      {/* Help Text */}
      {!displayError && helpText && (
        <p id={helpId} className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default DocumentUpload;
