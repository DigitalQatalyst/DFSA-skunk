/**
 * DFSA Onboarding - Pathway E Validation Schema
 * Crypto Token Recognition Pathway
 *
 * Pathway: E
 * Activity Type: CRYPTO_TOKEN_RECOGNITION
 * Questions: 10 (fewest questions)
 * Estimated Time: 10 minutes
 *
 * Requirements:
 * - Basic information (minimal)
 * - Entity structure (simplified)
 * - NO shareholding table
 * - NO beneficial ownership table
 * - NO financial information
 * - NO regulatory compliance section
 * - NO key personnel required
 * - Basic document uploads
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
 * Pathway E: Crypto Token Recognition Complete Validation Schema
 */
export const pathwayESchema = yup.object({
  // ============================================================================
  // META INFORMATION
  // ============================================================================

  activityType: yup
    .string()
    .oneOf(['CRYPTO_TOKEN_RECOGNITION'], 'This schema is for Crypto Token Recognition applications only'),

  pathway: yup
    .string()
    .oneOf(['E'], 'Pathway must be E for Crypto Token Recognition'),

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
  // SECTION 1: BASIC INFORMATION (Minimal)
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

  // Business Address (required, no mailing address)
  businessAddress: addressSchema,

  // Simplified - assume same address
  sameAsBusinessAddress: yup
    .boolean()
    .default(true),

  // ============================================================================
  // SECTION 2: ENTITY STRUCTURE (Simplified)
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

  // NO parent company questions for Pathway E
  hasParentCompany: yup
    .boolean()
    .default(false),

  // Group structure diagram (optional for Pathway E)
  groupStructureDiagram: documentUrlValidator('Group structure diagram', false),

  // ============================================================================
  // SECTION 3: DOCUMENT UPLOADS (Pathway E - Minimal Requirements)
  // ============================================================================

  documents: yup.object({
    // Required for ALL pathways
    certificateOfIncorporation: documentUrlValidator('Certificate of Incorporation', true),
    articlesOfAssociation: documentUrlValidator('Articles of Association', true),
    businessPlan: documentUrlValidator('Business Plan', true),

    // NO additional pathway-specific documents required

    // Optional supporting documents
    supportingDoc1: documentUrlValidator('Supporting document 1', false),
    supportingDoc2: documentUrlValidator('Supporting document 2', false),
    supportingDoc3: documentUrlValidator('Supporting document 3', false),
    supportingDoc4: documentUrlValidator('Supporting document 4', false),
    supportingDoc5: documentUrlValidator('Supporting document 5', false),
    supportingDoc6: documentUrlValidator('Supporting document 6', false),
  }),

  // ============================================================================
  // SECTION 4: DECLARATIONS (Required for all pathways)
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
 * Type inference from Pathway E schema
 */
export type PathwayEFormValues = yup.InferType<typeof pathwayESchema>
