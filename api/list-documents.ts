// api/list-documents.ts
/**
 * Vercel serverless function to list documents from Azure Blob Storage
 * Lists all blobs for a specific user by filtering blobs with the user's folder prefix
 */

import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  ContainerClient
} from '@azure/storage-blob';

// Vercel serverless functions don't use Next.js config pattern
// Body parsing is handled automatically by Vercel for JSON requests

// Sanitize environment variables - remove quotes and semicolons
const sanitizeEnv = (v?: string) => (v || '').toString().trim().replace(/^["']|["'];?$/g, '');

/**
 * List blobs for a specific account from Azure Blob Storage
 * @param accountId - The Dataverse account ID
 * @param userId - Optional user ID for filtering (if not provided, shows all account documents)
 */
async function listAccountBlobs(accountId: string, userId?: string): Promise<any[]> {
  const account = sanitizeEnv(process.env.STORAGE_ACCOUNT_NAME || process.env.AZURE_STORAGE_ACCOUNT);
  const container = sanitizeEnv(process.env.CONTAINER_NAME || process.env.AZURE_STORAGE_CONTAINER) || 'kf-firm-wallet-container';
  const key = sanitizeEnv(process.env.AZURE_STORAGE_ACCOUNT_KEY);
  const sasToken = sanitizeEnv(process.env.SAS_TOKEN || process.env.VITE_SAS_TOKEN);

  if (!account) {
    throw new Error('Missing STORAGE_ACCOUNT_NAME in environment variables');
  }

  console.log(`Listing blobs for account: ${accountId} in container: ${container}`);
  if (userId) {
    console.log(`   Filtering by user: ${userId}`);
  }

  let containerClient: ContainerClient;

  // Try to use Storage Account Key for better permissions
  if (key) {
    console.log('Using Storage Account Key for listing blobs');
    const credential = new StorageSharedKeyCredential(account, key);
    const blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net`,
      credential
    );
    containerClient = blobServiceClient.getContainerClient(container);
  } else if (sasToken) {
    console.log('Using SAS token for listing blobs');
    const cleanToken = sasToken.startsWith('?') ? sasToken : `?${sasToken}`;
    const blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net${cleanToken}`
    );
    containerClient = blobServiceClient.getContainerClient(container);
  } else {
    throw new Error('Missing Azure storage credentials. Provide either AZURE_STORAGE_ACCOUNT_KEY or SAS_TOKEN');
  }

  const documents: any[] = [];
  
  // List blobs with the account's folder prefix
  // Blobs are stored as: accounts/{accountId}/category/timestamp-filename.ext
  const prefix = `accounts/${accountId}/`;

  try {
    const iterator = containerClient.listBlobsFlat({ prefix });
    
    for await (const blob of iterator) {
      // Skip if blob is a folder (ends with /)
      if (blob.name.endsWith('/')) continue;

      // Extract metadata - accountId should be in blob metadata
      const uploadedBy = blob.metadata?.accountId || blob.metadata?.userId || 'Unknown';

      // If userId filter is provided, skip documents not uploaded by this user
      if (userId && uploadedBy !== userId) {
        continue;
      }

      // Extract filename from blob path (accounts/accountId/category/timestamp-filename.ext)
      const pathParts = blob.name.split('/');
      const filenameWithTimestamp = pathParts[pathParts.length - 1];
      
      // Remove timestamp prefix (format: timestamp-filename.ext)
      const filename = filenameWithTimestamp.includes('-') 
        ? filenameWithTimestamp.substring(filenameWithTimestamp.indexOf('-') + 1)
        : filenameWithTimestamp;
      
      // Extract category from path (3rd segment)
      const categoryFromPath = pathParts.length >= 3 ? pathParts[2] : 'documents';
      
      // Parse metadata from blob properties
      const fileExtension = filename.split('.').pop()?.toLowerCase() || '';
      
      // Determine file type
      let fileType = 'file';
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExtension)) {
        fileType = 'image';
      } else if (fileExtension === 'pdf') {
        fileType = 'pdf';
      } else if (['xls', 'xlsx', 'csv'].includes(fileExtension)) {
        fileType = 'spreadsheet';
      } else if (['doc', 'docx', 'txt'].includes(fileExtension)) {
        fileType = 'document';
      }

      // Format file size
      const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      };

      // Create document object
      const document = {
        id: blob.name, // Use blob name as ID
        name: filename,
        category: blob.metadata?.category || categoryFromPath || 'Uncategorized',
        description: blob.metadata?.description || '',
        fileType,
        fileSize: formatFileSize(blob.properties.contentLength || 0),
        uploadDate: blob.properties.createdOn?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        uploadedBy: uploadedBy,
        status: 'Active', // Can be determined from expiry date if set
        fileUrl: `https://${account}.blob.core.windows.net/${container}/${blob.name}`,
        expiryDate: blob.metadata?.expiryDate || null,
        tags: blob.metadata?.tags ? blob.metadata.tags.split(',') : [],
        isConfidential: blob.metadata?.isConfidential === 'true',
        versionNumber: parseInt(blob.metadata?.versionNumber || '1', 10),
        lastModified: blob.properties.lastModified?.toISOString() || new Date().toISOString(),
      };

      // Determine status based on expiry date
      if (document.expiryDate) {
        const expiryDate = new Date(document.expiryDate);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          document.status = 'Expired';
        } else if (diffDays <= 30) {
          document.status = 'Expiring';
        } else {
          document.status = 'Active';
        }
      }

      documents.push(document);
    }

    console.log(`Found ${documents.length} documents for account ${accountId}`);
    return documents;
  } catch (error: any) {
    console.error('Error listing blobs:', error);
    throw new Error(`Failed to list documents: ${error.message}`);
  }
}

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

export default async function handler(req: AnyRequest, res: AnyResponse): Promise<void> {
  // Add CORS headers
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status?.(200);
    res.end?.();
    return;
  }

  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      res.status?.(405);
      res.json?.({ error: 'Method not allowed' });
      return;
    }

    // Get accountId and optional userId from query string (GET) or body (POST)
    let accountId: string | undefined;
    let userId: string | undefined;

    if (req.method === 'GET' && req.query) {
      accountId = Array.isArray(req.query.accountId) 
        ? req.query.accountId[0] 
        : req.query.accountId as string | undefined;
      userId = Array.isArray(req.query.userId) 
        ? req.query.userId[0] 
        : req.query.userId as string | undefined;
    } else {
      accountId = req.body?.accountId;
      userId = req.body?.userId;
    }

    if (!accountId) {
      res.status?.(400);
      res.json?.({ error: 'accountId is required' });
      return;
    }

    // List documents for the account (optionally filtered by user)
    const documents = await listAccountBlobs(accountId, userId);

    res.status?.(200);
    res.json?.({ 
      documents,
      count: documents.length,
      accountId,
      userId: userId || 'all users'
    });
  } catch (err: any) {
    console.error('api/list-documents error:', err);
    res.status?.(500);
    res.json?.({ error: err?.message || 'Failed to list documents' });
  }
}

