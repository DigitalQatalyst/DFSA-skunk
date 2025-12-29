import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { Sidebar } from "../../components/Sidebar";
import { Header, useAuth } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ProfileProvider, useProfile } from "./context/ProfileContext";
import { fetchCombinedProfileData } from "../../services/DataverseService";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";
import { useOrganizationInfo } from "../../hooks/useOrganizationInfo";
import { isDemoModeEnabled, getDemoUser } from "../../utils/demoAuthUtils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onboardingComplete: boolean;
  setOnboardingComplete: (onboardingComplete: boolean) => void;
  isLoggedIn: boolean;
  hideFormsMenu?: boolean;
}

// This component now contains the logic and renders the layout
const DashboardLayoutContent: React.FC<DashboardLayoutProps> = ({
  children,
  onboardingComplete,
  setOnboardingComplete,
  isLoggedIn,
  hideFormsMenu = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, setIsOpen } = useSidebar();
  const [activeSection, setActiveSection] = useState("dashboard");
  const { user } = useAuth();
  const { organization } = useOrganizationInfo(); // Get organization info for company name

  // Use the new context state management (client-side only)
  const { companyName, setCompanyName } = useProfile();

  // Local state for profile loading (temporary until BusinessProfile uses React Query)
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Initialize activeCompany with the user's ID if available
  // Fallback to "1" is used if user data isn't loaded yet.
  const [activeCompany, setActiveCompany] = useState(user?.id || "1");
  const prevPathnameRef = useRef(location.pathname);

  // Use refs to prevent infinite loops
  const lastFetchedUserIdRef = useRef<string | null>(null);
  const isFetchingProfileRef = useRef(false);

  // Global logout invalidation - clear all profile cache when user logs out
  useEffect(() => {
    if (!user || !user.id) {
      // User is logged out, clear all profile queries and reset state
      queryClient.clear();
      setCompanyName(null);
      console.log(
        "🔄 [DASHBOARD LAYOUT] User logged out, cleared all profile cache"
      );
    }
  }, [user?.id, setCompanyName]);

  const fetchProfileData = useCallback(async () => {
    // In demo mode, set mock profile data directly in cache
    if (isDemoModeEnabled()) {
      const demoUser = getDemoUser();
      const mockProfileData = {
        kf_tradename: "Demo Company",
        kf_companyname: "Demo Company Ltd",
        kf_foundername: "Demo Founder",
        kf_emailaddress: demoUser.email,
        department: "growth",
      };

      console.log("🎭 [DEMO MODE] Setting mock profile data in cache");
      queryClient.setQueryData(["profile", "business", demoUser.id], mockProfileData);
      setCompanyName("Demo Company");
      return;
    }

    if (!user || !user.email || !user.id) {
      console.warn(
        "⚠️ [DASHBOARD LAYOUT] User data is not yet available. Skipping profile fetch."
      );
      return;
    }

    // Prevent duplicate fetches for the same user
    if (
      lastFetchedUserIdRef.current === user.id &&
      isFetchingProfileRef.current
    ) {
      console.log(
        "🔍 [DASHBOARD LAYOUT] Already fetching profile for user:",
        user.id
      );
      return;
    }

    // Mark as fetching
    isFetchingProfileRef.current = true;
    lastFetchedUserIdRef.current = user.id;
    setIsProfileLoading(true);

    try {
      console.log("🔍 [DASHBOARD LAYOUT] Fetching combined profile data for:", {
        email: user.email,
        id: user.id,
      });
      const response = await fetchCombinedProfileData(user.email, user.id);
      const apiProfile = response;
      console.log("✅ [DASHBOARD LAYOUT] API profile received:", apiProfile);

      // Only set company name if we have it from profile AND organization data is not available
      // Organization data takes precedence, so we don't want to overwrite it with "Untitled Company"
      const profileCompanyName = (apiProfile as any)?.kf_tradename;
      console.log(profileCompanyName)
      console.log("Profile Company Name")
      if (profileCompanyName) {
        setCompanyName(profileCompanyName);
      } else {
        // Only set fallback if organization data is not available
        // Check if organization has company name data
        const hasOrgCompanyName = organization?.accountName || organization?.kf_enterprisename || (organization as any)?.name;
        if (!hasOrgCompanyName) {
          // No organization data and no profile company name - use user name as fallback
          // Don't set "Untitled Company" here - let the companies useMemo handle the final fallback
          setCompanyName(user.name || null);
        }
        // If organization data exists, don't overwrite companyName - let organization data take precedence
      }

      // Store in React Query cache for Profile module to consume
      queryClient.setQueryData(["profile", "business", user.id], apiProfile);
    } catch (error) {
      console.error(
        "❌ [DASHBOARD LAYOUT] Error fetching business profile data:",
        error
      );
      // Only set fallback if organization data is not available
      const hasOrgCompanyName = organization?.accountName || organization?.kf_enterprisename || (organization as any)?.name;
      if (!hasOrgCompanyName) {
        // No organization data - use user name as fallback
        // Don't set "Untitled Company" here - let the companies useMemo handle the final fallback
        setCompanyName(user.name || null);
      }
      // Reset last fetched user on error so we can retry
      lastFetchedUserIdRef.current = null;
    } finally {
      setIsProfileLoading(false);
      isFetchingProfileRef.current = false;
    }
  }, [user, setCompanyName, organization]);

  // CALL THE FETCH FUNCTION ONCE USER IS READY
  useEffect(() => {
    // In demo mode, always call fetchProfileData
    if (isDemoModeEnabled()) {
      fetchProfileData();
      return;
    }

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

  // Only close sidebar on mobile when navigating (not on desktop)
  useEffect(() => {
    // Check if viewport is mobile/tablet (< 1024px)
    const isMobile = window.innerWidth < 1024;

    if (isMobile && isOpen && location.pathname !== prevPathnameRef.current) {
      setIsOpen(false);
    }
    prevPathnameRef.current = location.pathname;
  }, [isOpen, location.pathname, setIsOpen]);

  const companies = useMemo(() => {
    // Priority order for company name:
    // 1. Organization accountName or kf_enterprisename (from organization-info API)
    // 2. ProfileContext companyName (from business profile API)
    // 3. User's MSAL name
    // 4. Fallback to "Untitled Company"
    const orgCompanyName = organization?.kf_tradename || organization?.kf_enterprisename || (organization as any)?.name;
    const currentName = orgCompanyName || companyName || user?.name || "Untitled Company";
    
    // Debug logging to help troubleshoot company name resolution
    if (process.env.NODE_ENV === 'development') {
      console.log('[DashboardLayout] Company name resolution:', {
        orgAccountName: organization?.accountName,
        orgEnterpriseName: organization?.kf_enterprisename,
        orgName: (organization as any)?.name,
        profileCompanyName: companyName,
        userName: user?.name,
        resolvedName: currentName,
      });
    }

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
  // This handles the transition from mock ID "1" to the real user.id
  useEffect(() => {
    if (user && user.id && activeCompany === "1") {
      setActiveCompany(user.id);
    }
  }, [user, activeCompany]);

  const handleCompanyChange = (companyId: string) => {
    setActiveCompany(companyId);
  };

  const handleAddNewEnterprise = () => {
    setOnboardingComplete(false);
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
          hideFormsMenu={hideFormsMenu}
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

// The main export wraps the content with the provider
const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <ProfileProvider>
          <DashboardLayoutContent {...props} />
        </ProfileProvider>
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default DashboardLayout;
