import { BlobSASPermissions, generateBlobSASQueryParameters, SASProtocol, StorageSharedKeyCredential, BlobServiceClient } from '@azure/storage-blob'

export type GetUploadSasOptions = {
  blobName: string
  contentType: string
  expiresInSeconds?: number
  userId?: string
  permissions?: 'upload' | 'download' | 'delete' | 'full'
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export function buildBlobPath(typeDir: string, mediaId: string | undefined | null, filename: string) {
  const safeName = slugify(filename)
  const ts = Date.now()
  const parts = [typeDir, mediaId || 'misc', `${ts}-${safeName}`].filter(Boolean)
  return parts.join('/')
}

// Enhanced function for account-specific blob paths
export function buildAccountBlobPath(accountId: string, category: string, filename: string): string {
  const safeName = slugify(filename)
  const ts = Date.now()
  const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  
  // Structure: accounts/{accountId}/{category}/{date}/{timestamp}-{filename}
  return `accounts/${accountId}/${category}/${date}/${ts}-${safeName}`
}

// Legacy function name for backward compatibility
export const buildUserBlobPath = buildAccountBlobPath;

export async function getUploadSas(opts: GetUploadSasOptions) {
  const account = process.env.AZURE_STORAGE_ACCOUNT || ''
  const container = process.env.AZURE_STORAGE_CONTAINER || 'mediaitems'
  const cdn = process.env.AZURE_CDN_URL || ''
  const key = process.env.AZURE_STORAGE_ACCOUNT_KEY || ''
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING || ''

  if (!account || (!key && !conn)) {
    throw new Error('Missing Azure storage configuration (account/key or connection string).')
  }

  let sharedCredential: StorageSharedKeyCredential
  if (conn) {
    const mAccount = conn.match(/AccountName=([^;]+)/i)
    const mKey = conn.match(/AccountKey=([^;]+)/i)
    if (!mAccount || !mKey) throw new Error('Invalid AZURE_STORAGE_CONNECTION_STRING; missing AccountName/AccountKey')
    sharedCredential = new StorageSharedKeyCredential(mAccount[1], mKey[1])
  } else {
    sharedCredential = new StorageSharedKeyCredential(account, key)
  }

  const now = new Date()
  const start = new Date(now.getTime() - 5 * 60 * 1000)
  const ttl = Math.min(Math.max(opts.expiresInSeconds || 10 * 60, 60), 60 * 60)
  const expiry = new Date(now.getTime() + ttl * 1000)

  // Determine permissions based on the requested operation
  let permissions: BlobSASPermissions
  switch (opts.permissions) {
    case 'upload':
      permissions = BlobSASPermissions.parse('cw') // Create + Write
      break
    case 'download':
      permissions = BlobSASPermissions.parse('r') // Read only
      break
    case 'delete':
      permissions = BlobSASPermissions.parse('d') // Delete only
      break
    case 'full':
      permissions = BlobSASPermissions.parse('racwd') // Read + Add + Create + Write + Delete
      break
    default:
      permissions = BlobSASPermissions.parse('cw') // Default to upload permissions
  }

  const sas = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: opts.blobName,
      permissions,
      startsOn: start,
      expiresOn: expiry,
      protocol: SASProtocol.Https,
      contentType: opts.contentType,
    },
    sharedCredential,
  ).toString()

  const base = `https://${account}.blob.core.windows.net/${container}/${opts.blobName}`
  const putUrl = `${base}?${sas}`
  const publicUrl = cdn ? `${cdn.replace(/\/$/, '')}/${opts.blobName}` : base

  return { 
    putUrl, 
    publicUrl, 
    blobPath: opts.blobName, 
    expiresAt: expiry.toISOString(),
    permissions: opts.permissions || 'upload',
    userId: opts.userId
  }
}

export async function deleteBlob(blobPath: string) {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  const account = process.env.AZURE_STORAGE_ACCOUNT
  const container = process.env.AZURE_STORAGE_CONTAINER || 'mediaitems'
  if (!conn && !account) throw new Error('Azure storage env not configured')
  const client = conn
    ? BlobServiceClient.fromConnectionString(conn)
    : new BlobServiceClient(`https://${account}.blob.core.windows.net`, new StorageSharedKeyCredential(account!, process.env.AZURE_STORAGE_ACCOUNT_KEY!))
  const containerClient = client.getContainerClient(container)
  const blobClient = containerClient.getBlockBlobClient(blobPath)
  await blobClient.deleteIfExists()
  return { ok: true }
}

// Generate download SAS token for user-specific access
export async function getDownloadSas(blobPath: string, userId: string, expiresInSeconds: number = 60 * 60): Promise<string> {
  const account = process.env.AZURE_STORAGE_ACCOUNT || ''
  const container = process.env.AZURE_STORAGE_CONTAINER || 'mediaitems'
  const key = process.env.AZURE_STORAGE_ACCOUNT_KEY || ''
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING || ''

  if (!account || (!key && !conn)) {
    throw new Error('Missing Azure storage configuration')
  }

  // Log download request for audit purposes
  console.log(`Generating download SAS for user ${userId}: ${blobPath}`)

  let sharedCredential: StorageSharedKeyCredential
  if (conn) {
    const mAccount = conn.match(/AccountName=([^;]+)/i)
    const mKey = conn.match(/AccountKey=([^;]+)/i)
    if (!mAccount || !mKey) throw new Error('Invalid connection string')
    sharedCredential = new StorageSharedKeyCredential(mAccount[1], mKey[1])
  } else {
    sharedCredential = new StorageSharedKeyCredential(account, key)
  }

  const now = new Date()
  const start = new Date(now.getTime() - 5 * 60 * 1000)
  const expiry = new Date(now.getTime() + expiresInSeconds * 1000)

  const permissions = BlobSASPermissions.parse('r') // Read only
  const sas = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: blobPath,
      permissions,
      startsOn: start,
      expiresOn: expiry,
      protocol: SASProtocol.Https,
    },
    sharedCredential,
  ).toString()

  return `https://${account}.blob.core.windows.net/${container}/${blobPath}?${sas}`
}

// Validate account access to a specific blob
export function validateAccountBlobAccess(blobPath: string, accountId: string): boolean {
  // Check if the blob path starts with the account's directory
  const accountPath = `accounts/${accountId}/`
  return blobPath.startsWith(accountPath)
}

// Legacy function name for backward compatibility
export const validateUserBlobAccess = validateAccountBlobAccess;
