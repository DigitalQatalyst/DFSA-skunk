import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import HeroSection from './HeroSection';
import DFSADecisionAuthoritySection from './DFSADecisionAuthoritySection';
import LicenseCategoriesSection from './LicenseCategoriesSection';
import AuthorizationJourneySection from './AuthorizationJourneySection';
import KeyPersonnelSection from './KeyPersonnelSection';
import ComplianceServicesSection from './ComplianceServicesSection';
import FAQSection from './FAQSection';
import ResourceLibrarySection from './ResourceLibrarySection';
import ProofAndTrust from './ProofAndTrust';
import CallToAction from './CallToAction';

const HomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-primary-900 to-dfsa-gold flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-bold">
            Loading DFSA Platform
          </h2>
          <p className="text-gray-200 mt-2">
            Expert Regulatory Services for the DIFC
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <main className="flex-grow">
        <HeroSection />
        <DFSADecisionAuthoritySection />
        <LicenseCategoriesSection />
        <AuthorizationJourneySection />
        <KeyPersonnelSection />
        <ComplianceServicesSection />
        <FAQSection />
        <ResourceLibrarySection />
        {/* <ProofAndTrust /> */}
        <CallToAction />
      </main>
      <Footer isLoggedIn={false} />
      {/* <KhalifaFundAttribution /> */}
    </div>
  );
};

export default HomePage;
