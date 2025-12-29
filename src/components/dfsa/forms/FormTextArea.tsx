/**
 * DFSA Form TextArea Component
 *
 * Reusable textarea component with DFSA validation and styling
 * Requirements: 6.1, 6.2
 */

import React from 'react';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { cn } from '../../../lib/utils';

export interface FormTextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  rows?: number;
  disabled?: boolean;
  className?: string;
  helpText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  id,
  label,
  value,
  onChange,
  required = false,
  error,
  placeholder,
  maxLength,
  minLength,
  rows = 4,
  disabled = false,
  className,
  helpText,
  resize = 'vertical',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const textareaId = `form-textarea-${id}`;
  const errorId = `${textareaId}-error`;
  const helpId = `${textareaId}-help`;

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={textareaId}
        className={cn(
          'text-sm font-medium text-gray-700',
          error && 'text-red-600',
          required && "after:content-['*'] after:ml-0.5 after:text-red-500"
        )}
      >
        {label}
      </Label>

      <Textarea
        id={textareaId}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        rows={rows}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full',
          resize === 'none' && 'resize-none',
          resize === 'vertical' && 'resize-y',
          resize === 'horizontal' && 'resize-x',
          resize === 'both' && 'resize',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
        )}
        aria-invalid={!!error}
        aria-describedby={cn(
          error && errorId,
          helpText && helpId
        )}
      />

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

      {maxLength && (
        <div className="text-xs text-gray-400 text-right">
          {value.length}/{maxLength}
          {minLength && value.length < minLength && (
            <span className="text-orange-500 ml-2">
              (minimum {minLength} characters)
            </span>
          )}
        </div>
      )}
    </div>
  );
};
