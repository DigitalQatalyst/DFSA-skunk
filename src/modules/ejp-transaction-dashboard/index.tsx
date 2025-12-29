import { useState, useEffect } from 'react';
import KPICard from './components/KPICard';
import ServicePerformanceChart from './components/ServicePerformanceChart';
import EnterpriseOutcomesChart from './components/EnterpriseOutcomesChart';
import OperationalMetricsChart from './components/OperationalMetricsChart';
import RealTimeAlerts from './components/RealTimeAlerts';
import FunnelChart from './components/FunnelChart';
import HeatmapChart from './components/HeatmapChart';
import RadarChart from './components/RadarChart';
import DonutChart from './components/DonutChart';
import ScatterPlot from './components/ScatterPlot';
import GaugeChart from './components/GaugeChart';
// New ShadCN UI chart components
import ClusteredBarChart from './components/ClusteredBarChart';
import LineChartWithRange from './components/LineChartWithRange';
import BarChartWithGradient from './components/BarChartWithGradient';
import CompletionHeatmapChart from './components/CompletionHeatmapChart';
import StackedBarChart from './components/StackedBarChart';
import ComboLineChart from './components/ComboLineChart';
import LineChartWithTrend from './components/LineChartWithTrend';
import AlertPanel from './components/AlertPanel';
import ChartTheme from './components/ChartTheme';
import Icon from '../../components/AppIcon';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import DataService, { DashboardData } from '../../backend/lib/dataService';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

