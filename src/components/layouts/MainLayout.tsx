import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/AppSidebar";
import { useAuth } from "../../context/UnifiedAuthProvider";
import { Footer } from "../Footer";
import { PageSection, PageLayout, SectionContent } from "../PageLayout";
import { Header } from "../Header";
import { CommunitySidebar } from "../AppSidebar/CommunitySidebar";
interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
  hidePageLayout?: boolean;
  showSidebar?: boolean;
}

export function MainLayout({
  children,
  title,
  fullWidth = false,
  hidePageLayout = false,
  showSidebar = true,
}: MainLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  // Map routes to sidebar sections
  useEffect(() => {
    const routeMap: Record<string, string> = {
      "/": "dashboard",
      "/feed": "dashboard",
      "/communities": "profile",
      "/profile": "profile",
      "/messages": "documents",
      "/moderation": "reports",
      "/analytics": "reports",
      "/settings": "settings",
      "/activity": "requests",
    };
    const section = routeMap[location.pathname] || "dashboard";
    setActiveSection(section);
  }, [location.pathname]);

  // Handle section changes to navigate
  const handleSectionChange = (sectionId: string) => {
    const sectionRoutes: Record<string, string> = {
      feed: "/feed",
      communities: "/communities",
      messages: "/messages",
      moderation: "/moderation",
      analytics: "/analytics",
    };
    const route = sectionRoutes[sectionId];
    if (route) {
      navigate(route);
    }

    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
        showSidebarToggle={Boolean(user && showSidebar)}
      />
      {/* Main content area with sidebar */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Sidebar - Desktop: visible if showSidebar is true, Mobile: toggle */}
        {user && showSidebar && (
          <>
            {/* Mobile/Tablet backdrop */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <CommunitySidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              companyName="Community Platform"
            />
          </>
        )}

        {/* Content - adjusts based on sidebar presence */}
        <div
          className={`flex-1 flex flex-col overflow-y-auto w-full ${
            !showSidebar ? "w-full" : ""
          }`}
        >
          {hidePageLayout ? (
            <div
              className={`flex-1 ${
                fullWidth ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              } w-full`}
            >
              {children}
            </div>
          ) : (
            <PageLayout title={title}>
              <PageSection>
                <SectionContent>{children}</SectionContent>
              </PageSection>
            </PageLayout>
          )}
          <Footer isLoggedIn={true} />
        </div>
      </div>
    </div>
  );
}
