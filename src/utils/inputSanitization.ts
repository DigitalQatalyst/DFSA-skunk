/**
 * Input Sanitization and Normalization Utilities
 * 
 * Implements security rules and normalization rules from
 * Platform Data Validation Standards
 */

/**
 * Security: Reject HTML symbols < > in any text input
 */
export function sanitizeInput(value: string): string {
  if (typeof value !== 'string') {
    return String(value || '');
  }
  
  // Remove HTML tags and characters
  return value.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
}

/**
 * Security: Check if input contains HTML characters
 */
export function containsHTML(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  return /<|>/.test(value);
}

/**
 * Normalization: Trim leading/trailing spaces
 */
export function trimSpaces(value: string): string {
  if (typeof value !== 'string') {
    return String(value || '').trim();
  }
  return value.trim();
}

/**
 * Normalization: Collapse multiple spaces to single space
 */
export function collapseSpaces(value: string): string {
  if (typeof value !== 'string') {
    return String(value || '');
  }
  return value.replace(/\s+/g, ' ');
}

/**
 * Normalization: Convert email to lowercase
 */
export function normalizeEmail(value: string): string {
  if (typeof value !== 'string') {
    return String(value || '');
  }
  return value.trim().toLowerCase();
}

/**
 * Normalization: Strip formatting from phone numbers before storage
 * Removes spaces, hyphens, parentheses, but keeps + and digits
 */
export function normalizePhone(value: string): string {
  if (typeof value !== 'string') {
    return String(value || '');
  }
  
  // Keep + at the start if present, then keep only digits
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/[^\d]/g, '');
  
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

/**
 * Normalization: Strip formatting from phone but keep for display
 * This version keeps formatting for user display
 */
export function normalizePhoneForDisplay(value: string): string {
  if (typeof value !== 'string') {
    return String(value || '');
  }
  
  // Just trim, keep formatting
  return value.trim();
}

/**
 * Comprehensive normalization: Apply all normalization rules
 */
export function normalizeInput(value: string, options?: {
  trim?: boolean;
  collapseSpaces?: boolean;
  lowercase?: boolean;
  normalizePhone?: boolean;
}): string {
  if (typeof value !== 'string') {
    value = String(value || '');
  }

  let normalized = value;

  // Apply normalization rules based on options
  if (options?.trim !== false) {
    normalized = trimSpaces(normalized);
  }

  if (options?.collapseSpaces) {
    normalized = collapseSpaces(normalized);
  }

  if (options?.lowercase) {
    normalized = normalized.toLowerCase();
  }

  if (options?.normalizePhone) {
    normalized = normalizePhone(normalized);
  }

  return normalized;
}

/**
 * Sanitize and normalize input in one step
 * Applies security sanitization first, then normalization
 */
export function sanitizeAndNormalize(
  value: string,
  options?: {
    trim?: boolean;
    collapseSpaces?: boolean;
    lowercase?: boolean;
    normalizePhone?: boolean;
  }
): string {
  // First sanitize (remove HTML)
  let sanitized = sanitizeInput(value);
  
  // Then normalize
  return normalizeInput(sanitized, options);
}

/**
 * Normalize form data object
 * Applies appropriate normalization based on field type
 */
export function normalizeFormData(
  data: Record<string, any>,
  fieldTypes?: Record<string, string>
): Record<string, any> {
  const normalized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== 'string') {
      normalized[key] = value;
      continue;
    }

    const fieldType = fieldTypes?.[key]?.toLowerCase() || '';
    
    // Apply field-specific normalization
    if (fieldType === 'email' || key.toLowerCase().includes('email')) {
      normalized[key] = normalizeEmail(value);
    } else if (fieldType === 'tel' || fieldType === 'phone' || key.toLowerCase().includes('phone') || key.toLowerCase().includes('telephone')) {
      // Keep phone formatting for display, but store normalized version
      normalized[key] = normalizePhoneForDisplay(value);
    } else {
      // Default: trim and collapse spaces
      normalized[key] = normalizeInput(value, {
        trim: true,
        collapseSpaces: true
      });
    }
  }

  return normalized;
}

/**
 * Sanitize form data object (remove HTML)
 */
export function sanitizeFormData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

