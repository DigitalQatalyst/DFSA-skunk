/**
 * DFSA Financial Services Application Form - Validation Utilities
 *
 * This module implements validation rules specific to DFSA Financial Services
 * Application Forms, extending the platform validation standards.
 *
 * Requirements: 6.1, 6.2, 8.3
 */

import {
  ValidationResult,
  validateEmail,
  validatePhone,
  validateFullName,
  validateTextSingleLine,
  validateTextMultiLineSmall,
  validateAddress,
  validateCity,
  validateState,
  validateZipPostalCode,
  validateDateWithConstraints,
  DateConstraints
} from './formValidationStandards';

/**
 * DFSA-specific validation patterns
 */
export const DFSA_VALIDATION_PATTERNS = {
  // Application reference format: DFSA-YYYYMM-XXXXX
  applicationRef: /^DFSA-\d{6}-\d{5}$/,

  // Registration number - alphanumeric with optional hyphens
  registrationNumber: /^[A-Za-z0-9-]+$/,

  // Percentage - 0-100 with up to 2 decimal places
  percentage: /^\d{1,3}(\.\d{1,2})?$/,

  // Trading name - alphanumeric, spaces, hyphens, apostrophes, periods
  tradingName: /^[a-zA-ZÀ-ÿ0-9\s'.-]+$/,

  // Company/firm name - similar to trading name but more restrictive
  companyName: /^[a-zA-ZÀ-ÿ0-9\s'.-]+$/,

  // IT complexity levels
  itComplexity: /^(Low|Medium|High)$/,

  // IT reliance levels
  itReliance: /^(Low|Medium|High)$/,
} as const;

/**
 * DFSA-specific length constraints
 */
export const DFSA_LENGTH_CONSTRAINTS = {
  applicationRef: { min: 17, max: 17 }, // DFSA-YYYYMM-XXXXX
  firmName: { min: 2, max: 200 },
  tradingName: { min: 2, max: 100 },
  registrationNumber: { min: 1, max: 50 },
  businessPlanSummary: { min: 50, max: 2000 },
  riskManagementFramework: { min: 50, max: 1500 },
  groupStructureDescription: { min: 20, max: 1000 },
  waiverJustification: { min: 20, max: 500 },
} as const;

/**
 * Validate DFSA Application Reference
 * Format: DFSA-YYYYMM-XXXXX
 */
export function validateApplicationRef(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Application reference is required" };
  }

  const trimmed = value.trim().toUpperCase();

  if (trimmed.length !== DFSA_LENGTH_CONSTRAINTS.applicationRef.min) {
    return { isValid: false, error: "Application reference must be exactly 17 characters" };
  }

  if (!DFSA_VALIDATION_PATTERNS.applicationRef.test(trimmed)) {
    return { isValid: false, error: "Application reference must follow format DFSA-YYYYMM-XXXXX" };
  }

  // Validate year and month components
  const yearMonth = trimmed.substring(5, 11); // YYYYMM
  const year = parseInt(yearMonth.substring(0, 4));
  const month = parseInt(yearMonth.substring(4, 6));

  const currentYear = new Date().getFullYear();
  if (year < 2020 || year > currentYear + 1) {
    return { isValid: false, error: "Application reference contains invalid year" };
  }

  if (month < 1 || month > 12) {
    return { isValid: false, error: "Application reference contains invalid month" };
  }

  return { isValid: true };
}

/**
 * Validate Firm/Company Name
 * Allowed: letters, numbers, spaces, hyphens, apostrophes, periods
 * Length: 2-200
 */
export function validateFirmName(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Firm name is required" };
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: "Firm name cannot be empty" };
  }

  if (trimmed.length < DFSA_LENGTH_CONSTRAINTS.firmName.min) {
    return { isValid: false, error: `Firm name must be at least ${DFSA_LENGTH_CONSTRAINTS.firmName.min} characters` };
  }

  if (trimmed.length > DFSA_LENGTH_CONSTRAINTS.firmName.max) {
    return { isValid: false, error: `Firm name must not exceed ${DFSA_LENGTH_CONSTRAINTS.firmName.max} characters` };
  }

  if (!DFSA_VALIDATION_PATTERNS.companyName.test(trimmed)) {
    return { isValid: false, error: "Firm name contains invalid characters" };
  }

  return { isValid: true };
}

/**
 * Validate Trading Name
 * Similar to firm name but shorter
 * Length: 2-100
 */
export function validateTradingName(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Trading name is required" };
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: "Trading name cannot be empty" };
  }

  if (trimmed.length < DFSA_LENGTH_CONSTRAINTS.tradingName.min) {
    return { isValid: false, error: `Trading name must be at least ${DFSA_LENGTH_CONSTRAINTS.tradingName.min} characters` };
  }

  if (trimmed.length > DFSA_LENGTH_CONSTRAINTS.tradingName.max) {
    return { isValid: false, error: `Trading name must not exceed ${DFSA_LENGTH_CONSTRAINTS.tradingName.max} characters` };
  }

  if (!DFSA_VALIDATION_PATTERNS.tradingName.test(trimmed)) {
    return { isValid: false, error: "Trading name contains invalid characters" };
  }

  return { isValid: true };
}

