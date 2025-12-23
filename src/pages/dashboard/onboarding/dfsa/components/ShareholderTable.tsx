/**
 * ShareholderTable Component
 * Dynamic table for managing shareholder information with ownership percentages
 *
 * Features:
 * - Dynamic add/remove rows (max 15 shareholders)
 * - Real-time percentage total calculation
 * - Visual indicator when total equals 100%
 * - React Hook Form integration with useFieldArray
 * - Validation feedback per field
 *
 * Used by Pathways A (Financial Services) and C (Crypto Token)
 */

import React, { useMemo } from 'react'
import { useFieldArray, useFormContext, Controller } from 'react-hook-form'
import { DFSAOnboardingFormData, Shareholder } from '../types'

interface ShareholderTableProps {
  disabled?: boolean
}

const MAX_SHAREHOLDERS = 15
const TOLERANCE = 0.01 // 0.01% tolerance for rounding

/**
 * Calculate total shareholding percentage
 */
const calculateTotal = (shareholders: Partial<Shareholder>[]): number => {
  return shareholders.reduce((sum, shareholder) => {
    return sum + (shareholder.percentageOwnership || 0)
  }, 0)
}

/**
 * Check if total is valid (equals 100% within tolerance)
 */
const isTotalValid = (total: number): boolean => {
  return Math.abs(total - 100) < TOLERANCE
}

