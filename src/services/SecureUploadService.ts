/**
 * Enhanced upload service with validation and user-specific access control
 */

import { createDocument } from './DataverseService'
import { getCachedAccountId } from './UserProfileService'

export interface UploadOptions {
  file: File
  userId: string
  userEmail?: string
  category?: string
  description?: string
  expiryDate?: string
  tags?: string | string[]
  isConfidential?: boolean
  onProgress?: (progress: number) => void
}

export interface UploadResult {
  success: boolean
  fileUrl?: string // Direct access to the uploaded file URL (same as download URL)
  blobPath?: string // The blob path in Azure Storage
  document?: {
    id: string
    name: string
    category: string
    fileUrl: string
    uploadDate: string
    uploadedBy: string
    status: string
  }
  error?: string
  warnings?: string[]
}

export interface ValidationResult {
  success: boolean
  putUrl?: string
  publicUrl?: string
  blobPath?: string
  expiresAt?: string
  warnings?: string[]
  metadata?: any
  error?: string
}

/**
 * Enhanced upload service with validation and user-specific access control
 */
export class SecureUploadService {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  /**
   * Upload a file with validation and user-specific access control
   */
  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    const { file, userId, userEmail, category, description, expiryDate, tags, isConfidential, onProgress } = options

    try {
      // Step 1: Get account ID from Azure ID (for local validation and metadata)
      onProgress?.(5)
      console.log('🔵 Retrieving account ID for user:', userId)
      console.log('   User email:', userEmail || 'not provided')
      
      let accountId: string
      try {
        accountId = await getCachedAccountId(userId, userEmail)
        console.log('✅ Account ID retrieved:', accountId)
      } catch (error) {
        console.error('❌ Failed to get account ID:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to retrieve account information. Please try again.'
        }
      }

      // Step 2: Validate file locally (no longer generates blobPath here)
      onProgress?.(15)
      const validation = await this.validateFile(file, accountId, category, description, expiryDate, tags, isConfidential)
      
      if (!validation.success) {
        return {
          success: false,
          error: validation.error
        }
      }

      // Step 3: Upload file to Azure Storage via API (server generates secure blob path)
      onProgress?.(40)
      const uploadResult = await this.uploadToAzureViaAPI(file, userId, userEmail, category, validation.metadata)
      
      if (!uploadResult.success) {
        return {
          success: false,
          error: uploadResult.error || 'Failed to upload file to Azure Storage'
        }
      }

      // Extract blob path from the returned URL
      const blobPath = uploadResult.url ? this.extractBlobPathFromUrl(uploadResult.url) : undefined;

      // Step 4: Update Dataverse with document metadata
      onProgress?.(85)
      const documentResult = await this.createDocumentRecord({
        ...validation.metadata,
        blobPath: blobPath || `accounts/${accountId}/${category || 'documents'}/${file.name}`,
        publicUrl: uploadResult.url!
      })

      onProgress?.(100)

      const finalResult = {
        success: true,
        fileUrl: uploadResult.url!, // Direct access to Azure Blob Storage URL
        blobPath: blobPath, // The blob path (used for downloads)
        document: documentResult.document,
        warnings: validation.warnings
      };

      console.log('🎉 Upload Complete! Response Object:');
      console.log('├─ File ID:', documentResult.document?.id);
      console.log('├─ File URL:', uploadResult.url);
      console.log('├─ Blob Path:', blobPath);
      console.log('└─ Full Response:', JSON.stringify(finalResult, null, 2));

      return finalResult;

    } catch (error: any) {
      console.error('Upload failed:', error)
      return {
        success: false,
        error: error.message || 'Upload failed'
      }
    }
  }

  /**
   * Extract blob path from Azure Storage URL
   */
  private extractBlobPathFromUrl(url: string): string | undefined {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      // Remove leading slash and container name
      // Format: /container-name/accounts/accountId/category/filename
      const parts = pathname.split('/').filter(p => p);
      if (parts.length > 1) {
        // Remove container name (first part)
        return parts.slice(1).join('/');
      }
      return undefined;
    } catch (error) {
      console.error('Failed to extract blob path from URL:', error);
      return undefined;
    }
  }

  /**
   * Validate file and user permissions
   */
  private async validateFile(
    file: File, 
    accountId: string,  // Now uses accountId instead of userId
    category?: string, 
    description?: string,
    expiryDate?: string,
    tags?: string | string[],
    isConfidential?: boolean
  ): Promise<ValidationResult> {
    // Basic client-side validation
    const maxSize = 50 * 1024 * 1024 // 50MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'text/plain'
    ]

    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`
      }
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `File type ${file.type} is not allowed`
      }
    }

    // No longer generating blob path here - server will handle it
    return {
      success: true,
      metadata: {
        filename: file.name,
        contentType: file.type,
        fileSize: file.size,
        accountId,  // Use accountId in metadata
        category,
        description,
        expiryDate,
        tags,
        isConfidential,
        uploadedAt: new Date().toISOString()
      }
    }
  }

  /**
   * Upload file to Azure Storage via API endpoint
   * Now sends userId and userEmail instead of blobPath - server generates secure path
   */
  private async uploadToAzureViaAPI(file: File, userId: string, userEmail?: string, category?: string, metadata?: any): Promise<{success: boolean, url?: string, error?: string}> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId) // Send userId instead of blobPath
      if (userEmail) formData.append('userEmail', userEmail) // Send userEmail for organization-info API
      
      // Add metadata to form data if provided
      if (metadata) {
        if (metadata.category || category) formData.append('category', metadata.category || category || 'documents');
        if (metadata.description) formData.append('description', metadata.description);
        if (metadata.expiryDate) formData.append('expiryDate', metadata.expiryDate);
        if (metadata.tags) formData.append('tags', Array.isArray(metadata.tags) ? metadata.tags.join(',') : metadata.tags);
        if (metadata.isConfidential !== undefined) formData.append('isConfidential', metadata.isConfidential.toString());
      } else if (category) {
        formData.append('category', category);
      }

      console.log('📤 Uploading to API with userId:', userId, 'userEmail:', userEmail || 'not provided', 'category:', category || 'documents');

      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
        return {
          success: false,
          error: errorData.error || `Upload failed with status ${response.status}`
        }
      }

      const result = await response.json()
      
      console.log('📦 Upload API Response:', JSON.stringify(result, null, 2));
      
      // Handle both single URL and array of URLs response formats
      const url = result.url || (result.urls && result.urls[0])
      
      if (!url) {
        return {
          success: false,
          error: 'No URL returned from upload API'
        }
      }

      console.log('✅ File uploaded to Azure Storage. URL:', url);

      return {
        success: true,
        url: url
      }
    } catch (error: any) {
      console.error('Azure Storage API upload failed:', error)
      return {
        success: false,
        error: error.message || 'Network error during upload'
      }
    }
  }

  /**
   * Create document record in Dataverse
   */
  private async createDocumentRecord(metadata: any): Promise<{ document: any }> {
    
    const documentMetadata = {
      name: metadata.filename,
      category: metadata.category || 'documents',
      description: metadata.description || '',
      fileType: metadata.contentType,
      fileSize: metadata.fileSize.toString(),
      fileUrl: metadata.publicUrl,
      uploadDate: metadata.uploadedAt,
      uploadedBy: metadata.accountId,  // Use accountId instead of userId
      status: 'Active', // Fixed: Capital A to match filter logic
      isConfidential: false,
      tags: metadata.category ? [metadata.category] : []
    }

    const document = await createDocument(documentMetadata)
    return { document }
  }

  /**
   * Get user-specific documents
   */
  async getUserDocuments(userId: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/documents/user/${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch user documents')
    }

    return await response.json()
  }

  /**
   * Generate download URL for a document (with user access validation)
   */
  async getDownloadUrl(documentId: string, userId: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/documents/${documentId}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    })

    if (!response.ok) {
      throw new Error('Failed to generate download URL')
    }

    const result = await response.json()
    return result.downloadUrl
  }

  /**
   * Delete a document (with user access validation)
   */
  async deleteDocument(documentId: string, userId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    })

    return response.ok
  }

}

// Export singleton instance
export const secureUploadService = new SecureUploadService()
