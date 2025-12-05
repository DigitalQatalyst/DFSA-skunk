/**
 * FormFieldGroup Component
 * Accordion-style collapsible group for form fields
 *
 * Features:
 * - Collapsible header with click-to-expand
 * - Status badge (Complete/Required/Working/Optional)
 * - Progress bar showing completion percentage
 * - Color-coded borders for missing required fields
 * - Automatic completion calculation based on field values
 *
 * Pattern Reference: BusinessProfile TabSection component
 * DFSA Compliance: Maintains formal language, accessibility standards
 */

import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { ChevronDown, Check, AlertCircle } from 'lucide-react'

interface FormFieldGroupProps {
  /**
   * Title displayed in the group header
   */
  title: string

  /**
   * Fields to render within the group
   */
  fields: React.ReactNode

  /**
   * Unique identifier for this group
   */
  groupId: string

  /**
   * Array of field names to track for completion calculation
   * Example: ['legalEntityName', 'registrationNumber', 'businessAddress.line1']
   */
  fieldNames?: string[]

  /**
   * Whether this group contains required fields
   * Affects visual styling and status badge
   */
  isRequired?: boolean

  /**
   * Optional help text displayed below the title
   * Should include DFSA rule references where applicable
   */
  helpText?: string

  /**
   * Whether the group should be expanded by default
   */
  defaultExpanded?: boolean

  /**
   * Custom className for additional styling
   */
  className?: string
}

/**
 * Accordion-style form field group component
 *
 * Matches the visual design pattern from the BusinessProfile TabSection,
 * adapted for the sequential onboarding wizard flow.
 *
 * @example
 * ```tsx
 * <FormFieldGroup
 *   title="Entity Details"
 *   groupId="entity-details"
 *   fieldNames={['legalEntityName', 'registrationNumber']}
 *   isRequired={true}
 *   helpText="Provide the legal entity details. (Ref: DFSA Rulebook GEN Module Rule 2.2.5)"
 *   fields={
 *     <div className="space-y-4">
 *       <InputField name="legalEntityName" label="Legal Entity Name" required />
 *       <InputField name="registrationNumber" label="Registration Number" required />
 *     </div>
 *   }
 * />
 * ```
 */
export const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  title,
  fields,
  groupId,
  fieldNames = [],
  isRequired = false,
  helpText,
  defaultExpanded = true,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const { watch, formState: { errors } } = useFormContext()

  // Watch all field values to calculate completion
  const formValues = watch()

  // Calculate group completion percentage
  const calculateCompletion = (): number => {
    if (fieldNames.length === 0) {
      return 0
    }

    let completedCount = 0

    fieldNames.forEach((fieldPath) => {
      // Get nested field value (e.g., "businessAddress.line1")
      const value = fieldPath.split('.').reduce((obj: any, key) => obj?.[key], formValues)

      // Check if field has a value
      if (value !== null && value !== undefined && value !== '') {
        // Handle arrays (e.g., shareholders)
        if (Array.isArray(value) && value.length > 0) {
          completedCount++
        }
        // Handle boolean values
        else if (typeof value === 'boolean') {
          completedCount++
        }
        // Handle strings and numbers
        else if (value) {
          completedCount++
        }
      }
    })

    return Math.round((completedCount / fieldNames.length) * 100)
  }

  const completion = calculateCompletion()

  // Check if group has any validation errors
  const hasErrors = fieldNames.some((fieldPath) => {
    const errorPath = fieldPath.split('.').reduce((obj: any, key) => obj?.[key], errors)
    return errorPath !== undefined
  })

  // Determine status text and styling
  const getStatus = () => {
    if (completion === 100) {
      return { text: 'Complete', colorClass: 'bg-green-100 text-green-700' }
    }
    if (completion > 0 && completion < 100) {
      return { text: 'Working', colorClass: 'bg-indigo-100 text-indigo-700' }
    }
    if (isRequired) {
      return { text: 'Required', colorClass: 'bg-amber-100 text-amber-700' }
    }
    return { text: 'Optional', colorClass: 'bg-gray-100 text-gray-700' }
  }

  const status = getStatus()

  // Determine progress bar color
  const getProgressColor = () => {
    if (completion === 100) return 'bg-green-500'
    if (completion >= 70) return 'bg-[#9B1823]'
    if (completion >= 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div
      className={`
        rounded-lg border overflow-hidden transition-all
        ${hasErrors ? 'border-amber-300' : 'border-gray-200'}
        ${isExpanded ? 'shadow-sm bg-white' : 'bg-gray-50'}
        ${className}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex flex-col sm:flex-row sm:justify-between sm:items-center
          p-4 cursor-pointer hover:bg-gray-50 transition-colors
          ${isExpanded ? 'border-b border-gray-200 bg-white' : ''}
          ${hasErrors ? 'bg-amber-50' : ''}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`${groupId}-content`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }
        }}
      >
        {/* Left side: Title, Status, Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-700 text-sm">{title}</h3>

            {/* Status Badge */}
            <span
              className={`
                flex items-center text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap
                ${status.colorClass}
              `}
            >
              {completion === 100 ? (
                <>
                  <Check size={14} className="mr-1" />
                  {status.text}
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full mr-1 bg-current" />
                  {status.text}
                </>
              )}
            </span>
          </div>

          {/* Progress Bar - only show if there are fields to track */}
          {fieldNames.length > 0 && (
            <div className="flex items-center">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getProgressColor()}`}
                  style={{ width: `${completion}%` }}
                  role="progressbar"
                  aria-valuenow={completion}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${completion}% complete`}
                />
              </div>
              <span className="ml-2 text-xs text-gray-500">{completion}%</span>
            </div>
          )}

          {/* Error indicator */}
          {hasErrors && (
            <span className="text-xs text-amber-700 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              Requires attention
            </span>
          )}
        </div>

        {/* Right side: Chevron */}
        <div className="flex items-center justify-end mt-2 sm:mt-0">
          <ChevronDown
            size={16}
            className={`transform transition-transform text-gray-400 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div id={`${groupId}-content`} className="p-4 bg-white" role="region" aria-labelledby={`${groupId}-header`}>
          {helpText && (
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">{helpText}</p>
          )}
          {fields}
        </div>
      )}
    </div>
  )
}