const EJPTransactionDashboard = () => {
  const [topLevelTab, setTopLevelTab] = useState('operations');
  const [activeTab, setActiveTab] = useState('service-adoption');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);
  const [alerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'High Drop-off Rate',
      message: 'Onboarding drop-off rate increased to 18%',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      title: 'Activation Spike',
      message: 'Service activation rate reached 85%',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      severity: 'low'
    }
  ]);

  // Global filters
  const [globalFilters, setGlobalFilters] = useState({
    dateRange: 'this-week',
    serviceCategory: 'all',
    subServiceType: 'all',
    region: 'all',
    enterpriseSize: 'all',
    industry: 'all',
    partnerType: 'all'
  });

  // Data loaded via DataService (replaces hardcoded arrays)
  const [loadedData, setLoadedData] = useState<DashboardData | null>(null);

  useEffect(() => {
    let isMounted = true;
    // Normalize keys to expected service filters
    const serviceFilters = {
      dateRange: (globalFilters.dateRange as any).replace(/\s/g, '-') as any,
      serviceCategory: globalFilters.serviceCategory as any,
      subServiceType: globalFilters.subServiceType as any,
      region: globalFilters.region as any,
      enterpriseSize: (globalFilters.enterpriseSize as any).replace(/\s.*/,'') as any,
    } as any;
    DataService.fetchDashboardData(serviceFilters).then((resp) => {
      if (isMounted) setLoadedData(resp);
    });
    return () => { isMounted = false; };
  }, [globalFilters]);

  // Apply filters to loaded datasets (Service Type / Sub-Service Type)
  const filteredData = loadedData;

  // Top-level tab configuration
  const topLevelTabs = [
    { id: 'market', label: 'Market', icon: 'TrendingUp' },
    { id: 'strategic', label: 'Strategic', icon: 'Target' },
    { id: 'operations', label: 'Operations', icon: 'Settings' }
  ];

  // Tab configuration
  const dashboardTabs = [
    { id: 'service-adoption', label: 'Service Adoption & Reach', icon: 'Users' },
    { id: 'service-performance', label: 'Service Performance & Delivery Quality', icon: 'Target' },
    { id: 'enterprise-outcomes', label: 'Enterprise Outcomes & Impact', icon: 'TrendingUp' },
    { id: 'enterprise-usage-impact', label: 'Enterprise Usage & Impact', icon: 'Building' },
    { id: 'operational-risk', label: 'Operational & Risk Metrics', icon: 'AlertTriangle' }
  ];

  // Filter options
  const filterOptions = {
    dateRange: [
      { value: 'this-week', label: 'This Week' },
      { value: 'last-week', label: 'Last Week' },
      { value: 'this-quarter', label: 'This Quarter' },
      { value: 'this-year', label: 'This Year' }
    ],
    serviceCategory: [
      { value: 'all', label: 'All Types' },
      { value: 'financial', label: 'Financial' },
      { value: 'non-financial', label: 'Non Financial' }
    ],
    subServiceType: [
      { value: 'all', label: 'All Sub-Services' },
      { value: 'onboarding', label: 'Onboarding' },
      { value: 'activation', label: 'Activation' },
      { value: 'advisory', label: 'Advisory' },
      { value: 'training', label: 'Training' }
    ],
    region: [
      { value: 'all', label: 'All Regions' },
      { value: 'uae', label: 'UAE' },
      { value: 'gcc', label: 'GCC' },
      { value: 'mena', label: 'MENA' },
      { value: 'global', label: 'Global' }
    ],
    enterpriseSize: [
      { value: 'all', label: 'All Sizes' },
      { value: 'micro', label: 'Micro (1-5 employees)' },
      { value: 'small', label: 'Small (6-50 employees)' },
      { value: 'medium', label: 'Medium (51-250 employees)' },
      { value: 'large', label: 'Large (250+ employees)' }
    ],
    industry: [
      { value: 'all', label: 'All Industries' },
      { value: 'technology', label: 'Technology' },
      { value: 'finance', label: 'Finance' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'retail', label: 'Retail' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'services', label: 'Services' }
    ],
    partnerType: [
      { value: 'all', label: 'All Partner Types' },
      { value: 'bank', label: 'Bank' },
      { value: 'consultant', label: 'Consultant' },
      { value: 'incubator', label: 'Incubator' },
      { value: 'accelerator', label: 'Accelerator' }
    ]
  };

  // Update global filters
  const updateGlobalFilter = (filterKey: string, value: string) => {
    setGlobalFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setGlobalFilters({
      dateRange: 'this-week',
      serviceCategory: 'all',
      subServiceType: 'all',
      region: 'all',
      enterpriseSize: 'all',
      industry: 'all',
      partnerType: 'all'
    });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return globalFilters.dateRange !== 'this-week' ||
           globalFilters.serviceCategory !== 'all' ||
           globalFilters.subServiceType !== 'all' ||
           globalFilters.region !== 'all' ||
           globalFilters.enterpriseSize !== 'all' ||
           globalFilters.industry !== 'all' ||
           globalFilters.partnerType !== 'all';
  };

  // Get filter label for display
  const getFilterLabel = (filterKey: string, value: string) => {
    const options = filterOptions[filterKey as keyof typeof filterOptions];
    const option = options?.find((opt: any) => opt.value === value);
    return option?.label || value;
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    return date?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Service Adoption & Reach Metrics (1-4) - Based on Table Metrics
  const serviceAdoptionMetrics = loadedData?.serviceAdoptionMetrics ?? [];

  // Service Performance & Delivery Quality Metrics (7-11) - Based on Table Metrics
  const servicePerformanceMetrics = loadedData?.servicePerformanceMetrics ?? [];

  // Enterprise Outcomes & Impact Metrics (12-14, 19-24) - Based on Table Metrics
  const enterpriseOutcomesMetrics = loadedData?.enterpriseOutcomesMetrics ?? [];

  // Operational & Risk Metrics (15-18) - Based on Table Metrics
  const operationalMetrics = loadedData?.operationalMetrics ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Top-Level Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-center">
            {topLevelTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTopLevelTab(tab.id)}
                className={`relative flex-1 px-8 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  topLevelTab === tab.id ?
                  'text-blue-600 bg-blue-50 border-b-2 border-blue-500' :
                  'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                tabIndex={0}
                role="tab"
                aria-selected={topLevelTab === tab.id}
                aria-controls={`top-level-${tab.id}`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 py-8">
            <div className="space-y-3">
              {topLevelTab === 'operations' && (
                <>
              <h1 className="text-4xl font-light text-foreground tracking-tight">
                Service Provider Operations Dashboard (EJP Transactions)
              </h1>
              <p className="text-base text-muted-foreground max-w-4xl leading-relaxed">
                Track and analyze service provider operations for EJP Transactions with real-time metrics, 
                service adoption insights, performance indicators, and enterprise outcomes for strategic decision-making.
              </p>
                </>
              )}
              
              {topLevelTab === 'market' && (
                <>
                  <h1 className="text-4xl font-light text-foreground tracking-tight">
                    Market Analytics Dashboard
                  </h1>
                  <p className="text-base text-muted-foreground max-w-4xl leading-relaxed">
                    Comprehensive market intelligence and competitive analysis for EJP Transaction services, 
                    including market trends, customer segments, and growth opportunities.
                  </p>
                </>
              )}
              
              {topLevelTab === 'strategic' && (
                <>
                  <h1 className="text-4xl font-light text-foreground tracking-tight">
                    Strategic Planning Dashboard
                  </h1>
                  <p className="text-base text-muted-foreground max-w-4xl leading-relaxed">
                    Executive-level insights and strategic planning tools for EJP Transaction services, 
                    including business performance, strategic initiatives, and long-term planning metrics.
                  </p>
                </>
              )}
            </div>
            
            {/* Real-time Status */}
            <div className="flex flex-col items-end gap-3">
              <button
                onClick={() => setIsRealTimeActive(!isRealTimeActive)}
                className={`flex items-center gap-3 px-4 py-3 border rounded-xl transition-all duration-200 hover:shadow-md ${
                  isRealTimeActive ?
                  'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'bg-card border-border hover:bg-gray-50'
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
      </div>

      {/* Dashboard Tabs - Operations active; Market/Strategic show TBU placeholders */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-center">
            {topLevelTab === 'operations'
              ? (
                dashboardTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 px-8 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeTab === tab.id ?
                  'text-blue-600 bg-blue-50 border-b-2 border-blue-500' :
                  'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                tabIndex={0}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`dashboard-${tab.id}`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </div>
              </button>
                ))
              ) : (
                dashboardTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={
                      'relative flex-1 px-8 py-4 text-sm font-medium whitespace-nowrap text-gray-400 bg-gray-50 cursor-not-allowed border-b-2 border-transparent'
                    }
                    aria-disabled="true"
                    role="tab"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <Icon name={tab.icon} size={16} />
                      <span>TBU</span>
                    </div>
                  </button>
                ))
              )}
          </div>
        </div>
      </div>

      {topLevelTab === 'operations' && (
      <main className="pb-12 px-8 pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Global Filters */}
          <div className="mb-8">
            <div className="bg-white border border-border rounded-xl p-6">
              <div className="space-y-4">
                <div className={`grid grid-cols-1 md:grid-cols-2 ${activeTab === 'enterprise-usage-impact' ? 'lg:grid-cols-5' : 'lg:grid-cols-5'} gap-6`}>
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
                  
                  {activeTab === 'enterprise-usage-impact' ? (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon name="Building" size={16} className="text-green-600" />
                          <span className="text-sm font-semibold text-foreground">Industry</span>
                        </div>
                        <Select
                          value={globalFilters.industry}
                          onValueChange={(value) => updateGlobalFilter('industry', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.industry.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon name="Users" size={16} className="text-purple-600" />
                          <span className="text-sm font-semibold text-foreground">Enterprise Size</span>
                        </div>
                        <Select
                          value={globalFilters.enterpriseSize}
                          onValueChange={(value) => updateGlobalFilter('enterpriseSize', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select enterprise size" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.enterpriseSize.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon name="Layers" size={16} className="text-orange-600" />
                          <span className="text-sm font-semibold text-foreground">Service Category</span>
                        </div>
                        <Select
                          value={globalFilters.serviceCategory}
                          onValueChange={(value) => updateGlobalFilter('serviceCategory', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select service category" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.serviceCategory.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon name="Handshake" size={16} className="text-indigo-600" />
                          <span className="text-sm font-semibold text-foreground">Partner Type</span>
                        </div>
                        <Select
                          value={globalFilters.partnerType}
                          onValueChange={(value) => updateGlobalFilter('partnerType', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select partner type" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.partnerType.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon name="Filter" size={16} className="text-green-600" />
                          <span className="text-sm font-semibold text-foreground">Service Type</span>
                        </div>
                        <Select
                          value={globalFilters.serviceCategory}
                          onValueChange={(value) => updateGlobalFilter('serviceCategory', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.serviceCategory.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon name="Layers" size={16} className="text-purple-600" />
                          <span className="text-sm font-semibold text-foreground">Sub-Service Type</span>
                        </div>
                        <Select
                          value={globalFilters.subServiceType}
                          onValueChange={(value) => updateGlobalFilter('subServiceType', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select sub-service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.subServiceType.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={16} className="text-orange-600" />
                          <span className="text-sm font-semibold text-foreground">Region</span>
                        </div>
                        <Select
                          value={globalFilters.region}
                          onValueChange={(value) => updateGlobalFilter('region', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.region.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon name="Building" size={16} className="text-indigo-600" />
                          <span className="text-sm font-semibold text-foreground">Enterprise Size</span>
                        </div>
                        <Select
                          value={globalFilters.enterpriseSize}
                          onValueChange={(value) => updateGlobalFilter('enterpriseSize', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select enterprise size" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.enterpriseSize.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
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
                      {globalFilters.dateRange !== 'this-month' && (
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                          <Icon name="Calendar" size={12} className="text-blue-600" />
                          <span className="text-xs font-medium text-blue-800">
                            {getFilterLabel('dateRange', globalFilters.dateRange)}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('dateRange', 'this-month')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Icon name="X" size={10} />
                          </button>
                        </div>
                      )}
                      
                      {globalFilters.serviceCategory !== 'all' && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                          <Icon name="Filter" size={12} className="text-green-600" />
                          <span className="text-xs font-medium text-green-800">
                            {getFilterLabel('serviceCategory', globalFilters.serviceCategory)}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('serviceCategory', 'all')}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Icon name="X" size={10} />
                          </button>
                        </div>
                      )}
                      
                      {globalFilters.subServiceType !== 'all' && (
                        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-3 py-1">
                          <Icon name="Layers" size={12} className="text-purple-600" />
                          <span className="text-xs font-medium text-purple-800">
                            {getFilterLabel('subServiceType', globalFilters.subServiceType)}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('subServiceType', 'all')}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <Icon name="X" size={10} />
                          </button>
                        </div>
                      )}
                      
                      {globalFilters.region !== 'all' && (
                        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                          <Icon name="MapPin" size={12} className="text-orange-600" />
                          <span className="text-xs font-medium text-orange-800">
                            {getFilterLabel('region', globalFilters.region)}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('region', 'all')}
                            className="text-orange-600 hover:text-orange-800"
                          >
                            <Icon name="X" size={10} />
                          </button>
                        </div>
                      )}
                      
                      {globalFilters.enterpriseSize !== 'all' && (
                        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1">
                          <Icon name="Building" size={12} className="text-indigo-600" />
                          <span className="text-xs font-medium text-indigo-800">
                            {getFilterLabel('enterpriseSize', globalFilters.enterpriseSize)}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('enterpriseSize', 'all')}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <Icon name="X" size={10} />
                          </button>
                        </div>
                      )}
                      
                      {activeTab === 'enterprise-usage-impact' && globalFilters.industry !== 'all' && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                          <Icon name="Building" size={12} className="text-green-600" />
                          <span className="text-xs font-medium text-green-800">
                            {getFilterLabel('industry', globalFilters.industry)}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('industry', 'all')}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Icon name="X" size={10} />
                          </button>
                        </div>
                      )}
                      
                      {activeTab === 'enterprise-usage-impact' && globalFilters.partnerType !== 'all' && (
                        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1">
                          <Icon name="Handshake" size={12} className="text-indigo-600" />
                          <span className="text-xs font-medium text-indigo-800">
                            {getFilterLabel('partnerType', globalFilters.partnerType)}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('partnerType', 'all')}
                            className="text-indigo-600 hover:text-indigo-800"
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

          {/* Dashboard Content */}
          {activeTab === 'service-adoption' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-12 rounded-full" style={{ backgroundColor: ChartTheme.base.primaryBlue }}></div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light text-foreground mb-2">Service Adoption & Reach Headlines</h3>
                  <p className="text-sm text-muted-foreground">
                    Key metrics tracking total engaged enterprises, activation rates, usage patterns, and retention across EJP Transaction services
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {serviceAdoptionMetrics.map((metric, index) => (
                  <KPICard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    unit={metric.unit}
                    trend={metric.trend}
                    trendValue={metric.trendValue}
                    threshold={metric.threshold}
                    description={metric.description}
                    icon={metric.icon}
                    sparklineData={metric.sparklineData}
                    target={metric.target}
                  />
                ))}
              </div>
              
              {/* Service Activation and Onboarding Performance Section */}
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 rounded-full" style={{ backgroundColor: ChartTheme.base.primaryBlue }}></div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-light text-foreground mb-2">Service Onboarding and Activation Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Service activation and onboarding performance metrics showing conversion rates and enterprise engagement
                    </p>
                  </div>
                </div>
                
                {/* Top Section - Clustered Bar Chart + Alert Panel */}
                <div className="grid grid-cols-1 xl:grid-cols-7 gap-6 mb-8">
                  {/* Clustered Bar Chart */}
                  <div className="xl:col-span-5">
                    <ClusteredBarChart
                      title="Onboarding & Activation"
                      description="Tracks how efficiently enterprises complete onboarding and activate services each month, highlighting conversion effectiveness across touchpoints."
                      data={filteredData?.onboardingActivation ?? []}
                      height="h-80"
                    />
                          </div>
                          
                  {/* Alert Panel */}
                  <div className="xl:col-span-2">
                    <AlertPanel
                      title="Alerts"
                      description="Real-time alerts for critical changes in onboarding and activation metrics with severity indicators."
                      alerts={[
                        {
                          title: 'Activation Rate dropped −3 pts below target',
                          date: 'Sep 15',
                          context: 'Down from 60% → 57%',
                          severity: 'high'
                        },
                        {
                          title: 'Avg. Time to Activation spiked to 2.1 days',
                          date: 'Sep 20',
                          context: 'Highest in 3 months',
                          severity: 'medium'
                        },
                        {
                          title: 'Onboarding Stability maintained',
                          date: 'Sep 22',
                          context: 'Flat trend',
                          severity: 'low'
                        }
                      ]}
                    />
                              </div>
                            </div>
                            
                {/* Middle Section - Two Charts */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  {/* Time to Activation Line Chart */}
                    <LineChartWithRange
                      title="Time to Activation"
                      description="Measures the average days taken from service signup to first active use, indicating the speed and efficiency of enterprise activation."
                      data={filteredData?.timeToActivation ?? []}
                      height="h-64"
                      insightText="Lowest in Aug: 1.3d; Sep up to 2.1d (+0.8d)"
                      insightMonth="Aug"
                    />
                            
                  {/* Drop-off Rate During Onboarding Bar Chart */}
                    <BarChartWithGradient
                      title="Drop-off Rate During Onboarding"
                      description="Shows the percentage of enterprises abandoning the onboarding process, helping identify friction points that reduce activation success."
                      data={filteredData?.dropoff ?? []}
                      height="h-64"
                      thresholds={{ low: 10, moderate: 15 }}
                    />
                      </div>
                          
                {/* Bottom Section - Heat Map */}
                  <CompletionHeatmapChart
                    title="Completion Rate of Onboarding Tasks"
                    description="Displays task-level completion rates across months, revealing which onboarding steps most affect enterprise readiness and retention."
                    data={filteredData?.onboardingTasksHeatmap ?? []}
                    tasks={[
                      'Account Setup',
                      'First Transaction',
                      'Training Completion',
                      'Service Configuration',
                      'Contract Upload',
                      'KYC Verification'
                    ]}
                    months={Array.from(new Set((filteredData?.onboardingTasksHeatmap ?? []).map(p => p.month)))}
                    height="h-96"
                  />
              </div>

              {/* Service Usage and Loyalty Section */}
              <div className="mt-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-12 rounded-full" style={{ backgroundColor: ChartTheme.base.primaryBlue }}></div>
                <div className="flex-1">
                    <h3 className="text-2xl font-light text-foreground mb-2">Service Usage and Loyalty</h3>
                  <p className="text-sm text-muted-foreground">
                      Enterprise usage patterns, frequency analysis, and retention metrics across different service categories
                  </p>
                </div>
              </div>
              
                {/* Row 1 - Two Charts Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Chart A - Active User Rate */}
                  <LineChartWithTrend
                    title="Active User Rate"
                    description="Monitors the proportion of enterprises actively using services month-to-month, reflecting platform adoption and sustained engagement."
                    data={filteredData?.activeUserRate ?? []}
                    height="h-80"
                    ariaDescription="Monthly active user rate with bars and 3-month trendline."
                  />
              
                  {/* Chart B - Repeat Usage Rate */}
                  <StackedBarChart
                    title="Repeat Usage Rate"
                    description="Breaks down repeat versus first-time users to reveal behavioral loyalty and the success of re-engagement strategies."
                    data={filteredData?.repeatUsage ?? []}
                    height="h-80"
                    ariaDescription="Stacked bars showing monthly first-time and repeat users, total usage, and proportion of repeats."
                  />
                  </div>
              
                {/* Row 2 - Churn & Retention Over Time */}
                <ComboLineChart
                  title="Churn & Retention Over Time"
                  description="Combines churn and retention trends to highlight customer stability, early warning signals, and long-term enterprise loyalty performance."
                  data={filteredData?.churnRetention ?? []}
                  height="h-96"
                  ariaDescription="Dual-axis view of monthly churn and retention rates with moving averages."
                />
              </div>
            </div>
          )}

          {activeTab === 'service-performance' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-12 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light text-foreground mb-2">Service Performance & Delivery Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    Performance metrics tracking service delivery efficiency, success rates, system reliability, and error management for EJP Transactions
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicePerformanceMetrics.map((metric, index) => (
                  <KPICard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    unit={metric.unit}
                    trend={metric.trend}
                    trendValue={metric.trendValue}
                    threshold={metric.threshold}
                    description={metric.description}
                    icon={metric.icon}
                    sparklineData={metric.sparklineData}
                    target={metric.target}
                  />
                ))}
              </div>
              
              {/* Enhanced Service Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GaugeChart
                  title="System Uptime"
                  description="Percentage of time systems are operational and available for service delivery"
                  value={loadedData?.servicePerformance?.systemUptime ?? 0}
                  maxValue={100}
                  unit="%"
                  thresholds={{ warning: 95, critical: 99 }}
                />
                
                <ScatterPlot
                  title="Delivery Time vs Success Rate"
                  description="Correlation between service delivery time and success rate across different service categories"
                  xAxisLabel="Delivery Time (days)"
                  yAxisLabel="Success Rate (%)"
                  data={[
                    { x: 2.1, y: 99.5, label: 'Financial Services' },
                    { x: 3.2, y: 99.2, label: 'Non-Financial Services' },
                    { x: 4.1, y: 98.8, label: 'Advisory Services' },
                    { x: 2.8, y: 99.7, label: 'Training Services' },
                    { x: 3.5, y: 98.9, label: 'Support Services' },
                    { x: 2.9, y: 99.3, label: 'Consulting Services' }
                  ]}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ServicePerformanceChart 
                  data={loadedData?.servicePerformance ?? {}} 
                  description="Comprehensive performance metrics including delivery times, success rates, system uptime, and error management"
                />
                
                <HeatmapChart
                  title="Error Rate by Service & Region"
                  description="Error rates percentage across different service categories and geographical regions"
                  xAxisLabel="Service Category"
                  yAxisLabel="Region"
                  data={[
                    { x: 'Financial', y: 'UAE', value: 0.3 },
                    { x: 'Financial', y: 'GCC', value: 0.5 },
                    { x: 'Financial', y: 'MENA', value: 0.8 },
                    { x: 'Financial', y: 'Global', value: 1.2 },
                    { x: 'Non-Financial', y: 'UAE', value: 0.4 },
                    { x: 'Non-Financial', y: 'GCC', value: 0.6 },
                    { x: 'Non-Financial', y: 'MENA', value: 0.9 },
                    { x: 'Non-Financial', y: 'Global', value: 1.4 },
                    { x: 'Advisory', y: 'UAE', value: 0.2 },
                    { x: 'Advisory', y: 'GCC', value: 0.4 },
                    { x: 'Advisory', y: 'MENA', value: 0.7 },
                    { x: 'Advisory', y: 'Global', value: 1.1 },
                    { x: 'Training', y: 'UAE', value: 0.1 },
                    { x: 'Training', y: 'GCC', value: 0.3 },
                    { x: 'Training', y: 'MENA', value: 0.6 },
                    { x: 'Training', y: 'Global', value: 0.9 }
                  ]}
                />
              </div>
            </div>
          )}

          {activeTab === 'enterprise-outcomes' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-12 rounded-full bg-purple-500"></div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light text-foreground mb-2">Enterprise Outcomes & Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Impact metrics measuring customer satisfaction, revenue generation via EJP channels, and return on investment for service operations
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {enterpriseOutcomesMetrics.map((metric, index) => (
                  <KPICard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    unit={metric.unit}
                    trend={metric.trend}
                    trendValue={metric.trendValue}
                    threshold={metric.threshold}
                    description={metric.description}
                    icon={metric.icon}
                    sparklineData={metric.sparklineData}
                    target={metric.target}
                  />
                ))}
              </div>
              
              {/* Enhanced Enterprise Outcomes Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RadarChart
                  title="Digital Transformation Score"
                  description="Multi-dimensional assessment of digital transformation maturity across key capability areas"
                  data={[
                    { metric: 'Digital Adoption', value: 85, maxValue: 100 },
                    { metric: 'Process Automation', value: 78, maxValue: 100 },
                    { metric: 'Data Analytics', value: 92, maxValue: 100 },
                    { metric: 'Cloud Integration', value: 88, maxValue: 100 },
                    { metric: 'Security Compliance', value: 95, maxValue: 100 },
                    { metric: 'User Experience', value: 82, maxValue: 100 }
                  ]}
                />
                
                <DonutChart
                  title="Revenue Distribution by Channel"
                  description="Breakdown of total revenue generated across different sales and partner channels"
                  data={[
                    { label: 'EJP Channel', value: 2450000, color: '#3b82f6', percentage: 65 },
                    { label: 'Direct Sales', value: 980000, color: '#10b981', percentage: 26 },
                    { label: 'Partner Channel', value: 350000, color: '#f59e0b', percentage: 9 }
                  ]}
                  centerText="£3.78M"
                  centerSubtext="Total Revenue"
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EnterpriseOutcomesChart 
                  data={loadedData?.enterpriseOutcomes ?? {}} 
                  description="Comprehensive analytics tracking customer satisfaction, engagement, revenue impact, and return on investment"
                />
                
                <ScatterPlot
                  title="Customer Satisfaction vs Revenue Impact"
                  description="Correlation analysis between customer satisfaction scores and revenue growth across service categories"
                  xAxisLabel="CSAT Score"
                  yAxisLabel="Revenue Growth (%)"
                  data={[
                    { x: 4.2, y: 12, label: 'Financial Services', color: '#3b82f6' },
                    { x: 4.6, y: 18, label: 'Non-Financial Services', color: '#10b981' },
                    { x: 4.4, y: 15, label: 'Advisory Services', color: '#f59e0b' },
                    { x: 4.8, y: 22, label: 'Training Services', color: '#ef4444' },
                    { x: 4.5, y: 16, label: 'Support Services', color: '#8b5cf6' },
                    { x: 4.7, y: 20, label: 'Consulting Services', color: '#06b6d4' }
                  ]}
                />
              </div>
            </div>
          )}

          {activeTab === 'enterprise-usage-impact' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-12 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light text-foreground mb-2">Enterprise Usage & Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Track and analyze enterprise activity, service delivery efficiency, satisfaction, and engagement trends across your portfolio.
                  </p>
                </div>
              </div>

              {/* Headlines Section */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <h4 className="text-xl font-light text-foreground mb-2">Headlines</h4>
                    <p className="text-sm text-muted-foreground">
                      Core metrics summarizing enterprise activity, service delivery efficiency, and satisfaction.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Active Enterprises',
                      value: '1,247',
                      unit: '',
                      trend: 'up' as const,
                      trendValue: '+12%',
                      threshold: 'good' as const,
                      description: 'Enterprises with active or recent service requests',
                      icon: 'Building',
                      sparklineData: [1200, 1210, 1220, 1230, 1240, 1247],
                      target: '1,200'
                    },
                    {
                      title: 'Total Services Availed',
                      value: '8,542',
                      unit: '',
                      trend: 'up' as const,
                      trendValue: '+8%',
                      threshold: 'good' as const,
                      description: 'Total number of services requested this period',
                      icon: 'Briefcase',
                      sparklineData: [8000, 8100, 8200, 8300, 8400, 8542],
                      target: '8,000'
                    },
                    {
                      title: 'Average Service Utilization',
                      value: '6.8',
                      unit: '',
                      trend: 'up' as const,
                      trendValue: '+0.3',
                      threshold: 'good' as const,
                      description: 'Mean number of active services per enterprise',
                      icon: 'BarChart',
                      sparklineData: [6.2, 6.3, 6.4, 6.5, 6.6, 6.8],
                      target: '6.5'
                    },
                    {
                      title: 'SLA Compliance Rate',
                      value: '94.2',
                      unit: '%',
                      trend: 'up' as const,
                      trendValue: '+2.1%',
                      threshold: 'good' as const,
                      description: '% of enterprise services delivered within SLA',
                      icon: 'Clock',
                      sparklineData: [90, 91, 92, 93, 94, 94.2],
                      target: '95%'
                    },
                    {
                      title: 'Service Success Rate',
                      value: '97.8',
                      unit: '%',
                      trend: 'up' as const,
                      trendValue: '+1.2%',
                      threshold: 'excellent' as const,
                      description: '% of successful enterprise transactions',
                      icon: 'CheckCircle',
                      sparklineData: [96, 96.5, 97, 97.2, 97.5, 97.8],
                      target: '97%'
                    },
                    {
                      title: 'Enterprise Satisfaction Score',
                      value: '4.6',
                      unit: '/5.0',
                      trend: 'up' as const,
                      trendValue: '+0.2',
                      threshold: 'excellent' as const,
                      description: 'Average satisfaction across active enterprises',
                      icon: 'MessageSquare',
                      sparklineData: [4.2, 4.3, 4.4, 4.5, 4.5, 4.6],
                      target: '4.5'
                    }
                  ].map((kpi, index) => (
                    <KPICard
                      key={index}
                      title={kpi.title}
                      value={kpi.value}
                      unit={kpi.unit}
                      trend={kpi.trend}
                      trendValue={kpi.trendValue}
                      threshold={kpi.threshold}
                      description={kpi.description}
                      icon={kpi.icon}
                      sparklineData={kpi.sparklineData}
                      target={kpi.target}
                    />
                  ))}
                </div>
              </div>

              {/* Enterprise Portfolio Composition Section */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <h4 className="text-xl font-light text-foreground mb-2">Enterprise Portfolio Composition</h4>
                    <p className="text-sm text-muted-foreground">
                      Explore the distribution and makeup of enterprises by sector, region, and engagement level.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Enterprise Distribution by Industry */}
                  <div className="bg-white border border-border rounded-xl p-6">
                    <h5 className="text-lg font-medium text-foreground mb-4">Enterprise Distribution by Industry</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { name: 'Technology', value: 320, fill: '#3b82f6' },
                        { name: 'Finance', value: 280, fill: '#10b981' },
                        { name: 'Healthcare', value: 195, fill: '#f59e0b' },
                        { name: 'Retail', value: 180, fill: '#ef4444' },
                        { name: 'Manufacturing', value: 152, fill: '#8b5cf6' },
                        { name: 'Services', value: 120, fill: '#06b6d4' }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8">
                          {[
                            { name: 'Technology', value: 320, fill: '#3b82f6' },
                            { name: 'Finance', value: 280, fill: '#10b981' },
                            { name: 'Healthcare', value: 195, fill: '#f59e0b' },
                            { name: 'Retail', value: 180, fill: '#ef4444' },
                            { name: 'Manufacturing', value: 152, fill: '#8b5cf6' },
                            { name: 'Services', value: 120, fill: '#06b6d4' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Enterprise Distribution by Business Stage */}
                  <div className="bg-white border border-border rounded-xl p-6">
                    <h5 className="text-lg font-medium text-foreground mb-4">Enterprise Distribution by Business Stage</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { stage: 'Startup', count: 420 },
                        { stage: 'Growth', count: 380 },
                        { stage: 'Established', count: 287 },
                        { stage: 'Mature', count: 160 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stage" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top 10 Enterprises by Service Request Volume */}
                <div className="bg-white border border-border rounded-xl p-6 mb-6">
                  <h5 className="text-lg font-medium text-foreground mb-4">Top 10 Enterprises by Service Request Volume</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'TechCorp Solutions', volume: 245 },
                      { name: 'FinanceHub Inc', volume: 198 },
                      { name: 'HealthCare Plus', volume: 176 },
                      { name: 'RetailMax Group', volume: 154 },
                      { name: 'Manufacturing Pro', volume: 142 },
                      { name: 'ServiceMaster Ltd', volume: 128 },
                      { name: 'Digital Dynamics', volume: 115 },
                      { name: 'Enterprise Solutions', volume: 98 },
                      { name: 'Business Partners Co', volume: 87 },
                      { name: 'Growth Ventures', volume: 76 }
                    ]} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="volume" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Portfolio Summary Table */}
                <div className="bg-white border border-border rounded-xl p-6">
                  <h5 className="text-lg font-medium text-foreground mb-4">Portfolio Summary</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Enterprise Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Industry</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Region</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">SLA %</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Satisfaction</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Active Services</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'TechCorp Solutions', industry: 'Technology', region: 'UAE', sla: '98.5%', satisfaction: '4.8', activeServices: 12 },
                          { name: 'FinanceHub Inc', industry: 'Finance', region: 'GCC', sla: '96.2%', satisfaction: '4.6', activeServices: 10 },
                          { name: 'HealthCare Plus', industry: 'Healthcare', region: 'MENA', sla: '94.8%', satisfaction: '4.5', activeServices: 9 },
                          { name: 'RetailMax Group', industry: 'Retail', region: 'UAE', sla: '97.1%', satisfaction: '4.7', activeServices: 11 },
                          { name: 'Manufacturing Pro', industry: 'Manufacturing', region: 'GCC', sla: '95.3%', satisfaction: '4.4', activeServices: 8 }
                        ].map((enterprise, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-foreground">{enterprise.name}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{enterprise.industry}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{enterprise.region}</td>
                            <td className="py-3 px-4 text-sm text-foreground font-medium">{enterprise.sla}</td>
                            <td className="py-3 px-4 text-sm text-foreground font-medium">{enterprise.satisfaction}</td>
                            <td className="py-3 px-4 text-sm text-foreground">{enterprise.activeServices}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Alerts & Operational Exceptions Section */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 rounded-full bg-red-500"></div>
                  <div className="flex-1">
                    <h4 className="text-xl font-light text-foreground mb-2">Alerts & Operational Exceptions</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time alerts on SLA breaches, delays, or declining enterprise engagement.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      id: 1,
                      type: 'critical',
                      title: 'Enterprises with SLA Breaches (Last 7 Days)',
                      message: '12 enterprises experienced SLA breaches in the last 7 days',
                      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                      severity: 'high'
                    },
                    {
                      id: 2,
                      type: 'warning',
                      title: 'High Delay Alerts by Service Category',
                      message: 'Advisory services showing 15% increase in average delay time',
                      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                      severity: 'medium'
                    },
                    {
                      id: 3,
                      type: 'warning',
                      title: 'Declining Activity Alerts',
                      message: '8 enterprises showing declining engagement over the past month',
                      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                      severity: 'medium'
                    },
                    {
                      id: 4,
                      type: 'info',
                      title: 'Resolved vs Unresolved Exceptions',
                      message: '45 exceptions resolved, 12 still pending resolution',
                      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
                      severity: 'low'
                    }
                  ].map((alert) => (
                    <div
                      key={alert.id}
                      className={`bg-white border-l-4 rounded-lg p-6 ${
                        alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                        alert.type === 'warning' ? 'border-amber-500 bg-amber-50' :
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon
                          name={alert.type === 'critical' ? 'AlertTriangle' : alert.type === 'warning' ? 'AlertCircle' : 'Info'}
                          size={20}
                          className={
                            alert.type === 'critical' ? 'text-red-600' :
                            alert.type === 'warning' ? 'text-amber-600' :
                            'text-blue-600'
                          }
                        />
                        <div className="flex-1">
                          <h5 className="text-base font-semibold text-foreground mb-2">{alert.title}</h5>
                          <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatLastUpdated(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise Engagement Trends Section */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 rounded-full bg-purple-500"></div>
                  <div className="flex-1">
                    <h4 className="text-xl font-light text-foreground mb-2">Enterprise Engagement Trends</h4>
                    <p className="text-sm text-muted-foreground">
                      Track service demand, utilization, and engagement changes over time.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Service Requests by New vs Repeated Users Over Time */}
                  <div className="bg-white border border-border rounded-xl p-6">
                    <h5 className="text-lg font-medium text-foreground mb-4">Service Requests by New vs Repeated Users Over Time</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={[
                        { month: 'Jan', new: 320, repeated: 580 },
                        { month: 'Feb', new: 340, repeated: 620 },
                        { month: 'Mar', new: 360, repeated: 650 },
                        { month: 'Apr', new: 380, repeated: 680 },
                        { month: 'May', new: 400, repeated: 720 },
                        { month: 'Jun', new: 420, repeated: 750 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="new" stroke="#3b82f6" name="New Enterprises" />
                        <Line type="monotone" dataKey="repeated" stroke="#10b981" name="Repeated Users" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Enterprise Drop off Rate Over Time */}
                  <div className="bg-white border border-border rounded-xl p-6">
                    <h5 className="text-lg font-medium text-foreground mb-4">Enterprise Drop off Rate Over Time</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { month: 'Jan', rate: 8.2 },
                        { month: 'Feb', rate: 7.8 },
                        { month: 'Mar', rate: 7.5 },
                        { month: 'Apr', rate: 7.1 },
                        { month: 'May', rate: 6.8 },
                        { month: 'Jun', rate: 6.5 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rate" fill="#ef4444" name="Drop off Rate (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Average Completion Time by Enterprise Size Over Time */}
                <div className="bg-white border border-border rounded-xl p-6">
                  <h5 className="text-lg font-medium text-foreground mb-4">Average Completion Time by Enterprise Size Over Time</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { month: 'Jan', micro: 2.1, small: 3.2, medium: 4.5, large: 5.8 },
                      { month: 'Feb', micro: 2.0, small: 3.1, medium: 4.4, large: 5.7 },
                      { month: 'Mar', micro: 1.9, small: 3.0, medium: 4.3, large: 5.6 },
                      { month: 'Apr', micro: 1.8, small: 2.9, medium: 4.2, large: 5.5 },
                      { month: 'May', micro: 1.7, small: 2.8, medium: 4.1, large: 5.4 },
                      { month: 'Jun', micro: 1.6, small: 2.7, medium: 4.0, large: 5.3 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="micro" stackId="a" fill="#3b82f6" name="Micro" />
                      <Bar dataKey="small" stackId="a" fill="#10b981" name="Small" />
                      <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium" />
                      <Bar dataKey="large" stackId="a" fill="#ef4444" name="Large" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Enterprise Satisfaction & Feedback Section */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 rounded-full bg-indigo-500"></div>
                  <div className="flex-1">
                    <h4 className="text-xl font-light text-foreground mb-2">Enterprise Satisfaction & Feedback</h4>
                    <p className="text-sm text-muted-foreground">
                      Measure enterprise satisfaction and capture insights from feedback across service categories.
                    </p>
                  </div>
                </div>

                {/* Satisfaction Score Over Time */}
                <div className="bg-white border border-border rounded-xl p-6">
                  <h5 className="text-lg font-medium text-foreground mb-4">Satisfaction Score Over Time</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { month: 'Jan', score: 4.2 },
                      { month: 'Feb', score: 4.3 },
                      { month: 'Mar', score: 4.4 },
                      { month: 'Apr', score: 4.5 },
                      { month: 'May', score: 4.5 },
                      { month: 'Jun', score: 4.6 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[4.0, 5.0]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} name="Satisfaction Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'operational-risk' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-12 rounded-full bg-red-500"></div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light text-foreground mb-2">Operational & Risk Metrics</h3>
                  <p className="text-sm text-muted-foreground">
                    Operational metrics tracking support ticket volume, resolution times, escalation rates, and risk management for EJP Transaction services
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {operationalMetrics.map((metric, index) => (
                  <KPICard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    unit={metric.unit}
                    trend={metric.trend}
                    trendValue={metric.trendValue}
                    threshold={metric.threshold}
                    description={metric.description}
                    icon={metric.icon}
                    sparklineData={metric.sparklineData}
                    target={metric.target}
                  />
                ))}
              </div>
              
              {/* Enhanced Operational Risk Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FunnelChart
                  title="Ticket Resolution Funnel"
                  description="Visualizes the progressive reduction of support tickets through resolution stages, highlighting conversion rates"
                  data={[
                    { stage: 'Tickets Received', value: 156, percentage: 100, color: '#3b82f6' },
                    { stage: 'First Response', value: 142, percentage: 91, color: '#10b981' },
                    { stage: 'In Progress', value: 128, percentage: 82, color: '#f59e0b' },
                    { stage: 'Resolved', value: 118, percentage: 76, color: '#ef4444' }
                  ]}
                />
                
                <GaugeChart
                  title="First-Time Resolution Rate"
                  description="Percentage of support tickets resolved on first contact without escalation or follow-up"
                  value={75.6}
                  maxValue={100}
                  unit="%"
                  thresholds={{ warning: 70, critical: 85 }}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OperationalMetricsChart 
                  data={loadedData?.operationalMetrics ?? {}} 
                  description="Comprehensive operational metrics tracking support volume, resolution times, SLA compliance, and risk alerts"
                />
                
                <HeatmapChart
                  title="SLA Breach Risk by Service & Region"
                  description="Risk levels for SLA breaches across different service categories and geographical regions"
                  xAxisLabel="Service Category"
                  yAxisLabel="Region"
                  data={[
                    { x: 'Financial', y: 'UAE', value: 0.2 },
                    { x: 'Financial', y: 'GCC', value: 0.4 },
                    { x: 'Financial', y: 'MENA', value: 0.8 },
                    { x: 'Financial', y: 'Global', value: 1.2 },
                    { x: 'Non-Financial', y: 'UAE', value: 0.3 },
                    { x: 'Non-Financial', y: 'GCC', value: 0.5 },
                    { x: 'Non-Financial', y: 'MENA', value: 0.9 },
                    { x: 'Non-Financial', y: 'Global', value: 1.4 },
                    { x: 'Advisory', y: 'UAE', value: 0.1 },
                    { x: 'Advisory', y: 'GCC', value: 0.3 },
                    { x: 'Advisory', y: 'MENA', value: 0.6 },
                    { x: 'Advisory', y: 'Global', value: 1.0 },
                    { x: 'Training', y: 'UAE', value: 0.0 },
                    { x: 'Training', y: 'GCC', value: 0.2 },
                    { x: 'Training', y: 'MENA', value: 0.5 },
                    { x: 'Training', y: 'Global', value: 0.8 }
                  ]}
                />
              </div>
            </div>
          )}

        </div>
      </main>
      )}

      {topLevelTab === 'market' && (
        <main className="pb-12 px-8 pt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon name="TrendingUp" size={32} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-light text-foreground mb-4">Market Dashboard</h2>
                <p className="text-muted-foreground mb-6">This dashboard is currently under construction.</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-yellow-800">
                    Market analytics and insights will be available here soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {topLevelTab === 'strategic' && (
        <main className="pb-12 px-8 pt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon name="Target" size={32} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-light text-foreground mb-4">Strategic Dashboard</h2>
                <p className="text-muted-foreground mb-6">This dashboard is currently under construction.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    Strategic planning and executive insights will be available here soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default EJPTransactionDashboard;




