/**
 * DFSA Enquiry Sign-Up API Handler
 * Frontend-only implementation with mocked backend responses
 *
 * This handler simulates backend functionality until real services are ready:
 * - Reference number generation (ENQ-YYYY-NNNNN format)
 * - Team assignment based on activity type
 * - Form data logging for verification
 *
 * TODO: Replace with actual backend API calls when services are deployed
 */

import { auditLog, DFSA_AUDIT_EVENTS } from "../../../utils/auditLogger";
import type {
  DFSAEnquirySignUpFormData,
  DFSAActivityType,
  DFSATeam,
} from "../../../types/dfsa";

/**
 * Response interface for DFSA enquiry submission
 */
interface DFSAEnquirySubmissionResponse {
  success: boolean;
  referenceNumber: string;
  assignedTeam: DFSATeam;
  message: string;
  submittedAt: string;
}

/**
 * Generate mock reference number in ENQ-YYYY-NNNNN format
 * Uses timestamp-based counter as placeholder
 *
 * @returns Reference number string (e.g., ENQ-2024-00123)
 *
 * NOTE: When backend is ready, replace this with actual sequential
 * counter from database (dfsa_enquiry_counters table)
 */
const generateMockReferenceNumber = (): string => {
  const year = new Date().getFullYear();
  // Use timestamp-based counter as placeholder (last 5 digits of seconds since epoch)
  const counter = Math.floor(Date.now() / 1000) % 100000;
  const referenceNumber = `ENQ-${year}-${counter.toString().padStart(5, "0")}`;

  // Audit log reference number generation
  auditLog.log(DFSA_AUDIT_EVENTS.REFERENCE_NUMBER_GENERATED, {
    referenceNumber,
    method: "mock_timestamp",
  });

  return referenceNumber;
};

/**
 * Determine assigned team based on activity type
 * Maps activity type to appropriate DFSA team for triage routing
 *
 * @param activityType - Activity type from form
 * @returns Assigned DFSA team
 */
const getAssignedTeam = (activityType: DFSAActivityType): DFSATeam => {
  const teamMapping: Record<DFSAActivityType, DFSATeam> = {
    FINANCIAL_SERVICES: "AUTHORISATION_TEAM",
    DNFBP: "DNFBP_REGISTRATION_TEAM",
    REGISTERED_AUDITOR: "AUDIT_REGISTRATION_TEAM",
    CRYPTO_TOKEN: "CRYPTO_INNOVATION_TEAM",
    CRYPTO_TOKEN_RECOGNITION: "CRYPTO_INNOVATION_TEAM",
  };

  const assignedTeam = teamMapping[activityType];

  // Audit log team assignment
  auditLog.log(DFSA_AUDIT_EVENTS.TEAM_ASSIGNED, {
    activityType,
    assignedTeam,
  });

  return assignedTeam;
};

/**
 * Submit DFSA Enquiry (Frontend Mock)
 *
 * This function simulates the backend submission process:
 * 1. Generates reference number
 * 2. Determines assigned team
 * 3. Logs submission data to console
 * 4. Returns success response
 *
 * @param formData - Complete DFSA enquiry form data
 * @returns Promise resolving to submission response
 */
export async function submitDFSAEnquiry(
  formData: DFSAEnquirySignUpFormData
): Promise<DFSAEnquirySubmissionResponse> {
  // Audit log API call
  auditLog.log(DFSA_AUDIT_EVENTS.ENQUIRY_API_CALL, {
    email: formData.contactInfo.email,
    companyName: formData.contactInfo.companyName,
    activityType: formData.activityType,
  });

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock reference number
    const referenceNumber = generateMockReferenceNumber();

    // Determine assigned team
    const assignedTeam = getAssignedTeam(formData.activityType);

    // Prepare submission record
    const submission = {
      referenceNumber,
      assignedTeam,
      submittedAt: new Date().toISOString(),
      formData,
    };

    // Log to console for verification (temporary)
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ DFSA ENQUIRY SUBMISSION (FRONTEND MOCK)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 Reference Number:", referenceNumber);
    console.log("👥 Assigned Team:", assignedTeam);
    console.log("🏢 Company Name:", formData.contactInfo.companyName);
    console.log("👤 Contact Name:", formData.contactInfo.contactName);
    console.log("📧 Email:", formData.contactInfo.email);
    console.log("📞 Phone:", formData.contactInfo.phone);
    console.log(
      "📅 Suggested Date:",
      formData.contactInfo.suggestedDate || "Not provided"
    );
    console.log("🎯 Activity Type:", formData.activityType);
    console.log("🏛️ Entity Type:", formData.entityType);
    if (formData.entityTypeOther) {
      console.log("📝 Entity Type Other:", formData.entityTypeOther);
    }
    if (formData.activityType === "FINANCIAL_SERVICES") {
      console.log(
        "⚖️ Currently Regulated:",
        formData.currentlyRegulated ? "Yes" : "No"
      );
    }
    console.log("✅ DIFCA Consent:", formData.difcaConsent ? "Provided" : "Not provided");
    console.log("🕒 Submitted At:", submission.submittedAt);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
    console.log("📝 NEXT STEPS (when backend is ready):");
    console.log("  1. ✉️  Send confirmation email to:", formData.contactInfo.email);
    console.log("  2. 💾 Create CRM record with reference number");
    console.log("  3. 🔔 Notify assigned team:", assignedTeam);
    console.log("  4. 📊 Generate analytics event");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Audit log consent decision
    if (formData.difcaConsent) {
      auditLog.log(DFSA_AUDIT_EVENTS.CONSENT_PROVIDED, {
        referenceNumber,
        email: formData.contactInfo.email,
      });
    } else {
      auditLog.log(DFSA_AUDIT_EVENTS.CONSENT_DECLINED, {
        referenceNumber,
        email: formData.contactInfo.email,
      });
    }

    // Audit log success
    auditLog.log(DFSA_AUDIT_EVENTS.ENQUIRY_API_SUCCESS, {
      referenceNumber,
      assignedTeam,
      email: formData.contactInfo.email,
    });

    // Return success response
    return {
      success: true,
      referenceNumber,
      assignedTeam,
      message: "Enquiry submitted successfully (frontend mock)",
      submittedAt: submission.submittedAt,
    };
  } catch (error) {
    // Audit log error
    auditLog.log(DFSA_AUDIT_EVENTS.ENQUIRY_API_ERROR, {
      error: error instanceof Error ? error.message : "Unknown error",
      email: formData.contactInfo.email,
    });

    throw error;
  }
}

/**
 * Helper function to validate enquiry data
 * Used for server-side validation when backend is implemented
 */
export function validateEnquiryData(
  formData: DFSAEnquirySignUpFormData
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields validation
  if (!formData.contactInfo.companyName)
    errors.push("Company name is required");
  if (!formData.contactInfo.contactName)
    errors.push("Contact name is required");
  if (!formData.contactInfo.email) errors.push("Email is required");
  if (!formData.contactInfo.phone) errors.push("Phone number is required");
  if (!formData.activityType) errors.push("Activity type is required");
  if (!formData.entityType) errors.push("Entity type is required");

  // Conditional validation
  if (formData.entityType === "OTHER" && !formData.entityTypeOther) {
    errors.push("Entity type specification is required");
  }

  if (
    formData.activityType === "FINANCIAL_SERVICES" &&
    formData.currentlyRegulated === null
  ) {
    errors.push("Regulatory status is required for Financial Services");
  }

  if (formData.difcaConsent === null) {
    errors.push("Consent decision is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default submitDFSAEnquiry;
