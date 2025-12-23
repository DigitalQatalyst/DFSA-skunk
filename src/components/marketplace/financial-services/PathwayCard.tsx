import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Pathway } from '../../../data/dfsa/types';

export interface PathwayCardProps {
    pathway: Pathway;
    onSelect: (pathwayId: string) => void;
    accentColor?: 'primary' | 'gold' | 'teal' | 'gray';
}

/**
 * PathwayCard Component
 * Clickable card for pathway selection
 */
export const PathwayCard: React.FC<PathwayCardProps> = ({
    pathway,
    onSelect,
    accentColor = 'primary',
}) => {
    const handleClick = () => {
        onSelect(pathway.id);
    };

    const borderColorClass = {
        primary: 'hover:border-primary hover:shadow-primary/10',
        gold: 'hover:border-dfsa-gold-600 hover:shadow-dfsa-gold/10',
        teal: 'hover:border-dfsa-teal-600 hover:shadow-dfsa-teal/10',
        gray: 'hover:border-dfsa-gray-600 hover:shadow-dfsa-gray/10',
    }[accentColor];

    const textColorClass = {
        primary: 'text-primary',
        gold: 'text-dfsa-gold-700',
        teal: 'text-dfsa-teal-700',
        gray: 'text-dfsa-gray-700',
    }[accentColor];

    return (
        <button
            onClick={handleClick}
            className={`
        w-full bg-white border-2 border-gray-200 rounded-lg p-6
        cursor-pointer transition-all duration-200
        hover:transform hover:-translate-y-1
        ${borderColorClass}
        hover:shadow-lg
        text-left flex flex-col min-h-[200px]
      `}
        >
            {/* Pathway Name */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex-grow">
                {pathway.name}
            </h3>

            {/* Description */}
            {pathway.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {pathway.description}
                </p>
            )}

            {/* Activity Count */}
            <div className={`flex items-center justify-between mt-auto pt-4 border-t border-gray-100 font-semibold ${textColorClass}`}>
                <span className="text-sm">
                    {pathway.activities.length} {pathway.activities.length === 1 ? 'activity' : 'activities'}
                </span>
                <ArrowRight size={18} />
            </div>
        </button>
    );
};
