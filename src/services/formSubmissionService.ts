// Simple utility function that works perfectly with FormPreview
import { getFormConfig, EnhancedFormPayload } from '../config/formConfig';
import { FileWithId, isFileWithId, isFileWithIdArray, serializeFilesForSubmission } from '../utils/fileValidationStandards';
import { getCurrentUserId, getCurrentUserAzureId } from '../utils/authUtils';

/**
 * Recursively serialize form data, converting FileWithId arrays to serializable format
 * Handles nested objects and arrays
 */
function serializeFormData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  
  // Handle FileWithId arrays
  if (isFileWithIdArray(data)) {
    return serializeFilesForSubmission(data);
  }
  
  // Handle single FileWithId
  if (isFileWithId(data)) {
    return serializeFilesForSubmission([data])[0];
  }
  
  // Handle File objects (legacy support)
  if (data instanceof File) {
    return {
      filename: data.name,
      size: data.size,
      type: data.type,
      lastModified: data.lastModified
    };
  }
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => serializeFormData(item));
  }
  
  // Handle objects
  if (typeof data === 'object' && data.constructor === Object) {
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeFormData(value);
    }
    return serialized;
  }
  
  // Primitive values pass through
  return data;
}

/**
 * Transform payload for forms that require flat structure (not nested formData)
 * Some backends expect fields at top level instead of nested in formData
 */
