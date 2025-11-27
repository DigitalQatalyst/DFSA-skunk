import { useFormDataMapping, DEFAULT_FIELD_MAPPINGS } from './useFormDataMapping';

interface LoanData {
  fundingNumber?: string;
  loanNumber?: string;
  companyName?: string;
  companyNumber?: string;
  borrowerName?: string;
  contactName?: string;
  email?: string;
  contactEmail?: string;
  phone?: string;
  contactPhone?: string;
  position?: string;
  jobTitle?: string;
  [key: string]: any;
}

interface MappedFormData {
  fundingNumber: string;
  companyName: string;
  companyNumber: string;
  submittedBy: string;
  emailAddress: string;
  telephoneNumber: string;
  position: string;
}

interface UseFetchLoanDataReturn {
  loanData: LoanData | null;
  formData: MappedFormData;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch and manage loan data
 * Now uses the generic useFormDataMapping hook internally
 * @param loanId - The ID of the loan to fetch
 * @returns Object containing loan data, loading state, error, and refetch function
 */
export const useFetchLoanData = (loanId: string | null): UseFetchLoanDataReturn => {
  // Use the generic mapping hook
  const { mappedData, loading, error, refetch } = useFormDataMapping({
    loanId,
    fieldMappings: DEFAULT_FIELD_MAPPINGS,
  });

  // Transform to match the expected return type
  const formData: MappedFormData = {
    fundingNumber: mappedData.fundingNumber || '',
    companyName: mappedData.companyName || '',
    companyNumber: mappedData.companyNumber || '',
    submittedBy: mappedData.submittedBy || '',
    emailAddress: mappedData.emailAddress || '',
    telephoneNumber: mappedData.telephoneNumber || '',
    position: mappedData.position || '',
  };

  return {
    loanData: mappedData as LoanData,
    formData,
    loading,
    error,
    refetch,
  };
};
