import { useState, useEffect } from 'react';
import KPICard from '../service-delivery-overview/components/KPICard';
import { useActiveServices, useNewServicesAdopted, useRepeatUsageRate, useProvidersEngaged, useProviderConcentration, usePortfolioMix, useServiceMixBalanceAlert, usePartnersList, useSubServicesList, useServiceTypesList, useDateRangesList, useProviderCoverage } from '../../hooks/portfolio';
import Icon from '../../components/AppIcon';
import { Button } from '../../components/ui/button';
import { useSidebar } from '../../context/SidebarContext';
import { BreadcrumbItem, Breadcrumbs } from '../../components/PageLayout';
import { MenuIcon, XIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import PortfolioMixChart from './components/PortfolioMixChart';
import PortfolioAlerts from './components/PortfolioAlerts';
import NewVsRepeatChart from './components/NewVsRepeatChart';
import ServiceDepthChart from './components/ServiceDepthChart';
import ProviderCoverageMatrix from './components/ProviderCoverageMatrix';
import CompletionTimeBoxPlot from './components/CompletionTimeBoxPlot';
import OnTimeDeliveryChart from './components/OnTimeDeliveryChart';
import StageDurationChart from './components/StageDurationChart';
import DelayReasonsChart from './components/DelayReasonsChart';
import IssueRateChart from './components/IssueRateChart';
import ServiceCSATChart from './components/ServiceCSATChart';
import {
  EnterpriseOperationsFilters,
  PortfolioKPI,
  PortfolioAlert,
  PortfolioMixData,
  NewVsRepeatData,
  ServiceDepthData,
  ProviderCoverageData,
  ServiceDeliveryKPI,
  ProviderCompletionTimeData,
  ProviderOnTimeDeliveryData,
  StageDurationData,
  DelayReasonData,
  ProviderIssueRateData,
  ServiceCSATData
} from '../../types';

const EJPEnterpriseOperationsInsightDashboard = () => {
  const [activePage, setActivePage] = useState<'portfolio' | 'delivery'>('portfolio');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);

  // Global filters
  const [globalFilters, setGlobalFilters] = useState<EnterpriseOperationsFilters>({
    dateRange: new Date().getFullYear().toString(),
    serviceType: 'all',
    subServiceType: 'all',
    provider: 'all'
  });

  // Convert dateRange to startDate and endDate
  const getDateRange = (dateRangeValue: string) => {
    const year = parseInt(dateRangeValue);
    if (!isNaN(year)) {
      return {
        startDate: `${year}-01-01T00:00:00Z`,
        endDate: `${year}-12-31T23:59:59Z`
      };
    }
    return { startDate: undefined, endDate: undefined };
  };

  const { startDate, endDate } = getDateRange(globalFilters.dateRange);

  // Map service type filter to category value
  const serviceCategoryValue = globalFilters.serviceType === 'all' ? undefined : globalFilters.serviceType;
  const providerIdValue = globalFilters.provider === 'all' ? undefined : globalFilters.provider;

  console.log('🔴 Dashboard Filters:', { globalFilters, serviceCategoryValue, providerIdValue });

  // Fetch portfolio KPIs from API
  const { data: activeServicesData } = useActiveServices(startDate, endDate, serviceCategoryValue, providerIdValue);
  const { data: newServicesData } = useNewServicesAdopted(startDate, endDate, serviceCategoryValue, providerIdValue);
  const { data: repeatUsageData } = useRepeatUsageRate(startDate, endDate, serviceCategoryValue, providerIdValue);
  const { data: providersEngagedData } = useProvidersEngaged(undefined, startDate, endDate, serviceCategoryValue, providerIdValue);
  console.log('🔴 Providers Engaged Data:', providersEngagedData);
  const { data: providerConcentrationData } = useProviderConcentration(undefined, startDate, endDate, serviceCategoryValue, providerIdValue);
  const { data: portfolioMixKpiData } = usePortfolioMix(undefined, startDate, endDate, serviceCategoryValue, providerIdValue);

  // Compute portfolio KPIs from API data
  const portfolioKPIs: PortfolioKPI = {
    activeServices: activeServicesData?.activeServicesCount || 0,
    providersEngaged: providersEngagedData?.providersEngagedCount || 0,
    newServicesAdopted: newServicesData?.newServicesAdopted || 0,
    repeatUsageRate: repeatUsageData?.repeatUsageRate || 0,
    portfolioMixFinancial: portfolioMixKpiData?.finSharePercentage || 0,
    portfolioMixNonFinancial: portfolioMixKpiData?.nonFinSharePercentage || 0,
    providerConcentrationTop1: providerConcentrationData?.top1SharePercentage || 0
  };

  const { data: serviceMixAlert } = useServiceMixBalanceAlert(startDate, endDate);
  const { data: partnersList } = usePartnersList();
  const { data: subServicesList } = useSubServicesList();
  const { data: serviceTypesList } = useServiceTypesList();
  const { data: dateRangesList } = useDateRangesList();
  const { data: providerCoverageData } = useProviderCoverage(startDate, endDate, serviceCategoryValue, providerIdValue);

  const portfolioAlerts: PortfolioAlert[] = serviceMixAlert && (serviceMixAlert.severity === 'moderate' || serviceMixAlert.severity === 'bad') 
    ? [{ ...serviceMixAlert, timestamp: new Date(serviceMixAlert.timestamp) }] 
    : [];

  const [portfolioMixData] = useState<PortfolioMixData[]>([
    { date: 'Week 1', financial: 58, nonFinancial: 42 },
    { date: 'Week 2', financial: 61, nonFinancial: 39 },
    { date: 'Week 3', financial: 63, nonFinancial: 37 },
    { date: 'Week 4', financial: 62, nonFinancial: 38 },
    { date: 'Week 5', financial: 64, nonFinancial: 36 },
    { date: 'Week 6', financial: 62, nonFinancial: 38 }
  ]);

  const [newVsRepeatData] = useState<NewVsRepeatData[]>([
    { month: 'Jan', new: 12, repeat: 45 },
    { month: 'Feb', new: 15, repeat: 52 },
    { month: 'Mar', new: 18, repeat: 48 },
    { month: 'Apr', new: 14, repeat: 55 },
    { month: 'May', new: 16, repeat: 58 },
    { month: 'Jun', new: 20, repeat: 62 }
  ]);

  const [serviceDepthData] = useState<ServiceDepthData[]>([
    { service: 'Financial Advisory', requests: 245, cumulativePercentage: 28.5 },
    { service: 'Credit Enablement', requests: 198, cumulativePercentage: 51.5 },
    { service: 'Market Access', requests: 156, cumulativePercentage: 69.3 },
    { service: 'Training & Capacity', requests: 98, cumulativePercentage: 80.7 },
    { service: 'Advisory & Mentorship', requests: 76, cumulativePercentage: 89.5 },
    { service: 'Specialist Clinics', requests: 54, cumulativePercentage: 95.8 },
    { service: 'Grants/Subsidies', requests: 35, cumulativePercentage: 100 }
  ]);



  const [serviceDeliveryKPIs] = useState<ServiceDeliveryKPI>({
    avgFirstResponseTime: 4.2,
    providerAcceptanceRate: 92.5,
    onTimeDelivery: 95.8,
    reworkRate: 3.2,
    cancellationRate: 2.1,
    csat: 4.6,
    nps: 72
  });

  const [completionTimeData] = useState<ProviderCompletionTimeData[]>([
    { provider: 'ADCB', min: 2.1, q1: 4.5, median: 6.8, q3: 9.2, max: 12.5, mean: 7.1 },
    { provider: 'FAB', min: 2.5, q1: 5.1, median: 7.5, q3: 10.1, max: 13.8, mean: 7.8 },
    { provider: 'Flat6Labs', min: 1.8, q1: 3.8, median: 5.2, q3: 7.5, max: 10.2, mean: 5.6 },
    { provider: 'ADCCI', min: 2.2, q1: 4.2, median: 6.1, q3: 8.5, max: 11.8, mean: 6.5 },
    { provider: 'RAKBANK', min: 3.1, q1: 5.8, median: 8.1, q3: 11.2, max: 15.5, mean: 8.9 }
  ]);

  const [onTimeDeliveryData] = useState<ProviderOnTimeDeliveryData[]>([
    { provider: 'ADCB', onTimePercentage: 96.8, ejpAverage: 95.8 },
    { provider: 'FAB', onTimePercentage: 95.2, ejpAverage: 95.8 },
    { provider: 'Flat6Labs', onTimePercentage: 97.8, ejpAverage: 95.8 },
    { provider: 'ADCCI', onTimePercentage: 96.9, ejpAverage: 95.8 },
    { provider: 'RAKBANK', onTimePercentage: 93.8, ejpAverage: 95.8 }
  ]);

  const [stageDurationData] = useState<StageDurationData[]>([
    { provider: 'ADCB', acceptance: 0.8, wip: 4.2, review: 1.2, completion: 0.9 },
    { provider: 'FAB', acceptance: 1.1, wip: 4.8, review: 1.5, completion: 1.1 },
    { provider: 'Flat6Labs', acceptance: 0.5, wip: 3.2, review: 0.8, completion: 0.7 },
    { provider: 'ADCCI', acceptance: 0.7, wip: 3.8, review: 1.1, completion: 0.9 },
    { provider: 'RAKBANK', acceptance: 1.2, wip: 5.2, review: 1.8, completion: 1.2 }
  ]);

  const [delayReasonsData] = useState<DelayReasonData[]>([
    { reason: 'Awaiting Documentation', count: 45, percentage: 32.1 },
    { reason: 'Scope Change', count: 28, percentage: 20.0 },
    { reason: 'Queue Delay', count: 22, percentage: 15.7 },
    { reason: 'Resource Unavailable', count: 18, percentage: 12.9 },
    { reason: 'External Dependency', count: 12, percentage: 8.6 },
    { reason: 'Quality Review', count: 10, percentage: 7.1 },
    { reason: 'Other', count: 5, percentage: 3.6 }
  ]);

  const [issueRateData] = useState<ProviderIssueRateData[]>([
    { provider: 'ADCB', issues: 3, requests: 172, issueRate: 0.017 },
    { provider: 'FAB', issues: 5, requests: 172, issueRate: 0.029 },
    { provider: 'Flat6Labs', issues: 2, requests: 89, issueRate: 0.022 },
    { provider: 'ADCCI', issues: 4, requests: 156, issueRate: 0.026 },
    { provider: 'RAKBANK', issues: 4, requests: 92, issueRate: 0.043 }
  ]);

  const [serviceCSATData] = useState<ServiceCSATData[]>([
    { service: 'Financial Advisory', csat: 4.8, average: 4.6, target: 4.5 },
    { service: 'Credit Enablement', csat: 4.6, average: 4.6, target: 4.5 },
    { service: 'Market Access', csat: 4.7, average: 4.6, target: 4.5 },
    { service: 'Training & Capacity', csat: 4.5, average: 4.6, target: 4.5 },
    { service: 'Advisory & Mentorship', csat: 4.4, average: 4.6, target: 4.5 },
    { service: 'Specialist Clinics', csat: 4.3, average: 4.6, target: 4.5 }
  ]);

  // Filter options
  const filterOptions = {
    dateRange: dateRangesList || [],
    serviceType: [
      { value: 'all', label: 'All Service Types' },
      { value: '123950000', label: 'Financial' },
      { value: '123950001', label: 'Non-Financial' }
    ],
    subServiceType: [
      { value: 'all', label: 'All Sub-Services' },
      ...(subServicesList || [])
    ],
    provider: [
      { value: 'all', label: 'All Providers' },
      ...(partnersList || []).map((partner: any) => ({
        value: partner.id,
        label: partner.name
      }))
    ]
  };

  // Update global filters
  const updateGlobalFilter = (filterKey: keyof EnterpriseOperationsFilters, value: string) => {
    setGlobalFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setGlobalFilters({
      dateRange: new Date().getFullYear().toString(),
      serviceType: 'all',
      subServiceType: 'all',
      provider: 'all'
    });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return globalFilters.dateRange !== new Date().getFullYear().toString() ||
           globalFilters.serviceType !== 'all' ||
           globalFilters.provider !== 'all';
  };

  // Format last updated time
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Simulate real-time updates
  useEffect(() => {
    if (isRealTimeActive) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30 * 1000);
      return () => clearInterval(interval);
    }
  }, [isRealTimeActive]);

  // Handle provider click from coverage matrix
  const handleProviderClick = (provider: string) => {
    setGlobalFilters(prev => ({
      ...prev,
      provider: provider.toLowerCase()
    }));
    // Optionally switch to delivery page
    // setActivePage('delivery');
  };

  const { isOpen: sidebarOpen, toggleSidebar } = useSidebar();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard/overview" },
    { label: "Experience Analytics", current: true }
  ];

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="sticky top-0 z-20 py-3 px-4 lg:px-6 bg-gray-50">
        {/* Breadcrumbs at the top */}
        <div className="flex items-center gap-3 mb-3 mt-3">
          <div className='lg:hidden'>
            <button
              className="lg:hidden text-gray-600 flex-shrink-0 z-40"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Title and action buttons */}
        <div className="flex flex-row items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Enterprise Operations Insight Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Monitor your service portfolio, provider diversity, and delivery performance.
            </p>
          </div>
          
          {/* Real-time Status */}
          <div className="flex flex-col items-end gap-3">
            <button
                onClick={() => setIsRealTimeActive(!isRealTimeActive)}
                className={`flex items-center gap-3 px-4 py-3 border rounded-xl transition-all duration-200 hover:shadow-md ${
                  isRealTimeActive
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                    : 'bg-card border-border hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isRealTimeActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`} />
                  <div className="flex flex-col">
                    <span className={`text-xs font-medium ${isRealTimeActive ? 'text-blue-900' : 'text-card-foreground'}`}>
                      {isRealTimeActive ? 'Analytics Live' : 'Updates Paused'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Updated {formatLastUpdated(lastUpdated)}
                    </span>
                  </div>
                </div>
                <Icon
                  name={isRealTimeActive ? 'Pause' : 'Play'}
                  size={14}
                  className={`${isRealTimeActive ? 'text-blue-700' : 'text-gray-600'} hover:scale-110 transition-transform`}
                />
              </button>
          </div>
        </div>
      </div>

      {/* Page Selector Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-center">
            <button
              onClick={() => setActivePage('portfolio')}
              className={`relative flex-1 px-8 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                activePage === 'portfolio'
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 justify-center">
                <Icon name="Briefcase" size={16} />
                <span>My Activity Portfolio</span>
              </div>
            </button>
            <button
              onClick={() => setActivePage('delivery')}
              className={`relative flex-1 px-8 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                activePage === 'delivery'
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 justify-center">
                <Icon name="TrendingUp" size={16} />
                <span>Service Delivery & Provider Experience</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <main className="pb-12">
        <div className="px-4 lg:px-6">
          {/* Global Filters */}
          <div className="mb-8">
            <div className="bg-white border border-border rounded-xl p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={16} className="text-blue-600" />
                      <span className="text-sm font-semibold text-foreground">Date Range</span>
                    </div>
                    <Select
                      value={globalFilters.dateRange}
                      onValueChange={(value) => updateGlobalFilter('dateRange', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.dateRange.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon name="Filter" size={16} className="text-green-600" />
                      <span className="text-sm font-semibold text-foreground">Service Type</span>
                    </div>
                    <Select
                      value={globalFilters.serviceType}
                      onValueChange={(value) => updateGlobalFilter('serviceType', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.serviceType.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon name="Building" size={16} className="text-orange-600" />
                      <span className="text-sm font-semibold text-foreground">Your Providers</span>
                    </div>
                    <Select
                      value={globalFilters.provider}
                      onValueChange={(value) => updateGlobalFilter('provider', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.provider.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Active Filter Tags */}
                {hasActiveFilters() && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon name="Tag" size={14} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs"
                      >
                        <Icon name="X" size={14} className="mr-1" />
                        Clear All
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {globalFilters.dateRange !== new Date().getFullYear().toString() && (
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                          <Icon name="Calendar" size={12} className="text-blue-600" />
                          <span className="text-xs font-medium text-blue-800">
                            {filterOptions.dateRange.find(opt => opt.value === globalFilters.dateRange)?.label}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('dateRange', 'this-week')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Icon name="X" size={10} />
                          </button>
                        </div>
                      )}
                      {globalFilters.serviceType !== 'all' && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                          <Icon name="Filter" size={12} className="text-green-600" />
                          <span className="text-xs font-medium text-green-800">
                            {filterOptions.serviceType.find(opt => opt.value === globalFilters.serviceType)?.label}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('serviceType', 'all')}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Icon name="X" size={10} />
                          </button>
                        </div>
                      )}
                      {globalFilters.provider !== 'all' && (
                        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                          <Icon name="Building" size={12} className="text-orange-600" />
                          <span className="text-xs font-medium text-orange-800">
                            {filterOptions.provider.find(opt => opt.value === globalFilters.provider)?.label}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('provider', 'all')}
                            className="text-orange-600 hover:text-orange-800"
                          >
                            <Icon name="X" size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Page 1: My Activity Portfolio */}
          {activePage === 'portfolio' && (
            <div className="space-y-8">
              {/* KPI Row */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-12 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Headlines</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Key metrics tracking your service composition, adoption patterns, and provider engagement
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Row 1 */}
                <KPICard
                  title="Active Services"
                  value={portfolioKPIs.activeServices}
                  unit=""
                  trend={portfolioKPIs.activeServices > 0 ? "up" : "neutral"}
                  trendValue={portfolioKPIs.activeServices > 0 ? "+3" : "No data"}
                  threshold={portfolioKPIs.activeServices > 0 ? "good" : "normal"}
                  description="Your distinct services with status: Submitted, In Progress, or Completed"
                  icon="Briefcase"
                  sparklineData={portfolioKPIs.activeServices > 0 ? [20, 21, 22, 23, 24] : []}
                  target="20"
                />
                <KPICard
                  title="New Services Adopted"
                  value={portfolioKPIs.newServicesAdopted}
                  unit=""
                  trend={portfolioKPIs.newServicesAdopted > 0 ? "up" : "neutral"}
                  trendValue={portfolioKPIs.newServicesAdopted > 0 ? "+1" : "No data"}
                  threshold={portfolioKPIs.newServicesAdopted > 0 ? "good" : "normal"}
                  description="New services you've requested for the first time in this period"
                  icon="PlusCircle"
                  sparklineData={portfolioKPIs.newServicesAdopted > 0 ? [2, 2, 3, 3, 3] : []}
                  target="2"
                />
                <KPICard
                  title="Repeat Usage Rate"
                  value={portfolioKPIs.repeatUsageRate}
                  unit="%"
                  trend={portfolioKPIs.repeatUsageRate > 0 ? "up" : "neutral"}
                  trendValue={portfolioKPIs.repeatUsageRate > 0 ? "+2.5%" : "No data"}
                  threshold={portfolioKPIs.repeatUsageRate > 0 ? "good" : "normal"}
                  description="Percentage of your services used 2 or more times"
                  icon="Repeat"
                  sparklineData={portfolioKPIs.repeatUsageRate > 0 ? [65, 66, 67, 67.5, 68] : []}
                  target="65%"
                />

                {/* Row 2 */}
                <KPICard
                  title="Providers Engaged"
                  value={portfolioKPIs.providersEngaged}
                  unit=""
                  trend={portfolioKPIs.providersEngaged > 0 ? "up" : "neutral"}
                  trendValue={portfolioKPIs.providersEngaged > 0 ? "+1" : "No data"}
                  threshold={portfolioKPIs.providersEngaged > 0 ? "good" : "normal"}
                  description="Number of distinct service providers you've engaged with"
                  icon="Users"
                  sparklineData={portfolioKPIs.providersEngaged > 0 ? [7, 7, 8, 8, 8] : []}
                  target="7"
                />
                <KPICard
                  title="Provider Concentration (Top-1 Share)"
                  value={portfolioKPIs.providerConcentrationTop1}
                  unit="%"
                  trend={portfolioKPIs.providerConcentrationTop1 > 0 ? "down" : "neutral"}
                  trendValue={portfolioKPIs.providerConcentrationTop1 > 0 ? "-2%" : "No data"}
                  threshold={portfolioKPIs.providerConcentrationTop1 > 40 ? 'warning' : portfolioKPIs.providerConcentrationTop1 > 0 ? 'good' : 'normal'}
                  description="Your requests to your top provider / Your total requests"
                  icon="TrendingDown"
                  sparklineData={portfolioKPIs.providerConcentrationTop1 > 0 ? [38, 37, 36, 35.5, 35] : []}
                  target="< 40%"
                />
                <KPICard
                  title="Your Portfolio Mix (Fin vs Non-Fin)"
                  value={`${portfolioKPIs.portfolioMixFinancial}/${portfolioKPIs.portfolioMixNonFinancial}`}
                  unit="%"
                  trend={portfolioKPIs.portfolioMixFinancial > 0 || portfolioKPIs.portfolioMixNonFinancial > 0 ? "neutral" : "neutral"}
                  trendValue={portfolioKPIs.portfolioMixFinancial > 0 || portfolioKPIs.portfolioMixNonFinancial > 0 ? "Stable" : "No data"}
                  threshold="normal"
                  description="Your service requests split by Financial vs Non-Financial services"
                  icon="PieChart"
                  sparklineData={portfolioKPIs.portfolioMixFinancial > 0 || portfolioKPIs.portfolioMixNonFinancial > 0 ? [60, 61, 62, 62, 62] : []}
                  target="60/40"
                />
              </div>

              {/* Section A: Portfolio Trends & Alerts */}
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Trends & Alerts</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Your service mix trends over time and automated alerts for portfolio health
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <PortfolioMixChart startDate={startDate} endDate={endDate} serviceCategory={serviceCategoryValue} providerId={providerIdValue} />
                  </div>
                  <div className="lg:col-span-1">
                    <PortfolioAlerts alerts={portfolioAlerts} />
                  </div>
                </div>
              </div>

              {/* Section B: Adoption & Depth */}
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Service Adoption & Depth</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Your service adoption patterns and portfolio concentration analysis
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <NewVsRepeatChart year={parseInt(globalFilters.dateRange)} serviceCategory={serviceCategoryValue} providerId={providerIdValue} />
                  <ServiceDepthChart startDate={startDate} endDate={endDate} serviceCategory={serviceCategoryValue} providerId={providerIdValue} />
                </div>
              </div>

              {/* Section C: Provider Breadth & Concentration */}
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Provider Coverage & Concentration</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Service coverage matrix showing which providers serve which of your services, highlighting dependencies and quality risks
                    </p>
                  </div>
                </div>
                
                <ProviderCoverageMatrix data={providerCoverageData || []} onProviderClick={handleProviderClick} startDate={startDate} endDate={endDate} serviceCategory={serviceCategoryValue} providerId={providerIdValue} />
              </div>
            </div>
          )}

          {/* Page 2: Service Delivery & Provider Experience */}
          {activePage === 'delivery' && (
            <div className="space-y-8">
              {/* KPI Row */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-12 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Service Delivery Headlines</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Key metrics tracking how your service providers perform — responsiveness, SLA adherence, and service quality
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KPICard
                  title="Avg First Response Time"
                  value={serviceDeliveryKPIs.avgFirstResponseTime}
                  unit=" hrs"
                  trend="down"
                  trendValue="-0.3h"
                  threshold="good"
                  description="Average time for providers to respond to your service requests"
                  icon="Clock"
                  sparklineData={[4.8, 4.6, 4.4, 4.3, 4.2]}
                  target="< 5h"
                />
                <KPICard
                  title="Provider Acceptance Rate"
                  value={serviceDeliveryKPIs.providerAcceptanceRate}
                  unit="%"
                  trend="up"
                  trendValue="+1.2%"
                  threshold="good"
                  description="Percentage of your service requests accepted by providers"
                  icon="CheckCircle"
                  sparklineData={[91, 91.5, 92, 92.2, 92.5]}
                  target="90%"
                />
                <KPICard
                  title="On-Time Delivery (SLA %)"
                  value={serviceDeliveryKPIs.onTimeDelivery}
                  unit="%"
                  trend="up"
                  trendValue="+0.8%"
                  threshold="good"
                  description="Percentage of your services completed within SLA deadlines"
                  icon="Target"
                  sparklineData={[94.5, 95, 95.2, 95.5, 95.8]}
                  target="95%"
                />
                <KPICard
                  title="Rework Rate"
                  value={serviceDeliveryKPIs.reworkRate}
                  unit="%"
                  trend="down"
                  trendValue="-0.5%"
                  threshold="good"
                  description="Percentage of your completed services that required reopening/rework"
                  icon="RotateCcw"
                  sparklineData={[3.8, 3.6, 3.4, 3.3, 3.2]}
                  target="< 4%"
                />
                <KPICard
                  title="Cancellation Rate"
                  value={serviceDeliveryKPIs.cancellationRate}
                  unit="%"
                  trend="down"
                  trendValue="-0.2%"
                  threshold="good"
                  description="Percentage of your service requests that were cancelled"
                  icon="XCircle"
                  sparklineData={[2.4, 2.3, 2.2, 2.15, 2.1]}
                  target="< 3%"
                />
                <KPICard
                  title="Your CSAT / NPS"
                  value={`${serviceDeliveryKPIs.csat}/${serviceDeliveryKPIs.nps}`}
                  unit=""
                  trend="up"
                  trendValue="+0.2/+3"
                  threshold="good"
                  description="Your average satisfaction rating and Net Promoter Score for services received"
                  icon="Star"
                  sparklineData={[4.4, 4.5, 4.5, 4.55, 4.6]}
                  target="4.5/70"
                />
              </div>

              {/* Section A: Provider Performance */}
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-light text-foreground mb-2">Performance of Your Providers</h3>
                    <p className="text-sm text-muted-foreground">
                      How your service providers perform — completion time distributions and on-time delivery rates
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CompletionTimeBoxPlot data={completionTimeData} />
                  <OnTimeDeliveryChart data={onTimeDeliveryData} />
                </div>
              </div>

              {/* Section B: Lifecycle Diagnostics */}
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-light text-foreground mb-2">Your Service Lifecycle Diagnostics</h3>
                    <p className="text-sm text-muted-foreground">
                      Breakdown of time spent in each delivery stage and analysis of delays for your service requests
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <StageDurationChart data={stageDurationData} />
                  <DelayReasonsChart data={delayReasonsData} />
                </div>
              </div>

              {/* Section C: Quality & Experience */}
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-light text-foreground mb-2">Quality & Your Experience</h3>
                    <p className="text-sm text-muted-foreground">
                      Issue rates and your satisfaction ratings by provider and service type
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <IssueRateChart data={issueRateData} />
                  <ServiceCSATChart data={serviceCSATData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EJPEnterpriseOperationsInsightDashboard;

