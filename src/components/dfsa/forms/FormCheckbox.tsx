/**
 * DFSA Form Checkbox Component
 *
 * Reusable checkbox component with DFSA validation and styling
 * Requirements: 6.1, 6.2
 */

import React from 'react';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { cn } from '../../../lib/utils';

export interface FormCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  helpText?: string;
  description?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  required = false,
  error,
  disabled = false,
  className,
  helpText,
  description,
}) => {
  const checkboxId = `form-checkbox-${id}`;
  const errorId = `${checkboxId}-error`;
  const helpId = `${checkboxId}-help`;
  const descId = `${checkboxId}-desc`;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start space-x-3">
        <Checkbox
          id={checkboxId}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          required={required}
          className={cn(
            'mt-0.5',
            error && 'border-red-500 data-[state=checked]:bg-red-500'
          )}
          aria-invalid={!!error}
          aria-describedby={cn(
            error && errorId,
            helpText && helpId,
            description && descId
          )}
        />

        <div className="flex-1 space-y-1">
          <Label
            htmlFor={checkboxId}
            className={cn(
              'text-sm font-medium text-gray-700 cursor-pointer',
              error && 'text-red-600',
              required && "after:content-['*'] after:ml-0.5 after:text-red-500"
            )}
          >
            {label}
          </Label>

          {description && (
            <p id={descId} className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
      </div>

      {helpText && !error && (
        <p id={helpId} className="text-sm text-gray-500 ml-6">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-sm text-red-600 flex items-center gap-1 ml-6">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
