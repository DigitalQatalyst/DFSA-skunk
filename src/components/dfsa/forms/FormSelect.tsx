/**
 * DFSA Form Select Component
 *
 * Reusable select component with DFSA validation and styling
 * Requirements: 6.1, 6.2
 */

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Label } from '../../ui/label';
import { cn } from '../../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  helpText?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  placeholder = 'Select an option...',
  disabled = false,
  className,
  helpText,
}) => {
  const selectId = `form-select-${id}`;
  const errorId = `${selectId}-error`;
  const helpId = `${selectId}-help`;

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={selectId}
        className={cn(
          'text-sm font-medium text-gray-700',
          error && 'text-red-600',
          required && "after:content-['*'] after:ml-0.5 after:text-red-500"
        )}
      >
        {label}
      </Label>

      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={selectId}
          className={cn(
            'w-full',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
          )}
          aria-invalid={!!error}
          aria-describedby={cn(
            error && errorId,
            helpText && helpId
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options
            .filter((option) => option.value !== '') // Filter out empty values - use placeholder instead
            .map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {helpText && !error && (
        <p id={helpId} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
