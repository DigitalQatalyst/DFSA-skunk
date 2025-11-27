import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Header, useAuth } from "../Header";
import { Sidebar } from "../Sidebar";
import { Footer } from "../Footer";
import { useSidebar } from "../../context/SidebarContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useUnifiedAuthFlow } from "../../hooks/useUnifiedAuthFlow";
import { useOrganizationInfo } from "../../hooks/useOrganizationInfo";
import { ProfileProvider, useProfile } from "../../pages/dashboard/context/ProfileContext";
import { fetchCombinedProfileData } from "../../services/DataverseService";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";

interface FormLayoutWrapperProps {
  children: React.ReactNode;
}

// Internal component that uses ProfileContext
const FormLayoutContent: React.FC<FormLayoutWrapperProps> = ({ children }) => {
  const { isOpen, setIsOpen } = useSidebar();
  const [activeSection, setActiveSection] = useState("forms");
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(user);

  // Get onboarding state from unified auth flow
  const { onboardingState } = useUnifiedAuthFlow();
  const onboardingComplete = onboardingState === 'completed';

  // Get organization info for company name and data
  const { organization } = useOrganizationInfo();

  // Use the ProfileContext for company name management
  const { companyName, setCompanyName } = useProfile();

  // Local state for profile loading
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [activeCompany, setActiveCompany] = useState(user?.id || "1");

  // Use refs to prevent infinite loops (same as DashboardLayout)
  const lastFetchedUserIdRef = useRef<string | null>(null);
  const isFetchingProfileRef = useRef(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname, isOpen, setIsOpen]);

  // Fetch profile data (same logic as DashboardLayout)
  const fetchProfileData = useCallback(async () => {
    if (!user || !user.email || !user.id) {
      console.warn(
        "⚠️ [FORM LAYOUT] User data is not yet available. Skipping profile fetch."
      );
      return;
    }

    // Prevent duplicate fetches for the same user
    if (
      lastFetchedUserIdRef.current === user.id &&
      isFetchingProfileRef.current
    ) {
      console.log(
        "🔍 [FORM LAYOUT] Already fetching profile for user:",
        user.id
      );
      return;
    }

    // Mark as fetching
    isFetchingProfileRef.current = true;
    lastFetchedUserIdRef.current = user.id;
    setIsProfileLoading(true);

    try {
      console.log("🔍 [FORM LAYOUT] Fetching combined profile data for:", {
        email: user.email,
        id: user.id,
      });
      const response = await fetchCombinedProfileData(user.email, user.id);
      const apiProfile = response;
      console.log("✅ [FORM LAYOUT] API profile received:", apiProfile);

      // Only set company name if we have it from profile AND organization data is not available
      const profileCompanyName = (apiProfile as any)?.kf_tradename;
      if (profileCompanyName) {
        setCompanyName(profileCompanyName);
      } else {
        // Only set fallback if organization data is not available
        const hasOrgCompanyName = organization?.accountName || organization?.kf_enterprisename || (organization as any)?.name;
        if (!hasOrgCompanyName) {
          // No organization data and no profile company name - use user name as fallback
          setCompanyName(user.name || null);
        }
      }

      // Store in React Query cache for Profile module to consume
      queryClient.setQueryData(["profile", "business", user.id], apiProfile);
    } catch (error) {
      console.error(
        "❌ [FORM LAYOUT] Error fetching business profile data:",
        error
      );
      // Only set fallback if organization data is not available
      const hasOrgCompanyName = organization?.accountName || organization?.kf_enterprisename || (organization as any)?.name;
      if (!hasOrgCompanyName) {
        setCompanyName(user.name || null);
      }
      // Reset last fetched user on error so we can retry
      lastFetchedUserIdRef.current = null;
    } finally {
      setIsProfileLoading(false);
      isFetchingProfileRef.current = false;
    }
  }, [user, setCompanyName, organization]);

  // Call the fetch function once user is ready
  useEffect(() => {
    // Only run if the user is available, we haven't fetched yet, and we're not currently loading
    if (
      user?.id &&
      lastFetchedUserIdRef.current !== user.id &&
      !isProfileLoading &&
      !isFetchingProfileRef.current
    ) {
      fetchProfileData();
    }
  }, [user?.id, user?.email, fetchProfileData, isProfileLoading]);

  // Build companies array with same priority logic as DashboardLayout
  const companies = useMemo(() => {
    // Priority order for company name:
    // 1. Organization accountName or kf_enterprisename (from organization-info API)
    // 2. ProfileContext companyName (from business profile API)
    // 3. User's MSAL name
    // 4. Fallback to "Untitled Company"
    const orgCompanyName = organization?.kf_tradename || organization?.kf_enterprisename || (organization as any)?.name;
    const currentName = orgCompanyName || companyName || user?.name || "Untitled Company";

    if (user && user.id) {
      return [
        {
          id: user.id,
          name: currentName,
          role: "Viewer",
          isActive: activeCompany === user.id,
          badge: "Current",
        },
      ];
    }
    return [
      {
        id: "1",
        name: "FutureTech LLC",
        role: "Owner",
        isActive: true,
        badge: "Primary",
      },
    ];
  }, [user, activeCompany, companyName, organization]);

  // Check if the active company needs to be set after user loads
  useEffect(() => {
    if (user && user.id && activeCompany === "1") {
      setActiveCompany(user.id);
    }
  }, [user, activeCompany]);

  // Real handlers (same as DashboardLayout)
  const handleCompanyChange = (companyId: string) => {
    setActiveCompany(companyId);
  };

  const handleAddNewEnterprise = () => {
    navigate("/dashboard/onboarding");
    setActiveSection("onboarding");
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onboardingComplete={onboardingComplete}
          companies={companies}
          onCompanyChange={handleCompanyChange}
          onAddNewEnterprise={handleAddNewEnterprise}
          isLoggedIn={isLoggedIn}
          hideFormsMenu={false}
        />
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <div className="transition-all duration-300">
            <div className="min-h-screen">{children}</div>
          </div>
          <Footer isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </div>
  );
};

// Main export wraps with providers (same as DashboardLayout)
export const FormLayoutWrapper: React.FC<FormLayoutWrapperProps> = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <FormLayoutContent {...props} />
      </ProfileProvider>
    </QueryClientProvider>
  );
};
