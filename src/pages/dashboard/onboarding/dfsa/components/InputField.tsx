import React from 'react'
import { Check, Loader2, AlertCircle } from 'lucide-react'

interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
  required?: boolean
  error?: string
  helpText?: string
  isValidating?: boolean
  isValid?: boolean
  disabled?: boolean
  id?: string
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  error,
  helpText,
  isValidating = false,
  isValid = false,
  disabled = false,
  id
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`
  const errorId = `${inputId}-error`
  const helpId = `${inputId}-help`
  const hasValue = value && value.trim().length > 0

  return (
    <div className="mb-6">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && (
          <span className="text-red-600 ml-1" aria-label="required">
            *
          </span>
        )}
        {isValidating && <Loader2 size={14} className="inline-block ml-2 animate-spin text-gray-400" />}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helpText ? helpId : undefined}
          className={`
            w-full px-3 py-3 pr-10 border rounded-md text-sm bg-white
            outline-none transition-all
            focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
            ${isValid && hasValue && !error ? 'border-green-500' : ''}
          `}
        />
        {/* Success indicator */}
        {isValid && hasValue && !error && !isValidating && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Check size={18} className="text-green-500" />
          </div>
        )}
        {/* Error indicator */}
        {error && !isValidating && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle size={18} className="text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
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