function transformPayloadForForm(formId: string, formData: any, azureId?: string, userId?: string): any {
  // Helper to safely get string value
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value).trim();
  };

  // Generate sequence number as integer (timestamp-based)
  const generateSequenceNumber = (): number => {
    // Use timestamp as integer, ensuring it's a valid integer
    return Math.floor(Date.now() / 1000); // Unix timestamp in seconds
  };

  switch (formId) {
    case 'cancel-loan':
      // Validate azureId is present
      if (!azureId || azureId.trim() === '') {
        console.error('❌ Azure ID is missing! Cannot submit cancel-loan form without azureId.');
        throw new Error('User authentication required. Please log in and try again.');
      }
      
      // Get form config for metadata fields
      const config = getFormConfig('cancel-loan');
      
      // Handle consentAcknowledgement - backend expects specific enum value
      // Backend rejected "acknowledged", "true", and "accepted"
      // Trying "yes" - very common enum value for consent fields
      let consentValue = '';
      if (formData.consentAcknowledgement === true || formData.consentAcknowledgement === 'true') {
        consentValue = 'yes'; // Backend enum likely expects "yes" for consent
      } else if (formData.consentAcknowledgement === false || formData.consentAcknowledgement === 'false') {
        consentValue = 'no'; // Common pair with "yes"
      } else {
        consentValue = safeString(formData.consentAcknowledgement || '');
      }
      
      // Generate sequence number - ensure it's always a valid integer
      const seqNumber = generateSequenceNumber();
      if (typeof seqNumber !== 'number' || isNaN(seqNumber)) {
        console.error('❌ Invalid sequence number generated:', seqNumber);
        throw new Error('Failed to generate sequence number');
      }
      
      // Backend expects flat structure with specific field names
      const payload = {
        azureId: azureId.trim(),
        sequenceNumber: seqNumber, // Integer (Unix timestamp in seconds)
        name: safeString(formData.submittedBy || formData.name || ''),
        submittedBy: safeString(formData.submittedBy || ''),
        emailAddress: safeString(formData.emailAddress || ''),
        telephoneNumber: safeString(formData.telephoneNumber || ''),
        companyName: safeString(formData.companyName || ''),
        companyNumber: safeString(formData.companyNumber || ''),
        position: safeString(formData.position || ''),
        fundingNumber: safeString(formData.fundingNumber || ''),
        cancellationDetails: safeString(formData.cancellationDetails || ''),
        consentAcknowledgement: consentValue, // "yes" for true, "no" for false, or empty string
        serviceProvider: 'KF',
        // Add metadata fields that backend expects
        serviceName: config.serviceName,
        category: config.category,
        status: 'submitted'
      };
      
      // Validate sequenceNumber is integer and not null
      if (payload.sequenceNumber === null || payload.sequenceNumber === undefined) {
        console.error('❌ sequenceNumber is null/undefined!', payload);
        throw new Error('Sequence number is required but was null');
      }
      
      // Log consent value for debugging
      console.log('🔍 Consent Acknowledgement:', {
        original: formData.consentAcknowledgement,
        transformed: consentValue,
        type: typeof formData.consentAcknowledgement
      });
      
      // Debug: Log the payload and check for empty required fields
      console.group('🔍 Cancel Loan Payload Transformation');
      console.log('📥 Input formData:', formData);
      console.log('📥 FormData keys:', Object.keys(formData || {}));
      console.log('📤 Transformed payload:', payload);
      console.log('📤 Payload keys:', Object.keys(payload));
      console.log('🔑 Azure ID:', azureId || 'MISSING');
      
      // Check for empty required fields
      const requiredFields = ['azureId', 'name', 'submittedBy', 'emailAddress', 'telephoneNumber', 
                               'companyName', 'companyNumber', 'position', 'fundingNumber', 
                               'cancellationDetails', 'consentAcknowledgement'];
      const emptyFields = requiredFields.filter(field => {
        const value = payload[field as keyof typeof payload];
        return !value || value === '';
      });
      
      if (emptyFields.length > 0) {
        console.error('❌ Empty required fields:', emptyFields);
        console.error('❌ Field values:', emptyFields.map(field => ({
          field,
          value: payload[field as keyof typeof payload],
          source: formData[field] || 'NOT IN FORMDATA'
        })));
      } else {
        console.log('✅ All required fields have values');
      }
      
      // Log each field value for debugging
      console.log('📋 Field-by-field breakdown:');
      requiredFields.forEach(field => {
        const value = payload[field as keyof typeof payload];
        console.log(`  ${field}: "${value}" (${typeof value})`);
      });
      
      console.groupEnd();
      
      return payload;

    case 'book-consultation-for-entrepreneurship':
      // Validate azureId is present
      if (!azureId || azureId.trim() === '') {
        console.error('❌ Azure ID is missing! Cannot submit book-consultation form without azureId.');
        throw new Error('User authentication required. Please log in and try again.');
      }
      
      // Get form config for metadata fields
      const consultationConfig = getFormConfig('book-consultation-for-entrepreneurship');
      
      // Backend expects the form fields AND metadata fields (Power Automate flow requires these)
      const consultationPayload: any = {
        azureId: azureId.trim(),
        name: safeString(formData.submittedBy || formData.name || ''),
        submittedBy: safeString(formData.submittedBy || ''),
        emailAddress1: safeString(formData.emailAddress1 || formData.emailAddress || ''),
        mobileNumber: safeString(formData.mobileNumber || formData.telephoneNumber || ''),
        position: safeString(formData.position || ''),
        companyName: safeString(formData.companyName || ''),
        compannyNumber: safeString(formData.compannyNumber || formData.companyNumber || ''), // Note: backend has typo "companny"
        consultationType: safeString(formData.consultationType || ''),
        consultationName: safeString(formData.consultationName || ''),
        existingBusiness: safeString(formData.existingBusiness || ''),
        businessOwnership: safeString(formData.businessOwnership || ''),
        worksHere: safeString(formData.worksHere || ''),
        selectedAdvice: safeString(formData.selectedAdvice || ''),
        // Backend rejects empty strings, so send 'N/A' if otherAdvices is not provided
        otherAdvices: formData.otherAdvices && formData.otherAdvices.trim() !== '' 
          ? safeString(formData.otherAdvices) 
          : 'N/A',
        // Required metadata fields (backend Power Automate flow requires these)
        serviceProvider: 'KF',
        serviceName: consultationConfig.serviceName,
        category: consultationConfig.category,
        status: 'submitted'
      };
      
      // Ensure all fields are strings (never undefined or null)
      Object.keys(consultationPayload).forEach(key => {
        if (consultationPayload[key] === undefined || consultationPayload[key] === null) {
          consultationPayload[key] = '';
        }
        // Ensure it's a string type
        consultationPayload[key] = String(consultationPayload[key]);
      });
      
      // Debug: Log the payload and check for empty required fields
      console.group('🔍 Book Consultation Payload Transformation');
      console.log('📥 Input formData:', formData);
      console.log('📥 FormData keys:', Object.keys(formData || {}));
      console.log('📤 Transformed payload:', consultationPayload);
      console.log('📤 Payload keys:', Object.keys(consultationPayload));
      console.log('🔑 Azure ID:', azureId || 'MISSING');
      
      // Check for empty required fields (including metadata)
      const consultationRequiredFields = ['azureId', 'name', 'submittedBy', 'emailAddress1', 'mobileNumber', 
                                         'position', 'companyName', 'compannyNumber', 'consultationType', 
                                         'consultationName', 'existingBusiness', 'businessOwnership', 
                                         'worksHere', 'selectedAdvice', 'otherAdvices',
                                         'serviceProvider', 'serviceName', 'category', 'status'];
      const consultationEmptyFields = consultationRequiredFields.filter(field => {
        const value = consultationPayload[field];
        return !value || value === '' || value.trim() === '';
      });
      
      if (consultationEmptyFields.length > 0) {
        console.error('❌ Empty required fields:', consultationEmptyFields);
        console.error('❌ Field values:', consultationEmptyFields.map(field => ({
          field,
          value: consultationPayload[field],
          source: formData[field] || 'NOT IN FORMDATA',
          formDataKeys: Object.keys(formData || {})
        })));
        console.error('⚠️ Please ensure all required fields are filled before submitting');
      } else {
        console.log('✅ All required fields have values');
      }
      
      // Log each field value for debugging
      console.log('📋 Field-by-field breakdown:');
      Object.keys(consultationPayload).forEach(field => {
        const value = consultationPayload[field];
        const isEmpty = !value || value === '' || value.trim() === '';
        console.log(`  ${field}: "${value}" (${typeof value}) ${isEmpty ? '⚠️ EMPTY' : '✅'}`);
      });
      
      console.groupEnd();
      
      return consultationPayload;

    case 'training-in-entrepreneurship':
      // Validate azureId is present
      if (!azureId || azureId.trim() === '') {
        console.error('❌ Azure ID is missing! Cannot submit training form without azureId.');
        throw new Error('User authentication required. Please log in and try again.');
      }
      
      // Get form config for metadata fields
      const trainingConfig = getFormConfig('training-in-entrepreneurship');
      
      // Backend expects flat structure with specific field names AND metadata fields
      // Map form fields to backend expected fields:
      // - requestorName → Name (capital N) and submittedBy
      // - requestorEmail → emailAddress
      // - requestorPhone → telephoneNumber
      const trainingPayload = {
        // Form fields mapped to backend expected names
        Name: safeString(formData.requestorName || formData.name || formData.submittedBy || ''),
        submittedBy: safeString(formData.requestorName || formData.submittedBy || ''),
        emailAddress: safeString(formData.requestorEmail || formData.emailAddress || ''),
        telephoneNumber: safeString(formData.requestorPhone || formData.telephoneNumber || ''),
        // Required metadata fields (backend Power Automate flow requires these)
        serviceProvider: 'KF',
        serviceName: trainingConfig.serviceName,
        category: trainingConfig.category,
        status: 'submitted'
      };
      
      // Debug logging
      console.group('🔍 Training Entrepreneurship Payload Transformation');
      console.log('📥 Input formData:', formData);
      console.log('📥 FormData keys:', Object.keys(formData || {}));
      console.log('📤 Transformed payload:', trainingPayload);
      console.log('📤 Payload keys:', Object.keys(trainingPayload));
      console.log('🔑 Azure ID:', azureId || 'MISSING');
      
      // Check for empty required fields (including metadata)
      const trainingRequiredFields = ['Name', 'submittedBy', 'emailAddress', 'telephoneNumber', 
                                     'serviceProvider', 'serviceName', 'category', 'status'];
      const trainingEmptyFields = trainingRequiredFields.filter(field => {
        const value = trainingPayload[field as keyof typeof trainingPayload];
        return !value || value === '' || value.trim() === '';
      });
      
      if (trainingEmptyFields.length > 0) {
        console.error('❌ Empty required fields:', trainingEmptyFields);
        console.error('❌ Field values:', trainingEmptyFields.map(field => ({
          field,
          value: trainingPayload[field as keyof typeof trainingPayload],
          source: formData[field] || 'NOT IN FORMDATA'
        })));
        console.error('⚠️ Please ensure all required fields are filled before submitting');
      } else {
        console.log('✅ All required fields have values');
      }
      
      // Log each field value for debugging
      console.log('📋 Field-by-field breakdown:');
      trainingRequiredFields.forEach(field => {
        const value = trainingPayload[field as keyof typeof trainingPayload];
        const isEmpty = !value || value === '' || value.trim() === '';
        console.log(`  ${field}: "${value}" (${typeof value}) ${isEmpty ? '⚠️ EMPTY' : '✅'}`);
      });
      
      console.groupEnd();
      
      return trainingPayload;

    case 'collateral-user-guide':
      // Validate azureId is present
      if (!azureId || azureId.trim() === '') {
        console.error('❌ Azure ID is missing! Cannot submit collateral user guide form without azureId.');
        throw new Error('User authentication required. Please log in and try again.');
      }
      
      // Get form config for metadata fields
      const collateralConfig = getFormConfig('collateral-user-guide');
      
      // Backend expects flat structure with specific field names AND metadata fields
      const collateralPayload = {
        azureId: azureId.trim(),
        name: safeString(formData.submittedBy || formData.name || ''),
        submittedBy: safeString(formData.submittedBy || ''),
        emailAddress: safeString(formData.emailAddress || ''),
        telephoneNumber: safeString(formData.telephoneNumber || ''),
        companyName: safeString(formData.companyName || ''),
        companyNumber: safeString(formData.companyNumber || ''),
        position: safeString(formData.position || ''),
        assetName: safeString(formData.assetName || ''),
        assetNumber: safeString(formData.assetNumber || ''),
        additionalDetails: safeString(formData.additionalDetails || ''),
        // Required metadata fields (backend Power Automate flow requires these)
        serviceProvider: 'KF',
        serviceName: collateralConfig.serviceName,
        category: collateralConfig.category,
        status: 'submitted'
      };
      
      // Debug logging
      console.group('🔍 Collateral User Guide Payload Transformation');
      console.log('📥 Input formData:', formData);
      console.log('📥 FormData keys:', Object.keys(formData || {}));
      console.log('📤 Transformed payload:', collateralPayload);
      console.log('📤 Payload keys:', Object.keys(collateralPayload));
      console.log('🔑 Azure ID:', azureId || 'MISSING');
      
      // Check for empty required fields (including metadata)
      const collateralRequiredFields = ['azureId', 'name', 'submittedBy', 'emailAddress', 'telephoneNumber', 
                                       'companyName', 'companyNumber', 'position', 'assetName', 'assetNumber',
                                       'serviceProvider', 'serviceName', 'category', 'status'];
      const collateralEmptyFields = collateralRequiredFields.filter(field => {
        const value = collateralPayload[field as keyof typeof collateralPayload];
        return !value || value === '' || value.trim() === '';
      });
      
      if (collateralEmptyFields.length > 0) {
        console.error('❌ Empty required fields:', collateralEmptyFields);
        console.error('❌ Field values:', collateralEmptyFields.map(field => ({
          field,
          value: collateralPayload[field as keyof typeof collateralPayload],
          source: formData[field] || 'NOT IN FORMDATA'
        })));
        console.error('⚠️ Please ensure all required fields are filled before submitting');
      } else {
        console.log('✅ All required fields have values');
      }
      
      // Log each field value for debugging
      console.log('📋 Field-by-field breakdown:');
      Object.keys(collateralPayload).forEach(field => {
        const value = collateralPayload[field as keyof typeof collateralPayload];
        const isEmpty = !value || value === '' || value.trim() === '';
        console.log(`  ${field}: "${value}" (${typeof value}) ${isEmpty ? '⚠️ EMPTY' : '✅'}`);
      });
      
      console.groupEnd();
      
      return collateralPayload;

    case 'disburse-approved-loan': {
      // Validate azureId is present
      if (!azureId || azureId.trim() === '') {
        console.error('❌ Azure ID is missing! Cannot submit disburse-loan form without azureId.');
        throw new Error('User authentication required. Please log in and try again.');
      }
      
      // Use azureId as userId fallback if userId is not available
      // (Many systems use the same value for both, or azureId can serve as user identifier)
      const finalUserId = (userId && userId.trim() !== '') ? userId.trim() : azureId.trim();
      
      if (!finalUserId || finalUserId.trim() === '') {
        console.error('❌ User ID is missing! Cannot submit disburse-loan form without userId.');
        throw new Error('User identification required. Please log in and try again.');
      }
      
      // Helper to extract file name from file object or FileWithId
      const getFileName = (fileValue: any): string => {
        if (!fileValue) return '';
        if (typeof fileValue === 'string') return fileValue;
        if (fileValue instanceof File) return fileValue.name;
        if (fileValue && typeof fileValue === 'object') {
          // Handle FileWithId or serialized file object
          return fileValue.filename || fileValue.name || '';
        }
        return String(fileValue);
      };
      
      // Handle consentAcknowledgement - similar to cancel-loan
      let disburseConsentValue = '';
      if (formData.consentAcknowledgement === true || formData.consentAcknowledgement === 'true') {
        disburseConsentValue = 'yes';
      } else if (formData.consentAcknowledgement === false || formData.consentAcknowledgement === 'false') {
        disburseConsentValue = 'no';
      } else {
        disburseConsentValue = safeString(formData.consentAcknowledgement || '');
      }
      
      // Generate sequence number as string (backend interface shows string)
      const disburseSeqNumber = String(generateSequenceNumber());
      
      // Convert amountInAED to number
      const amountValue = formData.amountInAED;
      let amountInAED = 0;
      if (typeof amountValue === 'number') {
        amountInAED = amountValue;
      } else if (typeof amountValue === 'string' && amountValue.trim() !== '') {
        const parsed = parseFloat(amountValue);
        amountInAED = isNaN(parsed) ? 0 : parsed;
      }
      
      // Get form config for metadata fields
      const disburseConfig = getFormConfig('disburse-approved-loan');
      
      // Backend expects flat structure with specific field names AND metadata fields
      const disbursePayload = {
        azureId: azureId.trim(),
        userId: finalUserId, // Use azureId as fallback if userId not available
        name: safeString(formData.submittedBy || formData.name || ''),
        submittedBy: safeString(formData.submittedBy || ''),
        emailAddress: safeString(formData.emailAddress || ''),
        telephoneNumber: safeString(formData.telephoneNumber || ''),
        position: safeString(formData.position || ''),
        companyName: safeString(formData.companyName || ''),
        companyNumber: safeString(formData.companyNumber || ''),
        fundingNumber: safeString(formData.fundingNumber || ''),
        amountInAED: amountInAED, // Number type
        paymentMethod: safeString(formData.paymentMethod || ''),
        otherOptional: safeString(formData.otherOptional || ''),
        // File fields - extract file names as strings
        supplierLicense: getFileName(formData.supplierLicense),
        officialQuotations: getFileName(formData.officialQuotations),
        invoices: getFileName(formData.invoices),
        deliveryNotes: getFileName(formData.deliveryNotes),
        paymentReceipts: getFileName(formData.paymentReceipts),
        employeeList: getFileName(formData.employeeList),
        consentAcknowledgement: disburseConsentValue,
        sequenceNumber: disburseSeqNumber, // String type (as per interface)
        // Required metadata fields (backend Power Automate flow requires these)
        serviceProvider: 'KF',
        serviceName: disburseConfig.serviceName,
        category: disburseConfig.category,
        status: 'submitted'
      };
      
      // Debug logging
      console.group('🔍 Disburse Approved Loan Payload Transformation');
      console.log('📥 Input formData:', formData);
      console.log('📥 FormData keys:', Object.keys(formData || {}));
      console.log('📤 Transformed payload:', disbursePayload);
      console.log('📤 Payload keys:', Object.keys(disbursePayload));
      console.log('🔑 Azure ID:', azureId || 'MISSING');
      console.log('👤 User ID:', userId || 'MISSING');
      
      // Check for empty required fields (including metadata)
      const disburseRequiredFields = ['azureId', 'userId', 'name', 'submittedBy', 'emailAddress', 
                                     'telephoneNumber', 'position', 'companyName', 'companyNumber', 
                                     'fundingNumber', 'amountInAED', 'paymentMethod',
                                     'supplierLicense', 'officialQuotations', 'invoices', 
                                     'deliveryNotes', 'paymentReceipts', 'employeeList',
                                     'consentAcknowledgement', 'sequenceNumber',
                                     'serviceProvider', 'serviceName', 'category', 'status'];
      const disburseEmptyFields = disburseRequiredFields.filter(field => {
        const value = disbursePayload[field as keyof typeof disbursePayload];
        if (field === 'amountInAED') {
          return value === 0 || value === null || value === undefined;
        }
        return !value || value === '' || String(value).trim() === '';
      });
      
      if (disburseEmptyFields.length > 0) {
        console.error('❌ Empty required fields:', disburseEmptyFields);
        console.error('❌ Field values:', disburseEmptyFields.map(field => ({
          field,
          value: disbursePayload[field as keyof typeof disbursePayload],
          source: formData[field] || 'NOT IN FORMDATA'
        })));
        console.error('⚠️ Please ensure all required fields are filled before submitting');
      } else {
        console.log('✅ All required fields have values');
      }
      
      // Log each field value for debugging
      console.log('📋 Field-by-field breakdown:');
      disburseRequiredFields.forEach(field => {
        const value = disbursePayload[field as keyof typeof disbursePayload];
        const isEmpty = field === 'amountInAED' 
          ? (value === 0 || value === null || value === undefined)
          : (!value || value === '' || String(value).trim() === '');
        console.log(`  ${field}: "${value}" (${typeof value}) ${isEmpty ? '⚠️ EMPTY' : '✅'}`);
      });
      
      console.groupEnd();
      
      return disbursePayload;
    }

    case 'facilitate-communication': {
      // Validate azureId is present
      if (!azureId || azureId.trim() === '') {
        console.error('❌ Azure ID is missing! Cannot submit facilitate-communication form without azureId.');
        throw new Error('User authentication required. Please log in and try again.');
      }
      
      // Get form config for metadata fields
      const facilitateConfig = getFormConfig('facilitate-communication');
      
      // Map supportType from frontend kebab-case to backend enum values
      // Power Automate schema defines specific enum values
      const mapSupportType = (value: string): string => {
        const mapping: Record<string, string> = {
          'tender': 'Tender',
          'engage-with-stakeholder': 'Engage with stakeholder',
          'waiver': 'Waiver',
          'marketing-support': 'Marketing Support',
          'sales-support': 'Sales Support',
          'participate-in-event': 'Participate in Event',
          'overcome-obstacle': 'Overcome Obstacle',
          'regulation-related': 'Regulation Related',
          'local-sme-priority': 'Local SME Priority',
          'other': 'Other'
        };
        return mapping[value] || 'Other'; // Default to 'Other'
      };
      
      // Map entityType from frontend kebab-case to backend enum values
      // Power Automate schema defines specific enum values (government entities)
      const mapEntityType = (value: string): string => {
        const mapping: Record<string, string> = {
          'federal-authority-nuclear': 'Federal Authority for Nuclear Regulation',
          'ministry-climate-environment': 'Ministry of Climate Change and Environment',
          'union-coop': 'Union Co-op',
          'economic-dev-khorfakkan': 'Economic Development Department-Khorfakkan',
          'sharjah-chamber-khorfakkan': 'Sharjah Chamber of commerce & Industry- Khorfakkan',
          'executive-council': 'General Secretarian of the Executive Council',
          'environment-rak': 'Environment Protection & Development of Ras Al Khaimah'
        };
        return mapping[value] || 'None'; // Default to 'None'
      };
      
      // Handle dataSharingConsent - convert boolean to 'yes'/'no'
      let consentValue = '';
      if (formData.dataSharingConsent === true || formData.dataSharingConsent === 'true') {
        consentValue = 'yes';
      } else if (formData.dataSharingConsent === false || formData.dataSharingConsent === 'false') {
        consentValue = 'no';
      } else {
        consentValue = safeString(formData.dataSharingConsent || '');
      }
      
      // Transform enum values to backend-expected format
      const supportTypeValue = mapSupportType(safeString(formData.supportType || ''));
      const entityTypeValue = mapEntityType(safeString(formData.entityType || ''));
      
      // Backend expects flat structure with specific field names AND metadata fields
      const facilitatePayload = {
        azureId: azureId.trim(),
        name: safeString(formData.submittedBy || formData.name || ''),
        submittedBy: safeString(formData.submittedBy || ''),
        emailAddress: safeString(formData.emailAddress || ''),
        telephoneNumber: safeString(formData.telephoneNumber || ''),
        position: safeString(formData.position || ''),
        companyName: safeString(formData.companyName || ''),
        companyNumber: safeString(formData.companyNumber || ''),
        supportType: supportTypeValue, // Mapped to backend enum format
        entityType: entityTypeValue, // Mapped to backend enum format
        supportSubject: safeString(formData.supportSubject || ''),
        financialImpact: safeString(formData.financialImpact || ''),
        supportDescription: safeString(formData.supportDescription || ''),
        dataSharingConsent: consentValue, // 'yes'/'no' or empty string
        // Required metadata fields (backend Power Automate flow requires these)
        serviceProvider: 'KF',
        serviceName: facilitateConfig.serviceName,
        category: facilitateConfig.category,
        status: 'submitted'
      };
      
      // Log enum value transformations for debugging
      console.log('🔄 Enum Value Transformations:');
      console.log(`  supportType: "${formData.supportType}" → "${supportTypeValue}"`);
      console.log(`  entityType: "${formData.entityType}" → "${entityTypeValue}"`);
      
      // Debug logging
      console.group('🔍 Facilitate Communication Payload Transformation');
      console.log('📥 Input formData:', formData);
      console.log('📥 FormData keys:', Object.keys(formData || {}));
      console.log('📤 Transformed payload:', facilitatePayload);
      console.log('📤 Payload keys:', Object.keys(facilitatePayload));
      console.log('🔑 Azure ID:', azureId || 'MISSING');
      
      // Check for empty required fields (including metadata)
      const facilitateRequiredFields = ['azureId', 'name', 'submittedBy', 'emailAddress', 
                                       'telephoneNumber', 'position', 'companyName', 'companyNumber',
                                       'supportType', 'entityType', 'supportSubject', 'supportDescription',
                                       'dataSharingConsent',
                                       'serviceProvider', 'serviceName', 'category', 'status'];
      const facilitateEmptyFields = facilitateRequiredFields.filter(field => {
        const value = facilitatePayload[field as keyof typeof facilitatePayload];
        // financialImpact is optional, so skip it
        if (field === 'financialImpact') return false;
        return !value || value === '' || String(value).trim() === '';
      });
      
      if (facilitateEmptyFields.length > 0) {
        console.error('❌ Empty required fields:', facilitateEmptyFields);
        console.error('❌ Field values:', facilitateEmptyFields.map(field => ({
          field,
          value: facilitatePayload[field as keyof typeof facilitatePayload],
          source: formData[field] || 'NOT IN FORMDATA'
        })));
        console.error('⚠️ Please ensure all required fields are filled before submitting');
      } else {
        console.log('✅ All required fields have values');
      }
      
      // Log each field value for debugging
      console.log('📋 Field-by-field breakdown:');
      facilitateRequiredFields.forEach(field => {
        const value = facilitatePayload[field as keyof typeof facilitatePayload];
        const isEmpty = !value || value === '' || String(value).trim() === '';
        console.log(`  ${field}: "${value}" (${typeof value}) ${isEmpty ? '⚠️ EMPTY' : '✅'}`);
      });
      
      console.groupEnd();
      
      return facilitatePayload;
    }

    case 'issue-support-letter': {
      // Validate azureId is present
      if (!azureId || azureId.trim() === '') {
        console.error('❌ Azure ID is missing! Cannot submit issue-support-letter form without azureId.');
        throw new Error('User authentication required. Please log in and try again.');
      }
      
      // Get form config for metadata fields
      const supportLetterConfig = getFormConfig('issue-support-letter');
      
      // Map supportLetterType from frontend kebab-case to backend PascalCase enum values
      const mapSupportLetterType = (value: string): string => {
        const mapping: Record<string, string> = {
          'employment': 'EmploymentVerification',
          'financial': 'FinancialSupport',
          'travel': 'TravelSupport',
          'education': 'EducationSupport',
          'visa': 'VisaSupport',
          'other': 'Other'
        };
        return mapping[value] || value; // Fallback to original if not found
      };
      
      // Helper to extract file name from file object or FileWithId
      const getFileName = (fileValue: any): string => {
        if (!fileValue) return '';
        if (typeof fileValue === 'string') return fileValue;
        if (fileValue instanceof File) return fileValue.name;
        if (fileValue && typeof fileValue === 'object') {
          return fileValue.filename || fileValue.name || '';
        }
        return String(fileValue);
      };
      
      // Handle supportingDocuments - extract file names from array
      const supportingDocumentsValue = Array.isArray(formData.supportingDocuments)
        ? formData.supportingDocuments.map(getFileName).filter(name => name).join(', ')
        : getFileName(formData.supportingDocuments);
      
      // Handle consentAcknowledgement - backend rejected "yes", "true", trying capitalized "Yes"/"No"
      // This form's backend schema may be different from cancel-loan
      let consentValue: string = '';
      if (formData.consentAcknowledgement === true || formData.consentAcknowledgement === 'true') {
        consentValue = 'Yes'; // Try capitalized enum (common in Power Automate)
      } else if (formData.consentAcknowledgement === false || formData.consentAcknowledgement === 'false') {
        consentValue = 'No'; // Try capitalized enum
      } else {
        consentValue = safeString(formData.consentAcknowledgement || '');
      }
      
      // Handle termsAndConditions - backend rejected "yes", "true", trying capitalized "Yes"/"No"
      let termsValue: string = '';
      if (formData.termsAndConditions === true || formData.termsAndConditions === 'true') {
        termsValue = 'Yes'; // Try capitalized enum (common in Power Automate)
      } else if (formData.termsAndConditions === false || formData.termsAndConditions === 'false') {
        termsValue = 'No'; // Try capitalized enum
      } else {
        termsValue = safeString(formData.termsAndConditions || '');
      }
      
      // Generate sequence number - ensure it's always a valid integer
      const seqNumber = generateSequenceNumber();
      if (typeof seqNumber !== 'number' || isNaN(seqNumber)) {
        console.error('❌ Invalid sequence number generated:', seqNumber);
        throw new Error('Failed to generate sequence number');
      }
      
      // Transform enum values to backend-expected format
      const supportLetterTypeValue = mapSupportLetterType(safeString(formData.supportLetterType || ''));
      
      // Backend expects flat structure with specific field names AND metadata fields
      const supportLetterPayload = {
        azureId: azureId.trim(),
        sequenceNumber: seqNumber, // Integer (Unix timestamp in seconds) - REQUIRED by backend
        name: safeString(formData.submittedBy || formData.name || formData.emailAddress || ''),
        submittedBy: safeString(formData.submittedBy || formData.emailAddress || ''),
        emailAddress: safeString(formData.emailAddress || ''),
        telephoneNumber: safeString(formData.telephoneNumber || ''),
        position: safeString(formData.position || ''),
        companyName: safeString(formData.companyName || ''),
        companyNumber: safeString(formData.companyNumber || ''),
        fundingNumber: safeString(formData.fundingNumber || ''),
        cancellationDetails: safeString(formData.cancellationDetails || ''),
        supportLetterType: supportLetterTypeValue, // Mapped to backend enum format
        supportLetterPurpose: safeString(formData.supportLetterPurpose || ''),
        letterRecipient: safeString(formData.letterRecipient || ''),
        letterDateNeededBy: safeString(formData.letterDateNeededBy || ''),
        letterContentSpecifics: safeString(formData.letterContentSpecifics || ''),
        supportingDocuments: supportingDocumentsValue, // File names as comma-separated string
        additionalNotes: safeString(formData.additionalNotes || ''),
        consentAcknowledgement: consentValue, // 'Yes'/'No' (capitalized string enum)
        termsAndConditions: termsValue, // 'Yes'/'No' (capitalized string enum)
        // Required metadata fields (backend Power Automate flow requires these)
        serviceProvider: 'KF',
        serviceName: supportLetterConfig.serviceName,
        category: supportLetterConfig.category,
        status: 'submitted'
      };
      
      // Log enum value transformations for debugging
      console.log('🔄 Enum Value Transformations:');
      console.log(`  supportLetterType: "${formData.supportLetterType}" → "${supportLetterTypeValue}"`);
      console.log(`  consentAcknowledgement: ${formData.consentAcknowledgement} → "${consentValue}" (${typeof consentValue})`);
      console.log(`  termsAndConditions: ${formData.termsAndConditions} → "${termsValue}" (${typeof termsValue})`);
      console.log(`  sequenceNumber: ${seqNumber} (${typeof seqNumber})`);
      console.log(`  sequenceNumber validation: ${typeof seqNumber === 'number' && !isNaN(seqNumber) ? '✅ Valid integer' : '❌ Invalid'}`);
      
      // Debug logging
      console.group('🔍 Issue Support Letter Payload Transformation');
      console.log('📥 Input formData:', formData);
      console.log('📥 FormData keys:', Object.keys(formData || {}));
      console.log('📤 Transformed payload:', supportLetterPayload);
      console.log('📤 Payload keys:', Object.keys(supportLetterPayload));
      console.log('🔑 Azure ID:', azureId || 'MISSING');
      
      // Check for empty required fields (including metadata)
      const supportLetterRequiredFields = ['azureId', 'sequenceNumber', 'name', 'submittedBy', 'emailAddress', 
                                          'telephoneNumber', 'position', 'companyName', 'companyNumber',
                                          'fundingNumber', 'cancellationDetails', 'supportLetterType',
                                          'letterRecipient', 'letterDateNeededBy', 'consentAcknowledgement',
                                          'termsAndConditions',
                                          'serviceProvider', 'serviceName', 'category', 'status'];
      const supportLetterEmptyFields = supportLetterRequiredFields.filter(field => {
        const value = supportLetterPayload[field as keyof typeof supportLetterPayload];
        return !value || value === '' || String(value).trim() === '';
      });
      
      if (supportLetterEmptyFields.length > 0) {
        console.error('❌ Empty required fields:', supportLetterEmptyFields);
        console.error('❌ Field values:', supportLetterEmptyFields.map(field => ({
          field,
          value: supportLetterPayload[field as keyof typeof supportLetterPayload],
          source: formData[field] || 'NOT IN FORMDATA'
        })));
        console.error('⚠️ Please ensure all required fields are filled before submitting');
      } else {
        console.log('✅ All required fields have values');
      }
      
      // Log each field value for debugging
      console.log('📋 Field-by-field breakdown:');
      supportLetterRequiredFields.forEach(field => {
        const value = supportLetterPayload[field as keyof typeof supportLetterPayload];
        const isEmpty = !value || value === '' || String(value).trim() === '';
        console.log(`  ${field}: "${value}" (${typeof value}) ${isEmpty ? '⚠️ EMPTY' : '✅'}`);
      });
      
      console.groupEnd();
      
      return supportLetterPayload;
    }

    case 'reallocation-loan-form': {
      // Validate azureId is present
      if (!azureId || azureId.trim() === '') {
        console.error('❌ Azure ID is missing! Cannot submit reallocation-loan-form without azureId.');
        throw new Error('User authentication required. Please log in and try again.');
      }
      
      // Get form config for metadata fields
      const reallocationConfig = getFormConfig('reallocation-loan-form');
      
      // Helper to extract file name from file object or FileWithId
      const getFileName = (fileValue: any): string => {
        if (!fileValue) return '';
        if (typeof fileValue === 'string') return fileValue;
        if (fileValue instanceof File) return fileValue.name;
        if (fileValue && typeof fileValue === 'object') {
          return fileValue.filename || fileValue.name || '';
        }
        return String(fileValue);
      };
      
      // Handle file fields - extract file names
      const companyLetterValue = getFileName(formData.companyLetter);
      const supportingDocumentValue = getFileName(formData.supportingDocument);
      
      // Handle termsAgreed consent field - convert boolean to string enum
      // Try capitalized "Yes"/"No" first (common in Power Automate)
      let termsAgreedValue: string = '';
      if (formData.termsAgreed === true || formData.termsAgreed === 'true') {
        termsAgreedValue = 'Yes'; // Capitalized enum (common in Power Automate)
      } else if (formData.termsAgreed === false || formData.termsAgreed === 'false') {
        termsAgreedValue = 'No'; // Capitalized enum
      } else {
        termsAgreedValue = safeString(formData.termsAgreed || '');
      }
      
      // Generate sequence number - ensure it's always a valid integer
      const seqNumber = generateSequenceNumber();
      if (typeof seqNumber !== 'number' || isNaN(seqNumber)) {
        console.error('❌ Invalid sequence number generated:', seqNumber);
        throw new Error('Failed to generate sequence number');
      }
      
      // Backend expects flat structure with specific field names AND metadata fields
      const reallocationPayload = {
        azureId: azureId.trim(),
        sequenceNumber: seqNumber, // Integer (Unix timestamp in seconds) - REQUIRED by backend
        name: safeString(formData.name || formData.submittedBy || formData.emailAddress || ''),
        submittedBy: safeString(formData.submittedBy || formData.name || ''),
        emailAddress: safeString(formData.emailAddress || ''),
        telephoneNumber: safeString(formData.telephoneNumber || ''),
        position: safeString(formData.position || ''),
        companyName: safeString(formData.companyName || ''),
        companyNumber: safeString(formData.companyNumber || ''),
        fundingNumber: safeString(formData.fundingNumber || ''),
        description: safeString(formData.description || ''),
        companyLetter: companyLetterValue, // File name as string
        supportingDocument: supportingDocumentValue, // File name as string
        termsAgreed: termsAgreedValue, // 'Yes'/'No' (capitalized string enum)
        // Required metadata fields (backend Power Automate flow requires these)
        serviceProvider: 'KF',
        serviceName: reallocationConfig.serviceName,
        category: reallocationConfig.category,
        status: 'submitted'
      };
      
      // Log enum value transformations for debugging
      console.log('🔄 Enum Value Transformations:');
      console.log(`  termsAgreed: ${formData.termsAgreed} → "${termsAgreedValue}" (${typeof termsAgreedValue})`);
      console.log(`  sequenceNumber: ${seqNumber} (${typeof seqNumber})`);
      console.log(`  sequenceNumber validation: ${typeof seqNumber === 'number' && !isNaN(seqNumber) ? '✅ Valid integer' : '❌ Invalid'}`);
      
      // Debug logging
      console.group('🔍 Reallocation Loan Disbursement Payload Transformation');
      console.log('📥 Input formData:', formData);
      console.log('📥 FormData keys:', Object.keys(formData || {}));
      console.log('📤 Transformed payload:', reallocationPayload);
      console.log('📤 Payload keys:', Object.keys(reallocationPayload));
      console.log('🔑 Azure ID:', azureId || 'MISSING');
      
      // Check for empty required fields (including metadata)
      const reallocationRequiredFields = ['azureId', 'sequenceNumber', 'name', 'submittedBy', 'emailAddress', 
                                          'telephoneNumber', 'position', 'companyName', 'companyNumber',
                                          'fundingNumber', 'description', 'companyLetter', 'supportingDocument',
                                          'termsAgreed',
                                          'serviceProvider', 'serviceName', 'category', 'status'];
      const reallocationEmptyFields = reallocationRequiredFields.filter(field => {
        const value = reallocationPayload[field as keyof typeof reallocationPayload];
        return !value || value === '' || String(value).trim() === '';
      });
      
      if (reallocationEmptyFields.length > 0) {
        console.error('❌ Empty required fields:', reallocationEmptyFields);
        console.error('❌ Field values:', reallocationEmptyFields.map(field => ({
          field,
          value: reallocationPayload[field as keyof typeof reallocationPayload],
          source: formData[field] || 'NOT IN FORMDATA'
        })));
        console.error('⚠️ Please ensure all required fields are filled before submitting');
      } else {
        console.log('✅ All required fields have values');
      }
      
      // Log each field value for debugging
      console.log('📋 Field-by-field breakdown:');
      reallocationRequiredFields.forEach(field => {
        const value = reallocationPayload[field as keyof typeof reallocationPayload];
        const isEmpty = !value || value === '' || String(value).trim() === '';
        console.log(`  ${field}: "${value}" (${typeof value}) ${isEmpty ? '⚠️ EMPTY' : '✅'}`);
      });
      
      console.groupEnd();
      
      return reallocationPayload;
    }

    default:
      // Default: return nested structure (EnhancedFormPayload)
      return null; // null means use default nested structure
  }
}

