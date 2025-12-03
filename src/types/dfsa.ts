/**
 * DFSA Regulatory Services Platform - Type Definitions
 * Complete TypeScript interfaces for all DFSA data structures
 */

// ============================================================================
// TRUST METRICS (Hero Section)
// ============================================================================

export interface TrustMetric {
  id: string;
  value: number;
  label: string;
  description?: string;
  icon?: string;
}

/**
 * DFSA Fact Metrics (Compliant replacement for Trust Metrics)
 * Educational regulatory information, no outcome predictions
 */
export interface DFSAFactMetric {
  id: string;
  value: number;
  label: string;
  description: string;
  icon: string;
  ruleReference?: string;
}

// ============================================================================
// LICENSE CATEGORIES
// ============================================================================

export interface LicenseSubcategory {
  code: string;
  name: string;
  description: string;
  capitalRequirement?: string;
}

export interface LicenseCategory {
  id: string;
  categoryNumber: string; // "1", "2", "3A", "3B", "3C", "4", "5", "ITL"
  name: string;
  icon: string; // Lucide icon name
  description: string;
  capitalRequirement: {
    amount: string;
    range?: string;
    details?: string;
  };
  timeline: string;
  keyActivities: string[];
  subcategories?: LicenseSubcategory[];
  badge?: string; // e.g., "Regulatory Sandbox" for ITL
  idealFor?: string[];
  detailsUrl?: string;
  gradient?: string; // Gradient classes for card styling
}

// ============================================================================
// AUTHORIZATION JOURNEY
// ============================================================================

export interface AuthorizationFee {
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
  category5?: string;
  itl?: string;
}

export interface AuthorizationStep {
  stepNumber: number; // 1-8
  title: string;
  duration: string;
  icon: string; // Lucide icon name
  description: string;
  whatHappens: string[];
  deliverables?: string[];
  keyDocuments?: string[];
  support?: string[]; // How we support clients in this step
  ctaLabel?: string;
  ctaUrl?: string;
  fees?: AuthorizationFee;
}

// ============================================================================
// KEY PERSONNEL
// ============================================================================

export interface PersonnelRole {
  id: string;
  role: string;
  fullName: string;
  mandatory: boolean;
  mandatoryFor?: string[]; // Which license categories require this role
  icon: string; // Lucide icon name
  requirements: string[];
  responsibilities: string[];
  fitAndProper: boolean; // Subject to Fit & Proper assessment
  residencyRequired?: boolean;
  yearsExperience?: string;
  support?: string[]; // How we support with this appointment
}

// ============================================================================
// COMPLIANCE SERVICES
// ============================================================================

export interface ComplianceServicePricing {
  model: 'monthly' | 'per-return' | 'project' | 'retainer' | 'custom';
  amount: string;
  frequency?: string;
  customNote?: string;
}

export interface ComplianceService {
  id: string;
  title: string;
  icon: string; // Lucide icon name
  description: string;
  whatWeProvide: string[];
  deliverables?: string[];
  pricing: ComplianceServicePricing;
  idealFor?: string[];
  timeline?: string;
  ctaLabel: string;
  ctaUrl: string;
  badge?: string; // e.g., "Most Popular"
}

// ============================================================================
// PRICING & PACKAGES
// ============================================================================

export interface PackageFeature {
  name: string;
  included: boolean;
  details?: string;
}

export interface AuthorizationPackage {
  id: string;
  name: string;
  price: string;
  popular?: boolean;
  description: string;
  features: PackageFeature[];
  ctaLabel: string;
  ctaUrl: string;
  timeline?: string;
  idealFor: string[]; // License categories this package is ideal for
  icon?: string;
  badge?: string;
}

export interface ComplianceSubscription {
  id: string;
  tier: 'essential' | 'full-support' | 'comprehensive';
  name: string;
  priceMonthly: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaUrl: string;
  popular?: boolean;
  icon?: string;
}

// ============================================================================
// TESTIMONIALS
// ============================================================================

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  position: string;
  company: string;
  companyType?: string; // e.g., "Asset Management Firm"
  licenseCategory: string; // e.g., "Category 3C"
  image?: string; // Headshot URL
  rating?: number; // 1-5 stars
  location?: string; // e.g., "DIFC, Dubai"
}

