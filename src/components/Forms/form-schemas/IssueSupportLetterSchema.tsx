import { FormSchema } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

export const IssueSupportLetterSchema: FormSchema = {
  formId: "issue-support-letter",
  formTitle: "Issue Support Letter",
  formDescription:
    "Please complete the form below to request a support letter from our organization.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000, // Auto-save every 20 seconds
  submitEndpoint: "https://kfrealexpressserver.vercel.app/api/v1/support/issue-support-letter",

  steps: [
    {
      stepTitle: "Requester Information",
      stepDescription: "Tell us about yourself and your role in the business.",
      groups: [
        {
          groupTitle: "PERSONAL DETAILS",
          fields: [
            {
              id: "emailAddress",
              label: "Email Address",
              type: "email",
              placeholder: PLACEHOLDER_STANDARDS.email.placeholder,
              helperText: PLACEHOLDER_STANDARDS.email.helperText,
              required: true,
              validation: {
                pattern: "^[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,}$",
                minLength: 5,
                maxLength: 254,
                message: "Please enter a valid email address",
              },
            },
            {
              id: "telephoneNumber",
              label: "Phone Number",
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
            },
            {
              id: "companyName",
              label: "Company Name",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.companyName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyName.helperText,
              required: true,
              validation: {
                pattern: "^[\\w\\s.,'!?-]+$",
                minLength: 2,
                maxLength: 255,
                message: "Company name contains invalid characters",
              },
            },
            {
              id: "companyNumber",
              label: "Company Number",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.companyNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyNumber.helperText,
              required: true,
              validation: {
                pattern: "^[A-Za-z0-9]+$",
                minLength: 1,
                maxLength: 50,
                message: "Company number must be alphanumeric",
              },
            },
            {
              id: "position",
              label: "Position",
              type: "select",
              required: true,
              options: [
                { value: "Manager", label: "Manager" },
                { value: "CEO", label: "CEO" },
                { value: "Owner/Founder", label: "Owner/Founder" },
                { value: "Partner", label: "Partner" },
                { value: "Director", label: "Director" },
                { value: "Other", label: "Other" },
              ],
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Support Letter Details",
      stepDescription:
        "Provide details about the support letter and its purpose.",
      groups: [
        {
          groupTitle: "LETTER REQUEST",
          fields: [
            {
              id: "fundingNumber",
              label: "Funding Number",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.fundingNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.fundingNumber.helperText,
              required: true,
              validation: {
                pattern: "^[A-Za-z0-9]+$",
                minLength: 1,
                maxLength: 50,
                message: "Funding number must be alphanumeric",
              },
            },
            {
              id: "cancellationDetails",
              label: "Cancellation Details",
              type: "textarea",
              placeholder: PLACEHOLDER_STANDARDS.cancellationDetails.placeholder,
              helperText: PLACEHOLDER_STANDARDS.cancellationDetails.helperText,
              required: true,
              validation: {
                pattern: "^[\\w\\s.,'!?-]+$",
                minLength: 1,
                maxLength: 750,
                message: "Details contain invalid characters",
              },
            },
            {
              id: "supportLetterType",
              label: "Type of Support Letter",
              required: true,
              type: "select",
              options: [
                { value: "employment", label: "Employment Verification" },
                { value: "financial", label: "Financial Support" },
                { value: "travel", label: "Travel Support" },
                { value: "education", label: "Education Support" },
                { value: "visa", label: "Visa Support" },
                { value: "other", label: "Other" },
              ],
            },
            {
              id: "supportLetterPurpose",
              label: "Purpose of the Support Letter",
              type: "textarea",
              placeholder: PLACEHOLDER_STANDARDS.letterPurpose.placeholder,
              helperText: PLACEHOLDER_STANDARDS.letterPurpose.helperText,
            },
            {
              id: "letterRecipient",
              label: "Recipient of the Support Letter",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.letterRecipient.placeholder,
              helperText: PLACEHOLDER_STANDARDS.letterRecipient.helperText,
              required: true,
              validation: {
                pattern: "^[a-zA-ZÀ-ÿ' -]+$",
                minLength: 1,
                maxLength: 255,
                message: "Recipient name can only contain letters, spaces, hyphens, and apostrophes",
              },
            },
            {
              id: "letterDateNeededBy",
              label: "Date Needed By",
              type: "date",
              required: true,
            },
            {
              id: "letterContentSpecifics",
              label: "Letter Content Specifics",
              type: "textarea",
              placeholder: PLACEHOLDER_STANDARDS.notes.placeholder,
              helperText: PLACEHOLDER_STANDARDS.notes.helperText,
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Attachments & Documentation",
      stepDescription:
        "Upload any required documents to complete your request.",
      groups: [
        {
          groupTitle: "REQUIRED DOCUMENTS",
          fields: [
            {
              id: "supportingDocuments",
              label: "Supporting Documents",
              type: "multi-file",
              required: false,
              validation: {
                max: 5, // Maximum 5 files
                maxFileSize: 5242880, // 5MB in bytes
                fileTypes: [
                  ".pdf",
                  ".doc",
                  ".docx",
                  ".jpg",
                  ".jpeg",
                  ".png",
                  ".txt",
                ],
              },
            },
            {
              id: "additionalNotes",
              label: "Additional Notes or Requests",
              type: "textarea",
              placeholder: PLACEHOLDER_STANDARDS.notes.placeholder,
              helperText: PLACEHOLDER_STANDARDS.notes.helperText,
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
          groupDescription: "Review all entered details to ensure accuracy before proceeding to confirmation.",
          fields: [],
        },
      ],
    },
    {
      stepTitle: "Confirmation & Submit",
      stepDescription: "Confirm your information and submit the request.",
      groups: [
        {
          groupTitle: "CONFIRMATION",
          fields: [
            {
              id: "consentAcknowledgement",
              label: "I confirm that the information provided is accurate and complete",
              type: "checkbox",
              required: true,
            },
            {
              id: "termsAndConditions",
              label: "I agree to the Terms and Conditions",
              type: "checkbox",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
