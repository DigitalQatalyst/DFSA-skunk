/**
 * DFSA Onboarding Form - Type Definitions
 * Comprehensive 49-question, multi-pathway onboarding system
 *
 * Version: 2.0
 * Pathways: A (Financial Services), B (DNFBP), C (Crypto Token), D (Auditor), E (Crypto Recognition)
 */

import { DFSAActivityType, DFSAEntityType } from '../../../../types/dfsa'
import { UseFormReturn } from 'react-hook-form'

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

/**
 * Address interface for business and mailing addresses
 */
export interface Address {
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country: string
}

/**
 * Shareholder information (Pathways A, C only)
 * Max 15 shareholders, total ownership must equal 100%
 */
export interface Shareholder {
  id: string // UUID for field array management
  name: string
  nationality: string
  idType: 'passport' | 'national_id' | 'other'
  idNumber: string
  percentageOwnership: number // 0-100, must sum to 100%
  dateAcquired: string // ISO date string
}

/**
 * Beneficial Owner information (Pathways A, C only)
 * Max 15 beneficial owners, total control must equal 100%
 */
export interface BeneficialOwner {
  id: string // UUID for field array management
  name: string
  nationality: string
  dateOfBirth: string // ISO date string
  percentageControl: number // 0-100, must sum to 100%
  controlType: 'direct' | 'indirect' | 'voting_rights'
}

/**
 * Funding Source information (Pathways A, C only)
 * Variable number of funding sources
 */
export interface FundingSource {
  id: string // UUID for field array management
  sourceType: 'equity' | 'debt' | 'retained_earnings' | 'other'
  description: string
  amountUSD: number
  sourceDocument?: string // Azure Blob URL
}

// ============================================================================
// MAIN FORM DATA INTERFACE
// ============================================================================

/**
 * Complete DFSA Onboarding Form Data
 * Supports 5 pathways with conditional fields
 * Total: 49 questions (max)
 */
export interface DFSAOnboardingFormData {
  // ============================================================================
  // META INFORMATION
  // ============================================================================

  formId: string // UUID generated on form init
  userId: string // Current user ID
  accountId?: string // Account/company ID if available
  pathway: 'A' | 'B' | 'C' | 'D' | 'E' // Computed from activityType
  lastSaved?: string // ISO datetime of last auto-save
  submittedAt?: string // ISO datetime of submission

  // ============================================================================
  // PRE-POPULATED FROM SIGN-UP (localStorage bridge)
  // ============================================================================

  // From DFSAEnquirySignupModal
  suggestedCompanyName: string // Pre-filled from sign-up SU-1
  contactName: string // Pre-filled from sign-up SU-2
  contactEmail: string // Pre-filled from sign-up SU-3
  contactPhone: string // Pre-filled from sign-up SU-4
  applicationTargetDate?: string // Pre-filled from sign-up SU-5
  activityType: DFSAActivityType // Determines pathway (SU-6)
  entityType: DFSAEntityType // Pre-filled from sign-up SU-7
  entityTypeOther?: string // Pre-filled from sign-up SU-7-Other
  currentlyRegulated?: boolean // Pre-filled from sign-up SU-8

  // ============================================================================
  // SECTION 1: BASIC INFORMATION (All Pathways)
  // OB-14 through OB-20 equivalent fields
  // ============================================================================

  legalEntityName: string
  tradingName?: string
  incorporationJurisdiction: string // Country dropdown
  incorporationDate: string // ISO date
  registrationNumber: string
  taxIdentificationNumber?: string

  // Business Address (required)
  businessAddress: Address

  // Mailing Address (conditional)
  sameAsBusinessAddress: boolean
  mailingAddress?: Address // Only if sameAsBusinessAddress = false

  // ============================================================================
  // SECTION 2: ENTITY STRUCTURE (All Pathways)
  // ============================================================================

  // Parent company information (optional)
  hasParentCompany: boolean
  parentCompanyName?: string
  parentCompanyJurisdiction?: string

  // Group structure diagram upload (required)
  groupStructureDiagram?: string // Azure Blob URL

  // ============================================================================
  // SECTION 3: SHAREHOLDING (Pathways A, C ONLY)
  // OB-17, OB-18 equivalent
  // ============================================================================

