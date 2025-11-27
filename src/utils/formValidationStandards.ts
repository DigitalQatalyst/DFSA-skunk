/**
 * Platform Data Validation Standards - Field-Level Rules
 * 
 * This module implements the authoritative validation rules for all forms
 * across the Enterprise Journey Platform. These rules must be enforced
 * on both frontend and backend.
 * 
 * Reference: PLATFORM DATA VALIDATION STANDARDS — FIELD‑LEVEL RULES
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Standard validation patterns from Platform Data Validation Standards
 */
export const VALIDATION_PATTERNS = {
  // Name fields - support accents, spaces, hyphens, apostrophes
  firstName: /^[a-zA-ZÀ-ÿ' -]+$/,
  lastName: /^[a-zA-ZÀ-ÿ' -]+$/,
  fullName: /^[a-zA-ZÀ-ÿ' -]+$/,
  
  // Email - alphanumeric, ., _, -, @ with valid TLD
  email: /^[\w\.-]+@[\w\.-]+\.\w{2,}$/,
  
  // Phone - digits, +, spaces, hyphens, parentheses
  phone: /^\+?[0-9\s\-\(\)]+$/,
  
  // Website URL - must contain http/https
  websiteUrl: /^(https?:\/\/)?([\w.-]+)+(\:\\d+)?(\/[\w .-]*)*\/?$/,
  
  // Text fields - alphanumeric, commas, periods, !, ?, apostrophes, hyphens, parentheses
  textSingleLine: /^[\w\s.,'!?-]+$/,
  textMultiLine: /^[\w\s.,'!?-]+$/,
  
  // Address fields - alphanumeric, accents, spaces, commas, periods, hyphens, slashes
  address: /^[a-zA-Z0-9À-ÿ\s,'./-]+$/,
  city: /^[a-zA-Z0-9À-ÿ\s,'./-]+$/,
  state: /^[a-zA-Z0-9À-ÿ\s,'./-]+$/,
  
  // ZIP/Postal Code - alphanumeric only
  zipPostalCode: /^[A-Za-z0-9]+$/,
  
  // Passport Number - alphanumeric only
  passportNumber: /^[A-Za-z0-9]+$/,
} as const;

/**
 * Length constraints from Platform Data Validation Standards
 */
export const LENGTH_CONSTRAINTS = {
  firstName: { min: 1, max: 100 },
  lastName: { min: 1, max: 200 },
  fullName: { min: 1, max: 255 },
  email: { min: 5, max: 254 },
  phone: { min: 7, max: 15 }, // digits after stripping formatting
  websiteUrl: { min: 5, max: 2048 },
  textSingleLine: { min: 1, max: 255 },
  textMultiLineSmall: { min: 1, max: 750 },
  textMultiLineLarge: { min: 1, max: 2000 },
  address: { min: 1, max: 255 },
  city: { min: 1, max: 100 },
  state: { min: 1, max: 100 },
  zipPostalCode: { min: 1, max: 20 },
  passportNumber: { min: 5, max: 10 },
} as const;

/**
 * Security: Check for HTML injection attempts
 */
export function containsHTML(value: string): boolean {
  return /<|>/.test(value);
}

/**
 * Security: Check if value contains HTML symbols
 */
export function rejectHTML(value: string): ValidationResult {
  if (containsHTML(value)) {
    return {
      isValid: false,
      error: "Input cannot contain HTML characters (< or >)"
    };
  }
  return { isValid: true };
}

/**
 * Validate First Name
 * Allowed: A-Z, a-z, accents (é, ñ, ü), spaces, hyphens, apostrophes
 * Length: 1-100
 */
export function validateFirstName(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "First name is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "First name cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.firstName.min) {
    return { isValid: false, error: `First name must be at least ${LENGTH_CONSTRAINTS.firstName.min} character` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.firstName.max) {
    return { isValid: false, error: `First name must not exceed ${LENGTH_CONSTRAINTS.firstName.max} characters` };
  }

  if (!VALIDATION_PATTERNS.firstName.test(trimmed)) {
    return { isValid: false, error: "First name can only contain letters, spaces, hyphens, and apostrophes" };
  }

  return { isValid: true };
}

/**
 * Validate Last Name
 * Allowed: A-Z, a-z, accents, spaces, hyphens, apostrophes
 * Length: 1-200
 */
export function validateLastName(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Last name is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "Last name cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.lastName.min) {
    return { isValid: false, error: `Last name must be at least ${LENGTH_CONSTRAINTS.lastName.min} character` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.lastName.max) {
    return { isValid: false, error: `Last name must not exceed ${LENGTH_CONSTRAINTS.lastName.max} characters` };
  }

  if (!VALIDATION_PATTERNS.lastName.test(trimmed)) {
    return { isValid: false, error: "Last name can only contain letters, spaces, hyphens, and apostrophes" };
  }

  return { isValid: true };
}

/**
 * Validate Full Name
 * Allowed: A-Z, a-z, accents, spaces, hyphens, apostrophes
 * Length: 1-255
 */
export function validateFullName(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Full name is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "Full name cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.fullName.min) {
    return { isValid: false, error: `Full name must be at least ${LENGTH_CONSTRAINTS.fullName.min} character` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.fullName.max) {
    return { isValid: false, error: `Full name must not exceed ${LENGTH_CONSTRAINTS.fullName.max} characters` };
  }

  if (!VALIDATION_PATTERNS.fullName.test(trimmed)) {
    return { isValid: false, error: "Full name can only contain letters, spaces, hyphens, and apostrophes" };
  }

  return { isValid: true };
}

/**
 * Validate Email Address
 * Allowed: alphanumeric, ., _, -, @
 * Length: 5-254
 * Must include @ and valid TLD
 */
export function validateEmail(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Email address is required" };
  }

  const trimmed = value.trim().toLowerCase();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "Email address cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.email.min) {
    return { isValid: false, error: `Email address must be at least ${LENGTH_CONSTRAINTS.email.min} characters` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.email.max) {
    return { isValid: false, error: `Email address must not exceed ${LENGTH_CONSTRAINTS.email.max} characters` };
  }

  if (!VALIDATION_PATTERNS.email.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
}

/**
 * Validate Phone Number
 * Allowed: digits, +, spaces, hyphens, parentheses
 * Length: 7-15 digits (after stripping formatting)
 * Must support international format
 */
export function validatePhone(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Phone number is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "Phone number cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  // Check pattern allows formatting characters
  if (!VALIDATION_PATTERNS.phone.test(trimmed)) {
    return { isValid: false, error: "Phone number format is invalid" };
  }

  // Strip formatting and count digits
  const digitsOnly = trimmed.replace(/[\s\-\(\)\+]/g, '');
  
  if (digitsOnly.length < LENGTH_CONSTRAINTS.phone.min) {
    return { isValid: false, error: `Phone number must contain at least ${LENGTH_CONSTRAINTS.phone.min} digits` };
  }

  if (digitsOnly.length > LENGTH_CONSTRAINTS.phone.max) {
    return { isValid: false, error: `Phone number must not exceed ${LENGTH_CONSTRAINTS.phone.max} digits` };
  }

  return { isValid: true };
}

/**
 * Validate Website URL
 * Allowed: alphanumeric, ., _, -, :, /
 * Length: 5-2048
 * Must contain http/https
 */
export function validateWebsiteUrl(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Website URL is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "Website URL cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.websiteUrl.min) {
    return { isValid: false, error: `Website URL must be at least ${LENGTH_CONSTRAINTS.websiteUrl.min} characters` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.websiteUrl.max) {
    return { isValid: false, error: `Website URL must not exceed ${LENGTH_CONSTRAINTS.websiteUrl.max} characters` };
  }

  if (!VALIDATION_PATTERNS.websiteUrl.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid website URL" };
  }

  return { isValid: true };
}

/**
 * Validate Single-Line Text
 * Allowed: alphanumeric, commas, periods, !, ?, apostrophes, hyphens, parentheses
 * Length: 1-255
 */
export function validateTextSingleLine(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Text field is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "Text field cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.textSingleLine.min) {
    return { isValid: false, error: `Text must be at least ${LENGTH_CONSTRAINTS.textSingleLine.min} character` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.textSingleLine.max) {
    return { isValid: false, error: `Text must not exceed ${LENGTH_CONSTRAINTS.textSingleLine.max} characters` };
  }

  if (!VALIDATION_PATTERNS.textSingleLine.test(trimmed)) {
    return { isValid: false, error: "Text contains invalid characters" };
  }

  return { isValid: true };
}

/**
 * Validate Multi-Line Text (Small)
 * Allowed: alphanumeric, commas, periods, !, ?, apostrophes, hyphens, parentheses
 * Length: 1-750
 */
export function validateTextMultiLineSmall(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Text field is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "Text field cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.textMultiLineSmall.min) {
    return { isValid: false, error: `Text must be at least ${LENGTH_CONSTRAINTS.textMultiLineSmall.min} character` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.textMultiLineSmall.max) {
    return { isValid: false, error: `Text must not exceed ${LENGTH_CONSTRAINTS.textMultiLineSmall.max} characters` };
  }

  if (!VALIDATION_PATTERNS.textMultiLine.test(trimmed)) {
    return { isValid: false, error: "Text contains invalid characters" };
  }

  return { isValid: true };
}

/**
 * Validate Multi-Line Text (Large)
 * Allowed: alphanumeric, commas, periods, !, ?, apostrophes, hyphens, parentheses
 * Length: 1-2000
 */
export function validateTextMultiLineLarge(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Text field is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "Text field cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.textMultiLineLarge.min) {
    return { isValid: false, error: `Text must be at least ${LENGTH_CONSTRAINTS.textMultiLineLarge.min} character` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.textMultiLineLarge.max) {
    return { isValid: false, error: `Text must not exceed ${LENGTH_CONSTRAINTS.textMultiLineLarge.max} characters` };
  }

  if (!VALIDATION_PATTERNS.textMultiLine.test(trimmed)) {
    return { isValid: false, error: "Text contains invalid characters" };
  }

  return { isValid: true };
}

/**
 * Validate Address (Building/Street)
 * Allowed: alphanumeric, accents, spaces, commas, periods, hyphens, slashes
 * Length: 1-255
 */
export function validateAddress(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Address is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "Address cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.address.min) {
    return { isValid: false, error: `Address must be at least ${LENGTH_CONSTRAINTS.address.min} character` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.address.max) {
    return { isValid: false, error: `Address must not exceed ${LENGTH_CONSTRAINTS.address.max} characters` };
  }

  if (!VALIDATION_PATTERNS.address.test(trimmed)) {
    return { isValid: false, error: "Address contains invalid characters" };
  }

  return { isValid: true };
}

/**
 * Validate City/District
 * Allowed: alphanumeric, accents, spaces, commas, periods, hyphens, slashes
 * Length: 1-100
 */
export function validateCity(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "City is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "City cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.city.min) {
    return { isValid: false, error: `City must be at least ${LENGTH_CONSTRAINTS.city.min} character` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.city.max) {
    return { isValid: false, error: `City must not exceed ${LENGTH_CONSTRAINTS.city.max} characters` };
  }

  if (!VALIDATION_PATTERNS.city.test(trimmed)) {
    return { isValid: false, error: "City contains invalid characters" };
  }

  return { isValid: true };
}

/**
 * Validate State/Province
 * Allowed: alphanumeric, accents, spaces, commas, periods, hyphens, slashes
 * Length: 1-100
 */
export function validateState(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "State/Province is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "State/Province cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.state.min) {
    return { isValid: false, error: `State/Province must be at least ${LENGTH_CONSTRAINTS.state.min} character` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.state.max) {
    return { isValid: false, error: `State/Province must not exceed ${LENGTH_CONSTRAINTS.state.max} characters` };
  }

  if (!VALIDATION_PATTERNS.state.test(trimmed)) {
    return { isValid: false, error: "State/Province contains invalid characters" };
  }

  return { isValid: true };
}

/**
 * Validate ZIP/Postal Code
 * Allowed: alphanumeric only
 * Length: 1-20
 */
export function validateZipPostalCode(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "ZIP/Postal code is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "ZIP/Postal code cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.zipPostalCode.min) {
    return { isValid: false, error: `ZIP/Postal code must be at least ${LENGTH_CONSTRAINTS.zipPostalCode.min} character` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.zipPostalCode.max) {
    return { isValid: false, error: `ZIP/Postal code must not exceed ${LENGTH_CONSTRAINTS.zipPostalCode.max} characters` };
  }

  if (!VALIDATION_PATTERNS.zipPostalCode.test(trimmed)) {
    return { isValid: false, error: "ZIP/Postal code can only contain letters and numbers" };
  }

  return { isValid: true };
}

/**
 * Validate Passport Number
 * Allowed: alphanumeric only
 * Length: 5-10
 */
export function validatePassportNumber(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Passport number is required" };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "Passport number cannot be empty" };
  }

  const htmlCheck = rejectHTML(trimmed);
  if (!htmlCheck.isValid) {
    return htmlCheck;
  }

  if (trimmed.length < LENGTH_CONSTRAINTS.passportNumber.min) {
    return { isValid: false, error: `Passport number must be at least ${LENGTH_CONSTRAINTS.passportNumber.min} characters` };
  }

  if (trimmed.length > LENGTH_CONSTRAINTS.passportNumber.max) {
    return { isValid: false, error: `Passport number must not exceed ${LENGTH_CONSTRAINTS.passportNumber.max} characters` };
  }

  if (!VALIDATION_PATTERNS.passportNumber.test(trimmed)) {
    return { isValid: false, error: "Passport number can only contain letters and numbers" };
  }

  return { isValid: true };
}

/**
 * Date constraint options for validation
 */
export interface DateConstraints {
  notFuture?: boolean;        // Date cannot be in the future
  notPast?: boolean;          // Date cannot be in the past
  minDate?: string | Date;    // Minimum allowed date (ISO string or Date)
  maxDate?: string | Date;    // Maximum allowed date (ISO string or Date)
  minAge?: number;            // Minimum age in years (for DOB)
  maxAge?: number;            // Maximum age in years (for DOB)
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Validate Date with Logical Constraints
 * Capture via DatePicker only. Must be valid and logically constrained.
 * 
 * @param value - Date string (ISO format: YYYY-MM-DD) or Date object
 * @param constraints - Date constraint options
 * @param fieldLabel - Optional field label for error messages
 */
export function validateDateWithConstraints(
  value: string | Date,
  constraints?: DateConstraints,
  fieldLabel: string = "Date"
): ValidationResult {
  if (!value) {
    return { isValid: false, error: `${fieldLabel} is required` };
  }

  // Convert to Date object
  let dateValue: Date;
  if (typeof value === 'string') {
    // Handle ISO format (YYYY-MM-DD) from date input
    const dateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!dateMatch) {
      return { isValid: false, error: `${fieldLabel} must be in YYYY-MM-DD format` };
    }
    dateValue = new Date(value);
  } else {
    dateValue = value;
  }

  // Check if date is valid
  if (isNaN(dateValue.getTime())) {
    return { isValid: false, error: `${fieldLabel} is not a valid date` };
  }

  // If no constraints, just validate format
  if (!constraints) {
    return { isValid: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
  const inputDate = new Date(dateValue);
  inputDate.setHours(0, 0, 0, 0);

  // Check: Date cannot be in the future
  if (constraints.notFuture && inputDate > today) {
    return { isValid: false, error: `${fieldLabel} cannot be in the future` };
  }

  // Check: Date cannot be in the past
  if (constraints.notPast && inputDate < today) {
    return { isValid: false, error: `${fieldLabel} cannot be in the past` };
  }

  // Check: Minimum date
  if (constraints.minDate) {
    const minDate = typeof constraints.minDate === 'string' 
      ? new Date(constraints.minDate) 
      : constraints.minDate;
    minDate.setHours(0, 0, 0, 0);
    if (inputDate < minDate) {
      const minDateStr = minDate.toISOString().split('T')[0];
      return { isValid: false, error: `${fieldLabel} must be on or after ${minDateStr}` };
    }
  }

  // Check: Maximum date
  if (constraints.maxDate) {
    const maxDate = typeof constraints.maxDate === 'string' 
      ? new Date(constraints.maxDate) 
      : constraints.maxDate;
    maxDate.setHours(0, 0, 0, 0);
    if (inputDate > maxDate) {
      const maxDateStr = maxDate.toISOString().split('T')[0];
      return { isValid: false, error: `${fieldLabel} must be on or before ${maxDateStr}` };
    }
  }

  // Check: Minimum age (for Date of Birth)
  if (constraints.minAge !== undefined) {
    const age = calculateAge(inputDate);
    if (age < constraints.minAge) {
      return { isValid: false, error: `Age must be at least ${constraints.minAge} years` };
    }
  }

  // Check: Maximum age (for Date of Birth)
  if (constraints.maxAge !== undefined) {
    const age = calculateAge(inputDate);
    if (age > constraints.maxAge) {
      return { isValid: false, error: `Age must not exceed ${constraints.maxAge} years` };
    }
  }

  return { isValid: true };
}

/**
 * Validate Date Range
 * Ensures start date is before end date
 */
export function validateDateRange(
  startDate: string | Date,
  endDate: string | Date,
  startLabel: string = "Start date",
  endLabel: string = "End date"
): ValidationResult {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isNaN(start.getTime())) {
    return { isValid: false, error: `${startLabel} is not a valid date` };
  }

  if (isNaN(end.getTime())) {
    return { isValid: false, error: `${endLabel} is not a valid date` };
  }

  if (start >= end) {
    return { isValid: false, error: `${startLabel} must be before ${endLabel}` };
  }

  return { isValid: true };
}

/**
 * Generic validator that maps field types to appropriate validators
 */
export function validateFieldByType(
  fieldType: string, 
  value: string, 
  fieldLabel?: string,
  options?: { dateConstraints?: DateConstraints }
): ValidationResult {
  const label = fieldLabel || 'Field';
  
  switch (fieldType.toLowerCase()) {
    case 'firstname':
    case 'first-name':
      return validateFirstName(value);
    case 'lastname':
    case 'last-name':
      return validateLastName(value);
    case 'fullname':
    case 'full-name':
    case 'name':
      return validateFullName(value);
    case 'email':
      return validateEmail(value);
    case 'phone':
    case 'tel':
    case 'telephone':
      return validatePhone(value);
    case 'url':
    case 'website':
    case 'websiteurl':
      return validateWebsiteUrl(value);
    case 'address':
    case 'street':
    case 'building':
      return validateAddress(value);
    case 'city':
    case 'district':
      return validateCity(value);
    case 'state':
    case 'province':
      return validateState(value);
    case 'zip':
    case 'postal':
    case 'postalcode':
      return validateZipPostalCode(value);
    case 'passport':
    case 'passportnumber':
      return validatePassportNumber(value);
    case 'text':
      return validateTextSingleLine(value);
    case 'textarea':
      return validateTextMultiLineSmall(value);
    case 'date':
    case 'datepicker':
      return validateDateWithConstraints(value, options?.dateConstraints, label);
    default:
      // Default: basic HTML check and non-empty
      const htmlCheck = rejectHTML(value);
      if (!htmlCheck.isValid) {
        return htmlCheck;
      }
      if (!value || value.trim().length === 0) {
        return { isValid: false, error: `${label} is required` };
      }
      return { isValid: true };
  }
}

