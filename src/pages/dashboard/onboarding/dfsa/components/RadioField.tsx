import React from 'react'

interface RadioFieldProps {
  label: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  description?: string
}

export const RadioField: React.FC<RadioFieldProps> = ({
  label,
  value,
  checked,
  onChange,
  description
}) => (
  <div className="mb-4">
    <div className="flex items-start gap-3">
      <input
        type="radio"
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-0.5 accent-[#9B1823] scale-110 cursor-pointer"
      />
      <div>
        <div className="text-gray-900 text-sm font-medium">
          {label}
        </div>
        {description && (
          <div className="text-gray-500 text-sm mt-0.5">
            {description}
          </div>
        )}
      </div>
    </div>
  </div>
)
