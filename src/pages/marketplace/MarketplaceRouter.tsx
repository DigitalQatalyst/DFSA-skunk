import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { MarketplacePage } from "../../components/marketplace/MarketplacePage";
import MarketplaceDetailsPage from "./MarketplaceDetailsPage";
import { EventDetailsPage } from "../../components/marketplace/EventDetailsPage";
import { FinancialServicesPage } from "./financial-services/FinancialServicesPage";
import { DollarSign, Briefcase, Users, Calendar, BookOpen } from "lucide-react";
import { getMarketplaceConfig } from "../../utils/marketplaceConfig";

// Define types for promo cards
interface PromoCard {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  path: string;
  gradientFrom: string;
  gradientTo: string;
}

// Define marketplace types
type MarketplaceType =
  | "courses"
  | "financial"
  | "products"
  | "events"
  | "business-services"
  | "knowledge-hub";

// Centralized promo card definitions
const promoCardDefinitions: Record<string, PromoCard> = {
  finance: {
    id: "finance-promo",
    title: "Explore funding options",
    description:
      "Find financial opportunities and resources to grow your business.",
    icon: <DollarSign size={24} className="text-white" />,
    path: "/marketplace/financial",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-700",
  },
  advisory: {
    id: "advisory-promo",
    title: "Need expert advice?",
    description: "Connect with industry experts and get personalized guidance.",
    icon: <Briefcase size={24} className="text-white" />,
    path: "/marketplace/business-services",
    gradientFrom: "from-purple-600",
    gradientTo: "to-pink-500",
  },
  courses: {
    id: "courses-promo",
    title: "Enhance your skills",
    description: "Discover courses to enhance your business knowledge.",
    icon: <Calendar size={24} className="text-white" />,
    path: "/marketplace/courses",
    gradientFrom: "from-green-500",
    gradientTo: "to-teal-400",
  },
  events: {
    id: "events-promo",
    title: "Attend business events",
    description: "Network and learn at upcoming events and workshops.",
    icon: <Users size={24} className="text-white" />,
    path: "/marketplace/events",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500",
  },
  knowledge: {
    id: "knowledge-promo",
    title: "Expand your knowledge",
    description: "Access resources to develop your business capabilities.",
    icon: <BookOpen size={24} className="text-white" />,
    path: "/marketplace/knowledge-hub",
    gradientFrom: "from-green-500",
    gradientTo: "to-teal-400",
  },
};

// Promo cards for each marketplace type
const marketplacePromoCards: Record<MarketplaceType, PromoCard[]> = {
  courses: [promoCardDefinitions.advisory],
  financial: [
    promoCardDefinitions.events,
    promoCardDefinitions.advisory,
  ],
  events: [],
  "business-services": [],
  "knowledge-hub": [],
  "products": [],
};

export const MarketplaceRouter: React.FC = () => {
  // Define marketplace configurations with fallback
  const marketplaceConfigs: Record<
    MarketplaceType,
    { title: string; description: string }
  > = {
    courses: getMarketplaceConfig("courses") ?? {
      title: "Courses Marketplace",
      description: "Explore educational courses.",
    },
    financial: getMarketplaceConfig("financial") ?? {
      title: "Financial Services",
      description: "Discover financial resources.",
    },
    events: getMarketplaceConfig("events") ?? {
      title: "Events Marketplace",
      description: "Find upcoming events.",
    },
    "business-services": getMarketplaceConfig("business-services") ?? {
      title: "Business Services Hub",
      description: "Access professional services to support and grow your business.",
    },
    "knowledge-hub": getMarketplaceConfig("knowledge-hub") ?? {
      title: "Knowledge Hub",
      description: "Expand your business knowledge.",
    },
    "products": {
      title: "Financial Services Activities",
      description: "Browse DFSA-regulated financial services activities by regime and pathway.",
    },
  };

  // State for bookmarked items
  const [bookmarkedItems, setBookmarkedItems] = useState<
    Record<MarketplaceType, string[]>
  >({
    courses: [],
    financial: [],
    'products': [],
    events: [],
    "business-services": [],
    "knowledge-hub": [],
  });

  // Toggle bookmark for an item
  const handleToggleBookmark = (
    marketplaceType: MarketplaceType,
    itemId: string
  ) => {
    setBookmarkedItems((prev) => {
      const currentItems = prev[marketplaceType] || [];
      const updatedItems = currentItems.includes(itemId)
        ? currentItems.filter((id) => id !== itemId)
        : [...currentItems, itemId];
      return {
        ...prev,
        [marketplaceType]: updatedItems,
      };
    });
  };

  // Dynamic route rendering
  const marketplaceRoutes: MarketplaceType[] = [
    "courses",
    "financial",
    "products",
    "events",
    "business-services",
    "knowledge-hub",
  ];

  return (
    <Routes>
      {/* Financial Services - Custom page */}
      <Route
        path="/products"
        element={<FinancialServicesPage />}
      />

      {/* Other marketplace routes */}
      {marketplaceRoutes
        .filter((type) => type !== "products")
        .map((type) => (
          <React.Fragment key={type}>
            <Route
              path={`/${type}`}
              element={
                <MarketplacePage
                  marketplaceType={type}
                  title={marketplaceConfigs[type].title}
                  description={marketplaceConfigs[type].description}
                  promoCards={marketplacePromoCards[type]}
                />
              }
            />
            <Route
              path={`/${type}/:itemId`}
              element={
                type === "events" ? (
                  <EventDetailsPage />
                ) : (
                  <MarketplaceDetailsPage
                    marketplaceType={type}
                    bookmarkedItems={bookmarkedItems[type]}
                    onToggleBookmark={(itemId) =>
                      handleToggleBookmark(type, itemId)
                    }
                  />
                )
              }
            />
          </React.Fragment>
        ))}
    </Routes>
  );
};
