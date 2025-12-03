/**
 * Step Field Mapping Utility
 * Maps each step to its relevant form fields for step-specific validation
 *
 * This enables React Hook Form to validate only the fields relevant to the current step,
 * preventing validation errors from unvisited steps from blocking progression.
 */

/**
 * Mapping of step IDs to their form field names
 * Empty arrays indicate display-only steps with no validation
 */
export const stepFieldMapping: Record<string, string[]> = {
  // Step 1: Welcome (Display-only - no form inputs)
  welcome: [],

  // Step 2: Basic Information
  basic: [
    'legalEntityName',
    'tradingName',
    'incorporationJurisdiction',
    'incorporationDate',
    'registrationNumber',
    'taxIdentificationNumber',
    'businessAddress',
    'businessAddress.street',
    'businessAddress.city',
    'businessAddress.state',
    'businessAddress.postalCode',
    'businessAddress.country',
    'sameAsBusinessAddress',
    'mailingAddress',
    'mailingAddress.street',
    'mailingAddress.city',
    'mailingAddress.state',
    'mailingAddress.postalCode',
    'mailingAddress.country',
  ],

  // Step 3: Entity Structure
  entity: [
    'entityType',
    'entityStructure',
    'parentCompany',
    'parentCompanyName',
    'parentCompanyJurisdiction',
    'hasSubsidiaries',
    'subsidiaries',
  ],

  // Step 4: Shareholding
  shareholding: [
    'shareholders',
  ],

  // Step 5: Beneficial Ownership
  beneficial: [
    'beneficialOwners',
  ],

  // Step 6: Financial Information
  financial: [
    'estimatedAnnualRevenue',
    'sourceOfCapital',
    'fundingSources',
    'minimumCapitalRequirement',
    'projectedRevenue',
    'operatingExpenses',
  ],

  // Step 7: Regulatory Compliance
  regulatory: [
    'hasMLRO',
    'mlroDetails',
    'mlroDetails.name',
    'mlroDetails.email',
    'mlroDetails.phone',
    'mlroDetails.qualifications',
    'hasComplianceOfficer',
    'complianceOfficerDetails',
    'complianceOfficerDetails.name',
    'complianceOfficerDetails.email',
    'complianceOfficerDetails.phone',
    'complianceOfficerDetails.qualifications',
    'hasAntiMoneyLaunderingPolicy',
    'amlPolicyDetails',
    'hasSanctionsPolicy',
    'sanctionsPolicyDetails',
    'hasRiskManagementFramework',
    'riskManagementDetails',
  ],

  // Step 8: Document Uploads
  documents: [
    'certificateOfIncorporation',
    'articlesOfAssociation',
    'businessPlan',
    'complianceManual',
    'amlPolicy',
    'shareholderRegistry',
    'auditorReport',
    'whitePaper',
    'tokenEconomicsModel',
    'cryptoShareholderRegistry',
  ],

  // Step 9: Review & Submit (Display-only - no new fields)
  review: [],
}

/**
 * Get the form fields that should be validated for a specific step
 *
 * @param stepId - The ID of the current step
 * @returns Array of field names to validate, empty array if step has no fields
 *
 * @example
 * ```typescript
 * const fields = getStepFields('basic')
 * // Returns: ['legalEntityName', 'incorporationJurisdiction', ...]
 *
 * const welcomeFields = getStepFields('welcome')
 * // Returns: [] (no validation needed)
 * ```
 */
export const getStepFields = (stepId: string): string[] => {
  return stepFieldMapping[stepId] || []
}

/**
 * Check if a step requires validation
 *
 * @param stepId - The ID of the step to check
 * @returns True if the step has fields to validate, false otherwise
 *
 * @example
 * ```typescript
 * const needsValidation = stepRequiresValidation('welcome')
 * // Returns: false
 *
 * const needsValidation = stepRequiresValidation('basic')
 * // Returns: true
 * ```
 */
export const stepRequiresValidation = (stepId: string): boolean => {
  const fields = getStepFields(stepId)
  return fields.length > 0
}

/**
 * Get all steps that require validation
 *
 * @returns Array of step IDs that have validation requirements
 */
export const getValidationSteps = (): string[] => {
  return Object.keys(stepFieldMapping).filter(stepRequiresValidation)
}
