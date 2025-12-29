/**
 * usePermission Hook
 * 
 * Custom hooks for imperative permission checks in components.
 * 
 * Note: For declarative UI rendering, prefer using the <Can> component from
 * @casl/react. These hooks are useful for imperative logic (e.g., conditional
 * navigation, API calls, etc.).
 * 
 * @see Can component from '../components/RBAC' for declarative permission checks
 */

import React, { useMemo } from 'react';
import { useAbility } from '@casl/react';
import { Actions, Subjects, AppAbility } from '../config/abilities';
import { CASLAbilityContext } from '../context/AbilityContext';

/**
 * Hook to check if user has a specific permission.
 * 
 * Useful for imperative permission checks (e.g., in event handlers, useEffect callbacks).
 * For conditional rendering, prefer using the <Can> component.
 * 
 * @param action - The action to check (e.g., 'read', 'create', 'update')
 * @param subject - The subject/resource to check permissions for
 * @returns boolean indicating if the user has the permission
 * 
 * @example
 * // Imperative check in event handler
 * const handleClick = () => {
 *   const canCreate = usePermission('create', 'admin-media');
 *   if (canCreate) {
 *     navigate('/admin-ui/media/new');
 *   }
 * };
 * 
 * @example
 * // Conditional logic
 * const canReadAdmin = usePermission('read', 'admin-dashboard');
 * if (canReadAdmin) {
 *   // Do something
 * }
 */
export function usePermission(action: Actions, subject: Subjects | Subjects[]): boolean {
  const ability = useAbility<AppAbility>(CASLAbilityContext as React.Context<AppAbility>);
  if (!ability) {
    return false;
  }
  // Handle array of subjects - user must have permission for at least one
  if (Array.isArray(subject)) {
    return subject.some(s => ability.can(action, s));
  }
  return ability.can(action, subject);
}

/**
 * Hook to get multiple permission checks at once.
 * 
 * Useful when you need to check multiple permissions in a component.
 * Results are memoized to avoid unnecessary recalculations.
 * 
 * @param permissionMap - Object mapping permission names to [action, subject] tuples
 * @returns Object with the same keys and boolean values indicating permissions
 * 
 * @example
 * const permissions = usePermissions({
 *   canReadAdmin: ['read', 'admin-dashboard'],
 *   canManageMedia: ['manage', 'admin-media'],
 *   canCreatePost: ['create', 'Post'],
 * });
 * 
 * if (permissions.canReadAdmin) {
 *   // Show admin dashboard
 * }
 * 
 * if (permissions.canManageMedia) {
 *   // Show media management button
 * }
 */
export function usePermissions<T extends Record<string, [Actions, Subjects | Subjects[]]>>(
  permissionMap: T
): Record<keyof T, boolean> {
  const ability = useAbility<AppAbility>(CASLAbilityContext as React.Context<AppAbility>);
  
  // Memoize results to avoid recalculating on every render
  return useMemo(() => {
    const result = {} as Record<keyof T, boolean>;
    
    if (!ability) {
      // If ability is not available, return all false
      for (const key of Object.keys(permissionMap)) {
        result[key as keyof T] = false;
      }
      return result;
    }
    
    for (const [key, [action, subject]] of Object.entries(permissionMap)) {
      // Handle array of subjects - user must have permission for at least one
      if (Array.isArray(subject)) {
        result[key as keyof T] = subject.some(s => ability.can(action, s));
      } else {
        result[key as keyof T] = ability.can(action, subject);
      }
    }
    
    return result;
  }, [ability, permissionMap]);
}

