/**
 * Form Placeholder Standards
 * 
 * Industry-standard placeholders for consistent UX across all forms.
 * These standards ensure users understand the expected format and can provide correct information.
 * 
 * Best Practices:
 * 1. Show format/pattern examples (especially for structured data)
 * 2. Include units/format hints where relevant
 * 3. Use realistic examples that demonstrate the expected structure
 * 4. Use UAE/local context when appropriate
 * 5. Be clear and concise (placeholders should be short, helperText for detailed explanations)
 */

export const PLACEHOLDER_STANDARDS = {
  // Personal Information
  fullName: {
    placeholder: "e.g., Ahmed Al Mansoori",
    helperText: "Enter your full name as it appears on official documents",
  },
  submitterName: {
    placeholder: "e.g., John Smith",
    helperText: "Enter the name of the person making this submission",
  },
  firstName: {
    placeholder: "e.g., John",
    helperText: "Enter the first name",
  },
  lastName: {
    placeholder: "e.g., Smith",
    helperText: "Enter the last name",
  },

  // Contact Information
  email: {
    placeholder: "name@company.ae",
    helperText: "Enter a valid business or personal email address",
  },
  phoneNumber: {
    placeholder: "+971 50 123 4567",
    helperText: "Include country code (+971) followed by your 9-digit mobile number",
  },
  telephoneNumber: {
    placeholder: "+971 50 123 4567",
    helperText: "Include country code (+971) followed by your 9-digit number",
  },
  
  // Company Information
  companyName: {
    placeholder: "e.g., Tech Solutions LLC",
    helperText: "Enter your company's registered legal name",
  },
  companyNumber: {
    placeholder: "e.g., CR-12345-2023",
    helperText: "Format: CR-XXXXX-YYYY (Commercial Registration Number)",
  },
  companyRegistrationNumber: {
    placeholder: "e.g., 12345678",
    helperText: "Enter your company registration or license number",
  },
  
  // Financial Information
  amountAED: {
    placeholder: "e.g., 50,000.00",
    helperText: "Enter amount in AED (United Arab Emirates Dirham)",
  },
  currencyAmount: {
    placeholder: "e.g., 50,000",
    helperText: "Enter the amount in the specified currency",
  },
  
  // Identification Numbers
  fundingNumber: {
    placeholder: "e.g., FR-12345678",
    helperText: "Format: FR-XXXXXXXX (Funding Request Number)",
  },
  projectName: {
    placeholder: "e.g., Green Energy Solution",
    helperText: "Enter the name of your project or initiative",
  },
  
  // Asset Information
  assetName: {
    placeholder: "e.g., Commercial Property - Building A",
    helperText: "Enter a descriptive name for the asset",
  },
  assetNumber: {
    placeholder: "e.g., AST-12345",
    helperText: "Enter the asset identification number if available",
  },
  
  // Position/Title
  position: {
    placeholder: "Select your position",
    helperText: "Choose your role or position in the organization",
  },
  
  // Text Areas
  additionalDetails: {
    placeholder: "Optional: Provide any additional details or comments",
    helperText: "Leave blank if not applicable",
  },
  cancellationDetails: {
    placeholder: "e.g., Project postponed due to budget constraints",
    helperText: "Please provide specific reasons for the cancellation",
  },
  notes: {
    placeholder: "Optional: Any additional information or instructions",
    helperText: "Include any relevant details that may help process your request",
  },
  
  // Dates
  dateFormat: {
    placeholder: "DD/MM/YYYY",
    helperText: "Select or enter date in DD/MM/YYYY format",
  },
  
  // Support Letter Specific
  letterRecipient: {
    placeholder: "e.g., John Smith or Organization Name",
    helperText: "Enter the name of the person or organization receiving the letter",
  },
  letterPurpose: {
    placeholder: "e.g., Requesting visa support for business travel",
    helperText: "Briefly describe the purpose of the support letter",
  },
  
  // Consultation Specific
  consultationType: {
    placeholder: "Select consultation type",
    helperText: "Choose the type of consultation you require",
  },
  otherAdvice: {
    placeholder: "Optional: Additional advice or comments",
    helperText: "Leave blank if not applicable",
  },
} as const;

/**
 * Helper function to get standardized placeholder with optional helper text
 */
export function getPlaceholder(
  fieldType: keyof typeof PLACEHOLDER_STANDARDS,
  includeHelperText = false
): string | { placeholder: string; helperText?: string } {
  const standard = PLACEHOLDER_STANDARDS[fieldType];
  
  if (includeHelperText) {
    return {
      placeholder: standard.placeholder,
      helperText: standard.helperText,
    };
  }
  
  return standard.placeholder;
}

/**
 * Common field configurations following standards
 */
export const STANDARD_FIELD_CONFIGS = {
  // Personal Info Fields
  submitterNameField: {
    placeholder: PLACEHOLDER_STANDARDS.submitterName.placeholder,
    helperText: PLACEHOLDER_STANDARDS.submitterName.helperText,
  },

  firstNameField: {
    placeholder: PLACEHOLDER_STANDARDS.firstName.placeholder,
    helperText: PLACEHOLDER_STANDARDS.firstName.helperText,
  },

  lastNameField: {
    placeholder: PLACEHOLDER_STANDARDS.lastName.placeholder,
    helperText: PLACEHOLDER_STANDARDS.lastName.helperText,
  },
  
  emailField: {
    placeholder: PLACEHOLDER_STANDARDS.email.placeholder,
    helperText: PLACEHOLDER_STANDARDS.email.helperText,
  },
  
  phoneField: {
    placeholder: PLACEHOLDER_STANDARDS.phoneNumber.placeholder,
    helperText: PLACEHOLDER_STANDARDS.phoneNumber.helperText,
  },
  
  // Company Fields
  companyNameField: {
    placeholder: PLACEHOLDER_STANDARDS.companyName.placeholder,
    helperText: PLACEHOLDER_STANDARDS.companyName.helperText,
  },
  
  companyNumberField: {
    placeholder: PLACEHOLDER_STANDARDS.companyNumber.placeholder,
    helperText: PLACEHOLDER_STANDARDS.companyNumber.helperText,
  },
  
  // Financial Fields
  amountAEDField: {
    placeholder: PLACEHOLDER_STANDARDS.amountAED.placeholder,
    helperText: PLACEHOLDER_STANDARDS.amountAED.helperText,
  },
  
  // ID Fields
  fundingNumberField: {
    placeholder: PLACEHOLDER_STANDARDS.fundingNumber.placeholder,
    helperText: PLACEHOLDER_STANDARDS.fundingNumber.helperText,
  },
} as const;

