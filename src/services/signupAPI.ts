// Signup API service for CRM integration
import { submitUserSignup, UserSignupPayload } from "../pages/api/stage02-Forms/userSignup";

export interface SignupFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  companyName: string;
  countryRegion: string;
  lifecycleStage: string;
  agreeToTerms: boolean;
  email: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const signupAPI = {
  /**
   * Submit user signup data to CRM
   */
  async submitSignup(formData: SignupFormData): Promise<SignupResponse> {
    try {
      // Validate data before sending
      const validation = this.validateFormData(formData);
      if (!validation.isValid) {
        console.error("❌ Client validation failed:", validation.errors);
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // Keep data in camelCase format
      const apiPayload: UserSignupPayload = {
        firstName: String(formData.firstName || "").trim(),
        lastName: String(formData.lastName || "").trim(),
        phoneNumber: String(formData.phoneNumber || "").trim(),
        companyName: String(formData.companyName || "").trim(),
        countryRegion: String(formData.countryRegion || "").trim(),
        lifecycleStage: String(formData.lifecycleStage || "").trim(),
        agreeToTerms: Boolean(formData.agreeToTerms),
        email: String(formData.email || "").trim(),
      };

      console.log("📤 Original form data:", formData);
      console.log("📤 API payload:", apiPayload);
      
      // Use the dedicated signup API handler
      const result = await submitUserSignup(apiPayload);

      console.log("✅ Signup successful:", result);
      return {
        success: true,
        message: result.message || "Account created successfully",
        data: result,
      };
    } catch (error) {
      console.error("❌ Signup Service Error:", {
        error: error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return {
        success: false,
        message: error instanceof Error 
          ? error.message 
          : "An unexpected error occurred. Please try again.",
      };
    }
  },

  /**
   * Validate form data before submission
   */
  validateFormData(formData: SignupFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required field validation
    if (!formData.firstName?.trim()) errors.push("First name is required");
    if (!formData.lastName?.trim()) errors.push("Last name is required");
    if (!formData.email?.trim()) errors.push("Email is required");
    if (!formData.phoneNumber?.trim()) errors.push("Phone number is required");
    if (!formData.companyName?.trim()) errors.push("Company name is required");
    if (!formData.countryRegion?.trim()) errors.push("Country/Region is required");
    if (!formData.lifecycleStage?.trim()) errors.push("Lifecycle stage is required");

    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    // Phone number format validation (basic)
    if (formData.phoneNumber && !/^\+?[1-9]\d{9,14}$/.test(formData.phoneNumber.replace(/\s|-/g, ""))) {
      errors.push("Please enter a valid phone number with country code");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default signupAPI;