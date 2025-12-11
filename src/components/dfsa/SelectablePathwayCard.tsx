import React from 'react';
import { Check } from 'lucide-react';
import { PathwayCard } from '../../types/dfsa-pathways';

interface SelectablePathwayCardProps {
  pathway: PathwayCard;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * SelectablePathwayCard Component
 * Enhanced selectable card for pathway/category selection
 * Features: hover effects, selected state, dfsa-gold highlighting, smooth animations
 */
export const SelectablePathwayCard: React.FC<SelectablePathwayCardProps> = ({
  pathway,
  isSelected,
  onSelect,
}) => {
  return (
    <article
      onClick={() => onSelect(pathway.id)}
      className={`
        group relative cursor-pointer flex flex-col bg-white rounded-2xl p-6 md:p-8
        shadow-sm hover:shadow-xl hover:-translate-y-2
        transition-all duration-300 ease-in-out
        active:scale-98
        ${
          isSelected
            ? 'border-2 border-dfsa-gold-600 bg-gradient-to-br from-dfsa-gold-50/30 to-white shadow-md'
            : 'border border-gray-200 hover:border-dfsa-gold-300 hover:bg-gradient-to-br hover:from-dfsa-gold-50/10 hover:to-transparent'
        }
      `}
      style={{ minHeight: '280px' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(pathway.id);
        }
      }}
      aria-pressed={isSelected}
      aria-label={`Select ${pathway.title}`}
    >
      {/* Code/Abbreviation - Top Left */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-dfsa-gold-600 uppercase tracking-wider">
          {pathway.code}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
        {pathway.title}
      </h3>

      {/* Description */}
      <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed flex-1">
        {pathway.description}
      </p>

      {/* Meta Information */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="text-xs md:text-sm text-gray-500 font-medium">
          {pathway.meta}
        </p>
      </div>

      {/* Selection Indicator - Top Right */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-7 h-7 rounded-full bg-dfsa-gold-600 flex items-center justify-center shadow-md">
            <Check size={16} className="text-white" strokeWidth={3} />
          </div>
        </div>
      )}

      {/* Hover Glow Effect */}
      <div
        className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
        bg-gradient-to-br from-dfsa-gold-100/20 via-transparent to-transparent
      `}
      />
    </article>
  );
};

export default SelectablePathwayCard;
