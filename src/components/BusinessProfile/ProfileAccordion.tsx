/**
 * ProfileAccordion Component
 * Generic accordion wrapper for profile sections
 */

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckCircleIcon } from 'lucide-react';

export interface AccordionSection {
  id: string;
  title: string;
  completion?: number;
  mandatoryCompletion?: number;
  isRequired?: boolean;
  hasMissingMandatory?: boolean;
}

interface ProfileAccordionProps {
  sections: AccordionSection[];
  defaultExpandedIndex?: number;
  onSectionToggle?: (index: number) => void;
  children: (section: AccordionSection, index: number, isExpanded: boolean) => React.ReactNode;
  renderHeader?: (section: AccordionSection, index: number, isExpanded: boolean) => React.ReactNode;
}

export function ProfileAccordion({
  sections,
  defaultExpandedIndex = 0,
  onSectionToggle,
  children,
  renderHeader,
}: ProfileAccordionProps) {
  const [expandedSection, setExpandedSection] = useState<number>(defaultExpandedIndex);

  const toggleSection = (index: number) => {
    const newExpanded = expandedSection === index ? -1 : index;
    setExpandedSection(newExpanded);
    onSectionToggle?.(index);
  };

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const isExpanded = expandedSection === index;

        return (
          <div
            key={section.id}
            className={`rounded-lg border overflow-hidden transition-all ${
              section.hasMissingMandatory
                ? 'border-amber-300'
                : 'border-gray-200'
            } ${isExpanded ? 'shadow-sm' : 'bg-gray-50'}`}
          >
            {/* Header */}
            <div
              className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 cursor-pointer hover:bg-gray-50 min-h-[48px] ${
                isExpanded ? 'border-b border-gray-200' : ''
              } ${section.hasMissingMandatory ? 'bg-amber-50' : ''}`}
              onClick={() => toggleSection(index)}
              role="button"
              aria-expanded={isExpanded}
              aria-controls={`section-${section.id}-content`}
            >
              {renderHeader ? (
                renderHeader(section, index, isExpanded)
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center w-full">
                  {/* Status and Name */}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-700 mb-1 sm:mb-0 text-sm sm:text-base break-words">
                        {section.title}
                      </h3>
                      {section.completion === 100 ? (
                        // Match Profile Summary "Complete" pill styling
                        <span className="ml-2 flex items-center text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                          <CheckCircleIcon size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">Complete</span>
                        </span>
                      ) : typeof section.isRequired === 'boolean' ? (
                        <span
                          className={`ml-2 flex items-center text-xs px-1.5 py-0.5 rounded-full ${
                            section.completion === 0
                              ? 'text-amber-700 bg-amber-100'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full mr-1 flex-shrink-0 bg-current" />
                          <span className="truncate">
                            {section.isRequired ? 'Required' : 'Optional'}
                          </span>
                        </span>
                      ) : null}
                    </div>

                    <div className="sm:ml-3 flex items-center mt-2 sm:mt-0">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            section.completion === 100
                              ? 'bg-green-500'
                              : section.completion && section.completion >= 30
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{
                            width: `${section.completion || 0}%`,
                            backgroundColor:
                              section.completion &&
                              section.completion >= 70 &&
                              section.completion < 100
                                ? '#9b1823'
                                : undefined,
                          }}
                          aria-valuenow={section.completion || 0}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          role="progressbar"
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">
                        {section.completion || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Chevron */}
              <div className="flex-shrink-0 mt-2 sm:mt-0">
                {isExpanded ? (
                  <ChevronUpIcon size={16} />
                ) : (
                  <ChevronDownIcon size={16} />
                )}
              </div>
            </div>

            {/* Content */}
            {isExpanded && (
              <div
                className="p-3 sm:p-4 bg-white"
                id={`section-${section.id}-content`}
              >
                {children(section, index, isExpanded)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

