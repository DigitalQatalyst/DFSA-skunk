/**
 * Business Logic for Document Wallet
 * Implements status calculation, version numbering, etc.
 */

/**
 * Calculate document status based on expiry date
 * @param expiryDate - Expiry date string (ISO format) or null
 * @returns Status: 'Active' | 'Pending Renewal' | 'Expired'
 */
export function calculateDocumentStatus(expiryDate: string | null | undefined): string {
  if (!expiryDate) {
    return 'Active';
  }

  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Expired';
  } else if (diffDays <= 30) {
    return 'Pending Renewal';
  } else {
    return 'Active';
  }
}

/**
 * Calculate next version number
 * @param existingVersions - Array of existing version numbers
 * @returns Next version number
 */
export function calculateNextVersionNumber(existingVersions: number[]): number {
  if (existingVersions.length === 0) {
    return 1;
  }
  return Math.max(...existingVersions) + 1;
}

/**
 * Extract organisation ID from JWT token
 * Falls back to fetching from user profile API if not in token
 */
export async function extractOrgIdFromToken(token: string, azureId?: string, email?: string): Promise<string | null> {
  try {
    // Decode JWT (without verification for now - should verify in production)
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      console.warn('Token does not have expected JWT structure');
      // Fall through to API fetch
    } else {
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
      
      try {
        const claims = JSON.parse(cleaned);
        
        // Try to extract from token claims first
        const orgId = claims.orgId || claims.organisation || claims.organization || claims.accountId || null;
        
        if (orgId) {
          return orgId;
        }
      } catch (parseError) {
        console.warn('Could not parse token claims, falling back to API:', parseError);
        // Fall through to API fetch
      }
    }

    // Fallback: Fetch from user profile API if Azure ID is available
    if (azureId) {
      try {
        const API_BASE_URL = process.env.API_BASE_URL || 'https://kfrealexpressserver.vercel.app/api/v1';
        const response = await fetch(`${API_BASE_URL}/auth/organization-info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            azureid: azureId,
            useremail: email || ''
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const accountId = data?.organization?.accountId || data?.profile?.accountId || data?.accountId;
          if (accountId) {
            console.log('✅ Extracted account ID from API:', accountId);
            return accountId;
          }
        }
      } catch (apiError) {
        console.warn('Could not fetch account ID from API:', apiError);
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting org ID from token:', error);
    return null;
  }
}

/**
 * Check if user has write permissions
 * This is a placeholder - implement RBAC based on your requirements
 * 
 * Note: For now, we allow writes if role is found OR if role extraction fails
 * (to avoid blocking legitimate users). Adjust based on your security requirements.
 */
export function hasWritePermission(userRole: string | undefined | null): boolean {
  // If role extraction failed (null), allow by default for now
  // TODO: Implement proper RBAC based on your security requirements
  if (userRole === null || userRole === undefined) {
    console.warn('⚠️ Role extraction failed or no role found - allowing write (consider implementing proper RBAC)');
    return true; // Allow by default - adjust based on your security requirements
  }
  
  // Adjust based on your RBAC requirements
  const writeRoles = ['admin', 'manager', 'document-manager', 'user', 'member'];
  return writeRoles.includes(userRole.toLowerCase());
}

/**
 * Extract user role from JWT token
 */
export function extractUserRoleFromToken(token: string): string | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      console.warn('Token does not have expected JWT structure');
      return null;
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
    return claims.role || claims.userRole || claims.roles?.[0] || null;
  } catch (error) {
    console.error('Error extracting role from token:', error);
    // Return null instead of throwing - allows fallback behavior
    return null;
  }
}

