/**
 * Dataverse Web API Client
 * Handles all interactions with Microsoft Dataverse
 * 
 * Note: Vercel automatically loads environment variables from .env files
 * For local development, make sure your .env file is in the project root
 */

const sanitizeEnv = (v?: string) => (v || '').toString().trim().replace(/^["']|["'];?$/g, '');

// Dataverse base URL (without /api/data/v9.2)
// Default to the known Dataverse instance from kfrealexpressserver
const DATAVERSE_BASE_URL = sanitizeEnv(
  process.env.DATAVERSE_API_URL || 
  process.env.DATAVERSE_BASE_URL || 
  'https://kf-dev-a.crm15.dynamics.com'
);

// Full API URL for requests
const DATAVERSE_API_URL = `${DATAVERSE_BASE_URL}/api/data/v9.2`;

const DATAVERSE_TENANT_ID = sanitizeEnv(process.env.DATAVERSE_TENANT_ID || process.env.tenant_id || '199ebd0d-2986-4f3d-8659-4388c5b2a724');
const DATAVERSE_CLIENT_ID = sanitizeEnv(process.env.DATAVERSE_CLIENT_ID || process.env.client_id);
const DATAVERSE_CLIENT_SECRET = sanitizeEnv(process.env.DATAVERSE_CLIENT_SECRET || process.env.client_secret);

/**
 * Get authentication token for Dataverse
 * This should be replaced with proper OAuth2 flow in production
 */
async function getAuthToken(): Promise<string> {
  // Debug: Log available environment variables (without exposing secrets)
  console.log('🔍 [Dataverse Auth] Checking credentials...');
  console.log('   Tenant ID:', DATAVERSE_TENANT_ID ? '✅ Set' : '❌ Missing');
  console.log('   Client ID:', DATAVERSE_CLIENT_ID ? '✅ Set' : '❌ Missing');
  console.log('   Client Secret:', DATAVERSE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
  console.log('   Base URL:', DATAVERSE_BASE_URL);
  
  // Check if credentials are configured
  if (!DATAVERSE_TENANT_ID || !DATAVERSE_CLIENT_ID || !DATAVERSE_CLIENT_SECRET) {
    const missing: string[] = [];
    if (!DATAVERSE_TENANT_ID) missing.push('DATAVERSE_TENANT_ID or tenant_id');
    if (!DATAVERSE_CLIENT_ID) missing.push('DATAVERSE_CLIENT_ID or client_id');
    if (!DATAVERSE_CLIENT_SECRET) missing.push('DATAVERSE_CLIENT_SECRET or client_secret');
    
    console.error('❌ [Dataverse Auth] Missing required environment variables:', missing.join(', '));
    const availableEnvVars = Object.keys(process.env).filter(k => 
      k.includes('DATAVERSE') || k.includes('tenant') || k.includes('client') || k.includes('scope')
    );
    console.error('   Available env vars:', availableEnvVars.length > 0 ? availableEnvVars.join(', ') : 'None found');
    console.error('   All process.env keys:', Object.keys(process.env).slice(0, 20).join(', '), '...');
    
    throw new Error(`Dataverse credentials not configured. Missing: ${missing.join(', ')}`);
  }

  // In production, use proper OAuth2 client credentials flow
  const tokenEndpoint = `https://login.microsoftonline.com/${DATAVERSE_TENANT_ID}/oauth2/v2.0/token`;
  
  // Scope should be the base URL with .default
  const scope = process.env.scope || `${DATAVERSE_BASE_URL}/.default`;
  
  const requestBody = new URLSearchParams({
    client_id: DATAVERSE_CLIENT_ID,
    client_secret: DATAVERSE_CLIENT_SECRET,
    scope: scope,
    grant_type: process.env.grant_type || 'client_credentials',
  });

  console.log('🔐 [Dataverse Auth] Requesting token...');
  console.log('   Token endpoint:', tokenEndpoint);
  console.log('   Scope:', scope);
  console.log('   Grant type:', process.env.grant_type || 'client_credentials');

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: requestBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorDetails;
    try {
      errorDetails = JSON.parse(errorText);
    } catch {
      errorDetails = errorText;
    }
    console.error('❌ [Dataverse Auth] Token request failed:', {
      status: response.status,
      statusText: response.statusText,
      error: errorDetails,
    });
    throw new Error(`Failed to get Dataverse token: ${response.status} ${response.statusText} - ${JSON.stringify(errorDetails)}`);
  }

  const data = await response.json();
  
  if (!data.access_token) {
    console.error('❌ [Dataverse Auth] No access_token in response:', Object.keys(data));
    throw new Error('No access_token in OAuth response');
  }

  // Decode token to check audience (for debugging)
  try {
    const tokenParts = data.access_token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf-8'));
      console.log('🔍 [Dataverse Auth] Token decoded - Audience (aud):', payload.aud);
      console.log('   App ID (appid):', payload.appid);
      console.log('   Issuer (iss):', payload.iss);
      console.log('   Expected audience:', DATAVERSE_BASE_URL);
    }
  } catch (e) {
    console.warn('⚠️ Could not decode token for debugging:', e);
  }

  console.log('✅ [Dataverse Auth] Token obtained successfully');
  return data.access_token;
}

/**
 * Make a request to Dataverse Web API
 */
async function dataverseRequest(
  method: string,
  endpoint: string,
  body?: any,
  token?: string
): Promise<any> {
  if (!DATAVERSE_BASE_URL) {
    throw new Error('DATAVERSE_BASE_URL not configured. Set DATAVERSE_API_URL or DATAVERSE_BASE_URL environment variable.');
  }

  const authToken = token || await getAuthToken();
  
  if (!authToken) {
    throw new Error('No authentication token available');
  }

  const url = `${DATAVERSE_API_URL}/${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
    'OData-MaxVersion': '4.0',
    'OData-Version': '4.0',
    'Prefer': 'return=representation',
  };
  
  // Log request details (without exposing full token)
  console.log(`📡 [Dataverse Request] ${method} ${endpoint}`);
  console.log('   URL:', url);
  console.log('   Token present:', authToken ? '✅ Yes' : '❌ No');
  console.log('   Token preview:', authToken ? `${authToken.substring(0, 20)}...` : 'None');

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    let errorDetails;
    try {
      errorDetails = JSON.parse(errorText);
    } catch {
      errorDetails = errorText;
    }
    
    console.error(`❌ [Dataverse Request] Error ${response.status}:`, {
      method,
      endpoint,
      url,
      status: response.status,
      statusText: response.statusText,
      error: errorDetails,
      headers: Object.fromEntries(response.headers.entries()),
    });
    
    throw new Error(`Dataverse API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorDetails)}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

