/**
 * Document Wallet Middleware
 * Main gateway for all document operations
 */

import { generateBlobPath, uploadBlob, generateBlobSasUrl, deleteBlob } from './blob-client.js';
import { calculateNextVersionNumber, extractOrgIdFromToken, hasWritePermission, extractUserRoleFromToken } from './business-logic.js';
import formidable, { File as FormidableFile } from 'formidable';
import fs from 'fs/promises';
import { Buffer } from 'buffer';
import os from 'os';
import path from 'path';

type AnyRequest = {
  method?: string;
  query?: Record<string, string | string[]>;
  body?: any;
  headers: Record<string, string | undefined>;
  [key: string]: any;
};

type AnyResponse = {
  status?: (code: number) => AnyResponse;
  json?: (body: any) => void;
  setHeader?: (k: string, v: string) => void;
  end?: (body?: any) => void;
  [key: string]: any;
};

/**
 * Extract authorization token from request
 */
function getAuthToken(req: AnyRequest): string | null {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;
  
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

/**
 * Extract Azure ID and email from token
 */
function extractUserInfoFromToken(token: string): { azureId?: string; email?: string } {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      console.warn('Token does not have expected JWT structure');
      return {};
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Handle padding
    let padded = base64;
    while (padded.length % 4) {
      padded += '=';
    }

    // Decode base64
    const decoded = Buffer.from(padded, 'base64').toString('utf-8');
    
    // Clean up any control characters that might cause JSON.parse to fail
    const cleaned = decoded.replace(/[\x00-\x1F\x7F]/g, '');
    
    const claims = JSON.parse(cleaned);
    return {
      azureId: claims.oid || claims.sub || claims.localAccountId,
      email: claims.email || claims.preferred_username || claims.upn,
    };
  } catch (error) {
    console.error('Error extracting user info from token:', error);
    // Return empty object instead of throwing - allows fallback to API
    return {};
  }
}

/**
 * GET /api/documents
 * List documents with optional search and category filters
 * Proxies to express server for metadata operations
 */