/**
 * Creates a form submission handler that adds metadata to form data
 * Works seamlessly with FormPreview's onSubmit prop
 * 
 * @param formId - The form ID from formConfig
 * @param azureIdOverride - Optional Azure ID to use instead of getting from storage/auth
 */
export const createFormSubmissionHandler = (formId: string, azureIdOverride?: string) => {
  const config = getFormConfig(formId);
  
  return async (formData: any, additionalMetadata?: any): Promise<any> => {
    // Serialize form data (convert FileWithId arrays and File objects to serializable format)
    const serializedFormData = serializeFormData(formData);
    
    // Get user identification from auth
    const userId = getCurrentUserId();
    // Use override if provided, otherwise try to get from storage/auth
    const azureId = azureIdOverride || getCurrentUserAzureId();
    
    // Check if this form needs a flat payload structure
    const flatPayload = transformPayloadForForm(formId, serializedFormData, azureId, userId);
    
    // Create payload (flat structure for specific forms, nested for others)
    let finalPayload: any;
    
    if (flatPayload !== null) {
      // Use flat structure for forms that require it
      finalPayload = flatPayload;
    } else {
      // Use nested structure (default EnhancedFormPayload)
      finalPayload = {
      // Form metadata (from config)
      serviceName: config.serviceName,
      formName: config.formName,
      formId: config.formId,
      category: config.category, // Automatically included from config  
      submittedAt: new Date().toISOString(),
      status: "submitted",
      
        // Serialized form data (FileWithId arrays converted to metadata)
        formData: serializedFormData,
      
      // Optional additional metadata
      submittedBy: additionalMetadata?.submittedBy,
      sessionId: additionalMetadata?.sessionId,
        userAgent: navigator.userAgent,
        userId: userId,
        azureId: azureId
      };
    }

    // Detailed logging for debugging
    console.group(`📤 Submitting ${config.formName}`);
    console.log(`🔗 API Endpoint:`, config.apiEndpoint);
    console.log(`📊 Payload:`, finalPayload);
    console.log(`📏 Payload Size: ${JSON.stringify(finalPayload).length} characters`);
    console.log(`👤 User ID:`, userId || 'Not available');
    console.log(`🔑 Azure ID:`, azureId || 'Not available');
    console.log(`📋 Payload Structure:`, flatPayload !== null ? 'Flat (form-specific)' : 'Nested (standard)');
    console.groupEnd();

    // Validate API endpoint exists
    if (!config.apiEndpoint) {
      const errorMsg = `No API endpoint configured for form: ${config.formId}`;
      console.error(`❌ ${errorMsg}`);
      throw new Error(errorMsg);
    }

    try {
      const startTime = Date.now();
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalPayload),
      });

      const duration = Date.now() - startTime;
      console.log(`⏱️ Request duration: ${duration}ms`);
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      console.log(`📋 Response headers:`, Object.fromEntries(response.headers.entries()));

      // Get response body (try JSON first, fallback to text)
      let responseBody: any;
      const contentType = response.headers.get('content-type');
      const responseText = await response.text();

      try {
        responseBody = responseText ? JSON.parse(responseText) : null;
      } catch (parseError) {
        // Response is not JSON, use text
        responseBody = responseText;
      }

      // Log response for debugging
      console.group(`📥 API Response for ${config.formName}`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Body:`, responseBody);
      console.log(`Raw Response Text:`, responseText);
      
      // If error, log it prominently
      if (!response.ok) {
        console.error('🚨 BACKEND ERROR RESPONSE:');
        console.error(JSON.stringify(responseBody, null, 2));
        if (responseBody?.missingFields) {
          console.error('❌ Missing Fields:', responseBody.missingFields);
        }
      }
      console.groupEnd();

      // Check HTTP status
      if (!response.ok) {
        let errorMessage: string;
        
        if (typeof responseBody === 'object' && responseBody) {
          // Check for structured error response
          if (responseBody.error) {
            errorMessage = responseBody.error;
            // Include missingFields if present
            if (responseBody.missingFields && Array.isArray(responseBody.missingFields)) {
              errorMessage += ` (Missing: ${responseBody.missingFields.join(', ')})`;
            }
            // Include message if present
            if (responseBody.message && responseBody.message !== errorMessage) {
              errorMessage = `${responseBody.message}: ${errorMessage}`;
            }
          } else if (responseBody.message) {
            errorMessage = responseBody.message;
          } else {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        } else if (typeof responseBody === 'string') {
          errorMessage = responseBody;
        } else {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        // Show alert with full error details for debugging
        if (import.meta.env.DEV) {
          const fullError = JSON.stringify(responseBody, null, 2);
          console.error(`❌ API Error (${response.status}):`, errorMessage);
          console.error(`📋 Full error response:`, responseBody);
          console.error(`📋 Full error JSON:`, fullError);
          alert(`Backend Error (${response.status}):\n\n${errorMessage}\n\nFull Response:\n${fullError}`);
        }
        
        throw new Error(`API Error (${response.status}): ${errorMessage}`);
      }

      // Validate response structure
      if (responseBody && typeof responseBody === 'object') {
        // Check for explicit error indicators in response
        if (responseBody.success === false || responseBody.error) {
          const errorMessage = responseBody.message || responseBody.error || 'Submission failed';
          console.error(`❌ Backend returned error:`, responseBody);
          throw new Error(errorMessage);
        }
      }

      console.log(`✅ ${config.formName} submitted successfully`);
      return responseBody;
    } catch (error: any) {
      // Enhanced error logging
      console.group(`❌ ${config.formName} Submission Error`);
      console.error(`Error type:`, error.name);
      console.error(`Error message:`, error.message);
      console.error(`Error stack:`, error.stack);
      
      // Check for network errors
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        console.error(`🌐 Network error detected - check CORS, connectivity, or server availability`);
      }
      
      console.groupEnd();

      // Preserve original error message if it's already user-friendly
      if (error.message && error.message.includes('API Error')) {
        throw error;
      }

      // Create user-friendly error message
      const userMessage = error.message || `Failed to submit ${config.formName}. Please try again.`;
      throw new Error(userMessage);
    }
  };
};
