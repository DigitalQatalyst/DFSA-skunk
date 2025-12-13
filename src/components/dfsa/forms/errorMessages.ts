/**
 * DFSA Form Error Messages and Utilities
 *
 * User-friendly error messages for all failure scenarios
 * Requirements: 6.2, 6.3
 */

/**
 * Error codes for categorizing errors
 */
export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'SAVE_ERROR'
  | 'LOAD_ERROR'
  | 'UPLOAD_ERROR'
  | 'FILE_TYPE_ERROR'
  | 'FILE_SIZE_ERROR'
  | 'STORAGE_ERROR'
  | 'SUBMISSION_ERROR'
  | 'SESSION_ERROR'
  | 'PERMISSION_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Error severity levels
 */
export type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Structured error object
 */
export interface FormError {
  code: ErrorCode;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  field?: string;
  recoverable: boolean;
  suggestedAction?: string;
}

/**
 * User-friendly error messages mapping
 */
export const ERROR_MESSAGES: Record<ErrorCode, { message: string; suggestedAction: string }> = {
  VALIDATION_ERROR: {
    message: 'Please check the highlighted fields and correct any errors.',
    suggestedAction: 'Review the form fields marked in red and provide valid information.'
  },
  NETWORK_ERROR: {
    message: 'Unable to connect to the server. Please check your internet connection.',
    suggestedAction: 'Check your internet connection and try again. Your data has been saved locally.'
  },
  SAVE_ERROR: {
    message: 'Unable to save your progress. Your data has been backed up locally.',
    suggestedAction: 'Try saving again in a few moments. Your work is safe.'
  },
  LOAD_ERROR: {
    message: 'Unable to load your application data.',
    suggestedAction: 'Try refreshing the page. If the problem persists, contact support.'
  },
  UPLOAD_ERROR: {
    message: 'Unable to upload the file. Please try again.',
    suggestedAction: 'Check your internet connection and try uploading the file again.'
  },
  FILE_TYPE_ERROR: {
    message: 'This file type is not supported.',
    suggestedAction: 'Please upload a file in one of the supported formats: PDF, DOCX, XLSX, JPG, or PNG.'
  },
  FILE_SIZE_ERROR: {
    message: 'The file is too large to upload.',
    suggestedAction: 'Please upload a file smaller than 10MB.'
  },
  STORAGE_ERROR: {
    message: 'Unable to store data locally.',
    suggestedAction: 'Your browser storage may be full. Try clearing some browser data or using a different browser.'
  },
  SUBMISSION_ERROR: {
    message: 'Unable to submit your application.',
    suggestedAction: 'Please ensure all required fields are completed and try again.'
  },
  SESSION_ERROR: {
    message: 'Your session has expired.',
    suggestedAction: 'Please log in again to continue. Your draft has been saved.'
  },
  PERMISSION_ERROR: {
    message: 'You do not have permission to perform this action.',
    suggestedAction: 'Please contact your administrator if you believe this is an error.'
  },
  UNKNOWN_ERROR: {
    message: 'An unexpected error occurred.',
    suggestedAction: 'Please try again. If the problem persists, contact support.'
  }
};

/**
 * Creates a structured form error
 */
export function createFormError(
  code: ErrorCode,
  options?: {
    field?: string;
    customMessage?: string;
    severity?: ErrorSeverity;
  }
): FormError {
  const errorInfo = ERROR_MESSAGES[code];

  return {
    code,
    message: options?.customMessage || errorInfo.message,
    userMessage: options?.customMessage || errorInfo.message,
    severity: options?.severity || 'error',
    field: options?.field,
    recoverable: code !== 'PERMISSION_ERROR' && code !== 'SESSION_ERROR',
    suggestedAction: errorInfo.suggestedAction
  };
}

/**
 * Converts validation errors to user-friendly messages
 */
export function formatValidationErrors(errors: Record<string, string>): FormError[] {
  return Object.entries(errors).map(([field, message]) => ({
    code: 'VALIDATION_ERROR' as ErrorCode,
    message,
    userMessage: message,
    severity: 'error' as ErrorSeverity,
    field,
    recoverable: true,
    suggestedAction: 'Please correct this field to continue.'
  }));
}

/**
 * Gets a user-friendly message for network errors
 */
export function getNetworkErrorMessage(error: Error | unknown): FormError {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';

  // Check for specific network error types
  if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    return createFormError('NETWORK_ERROR');
  }

  if (errorMessage.includes('timeout')) {
    return createFormError('NETWORK_ERROR', {
      customMessage: 'The request timed out. Please try again.'
    });
  }

  if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
    return createFormError('SESSION_ERROR');
  }

  if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
    return createFormError('PERMISSION_ERROR');
  }

  return createFormError('UNKNOWN_ERROR');
}

/**
 * Gets a user-friendly message for file upload errors
 */
export function getFileUploadErrorMessage(error: Error | unknown, fileName?: string): FormError {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';

  if (errorMessage.includes('type') || errorMessage.includes('format')) {
    return createFormError('FILE_TYPE_ERROR', {
      customMessage: fileName
        ? `The file "${fileName}" is not a supported format.`
        : undefined
    });
  }

  if (errorMessage.includes('size') || errorMessage.includes('large')) {
    return createFormError('FILE_SIZE_ERROR', {
      customMessage: fileName
        ? `The file "${fileName}" exceeds the 10MB size limit.`
        : undefined
    });
  }

  return createFormError('UPLOAD_ERROR');
}

/**
 * Formats an error count message
 */
export function formatErrorCount(count: number): string {
  if (count === 0) return '';
  if (count === 1) return '1 error found';
  return `${count} errors found`;
}

/**
 * Gets the first error field ID for focusing
 */
export function getFirstErrorFieldId(errors: Record<string, string>): string | null {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return null;

  // Convert field path to element ID format
  return `form-input-${firstKey.replace(/\./g, '-')}`;
}

/**
 * Scrolls to and focuses the first error field
 */
export function focusFirstError(errors: Record<string, string>): void {
  const fieldId = getFirstErrorFieldId(errors);
  if (!fieldId) return;

  // Try to find the element
  const element = document.getElementById(fieldId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      element.focus();
    }, 300);
  }
}

/**
 * Groups errors by step for summary display
 */
export function groupErrorsByStep(
  errors: Record<string, string>,
  stepFieldMapping: Record<string, string[]>
): Record<string, Record<string, string>> {
  const grouped: Record<string, Record<string, string>> = {};

  Object.entries(errors).forEach(([field, message]) => {
    // Find which step this field belongs to
    let stepId = 'unknown';
    for (const [step, fields] of Object.entries(stepFieldMapping)) {
      if (fields.some(f => field.startsWith(f))) {
        stepId = step;
        break;
      }
    }

    if (!grouped[stepId]) {
      grouped[stepId] = {};
    }
    grouped[stepId][field] = message;
  });

  return grouped;
}
