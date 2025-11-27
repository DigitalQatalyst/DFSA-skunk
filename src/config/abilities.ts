import {defineAbility, type MongoAbility} from '@casl/ability';
import { match } from 'path-to-regexp';

// Define subjects (resources) that can be acted upon
export type Subjects =
  | 'onboarding'
  | 'user-dashboard'
  | 'user-forms'
  | 'user-documents'
  | 'user-requests'
  | 'user-reporting'
  | 'user-profile'
  | 'user-settings'
  | 'user-help-center'
  | 'marketplace'
  | 'public-content'
  | 'all';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'download' | 'publish' | 'archive' | 'approve' | 'unpublish';

// Define document subject type with fields for conditional permissions
type DocumentSubject = {
  isConfidential?: boolean;
};

// Map subjects to their field types
type SubjectType = {
  'user-documents': DocumentSubject;
  [key: string]: Record<string, any>;
};

export type AppAbility = MongoAbility<[Actions, Subjects], SubjectType>;

export type Role = 'admin' | 'creator' | 'approver' | 'viewer';


/**
 * Customer Segment Permissions Matrix - Dashboard Routes Only
 * 
 * RBAC is ONLY implemented for routes under /dashboard/*.
 * Marketplace routes and all routes outside dashboard router remain public
 * and are NOT part of RBAC enforcement.
 * 
 * TODO: When multi-org is implemented, dashboard permissions will be filtered
 * by the current organization context. Admin in Org A cannot access Org B's dashboard data.
 * 
 * @param role - User role: 'admin', 'contributor', 'creator', 'approver', or 'viewer'
 * @returns CASL ability instance with permissions for the given role
 */
