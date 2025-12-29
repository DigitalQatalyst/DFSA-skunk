import * as yup from "yup";
import { FormSchema, FormField } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

export const bookConsultationSchema: FormSchema = {
  formId: "book-consultation-form",
  formTitle: "Book Consultation for Entrepreneurs",
  formDescription:
    "Please complete the form below to proceed with your application.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000,
  submitEndpoint: "https://kfrealexpressserver.vercel.app/api/v1/consultation/book-consultation",
  steps: [
    {
      stepTitle: "Personal & Company Information",
      stepDescription:
        "Enter your personal details and company information.",
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
                pattern: "^[a-zA-ZÀ-ÿ' -]+$",
                minLength: 1,
                maxLength: 255,
                message: "Name can only contain letters, spaces, hyphens, and apostrophes",
              },
            } as FormField,
            {
              id: "emailAddress1",
              label: "Email Address",
              type: "email",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.email.placeholder,
              helperText: PLACEHOLDER_STANDARDS.email.helperText,
              validation: {
                pattern: "^[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,}$",
                minLength: 5,
                maxLength: 254,
                message: "Please enter a valid email address",
              },
            } as FormField,
            {
              id: "mobileNumber",
              label: "Mobile Number",
              type: "tel",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.phoneNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.phoneNumber.helperText,
              validation: {
                pattern: "^\\+?[0-9\\s\\-\\(\\)]+$",
                minLength: 7,
                maxLength: 15,
                message: "Please enter a valid phone number",
              },
            } as FormField,
            {
              id: "position",
              label: "Position",
              type: "select",
              required: true,
              options: [
                { label: "Admin", value: "Admin" },
                { label: "Manager", value: "Manager" },
                { label: "Director", value: "Director" },
                { label: "CEO", value: "CEO" },
                { label: "Owner/Founder", value: "Owner/Founder" },
                { label: "Other", value: "Other" },
              ],
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
                pattern: "^[\\w\\s.,'!?-]+$",
                minLength: 2,
                maxLength: 255,
                message: "Company name contains invalid characters",
              },
            } as FormField,
            {
              id: "compannyNumber",
              label: "Company Number",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.companyNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyNumber.helperText,
              validation: {
                pattern: "^[A-Za-z0-9]+$",
                minLength: 1,
                maxLength: 50,
                message: "Company number must be alphanumeric",
              },
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Consultation Details",
      stepDescription:
        "Select the type of consultation and provide additional information.",
      groups: [
        {
          groupTitle: "CONSULTATION INFORMATION",
          fields: [
            {
              id: "consultationType",
              label: "Consultation Type",
              type: "select",
              required: true,
              options: [
                { label: "Group Session", value: "Group Session" },
              ],
            } as FormField,
            {
              id: "consultationName",
              label: "Consultation Name",
              type: "select",
              required: true,
              placeholder: "Select consultation type",
              options: [
                { label: "Financial", value: "financial" },
                { label: "Marketing", value: "marketing" },
                { label: "Operations", value: "operations" },
                { label: "Strategy", value: "strategy" },
                { label: "Other", value: "other" },
              ],
            } as FormField,
            {
              id: "existingBusiness",
              label: "Is this an existing business?",
              type: "select",
              required: true,
              options: [
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ],
            } as FormField,
            {
              id: "businessOwnership",
              label: "Do you own the business?",
              type: "select",
              required: true,
              options: [
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ],
            } as FormField,
            {
              id: "worksHere",
              label: "Do you work in this business?",
              type: "select",
              required: true,
              options: [
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ],
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Advice Selection",
      stepDescription:
        "Select the advice you would like to receive consultation for.",
      groups: [
        {
          groupTitle: "ADVICE SELECTION",
          fields: [
            {
              id: "selectedAdvice",
              label: "Selected Advice",
              type: "select",
              required: true,
              options: [
                { label: "Review Business Model", value: "Review Business Model" },
                { label: "Review Market Position", value: "Review Market Position" },
                { label: "Revise Partnership", value: "Revise Partnership" },
                { label: "Review Scale of the Project", value: "Review Scale of the Project" },
                { label: "Review Performance Management", value: "Review Performance Management" },
                { label: "Review Quality Management", value: "Review Quality Management" },
                { label: "Review Financial Controls", value: "Review Financial Controls" },
                { label: "Review Cost Management", value: "Review Cost Management" },
                { label: "Advise on Market Research", value: "Advise on Market Research" },
                { label: "Advise on Corporate Governance", value: "Advise on Corporate Governance" },
                { label: "Advise on Sales", value: "Advise on Sales" },
                { label: "Advise on Human Resources", value: "Advise on Human Resources" },
                { label: "Advise on Customer Service", value: "Advise on Customer Service" },
                { label: "Advise on Logistics", value: "Advise on Logistics" },
                { label: "Advise on IT Support", value: "Advise on IT Support" },
                { label: "Advise on Branding", value: "Advise on Branding" },
                { label: "Advise on Review Financial Performance", value: "Advise on Review Financial Performance" },
              ],
            } as FormField,
            {
              id: "otherAdvices",
              label: "Other Advices (Optional)",
              type: "text",
              required: false,
              placeholder: PLACEHOLDER_STANDARDS.otherAdvice.placeholder,
              helperText: PLACEHOLDER_STANDARDS.otherAdvice.helperText,
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Review & Summary",
      stepDescription: "Please review all the information you've entered before submitting your application.",
      groups: [
        {
          groupTitle: "Review Your Information",
          groupDescription: "Review all entered details to ensure accuracy before proceeding to confirmation.",
          fields: [],
        },
      ],
    },
    {
      stepTitle: "Confirmation & Submit",
      stepDescription: "Confirm your information before submitting.",
      groups: [
        {
          groupTitle: "CONFIRMATION",
          fields: [
            {
              id: "termsAgreed",
              label: "I confirm that the information provided is accurate and complete.",
              type: "checkbox",
              required: true,
            } as FormField,
          ],
        },
      ],
    },
  ],
};

// Validation schema
export const bookConsultationValidationSchema = yup.object({
  // Step 1 fields
  submittedBy: yup
    .string()
    .required("Submitted by is required"),

  emailAddress1: yup
    .string()
    .email("Invalid email address")
    .required("Email address is required"),

  mobileNumber: yup
    .string()
    .matches(
      /^\+971\s?\d{2}\s?\d{3}\s?\d{4}$/,
      "Invalid UAE mobile number. Format: +971 XX XXX XXXX"
    )
    .required("Mobile number is required"),

  position: yup.string().required("Position is required"),

  companyName: yup.string().required("Company name is required"),

  compannyNumber: yup.string().required("Company number is required"),

  // Step 2 fields
  consultationType: yup.string().required("Consultation type is required"),

  consultationName: yup.string().required("Consultation name is required"),

  existingBusiness: yup.string().required("Please specify if this is an existing business"),

  businessOwnership: yup.string().required("Please specify if you own the business"),

  worksHere: yup.string().required("Please specify if you work in the business"),

  // Step 3 fields
  selectedAdvice: yup.string().required("Please select an advice"),

  otherAdvices: yup.string().optional(),

  // Step 4 fields
  termsAgreed: yup
    .boolean()
    .oneOf([true], "You must agree to the terms and conditions")
    .required("Consent is required"),
});
