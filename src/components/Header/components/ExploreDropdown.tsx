import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "lucide-react";
import {
  BuildingIcon,
  GraduationCapIcon,
  LucideProps,
  InfoIcon,
  NewspaperIcon,
  BookOpenIcon,
  BriefcaseIcon,
} from "lucide-react";

interface Marketplace {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
  href: string;
  target?: string;
  rel?: string;
  comingSoon?: boolean;
}

const marketplaces: Marketplace[] = [
  {
    id: "authorisation",
    name: "Authorisation",
    description:
      "Apply for authorisation to conduct financial services activities in the DIFC",
    icon: BuildingIcon,
    href: "/marketplace/business-services",
  },
  {
    id: "recognition",
    name: "Recognition",
    description:
      "Obtain recognition for regulatory activities and qualifications",
    icon: GraduationCapIcon,
    href: "/recognition",
  },
  {
    id: "what-we-do",
    name: "What we do",
    description:
      "Structured documentation preparation services for DFSA applications",
    icon: BriefcaseIcon,
    href: "#",
    comingSoon: true,
  },
  {
    id: "about-us",
    name: "About us",
    description:
      "Learn about our team and regulatory expertise",
    icon: InfoIcon,
    href: "#",
    comingSoon: true,
  },
  {
    id: "news",
    name: "News",
    description:
      "Latest updates on DFSA regulations and industry developments",
    icon: NewspaperIcon,
    href: "#",
    comingSoon: true,
  },
  {
    id: "resources",
    name: "Resources",
    description:
      "Compliance guides, templates, and regulatory reference materials",
    icon: BookOpenIcon,
    href: "#",
    comingSoon: true,
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
        className="flex items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-md px-3 py-1.5 font-semibold hover:bg-white/10"
        style={{
          color: '#ffffff'
        }}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Explore marketplaces menu"
      >
        <span>Explore</span>
        <ChevronDownIcon
          size={16}
          className={`ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
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
                  href={marketplace.comingSoon ? "#" : marketplace.href}
                  // Respect explicit per-item settings, otherwise set sensible defaults
                  target={
                    marketplace.target ?? (external ? "_blank" : undefined)
                  }
                  rel={
                    marketplace.rel ??
                    (external ? "noopener noreferrer" : undefined)
                  }
                  className={`flex items-start px-4 py-3 text-left transition-colors duration-150 ${marketplace.comingSoon
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-gray-50 focus:bg-gray-50"
                    } ${focusedIndex === index && !marketplace.comingSoon ? "bg-gray-50" : ""}`}
                  role="menuitem"
                  tabIndex={-1}
                  onClick={(e) => {
                    // Prevent action for coming soon items
                    if (marketplace.comingSoon) {
                      e.preventDefault();
                      return;
                    }
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
                    <Icon size={20} style={{ color: '#b82933' }} />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {marketplace.name}
                      </p>
                      {marketplace.comingSoon && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          Coming Soon
                        </span>
                      )}
                    </div>
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