export async function handleGetDocuments(req: AnyRequest, res: AnyResponse): Promise<void> {
  try {
    const token = getAuthToken(req);
    if (!token) {
      res.status?.(401);
      res.json?.({ error: 'Unauthorized: No token provided' });
      return;
    }

    // Proxy to express server
    // Use localhost:5000 in development if EXPRESS_SERVER_URL is not set
    const expressServerUrl = process.env.EXPRESS_SERVER_URL || 
      (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://kfrealexpressserver.vercel.app');
    const search = typeof req.query?.search === 'string' ? req.query.search : undefined;
    const category = typeof req.query?.category === 'string' ? req.query.category : undefined;

    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (category) queryParams.append('category', category);

    const url = `${expressServerUrl}/api/v1/documents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      res.status?.(response.status);
      res.json?.(error);
      return;
    }

    const data = await response.json();
    res.status?.(200);
    res.json?.(data);
  } catch (error: any) {
    console.error('Error getting documents:', error);
    res.status?.(500);
    res.json?.({ error: error.message || 'Failed to get documents' });
  }
}

/**
 * GET /api/documents/:id
 * Get single document by ID
 * Proxies to express server for metadata operations
 */
export async function handleGetDocument(req: AnyRequest, res: AnyResponse, documentId: string): Promise<void> {
  try {
    const token = getAuthToken(req);
    if (!token) {
      res.status?.(401);
      res.json?.({ error: 'Unauthorized: No token provided' });
      return;
    }

    // Proxy to express server
    // Use localhost:5000 in development if EXPRESS_SERVER_URL is not set
    const expressServerUrl = process.env.EXPRESS_SERVER_URL || 
      (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://kfrealexpressserver.vercel.app');
    const url = `${expressServerUrl}/api/v1/documents/${documentId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      res.status?.(response.status);
      res.json?.(error);
      return;
    }

    const data = await response.json();
    res.status?.(200);
    res.json?.(data);
  } catch (error: any) {
    console.error('Error getting document:', error);
    res.status?.(500);
    res.json?.({ error: error.message || 'Failed to get document' });
  }
}

/**
 * GET /api/documents/:id/versions
 * Get version history for a document
 * Proxies to express server for metadata operations
 */
export async function handleGetDocumentVersions(req: AnyRequest, res: AnyResponse, documentId: string): Promise<void> {
  try {
    const token = getAuthToken(req);
    if (!token) {
      res.status?.(401);
      res.json?.({ error: 'Unauthorized: No token provided' });
      return;
    }

    // Proxy to express server
    // Use localhost:5000 in development if EXPRESS_SERVER_URL is not set
    const expressServerUrl = process.env.EXPRESS_SERVER_URL || 
      (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://kfrealexpressserver.vercel.app');
    const url = `${expressServerUrl}/api/v1/documents/${documentId}/versions`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      res.status?.(response.status);
      res.json?.(error);
      return;
    }

    const data = await response.json();
    res.status?.(200);
    res.json?.(data);
  } catch (error: any) {
    console.error('Error getting document versions:', error);
    res.status?.(500);
    res.json?.({ error: error.message || 'Failed to get document versions' });
  }
}

/**
 * POST /api/documents
 * Create a new document
 */
export async function handleCreateDocument(req: AnyRequest, res: AnyResponse): Promise<void> {
  try {
    const token = getAuthToken(req);
    if (!token) {
      res.status?.(401);
      res.json?.({ error: 'Unauthorized: No token provided' });
      return;
    }

    const userInfo = extractUserInfoFromToken(token);
    const orgId = await extractOrgIdFromToken(token, userInfo.azureId, userInfo.email);
    if (!orgId) {
      res.status?.(403);
      res.json?.({ error: 'Forbidden: Could not extract organisation ID from token' });
      return;
    }

    const userRole = extractUserRoleFromToken(token);
    if (!hasWritePermission(userRole)) {
      res.status?.(403);
      res.json?.({ error: 'Forbidden: Insufficient permissions to create documents' });
      return;
    }

    // Handle multipart/form-data
    const contentType = (req.headers['content-type'] || '').toLowerCase();
    if (contentType.startsWith('multipart/form-data')) {
      const tempDir = path.join(os.tmpdir(), 'vercel-upload');
      await fs.mkdir(tempDir, { recursive: true }).catch(() => {});

      const form = formidable({
        multiples: false,
        keepExtensions: true,
        uploadDir: tempDir,
        maxFileSize: 50 * 1024 * 1024, // 50MB
      });

      const { fields, files } = await new Promise<{ fields: Record<string, any>; files: Record<string, FormidableFile | FormidableFile[]> }>((resolve, reject) => {
        form.parse(req as any, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        res.status?.(400);
        res.json?.({ error: 'No file provided' });
        return;
      }

      const filePath = (file as any).filepath || (file as any).file || (file as any).path;
      const fileBuffer = await fs.readFile(filePath);
      const filename = (file as any).originalFilename || (file as any).newFilename || `upload-${Date.now()}`;

      // Generate temporary document ID for blob path (will be replaced with actual ID from express server)
      const tempDocumentId = `doc-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const versionNumber = 1;

      // Generate blob path with temp ID (will update after document creation)
      const blobPath = generateBlobPath(orgId, tempDocumentId, versionNumber, filename);

      // Upload to blob storage
      const metadata: Record<string, string> = {
        documentId: tempDocumentId,
        organisation: orgId,
        versionNumber: versionNumber.toString(),
      };

      const blobUrl = await uploadBlob(fileBuffer, blobPath, (file as any).mimetype, metadata);

      // Call express server to create document metadata
      const expressServerUrl = process.env.EXPRESS_SERVER_URL || 'https://kfrealexpressserver.vercel.app';
      const documentData = {
        name: Array.isArray(fields.name) ? fields.name[0] : fields.name || filename,
        category: Array.isArray(fields.category) ? fields.category[0] : fields.category || 'documents',
        description: Array.isArray(fields.description) ? fields.description[0] : fields.description,
        expiryDate: Array.isArray(fields.expiryDate) ? fields.expiryDate[0] : fields.expiryDate || null,
        tags: Array.isArray(fields.tags) ? fields.tags[0]?.split(',').map((t: string) => t.trim()) : fields.tags?.split(',').map((t: string) => t.trim()) || [],
        isConfidential: Array.isArray(fields.isConfidential) 
          ? fields.isConfidential[0] === 'true' 
          : fields.isConfidential === 'true' || fields.isConfidential === true,
        fileUrl: blobUrl,
        uploadDate: new Date().toISOString(),
        latestVersion: versionNumber,
      };

      const createResponse = await fetch(`${expressServerUrl}/api/v1/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (!createResponse.ok) {
        const error = await createResponse.json().catch(() => ({ error: createResponse.statusText }));
        // Cleanup blob if metadata creation fails
        await deleteBlob(blobPath).catch(() => {});
        res.status?.(createResponse.status);
        res.json?.(error);
        return;
      }

      const { document } = await createResponse.json();

      // Create version record in express server
      const versionData = {
        versionNumber,
        blobPath,
        filename,
        fileExtension: filename.split('.').pop(),
        fileSize: fileBuffer.length,
        uploadedBy: extractUserRoleFromToken(token) || 'unknown',
        uploadedOn: documentData.uploadDate,
      };

      const versionResponse = await fetch(`${expressServerUrl}/api/v1/documents/${document.id}/versions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(versionData),
      });

      if (!versionResponse.ok) {
        console.warn('Failed to create version record:', await versionResponse.text());
      }

      // Cleanup temp file
      await fs.unlink(filePath).catch(() => {});

      res.status?.(201);
      res.json?.({ document });
    } else {
      res.status?.(400);
      res.json?.({ error: 'Content-Type must be multipart/form-data' });
    }
  } catch (error: any) {
    console.error('Error creating document:', error);
    res.status?.(500);
    res.json?.({ error: error.message || 'Failed to create document' });
  }
}

/**
 * POST /api/documents/:id/versions
 * Create a new version of an existing document
 */
export async function handleCreateDocumentVersion(req: AnyRequest, res: AnyResponse, documentId: string): Promise<void> {
  try {
    const token = getAuthToken(req);
    if (!token) {
      res.status?.(401);
      res.json?.({ error: 'Unauthorized: No token provided' });
      return;
    }

    const userInfo = extractUserInfoFromToken(token);
    const orgId = await extractOrgIdFromToken(token, userInfo.azureId, userInfo.email);
    if (!orgId) {
      res.status?.(403);
      res.json?.({ error: 'Forbidden: Could not extract organisation ID from token' });
      return;
    }

    const userRole = extractUserRoleFromToken(token);
    if (!hasWritePermission(userRole || undefined)) {
      res.status?.(403);
      res.json?.({ error: 'Forbidden: Insufficient permissions to create document versions' });
      return;
    }

    // Verify document belongs to organisation by fetching from express server
    const expressServerUrl = process.env.EXPRESS_SERVER_URL || 
      (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://kfrealexpressserver.vercel.app');
    const docGetResponse = await fetch(`${expressServerUrl}/api/v1/documents/${documentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!docGetResponse.ok) {
      res.status?.(docGetResponse.status);
      const error = await docGetResponse.json().catch(() => ({ error: docGetResponse.statusText }));
      res.json?.(error);
      return;
    }
    
    const { document: docData } = await docGetResponse.json();
    const docOrgId = docData?.organisation || '';
    if (docOrgId && docOrgId !== orgId) {
      res.status?.(403);
      res.json?.({ error: 'Forbidden: Document does not belong to your organisation' });
      return;
    }

    // Handle multipart/form-data
    const contentType = (req.headers['content-type'] || '').toLowerCase();
    if (contentType.startsWith('multipart/form-data')) {
      const tempDir = path.join(os.tmpdir(), 'vercel-upload');
      await fs.mkdir(tempDir, { recursive: true }).catch(() => {});

      const form = formidable({
        multiples: false,
        keepExtensions: true,
        uploadDir: tempDir,
        maxFileSize: 50 * 1024 * 1024, // 50MB
      });

      const { files } = await new Promise<{ fields: Record<string, any>; files: Record<string, FormidableFile | FormidableFile[]> }>((resolve, reject) => {
        form.parse(req as any, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        res.status?.(400);
        res.json?.({ error: 'No file provided' });
        return;
      }

      const filePath = (file as any).filepath || (file as any).file || (file as any).path;
      const fileBuffer = await fs.readFile(filePath);
      const filename = (file as any).originalFilename || (file as any).newFilename || `upload-${Date.now()}`;

      // Get existing versions from express server to calculate next version number
      const expressServerUrl = process.env.EXPRESS_SERVER_URL || 'https://kfrealexpressserver.vercel.app';
      const versionsResponse = await fetch(`${expressServerUrl}/api/v1/documents/${documentId}/versions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let versionNumber = 1;
      if (versionsResponse.ok) {
        const { versions } = await versionsResponse.json();
        const versionNumbers = versions.map((v: any) => v.versionNumber || 0);
        versionNumber = calculateNextVersionNumber(versionNumbers);
      } else {
        // Fallback: try to get from document
        const docResponse = await fetch(`${expressServerUrl}/api/v1/documents/${documentId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (docResponse.ok) {
          const { document } = await docResponse.json();
          versionNumber = (document.latestVersion || 0) + 1;
        }
      }

      // Generate blob path
      const blobPath = generateBlobPath(orgId, documentId, versionNumber, filename);

      // Upload to blob storage
      const metadata: Record<string, string> = {
        documentId,
        organisation: orgId,
        versionNumber: versionNumber.toString(),
      };

      await uploadBlob(fileBuffer, blobPath, (file as any).mimetype, metadata);

      // Call express server to create version metadata
      const versionData = {
        versionNumber,
        blobPath,
        filename,
        fileExtension: filename.split('.').pop(),
        fileSize: fileBuffer.length,
        uploadedBy: extractUserRoleFromToken(token) || 'unknown',
        uploadedOn: new Date().toISOString(),
      };

      const createVersionResponse = await fetch(`${expressServerUrl}/api/v1/documents/${documentId}/versions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(versionData),
      });

      if (!createVersionResponse.ok) {
        const error = await createVersionResponse.json().catch(() => ({ error: createVersionResponse.statusText }));
        // Cleanup blob if version creation fails
        await deleteBlob(blobPath).catch(() => {});
        res.status?.(createVersionResponse.status);
        res.json?.(error);
        return;
      }

      const { version } = await createVersionResponse.json();

      // Cleanup temp file
      await fs.unlink(filePath).catch(() => {});

      res.status?.(201);
      res.json?.({ version });
    } else {
      res.status?.(400);
      res.json?.({ error: 'Content-Type must be multipart/form-data' });
    }
  } catch (error: any) {
    console.error('Error creating document version:', error);
    res.status?.(500);
    res.json?.({ error: error.message || 'Failed to create document version' });
  }
}

/**
 * GET /api/documents/:id/versions/:versionId/download
 * Generate download URL for a specific version
 */
export async function handleDownloadVersion(
  req: AnyRequest,
  res: AnyResponse,
  documentId: string,
  versionId: string
): Promise<void> {
  try {
    const token = getAuthToken(req);
    if (!token) {
      res.status?.(401);
      res.json?.({ error: 'Unauthorized: No token provided' });
      return;
    }

    const userInfo = extractUserInfoFromToken(token);
    const orgId = await extractOrgIdFromToken(token, userInfo.azureId, userInfo.email);
    if (!orgId) {
      res.status?.(403);
      res.json?.({ error: 'Forbidden: Could not extract organisation ID from token' });
      return;
    }

    // Get version details from express server
    const expressServerUrl = process.env.EXPRESS_SERVER_URL || 'https://kfrealexpressserver.vercel.app';
    const versionsResponse = await fetch(`${expressServerUrl}/api/v1/documents/${documentId}/versions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!versionsResponse.ok) {
      const error = await versionsResponse.json().catch(() => ({ error: versionsResponse.statusText }));
      res.status?.(versionsResponse.status);
      res.json?.(error);
      return;
    }

    const { versions } = await versionsResponse.json();
    const version = versions.find((v: any) => v.id === versionId);
    
    if (!version) {
      res.status?.(404);
      res.json?.({ error: 'Version not found' });
      return;
    }

    // Get document to check if confidential
    const docResponse = await fetch(`${expressServerUrl}/api/v1/documents/${documentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    let isConfidential = false;
    if (docResponse.ok) {
      const { document } = await docResponse.json();
      isConfidential = document.isConfidential || false;
    }

    const downloadUrl = await generateBlobSasUrl(version.blobPath, isConfidential);

    res.status?.(200);
    res.json?.({ downloadUrl, version });
  } catch (error: any) {
    console.error('Error generating download URL:', error);
    res.status?.(500);
    res.json?.({ error: error.message || 'Failed to generate download URL' });
  }
}

/**
 * DELETE /api/documents/:id
 * Delete a document and all its versions
 */
export async function handleDeleteDocument(req: AnyRequest, res: AnyResponse, documentId: string): Promise<void> {
  try {
    const token = getAuthToken(req);
    if (!token) {
      res.status?.(401);
      res.json?.({ error: 'Unauthorized: No token provided' });
      return;
    }

    const userInfo = extractUserInfoFromToken(token);
    const orgId = await extractOrgIdFromToken(token, userInfo.azureId, userInfo.email);
    if (!orgId) {
      res.status?.(403);
      res.json?.({ error: 'Forbidden: Could not extract organisation ID from token' });
      return;
    }

    const userRole = extractUserRoleFromToken(token);
    if (!hasWritePermission(userRole || undefined)) {
      res.status?.(403);
      res.json?.({ error: 'Forbidden: Insufficient permissions to delete documents' });
      return;
    }

    // Get document first to check if we need to delete blob
    const expressServerUrl = process.env.EXPRESS_SERVER_URL || 'https://kfrealexpressserver.vercel.app';
    const getUrl = `${expressServerUrl}/api/v1/documents/${documentId}`;
    
    const getResponse = await fetch(getUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!getResponse.ok) {
      const error = await getResponse.json().catch(() => ({ error: getResponse.statusText }));
      res.status?.(getResponse.status);
      res.json?.(error);
      return;
    }

    // Document fetched for verification, but not needed for deletion
    await getResponse.json();

    // Get versions and delete blobs
    const versionsResponse = await fetch(`${expressServerUrl}/api/v1/documents/${documentId}/versions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (versionsResponse.ok) {
      const { versions } = await versionsResponse.json();
      for (const version of versions || []) {
        if (version.blobPath) {
          try {
            await deleteBlob(version.blobPath);
          } catch (blobError) {
            console.warn('Failed to delete blob:', version.blobPath, blobError);
          }
        }
      }
    }

    // Delete metadata from express server
    const deleteUrl = `${expressServerUrl}/api/v1/documents/${documentId}`;
    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!deleteResponse.ok) {
      const error = await deleteResponse.json().catch(() => ({ error: deleteResponse.statusText }));
      res.status?.(deleteResponse.status);
      res.json?.(error);
      return;
    }

    res.status?.(200);
    res.json?.({ success: true });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    res.status?.(500);
    res.json?.({ error: error.message || 'Failed to delete document' });
  }
}

