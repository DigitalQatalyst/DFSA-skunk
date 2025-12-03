/**
 * DFSA Authorisation Enquiry - Sign Up Form Validation Schema
 * Technical Specification v1.0
 *
 * This schema implements validation for the DFSA enquiry sign-up form
 * with conditional logic and DFSA compliance requirements.
 */

import * as yup from "yup";

/**
 * Validation Schema for DFSA Enquiry Sign-Up Form
 *
 * Form Fields (9 total):
 * - SU-1: companyName (required, 2-200 chars)
 * - SU-2: contactName (required, 2-100 chars)
 * - SU-3: email (required, valid email)
 * - SU-4: phone (required, E.164 format)
 * - SU-5: suggestedDate (optional, future dates only)
 * - SU-6: activityType (required)
 * - SU-7: entityType (required)
 * - SU-7-Other: entityTypeOther (conditional - required if entityType = 'OTHER')
 * - SU-8: currentlyRegulated (conditional - required if activityType = 'FINANCIAL_SERVICES')
 * - SU-9: difcaConsent (required boolean)
 */
export const dfsaEnquirySignupValidationSchema = yup.object({
  // ============================================================================
  // SECTION 1: Contact Information (SU-1 through SU-5)
  // ============================================================================

  // SU-1: Suggested company name
  companyName: yup
    .string()
    .required("Please enter a company name")
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name must not exceed 200 characters")
    .trim(),

  // SU-2: Your name (contact person)
  contactName: yup
    .string()
    .required("Please enter your name")
    .min(2, "Contact name must be at least 2 characters")
    .max(100, "Contact name must not exceed 100 characters")
    .trim(),

  // SU-3: Your email
  email: yup
    .string()
    .required("Please enter a valid email address")
    .max(254, "Email address must not exceed 254 characters")
    .email("Please enter a valid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .trim(),

  // SU-4: Your telephone number
  phone: yup
    .string()
    .required("Please enter a valid telephone number")
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid international telephone number (E.164 format, e.g., +971501234567)"
    )
    .trim(),

  // SU-5: Suggested date for future application (optional)
  suggestedDate: yup
    .date()
    .nullable()
    .min(
      new Date(),
      "Suggested date must be in the future"
    )
    .typeError("Please enter a valid date"),

  // ============================================================================
  // SECTION 2: Activity Type (SU-6)
  // ============================================================================

  // SU-6: Which best describes the activities...
  activityType: yup
    .string()
    .required("Please select an activity type")
    .oneOf(
      ['FINANCIAL_SERVICES', 'DNFBP', 'REGISTERED_AUDITOR', 'CRYPTO_TOKEN', 'CRYPTO_TOKEN_RECOGNITION'],
      "Please select a valid activity type"
    ),

  // ============================================================================
  // SECTION 3: Entity Type (SU-7)
  // ============================================================================

  // SU-7: Will the potential applicant apply as...
  entityType: yup
    .string()
    .required("Please select how the applicant will apply")
    .oneOf(
      ['DIFC_INCORPORATION', 'OTHER_JURISDICTION', 'OTHER'],
      "Please select a valid entity type"
    ),

  // SU-7-Other: Conditional text field (only required if entityType = 'OTHER')
  entityTypeOther: yup
    .string()
    .nullable()
    .when('entityType', {
      is: 'OTHER',
      then: (schema) => schema
        .required("Please specify the entity type")
        .min(2, "Entity type specification must be at least 2 characters")
        .max(200, "Entity type specification must not exceed 200 characters"),
      otherwise: (schema) => schema.notRequired(),
    }),

  // ============================================================================
  // SECTION 4: Regulatory Status (SU-8 - Conditional)
  // ============================================================================

  // SU-8: Is the potential applicant currently regulated...
  // Only required if activityType = 'FINANCIAL_SERVICES'
  currentlyRegulated: yup
    .boolean()
    .nullable()
    .when('activityType', {
      is: 'FINANCIAL_SERVICES',
      then: (schema) => schema
        .required("Please indicate if currently regulated")
        .typeError("Please indicate if currently regulated"),
      otherwise: (schema) => schema.notRequired(),
    }),

  // ============================================================================
  // SECTION 5: Data Consent (SU-9)
  // ============================================================================

  // SU-9: Disclosure of information to DIFCA
  difcaConsent: yup
    .boolean()
    .required("Please indicate your consent preference")
    .typeError("Please indicate your consent preference"),
});

/**
 * Type inference from validation schema
 * Provides TypeScript type safety based on Yup schema
 */
export type DFSAEnquirySignupFormValues = yup.InferType<typeof dfsaEnquirySignupValidationSchema>;

/**
 * Initial form values
 * Used for form initialization
 */
export const dfsaEnquirySignupInitialValues: Partial<DFSAEnquirySignupFormValues> = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  suggestedDate: null,
  activityType: undefined,
  entityType: undefined,
  entityTypeOther: null,
  currentlyRegulated: null,
  difcaConsent: undefined,
};

/**
 * Helper function to validate a single field
 * Useful for inline validation during form input
 */
export const validateDFSAField = async (
  fieldName: string,
  value: any,
  allValues: any
): Promise<string | undefined> => {
  try {
    await dfsaEnquirySignupValidationSchema.validateAt(fieldName, { ...allValues, [fieldName]: value });
    return undefined;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return "Validation error";
  }
};

/**
 * Helper function to check if a section is complete
 * Used for progress indicator
 */
export const isDFSASectionComplete = (
  sectionNumber: number,
  values: Partial<DFSAEnquirySignupFormValues>
): boolean => {
  switch (sectionNumber) {
    case 1: // Contact Information
      return !!(
        values.companyName &&
        values.companyName.length >= 2 &&
        values.contactName &&
        values.contactName.length >= 2 &&
        values.email &&
        values.email.includes('@') &&
        values.phone &&
        values.phone.length >= 8
      );

    case 2: // Activity Type
      return !!values.activityType;

    case 3: // Entity Type
      if (values.entityType === 'OTHER') {
        return !!(values.entityType && values.entityTypeOther && values.entityTypeOther.length >= 2);
      }
      return !!values.entityType;

    case 4: // Regulatory Status (conditional)
      if (values.activityType === 'FINANCIAL_SERVICES') {
        return values.currentlyRegulated !== null && values.currentlyRegulated !== undefined;
      }
      return true; // Not required, so consider complete

    case 5: // Data Consent
      return values.difcaConsent !== undefined && values.difcaConsent !== null;

    default:
      return false;
  }
};
