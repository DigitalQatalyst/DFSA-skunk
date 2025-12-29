import * as yup from "yup";
import { FormSchema, FormField } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

export const collateralGuideSchema: FormSchema = {
  formId: "collateral-user-guide",
  formTitle: "Collateral User Guide Request",
  formDescription:
    "Please complete the form below to request guidance on collateral procedures.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 15000,
  submitEndpoint: "https://kfrealexpressserver.vercel.app/api/v1/collateral/create-collateraluserguide",
  steps: [
    {
      stepTitle: "Personal & Company Information",
      stepDescription:
        "Please provide your personal and company details.",
      groups: [
        {
          groupTitle: "PERSONAL INFORMATION",
          fields: [
            {
              id: "submittedBy",
              label: "Name of Person Making the Submission",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.submitterName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.submitterName.helperText,
              validation: {
                minLength: 2,
                maxLength: 50,
                pattern: "^[a-zA-Z\\s\\-'\\.]+$",
                message: "Name can only contain letters, spaces, hyphens, apostrophes, and periods",
              },
            } as FormField,
            {
              id: "emailAddress",
              label: "Email Address",
              type: "email",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.email.placeholder,
              helperText: PLACEHOLDER_STANDARDS.email.helperText,
              validation: {
                maxLength: 254,
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                message: "Invalid email address",
              },
            } as FormField,
            {
              id: "telephoneNumber",
              label: "Telephone Number",
              type: "tel",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.telephoneNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.telephoneNumber.helperText,
              validation: {
                pattern: "^\\+?[1-9]\\d{1,14}$",
                message: "Please enter a valid phone number (E.164 format)",
              },
            } as FormField,
            {
              id: "position",
              label: "Position",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.position.placeholder,
              helperText: PLACEHOLDER_STANDARDS.position.helperText,
              validation: {
                minLength: 2,
                maxLength: 50,
                pattern: "^[a-zA-Z\\s\\-]+$",
                message: "Position can only contain letters, spaces, and hyphens",
              },
            } as FormField,
          ],
        },
        {
          groupTitle: "COMPANY INFORMATION",
          fields: [
            {
              id: "companyName",
              label: "Company Name",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.companyName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyName.helperText,
              validation: {
                minLength: 2,
                maxLength: 100,
                pattern: "^[a-zA-Z0-9\\s,.\\-#]+$",
                message: "Company name can only contain letters, numbers, spaces, and basic punctuation",
              },
            } as FormField,
            {
              id: "companyNumber",
              label: "Company Number",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.companyNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyNumber.helperText,
              validation: {
                minLength: 2,
                maxLength: 20,
                pattern: "^[a-zA-Z0-9\\-]+$",
                message: "Company number can only contain letters, numbers, and hyphens",
              },
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Asset Details",
      stepDescription: "Please provide asset details.",
      groups: [
        {
          groupTitle: "ASSET INFORMATION",
          fields: [
            {
              id: "assetName",
              label: "Asset Name",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.assetName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.assetName.helperText,
              validation: {
                minLength: 2,
                maxLength: 100,
                pattern: "^[a-zA-Z0-9\\s,.\\-#]+$",
                message: "Asset name can only contain letters, numbers, spaces, and basic punctuation",
              },
            } as FormField,
            {
              id: "assetNumber",
              label: "Asset Number",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.assetNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.assetNumber.helperText,
              validation: {
                minLength: 3,
                maxLength: 50,
                pattern: "^[a-zA-Z0-9\\-]+$",
                message: "Asset number can only contain letters, numbers, and hyphens",
              },
            } as FormField,
            {
              id: "additionalDetails",
              label: "Additional Details",
              type: "textarea",
              required: false,
              placeholder: PLACEHOLDER_STANDARDS.additionalDetails.placeholder,
              helperText: PLACEHOLDER_STANDARDS.additionalDetails.helperText,
              validation: {
                minLength: 10,
                maxLength: 2000,
                message: "Additional details must be between 10 and 2000 characters",
              },
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Review & Summary",
      stepDescription: "Please review all the information you've entered before submitting your request.",
      groups: [
        {
          groupTitle: "Review Your Information",
          groupDescription: "Review all entered details to ensure accuracy before proceeding to consent.",
          fields: [],
        },
      ],
    },
    {
      stepTitle: "Data Sharing Consent",
      stepDescription: "Provide your consent for data sharing.",
      groups: [
        {
          groupTitle: "DATA SHARING CONSENT",
          groupDescription:
            "I acknowledge that by providing this consent, my information may be shared with third party entities for the purpose of increasing the procurement and business opportunities. I understand that my information will be treated in accordance with applicable data protection laws and regulations.",
          fields: [
            {
              id: "dataSharingConsent",
              label:
                "I acknowledge that by providing this consent, my information may be shared with third party entities for the purpose of increasing the procurement and business opportunities. I understand that my information will be treated in accordance with applicable data protection laws and regulations.",
              type: "consent",
              required: true,
            } as FormField,
          ],
        },
      ],
    },
  ],
};

// Validation schema for the "Collateral User Guide" form
export const collateralGuideValidationSchema = yup.object({
  // Step 1: Personal & Company Information
  submittedBy: yup
    .string()
    .required("Submitter name is required")
    .min(2, "Submitter name must be at least 2 characters")
    .max(50, "Submitter name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
  emailAddress: yup
    .string()
    .required("Email address is required")
    .max(254, "Email address must not exceed 254 characters")
    .email("Please enter a valid email address")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address format"),
  telephoneNumber: yup
    .string()
    .required("Telephone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (E.164 format)"),
  position: yup
    .string()
    .required("Position is required")
    .min(2, "Position must be at least 2 characters")
    .max(50, "Position must not exceed 50 characters")
    .matches(/^[a-zA-Z\s\-]+$/, "Position can only contain letters, spaces, and hyphens"),
  companyName: yup
    .string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters")
    .matches(/^[a-zA-Z0-9\s,.\-#]+$/, "Company name can only contain letters, numbers, spaces, and basic punctuation"),
  companyNumber: yup
    .string()
    .required("Company number is required")
    .min(2, "Company number must be at least 2 characters")
    .max(20, "Company number must not exceed 20 characters")
    .matches(/^[a-zA-Z0-9\-]+$/, "Company number can only contain letters, numbers, and hyphens"),

  // Step 2: Asset Details
  assetName: yup
    .string()
    .required("Asset name is required")
    .min(2, "Asset name must be at least 2 characters")
    .max(100, "Asset name must not exceed 100 characters")
    .matches(/^[a-zA-Z0-9\s,.\-#]+$/, "Asset name can only contain letters, numbers, spaces, and basic punctuation"),
  assetNumber: yup
    .string()
    .required("Asset number is required")
    .min(3, "Asset number must be at least 3 characters")
    .max(50, "Asset number must not exceed 50 characters")
    .matches(/^[a-zA-Z0-9\-]+$/, "Asset number can only contain letters, numbers, and hyphens"),
  additionalDetails: yup
    .string()
    .optional()
    .min(10, "Additional details must be at least 10 characters")
    .max(2000, "Additional details must not exceed 2000 characters")
    .test('no-script-tags', 'Additional details cannot contain script tags', (value) => {
      if (!value) return true;
      return !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value);
    }),

  // Step 4: Data Sharing Consent
  dataSharingConsent: yup
    .boolean()
    .oneOf([true], "You must acknowledge the consent to proceed")
    .required("Consent acknowledgement is required"),
});