// ============================================================================
// FAQ
// ============================================================================

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: 'general' | 'licensing' | 'capital' | 'personnel' | 'compliance' | 'timeline';
  relatedLinks?: {
    text: string;
    url: string;
  }[];
}

// ============================================================================
// RESOURCES
// ============================================================================

export type ResourceType = 'guide' | 'template' | 'update' | 'video' | 'case-study';
export type FileType = 'PDF' | 'DOCX' | 'XLSX' | 'MP4' | 'WEBINAR' | 'ARTICLE';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  fileType: FileType;
  icon: string; // Lucide icon name
  url: string; // Download URL or external link
  downloadable: boolean;
  thumbnail?: string; // For videos and visual content
  fileSize?: string; // e.g., "2.5 MB"
  duration?: string; // For videos, e.g., "15 min"
  publishedDate: string; // ISO date string
  category?: string[];
  featured?: boolean;
}

// ============================================================================
// CONTACT FORMS
// ============================================================================

export interface ConsultationFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  licenseCategory: string;
  currentStage: string;
  message: string;
}

export interface GuideDownloadFormData {
  fullName: string;
  email: string;
  company: string;
  licenseCategory: string;
}

export interface ContactFormData {
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
  fullName?: string;
  interests?: string[]; // e.g., ["licensing", "compliance", "regulatory-updates"]
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type LicenseCategoryCode = '1' | '2' | '3A' | '3B' | '3C' | '4' | '5' | 'ITL';

export type AuthorizationStage =
  | 'research'
  | 'preparation'
  | 'application'
  | 'review'
  | 'approved'
  | 'operational';

export type CompliancePackageTier = 'starter' | 'professional' | 'enterprise' | 'itl';

// ============================================================================
// DFSA ENQUIRY SIGN-UP TYPES
// ============================================================================

/**
 * DFSA Activity Types for Authorisation Enquiry
 * Maps to SU-6 field in the sign-up form
 */
export type DFSAActivityType =
  | 'FINANCIAL_SERVICES'
  | 'DNFBP'
  | 'REGISTERED_AUDITOR'
  | 'CRYPTO_TOKEN'
  | 'CRYPTO_TOKEN_RECOGNITION';

/**
 * DFSA Entity Types for incorporation
 * Maps to SU-7 field in the sign-up form
 */
export type DFSAEntityType =
  | 'DIFC_INCORPORATION'
  | 'OTHER_JURISDICTION'
  | 'OTHER';

/**
 * DFSA Teams for triage routing based on activity type
 */
export type DFSATeam =
  | 'AUTHORISATION_TEAM'
  | 'DNFBP_REGISTRATION_TEAM'
  | 'AUDIT_REGISTRATION_TEAM'
  | 'CRYPTO_INNOVATION_TEAM';

/**
 * Contact Information section (SU-1 through SU-5)
 */
export interface DFSAContactInfo {
  companyName: string;           // SU-1: 2-200 chars
  contactName: string;            // SU-2: 2-100 chars
  email: string;                  // SU-3: valid email
  phone: string;                  // SU-4: E.164 format
  suggestedDate: string | null;   // SU-5: ISO date, future only
}

/**
 * Complete DFSA Enquiry Sign-Up Form Data
 * Aligns with technical specification v1.0
 */
export interface DFSAEnquirySignUpFormData {
  contactInfo: DFSAContactInfo;
  activityType: DFSAActivityType;        // SU-6
  entityType: DFSAEntityType;            // SU-7
  entityTypeOther: string | null;        // SU-7 conditional
  currentlyRegulated: boolean | null;    // SU-8 conditional
  difcaConsent: boolean;                 // SU-9
}

/**
 * DFSA Enquiry Submission Response
 * Includes reference number and team assignment
 */
export interface DFSAEnquirySignUpSubmission {
  referenceNumber: string;               // ENQ-YYYY-NNNNN
  submittedAt: string;                   // ISO datetime
  formData: DFSAEnquirySignUpFormData;
  assignedTeam: DFSATeam;
}

/**
 * API Response for DFSA Enquiry Submission
 */
export interface DFSAEnquiryResponse {
  success: boolean;
  referenceNumber?: string;
  assignedTeam?: DFSATeam;
  message: string;
  data?: any;
}
