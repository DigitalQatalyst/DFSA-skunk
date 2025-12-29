import { useState, useEffect } from 'react';
import { useAuth } from '../components/Header';

interface FormDataMapping {
  [key: string]: any;
}

/**
 * Custom hook to autopopulate form fields with Microsoft Graph user data
 * @param fieldMapping - Optional custom field mapping configuration
 * @param additionalData - Optional additional data to merge (takes precedence)
 * @returns Autopopulated form data
 */
export const useFormAutopopulate = (
  fieldMapping?: FormDataMapping,
  additionalData?: any
) => {
  const { crmprofile } = useAuth();
  const [localFormData, setLocalFormData] = useState<any>({});

  useEffect(() => {
    // Check if crmprofile is valid
    if (
      crmprofile &&
      typeof crmprofile === 'object' &&
      !Array.isArray(crmprofile) &&
      Object.keys(crmprofile).length > 0
    ) {
      console.log('🔄 Autopopulating form with crmprofile:', crmprofile);

      const graphData = crmprofile as any;

      // Default mapping for common fields
      const defaultMapping = {
        // Name fields
        submittedBy:
          graphData.displayName ||
          `${graphData.givenName || ''} ${graphData.surname || ''}`.trim() ||
          crmprofile.name ||
          '',
        requestorName:
          graphData.displayName ||
          `${graphData.givenName || ''} ${graphData.surname || ''}`.trim() ||
          crmprofile.name ||
          '',
        name:
          graphData.displayName ||
          `${graphData.givenName || ''} ${graphData.surname || ''}`.trim() ||
          crmprofile.name ||
          '',
        applicantFullName:
          graphData.displayName ||
          `${graphData.givenName || ''} ${graphData.surname || ''}`.trim() ||
          crmprofile.name ||
          '',

        // Email fields
        emailAddress:
          graphData.mail ||
          graphData.userPrincipalName ||
          crmprofile.email ||
          '',
        email:
          graphData.mail ||
          graphData.userPrincipalName ||
          crmprofile.email ||
          '',
        requestorEmail:
          graphData.mail ||
          graphData.userPrincipalName ||
          crmprofile.email ||
          '',
        emailAddress1:
          graphData.mail ||
          graphData.userPrincipalName ||
          crmprofile.email ||
          '',

        // Phone fields
        telephoneNumber:
          graphData.mobilePhone || graphData.businessPhones?.[0] || '',
        phone: graphData.mobilePhone || graphData.businessPhones?.[0] || '',
        requestorPhone:
          graphData.mobilePhone || graphData.businessPhones?.[0] || '',
        mobileNumber:
          graphData.mobilePhone || graphData.businessPhones?.[0] || '',

        // Position/Job Title
        position: graphData.jobTitle || '',
        requestorPosition: graphData.jobTitle || '',

        // Company fields
        companyName: graphData.companyName || '',
        companyNumber: graphData.companyNumber || '',
        compannyNumber: graphData.companyNumber || '', // Handle typo in some forms
      };

      // Merge: default mapping → custom field mapping → additional data
      const mappedData = {
        ...defaultMapping,
        ...fieldMapping,
        ...additionalData,
      };

      console.log('📊 Mapped form data:', mappedData);
      setLocalFormData(mappedData);
    } else if (additionalData && Object.keys(additionalData).length > 0) {
      // If no crmprofile but we have additional data, use that
      console.log('🔄 Using additional data only:', additionalData);
      setLocalFormData(additionalData);
    }
  }, [crmprofile, fieldMapping, additionalData]);

  return localFormData;
};