  shareholders: Shareholder[] // Max 15, must total 100%
  totalShareholding: number // Calculated field, must equal 100%

  // ============================================================================
  // SECTION 4: BENEFICIAL OWNERSHIP (Pathways A, C ONLY)
  // OB-20, OB-22 equivalent
  // ============================================================================

  beneficialOwners: BeneficialOwner[] // Max 15, must total 100%
  totalBeneficialOwnership: number // Calculated field, must equal 100%

  // ============================================================================
  // SECTION 5: FINANCIAL INFORMATION (Pathways A, C ONLY)
  // OB-41 equivalent
  // ============================================================================

  proposedCapitalUSD: number // Minimum varies by pathway
  fundingSources: FundingSource[] // At least 1 required

  // Revenue projections (optional)
  projectedRevenueYear1?: number
  projectedRevenueYear2?: number
  projectedRevenueYear3?: number

  // Financial projections document (optional)
  financialProjections?: string // Azure Blob URL

  // ============================================================================
  // SECTION 6: REGULATORY & COMPLIANCE (Conditional)
  // OB-1 through OB-4 equivalent
  // Visibility: Always for A, optional for B, always for C, hidden for D/E
  // ============================================================================

  // Current regulatory status
  // currentlyRegulated is already pre-populated from sign-up

  // If currently regulated (conditional fields)
  regulatorName?: string // From dropdown list
  regulatorJurisdiction?: string
  licenseNumber?: string
  licenseDetails?: string // Description of permitted services

  // Compliance Officer (required for A, C)
  complianceOfficerName?: string
  complianceOfficerEmail?: string

  // Money Laundering Reporting Officer (required for Pathway A ONLY)
  mlroName?: string
  mlroEmail?: string

  // ============================================================================
  // SECTION 7: KEY PERSONNEL (Pathways A, C)
  // OB-15 equivalent
  // ============================================================================

  keyIndividuals: string[] // Array of names (at least 1)

  // ============================================================================
  // SECTION 8: DOCUMENT UPLOADS (All Pathways, pathway-specific requirements)
  // OB-16, OB-19, OB-37, OB-40 equivalent
  // ============================================================================

  documents: {
    // Required for ALL pathways
    certificateOfIncorporation?: string // Azure Blob URL
    articlesOfAssociation?: string // Azure Blob URL
    businessPlan?: string // Azure Blob URL

    // Required for Pathway A (Financial Services) ONLY
    complianceManual?: string
    amlPolicy?: string
    shareholderRegistry?: string

    // Required for Pathway C (Crypto Token) ONLY
    whitePaper?: string
    tokenEconomicsModel?: string
    cryptoShareholderRegistry?: string

    // Optional supporting documents (all pathways, up to 6 total)
    supportingDoc1?: string
    supportingDoc2?: string
    supportingDoc3?: string
    supportingDoc4?: string
    supportingDoc5?: string
    supportingDoc6?: string
  }

  // ============================================================================
  // SECTION 9: DECLARATIONS (All Pathways)
  // OB-49 equivalent + final declarations
  // ============================================================================

  declarations: {
    // Fit and proper declaration (OB-49)
    fitAndProperConfirmation: boolean // Required

    // Final submission declarations
    accuracyConfirmation: boolean // "All information is accurate and complete"
    authorityConfirmation: boolean // "I have authority to submit this application"
    dataConsentProvided: boolean // "I consent to data sharing with DFSA"
  }

  // ============================================================================
  // PATHWAY-COMPUTED FLAGS (for conditional rendering)
  // Set automatically based on activityType
  // ============================================================================

  requiresShareholderTable: boolean // true for A, C
  requiresBeneficialOwnerTable: boolean // true for A, C
  requiresFinancialInfo: boolean // true for A, C
  requiresComplianceOfficer: boolean // true for A, C
  requiresMLRO: boolean // true for A only
  requiresKeyPersonnel: boolean // true for A, B, D
}

// ============================================================================
// PATHWAY CONFIGURATION
// ============================================================================

/**
 * Pathway Configuration
 * Defines which sections are visible for each pathway
 */
