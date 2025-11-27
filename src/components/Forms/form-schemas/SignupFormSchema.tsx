import * as yup from "yup";
import { FormSchema, FormField } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

export const signupFormSchema: FormSchema = {
  formId: "user-signup-form",
  formTitle: "Join Enterprise Journey",
  formDescription: "Create your account to access UAE's leading business growth platform with funding opportunities, mentorship, and enterprise resources.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 15000,
  submitEndpoint: "/api/signup",
  steps: [
    {
      stepTitle: "Personal Information",
      stepDescription: "Please provide your personal details",
      groups: [
        {
          groupTitle: "Your Details",
          groupDescription: "Enter your personal information",
          fields: [
            {
              id: "firstName",
              label: "First Name",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.submitterName.placeholder,
              helperText: "Enter your first name",
              validation: {
                minLength: 2,
                maxLength: 50,
                pattern: "^[a-zA-Z\\s\\-'\\.]+$",
                message: "Name can only contain letters, spaces, hyphens, apostrophes, and periods",
              },
            } as FormField,
            {
              id: "lastName",
              label: "Last Name",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.submitterName.placeholder,
              helperText: "Enter your last name",
              validation: {
                minLength: 2,
                maxLength: 50,
                pattern: "^[a-zA-Z\\s\\-'\\.]+$",
                message: "Name can only contain letters, spaces, hyphens, apostrophes, and periods",
              },
            } as FormField,
            {
              id: "email",
              label: "Email",
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
              id: "phoneNumber",
              label: "Phone Number",
              type: "tel",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.phoneNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.phoneNumber.helperText,
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
      stepTitle: "Enterprise Details",
      stepDescription: "Please provide your company information",
      groups: [
        {
          groupTitle: "Your Enterprise Details",
          groupDescription: "Enter your company information",
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
              id: "countryRegion",
              label: "Country/Region",
              type: "select",
              required: true,
              placeholder: "Select your country/region",
              globalOptionSet: "countries",
            } as FormField,
            {
              id: "lifecycleStage",
              label: "Lifecycle Stage",
              type: "select",
              required: true,
              placeholder: "Select your business stage",
              options: [
                { value: "startup", label: "Start Up Stage" },
                { value: "scaleup", label: "Scale Up Stage" },
                { value: "expansion", label: "Expansion Stage" },
              ],
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
          groupTitle: "DATA SHARING CONSENT",
          groupDescription:
            "Please review our data sharing policy and provide your consent",
          fields: [
            {
              id: "consent",
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

// Validation schema for the Sign Up form
export const signupFormValidationSchema = yup.object({
  // Step 1: Personal Information
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
  email: yup
    .string()
    .required("Email address is required")
    .max(254, "Email address must not exceed 254 characters")
    .email("Please enter a valid email address")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address format"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (E.164 format)"),

  // Step 2: Enterprise Details
  companyName: yup
    .string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters")
    .matches(/^[a-zA-Z0-9\s,.\-#]+$/, "Company name can only contain letters, numbers, spaces, and basic punctuation"),
  countryRegion: yup
    .string()
    .required("Country/Region is required"),
  lifecycleStage: yup
    .string()
    .required("Lifecycle stage is required"),

  // Step 4: Data Sharing Consent
  consent: yup
    .boolean()
    .oneOf([true], "You must acknowledge the consent to proceed")
    .required("Consent acknowledgement is required"),
});