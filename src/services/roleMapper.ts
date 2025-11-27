/**
 * Role Mapper Service
 * 
 * Maps numeric kf_accessroles values from the API to application role strings.
 * Follows Single Responsibility Principle - this service only handles role mapping.
 * 
 * Updated to align with Dataverse choice values:
 * 123950000 → Admin
 * 123950001 → Contributor
 * 123950002 → Creator
 * 123950003 → Approver
 * 123950004 → Viewer
 */

import { type Role } from '../config/abilities';

/**
 * Numeric role identifiers from the API
 */
export const ROLE_VALUES = {
  ADMIN: 123950000,
  CREATOR: 123950002,
  APPROVER: 123950003,
  VIEWER: 123950004,
} as const;

export const ALLOWED_APP_ROLES: Role[] = [
  'admin',
  'creator',
  'approver',
  'viewer',
];

const ROLE_VALUE_MAP: Record<number, Role> = {
  [ROLE_VALUES.ADMIN]: 'admin',
  [ROLE_VALUES.CREATOR]: 'creator',
  [ROLE_VALUES.APPROVER]: 'approver',
  [ROLE_VALUES.VIEWER]: 'viewer',
};

export function logRoleDebug(
  rawValue: number | string | null | undefined,
  mappedRole: Role | undefined,
  context = 'roleMapper'
) {
  const allowed = mappedRole ? ALLOWED_APP_ROLES.includes(mappedRole) : false;
  const normalizedRaw =
    rawValue === null || rawValue === undefined || rawValue === ''
      ? 'N/A'
      : rawValue;

  console.info(
    `===== ROLE DEBUG =====\n` +
      `Context: ${context}\n` +
      `Raw kf_accessroles: ${normalizedRaw}\n` +
      `Mapped Role: ${mappedRole ?? 'undefined'}\n` +
      `Allowed: ${allowed}\n` +
      `======================`
  );
}

/**
 * Maps numeric role value to application role string
 * 
 * @param roleValue - Numeric value from kf_accessroles field
 * @returns Application role string or undefined if no match
 */
export function mapRoleValueToRole(roleValue: number | string | null | undefined): Role | undefined {
  if (roleValue === null || roleValue === undefined) {
    logRoleDebug(roleValue, undefined, 'roleMapper:empty-value');
    return undefined;
  }

  // Handle string values (e.g., "123,950,000" with commas)
  const normalizedValue = typeof roleValue === 'string' 
    ? parseInt(roleValue.replace(/,/g, ''), 10)
    : roleValue;

  if (isNaN(normalizedValue)) {
    console.warn(`[RoleMapper] Invalid role value: ${roleValue}`);
    logRoleDebug(roleValue, undefined, 'roleMapper:invalid');
    return undefined;
  }

  const mappedRole = ROLE_VALUE_MAP[normalizedValue];

  logRoleDebug(normalizedValue, mappedRole, 'roleMapper:map');

  if (mappedRole) {
    if (typeof console !== 'undefined' && typeof console.debug === 'function') {
      console.debug(`[RoleMapper] Resolved role "${mappedRole}" from value ${normalizedValue}`);
    }
    return mappedRole;
  }

  console.warn(`[RoleMapper] Unknown role value: ${normalizedValue}`);
  return undefined;
}

/**
 * Maps application role string to numeric role value
 * Useful for reverse lookups or API calls
 * 
 * @param role - Application role string
 * @returns Numeric role value or undefined if no match
 */
export function mapRoleToRoleValue(role: Role): number | undefined {
  switch (role) {
    case 'admin':
      return ROLE_VALUES.ADMIN;
    case 'creator':
      return ROLE_VALUES.CREATOR;
    case 'approver':
      return ROLE_VALUES.APPROVER;
    case 'viewer':
      return ROLE_VALUES.VIEWER;
    default:
      return undefined;
  }
}

/**
 * Gets the human-readable label for a role
 * 
 * @param role - Application role string
 * @returns Human-readable label
 */
export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    admin: 'Admin',
    creator: 'Creator',
    approver: 'Approver',
    viewer: 'Viewer',
  };
  return labels[role] || role;
}

