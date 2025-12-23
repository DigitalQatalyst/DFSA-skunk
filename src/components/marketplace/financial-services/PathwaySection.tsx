import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Pathway, FinancialActivityHierarchy } from '../../../data/dfsa/types';
import { ActivityGrid } from './ActivityGrid';

export interface PathwaySectionProps {
    pathway: Pathway;
    onActivityAdd?: (activity: FinancialActivityHierarchy) => void;
    selectedActivityIds?: string[];
    regimeAccentColor?: 'primary' | 'gold' | 'teal' | 'gray';
    defaultExpanded?: boolean;
    collapsible?: boolean;
}

/**
 * PathwaySection Component
 * Displays a pathway header with its activities
 */
export const PathwaySection: React.FC<PathwaySectionProps> = ({
    pathway,
    onActivityAdd,
    selectedActivityIds = [],
    regimeAccentColor = 'primary',
    defaultExpanded = true,
    collapsible = false,
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const toggleExpanded = () => {
        if (collapsible) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div className="mb-8">
            {/* Pathway Header */}
            <div
                className={`
          flex items-center justify-between mb-4 pb-3 border-b border-gray-200
          ${collapsible ? 'cursor-pointer hover:bg-gray-50 px-2 rounded' : ''}
        `}
                onClick={toggleExpanded}
            >
                <div className="flex-grow">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {pathway.name}
                        </h2>
                        {collapsible && (
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            >
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        )}
                    </div>
                    {pathway.description && (
                        <p className="text-sm text-gray-600 mt-1">{pathway.description}</p>
                    )}
                </div>
                <div className="flex-shrink-0 ml-4">
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {pathway.selectionCode}
                    </span>
                </div>
            </div>

            {/* Activities Grid */}
            {isExpanded && (
                <div>
                    {/* Guidance Text */}
                    {onActivityAdd && (
                        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">Tip:</span> You can select multiple services that match your business needs. Click on each service to add it to your selection, then click <span className="font-semibold">Proceed</span> when you're ready to continue.
                            </p>
                        </div>
                    )}

                    <ActivityGrid
                        activities={pathway.activities}
                        onActivityAdd={onActivityAdd}
                        selectedActivityIds={selectedActivityIds}
                        regimeAccentColor={regimeAccentColor}
                    />
                </div>
            )}

            {/* Activity Count */}
            {!isExpanded && collapsible && (
                <p className="text-sm text-gray-500 ml-2">
                    {pathway.activities.length} {pathway.activities.length === 1 ? 'activity' : 'activities'}
                </p>
            )}
        </div>
    );
};
