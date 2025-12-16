/**
 * Prudential Category Badge Component
 * Displays a color-coded badge for DFSA prudential categories
 *
 * COMPLIANCE: DFSA-compliant display of regulatory categories
 * ACCESSIBILITY: WCAG 2.1 AA compliant with proper contrast and aria-labels
 * LANGUAGE: British English
 */

import React from 'react';
import { PrudentialCategory } from '../../types/dfsa-activities';
import { getCategoryByCode } from '../../data/dfsa/prudentialCategories';

interface PrudentialCategoryBadgeProps {
  /** Prudential category code */
  category: PrudentialCategory;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Visual variant */
  variant?: 'solid' | 'outline';

  /** Show tooltip on hover */
  showTooltip?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * PrudentialCategoryBadge Component
 *
 * Renders a styled badge for DFSA prudential categories with:
 * - Color-coded by category (Cat 1 = Blue, Cat 2 = Green, etc.)
 * - Multiple size options
 * - Optional tooltip with category details
 * - Accessible with proper ARIA labels
 *
 * @example
 * ```tsx
 * <PrudentialCategoryBadge category="Cat 1" size="md" showTooltip />
 * ```
 */
export const PrudentialCategoryBadge: React.FC<PrudentialCategoryBadgeProps> = ({
  category,
  size = 'md',
  variant = 'solid',
  showTooltip = true,
  className = '',
}) => {
  const categoryInfo = getCategoryByCode(category);

  if (!categoryInfo) {
    return null;
  }

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  // Get base color classes
  const colorClasses = variant === 'solid'
    ? categoryInfo.colorScheme.badge
    : categoryInfo.colorScheme.badge.replace('bg-', 'border-2 border-').replace(/text-\w+-\d+/, 'text-gray-800');

  // Tooltip content
  const tooltipContent = `${categoryInfo.name} - ${categoryInfo.capitalRange.display}`;

  return (
    <div className="relative inline-block group">
      <span
        className={`
          inline-flex items-center justify-center
          font-semibold rounded-full
          transition-all duration-200
          ${sizeClasses[size]}
          ${colorClasses}
          ${className}
        `}
        aria-label={`Prudential category: ${categoryInfo.name}`}
        role="status"
      >
        {category}
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="
            absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
            hidden group-hover:block
            z-50
            pointer-events-none
          "
          role="tooltip"
        >
          <div
            className="
              bg-gray-900 text-white text-xs rounded-lg py-2 px-3
              whitespace-nowrap shadow-lg
              max-w-xs
            "
          >
            <div className="font-semibold mb-1">{categoryInfo.name}</div>
            <div className="text-gray-300">{categoryInfo.capitalRange.display}</div>
            {/* Tooltip arrow */}
            <div
              className="
                absolute top-full left-1/2 transform -translate-x-1/2
                border-4 border-transparent border-t-gray-900
              "
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Compact Badge Variant
 * Displays just the category code without extensive styling
 */
interface CompactBadgeProps {
  category: PrudentialCategory;
  className?: string;
}

export const CompactCategoryBadge: React.FC<CompactBadgeProps> = ({
  category,
  className = '',
}) => {
  const categoryInfo = getCategoryByCode(category);

  if (!categoryInfo) {
    return null;
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-2 py-0.5 text-xs font-medium rounded
        ${categoryInfo.colorScheme.badge}
        ${className}
      `}
      aria-label={`Category: ${category}`}
    >
      {category}
    </span>
  );
};

/**
 * Category Badge with Icon
 * Enhanced badge with optional icon
 */
interface IconBadgeProps {
  category: PrudentialCategory;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const IconCategoryBadge: React.FC<IconBadgeProps> = ({
  category,
  icon,
  size = 'md',
  className = '',
}) => {
  const categoryInfo = getCategoryByCode(category);

  if (!categoryInfo) {
    return null;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-semibold rounded-full
        ${sizeClasses[size]}
        ${categoryInfo.colorScheme.badge}
        ${className}
      `}
      aria-label={`Prudential category: ${categoryInfo.name}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{category}</span>
    </span>
  );
};

export default PrudentialCategoryBadge;
