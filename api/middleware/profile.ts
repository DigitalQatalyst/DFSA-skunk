/**
 * Profile Module Middleware
 * Service layer for profile domain operations
 * Uses Supabase as primary database (not Dataverse)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { extractOrgIdFromToken, hasWritePermission, extractUserRoleFromToken } from './business-logic.js';

type AnyRequest = {
  method?: string;
  query?: Record<string, string | string[]>;
  body?: any;
  headers: Record<string, string | undefined>;
  [key: string]: any;
};

/**
 * Get Supabase client for profile operations
 * Uses service role key for admin operations
 */
export function getSupabaseClient(): SupabaseClient {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    throw new Error('Supabase configuration missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, serviceKey);
}

/**
 * Extract authorization token from request
 */
export function getAuthToken(req: AnyRequest): string | null {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;
  
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

/**
 * Get organisation ID from request token
 */
export async function getOrgIdFromRequest(req: AnyRequest): Promise<string | null> {
  const token = getAuthToken(req);
  if (!token) {
    console.log('⚠️ [profile] No auth token found in request');
    return null;
  }

  const userInfo = extractUserInfoFromToken(token);
  
  // Add timeout wrapper to prevent hanging
  try {
    const timeoutPromise = new Promise<string | null>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 5000);
    });
    
    const orgIdPromise = extractOrgIdFromToken(
      token,
      userInfo.azureId,
      userInfo.email
    );
    
    return await Promise.race([orgIdPromise, timeoutPromise]);
  } catch (error: any) {
    if (error.message === 'Timeout') {
      console.warn('⏱️ [profile] Org ID extraction timed out after 5 seconds');
    } else {
      console.warn('⚠️ [profile] Error extracting org ID:', error.message);
    }
    return null;
  }
}

/**
 * Extract user info from JWT token
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
    
    // Clean up any control characters
    const cleaned = decoded.replace(/[\x00-\x1F\x7F]/g, '');
    
    const claims = JSON.parse(cleaned);
    return {
      azureId: claims.oid || claims.sub || claims.localAccountId,
      email: claims.email || claims.preferred_username || claims.upn,
    };
  } catch (error) {
    console.error('Error extracting user info from token:', error);
    return {};
  }
}

/**
 * Check if user has write permissions for profile
 * Admin, Contributor, and Creator can write, Viewer is read-only
 */
export function checkProfileWritePermission(req: AnyRequest): boolean {
  const token = getAuthToken(req);
  if (!token) return false;

  const userRole = extractUserRoleFromToken(token);
  // Admin, Contributor, and Creator can write, Viewer cannot
  const writeRoles = ['admin', 'contributor', 'creator'];
  if (userRole && writeRoles.includes(userRole.toLowerCase())) {
    return true;
  }
  // Fallback to hasWritePermission for other roles
  return hasWritePermission(userRole);
}

/**
 * Validate profile data based on schema
 * Enhanced with schema-specific validation rules
 */
export function validateProfileData(data: any, schema: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Basic validation
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data format');
    return { valid: false, errors };
  }

  if (!schema || !schema.groups) {
    return { valid: true, errors: [] }; // No schema = no validation
  }

  // Schema-based validation
  for (const group of schema.groups) {
    if (!group.fields) continue;

    for (const field of group.fields) {
      const fieldValue = data[field.fieldName];
      const isMandatory = field.mandatory === true || 
                         (Array.isArray(field.mandatory) && field.mandatory.length > 0);

      // Check mandatory fields
      if (isMandatory) {
        if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
          errors.push(`${field.label || field.fieldName} is required`);
          continue;
        }

        // Check arrays (for multiselect, tables, etc.)
        if (Array.isArray(fieldValue) && fieldValue.length === 0) {
          errors.push(`${field.label || field.fieldName} is required`);
          continue;
        }
      }

      // Skip validation if field is empty and not mandatory
      if (!fieldValue || fieldValue === '') continue;

      // Field type specific validation
      if (field.fieldType === 'Text' && field.validation?.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
          errors.push(`${field.label || field.fieldName} must be a valid email address`);
        }
      }

      if (field.fieldType === 'Date Only' || field.fieldType === 'Date') {
        const date = new Date(fieldValue);
        if (isNaN(date.getTime())) {
          errors.push(`${field.label || field.fieldName} must be a valid date`);
        }
      }

      if (field.fieldType === 'select' && field.options) {
        const validValues = field.options.map(opt => opt.value);
        if (!validValues.includes(fieldValue)) {
          errors.push(`${field.label || field.fieldName} must be one of the allowed values`);
        }
      }

      // Address field validation (if it's an Address type)
      if (field.fieldType === 'Address' && field.addressFields) {
        const addressData = typeof fieldValue === 'string' 
          ? JSON.parse(fieldValue) 
          : fieldValue;
        
        for (const [key, addrField] of Object.entries(field.addressFields)) {
          const addrFieldConfig = addrField as any;
          if (addrFieldConfig.mandatory) {
            const addrValue = addressData?.[addrFieldConfig.fieldName] || 
                            addressData?.[key];
            if (!addrValue || addrValue === '') {
              errors.push(`${addrFieldConfig.label || key} is required`);
            }
          }
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Calculate completion percentage for a domain
 * Returns completion based on mandatory fields
 */
export function calculateDomainCompletion(data: any, schema: any): number {
  if (!schema || !schema.groups) return 0;

  let totalMandatory = 0;
  let completedMandatory = 0;

  // Iterate through groups and fields
  for (const group of schema.groups) {
    if (!group.fields) continue;

    for (const field of group.fields) {
      // Check if field is mandatory
      const isMandatory = field.mandatory === true || 
                         (Array.isArray(field.mandatory) && field.mandatory.length > 0);

      if (isMandatory) {
        totalMandatory++;
        const fieldValue = data?.[field.fieldName];
        
        // Check if field has a value
        if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
          if (Array.isArray(fieldValue)) {
            if (fieldValue.length > 0) completedMandatory++;
          } else {
            completedMandatory++;
          }
        }
      }
    }
  }

  if (totalMandatory === 0) return 100; // No mandatory fields = 100% complete
  return Math.round((completedMandatory / totalMandatory) * 100);
}

/**
 * Get profile domain table name
 */
export function getProfileDomainTableName(domainKey: string): string {
  // Convert domain key to table name format
  // e.g., "profile_summary" -> "profiledomain_profilesummary"
  // e.g., "vision_strategy" -> "profiledomain_visionstrategy"
  const parts = domainKey.split('_');
  const camelCase = parts
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
  
  // Convert to lowercase with first letter lowercase
  const tableSuffix = camelCase.charAt(0).toLowerCase() + camelCase.slice(1);
  
  return `profiledomain_${tableSuffix}`;
}

