/**
 * Financial Activities Marketplace Configuration
 * Configuration for the DFSA Financial Services Activities marketplace
 *
 * COMPLIANCE: Formal, neutral language per DFSA operating rules
 * REFERENCE: Based on existing marketplaceConfig.ts pattern
 * LANGUAGE: British English spelling
 */

import { Shield, DollarSign, Clock, FileText, Award, Building } from 'lucide-react';

/**
 * Financial Activities Marketplace Configuration
 * Defines filters, attributes, and display settings for the activities marketplace
 */
export const financialActivitiesConfig = {
  id: 'financial-activities',
  title: 'DFSA Financial Services Activities',
  description:
    'Browse and select regulated financial services activities for your authorisation application. All requirements are subject to DFSA determination based on individual circumstances.',
  route: '/activities/financial-services',
  primaryCTA: 'Add to Application',
  secondaryCTA: 'View Details',
  itemName: 'Financial Activity',
  itemNamePlural: 'Financial Activities',

  /**
   * Display Attributes
   * Key attributes shown on activity cards and detail pages
   */
  attributes: [
    {
      key: 'activityCode',
      label: 'Activity Code',
      icon: Shield,
      formatter: (value: string) => value,
    },
    {
      key: 'prudentialCategory',
      label: 'Prudential Category',
      icon: Award,
      formatter: (value: string) => value,
    },
    {
      key: 'baseCapitalRequirement',
      label: 'Base Capital Requirement',
      icon: DollarSign,
      formatter: (value: { display: string }) => value.display,
    },
    {
      key: 'applicationFee',
      label: 'Application Fee',
      icon: FileText,
      formatter: (value: { display: string }) => value.display,
    },
    {
      key: 'processingTime',
      label: 'Processing Time',
      icon: Clock,
      formatter: (value: { display: string }) => value.display,
    },
    {
      key: 'applicableRegimes',
      label: 'Applicable Regimes',
      icon: Building,
      formatter: (value: string[]) => value.join(', '),
    },
  ],

  /**
   * Filter Categories
   * Defines all filter options for the activities marketplace
   */
  filterCategories: [
    {
      id: 'regime',
      title: 'Regulatory Regime',
      type: 'radio', // Single selection
      options: [
        {
          id: 'all',
          name: 'All Regimes',
        },
        {
          id: 'authorised-firm',
          name: 'Authorised Firm',
        },
        {
          id: 'ami',
          name: 'Authorised Market Institution (AMI)',
        },
        {
          id: 'representative-office',
          name: 'Representative Office',
        },
      ],
    },
    {
      id: 'pathway',
      title: 'Authorisation Pathway',
      type: 'checkbox', // Multi-selection
      options: [
        {
          id: 'bii',
          name: 'Banking, Investment, Insurance Intermediation (BII)',
        },
        {
          id: 'ins-gen',
          name: 'Insurance (General) Business',
        },
        {
          id: 'ins-life',
          name: 'Insurance (Life) Business',
        },
        {
          id: 'msb',
          name: 'Money Services Business (MSB)',
        },
        {
          id: 'cra',
          name: 'Credit Rating Agency',
        },
        {
          id: 'pcc',
          name: 'Protected Cell Company (Insurance)',
        },
        {
          id: 'rep',
          name: 'Representative Office',
        },
      ],
    },
    {
      id: 'category',
      title: 'Prudential Category',
      type: 'checkbox', // Multi-selection
      options: [
        {
          id: 'cat-1',
          name: 'Category 1',
          description: 'Banks & Deposit-Takers ($10M+ capital)',
        },
        {
          id: 'cat-2',
          name: 'Category 2',
          description: 'Principal Dealers ($2M capital)',
        },
        {
          id: 'cat-3a',
          name: 'Category 3A',
          description: 'Agent Dealers ($500K capital)',
        },
        {
          id: 'cat-3b',
          name: 'Category 3B',
          description: 'Fund Trustees & Custodians ($500K)',
        },
        {
          id: 'cat-3c',
          name: 'Category 3C',
          description: 'Asset Managers ($500K capital)',
        },
        {
          id: 'cat-3d',
          name: 'Category 3D',
          description: 'Money Services ($140K capital)',
        },
        {
          id: 'cat-4',
          name: 'Category 4',
          description: 'Advisory & Arranging ($10K-$50K)',
        },
        {
          id: 'cat-5',
          name: 'Category 5',
          description: 'Islamic Finance & Crowdfunding',
        },
      ],
    },
    {
      id: 'capital',
      title: 'Base Capital Requirement',
      type: 'checkbox', // Multi-selection
      options: [
        {
          id: 'under-50k',
          name: 'Under $50,000 USD',
          range: { min: 0, max: 49999 },
        },
        {
          id: '50k-250k',
          name: '$50,000 - $250,000 USD',
          range: { min: 50000, max: 250000 },
        },
        {
          id: '250k-1m',
          name: '$250,000 - $1,000,000 USD',
          range: { min: 250001, max: 1000000 },
        },
        {
          id: '1m-10m',
          name: '$1,000,000 - $10,000,000 USD',
          range: { min: 1000001, max: 10000000 },
        },
        {
          id: 'over-10m',
          name: 'Over $10,000,000 USD',
          range: { min: 10000001, max: Infinity },
        },
      ],
    },
    {
      id: 'processing-time',
      title: 'Processing Time',
      type: 'checkbox', // Multi-selection
      options: [
        {
          id: 'under-3-months',
          name: 'Under 3 months',
          range: { min: 0, max: 90 },
        },
        {
          id: '3-6-months',
          name: '3-6 months',
          range: { min: 91, max: 180 },
        },
        {
          id: '6-12-months',
          name: '6-12 months',
          range: { min: 181, max: 365 },
        },
        {
          id: 'over-12-months',
          name: 'Over 12 months',
          range: { min: 366, max: Infinity },
        },
      ],
    },
  ],

  /**
   * Sort Options
   * Available sorting options for activities
   */
  sortOptions: [
    {
      id: 'activity-code-asc',
      label: 'Activity Code (A-Z)',
    },
    {
      id: 'activity-code-desc',
      label: 'Activity Code (Z-A)',
    },
    {
      id: 'name-asc',
      label: 'Name (A-Z)',
    },
    {
      id: 'name-desc',
      label: 'Name (Z-A)',
    },
    {
      id: 'capital-asc',
      label: 'Capital Requirement (Low to High)',
    },
    {
      id: 'capital-desc',
      label: 'Capital Requirement (High to Low)',
    },
    {
      id: 'processing-time-asc',
      label: 'Processing Time (Shortest First)',
    },
    {
      id: 'processing-time-desc',
      label: 'Processing Time (Longest First)',
    },
  ],

  /**
   * Default Settings
   */
  defaults: {
    sortBy: 'activity-code-asc',
    itemsPerPage: 12,
    viewMode: 'grid', // 'grid' or 'list'
  },

  /**
   * Page Sections
   * Sections to display on activity detail pages
   */
  detailSections: [
    'overview', // Activity description and basic info
    'requirements', // Capital, fees, processing time
    'modules', // Regulatory modules
    'products', // Optional products/services
    'pathways', // Applicable pathways and regimes
    'references', // DFSA rule references
    'related', // Related activities
  ],

  /**
   * Breadcrumb Configuration
   */
  breadcrumbs: {
    home: 'Home',
    marketplace: 'Marketplace',
    activities: 'Financial Activities',
  },

  /**
   * Empty State Messages
   */
  emptyState: {
    noResults: {
      title: 'No Activities Found',
      description:
        'No financial activities match your current filters. Try adjusting your search criteria or clearing some filters.',
      action: 'Clear Filters',
    },
    noData: {
      title: 'No Activities Available',
      description:
        'Financial activities data is currently unavailable. Please try again later.',
      action: 'Refresh Page',
    },
  },

  /**
   * Help Text & Tooltips
   */
  helpText: {
    capital:
      'Base capital requirements are indicative and subject to DFSA determination based on your business model and risk profile.',
    processing:
      'Processing times represent typical ranges. Actual duration depends on application completeness and complexity.',
    category:
      'Prudential categories determine regulatory requirements. Higher categories have stricter capital and oversight requirements.',
    regime:
      'Activities may be available under different regulatory regimes. Ensure you select the appropriate regime for your business.',
  },

  /**
   * Compliance Disclaimers
   */
  disclaimers: {
    general:
      'All capital requirements, fees, and processing times are indicative and subject to DFSA determination based on individual circumstances.',
    application:
      'Selection of activities does not guarantee authorisation. All applications are assessed individually by the DFSA.',
    requirements:
      'Additional requirements may apply based on your specific business model and proposed operations in the DIFC.',
  },
};

/**
 * Get filter option by ID
 */
export const getFilterOption = (categoryId: string, optionId: string) => {
  const category = financialActivitiesConfig.filterCategories.find(
    (cat) => cat.id === categoryId
  );
  return category?.options.find((opt: any) => opt.id === optionId);
};

/**
 * Get all pathway options
 */
export const getPathwayOptions = () => {
  const pathwayCategory = financialActivitiesConfig.filterCategories.find(
    (cat) => cat.id === 'pathway'
  );
  return pathwayCategory?.options || [];
};

/**
 * Get all category options
 */
export const getCategoryOptions = () => {
  const categoryFilter = financialActivitiesConfig.filterCategories.find(
    (cat) => cat.id === 'category'
  );
  return categoryFilter?.options || [];
};

/**
 * Get all regime options
 */
export const getRegimeOptions = () => {
  const regimeCategory = financialActivitiesConfig.filterCategories.find(
    (cat) => cat.id === 'regime'
  );
  return regimeCategory?.options || [];
};

export default financialActivitiesConfig;
