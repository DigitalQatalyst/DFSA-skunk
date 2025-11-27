// Support service for integrating with Power Automate flow API
export interface AttachmentData {
  filename: string;
  content: string; // base64 encoded
  mimetype: string;
}

export interface SupportRequestData {
  name: string;        // maps to fullName
  email: string;       // maps to emailAddress
  subject: string;
  category: string;    // will be mapped to enum values
  priority: string;    // will be capitalized to match enum
  message: string;
  attachments?: AttachmentData[]; // base64 encoded attachments
  azureId?: string;    // optional in form, will use default if not provided
}

// Server schema interface (for reference)
export interface SupportRequestSchema {
  fullName: string;
  emailAddress: string;
  subject: string;
  category: 'Technical Issue' | 'Billing Question' | 'Account Management' | 'General Inquiry' | 'Feature Request' | 'Bug Report' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  azureId: string;    // required by Power Automate flow
}

export interface SupportRequestResponse {
  success: boolean;
  ticketId?: string;
  message: string;
}

// API endpoint for Power Automate flow
const SUPPORT_API_ENDPOINT = 'https://kfrealexpressserver.vercel.app/api/v1/support/create-support-request';

/**
 * Submit a support request to the Power App endpoint with base64 attachments
 */
export const submitSupportRequest = async (data: SupportRequestData): Promise<SupportRequestResponse> => {
  try {
    const mapCategory = (c: string) => {
      switch ((c || '').toLowerCase()) {
        case 'technical':
          return 'Technical Issue';
        case 'billing':
          return 'Billing Question';
        case 'account':
          return 'Account Management';
        case 'feature':
          return 'Feature Request';
        case 'other':
          return 'Other';
        default:
          return 'General Inquiry';
      }
    };

    const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

    const env = (import.meta as unknown as { env?: { VITE_SUPPORT_AZURE_ID?: string } }).env || {};
    const defaultAzureId = env.VITE_SUPPORT_AZURE_ID || '00000000-0000-0000-0000-000000000000';

    // Generate formId here, assuming you need to pass it
    const formId = `FORM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Map attachments to an array of base64 encoded strings
    const base64Attachments = data.attachments?.map((attachment) => attachment.content) || [];

    const jsonPayload = {
      formId: formId,  // Ensure formId is included
      azureId: data.azureId || defaultAzureId,
      fullName: data.name,
      emailAddress: data.email,
      subject: data.subject,
      category: mapCategory(data.category),
      priority: capitalize(data.priority),
      message: data.message,
      attachments: base64Attachments, // Only Base64 content here
    };

    console.log('Submitting support request with JSON', jsonPayload);

    const response = await fetch(SUPPORT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(jsonPayload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Error response:', responseText);

      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorJson = JSON.parse(responseText);
        errorMessage = errorJson.message || errorJson.error || responseText;
      } catch {
        errorMessage = responseText.includes('<!DOCTYPE') ? 'Server Error' : responseText;
      }

      console.error('Parsed error:', errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Success response:', result);

    return {
      success: true,
      ticketId: result.ticketId || result.id || result.ticket_id || generateTicketId(),
      message: result.message || 'Support request submitted successfully',
    };

  } catch (error) {
    console.error('Error submitting support request:', error);
    return {
      success: false,
      message: error instanceof Error
        ? `Failed to submit support request: ${error.message}`
        : 'An unexpected error occurred while submitting your request',
    };
  }
};


/**
 * Generate a fallback ticket ID if not provided by the API
 */
const generateTicketId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `TKT-${timestamp}-${random}`;
};

/**
 * Validate support request data before submission
 */
export const validateSupportRequest = (data: SupportRequestData): string[] => {
  const errors: string[] = [];
  
  if (!data.name?.trim()) {
    errors.push('Name is required');
  }
  
  if (!data.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.subject?.trim()) {
    errors.push('Subject is required');
  }
  
  if (!data.category?.trim()) {
    errors.push('Category is required');
  }
  
  if (!data.message?.trim()) {
    errors.push('Message is required');
  }
  
  return errors;
};

/**
 * Convert File to base64 encoded attachment
 */
export const fileToBase64 = (file: File): Promise<AttachmentData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64Content = result.split(',')[1];
      resolve({
        filename: file.name,
        content: base64Content,
        mimetype: file.type || 'application/octet-stream'
      });
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Convert multiple Files to base64 encoded attachments
 */
export const filesToBase64 = async (files: File[]): Promise<AttachmentData[]> => {
  return Promise.all(files.map(file => fileToBase64(file)));
};

/**
 * Validate files before upload - STRICT limits to avoid payload too large
 */
export const validateFiles = (files: File[]): string[] => {
  const errors: string[] = [];
  const maxFileSize = 500 * 1024; // 500KB per file (very conservative for base64)
  const maxTotalSize = 1 * 1024 * 1024; // 1MB total
  const maxFiles = 2; // Only 2 files max
  
  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} files allowed due to server limits`);
  }
  
  let totalSize = 0;
  files.forEach((file) => {
    totalSize += file.size;
    if (file.size > maxFileSize) {
      errors.push(`File "${file.name}" exceeds 500KB limit`);
    }
  });
  
  if (totalSize > maxTotalSize) {
    errors.push(`Total file size exceeds 1MB limit. Current: ${(totalSize / 1024).toFixed(0)}KB`);
  }
  
  return errors;
};
