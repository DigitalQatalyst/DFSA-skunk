import React from 'react'

interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
  required?: boolean
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm bg-white
                 outline-none transition-colors
                 focus:border-[#9B1823] focus:ring-1 focus:ring-[#9B1823]"
    />
  </div>
)
