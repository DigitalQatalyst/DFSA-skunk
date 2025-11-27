import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/Header';

/**
 * Generic data source configuration
 */
interface DataSource {
  // Microsoft Graph fields
  displayName?: string;
  givenName?: string;
  surname?: string;
  mail?: string;
  userPrincipalName?: string;
  mobilePhone?: string;
  businessPhones?: string[];
  jobTitle?: string;
  companyName?: string;
  
  // CRM/API fields
  fullname?: string;
  email?: string;
  emailaddress1?: string;
  telephone1?: string;
  mobilephone?: string;
  phone?: string;
  phoneNumber?: string;
  jobtitle?: string;
  accountName?: string;
  kf_companyname?: string;
  registrationNumber?: string;
  kf_registrationnumber?: string;
  fundingNumber?: string;
  loanNumber?: string;
  
  // Allow any other fields
  [key: string]: any;
}

/**
 * Field mapping configuration
 * Maps form field names to possible source field names (in priority order)
 */
export interface FieldMapping {
  [formFieldName: string]: string[];
}

/**
 * Default field mappings for common form fields
 * Priority order: CRM fields first, then Microsoft Graph fields as fallback
 */
export const DEFAULT_FIELD_MAPPINGS: FieldMapping = {
  // Personal Information (CRM fields first, then Graph fields)
  submittedBy: ['fullname', 'contactName', 'borrowerName', 'displayName', 'givenName+surname'],
  emailAddress: ['email', 'emailaddress1', 'emailAddress', 'contactEmail', 'mail', 'userPrincipalName'],
  emailAddress1: ['email', 'emailaddress1', 'emailAddress', 'contactEmail', 'mail', 'userPrincipalName'],
  email: ['email', 'emailaddress1', 'emailAddress', 'contactEmail', 'mail', 'userPrincipalName'],
  telephoneNumber: ['telephone1', 'mobilephone', 'phone', 'phoneNumber', 'contactPhone', 'mobilePhone', 'businessPhones[0]'],
  mobileNumber: ['mobilephone', 'telephone1', 'phone', 'phoneNumber', 'mobilePhone', 'businessPhones[0]'],
  phoneNumber: ['telephone1', 'mobilephone', 'phone', 'phoneNumber', 'contactPhone', 'mobilePhone', 'businessPhones[0]'],
  position: ['jobtitle', 'jobTitle'],
  
  // Company Information (CRM fields first)
  companyName: ['kf_companyname', 'accountName', 'companyName'],
  companyNumber: ['kf_registrationnumber', 'registrationNumber', 'companyNumber'],
  compannyNumber: ['kf_registrationnumber', 'registrationNumber', 'companyNumber'], // Typo in some forms
  
  // Loan/Funding Information
  fundingNumber: ['fundingNumber', 'loanNumber'],
  
  // Training/Request forms - additional mappings (CRM fields first)
  requestorName: ['fullname', 'contactName', 'displayName', 'givenName+surname'],
  requestorEmail: ['email', 'emailaddress1', 'mail', 'userPrincipalName'],
  requestorPhone: ['telephone1', 'mobilephone', 'phone', 'mobilePhone', 'businessPhones[0]'],
  requestorPosition: ['jobtitle', 'jobTitle'],
  
  // Membership forms (CRM fields first)
  applicantFullName: ['fullname', 'contactName', 'displayName', 'givenName+surname'],
  applicantEmail: ['email', 'emailaddress1', 'emailAddress', 'contactEmail', 'mail', 'userPrincipalName'],
  applicantPhone: ['telephone1', 'mobilephone', 'phone', 'phoneNumber', 'contactPhone', 'mobilePhone', 'businessPhones[0]'],
  companyRegistrationNumber: ['kf_registrationnumber', 'registrationNumber', 'companyNumber'],
  
  // Generic name/email/phone fields (used by multiple forms)
  name: ['fullname', 'contactName', 'displayName', 'givenName+surname'],
  // email: ['email', 'emailaddress1', 'mail', 'userPrincipalName'],
  phone: ['telephone1', 'mobilephone', 'phone', 'mobilePhone', 'businessPhones[0]'],
};

/**
 * Options for the data mapping hook
 */
interface UseFormDataMappingOptions {
  loanId?: string | null;
  fieldMappings?: FieldMapping;
  apiEndpoint?: string;
  fallbackEndpoint?: string;
}

/**
 * Return type for the data mapping hook
 */
