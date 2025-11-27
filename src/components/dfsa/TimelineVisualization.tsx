import React, { useState } from 'react';
import { AuthorizationStep } from '../../types/dfsa';
import * as LucideIcons from 'lucide-react';
import { FadeInUpOnScroll } from '../AnimationUtils';

interface TimelineVisualizationProps {
  steps: AuthorizationStep[];
  className?: string;
}

/**
 * Timeline Visualization Component
 * Interactive 8-step authorization journey display
 * Horizontal scrollable on desktop, vertical stacked on mobile
 */
export const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({
  steps,
  className = '',
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Timeline - Horizontal */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-gray-200">
            <div className="h-full bg-gradient-to-r from-primary via-dfsa-gold to-dfsa-teal w-full"></div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-8 gap-2">
            {steps.map((step, index) => {
              const IconComponent = LucideIcons[step.icon as keyof typeof LucideIcons] as any;
              const isExpanded = expandedStep === step.stepNumber;

              return (
                <div key={step.stepNumber} className="relative flex flex-col items-center">
                  {/* Step Circle */}
                  <button
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`
                      relative z-10 w-32 h-32 rounded-full border-4
                      flex flex-col items-center justify-center
                      transition-all duration-300 cursor-pointer
                      ${
                        isExpanded
                          ? 'bg-primary border-primary text-white scale-110 shadow-xl'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-primary hover:scale-105 hover:shadow-lg'
                      }
                    `}
                  >
                    {IconComponent && (
                      <IconComponent className={`w-8 h-8 mb-2 ${isExpanded ? 'text-white' : 'text-primary'}`} />
                    )}
                    <span className="text-xs font-bold">Step {step.stepNumber}</span>
                  </button>

                  {/* Step Info */}
                  <div className="mt-4 text-center">
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-600">{step.duration}</p>
                  </div>

                  {/* Expanded Details - Dropdown */}
                  {isExpanded && (
                    <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 z-20
                                    bg-white rounded-lg shadow-2xl border-2 border-primary p-6
                                    animate-fade-in">
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-bold text-gray-900 mb-2">{step.title}</h5>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>

                        {step.whatHappens && step.whatHappens.length > 0 && (
                          <div>
                            <h6 className="text-xs font-semibold text-gray-700 uppercase mb-2">What Happens:</h6>
                            <ul className="space-y-1">
                              {step.whatHappens.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                  <span className="text-dfsa-teal mr-2">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {step.deliverables && step.deliverables.length > 0 && (
                          <div>
                            <h6 className="text-xs font-semibold text-gray-700 uppercase mb-2">Deliverables:</h6>
                            <ul className="space-y-1">
                              {step.deliverables.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                  <LucideIcons.Check className="w-4 h-4 text-dfsa-gold mr-2 mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {step.ctaLabel && (
                          <button
                            onClick={() => window.location.href = step.ctaUrl || '#'}
                            className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg
                                       transition-all duration-300"
                          >
                            {step.ctaLabel}
                          </button>
                        )}
                      </div>

                      {/* Close button */}
                      <button
                        onClick={() => setExpandedStep(null)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <LucideIcons.X size={20} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Timeline - Vertical */}
      <div className="lg:hidden space-y-6">
        {steps.map((step, index) => {
          const IconComponent = LucideIcons[step.icon as keyof typeof LucideIcons] as any;
          const isExpanded = expandedStep === step.stepNumber;
          const isLast = index === steps.length - 1;

          return (
            <FadeInUpOnScroll key={step.stepNumber} delay={index * 0.1}>
              <div className="relative pl-12">
                {/* Connector Line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 bottom-0 w-1 bg-gradient-to-b from-primary to-dfsa-gold"></div>
                )}

                {/* Step Circle */}
                <button
                  onClick={() => toggleStep(step.stepNumber)}
                  className={`
                    absolute left-0 top-0 w-12 h-12 rounded-full border-4 z-10
                    flex items-center justify-center
                    transition-all duration-300
                    ${
                      isExpanded
                        ? 'bg-primary border-primary text-white scale-110'
                        : 'bg-white border-gray-300 text-primary hover:border-primary hover:scale-105'
                    }
                  `}
                >
                  {IconComponent && <IconComponent className="w-6 h-6" />}
                </button>

                {/* Step Content */}
                <div className={`
                  bg-white rounded-lg border-2 p-6 cursor-pointer
                  transition-all duration-300
                  ${isExpanded ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-gray-300'}
                `}
                onClick={() => toggleStep(step.stepNumber)}>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-xs font-semibold text-primary mb-1">STEP {step.stepNumber}</div>
                      <h4 className="text-lg font-bold text-gray-900">{step.title}</h4>
                    </div>
                    <div className="text-sm font-semibold text-dfsa-gold whitespace-nowrap ml-4">
                      {step.duration}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4">{step.description}</p>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="space-y-4 pt-4 border-t border-gray-200 animate-fade-in">
                      {step.whatHappens && step.whatHappens.length > 0 && (
                        <div>
                          <h6 className="text-xs font-semibold text-gray-700 uppercase mb-2">What Happens:</h6>
                          <ul className="space-y-2">
                            {step.whatHappens.map((item, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start">
                                <span className="text-dfsa-teal mr-2">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.deliverables && step.deliverables.length > 0 && (
                        <div>
                          <h6 className="text-xs font-semibold text-gray-700 uppercase mb-2">Deliverables:</h6>
                          <ul className="space-y-2">
                            {step.deliverables.map((item, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start">
                                <LucideIcons.Check className="w-4 h-4 text-dfsa-gold mr-2 mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.support && step.support.length > 0 && (
                        <div>
                          <h6 className="text-xs font-semibold text-gray-700 uppercase mb-2">Our Support:</h6>
                          <ul className="space-y-2">
                            {step.support.map((item, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start">
                                <LucideIcons.Users className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.fees && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h6 className="text-xs font-semibold text-gray-700 uppercase mb-2">Application Fees:</h6>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {step.fees.category1 && <div>Cat 1: {step.fees.category1}</div>}
                            {step.fees.category2 && <div>Cat 2: {step.fees.category2}</div>}
                            {step.fees.category3 && <div>Cat 3: {step.fees.category3}</div>}
                            {step.fees.category4 && <div>Cat 4: {step.fees.category4}</div>}
                            {step.fees.category5 && <div>Cat 5: {step.fees.category5}</div>}
                          </div>
                        </div>
                      )}

                      {step.ctaLabel && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = step.ctaUrl || '#';
                          }}
                          className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg
                                     transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <span>{step.ctaLabel}</span>
                          <LucideIcons.ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Expand/Collapse Indicator */}
                  <div className="flex justify-center mt-3">
                    {isExpanded ? (
                      <LucideIcons.ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <LucideIcons.ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </FadeInUpOnScroll>
          );
        })}
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TimelineVisualization;