/**
 * Validate Registration Number
 * Alphanumeric with optional hyphens
 * Length: 1-50
 */
export function validateRegistrationNumber(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Registration number is required" };
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: "Registration number cannot be empty" };
  }

  if (trimmed.length < DFSA_LENGTH_CONSTRAINTS.registrationNumber.min) {
    return { isValid: false, error: `Registration number must be at least ${DFSA_LENGTH_CONSTRAINTS.registrationNumber.min} character` };
  }

  if (trimmed.length > DFSA_LENGTH_CONSTRAINTS.registrationNumber.max) {
    return { isValid: false, error: `Registration number must not exceed ${DFSA_LENGTH_CONSTRAINTS.registrationNumber.max} characters` };
  }

  if (!DFSA_VALIDATION_PATTERNS.registrationNumber.test(trimmed)) {
    return { isValid: false, error: "Registration number can only contain letters, numbers, and hyphens" };
  }

  return { isValid: true };
}

/**
 * Validate Percentage Value
 * Must be between 0 and 100 with up to 2 decimal places
 */
export function validatePercentage(value: string | number): ValidationResult {
  const stringValue = typeof value === 'number' ? value.toString() : value;

  if (!stringValue || stringValue.trim() === '') {
    return { isValid: false, error: "Percentage is required" };
  }

  const trimmed = stringValue.trim();

  if (!DFSA_VALIDATION_PATTERNS.percentage.test(trimmed)) {
    return { isValid: false, error: "Percentage must be a number between 0 and 100 with up to 2 decimal places" };
  }

  const numValue = parseFloat(trimmed);

  if (isNaN(numValue)) {
    return { isValid: false, error: "Percentage must be a valid number" };
  }

  if (numValue < 0) {
    return { isValid: false, error: "Percentage cannot be negative" };
  }

  if (numValue > 100) {
    return { isValid: false, error: "Percentage cannot exceed 100%" };
  }

  return { isValid: true };
}

/**
 * Validate IT Complexity Level
 * Must be one of: Low, Medium, High
 */
export function validateITComplexity(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "IT complexity level is required" };
  }

  const trimmed = value.trim();

  if (!DFSA_VALIDATION_PATTERNS.itComplexity.test(trimmed)) {
    return { isValid: false, error: "IT complexity must be Low, Medium, or High" };
  }

  return { isValid: true };
}

/**
 * Validate IT Reliance Level
 * Must be one of: Low, Medium, High
 */
export function validateITReliance(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "IT reliance level is required" };
  }

  const trimmed = value.trim();

  if (!DFSA_VALIDATION_PATTERNS.itReliance.test(trimmed)) {
    return { isValid: false, error: "IT reliance must be Low, Medium, or High" };
  }

  return { isValid: true };
}

/**
 * Validate Business Plan Summary
 * Longer text field with specific requirements
 * Length: 50-2000
 */
export function validateBusinessPlanSummary(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Business plan summary is required" };
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: "Business plan summary cannot be empty" };
  }

  if (trimmed.length < DFSA_LENGTH_CONSTRAINTS.businessPlanSummary.min) {
    return { isValid: false, error: `Business plan summary must be at least ${DFSA_LENGTH_CONSTRAINTS.businessPlanSummary.min} characters` };
  }

  if (trimmed.length > DFSA_LENGTH_CONSTRAINTS.businessPlanSummary.max) {
    return { isValid: false, error: `Business plan summary must not exceed ${DFSA_LENGTH_CONSTRAINTS.businessPlanSummary.max} characters` };
  }

  // Use existing multi-line validation for character restrictions
  return validateTextMultiLineSmall(trimmed);
}

/**
 * Validate Date of Birth with DFSA-specific constraints
 * Must be at least 18 years old, not more than 100 years old
 */
export function validateDateOfBirth(value: string | Date): ValidationResult {
  const constraints: DateConstraints = {
    notFuture: true,
    minAge: 18,
    maxAge: 100
  };

  return validateDateWithConstraints(value, constraints, "Date of birth");
}

/**
 * Validate Registration Date
 * Cannot be in the future, must be after 1900
 */
export function validateRegistrationDate(value: string | Date): ValidationResult {
  const constraints: DateConstraints = {
    notFuture: true,
    minDate: '1900-01-01'
  };

  return validateDateWithConstraints(value, constraints, "Registration date");
}

/**
 * Validate Financial Year End Date
 * Must be a valid date, can be in the future (for next financial year)
 */
export function validateFinancialYearEnd(value: string | Date): ValidationResult {
  return validateDateWithConstraints(value, undefined, "Financial year end");
}

/**
 * Validate Required Boolean Field
 * Must be explicitly true (for declarations, confirmations)
 */
