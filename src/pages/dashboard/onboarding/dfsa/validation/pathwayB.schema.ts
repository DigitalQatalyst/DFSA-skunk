/**
 * DFSA Onboarding - Pathway B Validation Schema
 * DNFBP (Designated Non-Financial Businesses and Professions) Pathway
 *
 * Pathway: B
 * Activity Type: DNFBP
 * Questions: 15
 * Estimated Time: 20 minutes
 *
 * Requirements:
 * - Basic information (simplified)
 * - Entity structure
 * - NO shareholding table
 * - NO beneficial ownership table
 * - NO financial information
 * - Optional regulatory compliance (no MLRO)
 * - Basic document uploads (fewer requirements than Pathway A)
 */

import * as yup from 'yup'
import {
  addressSchema,
  emailValidator,
  phoneValidator,
  pastDateValidator,
  documentUrlValidator,
  registrationNumberValidator,
  companyNameValidator,
} from './common.schema'

/**
 * Pathway B: DNFBP Complete Validation Schema
 */
export const pathwayBSchema = yup.object({
  // ============================================================================
  // META INFORMATION
  // ============================================================================

  activityType: yup
    .string()
    .oneOf(['DNFBP'], 'This schema is for DNFBP applications only'),

  pathway: yup
    .string()
    .oneOf(['B'], 'Pathway must be B for DNFBP'),

  // ============================================================================
  // PRE-POPULATED FIELDS
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
  // SECTION 1: BASIC INFORMATION
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
  // SECTION 2: ENTITY STRUCTURE
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
  // SECTION 3: KEY PERSONNEL (REQUIRED for Pathway B)
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
    .required('Key personnel information is required'),

  // ============================================================================
  // SECTION 4: REGULATORY & COMPLIANCE (OPTIONAL for Pathway B)
  // Simplified - no MLRO, no Compliance Officer requirement
  // ============================================================================

  currentlyRegulated: yup
    .boolean()
    .nullable()
    .typeError('Please indicate if currently regulated'),

  // If currently regulated, regulator details are optional but validated if provided
  regulatorName: yup
    .string()
    .min(2, 'Regulator name must be at least 2 characters')
    .max(200, 'Regulator name must not exceed 200 characters')
    .trim()
    .nullable(),

  regulatorJurisdiction: yup
    .string()
    .min(2, 'Please provide a valid jurisdiction')
    .trim()
    .nullable(),

  licenseNumber: yup
    .string()
    .min(3, 'License number must be at least 3 characters')
    .max(50, 'License number must not exceed 50 characters')
    .trim()
    .nullable(),

  // ============================================================================
  // SECTION 5: DOCUMENT UPLOADS (Pathway B - Basic Requirements)
  // Only the essential documents required
  // ============================================================================

  documents: yup.object({
    // Required for ALL pathways
    certificateOfIncorporation: documentUrlValidator('Certificate of Incorporation', true),
    articlesOfAssociation: documentUrlValidator('Articles of Association', true),
    businessPlan: documentUrlValidator('Business Plan', true),

    // NO additional Pathway-specific documents required for DNFBP

    // Optional supporting documents
    supportingDoc1: documentUrlValidator('Supporting document 1', false),
    supportingDoc2: documentUrlValidator('Supporting document 2', false),
    supportingDoc3: documentUrlValidator('Supporting document 3', false),
    supportingDoc4: documentUrlValidator('Supporting document 4', false),
    supportingDoc5: documentUrlValidator('Supporting document 5', false),
    supportingDoc6: documentUrlValidator('Supporting document 6', false),
  }),

  // ============================================================================
  // SECTION 6: DECLARATIONS (Required for all pathways)
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
 * Type inference from Pathway B schema
 */
export type PathwayBFormValues = yup.InferType<typeof pathwayBSchema>
