import React from 'react';
import { Plus } from 'lucide-react';
import { FinancialActivityHierarchy } from '../../../data/dfsa/types';
import { ProductTags } from './ProductTags';
import { FormTriggerBadge } from './FormTriggerBadge';

export interface ActivityCardProps {
    activity: FinancialActivityHierarchy;
    onAdd?: (activity: FinancialActivityHierarchy) => void;
    isSelected?: boolean;
    variant?: 'default' | 'compact' | 'expanded';
    showProducts?: boolean;
    maxVisibleProducts?: number;
    regimeAccentColor?: 'primary' | 'gold' | 'teal' | 'gray';
}

/**
 * ActivityCard Component
 * Displays a financial service activity with its products and form trigger
 */
export const ActivityCard: React.FC<ActivityCardProps> = ({
    activity,
    onAdd,
    isSelected = false,
    showProducts = true,
    maxVisibleProducts = 4,
    regimeAccentColor = 'primary',
}) => {
    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAdd) {
            onAdd(activity);
        }
    };

    // Determine accent color based on regime
    const accentColorClass = {
        primary: 'border-l-primary',
        gold: 'border-l-dfsa-gold-600',
        teal: 'border-l-dfsa-teal-600',
        gray: 'border-l-dfsa-gray-600',
    }[regimeAccentColor];

    const codeBadgeColorClass = {
        primary: 'bg-primary/10 text-primary',
        gold: 'bg-dfsa-gold-100 text-dfsa-gold-700',
        teal: 'bg-dfsa-teal-100 text-dfsa-teal-700',
        gray: 'bg-dfsa-gray-100 text-dfsa-gray-700',
    }[regimeAccentColor];

    return (
        <div
            className={`
        bg-white rounded-lg border border-gray-200 shadow-sm
        hover:shadow-md transition-all duration-200
        border-l-4 ${accentColorClass}
        ${isSelected ? 'ring-2 ring-primary/50' : ''}
        flex flex-col h-full
      `}
        >
            {/* Card Header */}
            <div className="px-4 py-5 flex-grow">
                {/* Activity Code Badge and Name */}
                <div className="flex items-start gap-3 mb-3">
                    <div
                        className={`
              inline-flex items-center justify-center
              w-12 h-12 rounded-lg font-bold text-lg
              flex-shrink-0
              ${codeBadgeColorClass}
            `}
                    >
                        {activity.code}
                    </div>
                    <div className="flex-grow min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {activity.name}
                        </h3>
                        {activity.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {activity.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Products Section */}
                {showProducts && activity.products && activity.products.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
                            Products
                        </h4>
                        <ProductTags
                            products={activity.products}
                            maxVisible={maxVisibleProducts}
                            size="sm"
                        />
                    </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between gap-2">
                    <FormTriggerBadge
                        triggersForm={activity.triggersForm}
                        formCode={activity.formCode}
                        size="sm"
                    />

                    {onAdd && (
                        <button
                            onClick={handleAddClick}
                            className={`
                inline-flex items-center gap-1 px-3 py-1.5
                text-sm font-medium rounded-lg
                transition-colors
                ${isSelected
                                    ? 'bg-primary text-white'
                                    : 'text-primary bg-white border border-primary hover:bg-primary hover:text-white'
                                }
              `}
                            title={isSelected ? 'Added' : 'Add to selection'}
                        >
                            <Plus size={14} />
                            <span>{isSelected ? 'Added' : 'Add'}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
