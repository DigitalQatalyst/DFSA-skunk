/**
 * File Validation Standards - Platform Data Validation Standards
 * 
 * Implements file validation rules from form-default-standards.mdc:
 * - Allowed: PDF, DOCX, XLSX, JPG, PNG, PPTX
 * - Max size: 5MB
 * - Must validate MIME type + extension
 * - Must sanitize filename
 */

/**
 * MIME type mapping according to Platform Data Validation Standards
 * Maps file extensions to their expected MIME types
 */
export const ALLOWED_FILE_TYPES = {
  // PDF
  '.pdf': ['application/pdf'],
  
  // Microsoft Word
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  
  // Microsoft Excel
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  
  // Images
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  
  // Microsoft PowerPoint
  '.pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
} as const;

/**
 * Default allowed file types from standards
 */
export const DEFAULT_ALLOWED_EXTENSIONS = [
  '.pdf',
  '.docx',
  '.xlsx',
  '.jpg',
  '.png',
  '.pptx',
] as const;

/**
 * Maximum file size: 5MB (as per standards)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * File wrapper with unique identifier for multi-file handling
 * Allows unique identification of files even when filenames are duplicated
 */
export interface FileWithId {
  id: string;           // Unique identifier (UUID)
  file: File;           // Original File object
  name: string;         // Sanitized filename
  size: number;         // File size in bytes
  type: string;         // MIME type
  uploadedAt: string;   // ISO timestamp when file was added
  originalName?: string; // Original filename before sanitization (for display)
}

/**
 * Generate a unique ID for file identification
 */
function generateFileId(): string {
  // Use crypto.randomUUID() if available, otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Create a FileWithId wrapper from a File object
 * Validates and sanitizes the file, then wraps it with a unique ID
 */
export function createFileWithId(
  file: File,
  options?: {
    maxSize?: number;
    allowedExtensions?: string[];
    sanitizeName?: boolean;
  }
): { fileWithId: FileWithId; error?: string } {
  // Validate file first
  const validation = validateFile(file, options);
  
  if (!validation.isValid) {
    return {
      fileWithId: {} as FileWithId,
      error: validation.error
    };
  }
  
  // Use sanitized file if available
  const finalFile = validation.sanitizedFile || file;
  const sanitizedName = sanitizeFilename(file.name);
  
  const fileWithId: FileWithId = {
    id: generateFileId(),
    file: finalFile,
    name: sanitizedName,
    size: finalFile.size,
    type: finalFile.type,
    uploadedAt: new Date().toISOString(),
    originalName: sanitizedName !== file.name ? file.name : undefined
  };
  
  return { fileWithId };
}

/**
 * Convert FileWithId array to serializable format for form submission
 * Returns metadata that can be JSON.stringify'd
 */
export function serializeFilesForSubmission(files: FileWithId[]): Array<{
  id: string;
  filename: string;
  originalName?: string;
  size: number;
  type: string;
  uploadedAt: string;
}> {
  return files.map(f => ({
    id: f.id,
    filename: f.name,
    originalName: f.originalName,
    size: f.size,
    type: f.type,
    uploadedAt: f.uploadedAt
  }));
}

/**
 * Check if a value is a FileWithId
 */
export function isFileWithId(value: any): value is FileWithId {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    value.file instanceof File &&
    typeof value.name === 'string' &&
    typeof value.size === 'number' &&
    typeof value.type === 'string' &&
    typeof value.uploadedAt === 'string'
  );
}

/**
 * Check if a value is an array of FileWithId
 */
export function isFileWithIdArray(value: any): value is FileWithId[] {
  return Array.isArray(value) && value.every(isFileWithId);
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length < 2) return '';
  return '.' + parts.pop()?.toLowerCase();
}

/**
 * Sanitize filename according to Platform Data Validation Standards
 * Strips unsafe characters from original filenames
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'file';
  }
  
  // Get extension first
  const extension = getFileExtension(filename);
  const nameWithoutExt = filename.slice(0, filename.length - extension.length);
  
  // Remove unsafe characters: keep only alphanumeric, spaces, hyphens, underscores, periods
  // Replace unsafe characters with underscore
  const sanitized = nameWithoutExt
    .replace(/[^a-zA-Z0-9\s._-]/g, '_') // Replace unsafe chars with underscore
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
  
  // Ensure we have a valid name
  const finalName = sanitized || 'file';
  
  return finalName + extension;
}

/**
 * Validate file extension
 */
export function validateFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const extension = getFileExtension(filename);
  return allowedExtensions.includes(extension.toLowerCase());
}

/**
 * Validate file MIME type
 * Checks both extension and MIME type match according to standards
 */
export function validateFileMimeType(file: File, allowedExtensions: string[]): { isValid: boolean; error?: string } {
  const extension = getFileExtension(file.name);
  
  // Check extension is allowed
  if (!allowedExtensions.includes(extension.toLowerCase())) {
    return {
      isValid: false,
      error: `File extension ${extension} is not allowed. Allowed types: ${allowedExtensions.join(', ')}`
    };
  }
  
  // Get expected MIME types for this extension
  const expectedMimeTypes = ALLOWED_FILE_TYPES[extension.toLowerCase() as keyof typeof ALLOWED_FILE_TYPES];
  
  if (!expectedMimeTypes) {
    return {
      isValid: false,
      error: `No MIME type mapping found for extension ${extension}`
    };
  }
  
  // Validate MIME type matches expected types
  const fileMimeType = file.type.toLowerCase();
  const isValidMimeType = expectedMimeTypes.some(expectedType => 
    fileMimeType === expectedType.toLowerCase()
  );
  
  if (!isValidMimeType) {
    return {
      isValid: false,
      error: `File MIME type ${file.type} does not match expected type for ${extension}. Expected: ${expectedMimeTypes.join(' or ')}`
    };
  }
  
  return { isValid: true };
}

/**
 * Comprehensive file validation according to Platform Data Validation Standards
 * Validates: size, extension, MIME type
 */
export function validateFile(
  file: File,
  options?: {
    maxSize?: number;
    allowedExtensions?: string[];
    sanitizeName?: boolean;
  }
): { isValid: boolean; error?: string; sanitizedFile?: File } {
  const maxSize = options?.maxSize || MAX_FILE_SIZE;
  const allowedExtensions = options?.allowedExtensions || [...DEFAULT_ALLOWED_EXTENSIONS];
  const sanitizeName = options?.sanitizeName !== false; // Default to true
  
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File "${file.name}" exceeds maximum size of ${(maxSize / 1048576).toFixed(1)}MB`
    };
  }
  
  // Validate extension and MIME type
  const mimeValidation = validateFileMimeType(file, allowedExtensions);
  if (!mimeValidation.isValid) {
    return {
      isValid: false,
      error: mimeValidation.error || 'File type validation failed'
    };
  }
  
  // Sanitize filename if requested
  let sanitizedFile = file;
  if (sanitizeName) {
    const sanitizedName = sanitizeFilename(file.name);
    if (sanitizedName !== file.name) {
      // Create new File object with sanitized name
      sanitizedFile = new File([file], sanitizedName, {
        type: file.type,
        lastModified: file.lastModified
      });
    }
  }
  
  return {
    isValid: true,
    sanitizedFile
  };
}

