import { useState, useEffect } from 'react';
import KPICard from './components/KPICard';
import AIInsights from './components/AllInsights';
import ServiceFunnelChart from './components/ServiceFunnelChart';
import ServiceLifecycleFunnelChart from './components/ServiceLifecycleFunnelChart';
import AverageResponseTimeChart from './components/AverageResponseTimeChart';
import StageCycleTimeChart from './components/StageCycleTimeChart';
import EfficiencyMatrixHeatmap from './components/EfficiencyMatrixHeatmap';
import RealTimeAlerts from './components/RealTimeAlerts';
import Icon from '../../components/AppIcon';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/Checkbox';
import ReactECharts from 'echarts-for-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  LabelList
} from 'recharts';

const EJPOperationsDashboard = () => {
  // Tab navigation state
  const [activeSegmentTab, setActiveSegmentTab] = useState('operations-internal');
  const [activeDashboardTab, setActiveDashboardTab] = useState('operations');
  const [activeSecondLayerTab, setActiveSecondLayerTab] = useState('service-delivery-performance');
  
  // Dynamic dashboard state
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Core state management
  const [globalFilters, setGlobalFilters] = useState({
    dateRange: 'this-month',
    serviceCategory: 'all',
    partnerType: 'all',
    region: 'all',
    enterpriseSize: 'all',
    transactionType: 'all',
    industry: 'all'
  });

  // Layer-specific contextual filters
  const [contextualFilters, setContextualFilters] = useState({
    diagnostic: {
      rootCauseFactor: 'all',
      partner: 'all',
      slaStatus: 'all',
      delaySource: 'all'
    },
    predictive: {
      forecastHorizon: '3-months',
      confidenceLevel: '95',
      modelVersion: 'latest',
      seasonality: 'enabled'
    },
    prescriptive: {
      optimizationGoal: 'sla-improvement',
      budgetCap: 'unlimited',
      resourceCap: 'current',
      targetKPI: 'sla-compliance',
      constraints: 'none'
    },
    cognitive: {
      agentObjective: 'efficiency',
      automationMode: 'supervised',
      guardrails: 'standard',
      changeWindow: 'maintenance'
    }
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (isRealTimeActive) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30 * 1000);
      return () => clearInterval(interval);
    }
  }, [isRealTimeActive]);

  // Analytics layer configuration
  const analyticsLayers = [
  {
    id: 'descriptive',
    label: 'Descriptive – What Happened',
    color: 'blue',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'diagnostic',
    label: 'Diagnostic – Why It Happened',
    color: 'amber',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-50'
  },
  {
    id: 'predictive',
    label: 'Predictive – What\'s Next',
    color: 'green',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-50'
  },
  {
    id: 'prescriptive',
    label: 'Prescriptive – What To Do',
    color: 'purple',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'cognitive',
    label: 'Cognitive – AI In Action',
    color: 'teal',
    borderColor: 'border-teal-500',
    bgColor: 'bg-teal-50'
  }];

  // Mock data for charts
  const enterpriseSatisfactionData = [
    { name: 'NPS Score', value: 72, fill: '#14b8a6' },
    { name: 'CSAT', value: 85, fill: '#06b6d4' },
    { name: 'Target', value: 90, fill: '#e5e7eb' }
  ];

  const repeatUsageData = [
    { month: 'Jan', rate: 45 },
    { month: 'Feb', rate: 48 },
    { month: 'Mar', rate: 52 },
    { month: 'Apr', rate: 55 },
    { month: 'May', rate: 58 },
    { month: 'Jun', rate: 62 }
  ];

  const conversionFunnelData = [
    { stage: 'Applications', value: 1000, fill: '#06b6d4' },
    { stage: 'Under Review', value: 850, fill: '#3b82f6' },
    { stage: 'Approved', value: 720, fill: '#14b8a6' },
    { stage: 'Completed', value: 680, fill: '#10b981' }
  ];

  const growthImpactData = [
    { category: 'Jobs Created', value: 2450 },
    { category: 'Revenue (M)', value: 145 },
    { category: 'Exports (M)', value: 87 }
  ];

  const errorRateTrendData = [
    { month: 'Jan', rate: 3.2 },
    { month: 'Feb', rate: 2.9 },
    { month: 'Mar', rate: 3.1 },
    { month: 'Apr', rate: 2.8 },
    { month: 'May', rate: 2.5 },
    { month: 'Jun', rate: 2.8 }
  ];

  const pendingRequestsData = [
    { month: 'Jan', requests: 142 },
    { month: 'Feb', requests: 135 },
    { month: 'Mar', requests: 158 },
    { month: 'Apr', requests: 163 },
    { month: 'May', requests: 149 },
    { month: 'Jun', requests: 156 }
  ];

  // Risk Layer datasets (for additional charts)
  const riskByCategoryData = [
    { category: 'Fraud', incidents: 18 },
    { category: 'Service Failure', incidents: 26 },
    { category: 'Security', incidents: 12 },
    { category: 'Compliance', incidents: 9 },
    { category: 'Data', incidents: 15 }
  ];

  const alertResponseGauge = [{ name: 'Response', value: 72 }];

  const riskAlertTypes = [
    { type: 'System Failure', value: 32, fill: '#ef4444' },
    { type: 'Fraud', value: 24, fill: '#f87171' },
    { type: 'Security', value: 18, fill: '#fca5a5' },
    { type: 'Compliance', value: 14, fill: '#fb923c' },
    { type: 'Other', value: 12, fill: '#fbbf24' }
  ];

  // Heatmap data (regions x time buckets)
  const heatmapRegions = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Umm Al-Quwain', 'Fujairah'];
  const heatmapHours = ['00-04 hrs', '04-08 hrs', '08-12 hrs', '12-16 hrs', '16-20 hrs', '20-24 hrs'];
  const riskHeatmapMatrix: number[][] = [
    [3, 5, 12, 9, 7, 4],
    [2, 8, 15, 11, 6, 3],
    [1, 4, 9, 8, 5, 2],
    [0, 2, 6, 5, 3, 1],
    [1, 3, 7, 6, 4, 2],
    [0, 1, 4, 3, 2, 1],
    [0, 1, 3, 2, 2, 1]
  ];

  // Service Delivery Performance charts data
  // Split by service type for stacked/dual-series chart
  const serviceVolumeTrendData = [
    { month: 'Jan', financial: 620, nonFinancial: 580 },
    { month: 'Feb', financial: 710, nonFinancial: 640 },
    { month: 'Mar', financial: 780, nonFinancial: 670 },
    { month: 'Apr', financial: 820, nonFinancial: 700 },
    { month: 'May', financial: 900, nonFinancial: 780 },
    { month: 'Jun', financial: 980, nonFinancial: 864 }
  ];

  // Top requested services (for horizontal bar chart)
  const topRequestedServicesData = [
    { service: 'Advisory & Mentorship', total: 4200 },
    { service: 'Training & Capacity Building', total: 3800 },
    { service: 'Financing & Loans', total: 2900 },
    { service: 'Technology Enablement', total: 2100 },
    { service: 'Market Access', total: 1850 },
    { service: 'Export Readiness', total: 1620 },
    { service: 'Regulatory Support', total: 1490 },
    { service: 'Credit Enablement', total: 1360 },
    { service: 'Specialist Clinics', total: 1280 },
    { service: 'Equity/Investment', total: 980 }
  ].sort((a, b) => b.total - a.total);

  const enterpriseEngagementData = [
    { month: 'Jan', enterprises: 850, target: 1200 },
    { month: 'Feb', enterprises: 920, target: 1200 },
    { month: 'Mar', enterprises: 980, target: 1200 },
    { month: 'Apr', enterprises: 1050, target: 1200 },
    { month: 'May', enterprises: 1100, target: 1200 },
    { month: 'Jun', enterprises: 1123, target: 1200 }
  ];

  // Enterprise Usage & Impact - additional visuals
  const enterpriseSegmentDistribution = [
    { segment: 'Idea', value: 180, fill: '#06b6d4' },
    { segment: 'Startup', value: 420, fill: '#14b8a6' },
    { segment: 'Scaleup', value: 260, fill: '#10b981' },
    { segment: 'Grownup', value: 140, fill: '#3b82f6' }
  ];
  // Service usage by business stage (Idea, Startup, Scaleup, Grownup)
  const serviceUsageByLifecycle = [
    { segment: 'Idea', count: 620 },
    { segment: 'Startup', count: 980 },
    { segment: 'Scaleup', count: 740 },
    { segment: 'Grownup', count: 410 }
  ];

  // Provider analytics mock data (Provider Performance)
  const providers = ['ADCB', 'FAB', 'RAKBANK', 'ADCCI', 'Flat6Labs'];
  const providerRequestsSummary = [
    { provider: 'ADCB', total: 620, completed: 580 },
    { provider: 'FAB', total: 540, completed: 500 },
    { provider: 'RAKBANK', total: 410, completed: 372 },
    { provider: 'ADCCI', total: 680, completed: 642 },
    { provider: 'Flat6Labs', total: 360, completed: 330 }
  ];
  const providerMarketShare = [
    { provider: 'ADCB', value: 28, fill: '#14b8a6' },
    { provider: 'FAB', value: 24, fill: '#06b6d4' },
    { provider: 'RAKBANK', value: 18, fill: '#10b981' },
    { provider: 'ADCCI', value: 22, fill: '#3b82f6' },
    { provider: 'Flat6Labs', value: 8, fill: '#f59e0b' }
  ];
  // Average Completion Time by Provider (in days)
  const providerCompletionTime = [
    { provider: 'ADCB', avgCompletionTime: 3.2, target: 5 },
    { provider: 'FAB', avgCompletionTime: 3.8, target: 5 },
    { provider: 'RAKBANK', avgCompletionTime: 4.5, target: 5 },
    { provider: 'ADCCI', avgCompletionTime: 3.5, target: 5 },
    { provider: 'Flat6Labs', avgCompletionTime: 4.1, target: 5 },
    { provider: 'AUB', avgCompletionTime: 5.2, target: 5 },
    { provider: 'EDB', avgCompletionTime: 2.9, target: 5 }
  ];

  // Provider SLA Compliance Trend (monthly for all providers)
  const providerSlaComplianceTrend = [
    { month: 'Jan', compliance: 88.5, target: 90 },
    { month: 'Feb', compliance: 89.2, target: 90 },
    { month: 'Mar', compliance: 90.1, target: 90 },
    { month: 'Apr', compliance: 91.3, target: 90 },
    { month: 'May', compliance: 91.8, target: 90 },
    { month: 'Jun', compliance: 92.0, target: 90 }
  ];

  // SLA Breach Rate by Provider (%)
  const providerSlaBreachRate = [
    { provider: 'ADCB', breachRate: 6.2 },
    { provider: 'FAB', breachRate: 8.5 },
    { provider: 'RAKBANK', breachRate: 12.3 },
    { provider: 'ADCCI', breachRate: 7.1 },
    { provider: 'Flat6Labs', breachRate: 9.8 },
    { provider: 'AUB', breachRate: 11.2 },
    { provider: 'EDB', breachRate: 5.9 }
  ];

  // Provider Benchmark Summary Table Data
  const providerBenchmarkData = [
    { provider: 'ADCB', sla: 93.8, responseTime: 2.1, quality: 4.7, retention: 94.2, capacity: 82, index: 92.5, rank: 1 },
    { provider: 'FAB', sla: 91.5, responseTime: 2.4, quality: 4.5, retention: 91.8, capacity: 78, index: 89.2, rank: 2 },
    { provider: 'ADCCI', sla: 92.9, responseTime: 2.2, quality: 4.6, retention: 93.5, capacity: 85, index: 91.8, rank: 3 },
    { provider: 'AUB', sla: 87.6, responseTime: 3.1, quality: 4.2, retention: 88.3, capacity: 71, index: 84.1, rank: 6 },
    { provider: 'RAKBANK', sla: 87.7, responseTime: 2.9, quality: 4.3, retention: 89.2, capacity: 74, index: 85.3, rank: 5 },
    { provider: 'Flat6Labs', sla: 90.2, responseTime: 2.5, quality: 4.4, retention: 90.5, capacity: 76, index: 87.8, rank: 4 },
    { provider: 'EDB', sla: 94.1, responseTime: 2.0, quality: 4.8, retention: 95.0, capacity: 80, index: 93.2, rank: 1 }
  ];
  const providerMonthlyVolumes: Record<string, Array<{ month: string; financial: number; nonFinancial: number }>> = {
    ADCB: [
      { month: 'Jan', financial: 95, nonFinancial: 62 },
      { month: 'Feb', financial: 102, nonFinancial: 68 },
      { month: 'Mar', financial: 118, nonFinancial: 74 },
      { month: 'Apr', financial: 112, nonFinancial: 71 },
      { month: 'May', financial: 126, nonFinancial: 80 },
      { month: 'Jun', financial: 130, nonFinancial: 83 }
    ],
    FAB: [
      { month: 'Jan', financial: 88, nonFinancial: 54 },
      { month: 'Feb', financial: 94, nonFinancial: 60 },
      { month: 'Mar', financial: 100, nonFinancial: 63 },
      { month: 'Apr', financial: 98, nonFinancial: 59 },
      { month: 'May', financial: 108, nonFinancial: 66 },
      { month: 'Jun', financial: 112, nonFinancial: 69 }
    ],
    RAKBANK: [
      { month: 'Jan', financial: 70, nonFinancial: 38 },
      { month: 'Feb', financial: 72, nonFinancial: 42 },
      { month: 'Mar', financial: 80, nonFinancial: 44 },
      { month: 'Apr', financial: 78, nonFinancial: 43 },
      { month: 'May', financial: 85, nonFinancial: 47 },
      { month: 'Jun', financial: 87, nonFinancial: 49 }
    ],
    ADCCI: [
      { month: 'Jan', financial: 60, nonFinancial: 90 },
      { month: 'Feb', financial: 62, nonFinancial: 95 },
      { month: 'Mar', financial: 68, nonFinancial: 102 },
      { month: 'Apr', financial: 66, nonFinancial: 98 },
      { month: 'May', financial: 72, nonFinancial: 108 },
      { month: 'Jun', financial: 74, nonFinancial: 112 }
    ],
    Flat6Labs: [
      { month: 'Jan', financial: 30, nonFinancial: 52 },
      { month: 'Feb', financial: 34, nonFinancial: 56 },
      { month: 'Mar', financial: 36, nonFinancial: 60 },
      { month: 'Apr', financial: 35, nonFinancial: 58 },
      { month: 'May', financial: 38, nonFinancial: 62 },
      { month: 'Jun', financial: 40, nonFinancial: 64 }
    ]
  };
  const [selectedProvider, setSelectedProvider] = useState('ADCB');
  const [selectedHistogramProvider, setSelectedHistogramProvider] = useState('ADCB');

  // Enterprises by Sector (Enterprise page)
  const enterprisesBySectorData = [
    { sector: 'Technology', enterprises: 320 },
    { sector: 'Healthcare', enterprises: 210 },
    { sector: 'Agriculture', enterprises: 180 },
    { sector: 'Manufacturing', enterprises: 240 },
    { sector: 'Retail', enterprises: 275 },
    { sector: 'Logistics', enterprises: 190 }
  ];

  // Enterprise Size by Location (stacked) (Enterprise page)
  const enterpriseSizeByRegionData = [
    { region: 'Fujairah', Micro: 65, Small: 40, Medium: 22, Large: 6 },
    { region: 'Umm Al-Quwain', Micro: 48, Small: 28, Medium: 15, Large: 4 },
    { region: 'Ajman', Micro: 80, Small: 52, Medium: 26, Large: 7 },
    { region: 'Dubai', Micro: 320, Small: 210, Medium: 120, Large: 35 },
    { region: 'Ras Al Khaimah', Micro: 75, Small: 46, Medium: 24, Large: 7 },
    { region: 'Sharjah', Micro: 160, Small: 100, Medium: 58, Large: 16 },
    { region: 'Abu Dhabi', Micro: 280, Small: 175, Medium: 98, Large: 28 }
  ];

  const slaComplianceTrendData = [
    { month: 'Jan', compliance: 88.5, target: 95 },
    { month: 'Feb', compliance: 89.2, target: 95 },
    { month: 'Mar', compliance: 90.1, target: 95 },
    { month: 'Apr', compliance: 89.8, target: 95 },
    { month: 'May', compliance: 90.5, target: 95 },
    { month: 'Jun', compliance: 90.7, target: 95 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];


  // Filter options
  const globalFilterOptions = {
    dateRange: [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'this-quarter', label: 'This Quarter' },
    { value: 'this-year', label: 'This Year' }],

    serviceCategory: [
    { value: 'all', label: 'All' },
    { value: 'financial', label: 'Financial' },
    { value: 'non-financial', label: 'Non financial' }],

    partnerType: [
    { value: 'all', label: 'All Partners' },
    { value: 'financial', label: 'Financial Partners' },
    { value: 'capability', label: 'Capability Partners' },
    { value: 'banks', label: 'Banks' },
    { value: 'mfis', label: 'MFIs' },
    { value: 'accelerators', label: 'Accelerators' },
    { value: 'universities', label: 'Universities' },
    { value: 'vendors', label: 'Vendors' },
    { value: 'chambers', label: 'Chambers' },
    { value: 'government', label: 'Government Entities' }],

    region: [
    { value: 'all', label: 'All Regions' },
    { value: 'uae', label: 'UAE' },
    { value: 'gcc', label: 'GCC' },
    { value: 'mena', label: 'MENA' },
    { value: 'global', label: 'Global' }],

    enterpriseSize: [
    { value: 'all', label: 'All Sizes' },
    { value: 'micro', label: 'Micro (1-5 employees)' },
    { value: 'small', label: 'Small (6-50 employees)' },
    { value: 'medium', label: 'Medium (51-250 employees)' },
    { value: 'large', label: 'Large (250+ employees)' }],

    transactionType: [
    { value: 'all', label: 'All Types' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'non-financial', label: 'Non-Financial Services' },
    { value: 'advisory', label: 'Advisory Services' },
    { value: 'training', label: 'Training Services' }],

    industry: [
    { value: 'all', label: 'All Industries' },
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'services', label: 'Services' }]

  };

  // Contextual filter options
  const contextualFilterOptions = {
    diagnostic: {
      rootCauseFactor: [
      { value: 'all', label: 'All Factors' },
      { value: 'capacity', label: 'Capacity Issues' },
      { value: 'process', label: 'Process Bottlenecks' },
      { value: 'system', label: 'System Failures' },
      { value: 'human', label: 'Human Error' },
      { value: 'external', label: 'External Dependencies' }],

      slaStatus: [
      { value: 'all', label: 'All SLA Status' },
      { value: 'met', label: 'SLA Met' },
      { value: 'at-risk', label: 'At Risk' },
      { value: 'breached', label: 'Breached' }],

      delaySource: [
      { value: 'all', label: 'All Delay Sources' },
      { value: 'approval', label: 'Approval Delays' },
      { value: 'documentation', label: 'Documentation' },
      { value: 'compliance', label: 'Compliance Checks' },
      { value: 'technical', label: 'Technical Issues' }]

    },
    predictive: {
      forecastHorizon: [
      { value: '1-month', label: '1 Month' },
      { value: '3-months', label: '3 Months' },
      { value: '6-months', label: '6 Months' },
      { value: '12-months', label: '12 Months' }],

      confidenceLevel: [
      { value: '80', label: '80%' },
      { value: '90', label: '90%' },
      { value: '95', label: '95%' },
      { value: '99', label: '99%' }],

      modelVersion: [
      { value: 'latest', label: 'Latest Model' },
      { value: 'stable', label: 'Stable Model' },
      { value: 'experimental', label: 'Experimental' }]

    },
    prescriptive: {
      optimizationGoal: [
      { value: 'sla-improvement', label: 'SLA Improvement' },
      { value: 'cost-reduction', label: 'Cost Reduction' },
      { value: 'quality-enhancement', label: 'Quality Enhancement' },
      { value: 'throughput-increase', label: 'Throughput Increase' }],

      budgetCap: [
      { value: 'unlimited', label: 'Unlimited' },
      { value: '100k', label: '£100K' },
      { value: '500k', label: '£500K' },
      { value: '1m', label: '£1M' }],

      targetKPI: [
      { value: 'sla-compliance', label: 'SLA Compliance' },
      { value: 'cost-efficiency', label: 'Cost Efficiency' },
      { value: 'customer-satisfaction', label: 'Customer Satisfaction' },
      { value: 'partner-performance', label: 'Partner Performance' }]

    },
    cognitive: {
      agentObjective: [
      { value: 'efficiency', label: 'Efficiency Optimization' },
      { value: 'quality', label: 'Quality Enhancement' },
      { value: 'cost', label: 'Cost Optimization' },
      { value: 'risk', label: 'Risk Mitigation' }],

      automationMode: [
      { value: 'supervised', label: 'Supervised' },
      { value: 'semi-autonomous', label: 'Semi-Autonomous' },
      { value: 'autonomous', label: 'Autonomous' }],

      guardrails: [
      { value: 'strict', label: 'Strict' },
      { value: 'standard', label: 'Standard' },
      { value: 'relaxed', label: 'Relaxed' }]

    }
  };

  // Layer data configurations
  const layerConfigurations = {
    descriptive: {
      title: "EJP Operations Performance",
      kpis: [
      {
        title: 'Total Services Delivered',
        value: '13,470',
        unit: 'services',
        trend: 'up',
        trendValue: '+149',
        threshold: 'excellent',
        description: 'Total number of services delivered to enterprises',
        icon: 'CheckCircle',
        sparklineData: [12000, 12500, 13000, 13200, 13350, 13470],
        target: 18000
      },
      {
        title: 'Active Enterprises Engaged',
        value: '1,450',
        unit: 'enterprises',
        trend: 'up',
        trendValue: '+11',
        threshold: 'excellent',
        description: 'Number of active enterprises engaged',
        icon: 'Building',
        sparklineData: [1400, 1410, 1420, 1430, 1440, 1450],
        target: 1500
      },
      {
        title: 'Avg Completion Time',
        value: '3.2',
        unit: 'days',
        trend: 'up',
        trendValue: '+0.3 days',
        threshold: 'good',
        description: 'Average service completion time',
        icon: 'Clock',
        sparklineData: [2.8, 2.9, 3.0, 3.1, 3.15, 3.2],
        target: 3.5
      },
      {
        title: 'SLA Compliance Rate',
        value: '99.3',
        unit: '%',
        trend: 'up',
        trendValue: '+0.5%',
        threshold: 'excellent',
        description: 'Percentage of services meeting SLA requirements',
        icon: 'Target',
        sparklineData: [98.5, 98.8, 99.0, 99.1, 99.2, 99.3],
        target: 95
      }],

      mainVisual: 'EJP Transaction Performance Over Time',
      alertsTitle: 'Current SLA Breaches and Service Issues',
      insights: [
      'Provider & Partner Performance – SLA Compliance and Quality Benchmarking',
      'Service Delivery Funnel – Application to Completion Flow',
      'Enterprise Outcomes & Impact – Growth and Satisfaction Analysis',
      'Comparative Insights – Cross-Enterprise and Service Delivery Performance'],

      summary: 'EJP Operations performance metrics showing transaction delivery efficiency, enterprise engagement, and provider performance across the platform.'
    },
    diagnostic: {
      title: "Root Cause Highlights",
      kpis: [
      {
        title: 'Root Cause Contribution',
        value: '34.2',
        unit: '% impact',
        trend: 'stable',
        trendValue: '±0.1%',
        threshold: 'warning',
        description: 'Primary factor contributing to performance issues',
        icon: 'AlertTriangle',
        sparklineData: [32, 33, 34, 35, 34.5, 34.2],
        target: 25
      },
      {
        title: 'Delay Impact',
        value: '2.3',
        unit: 'days avg',
        trend: 'up',
        trendValue: '+0.4 days',
        threshold: 'critical',
        description: 'Average delay caused by identified bottlenecks',
        icon: 'Clock',
        sparklineData: [1.5, 1.8, 2.0, 2.1, 2.2, 2.3],
        target: 1.0
      },
      {
        title: 'Partner Variance',
        value: '15.8',
        unit: '% deviation',
        trend: 'down',
        trendValue: '-2.1%',
        threshold: 'good',
        description: 'Performance variation across partner network',
        icon: 'BarChart3',
        sparklineData: [20, 19, 18, 17, 16.5, 15.8],
        target: 10
      },
      {
        title: 'Service Deviation',
        value: '8.7',
        unit: '% variance',
        trend: 'stable',
        trendValue: '±0.2%',
        threshold: 'good',
        description: 'Variation from expected service standards',
        icon: 'Target',
        sparklineData: [9.2, 9.0, 8.8, 8.9, 8.8, 8.7],
        target: 5
      }],

      mainVisual: 'Factors Influencing Service Outcomes',
      alertsTitle: 'Top Contributors to Performance Drop',
      insights: [
      'Correlation Matrix – Metric Relationships',
      'Process Drill-Down – Queue to Resolution Stages',
      'Cause-Effect Flow Map – Delay Propagation Across Processes',
      'Issue Theme Summary – Frequent Operational Problems'],

      summary: 'Why KPIs shifted and which factors drive the variation.'
    },
    predictive: {
      title: "Forecast Highlights",
      kpis: [
      {
        title: 'Next-Period SLA',
        value: '94.8',
        unit: '% predicted',
        trend: 'down',
        trendValue: '-1.4%',
        threshold: 'warning',
        description: 'Forecasted SLA achievement for next period',
        icon: 'TrendingDown',
        sparklineData: [96.2, 95.8, 95.4, 95.0, 94.9, 94.8],
        target: 96
      },
      {
        title: 'Predicted Resolution Time',
        value: '4.6',
        unit: 'days forecast',
        trend: 'up',
        trendValue: '+0.4 days',
        threshold: 'warning',
        description: 'Expected average resolution time',
        icon: 'Clock',
        sparklineData: [4.2, 4.3, 4.4, 4.5, 4.55, 4.6],
        target: 4.0
      },
      {
        title: 'Expected Cost',
        value: '£132',
        unit: 'predicted',
        trend: 'up',
        trendValue: '+£8',
        threshold: 'warning',
        description: 'Forecasted cost per service delivery',
        icon: 'PoundSterling',
        sparklineData: [124, 126, 128, 130, 131, 132],
        target: 125
      },
      {
        title: 'Partner Risk Index',
        value: '23.4',
        unit: '/100 risk',
        trend: 'up',
        trendValue: '+3.2',
        threshold: 'critical',
        description: 'Predicted risk level across partner network',
        icon: 'AlertTriangle',
        sparklineData: [18, 19, 20, 21.5, 22.8, 23.4],
        target: 15
      }],

      mainVisual: 'Projected Service Performance with Confidence Range',
      alertsTitle: 'Expected Risks and Early Warnings',
      insights: [
      'Risk Heatmap – Likelihood vs Impact by Partner',
      'Forecast Distribution – Range of Possible Outcomes',
      'Model Explainability – Key Predictors Driving Forecast',
      'Timeline Slider – View Forecast Evolution by Horizon'],

      summary: 'What\'s likely to happen next and where attention is needed.'
    },
    prescriptive: {
      title: "Optimization Highlights",
      kpis: [
      {
        title: 'Recommended Actions',
        value: '7',
        unit: 'priority items',
        trend: 'stable',
        trendValue: '±0',
        threshold: 'good',
        description: 'High-impact optimization actions identified',
        icon: 'Target',
        sparklineData: [8, 7, 7, 8, 7, 7],
        target: 5
      },
      {
        title: 'Efficiency Gain %',
        value: '12.3',
        unit: '% improvement',
        trend: 'up',
        trendValue: '+2.1%',
        threshold: 'excellent',
        description: 'Expected efficiency improvement from recommendations',
        icon: 'TrendingUp',
        sparklineData: [8, 9, 10, 11, 11.8, 12.3],
        target: 15
      },
      {
        title: 'Cost Savings',
        value: '£245K',
        unit: 'annual',
        trend: 'up',
        trendValue: '+£45K',
        threshold: 'excellent',
        description: 'Projected annual cost savings',
        icon: 'PoundSterling',
        sparklineData: [180, 200, 215, 225, 235, 245],
        target: 300
      },
      {
        title: 'Projected SLA Improvement %',
        value: '3.2',
        unit: '% points',
        trend: 'up',
        trendValue: '+0.8%',
        threshold: 'excellent',
        description: 'Expected SLA performance improvement',
        icon: 'ArrowUp',
        sparklineData: [2.1, 2.4, 2.7, 2.9, 3.0, 3.2],
        target: 4.0
      }],

      mainVisual: 'Scenario Simulator – Adjust Resources to Test Impact',
      alertsTitle: 'High-Priority Actions and Opportunities',
      insights: [
      'Optimization Flow – Resource Reallocation Effect',
      'ROI Matrix – Value vs Effort of Scenarios',
      'Decision Path – Best Actions by Goal',
      'Implementation Timeline – Planned Execution Schedule'],

      summary: 'Recommended next steps and expected impact on service efficiency.'
    },
    cognitive: {
      title: "AI Performance Overview",
      kpis: [
      {
        title: 'Active AI Decisions',
        value: '142',
        unit: 'live decisions',
        trend: 'up',
        trendValue: '+23',
        threshold: 'excellent',
        description: 'AI decisions currently being executed',
        icon: 'Brain',
        sparklineData: [98, 110, 125, 132, 138, 142],
        target: 150
      },
      {
        title: 'Automation Success %',
        value: '89.6',
        unit: '% success',
        trend: 'up',
        trendValue: '+1.4%',
        threshold: 'excellent',
        description: 'Success rate of automated decisions',
        icon: 'CheckCircle',
        sparklineData: [86, 87, 88, 88.5, 89.2, 89.6],
        target: 92
      },
      {
        title: 'Learning Cycles',
        value: '34',
        unit: 'completed',
        trend: 'up',
        trendValue: '+8',
        threshold: 'excellent',
        description: 'AI model learning cycles completed',
        icon: 'RefreshCw',
        sparklineData: [20, 24, 28, 30, 32, 34],
        target: 40
      },
      {
        title: 'Approval Rate %',
        value: '94.2',
        unit: '% approved',
        trend: 'up',
        trendValue: '+2.1%',
        threshold: 'excellent',
        description: 'User approval rate for AI recommendations',
        icon: 'ThumbsUp',
        sparklineData: [90, 91, 92, 93, 93.8, 94.2],
        target: 95
      }],

      mainVisual: 'AI Decision Timeline – Actions and Rationale',
      alertsTitle: 'Live AI Actions and Execution Status',
      insights: [
      'Decision Graph – How AI Derived Recommendations',
      'Feedback Loop – User Approvals Over Time',
      'Network Map – System Adjustments Across Partners',
      'Sentiment Monitor – User Perception of AI Decisions'],

      summary: 'How AI agents execute and refine decisions autonomously.'
    }
  };

  // Tab configuration
  const segmentTabs = [
  { id: 'market-internal', label: 'Market (Internal)' },
  { id: 'strategic-internal', label: 'Strategic (Internal)' },
  { id: 'operations-internal', label: 'Operations (Internal)' },
  { id: 'market-external', label: 'Market (External)' },
  { id: 'strategic-external', label: 'Strategic (External)' },
  { id: 'engagement-external', label: 'Engagement (External)' }];


  const dashboardTabsConfig = {
    'operations-internal': [
    { id: 'market', label: 'Market' },
    { id: 'strategic', label: 'Strategic' },
    { id: 'operations', label: 'Operations' }]
  };

  const secondLayerTabsConfig = [
    { id: 'service-delivery-performance', label: 'Service Delivery Performance' },
    { id: 'service-provider-performance', label: 'Service Provider Performance' },
    { id: 'enterprise-usage-impact', label: 'Enterprise Portfolio & Operations' }
  ];

  // Handle tab navigation with keyboard support
  const handleSegmentTabKeyDown = (event, tabId) => {
    const currentIndex = segmentTabs?.findIndex((tab) => tab?.id === activeSegmentTab);
    let newIndex = currentIndex;

    switch (event?.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : segmentTabs?.length - 1;
        event?.preventDefault();
        break;
      case 'ArrowRight':
        newIndex = currentIndex < segmentTabs?.length - 1 ? currentIndex + 1 : 0;
        event?.preventDefault();
        break;
      case 'Home':
        newIndex = 0;
        event?.preventDefault();
        break;
      case 'End':
        newIndex = segmentTabs?.length - 1;
        event?.preventDefault();
        break;
      default:
        return;
    }

    const newTab = segmentTabs?.[newIndex];
    if (newTab) {
      setActiveSegmentTab(newTab?.id);
      // Reset dashboard tab to first available when segment changes
      const dashboardTabs = dashboardTabsConfig?.[newTab?.id];
      if (dashboardTabs?.length > 0) {
        setActiveDashboardTab(dashboardTabs?.[0]?.id);
      }
    }
  };

  const handleDashboardTabKeyDown = (event, tabId) => {
    const dashboardTabs = dashboardTabsConfig?.[activeSegmentTab] || [];
    const currentIndex = dashboardTabs?.findIndex((tab) => tab?.id === activeDashboardTab);
    let newIndex = currentIndex;

    switch (event?.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : dashboardTabs?.length - 1;
        event?.preventDefault();
        break;
      case 'ArrowRight':
        newIndex = currentIndex < dashboardTabs?.length - 1 ? currentIndex + 1 : 0;
        event?.preventDefault();
        break;
      case 'Home':
        newIndex = 0;
        event?.preventDefault();
        break;
      case 'End':
        newIndex = dashboardTabs?.length - 1;
        event?.preventDefault();
        break;
      default:
        return;
    }

    const newTab = dashboardTabs?.[newIndex];
    if (newTab) {
      setActiveDashboardTab(newTab?.id);
    }
  };

  // Update dashboard tab when segment changes
  useEffect(() => {
    const dashboardTabs = dashboardTabsConfig?.[activeSegmentTab];
    if (dashboardTabs?.length > 0 && !dashboardTabs?.find((tab) => tab?.id === activeDashboardTab)) {
      setActiveDashboardTab(dashboardTabs?.[0]?.id);
    }
  }, [activeSegmentTab, activeDashboardTab]);


  // Update global filters
  const updateGlobalFilter = (filterKey, value) => {
    setGlobalFilters((prev) => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // Dynamic data fetching
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with dynamic data based on current selections
      const mockData = {
        operations: {
          'service-delivery-performance': {
            kpis: [
              {
                title: 'Total Services Delivered',
                value: Math.floor(Math.random() * 5000) + 10000,
                unit: 'services',
                trend: Math.random() > 0.5 ? 'up' : 'down',
                trendValue: `+${Math.floor(Math.random() * 500) + 100}`,
                threshold: 'excellent',
                description: 'Total number of services delivered to enterprises',
                icon: 'CheckCircle',
                sparklineData: Array.from({length: 6}, () => Math.floor(Math.random() * 1000) + 10000),
                target: 18000
              },
              {
                title: 'Active Enterprises',
                value: Math.floor(Math.random() * 500) + 1000,
                unit: 'enterprises',
                trend: Math.random() > 0.5 ? 'up' : 'down',
                trendValue: `+${Math.floor(Math.random() * 50) + 10}`,
                threshold: 'excellent',
                description: 'Number of active enterprises engaged',
                icon: 'Building',
                sparklineData: Array.from({length: 6}, () => Math.floor(Math.random() * 200) + 800),
                target: 1500
              },
              {
                title: 'Avg Completion Time',
                value: (Math.random() * 2 + 3).toFixed(1),
                unit: 'days',
                trend: Math.random() > 0.5 ? 'down' : 'up',
                trendValue: `${Math.random() > 0.5 ? '-' : '+'}${(Math.random() * 0.5).toFixed(1)} days`,
                threshold: 'excellent',
                description: 'Average service completion time',
                icon: 'Clock',
                sparklineData: Array.from({length: 6}, () => Math.random() * 2 + 3),
                target: 3.5
              },
              {
                title: 'SLA Compliance Rate',
                value: (Math.random() * 10 + 90).toFixed(1),
                unit: '%',
                trend: Math.random() > 0.5 ? 'up' : 'down',
                trendValue: `+${(Math.random() * 2).toFixed(1)}%`,
                threshold: 'good',
                description: 'Percentage of services meeting SLA requirements',
                icon: 'Target',
                sparklineData: Array.from({length: 6}, () => Math.random() * 10 + 90),
                target: 95
              }
            ]
          },
          'dashboard-2': {
            kpis: [
              {
                title: 'Provider Performance',
                value: (Math.random() * 20 + 80).toFixed(1),
                unit: '%',
                trend: Math.random() > 0.5 ? 'up' : 'down',
                trendValue: `+${(Math.random() * 3).toFixed(1)}%`,
                threshold: 'good',
                description: 'Overall provider performance rating',
                icon: 'Users',
                sparklineData: Array.from({length: 6}, () => Math.random() * 20 + 80),
                target: 90
              }
            ]
          }
        },
        market: {
          kpis: [
            {
              title: 'Market Penetration',
              value: (Math.random() * 15 + 70).toFixed(1),
              unit: '%',
              trend: Math.random() > 0.5 ? 'up' : 'down',
              trendValue: `+${(Math.random() * 2).toFixed(1)}%`,
              threshold: 'good',
              description: 'Market penetration rate',
              icon: 'TrendingUp',
              sparklineData: Array.from({length: 6}, () => Math.random() * 15 + 70),
              target: 85
            }
          ]
        },
        strategic: {
          kpis: [
            {
              title: 'Strategic Goals',
              value: (Math.random() * 25 + 60).toFixed(1),
              unit: '%',
              trend: Math.random() > 0.5 ? 'up' : 'down',
              trendValue: `+${(Math.random() * 5).toFixed(1)}%`,
              threshold: 'warning',
              description: 'Progress towards strategic objectives',
              icon: 'Target',
              sparklineData: Array.from({length: 6}, () => Math.random() * 25 + 60),
              target: 80
            }
          ]
        }
      };
      
      setDashboardData(mockData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [activeDashboardTab, activeSecondLayerTab, globalFilters]);

  // Clear all filters
  const clearAllFilters = () => {
    setGlobalFilters({
      dateRange: 'this-month',
      serviceCategory: 'all',
      partnerType: 'all',
      region: 'all'
    });
  };

  // Get filter label for display
  const getFilterLabel = (filterKey, value) => {
    const options = globalFilterOptions[filterKey];
    const option = options?.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Check if any filters are active (not default values)
  const hasActiveFilters = () => {
    return globalFilters.dateRange !== 'this-month' ||
           globalFilters.serviceCategory !== 'all' ||
           globalFilters.partnerType !== 'all' ||
           globalFilters.region !== 'all' ||
           globalFilters.enterpriseSize !== 'all' ||
           globalFilters.industry !== 'all';
  };

  // Update contextual filters
  const updateContextualFilter = (layer, filterKey, value) => {
    setContextualFilters((prev) => ({
      ...prev,
      [layer]: {
        ...prev?.[layer],
        [filterKey]: value
      }
    }));
  };



  const formatLastUpdated = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

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

  return (
    <div className="space-y-0">
      {/* Dashboard Header */}
      <div className="sticky top-0 z-20 py-3 px-4 lg:px-6 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Service Delivery Overview
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive analytics dashboard for EJP Transaction Service Delivery Performance
            </p>
          </div>
        </div>
      </div>

       {/* 🔹 Dashboard Tabs */}
       <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-center">
            {dashboardTabsConfig?.[activeSegmentTab]?.map((tab, index) =>
                <button
              key={tab?.id}
                onClick={() => setActiveDashboardTab(tab?.id)}
                onKeyDown={(e) => handleDashboardTabKeyDown(e, tab?.id)}
              className={`relative flex-1 px-8 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                activeDashboardTab === tab?.id ?
                'text-blue-600 bg-blue-50 border-b-2 border-blue-500' :
                'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`
                }
                tabIndex={0}
                role="tab"
                aria-selected={activeDashboardTab === tab?.id}
                aria-controls={`dashboard-${tab?.id}`}>
                    {tab?.label}
                </button>
            )}
          </div>
        </div>
      </div>

      <main className="pb-12">
        {/* Show Service Delivery content only when that dashboard is active */}
        {(() => {
          // Dynamic content based on tab selections
          if (activeDashboardTab === 'operations') {
            return (
        <>
            {/* 🔹 Top Structure - Dashboard Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-8 py-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="space-y-3">
                    <h1 className="text-4xl font-light text-foreground tracking-tight">
                      EJP Operations Insights
                    </h1>
                    <p className="text-base text-muted-foreground max-w-4xl leading-relaxed">
                      Comprehensive analytics dashboard for EJP Transaction Service Delivery Performance, providing operational insights, provider benchmarking, and enterprise impact analysis for Platform Analysts and Executives.
                    </p>
                    {isLoading && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Updating data...</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Real-time Status */}
                  <div className="flex flex-col items-end gap-3">
                    <button
                    onClick={() => setIsRealTimeActive(!isRealTimeActive)}
                    className={`flex items-center gap-3 px-4 py-3 border rounded-xl transition-all duration-200 hover:shadow-md ${
                    isRealTimeActive ?
                    'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'bg-card border-border hover:bg-gray-50'}`
                    }>

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
                      className={`${isRealTimeActive ? 'text-blue-700' : 'text-gray-600'} hover:scale-110 transition-transform`} />

                    </button>
                  </div>
                </div>
              </div>
            </div>

              {/* 🔹 Second Layer Tabs - Only show when Operations is selected */}
              {activeDashboardTab === 'operations' && (
                <div className="bg-white border-b border-gray-200 mb-8">
                    <div className="max-w-7xl mx-auto px-8">
                      <div className="flex items-center justify-center">
                        {secondLayerTabsConfig.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveSecondLayerTab(tab.id)}
                            className={`relative flex-1 px-8 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                              activeSecondLayerTab === tab.id
                                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-500'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                </div>
              )}

              {/* 🔹 Main Content Layout with Sidebar */}
              <div className="max-w-7xl mx-auto px-8">
                <div className="space-y-12">
                {(() => {
                const layer = analyticsLayers?.find((l) => l?.id === 'descriptive');
                const config = layerConfigurations?.['descriptive'];

                if (!layer || !config) return null;

                return (
                  <div>
                      {/* Global Filters */}
                      <div className="mb-8">
                        <div className="bg-white border border-border rounded-xl p-6">
                          <div className="space-y-4">
                            <div className={`grid grid-cols-1 md:grid-cols-2 ${activeSecondLayerTab === 'enterprise-usage-impact' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Icon name="Calendar" size={16} className="text-blue-600" />
                                  <span className="text-sm font-semibold text-foreground">Date Range</span>
                                </div>
                                <div className="relative">
                                  <Select
                                    value={globalFilters?.dateRange}
                                    onValueChange={(value) => updateGlobalFilter('dateRange', value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select date range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {globalFilterOptions?.dateRange?.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              {activeSecondLayerTab === 'enterprise-usage-impact' ? (
                                <>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Icon name="Building" size={16} className="text-green-600" />
                                      <span className="text-sm font-semibold text-foreground">Industry</span>
                                    </div>
                                    <div className="relative">
                                      <Select
                                        value={globalFilters?.industry}
                                        onValueChange={(value) => updateGlobalFilter('industry', value)}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {globalFilterOptions?.industry?.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Icon name="Users" size={16} className="text-purple-600" />
                                      <span className="text-sm font-semibold text-foreground">Enterprise Size</span>
                                    </div>
                                    <div className="relative">
                                      <Select
                                        value={globalFilters?.enterpriseSize}
                                        onValueChange={(value) => updateGlobalFilter('enterpriseSize', value)}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select enterprise size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {globalFilterOptions?.enterpriseSize?.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Icon name="Filter" size={16} className="text-orange-600" />
                                      <span className="text-sm font-semibold text-foreground">Service Category</span>
                                    </div>
                                    <div className="relative">
                                      <Select
                                        value={globalFilters?.serviceCategory}
                                        onValueChange={(value) => updateGlobalFilter('serviceCategory', value)}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select service category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {globalFilterOptions?.serviceCategory?.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Icon name="Handshake" size={16} className="text-indigo-600" />
                                      <span className="text-sm font-semibold text-foreground">Partner Type</span>
                                    </div>
                                    <div className="relative">
                                      <Select
                                        value={globalFilters?.partnerType}
                                        onValueChange={(value) => updateGlobalFilter('partnerType', value)}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select partner type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {globalFilterOptions?.partnerType?.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Icon name="Filter" size={16} className="text-green-600" />
                                  <span className="text-sm font-semibold text-foreground">Servaaice Type</span>
                                </div>
                                <div className="relative">
                                  <Select
                                    value={globalFilters?.serviceCategory}
                                    onValueChange={(value) => updateGlobalFilter('serviceCategory', value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select service type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {globalFilterOptions?.serviceCategory?.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Icon name="Users" size={16} className="text-purple-600" />
                                  <span className="text-sm font-semibold text-foreground">Partner Type</span>
                                </div>
                                <div className="relative">
                                  <Select
                                    value={globalFilters?.partnerType}
                                    onValueChange={(value) => updateGlobalFilter('partnerType', value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select partner type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {globalFilterOptions?.partnerType?.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Icon name="MapPin" size={16} className="text-orange-600" />
                                  <span className="text-sm font-semibold text-foreground">Region</span>
                                </div>
                                <div className="relative">
                                  <Select
                                    value={globalFilters?.region}
                                    onValueChange={(value) => updateGlobalFilter('region', value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {globalFilterOptions?.region?.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
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
                                  
                                  {globalFilters.partnerType !== 'all' && (
                                    <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-3 py-1">
                                      <Icon name="Users" size={12} className="text-purple-600" />
                                      <span className="text-xs font-medium text-purple-800">
                                        {getFilterLabel('partnerType', globalFilters.partnerType)}
                                      </span>
                                      <button
                                        onClick={() => updateGlobalFilter('partnerType', 'all')}
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
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Section 1 - Service Delivery Performance */}
                      {activeSecondLayerTab === 'service-delivery-performance' && (
                      <div className="mb-10">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-1 h-12 rounded-full bg-${layer?.color}-500`}></div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-light text-foreground mb-2">Service Delivery Performance Headlines</h3>
                            <p className="text-sm text-muted-foreground">
                              High-level KPI snapshot of current service delivery performance
                            </p>
                          </div>
                        </div>
                        
                        {(() => {
                            // Get dynamic data based on current selections
                            const currentData = dashboardData[activeDashboardTab]?.[activeSecondLayerTab] || 
                                             dashboardData[activeDashboardTab] || 
                                             config?.kpis || [];
                            const kpisToShow = currentData.kpis || currentData || [];
                            const kpiCount = kpisToShow.length;
                            const gridCols = kpiCount === 1 ? 'grid-cols-1' : 
                                           kpiCount === 2 ? 'grid-cols-2' : 
                                           kpiCount === 3 ? 'grid-cols-3' : 
                                           kpiCount === 4 ? 'grid-cols-4' : 
                                           kpiCount === 5 ? 'grid-cols-5' : 
                                           'grid-cols-4';
                            
                            return (
                              <div className={`grid ${gridCols} gap-4 mb-8`}>
                                {kpisToShow.map((kpi, index) => (
                                  <KPICard
                                    key={index}
                                    title={kpi?.title}
                                    value={kpi?.value}
                                    unit={kpi?.unit}
                                    trend={kpi?.trend}
                                    trendValue={kpi?.trendValue}
                                    threshold={kpi?.threshold}
                                    description={kpi?.description}
                                    icon={kpi?.icon}
                                    sparklineData={kpi?.sparklineData}
                                    target={kpi?.target} />
                                ))}
                              </div>
                            );
                          })()}

                        

                        {/* Section 1: Service Volume & Engagement */}
                        <div className="space-y-6">
                          {/* Section Header */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-1 h-12 rounded-full bg-${layer?.color}-500`}></div>
                                <div className="flex-1">
                              <h3 className="text-2xl font-light text-foreground mb-2">Service Volume & Engagement</h3>
                              <p className="text-sm text-muted-foreground">Service trends, category distribution and enterprise engagement</p>
                                </div>
                              </div>
                              
                          {/* Row 1: Service Volume Trend by Service Type (60%) + Real-time Alerts (40%) */}
                          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                            {/* Left: Service Volume Trend by Service Type (3/5 = 60%) */}
                            <div className="xl:col-span-3">
                              <div className="bg-white border border-border rounded-xl p-6">
                                <div className="space-y-1 mb-4">
                                  <h4 className="text-base font-medium text-foreground">Service Volume Trend by Service Type</h4>
                                  <p className="text-xs text-muted-foreground">Monthly volume split across Financial and Non-Financial services</p>
                                </div>
                                <ResponsiveContainer width="100%" height={340}>
                                  <AreaChart data={serviceVolumeTrendData}>
                                    <defs>
                                      <linearGradient id="colorFinancial" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                                      </linearGradient>
                                      <linearGradient id="colorNonFinancial" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                    <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} axisLine={false} tickLine={false} tickFormatter={(v) => v?.toLocaleString()} />
                                    <Tooltip 
                                      contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}
                                      formatter={(value, name, props) => {
                                        const total = (props?.payload?.financial || 0) + (props?.payload?.nonFinancial || 0);
                                        const label = name === 'financial' ? 'Financial' : 'Non-Financial';
                                        return [`${value?.toLocaleString()}`, `${label} (Total: ${total?.toLocaleString()})`];
                                      }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="financial" stroke="#10b981" strokeWidth={3} fill="url(#colorFinancial)" name="Financial">
                                      <LabelList dataKey="financial" position="top" style={{ fontSize: 12, fill: '#374151' }} />
                                    </Area>
                                    <Area type="monotone" dataKey="nonFinancial" stroke="#3b82f6" strokeWidth={3} fill="url(#colorNonFinancial)" name="Non-Financial">
                                      <LabelList dataKey="nonFinancial" position="top" style={{ fontSize: 12, fill: '#374151' }} />
                                    </Area>
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                            {/* Right: Real-time Alerts (2/5 = 40%) */}
                            <div className="xl:col-span-2">
                              <div className="h-[448px]">
                                <RealTimeAlerts description="Critical incidents and anomalies in current service delivery operations" />
                              </div>
                            </div>
                              </div>

                          {/* Row 2: Top Requested Services (50%) + Enterprise Engagement Trend (50%) */}
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Left: Top Requested Services (50%) */}
                            <div className="bg-white border border-border rounded-xl p-6">
                                <div className="space-y-1 mb-4">
                                <h4 className="text-base font-medium text-foreground">Top Requested Services</h4>
                                <p className="text-xs text-muted-foreground">Most requested services across the marketplace</p>
                                </div>
                                <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={topRequestedServicesData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                                  <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} axisLine={false} tickLine={false} tickFormatter={(v) => v?.toLocaleString()} />
                                  <YAxis type="category" dataKey="service" stroke="#9ca3af" style={{ fontSize: '12px' }} width={140} tickLine={false} tickFormatter={(v) => (v?.length > 18 ? v.slice(0, 18) + '…' : v)} />
                                  <Tooltip formatter={(v, n, p) => [v?.toLocaleString(), p?.payload?.service]} contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }} />
                                  <Bar dataKey="total" name="Requests" fill="#3b82f6" radius={[0, 12, 12, 0]}>
                                    <LabelList dataKey="total" position="right" style={{ fontSize: 12, fill: '#374151' }} />
                                    </Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                                </div>
                              
                            {/* Right: Enterprise Engagement Trend (50%) */}
                            <div className="bg-white border border-border rounded-xl p-6">
                                <div className="space-y-1 mb-4">
                                  <h4 className="text-base font-medium text-foreground">Enterprise Engagement Trend</h4>
                                  <p className="text-xs text-muted-foreground">Active enterprises engaging with services monthly</p>
                                </div>
                                <ResponsiveContainer width="100%" height={280}>
                                  <LineChart data={enterpriseEngagementData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                    <XAxis 
                                      dataKey="month" 
                                      stroke="#9ca3af"
                                      style={{ fontSize: '12px' }}
                                    />
                                    <YAxis 
                                      stroke="#9ca3af"
                                      style={{ fontSize: '12px' }}
                                      label={{ value: 'Active Enterprises', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                                    />
                                    <Tooltip 
                                      contentStyle={{ 
                                        backgroundColor: '#fff', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                      }}
                                    />
                                    <Legend />
                                    <Line 
                                      type="monotone" 
                                      dataKey="enterprises" 
                                      stroke="#06b6d4" 
                                      strokeWidth={3}
                                      dot={{ fill: '#06b6d4', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                      activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
                                      name="Active Enterprises"
                                  >
                                    <LabelList dataKey="enterprises" position="top" style={{ fontSize: 12, fill: '#374151' }} />
                                  </Line>
                                  </LineChart>
                                </ResponsiveContainer>
                            </div>
                          </div>
                        </div>

                        {/* Full Width Sections */}
                        <div className="grid grid-cols-1 gap-6 mt-6">
                          {/* Section: Service Lifecycle & Response */}
                          <div className="flex items-center gap-4 mb-2">
                            <div className={`w-1 h-12 rounded-full bg-${layer?.color}-500`}></div>
                            <div className="flex-1">
                              <h3 className="text-2xl font-light text-foreground mb-2">Service Lifecycle & Response</h3>
                              <p className="text-sm text-muted-foreground">Lifecycle funnel and response time tracking</p>
                            </div>
                          </div>
                              
                              {/* Split into two separate cards: left and right */}
                                <div className="grid grid-cols-2 gap-6">
                                {/* Left Card: Service Lifecycle Funnel */}
                                <div className="bg-white border border-border rounded-xl p-6">
                                  <div className="space-y-1 mb-4">
                                    <h4 className="text-base font-medium text-foreground">Service Lifecycle Funnel</h4>
                                    <p className="text-xs text-muted-foreground">Service progression from request → in progress → completed → delivered</p>
                                  </div>
                                    <ServiceLifecycleFunnelChart />
                                  </div>

                                {/* Right Card: Average Response Time */}
                                <div className="bg-white border border-border rounded-xl p-6">
                                  <div className="space-y-1 mb-4">
                                    <h4 className="text-base font-medium text-foreground">Average Response Time</h4>
                                    <p className="text-xs text-muted-foreground">Average time from initial request to first provider response</p>
                                  </div>
                                    <AverageResponseTimeChart />
                                </div>
                              </div>
  
                              {/* Section: SLA Compliance */}
                              <div className="flex items-center gap-4 mb-2">
                                <div className={`w-1 h-12 rounded-full bg-${layer?.color}-500`}></div>
                                <div className="flex-1">
                                  <h3 className="text-2xl font-light text-foreground mb-2">SLA Compliance</h3>
                                  <p className="text-sm text-muted-foreground">SLA compliance tracking over time</p>
                                </div>
                              </div>
  
                              {/* SLA Compliance Trend */}
                              <div className="bg-white border border-border rounded-xl p-6">
                                <div className="space-y-1 mb-4">
                                  <h4 className="text-base font-medium text-foreground">SLA Compliance Trend</h4>
                                  <p className="text-xs text-muted-foreground">Monthly SLA compliance rate showing adherence to service level agreements</p>
                                </div>
                                <ResponsiveContainer width="100%" height={280}>
                                  <AreaChart data={slaComplianceTrendData}>
                                    <defs>
                                      <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                    <XAxis 
                                      dataKey="month" 
                                      stroke="#9ca3af"
                                      style={{ fontSize: '12px' }}
                                      axisLine={false}
                                      tickLine={false}
                                    />
                                    <YAxis 
                                      stroke="#9ca3af"
                                      style={{ fontSize: '12px' }}
                                      domain={[85, 100]}
                                      label={{ value: 'Compliance Rate (%)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                                      axisLine={false}
                                      tickLine={false}
                                    />
                                    <Tooltip 
                                      contentStyle={{ 
                                        backgroundColor: '#fff', 
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                      }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Area 
                                      type="monotone" 
                                      dataKey="compliance" 
                                      stroke="#14b8a6" 
                                      strokeWidth={3}
                                      fill="url(#colorCompliance)"
                                      dot={{ fill: '#14b8a6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                      activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
                                      name="SLA Compliance"
                                    >
                                      <LabelList dataKey="compliance" position="top" formatter={(v) => `${v}%`} style={{ fontSize: 12, fill: '#374151' }} />
                                    </Area>
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                        </div>

                      </div>
                      )}

                      

                      {/* Section 3 - Service Provider Performance */}
                      {activeSecondLayerTab === 'service-provider-performance' && (
                      <div className="mb-10">
                        <div className="flex items-center gap-4 mb-8">
                          <div className={`w-1 h-12 rounded-full bg-${layer?.color}-500`}></div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-light text-foreground mb-2">Performance Headlines</h3>
                            <p className="text-sm text-muted-foreground">
                              Concise snapshot of provider performance KPIs
                              </p>
                            </div>
                          </div>
                          
                        {/* KPI Cards - 4 Key Metrics */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                          <KPICard
                            title="Avg. Response Time"
                            value="2.3"
                            unit="hrs"
                            trend="down"
                            trendValue="-0.5"
                            sparklineData={[3.2, 3.0, 2.8, 2.6, 2.5, 2.4, 2.3]}
                            threshold="excellent"
                            description="Average time for provider to respond"
                            icon="Clock"
                            target="Target: <4h"
                          />
                          <KPICard
                            title="Avg. Completion Time"
                            value="3.8"
                            unit="days"
                            trend="down"
                            trendValue="-0.3"
                            sparklineData={[4.5, 4.3, 4.1, 4.0, 3.9, 3.9, 3.8]}
                            threshold="excellent"
                            description="Average time to complete requests"
                            icon="CheckCircle"
                            target="Target: <5 days"
                          />
                          <KPICard
                            title="SLA Compliance"
                            value="91.2"
                            unit="%"
                            trend="up"
                            trendValue="+1.5%"
                            sparklineData={[88, 89, 89, 90, 90, 91, 91]}
                            threshold="excellent"
                            description="Average SLA compliance across providers"
                            icon="Shield"
                            target="Target: >90%"
                          />
                          <KPICard
                            title="Retention Rate"
                            value="92.5"
                            unit="%"
                            trend="up"
                            trendValue="+1.2%"
                            sparklineData={[88, 89, 90, 91, 92, 92, 93]}
                            threshold="excellent"
                            description="Percentage of retained service providers"
                            icon="Users"
                            target="Target: >85%"
                          />
                              </div>
                              
                        {/* Section 1: Service Delivery & Efficiency */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-1 h-12 rounded-full bg-${layer?.color}-500`}></div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-light text-foreground mb-2">Service Delivery & Efficiency</h3>
                            <p className="text-sm text-muted-foreground">How efficiently providers deliver services</p>
                          </div>
                        </div>

                        {/* Row 1: Bar Chart + Alert Panel */}
                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-stretch mb-6">
                          {/* Requests Completed by Provider (Top 10) - 3/5 width */}
                          <div className="xl:col-span-3">
                            <div className="bg-white border border-border rounded-xl p-6 h-full">
                              <div className="space-y-1 mb-4">
                                <h4 className="text-base font-medium text-foreground">Requests Received and Completed by Provider (Top 10)</h4>
                                <p className="text-xs text-muted-foreground">Compares total requests received vs completed per provider</p>
                              </div>
                              <ResponsiveContainer width="100%" height={340}>
                                <BarChart data={providerRequestsSummary}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                  <XAxis 
                                    dataKey="provider" 
                                    stroke="#9ca3af" 
                                    style={{ fontSize: '12px' }}
                                    axisLine={false}
                                    tickLine={false}
                                  />
                                  <YAxis 
                                    stroke="#9ca3af" 
                                    style={{ fontSize: '12px' }}
                                    axisLine={false}
                                    tickLine={false}
                                  />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#fff', 
                                      border: 'none', 
                                      borderRadius: '12px', 
                                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
                                      fontSize: '12px' 
                                    }} 
                                  />
                                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                                  <Bar dataKey="total" name="Requests Received" fill="#3b82f6" radius={[12,12,0,0]}>
                                    <LabelList dataKey="total" position="top" style={{ fontSize: 12, fill: '#374151' }} />
                                  </Bar>
                                  <Bar dataKey="completed" name="Requests Completed" fill="#14b8a6" radius={[12,12,0,0]}>
                                    <LabelList dataKey="completed" position="top" style={{ fontSize: 12, fill: '#374151' }} />
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Alerts Sidebar - 2/5 width with fixed height */}
                          <div className="xl:col-span-2">
                            <div className="h-[450px]">
                              <RealTimeAlerts description="Provider quality issues, capacity constraints, and regional service gaps" />
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Completion Time by Provider - Full Width */}
                        <div className="mb-6">
                          <div className="bg-white border border-border rounded-xl p-6">
                            <div className="space-y-1 mb-4">
                              <h4 className="text-base font-medium text-foreground">Completion Time by Provider</h4>
                              <p className="text-xs text-muted-foreground">Average completion time per provider with 5-day target benchmark</p>
                            </div>
                            <ResponsiveContainer width="100%" height={280}>
                              <ComposedChart data={providerCompletionTime}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <XAxis 
                                  dataKey="provider" 
                                  stroke="#9ca3af" 
                                  style={{ fontSize: '12px' }}
                                  axisLine={false}
                                  tickLine={false}
                                />
                                <YAxis 
                                  stroke="#9ca3af" 
                                  style={{ fontSize: '12px' }} 
                                  label={{ value: 'Average Completion Time (days)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                                  axisLine={false}
                                  tickLine={false}
                                  domain={[0, 6]}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: 'none', 
                                    borderRadius: '12px', 
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
                                    fontSize: '12px' 
                                  }}
                                  formatter={(value, name) => {
                                    if (name === 'avgCompletionTime') {
                                      return [`Avg Completion Time: ${value} days | SLA Target: 5 days`, 'Completion Time'];
                                    }
                                    return [value, name];
                                  }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar 
                                  dataKey="avgCompletionTime" 
                                  name="Avg Completion Time" 
                                  fill="#14b8a6" 
                                  radius={[12,12,0,0]}
                                  barSize={60}
                                >
                                  <LabelList dataKey="avgCompletionTime" position="top" formatter={(v) => `${v}d`} style={{ fontSize: 12, fill: '#374151' }} />
                                </Bar>
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Section 2: Reliability & SLA Tracking */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-1 h-12 rounded-full bg-${layer?.color}-500`}></div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-light text-foreground mb-2">Reliability & SLA Tracking</h3>
                            <p className="text-sm text-muted-foreground">Monitor reliability and SLA trends before benchmarking</p>
                          </div>
                        </div>

                        {/* Row: SLA Compliance Trend + SLA Breach Rate */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          {/* SLA Compliance Trend (All Providers) */}
                          <div className="bg-white border border-border rounded-xl p-6">
                            <div className="space-y-1 mb-4">
                              <h4 className="text-base font-medium text-foreground">SLA Compliance Trend (All Providers)</h4>
                              <p className="text-xs text-muted-foreground">Monthly SLA compliance rate across all service providers</p>
                            </div>
                            <ResponsiveContainer width="100%" height={280}>
                              <LineChart data={providerSlaComplianceTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <XAxis 
                                  dataKey="month" 
                                  stroke="#9ca3af" 
                                  style={{ fontSize: '12px' }}
                                  axisLine={false}
                                  tickLine={false}
                                />
                                <YAxis 
                                  stroke="#9ca3af" 
                                  style={{ fontSize: '12px' }}
                                  domain={[85, 95]}
                                  label={{ value: 'Compliance (%)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                                  axisLine={false}
                                  tickLine={false}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: 'none', 
                                    borderRadius: '12px', 
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
                                    fontSize: '12px' 
                                  }} 
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Line 
                                  type="monotone" 
                                  dataKey="compliance" 
                                  stroke="#14b8a6" 
                                  strokeWidth={3}
                                  dot={{ fill: '#14b8a6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                  activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
                                  name="SLA Compliance"
                                >
                                  <LabelList dataKey="compliance" position="top" formatter={(v) => `${v}%`} style={{ fontSize: 12, fill: '#374151' }} />
                                </Line>
                              </LineChart>
                            </ResponsiveContainer>
                          </div>

                          {/* SLA Breach Rate by Provider */}
                          <div className="bg-white border border-border rounded-xl p-6">
                            <div className="space-y-1 mb-4">
                              <h4 className="text-base font-medium text-foreground">SLA Breach Rate by Provider (%)</h4>
                              <p className="text-xs text-muted-foreground">Percentage of SLA breaches showing recurring issues per provider</p>
                            </div>
                            <ResponsiveContainer width="100%" height={280}>
                              <BarChart data={providerSlaBreachRate}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <XAxis 
                                  dataKey="provider" 
                                  stroke="#9ca3af" 
                                  style={{ fontSize: '12px' }}
                                  axisLine={false}
                                  tickLine={false}
                                />
                                <YAxis 
                                  stroke="#9ca3af" 
                                  style={{ fontSize: '12px' }}
                                  label={{ value: 'Breach Rate (%)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                                  axisLine={false}
                                  tickLine={false}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: 'none', 
                                    borderRadius: '12px', 
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
                                    fontSize: '12px' 
                                  }} 
                                />
                                <Bar dataKey="breachRate" name="Breach Rate" fill="#ef4444" radius={[12,12,0,0]}>
                                  <LabelList dataKey="breachRate" position="top" formatter={(v) => `${v}%`} style={{ fontSize: 12, fill: '#374151' }} />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Section 3: Provider Benchmarking */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-1 h-12 rounded-full bg-${layer?.color}-500`}></div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-light text-foreground mb-2">Provider Benchmarking</h3>
                            <p className="text-sm text-muted-foreground">Compare overall performance using a composite index</p>
                          </div>
                        </div>

                        {/* Row 1: Performance Matrix Heatmap */}
                        <div className="mb-6">
                          <div className="min-h-[400px]">
                            <EfficiencyMatrixHeatmap
                              benchmarkType={globalFilters?.serviceCategory}
                              partnerType={globalFilters?.partnerType}
                            />
                          </div>
                        </div>

                        {/* Row 2: Provider Benchmark Summary Table */}
                        <div className="mb-6">
                          <div className="bg-white border border-border rounded-xl p-6">
                            <div className="space-y-1 mb-4">
                              <h4 className="text-base font-medium text-foreground">Provider Benchmark Summary</h4>
                              <p className="text-xs text-muted-foreground">Comprehensive performance comparison across all key metrics</p>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                  <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Provider</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700">SLA %</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Response Time (hrs)</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Index</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {providerBenchmarkData
                                    .sort((a, b) => b.index - a.index)
                                    .map((provider, index) => {
                                      const isTop3 = index < 3;
                                      const isBottom3 = index >= providerBenchmarkData.length - 3;
                                      const rowClass = isTop3 
                                        ? 'bg-emerald-50 border-l-4 border-emerald-500' 
                                        : isBottom3 
                                        ? 'bg-red-50 border-l-4 border-red-500' 
                                        : 'hover:bg-gray-50';
                                      
                                      return (
                                        <tr key={provider.provider} className={`border-b border-gray-100 ${rowClass}`}>
                                          <td className="px-4 py-3 font-medium text-gray-900">{provider.provider}</td>
                                          <td className="px-4 py-3 text-center text-gray-700">{provider.sla}%</td>
                                          <td className="px-4 py-3 text-center text-gray-700">{provider.responseTime}</td>
                                          <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                              isTop3 ? 'bg-emerald-100 text-emerald-800' : 
                                              isBottom3 ? 'bg-red-100 text-red-800' : 
                                              'bg-gray-100 text-gray-800'
                                            }`}>
                                              {provider.index}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                      </div>
                      )}

                      {/* Section 4 - Enterprise Usage & Impact */}
                      {activeSecondLayerTab === 'enterprise-usage-impact' && (
                      <div className="mb-10">
                        {/* Headlines Section */}
                        <div className="mb-12">
                        <div className="flex items-center gap-4 mb-8">
                          <div className={`w-1 h-12 rounded-full bg-${layer?.color}-500`}></div>
                          <div className="flex-1">
                              <h4 className="text-xl font-light text-foreground mb-2">Enterprise Activity Headlines</h4>
                            <p className="text-sm text-muted-foreground">
                                Core metrics summarizing enterprise activity, service delivery efficiency, and satisfaction.
                            </p>
                          </div>
                        </div>
                        
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <KPICard
                              title="Net New Enterprises"
                              value="127"
                              unit=""
                            trend="up"
                              trendValue="+15%"
                              sparklineData={[100, 105, 110, 115, 120, 127]}
                              threshold="good"
                              description="New enterprises added this period"
                              icon="Building"
                              target="120"
                          />
                          <KPICard
                              title="Enterprise Activation Rate"
                              value="78.5"
                            unit="%"
                            trend="up"
                              trendValue="+3.2%"
                              sparklineData={[72, 73, 74, 75, 77, 78.5]}
                              threshold="good"
                              description="Percentage of enterprises that activated services"
                              icon="Zap"
                              target="75%"
                          />
                          <KPICard
                              title="On-time SLA Rate"
                              value="94.2"
                            unit="%"
                            trend="up"
                              trendValue="+2.1%"
                              sparklineData={[90, 91, 92, 93, 94, 94.2]}
                            threshold="good"
                              description="Percentage of services delivered on-time within SLA"
                              icon="Clock"
                              target="95%"
                          />
                          <KPICard
                              title="Average Requests per Active Enterprise"
                              value="6.8"
                            unit=""
                            trend="up"
                              trendValue="+0.3"
                              sparklineData={[6.2, 6.3, 6.4, 6.5, 6.6, 6.8]}
                            threshold="good"
                              description="Mean number of service requests per active enterprise"
                              icon="BarChart"
                              target="6.5"
                          />
                          <KPICard
                              title="Repeat Enterprise Share"
                              value="62.5"
                            unit="%"
                            trend="up"
                              trendValue="+2.5%"
                              sparklineData={[58, 59, 60, 61, 62, 62.5]}
                            threshold="excellent"
                              description="Percentage of enterprises with repeat service requests"
                              icon="Repeat"
                              target="60%"
                          />
                          <KPICard
                              title="Enterprise Satisfaction Score"
                              value="4.6"
                              unit="/5.0"
                            trend="up"
                              trendValue="+0.2"
                              sparklineData={[4.2, 4.3, 4.4, 4.5, 4.5, 4.6]}
                              threshold="excellent"
                              description="Average satisfaction across active enterprises"
                              icon="MessageSquare"
                              target="4.5"
                            />
                          </div>
                              </div>
                              
                        {/* Enterprise Portfolio Composition Section */}
                        <div className="mb-12">
                          <div className="flex items-center gap-4 mb-8">
                                <div className={`w-1 h-12 rounded-full bg-${layer?.color}-500`}></div>
                                <div className="flex-1">
                              <h4 className="text-xl font-light text-foreground mb-2">Enterprise Portfolio Composition</h4>
                              <p className="text-sm text-muted-foreground">
                                Explore the distribution and makeup of enterprises by sector, region, and engagement level.
                              </p>
                                </div>
                                      </div>
                                      
                          {/* Row 1: Enterprise Distribution by Industry (60%) + Real-time Alerts (40%) */}
                          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
                            {/* Left: Enterprise Distribution by Industry (3/5 = 60%) */}
                            <div className="xl:col-span-3">
                              <div className="bg-white border border-border rounded-xl p-6 h-[448px] flex flex-col">
                                <h5 className="text-lg font-medium text-foreground mb-1">Enterprise Distribution by Industry</h5>
                                <p className="text-sm text-muted-foreground mb-4">Number of enterprises across different industry sectors</p>
                                <ReactECharts
                                  option={{
                                    tooltip: {
                                      trigger: 'axis',
                                      axisPointer: { type: 'shadow' }
                                    },
                                    grid: {
                                      left: '3%',
                                      right: '4%',
                                      bottom: '15%',
                                      containLabel: true
                                    },
                                    xAxis: {
                                      type: 'category',
                                      data: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Services'],
                                      axisLabel: {
                                        rotate: -45,
                                        interval: 0
                                      },
                                      splitLine: { show: false }
                                    },
                                    yAxis: {
                                      type: 'value',
                                      splitLine: { show: false }
                                    },
                                    series: [{
                                      name: 'Enterprises',
                                      type: 'bar',
                                      label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{c}'
                                      },
                                      data: [
                                        { value: 320, itemStyle: { color: '#3b82f6' } },
                                        { value: 280, itemStyle: { color: '#10b981' } },
                                        { value: 195, itemStyle: { color: '#f59e0b' } },
                                        { value: 180, itemStyle: { color: '#ef4444' } },
                                        { value: 152, itemStyle: { color: '#8b5cf6' } },
                                        { value: 120, itemStyle: { color: '#06b6d4' } }
                                      ]
                                    }]
                                  }}
                                  style={{ flexGrow: 1, width: '100%', minHeight: 0 }}
                                />
                                          </div>
                            </div>
                            {/* Right: Real-time Alerts (2/5 = 40%) */}
                            <div className="xl:col-span-2">
                              <div className="h-[448px]">
                                <RealTimeAlerts description="Real-time alerts on SLA breaches, delays, or declining enterprise engagement" />
                          </div>
                          </div>
                        </div>

                          {/* Row 2: Enterprise Distribution by Business Stage (50%) + Top 10 Enterprises by Service Request Volume (50%) */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Enterprise Distribution by Business Stage */}
                            <div className="bg-white border border-border rounded-xl p-6">
                              <h5 className="text-lg font-medium text-foreground mb-1">Enterprise Distribution by Business Stage</h5>
                              <p className="text-sm text-muted-foreground mb-4">Breakdown of enterprises by their business maturity stage</p>
                              <ReactECharts
                                option={{
                                  tooltip: {
                                    trigger: 'axis',
                                    axisPointer: { type: 'shadow' }
                                  },
                                  grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                  },
                                  xAxis: {
                                    type: 'category',
                                    data: ['Startup', 'Growth', 'Established', 'Mature'],
                                    splitLine: { show: false }
                                  },
                                  yAxis: {
                                    type: 'value',
                                    splitLine: { show: false }
                                  },
                                  series: [{
                                    name: 'Count',
                                    type: 'bar',
                                    label: {
                                      show: true,
                                      position: 'top',
                                      formatter: '{c}'
                                    },
                                    data: [420, 380, 287, 160],
                                    itemStyle: { color: '#3b82f6' }
                                  }]
                                }}
                                style={{ height: '300px', width: '100%' }}
                              />
                            </div>
                                    
                            {/* Top 10 Enterprises by Service Request Volume */}
                            <div className="bg-white border border-border rounded-xl p-6">
                              <h5 className="text-lg font-medium text-foreground mb-1">Top 10 Enterprises by Service Request Volume</h5>
                              <p className="text-sm text-muted-foreground mb-4">Leading enterprises ranked by total service requests</p>
                              <ReactECharts
                                option={{
                                  tooltip: {
                                    trigger: 'axis',
                                    axisPointer: { type: 'shadow' }
                                  },
                                  grid: {
                                    left: '15%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                  },
                                  xAxis: {
                                    type: 'value',
                                    splitLine: { show: false }
                                  },
                                  yAxis: {
                                    type: 'category',
                                    width: 'auto',
                                    data: [
                                      'TechCorp Solutions',
                                      'FinanceHub Inc',
                                      'HealthCare Plus',
                                      'RetailMax Group',
                                      'Manufacturing Pro',
                                      'ServiceMaster Ltd',
                                      'Digital Dynamics',
                                      'Enterprise Solutions',
                                      'Business Partners Co',
                                      'Growth Ventures'
                                    ]
                                  },
                                  series: [{
                                    name: 'Volume',
                                    type: 'bar',
                                    label: {
                                      show: true,
                                      position: 'right',
                                      formatter: '{c}'
                                    },
                                    data: [245, 198, 176, 154, 142, 128, 115, 98, 87, 76],
                                    itemStyle: { color: '#10b981' }
                                  }]
                                }}
                                style={{ height: '300px', width: '100%' }}
                              />
                          </div>
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

                        {/* Enterprise Engagement Trends Section */}
                        <div className="mb-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className={`w-1 h-12 rounded-full bg-${layer?.color}-500`}></div>
                          <div className="flex-1">
                              <h4 className="text-xl font-light text-foreground mb-2">Enterprise Engagement Trends</h4>
                            <p className="text-sm text-muted-foreground">
                                Track service demand, utilization, and engagement changes over time.
                            </p>
                                </div>
                              </div>
                              
                          {/* Row 1: Service Requests by New vs Repeated Users Over Time - Full Width */}
                          <div className="mb-6">
                            <div className="bg-white border border-border rounded-xl p-6">
                              <h5 className="text-lg font-medium text-foreground mb-1">Service Requests by New vs Repeated Users Over Time</h5>
                              <p className="text-sm text-muted-foreground mb-4">Comparison of new enterprise requests versus repeat customer activity</p>
                              <ReactECharts
                                option={{
                                  tooltip: {
                                    trigger: 'axis'
                                  },
                                  legend: {
                                    data: ['New Enterprises', 'Repeated Users'],
                                    bottom: 0
                                  },
                                  grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '15%',
                                    containLabel: true
                                  },
                                  xAxis: {
                                    type: 'category',
                                    boundaryGap: false,
                                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                    splitLine: { show: false }
                                  },
                                  yAxis: {
                                    type: 'value',
                                    splitLine: { show: false }
                                  },
                                  series: [
                                    {
                                      name: 'New Enterprises',
                                      type: 'line',
                                      smooth: true,
                                      label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{c}'
                                      },
                                      data: [320, 340, 360, 380, 400, 420],
                                      itemStyle: { color: '#3b82f6' }
                                    },
                                    {
                                      name: 'Repeated Users',
                                      type: 'line',
                                      smooth: true,
                                      label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{c}'
                                      },
                                      data: [580, 620, 650, 680, 720, 750],
                                      itemStyle: { color: '#10b981' }
                                    }
                                  ]
                                }}
                                style={{ height: '300px', width: '100%' }}
                          />
                                  </div>
                          </div>
                                    
                          {/* Row 2: Enterprise Drop off Rate Over Time (50%) + Average Completion Time by Enterprise Size Over Time (50%) */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Enterprise Drop off Rate Over Time */}
                              <div className="bg-white border border-border rounded-xl p-6">
                              <h5 className="text-lg font-medium text-foreground mb-1">Enterprise Drop off Rate Over Time</h5>
                              <p className="text-sm text-muted-foreground mb-4">Percentage of enterprises that disengaged from services monthly</p>
                              <ReactECharts
                                option={{
                                  tooltip: {
                                    trigger: 'axis',
                                    axisPointer: { type: 'shadow' }
                                  },
                                  grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                  },
                                  xAxis: {
                                    type: 'category',
                                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                    splitLine: { show: false }
                                  },
                                  yAxis: {
                                    type: 'value',
                                    splitLine: { show: false }
                                  },
                                  series: [{
                                    name: 'Drop off Rate (%)',
                                    type: 'bar',
                                    label: {
                                      show: true,
                                      position: 'top',
                                      formatter: '{c}%'
                                    },
                                    data: [8.2, 7.8, 7.5, 7.1, 6.8, 6.5],
                                    itemStyle: { color: '#ef4444' }
                                  }]
                                }}
                                style={{ height: '300px', width: '100%' }}
                              />
                                </div>

                            {/* Average Completion Time by Enterprise Size Over Time */}
                              <div className="bg-white border border-border rounded-xl p-6">
                              <h5 className="text-lg font-medium text-foreground mb-1">Average Completion Time by Enterprise Size Over Time</h5>
                              <p className="text-sm text-muted-foreground mb-4">Service completion duration segmented by enterprise size categories</p>
                              <ReactECharts
                                option={{
                                  tooltip: {
                                    trigger: 'axis',
                                    axisPointer: { type: 'shadow' }
                                  },
                                  legend: {
                                    data: ['Micro', 'Small', 'Medium', 'Large'],
                                    bottom: 0
                                  },
                                  grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '15%',
                                    containLabel: true
                                  },
                                  xAxis: {
                                    type: 'category',
                                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                    splitLine: { show: false }
                                  },
                                  yAxis: {
                                    type: 'value',
                                    splitLine: { show: false }
                                  },
                                  series: [
                                    {
                                      name: 'Micro',
                                      type: 'bar',
                                      stack: 'total',
                                      label: {
                                        show: true,
                                        position: 'inside',
                                        formatter: '{c}'
                                      },
                                      data: [2.1, 2.0, 1.9, 1.8, 1.7, 1.6],
                                      itemStyle: { color: '#3b82f6' }
                                    },
                                    {
                                      name: 'Small',
                                      type: 'bar',
                                      stack: 'total',
                                      label: {
                                        show: true,
                                        position: 'inside',
                                        formatter: '{c}'
                                      },
                                      data: [3.2, 3.1, 3.0, 2.9, 2.8, 2.7],
                                      itemStyle: { color: '#10b981' }
                                    },
                                    {
                                      name: 'Medium',
                                      type: 'bar',
                                      stack: 'total',
                                      label: {
                                        show: true,
                                        position: 'inside',
                                        formatter: '{c}'
                                      },
                                      data: [4.5, 4.4, 4.3, 4.2, 4.1, 4.0],
                                      itemStyle: { color: '#f59e0b' }
                                    },
                                    {
                                      name: 'Large',
                                      type: 'bar',
                                      stack: 'total',
                                      label: {
                                        show: true,
                                        position: 'inside',
                                        formatter: '{c}'
                                      },
                                      data: [5.8, 5.7, 5.6, 5.5, 5.4, 5.3],
                                      itemStyle: { color: '#ef4444' }
                                    }
                                  ]
                                }}
                                style={{ height: '300px', width: '100%' }}
                              />
                                </div>
                            </div>
                        </div>

                        {/* Enterprise Satisfaction & Feedback Section */}
                        <div className="mb-12">
                          <div className="flex items-center gap-4 mb-8">
                            <div className={`w-1 h-12 rounded-full bg-${layer?.color}-500`}></div>
                            <div className="flex-1">
                              <h4 className="text-xl font-light text-foreground mb-2">Enterprise Satisfaction & Feedback</h4>
                              <p className="text-sm text-muted-foreground">
                                Measure enterprise satisfaction and capture insights from feedback across service categories.
                              </p>
                            </div>
                          </div>

                          {/* Satisfaction Score Over Time */}
                          <div className="bg-white border border-border rounded-xl p-6">
                            <h5 className="text-lg font-medium text-foreground mb-1">Satisfaction Score Over Time</h5>
                            <p className="text-sm text-muted-foreground mb-4">Monthly trend of enterprise satisfaction ratings</p>
                            <ReactECharts
                              option={{
                                tooltip: {
                                  trigger: 'axis'
                                },
                                grid: {
                                  left: '3%',
                                  right: '4%',
                                  bottom: '3%',
                                  containLabel: true
                                },
                                xAxis: {
                                  type: 'category',
                                  boundaryGap: false,
                                  data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                                },
                                yAxis: {
                                  type: 'value',
                                  min: 4.0,
                                  max: 5.0,
                                  splitLine: { show: false }
                                },
                                series: [{
                                  name: 'Satisfaction Score',
                                  type: 'line',
                                  smooth: true,
                                  label: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{c}'
                                  },
                                  data: [4.2, 4.3, 4.4, 4.5, 4.5, 4.6],
                                  itemStyle: { color: '#8b5cf6' },
                                  lineStyle: { width: 2 }
                                }]
                              }}
                              style={{ height: '300px', width: '100%' }}
                            />
                          </div>
                        </div>

                      </div>
                      )}

                      {/* AI Insights - Show on all tabs */}
                      <AIInsights
                      sectionTitle={`${layer?.label} Analytics`}
                      sectionData={config}
                      sectionType="descriptive" />


                    </div>);
                })()}
                </div>
              </div>
            </>);
            } else if (activeDashboardTab === 'operations' && activeSecondLayerTab === 'dashboard-2') {
              return (
                /* Dashboard 2 Dynamic Content */
                <div className="text-center py-20">
                  <Icon name="Construction" size={64} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-2">Dashboard 2 - Provider Analytics</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Advanced provider performance analytics and insights.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                      <Icon name="Users" size={16} />
                      <span>Active Tab: Operations</span>
                            </div>
                    <span className="mx-2">•</span>
                      <div className="flex items-center gap-2">
                      <Icon name="Layout" size={16} />
                      <span>Selected Dashboard: Dashboard 2</span>
                            </div>
                        </div>
                      </div>
              );
            } else if (activeDashboardTab === 'market') {
              return (
                /* Market Dashboard Dynamic Content */
                <div className="text-center py-20">
                  <Icon name="TrendingUp" size={64} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-2">Market Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Market penetration, growth trends, and competitive analysis.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                      <Icon name="TrendingUp" size={16} />
                      <span>Active Tab: Market</span>
                            </div>
                        </div>
                      </div>
              );
            } else if (activeDashboardTab === 'strategic') {
              return (
                /* Strategic Dashboard Dynamic Content */
                <div className="text-center py-20">
                  <Icon name="Target" size={64} className="text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-2">Strategic Planning Dashboard</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Strategic goals, long-term planning, and organizational objectives.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                      <Icon name="Target" size={16} />
                      <span>Active Tab: Strategic</span>
                            </div>
                        </div>
                      </div>
              );
            } else {
              return (
                /* Default Placeholder */
          <div className="text-center py-20">
              <Icon name="Construction" size={64} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">Dashboard Under Development</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    The "{activeDashboardTab}" dashboard is currently being developed.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={16} />
                      <span>Active Tab: {activeDashboardTab}</span>
                </div>
                </div>
              </div>
              );
          }
          })()}
      </main>
    </div>);

};

export default EJPOperationsDashboard;