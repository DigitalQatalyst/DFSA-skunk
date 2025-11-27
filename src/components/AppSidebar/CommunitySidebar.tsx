import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/UnifiedAuthProvider";
import { useNavigate } from "react-router-dom";
import {
  X,
  Home,
  Users,
  Send,
  Shield,
  BarChart3,
  Menu,
  User as UserIcon,
} from "lucide-react";

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
}

interface CommunitySidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
  companyName?: string;
  companies?: Company[];
  onCompanyChange?: (companyId: string) => void;
  onAddNewEnterprise?: () => void;
  isLoggedIn?: boolean;
  "data-id"?: string;
}

export const CommunitySidebar: React.FC<CommunitySidebarProps> = ({
  isOpen = true,
  onClose,
  activeSection = "feed",
  onSectionChange,
  companyName = "FutureTech LLC",
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
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Don't render sidebar if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  // Check if user is admin based on role
  const isAdmin = user?.role === "admin";

  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Handle keyboard navigation for sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === "Escape") {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const getMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      {
        id: "community",
        label: "COMMUNITY",
        category: "category",
      } as MenuItem,
      {
        id: "feed",
        label: "Feed",
        icon: <Home size={20} />,
      },
      {
        id: "communities",
        label: "Communities",
        icon: <Users size={20} />,
      },
      {
        id: "messages",
        label: "Messages",
        icon: <Send size={20} />,
      },
      {
        id: "manage",
        label: "MANAGE",
        category: "category",
      } as MenuItem,
      {
        id: "moderation",
        label: "Moderation",
        icon: <Shield size={20} />,
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: <BarChart3 size={20} />,
      },
    ];

    return items;
  };

  const closeSidebar = () => {
    onClose?.();
  };

  const isMenuItemDisabled = (itemId: string) => {
    // Disable moderation and analytics for non-admins
    if (!isAdmin && (itemId === "moderation" || itemId === "analytics")) {
      return true;
    }
    return false;
  };

  const handleMenuClick = (itemId: string, external?: boolean) => {
    if (isMenuItemDisabled(itemId)) {
      return; // Prevent interaction
    }
    if (external) {
      // Handle external links
      window.open("#", "_blank");
    } else {
      onSectionChange?.(itemId);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    itemId: string,
    external?: boolean
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleMenuClick(itemId, external);
    }
  };

  // const handleCompanySelect = (companyId: string) => {
  //   onCompanyChange?.(companyId);
  //   setCompanyDropdownOpen(false);
  // };

  // const handleAddNewEnterprise = () => {
  //   onAddNewEnterprise?.();
  //   setCompanyDropdownOpen(false);
  // };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // const handleProfileClick = () => {
  //   navigate("/profile");
  // };

  return (
    <div
      className={`fixed lg:sticky inset-y-0 left-0 z-30 w-64 lg:w-60 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 overflow-y-auto h-screen lg:top-0 
    [&::-webkit-scrollbar]:w-1.5
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-transparent
    hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
  `}
    >
      {/* Header with User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <button className="lg:hidden text-gray-500" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>
        <button
          className="w-full flex items-center gap-3 text-left p-3 rounded-md hover:bg-gray-100 transition-colors"
          onClick={handleProfileClick}
          aria-label="Go to profile"
        >
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {user?.avatar_url || user?.picture ? (
              <img
                src={user.avatar_url || user.picture}
                alt={user.username || user.name || user.email}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon size={20} className="text-blue-600" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-blue-800 font-bold text-base leading-tight truncate">
              {user?.username ||
                user?.name ||
                user?.email?.split("@")[0] ||
                "User"}
            </h2>
            <span className="text-xs text-gray-500 font-medium mt-0.5 block truncate">
              {user?.email || ""}
            </span>
          </div>
        </button>
        {/* Commented out dropdown for future use */}
        {/* {companyDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              {companies.map((company) => (
                <button
                  key={company.id}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                  onClick={() => handleCompanySelect(company.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {company.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {company.role}
                    </div>
                  </div>
                  <div className="flex items-center ml-2 flex-shrink-0">
                    {company.badge && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">
                        {company.badge}
                      </span>
                    )}
                    {company.isActive && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-blue-600"
                  onClick={handleAddNewEnterprise}
                >
                  <Plus size={16} className="mr-2 flex-shrink-0" />
                  Add New Enterprise
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Navigation */}
      <nav className="py-2">
        {getMenuItems().map((item, index) => {
          if (item.category === "category") {
            return (
              <div key={item.id} className="px-4 pt-6 pb-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
                  {item.label}
                </div>
              </div>
            );
          }

          const isActive = activeSection === item.id;
          const isDisabled = isMenuItemDisabled(item.id);
          const menuItemIndex = getMenuItems()
            .filter((i) => i.category !== "category")
            .findIndex((i) => i.id === item.id);

          return (
            <div
              key={item.id}
              ref={(el) => {
                menuItemsRef.current[menuItemIndex] = el;
              }}
              className={`flex items-center px-4 py-3 relative transition-colors ${
                isDisabled
                  ? "text-gray-400 cursor-not-allowed opacity-50"
                  : isActive
                  ? "bg-blue-700 text-white"
                  : "text-gray-700 hover:bg-gray-200 cursor-pointer"
              }`}
              onClick={() => handleMenuClick(item.id, item.external)}
              onKeyDown={(e) => handleKeyDown(e, item.id, item.external)}
              tabIndex={isDisabled ? -1 : 0}
              role="button"
              aria-label={`Navigate to ${item.label}`}
              aria-disabled={isDisabled}
            >
              <span className="w-8 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </span>
              <span className="flex-1 ml-3">{item.label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

// Export burger menu component for header integration
export const CommunityBurgerMenuButton: React.FC<{
  onClick: () => void;
  className?: string;
  isLoggedIn?: boolean;
  "data-id"?: string;
}> = ({ onClick, className = "", isLoggedIn = true, "data-id": dataId }) => {
  // Don't render burger menu if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors ${className}`}
      aria-label="Open navigation menu"
    >
      <Menu size={20} />
    </button>
  );
};