/**
 * Get documents from Dataverse
 */
export async function getDataverseDocuments(
  orgId: string,
  filters?: { search?: string; category?: string }
): Promise<any[]> {
  // Note: kf_organisation field doesn't exist, using _kf_account_value or _owningbusinessunit_value
  // For now, filter by account if available, otherwise get all and filter client-side
  let query = `kf_documents?$filter=_kf_account_value eq '${orgId}'`;
  
  // If account filter doesn't work, try business unit or remove filter
  // Fallback: Get all documents and filter by organisation in middleware
  
  if (filters?.category) {
    query += ` and kf_category eq '${filters.category}'`;
  }
  
  if (filters?.search) {
    query += ` and (contains(kf_documentname, '${filters.search}') or contains(kf_description, '${filters.search}'))`;
  }

  // Select actual fields that exist in the table
  query += `&$select=kf_documentid,kf_documentname,kf_category,kf_description,kf_expirydate,kf_tags,kf_fileurl,kf_filetype,kf_filesize,kf_uploaddate,kf_documentstatus,kf_versionnumber,kf_fileversionnumber,kf_isfilecurrentversion,_createdby_value,_kf_account_value,_owningbusinessunit_value,createdon,modifiedon,statecode,statuscode`;

  const response = await dataverseRequest('GET', query);
  return response.value || [];
}

/**
 * Get a single document by ID
 */
export async function getDataverseDocument(documentId: string): Promise<any> {
  const query = `kf_documents(${documentId})?$select=kf_documentid,kf_documentname,kf_category,kf_description,kf_expirydate,kf_tags,kf_fileurl,kf_filetype,kf_filesize,kf_uploaddate,kf_documentstatus,kf_versionnumber,kf_fileversionnumber,kf_isfilecurrentversion,_createdby_value,_kf_account_value,_owningbusinessunit_value,createdon,modifiedon,statecode,statuscode`;
  
  return await dataverseRequest('GET', query);
}

/**
 * Get document versions
 */
export async function getDataverseDocumentVersions(documentId: string): Promise<any[]> {
  const query = `kf_documentversions?$filter=kf_document eq '${documentId}'&$select=kf_documentversionid,kf_document,kf_versionnumber,kf_blobpath,kf_filename,kf_fileextension,kf_filesize,kf_uploadedby,kf_uploadedon&$orderby=kf_versionnumber desc`;
  
  const response = await dataverseRequest('GET', query);
  return response.value || [];
}

/**
 * Create a document in Dataverse
 */
export async function createDataverseDocument(document: any, token?: string): Promise<any> {
  return await dataverseRequest('POST', 'kf_documents', document, token);
}

/**
 * Create a document version in Dataverse
 */
export async function createDataverseDocumentVersion(version: any, token?: string): Promise<any> {
  return await dataverseRequest('POST', 'kf_documentversions', version, token);
}

/**
 * Update a document in Dataverse
 */
export async function updateDataverseDocument(
  documentId: string,
  updates: any,
  token?: string
): Promise<any> {
  return await dataverseRequest('PATCH', `kf_documents(${documentId})`, updates, token);
}

/**
 * Delete a document from Dataverse
 */
export async function deleteDataverseDocument(documentId: string, token?: string): Promise<void> {
  await dataverseRequest('DELETE', `kf_documents(${documentId})`, undefined, token);
}

/**
 * Get max version number for a document
 */
export async function getMaxVersionNumber(documentId: string): Promise<number> {
  const versions = await getDataverseDocumentVersions(documentId);
  if (versions.length === 0) {
    return 0;
  }
  return Math.max(...versions.map((v: any) => v.kf_versionnumber || 0));
}