interface UseFormDataMappingReturn {
  mappedData: Record<string, any>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic hook for mapping data from multiple sources to form fields
 * 
 * Priority order:
 * 1. CRM API data (userProfileData) - User's CRM profile data
 * 2. API data (if loanId provided) - Loan/funding specific data
 * 3. Microsoft Graph (crmprofile) - Fallback to Microsoft account data
 * 
 * @param options Configuration options
 * @returns Mapped form data, loading state, error, and refetch function
 */
export const useFormDataMapping = ({
  loanId,
  fieldMappings = DEFAULT_FIELD_MAPPINGS,
  apiEndpoint,
  fallbackEndpoint = 'https://kfrealexpressserver.vercel.app/api/v1/auth/get-user-profile',
}: UseFormDataMappingOptions = {}): UseFormDataMappingReturn => {
  const { crmprofile, userProfileData } = useAuth();
  const [apiData, setApiData] = useState<DataSource | null>(null);
  const [mappedData, setMappedData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Extract value from nested object path (e.g., 'businessPhones[0]')
   */
  const getNestedValue = (obj: any, path: string): any => {
    if (path.includes('[')) {
      const [key, indexStr] = path.split('[');
      const index = parseInt(indexStr.replace(']', ''));
      return obj[key]?.[index];
    }
    return obj[path];
  };

  /**
   * Handle special concatenation cases (e.g., 'givenName+surname')
   */
  const getConcatenatedValue = (obj: any, path: string): any => {
    if (path.includes('+')) {
      const parts = path.split('+');
      const values = parts.map(p => obj[p.trim()]).filter(Boolean);
      return values.length > 0 ? values.join(' ') : null;
    }
    return null;
  };

  /**
   * Map a single field from source data using priority list
   */
  const mapField = (sources: DataSource[], fieldPaths: string[]): any => {
    for (const source of sources) {
      if (!source) continue;
      
      for (const path of fieldPaths) {
        // Handle concatenation
        const concatenated = getConcatenatedValue(source, path);
        if (concatenated) return concatenated;
        
        // Handle nested paths
        const value = getNestedValue(source, path);
        if (value !== undefined && value !== null && value !== '') {
          return value;
        }
      }
    }
    return '';
  };

  /**
   * Map all fields from sources to form fields
   * Priority: CRM data > API data > Microsoft Graph
   */
  const mapAllFields = (crmData: any, apiData: any, graphData: any): Record<string, any> => {
    // Priority order: CRM first, then API, then Microsoft Graph as fallback
    const sources = [crmData, apiData, graphData].filter(Boolean);
    const result: Record<string, any> = {};

    Object.keys(fieldMappings).forEach(formField => {
      const sourcePaths = fieldMappings[formField];
      const mappedValue = mapField(sources, sourcePaths);
      result[formField] = mappedValue;
      
      // Log each field mapping for debugging
      if (mappedValue) {
        console.log(`  ✅ ${formField}: "${mappedValue}"`);
      }
    });

    console.log('📊 Mapped form data (CRM priority):', result);
    console.log('📊 Fields with values:', Object.keys(result).filter(k => result[k]));
    return result;
  };

  /**
   * Fetch data from API
   */
  const fetchApiData = useCallback(async () => {
    // Skip if no data source available
    if (!loanId && !apiEndpoint) {
      console.log('ℹ️ No loan ID or API endpoint provided, using only Microsoft Graph data');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let endpoint = apiEndpoint;
      
      // If no custom endpoint, use default loan endpoint
      if (!endpoint && loanId) {
        endpoint = `https://kfrealexpressserver.vercel.app/api/v1/loans/${loanId}`;
      }

      console.log('🔄 Fetching data from:', endpoint);

      let response = await fetch(endpoint!, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      // If 404, try fallback endpoint
      if (response.status === 404 && fallbackEndpoint && crmprofile?.id) {
        console.log('ℹ️ Primary endpoint not found, trying fallback:', fallbackEndpoint);
        
        response = await fetch(fallbackEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ azureid: crmprofile.id }),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API data fetched:', data);

      // Handle different response structures
      const extractedData = data.profile || data.data || data;
      setApiData(extractedData);

    } catch (err: any) {
      console.error('❌ Error fetching API data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [loanId, apiEndpoint, fallbackEndpoint, crmprofile?.id]);

  /**
   * Initialize mapped data immediately with CRM data
   * This ensures forms render with data right away
   */
  useEffect(() => {
    // Try to extract CRM data from nested profile or use root object
    const crmData = userProfileData?.profile || userProfileData;
    const graphData = crmprofile as any;
    
    console.log('🔍 [useFormDataMapping] Raw data sources:', {
      userProfileData,
      crmprofile
    });
    
    console.log('🔍 [useFormDataMapping] Data sources available:', {
      hasCrmData: !!(crmData && Object.keys(crmData).length > 0),
      hasGraphData: !!(graphData && Object.keys(graphData).length > 0),
      crmDataKeys: crmData ? Object.keys(crmData) : [],
      graphDataKeys: graphData ? Object.keys(graphData) : [],
      crmDataSample: crmData ? {
        fullname: crmData.fullname,
        email: crmData.email,
        emailaddress1: crmData.emailaddress1,
        telephone1: crmData.telephone1,
        kf_companyname: crmData.kf_companyname,
        kf_registrationnumber: crmData.kf_registrationnumber
      } : null
    });
    
    if (crmData && Object.keys(crmData).length > 0) {
      // Immediately map CRM data (priority)
      const mapped = mapAllFields(crmData, null, graphData);
      setMappedData(mapped);
      console.log('✅ Initial data mapped from CRM profile:', mapped);
    } else if (graphData && Object.keys(graphData).length > 0) {
      // Fallback to Microsoft Graph if CRM data not available yet
      const mapped = mapAllFields(null, null, graphData);
      setMappedData(mapped);
      console.log('⚠️ Using Microsoft Graph as fallback (CRM data not loaded yet):', mapped);
    } else {
      console.warn('⚠️ No data sources available for form prefill');
    }
  }, [crmprofile, userProfileData]);

  /**
   * Update mapped data when API data arrives
   * Priority: CRM data first, then API data, then Microsoft Graph as fallback
   */
  useEffect(() => {
    if (apiData) {
      const crmData = userProfileData?.profile || userProfileData;
      const graphData = crmprofile as any;
      // CRM data has highest priority, then API data, then Microsoft Graph
      const mapped = mapAllFields(crmData, apiData, graphData);
      setMappedData(mapped);
      console.log('✅ Data updated with API response (CRM still has priority)');
    }
  }, [apiData, userProfileData]);

  /**
   * Fetch API data on mount
   */
  useEffect(() => {
    fetchApiData();
  }, [fetchApiData]);

  /**
   * Refetch function for manual refresh
   */
  const refetch = useCallback(() => {
    console.log('🔄 Manually refreshing data...');
    fetchApiData();
  }, [fetchApiData]);

  return {
    mappedData,
    loading,
    error,
    refetch,
  };
};
