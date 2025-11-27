import * as yup from "yup";
import { FormSchema, FormField } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

export const onboardingFormSchema: FormSchema = {
  formId: "onboarding-form",
  formTitle: "Complete Your Business Profile",
  formDescription:
    "Help us understand your business better by completing this onboarding form.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 15000,
  submitEndpoint: "/api/onboarding",
  steps: [
    {
      stepTitle: "Business Details",
      stepDescription: "Basic information about your business",
      groups: [
        {
          groupTitle: "Company Identity",
          groupDescription: "Basic information about your business",
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
              id: "registrationNumber",
              label: "Registration Number",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.companyRegistrationNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyRegistrationNumber.helperText,
              validation: {
                minLength: 3,
                maxLength: 50,
                pattern: "^[a-zA-Z0-9\\-]+$",
                message: "Registration number can only contain letters, numbers, and hyphens",
              },
            } as FormField,
            {
              id: "establishmentDate",
              label: "Establishment Date",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.dateFormat.placeholder,
              helperText: PLACEHOLDER_STANDARDS.dateFormat.helperText,
              validation: {
                pattern: "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$",
                message: "Please enter a valid date in DD/MM/YYYY format",
              },
            } as FormField,
            {
              id: "businessSize",
              label: "Business Size",
              type: "select",
              required: true,
              options: [
                { value: "micro", label: "Micro (1-9 employees)" },
                { value: "small", label: "Small (10-49 employees)" },
                { value: "medium", label: "Medium (50-249 employees)" },
                { value: "large", label: "Large (250+ employees)" },
              ],
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Business Profile",
      stepDescription: "Help us understand your business better",
      groups: [
        {
          groupTitle: "Business Description",
          groupDescription: "Describe your business and what it does",
          fields: [
            {
              id: "businessPitch",
              label: "Business Pitch",
              type: "textarea",
              required: true,
              placeholder: "Briefly describe what your business does",
              helperText: "A concise description of your business proposition",
              validation: {
                minLength: 20,
                maxLength: 500,
                message: "Business pitch must be between 20 and 500 characters",
              },
            } as FormField,
            {
              id: "problemStatement",
              label: "Problem Statement",
              type: "textarea",
              required: true,
              placeholder: "What problem does your business solve?",
              helperText: "Describe the market gap or problem your business addresses",
              validation: {
                minLength: 20,
                maxLength: 500,
                message: "Problem statement must be between 20 and 500 characters",
              },
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Location & Contact",
      stepDescription: "Where your business is based",
      groups: [
        {
          groupTitle: "Business Location",
          groupDescription: "Your business address and location",
          fields: [
            {
              id: "address",
              label: "Address",
              type: "text",
              required: true,
              placeholder: "e.g., 123 Business Street",
              helperText: "Your business street address",
              validation: {
                minLength: 5,
                maxLength: 200,
                message: "Address must be between 5 and 200 characters",
              },
            } as FormField,
            {
              id: "city",
              label: "City",
              type: "text",
              required: true,
              placeholder: "e.g., Abu Dhabi",
              helperText: "City where your business is located",
              validation: {
                pattern: "^[a-zA-Z\\s\\-]+$",
                message: "City name can only contain letters, spaces, and hyphens",
              },
            } as FormField,
            {
              id: "country",
              label: "Country",
              type: "select",
              required: true,
              options: [
                { value: "UAE", label: "United Arab Emirates" },
                { value: "KSA", label: "Saudi Arabia" },
                { value: "Qatar", label: "Qatar" },
                { value: "Bahrain", label: "Bahrain" },
                { value: "Kuwait", label: "Kuwait" },
                { value: "Oman", label: "Oman" },
                { value: "Other", label: "Other" },
              ],
            } as FormField,
            {
              id: "website",
              label: "Website",
              type: "text",
              required: false,
              placeholder: "https://www.example.com",
              helperText: "Your business website (if available)",
              validation: {
                pattern: "^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?$",
                message: "Please enter a valid website URL",
              },
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Operations",
      stepDescription: "Information about your team and founding",
      groups: [
        {
          groupTitle: "Team & History",
          groupDescription: "Details about your team and company history",
          fields: [
            {
              id: "employeeCount",
              label: "Employee Count",
              type: "number",
              required: true,
              placeholder: "e.g., 25",
              helperText: "Current number of employees in your company",
              validation: {
                min: 1,
                message: "Employee count must be at least 1",
              },
            } as FormField,
            {
              id: "founders",
              label: "Founders",
              type: "text",
              required: true,
              placeholder: "Names of founders, separated by commas",
              helperText: "Names of all company founders",
              validation: {
                minLength: 3,
                maxLength: 200,
                message: "Founders must be between 3 and 200 characters",
              },
            } as FormField,
            {
              id: "foundingYear",
              label: "Founding Year",
              type: "number",
              required: true,
              placeholder: "e.g., 2020",
              helperText: "Year when your company was founded",
              validation: {
                min: 1900,
                max: new Date().getFullYear(),
                message: `Founding year must be between 1900 and ${new Date().getFullYear()}`,
              },
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Funding",
      stepDescription: "Details about your business finances",
      groups: [
        {
          groupTitle: "Financial Information",
          groupDescription: "Your business capital and funding needs",
          fields: [
            {
              id: "initialCapitalUsd",
              label: "Initial Capital (USD)",
              type: "number",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.currencyAmount.placeholder,
              helperText: "Initial investment used to start the business",
              validation: {
                min: 0,
                message: "Initial capital must be a positive number",
              },
            } as FormField,
            {
              id: "fundingNeedsUsd",
              label: "Funding Needs (USD)",
              type: "number",
              required: false,
              placeholder: PLACEHOLDER_STANDARDS.currencyAmount.placeholder,
              helperText: "Additional funding you are currently seeking (if applicable)",
              validation: {
                min: 0,
                message: "Funding needs must be a positive number",
              },
            } as FormField,
            {
              id: "businessNeeds",
              label: "Business Needs",
              type: "textarea",
              required: true,
              placeholder: "List your top business needs (e.g., marketing, technology, mentorship)",
              helperText: "Describe what your business needs to succeed and grow",
              validation: {
                minLength: 10,
                maxLength: 1000,
                message: "Business needs must be between 10 and 1000 characters",
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
          groupTitle: "DATA SHARING CONSENT",
          groupDescription:
            "Please review our data sharing policy and provide your consent",
          fields: [
            {
              id: "dataSharingConsent",
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

// Validation schema for the Onboarding form
export const onboardingFormValidationSchema = yup.object({
  // Step 1: Business Details
  companyName: yup
    .string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters")
    .matches(/^[a-zA-Z0-9\s,.\-#]+$/, "Company name can only contain letters, numbers, spaces, and basic punctuation"),
  registrationNumber: yup
    .string()
    .required("Registration number is required")
    .min(3, "Registration number must be at least 3 characters")
    .max(50, "Registration number must not exceed 50 characters")
    .matches(/^[a-zA-Z0-9\-]+$/, "Registration number can only contain letters, numbers, and hyphens"),
  establishmentDate: yup
    .string()
    .required("Establishment date is required")
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, "Please enter a valid date in DD/MM/YYYY format"),
  businessSize: yup
    .string()
    .required("Business size is required"),

  // Step 2: Business Profile
  businessPitch: yup
    .string()
    .required("Business pitch is required")
    .min(20, "Business pitch must be at least 20 characters")
    .max(500, "Business pitch must not exceed 500 characters"),
  problemStatement: yup
    .string()
    .required("Problem statement is required")
    .min(20, "Problem statement must be at least 20 characters")
    .max(500, "Problem statement must not exceed 500 characters"),

  // Step 3: Location & Contact
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters"),
  city: yup
    .string()
    .required("City is required")
    .matches(/^[a-zA-Z\s\-]+$/, "City name can only contain letters, spaces, and hyphens"),
  country: yup
    .string()
    .required("Country is required"),
  website: yup
    .string()
    .optional()
    .matches(/^(https?:\/\/)?([da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/, "Please enter a valid website URL"),

  // Step 4: Operations
  employeeCount: yup
    .number()
    .required("Employee count is required")
    .min(1, "Employee count must be at least 1"),
  founders: yup
    .string()
    .required("Founders are required")
    .min(3, "Founders must be at least 3 characters")
    .max(200, "Founders must not exceed 200 characters"),
  foundingYear: yup
    .number()
    .required("Founding year is required")
    .min(1900, "Founding year must be at least 1900")
    .max(new Date().getFullYear(), `Founding year cannot be later than ${new Date().getFullYear()}`),

  // Step 5: Funding
  initialCapitalUsd: yup
    .number()
    .required("Initial capital is required")
    .min(0, "Initial capital must be a positive number"),
  fundingNeedsUsd: yup
    .number()
    .optional()
    .min(0, "Funding needs must be a positive number"),
  businessNeeds: yup
    .string()
    .required("Business needs are required")
    .min(10, "Business needs must be at least 10 characters")
    .max(1000, "Business needs must not exceed 1000 characters"),

  // Step 7: Data Sharing Consent
  dataSharingConsent: yup
    .boolean()
    .oneOf([true], "You must acknowledge the consent to proceed")
    .required("Consent acknowledgement is required"),
});
