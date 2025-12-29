import * as yup from "yup";
import { FormSchema, FormField } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

export const DisburseApprovedLoanSchema: FormSchema = {
  formId: "disburse-approved-loan",
  formTitle: "Disburse an Approved Loan",
  formDescription:
    "Please fill out the details to disburse the approved loan. Ensure that all information is correct before confirming the disbursement.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000, // Auto-save every 20 seconds
  submitEndpoint: "",

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
                minLength: 2,
                maxLength: 50,
                pattern: "^[a-zA-Z\\s\\-'\\.]+$",
                message: "Name can only contain letters, spaces, hyphens, apostrophes, and periods"
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
            {
              id: "position",
              label: "Position",
              type: "select",
              required: true,
              options: [
                { value: "Project Manager", label: "Project Manager" },
                { value: "Senior Manager", label: "Senior Manager" },
                { value: "Director", label: "Director" },
                { value: "CEO", label: "CEO" },
                { value: "Owner/Founder", label: "Owner/Founder" },
                { value: "Other", label: "Other" },
              ],
            },
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
                message: "Company name can only contain letters, numbers, spaces, and basic punctuation"
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
                message: "Company number can only contain letters, numbers, and hyphens"
              },
            } as FormField,
            {
              id: "fundingNumber",
              label: "Funding Number",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.fundingNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.fundingNumber.helperText,
              validation: {
                minLength: 3,
                maxLength: 50,
                pattern: "^[a-zA-Z0-9\\-]+$",
                message: "Funding number can only contain letters, numbers, and hyphens"
              },
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Disbursement Details",
      stepDescription:
        "Specify the amount and payment method for the disbursement.",
      groups: [
        {
          groupTitle: "DISBURSEMENT INFORMATION",
          fields: [
            {
              id: "amountInAED",
              label: "Amount in AED",
              type: "number",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.amountAED.placeholder,
              helperText: PLACEHOLDER_STANDARDS.amountAED.helperText,
              validation: {
                min: 1,
                max: 999999999.99,
                pattern: "^\\d+(\\.\\d{1,2})?$",
                message: "Please enter a valid amount with up to 2 decimal places"
              },
            } as FormField,
            {
              id: "paymentMethod",
              label: "Payment Method",
              type: "select",
              required: true,
              options: [
                { value: "Cheque", label: "Cheque" },
                { value: "Bank Transfer", label: "Bank Transfer" },
                { value: "Cash", label: "Cash" },
                { value: "Other", label: "Other" },
              ],
            },
            {
              id: "otherOptional",
              label: "Other Payment Details (Optional)",
              type: "text",
              placeholder: "N/A",
              validation: {
                maxLength: 500,
                pattern: "^[a-zA-Z0-9\\s,.\\-#]*$",
                message: "Payment details can only contain letters, numbers, spaces, and basic punctuation"
              },
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Required Documents",
      stepDescription:
        "Upload all required documents for the loan disbursement.",
      groups: [
        {
          groupTitle: "DOCUMENT UPLOADS",
          fields: [
            {
              id: "supplierLicense",
              label: "Supplier License",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
              validation: {
                fileTypes: [".pdf", ".doc", ".docx"],
                maxSize: 5242880,
                message: "File must be PDF, DOC, or DOCX and not exceed 5MB"
              },
            } as FormField,
            {
              id: "officialQuotations",
              label: "Official Quotations",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
              validation: {
                fileTypes: [".pdf", ".doc", ".docx"],
                maxSize: 5242880,
                message: "File must be PDF, DOC, or DOCX and not exceed 5MB"
              },
            } as FormField,
            {
              id: "invoices",
              label: "Invoices",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
              validation: {
                fileTypes: [".pdf", ".doc", ".docx"],
                maxSize: 5242880,
                message: "File must be PDF, DOC, or DOCX and not exceed 5MB"
              },
            } as FormField,
            {
              id: "deliveryNotes",
              label: "Delivery Notes",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
              validation: {
                fileTypes: [".pdf", ".doc", ".docx"],
                maxSize: 5242880,
                message: "File must be PDF, DOC, or DOCX and not exceed 5MB"
              },
            } as FormField,
            {
              id: "paymentReceipts",
              label: "Payment Receipts",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
              validation: {
                fileTypes: [".pdf", ".doc", ".docx"],
                maxSize: 5242880,
                message: "File must be PDF, DOC, or DOCX and not exceed 5MB"
              },
            } as FormField,
            {
              id: "employeeList",
              label: "Employee List",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
              validation: {
                fileTypes: [".pdf", ".doc", ".docx"],
                maxSize: 5242880,
                message: "File must be PDF, DOC, or DOCX and not exceed 5MB"
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
          groupDescription: "Review all entered details to ensure accuracy before proceeding to confirmation.",
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

// Validation schema for the "Disburse an Approved Loan" form
export const disburseApprovedLoanValidationSchema = yup.object({
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
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (E.164 format)"),
  position: yup
    .string()
    .required("Position is required"),
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
  fundingNumber: yup
    .string()
    .required("Funding number is required")
    .min(3, "Funding number must be at least 3 characters")
    .max(50, "Funding number must not exceed 50 characters")
    .matches(/^[a-zA-Z0-9\-]+$/, "Funding number can only contain letters, numbers, and hyphens"),

  // Step 2: Disbursement Details
  amountInAED: yup
    .number()
    .required("Amount in AED is required")
    .min(1, "Amount must be at least 1 AED")
    .max(999999999.99, "Amount must not exceed 999,999,999.99 AED")
    .test('decimal-places', 'Amount can have at most 2 decimal places', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  paymentMethod: yup
    .string()
    .required("Payment method is required"),
  otherOptional: yup
    .string()
    .optional()
    .max(500, "Payment details must not exceed 500 characters")
    .matches(/^[a-zA-Z0-9\s,.\-#]*$/, "Payment details can only contain letters, numbers, spaces, and basic punctuation"),

  // Step 3: Required Documents
  supplierLicense: yup
    .mixed()
    .required("Supplier license is required")
    .test('fileSize', 'File size must not exceed 5MB', (value) => {
      if (!value) return true;
      if (value instanceof File) return value.size <= 5242880;
      return true;
    })
    .test('fileType', 'File must be PDF, DOC, or DOCX', (value) => {
      if (!value) return true;
      if (value instanceof File) {
        const ext = '.' + value.name.split('.').pop()?.toLowerCase();
        return ['.pdf', '.doc', '.docx'].includes(ext);
      }
      return true;
    }),
  officialQuotations: yup
    .mixed()
    .required("Official quotations are required")
    .test('fileSize', 'File size must not exceed 5MB', (value) => {
      if (!value) return true;
      if (value instanceof File) return value.size <= 5242880;
      return true;
    })
    .test('fileType', 'File must be PDF, DOC, or DOCX', (value) => {
      if (!value) return true;
      if (value instanceof File) {
        const ext = '.' + value.name.split('.').pop()?.toLowerCase();
        return ['.pdf', '.doc', '.docx'].includes(ext);
      }
      return true;
    }),
  invoices: yup
    .mixed()
    .required("Invoices are required")
    .test('fileSize', 'File size must not exceed 5MB', (value) => {
      if (!value) return true;
      if (value instanceof File) return value.size <= 5242880;
      return true;
    })
    .test('fileType', 'File must be PDF, DOC, or DOCX', (value) => {
      if (!value) return true;
      if (value instanceof File) {
        const ext = '.' + value.name.split('.').pop()?.toLowerCase();
        return ['.pdf', '.doc', '.docx'].includes(ext);
      }
      return true;
    }),
  deliveryNotes: yup
    .mixed()
    .required("Delivery notes are required")
    .test('fileSize', 'File size must not exceed 5MB', (value) => {
      if (!value) return true;
      if (value instanceof File) return value.size <= 5242880;
      return true;
    })
    .test('fileType', 'File must be PDF, DOC, or DOCX', (value) => {
      if (!value) return true;
      if (value instanceof File) {
        const ext = '.' + value.name.split('.').pop()?.toLowerCase();
        return ['.pdf', '.doc', '.docx'].includes(ext);
      }
      return true;
    }),
  paymentReceipts: yup
    .mixed()
    .required("Payment receipts are required")
    .test('fileSize', 'File size must not exceed 5MB', (value) => {
      if (!value) return true;
      if (value instanceof File) return value.size <= 5242880;
      return true;
    })
    .test('fileType', 'File must be PDF, DOC, or DOCX', (value) => {
      if (!value) return true;
      if (value instanceof File) {
        const ext = '.' + value.name.split('.').pop()?.toLowerCase();
        return ['.pdf', '.doc', '.docx'].includes(ext);
      }
      return true;
    }),
  employeeList: yup
    .mixed()
    .required("Employee list is required")
    .test('fileSize', 'File size must not exceed 5MB', (value) => {
      if (!value) return true;
      if (value instanceof File) return value.size <= 5242880;
      return true;
    })
    .test('fileType', 'File must be PDF, DOC, or DOCX', (value) => {
      if (!value) return true;
      if (value instanceof File) {
        const ext = '.' + value.name.split('.').pop()?.toLowerCase();
        return ['.pdf', '.doc', '.docx'].includes(ext);
      }
      return true;
    }),

  // Step 5: Confirmation
  consentAcknowledgement: yup
    .boolean()
    .oneOf([true], "You must confirm the information is accurate")
    .required("Confirmation is required"),
});
