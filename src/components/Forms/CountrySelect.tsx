/**
 * Country Select Component
 * 
 * ISO-3166 compliant country dropdown with search functionality
 * Ensures dropdown-only selection (no free text input)
 */

import React, { useState, useMemo } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
} from "@floating-ui/react";
import { ChevronDown, Check, Search } from "lucide-react";
import { COUNTRIES, Country, searchCountries, getCountryByName } from "../../utils/countryData";

interface CountrySelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
  label?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  id,
  value,
  onChange,
  onBlur,
  required = false,
  placeholder = "Select a country",
  className = "",
  error,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(5), flip(), shift(), size()],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context),
  ]);

  // Get selected country
  const selectedCountry = useMemo(() => {
    if (!value) return null;
    // Try to find by code first, then by name
    const byCode = COUNTRIES.find(c => c.code === value.toUpperCase());
    if (byCode) return byCode;
    return getCountryByName(value);
  }, [value]);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return COUNTRIES;
    }
    return searchCountries(searchQuery);
  }, [searchQuery]);

  const handleSelect = (country: Country) => {
    onChange(country.code); // Store ISO-3166-1 alpha-2 code
    setIsOpen(false);
    setSearchQuery("");
    onBlur?.();
  };

  const handleBlur = () => {
    setIsOpen(false);
    setSearchQuery("");
    onBlur?.();
  };

  const baseClasses = `w-full h-11 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
    error
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 hover:border-gray-400 focus:ring-blue-500"
  }`;

  return (
    <div className="relative">
      <button
        ref={refs.setReference}
        type="button"
        id={id}
        {...getReferenceProps()}
        className={`${baseClasses} ${className} flex items-center justify-between text-left bg-white`}
        aria-label={label || "Select country"}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-required={required}
      >
        <span className={selectedCountry ? "text-gray-900" : "text-gray-500"}>
          {selectedCountry ? selectedCountry.name : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {selectedCountry && !error && (
            <Check className="w-4 h-4 text-green-500" />
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden flex flex-col"
        >
          <FloatingFocusManager context={context} modal={false}>
            {/* Search input */}
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Country list */}
            <div className="overflow-y-auto max-h-80">
              {filteredCountries.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No countries found
                </div>
              ) : (
                filteredCountries.map((country) => {
                  const isSelected = selectedCountry?.code === country.code;
                  return (
                    <div
                      key={country.code}
                      onClick={() => handleSelect(country)}
                      onMouseDown={(e) => e.preventDefault()}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span className="text-sm text-gray-900">
                        {country.name}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </FloatingFocusManager>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

