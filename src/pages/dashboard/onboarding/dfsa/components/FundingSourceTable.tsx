/**
 * FundingSourceTable Component
 * Dynamic table for managing funding sources with USD amounts
 *
 * Features:
 * - Dynamic add/remove rows (max 10 funding sources)
 * - Currency input with USD formatting
 * - React Hook Form integration with useFieldArray
 * - Total funding amount calculation
 *
 * Used by Pathways A (Financial Services) and C (Crypto Token)
 */

import React, { useMemo } from 'react'
import { useFieldArray, useFormContext, Controller } from 'react-hook-form'
import { DFSAOnboardingFormData, FundingSource } from '../types'

interface FundingSourceTableProps {
  disabled?: boolean
}

const MAX_FUNDING_SOURCES = 10

/**
 * Format number as USD currency
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Calculate total funding amount
 */
const calculateTotal = (fundingSources: Partial<FundingSource>[]): number => {
  return fundingSources.reduce((sum, source) => {
    return sum + (source.amountUSD || 0)
  }, 0)
}

export const FundingSourceTable: React.FC<FundingSourceTableProps> = ({ disabled = false }) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<DFSAOnboardingFormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fundingSources',
  })

  // Watch all funding sources for real-time total calculation
  const fundingSources = watch('fundingSources')

  // Calculate total funding amount
  const totalAmount = useMemo(() => {
    if (!fundingSources || fundingSources.length === 0) return 0
    return calculateTotal(fundingSources)
  }, [fundingSources])

  // Check if max funding sources reached
  const isMaxReached = fields.length >= MAX_FUNDING_SOURCES

  /**
   * Add new funding source row with default values
   */
  const handleAddFundingSource = () => {
    if (isMaxReached) return

    append({
      id: `fundingsource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceType: 'equity',
      description: '',
      amountUSD: 0,
    })
  }

  /**
   * Remove funding source row
   */
  const handleRemoveFundingSource = (index: number) => {
    remove(index)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Funding Sources</h3>
          <p className="text-sm text-gray-600 mt-1">
            Specify the sources and amounts of funding for your proposed activities.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            (Ref: DFSA Rulebook GEN Module Rule 3.1.4 - Capital Adequacy Requirements)
          </p>
        </div>

        {/* Total Amount Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Total Funding:</span>
          <div className="px-4 py-2 bg-primary-50 border-2 border-primary rounded-lg">
            <span className="font-bold text-lg text-primary-dark">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Source Type <span className="text-red-500">*</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                Description <span className="text-red-500">*</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Amount (USD) <span className="text-red-500">*</span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fields.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No funding sources added yet. Click "Add Funding Source" to begin.
                </td>
              </tr>
            ) : (
              fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-gray-50">
                  {/* Source Type */}
                  <td className="px-4 py-3">
                    <Controller
                      name={`fundingSources.${index}.sourceType`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          disabled={disabled}
                          className={`
                            w-full px-3 py-2 border rounded-md text-sm
                            focus:ring-2 focus:ring-primary focus:border-transparent
                            ${errors.fundingSources?.[index]?.sourceType ? 'border-red-500' : 'border-gray-300'}
                            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                          `}
                        >
                          <option value="equity">Equity</option>
                          <option value="debt">Debt</option>
                          <option value="retained_earnings">Retained Earnings</option>
                          <option value="other">Other</option>
                        </select>
                      )}
                    />
                    {errors.fundingSources?.[index]?.sourceType && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fundingSources[index]?.sourceType?.message}
                      </p>
                    )}
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3">
                    <Controller
                      name={`fundingSources.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          disabled={disabled}
                          placeholder="Describe the funding source"
                          rows={2}
                          className={`
                            w-full px-3 py-2 border rounded-md text-sm
                            focus:ring-2 focus:ring-primary focus:border-transparent
                            resize-none
                            ${errors.fundingSources?.[index]?.description ? 'border-red-500' : 'border-gray-300'}
                            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                          `}
                        />
                      )}
                    />
                    {errors.fundingSources?.[index]?.description && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fundingSources[index]?.description?.message}
                      </p>
                    )}
                  </td>

                  {/* Amount USD */}
                  <td className="px-4 py-3">
                    <Controller
                      name={`fundingSources.${index}.amountUSD`}
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            $
                          </span>
                          <input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            disabled={disabled}
                            placeholder="0.00"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className={`
                              w-full pl-8 pr-3 py-2 border rounded-md text-sm
                              focus:ring-2 focus:ring-primary focus:border-transparent
                              ${errors.fundingSources?.[index]?.amountUSD ? 'border-red-500' : 'border-gray-300'}
                              ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                            `}
                          />
                        </div>
                      )}
                    />
                    {errors.fundingSources?.[index]?.amountUSD && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fundingSources[index]?.amountUSD?.message}
                      </p>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveFundingSource(index)}
                      disabled={disabled}
                      className={`
                        inline-flex items-center justify-center w-8 h-8
                        text-red-600 hover:text-red-800 hover:bg-red-50
                        rounded-md transition-colors
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      title="Remove funding source"
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
          onClick={handleAddFundingSource}
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
          Add Funding Source
        </button>

        <p className="text-sm text-gray-500">
          {fields.length} of {MAX_FUNDING_SOURCES} funding sources
        </p>
      </div>

      {/* General validation error */}
      {typeof errors.fundingSources?.message === 'string' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{errors.fundingSources.message}</p>
        </div>
      )}
    </div>
  )
}
