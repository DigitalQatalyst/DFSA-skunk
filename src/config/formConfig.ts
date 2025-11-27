// Form Configuration - Centralized form metadata
export interface FormConfig {
  serviceName: string;
  formName: string;
  formId: string;
  category: "Business" | "Financial"; // Category of the service
  apiEndpoint?: string;
}

export const FORM_CONFIGS: Record<string, FormConfig> = {
  'disburse-approved-loan': {
    serviceName: 'SME Loan Disbursement',
    formName: 'Disburse Approved Loan',
    formId: 'disburse-approved-loan',
    category: 'Financial',
    apiEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/loan/disburse-loan'
  },
  'training-in-entrepreneurship': {
    serviceName: 'Entrepreneurship Training Program',
    formName: 'Training in Entrepreneurship',
    formId: 'training-in-entrepreneurship',
    category: 'Business',
    apiEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/training/entrepreneurshiptraining'
  },
  'cancel-loan': {
    serviceName: 'Request to Cancel Loan',
    formName: 'Cancel Loan Request',
    formId: 'cancel-loan',
    category: 'Financial',
    apiEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/loan/cancel-loan'
  },
  'request-for-funding': {
    serviceName: 'Equity-Based Funding Opportunities',
    formName: 'Request for Funding',
    formId: 'request-for-funding',
    category: 'Financial',
    apiEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/funding/requestfunding'
  },
  'book-consultation-for-entrepreneurship': {
    serviceName: 'Business Consultation Services',
    formName: 'Book Consultation for Entrepreneurship',
    formId: 'book-consultation-for-entrepreneurship',
    category: 'Business',
    apiEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/consultation/book-consultation'
  },
  'request-for-membership': {
    serviceName: 'Khalifa Fund Membership Subscription',
    formName: 'Request for Membership',
    formId: 'request-for-membership',
    category: 'Business',
    apiEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/membership/request-membership'
  },
  'collateral-user-guide': {
    serviceName: 'Collateral Management Services',
    formName: 'Collateral User Guide',
    formId: 'collateral-user-guide',
    category: 'Business',
    apiEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/collateral/create-collateraluserguide'
  },
  'request-to-amend-existing-loan-details': {
    serviceName: 'Loan Amendment Service',
    formName: 'Request to Amend Existing Loan Details',
    formId: 'request-to-amend-existing-loan-details',
    category: 'Financial',
    apiEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/loan/amend-loan' // Update with actual endpoint
  },
  'issue-support-letter': {
    serviceName: 'Support Services',
    formName: 'Issue Support Letter',
    formId: 'issue-support-letter',
    category: 'Business',
    apiEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/support/issue-support-letter'
  },
  'contact-support': {
    serviceName: 'Support Services',
    formName: 'Create Support Request',
    formId: 'contact-support',
    category: 'Business',
    apiEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/support/create-support-request'
  },
  'facilitate-communication': {
    serviceName: 'Strategic Stakeholder Communication',
    formName: 'Facilitate Communication With Strategic Stakeholders',
    formId: 'facilitate-communication',
    category: 'Business',
    apiEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/contact/facilitate-communication'
  },
  'reallocation-loan-form': {
    serviceName: 'Loan Reallocation and Disbursement',
    formName: 'Reallocation of Loan Disbursement',
    formId: 'reallocation-loan-form',
    category: 'Financial',
    apiEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/loan/reallocate-disburse-loan'
  }
};

// Helper function to get form config
export const getFormConfig = (formId: string): FormConfig => {
  const config = FORM_CONFIGS[formId];
  if (!config) {
    throw new Error(`Form config not found for formId: ${formId}`);
  }
  return config;
};

// Enhanced payload interface for API submissions
export interface EnhancedFormPayload {
  // Form metadata (added by our system)
  serviceName: string;
  formName: string;
  formId: string;
  category: "Business" | "Financial"; // Service category
  submittedAt: string;
  // Submission status
  status?: "draft" | "submitted";
  
  // Original form data (from FormPreview)
  formData: any;
  
  // Optional additional metadata
  submittedBy?: string;
  sessionId?: string;
  userAgent?: string;
  userId?: string;
  azureId?: string;
}
