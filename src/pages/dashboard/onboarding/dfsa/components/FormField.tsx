/**
 * FormField Component
 * Unified form field component with react-hook-form integration
 *
 * Features:
 * - Supports multiple field types (text, email, date, textarea, radio, checkbox, select)
 * - Integrated error handling and validation feedback
 * - Full accessibility (ARIA attributes)
 * - Loading state support
 * - Nested error handling (e.g., "businessAddress.line1")
 * - Consistent styling and UX
 *
 * @example
 * ```typescript
 * <FormField
 *   name="legalEntityName"
 *   label="Legal Entity Name"
 *   type="text"
 *   required
 *   helpText="Your official registered company name"
 * />
 * ```
 */

import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Loader2 } from 'lucide-react'

interface FormFieldProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'date' | 'textarea' | 'radio' | 'checkbox' | 'select'
  required?: boolean
  placeholder?: string
  helpText?: string

  // Textarea-specific
  rows?: number

  // Date-specific
  min?: string
  max?: string

  // Radio/Select-specific
  options?: Array<{ value: string; label: string; description?: string }>

  // Validation state
  isValidating?: boolean

  // Event handlers
  onChange?: (value: any) => void

  // Styling
  className?: string
  disabled?: boolean
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  required = false,
  placeholder,
  helpText,
  rows = 3,
  min,
  max,
  options,
  isValidating = false,
  onChange: customOnChange,
  className,
  disabled = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  // Navigate nested errors (e.g., "businessAddress.line1")
  const getError = (name: string) => {
    const parts = name.split('.')
    let error: any = errors
    for (const part of parts) {
      if (error && error[part]) {
        error = error[part]
      } else {
        return undefined
      }
    }
    return error
  }

  const error = getError(name)
  const errorId = `${name}-error`
  const helpId = `${name}-help`

  const renderInput = (field: any) => {
    const baseClasses = `
      w-full px-3 py-2 border rounded-md text-sm
      focus:ring-2 focus:ring-primary focus:border-transparent
      transition-colors
      ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
      ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
      ${className || ''}
    `

    const inputProps = {
      ...field,
      id: name,
      disabled,
      className: baseClasses,
      'aria-invalid': !!error,
      'aria-describedby': error ? errorId : helpText ? helpId : undefined,
      'aria-required': required,
      onChange: (e: any) => {
        const value = type === 'checkbox' ? e.target.checked : e.target.value
        field.onChange(e)
        customOnChange?.(value)
      },
    }

    switch (type) {
      case 'textarea':
        return <textarea {...inputProps} rows={rows} placeholder={placeholder} />

      case 'checkbox':
        return (
          <input
            type="checkbox"
            {...field}
            checked={field.value || false}
            id={name}
            disabled={disabled}
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helpText ? helpId : undefined}
            aria-required={required}
            onChange={(e) => {
              field.onChange(e.target.checked)
              customOnChange?.(e.target.checked)
            }}
          />
        )

      case 'radio':
        return (
          <div className="space-y-3" role="radiogroup" aria-labelledby={`${name}-label`}>
            {options?.map((option) => (
              <label
                key={option.value}
                className={`
                  flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer
                  transition-colors
                  ${
                    field.value === option.value
                      ? 'border-primary bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input
                  type="radio"
                  {...field}
                  value={option.value}
                  checked={field.value === option.value}
                  disabled={disabled}
                  className="w-4 h-4 mt-0.5 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
                  onChange={(e) => {
                    field.onChange(e.target.value)
                    customOnChange?.(e.target.value)
                  }}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                  {option.description && (
                    <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        )

      case 'select':
        return (
          <select {...inputProps}>
            <option value="">{placeholder || 'Select an option'}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'date':
        return <input type="date" {...inputProps} min={min} max={max} placeholder={placeholder} />

      default:
        // text, email
        return <input type={type} {...inputProps} placeholder={placeholder} />
    }
  }

  return (
    <div className="mb-6">
      <label htmlFor={name} id={`${name}-label`} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && (
          <span className="text-red-600 ml-1" aria-label="required">
            *
          </span>
        )}
        {isValidating && <Loader2 size={14} className="inline-block ml-2 animate-spin text-gray-400" />}
      </label>

      <Controller name={name} control={control} render={({ field }) => renderInput(field)} />

      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500 mt-1">
          {error.message}
        </p>
      )}

      {!error && helpText && (
        <p id={helpId} className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}
    </div>
  )
}
