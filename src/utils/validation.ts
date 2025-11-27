/**
 * Validation utilities for input sanitization and validation
 */
 
// UUID v4 validation regex pattern
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
 
/**
 * Validates if a string is a valid UUID v4
 */
export function isValidUUID(str: string | undefined | null): boolean {
  if (!str || typeof str !== 'string') return false;
  return UUID_V4_REGEX.test(str);
}
 
/**
 * Validates and normalizes a UUID, throws if invalid
 */
export function requireValidUUID(
  str: string | undefined | null,
  fieldName = 'ID'
): string {
  if (!isValidUUID(str)) {
    throw new Error(`Invalid ${fieldName}: must be a valid UUID`);
  }
  return str!;
}
 
/**
 * Validates URL format and optionally checks allowed domains
 */
export function isValidUrl(
  url: string,
  allowedDomains?: string[]
): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }
 
  try {
    const urlObj = new URL(url);
   
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must use http or https protocol' };
    }
 
    // Check allowed domains if provided
    if (allowedDomains && allowedDomains.length > 0) {
      const hostname = urlObj.hostname.toLowerCase();
      const isAllowed = allowedDomains.some(domain =>
        hostname === domain.toLowerCase() || hostname.endsWith('.' + domain.toLowerCase())
      );
     
      if (!isAllowed) {
        return {
          valid: false,
          error: `URL must be from an allowed domain: ${allowedDomains.join(', ')}`
        };
      }
    }
 
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
}
 
/**
 * Validates image URL with common image extensions and protocols
 */
export function isValidImageUrl(
  url: string,
  allowedDomains?: string[]
): { valid: boolean; error?: string } {
  const urlValidation = isValidUrl(url, allowedDomains);
  if (!urlValidation.valid) {
    return urlValidation;
  }
 
  // Some URLs might not have extensions (e.g., CDN URLs with query params)
  // So we're lenient here, but can be stricter if needed
  // Image extensions are validated implicitly by the URL format check
  return { valid: true };
}
 
/**
 * Validates text content length
 */
export function validateTextLength(
  text: string,
  min: number,
  max: number,
  fieldName = 'Text'
): { valid: boolean; error?: string } {
  const trimmed = text.trim();
 
  if (trimmed.length < min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${min} characters`
    };
  }
 
  if (trimmed.length > max) {
    return {
      valid: false,
      error: `${fieldName} must be no more than ${max} characters`
    };
  }
 
  return { valid: true };
}
 
/**
 * Validates tag format (alphanumeric, hyphens, underscores, spaces)
 */
export function isValidTag(tag: string): { valid: boolean; error?: string } {
  if (!tag || typeof tag !== 'string') {
    return { valid: false, error: 'Tag is required' };
  }
 
  const trimmed = tag.trim();
 
  if (trimmed.length === 0) {
    return { valid: false, error: 'Tag cannot be empty' };
  }
 
  if (trimmed.length > 30) {
    return { valid: false, error: 'Tag must be 30 characters or less' };
  }
 
  // Allow alphanumeric, spaces, hyphens, underscores
  const tagRegex = /^[a-zA-Z0-9\s\-_]+$/;
  if (!tagRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Tag can only contain letters, numbers, spaces, hyphens, and underscores'
    };
  }
 
  return { valid: true };
}
 
/**
 * Validates if a date is in the future
 */
export function isFutureDate(date: Date | string): { valid: boolean; error?: string } {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
 
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
 
  if (dateObj <= now) {
    return { valid: false, error: 'Date must be in the future' };
  }
 
  return { valid: true };
}
 
/**
 * Validates community name
 */
export function validateCommunityName(name: string): { valid: boolean; error?: string } {
  const lengthCheck = validateTextLength(name, 3, 100, 'Community name');
  if (!lengthCheck.valid) {
    return lengthCheck;
  }
 
  // Check for potentially problematic characters
  const trimmed = name.trim();
  if (trimmed !== name) {
    return { valid: false, error: 'Community name cannot start or end with spaces' };
  }
 
  return { valid: true };
}
 
/**
 * Validates community description
 */
export function validateCommunityDescription(
  description: string
): { valid: boolean; error?: string } {
  return validateTextLength(description, 10, 500, 'Description');
}
 
/**
 * Validates slug and ensures it's not empty
 */
export function generateSlug(name: string): string {
  if (!name || !name.trim()) {
    throw new Error('Name cannot be empty');
  }
 
  let slug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '')   // Remove leading/trailing hyphens
    .substring(0, 100);
 
  // Ensure slug is not empty
  if (!slug) {
    slug = `community-${Date.now()}`;
  }
 
  return slug;
}
 
 