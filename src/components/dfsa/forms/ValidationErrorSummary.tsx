/**
 * DFSA Form Validation Error Summary Component
 *
 * Displays validation error summaries with field focusing
 * Requirements: 6.2, 6.3
 */

import React, { useCallback } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { focusFirstError, formatErrorCount } from './errorMessages';

/**
 * Props for ValidationErrorSummary component
 */
export interface ValidationErrorSummaryProps {
  errors: Record<string, string>;
  title?: string;
  onDismiss?: () => void;
  onFieldClick?: (fieldId: string) => void;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  showFieldLinks?: boolean;
}

/**
 * Validation Error Summary Component
 *
 * Displays a summary of all validation errors with clickable links
 * to focus on specific fields.
 */
export const ValidationErrorSummary: React.FC<ValidationErrorSummaryProps> = ({
  errors,
  title = 'Please correct the following errors:',
  onDismiss,
  onFieldClick,
  className,
  collapsible = false,
  defaultExpanded = true,
  showFieldLinks = true
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const errorEntries = Object.entries(errors);
  const errorCount = errorEntries.length;

  // Don't render if no errors
  if (errorCount === 0) return null;

  const handleFieldClick = useCallback((fieldId: string) => {
    if (onFieldClick) {
      onFieldClick(fieldId);
    } else {
      // Default behavior: scroll to and focus the field
      const elementId = `form-input-${fieldId.replace(/\./g, '-')}`;
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => element.focus(), 300);
      }
    }
  }, [onFieldClick]);

  const handleFocusFirst = useCallback(() => {
    focusFirstError(errors);
  }, [errors]);

  const formatFieldName = (fieldId: string): string => {
    // Convert camelCase or dot notation to readable format
    return fieldId
      .replace(/\./g, ' > ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/-/g, ' ')
      .trim();
  };

  return (
    <div
      className={cn(
        'bg-red-50 border border-red-200 rounded-lg overflow-hidden',
        className
      )}
      role="alert"
      aria-live="assertive"
      aria-labelledby="error-summary-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-red-100">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 id="error-summary-title" className="text-sm font-medium text-red-800">
              {title}
            </h3>
            <p className="text-xs text-red-600 mt-0.5">
              {formatErrorCount(errorCount)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-red-600 hover:text-red-800 rounded"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse error list' : 'Expand error list'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 text-red-600 hover:text-red-800 rounded"
              aria-label="Dismiss error summary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Error List */}
      {(!collapsible || isExpanded) && (
        <div className="p-4">
          <ul className="space-y-2" aria-label="List of validation errors">
            {errorEntries.map(([fieldId, message]) => (
              <li key={fieldId} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {showFieldLinks ? (
                    <button
                      onClick={() => handleFieldClick(fieldId)}
                      className="text-sm text-red-700 hover:text-red-900 hover:underline text-left w-full"
                    >
                      <span className="font-medium">{formatFieldName(fieldId)}:</span>{' '}
                      {message}
                    </button>
                  ) : (
                    <span className="text-sm text-red-700">
                      <span className="font-medium">{formatFieldName(fieldId)}:</span>{' '}
                      {message}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Focus first error button */}
          {showFieldLinks && errorCount > 0 && (
            <button
              onClick={handleFocusFirst}
              className="mt-4 text-sm text-red-600 hover:text-red-800 underline hover:no-underline"
            >
              Go to first error
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Inline error message component for individual fields
 */
export interface InlineErrorProps {
  error?: string;
  fieldId?: string;
  className?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  error,
  fieldId,
  className
}) => {
  if (!error) return null;

  const errorId = fieldId ? `${fieldId}-error` : undefined;

  return (
    <p
      id={errorId}
      className={cn(
        'text-sm text-red-600 flex items-center gap-1 mt-1',
        className
      )}
      role="alert"
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      {error}
    </p>
  );
};

/**
 * Step validation status indicator
 */
export interface StepValidationStatusProps {
  stepName: string;
  errors: Record<string, string>;
  isComplete: boolean;
  onClick?: () => void;
  className?: string;
}

export const StepValidationStatus: React.FC<StepValidationStatusProps> = ({
  stepName,
  errors,
  isComplete,
  onClick,
  className
}) => {
  const errorCount = Object.keys(errors).length;
  const hasErrors = errorCount > 0;

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border',
        hasErrors && 'bg-red-50 border-red-200',
        isComplete && !hasErrors && 'bg-green-50 border-green-200',
        !isComplete && !hasErrors && 'bg-gray-50 border-gray-200',
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <span className={cn(
        'text-sm font-medium',
        hasErrors && 'text-red-800',
        isComplete && !hasErrors && 'text-green-800',
        !isComplete && !hasErrors && 'text-gray-700'
      )}>
        {stepName}
      </span>

      {hasErrors && (
        <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
          {errorCount} {errorCount === 1 ? 'error' : 'errors'}
        </span>
      )}

      {isComplete && !hasErrors && (
        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
          Complete
        </span>
      )}
    </div>
  );
};

/**
 * Form-wide validation summary for multi-step forms
 */
export interface FormValidationSummaryProps {
  stepErrors: Record<string, Record<string, string>>;
  stepNames: Record<string, string>;
  completedSteps: string[];
  onStepClick?: (stepId: string) => void;
  className?: string;
}

export const FormValidationSummary: React.FC<FormValidationSummaryProps> = ({
  stepErrors,
  stepNames,
  completedSteps,
  onStepClick,
  className
}) => {
  const stepsWithErrors = Object.entries(stepErrors).filter(
    ([_, errors]) => Object.keys(errors).length > 0
  );

  if (stepsWithErrors.length === 0) return null;

  const totalErrors = stepsWithErrors.reduce(
    (sum, [_, errors]) => sum + Object.keys(errors).length,
    0
  );

  return (
    <div
      className={cn(
        'bg-red-50 border border-red-200 rounded-lg p-4',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <h3 className="text-sm font-medium text-red-800">
          {totalErrors} {totalErrors === 1 ? 'error' : 'errors'} found across {stepsWithErrors.length} {stepsWithErrors.length === 1 ? 'step' : 'steps'}
        </h3>
      </div>

      <div className="space-y-2">
        {stepsWithErrors.map(([stepId, errors]) => (
          <StepValidationStatus
            key={stepId}
            stepName={stepNames[stepId] || stepId}
            errors={errors}
            isComplete={completedSteps.includes(stepId)}
            onClick={onStepClick ? () => onStepClick(stepId) : undefined}
          />
        ))}
      </div>
    </div>
  );
};