export function defineAbilityFor(role?: Role): AppAbility {
  // If role is undefined, treat as unknown/restricted (not viewer)
  // Only valid roles get permissions; unknown roles are restricted
  const effectiveRole = role;

  // Admin role: Full dashboard access including delete permissions and onboarding
  if (effectiveRole === 'admin') {
    return defineAbility<AppAbility>((can) => {
      // Onboarding access (admin only)
      can('read', 'onboarding');
      can('create', 'onboarding');
      can('update', 'onboarding');

      // Dashboard overview
      can('read', 'user-dashboard');

      // Documents: full CRUD including delete
      can('read', 'user-documents');
      can('create', 'user-documents');
      can('update', 'user-documents');
      can('delete', 'user-documents');
      can('download', 'user-documents'); // Admins can download all documents including confidential

      // Requests: full CRUD including delete
      can('read', 'user-requests');
      can('create', 'user-requests');
      can('update', 'user-requests');
      can('delete', 'user-requests');

      // Reporting: full CRUD including delete
      can('read', 'user-reporting');
      can('create', 'user-reporting');
      can('update', 'user-reporting');
      can('delete', 'user-reporting');

      // Profile and settings
      can('read', 'user-profile');
      can('update', 'user-profile');
      can('read', 'user-settings');
      can('update', 'user-settings');
      can('create', 'user-settings');

      // Support and help center
      can('read', 'user-dashboard'); // Used for support/chat-support routes
      can('read', 'user-help-center');
      can('update', 'user-help-center');

      // Forms: full CRUD including delete
      can('read', 'user-forms');
      can('create', 'user-forms');
      can('update', 'user-forms');
      can('delete', 'user-forms');

      // Note: Marketplace/public-content subjects exist but are NOT enforced via RBAC
      // Marketplace routes remain public and accessible to all users regardless of role
    });
  }

  // Approver role: Dashboard access without delete permissions, cannot access onboarding
  if (effectiveRole === 'approver') {
    return defineAbility<AppAbility>((can, cannot) => {
      // Dashboard overview
      can('read', 'user-dashboard');

      // Documents: CRUD without delete
      can('read', 'user-documents');
      can('create', 'user-documents');
      can('update', 'user-documents');

      // Requests: CRUD without delete
      can('read', 'user-requests');
      can('create', 'user-requests');
      can('update', 'user-requests');

      // Reporting: CRUD without delete
      can('read', 'user-reporting');
      can('create', 'user-reporting');
      can('update', 'user-reporting');

      // Profile and settings
      can('read', 'user-profile');
      can('update', 'user-profile');
      can('read', 'user-settings');
      can('update', 'user-settings');
      can('create', 'user-settings');

      // Support and help center
      can('read', 'user-dashboard'); // Used for support/chat-support routes
      can('read', 'user-help-center');
      can('update', 'user-help-center');

      // Forms: CRUD without delete
      can('read', 'user-forms');
      can('create', 'user-forms');
      can('update', 'user-forms');

      // Cannot access onboarding
      cannot('read', 'onboarding');
      cannot('create', 'onboarding');
      cannot('update', 'onboarding');

      // Note: Marketplace/public-content subjects exist but are NOT enforced via RBAC
      // Marketplace routes remain public
    });
  }

  // Contributor & Creator roles: Dashboard access without delete permissions, cannot access onboarding
  if (effectiveRole === 'creator' ) {
    return defineAbility<AppAbility>((can, cannot) => {
      // Dashboard overview
      can('read', 'user-dashboard');

      // Documents: CRUD without delete
      can('read', 'user-documents');
      can('create', 'user-documents');
      can('update', 'user-documents');

      // Requests: CRUD without delete
      can('read', 'user-requests');
      can('create', 'user-requests');
      can('update', 'user-requests');

      // Reporting: CRUD without delete
      can('read', 'user-reporting');
      can('create', 'user-reporting');
      can('update', 'user-reporting');

      // Profile and settings
      can('read', 'user-profile');
      can('update', 'user-profile');
      can('read', 'user-settings');
      can('update', 'user-settings');
      can('create', 'user-settings');

      // Support and help center
      can('read', 'user-dashboard'); // Used for support/chat-support routes
      can('read', 'user-help-center');
      can('update', 'user-help-center');

      // Forms: CRUD without delete
      can('read', 'user-forms');
      can('create', 'user-forms');
      can('update', 'user-forms');

      // Cannot access onboarding
      cannot('read', 'onboarding');
      cannot('create', 'onboarding');
      cannot('update', 'onboarding');

      // Note: Marketplace/public-content subjects exist but are NOT enforced via RBAC
      // Marketplace routes remain public
    });
  }

  // Viewer role: Read-only dashboard access, cannot create/update/delete anywhere except profile/settings
  if (effectiveRole === 'viewer') {
    return defineAbility<AppAbility>((can, cannot) => {
      // Dashboard overview
      can('read', 'user-dashboard');

      // Documents: read-only (explicitly deny create/update/delete)
      can('read', 'user-documents');
      cannot('create', 'user-documents');
      cannot('update', 'user-documents');
      cannot('delete', 'user-documents');

      // Requests: read-only (explicitly deny create/update/delete)
      can('read', 'user-requests');
      cannot('create', 'user-requests');
      cannot('update', 'user-requests');
      cannot('delete', 'user-requests');

      // Reporting: read-only (explicitly deny create/update/delete)
      can('read', 'user-reporting');
      cannot('create', 'user-reporting');
      cannot('update', 'user-reporting');
      cannot('delete', 'user-reporting');

      // Profile and settings: can update own profile/settings
      can('read', 'user-profile');
      // can('update', 'user-profile');
      can('read', 'user-settings');
      cannot('update', 'user-settings');

      // Support and help center
      can('read', 'user-dashboard'); // Used for support/chat-support routes
      can('read', 'user-help-center');
      cannot('update', 'user-help-center'); // Viewer cannot update help center

      // Forms: read-only (explicitly deny create/update/delete)
      can('read', 'user-forms');
      cannot('create', 'user-forms');
      cannot('update', 'user-forms');
      cannot('delete', 'user-forms');

      // Cannot access onboarding
      cannot('read', 'onboarding');
      cannot('create', 'onboarding');
      cannot('update', 'onboarding');
      cannot('delete', 'onboarding');

      // Note: Marketplace/public-content subjects exist but are NOT enforced via RBAC
      // Marketplace routes remain public
    });
  }

  // Unknown/undefined role: Restricted access - NOT fallback to viewer
  // Unknown roles are treated as unauthenticated/unverified users and should be restricted from dashboard access
  // This handles both undefined roles and any invalid role values
  return defineAbility<AppAbility>((_can, cannot) => {
    // Explicitly deny all dashboard routes
    cannot('read', 'user-dashboard');
    cannot('read', 'user-documents');
    cannot('read', 'user-requests');
    cannot('read', 'user-reporting');
    cannot('read', 'user-profile');
    cannot('read', 'user-settings');
    cannot('read', 'user-forms');
    cannot('read', 'onboarding');
    cannot('create', 'onboarding');
    cannot('update', 'onboarding');
    cannot('manage', 'all');

    // Note: Marketplace routes are public and accessible to all users regardless of role
    // Unknown users can still access public marketplace pages
  });
}

