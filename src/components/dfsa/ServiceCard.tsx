import React from 'react';
import { ComplianceService } from '../../types/dfsa';
import * as LucideIcons from 'lucide-react';

interface ServiceCardProps {
  service: ComplianceService;
  onClick?: () => void;
  className?: string;
}

/**
 * Service Card Component
 * Displays a compliance service with icon, pricing, and features
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onClick,
  className = '',
}) => {
  // Dynamically get the icon component from lucide-react
  const IconComponent = LucideIcons[service.icon as keyof typeof LucideIcons] as any;

  const getPricingDisplay = () => {
    if (service.pricing.customNote) {
      return service.pricing.customNote;
    }
    const amount = service.pricing.amount;
    const frequency = service.pricing.frequency;
    return frequency ? `${amount} ${frequency}` : amount;
  };

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
      {/* Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-dfsa-gold to-dfsa-teal" />

      {/* Content */}
      <div className="p-6">
        {/* Header with Icon and Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {IconComponent && (
              <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-heading font-bold text-gray-900">
                {service.title}
              </h3>
            </div>
          </div>
          {service.badge && (
            <span className="px-2.5 py-0.5 bg-dfsa-gold text-white text-xs font-semibold rounded-full">
              {service.badge}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* What We Provide */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            What We Provide:
          </h4>
          <ul className="space-y-1.5">
            {service.whatWeProvide.slice(0, 3).map((item, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <LucideIcons.Check className="w-4 h-4 text-dfsa-teal mr-2 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
            {service.whatWeProvide.length > 3 && (
              <li className="text-sm text-primary font-medium">
                +{service.whatWeProvide.length - 3} more benefits
              </li>
            )}
          </ul>
        </div>

        {/* Pricing */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Pricing</p>
          <p className="text-lg font-bold text-gray-900">
            {getPricingDisplay()}
          </p>
          {service.timeline && (
            <p className="text-xs text-gray-500 mt-1">
              Timeline: {service.timeline}
            </p>
          )}
        </div>

        {/* Ideal For (if provided) */}
        {service.idealFor && service.idealFor.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Ideal For:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {service.idealFor.map((item, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-dfsa-teal/10 text-dfsa-teal text-xs font-medium rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onClick}
          className="w-full py-2.5 px-4 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white
                     font-semibold rounded-lg transition-all duration-300
                     flex items-center justify-center space-x-2 group"
        >
          <span>{service.ctaLabel}</span>
          <LucideIcons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-dfsa-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

export default ServiceCard;
