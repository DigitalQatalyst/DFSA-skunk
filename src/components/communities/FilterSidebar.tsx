import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
export interface FilterOption {
  id: string;
  name: string;
}
export interface FilterConfig {
  id: string;
  title: string;
  options: FilterOption[];
}
interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
export interface FilterSidebarProps {
  filters: Record<string, string>;
  filterConfig: FilterConfig[];
  onFilterChange: (filterType: string, value: string) => void;
  onResetFilters: () => void;
  isResponsive?: boolean;
}
const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children
}) => {
  return <div className="border-b border-gray-100 py-3">
      <button className="flex w-full justify-between items-center text-left font-medium text-gray-900 mb-2" onClick={onToggle}>
        {title}
        {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        {children}
      </div>
    </div>;
};
export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  filterConfig,
  onFilterChange,
  onResetFilters,
  isResponsive = false
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(Object.fromEntries(filterConfig.map(config => [config.id, true])));
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const textSizeClass = 'text-sm';
  const spacingClass = isResponsive ? 'space-y-1' : 'space-y-2';
  return <div className="space-y-2">
      {filterConfig.map(config => <AccordionSection key={config.id} title={config.title} isOpen={openSections[config.id] || false} onToggle={() => toggleSection(config.id)}>
          <div className={spacingClass}>
            {config.options.map(option => <div key={option.id} className="flex items-center">
                <input type="checkbox" id={`${config.id}-${option.id}`} checked={filters[config.id] === option.name} onChange={() => onFilterChange(config.id, option.name)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor={`${config.id}-${option.id}`} className={`ml-2 ${textSizeClass} text-gray-700`}>
                  {option.name}
                </label>
              </div>)}
          </div>
        </AccordionSection>)}
    </div>;
};