/**
 * Route permission mapping
 * 
 * Maps application routes to CASL subjects and actions.
 * This mapping is used by RBACRoute to automatically determine required permissions
 * for routes based on their path.
 * 
 * Route patterns support:
 * - Exact matches: '/dashboard/overview'
 * - Dynamic segments: '/dashboard/forms/:id' (matched via regex in getRoutePermission)
 * 
 * If a route is not found here, getRoutePermission falls back to prefix matching:
 * - Routes starting with '/dashboard' → user-dashboard:read
 * - Routes starting with '/forms' → user-forms:create
 */
export const routePermissions: Record<string, { subject: Subjects; action: Actions }> = {

  // Dashboard root route - redirects to overview
  '/dashboard': { subject: 'user-dashboard', action: 'read' },

  // Onboarding route (admin only)
  '/dashboard/onboarding': { subject: 'onboarding', action: 'read' },

  // User dashboard routes
  '/dashboard/overview': { subject: 'user-dashboard', action: 'read' },
  '/dashboard/documents': { subject: 'user-documents', action: 'read' },
  '/dashboard/requests': { subject: 'user-requests', action: 'read' },
  '/dashboard/reporting-obligations': { subject: 'user-reporting', action: 'read' },
  '/dashboard/reporting-obligations/obligations': { subject: 'user-reporting', action: 'read' },
  '/dashboard/reporting-obligations/submitted': { subject: 'user-reporting', action: 'read' },
  '/dashboard/reporting-obligations/received': { subject: 'user-reporting', action: 'read' },
  '/dashboard/profile': { subject: 'user-profile', action: 'read' },
  '/dashboard/settings': { subject: 'user-settings', action: 'read' },
  '/dashboard/support': { subject: 'user-dashboard', action: 'read' },
  '/dashboard/chat-support': { subject: 'user-dashboard', action: 'read' },
  '/dashboard/help-center': { subject: 'user-help-center', action: 'read' },

  // User form routes
  '/dashboard/forms/book-consultation-for-entrepreneurship': { subject: 'user-forms', action: 'create' },
  '/dashboard/forms/cancel-loan': { subject: 'user-forms', action: 'create' },
  '/dashboard/forms/collateral-user-guide': { subject: 'user-forms', action: 'read' },
  '/dashboard/forms/disburse-approved-loan': { subject: 'user-forms', action: 'create' },
  '/dashboard/forms/facilitate-communication': { subject: 'user-forms', action: 'create' },
  '/dashboard/forms/issue-support-letter': { subject: 'user-forms', action: 'create' },
  '/dashboard/forms/needs-assessment-form': { subject: 'user-forms', action: 'create' },
  '/dashboard/forms/reallocation-of-loan-disbursement': { subject: 'user-forms', action: 'create' },
  '/dashboard/forms/request-for-funding': { subject: 'user-forms', action: 'create' },
  '/dashboard/forms/request-for-membership': { subject: 'user-forms', action: 'create' },
  '/dashboard/forms/request-to-amend-existing-loan-details': { subject: 'user-forms', action: 'create' },
  '/dashboard/forms/training-in-entrepreneurship': { subject: 'user-forms', action: 'create' },

  // Top-level form routes
  '/forms/needs-assessment': { subject: 'user-forms', action: 'create' },
  '/forms/request-for-membership': { subject: 'user-forms', action: 'create' },
  '/forms/request-for-funding': { subject: 'user-forms', action: 'create' },
  '/forms/book-consultation': { subject: 'user-forms', action: 'create' },
  '/forms/cancel-loan': { subject: 'user-forms', action: 'create' },
  '/forms/collateral-user-guide': { subject: 'user-forms', action: 'read' },
  '/forms/disburse-approved-loan': { subject: 'user-forms', action: 'create' },
  '/forms/facilitate-communication': { subject: 'user-forms', action: 'create' },
  '/forms/reallocation-of-loan-disbursement': { subject: 'user-forms', action: 'create' },
  '/forms/request-to-amend-existing-loan-details': { subject: 'user-forms', action: 'create' },
  '/forms/training-in-entrepreneurship': { subject: 'user-forms', action: 'create' },
  '/forms/issue-support-letter': { subject: 'user-forms', action: 'create' },

  // Marketplace routes (public read access)
  '/marketplace': { subject: 'marketplace', action: 'read' },
  '/courses': { subject: 'marketplace', action: 'read' },
  '/financial': { subject: 'marketplace', action: 'read' },
  '/non-financial': { subject: 'marketplace', action: 'read' },
  '/knowledge-hub': { subject: 'marketplace', action: 'read' },
};

