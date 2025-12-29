import * as yup from "yup";
import { FormSchema, FormField } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

export const amendExistingLoanSchema: FormSchema = {
  formId: "request-to-amend-existing-loan-details",
  formTitle: "Request to Amend Existing Loan Details",
  formDescription:
    "Please complete the form below to proceed with your application.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 15000,
  submitEndpoint: "https://kfrealexpressserver.vercel.app/api/v1/loan/amend-loan",
  steps: [
    {
      stepTitle: "Applicant Details",
      stepDescription: "Provide your company and contact information.",
      groups: [
        {
          groupTitle: "COMPANY INFORMATION",
          fields: [
            {
              id: "companyName",
              label: "Company name",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.companyName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyName.helperText,
              required: true,
              validation: { 
                minLength: 2,
                maxLength: 100,
                pattern: "^[a-zA-Z0-9\\s,.\\-#]+$",
                message: "Company name can only contain letters, numbers, spaces, and basic punctuation"
              },
            } as FormField,
            {
              id: "companyNumber",
              label: "Company number",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.companyNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyNumber.helperText,
              required: true,
              validation: { 
                minLength: 2,
                maxLength: 20,
                pattern: "^[a-zA-Z0-9\\-]+$",
                message: "Company number can only contain letters, numbers, and hyphens"
              },
            } as FormField,
          ],
        },
        {
          groupTitle: "REQUESTER INFORMATION",
          fields: [
            {
              id: "submittedBy",
              label: "Name of person making the submission",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.submitterName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.submitterName.helperText,
              required: true,
              validation: { 
                minLength: 2,
                maxLength: 50,
                pattern: "^[a-zA-Z\\s\\-'\\.]+$",
                message: "Name can only contain letters, spaces, hyphens, apostrophes, and periods"
              },
            } as FormField,
            {
              id: "position",
              label: "Position",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.position.placeholder,
              helperText: PLACEHOLDER_STANDARDS.position.helperText,
              validation: { 
                minLength: 2,
                maxLength: 50,
                pattern: "^[a-zA-Z\\s\\-]+$",
                message: "Position can only contain letters, spaces, and hyphens"
              },
            } as FormField,
            {
              id: "emailAddress",
              label: "Email Address",
              type: "email",
              placeholder: PLACEHOLDER_STANDARDS.email.placeholder,
              helperText: PLACEHOLDER_STANDARDS.email.helperText,
              required: true,
              validation: {
                maxLength: 254,
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                message: "Invalid email address",
              },
            } as FormField,
            {
              id: "telephoneNumber",
              label: "Contact telephone number",
              type: "tel",
              placeholder: PLACEHOLDER_STANDARDS.telephoneNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.telephoneNumber.helperText,
              required: true,
              validation: {
                pattern: "^\\+?[1-9]\\d{1,14}$",
                message: "Please enter a valid phone number (E.164 format)",
              },
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Amend Existing Loan Details",
      stepDescription: "Specify the loan details you wish to amend.",
      groups: [
        {
          groupTitle: "LOAN DETAILS",
          fields: [
            {
              id: "fundingNumber",
              label: "Funding Request Number",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.fundingNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.fundingNumber.helperText,
              required: true,
              validation: {
                minLength: 3,
                maxLength: 50,
                pattern: "^[a-zA-Z0-9\\-]+$",
                message: "Funding number can only contain letters, numbers, and hyphens"
              },
            } as FormField,
            {
              id: "amendmentDescription",
              label: "Description",
              type: "textarea",
              placeholder:
                "Describe the changes you wish to make to your loan details...",
              required: true,
              validation: { minLength: 50, maxLength: 2000 },
            } as FormField,
          ],
        },
        {
          groupTitle: "UPLOAD DOCUMENTS",
          fields: [
            {
              id: "supportingDocuments",
              label: "Supporting Documents",
              type: "file",
              required: true,
              multiple: true,
              validation: {
                fileTypes: [".pdf", ".docx", ".jpg", ".png"],
                maxSize: 5242880,
                message: "File must be PDF, DOCX, JPG, or PNG and not exceed 5MB"
              },
            },
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
            },
          ],
        },
      ],
    },
  ],
};

// Validation schema for the "Request to Amend Existing Loan Details" form
export const amendExistingLoanValidationSchema = yup.object({
  // Step 1: Applicant Details
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
  submittedBy: yup
    .string()
    .required("Submitter name is required")
    .min(2, "Submitter name must be at least 2 characters")
    .max(50, "Submitter name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
  position: yup
    .string()
    .optional()
    .min(2, "Position must be at least 2 characters")
    .max(50, "Position must not exceed 50 characters")
    .matches(/^[a-zA-Z\s\-]+$/, "Position can only contain letters, spaces, and hyphens"),
  emailAddress: yup
    .string()
    .required("Email address is required")
    .max(254, "Email address must not exceed 254 characters")
    .email("Please enter a valid email address")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address format"),
  telephoneNumber: yup
    .string()
    .required("Contact telephone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (E.164 format)"),

  // Step 2: Amend Existing Loan Details
  fundingNumber: yup
    .string()
    .required("Funding request number is required")
    .min(3, "Funding number must be at least 3 characters")
    .max(50, "Funding number must not exceed 50 characters")
    .matches(/^[a-zA-Z0-9\-]+$/, "Funding number can only contain letters, numbers, and hyphens"),
  amendmentDescription: yup
    .string()
    .required("Amendment description is required")
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .test('no-script-tags', 'Description cannot contain script tags', (value) => {
      return !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value || '');
    }),
  supportingDocuments: yup
    .mixed()
    .required("Supporting documents are required")
    .test('fileSize', 'File size must not exceed 5MB', (value) => {
      if (!value) return true;
      if (value instanceof FileList) {
        return Array.from(value).every((file: File) => file.size <= 5242880);
      }
      if (value instanceof File) {
        return value.size <= 5242880;
      }
      return true;
    })
    .test('fileType', 'File must be PDF, DOCX, JPG, or PNG', (value) => {
      if (!value) return true;
      const allowedTypes = ['.pdf', '.docx', '.jpg', '.jpeg', '.png'];
      if (value instanceof FileList) {
        return Array.from(value).every((file: File) => {
          const ext = '.' + file.name.split('.').pop()?.toLowerCase();
          return allowedTypes.includes(ext);
        });
      }
      if (value instanceof File) {
        const ext = '.' + value.name.split('.').pop()?.toLowerCase();
        return allowedTypes.includes(ext);
      }
      return true;
    }),

  // Step 4: Data Sharing Consent
  dataSharingConsent: yup
    .boolean()
    .oneOf([true], "You must acknowledge the consent to proceed")
    .required("Consent acknowledgement is required"),
});
