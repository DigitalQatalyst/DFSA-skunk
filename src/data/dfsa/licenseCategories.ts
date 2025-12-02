import { LicenseCategory } from '../../types/dfsa';

/**
 * DFSA Licence Categories
 * Information based on AUT Module 3 - Categories of Financial Service
 * All requirements determined by DFSA. Applications assessed individually.
 */
export const licenseCategories: LicenseCategory[] = [
  {
    id: 'category-1',
    categoryNumber: '1',
    name: 'Banking & Deposit-Taking',
    icon: 'Landmark',
    description: 'Full-scope banking institutions authorised to accept deposits and manage unrestricted profit-sharing investment accounts per AUT Module 3.1.1.',
    capitalRequirement: {
      amount: '$10 million USD',
      range: 'From USD $10 million',
      details: 'Minimum capital requirement per AMEN Module (subject to DFSA determination)',
    },
    timeline: '6-12 months (typical range, DFSA determines actual duration)',
    keyActivities: [
      'Accepting deposits (AUT 3.1.1)',
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
    description: 'Firms dealing in investments or providing credit as principal per AUT Module 3.1.2, including market makers and credit providers.',
    capitalRequirement: {
      amount: '$1 million USD',
      range: 'From USD $1 million',
      details: 'Minimum capital per AMEN Module (subject to DFSA determination)',
    },
    timeline: '5-8 months (typical range, DFSA determines actual duration)',
    keyActivities: [
      'Market making (AUT 3.1.2)',
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
    description: 'Investment services firms per AUT Module 3.1.3 including asset managers, brokers, and custodians.',
    capitalRequirement: {
      amount: '$50,000 USD',
      range: 'From USD $50,000',
      details: 'Capital requirements vary by sub-category per AMEN Module',
    },
    timeline: '4-6 months (typical range, DFSA determines actual duration)',
    subcategories: [
      {
        code: '3A',
        name: 'Brokerage',
        description: 'Trading on behalf of clients (AUT 3.1.3)',
        capitalRequirement: '$50,000 - $250,000 per AMEN Module',
      },
      {
        code: '3B',
        name: 'Custody',
        description: 'Safeguarding client assets (AUT 3.1.3)',
        capitalRequirement: '$250,000+ per AMEN Module',
      },
      {
        code: '3C',
        name: 'Asset Management',
        description: 'Managing assets, funds, trusts (AUT 3.1.3)',
        capitalRequirement: '$250,000 - $500,000 per AMEN Module',
      },
    ],
    keyActivities: [
      'Managing assets (AUT 3.1.3)',
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
    description: 'Financial advisory firms providing non-discretionary advice and arranging services per AUT Module 3.1.4.',
    capitalRequirement: {
      amount: '$10,000 USD',
      range: 'From USD $10,000',
      details: 'Capital requirement per AMEN Module (subject to DFSA determination)',
    },
    timeline: '3-5 months (typical range, DFSA determines actual duration)',
    keyActivities: [
      'Advising on financial products (AUT 3.1.4)',
      'Arranging credit facilities',
      'Arranging deals in investments',
      'Insurance mediation',
      'Investment advisory',
    ],
    idealFor: [
      'Financial advisers',
      'Consultants',
      'Advisory firms',
      'Independent advisers',
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
    description: 'Institutions offering Shari\'a-compliant financial services and products per AUT Module 3.1.5.',
    capitalRequirement: {
      amount: '$10 million USD',
      range: 'From USD $10 million',
      details: 'Capital requirements per AMEN Module with additional Shari\'a requirements per IFR Module',
    },
    timeline: '6-12 months (typical range, DFSA determines actual duration)',
    keyActivities: [
      'Islamic banking (AUT 3.1.5, IFR Module)',
      'Sukuk operations',
      'Shari\'a-compliant investments',
      'Requires Shari\'a Supervisory Board per IFR Module',
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
    name: 'Innovation Testing Licence',
    icon: 'Lightbulb',
    description: 'Test innovative financial products and services in a controlled regulatory environment pursuant to AUT Module 2.',
    capitalRequirement: {
      amount: 'Flexible',
      range: 'Determined by DFSA based on business model',
      details: 'Capital requirements determined by DFSA on case-by-case basis per AUT Module 2',
    },
    timeline: '2-4 months (typical range, DFSA determines actual duration)',
    keyActivities: [
      'Pilot innovative products (AUT Module 2)',
      'Test new technologies',
      'Limited customer base per ITL conditions',
      'Testing period determined by DFSA',
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
 * Helper function to get a specific licence category by ID or code
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
