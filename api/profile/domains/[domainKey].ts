/**
 * Profile Domain API Route
 * Handles GET and PUT operations for profile domains
 * 
 * GET /api/profile/domains/:domainKey - Get domain schema and data
 * PUT /api/profile/domains/:domainKey - Update domain data
 */

import {
  getSupabaseClient,
  getOrgIdFromRequest,
  checkProfileWritePermission,
  validateProfileData,
  calculateDomainCompletion,
  getProfileDomainTableName,
} from '../../middleware/profile.js';
import { getDomainSchema } from '../../middleware/profile-schema.js';

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

// Vercel serverless function handler
export default async function handler(
  req: AnyRequest,
  res: AnyResponse
): Promise<void> {
  console.log('📥 [api/profile/domains] Request received:', {
    method: req.method,
    domainKey: req.query?.domainKey,
  });

  try {
    // CORS headers
    if (res.setHeader) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    // Handle OPTIONS (CORS preflight) - return immediately, no auth needed
    if (req.method === 'OPTIONS') {
      console.log('✅ [api/profile/domains] Handling OPTIONS request');
      if (res.status) res.status(200);
      if (res.end) res.end();
      return;
    }

    const { domainKey } = req.query;

    if (!domainKey || typeof domainKey !== 'string') {
      console.log('❌ [api/profile/domains] Missing domain key');
      if (res.status) res.status(400);
      if (res.json) res.json({ error: 'Domain key is required' });
      return;
    }

    console.log(`📋 [api/profile/domains] Processing domain: ${domainKey}`);

    // IMPORTANT: Products domain is served by the Express API using normalized matrix tables.
    // This serverless route historically upserted *_matrix keys as columns on profiledomain_products,
    // which conflicts with the unified-matrix schema (and can cause PGRST204 errors / data drift).
    if (domainKey === 'products') {
      const expressBase = process.env.EXPRESS_API_BASE_URL;
      if (!expressBase) {
        if (res.status) res.status(404);
        if (res.json) {
          res.json({
            error: 'Products is disabled on the serverless profile handler',
            message:
              'Products must be served by the Express API. Configure VITE_API_BASE_URL in the frontend (and optionally set EXPRESS_API_BASE_URL for serverless proxying).',
          });
        }
        return;
      }

      // Optional safe proxy: only enabled if EXPRESS_API_BASE_URL is configured.
      const normalizedBase =
        expressBase.endsWith('/api/v1')
          ? expressBase
          : expressBase.endsWith('/api')
            ? `${expressBase}/v1`
            : `${expressBase}/api/v1`;

      const url = `${normalizedBase}/profile/domains/products`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const auth = req.headers?.authorization;
      if (auth) headers.Authorization = auth;

      const upstream = await fetch(url, {
        method: req.method,
        headers,
        body: req.method === 'GET' ? undefined : JSON.stringify(req.body || {}),
      });

      const text = await upstream.text();
      if (res.status) res.status(upstream.status);
      try {
        if (res.json) res.json(JSON.parse(text));
      } catch {
        if (res.end) res.end(text);
      }
      return;
    }

    // Get organisation ID from token
    console.log('🔐 [api/profile/domains] Extracting org ID from token...');
    const orgId = await getOrgIdFromRequest(req);
    if (!orgId) {
      console.log('❌ [api/profile/domains] No org ID found - unauthorized');
      if (res.status) res.status(401);
      if (res.json) res.json({ error: 'Unauthorized: Invalid or missing token' });
      return;
    }
    console.log(`✅ [api/profile/domains] Org ID extracted: ${orgId}`);

    // Get domain schema
    console.log(`📋 [api/profile/domains] Getting schema for domain: ${domainKey}`);
    let schema;
    try {
      schema = getDomainSchema(domainKey);
    } catch (schemaError: any) {
      console.error('❌ [api/profile/domains] Error loading schema:', schemaError);
      if (res.status) res.status(500);
      if (res.json) {
        res.json({ 
          error: 'Failed to load domain schema',
          details: schemaError?.message || 'Unknown error'
        });
      }
      return;
    }

    if (!schema) {
      console.log(`❌ [api/profile/domains] Schema not found for domain: ${domainKey}`);
      if (res.status) res.status(404);
      if (res.json) res.json({ error: `Domain '${domainKey}' not found` });
      return;
    }
    console.log(`✅ [api/profile/domains] Schema loaded: ${schema.groups?.length || 0} groups`);

    const supabase = getSupabaseClient();
    const tableName = getProfileDomainTableName(domainKey);

    if (req.method === 'GET') {
      // GET: Return schema + data
      console.log(`🔍 [api/profile/domains] Querying table: ${tableName} for org: ${orgId}`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('organisation_id', orgId)
        .maybeSingle();

      if (error) {
        // PGRST116 is "not found" which is OK for new profiles
        if (error.code === 'PGRST116' || error.code === '42P01') {
          // Table doesn't exist or no data found - return empty data with schema
          console.log('ℹ️ [api/profile/domains] No data found (new profile)');
          const completion = calculateDomainCompletion({}, schema);
          
          if (res.status) res.status(200);
          if (res.json) {
            res.json({
              schema,
              data: {},
              completion,
            });
          }
          return;
        }
        
        // Other errors
        console.error('❌ [api/profile/domains] Error fetching profile domain:', error);
        if (res.status) res.status(500);
        if (res.json) {
          res.json({ 
            error: 'Failed to fetch profile data',
            details: error.message 
          });
        }
        return;
      }

      // Calculate completion (data might be null for new profiles)
      const profileData = data || {};
      const completion = calculateDomainCompletion(profileData, schema);

      console.log(`✅ [api/profile/domains] Returning schema + data (completion: ${completion}%)`);

      if (res.status) res.status(200);
      if (res.json) {
        res.json({
          schema,
          data: profileData,
          completion,
        });
      }
      return;
    }

    if (req.method === 'PUT') {
      // PUT: Update domain data
      
      // Check write permissions
      if (!checkProfileWritePermission(req)) {
        if (res.status) res.status(403);
        if (res.json) {
          res.json({ 
            error: 'Forbidden: You do not have permission to update this profile' 
          });
        }
        return;
      }

      // Validate request body
      const updateData = req.body;
      if (!updateData || typeof updateData !== 'object') {
        if (res.status) res.status(400);
        if (res.json) res.json({ error: 'Invalid request body' });
        return;
      }

      // Validate data against schema
      const validation = validateProfileData(updateData, schema);
      if (!validation.valid) {
        if (res.status) res.status(400);
        if (res.json) {
          res.json({ 
            error: 'Validation failed', 
            details: validation.errors 
          });
        }
        return;
      }

      // Prepare data for update (exclude organisation_id from update)
      const { organisation_id, ...dataToUpdate } = updateData;
      const updatePayload = {
        ...dataToUpdate,
        updated_at: new Date().toISOString(),
      };

      // Debug: Log matrix fields being saved
      const matrixFields = Object.keys(updatePayload).filter(k => k.includes('_matrix'));
      if (matrixFields.length > 0) {
        console.log(`💾 [api/profile/domains] Saving matrix fields:`, matrixFields);
        matrixFields.forEach(fieldName => {
          const value = updatePayload[fieldName];
          console.log(`  ${fieldName}:`, {
            type: typeof value,
            isObject: typeof value === 'object' && !Array.isArray(value),
            keys: typeof value === 'object' && !Array.isArray(value) ? Object.keys(value) : null,
            sampleRow: typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0 ? {
              rowKey: Object.keys(value)[0],
              rowData: value[Object.keys(value)[0]],
            } : null,
          });
        });
      }

      // Upsert (insert or update) the profile domain
      // First, do the upsert
      const { error: upsertError } = await supabase
        .from(tableName)
        .upsert(
          {
            organisation_id: orgId,
            ...updatePayload,
          },
          {
            onConflict: 'organisation_id',
          }
        );

      if (upsertError) {
        console.error('❌ [api/profile/domains] Error upserting profile domain:', upsertError);
        if (res.status) res.status(500);
        if (res.json) res.json({ error: 'Failed to update profile data', details: upsertError.message });
        return;
      }

      console.log('✅ [api/profile/domains] Upsert successful, fetching updated data...');

      // Then, fetch the updated data to ensure we get all columns including matrix fields
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('organisation_id', orgId)
        .single();

      if (error) {
        console.error('❌ [api/profile/domains] Error fetching updated profile domain:', error);
        if (res.status) res.status(500);
        if (res.json) res.json({ error: 'Failed to fetch updated profile data', details: error.message });
        return;
      }

      console.log('✅ [api/profile/domains] Fetched updated data with', Object.keys(data || {}).length, 'fields');

      // Calculate updated completion
      const completion = calculateDomainCompletion(data, schema);

      // Debug: Log ALL returned data keys first
      console.log(`🔍 [api/profile/domains] All keys in returned data:`, Object.keys(data || {}));
      
      // Debug: Log returned data
      const returnedMatrixFields = Object.keys(data || {}).filter(k => k.includes('_matrix'));
      console.log(`🔍 [api/profile/domains] Matrix fields found in response:`, returnedMatrixFields);
      
      if (returnedMatrixFields.length > 0) {
        console.log(`✅ [api/profile/domains] Returning matrix fields:`, returnedMatrixFields);
        returnedMatrixFields.forEach(fieldName => {
          const value = data[fieldName];
          console.log(`  ${fieldName}:`, {
            type: typeof value,
            isObject: typeof value === 'object' && !Array.isArray(value),
            isString: typeof value === 'string',
            keys: typeof value === 'object' && !Array.isArray(value) ? Object.keys(value) : null,
            sampleRow: typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0 ? {
              rowKey: Object.keys(value)[0],
              rowData: value[Object.keys(value)[0]],
            } : null,
            rawValue: typeof value === 'string' ? value.substring(0, 100) : null, // First 100 chars if string
          });
        });
      } else {
        console.warn(`⚠️ [api/profile/domains] No matrix fields found in response! Expected fields:`, [
          'banking_investment_activities_matrix',
          'insurance_general_activities_matrix',
          'insurance_life_activities_matrix',
          'money_services_activities_matrix',
        ]);
        // Check if they exist with different casing or format
        const allKeys = Object.keys(data || {});
        const possibleMatrixKeys = allKeys.filter(k => 
          k.toLowerCase().includes('matrix') || 
          k.toLowerCase().includes('insurance_life') ||
          k.toLowerCase().includes('banking_investment')
        );
        if (possibleMatrixKeys.length > 0) {
          console.log(`🔍 [api/profile/domains] Found possible matrix-related keys:`, possibleMatrixKeys);
        }
      }

      // Filter out Supabase metadata fields before returning
      const { organisation_id: _, created_at: __, updated_at: ___, ...cleanData } = data || {};
      
      // Debug: Log what we're about to return
      console.log(`📤 [api/profile/domains] Preparing response with ${Object.keys(cleanData).length} fields`);
      const responseMatrixFields = Object.keys(cleanData).filter(k => k.includes('_matrix'));
      console.log(`📤 [api/profile/domains] Matrix fields in response:`, responseMatrixFields);
      if (responseMatrixFields.length > 0) {
        responseMatrixFields.forEach(fieldName => {
          const value = cleanData[fieldName];
          console.log(`📤 [api/profile/domains] Response ${fieldName}:`, {
            type: typeof value,
            isObject: typeof value === 'object' && !Array.isArray(value),
            isString: typeof value === 'string',
            hasKeys: typeof value === 'object' && !Array.isArray(value) ? Object.keys(value).length : 0,
          });
        });
      }

      if (res.status) res.status(200);
      if (res.json) {
        res.json({
          data: cleanData,
          completion,
          message: 'Profile updated successfully',
        });
      }
      return;
    }

    // Method not allowed
    if (res.status) res.status(405);
    if (res.json) res.json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Profile domain API error:', error);
    if (res.status) res.status(500);
    if (res.json) {
      res.json({ 
        error: 'Internal server error',
        message: error?.message || 'Unknown error'
      });
    }
  }
}
