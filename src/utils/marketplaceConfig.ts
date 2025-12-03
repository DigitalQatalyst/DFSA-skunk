import * as React from 'react';
import { ReactNode } from 'react';
import { DollarSign, Calendar, Clock, Users, MapPin, CheckCircle, BarChart, Award, FileText, Info, BookOpen, ClipboardList, Building, FileType, Bookmark, TrendingUp } from 'lucide-react';
import { mockCourses, providers } from './mockData';
import { mockFinancialServices, mockNonFinancialServices, mockKnowledgeHubItems, mockKnowledgeHubFilterOptions, mockEvents, mockEventsFilterOptions } from './mockMarketplaceData';
// Define a Tab type for consistency across marketplace pages
export interface MarketplaceTab {
  id: string;
  label: string;
  icon?: any;
  iconBgColor?: string;
  iconColor?: string;
  renderContent?: (item: any, marketplaceType: string) => React.ReactNode;
}
// Configuration type definitions
export interface AttributeConfig {
  key: string;
  label: string;
  icon: ReactNode;
  formatter?: (value: any) => string;
}
export interface TabConfig {
  id: string;
  label: string;
  icon?: any;
  iconBgColor?: string;
  iconColor?: string;
  renderContent?: (item: any, marketplaceType: string) => React.ReactNode;
}
export interface FilterCategoryConfig {
  id: string;
  title: string;
  options: {
    id: string;
    name: string;
  }[];
}
export interface MarketplaceConfig {
  id: string;
  title: string;
  description: string;
  route: string;
  primaryCTA: string;
  secondaryCTA: string;
  itemName: string;
  itemNamePlural: string;
  attributes: AttributeConfig[];
  detailSections: string[];
  tabs: TabConfig[];
  summarySticky?: boolean;
  filterCategories: FilterCategoryConfig[];
  // New fields for GraphQL integration
  mapListResponse?: (data: any[]) => any[];
  mapDetailResponse?: (data: any) => any;
  mapFilterResponse?: (data: any) => FilterCategoryConfig[];
  // Mock data for fallback and schema reference
  mockData?: {
    items: any[];
    filterOptions: any;
    providers: any[];
  };
}
// Mock data for financial services
export const mockFinancialServicesData = {
  items: mockFinancialServices,
  filterOptions: {
    categories: [{
      id: 'loans',
      name: 'Loans'
    }, {
      id: 'financing',
      name: 'Financing'
    }, {
      id: 'insurance',
      name: 'Insurance'
    }, {
      id: 'creditcard',
      name: 'Credit Card'
    }],
    serviceTypes: [{
      id: 'financing',
      name: 'Financing'
    }, {
      id: 'credit',
      name: 'Credit'
    }, {
      id: 'riskmanagement',
      name: 'Risk Management'
    }]
  },
  providers: providers
};
// Mock data for events
export const mockEventsData = {
  items: mockEvents,
  filterOptions: mockEventsFilterOptions,
  providers: providers
};
// Mock data for non-financial services
export const mockNonFinancialServicesData = {
  items: mockNonFinancialServices,
  filterOptions: {
    categories: [{
      id: 'consultancy',
      name: 'Consultancy'
    }, {
      id: 'technology',
      name: 'Technology'
    }, {
      id: 'research',
      name: 'Research'
    }, {
      id: 'export',
      name: 'Export'
    }],
    serviceTypes: [{
      id: 'advisory',
      name: 'Advisory'
    }, {
      id: 'implementation',
      name: 'Implementation'
    }, {
      id: 'information',
      name: 'Information'
    }, {
      id: 'program',
      name: 'Program'
    }],
    deliveryModes: [{
      id: 'online',
      name: 'Online'
    }, {
      id: 'inperson',
      name: 'In-person'
    }, {
      id: 'hybrid',
      name: 'Hybrid'
    }]
  },
  providers: providers
};
// Mock data for courses
export const mockCoursesData = {
  items: mockCourses,
  filterOptions: {
    categories: [{
      id: 'entrepreneurship',
      name: 'Entrepreneurship'
    }, {
      id: 'finance',
      name: 'Finance'
    }, {
      id: 'marketing',
      name: 'Marketing'
    }, {
      id: 'technology',
      name: 'Technology'
    }, {
      id: 'operations',
      name: 'Operations'
    }],
    deliveryModes: [{
      id: 'online',
      name: 'Online'
    }, {
      id: 'inperson',
      name: 'In-person'
    }, {
      id: 'hybrid',
      name: 'Hybrid'
    }],
    businessStages: [{
      id: 'conception',
      name: 'Conception'
    }, {
      id: 'growth',
      name: 'Growth'
    }, {
      id: 'maturity',
      name: 'Maturity'
    }, {
      id: 'restructuring',
      name: 'Restructuring'
    }]
  },
  providers: providers
};
// Mock data for Knowledge Hub
export const mockKnowledgeHubData = {
  items: mockKnowledgeHubItems,
  filterOptions: mockKnowledgeHubFilterOptions,
  providers: providers
};
// Define marketplace configurations
export const marketplaceConfig: Record<string, MarketplaceConfig> = {
  courses: {
    id: 'courses',
    title: 'Learning Academy',
    description: 'Discover and enroll in courses tailored for SMEs to help grow your business',
    route: '/marketplace/courses',
    primaryCTA: 'Enroll Now',
    secondaryCTA: 'View Details',
    itemName: 'Course',
    itemNamePlural: 'Courses',
    attributes: [{
      key: 'duration',
      label: 'Duration',
      icon: React.createElement(Clock, { size: 18, className: "mr-2" })
    }, {
      key: 'startDate',
      label: 'Starts',
      icon: React.createElement(Calendar, { size: 18, className: "mr-2" })
    }, {
      key: 'price',
      label: 'Cost',
      icon: React.createElement(DollarSign, { size: 18, className: "mr-2" })
    }, {
      key: 'location',
      label: 'Location',
      icon: React.createElement(MapPin, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'learningOutcomes', 'schedule', 'provider', 'related'],
    tabs: [{
      id: 'about',
      label: 'About This Service',
      icon: Info,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }, {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }, {
      id: 'learning_outcomes',
      label: 'Learning Outcomes',
      icon: BookOpen,
      iconBgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }, {
      id: 'provider',
      label: 'About Provider',
      icon: Building,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }],
    summarySticky: true,
    filterCategories: [{
      id: 'category',
      title: 'Course Category',
      options: [{
        id: 'entrepreneurship',
        name: 'Entrepreneurship'
      }, {
        id: 'finance',
        name: 'Finance'
      }, {
        id: 'marketing',
        name: 'Marketing'
      }, {
        id: 'technology',
        name: 'Technology'
      }, {
        id: 'operations',
        name: 'Operations'
      }]
    }, {
      id: 'deliveryMode',
      title: 'Delivery Mode',
      options: [{
        id: 'online',
        name: 'Online'
      }, {
        id: 'inperson',
        name: 'In-person'
      }, {
        id: 'hybrid',
        name: 'Hybrid'
      }]
    }, {
      id: 'duration',
      title: 'Duration',
      options: [{
        id: 'short',
        name: 'Short (<1 week)'
      }, {
        id: 'medium',
        name: 'Medium (1-4 weeks)'
      }, {
        id: 'long',
        name: 'Long (1+ month)'
      }]
    }, {
      id: 'businessStage',
      title: 'Business Stage',
      options: [{
        id: 'conception',
        name: 'Conception'
      }, {
        id: 'growth',
        name: 'Growth'
      }, {
        id: 'maturity',
        name: 'Maturity'
      }, {
        id: 'restructuring',
        name: 'Restructuring'
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.category, item.deliveryMode].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || data.learningOutcomes || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'category',
        title: 'Course Category',
        options: data.categories || []
      }, {
        id: 'deliveryMode',
        title: 'Delivery Mode',
        options: data.deliveryModes || []
      }, {
        id: 'duration',
        title: 'Duration',
        options: [{
          id: 'short',
          name: 'Short (<1 week)'
        }, {
          id: 'medium',
          name: 'Medium (1-4 weeks)'
        }, {
          id: 'long',
          name: 'Long (1+ month)'
        }]
      }, {
        id: 'businessStage',
        title: 'Business Stage',
        options: data.businessStages || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockCoursesData
  },
  financial: {
    id: 'financial',
    title: 'Finance Hub',
    description: 'Access financial products and services to support your business growth',
    route: '/marketplace/financial',
    primaryCTA: 'Apply Now',
    secondaryCTA: 'View Details',
    itemName: 'Financial Service',
    itemNamePlural: 'Financial Services',
    attributes: [{
      key: 'amount',
      label: 'Amount',
      icon: React.createElement(DollarSign, { size: 18, className: "mr-2" })
    }, {
      key: 'duration',
      label: 'Repayment Term',
      icon: React.createElement(Calendar, { size: 18, className: "mr-2" })
    }, {
      key: 'eligibility',
      label: 'Eligibility',
      icon: React.createElement(CheckCircle, { size: 18, className: "mr-2" })
    }, {
      key: 'interestRate',
      label: 'Interest Rate',
      icon: React.createElement(BarChart, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'eligibility', 'terms', 'provider', 'related'],
    tabs: [{
      id: 'about',
      label: 'About This Service',
      icon: Info,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }, {
      id: 'eligibility_terms',
      label: 'Eligibility & Terms',
      icon: CheckCircle,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }, {
      id: 'application_process',
      label: 'Application Process',
      icon: ClipboardList,
      iconBgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }, {
      id: 'required_documents',
      label: 'Required Documents',
      icon: FileText,
      iconBgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }, {
      id: 'provider',
      label: 'About Provider',
      icon: Building,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }],
    summarySticky: true,
    filterCategories: [{
      id: 'category',
      title: 'Service Category',
      options: [{
        id: 'loans',
        name: 'Loans'
      }, {
        id: 'financing',
        name: 'Financing'
      }, {
        id: 'insurance',
        name: 'Insurance'
      }, {
        id: 'creditcard',
        name: 'Credit Card'
      }]
    }, {
      id: 'serviceType',
      title: 'Service Type',
      options: [{
        id: 'financing',
        name: 'Financing'
      }, {
        id: 'credit',
        name: 'Credit'
      }, {
        id: 'riskmanagement',
        name: 'Risk Management'
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.category, item.serviceType].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || data.details || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'category',
        title: 'Service Category',
        options: data.categories || []
      }, {
        id: 'serviceType',
        title: 'Service Type',
        options: data.serviceTypes || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockFinancialServicesData
  },
  events: {
    id: 'events',
    title: 'Events',
    description: 'Discover and register for business events, workshops, and networking opportunities in Abu Dhabi',
    route: '/marketplace/events',
    primaryCTA: 'Register Now',
    secondaryCTA: 'View Details',
    itemName: 'Event',
    itemNamePlural: 'Events',
    attributes: [{
      key: 'date',
      label: 'Date',
      icon: React.createElement(Calendar, { size: 18, className: "mr-2" })
    }, {
      key: 'time',
      label: 'Time',
      icon: React.createElement(Clock, { size: 18, className: "mr-2" })
    }, {
      key: 'location',
      label: 'Location',
      icon: React.createElement(MapPin, { size: 18, className: "mr-2" })
    }, {
      key: 'price',
      label: 'Price',
      icon: React.createElement(DollarSign, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'details', 'provider', 'related'],
    tabs: [{
      id: 'about',
      label: 'About This Event',
      icon: Info,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }, {
      id: 'eligibility_terms',
      label: 'Event Details',
      icon: CheckCircle,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }, {
      id: 'application_process',
      label: 'Registration Process',
      icon: ClipboardList,
      iconBgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }, {
      id: 'required_documents',
      label: 'What to Bring',
      icon: FileText,
      iconBgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }, {
      id: 'provider',
      label: 'About Organizer',
      icon: Building,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }],
    summarySticky: true,
    filterCategories: [{
      id: 'time-range',
      title: 'Time Range',
      options: [{
        id: 'today',
        name: 'Today'
      }, {
        id: 'this-week',
        name: 'This Week'
      }, {
        id: 'next-30-days',
        name: 'Next 30 Days'
      }, {
        id: 'custom-date-range',
        name: 'Custom Date Range'
      }]
    }, {
      id: 'event-type',
      title: 'Event Type',
      options: [{
        id: 'expotrade-show',
        name: 'Expo/Trade Show'
      }, {
        id: 'networking',
        name: 'Networking'
      }, {
        id: 'competition',
        name: 'Competition'
      }, {
        id: 'pitch-day',
        name: 'Pitch Day'
      }, {
        id: 'webinar',
        name: 'Webinar'
      }, {
        id: 'workshop',
        name: 'Workshop'
      }, {
        id: 'seminar',
        name: 'Seminar'
      }, {
        id: 'panel',
        name: 'Panel'
      }, {
        id: 'conference',
        name: 'Conference'
      }]
    }, {
      id: 'delivery-mode',
      title: 'Delivery Mode',
      options: [{
        id: 'online',
        name: 'Online'
      }, {
        id: 'onsite',
        name: 'Onsite'
      }, {
        id: 'hybrid',
        name: 'Hybrid'
      }]
    }, {
      id: 'cost-type',
      title: 'Cost Type',
      options: [{
        id: 'free',
        name: 'Free'
      }, {
        id: 'paid',
        name: 'Paid'
      }]
    }, {
      id: 'duration-band',
      title: 'Duration Band',
      options: [{
        id: 'short',
        name: 'short'
      }, {
        id: 'medium',
        name: 'Medium'
      }, {
        id: 'long',
        name: 'Long'
      }, {
        id: 'multi-days',
        name: 'Multi-Days'
      }]
    }, {
      id: 'language',
      title: 'Language',
      options: [{
        id: 'english',
        name: 'English'
      }, {
        id: 'arabic',
        name: 'Arabic'
      }]
    }, {
      id: 'capability',
      title: 'Capability',
      options: [{
        id: 'leadership',
        name: 'Leadership'
      }, {
        id: 'innovation',
        name: 'Innovation'
      }, {
        id: 'digital-transformation',
        name: 'Digital Transformation'
      }, {
        id: 'financial-management-',
        name: 'Financial Management '
      }, {
        id: 'marketing',
        name: 'Marketing'
      }, {
        id: 'operations',
        name: 'Operations'
      }]
    }, {
      id: 'business-stage',
      title: 'Business Stage',
      options: [{
        id: 'ideation',
        name: 'Ideation'
      }, {
        id: 'launch',
        name: 'Launch'
      }, {
        id: 'growth',
        name: 'Growth'
      }, {
        id: 'expansion',
        name: 'Expansion'
      }, {
        id: 'optimization',
        name: 'Optimization'
      }]
    }, {
      id: 'industry',
      title: 'Industry',
      options: [{
        id: 'technology',
        name: 'Technology'
      }, {
        id: 'healthcare',
        name: 'Healthcare'
      }, {
        id: 'finance',
        name: 'Finance'
      }, {
        id: 'manufacturing',
        name: 'Manufacturing'
      }, {
        id: 'retail',
        name: 'Retail'
      }, {
        id: 'real-estate',
        name: 'Real Estate'
      }, {
        id: 'education',
        name: 'Education'
      }, {
        id: 'hospitality',
        name: 'Hospitality'
      }]
    }, {
      id: 'organizer',
      title: 'Organizer',
      options: [{
        id: 'khalifa-fund',
        name: 'Khalifa Fund'
      }, {
        id: 'partner',
        name: 'Partner'
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.category, item.eventType].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || data.details || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'category',
        title: 'Categories',
        options: data.categories || []
      }, {
        id: 'location',
        title: 'Location',
        options: data.locations || []
      }, {
        id: 'price',
        title: 'Price',
        options: data.prices || []
      }, {
        id: 'session',
        title: 'Session',
        options: data.sessions || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockEventsData
  },
  'non-financial': {
    id: 'non-financial',
    title: 'Business Services Hub',
    description: 'Find professional services to support and grow your business',
    route: '/marketplace/non-financial',
    primaryCTA: 'Request Service',
    secondaryCTA: 'View Details',
    itemName: 'Business Service',
    itemNamePlural: 'Business Services',
    attributes: [{
      key: 'serviceCategory',
      label: 'Category',
      icon: React.createElement(Building, { size: 18, className: "mr-2" })
    }, {
      key: 'entityType',
      label: 'Entity Type',
      icon: React.createElement(Users, { size: 18, className: "mr-2" })
    }, {
      key: 'processingTime',
      label: 'Processing Time',
      icon: React.createElement(Clock, { size: 18, className: "mr-2" })
    }, {
      key: 'serviceType',
      label: 'Service Type',
      icon: React.createElement(Award, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'deliveryDetails', 'provider', 'related'],
    tabs: [{
      id: 'about',
      label: 'About This Service',
      icon: Info,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }, {
      id: 'requirements',
      label: 'Requirements',
      icon: CheckCircle,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      renderContent: (item: any) => React.createElement('ul', { className: 'list-disc pl-5 space-y-2' },
        (item.requiredDocuments || []).map((req: string, i: number) => React.createElement('li', { key: i, className: 'text-gray-700' }, req))
      )
    }, {
      id: 'process',
      label: 'Process Steps',
      icon: ClipboardList,
      iconBgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      renderContent: (item: any) => React.createElement('div', { className: 'space-y-4' },
        (item.applicationProcess || []).map((step: any, i: number) => React.createElement('div', { key: i, className: 'flex' }, [
          React.createElement('div', { className: 'flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4' }, i + 1),
          React.createElement('div', {}, [
            React.createElement('h4', { className: 'font-semibold text-gray-900' }, step.title),
            React.createElement('p', { className: 'text-gray-600 text-sm' }, step.description)
          ])
        ]))
      )
    }, {
      id: 'provider',
      label: 'About Provider',
      icon: Building,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }],
    summarySticky: true,
    filterCategories: [{
      id: 'serviceCategory',
      title: 'Service Category',
      options: [{
        id: 'Licensing / Authorisation',
        name: 'Licensing / Authorisation'
      }, {
        id: 'Funds',
        name: 'Funds'
      }, {
        id: 'Compliance / AML',
        name: 'Compliance / AML'
      }, {
        id: 'Market / Innovation',
        name: 'Market / Innovation'
      }, {
        id: 'Securities & Crypto',
        name: 'Securities & Crypto'
      }, {
        id: 'Advisory',
        name: 'Advisory'
      }, {
        id: 'Market Access / Membership',
        name: 'Market Access / Membership'
      }, {
        id: 'Audit / Compliance',
        name: 'Audit / Compliance'
      }]
    }, {
      id: 'serviceType',
      title: 'Service Type',
      options: [{
        id: 'New Application',
        name: 'New Application'
      }, {
        id: 'Registration',
        name: 'Registration'
      }, {
        id: 'Authorisation / Registration',
        name: 'Authorisation / Registration'
      }, {
        id: 'New Application / Amendment / Withdrawal',
        name: 'New Application / Amendment / Withdrawal'
      }, {
        id: 'Registration / Authorisation',
        name: 'Registration / Authorisation'
      }, {
        id: 'New Application / Innovation',
        name: 'New Application / Innovation'
      }, {
        id: 'Authorisation / Recognition',
        name: 'Authorisation / Recognition'
      }, {
        id: 'Recognition',
        name: 'Recognition'
      }]
    }, {
      id: 'entityType',
      title: 'Entity Type',
      options: [{
        id: 'Authorised Firms',
        name: 'Authorised Firms'
      }, {
        id: 'Individuals',
        name: 'Individuals'
      }, {
        id: 'Collective Investment Funds',
        name: 'Collective Investment Funds'
      }, {
        id: 'DNFBP',
        name: 'DNFBP'
      }, {
        id: 'Fintech / Innovation Entities',
        name: 'Fintech / Innovation Entities'
      }, {
        id: 'Issuers / Token Issuers',
        name: 'Issuers / Token Issuers'
      }, {
        id: 'Professional Advisors',
        name: 'Professional Advisors'
      }, {
        id: 'Recognised Persons / Bodies / Members',
        name: 'Recognised Persons / Bodies / Members'
      }, {
        id: 'Registered Auditors',
        name: 'Registered Auditors'
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.serviceCategory, item.serviceType, item.entityType].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || data.details || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'serviceCategory',
        title: 'Service Category',
        options: data.serviceCategories || []
      }, {
        id: 'serviceType',
        title: 'Service Type',
        options: data.serviceTypes || []
      }, {
        id: 'entityType',
        title: 'Entity Type',
        options: data.entityTypes || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockNonFinancialServicesData
  },
  'knowledge-hub': {
    id: 'knowledge-hub',
    title: 'Knowledge Hub',
    description: 'Discover valuable resources, news, events, and tools to support your business journey in Abu Dhabi',
    route: '/marketplace/knowledge-hub',
    primaryCTA: 'Access Now',
    secondaryCTA: 'View Details',
    itemName: 'Knowledge Hub',
    itemNamePlural: 'Knowledge Hub',
    attributes: [{
      key: 'mediaType',
      label: 'Type',
      icon: React.createElement(FileType, { size: 18, className: "mr-2" })
    }, {
      key: 'domain',
      label: 'Domain',
      icon: React.createElement(Bookmark, { size: 18, className: "mr-2" })
    }, {
      key: 'businessStage',
      label: 'Business Stage',
      icon: React.createElement(TrendingUp, { size: 18, className: "mr-2" })
    }, {
      key: 'date',
      label: 'Published',
      icon: React.createElement(Calendar, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'content', 'provider', 'related'],
    tabs: [{
      id: 'about',
      label: 'About This Resource',
      icon: Info,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }, {
      id: 'content',
      label: 'Content',
      icon: FileText,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }, {
      id: 'provider',
      label: 'About Provider',
      icon: Building,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }],
    summarySticky: true,
    filterCategories: [{
      id: 'mediaType',
      title: 'Media Type',
      options: [{
        id: 'news',
        name: 'News'
      }, {
        id: 'article',
        name: 'Article'
      }, {
        id: 'reports',
        name: 'Reports'
      }, {
        id: 'toolkits',
        name: 'Toolkits & Templates'
      }, {
        id: 'guides',
        name: 'Guides'
      }, {
        id: 'videos',
        name: 'Videos'
      }, {
        id: 'podcasts',
        name: 'Podcasts'
      }]
    }, {
      id: 'businessStage',
      title: 'Business Stage',
      options: [
        { id: 'ideation', name: 'Ideation' },
        { id: 'launch', name: 'Launch' },
        { id: 'growth', name: 'Growth' },
        { id: 'expansion', name: 'Expansion' },
        { id: 'optimization', name: 'Optimization' },
        { id: 'transformation', name: 'Transformation' }
      ]
    }, {
      id: 'category',
      title: 'Category',
      options: [] // Populated at runtime from Taxonomy (Admin Settings)
    }, {
      id: 'format',
      title: 'Format',
      options: [{
        id: 'quickreads',
        name: 'Quick Reads'
      }, {
        id: 'indepth',
        name: 'In-Depth Reports'
      }, {
        id: 'interactive',
        name: 'Interactive Tools'
      }, {
        id: 'templates',
        name: 'Downloadable Templates'
      }, {
        id: 'recorded',
        name: 'Recorded Media'
      }, {
        id: 'live',
        name: 'Live Events'
      }]
    }, {
      id: 'popularity',
      title: 'Popularity',
      options: [{
        id: 'latest',
        name: 'Latest'
      }, {
        id: 'trending',
        name: 'Trending'
      }, {
        id: 'downloaded',
        name: 'Most Downloaded'
      }, {
        id: 'editors',
        name: "Editor's Pick"
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.mediaType, item.domain].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'mediaType',
        title: 'Media Type',
        options: data.mediaTypes || []
      }, {
        id: 'businessStage',
        title: 'Business Stage',
        options: data.businessStages || []
      }, {
        id: 'domain',
        title: 'Domain',
        options: data.domains || []
      }, {
        id: 'format',
        title: 'Format',
        options: data.formats || []
      }, {
        id: 'popularity',
        title: 'Popularity',
        options: data.popularity || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockKnowledgeHubData
  }
};
// Helper to get config by marketplace type
export const getMarketplaceConfig = (type: string): MarketplaceConfig => {
  const config = marketplaceConfig[type];
  if (!config) {
    throw new Error(`No configuration found for marketplace type: ${type}`);
  }
  return config;
};
