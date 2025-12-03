/**
 * CurrencyInput Component
 * Formatted currency input field with USD symbol and thousands separators
 *
 * Features:
 * - Automatic formatting with thousands separators
 * - USD symbol prefix
 * - Decimal handling (2 decimal places)
 * - React Hook Form integration
 * - Validation feedback
 *
 * Used for financial fields like proposed capital, funding amounts, etc.
 */

import React, { useState, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface CurrencyInputProps {
  /**
   * Field name in the form
   */
  name: string

  /**
   * Field label
   */
  label: string

  /**
   * Whether the field is required
   */
  required?: boolean

  /**
   * Placeholder text
   */
  placeholder?: string

  /**
   * Help text displayed below the input
   */
  helpText?: string

  /**
   * Disable the input
   */
  disabled?: boolean

  /**
   * Minimum value
   */
  min?: number

  /**
   * Maximum value
   */
  max?: number
}

/**
 * Format number as currency (no symbol, just formatting)
 */
const formatCurrency = (value: number | string): string => {
  if (value === '' || value === null || value === undefined) return ''

  // Convert to number
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numValue)) return ''

  // Format with thousands separators and 2 decimal places
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}

/**
 * Parse formatted currency string to number
 */
const parseCurrency = (value: string): number => {
  if (!value) return 0

  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.]/g, '')

  const parsed = parseFloat(cleaned)

  return isNaN(parsed) ? 0 : parsed
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  name,
  label,
  required = false,
  placeholder = '0.00',
  helpText,
  disabled = false,
  min,
  max,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  // Get error for this field
  const error = name.split('.').reduce((acc: any, part: string) => acc?.[part], errors)

  return (
    <div className="space-y-1">
      {/* Label */}
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const [displayValue, setDisplayValue] = useState(() => {
            // Initialize once from field value
            return field.value ? formatCurrency(field.value) : ''
          })

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value

            // Allow user to type freely
            setDisplayValue(inputValue)

            // Parse and update form value
            const numericValue = parseCurrency(inputValue)
            field.onChange(numericValue)
          }

          const handleBlur = () => {
            // Format on blur
            if (field.value) {
              setDisplayValue(formatCurrency(field.value))
            } else {
              setDisplayValue('')
            }
            field.onBlur()
          }

          const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            // Select all on focus for easy editing
            e.target.select()
          }

          return (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                $
              </span>
              <input
                id={name}
                type="text"
                inputMode="decimal"
                value={displayValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                disabled={disabled}
                placeholder={placeholder}
                className={`
                  w-full pl-8 pr-3 py-2 border rounded-md text-sm
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${error ? 'border-red-500' : 'border-gray-300'}
                  ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}
                `}
              />
            </div>
          )
        }}
      />

      {/* Help text or error */}
      {error ? (
        <p className="text-xs text-red-500">{error.message}</p>
      ) : helpText ? (
        <p className="text-xs text-gray-500">{helpText}</p>
      ) : null}

      {/* Min/Max hint */}
      {(min !== undefined || max !== undefined) && !error && (
        <p className="text-xs text-gray-500">
          {min !== undefined && max !== undefined
            ? `Range: $${formatCurrency(min)} - $${formatCurrency(max)}`
            : min !== undefined
            ? `Minimum: $${formatCurrency(min)}`
            : `Maximum: $${formatCurrency(max)}`}
        </p>
      )}
    </div>
  )
}
