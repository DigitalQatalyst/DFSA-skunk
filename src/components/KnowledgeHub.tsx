import React, {
  useEffect,
  useState,
  useRef,
  createElement,
  Component,
} from "react";
import {
  Calendar,
  BookOpen,
  Newspaper,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Tag,
  FileText,
  Download,
  ExternalLink,
  Calculator,
  Loader,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { FadeInUpOnScroll, StaggeredFadeIn, useInView } from "./AnimationUtils";
import { KnowledgeHubCard } from "./marketplace/KnowledgeHubCard";
import EventRegistrationForm from "./EventRegistrationForm";
import { getSupabaseKnowledgeHub } from "../lib/supabase";
import { mockEvents } from "../utils/mockEvents";
import { CourseCardSkeleton } from "./SkeletonLoader";
interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  source?: string;
}
interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  imageUrl?: string;
  organizer?: string;
  description?: string;
  duration?: string;
  capacity?: string;
  agenda?: string[];
  speakers?: Array<{ name: string; title: string; imageUrl?: string; }>;
  benefits?: string[];
  // Facet properties for filtering
  deliveryMode?: string;
  costType?: string;
  language?: string;
  capability?: string[];
  businessStage?: string[];
  industry?: string[];
  requirements?: string[];
  galleryImages?: string[];
}
interface Resource {
  id: string;
  title: string;
  type: string;
  description: string;
  icon: React.ReactNode;
  downloadUrl?: string;
  fileSize?: string;
  downloadCount?: number;
  lastUpdated?: string;
  isExternal?: boolean;
  tags?: string[];
}
interface KnowledgeHubProps {
  graphqlEndpoint?: string;
}
// Add new interface for the registration form state
interface RegistrationFormState {
  isOpen: boolean;
  eventId: string | null;
}
// Define interface for tab items
interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}
// Update SegmentedTabs props interface
interface SegmentedTabsProps {
  tabs: TabItem[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}
// Mock data for fallback - keep the existing data
const newsItems2: NewsItem[] = [
  {
    id: "1",
    title: "Abu Dhabi Launches New SME Support Program",
    excerpt:
      "The Abu Dhabi government has launched a new program to support SMEs with access to funding and resources.",
    date: "May 15, 2023",
    category: "Government",
    source: "Abu Dhabi Times",
    imageUrl:
      "https://images.unsplash.com/photo-1534224039826-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MH",
  },
  {
    id: "2",
    title: "Tech Startups in Abu Dhabi See 40% Growth",
    excerpt:
      "Technology startups in Abu Dhabi have seen a 40% growth in the past year, according to a new report.",
    date: "April 28, 2023",
    category: "Technology",
    source: "TechNews Daily",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwa",
  },
  {
    id: "3",
    title: "New E-commerce Regulations to Boost Online Businesses",
    excerpt:
      "Abu Dhabi has introduced new e-commerce regulations aimed at boosting online businesses in the emirate.",
    date: "April 10, 2023",
    category: "Regulations",
    source: "Business Insider UAE",
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwa",
  },
  {
    id: "4",
    title: "Abu Dhabi Investment Fund Allocates AED 1 Billion for Startups",
    excerpt:
      "A new investment fund has been established to support innovative startups in key sectors.",
    date: "March 22, 2023",
    category: "Investment",
    source: "Financial Times UAE",
    imageUrl:
      "https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwa",
  },
  {
    id: "5",
    title: "Abu Dhabi Economic Vision 2030 Progress Report Released",
    excerpt:
      "The latest progress report shows significant advancements in key economic sectors.",
    date: "March 10, 2023",
    category: "Government",
    source: "Government News Network",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MH",
  },
  {
    id: "6",
    title: "New Digital Innovation Hub Opens in Abu Dhabi",
    excerpt:
      "A state-of-the-art innovation hub has opened to foster technology development and entrepreneurship",
    date: "February 28, 2023",
    category: "Technology",
    source: "Innovation Digest",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MH",
  },
];
export const events: Event[] = [
  {
    id: "1",
    title: "Abu Dhabi Business Forum 2024",
    date: "June 15-16, 2024",
    location: "Abu Dhabi National Exhibition Centre",
    type: "Conference",
    organizer: "Abu Dhabi Chamber of Commerce",
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "The Abu Dhabi Business Forum is the emirate's premier annual gathering for business leaders, entrepreneurs, and innovators. This two-day conference brings together over 2,000 attendees from across the region to explore emerging business opportunities, discuss economic trends, and forge strategic partnerships that drive growth in Abu Dhabi's dynamic business ecosystem.",
    duration: "2 Days (9:00 AM - 6:00 PM)",
    capacity: "2000+ attendees",
    agenda: [
      "Day 1, 9:00 AM - Opening Ceremony & Keynote: Future of Business in Abu Dhabi",
      "Day 1, 10:30 AM - Panel Discussion: Digital Transformation for SMEs",
      "Day 1, 12:00 PM - Networking Lunch & Exhibition",
      "Day 1, 2:00 PM - Breakout Sessions: Industry-Specific Opportunities",
      "Day 1, 4:00 PM - Investor Meetups & Pitch Sessions",
      "Day 2, 9:00 AM - Keynote: Sustainable Business Practices",
      "Day 2, 11:00 AM - Workshops: Export Readiness & Market Expansion",
      "Day 2, 1:00 PM - Closing Ceremony & Awards"
    ],
    speakers: [
      { name: "H.E. Ahmed Al Sayegh", title: "Minister of State, UAE", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" },
      { name: "Sara Johnson", title: "CEO, Innovation Hub", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400" },
      { name: "Dr. Mohammed Al-Fahim", title: "Chairman, ADCCI", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" }
    ],
    benefits: [
      "Network with 2000+ business leaders and decision-makers",
      "Access exclusive market insights and economic forecasts",
      "Participate in investor matchmaking sessions",
      "Explore partnership opportunities across diverse industries",
      "Receive certificate of attendance from ADCCI"
    ],
    requirements: [
      "Valid business registration or trade license",
      "Pre-registration required (limited capacity)",
      "Business formal attire recommended"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800"
    ],
    deliveryMode: "Onsite",
    costType: "Paid",
    language: "English",
    capability: ["Leadership", "Innovation", "Marketing"],
    businessStage: ["Growth", "Expansion"],
    industry: ["Technology", "Finance", "Retail"]
  },
  {
    id: "2",
    title: "Startup Pitch Competition 2024",
    date: "July 25, 2024",
    location: "Hub71, Abu Dhabi",
    type: "Competition",
    organizer: "Hub71",
    imageUrl:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "Compete for AED 500,000 in funding and gain access to Hub71's world-class ecosystem. This premier startup competition brings together the brightest innovators and investors for a day of inspiring pitches, networking, and mentorship opportunities.",
    duration: "Full Day (10:00 AM - 6:00 PM)",
    capacity: "20 competing startups, 300 attendees",
    agenda: [
      "10:00 AM - Opening Ceremony & Competition Guidelines",
      "10:30 AM - Round 1: First 10 Startup Pitches (5 mins each)",
      "12:30 PM - Networking Lunch with Investors",
      "2:00 PM - Round 2: Second 10 Startup Pitches",
      "4:00 PM - Finalist Announcements (Top 5)",
      "4:30 PM - Final Round: Finalist Pitches (10 mins each)",
      "5:30 PM - Winner Announcement & Prize Distribution"
    ],
    speakers: [
      { name: "Fatima Al-Nuaimi", title: "Managing Director, Hub71", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400" },
      { name: "David Thompson", title: "Partner, Sequoia Capital", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400" }
    ],
    benefits: [
      "AED 500,000 prize pool for winners",
      "Direct access to leading VCs and angel investors",
      "6 months of mentorship from industry experts",
      "Office space at Hub71 for top 3 startups",
      "Media coverage and PR exposure"
    ],
    requirements: [
      "Registered startup (max 3 years old)",
      "Pitch deck and business plan required",
      "Application deadline: July 10, 2024"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
    ],
    deliveryMode: "Onsite",
    costType: "Free",
    language: "English",
    capability: ["Innovation", "Financial Management "],
    businessStage: ["Ideation", "Launch"],
    industry: ["Technology", "Finance"]
  },
  {
    id: "3",
    title: "Digital Transformation Workshop for SMEs",
    date: "August 5, 2024",
    location: "Yas Creative Hub",
    type: "Workshop",
    organizer: "Digital Abu Dhabi",
    imageUrl:
      "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "Transform your business for the digital age! This hands-on workshop provides SMEs with practical tools and strategies to digitize operations, improve customer engagement, and drive growth through technology adoption.",
    duration: "Half Day (9:00 AM - 1:00 PM)",
    capacity: "50 participants",
    agenda: [
      "9:00 AM - Registration & Welcome Coffee",
      "9:30 AM - Digital Transformation Fundamentals",
      "10:30 AM - Cloud Solutions & E-commerce Platforms",
      "11:30 AM - Coffee Break & Networking",
      "12:00 PM - Hands-on Session: Building Your Digital Roadmap",
      "1:00 PM - Q&A and Closing"
    ],
    speakers: [
      { name: "Omar Khalid", title: "Digital Transformation Consultant", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" }
    ],
    benefits: [
      "Personalized digital transformation roadmap",
      "Access to SME-focused digital tools",
      "30-minute one-on-one consultation",
      "Workshop materials and templates",
      "Certificate of completion"
    ],
    requirements: [
      "SME owner or senior decision-maker",
      "Laptop required for hands-on exercises"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800"
    ],
    deliveryMode: "Hybrid",
    costType: "Free",
    language: "English",
    capability: ["Digital Transformation", "Innovation"],
    businessStage: ["Growth", "Optimization"],
    industry: ["Technology", "Retail"]
  },
  {
    id: "4",
    title: "Export Market Opportunities Seminar",
    date: "September 10, 2024",
    location: "ADGM, Al Maryah Island",
    type: "Seminar",
    organizer: "Abu Dhabi Export Office",
    imageUrl:
      "https://images.unsplash.com/photo-1559223607-a43f990c095d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "Unlock global markets for your UAE business! Learn about export regulations, financing options, market entry strategies, and success stories from businesses that have successfully expanded internationally.",
    duration: "3 hours (2:00 PM - 5:00 PM)",
    capacity: "150 attendees",
    agenda: [
      "2:00 PM - Welcome & Introduction to Export Opportunities",
      "2:30 PM - Key Markets: Africa, Asia, and Europe",
      "3:15 PM - Export Financing & Government Support Programs",
      "3:45 PM - Coffee Break",
      "4:00 PM - Case Studies: Successful UAE Exporters",
      "4:30 PM - Q&A and Networking"
    ],
    speakers: [
      { name: "Rashid Al-Mansoori", title: "Director, Abu Dhabi Export Office", imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400" }
    ],
    benefits: [
      "Market intelligence reports for target countries",
      "Export readiness assessment tool",
      "Access to export financing programs",
      "One-on-one export counseling sessions"
    ],
    requirements: [
      "Registered business in UAE",
      "Interest in international expansion"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800"
    ],
    deliveryMode: "Online",
    costType: "Free",
    language: "English",
    capability: ["Operations", "Marketing"],
    businessStage: ["Expansion"],
    industry: ["Manufacturing", "Retail"]
  },
  {
    id: "5",
    title: "Global Trade & Investment Summit 2024",
    date: "October 3-5, 2024",
    location: "Etihad Towers Conference Centre",
    type: "Conference",
    organizer: "Ministry of Economy",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    description: "The region's most prestigious gathering of global business leaders, investors, and policymakers. Over three days, explore billion-dollar investment opportunities, forge strategic partnerships, and gain insights into economic trends shaping the future of international trade.",
    duration: "3 Days (8:00 AM - 6:00 PM)",
    capacity: "2000+ attendees",
    agenda: [
      "Day 1: Global Economic Outlook & Investment Trends",
      "Day 2: Sector-Specific Investment Opportunities",
      "Day 3: Future of Trade & Technology Integration",
      "Daily: Exhibition Hall, B2B Meetings, VIP Networking Events"
    ],
    speakers: [
      { name: "H.E. Abdullah Al-Saleh", title: "Minister of Economy", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
      { name: "Christine Lagarde", title: "President, European Central Bank", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" }
    ],
    benefits: [
      "Access to 2000+ global business leaders",
      "B2B matchmaking platform with AI-powered suggestions",
      "VIP networking dinners and exclusive events",
      "Summit proceedings and research reports"
    ],
    requirements: [
      "Business registration or corporate ID",
      "Professional attire required",
      "Early registration recommended"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800"
    ],
    deliveryMode: "Hybrid",
    costType: "Paid",
    language: "English",
    capability: ["Leadership", "Financial Management ", "Operations"],
    businessStage: ["Growth", "Expansion"],
    industry: ["Finance", "Technology", "Manufacturing"]
  },
  {
    id: "6",
    title: "Entrepreneurship Masterclass: From Idea to Scale",
    date: "November 15, 2024",
    location: "NYU Abu Dhabi",
    type: "Workshop",
    organizer: "Khalifa Fund",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "An intensive full-day masterclass covering the complete entrepreneurial journey from ideation to scaling. Learn from successful entrepreneurs who have built multi-million dirham businesses, with practical frameworks and actionable strategies you can implement immediately.",
    duration: "Full Day (9:00 AM - 5:00 PM)",
    capacity: "80 participants",
    agenda: [
      "9:00 AM - Registration & Breakfast Networking",
      "9:30 AM - Module 1: Idea Validation & Market Research",
      "11:00 AM - Module 2: Business Model Canvas Workshop",
      "12:30 PM - Lunch & Networking",
      "1:30 PM - Module 3: Funding Strategies & Pitch Practice",
      "3:00 PM - Module 4: Building High-Performance Teams",
      "4:30 PM - Panel: Lessons from Successful Entrepreneurs",
      "5:00 PM - Certificate Distribution & Closing"
    ],
    speakers: [
      { name: "Mouza Al-Nasri", title: "Serial Entrepreneur & Investor", imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400" },
      { name: "Tariq Rahman", title: "Founder, TechVentures UAE", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400" }
    ],
    benefits: [
      "Comprehensive entrepreneurship toolkit",
      "Access to Khalifa Fund mentorship program",
      "Potential funding opportunities",
      "Networking with 80+ entrepreneurs",
      "Certificate from NYU Abu Dhabi"
    ],
    requirements: [
      "Aspiring or early-stage entrepreneurs",
      "Business idea or existing startup",
      "Commitment to attend full day"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800"
    ],
    deliveryMode: "Onsite",
    costType: "Free",
    language: "English",
    capability: ["Leadership", "Innovation", "Financial Management "],
    businessStage: ["Ideation", "Launch", "Growth"],
    industry: ["Technology", "Education"]
  },
];
const resources: Resource[] = [
  {
    id: "1",
    title: "Business Plan Template",
    type: "Templates",
    description:
      "Comprehensive business plan template with financial projections, market analysis, and strategic planning sections. Perfect for startups.",
    icon: <FileText size={24} className="text-blue-600" />,
    downloadUrl: "#",
    fileSize: "2.5 MB",
    downloadCount: 1847,
    lastUpdated: "January 2024",
    tags: ["Business", "Template"],
  },
  {
    id: "2",
    title: "Export Market Analysis Report",
    type: "Guide",
    description:
      "Detailed analysis of export opportunities for Abu Dhabi businesses with market insights and regulatory information.",
    icon: <BookOpen size={24} className="text-blue-600" />,
    downloadUrl: "#",
    fileSize: "4.1 MB",
    downloadCount: 3254,
    lastUpdated: "December 2023",
    tags: ["Export", "Market Research"],
  },
  {
    id: "3",
    title: "Financial Planning Templates",
    type: "Templates",
    description:
      "Ready-to-use templates for financial planning and forecasting with automated calculations and projections.",
    icon: <FileText size={24} className="text-blue-600" />,
    downloadUrl: "#",
    fileSize: "1.8 MB",
    downloadCount: 5632,
    lastUpdated: "February 2024",
    tags: ["Finance", "Planning"],
  },
  {
    id: "4",
    title: "SME Growth Toolkit",
    type: "Guide",
    description:
      "Essential resources and strategies for small and medium enterprise growth in Abu Dhabi market conditions.",
    icon: <BookOpen size={24} className="text-blue-600" />,
    downloadUrl: "#",
    fileSize: "3.2 MB",
    downloadCount: 2187,
    lastUpdated: "January 2024",
    tags: ["SME", "Growth"],
  },
  {
    id: "5",
    title: "Digital Marketing Handbook",
    type: "Guide",
    description:
      "Complete guide to digital marketing strategies including SEO, social media, content marketing, and paid advertising best practices.",
    icon: <BookOpen size={24} className="text-blue-600" />,
    downloadUrl: "#",
    fileSize: "4.5 MB",
    downloadCount: 8967,
    lastUpdated: "December 2023",
    tags: ["Marketing", "Digital"],
  },
  {
    id: "6",
    title: "Financial Calculator Tool",
    type: "Tool",
    description:
      "Interactive online calculator for loan payments, investment returns, and financial planning. Access powerful calculations instantly.",
    icon: <Calculator size={24} className="text-blue-600" />,
    downloadUrl: "#",
    fileSize: "External",
    downloadCount: 12456,
    lastUpdated: "February 2024",
    isExternal: true,
    tags: ["Finance", "Calculator"],
  },
];
// Segmented Tab Component
const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeTab,
  setActiveTab,
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });
  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab]);
  return (
    <div className="relative inline-flex bg-white rounded-full shadow-sm p-1 mx-auto mb-8">
      {/* Animated background indicator */}
      <div
        className="absolute bottom-0 h-full bg-blue-50 rounded-full transition-all duration-300 z-0"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      ></div>
      {/* Animated underline */}
      <div
        className="absolute bottom-1 h-0.5 bg-blue-600 rounded-full transition-all duration-300 z-10"
        style={{
          left: `${indicatorStyle.left + 8}px`,
          width: `${indicatorStyle.width - 16}px`,
        }}
      ></div>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => (tabRefs.current[index] = el)}
          onClick={() => setActiveTab(index)}
          className={`relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center
            ${
              activeTab === index
                ? "text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
        >
          {tab.icon}
          <span className="ml-1">{tab.label}</span>
          {/* Ripple effect */}
          {activeTab === index && (
            <span className="absolute inset-0 rounded-full animate-ripple bg-blue-200 opacity-30"></span>
          )}
        </button>
      ))}
    </div>
  );
};
// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader size={40} className="text-blue-600 animate-spin mb-4" />
    <p className="text-gray-600 font-medium">Loading data...</p>
  </div>
);
// Error message component
const ErrorMessage = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle size={40} className="text-red-500 mb-4" />
    <h3 className="text-lg font-bold text-gray-800 mb-2">Error Loading Data</h3>
    <p className="text-gray-600 max-w-md mx-auto">
      {message || "We couldn't load the data. Please try again later."}
    </p>
  </div>
);
// Main KnowledgeHub Content Component
const KnowledgeHubContent = ({ graphqlEndpoint }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0); // 0: News, 1: Events, 2: Resources
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
  } | null>(null);
  // Add state for registration form
  const [registrationForm, setRegistrationForm] =
    useState<RegistrationFormState>({
      isOpen: false,
      eventId: null,
    });
  // Define tabs
  const tabs = [
    {
      id: "news",
      label: "News",
      icon: <Newspaper size={16} className="text-blue-600" />,
    },
    {
      id: "events",
      label: "Events",
      icon: <Calendar size={16} className="text-blue-600" />,
    },
    {
      id: "resources",
      label: "Resources",
      icon: <BookOpen size={16} className="text-blue-600" />,
    },
  ];

  // Handle scroll to section when component mounts or when navigating back
  useEffect(() => {
    const scrollToSection = () => {
      // Small timeout to ensure the DOM is fully rendered
      setTimeout(() => {
        if (
          window.location.hash === "#news" ||
          window.location.hash === "#events" ||
          window.location.hash === "#resources"
        ) {
          const element = document.getElementById("knowledge-hub");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 100);
    };

    // Initial scroll when component mounts
    scrollToSection();

    // Also handle browser back/forward navigation
    window.addEventListener("popstate", scrollToSection);
    return () => window.removeEventListener("popstate", scrollToSection);
  }, []);

  // Set active tab based on URL hash or navigation state
  useEffect(() => {
    const hash = window.location.hash;
    const tabFromHash = tabs.findIndex((tab) => `#${tab.id}` === hash);

    // If we have a hash that matches a tab, use that
    if (tabFromHash >= 0) {
      setActiveTab(tabFromHash);
    }
    // Otherwise check for tab in location state
    else if (location.state?.activeTab) {
      const tabFromState = tabs.findIndex(
        (tab) => tab.id === location.state.activeTab
      );
      if (tabFromState >= 0) {
        setActiveTab(tabFromState);
        // Update URL to reflect the active tab
        navigate(`#${tabs[tabFromState].id}`, {
          replace: true,
          state: { activeTab: tabs[tabFromState].id },
        });
      }
    }
    // If no hash or state, default to first tab
    else if (!hash) {
      setActiveTab(0);
    }
  }, [location, navigate, tabs]);

  // Handle tab change with animation
  const handleTabChange = (index) => {
    // Don't do anything if clicking the same tab
    if (index === activeTab) return;

    setIsTabChanging(true);

    // Update the tab first for immediate feedback
    setActiveTab(index);

    // Update URL and state
    navigate(`#${tabs[index].id}`, {
      replace: true,
      state: { activeTab: tabs[index].id },
    });

    // Scroll to the section
    const scrollToSection = () => {
      const element = document.getElementById("knowledge-hub");
      if (element) {
        // Then scroll to the section
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    // Small delay to allow any animations to complete
    setTimeout(() => {
      setIsTabChanging(false);
      scrollToSection();
    }, 100);
  };
  // Get data based on active tab
  const getNewsData = () => newsItems;
  const getEventsData = () => events;
  const getResourcesData = () => resources;
  // Add handler for opening registration form
  const handleOpenRegistration = (eventId: string) => {
    setRegistrationForm({
      isOpen: true,
      eventId,
    });
  };
  // Add handler for closing registration form
  const handleCloseRegistration = () => {
    setRegistrationForm({
      isOpen: false,
      eventId: null,
    });
  };
  // Add this function to handle event registration
  const handleEventRegister = (event: Event) => {
    // Here you can implement what happens when someone registers for an event
    console.log("Registering for event:", event.title);
    // Open the registration form
    handleOpenRegistration(event.id);
  };
  // Add function to handle resource downloads
  const handleResourceDownload = (resource: Resource) => {
    console.log("Downloading resource:", resource.title);
    if (resource.isExternal) {
      // For external resources, open in new tab
      if (resource.downloadUrl) {
        window.open(resource.downloadUrl, "_blank");
      }
    } else {
      // For internal resources, trigger download
      if (resource.downloadUrl) {
        // Create a temporary link element to trigger download
        const link = document.createElement("a");
        link.href = resource.downloadUrl;
        link.download = `${resource.title}.${
          resource.fileSize?.includes("PDF") ? "pdf" : "zip"
        }`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fallback for demo purposes
        alert(`Download for "${resource.title}" will begin shortly!`);
      }
    }
  };
  // Add function to handle resource access
  const handleResourceAccess = (resource: Resource) => {
    console.log("Accessing resource:", resource.title);
    if (resource.isExternal) {
      // For external resources, open in new tab
      if (resource.downloadUrl) {
        window.open(resource.downloadUrl, "_blank");
      }
    } else {
      // For internal resources, navigate to detail page
      navigate(`/resources/${resource.id}`);
    }
  };
  // Helper function to get the appropriate icon for a resource type
  const getResourceIconByType = (type) => {
    switch (type?.toLowerCase()) {
      case "guide":
        return <BookOpen size={24} className="text-blue-600" />;
      case "templates":
        return <FileText size={24} className="text-blue-600" />;
      case "tool":
        return <Calculator size={24} className="text-blue-600" />;
      default:
        return <FileText size={24} className="text-blue-600" />;
    }
  };
  // Get current event for registration form
  const getCurrentEvent = () => {
    if (!registrationForm.eventId) return null;
    return events.find((event) => event.id === registrationForm.eventId);
  };

  // Define the type for the Supabase media item
  type MediaItem = {
    id: string;
    title: string;
    summary?: string;
    body?: string;
    published_at?: string;
    category?: string | null;
    image_url?: string;
    thumbnail_url?: string;
    source?: string;
    tags?: string[];
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getSupabaseKnowledgeHub()
          // .schema("admin")
          .from("v_media_all")
          .select("*")
          .eq("status", "Published") // Only fetch published items
          .limit(600);

        if (error) throw error;

        const filteredNewsData = data
          ?.filter((item) => {
            const tags = item.tags || []; // Handle case where tags might be null/undefined
            return tags.some(
              (tag) =>
                typeof tag === "string" &&
                (tag.includes("Article") ||
                  tag.includes("Knowledge") ||
                  tag.includes("News") ||
                  tag.includes("Finance & Funding") ||
                  tag.includes("Technology & Innovation"))
            );
          })
          .slice(0, 6); // Take only the first 6 after filtering
        const filteredEventsData = data
          ?.filter((item) => {
            const tags = item.type === "Event";
            return tags;
          })
          .slice(0, 6); // Take only the first 6 after filtering
        const filteredResourcesData = data
          ?.filter((item) => {
            const tags = item.tags || []; // Handle case where tags might be null/undefined
            return tags.some(
              (tag) =>
                typeof tag === "string" &&
                (tag.includes("Report") ||
                  tag.includes("Guide") ||
                  tag.includes("Tool"))
            );
          })
          .slice(0, 6); // Take only the first 6 after filtering
        if (filteredResourcesData) {
          // Map the Supabase data to match the Resource interface
          const mappedResources = (filteredResourcesData as MediaItem[]).map(
            (item) => ({
              id: item.id,
              title: item.title,
              excerpt:
                item.summary || item.body?.substring(0, 150) + "..." || "",
              date: item.published_at || new Date().toISOString().split("T")[0],
              category: item.category || "General",
              imageUrl: item.thumbnail_url || "/placeholder-news.jpg",
              source: item.source || "Unknown Source",
            })
          );
          setResources(mappedResources);
        }
        if (filteredNewsData) {
          // Map the Supabase data to match the NewsItem interface
          const mappedNewsItems = (filteredNewsData as MediaItem[]).map(
            (item) => ({
              id: item.id,
              title: item.title,
              excerpt:
                item.summary || item.body?.substring(0, 150) + "..." || "",
              date: item.published_at,
              category: item.tags[0] || "General",
              imageUrl: item.thumbnail_url || "/placeholder-news.jpg",
              source: item.source || "Knowledge Hub",
            })
          );
          setNewsItems(mappedNewsItems);
          setIsLoading(false);
          console.log(data);
        }
        if (filteredEventsData) {
          // Map the Supabase data to match the Event interface
          const mappedEvents = (filteredEventsData as MediaItem[]).map(
            (item) => ({
              id: item.id,
              title: item.title,
              excerpt: item.summary,
              date: item.published_at,
              category: item.tags[0] || "General",
              imageUrl:
                item.thumbnail_url ||
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
              source: item.source || "Knowledge Hub",
              agenda: item.event_agenda.agenda,
              whoShouldAttend: item.event_agenda.audience,
              speakers: item.event_agenda.speakers,
              objectives: item.event_agenda.objectives,
              registrationForm: item.event_agenda.registration,
              startDateTime: item.start_at,
              endDateTime: item.end_at,
              timezone: item.timezone,
              venue: item.venue,
            })
          );
          setEvents(mappedEvents);
          setIsLoading(false);
          console.log(mappedEvents);
        }
      } catch (error) {
        setIsLoading(false);
        setError(error.message);

        console.error("Error fetching news items:", error);
      } finally {
      }
    };
    fetchItems();
  }, []);
  return (
    <div className="bg-gray-50 py-16" id="knowledge-hub">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 relative inline-block">
            Stay Ahead with Expert Insights
            {/* <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-400 transform origin-left"></span> */}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access the latest news, events, and resources to help your business
            thrive in Abu Dhabi
          </p>
          {/* <div className="mt-4">
            <a href="/admin-ui/media/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add Content
            </a>
          </div> */}
        </FadeInUpOnScroll>
        {/* Segmented Tabs */}
        <div className="flex justify-center mb-8">
          <SegmentedTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
        </div>
        {/* Tab Content with Fade Transition */}
        <div
          className={`transition-opacity duration-300 ${
            isTabChanging ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[...Array(6)].map((_, idx) => (
                <CourseCardSkeleton key={idx} />
              ))}
            </div>
          )}
          {/* Error State */}
          {error && !isLoading && <ErrorMessage message={error.message} />}
          {/* News Tab */}
          {activeTab === 0 && !isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getNewsData().map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <KnowledgeHubCard
                    item={{
                      id: item.id,
                      title: item.title,
                      description: item.excerpt,
                      mediaType: "news",
                      provider: {
                        name: item.source || "Abu Dhabi Times",
                        logoUrl: "",
                      },
                      imageUrl: item.imageUrl,
                      tags: [item.category, "News"],
                      date: item.date,
                      lastUpdated: item.date, // Add this line
                      category: item.category,
                    }}
                    isBookmarked={false}
                    onToggleBookmark={() => {}}
                    forceProviderMode={true}
                  />
                </div>
              ))}
            </div>
          )}
          {/* Events Tab */}
          {activeTab === 1 && !isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getEventsData()
                .slice(0, 6)
                .map((event, index) => (
                  <div
                    key={event.id}
                    className="animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <KnowledgeHubCard
                      item={{
                        id: event.id,
                        title: event.title,
                        description: event.excerpt,
                        mediaType: "event",
                        provider: {
                          name: event.organizer || "Event Organizer",
                          logoUrl: "",
                        },
                        imageUrl: event.imageUrl || "",
                        tags: [event.category],
                        date: event.date,
                        location:
                          event?.venue || event?.location?.mode || "Dubai",
                        timezone: event?.timezone,
                        startDateTime: event?.startDateTime,
                        endDateTime: event?.endDateTime,
                        venue: event?.venue,
                        // location: event?.location,
                        agenda: event?.agenda,
                        whoShouldAttend: event?.whoShouldAttend,
                        speakers: event?.speakers,
                        objectives: event?.objectives,
                      }}
                      isBookmarked={false}
                      onToggleBookmark={() => {}}
                      forceProviderMode={true}
                    />
                  </div>
                ))}
            </div>
          )}
          {/* Resources Tab */}
          {activeTab === 2 && !isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getResourcesData().map((resource, index) => (
                <div
                  key={resource.id}
                  className="animate-zoom-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <KnowledgeHubCard
                    item={{
                      id: resource.id,
                      title: resource.title,
                      description: resource.excerpt,
                      mediaType: "Report",
                      provider: {
                        name: "Abu Dhabi Business Hub",
                        logoUrl: "",
                      },
                      tags: resource.category,
                      downloadCount: resource.downloadCount,
                      fileSize: resource.fileSize,
                      date: resource.date,
                      lastUpdated: resource.date,
                    }}
                    isBookmarked={false}
                    onToggleBookmark={() => {}}
                    forceProviderMode={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Event Registration Form */}
      {registrationForm.isOpen &&
        (() => {
          const currentEvent = getCurrentEvent();
          return currentEvent ? (
            <EventRegistrationForm
              event={currentEvent}
              onClose={handleCloseRegistration}
            />
          ) : null;
        })()}
      {/* Add keyframes for animations */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.5s ease-out forwards;
        }
        .animate-zoom-in {
          animation: zoom-in 0.5s ease-out forwards;
        }
        .animate-ripple {
          animation: ripple 0.8s ease-out;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};
// Main KnowledgeHub component
const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ graphqlEndpoint }) => {
  // Always render without Apollo since we don't have the dependency
  return <KnowledgeHubContent graphqlEndpoint={null} />;
};
export default KnowledgeHub;
