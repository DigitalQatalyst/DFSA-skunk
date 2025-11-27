// api/download.ts
/**
 * Vercel serverless function to generate download SAS tokens
 */

import { 
  BlobSASPermissions, 
  generateBlobSASQueryParameters, 
  SASProtocol, 
  StorageSharedKeyCredential 
} from '@azure/storage-blob';

export const config = {
  api: {
    bodyParser: true,
  },
};

// Sanitize environment variables - remove quotes and semicolons
const sanitizeEnv = (v?: string) => (v || '').toString().trim().replace(/^["']|["'];?$/g, '');

/**
 * Generate download SAS token for a blob
 * Supports two modes:
 * 1. Use pre-generated SAS_TOKEN from env (simpler, recommended)
 * 2. Generate new SAS token using account key/connection string
 */
async function generateDownloadSasToken(
  blobPath: string, 
  userId: string, 
  expiresInSeconds: number = 60 * 60
): Promise<string> {
  // Support multiple env variable names for flexibility and sanitize values
  const account = sanitizeEnv(process.env.STORAGE_ACCOUNT_NAME || process.env.AZURE_STORAGE_ACCOUNT);
  const container = sanitizeEnv(process.env.CONTAINER_NAME || process.env.AZURE_STORAGE_CONTAINER) || 'mediaitems';
  const sasToken = sanitizeEnv(process.env.SAS_TOKEN || process.env.VITE_SAS_TOKEN);
  const key = sanitizeEnv(process.env.AZURE_STORAGE_ACCOUNT_KEY);
  const conn = sanitizeEnv(process.env.CONNECTION_STRING || process.env.AZURE_STORAGE_CONNECTION_STRING);
  
  // Decode the blob path if it's URL encoded
  const decodedBlobPath = decodeURIComponent(blobPath);

  if (!account) {
    throw new Error('Missing STORAGE_ACCOUNT_NAME in environment variables');
  }

  // Log download request for audit purposes
  console.log(`Generating download URL for user ${userId}: ${decodedBlobPath}`);

  // MODE 1: Use pre-generated SAS token (simpler and recommended)
  if (sasToken) {
    console.log('Using pre-generated SAS token from environment');
    // Remove leading '?' if present
    const cleanToken = sasToken.startsWith('?') ? sasToken.substring(1) : sasToken;
    
    // Note: Cannot add Content-Disposition to pre-generated SAS token as it invalidates the signature
    // The download behavior will be handled by the frontend (using anchor element with download attribute)
    return `https://${account}.blob.core.windows.net/${container}/${decodedBlobPath}?${cleanToken}`;
  }

  // MODE 2: Generate new SAS token using account credentials
  console.log('Generating new SAS token using account credentials');
  
  if (!key && !conn) {
    throw new Error('Missing Azure storage credentials. Provide either SAS_TOKEN or (AZURE_STORAGE_ACCOUNT_KEY / CONNECTION_STRING)');
  }

  let sharedCredential: StorageSharedKeyCredential;
  if (conn) {
    const mAccount = conn.match(/AccountName=([^;]+)/i);
    const mKey = conn.match(/AccountKey=([^;]+)/i);
    if (!mAccount || !mKey) throw new Error('Invalid connection string');
    sharedCredential = new StorageSharedKeyCredential(mAccount[1], mKey[1]);
  } else {
    sharedCredential = new StorageSharedKeyCredential(account, key);
  }

  const now = new Date();
  const start = new Date(now.getTime() - 5 * 60 * 1000);
  const expiry = new Date(now.getTime() + expiresInSeconds * 1000);

  // Extract filename from blob path for download
  const filename = decodedBlobPath.split('/').pop() || 'download';
  const contentDisposition = `attachment; filename="${filename}"`;

  const permissions = BlobSASPermissions.parse('r'); // Read only
  const sas = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: decodedBlobPath,
      permissions,
      startsOn: start,
      expiresOn: expiry,
      protocol: SASProtocol.Https,
      contentDisposition, // Force download with original filename
    },
    sharedCredential,
  ).toString();

  return `https://${account}.blob.core.windows.net/${container}/${decodedBlobPath}?${sas}`;
}

type AnyRequest = {
  method?: string;
  body?: any;
  query?: Record<string, string | string[]>;
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
  res.setHeader?.('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status?.(200);
    res.end?.();
    return;
  }

  try {
    if (req.method !== 'POST' && req.method !== 'GET') {
      res.status?.(405);
      res.json?.({ error: 'Method not allowed' });
      return;
    }

    // Get parameters from query string (GET) or body (POST)
    let blobName: string | undefined;
    let userId: string | undefined;
    let expiresInSeconds: number = 60 * 60; // Default 1 hour

    if (req.method === 'GET' && req.query) {
      blobName = Array.isArray(req.query.blobName) 
        ? req.query.blobName[0] 
        : req.query.blobName as string | undefined;
      userId = Array.isArray(req.query.userId) 
        ? req.query.userId[0] 
        : req.query.userId as string | undefined;
      const expires = Array.isArray(req.query.expiresInSeconds) 
        ? req.query.expiresInSeconds[0] 
        : req.query.expiresInSeconds;
      if (expires) expiresInSeconds = parseInt(expires as string, 10);
    } else {
      blobName = req.body?.blobName;
      userId = req.body?.userId;
      expiresInSeconds = req.body?.expiresInSeconds || expiresInSeconds;
    }

    if (!blobName) {
      res.status?.(400);
      res.json?.({ error: 'blobName is required' });
      return;
    }

    if (!userId) {
      res.status?.(400);
      res.json?.({ error: 'userId is required' });
      return;
    }

    // Generate the download SAS URL
    const downloadUrl = await generateDownloadSasToken(blobName, userId, expiresInSeconds);

    res.status?.(200);
    res.json?.({ 
      downloadUrl,
      expiresInSeconds,
      blobName 
    });
  } catch (err: any) {
    console.error('api/download error:', err);
    res.status?.(500);
    res.json?.({ error: err?.message || 'Failed to generate download URL' });
  }
}

