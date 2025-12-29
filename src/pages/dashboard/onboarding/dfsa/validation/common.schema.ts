/**
 * DFSA Onboarding - Common Validation Schemas
 * Shared validators used across all pathway schemas
 *
 * These schemas are building blocks for the pathway-specific validation
 */

import * as yup from 'yup'

// ============================================================================
// ADDRESS SCHEMA
// ============================================================================

/**
 * Address validation schema
 * Used for both business and mailing addresses
 */
export const addressSchema = yup.object({
  line1: yup
    .string()
    .required('Address line 1 is required')
    .min(2, 'Address line 1 must be at least 2 characters')
    .max(200, 'Address line 1 must not exceed 200 characters')
    .trim(),

  line2: yup
    .string()
    .max(200, 'Address line 2 must not exceed 200 characters')
    .trim()
    .nullable(),

  city: yup
    .string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters')
    .trim(),

  state: yup
    .string()
    .max(100, 'State/province must not exceed 100 characters')
    .trim()
    .nullable(),

  postalCode: yup
    .string()
    .required('Postal code is required')
    .min(2, 'Postal code must be at least 2 characters')
    .max(20, 'Postal code must not exceed 20 characters')
    .trim(),

  country: yup
    .string()
    .required('Country is required')
    .min(2, 'Country is required')
    .trim(),
})

// ============================================================================
// SHAREHOLDER SCHEMA
// ============================================================================

/**
 * Shareholder validation schema
 * Used in shareholding table (Pathways A, C)
 * Total percentage must equal 100% (validated at array level)
 */
export const shareholderSchema = yup.object({
  id: yup
    .string()
    .required('Shareholder ID is required'),

  name: yup
    .string()
    .required('Shareholder name is required')
    .min(2, 'Shareholder name must be at least 2 characters')
    .max(200, 'Shareholder name must not exceed 200 characters')
    .trim(),

  nationality: yup
    .string()
    .required('Nationality is required')
    .trim(),

  idType: yup
    .string()
    .required('ID type is required')
    .oneOf(['passport', 'national_id', 'other'], 'Please select a valid ID type'),

  idNumber: yup
    .string()
    .required('ID number is required')
    .min(3, 'ID number must be at least 3 characters')
    .max(50, 'ID number must not exceed 50 characters')
    .trim(),

  percentageOwnership: yup
    .number()
    .required('Ownership percentage is required')
    .min(0.01, 'Ownership percentage must be greater than 0%')
    .max(100, 'Ownership percentage cannot exceed 100%')
    .test(
      'max-decimals',
      'Ownership percentage can have at most 2 decimal places',
      (value) => {
        if (value === undefined || value === null) return true
        return /^\d+(\.\d{1,2})?$/.test(value.toString())
      }
    ),

  dateAcquired: yup
    .date()
    .required('Date acquired is required')
    .max(new Date(), 'Date acquired cannot be in the future')
    .typeError('Please enter a valid date'),
})

// ============================================================================
// BENEFICIAL OWNER SCHEMA
// ============================================================================

/**
 * Beneficial Owner validation schema
 * Used in beneficial ownership table (Pathways A, C)
 * Total percentage must equal 100% (validated at array level)
 */
export const beneficialOwnerSchema = yup.object({
  id: yup
    .string()
    .required('Beneficial owner ID is required'),

  name: yup
    .string()
    .required('Beneficial owner name is required')
    .min(2, 'Beneficial owner name must be at least 2 characters')
    .max(200, 'Beneficial owner name must not exceed 200 characters')
    .trim(),

  nationality: yup
    .string()
    .required('Nationality is required')
    .trim(),

  dateOfBirth: yup
    .date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test(
      'min-age',
      'Beneficial owner must be at least 18 years old',
      (value) => {
        if (!value) return false
        const eighteenYearsAgo = new Date()
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
        return value <= eighteenYearsAgo
      }
    )
    .typeError('Please enter a valid date'),

  percentageControl: yup
    .number()
    .required('Control percentage is required')
    .min(0.01, 'Control percentage must be greater than 0%')
    .max(100, 'Control percentage cannot exceed 100%')
    .test(
      'max-decimals',
      'Control percentage can have at most 2 decimal places',
      (value) => {
        if (value === undefined || value === null) return true
        return /^\d+(\.\d{1,2})?$/.test(value.toString())
      }
    ),

  controlType: yup
    .string()
    .required('Control type is required')
    .oneOf(['direct', 'indirect', 'voting_rights'], 'Please select a valid control type'),
})

// ============================================================================
// FUNDING SOURCE SCHEMA
// ============================================================================

/**
 * Funding Source validation schema
 * Used in financial information section (Pathways A, C)
 */
