/**
 * DFSA Onboarding - Validation Schema Index
 * Central export point for all validation schemas
 *
 * This file provides:
 * - Dynamic schema selection based on activity type
 * - Type-safe schema exports
 * - Validation helpers
 */

import { DFSAActivityType } from '../../../../../types/dfsa'
import { pathwayASchema, type PathwayAFormValues } from './pathwayA.schema'
import { pathwayBSchema, type PathwayBFormValues } from './pathwayB.schema'
import { pathwayCSchema, type PathwayCFormValues } from './pathwayC.schema'
import { pathwayDSchema, type PathwayDFormValues } from './pathwayD.schema'
import { pathwayESchema, type PathwayEFormValues } from './pathwayE.schema'

// Export all individual schemas
export {
  pathwayASchema,
  pathwayBSchema,
  pathwayCSchema,
  pathwayDSchema,
  pathwayESchema,
}

// Export all form value types
export type {
  PathwayAFormValues,
  PathwayBFormValues,
  PathwayCFormValues,
  PathwayDFormValues,
  PathwayEFormValues,
}

// Export common validators
export * from './common.schema'

/**
 * Schema map for dynamic selection
 * Keyed by DFSAActivityType
 */
const schemaMap = {
  FINANCIAL_SERVICES: pathwayASchema,
  DNFBP: pathwayBSchema,
  CRYPTO_TOKEN: pathwayCSchema,
  REGISTERED_AUDITOR: pathwayDSchema,
  CRYPTO_TOKEN_RECOGNITION: pathwayESchema,
} as const

/**
 * Get the appropriate validation schema based on activity type
 *
 * @param activityType - The DFSA activity type
 * @returns The corresponding Yup validation schema
 *
 * @example
 * ```typescript
 * const schema = getDynamicSchema('FINANCIAL_SERVICES')
 * const form = useForm({
 *   resolver: yupResolver(schema)
 * })
 * ```
 */
export const getDynamicSchema = (activityType: DFSAActivityType) => {
  return schemaMap[activityType]
}

/**
 * Validate form data against the appropriate pathway schema
 *
 * @param activityType - The DFSA activity type
 * @param formData - The form data to validate
 * @returns Validation result with errors if any
 *
 * @example
 * ```typescript
 * const result = await validateFormData('FINANCIAL_SERVICES', formData)
 * if (result.isValid) {
 *   // Proceed with submission
 * } else {
 *   console.error('Validation errors:', result.errors)
 * }
 * ```
 */
export const validateFormData = async (
  activityType: DFSAActivityType,
  formData: any
): Promise<{ isValid: boolean; errors?: any[] }> => {
  try {
    const schema = getDynamicSchema(activityType)
    await schema.validate(formData, { abortEarly: false })
    return { isValid: true }
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return {
        isValid: false,
        errors: error.inner || [error],
      }
    }
    throw error
  }
}

/**
 * Validate a specific field against its pathway schema
 *
 * @param activityType - The DFSA activity type
 * @param fieldPath - The field path (e.g., 'legalEntityName' or 'businessAddress.city')
 * @param value - The field value to validate
 * @param context - The full form context for conditional validation
 * @returns Error message if validation fails, undefined if valid
 *
 * @example
 * ```typescript
 * const error = await validateField(
 *   'FINANCIAL_SERVICES',
 *   'legalEntityName',
 *   'Test Company',
 *   formData
 * )
 * if (error) {
 *   console.error('Field error:', error)
 * }
 * ```
 */
export const validateField = async (
  activityType: DFSAActivityType,
  fieldPath: string,
  value: any,
  context: any
): Promise<string | undefined> => {
  try {
    const schema = getDynamicSchema(activityType)
    await schema.validateAt(fieldPath, { ...context, [fieldPath]: value })
    return undefined
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return error.message
    }
    throw error
  }
}

/**
 * Get all validation errors for a form
 * Useful for displaying all errors at once
 *
 * @param activityType - The DFSA activity type
 * @param formData - The form data to validate
 * @returns Object mapping field paths to error messages
 *
 * @example
 * ```typescript
 * const errors = await getValidationErrors('FINANCIAL_SERVICES', formData)
 * // errors = { legalEntityName: 'Company name is required', ... }
 * ```
 */
