/**
 * Azure Blob Storage Client Wrapper
 * Handles blob operations with proper path structure
 */

import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from '@azure/storage-blob';

const sanitizeEnv = (v?: string) => (v || '').toString().trim().replace(/^["']|["'];?$/g, '');

const STORAGE_ACCOUNT_NAME = sanitizeEnv(process.env.STORAGE_ACCOUNT_NAME || process.env.AZURE_STORAGE_ACCOUNT);
const CONTAINER_NAME = sanitizeEnv(process.env.CONTAINER_NAME || process.env.VITE_CONTAINER_NAME) || 'kf-firm-wallet-container';
const STORAGE_ACCOUNT_KEY = sanitizeEnv(process.env.AZURE_STORAGE_ACCOUNT_KEY);

/**
 * Get blob service client
 */
function getBlobServiceClient(): BlobServiceClient {
  if (!STORAGE_ACCOUNT_NAME || !STORAGE_ACCOUNT_KEY) {
    throw new Error('Azure Storage credentials not configured');
  }

  const credential = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY);
  return new BlobServiceClient(
    `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    credential
  );
}

/**
 * Generate blob path according to specification
 * Format: org/{orgId}/documents/{documentId}/v{n}/{filename}
 */
export function generateBlobPath(
  orgId: string,
  documentId: string,
  versionNumber: number,
  filename: string
): string {
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `org/${orgId}/documents/${documentId}/v${versionNumber}/${sanitizedFilename}`;
}

/**
 * Upload file to blob storage
 */
export async function uploadBlob(
  buffer: Buffer,
  blobPath: string,
  contentType?: string,
  metadata?: Record<string, string>
): Promise<string> {
  const blobServiceClient = getBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  // Ensure container exists
  await containerClient.createIfNotExists();

  const blockBlobClient = containerClient.getBlockBlobClient(blobPath);
  
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: contentType || 'application/octet-stream' },
    metadata: metadata || {},
  });

  return blockBlobClient.url;
}

/**
 * Generate SAS URL for blob download
 * @param blobPath - The blob path
 * @param isConfidential - Whether the document is confidential (shorter TTL)
 * @returns SAS URL with appropriate expiry
 */
export async function generateBlobSasUrl(
  blobPath: string,
  isConfidential: boolean = false
): Promise<string> {
  const blobServiceClient = getBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

  // Confidential documents get shorter TTL (15 minutes)
  // Non-confidential get longer TTL (1 hour)
  const expiresInSeconds = isConfidential ? 15 * 60 : 60 * 60;

  const now = new Date();
  const expiresOn = new Date(now.getTime() + expiresInSeconds * 1000);
  const startsOn = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago

  const sasQueryParams = generateBlobSASQueryParameters(
    {
      containerName: CONTAINER_NAME,
      blobName: blobPath,
      permissions: BlobSASPermissions.parse('r'), // Read only
      startsOn,
      expiresOn,
      protocol: SASProtocol.Https,
    },
    new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME!, STORAGE_ACCOUNT_KEY!)
  );

  return `${blockBlobClient.url}?${sasQueryParams.toString()}`;
}

/**
 * Delete blob from storage
 */
export async function deleteBlob(blobPath: string): Promise<void> {
  const blobServiceClient = getBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blockBlobClient = containerClient.getBlockBlobClient(blobPath);
  
  await blockBlobClient.delete();
}

