import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  FileText,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Globe,
  Download,
  ArrowRight,
  Building,
} from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useProductDetails } from "../../hooks/useProductDetails";
import { getMarketplaceConfig } from "../../utils/marketplaceConfig";

interface MarketplaceDetailsPageProps {
  marketplaceType: "courses" | "financial" | "business-services" | "knowledge-hub";
  bookmarkedItems?: string[];
  onToggleBookmark?: (itemId: string) => void;
  onAddToComparison?: (item: any) => void;
}

const MarketplaceDetailsPage: React.FC<MarketplaceDetailsPageProps> = ({
  marketplaceType,
}) => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { item, loading, error } = useProductDetails({
    itemId,
    marketplaceType,
  });

  const config = getMarketplaceConfig(marketplaceType);

  const handlePrimaryAction = () => {
    if (marketplaceType === "courses") {
      navigate("/coming-soon");
      return;
    }

    // Check if this is a DFSA financial services application
    const isDFSAService = marketplaceType === 'financial' ||
                         marketplaceType === 'business-services' || // Include business-services marketplace
                         item?.id === 'mock-1' || // New Authorisation Services
                         item?.id === 'mock-2' || // New Authorisation: AMI
                         item?.title?.toLowerCase().includes('dfsa') ||
                         item?.title?.toLowerCase().includes('authorisation') ||
                         item?.title?.toLowerCase().includes('authorization') ||
                         item?.title?.toLowerCase().includes('financial services') ||
                         item?.title?.toLowerCase().includes('licence') ||
                         item?.title?.toLowerCase().includes('license') ||
                         item?.description?.toLowerCase().includes('dfsa') ||
                         item?.description?.toLowerCase().includes('financial services') ||
                         item?.description?.toLowerCase().includes('authorisation') ||
                         item?.description?.toLowerCase().includes('authorization');

    // Debug logging
    console.log('MarketplaceDetailsPage - Service clicked:', {
      id: item?.id,
      title: item?.title,
      marketplaceType: marketplaceType,
      isDFSAService: isDFSAService,
      description: item?.description?.substring(0, 100)
    });

    // For DFSA services, navigate to financial services application form
    if (isDFSAService) {
      console.log('Navigating to DFSA form');
      navigate('/forms/financial-services-application');
      return;
    }

    // For non-DFSA services, redirect to coming soon page
    console.log('Navigating to coming soon');
    navigate('/coming-soon');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-dfsa-gold rounded-full animate-spin"></div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Service Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The service you are looking for does not exist or has been moved.
          </p>
          <button
            onClick={() => navigate(config.route)}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to {config.itemNamePlural}
          </button>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  // Map item data to the layout fields
  const tags = item.tags || [item.category, item.serviceType].filter(Boolean);
  const processingTime = item.processingTime || "N/A";
  const category = item.category || item.serviceCategory || "General";
  const benefits = item.details?.benefits || item.keyHighlights || [];
  const processSteps = item.applicationProcess || item.details?.processSteps || [];
  const requirements = item.requiredDocuments || item.details?.requirements || [];
  const longDescription = item.details?.longDescription || item.description;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <main className="flex-grow pt-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-dark to-primary text-white py-16 relative overflow-hidden">
          <img
            src="/dfsa_hero.png"
            alt="Service Background"
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
          />
          <div className="container mx-auto px-4 relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to {config.itemNamePlural}
            </button>
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-medium text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                {item.title}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mb-8 leading-relaxed">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-6 text-sm font-medium text-white/90">
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                  <Clock size={18} className="mr-2 text-dfsa-gold" />
                  Processing Time: {processingTime}
                </div>
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                  <Briefcase size={18} className="mr-2 text-dfsa-gold" />
                  Category: {category}
                </div>
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                  <Building size={18} className="mr-2 text-dfsa-gold" />
                  Provider: {item.provider?.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 -mt-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-all hover:shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="mr-3 text-primary" />
                  Service Overview
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                  {longDescription}
                </p>
              </div>

              {/* Benefits Section */}
              {benefits.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-all hover:shadow-md">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <ShieldCheck className="mr-3 text-dfsa-gold" />
                    Key Benefits
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((benefit: string, idx: number) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle
                          size={20}
                          className="text-green-500 mr-3 mt-1 flex-shrink-0"
                        />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process Steps */}
              {processSteps.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-all hover:shadow-md">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                    <Globe className="mr-3 text-primary" />
                    Application Process
                  </h2>

                  {processSteps.length === 1 ? (
                    // Single step - clean simple layout
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {processSteps[0].description || processSteps[0]}
                      </p>
                    </div>
                  ) : (
                    // Multiple steps - timeline layout
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                      <div className="space-y-8">
                        {processSteps.map((step: any, idx: number) => (
                          <div key={idx} className="relative flex items-start pl-12">
                            <div className="absolute left-0 top-1 w-8 h-8 bg-white border-2 border-primary rounded-full flex items-center justify-center z-10 font-bold text-primary text-sm">
                              {idx + 1}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {step.title || `Step ${idx + 1}`}
                              </h3>
                              <p className="text-gray-600">{step.description || step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Ready to Apply?
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Ensure you have all required documents ready before starting your application.
                </p>
                <button
                  onClick={handlePrimaryAction}
                  className="w-full bg-dfsa-gold text-white font-bold py-3 px-4 rounded-xl hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-4 flex items-center justify-center"
                >
                  {config.primaryCTA} <ChevronRight size={18} className="ml-2" />
                </button>
                <button className="w-full bg-white text-primary font-bold py-3 px-4 rounded-xl border border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-center">
                  <Download size={18} className="mr-2" /> Download Guide
                </button>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <FileText size={16} className="text-primary" />
                    </div>
                    Required Documents
                  </h4>
                  {requirements.length > 0 ? (
                    <div className="space-y-2">
                      {requirements.map((req: string, idx: number) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-primary/20 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle size={12} className="text-primary" />
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed flex-1">
                              {req}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-center">
                      <p className="text-sm text-gray-500">
                        Check the application guide for document requirements
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-primary mb-2">Need Assistance?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is available to guide you through the process.
                </p>
                <a href="#" className="text-primary font-medium text-sm hover:underline flex items-center">
                  Contact Support <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default MarketplaceDetailsPage;
