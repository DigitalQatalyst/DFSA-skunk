import React from 'react';
import { LicenseCategory } from '../../types/dfsa';
import * as LucideIcons from 'lucide-react';

interface LicenseCategoryCardProps {
  category: LicenseCategory;
  onClick?: () => void;
  className?: string;
}

/**
 * License Category Card Component
 * Displays a license category with icon, description, requirements, and CTA
 */
export const LicenseCategoryCard: React.FC<LicenseCategoryCardProps> = ({
  category,
  onClick,
  className = '',
}) => {
  // Dynamically get the icon component from lucide-react
  const IconComponent = LucideIcons[category.icon as keyof typeof LucideIcons] as any;

  return (
    <div
      className={`
        relative group
        bg-white rounded-2xl shadow-lg
        hover:shadow-2xl transition-all duration-300
        overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient || 'from-primary to-dfsa-gold'} opacity-5 group-hover:opacity-10 transition-opacity`} />

      {/* Content */}
      <div className="relative p-6 md:p-8">
        {/* Header with Icon and Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {IconComponent && (
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-heading font-bold text-gray-900">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">Category {category.categoryNumber}</p>
            </div>
          </div>
          {category.badge && (
            <span className="px-3 py-1 bg-dfsa-gold text-white text-xs font-semibold rounded-full">
              {category.badge}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 line-clamp-3">
          {category.description}
        </p>

        {/* Requirements Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Capital Requirement</p>
            <p className="text-sm font-semibold text-gray-900">
              {category.capitalRequirement.amount}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Timeline</p>
            <p className="text-sm font-semibold text-gray-900">
              {category.timeline}
            </p>
          </div>
        </div>

        {/* Key Activities */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Activities:</h4>
          <ul className="space-y-1">
            {category.keyActivities.slice(0, 4).map((activity, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-dfsa-gold mr-2">•</span>
                {activity}
              </li>
            ))}
            {category.keyActivities.length > 4 && (
              <li className="text-sm text-primary font-medium">
                +{category.keyActivities.length - 4} more activities
              </li>
            )}
          </ul>
        </div>

        {/* Subcategories (if any) */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mb-6 p-3 bg-dfsa-teal/5 rounded-lg border border-dfsa-teal/20">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Subcategories:</h4>
            <div className="space-y-1">
              {category.subcategories.map((sub) => (
                <div key={sub.code} className="text-sm">
                  <span className="font-medium text-dfsa-teal">{sub.code}:</span>
                  <span className="text-gray-600 ml-1">{sub.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onClick}
          className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg
                     transition-all duration-300 transform group-hover:translate-y-[-2px]
                     flex items-center justify-center space-x-2"
        >
          <span>Explore Category {category.categoryNumber}</span>
          <LucideIcons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-colors pointer-events-none" />
    </div>
  );
};

export default LicenseCategoryCard;
