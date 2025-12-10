import React from 'react';
import { PathwayCard } from '../../types/dfsa-pathways';

interface SelectablePathwayCardProps {
  pathway: PathwayCard;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * SelectablePathwayCard Component
 * Reusable card for pathway/category selection
 * Features: hover effects, selected state, clickable
 * Matches the styling of WhatWeDoSection cards
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
        group cursor-pointer flex flex-col bg-white border-2 rounded-lg p-6 md:p-8
        shadow-md hover:shadow-2xl hover:-translate-y-2
        transition-all duration-300 ease-in-out
        ${
          isSelected
            ? 'border-dfsa-gold-600 bg-gradient-to-br from-dfsa-gold-50/50 via-dfsa-teal-50/30 to-white'
            : 'border-gray-200 hover:border-dfsa-gold-500 hover:bg-gradient-to-br hover:from-dfsa-gold-50/50 hover:via-dfsa-teal-50/30 hover:to-white'
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
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {pathway.code}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 leading-tight">
        {pathway.title}
      </h3>

      {/* Description */}
      <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed flex-1">
        {pathway.description}
      </p>

      {/* Meta Information */}
      <div className="mt-auto">
        <p className="text-xs md:text-sm text-gray-500 font-medium">
          {pathway.meta}
        </p>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 rounded-full bg-dfsa-gold-600 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      )}
    </article>
  );
};

export default SelectablePathwayCard;
