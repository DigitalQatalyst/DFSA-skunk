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

      // Upsert (insert or update) the profile domain
      const { data, error } = await supabase
        .from(tableName)
        .upsert(
          {
            organisation_id: orgId,
            ...updatePayload,
          },
          {
            onConflict: 'organisation_id',
          }
        )
        .select()
        .single();

      if (error) {
        console.error('Error updating profile domain:', error);
        if (res.status) res.status(500);
        if (res.json) res.json({ error: 'Failed to update profile data' });
        return;
      }

      // Calculate updated completion
      const completion = calculateDomainCompletion(data, schema);

      if (res.status) res.status(200);
      if (res.json) {
        res.json({
          data,
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
