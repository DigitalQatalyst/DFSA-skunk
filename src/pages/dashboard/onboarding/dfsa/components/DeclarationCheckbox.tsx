/**
 * DeclarationCheckbox Component
 * Styled checkbox for long declaration text with proper formatting
 *
 * Features:
 * - Large checkbox for easy interaction
 * - Support for long, multi-paragraph text
 * - Required indicator
 * - Validation feedback
 * - React Hook Form integration
 * - DFSA-compliant formal styling
 *
 * Used in the Review & Submit step for final declarations
 */

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface DeclarationCheckboxProps {
  /**
   * Field name in the form
   */
  name: string

  /**
   * Declaration text (can include React elements for formatting)
   */
  children: React.ReactNode

  /**
   * Whether the checkbox is required
   */
  required?: boolean

  /**
   * Disable the checkbox
   */
  disabled?: boolean

  /**
   * Optional additional CSS classes
   */
  className?: string
}

export const DeclarationCheckbox: React.FC<DeclarationCheckboxProps> = ({
  name,
  children,
  required = true,
  disabled = false,
  className = '',
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  // Get error for this field
  const error = name.split('.').reduce((acc: any, part: string) => acc?.[part], errors)

  return (
    <div className={`space-y-2 ${className}`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div
            className={`
              flex items-start gap-4 p-4 border-2 rounded-lg
              transition-colors
              ${
                error
                  ? 'border-red-500 bg-red-50'
                  : field.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={() => {
              if (!disabled) {
                field.onChange(!field.value)
              }
            }}
          >
            {/* Checkbox */}
            <div className="flex-shrink-0 pt-0.5">
              <input
                type="checkbox"
                id={name}
                checked={field.value || false}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                disabled={disabled}
                className={`
                  w-5 h-5 rounded border-2
                  focus:ring-2 focus:ring-offset-2
                  ${
                    error
                      ? 'border-red-500 text-red-600 focus:ring-red-500'
                      : field.value
                      ? 'border-green-500 text-green-600 focus:ring-green-500'
                      : 'border-gray-400 text-primary focus:ring-primary'
                  }
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Declaration Text */}
            <label
              htmlFor={name}
              className={`
                flex-1 text-sm leading-relaxed
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                ${error ? 'text-red-900' : field.value ? 'text-green-900' : 'text-gray-700'}
              `}
            >
              {children}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Check Icon */}
            {field.value && !error && (
              <div className="flex-shrink-0 text-green-600 pt-0.5">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        )}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 pl-4">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error.message || 'This declaration is required'}</span>
        </div>
      )}
    </div>
  )
}

/**
 * DeclarationGroup Component
 * Wrapper for grouping multiple declarations
 */
interface DeclarationGroupProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export const DeclarationGroup: React.FC<DeclarationGroupProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-l-4 border-primary pl-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>

      {/* Declarations */}
      <div className="space-y-4">{children}</div>
    </div>
  )
}