export interface PathwayConfig {
  pathway: 'A' | 'B' | 'C' | 'D' | 'E'
  name: string
  activityType: DFSAActivityType
  questionCount: number
  estimatedMinutes: number
  requiredSteps: string[] // Step IDs that must be shown
  optionalSteps: string[] // Step IDs that can be shown

  // Feature flags for conditional rendering
  features: {
    shareholdingTable: boolean
    beneficialOwnerTable: boolean
    financialInformation: boolean
    regulatoryCompliance: 'required' | 'optional' | 'hidden'
    mlroRequired: boolean
    keyPersonnelRequired: boolean
  }
}

/**
 * Pathway configuration map
 * Keyed by DFSAActivityType
 */
export const PATHWAY_CONFIGS: Record<DFSAActivityType, PathwayConfig> = {
  FINANCIAL_SERVICES: {
    pathway: 'A',
    name: 'Financial Services',
    activityType: 'FINANCIAL_SERVICES',
    questionCount: 28,
    estimatedMinutes: 30,
    requiredSteps: ['welcome', 'basic', 'entity', 'shareholding', 'beneficial', 'financial', 'regulatory', 'documents', 'review'],
    optionalSteps: [],
    features: {
      shareholdingTable: true,
      beneficialOwnerTable: true,
      financialInformation: true,
      regulatoryCompliance: 'required',
      mlroRequired: true,
      keyPersonnelRequired: true,
    },
  },
  DNFBP: {
    pathway: 'B',
    name: 'DNFBP',
    activityType: 'DNFBP',
    questionCount: 15,
    estimatedMinutes: 20,
    requiredSteps: ['welcome', 'basic', 'entity', 'documents', 'review'],
    optionalSteps: ['regulatory'],
    features: {
      shareholdingTable: false,
      beneficialOwnerTable: false,
      financialInformation: false,
      regulatoryCompliance: 'optional',
      mlroRequired: false,
      keyPersonnelRequired: true,
    },
  },
  CRYPTO_TOKEN: {
    pathway: 'C',
    name: 'Crypto Token',
    activityType: 'CRYPTO_TOKEN',
    questionCount: 40,
    estimatedMinutes: 45,
    requiredSteps: ['welcome', 'basic', 'entity', 'shareholding', 'beneficial', 'financial', 'regulatory', 'documents', 'review'],
    optionalSteps: [],
    features: {
      shareholdingTable: true,
      beneficialOwnerTable: true,
      financialInformation: true,
      regulatoryCompliance: 'required',
      mlroRequired: false,
      keyPersonnelRequired: true,
    },
  },
  REGISTERED_AUDITOR: {
    pathway: 'D',
    name: 'Registered Auditor',
    activityType: 'REGISTERED_AUDITOR',
    questionCount: 12,
    estimatedMinutes: 15,
    requiredSteps: ['welcome', 'basic', 'entity', 'documents', 'review'],
    optionalSteps: [],
    features: {
      shareholdingTable: false,
      beneficialOwnerTable: false,
      financialInformation: false,
      regulatoryCompliance: 'hidden',
      mlroRequired: false,
      keyPersonnelRequired: true,
    },
  },
  CRYPTO_TOKEN_RECOGNITION: {
    pathway: 'E',
    name: 'Crypto Recognition',
    activityType: 'CRYPTO_TOKEN_RECOGNITION',
    questionCount: 10,
    estimatedMinutes: 10,
    requiredSteps: ['welcome', 'basic', 'entity', 'documents', 'review'],
    optionalSteps: [],
    features: {
      shareholdingTable: false,
      beneficialOwnerTable: false,
      financialInformation: false,
      regulatoryCompliance: 'hidden',
      mlroRequired: false,
      keyPersonnelRequired: false,
    },
  },
}

// ============================================================================
// STEP CONFIGURATION
// ============================================================================

/**
 * Step definition for form wizard
 */
export interface StepDefinition {
  id: string // 'welcome', 'basic', 'entity', etc.
  title: string
  subtitle: string
  stepNumber: number // 1-9
}

/**
 * All possible steps in the form
 * Steps shown depend on pathway
 */
