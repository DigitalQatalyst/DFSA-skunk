import * as yup from "yup";
import { FormSchema, FormField } from "../FormPreview";

// Define the form schema for the "Reallocation of Loan Disbursement" form
export const reallocationLoanSchema: FormSchema = {
  formId: "reallocation-loan-form",
  formTitle: "Reallocation of Loan Disbursement",
  formDescription:
    "Please complete the form below to proceed with your application.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000,
  submitEndpoint: "https://kfrealexpressserver.vercel.app/api/v1/loan/reallocate-disburse-loan",
  steps: [
    {
      stepTitle: "Company and Requestor Information",
      stepDescription: "Please provide company and requestor details",
      groups: [
        {
          groupTitle: "COMPANY INFORMATION",
          groupDescription: "Provide details about your business entity",
          fields: [
            {
              id: "companyName",
              label: "Company Name",
              type: "text",
              required: true,
              placeholder: "Enter company name",
              validation: {
                pattern: "^[a-zA-Z0-9&\\-.\\s]+$",
                message:
                  "Company name can only contain letters, numbers, &, -, and . characters",
                minLength: 2,
              },
            } as FormField,
            {
              id: "companyNumber",
              label: "Company Number",
              type: "text",
              required: true,
              placeholder: "Enter company number",
              validation: {
                pattern: "^[a-zA-Z0-9-]+$",
                message: "Company number must be alphanumeric",
                minLength: 6,
                maxLength: 12,
              },
            } as FormField,
          ],
        },
        {
          groupTitle: "REQUESTOR INFORMATION",
          groupDescription: "Tell us about the person making this request",
          fields: [
            {
              id: "name",
              label: "Name of Person Making the Submission",
              type: "text",
              required: true,
              placeholder: "Enter name of person making the submission",
              validation: {
                pattern: "^[a-zA-Z\\s]+$",
                message: "Name can only contain letters and spaces",
                minLength: 2,
              },
            } as FormField,
            {
              id: "submittedBy",
              label: "Submitted By",
              type: "text",
              required: true,
              placeholder: "Enter the name of the person submitting",
              validation: {
                pattern: "^[a-zA-Z\\s]+$",
                message: "Name can only contain letters and spaces",
                minLength: 2,
              },
            } as FormField,
            {
              id: "position",
              label: "Position",
              type: "text",
              required: true,
              placeholder: "Enter the position of the requestor",
              validation: {
                pattern: "^[a-zA-Z\\s]+$",
                message: "Position can only contain letters and spaces",
              },
            } as FormField,
            {
              id: "emailAddress",
              label: "Email Address",
              type: "email",
              required: true,
              placeholder: "Enter email address",
              validation: {
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                message: "Invalid email address",
              },
            } as FormField,
            {
              id: "telephoneNumber",
              label: "Contact Telephone Number",
              type: "tel",
              required: true,
              placeholder: "Enter contact number",
              validation: {
                pattern: "^\\+?[0-9]{10,13}$",
                message:
                  "Telephone number must be in international format and contain 10-13 digits",
              },
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Loan Disbursement Details",
      stepDescription:
        "Please provide detailed information regarding your reallocation of loan disbursement request. The funding request number is provided below.",
      groups: [
        {
          groupTitle: "LOAN DISBURSEMENT DETAILS",
          groupDescription:
            "Provide information about your loan disbursement request",
          fields: [
            {
              id: "fundingNumber",
              label: "Funding Request Number",
              type: "text",
              required: true,
              placeholder: "Enter the funding request number",
              validation: {
                pattern: "^[a-zA-Z0-9-]+$",
                message: "Funding request number must be alphanumeric",
                minLength: 6,
                maxLength: 15,
              },
            } as FormField,
            {
              id: "description",
              label: "Description",
              type: "textarea",
              required: true,
              placeholder:
                "Enter details related to disburse an approved loan on the received funding from Khalifa Fund for Enterprise Development",
              validation: {
                minLength: 20,
                message: "Description must be at least 20 characters",
              },
            } as FormField,
          ],
        },
        {
          groupTitle: "DOCUMENT UPLOAD",
          groupDescription:
            "Please upload the required documents below to support your reallocation of loan disbursement request. You may upload the documents one by one, or zip multiple documents and upload them together.",
          fields: [
            {
              id: "companyLetter",
              label: "Detailed letter from the company",
              type: "file",
              required: true,
              helperText:
                "Upload a detailed letter from the company (PDF, DOC, DOCX, JPG, PNG, or ZIP)",
              validation: {
                fileTypes: [
                  ".pdf",
                  ".doc",
                  ".docx",
                  ".jpg",
                  ".jpeg",
                  ".png",
                  ".zip",
                ],
              },
            } as FormField,
            {
              id: "supportingDocument",
              label: "Supporting Documents (Quotation and Invoices)",
              type: "file",
              required: true,
              helperText:
                "Upload supporting documents including quotations and invoices (PDF, DOC, DOCX, JPG, PNG, or ZIP)",
              validation: {
                fileTypes: [
                  ".pdf",
                  ".doc",
                  ".docx",
                  ".jpg",
                  ".jpeg",
                  ".png",
                  ".zip",
                ],
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
              id: "termsAgreed",
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

// Validation schema for the "Reallocation of Loan Disbursement" form
export const reallocationLoanValidationSchema = yup.object({
  // Step 1: Company and Requestor Information
  companyName: yup
    .string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .matches(
      /^[a-zA-Z0-9&\-.\s]+$/,
      "Company name can only contain letters, numbers, &, -, and . characters"
    ),
  companyNumber: yup
    .string()
    .required("Company number is required")
    .matches(/^[a-zA-Z0-9-]+$/, "Company number must be alphanumeric")
    .min(6, "Company number must be at least 6 characters")
    .max(12, "Company number must not exceed 12 characters"),
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  submittedBy: yup
    .string()
    .required("Submitted by is required")
    .min(2, "Submitted by must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "Submitted by can only contain letters and spaces"),
  position: yup
    .string()
    .required("Position is required")
    .matches(/^[a-zA-Z\s]+$/, "Position can only contain letters and spaces"),
  emailAddress: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    ),
  telephoneNumber: yup
    .string()
    .required("Telephone number is required")
    .matches(
      /^\+?[0-9]{10,13}$/,
      "Telephone number must be in international format and contain 10-13 digits"
    ),
  // Step 2: Loan Disbursement Details
  fundingNumber: yup
    .string()
    .required("Funding request number is required")
    .matches(/^[a-zA-Z0-9-]+$/, "Funding request number must be alphanumeric")
    .min(6, "Funding request number must be at least 6 characters")
    .max(15, "Funding request number must not exceed 15 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters"),
  companyLetter: yup.mixed().required("Company letter is required"),
  supportingDocument: yup
    .mixed()
    .required("Supporting document is required"),
  // Step 3: Data Sharing Consent
  termsAgreed: yup
    .boolean()
    .oneOf([true], "You must confirm to proceed")
    .required("You must confirm to proceed"),
});
