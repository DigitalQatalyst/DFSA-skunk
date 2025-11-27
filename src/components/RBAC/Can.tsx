/**
 * Can Component
 * 
 * CASL permission checking component for declarative permission-based rendering.
 * This component is bound to CASLAbilityContext and will automatically re-render
 * when ability rules change.
 * 
 * Supports all CASL Can props:
 * - I/do: Action name (e.g., 'read', 'update', 'create')
 * - a/an/this/on: Subject/resource being checked
 * - field: Specific field to check (optional)
 * - not: Invert the permission check
 * - passThrough: Always render children, passing allowed status as function param
 * 
 * @example
 * // Simple usage - hide/show based on permission
 * <Can I="read" a="admin-dashboard">
 *   <AdminDashboard />
 * </Can>
 * 
 * @example
 * // Using render function (recommended for performance)
 * <Can I="create" a="Post">
 *   {() => <button onClick={createPost}>Create Post</button>}
 * </Can>
 * 
 * @example
 * // Using passThrough for conditional disabling
 * <Can I="create" a="Post" passThrough>
 *   {(allowed) => <button disabled={!allowed}>Save</button>}
 * </Can>
 * 
 * @example
 * // Inverted check - show when user CANNOT do action
 * <Can not I="create" a="Post">
 *   <p>You are not allowed to create a post</p>
 * </Can>
 */

import React from 'react';
import { Can as CASLCan } from '../../context/AbilityContext';
import { Actions, Subjects } from '../../config/abilities';

// Re-export the Can component with proper TypeScript types
// The component from createContextualCan already supports all CASL props
export const Can = CASLCan as React.ComponentType<
  React.PropsWithChildren<{
    I?: Actions;
    do?: Actions;
    a?: Subjects;
    an?: Subjects;
    this?: Subjects;
    on?: Subjects;
    field?: string;
    not?: boolean;
    passThrough?: boolean;
    ability?: never; // Not needed since bound to context
  }>
>;

export default Can;