export const ALL_STEPS: StepDefinition[] = [
  { id: 'welcome', title: 'Welcome', subtitle: 'Get started with your application', stepNumber: 1 },
  { id: 'basic', title: 'Basic Information', subtitle: 'Company details and registration', stepNumber: 2 },
  { id: 'entity', title: 'Entity Structure', subtitle: 'Corporate structure and ownership', stepNumber: 3 },
  { id: 'shareholding', title: 'Shareholding', subtitle: 'Shareholder details and ownership', stepNumber: 4 },
  { id: 'beneficial', title: 'Beneficial Ownership', subtitle: 'Ultimate beneficial owners', stepNumber: 5 },
  { id: 'financial', title: 'Financial Information', subtitle: 'Capital and funding sources', stepNumber: 6 },
  { id: 'regulatory', title: 'Regulatory & Compliance', subtitle: 'Compliance officers and status', stepNumber: 7 },
  { id: 'documents', title: 'Document Uploads', subtitle: 'Required documentation', stepNumber: 8 },
  { id: 'review', title: 'Review & Submit', subtitle: 'Review and submit your application', stepNumber: 9 },
]

// ============================================================================
// STEP PROPS (for React Hook Form integration)
// ============================================================================

/**
 * Props passed to each step component
 * Uses React Hook Form's UseFormReturn for form control
 */
export interface StepProps {
  form: UseFormReturn<DFSAOnboardingFormData>
}

/**
 * Props for ReviewSubmitStep (has additional edit functionality)
 */
export interface ReviewSubmitStepProps extends StepProps {
  onEdit: (stepNumber: number) => void // Jump back to specific step
}

// ============================================================================
// INITIAL VALUES HELPER
// ============================================================================

/**
 * Default initial values for form initialization
 * Minimal required fields to start the form
 */
