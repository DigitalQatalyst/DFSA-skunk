import React from 'react'

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
  helpText?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
  error,
  helpText,
  disabled = false,
  required = false,
  id
}) => {
  const checkboxId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`
  const errorId = `${checkboxId}-error`
  const helpId = `${checkboxId}-help`

  return (
    <div className="mb-4">
      <label
        htmlFor={checkboxId}
        className={`
          flex items-start gap-3 p-3 rounded-lg cursor-pointer
          min-h-[44px]
          transition-all
          ${error ? 'bg-red-50' : 'hover:bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helpText ? helpId : undefined}
          className="
            mt-0.5 w-5 h-5 rounded
            border-gray-300 text-[#9B1823]
            focus:ring-2 focus:ring-[#9B1823] focus:ring-offset-2
            cursor-pointer
            disabled:cursor-not-allowed
          "
        />
        <div className="flex-1">
          <span className="text-gray-900 text-sm">
            {label}
            {required && (
              <span className="text-red-600 ml-1" aria-label="required">
                *
              </span>
            )}
          </span>
          {helpText && !error && (
            <p id={helpId} className="text-xs text-gray-500 mt-1">
              {helpText}
            </p>
          )}
          {error && (
            <p id={errorId} role="alert" className="text-xs text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>
      </label>
    </div>
  )
}
