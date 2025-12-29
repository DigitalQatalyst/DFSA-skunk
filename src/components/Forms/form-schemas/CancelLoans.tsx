import * as yup from "yup";
import { FormSchema, FormField } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

// Define the form schema for the "Loan Cancellation" form
export const loanCancellationSchema: FormSchema = {
  formId: "cancel-loan",
  formTitle: "Cancel Loan Request",
  formDescription:
    "Please complete this form to request the cancellation of your existing loan. Provide all required information and documentation to process your request.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000,
  submitEndpoint: "https://kfrealexpressserver.vercel.app/api/v1/loan/cancel-loan",
  steps: [
    {
      stepTitle: "Personal Information",
      stepDescription:
        "Please provide your personal details and contact information",
      groups: [
        {
          groupTitle: "Personal Details",
          groupDescription:
            "Enter your personal information for the loan cancellation request",
          fields: [
            {
              id: "submittedBy",
              label: "Name of Person Making the Submission",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.submitterName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.submitterName.helperText,
              readOnly: true, // 👈 Make read-only
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
              readOnly: true, // 👈 Make read-only
              validation: {
                maxLength: 254,
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                message: "Invalid email address",
              },
            } as FormField,
            {
              id: "telephoneNumber",
              label: "Contact Telephone Number",
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
              type: "select",
              required: true,
              options: [
                { value: "Junior", label: "Junior" },
                { value: "Senior", label: "Senior" },
                { value: "Manager", label: "Manager" },
                { value: "Director", label: "Director" },
                { value: "CEO", label: "CEO" },
                { value: "Owner/Founder", label: "Owner/Founder" },
                { value: "Other", label: "Other" },
              ],
            } as FormField,
            {
              id: "fundingNumber",
              label: "Funding Request Number",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.fundingNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.fundingNumber.helperText,
              validation: {
                minLength: 3,
                maxLength: 50,
                pattern: "^[a-zA-Z0-9\\-]+$",
                message: "Funding number can only contain letters, numbers, and hyphens",
              },
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Company & Cancellation Details",
      stepDescription:
        "Please provide company information and cancellation details",
      groups: [
        {
          groupTitle: "Company Information",
          groupDescription: "Enter your company details (if applicable)",
          fields: [
            {
              id: "companyName",
              label: "Company Name",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.companyName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyName.helperText,
              readOnly: true, // 👈 Make read-only
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
              readOnly: true, // 👈 Make read-only
              validation: {
                minLength: 2,
                maxLength: 20,
                pattern: "^[a-zA-Z0-9\\-]+$",
                message: "Company number can only contain letters, numbers, and hyphens",
              },
            } as FormField,
          ],
        },
        {
          groupTitle: "Cancellation Information",
          groupDescription:
            "Provide details about your loan cancellation request",
          fields: [
            {
              id: "cancellationDetails",
              label: "Cancellation Details",
              type: "textarea",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.cancellationDetails.placeholder,
              helperText: PLACEHOLDER_STANDARDS.cancellationDetails.helperText,
              validation: {
                minLength: 10,
                maxLength: 2000,
                message: "Cancellation details must be between 10 and 2000 characters",
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
      stepDescription: "Provide your consent for data sharing",
      groups: [
        {
          groupTitle: "Data Sharing Consent",
          groupDescription:
              "Please review our data sharing policy and provide your consent",
          fields: [
            {
              id: "consentAcknowledgement",
              label:
                  "I acknowledge that by providing this consent, my information may be shared with third-party entities for the purpose of increasing the procurement and business opportunities. I understand that my information will be treated in accordance with applicable data protection laws and regulations.",
              type: "consent",
              required: true,
            } as FormField,
          ],
        },
      ],
    },
  ],
};

// Validation schema for the "Loan Cancellation" form
export const loanCancellationValidationSchema = yup.object({
  // Step 1 fields
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
    .required("Contact telephone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (E.164 format)"),
  position: yup.string().required("Position is required"),
  fundingNumber: yup
    .string()
    .required("Funding request number is required")
    .min(3, "Funding number must be at least 3 characters")
    .max(50, "Funding number must not exceed 50 characters")
    .matches(/^[a-zA-Z0-9\-]+$/, "Funding number can only contain letters, numbers, and hyphens"),

  // Step 2 fields
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
  cancellationDetails: yup
    .string()
    .required("Cancellation details are required")
    .min(10, "Cancellation details must be at least 10 characters")
    .max(2000, "Cancellation details must not exceed 2000 characters")
    .test('no-script-tags', 'Cancellation details cannot contain script tags', (value) => {
      if (!value) return true;
      return !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value);
    }),

  // Step 4 fields (Data Sharing Consent)
  consentAcknowledgement: yup
    .boolean()
    .oneOf([true], "You must acknowledge the consent to proceed")
    .required("Consent acknowledgement is required"),
});
