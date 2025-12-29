export type ServiceRequestStatus =
  | "submitted"
  | "in-progress"
  | "approved"
  | "rejected";
export interface ServiceRequest {
  id: string;
  serviceName: string;
  category: string;
  status: ServiceRequestStatus;
  submittedDate: string;
  lastUpdated?: string; // Last modified date
  sla?: number; // Optional SLA in days
  serviceProvider?: string; // Added service provider field
  description?: string;
  entityType?: "opportunity" | "case"; // Track the source entity type
  requestedBy: {
    id: string;
    name: string;
    email: string;
    company: string;
    phone?: string;
    mobilephone?: string;
    fullname: string;
    jobtitle?: string;

    // Address Information
    address1_line1?: string;
    address1_line2?: string;
    address1_line3?: string;
    address1_city?: string;
    address1_stateorprovince?: string;
    address1_country?: string;
    address1_postalcode?: string;
    kf_address?: string;
    kf_city?: string;

    // Business Information
    kf_companyname?: string;
    kf_industry?: string;
    kf_employeecount?: number;
    kf_businesstype?: string;
    kf_businessrequirements?: string;
    kf_businesspitch?: string;
    kf_businessneeds?: string;
    kf_fundingneedsusd?: number;
    kf_initialcapitalusd?: number;
    kf_registrationnumber?: string;
    kf_foundingyear?: string;
    kf_establishmentdate?: string;
    kf_founders?: string;

    // Onboarding Information
    onboardingId?: string;
    companyName?: string;
    fundingNeedsUSD?: number;
    businessRequirements?: string;
    address?: string;
    website?: string;
    emailAddress?: string;
    employeeCount?: number;
    initialCapitalUSD?: number;
    businessPitch?: string;
    phoneNumber?: string;
    registrationNumber?: string;
    foundingYear?: string;
    contactName?: string;
    city?: string;
    industry?: string;
    founders?: string;
    establishmentDate?: string;

    // Role/Access Information
    kf_accessroles?: number | string | null;

    // Status flags
    hasAccount: boolean;
    hasContact: boolean;
    hasOnboarding: boolean;
    fetchedAt: string;
  };
  approvers?: Array<{
    id: string;
    name: string;
    role: string;
    status: "pending" | "approved" | "rejected";
    date?: string;
    comments?: string;
  }>;
}
export interface DateRangeFilter {
  startDate: string | null;
  endDate: string | null;
}

//Analytics Types
// Common types used throughout the application

export interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  partner: string;
  service: string;
  timestamp: Date;
  action: string;
  status: 'active' | 'acknowledged' | 'in-progress';
}

export interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string | number;
  change?: string;
  description?: string;
  icon?: string;
  target?: string;
  className?: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface GlobalFilters {
  dateRange: string;
  serviceCategory: string;
  partnerType: string;
  region: string;
}

export interface DashboardTab {
  id: string;
  label: string;
}

export interface DashboardTabsConfig {
  [key: string]: DashboardTab[];
}

export interface StageData {
  stage: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  mean: number;
  outliers: number[];
  description: string;
  sampleSize: number;
  financial: {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    mean: number;
  };
  capability: {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    mean: number;
  };
}

export interface BoxPlotProps {
  [key: string]: any;
}

export interface CustomBoxPlotProps {
  [key: string]: any;
}

// Export enterprise operations types
export * from './enterpriseOperations';