export const fundingSourceSchema = yup.object({
  id: yup
    .string()
    .required('Funding source ID is required'),

  sourceType: yup
    .string()
    .required('Funding source type is required')
    .oneOf(
      ['equity', 'debt', 'retained_earnings', 'other'],
      'Please select a valid funding source type'
    ),

  description: yup
    .string()
    .required('Funding source description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),

  amountUSD: yup
    .number()
    .required('Funding amount is required')
    .min(1, 'Funding amount must be greater than 0')
    .test(
      'max-decimals',
      'Amount can have at most 2 decimal places',
      (value) => {
        if (value === undefined || value === null) return true
        return /^\d+(\.\d{1,2})?$/.test(value.toString())
      }
    ),

  sourceDocument: yup
    .string()
    .url('Source document must be a valid URL')
    .nullable(),
})

// ============================================================================
// ARRAY VALIDATION HELPERS
// ============================================================================

/**
 * Validate that an array of shareholders totals 100%
 * Used in Pathway A and C schemas
 */
export const validateShareholderTotal = (shareholders: any[] | undefined): boolean => {
  if (!shareholders || shareholders.length === 0) return false

  const total = shareholders.reduce((sum, shareholder) => {
    return sum + (shareholder.percentageOwnership || 0)
  }, 0)

  // Allow 0.01% tolerance for rounding errors
  return Math.abs(total - 100) < 0.01
}

/**
 * Validate that an array of beneficial owners totals 100%
 * Used in Pathway A and C schemas
 */
export const validateBeneficialOwnerTotal = (beneficialOwners: any[] | undefined): boolean => {
  if (!beneficialOwners || beneficialOwners.length === 0) return false

  const total = beneficialOwners.reduce((sum, owner) => {
    return sum + (owner.percentageControl || 0)
  }, 0)

  // Allow 0.01% tolerance for rounding errors
  return Math.abs(total - 100) < 0.01
}

// ============================================================================
// COMMON FIELD VALIDATORS
// ============================================================================

/**
 * Email validation (standard email format)
 */
export const emailValidator = yup
  .string()
  .required('Email address is required')
  .max(254, 'Email address must not exceed 254 characters')
  .email('Please enter a valid email address')
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Please enter a valid email address'
  )
  .trim()

/**
 * Phone number validation (E.164 format)
 */
export const phoneValidator = yup
  .string()
  .required('Phone number is required')
  .matches(
    /^\+?[1-9]\d{1,14}$/,
    'Please enter a valid international phone number (E.164 format, e.g., +971501234567)'
  )
  .trim()

/**
 * Date validation (ISO date string, not in future)
 */
export const pastDateValidator = yup
  .date()
  .required('Date is required')
  .max(new Date(), 'Date cannot be in the future')
  .typeError('Please enter a valid date')

/**
 * Currency amount validation (USD, positive, 2 decimal places max)
 */
export const currencyValidator = (fieldName: string, minAmount: number = 0) =>
  yup
    .number()
    .required(`${fieldName} is required`)
    .min(minAmount, `${fieldName} must be at least $${minAmount.toLocaleString()}`)
    .test(
      'max-decimals',
      `${fieldName} can have at most 2 decimal places`,
      (value) => {
        if (value === undefined || value === null) return true
        return /^\d+(\.\d{1,2})?$/.test(value.toString())
      }
    )

/**
 * URL validation for document uploads
 */
export const documentUrlValidator = (fieldName: string, required: boolean = true) => {
  const baseValidator = yup.string().url(`${fieldName} must be a valid URL`)

  if (required) {
    return baseValidator.required(`${fieldName} is required`)
  }

  return baseValidator.nullable()
}

/**
 * Registration/license number validation
 */
export const registrationNumberValidator = yup
  .string()
  .required('Registration number is required')
  .min(3, 'Registration number must be at least 3 characters')
  .max(50, 'Registration number must not exceed 50 characters')
  .trim()

/**
 * Company name validation
 */
export const companyNameValidator = yup
  .string()
  .required('Company name is required')
  .min(2, 'Company name must be at least 2 characters')
  .max(200, 'Company name must not exceed 200 characters')
  .trim()

/**
 * Text area validation with min/max length
 */
export const textAreaValidator = (fieldName: string, minLength: number, maxLength: number, required: boolean = true) => {
  const baseValidator = yup
    .string()
    .min(minLength, `${fieldName} must be at least ${minLength} characters`)
    .max(maxLength, `${fieldName} must not exceed ${maxLength} characters`)
    .trim()

  if (required) {
    return baseValidator.required(`${fieldName} is required`)
  }

  return baseValidator.nullable()
}