/**
 * Check if a route requires authentication
 * 
 * Routes under /dashboard and /forms are considered protected
 * and require authentication. All other routes are public.
 * 
 * @param path - The route path to check
 * @returns true if the route requires authentication
 */
export function isRouteProtected(path: string): boolean {
  return path.startsWith('/dashboard') || path.startsWith('/forms');
}

/**
 * Get permission requirements for a route
 * 
 * Determines the required CASL subject and action for a given route path.
 * Uses a three-tier lookup strategy:
 * 1. Exact match in routePermissions mapping
 * 2. Pattern match for dynamic routes using path-to-regexp (e.g., /dashboard/forms/:id)
 * 3. Prefix fallback for routes under /dashboard or /forms
 * 
 * Uses path-to-regexp for reliable pattern matching, better handling of nested routes,
 * and improved edge case handling (query params, trailing slashes, etc.).
 * 
 * @param path - The route path to get permissions for
 * @returns Object with subject and action, or null if route is public/unmapped
 * 
 * @example
 * getRoutePermission('/dashboard/overview') 
 * // Returns: { subject: 'user-dashboard', action: 'read' }
 * 
 * @example
 * getRoutePermission('/dashboard/forms/123') 
 * // Returns: { subject: 'user-forms', action: 'read' } (via pattern match)
 * 
 * @example
 * getRoutePermission('/dashboard/reporting-obligations/obligations')
 * // Returns: { subject: 'user-reporting', action: 'read' } (via exact match)
 * 
 * @example
 * getRoutePermission('/marketplace') 
 * // Returns: { subject: 'marketplace', action: 'read' }
 */
export function getRoutePermission(path: string): { subject: Subjects; action: Actions } | null {
  if (!path) {
    return null;
  }

  // Normalize path (remove query params and trailing slashes)
  const normalizedPath = path.split('?')[0].replace(/\/$/, '') || '/';
  
  // Check exact match first (most specific)
  if (routePermissions[normalizedPath]) {
    return routePermissions[normalizedPath];
  }

  // Check pattern matches using path-to-regexp (for dynamic routes)
  for (const [routePattern, permission] of Object.entries(routePermissions)) {
    // Skip exact matches (already checked above)
    if (!routePattern.includes(':')) {
      continue;
    }

    // Use path-to-regexp to match route patterns
    try {
      const matcher = match(routePattern, { decode: decodeURIComponent });
      const result = matcher(normalizedPath);
      if (result) {
        return permission;
      }
    } catch (error) {
      // If path-to-regexp fails, fall back to regex matching for backward compatibility
    const patternRegex = new RegExp('^' + routePattern.replace(/:[^/]+/g, '[^/]+') + '$');
    if (patternRegex.test(normalizedPath)) {
      return permission;
      }
    }
  }

  // Check prefix matches (fallback for unmapped routes)
  if (normalizedPath.startsWith('/dashboard')) {
    return { subject: 'user-dashboard', action: 'read' };
  }
  if (normalizedPath.startsWith('/forms')) {
    return { subject: 'user-forms', action: 'create' };
  }

  // Public routes or unmapped routes return null
  // RBACRoute will allow access if the route is not protected
  return null;
}

