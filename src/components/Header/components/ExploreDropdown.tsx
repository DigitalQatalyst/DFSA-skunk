import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "lucide-react";
import {
  BuildingIcon,
  CreditCardIcon,
  NewspaperIcon,
  UsersIcon,
  GraduationCapIcon,
  TrendingUpIcon,
  CalendarIcon,
  SparklesIcon,
  LucideProps,
} from "lucide-react";

interface Marketplace {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
  href: string;
  target?: string;
  rel?: string;
}

const marketplaces: Marketplace[] = [
  {
    id: "services",
    name: "Services",
    description:
      "Business registration, legal advisory, tax, compliance, and SME support services",
    icon: BuildingIcon,
    href: "/marketplace/non-financial",
  },
  {
    id: "enquiries",
    name: "Enquiries",
    description:
      "Submit your enquiries and get assistance with your business needs",
    icon: NewspaperIcon,
    href: "/enquiries",
  },
];

// TODO: Add more marketplaces
interface ExploreDropdownProps {
  isCompact?: boolean;
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

export function ExploreDropdown({ isCompact = false }: ExploreDropdownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % marketplaces.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev <= 0 ? marketplaces.length - 1 : prev - 1
        );
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
          itemRefs.current[focusedIndex]?.click();
        }
        break;
      case "Tab":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);

  const handleInternalNav = (href: string) => {
    setIsOpen(false);
    setFocusedIndex(-1);
    navigate(href);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className="flex items-center text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-md px-2 py-1 font-semibold"
        style={{
          '--hover-color': '#9b1823'
        } as React.CSSProperties}
        onMouseEnter={(e) => e.currentTarget.style.color = '#9b1823'}
        onMouseLeave={(e) => e.currentTarget.style.color = ''}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Explore marketplaces menu"
      >
        <span>Explore</span>
        <ChevronDownIcon
          size={16}
          className={`ml-1 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="explore-menu"
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">
              Explore Marketplaces
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Discover opportunities across Abu Dhabi&apos;s business ecosystem
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {marketplaces.map((marketplace, index) => {
              const Icon = marketplace.icon;
              const external = isExternal(marketplace.href);

              return (
                <a
                  key={marketplace.id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  href={marketplace.href}
                  // Respect explicit per-item settings, otherwise set sensible defaults
                  target={
                    marketplace.target ?? (external ? "_blank" : undefined)
                  }
                  rel={
                    marketplace.rel ??
                    (external ? "noopener noreferrer" : undefined)
                  }
                  className={`flex items-start px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 ${
                    focusedIndex === index ? "bg-gray-50" : ""
                  }`}
                  role="menuitem"
                  tabIndex={-1}
                  onClick={(e) => {
                    // Internal routes: prevent default and route via react-router
                    if (!external) {
                      e.preventDefault();
                      handleInternalNav(marketplace.href);
                    }
                    // External routes: let the browser handle it (respects target/rel)
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onFocus={() => setFocusedIndex(index)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon size={20} style={{ color: '#9b1823' }} />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {marketplace.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {marketplace.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
