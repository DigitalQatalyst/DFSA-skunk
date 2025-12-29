/**
 * ReviewSection Component
 * Collapsible section for reviewing form data with edit functionality
 *
 * Features:
 * - Collapsible/expandable section
 * - Edit button that navigates back to specific step
 * - Display section title and summary
 * - Children content for detailed review
 *
 * Used in the Review & Submit step to display all form sections
 */

import React, { useState } from 'react'

interface ReviewSectionProps {
  /**
   * Section title
   */
  title: string

  /**
   * Optional subtitle or summary text
   */
  subtitle?: string

  /**
   * Step ID to navigate to when Edit is clicked
   */
  stepId: string

  /**
   * Callback when Edit button is clicked
   */
  onEdit: (stepId: string) => void

  /**
   * Section content
   */
  children: React.ReactNode

  /**
   * Whether the section is expanded by default
   */
  defaultExpanded?: boolean

  /**
   * Optional icon to display next to title
   */
  icon?: React.ReactNode
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  title,
  subtitle,
  stepId,
  onEdit,
  children,
  defaultExpanded = true,
  icon,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(stepId)
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-3 flex-1">
          {/* Icon */}
          {icon && <div className="text-gray-600">{icon}</div>}

          {/* Title and Subtitle */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>}
          </div>

          {/* Edit Button */}
          <button
            type="button"
            onClick={handleEdit}
            className="
              inline-flex items-center gap-2 px-4 py-2
              text-sm font-medium text-primary
              border border-blue-600 rounded-md
              hover:bg-primary-50 transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            "
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>

          {/* Expand/Collapse Icon */}
          <button
            type="button"
            onClick={handleToggle}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 py-5 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  )
}

/**
 * ReviewField Component
 * Helper component for displaying individual field values in review sections
 */
interface ReviewFieldProps {
  label: string
  value: React.ReactNode
  isHighlight?: boolean
}

export const ReviewField: React.FC<ReviewFieldProps> = ({ label, value, isHighlight = false }) => {
  return (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-700">{label}</dt>
      <dd
        className={`
          mt-1 text-sm sm:col-span-2 sm:mt-0
          ${isHighlight ? 'font-semibold text-gray-900' : 'text-gray-600'}
        `}
      >
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </dd>
    </div>
  )
}

/**
 * ReviewFieldGroup Component
 * Helper component for grouping related fields
 */
interface ReviewFieldGroupProps {
  title: string
  children: React.ReactNode
}

export const ReviewFieldGroup: React.FC<ReviewFieldGroupProps> = ({ title, children }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
        {title}
      </h4>
      <dl className="divide-y divide-gray-200">{children}</dl>
    </div>
  )
}
