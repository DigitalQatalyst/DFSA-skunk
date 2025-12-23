/**
 * DocumentUploadField Component
 * File upload component for DFSA onboarding documents
 *
 * Features:
 * - Drag-and-drop support
 * - File type validation
 * - File size validation (max 10MB)
 * - Upload progress indicator
 * - Preview for uploaded files
 * - Integration with OnboardingApiService
 * - Toast notifications for feedback
 * - Accessibility support
 */

import React, { useState, useRef, DragEvent } from 'react'
import { UploadIcon, FileIcon, XIcon, Loader2, AlertCircle, Download } from 'lucide-react'
import { uploadDocument } from '../services/OnboardingApiService'
import { toast } from 'sonner'

interface DocumentUploadFieldProps {
  label: string
  value?: string // URL of uploaded document
  onChange: (url: string | null) => void
  documentType: string // e.g., 'certificateOfIncorporation'
  userId: string
  accept?: string // e.g., '.pdf,.doc,.docx'
  maxSizeMB?: number // Default: 10MB
  required?: boolean
  helpText?: string
  error?: string
}

const DEFAULT_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg'
const DEFAULT_MAX_SIZE_MB = 10

export const DocumentUploadField: React.FC<DocumentUploadFieldProps> = ({
  label,
  value,
  onChange,
  documentType,
  userId,
  accept = DEFAULT_ACCEPT,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  required = false,
  helpText,
  error,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fieldId = `doc-upload-${documentType}`
  const errorId = `${fieldId}-error`
  const helpId = `${fieldId}-help`

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit`
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    const acceptedTypes = accept.split(',').map((t) => t.trim().toLowerCase())

    if (!acceptedTypes.includes(fileExtension)) {
      return `File type ${fileExtension} is not accepted. Accepted types: ${accept}`
    }

    return null
  }

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    // Validate
    const validationError = validateFile(file)
    if (validationError) {
      toast.error(validationError, { duration: 5000 })
      return
    }

    setIsUploading(true)
    setFileName(file.name)

    try {
      const result = await uploadDocument(file, documentType, userId)
      onChange(result.url)

      toast.success('Document uploaded successfully', {
        description: file.name,
        duration: 3000,
      })
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload document', {
        description: 'Please try again or contact support.',
        duration: 5000,
      })
      onChange(null)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Handle remove
  const handleRemove = () => {
    onChange(null)
    setFileName('')
    toast.info('Document removed', { duration: 2000 })
  }

  // Handle view/download
  const handleView = () => {
    if (value) {
      window.open(value, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="mb-6">
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && (
          <span className="text-red-600 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Uploaded file display */}
      {value && !isUploading && (
        <div
          className={`
            w-full border rounded-md px-3 py-3 min-h-[44px]
            flex items-center justify-between
            ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}
          `}
        >
          <div className="flex items-center flex-1 min-w-0 gap-2">
            <FileIcon size={18} className="flex-shrink-0 text-[#9b1823]" />
            <button
              type="button"
              onClick={handleView}
              className="text-sm underline truncate text-[#9b1823] hover:text-[#7a1319] transition-colors"
            >
              {fileName || 'View Document'}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button
              type="button"
              onClick={handleView}
              className="p-1.5 text-[#9b1823] hover:bg-gray-200 rounded transition-colors"
              aria-label="Download document"
              title="Download"
            >
              <Download size={16} />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
              aria-label="Remove file"
              title="Remove"
            >
              <XIcon size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Uploading state */}
      {isUploading && (
        <div className="w-full border-2 border-[#9b1823] rounded-md px-3 py-3 min-h-[44px] flex items-center bg-[#9b18230d]">
          <Loader2 size={18} className="animate-spin mr-2 text-[#9b1823]" />
          <span className="text-sm text-[#9b1823]">Uploading {fileName}...</span>
        </div>
      )}

      {/* Upload zone */}
      {!value && !isUploading && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative w-full border-2 border-dashed rounded-md px-3 py-6 min-h-[100px]
            flex flex-col items-center justify-center cursor-pointer
            transition-all
            ${error ? 'border-red-500 bg-red-50' : isDragging ? 'border-[#9b1823] bg-[#9b18230d]' : 'border-gray-300 bg-white hover:border-[#9b1823] hover:bg-[#9b18230d]'}
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon size={24} className={`mb-2 ${isDragging ? 'text-[#9b1823]' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600 text-center">
            <span className="font-medium text-[#9b1823]">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">{accept.replace(/\./g, '').toUpperCase()} (max {maxSizeMB}MB)</p>

          <input
            ref={fileInputRef}
            id={fieldId}
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleInputChange}
            accept={accept}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helpText ? helpId : undefined}
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}

      {/* Help text */}
      {!error && helpText && (
        <p id={helpId} className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}
    </div>
  )
}
