/**
 * DFSA Enquiry API Service
 * Handles submission of DFSA authorisation enquiry forms
 *
 * This service provides client-side validation and API communication
 * for the DFSA enquiry sign-up process.
 */

import { submitDFSAEnquiry } from "../pages/api/dfsa/enquiry-signup";
import type {
  DFSAEnquirySignUpFormData,
  DFSAEnquiryResponse,
  DFSAActivityType,
  DFSATeam,
} from "../types/dfsa";

export const dfsaEnquiryAPI = {
  /**
   * Submit DFSA enquiry form data
   * @param formData - Complete enquiry form data
   * @returns Promise resolving to submission response with reference number
   */
  async submitEnquiry(formData: DFSAEnquirySignUpFormData): Promise<DFSAEnquiryResponse> {
    try {
      // Client-side validation before sending
      const validation = this.validateFormData(formData);
      if (!validation.isValid) {
        console.error("❌ Client validation failed:", validation.errors);
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // Submit to API endpoint
      console.log("📤 Submitting DFSA enquiry:", formData);
      const result = await submitDFSAEnquiry(formData);

      console.log("✅ DFSA enquiry submission successful:", result);
      return {
        success: true,
        referenceNumber: result.referenceNumber,
        assignedTeam: result.assignedTeam,
        message: result.message || "Enquiry submitted successfully",
        data: result,
      };
    } catch (error) {
      console.error("❌ DFSA Enquiry Service Error:", {
        error: error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      };
    }
  },

  /**
   * Validate form data before submission
   * @param formData - Form data to validate
   * @returns Validation result with errors if any
   */
  validateFormData(formData: DFSAEnquirySignUpFormData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Section 1: Contact Information
    if (!formData.contactInfo.companyName?.trim()) {
      errors.push("Company name is required");
    } else if (formData.contactInfo.companyName.trim().length < 2) {
      errors.push("Company name must be at least 2 characters");
    } else if (formData.contactInfo.companyName.trim().length > 200) {
      errors.push("Company name must not exceed 200 characters");
    }

    if (!formData.contactInfo.contactName?.trim()) {
      errors.push("Contact name is required");
    } else if (formData.contactInfo.contactName.trim().length < 2) {
      errors.push("Contact name must be at least 2 characters");
    } else if (formData.contactInfo.contactName.trim().length > 100) {
      errors.push("Contact name must not exceed 100 characters");
    }

    if (!formData.contactInfo.email?.trim()) {
      errors.push("Email is required");
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.contactInfo.email.trim()
      )
    ) {
      errors.push("Please enter a valid email address");
    }

    if (!formData.contactInfo.phone?.trim()) {
      errors.push("Phone number is required");
    } else if (
      !/^\+?[1-9]\d{1,14}$/.test(
        formData.contactInfo.phone.replace(/[\s-]/g, "")
      )
    ) {
      errors.push("Please enter a valid international telephone number");
    }

    // suggestedDate is optional, so no validation if empty
    if (formData.contactInfo.suggestedDate) {
      const suggestedDate = new Date(formData.contactInfo.suggestedDate);
      if (suggestedDate < new Date()) {
        errors.push("Suggested date must be in the future");
      }
    }

    // Section 2: Activity Type
    if (!formData.activityType) {
      errors.push("Activity type is required");
    }

    // Section 3: Entity Type
    if (!formData.entityType) {
      errors.push("Entity type is required");
    }

    // Conditional: Entity Type Other
    if (formData.entityType === "OTHER" && !formData.entityTypeOther?.trim()) {
      errors.push("Please specify the entity type");
    }

    // Section 4: Regulatory Status (conditional)
    if (
      formData.activityType === "FINANCIAL_SERVICES" &&
      formData.currentlyRegulated === null
    ) {
      errors.push("Please indicate if currently regulated");
    }

    // Section 5: Data Consent
    if (formData.difcaConsent === null || formData.difcaConsent === undefined) {
      errors.push("Please indicate your consent preference");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Determine assigned team based on activity type
   * Maps activity type to appropriate DFSA team for triage routing
   *
   * @param activityType - Selected activity type from form
   * @returns Assigned DFSA team for handling the enquiry
   */
  getAssignedTeam(activityType: DFSAActivityType): DFSATeam {
    const teamMapping: Record<DFSAActivityType, DFSATeam> = {
      FINANCIAL_SERVICES: "AUTHORISATION_TEAM",
      DNFBP: "DNFBP_REGISTRATION_TEAM",
      REGISTERED_AUDITOR: "AUDIT_REGISTRATION_TEAM",
      CRYPTO_TOKEN: "CRYPTO_INNOVATION_TEAM",
      CRYPTO_TOKEN_RECOGNITION: "CRYPTO_INNOVATION_TEAM",
    };

    return teamMapping[activityType];
  },

  /**
   * Get activity type display name
   * @param activityType - Activity type code
   * @returns Human-readable activity type name
   */
  getActivityTypeLabel(activityType: DFSAActivityType): string {
    const labels: Record<DFSAActivityType, string> = {
      FINANCIAL_SERVICES: "Financial Services",
      DNFBP: "Designated Non-Financial Business or Profession (DNFBP)",
      REGISTERED_AUDITOR: "Registered Auditor",
      CRYPTO_TOKEN: "Crypto Token",
      CRYPTO_TOKEN_RECOGNITION: "Application for Crypto Token Recognition only",
    };

    return labels[activityType] || activityType;
  },

  /**
   * Get entity type display name
   * @param entityType - Entity type code
   * @returns Human-readable entity type name
   */
  getEntityTypeLabel(entityType: string): string {
    const labels: Record<string, string> = {
      DIFC_INCORPORATION: "A company/partnership incorporated in the DIFC",
      OTHER_JURISDICTION:
        "A company/partnership incorporated in another jurisdiction",
      OTHER: "Other",
    };

    return labels[entityType] || entityType;
  },
};

export default dfsaEnquiryAPI;
