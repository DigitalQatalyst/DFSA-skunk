/**
 * RBAC (Role-Based Access Control) Configuration
 * 
 * Defines which roles can access which forms and what permissions they have.
 */

export type UserRole = 'admin' | 'financial-officer' | 'business-advisor' | 'user' | 'viewer';

export interface FormPermission {
  canView: boolean;
  canSubmit: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

/**
 * Role-based form access configuration
 * Maps form IDs to roles that can access them
 */
export const FORM_ROLE_ACCESS: Record<string, UserRole[]> = {
  // Financial Forms - accessible to financial officers and admins
  'request-for-funding': ['admin', 'financial-officer', 'user'],
  'disburse-approved-loan': ['admin', 'financial-officer'],
  'cancel-loan': ['admin', 'financial-officer', 'user'],
  'request-to-amend-existing-loan-details': ['admin', 'financial-officer'],
  'reallocation-of-loan-disbursement': ['admin', 'financial-officer'],
  
  // Business Forms - accessible to business advisors and admins
  'book-consultation-for-entrepreneurship': ['admin', 'business-advisor', 'user'],
  'training-in-entrepreneurship': ['admin', 'business-advisor', 'user'],
  'collateral-user-guide': ['admin', 'business-advisor', 'user'],
  'issue-support-letter': ['admin', 'business-advisor', 'user'],
  'facilitate-communication': ['admin', 'business-advisor', 'user'],
  'request-for-membership': ['admin', 'business-advisor', 'user'],
  
  // Assessment Forms - accessible to all authenticated users
  'needs-assessment': ['admin', 'financial-officer', 'business-advisor', 'user'],
  
  // Support Forms - accessible to all
  'contact-support': ['admin', 'financial-officer', 'business-advisor', 'user'],
};

/**
 * Get allowed roles for a specific form
 */
export function getAllowedRoles(formId: string): UserRole[] {
  return FORM_ROLE_ACCESS[formId] || ['admin']; // Default to admin-only if not specified
}

/**
 * Check if a role has access to a form
 * 
 * NOTE: If userRole is null/undefined (roles not configured), this returns true
 * to allow access. This is a graceful fallback until roles are properly integrated.
 * Set ENABLE_STRICT_RBAC=true to enforce strict role checking.
 */
const ENABLE_STRICT_RBAC = (import.meta as any).env?.VITE_ENABLE_STRICT_RBAC === 'true';

export function hasFormAccess(formId: string, userRole: UserRole | null | undefined): boolean {
  // If strict RBAC is disabled and no role is found, allow access (graceful degradation)
  if (!ENABLE_STRICT_RBAC && !userRole) {
    console.warn(`RBAC: No role found for user, allowing access to ${formId} (strict RBAC disabled)`);
    return true;
  }
  
  // If strict RBAC is enabled but no role, deny access
  if (ENABLE_STRICT_RBAC && !userRole) {
    console.warn(`RBAC: No role found for user, denying access to ${formId} (strict RBAC enabled)`);
    return false;
  }
  
  if (!userRole) {
    return false;
  }
  
  const allowedRoles = getAllowedRoles(formId);
  return allowedRoles.includes(userRole);
}

/**
 * Get all forms accessible by a role
 */
export function getFormsForRole(userRole: UserRole | null | undefined): string[] {
  if (!userRole) {
    return [];
  }
  
  return Object.entries(FORM_ROLE_ACCESS)
    .filter(([_, roles]) => roles.includes(userRole))
    .map(([formId]) => formId);
}

/**
 * Role hierarchy (higher roles inherit permissions from lower roles)
 * This can be used for more advanced permission checking
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'admin': 4,           // Highest - can access everything
  'financial-officer': 3,
  'business-advisor': 3,
  'user': 2,            // Standard user
  'viewer': 1,          // Lowest - read-only access
};

/**
 * Check if a role has sufficient privilege level
 */
export function hasMinRole(userRole: UserRole | null | undefined, minRole: UserRole): boolean {
  if (!userRole) {
    return false;
  }
  
  const userLevel = ROLE_HIERARCHY[userRole];
  const requiredLevel = ROLE_HIERARCHY[minRole];
  
  return userLevel >= requiredLevel;
}

