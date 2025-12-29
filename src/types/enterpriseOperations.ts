// Types for EJP Enterprise Operations Insight Dashboard

export interface EnterpriseOperationsFilters {
  dateRange: 'this-week' | 'last-week' | 'this-quarter' | 'this-year';
  serviceType: string;
  subServiceType: string;
  provider: string;
}

export interface PortfolioKPI {
  activeServices: number;
  providersEngaged: number;
  newServicesAdopted: number;
  repeatUsageRate: number;
  portfolioMixFinancial: number;
  portfolioMixNonFinancial: number;
  providerConcentrationTop1: number;
}

export interface PortfolioAlert {
  id: string;
  type: 'over-concentration' | 'portfolio-drift' | 'coverage-gap';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low' | 'bad' | 'moderate' | 'good';
  timestamp: Date;
}

export interface PortfolioMixData {
  date: string;
  financial: number;
  nonFinancial: number;
}

export interface NewVsRepeatData {
  month: string;
  new: number;
  repeat: number;
}

export interface ServiceDepthData {
  service: string;
  requests: number;
  cumulativePercentage: number;
}

export interface ProviderCoverageData {
  provider: string;
  serviceType: string;
  requestCount: number;
  distinctServices: number;
  subServices?: string[];
  onTimePercentage?: number;
  issueRate?: number;
  isHighVolume?: boolean;
  isQualityRisk?: boolean;
}

export interface ServiceDeliveryKPI {
  avgFirstResponseTime: number; // hours
  providerAcceptanceRate: number; // percentage
  onTimeDelivery: number; // percentage
  reworkRate: number; // percentage
  cancellationRate: number; // percentage
  csat: number; // rating
  nps: number; // score
}

export interface ProviderCompletionTimeData {
  provider: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  mean: number;
}

export interface ProviderOnTimeDeliveryData {
  provider: string;
  onTimePercentage: number;
  ejpAverage: number;
}

export interface StageDurationData {
  provider: string;
  acceptance: number;
  wip: number;
  review: number;
  completion: number;
}

export interface DelayReasonData {
  reason: string;
  count: number;
  percentage: number;
}

export interface ProviderIssueRateData {
  provider: string;
  issues: number;
  requests: number;
  issueRate: number;
}

export interface ServiceCSATData {
  service: string;
  csat: number;
  average: number;
  target: number;
}

