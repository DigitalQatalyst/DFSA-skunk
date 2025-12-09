// api/upload.ts
/**
 * Vercel serverless function (TypeScript)
 * - Simplified upload endpoint with Account ID validation
 * - Requires: "formidable" and "@azure/storage-blob" in dependencies
 */

import formidable, { File as FormidableFile } from 'formidable';
import fs from 'fs/promises';
import { Buffer } from 'buffer';
import os from 'os';
import path from 'path';
import {
  StorageSharedKeyCredential,
  BlobServiceClient
} from '@azure/storage-blob';

// Vercel serverless functions don't use Next.js config pattern
// For multipart/form-data, we handle parsing manually with formidable

const sanitizeEnv = (v?: string) => (v || '').toString().trim().replace(/^["']|["'];?$/g, '');

/**
 * Fetch Account ID from Azure ID via backend API
 * @param azureId - The Azure AD user ID (from MSAL)
 * @param userEmail - The user's email address (from MSAL)
 */
async function getAccountIdFromAzureId(azureId: string, userEmail?: string): Promise<string> {
  const API_BASE_URL = 'https://kfrealexpressserver.vercel.app/api/v1';
  
  try {
    console.log('🔵 [Upload API] Fetching account ID for Azure ID:', azureId);
    console.log('   User email:', userEmail || 'not provided');

    const response = await fetch(`${API_BASE_URL}/auth/organization-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        azureid: azureId,
        useremail: userEmail || ''
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to fetch organization info: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📦 [Upload API] Organization info response:', JSON.stringify(data, null, 2));
    
    // Extract accountId from response (check organization object)
    const accountId = data?.organization?.accountId || data?.profile?.accountId || data?.accountId;

    if (!accountId || accountId === null) {
      console.error('❌ [Upload API] No account ID found in response:', data);
      console.log('   Response structure:', {
        hasOrganization: !!data?.organization,
        hasProfile: !!data?.profile,
        hasAccountId: !!data?.accountId,
        organizationAccountId: data?.organization?.accountId,
        hasAccount: data?.organization?.hasAccount,
        hasContact: data?.organization?.hasContact
      });
      throw new Error('No account associated with your user ID. Please contact support to link your account.');
    }

    console.log('✅ [Upload API] Account ID retrieved:', accountId);
    return accountId;

  } catch (error) {
    console.error('🔴 [Upload API] Error fetching account ID:', error);
    throw error;
  }
}

/**
 * Generate secure blob path using Account ID
 */
function generateBlobPath(accountId: string, category: string, filename: string): string {
  const timestamp = Date.now();
  const sanitizedFileName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `accounts/${accountId}/${category || 'documents'}/${timestamp}-${sanitizedFileName}`;
}

const STORAGE_ACCOUNT_NAME = sanitizeEnv(process.env.STORAGE_ACCOUNT_NAME || process.env.VITE_STORAGE_ACCOUNT_NAME);
const CONTAINER_NAME = sanitizeEnv(process.env.CONTAINER_NAME || process.env.VITE_CONTAINER_NAME);
const STORAGE_ACCOUNT_KEY = sanitizeEnv(process.env.AZURE_STORAGE_ACCOUNT_KEY);
const SAS_TOKEN = sanitizeEnv(process.env.SAS_TOKEN || process.env.VITE_SAS_TOKEN).replace(/^\?/, '');

const AZURE_STORAGE_API_VERSION = '2020-10-02';

if (!STORAGE_ACCOUNT_NAME || !CONTAINER_NAME) {
  console.warn('Missing STORAGE_ACCOUNT_NAME or CONTAINER_NAME env vars.');
}

const uploadBufferToBlob = async (buffer: Buffer, blobName: string, contentType?: string, metadata?: Record<string, string>): Promise<string> => {
  if (!STORAGE_ACCOUNT_KEY && !SAS_TOKEN) {
    throw new Error('No AZURE_STORAGE_ACCOUNT_KEY or SAS_TOKEN available for upload.');
  }

  if (STORAGE_ACCOUNT_KEY) {
    const credential = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME!, STORAGE_ACCOUNT_KEY);
    const serviceClient = new BlobServiceClient(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, credential);
    const containerClient = serviceClient.getContainerClient(CONTAINER_NAME!);

    try {
      await containerClient.createIfNotExists();
    } catch (e) {
      // ignore creation errors
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: contentType || 'application/octet-stream' },
      metadata: metadata || {}
    });

    const safeName = encodeURIComponent(blobName);
    return `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${safeName}`;
  }

  // Fallback: use SAS token
  const safeName = encodeURIComponent(blobName);
  const urlWithSas = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${safeName}?${SAS_TOKEN}`;
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  const res = await fetch(urlWithSas, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-version': AZURE_STORAGE_API_VERSION,
      'Content-Type': contentType || 'application/octet-stream',
      'x-ms-blob-content-type': contentType || 'application/octet-stream',
    },
    body: arrayBuffer as unknown as ArrayBuffer,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Fallback SAS upload failed: ${res.status} ${res.statusText} ${text}`);
  }
  return `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${safeName}`;
};

type AnyRequest = {
  method?: string;
  headers: Record<string, string | undefined> & { host?: string; 'x-forwarded-proto'?: string };
  url?: string;
  [key: string]: any;
};

type AnyResponse = {
  status?: (code: number) => AnyResponse;
  json?: (body: any) => void;
  setHeader?: (k: string, v: string) => void;
  end?: (body?: any) => void;
  [key: string]: any;
};

export default async function handler(req: AnyRequest, res: AnyResponse): Promise<void> {
  // Add CORS headers
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type, x-blob-name, x-upload-content-type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status?.(200);
    res.end?.();
    return;
  }

  try {
    if (req.method !== 'POST') {
      res.status?.(405);
      res.json?.({ error: 'Method not allowed' });
      return;
    }

    const contentType = (req.headers['content-type'] || '').toLowerCase();

    // Multipart/form-data -> formidable
    if (contentType.startsWith('multipart/form-data')) {
      // Use OS temp directory to avoid path issues with spaces on Windows
      // os.tmpdir() returns a path without spaces (usually C:\Users\...\AppData\Local\Temp)
      const tempDir = path.join(os.tmpdir(), 'vercel-upload');
      
      // Ensure temp directory exists
      try {
        await fs.mkdir(tempDir, { recursive: true });
      } catch (e) {
        // Directory might already exist, ignore
      }
      
      const form = formidable({ 
        multiples: true, 
        keepExtensions: true,
        uploadDir: tempDir,
        maxFileSize: 50 * 1024 * 1024 // 50MB
      });

      const { fields, files } = await new Promise<{ fields: Record<string, any>; files: Record<string, FormidableFile | FormidableFile[]> }>((resolve, reject) => {
        form.parse(req as any, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });

      // Normalize files into array
      const flatFiles: FormidableFile[] = [];
      for (const key of Object.keys(files || {})) {
        const entry = files[key];
        if (Array.isArray(entry)) flatFiles.push(...entry);
        else flatFiles.push(entry as FormidableFile);
      }

      if (flatFiles.length === 0) {
        res.status?.(400);
        res.json?.({ error: 'No files uploaded' });
        return;
      }

      // Get userId and metadata from form fields
      const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
      const userEmail = Array.isArray(fields.userEmail) ? fields.userEmail[0] : fields.userEmail;
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const expiryDate = Array.isArray(fields.expiryDate) ? fields.expiryDate[0] : fields.expiryDate;
      const tags = Array.isArray(fields.tags) ? fields.tags[0] : fields.tags;
      const isConfidential = Array.isArray(fields.isConfidential) ? fields.isConfidential[0] : fields.isConfidential;

      // Validate userId is provided
      if (!userId) {
        res.status?.(400);
        res.json?.({ error: 'userId is required for secure uploads' });
        return;
      }

      // Fetch Account ID from Azure ID
      let accountId: string;
      try {
        accountId = await getAccountIdFromAzureId(userId, userEmail);
      } catch (error: any) {
        console.error('❌ [Upload API] Failed to get account ID:', error);
        res.status?.(400);
        res.json?.({ error: error.message || 'Failed to retrieve account information' });
        return;
      }

      // Prepare metadata for blob storage
      const metadata: Record<string, string> = {};
      if (category) metadata.category = category;
      if (description) metadata.description = description;
      if (expiryDate) metadata.expiryDate = expiryDate;
      if (tags) metadata.tags = tags;
      if (isConfidential) metadata.isConfidential = isConfidential;
      if (accountId) metadata.accountId = accountId;
      metadata.uploadedAt = new Date().toISOString();

      const urls: string[] = [];
      for (const f of flatFiles) {
        const pathKey = (f as any).filepath || (f as any).file || (f as any).path;
        if (!pathKey) continue;
        const buffer = await fs.readFile(pathKey);
        
        // Generate secure blob path using Account ID
        const originalFilename = (f as any).originalFilename || (f as any).newFilename || `upload-${Date.now()}`;
        const blobName = generateBlobPath(accountId, category || 'documents', originalFilename);
        
        console.log('📁 [Upload API] Generated blob path:', blobName);
        
        const url = await uploadBufferToBlob(buffer, blobName, (f as any).mimetype || 'application/octet-stream', metadata);
        urls.push(url);
        // cleanup temp file
        await fs.unlink(pathKey).catch(() => {});
      }

      res.status?.(201);
      res.json?.({ urls });
      return;
    }

    // Raw binary upload
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'localhost';
    const reqUrl = `${proto}://${host}${req.url || ''}`;
    const urlObj = new URL(reqUrl);
    
    // Get userId, userEmail and filename from query params or headers
    const userId = urlObj.searchParams.get('userId') || req.headers['x-user-id'];
    const userEmail = urlObj.searchParams.get('userEmail') || req.headers['x-user-email'];
    const filename = urlObj.searchParams.get('filename') || req.headers['x-filename'] || `upload-${Date.now()}`;
    const category = urlObj.searchParams.get('category') || req.headers['x-category'] || 'documents';
    
    if (!userId) {
      res.status?.(400);
      res.json?.({ error: 'userId required (query param or x-user-id header) for raw uploads' });
      return;
    }

    // Fetch Account ID from Azure ID
    let accountId: string;
    try {
      accountId = await getAccountIdFromAzureId(userId, userEmail);
    } catch (error: any) {
      console.error('❌ [Upload API] Failed to get account ID for raw upload:', error);
      res.status?.(400);
      res.json?.({ error: error.message || 'Failed to retrieve account information' });
      return;
    }

    // Read raw body
    const chunks: Buffer[] = [];
    for await (const chunk of req as any) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    if (!buffer || buffer.length === 0) {
      res.status?.(400);
      res.json?.({ error: 'No body provided for raw upload' });
      return;
    }

    const uploadContentType = req.headers['x-upload-content-type'] || req.headers['content-type'] || 'application/octet-stream';
    
    // Get metadata from headers if provided
    const metadata: Record<string, string> = {};
    if (req.headers['x-category']) metadata.category = req.headers['x-category'];
    if (req.headers['x-description']) metadata.description = req.headers['x-description'];
    if (req.headers['x-expiry-date']) metadata.expiryDate = req.headers['x-expiry-date'];
    if (req.headers['x-tags']) metadata.tags = req.headers['x-tags'];
    if (req.headers['x-is-confidential']) metadata.isConfidential = req.headers['x-is-confidential'];
    if (accountId) metadata.accountId = accountId;
    metadata.uploadedAt = new Date().toISOString();
    
    // Generate secure blob path using Account ID
    const blobName = generateBlobPath(accountId, category, filename);
    console.log('📁 [Upload API] Generated blob path for raw upload:', blobName);
    
    const blobUrl = await uploadBufferToBlob(buffer, blobName, uploadContentType, metadata);
    res.status?.(201);
    res.json?.({ url: blobUrl });
    return;
  } catch (err: any) {
    console.error('api/upload error:', err);
    try {
      res.status?.(500);
      res.json?.({ error: err?.message || 'Upload error' });
    } catch {
      // swallow
    }
  }
}
