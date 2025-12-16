/**
 * Financial Activity Card Component
 * Displays individual DFSA financial services activity in a card format
 *
 * COMPLIANCE: Uses formal, neutral language per DFSA operating rules
 * ACCESSIBILITY: WCAG 2.1 AA compliant with keyboard navigation
 * LANGUAGE: British English spelling
 */

import React from 'react';
import { DollarSign, Clock, FileText, Shield } from 'lucide-react';
import { FinancialActivity } from '../../types/dfsa-activities';
import { PrudentialCategoryBadge } from './PrudentialCategoryBadge';
import { getCategoryByCode } from '../../data/dfsa/prudentialCategories';

interface FinancialActivityCardProps {
  /** Activity data to display */
  activity: FinancialActivity;

  /** Callback when "Add to Application" is clicked */
  onAddToApplication?: (activity: FinancialActivity) => void;

  /** Callback when "View Details" is clicked */
  onViewDetails?: (activity: FinancialActivity) => void;

  /** Whether this activity is currently selected */
  isSelected?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * FinancialActivityCard Component
 *
 * Renders a comprehensive card displaying:
 * - Activity code and name
 * - Prudential category badge
 * - Description
 * - Capital requirement, application fee, processing time
 * - Regulatory modules
 * - Action buttons
 *
 * @example
 * ```tsx
 * <FinancialActivityCard
 *   activity={activity}
 *   onAddToApplication={(act) => handleAdd(act)}
 *   onViewDetails={(act) => handleView(act)}
 *   isSelected={false}
 * />
 * ```
 */
export const FinancialActivityCard: React.FC<FinancialActivityCardProps> = ({
  activity,
  onAddToApplication,
  onViewDetails,
  isSelected = false,
  className = '',
}) => {
  const categoryInfo = getCategoryByCode(activity.prudentialCategory);

  // Handle add to application
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToApplication) {
      onAddToApplication(activity);
    }
  };

  // Handle view details
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(activity);
    }
  };

  return (
    <article
      className={`
        bg-white rounded-lg
        border ${isSelected ? 'border-[#b82933] ring-2 ring-[#b82933] ring-opacity-20' : 'border-gray-200'}
        shadow-sm hover:shadow-md
        transition-all duration-200
        overflow-hidden
        ${className}
      `}
      aria-label={`${activity.activityName} - ${activity.activityCode}`}
    >
      {/* Header Section */}
      <div className="p-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Activity Code Badge */}
          <div className="flex-shrink-0">
            <span
              className="
                inline-flex items-center justify-center
                w-12 h-12
                bg-[#f8f8f6] text-[#b82933]
                font-bold text-lg rounded-lg
                border-2 border-[#b82933]
              "
              aria-label={`Activity code ${activity.activityCode}`}
            >
              {activity.activityCode}
            </span>
          </div>

          {/* Prudential Category Badge */}
          <div className="flex-shrink-0">
            <PrudentialCategoryBadge
              category={activity.prudentialCategory}
              size="md"
              showTooltip
            />
          </div>
        </div>

        {/* Activity Name */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {activity.activityName}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {activity.description}
        </p>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-gray-50/50">
        {/* Base Capital */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Base Capital
            </span>
          </div>
          <span className="text-sm font-bold text-gray-900 font-mono">
            {activity.baseCapitalRequirement.display}
          </span>
        </div>

        {/* Application Fee */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <FileText className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Application Fee
            </span>
          </div>
          <span className="text-sm font-bold text-gray-900 font-mono">
            {activity.applicationFee.display}
          </span>
        </div>

        {/* Processing Time */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Processing Time
            </span>
          </div>
          <span className="text-sm font-bold text-gray-900">
            {activity.processingTime.display}
          </span>
        </div>
      </div>

      {/* Regulatory Modules */}
      <div className="px-5 py-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 mb-2">
          <Shield className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Regulatory Modules
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activity.regulatoryModules.map((module) => (
            <span
              key={module}
              className="
                inline-flex items-center
                px-2 py-1 text-xs font-medium
                bg-gray-100 text-gray-700
                rounded border border-gray-200
              "
            >
              {module}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Section - Action Buttons */}
      <div className="flex items-center justify-between gap-3 p-4 pt-3 border-t border-gray-100">
        {/* View Details Button */}
        <button
          type="button"
          onClick={handleView}
          className="
            inline-flex items-center justify-center
            px-4 py-2 text-sm font-medium
            text-gray-700 bg-white
            border border-gray-300 rounded-lg
            hover:bg-gray-50 hover:border-gray-400
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b82933]
            transition-colors duration-200
          "
          aria-label={`View details for ${activity.activityName}`}
        >
          View Details
        </button>

        {/* Add to Application Button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={isSelected}
          className={`
            inline-flex items-center justify-center gap-2
            px-4 py-2 text-sm font-medium
            text-white rounded-lg
            ${
              isSelected
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#b82933] hover:bg-[#a02229]'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b82933]
            transition-colors duration-200
          `}
          aria-label={
            isSelected
              ? `${activity.activityName} already added`
              : `Add ${activity.activityName} to application`
          }
        >
          {isSelected ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Added</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add to Application</span>
            </>
          )}
        </button>
      </div>

      {/* Optional: Display if activity has products */}
      {activity.products && activity.products.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center justify-between">
              <span>View Products ({activity.products.length})</span>
              <svg
                className="w-4 h-4 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <ul className="mt-2 space-y-1 text-xs text-gray-600 ml-4 list-disc">
              {activity.products.map((product, index) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </article>
  );
};

/**
 * Compact Activity Card Variant
 * Simplified version for list views or compact displays
 */
interface CompactCardProps {
  activity: FinancialActivity;
  onSelect?: (activity: FinancialActivity) => void;
  isSelected?: boolean;
}

export const CompactActivityCard: React.FC<CompactCardProps> = ({
  activity,
  onSelect,
  isSelected,
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(activity);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        w-full text-left p-4 rounded-lg border
        ${isSelected ? 'border-[#b82933] bg-red-50' : 'border-gray-200 bg-white'}
        hover:shadow-md transition-all duration-200
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#b82933]">
            {activity.activityCode}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {activity.activityName}
          </span>
        </div>
        <PrudentialCategoryBadge
          category={activity.prudentialCategory}
          size="sm"
          showTooltip={false}
        />
      </div>
    </button>
  );
};

export default FinancialActivityCard;