export function validateRequiredBoolean(value: boolean, fieldName: string): ValidationResult {
  if (value !== true) {
    return { isValid: false, error: `${fieldName} must be confirmed` };
  }

  return { isValid: true };
}

/**
 * Validate Array Field (for shareholders, controllers, etc.)
 * Must have at least one item
 */
export function validateRequiredArray<T>(value: T[], fieldName: string, minItems: number = 1): ValidationResult {
  if (!Array.isArray(value)) {
    return { isValid: false, error: `${fieldName} must be provided` };
  }

  if (value.length < minItems) {
    return { isValid: false, error: `At least ${minItems} ${fieldName.toLowerCase()} must be provided` };
  }

  return { isValid: true };
}

/**
 * Validate Country Code
 * Must be a valid ISO 3166-1 alpha-2 country code
 */
export function validateCountryCode(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: "Country is required" };
  }

  const trimmed = value.trim().toUpperCase();

  if (trimmed.length !== 2) {
    return { isValid: false, error: "Country code must be 2 characters" };
  }

  // Basic validation - in a real implementation, you'd check against a list of valid codes
  if (!/^[A-Z]{2}$/.test(trimmed)) {
    return { isValid: false, error: "Country code must contain only letters" };
  }

  return { isValid: true };
}

/**
 * Comprehensive form field validator for DFSA forms
 * Maps field types to appropriate DFSA validators
 */
export function validateDFSAField(
  fieldType: string,
  value: any,
  fieldLabel?: string,
  options?: {
    required?: boolean;
    dateConstraints?: DateConstraints;
    minItems?: number;
  }
): ValidationResult {
  const label = fieldLabel || 'Field';
  const isRequired = options?.required !== false; // Default to required

  // Handle required field validation
  if (isRequired && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: `${label} is required` };
  }

  // If not required and empty, it's valid
  if (!isRequired && (value === null || value === undefined || value === '')) {
    return { isValid: true };
  }

  // Apply specific DFSA validators
  switch (fieldType.toLowerCase()) {
    case 'application-ref':
    case 'applicationref':
      return validateApplicationRef(value);
    case 'firm-name':
    case 'firmname':
    case 'company-name':
    case 'companyname':
      return validateFirmName(value);
    case 'trading-name':
    case 'tradingname':
      return validateTradingName(value);
    case 'registration-number':
    case 'registrationnumber':
      return validateRegistrationNumber(value);
    case 'percentage':
      return validatePercentage(value);
    case 'it-complexity':
    case 'itcomplexity':
      return validateITComplexity(value);
    case 'it-reliance':
    case 'itreliance':
      return validateITReliance(value);
    case 'business-plan-summary':
    case 'businessplansummary':
      return validateBusinessPlanSummary(value);
    case 'date-of-birth':
    case 'dateofbirth':
    case 'dob':
      return validateDateOfBirth(value);
    case 'registration-date':
    case 'registrationdate':
      return validateRegistrationDate(value);
    case 'financial-year-end':
    case 'financialyearend':
      return validateFinancialYearEnd(value);
    case 'required-boolean':
    case 'requiredboolean':
    case 'declaration':
    case 'confirmation':
      return validateRequiredBoolean(value, label);
    case 'required-array':
    case 'requiredarray':
    case 'array':
      return validateRequiredArray(value, label, options?.minItems);
    case 'country-code':
    case 'countrycode':
    case 'country':
      return validateCountryCode(value);
    case 'email':
      return validateEmail(value);
    case 'phone':
    case 'telephone':
      return validatePhone(value);
    case 'full-name':
    case 'fullname':
    case 'name':
      return validateFullName(value);
    case 'address':
      return validateAddress(value);
    case 'city':
      return validateCity(value);
    case 'state':
    case 'province':
      return validateState(value);
    case 'postal-code':
    case 'postalcode':
    case 'zip':
      return validateZipPostalCode(value);
    case 'text':
      return validateTextSingleLine(value);
    case 'textarea':
    case 'multiline':
      return validateTextMultiLineSmall(value);
    case 'date':
      return validateDateWithConstraints(value, options?.dateConstraints, label);
    default:
      // Fallback to basic validation
      if (typeof value === 'string') {
        return validateTextSingleLine(value);
      }
      return { isValid: true };
  }
}

/**
 * Error handling utility for validation errors
 * Formats validation errors consistently
 */
export interface FormValidationError {
  field: string;
  message: string;
  type: 'validation' | 'required' | 'format';
}

export function createValidationError(
  field: string,
  message: string,
  type: 'validation' | 'required' | 'format' = 'validation'
): FormValidationError {
  return { field, message, type };
}

/**
 * Batch validation utility
 * Validates multiple fields and returns all errors
 */
export function validateMultipleFields(
  fields: Array<{
    name: string;
    value: any;
    type: string;
    label?: string;
    options?: { required?: boolean; dateConstraints?: DateConstraints; minItems?: number };
  }>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const result = validateDFSAField(field.type, field.value, field.label, field.options);
    if (!result.isValid && result.error) {
      errors[field.name] = result.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
