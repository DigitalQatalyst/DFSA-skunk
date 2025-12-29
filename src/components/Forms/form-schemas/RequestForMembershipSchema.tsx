import { FormSchema } from "../FormPreview";

export const RequestForMembershipSchema: FormSchema = {
  formId: "request-for-membership",
  formTitle: "Request for Membership",
  formDescription:
    "Please complete the form below to proceed with your application.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000, // Auto-save every 20 seconds
  submitEndpoint: "https://kfrealexpressserver.vercel.app/api/v1/membership/request-membership",

  steps: [
    {
      stepTitle: "Applicant Information",
      stepDescription: "Tell us about yourself and your role in the business.",
      groups: [
        {
          groupTitle: "PERSONAL DETAILS",
          fields: [
            {
              id: "applicantFullName",
              label: "Full Name",
              type: "text",
              placeholder: "John Smith",
              required: true,
              validation: {
                pattern: "^[a-zA-ZÀ-ÿ' -]+$",
                minLength: 1,
                maxLength: 255,
                message: "Full name can only contain letters, spaces, hyphens, and apostrophes",
              },
            },
            {
              id: "applicantEmail",
              label: "Email Address",
              type: "email",
              placeholder: "john.smith@email.com",
              required: true,
              validation: {
                pattern: "^[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,}$",
                minLength: 5,
                maxLength: 254,
                message: "Please enter a valid email address",
              },
            },
            {
              id: "applicantPhone",
              label: "Phone Number",
              type: "tel",
              placeholder: "+1 234 567 8900",
              required: true,
              validation: {
                pattern: "^\\+?[0-9\\s\\-\\(\\)]+$",
                minLength: 7,
                maxLength: 15,
                message: "Please enter a valid phone number",
              },
            },
            {
              id: "dateOfBirth",
              label: "Date of Birth",
              type: "date",
            },
            {
              id: "nationality",
              label: "Nationality",
              type: "select",
              options: [
                { value: "US", label: "United States" },
                { value: "UK", label: "United Kingdom" },
                { value: "CA", label: "Canada" },
                { value: "AU", label: "Australia" },
                { value: "DE", label: "Germany" },
                { value: "FR", label: "France" },
                { value: "JP", label: "Japan" },
                { value: "IN", label: "India" },
                { value: "BR", label: "Brazil" },
                { value: "MX", label: "Mexico" },
                { value: "other", label: "Other" },
              ],
            },
          ],
        },
        {
          groupTitle: "ROLE & EXPERIENCE",
          fields: [
            {
              id: "roleInBusiness",
              label: "Role in Business",
              type: "select",
              required: true,
              options: [
                { value: "owner", label: "Owner/Founder" },
                { value: "ceo", label: "CEO" },
                { value: "partner", label: "Partner" },
                { value: "other", label: "Other" },
              ],
            },
            {
              id: "yearsOfExperience",
              label: "Years of Business Experience",
              type: "number",
              placeholder: "5",
              validation: { min: 0, max: 50 },
            },
            {
              id: "previousFunding",
              label: "Have you received business funding before?",
              type: "radio",
              required: true,
              options: [
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ],
            },
            {
              id: "previousFundingDetails",
              label: "Previous Funding Details",
              type: "textarea",
              placeholder:
                "Please describe your previous funding experience...",
              conditionalLogic: {
                dependsOn: "previousFunding",
                showWhen: "yes",
              },
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Company Details",
      stepDescription:
        "Provide information about your business and funding needs.",
      groups: [
        {
          groupTitle: "COMPANY INFORMATION",
          fields: [
            {
              id: "companyName",
              label: "Company Name",
              type: "text",
              placeholder: "Futuretech LLC",
              required: true,
              validation: {
                pattern: "^[\\w\\s.,'!?-]+$",
                minLength: 2,
                maxLength: 255,
                message: "Company name contains invalid characters",
              },
            },
            {
              id: "companyRegistrationNumber",
              label: "Company Registration Number",
              type: "text",
              placeholder: "12345678",
              required: true,
              validation: {
                pattern: "^[A-Za-z0-9]+$",
                minLength: 1,
                maxLength: 50,
                message: "Company registration number must be alphanumeric",
              },
            },
            {
              id: "businessType",
              label: "Business Type",
              required: true,
              type: "select",
              options: [
                { value: "sole-proprietorship", label: "Sole Proprietorship" },
                { value: "partnership", label: "Partnership" },
                { value: "llc", label: "Limited Liability Company (LLC)" },
                { value: "corporation", label: "Corporation" },
                { value: "s-corp", label: "S Corporation" },
                { value: "nonprofit", label: "Non-Profit Organization" },
                { value: "cooperative", label: "Cooperative" },
                { value: "other", label: "Other" },
              ],
            },
            {
              id: "industry",
              label: "Industry",
              required: true,
              type: "select",
              options: [
                { value: "technology", label: "Technology" },
                { value: "healthcare", label: "Healthcare" },
                { value: "finance", label: "Finance" },
                { value: "retail", label: "Retail" },
                { value: "manufacturing", label: "Manufacturing" },
                { value: "construction", label: "Construction" },
                { value: "hospitality", label: "Hospitality" },
                { value: "education", label: "Education" },
                { value: "agriculture", label: "Agriculture" },
                { value: "transportation", label: "Transportation" },
                { value: "real-estate", label: "Real Estate" },
                {
                  value: "professional-services",
                  label: "Professional Services",
                },
                { value: "food-beverage", label: "Food & Beverage" },
                { value: "entertainment", label: "Entertainment" },
                { value: "other", label: "Other" },
              ],
            },
            {
              id: "yearEstablished",
              label: "Date Established",
              type: "date",
            },
            {
              id: "numberOfEmployees",
              label: "Number of Employees",
              type: "select",
              options: [
                { value: "1", label: "Just me (1)" },
                { value: "2-50", label: "2-50 employees" },
                { value: "51-100", label: "51-100 employees" },
                { value: "101-250", label: "101-250 employees" },
                { value: "251-500", label: "251-500 employees" },
                { value: "501-1000", label: "501-1000 employees" },
                { value: "1000+", label: "1,000+ employees" },
              ],
            },
            {
              id: "annualRevenue",
              label: "Annual Revenue",
              required: true,
              type: "select",
              options: [
                { value: "under-50k", label: "Under $50,000" },
                { value: "50k-100k", label: "$50,000 - $100,000" },
                { value: "100k-500k", label: "$100,000 - $500,000" },
                { value: "500k-1m", label: "$500,000 - $1,000,000" },
                { value: "1m-plus", label: "$1,000,000+" },
              ],
            },
            {
              id: "operatingCountry",
              label: "Primary Operating Country",
              type: "select",
              options: [
                { value: "US", label: "United States" },
                { value: "UK", label: "United Kingdom" },
                { value: "CA", label: "Canada" },
                { value: "AU", label: "Australia" },
                { value: "DE", label: "Germany" },
                { value: "FR", label: "France" },
                { value: "JP", label: "Japan" },
                { value: "IN", label: "India" },
                { value: "BR", label: "Brazil" },
                { value: "MX", label: "Mexico" },
                { value: "other", label: "Other" },
              ],
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Product/Services Details",
      stepDescription:
        "Tell us about your business offerings and funding needs.",
      groups: [
        {
          groupTitle: "BUSINESS OFFERINGS",
          fields: [
            {
              id: "productOrService",
              label: "What services/products does your business offer?",
              type: "textarea",
              placeholder: "Please describe your business offerings...",
              required: true,
              validation: {
                pattern: "^[\\w\\s.,'!?-]+$",
                minLength: 1,
                maxLength: 750,
                message: "Description contains invalid characters",
              },
            },
            {
              id: "businessGoals",
              label: "Business Goals",
              type: "checkbox-group",
              options: [
                { value: "expansion", label: "Business Expansion" },
                { value: "equipment", label: "Equipment Purchase" },
                { value: "inventory", label: "Inventory" },
                { value: "marketing", label: "Marketing & Advertising" },
                { value: "working-capital", label: "Working Capital" },
                { value: "debt-consolidation", label: "Debt Consolidation" },
                { value: "other", label: "Other" },
              ],
            },
            {
              id: "fundingAmountRequested",
              label: "Funding Amount Requested",
              type: "currency",
              currency: "USD",
              required: true,
              placeholder: "e.g., 50,000",
              validation: { min: 1000, max: 10000000 },
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
      stepDescription:
        "Provide your consent for sharing your information with the platform and third parties.",
      groups: [
        {
          groupTitle: "DATA SHARING CONSENT",
          fields: [
            {
              id: "dataSharingConsent",
              label:
                "I consent to the sharing of my business information with third parties for partnership opportunities and platform services.",
              type: "consent",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
