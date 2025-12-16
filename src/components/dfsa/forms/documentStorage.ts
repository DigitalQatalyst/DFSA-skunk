/**
 * DFSA Financial Services Application - Document Storage Service
 *
 * Provides localStorage-based document management for file uploads.
 * This is a temporary solution before Supabase integration.
 *
 * Requirements: 4.1, 4.2
 */

// Storage key for documents
export const DOCUMENTS_STORAGE_KEY = 'dfsa-fs-application-documents';

/**
 * Allowed file types per requirement 4.1
 */
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'image/jpeg',
  'image/png'
];

/**
 * File extension to MIME type mapping
 */
export const FILE_EXTENSION_MAP: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png'
};

/**
 * Maximum file size in bytes (10MB per requirement 4.2)
 */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_FILE_SIZE_MB = 10;

/**
 * Document metadata stored in localStorage
 */
export interface StoredDocument {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileData: string; // Base64 encoded
  stepId: string;
  fieldId: string;
  documentType: string;
  uploadDate: string; // ISO date string
}

/**
 * Document validation result
 */
export interface DocumentValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Document upload result
 */
export interface DocumentUploadResult {
  success: boolean;
  document?: StoredDocument;
  error?: string;
}

/**
 * Generates a unique document ID
 */
export function generateDocumentId(): string {
  return `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Validates a file against DFSA requirements
 * Requirements: 4.1, 4.2
 *
 * @param file - File to validate
 * @returns Validation result
 */
export function validateFile(file: File): DocumentValidationResult {
  // Check file type (Requirement 4.1)
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    const allowedExtensions = Object.keys(FILE_EXTENSION_MAP).join(', ');
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedExtensions}`
    };
  }

  // Check file size (Requirement 4.2)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty'
    };
  }

  return { isValid: true };
}

/**
 * Converts a File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Converts base64 string back to Blob for preview/download
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot !== -1 ? fileName.substring(lastDot).toLowerCase() : '';
}

/**
 * Gets all documents from localStorage
 */
export function getDocumentsFromStorage(): StoredDocument[] {
  try {
    const stored = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load documents from localStorage:', error);
    return [];
  }
}

/**
 * Gets documents filtered by step and/or field
 */
export function getDocumentsByStep(stepId: string, fieldId?: string): StoredDocument[] {
  const documents = getDocumentsFromStorage();
  return documents.filter(doc => {
    if (fieldId) {
      return doc.stepId === stepId && doc.fieldId === fieldId;
    }
    return doc.stepId === stepId;
  });
}

/**
 * Gets a single document by ID
 */
export function getDocumentById(documentId: string): StoredDocument | null {
  const documents = getDocumentsFromStorage();
  return documents.find(doc => doc.id === documentId) || null;
}

/**
 * Saves documents to localStorage
 */
function saveDocumentsToStorage(documents: StoredDocument[]): boolean {
  try {
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
    return true;
  } catch (error) {
    console.error('Failed to save documents to localStorage:', error);
    return false;
  }
}

/**
 * Uploads a document to localStorage
 * Requirements: 4.1, 4.2
 *
 * @param file - File to upload
 * @param stepId - Step ID where the document is uploaded
 * @param fieldId - Field ID for the document
 * @param documentType - Type/category of the document
 * @returns Upload result
 */
export async function uploadDocument(
  file: File,
  stepId: string,
  fieldId: string,
  documentType: string
): Promise<DocumentUploadResult> {
  // Validate file
  const validation = validateFile(file);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error
    };
  }

  try {
    // Convert file to base64
    const fileData = await fileToBase64(file);

    // Create document record
    const document: StoredDocument = {
      id: generateDocumentId(),
      fileName: `${generateDocumentId()}_${file.name}`,
      originalName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      fileData,
      stepId,
      fieldId,
      documentType,
      uploadDate: new Date().toISOString()
    };

    // Get existing documents and add new one
    const documents = getDocumentsFromStorage();
    documents.push(document);

    // Save to localStorage
    const saved = saveDocumentsToStorage(documents);
    if (!saved) {
      return {
        success: false,
        error: 'Failed to save document to storage'
      };
    }

    return {
      success: true,
      document
    };
  } catch (error) {
    console.error('Failed to upload document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload document'
    };
  }
}

/**
 * Deletes a document from localStorage
 * Requirement 4.5: Delete document functionality
 *
 * @param documentId - ID of document to delete
 * @returns True if successful
 */
export function deleteDocument(documentId: string): boolean {
  try {
    const documents = getDocumentsFromStorage();
    const filtered = documents.filter(doc => doc.id !== documentId);

    if (filtered.length === documents.length) {
      // Document not found
      return false;
    }

    return saveDocumentsToStorage(filtered);
  } catch (error) {
    console.error('Failed to delete document:', error);
    return false;
  }
}

/**
 * Clears all documents from localStorage
 */
export function clearAllDocuments(): boolean {
  try {
    localStorage.removeItem(DOCUMENTS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear documents:', error);
    return false;
  }
}

/**
 * Creates a download URL for a document
 */
export function createDocumentDownloadUrl(document: StoredDocument): string {
  const blob = base64ToBlob(document.fileData, document.mimeType);
  return URL.createObjectURL(blob);
}

/**
 * Downloads a document
 */
export function downloadDocument(document: StoredDocument): void {
  const url = createDocumentDownloadUrl(document);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = document.originalName;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Gets document count for an application
 */
export function getDocumentCount(): number {
  return getDocumentsFromStorage().length;
}

/**
 * Gets total size of all documents
 */
export function getTotalDocumentSize(): number {
  const documents = getDocumentsFromStorage();
  return documents.reduce((total, doc) => total + doc.fileSize, 0);
}
