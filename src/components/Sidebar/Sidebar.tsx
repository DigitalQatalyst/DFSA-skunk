import React, { useEffect, useState, useRef } from "react";
// import Link from 'next/link';
import {
  X,
  ChevronDown,
  Info,
  Home,
  Users,
  Settings,
  BarChart3,
  User,
  FolderOpen,
  Send,
  HelpCircle,
  ExternalLink,
  Plus,
  Check,
  Menu,
  MessageCircleIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAbilityContext } from "../../context/AbilityContext";
import { Can } from "../RBAC";

interface Company {
  id: string;
  name: string;
  role: string;
  isActive?: boolean;
  badge?: string;
}
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  category?: "category";
  external?: boolean;
  href?: string; // <--- new
  requiresUpdate?: boolean; // Flag for items requiring update permission
}
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
  onboardingComplete?: boolean;
  companyName?: string;
  companies?: Company[];
  onCompanyChange?: (companyId: string) => void;
  onAddNewEnterprise?: () => void;
  isLoggedIn?: boolean;
  "data-id"?: string;
  hideFormsMenu?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  onSectionChange,
  onboardingComplete = true,
  companies = [
    {
      id: "1",
      name: "FutureTech LLC",
      role: "Owner",
      isActive: true,
      badge: "Primary",
    },
    {
      id: "2",
      name: "StartupCo Inc",
      role: "Admin",
      badge: "Secondary",
    },
    {
      id: "3",
      name: "Enterprise Solutions",
      role: "Member",
    },
  ],
  onCompanyChange,
  onAddNewEnterprise,
  isLoggedIn = true,
  "data-id": dataId,
  hideFormsMenu = false,
}) => {
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [formsDropdownOpen, setFormsDropdownOpen] = useState(false);
  const [focusedMenuIndex, setFocusedMenuIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formsDropdownRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");
  const { role } = useAbilityContext(); // Get role from AbilityContext
  const isAdmin = role === "admin"; // Only admins can see onboarding

  useEffect(() => {
    const section = location.pathname.split("/")[2] || "dashboard";
    setActiveSection(section);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCompanyDropdownOpen(false);
      }
      if (
        formsDropdownRef.current &&
        !formsDropdownRef.current.contains(event.target as Node)
      ) {
        setFormsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      const menuItems = getMenuItems().filter(
        (item) => item.category !== "category"
      );
      switch (event.key) {
        case "Escape":
          if (companyDropdownOpen) {
            setCompanyDropdownOpen(false);
            return;
          }
          if (formsDropdownOpen) {
            setFormsDropdownOpen(false);
            return;
          }
          onClose?.();
          break;
        case "ArrowDown":
          event.preventDefault();
          setFocusedMenuIndex((prev) => {
            const next = prev < menuItems.length - 1 ? prev + 1 : 0;
            menuItemsRef.current[next]?.focus();
            return next;
          });
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedMenuIndex((prev) => {
            const next = prev > 0 ? prev - 1 : menuItems.length - 1;
            menuItemsRef.current[next]?.focus();
            return next;
          });
          break;
      }
    };
    if (isOpen) {
      console.log("Sidebar isOpen:", isOpen);
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, companyDropdownOpen, formsDropdownOpen, onClose]);

  if (!isLoggedIn) return null;

  const getMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [];

    // Show onboarding for admins only if onboarding is not complete
    // All other users always see overview
    if (isAdmin && !onboardingComplete) {
      items.push({
        id: "onboarding",
        label: "Onboarding",
        icon: <Users size={20} />,
        href: "/dashboard/onboarding",
      });
    } else {
      // Always show overview for all users
      items.push({
        id: "overview",
        label: "Overview",
        icon: <Home size={20} />,
        href: "/dashboard/overview",
      });
    }

    items.push({
      id: "essentials",
      label: "ESSENTIALS",
      category: "category",
    } as MenuItem);

    // Profile - all authenticated users can access
    items.push({
      id: "profile",
      label: "Profile",
      icon: <User size={20} />,
      href: "/dashboard/profile",
    });

    // Documents - all authenticated users can access
    items.push({
      id: "documents",
      label: "Documents",
      icon: <FolderOpen size={20} />,
      href: "/dashboard/documents",
    });

    items.push({
      id: "transactions",
      label: "TRANSACTIONS",
      category: "category",
    } as MenuItem);

    // Only add Forms menu if not hidden
    // if (!hideFormsMenu) {
    //   items.push({
    //     id: "forms",
    //     label: "Forms",
    //     icon: <Send size={20} />,
    //   });
    // }

    items.push(
      {
        id: "requests",
        label: "Requests",
        icon: <Send size={20} />,
        href: "/dashboard/requests",
      },
      {
        id: "reporting-obligations",
        label: "Reporting Obligations",
        icon: <BarChart3 size={20} />,
        href: "/dashboard/reporting-obligations",
      },

      {
        id: "analytics-monitoring",
        label: "ANALYTICS & MONITORING",
        category: "category",
      } as MenuItem,
      {
        id: "experience-analytics",
        label: "Experience Analytics",
        icon: <BarChart3 size={20} />,
        href: "/dashboard/experience-analytics",
      }
    );

    items.push({
      id: "settings-support",
      label: "Settings & Support",
      category: "category",
    } as MenuItem);

    // Settings - all authenticated users can access
    items.push({
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      href: "/dashboard/settings",
    });

    // Support routes - all authenticated users can access
    items.push({
      id: "support",
      label: "Support",
      icon: <HelpCircle size={20} />,
      href: "/dashboard/support",
    });
    // items.push({
    //   id: "chat-support",
    //   label: "Chat Support",
    //   icon: <MessageCircleIcon size={20} />,
    //   href: "/dashboard/chat-support",
    // });

    // Help Center - viewers can only read, other roles can update
    items.push({
      id: "help-center",
      label: "Help Center",
      icon: <HelpCircle size={20} />,
      href: "/dashboard/help-center",
      requiresUpdate: true, // Flag to indicate this needs update permission
    });

    return items;
  };

  const activeCompany = companies.find((c) => c.isActive) || companies[0];

  return (
    <>
      {/* 1. Mobile Overlay */}
      {/*{isOpen && (*/}
      {/*    <div*/}
      {/*        className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"*/}
      {/*        onClick={onClose}*/}
      {/*    />*/}
      {/*)}*/}

      {/*/!* 2. Main Sidebar Container - Apply the clean, working classes *!/*/}
      {/*<div*/}
      {/*    className={`*/}
      {/*        fixed inset-y-0 left-0 z-30 w-64 border-r border-gray-200 bg-gray-50*/}
      {/*        transform transition-transform duration-300 ease-in-out overflow-y-auto*/}
      {/*        */}
      {/*        ${isOpen ? 'translate-x-0' : '-translate-x-full'} */}
      {/*        */}
      {/*        // Desktop override starts at 'lg'*/}
      {/*        lg:static lg:translate-x-0 lg:w-60*/}
      {/*    `}*/}
      {/*    data-id={dataId}*/}
      {/*>*/}
      {/* 1. Mobile Overlay (Already conditionally rendered) */}
      {/* 1. Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 2. Main Sidebar Container - FIXED VERSION */}
      <div
        className={`
      fixed inset-y-0 left-0 z-50 w-64
      bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out
      overflow-y-auto

      ${isOpen ? "translate-x-0" : "-translate-x-full"}

      lg:static lg:translate-x-0 lg:w-60 lg:z-auto
    `}
        data-id={dataId}
      >
        {/* Header with Company Name (Switcher Disabled) */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <button className="lg:hidden text-gray-500" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="relative">
            <div className="w-full flex items-center justify-between text-left p-3 rounded-md">
              <div className="flex-1 min-w-0">
                <h2 className="text-blue-800 font-bold text-lg leading-tight truncate">
                  {activeCompany.name}
                </h2>
                {activeCompany.badge && (
                  <span className="text-xs text-gray-500 font-medium mt-0.5 block">
                    {activeCompany.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Onboarding Banner - Only show for admins */}
        {isAdmin && !onboardingComplete && (
          <div className="bg-amber-50 p-3 m-3 rounded-md border border-amber-200">
            <div className="flex items-start">
              <Info
                size={16}
                className="text-amber-500 mt-0.5 mr-2 flex-shrink-0"
              />
              <p className="text-xs text-amber-700">
                Complete the onboarding process to unlock all sections of the
                platform.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="py-2">
          {getMenuItems().map((item) => {
            if (item.category === "category") {
              return (
                <div key={item.id} className="px-4 pt-6 pb-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
                    {item.label}
                  </div>
                </div>
              );
            }

            // All menu items are always enabled and visible for all roles
            // Permissions are enforced at the page/action level, not in the sidebar
            const isActive = activeSection === item.id;

            // DISABLE MENU ITEMS DURING INCOMPLETE ONBOARDING
            // Only admins see onboarding, so only disable for admins with incomplete onboarding
            // Keep the "onboarding" menu item active, disable all others
            const shouldDisable = isAdmin && !onboardingComplete && item.id !== "onboarding";

            const baseClasses = `flex items-center px-4 py-3 relative transition-colors ${
              shouldDisable
                ? "text-gray-400 cursor-not-allowed opacity-60"
                : isActive
                ? ""
                : "text-gray-700 hover:bg-gray-200 cursor-pointer"
            }`;

            const getItemStyle = () => {
              if (isActive) {
                return { backgroundColor: '#9b18232a', color: '#9b1823' };
              }
              return {};
            };

            const activeStyle = getItemStyle();

            const content = (
              <>
                <span className="w-8 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </span>
                <span className="flex-1 ml-3">{item.label}</span>
                {item.external && (
                  <ExternalLink
                    size={14}
                    className="text-gray-400 ml-2 flex-shrink-0"
                  />
                )}
              </>
            );

            // Special handling for Forms dropdown
            if (item.id === "forms") {
              return (
                <div key={item.id} className="relative" ref={formsDropdownRef}>
                  <div
                    className={`${baseClasses} cursor-pointer`}
                    style={activeStyle}
                    onClick={() => setFormsDropdownOpen(!formsDropdownOpen)}
                  >
                    <span className="w-8 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </span>
                    <span className="flex-1 ml-3">{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform ml-2 flex-shrink-0 ${
                        formsDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      formsDropdownOpen
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="transform transition-transform duration-300 ease-in-out max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <Link
                        to="/dashboard/forms/book-consultation-for-entrepreneurship"
                        className="flex items-center px-4 py-3 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setFormsDropdownOpen(false)}
                      >
                        Book Consultation for Entrepreneurship
                      </Link>
                      <Link
                        to="/dashboard/forms/collateral-user-guide"
                        className="flex items-center px-4 py-3 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setFormsDropdownOpen(false)}
                      >
                        Collateral User Guide
                      </Link>
                      <Link
                        to="/dashboard/forms/cancel-loan"
                        className="flex items-center px-4 py-3 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setFormsDropdownOpen(false)}
                      >
                        Cancel Loan
                      </Link>

                      <Link
                        to="/dashboard/forms/disburse-approved-loan"
                        className="flex items-center px-4 py-3 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setFormsDropdownOpen(false)}
                      >
                        Disburse an Approved Loan
                      </Link>
                      <Link
                        to="/dashboard/forms/facilitate-communication"
                        className="flex items-center px-4 py-3 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setFormsDropdownOpen(false)}
                      >
                        Facilitate Communication
                      </Link>
                      <Link
                        to="/dashboard/forms/issue-support-letter"
                        className="flex items-center px-4 py-3 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setFormsDropdownOpen(false)}
                      >
                        Issue Support Letter
                      </Link>
                      <Link
                        to="/dashboard/forms/needs-assessment-form"
                        className="flex items-center px-4 py-3 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setFormsDropdownOpen(false)}
                      >
                        Needs Assessment Form
                      </Link>
                      <Link
                        to="/dashboard/forms/reallocation-of-loan-disbursement"
                        className="flex items-center px-4 py-3 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setFormsDropdownOpen(false)}
                      >
                        Reallocation of Loan Disbursement
                      </Link>
                      <Link
                        to="/dashboard/forms/request-for-funding"
                        className="flex items-center px-4 py-3 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setFormsDropdownOpen(false)}
                      >
                        Request For Funding
                      </Link>
                      <Link
                        to="/dashboard/forms/request-for-membership"
                        className="flex items-center px-4 py-3 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setFormsDropdownOpen(false)}
                      >
                        Request for Membership
                      </Link>
                      <Link
                        to="/dashboard/forms/request-to-amend-existing-loan-details"
                        className="flex items-center px-4 py-3 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setFormsDropdownOpen(false)}
                      >
                        Request to Amend Existing Loan Details
                      </Link>
                      <Link
                        to="/dashboard/forms/training-in-entrepreneurship"
                        className="flex items-center px-4 py-3 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setFormsDropdownOpen(false)}
                      >
                        Training in Entrepreneurship
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            if (item.href) {
              // If disabled, render as non-clickable div instead of Link
              if (shouldDisable) {
                return (
                  <div
                    key={item.id}
                    className={baseClasses}
                    style={activeStyle}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    title="Complete onboarding to access this section"
                  >
                    {content}
                  </div>
                );
              }

              return item.external ? (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={baseClasses}
                  style={activeStyle}
                >
                  {content}
                </a>
              ) : (
                <Link key={item.id} to={item.href} className={baseClasses} style={activeStyle}>
                  {content}
                </Link>
              );
            }

            return (
              <div key={item.id} className={baseClasses} style={activeStyle}>
                {content}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

// Burger menu stays the same
export const BurgerMenuButton: React.FC<{
  onClick: () => void;
  className?: string;
  isLoggedIn?: boolean;
  "data-id"?: string;
}> = ({ onClick, className = "", isLoggedIn = true, "data-id": dataId }) => {
  if (!isLoggedIn) return null;
  return (
    <button
      onClick={onClick}
      className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors ${className}`}
      data-id={dataId}
      aria-label="Open navigation menu"
    >
      <Menu size={20} />
    </button>
  );
};
