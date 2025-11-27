import { LicenseCategory } from '../../types/dfsa';

/**
 * DFSA License Categories
 * Comprehensive list of all available license types
 */
export const licenseCategories: LicenseCategory[] = [
  {
    id: 'category-1',
    categoryNumber: '1',
    name: 'Banking & Deposit-Taking',
    icon: 'Landmark',
    description: 'Full-scope banking institutions authorized to accept deposits and manage unrestricted profit-sharing investment accounts.',
    capitalRequirement: {
      amount: '$10 million USD',
      range: 'From USD $10 million',
      details: 'Minimum capital requirement for banking authorization',
    },
    timeline: '6-12 months',
    keyActivities: [
      'Accepting deposits',
      'Providing credit facilities',
      'Managing PSIAs (unrestricted)',
      'Banking services',
    ],
    idealFor: [
      'Commercial banks',
      'Investment banks',
      'Deposit-taking institutions',
      'Full-service banks',
    ],
    detailsUrl: '/license-categories/category-1',
    gradient: 'from-primary to-dfsa-gold',
  },
  {
    id: 'category-2',
    categoryNumber: '2',
    name: 'Dealing as Principal',
    icon: 'TrendingUp',
    description: 'Firms dealing in investments or providing credit as principal, including market makers and credit providers.',
    capitalRequirement: {
      amount: '$1 million USD',
      range: 'From USD $1 million',
      details: 'Minimum capital for principal dealing activities',
    },
    timeline: '5-8 months',
    keyActivities: [
      'Market making',
      'Providing credit as principal',
      'Dealing in investments',
      'Principal trading',
    ],
    idealFor: [
      'Market makers',
      'Trading firms',
      'Credit providers',
      'Principal investors',
    ],
    detailsUrl: '/license-categories/category-2',
    gradient: 'from-dfsa-teal to-primary',
  },
  {
    id: 'category-3',
    categoryNumber: '3',
    name: 'Investment Services',
    icon: 'Briefcase',
    description: 'Diversified investment services firms including asset managers, brokers, and custodians.',
    capitalRequirement: {
      amount: '$50,000 USD',
      range: 'From USD $50,000',
      details: 'Capital requirements vary by sub-category',
    },
    timeline: '4-6 months',
    subcategories: [
      {
        code: '3A',
        name: 'Brokerage',
        description: 'Trading on behalf of clients',
        capitalRequirement: '$50,000 - $250,000',
      },
      {
        code: '3B',
        name: 'Custody',
        description: 'Safeguarding client assets',
        capitalRequirement: '$250,000+',
      },
      {
        code: '3C',
        name: 'Asset Management',
        description: 'Managing assets, funds, trusts',
        capitalRequirement: '$250,000 - $500,000',
      },
    ],
    keyActivities: [
      'Managing assets',
      'Managing collective investment funds',
      'Providing custody services',
      'Trust services',
      'Money services',
    ],
    idealFor: [
      'Asset managers',
      'Wealth managers',
      'Brokers',
      'Custodians',
      'Fund managers',
    ],
    detailsUrl: '/license-categories/category-3',
    gradient: 'from-dfsa-gold to-dfsa-teal',
  },
  {
    id: 'category-4',
    categoryNumber: '4',
    name: 'Advisory Services',
    icon: 'MessageSquare',
    description: 'Financial advisory firms providing non-discretionary advice and arranging services.',
    capitalRequirement: {
      amount: '$10,000 USD',
      range: 'From USD $10,000',
      details: 'Lowest capital requirement category',
    },
    timeline: '3-5 months',
    keyActivities: [
      'Advising on financial products',
      'Arranging credit facilities',
      'Arranging deals in investments',
      'Insurance mediation',
      'Investment advisory',
    ],
    idealFor: [
      'Financial advisors',
      'Consultants',
      'Advisory firms',
      'Independent advisors',
      'Arrangers',
    ],
    detailsUrl: '/license-categories/category-4',
    gradient: 'from-primary-dark to-primary',
  },
  {
    id: 'category-5',
    categoryNumber: '5',
    name: 'Islamic Finance',
    icon: 'Sparkles',
    description: 'Institutions offering Shari\'a-compliant financial services and products.',
    capitalRequirement: {
      amount: '$10 million USD',
      range: 'From USD $10 million',
      details: 'Same as Category 1, with additional Shari\'a requirements',
    },
    timeline: '6-12 months',
    keyActivities: [
      'Islamic banking',
      'Sukuk operations',
      'Shari\'a-compliant investments',
      'Requires Shari\'a Supervisory Board',
    ],
    idealFor: [
      'Islamic banks',
      'Sukuk issuers',
      'Shari\'a-compliant funds',
      'Islamic finance institutions',
    ],
    detailsUrl: '/license-categories/category-5',
    gradient: 'from-purple to-dfsa-gold',
  },
  {
    id: 'itl',
    categoryNumber: 'ITL',
    name: 'Innovation Testing License',
    icon: 'Lightbulb',
    description: 'Test innovative financial products and services in a controlled regulatory environment.',
    capitalRequirement: {
      amount: 'Flexible',
      range: 'Flexible based on business model',
      details: 'Customized capital requirements for FinTech startups',
    },
    timeline: '2-4 months',
    keyActivities: [
      'Pilot innovative products',
      'Test new technologies',
      'Limited customer base',
      '6-month testing period',
    ],
    badge: 'Regulatory Sandbox',
    idealFor: [
      'FinTech startups',
      'Innovative financial products',
      'Technology-driven services',
      'Pilot operations',
    ],
    detailsUrl: '/license-categories/itl',
    gradient: 'from-dfsa-teal to-purple',
  },
];

/**
 * Helper function to get a specific license category by ID or code
 */
export const getLicenseCategoryByCode = (code: string): LicenseCategory | undefined => {
  return licenseCategories.find(
    (cat) => cat.categoryNumber === code || cat.id === code
  );
};

/**
 * Helper function to get all standard categories (excluding ITL)
 */
export const getStandardCategories = (): LicenseCategory[] => {
  return licenseCategories.filter((cat) => cat.categoryNumber !== 'ITL');
};
