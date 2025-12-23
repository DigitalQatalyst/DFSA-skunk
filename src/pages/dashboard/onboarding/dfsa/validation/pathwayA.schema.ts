/**
 * DFSA Onboarding - Pathway A Validation Schema
 * Financial Services Pathway
 *
 * Pathway: A
 * Activity Type: FINANCIAL_SERVICES
 * Questions: 28
 * Estimated Time: 30 minutes
 *
 * Requirements:
 * - All basic information
 * - Shareholding table (must total 100%)
 * - Beneficial ownership table (must total 100%)
 * - Financial information (minimum capital: $50,000)
 * - Regulatory compliance with MLRO
 * - Compliance Manual, AML Policy, Shareholder Registry documents
 */

import * as yup from 'yup'
import {
  addressSchema,
  shareholderSchema,
  beneficialOwnerSchema,
  fundingSourceSchema,
  validateShareholderTotal,
  validateBeneficialOwnerTotal,
  emailValidator,
  phoneValidator,
  pastDateValidator,
  currencyValidator,
  documentUrlValidator,
  registrationNumberValidator,
  companyNameValidator,
  textAreaValidator,
} from './common.schema'

/**
 * Pathway A: Financial Services Complete Validation Schema
 */
export const pathwayASchema = yup.object({
  // ============================================================================
  // META INFORMATION
  // ============================================================================

  activityType: yup
    .string()
    .oneOf(['FINANCIAL_SERVICES'], 'This schema is for Financial Services applications only'),

  pathway: yup
    .string()
    .oneOf(['A'], 'Pathway must be A for Financial Services'),

  // ============================================================================
  // PRE-POPULATED FIELDS (validated but not editable)
  // ============================================================================

  suggestedCompanyName: companyNameValidator,
  contactName: yup
    .string()
    .required('Contact name is required')
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name must not exceed 100 characters')
    .trim(),
  contactEmail: emailValidator,
  contactPhone: phoneValidator,

  // ============================================================================
  // SECTION 1: BASIC INFORMATION (Required for all pathways)
  // ============================================================================

  legalEntityName: companyNameValidator,

  tradingName: yup
    .string()
    .min(2, 'Trading name must be at least 2 characters')
    .max(200, 'Trading name must not exceed 200 characters')
    .trim()
    .nullable(),

  incorporationJurisdiction: yup
    .string()
    .required('Incorporation jurisdiction is required')
    .min(2, 'Please select a valid jurisdiction')
    .trim(),

  incorporationDate: pastDateValidator,

  registrationNumber: registrationNumberValidator,

  taxIdentificationNumber: yup
    .string()
    .min(3, 'Tax ID must be at least 3 characters')
    .max(50, 'Tax ID must not exceed 50 characters')
    .trim()
    .nullable(),

  // Business Address (required)
  businessAddress: addressSchema,

  // Mailing Address (conditional)
  sameAsBusinessAddress: yup
    .boolean()
    .required('Please indicate if mailing address is same as business address'),

  mailingAddress: yup.mixed().when('sameAsBusinessAddress', {
    is: false,
    then: () => addressSchema,
    otherwise: () => yup.mixed().notRequired().nullable(),
  }),

  // ============================================================================
  // SECTION 2: ENTITY STRUCTURE (Required for all pathways)
  // ============================================================================

  entityType: yup
    .string()
    .required('Entity type is required')
    .oneOf(['DIFC_INCORPORATION', 'OTHER_JURISDICTION', 'OTHER'], 'Please select a valid entity type'),

  entityTypeOther: yup.string().when('entityType', {
    is: 'OTHER',
    then: (schema) =>
      schema
        .required('Please specify the entity type')
        .min(2, 'Entity type specification must be at least 2 characters')
        .max(200, 'Entity type specification must not exceed 200 characters')
        .trim(),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  // Parent company (optional)
  hasParentCompany: yup
    .boolean()
    .required('Please indicate if there is a parent company'),

  parentCompanyName: yup.string().when('hasParentCompany', {
    is: true,
    then: (schema) =>
      schema
        .required('Parent company name is required')
        .min(2, 'Parent company name must be at least 2 characters')
        .max(200, 'Parent company name must not exceed 200 characters')
        .trim(),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  parentCompanyJurisdiction: yup.string().when('hasParentCompany', {
    is: true,
    then: (schema) =>
      schema
        .required('Parent company jurisdiction is required')
        .min(2, 'Please provide a valid jurisdiction')
        .trim(),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  // Group structure diagram (required)
  groupStructureDiagram: documentUrlValidator('Group structure diagram', true),

  // ============================================================================
  // SECTION 3: SHAREHOLDING (REQUIRED for Pathway A)
  // Must have at least 1 shareholder, max 15, total must equal 100%
  // ============================================================================

  shareholders: yup
    .array()
    .of(shareholderSchema)
    .min(1, 'At least one shareholder is required for Financial Services applications')
    .max(15, 'Maximum 15 shareholders allowed')
    .test(
      'total-100',
      'Total shareholding must equal 100%. Please adjust ownership percentages.',
      (shareholders) => validateShareholderTotal(shareholders)
    )
    .required('Shareholding information is required for Financial Services'),

  totalShareholding: yup
    .number()
    .test(
      'equals-100',
      'Total shareholding must equal exactly 100%',
      (value) => Math.abs((value || 0) - 100) < 0.01
    ),

  // ============================================================================
  // SECTION 4: BENEFICIAL OWNERSHIP (REQUIRED for Pathway A)
  // Must have at least 1 beneficial owner, max 15, total must equal 100%
  // ============================================================================

  beneficialOwners: yup
    .array()
    .of(beneficialOwnerSchema)
    .min(1, 'At least one beneficial owner is required for Financial Services applications')
    .max(15, 'Maximum 15 beneficial owners allowed')
    .test(
      'total-100',
      'Total beneficial ownership must equal 100%. Please adjust control percentages.',
      (beneficialOwners) => validateBeneficialOwnerTotal(beneficialOwners)
    )
    .required('Beneficial ownership information is required for Financial Services'),

  totalBeneficialOwnership: yup
    .number()
    .test(
      'equals-100',
      'Total beneficial ownership must equal exactly 100%',
      (value) => Math.abs((value || 0) - 100) < 0.01
    ),

  // ============================================================================
  // SECTION 5: FINANCIAL INFORMATION (REQUIRED for Pathway A)
  // Minimum capital requirement: $50,000 for Financial Services
  // ============================================================================

  proposedCapitalUSD: currencyValidator('Proposed capital', 50000),

  fundingSources: yup
    .array()
    .of(fundingSourceSchema)
    .min(1, 'At least one funding source is required')
    .required('Funding sources are required for Financial Services'),

  // Revenue projections (optional)
  projectedRevenueYear1: yup
    .number()
    .min(0, 'Projected revenue cannot be negative')
    .test(
      'max-decimals',
      'Projected revenue can have at most 2 decimal places',
      (value) => {
        if (value === undefined || value === null) return true
        return /^\d+(\.\d{1,2})?$/.test(value.toString())
      }
    )
    .nullable(),

  projectedRevenueYear2: yup
    .number()
    .min(0, 'Projected revenue cannot be negative')
    .test(
      'max-decimals',
      'Projected revenue can have at most 2 decimal places',
      (value) => {
        if (value === undefined || value === null) return true
        return /^\d+(\.\d{1,2})?$/.test(value.toString())
      }
    )
    .nullable(),

  projectedRevenueYear3: yup
    .number()
    .min(0, 'Projected revenue cannot be negative')
    .test(
      'max-decimals',
      'Projected revenue can have at most 2 decimal places',
      (value) => {
        if (value === undefined || value === null) return true
        return /^\d+(\.\d{1,2})?$/.test(value.toString())
      }
    )
    .nullable(),

  financialProjections: documentUrlValidator('Financial projections document', false),

  // ============================================================================
  // SECTION 6: REGULATORY & COMPLIANCE (REQUIRED for Pathway A)
  // ============================================================================

  currentlyRegulated: yup
    .boolean()
    .required('Please indicate if currently regulated')
    .typeError('Please indicate if currently regulated'),

  // If currently regulated, require regulator details
  regulatorName: yup.string().when('currentlyRegulated', {
    is: true,
    then: (schema) =>
      schema
        .required('Regulator name is required')
        .min(2, 'Regulator name must be at least 2 characters')
        .max(200, 'Regulator name must not exceed 200 characters')
        .trim(),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  regulatorJurisdiction: yup.string().when('currentlyRegulated', {
    is: true,
    then: (schema) =>
      schema
        .required('Regulator jurisdiction is required')
        .min(2, 'Please provide a valid jurisdiction')
        .trim(),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  licenseNumber: yup.string().when('currentlyRegulated', {
    is: true,
    then: (schema) =>
      schema
        .required('License number is required')
        .min(3, 'License number must be at least 3 characters')
        .max(50, 'License number must not exceed 50 characters')
        .trim(),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  licenseDetails: yup.string().when('currentlyRegulated', {
    is: true,
    then: (schema) =>
      textAreaValidator('License details', 50, 1000, true),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  // Compliance Officer (REQUIRED for Pathway A)
  complianceOfficerName: yup
    .string()
    .required('Compliance Officer name is required for Financial Services applications')
    .min(2, 'Compliance Officer name must be at least 2 characters')
    .max(100, 'Compliance Officer name must not exceed 100 characters')
    .trim(),

  complianceOfficerEmail: emailValidator
    .required('Compliance Officer email is required for Financial Services applications'),

  // Money Laundering Reporting Officer (REQUIRED for Pathway A ONLY)
  mlroName: yup
    .string()
    .required('MLRO name is required for Financial Services applications')
    .min(2, 'MLRO name must be at least 2 characters')
    .max(100, 'MLRO name must not exceed 100 characters')
    .trim(),

  mlroEmail: emailValidator
    .required('MLRO email is required for Financial Services applications'),

  // ============================================================================
  // SECTION 7: KEY PERSONNEL (REQUIRED for Pathway A)
  // ============================================================================

  keyIndividuals: yup
    .array()
    .of(
      yup
        .string()
        .required('Key individual name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim()
    )
    .min(1, 'At least one key individual is required')
    .required('Key personnel information is required for Financial Services'),

  // ============================================================================
  // SECTION 8: DOCUMENT UPLOADS (Pathway A specific requirements)
  // ============================================================================

  documents: yup.object({
    // Required for ALL pathways
    certificateOfIncorporation: documentUrlValidator('Certificate of Incorporation', true),
    articlesOfAssociation: documentUrlValidator('Articles of Association', true),
    businessPlan: documentUrlValidator('Business Plan', true),

    // REQUIRED for Pathway A (Financial Services) ONLY
    complianceManual: documentUrlValidator('Compliance Manual', true)
      .required('Compliance Manual is required for Financial Services applications'),
    amlPolicy: documentUrlValidator('AML/CFT Policy', true)
      .required('AML/CFT Policy is required for Financial Services applications'),
    shareholderRegistry: documentUrlValidator('Shareholder Registry', true)
      .required('Shareholder Registry is required for Financial Services applications'),

    // Optional supporting documents
    supportingDoc1: documentUrlValidator('Supporting document 1', false),
    supportingDoc2: documentUrlValidator('Supporting document 2', false),
    supportingDoc3: documentUrlValidator('Supporting document 3', false),
    supportingDoc4: documentUrlValidator('Supporting document 4', false),
    supportingDoc5: documentUrlValidator('Supporting document 5', false),
    supportingDoc6: documentUrlValidator('Supporting document 6', false),
  }),

  // ============================================================================
  // SECTION 9: DECLARATIONS (Required for all pathways)
  // ============================================================================

  declarations: yup.object({
    fitAndProperConfirmation: yup
      .boolean()
      .oneOf([true], 'You must confirm that all parties meet fit and proper requirements')
      .required('Fit and proper confirmation is required'),

    accuracyConfirmation: yup
      .boolean()
      .oneOf([true], 'You must confirm that all information provided is accurate and complete')
      .required('Accuracy confirmation is required'),

    authorityConfirmation: yup
      .boolean()
      .oneOf([true], 'You must confirm that you have authority to submit this application')
      .required('Authority confirmation is required'),

    dataConsentProvided: yup
      .boolean()
      .oneOf([true], 'Consent to data sharing with DFSA is required')
      .required('Data consent is required'),
  }),
})

/**
 * Type inference from Pathway A schema
 * Provides TypeScript type safety
 */
export type PathwayAFormValues = yup.InferType<typeof pathwayASchema>