export const getValidationErrors = async (
  activityType: DFSAActivityType,
  formData: any
): Promise<Record<string, string>> => {
  try {
    const schema = getDynamicSchema(activityType)
    await schema.validate(formData, { abortEarly: false })
    return {}
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors: Record<string, string> = {}
      error.inner.forEach((err: any) => {
        if (err.path) {
          errors[err.path] = err.message
        }
      })
      return errors
    }
    throw error
  }
}

/**
 * Check if a specific pathway requires certain features
 * Useful for conditional rendering
 *
 * @param activityType - The DFSA activity type
 * @returns Object with boolean flags for each feature
 *
 * @example
 * ```typescript
 * const features = getPathwayFeatures('FINANCIAL_SERVICES')
 * if (features.requiresMLRO) {
 *   // Show MLRO fields
 * }
 * ```
 */
export const getPathwayFeatures = (activityType: DFSAActivityType) => {
  const features = {
    FINANCIAL_SERVICES: {
      requiresShareholderTable: true,
      requiresBeneficialOwnerTable: true,
      requiresFinancialInfo: true,
      requiresMLRO: true,
      requiresComplianceOfficer: true,
      requiresKeyPersonnel: true,
    },
    DNFBP: {
      requiresShareholderTable: false,
      requiresBeneficialOwnerTable: false,
      requiresFinancialInfo: false,
      requiresMLRO: false,
      requiresComplianceOfficer: false,
      requiresKeyPersonnel: true,
    },
    CRYPTO_TOKEN: {
      requiresShareholderTable: true,
      requiresBeneficialOwnerTable: true,
      requiresFinancialInfo: true,
      requiresMLRO: false,
      requiresComplianceOfficer: true,
      requiresKeyPersonnel: true,
    },
    REGISTERED_AUDITOR: {
      requiresShareholderTable: false,
      requiresBeneficialOwnerTable: false,
      requiresFinancialInfo: false,
      requiresMLRO: false,
      requiresComplianceOfficer: false,
      requiresKeyPersonnel: true,
    },
    CRYPTO_TOKEN_RECOGNITION: {
      requiresShareholderTable: false,
      requiresBeneficialOwnerTable: false,
      requiresFinancialInfo: false,
      requiresMLRO: false,
      requiresComplianceOfficer: false,
      requiresKeyPersonnel: false,
    },
  }

  return features[activityType]
}

/**
 * Get the required document fields for a specific pathway
 *
 * @param activityType - The DFSA activity type
 * @returns Array of required document field names
 *
 * @example
 * ```typescript
 * const requiredDocs = getRequiredDocuments('FINANCIAL_SERVICES')
 * // ['certificateOfIncorporation', 'articlesOfAssociation', 'businessPlan', 'complianceManual', 'amlPolicy', 'shareholderRegistry']
 * ```
 */
export const getRequiredDocuments = (activityType: DFSAActivityType): string[] => {
  const baseDocuments = [
    'certificateOfIncorporation',
    'articlesOfAssociation',
    'businessPlan',
  ]

  const pathwaySpecificDocuments = {
    FINANCIAL_SERVICES: ['complianceManual', 'amlPolicy', 'shareholderRegistry'],
    DNFBP: [],
    CRYPTO_TOKEN: ['whitePaper', 'tokenEconomicsModel', 'cryptoShareholderRegistry'],
    REGISTERED_AUDITOR: [],
    CRYPTO_TOKEN_RECOGNITION: [],
  }

  return [...baseDocuments, ...pathwaySpecificDocuments[activityType]]
}

/**
 * Get the estimated completion time for a pathway
 *
 * @param activityType - The DFSA activity type
 * @returns Estimated completion time in minutes
 */
export const getEstimatedTime = (activityType: DFSAActivityType): number => {
  const times = {
    FINANCIAL_SERVICES: 30,
    DNFBP: 20,
    CRYPTO_TOKEN: 45,
    REGISTERED_AUDITOR: 15,
    CRYPTO_TOKEN_RECOGNITION: 10,
  }

  return times[activityType]
}

/**
 * Get the question count for a pathway
 *
 * @param activityType - The DFSA activity type
 * @returns Number of questions
 */
export const getQuestionCount = (activityType: DFSAActivityType): number => {
  const counts = {
    FINANCIAL_SERVICES: 28,
    DNFBP: 15,
    CRYPTO_TOKEN: 40,
    REGISTERED_AUDITOR: 12,
    CRYPTO_TOKEN_RECOGNITION: 10,
  }

  return counts[activityType]
}
