import React from 'react'

interface RadioFieldProps {
  label: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  description?: string
  name?: string
  error?: string
  disabled?: boolean
  id?: string
}

export const RadioField: React.FC<RadioFieldProps> = ({
  label,
  value,
  checked,
  onChange,
  description,
  name,
  error,
  disabled = false,
  id
}) => {
  const radioId = id || `radio-${value.toLowerCase().replace(/\s+/g, '-')}`
  const descriptionId = description ? `${radioId}-description` : undefined
  const errorId = error ? `${radioId}-error` : undefined

  return (
    <div className="mb-4">
      <label
        htmlFor={radioId}
        className={`
          flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer
          transition-all
          ${checked ? 'border-[#9B1823] bg-red-50' : 'border-gray-200 hover:border-gray-300'}
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          id={radioId}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => !disabled && onChange(value)}
          disabled={disabled}
          aria-describedby={descriptionId || errorId}
          aria-invalid={!!error}
          className="
            mt-0.5 w-4 h-4
            text-[#9B1823] border-gray-300
            focus:ring-2 focus:ring-[#9B1823] focus:ring-offset-2
            cursor-pointer
            disabled:cursor-not-allowed
          "
        />
        <div className="flex-1">
          <div className="text-gray-900 text-sm font-medium">{label}</div>
          {description && (
            <div id={descriptionId} className="text-gray-500 text-sm mt-0.5">
              {description}
            </div>
          )}
          {error && (
            <div id={errorId} role="alert" className="text-red-500 text-xs mt-1">
              {error}
            </div>
          )}
        </div>
      </label>
    </div>
  )
}
