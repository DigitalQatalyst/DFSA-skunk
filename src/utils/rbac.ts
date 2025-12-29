/**
 * Unified RBAC Permission Utility
 * 
 * Provides a centralized `can()` function for checking permissions across the application.
 * This is the single source of truth for permission checks.
 */

import { AppAbility, Role, Subjects, Actions } from '../config/abilities';
import { useAbilityContext } from '../context/AbilityContext';

/**
 * Check if a user with the given role can perform an action on a subject
 * 
 * @param role - User role (admin, approver, editor, viewer, or undefined for unknown)
 * @param subject - Resource subject to check
 * @param action - Action to check (read, create, update, delete, etc.)
 * @param ability - Optional CASL ability instance (if not provided, creates one from role)
 * @returns true if the user can perform the action, false otherwise
 * 
 * @example
 * can('admin', 'user-documents', 'delete') // true
 * can('approver', 'user-documents', 'delete') // false
 * can('viewer', 'user-documents', 'read') // true
 * can(undefined, 'user-dashboard', 'read') // false (unknown role)
 */
export function can(
  role: Role | undefined,
  subject: Subjects,
  action: Actions,
  ability?: AppAbility
): boolean {
  // If no ability provided, we need to create one from role
  // However, in most cases, this function should be used with the ability from context
  // For standalone usage, we'll import defineAbilityFor
  if (!ability) {
    const { defineAbilityFor } = require('../config/abilities');
    ability = defineAbilityFor(role);
  }
  
  return ability.can(action, subject);
}

/**
 * React hook version of can() that uses the current user's ability from context
 * 
 * @param subject - Resource subject to check
 * @param action - Action to check
 * @returns true if the current user can perform the action, false otherwise
 * 
 * @example
 * const canDelete = useCan('user-documents', 'delete');
 * if (canDelete) {
 *   // Show delete button
 * }
 */
export function useCan(subject: Subjects, action: Actions): boolean {
  const { ability } = useAbilityContext();
  return ability.can(action, subject);
}

/**
 * Check if a role has delete permissions
 * Only admin has delete permissions
 */
export function canDelete(role: Role | undefined): boolean {
  return role === 'admin';
}

/**
 * Check if a role can access onboarding
 * Only admin can access onboarding
 */
export function canAccessOnboarding(role: Role | undefined): boolean {
  return role === 'admin';
}

/**
 * Check if a role is read-only
 * Viewer is read-only (except for profile/settings updates)
 */
export function isReadOnly(role: Role | undefined): boolean {
  return role === 'viewer';
}

/**
 * Check if a role is unknown/undefined
 * Unknown roles should be restricted from all dashboard access
 */
export function isUnknownRole(role: Role | undefined): role is undefined {
  return role === undefined;
}

