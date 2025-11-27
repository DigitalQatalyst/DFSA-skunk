import {
  Sidebar,
  HomeIcon,
  ChevronRightIcon,
  LifeBuoyIcon,
  ChevronLeftIcon,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Footer } from "../../../components/Footer";
import { Header } from "../../../components/Header";
import { AuthProvider } from "../../../context/AuthProvider";
import {
  PageLayout,
  PageSection,
  SectionHeader,
  PrimaryButton,
  SectionContent,
} from "../../../components/PageLayout";
import ContactSupportTab from "../../../components/support/ContactSupportTab";
import DocumentationTab from "../../../components/support/DocumentationTab";
import FAQsTab from "../../../components/support/FAQsTab";
import { BurgerMenuButton } from "../../../components/Sidebar";
import { Can } from "../../../components/RBAC/Can";

export default function SupportPage({
  setIsOpen,
  isLoggedIn,
}: {
  setIsOpen?: (isOpen: boolean) => void;
  isLoggedIn?: boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeResourceTab, setActiveResourceTab] = useState("faqs");
  const [activeContactTab, setActiveContactTab] = useState("contact");
  const [showTabControls, setShowTabControls] = useState(false);
  const resourceTabsRef = useRef<HTMLDivElement>(null);
  const contactTabsRef = useRef<HTMLDivElement>(null);
  // Check if tabs container needs scroll controls
  const checkTabsOverflow = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const { scrollWidth, clientWidth } = ref.current;
      return scrollWidth > clientWidth;
    }
    return false;
  };
  // Handle window resize to check if tab controls should be shown
  useEffect(() => {
    const handleResize = () => {
      setShowTabControls(
        checkTabsOverflow(resourceTabsRef) || checkTabsOverflow(contactTabsRef)
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Scroll tabs horizontally
  const scrollTabs = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    if (ref.current) {
      const scrollAmount = 150;
      const scrollPosition =
        direction === "left"
          ? ref.current.scrollLeft - scrollAmount
          : ref.current.scrollLeft + scrollAmount;
      ref.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };
  // Create sticky tab state for mobile view
  const [isSticky, setIsSticky] = useState(false);
  // Smooth scroll helper to contact section
  const scrollToContact = () => {
    const el = document.getElementById("contact-support");
    // make the contact tab the active contact view so breadcrumb reflects it
    setActiveContactTab("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // fallback to hash navigation
      window.location.hash = "contact-support";
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      const tabsSection = document.getElementById("resource-tabs-section");
      if (tabsSection) {
        const tabsSectionTop = tabsSection.getBoundingClientRect().top;
        setIsSticky(tabsSectionTop <= 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex flex-1 px-7">
          <div className="flex-1 w-full">
            {/* Breadcrumbs */}

            {/* Sticky mobile tab navigation */}
            {isSticky && (
              <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm md:hidden">
                <div className="px-4 py-2 flex items-center justify-between">
                  <div className="font-medium text-gray-900">
                    Support Resources
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setActiveResourceTab("faqs")}
                      className={`px-3 py-1 text-sm rounded-full ${
                        activeResourceTab === "faqs"
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      FAQs
                    </button>
                    <button
                      onClick={() => setActiveResourceTab("documentation")}
                      className={`px-3 py-1 text-sm rounded-full ${
                        activeResourceTab === "documentation"
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      Docs
                    </button>
                  </div>
                </div>
              </div>
            )}
            <PageLayout
              title="Support"
              breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Support", current: true },
              ]}
              setIsOpen={setIsOpen}
              isLoggedIn={isLoggedIn}
            >
              {/* Support Resources Section */}
              <Can I="read" a="user-dashboard">
                <PageSection>
                  <SectionHeader
                    title="Support Resources"
                    description="Access frequently asked questions and documentation to help you get the most out of our platform."
                    actions={
                      <Can I="read" a="user-dashboard" passThrough>
                        {(allowed) => (
                          <PrimaryButton
                            onClick={() => scrollToContact()}
                            className="hidden sm:flex"
                            disabled={!allowed}
                          >
                            <LifeBuoyIcon className="h-4 w-4 mr-2" />
                            Contact Support
                          </PrimaryButton>
                        )}
                      </Can>
                    }
                    headerClassName="border-b border-gray-200 p-6 flex justify-between items-center"
                    titleClassName="text-lg font-semibold text-gray-800 m-0"
                  />
                  <SectionContent className="p-0">
                  {/* Tabs */}
                  <div
                    className="border-b border-gray-200 relative"
                    id="resource-tabs-section"
                  >
                    <div className="px-4 sm:px-6 pt-4 flex items-center">
                      {showTabControls && (
                        <button
                          onClick={() => scrollTabs(resourceTabsRef, "left")}
                          className="md:hidden flex-shrink-0 h-8 w-8 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center mr-2"
                          aria-label="Scroll tabs left"
                        >
                          <ChevronLeftIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                      <div
                        ref={resourceTabsRef}
                        className="flex space-x-6 overflow-x-auto"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <style jsx>{`
                          div::-webkit-scrollbar {
                            display: none;
                          }
                        `}</style>
                        <button
                          onClick={() => setActiveResourceTab("faqs")}
                          className={`relative flex items-center py-4 px-1 border-b-2 whitespace-nowrap ${
                            activeResourceTab === "faqs"
                              ? "border-blue-600 text-blue-600 font-medium"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <span className="text-sm sm:text-base">
                            Frequently Asked Questions
                          </span>
                        </button>
                        <button
  disabled
  className="relative flex items-center py-4 px-1 border-b-2 border-transparent whitespace-nowrap cursor-not-allowed"
>
  <span className="text-sm sm:text-base font-semibold text-gray-400 flex items-center gap-2">
    Documentation
    <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
      Coming Soon
    </span>
  </span>
</button>

                      </div>
                      {showTabControls && (
                        <button
                          onClick={() => scrollTabs(resourceTabsRef, "right")}
                          className="md:hidden flex-shrink-0 h-8 w-8 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center ml-2"
                          aria-label="Scroll tabs right"
                        >
                          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Tab Content */}
                  <div className="p-4 sm:p-6">
                    {activeResourceTab === "faqs" && <FAQsTab />}
                    {activeResourceTab === "documentation" && (
                      <DocumentationTab />
                    )}
                  </div>

                    <Can I="read" a="user-dashboard" passThrough>
                      {(allowed) => (
                        <div className="md:hidden sticky bottom-0 bg-white border-t border-gray-200 p-4">
                          <a
                            href="/documentation"
                            className={`flex items-center justify-center w-full py-2 px-4 border border-blue-600 rounded-md font-medium ${
                              allowed
                                ? "text-blue-600 hover:bg-blue-50"
                                : "text-gray-400 cursor-not-allowed opacity-50"
                            }`}
                            onClick={(e) => {
                              if (!allowed) {
                                e.preventDefault();
                              }
                            }}
                          >
                            View All FAQs & Documentation
                            <ChevronRightIcon className="ml-1 h-4 w-4" />
                          </a>
                        </div>
                      )}
                    </Can>
                  </SectionContent>
                </PageSection>
              </Can>
              {/* Contact & Support Tickets Section */}
              <Can I="read" a="user-dashboard">
                <PageSection id="contact-support">
                <SectionHeader
                  title="Contact & Support"
                  description="Get in touch with our support team or view your support ticket history."
                  headerClassName="border-b border-gray-200 p-6 flex justify-between items-center"
                  titleClassName="text-lg font-semibold text-gray-800 m-0"
                />
                <SectionContent className="p-0">
                  {/* Tabs */}
                  <div className="border-b border-gray-200 relative">
                    <div className="px-4 sm:px-6 pt-4 flex items-center">
                      {showTabControls && (
                        <button
                          onClick={() => scrollTabs(contactTabsRef, "left")}
                          className="md:hidden flex-shrink-0 h-8 w-8 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center mr-2"
                          aria-label="Scroll tabs left"
                        >
                          <ChevronLeftIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                      <div
                        ref={contactTabsRef}
                        className="flex space-x-6 overflow-x-auto"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <style jsx>{`
                          div::-webkit-scrollbar {
                            display: none;
                          }
                        `}</style>
                        <button
                          onClick={() => setActiveContactTab("contact")}
                          className={`relative flex items-center py-4 px-1 border-b-2 whitespace-nowrap ${
                            activeContactTab === "contact"
                              ? "border-blue-600 text-blue-600 font-medium"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <span className="text-sm sm:text-base">
                            Submit a Request
                          </span>
                        </button>
                        <button
                          disabled
                          className="relative flex items-center py-4 px-1 border-b-2 whitespace-nowrap border-transparent text-gray-400 cursor-not-allowed"
                          aria-label="Ticket History - Coming Soon"
                          title="Ticket History feature coming soon"
                        >
                          <span className="text-sm sm:text-base">
                            Ticket History
                          </span>
                          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Coming Soon
                          </span>
                        </button>
                      </div>
                      {showTabControls && (
                        <button
                          onClick={() => scrollTabs(contactTabsRef, "right")}
                          className="md:hidden flex-shrink-0 h-8 w-8 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center ml-2"
                          aria-label="Scroll tabs right"
                        >
                          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Tab Content */}
                  <div className="p-4 sm:p-6">
                    {activeContactTab === "contact" && <ContactSupportTab />}
                    {activeContactTab === "history" && (
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <LifeBuoyIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Ticket History Coming Soon
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                          We're working on bringing you a comprehensive ticket history feature. 
                          You'll be able to view and track all your support requests in one place.
                        </p>
                      </div>
                    )}
                  </div>
                </SectionContent>
              </PageSection>
              </Can>
              {/* Mobile: Contact Support button */}
              <Can I="read" a="user-dashboard" passThrough>
                {(allowed) => (
                  <div className="md:hidden sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-6">
                    <PrimaryButton
                      onClick={() => scrollToContact()}
                      className="w-full justify-center"
                      disabled={!allowed}
                    >
                      <LifeBuoyIcon className="h-4 w-4 mr-2" />
                      Contact Support
                    </PrimaryButton>
                  </div>
                )}
              </Can>
            </PageLayout>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
