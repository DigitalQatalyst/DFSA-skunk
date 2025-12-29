import React, { useState, useEffect } from 'react';
import KPICard from '../service-delivery-overview/components/KPICard';
import RealTimeAlerts from '../service-delivery-overview/components/RealTimeAlerts';
import Icon from '../../components/AppIcon';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
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

const EnterpriseUsageImpact = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);

  // Global filters
  const [globalFilters, setGlobalFilters] = useState({
    dateRange: 'this-week',
    industry: 'all',
    enterpriseSize: 'all',
    serviceCategory: 'all',
    partnerType: 'all'
  });

  // Filter options
  const filterOptions = {
    dateRange: [
      { value: 'this-week', label: 'This Week' },
      { value: 'last-week', label: 'Last Week' },
      { value: 'this-month', label: 'This Month' },
      { value: 'this-quarter', label: 'This Quarter' },
      { value: 'this-year', label: 'This Year' }
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
    enterpriseSize: [
      { value: 'all', label: 'All Sizes' },
      { value: 'micro', label: 'Micro (1-5 employees)' },
      { value: 'small', label: 'Small (6-50 employees)' },
      { value: 'medium', label: 'Medium (51-250 employees)' },
      { value: 'large', label: 'Large (250+ employees)' }
    ],
    serviceCategory: [
      { value: 'all', label: 'All Categories' },
      { value: 'financial', label: 'Financial' },
      { value: 'non-financial', label: 'Non Financial' },
      { value: 'advisory', label: 'Advisory' },
      { value: 'training', label: 'Training' }
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
      industry: 'all',
      enterpriseSize: 'all',
      serviceCategory: 'all',
      partnerType: 'all'
    });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return globalFilters.dateRange !== 'this-week' ||
           globalFilters.industry !== 'all' ||
           globalFilters.enterpriseSize !== 'all' ||
           globalFilters.serviceCategory !== 'all' ||
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

  // Headlines KPI Data
  const headlinesKPIs = [
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
  ];

  // Enterprise Distribution by Industry (Tree map data)
  const enterpriseDistributionByIndustry = [
    { name: 'Technology', value: 320, fill: '#3b82f6' },
    { name: 'Finance', value: 280, fill: '#10b981' },
    { name: 'Healthcare', value: 195, fill: '#f59e0b' },
    { name: 'Retail', value: 180, fill: '#ef4444' },
    { name: 'Manufacturing', value: 152, fill: '#8b5cf6' },
    { name: 'Services', value: 120, fill: '#06b6d4' }
  ];

  // Enterprise Distribution by Business Stage
  const enterpriseDistributionByStage = [
    { stage: 'Startup', count: 420 },
    { stage: 'Growth', count: 380 },
    { stage: 'Established', count: 287 },
    { stage: 'Mature', count: 160 }
  ];

  // Top 10 Enterprises by Service Request Volume
  const topEnterprisesByVolume = [
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
  ];

  // Portfolio Summary Table Data
  const portfolioSummary = [
    { name: 'TechCorp Solutions', industry: 'Technology', region: 'UAE', sla: '98.5%', satisfaction: '4.8', activeServices: 12 },
    { name: 'FinanceHub Inc', industry: 'Finance', region: 'GCC', sla: '96.2%', satisfaction: '4.6', activeServices: 10 },
    { name: 'HealthCare Plus', industry: 'Healthcare', region: 'MENA', sla: '94.8%', satisfaction: '4.5', activeServices: 9 },
    { name: 'RetailMax Group', industry: 'Retail', region: 'UAE', sla: '97.1%', satisfaction: '4.7', activeServices: 11 },
    { name: 'Manufacturing Pro', industry: 'Manufacturing', region: 'GCC', sla: '95.3%', satisfaction: '4.4', activeServices: 8 }
  ];

  // Service Requests by New vs Repeated Users Over Time
  const serviceRequestsOverTime = [
    { month: 'Jan', new: 320, repeated: 580 },
    { month: 'Feb', new: 340, repeated: 620 },
    { month: 'Mar', new: 360, repeated: 650 },
    { month: 'Apr', new: 380, repeated: 680 },
    { month: 'May', new: 400, repeated: 720 },
    { month: 'Jun', new: 420, repeated: 750 }
  ];

  // Average Completion Time by Enterprise Size Over Time
  const completionTimeBySize = [
    { month: 'Jan', micro: 2.1, small: 3.2, medium: 4.5, large: 5.8 },
    { month: 'Feb', micro: 2.0, small: 3.1, medium: 4.4, large: 5.7 },
    { month: 'Mar', micro: 1.9, small: 3.0, medium: 4.3, large: 5.6 },
    { month: 'Apr', micro: 1.8, small: 2.9, medium: 4.2, large: 5.5 },
    { month: 'May', micro: 1.7, small: 2.8, medium: 4.1, large: 5.4 },
    { month: 'Jun', micro: 1.6, small: 2.7, medium: 4.0, large: 5.3 }
  ];

  // Enterprise Drop off Rate Over Time
  const dropOffRateOverTime = [
    { month: 'Jan', rate: 8.2 },
    { month: 'Feb', rate: 7.8 },
    { month: 'Mar', rate: 7.5 },
    { month: 'Apr', rate: 7.1 },
    { month: 'May', rate: 6.8 },
    { month: 'Jun', rate: 6.5 }
  ];

  // Satisfaction Score Over Time
  const satisfactionOverTime = [
    { month: 'Jan', score: 4.2 },
    { month: 'Feb', score: 4.3 },
    { month: 'Mar', score: 4.4 },
    { month: 'Apr', score: 4.5 },
    { month: 'May', score: 4.5 },
    { month: 'Jun', score: 4.6 }
  ];

  // Alerts data
  const alerts = [
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
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 py-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-light text-foreground tracking-tight">
                Enterprise Usage & Impact
              </h1>
              <p className="text-base text-muted-foreground max-w-4xl leading-relaxed">
                Track and analyze enterprise activity, service delivery efficiency, satisfaction, and engagement trends across your portfolio.
              </p>
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

      <main className="pb-12 px-8 pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Global Filters */}
          <div className="mb-8">
            <div className="bg-white border border-border rounded-xl p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                      {globalFilters.dateRange !== 'this-week' && (
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                          <Icon name="Calendar" size={12} className="text-blue-600" />
                          <span className="text-xs font-medium text-blue-800">
                            {getFilterLabel('dateRange', globalFilters.dateRange)}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('dateRange', 'this-week')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Icon name="X" size={10} />
                          </button>
                        </div>
                      )}
                      
                      {globalFilters.industry !== 'all' && (
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
                      
                      {globalFilters.enterpriseSize !== 'all' && (
                        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-3 py-1">
                          <Icon name="Users" size={12} className="text-purple-600" />
                          <span className="text-xs font-medium text-purple-800">
                            {getFilterLabel('enterpriseSize', globalFilters.enterpriseSize)}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('enterpriseSize', 'all')}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <Icon name="X" size={10} />
                          </button>
                        </div>
                      )}
                      
                      {globalFilters.serviceCategory !== 'all' && (
                        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                          <Icon name="Layers" size={12} className="text-orange-600" />
                          <span className="text-xs font-medium text-orange-800">
                            {getFilterLabel('serviceCategory', globalFilters.serviceCategory)}
                          </span>
                          <button
                            onClick={() => updateGlobalFilter('serviceCategory', 'all')}
                            className="text-orange-600 hover:text-orange-800"
                          >
                            <Icon name="X" size={10} />
                          </button>
                        </div>
                      )}
                      
                      {globalFilters.partnerType !== 'all' && (
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

          {/* Headlines Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-12 rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <h2 className="text-2xl font-light text-foreground mb-2">Headlines</h2>
                <p className="text-sm text-muted-foreground">
                  Core metrics summarizing enterprise activity, service delivery efficiency, and satisfaction.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {headlinesKPIs.map((kpi, index) => (
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
                <h2 className="text-2xl font-light text-foreground mb-2">Enterprise Portfolio Composition</h2>
                <p className="text-sm text-muted-foreground">
                  Explore the distribution and makeup of enterprises by sector, region, and engagement level.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Tree map: Enterprise Distribution by Industry */}
              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Enterprise Distribution by Industry</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={enterpriseDistributionByIndustry}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      {enterpriseDistributionByIndustry.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Bar: Enterprise Distribution by Business Stage */}
              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Enterprise Distribution by Business Stage</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={enterpriseDistributionByStage}>
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
              <h3 className="text-lg font-medium text-foreground mb-4">Top 10 Enterprises by Service Request Volume</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topEnterprisesByVolume} layout="vertical">
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
              <h3 className="text-lg font-medium text-foreground mb-4">Portfolio Summary</h3>
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
                    {portfolioSummary.map((enterprise, index) => (
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
                <h2 className="text-2xl font-light text-foreground mb-2">Alerts & Operational Exceptions</h2>
                <p className="text-sm text-muted-foreground">
                  Real-time alerts on SLA breaches, delays, or declining enterprise engagement.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alerts.map((alert) => (
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
                      <h3 className="text-base font-semibold text-foreground mb-2">{alert.title}</h3>
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
                <h2 className="text-2xl font-light text-foreground mb-2">Enterprise Engagement Trends</h2>
                <p className="text-sm text-muted-foreground">
                  Track service demand, utilization, and engagement changes over time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Line Chart: Service Requests by new enterprise / repeated user Over Time */}
              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Service Requests by New vs Repeated Users Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={serviceRequestsOverTime}>
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

              {/* Bar Chart: Enterprise Drop off Rate Over time */}
              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Enterprise Drop off Rate Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dropOffRateOverTime}>
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

            {/* Stacked Bar: Average Completion Time by Enterprise Size Over time */}
            <div className="bg-white border border-border rounded-xl p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Average Completion Time by Enterprise Size Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={completionTimeBySize}>
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
                <h2 className="text-2xl font-light text-foreground mb-2">Enterprise Satisfaction & Feedback</h2>
                <p className="text-sm text-muted-foreground">
                  Measure enterprise satisfaction and capture insights from feedback across service categories.
                </p>
              </div>
            </div>

            {/* Trend Line: Satisfaction Score Over Time */}
            <div className="bg-white border border-border rounded-xl p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Satisfaction Score Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={satisfactionOverTime}>
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
      </main>
    </div>
  );
};

export default EnterpriseUsageImpact;

