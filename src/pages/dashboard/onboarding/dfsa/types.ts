// Form Data Interface for DFSA Onboarding
export interface FormData {
  // Applicant Role
  applicantRole: 'own_firm' | 'professional_advisor' | ''

  // Contact Information (always present)
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  contactPhone: string

  // Firm Contact Information (conditional - only for professional advisor)
  firmContactFirstName: string
  firmContactLastName: string
  firmContactEmail: string
  firmContactPhone: string

  // Firm Details
  suggestedCompanyName: string
  activityType: 'financial_services' | 'dnfbp' | 'registered_auditor' | 'crypto_token' | ''

  // Service Details (multiple selection)
  services: string[]
}

// Step Props Interface
export interface StepProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
}
