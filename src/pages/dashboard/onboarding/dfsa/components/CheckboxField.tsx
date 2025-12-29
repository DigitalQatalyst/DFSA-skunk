import React from 'react'

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange
}) => (
  <div className="mb-4">
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[#9B1823] scale-110 cursor-pointer"
      />
      <label className="text-gray-900 text-sm">
        {label}
      </label>
    </div>
  </div>
)