export const getInitialFormValues = (): Partial<DFSAOnboardingFormData> => ({
  formId: '', // Will be set on mount with UUID
  userId: '', // Will be set on mount from auth context
  pathway: 'A', // Will be computed from activityType

  // Empty strings for pre-population (will be filled from localStorage)
  suggestedCompanyName: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',

  // Default activity type (will be overridden by pre-population or user selection)
  activityType: 'FINANCIAL_SERVICES',
  entityType: 'DIFC_INCORPORATION',

  // Basic info defaults
  legalEntityName: '',
  incorporationJurisdiction: '',
  incorporationDate: '',
  registrationNumber: '',

  businessAddress: {
    line1: '',
    city: '',
    postalCode: '',
    country: '',
  },

  sameAsBusinessAddress: true,
  hasParentCompany: false,

  // Empty arrays for dynamic tables
  shareholders: [],
  beneficialOwners: [],
  fundingSources: [],
  keyIndividuals: [''], // Start with one empty entry

  // Calculated fields
  totalShareholding: 0,
  totalBeneficialOwnership: 0,
  proposedCapitalUSD: 0,

  // Documents object
  documents: {},

  // Declarations (all false initially)
  declarations: {
    fitAndProperConfirmation: false,
    accuracyConfirmation: false,
    authorityConfirmation: false,
    dataConsentProvided: false,
  },

  // Pathway flags (will be computed based on activityType)
  requiresShareholderTable: false,
  requiresBeneficialOwnerTable: false,
  requiresFinancialInfo: false,
  requiresComplianceOfficer: false,
  requiresMLRO: false,
  requiresKeyPersonnel: false,
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get pathway configuration based on activity type
 */
export const getPathwayConfig = (activityType: DFSAActivityType): PathwayConfig => {
  return PATHWAY_CONFIGS[activityType]
}

/**
 * Get visible steps for a given pathway
 */
export const getVisibleSteps = (activityType: DFSAActivityType): StepDefinition[] => {
  const config = getPathwayConfig(activityType)
  const allRequiredAndOptional = [...config.requiredSteps, ...config.optionalSteps]

  return ALL_STEPS.filter(step => allRequiredAndOptional.includes(step.id))
}

/**
 * Compute pathway flags based on activity type
 */
export const computePathwayFlags = (activityType: DFSAActivityType): Pick<
  DFSAOnboardingFormData,
  | 'requiresShareholderTable'
  | 'requiresBeneficialOwnerTable'
  | 'requiresFinancialInfo'
  | 'requiresComplianceOfficer'
  | 'requiresMLRO'
  | 'requiresKeyPersonnel'
> => {
  const config = getPathwayConfig(activityType)

  return {
    requiresShareholderTable: config.features.shareholdingTable,
    requiresBeneficialOwnerTable: config.features.beneficialOwnerTable,
    requiresFinancialInfo: config.features.financialInformation,
    requiresComplianceOfficer: config.features.regulatoryCompliance !== 'hidden',
    requiresMLRO: config.features.mlroRequired,
    requiresKeyPersonnel: config.features.keyPersonnelRequired,
  }
}

// ============================================================================
// LEGACY COMPATIBILITY (Old FormData interface)
// Will be removed after migration is complete
// ============================================================================

/**
 * @deprecated Use DFSAOnboardingFormData instead
 * This interface is kept for backward compatibility during migration
 */
export interface FormData {
  applicantRole: 'own_firm' | 'professional_advisor' | ''
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  contactPhone: string
  firmContactFirstName: string
  firmContactLastName: string
  firmContactEmail: string
  firmContactPhone: string
  suggestedCompanyName: string
  activityType: 'financial_services' | 'dnfbp' | 'registered_auditor' | 'crypto_token' | ''
  services: string[]
}

/**
 * @deprecated Use StepProps with React Hook Form instead
 * This interface is kept for backward compatibility during migration
 */
export interface LegacyStepProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
}

/**
 * Returns initial default values for the DFSA onboarding form
 * All fields start empty/false except meta fields which are generated
 */
export const getInitialValues = (): DFSAOnboardingFormData => {
  return {
    // Meta
    formId: `DRAFT-${Date.now()}`,
    userId: '',
    pathway: 'A',
    activityType: 'FINANCIAL_SERVICES',

    // Pre-populated from sign-up (empty until populated)
    suggestedCompanyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',

    // Basic Information
    legalEntityName: '',
    incorporationJurisdiction: '',
    incorporationDate: '',
    registrationNumber: '',
    businessAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    mailingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    sameAsBusinessAddress: false,

    // Entity Structure
    entityType: 'LIMITED_LIABILITY_COMPANY',
    entityTypeOther: '',
    parentCompanyName: '',
    parentCompanyJurisdiction: '',
    isPartOfGroup: false,

    // Shareholding (Pathways A, C only)
    shareholders: [],
    totalShareholding: 0,

    // Beneficial Ownership (Pathways A, C only)
    beneficialOwners: [],
    totalBeneficialOwnership: 0,

    // Financial Information (Pathways A, C only)
    proposedCapitalUSD: 0,
    fundingSources: [],
    projectedRevenueYear1: 0,
    projectedRevenueYear2: 0,
    projectedRevenueYear3: 0,
    businessModelDescription: '',

    // Regulatory & Compliance
    currentlyRegulated: false,
    regulatorName: '',
    regulatorLicenceNumber: '',
    regulatedActivities: '',
    complianceOfficerName: '',
    complianceOfficerEmail: '',
    complianceOfficerQualifications: '',
    mlroName: '',
    mlroEmail: '',
    mlroQualifications: '',

    // Documents
    documents: {
      certificateOfIncorporation: '',
      articlesOfAssociation: '',
      businessPlan: '',
      complianceManual: '',
      amlPolicy: '',
      shareholderRegistry: '',
      keyPersonnelCVs: '',
      whitePaper: '',
      tokenEconomicsModel: '',
      cryptoShareholderRegistry: '',
      technicalArchitecture: '',
      securityAudit: '',
      auditedFinancials: '',
      bankReferences: '',
      professionalIndemnity: '',
      groupStructureDiagram: '',
    },

    // Declarations
    declarations: {
      fitAndProperConfirmation: false,
      accuracyConfirmation: false,
      authorityConfirmation: false,
      dataConsentProvided: false,
    },

    // Pathway Flags (computed based on activityType)
    requiresShareholderTable: true, // Default to Pathway A
    requiresBeneficialOwnerTable: true,
    requiresMLRO: true,
  }
}
