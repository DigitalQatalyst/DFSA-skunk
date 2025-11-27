import React from 'react';
import { PersonnelRole } from '../../types/dfsa';
import * as LucideIcons from 'lucide-react';

interface PersonnelCardProps {
  personnel: PersonnelRole;
  onClick?: () => void;
  className?: string;
}

/**
 * Personnel Card Component
 * Displays a key personnel role with requirements and responsibilities
 */
export const PersonnelCard: React.FC<PersonnelCardProps> = ({
  personnel,
  onClick,
  className = '',
}) => {
  // Dynamically get the icon component from lucide-react
  const IconComponent = LucideIcons[personnel.icon as keyof typeof LucideIcons] as any;

  return (
    <div
      className={`
        relative group
        bg-white rounded-xl shadow-md
        hover:shadow-xl transition-all duration-300
        border border-gray-100
        overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Status Badge */}
      {personnel.mandatory && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2.5 py-1 bg-primary text-white text-xs font-semibold rounded-full shadow-sm">
            Mandatory
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header with Icon */}
        <div className="flex items-start mb-4">
          <div className="flex items-center space-x-4">
            {IconComponent && (
              <div className="p-3 bg-gradient-to-br from-primary/10 to-dfsa-gold/10 rounded-lg group-hover:from-primary/20 group-hover:to-dfsa-gold/20 transition-colors">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">
                {personnel.role}
              </h3>
              <p className="text-sm font-semibold text-primary">
                {personnel.fullName}
              </p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Requirements:
          </h4>
          <ul className="space-y-2">
            {personnel.requirements.map((req, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <LucideIcons.CheckCircle2 className="w-4 h-4 text-dfsa-teal mr-2 mt-0.5 flex-shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Responsibilities */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Key Responsibilities:
          </h4>
          <ul className="space-y-2">
            {personnel.responsibilities.map((resp, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <LucideIcons.Circle className="w-3 h-3 text-dfsa-gold mr-2 mt-1 flex-shrink-0 fill-current" />
                {resp}
              </li>
            ))}
          </ul>
        </div>

        {/* Additional Info Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {personnel.residencyRequired && (
            <span className="px-2 py-1 bg-dfsa-teal/10 text-dfsa-teal text-xs font-medium rounded">
              UAE Residency Required
            </span>
          )}
          {personnel.yearsExperience && (
            <span className="px-2 py-1 bg-dfsa-gold/10 text-dfsa-gold text-xs font-medium rounded">
              {personnel.yearsExperience} years exp.
            </span>
          )}
          {personnel.fitAndProper && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
              Fit & Proper Required
            </span>
          )}
        </div>

        {/* Support Services (if provided) */}
        {personnel.support && personnel.support.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center">
              <LucideIcons.Users className="w-3.5 h-3.5 mr-1.5" />
              Our Support:
            </h4>
            <ul className="space-y-1">
              {personnel.support.map((item, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-start">
                  <span className="text-primary mr-1.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Hover Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-dfsa-gold to-dfsa-teal transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  );
};

export default PersonnelCard;
