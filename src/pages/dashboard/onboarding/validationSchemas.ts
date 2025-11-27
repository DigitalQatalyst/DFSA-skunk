import * as yup from "yup";

// Step 1: Business Details validation schema
export const businessDetailsSchema = yup.object().shape({
  formId: yup.string().required("Form ID is required"),
  userId: yup.string().nullable().optional().notRequired(),
  accountId: yup.string().required("Account ID is required"),
  onboardingState: yup.string().required("Onboarding State is required").oneOf(["yes"], "Onboarding State must be 'yes'"),

  companyName: yup
    .string()
    .required("Company Name is required")
    .min(2, "Company name must be at least 2 characters"),

  industry: yup
    .string()
    .required("Industry is required")
    .min(2, "Industry must be at least 2 characters"),

  businessType: yup
    .string()
    .required("Business Type is required")
    .oneOf(
      ["Technology", "Retail", "Services", "Others"],
      "Please select a valid business type"
    ),

  companyStage: yup
    .string()
    .required("Company Stage is required")
    .oneOf(
      ["Start Up", "Scale Up", "Expansion"],
      "Please select a valid company stage"
    ),

  contactName: yup
    .string()
    .required("Contact Name is required")
    .min(2, "Contact name must be at least 2 characters"),

  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),

  registrationNumber: yup
    .string()
    .required("Registration Number is required")
    .min(3, "Registration number must be at least 3 characters")
    .matches(
      /^[a-zA-Z0-9-]+$/,
      "Registration number can only contain letters, numbers, and hyphens"
    ),

  establishmentDate: yup
    .string()
    .required("Establishment Date is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Establishment Date must be in YYYY-MM-DD format"
    ),

  businessSize: yup
    .string()
    .required("Business Size is required")
    .oneOf(
      [
        "Micro (1-9 employees)",
        "Small (10-49 employees)",
        "Medium (50-249 employees)",
        "Large (250+ employees)",
      ],
      "Please select a valid business size"
    ),
});

// Step 2: Business Profile validation schema
export const businessProfileSchema = yup.object().shape({
  businessPitch: yup
    .string()
    .required("Business Pitch is required")
    .min(20, "Business pitch must be at least 20 characters")
    .max(500, "Business pitch must be no more than 500 characters"),

  problemStatement: yup
    .string()
    .required("Problem Statement is required")
    .min(20, "Problem statement must be at least 20 characters")
    .max(500, "Problem statement must be no more than 500 characters"),
});

// Step 3: Location & Contact validation schema
export const locationContactSchema = yup.object().shape({
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),

  city: yup
    .string()
    .required("City is required")
    .matches(
      /^[a-zA-Z\s-]+$/,
      "City name can only contain letters, spaces, and hyphens"
    ),

  country: yup
    .string()
    .required("Country is required")
    .oneOf(
      [
        "United Arab Emirates",
        "Saudi Arabia",
        "Qatar",
        "Bahrain",
        "Kuwait",
        "Oman",
        "Other",
      ],
      "Please select a valid country"
    ),

  website: yup
    .string()
    .url("Please enter a valid URL")
    .required("Website is required"),
});

// Step 4: Operations validation schema
export const operationsSchema = yup.object().shape({
  employeeCount: yup
    .number()
    .required("Employee Count is required")
    .min(1, "Employee count must be at least 1")
    .integer("Employee count must be a whole number"),

  founders: yup
    .string()
    .required("Founders is required")
    .min(3, "Founders information must be at least 3 characters"),

  foundingYear: yup
    .string()
    .required("Founding Year is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Founding Year must be in YYYY-MM-DD format"
    ),
});

// Step 5: Funding validation schema
export const fundingSchema = yup.object().shape({
  initialCapitalUsd: yup
    .number()
    .required("Initial Capital is required")
    .min(0, "Initial capital cannot be negative"),

  fundingNeedsUsd: yup
    .number()
    .min(0, "Funding needs cannot be negative")
    .optional(),

  businessRequirements: yup
    .string()
    .required("Business Requirements is required")
    .min(10, "Business requirements must be at least 10 characters"),

  businessNeeds: yup
    .string()
    .required("Business Needs is required")
    .min(10, "Business needs must be at least 10 characters"),
});

// Combined schema for all steps
export const onboardingSchema = yup.object().shape({
  ...businessDetailsSchema.fields,
  ...businessProfileSchema.fields,
  ...locationContactSchema.fields,
  ...operationsSchema.fields,
  ...fundingSchema.fields,
});
