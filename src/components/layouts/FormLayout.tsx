import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { Sidebar } from "../Sidebar";

interface Company {
  id: string;
  name: string;
  role: string;
  isActive?: boolean;
  badge?: string;
}

interface FormLayoutProps {
  children: React.ReactNode;
  "data-id"?: string;
  isLoggedIn?: boolean;
  showSidebar?: boolean;
  onboardingComplete?: boolean;
  companies?: Company[];
  onCompanyChange?: (companyId: string) => void;
  onAddNewEnterprise?: () => void;
}

// Internal component that uses the sidebar context (only when showSidebar is true)
const FormLayoutWithSidebar: React.FC<FormLayoutProps> = ({
  children,
  "data-id": dataId,
  isLoggedIn = false,
  onboardingComplete = true,
  companies = [
    {
      id: "1",
      name: "FutureTech LLC",
      role: "Owner",
      isActive: true,
      badge: "Primary",
    },
  ],
  onCompanyChange,
  onAddNewEnterprise,
}) => {
  const location = useLocation();
  const { isOpen, setIsOpen } = useSidebar();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeCompany, setActiveCompany] = useState("1");
  const prevPathnameRef = useRef(location.pathname);

  useEffect(() => {
    const section = location.pathname.split("/")[2] || "dashboard";
    setActiveSection(section);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen && location.pathname !== prevPathnameRef.current) {
      setIsOpen(false);
    }
    prevPathnameRef.current = location.pathname;
  }, [isOpen, location.pathname, setIsOpen]);

  const handleCompanyChange = (companyId: string) => {
    setActiveCompany(companyId);
    onCompanyChange?.(companyId);
  };

  return (
    <div className="flex-1 flex flex-col" data-id={dataId}>
      <Header data-id={`${dataId}-header`} />
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onboardingComplete={true}
          companies={companies}
          onCompanyChange={handleCompanyChange}
          onAddNewEnterprise={onAddNewEnterprise}
          isLoggedIn={isLoggedIn}
          data-id={`${dataId}-sidebar`}
        />
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <div className="transition-all duration-300">
            <div className="min-h-screen">{children}</div>
          </div>
          <Footer isLoggedIn={isLoggedIn} data-id={`${dataId}-footer`} />
        </div>
      </div>
    </div>
  );
};

// Simple layout without sidebar
const FormLayoutSimple: React.FC<FormLayoutProps> = ({
  children,
  "data-id": dataId,
  isLoggedIn = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50" data-id={dataId}>
      <Header data-id={`${dataId}-header`} />
      <main className="flex-grow">{children}</main>
      <Footer isLoggedIn={isLoggedIn} data-id={`${dataId}-footer`} />
    </div>
  );
};

// Main export that wraps with SidebarProvider when sidebar is enabled
export function FormLayout(props: FormLayoutProps) {
  if (props.showSidebar) {
    return (
      <SidebarProvider>
        <FormLayoutWithSidebar {...props} />
      </SidebarProvider>
    );
  }

  return <FormLayoutSimple {...props} />;
}