export const ShareholderTable: React.FC<ShareholderTableProps> = ({ disabled = false }) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<DFSAOnboardingFormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'shareholders',
  })

  // Watch all shareholders for real-time total calculation
  const shareholders = watch('shareholders')

  // Calculate total percentage
  const total = useMemo(() => {
    if (!shareholders || shareholders.length === 0) return 0
    return calculateTotal(shareholders)
  }, [shareholders])

  // Check if total is valid
  const isValid = useMemo(() => isTotalValid(total), [total])

  // Check if max shareholders reached
  const isMaxReached = fields.length >= MAX_SHAREHOLDERS

  /**
   * Add new shareholder row with default values
   */
  const handleAddShareholder = () => {
    if (isMaxReached) return

    append({
      id: `shareholder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      nationality: '',
      idType: 'passport',
      idNumber: '',
      percentageOwnership: 0,
      dateAcquired: '',
    })
  }

  /**
   * Remove shareholder row
   */
  const handleRemoveShareholder = (index: number) => {
    remove(index)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Shareholding Structure</h3>
          <p className="text-sm text-gray-600 mt-1">
            Provide details of all shareholders. Total ownership must equal 100%.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            (Ref: DFSA Rulebook GEN Module Rule 2.2.2 - Shareholding Disclosure)
          </p>
        </div>

        {/* Total Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Total:</span>
          <div
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg
              transition-colors duration-200
              ${
                isValid
                  ? 'bg-green-100 text-green-800 border-2 border-green-500'
                  : 'bg-red-100 text-red-800 border-2 border-red-500'
              }
            `}
          >
            <span>{total.toFixed(2)}%</span>
            {isValid ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Error message for total validation */}
      {!isValid && shareholders && shareholders.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Total shareholding must equal 100%. Current total: {total.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name <span className="text-red-500">*</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nationality <span className="text-red-500">*</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Type <span className="text-red-500">*</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Number <span className="text-red-500">*</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ownership % <span className="text-red-500">*</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Acquired <span className="text-red-500">*</span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fields.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No shareholders added yet. Click "Add Shareholder" to begin.
                </td>
              </tr>
            ) : (
              fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-gray-50">
                  {/* Name */}
                  <td className="px-4 py-3">
                    <Controller
                      name={`shareholders.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          disabled={disabled}
                          placeholder="Full name"
                          className={`
                            w-full px-3 py-2 border rounded-md text-sm
                            focus:ring-2 focus:ring-primary focus:border-transparent
                            ${errors.shareholders?.[index]?.name ? 'border-red-500' : 'border-gray-300'}
                            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                          `}
                        />
                      )}
                    />
                    {errors.shareholders?.[index]?.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.shareholders[index]?.name?.message}
                      </p>
                    )}
                  </td>

                  {/* Nationality */}
                  <td className="px-4 py-3">
                    <Controller
                      name={`shareholders.${index}.nationality`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          disabled={disabled}
                          placeholder="Country"
                          className={`
                            w-full px-3 py-2 border rounded-md text-sm
                            focus:ring-2 focus:ring-primary focus:border-transparent
                            ${errors.shareholders?.[index]?.nationality ? 'border-red-500' : 'border-gray-300'}
                            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                          `}
                        />
                      )}
                    />
                    {errors.shareholders?.[index]?.nationality && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.shareholders[index]?.nationality?.message}
                      </p>
                    )}
                  </td>

                  {/* ID Type */}
                  <td className="px-4 py-3">
                    <Controller
                      name={`shareholders.${index}.idType`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          disabled={disabled}
                          className={`
                            w-full px-3 py-2 border rounded-md text-sm
                            focus:ring-2 focus:ring-primary focus:border-transparent
                            ${errors.shareholders?.[index]?.idType ? 'border-red-500' : 'border-gray-300'}
                            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                          `}
                        >
                          <option value="passport">Passport</option>
                          <option value="national_id">National ID</option>
                          <option value="other">Other</option>
                        </select>
                      )}
                    />
                    {errors.shareholders?.[index]?.idType && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.shareholders[index]?.idType?.message}
                      </p>
                    )}
                  </td>

                  {/* ID Number */}
                  <td className="px-4 py-3">
                    <Controller
                      name={`shareholders.${index}.idNumber`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          disabled={disabled}
                          placeholder="ID number"
                          className={`
                            w-full px-3 py-2 border rounded-md text-sm
                            focus:ring-2 focus:ring-primary focus:border-transparent
                            ${errors.shareholders?.[index]?.idNumber ? 'border-red-500' : 'border-gray-300'}
                            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                          `}
                        />
                      )}
                    />
                    {errors.shareholders?.[index]?.idNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.shareholders[index]?.idNumber?.message}
                      </p>
                    )}
                  </td>

                  {/* Percentage Ownership */}
                  <td className="px-4 py-3">
                    <Controller
                      name={`shareholders.${index}.percentageOwnership`}
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            disabled={disabled}
                            placeholder="0.00"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className={`
                              w-full px-3 py-2 pr-8 border rounded-md text-sm
                              focus:ring-2 focus:ring-primary focus:border-transparent
                              ${errors.shareholders?.[index]?.percentageOwnership ? 'border-red-500' : 'border-gray-300'}
                              ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                            `}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            %
                          </span>
                        </div>
                      )}
                    />
                    {errors.shareholders?.[index]?.percentageOwnership && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.shareholders[index]?.percentageOwnership?.message}
                      </p>
                    )}
                  </td>

                  {/* Date Acquired */}
                  <td className="px-4 py-3">
                    <Controller
                      name={`shareholders.${index}.dateAcquired`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          disabled={disabled}
                          max={new Date().toISOString().split('T')[0]}
                          className={`
                            w-full px-3 py-2 border rounded-md text-sm
                            focus:ring-2 focus:ring-primary focus:border-transparent
                            ${errors.shareholders?.[index]?.dateAcquired ? 'border-red-500' : 'border-gray-300'}
                            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                          `}
                        />
                      )}
                    />
                    {errors.shareholders?.[index]?.dateAcquired && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.shareholders[index]?.dateAcquired?.message}
                      </p>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveShareholder(index)}
                      disabled={disabled}
                      className={`
                        inline-flex items-center justify-center w-8 h-8
                        text-red-600 hover:text-red-800 hover:bg-red-50
                        rounded-md transition-colors
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      title="Remove shareholder"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleAddShareholder}
          disabled={disabled || isMaxReached}
          className={`
            inline-flex items-center gap-2 px-4 py-2
            bg-primary text-white rounded-md
            hover:bg-primary-dark transition-colors
            focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${disabled || isMaxReached ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Shareholder
        </button>

        <p className="text-sm text-gray-500">
          {fields.length} of {MAX_SHAREHOLDERS} shareholders
        </p>
      </div>

      {/* General validation error */}
      {typeof errors.shareholders?.message === 'string' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{errors.shareholders.message}</p>
        </div>
      )}
    </div>
  )
}
