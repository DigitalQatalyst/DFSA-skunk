/**
 * DFSA Error Handling Utilities
 *
 * Centralized error handling for DFSA Financial Services Application Form
 * Requirements: 6.2, 6.3, 8.3
 */

import { ValidationResult } from './formValidationStandards';

/**
 * Error types for DFSA form operations
 */
export type DFSAErrorType =
  | 'validation'
  | 'required'
  | 'format'
  | 'network'
  | 'storage'
  | 'authentication'
  | 'permission'
  | 'system';

/**
 * Structured error information
 */
export interface DFSAError {
  type: DFSAErrorType;
  field?: string;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

/**
 * Form validation error with field context
 */
export interface FormValidationError extends DFSAError {
  type: 'validation' | 'required' | 'format';
  field: string;
  value?: any;
  constraint?: string;
}

/**
 * Network/API error
 */
export interface NetworkError extends DFSAError {
  type: 'network';
  statusCode?: number;
  endpoint?: string;
  retryable: boolean;
}

/**
 * Storage/file operation error
 */
export interface StorageError extends DFSAError {
  type: 'storage';
  operation: 'upload' | 'download' | 'delete';
  fileName?: string;
  fileSize?: number;
}

/**
 * Create a validation error
 */
export function createValidationError(
  field: string,
  message: string,
  value?: any,
  constraint?: string
): FormValidationError {
  return {
    type: 'validation',
    field,
    message,
    value,
    constraint,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a required field error
 */
export function createRequiredFieldError(field: string, label?: string): FormValidationError {
  const displayName = label || field.replace(/([A-Z])/g, ' $1').toLowerCase();
  return {
    type: 'required',
    field,
    message: `${displayName} is required`,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a format error
 */
export function createFormatError(
  field: string,
  message: string,
  value?: any,
  expectedFormat?: string
): FormValidationError {
  return {
    type: 'format',
    field,
    message,
    value,
    constraint: expectedFormat,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a network error
 */
export function createNetworkError(
  message: string,
  statusCode?: number,
  endpoint?: string,
  retryable: boolean = true
): NetworkError {
  return {
    type: 'network',
    message,
    statusCode,
    endpoint,
    retryable,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a storage error
 */
export function createStorageError(
  operation: 'upload' | 'download' | 'delete',
  message: string,
  fileName?: string,
  fileSize?: number
): StorageError {
  return {
    type: 'storage',
    operation,
    message,
    fileName,
    fileSize,
    timestamp: new Date().toISOString()
  };
}

/**
 * Convert ValidationResult to FormValidationError
 */
export function validationResultToError(
  field: string,
  result: ValidationResult,
  value?: any
): FormValidationError | null {
  if (result.isValid) {
    return null;
  }

  return createValidationError(field, result.error || 'Validation failed', value);
}

/**
 * Error collection for form validation
 */
export class FormErrorCollection {
  private errors: Map<string, FormValidationError> = new Map();

  /**
   * Add an error for a field
   */
  addError(error: FormValidationError): void {
    this.errors.set(error.field, error);
  }

  /**
   * Add validation result as error if invalid
   */
  addValidationResult(field: string, result: ValidationResult, value?: any): void {
    const error = validationResultToError(field, result, value);
    if (error) {
      this.addError(error);
    }
  }

  /**
   * Remove error for a field
   */
  removeError(field: string): void {
    this.errors.delete(field);
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors.clear();
  }

  /**
   * Get error for a specific field
   */
  getError(field: string): FormValidationError | undefined {
    return this.errors.get(field);
  }

  /**
   * Get all errors
   */
  getAllErrors(): FormValidationError[] {
    return Array.from(this.errors.values());
  }

  /**
   * Get errors as a simple field -> message map
   */
  getErrorMap(): Record<string, string> {
    const errorMap: Record<string, string> = {};
    for (const [field, error] of this.errors) {
      errorMap[field] = error.message;
    }
    return errorMap;
  }

  /**
   * Check if there are any errors
   */
  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  /**
   * Get count of errors
   */
  getErrorCount(): number {
    return this.errors.size;
  }

  /**
   * Get errors for a specific type
   */
  getErrorsByType(type: DFSAErrorType): FormValidationError[] {
    return Array.from(this.errors.values()).filter(error => error.type === type);
  }

  /**
   * Get first error (for focusing)
   */
  getFirstError(): FormValidationError | undefined {
    return Array.from(this.errors.values())[0];
  }
}

/**
 * Error message formatter for user display
 */
export class ErrorMessageFormatter {
  /**
   * Format error for user display
   */
  static formatError(error: DFSAError): string {
    switch (error.type) {
      case 'validation':
      case 'required':
      case 'format':
        return error.message;

      case 'network':
        const networkError = error as NetworkError;
        if (networkError.statusCode === 404) {
          return 'The requested resource was not found.';
        }
        if (networkError.statusCode === 403) {
          return 'You do not have permission to perform this action.';
        }
        if (networkError.statusCode === 500) {
          return 'A server error occurred. Please try again later.';
        }
        return networkError.retryable
          ? 'A network error occurred. Please check your connection and try again.'
          : 'A network error occurred. Please contact support if this continues.';

      case 'storage':
        const storageError = error as StorageError;
        switch (storageError.operation) {
          case 'upload':
            return 'Failed to upload file. Please check the file size and format.';
          case 'download':
            return 'Failed to download file. Please try again.';
          case 'delete':
            return 'Failed to delete file. Please try again.';
          default:
            return 'A file operation failed. Please try again.';
        }

      case 'authentication':
        return 'Your session has expired. Please log in again.';

      case 'permission':
        return 'You do not have permission to perform this action.';

      case 'system':
      default:
        return 'An unexpected error occurred. Please try again or contact support.';
    }
  }

  /**
   * Format multiple errors for display
   */
  static formatErrors(errors: DFSAError[]): string[] {
    return errors.map(error => this.formatError(error));
  }

  /**
   * Create error summary for form validation
   */
  static createValidationSummary(errors: FormValidationError[]): string {
    if (errors.length === 0) {
      return '';
    }

    if (errors.length === 1) {
      return `Please correct the following error: ${errors[0].message}`;
    }

    const errorList = errors.map(error => `• ${error.message}`).join('\n');
    return `Please correct the following errors:\n${errorList}`;
  }
}

/**
 * Error recovery utilities
 */
export class ErrorRecovery {
  /**
   * Determine if an error is recoverable
   */
  static isRecoverable(error: DFSAError): boolean {
    switch (error.type) {
      case 'validation':
      case 'required':
      case 'format':
        return true; // User can fix these

      case 'network':
        return (error as NetworkError).retryable;

      case 'storage':
        return true; // User can retry file operations

      case 'authentication':
        return true; // User can log in again

      case 'permission':
        return false; // Requires admin intervention

      case 'system':
      default:
        return false; // Requires technical intervention
    }
  }

  /**
   * Get recovery suggestions for an error
   */
  static getRecoverySuggestions(error: DFSAError): string[] {
    switch (error.type) {
      case 'validation':
      case 'required':
      case 'format':
        return ['Please correct the highlighted field and try again.'];

      case 'network':
        const networkError = error as NetworkError;
        if (networkError.retryable) {
          return [
            'Check your internet connection.',
            'Try refreshing the page.',
            'Wait a moment and try again.'
          ];
        }
        return ['Please contact support if this error continues.'];

      case 'storage':
        const storageError = error as StorageError;
        if (storageError.operation === 'upload') {
          return [
            'Check that your file is under 10MB.',
            'Ensure the file is in a supported format (PDF, DOCX, XLSX, JPG, PNG).',
            'Try uploading the file again.'
          ];
        }
        return ['Please try the operation again.'];

      case 'authentication':
        return ['Please log in again to continue.'];

      case 'permission':
        return ['Contact your administrator for access.'];

      case 'system':
      default:
        return ['Please contact support for assistance.'];
    }
  }
}

/**
 * Global error handler for unhandled errors
 */
export function handleUnexpectedError(error: any, context?: string): DFSAError {
  console.error('Unexpected error:', error, 'Context:', context);

  let message = 'An unexpected error occurred.';
  let type: DFSAErrorType = 'system';

  if (error instanceof Error) {
    message = error.message;

    // Classify error based on message content
    if (error.message.includes('network') || error.message.includes('fetch')) {
      type = 'network';
    } else if (error.message.includes('auth') || error.message.includes('token')) {
      type = 'authentication';
    } else if (error.message.includes('permission') || error.message.includes('forbidden')) {
      type = 'permission';
    }
  }

  return {
    type,
    message,
    details: error,
    timestamp: new Date().toISOString(),
    code: context
  };
}
