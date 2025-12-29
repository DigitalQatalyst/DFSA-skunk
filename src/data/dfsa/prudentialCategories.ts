/**
 * DFSA Prudential Categories Data
 * Information about DFSA prudential categories including capital requirements and color schemes
 *
 * COMPLIANCE: Formal, neutral language per DFSA operating rules
 * REFERENCE: DFSA Prudential - Investment, Insurance Intermediation and Banking Module (PIB)
 * LANGUAGE: British English spelling
 *
 * Note: Capital requirements are indicative and subject to DFSA determination
 * based on business model, risk profile, and regulatory assessment.
 */

import { PrudentialCategory, PrudentialCategoryInfo } from '../types/dfsa-activities';

/**
 * Prudential Categories Information
 * Defines all DFSA prudential categories with UI color schemes
 */
export const prudentialCategories: PrudentialCategoryInfo[] = [
  // ==========================================
  // Category 1: Banks & Deposit-Takers
  // ==========================================
  {
    code: 'Cat 1',
    name: 'Category 1 - Banks & Deposit-Takers',
    description:
      'Banks and deposit-taking institutions with the highest capital requirements. Typically includes entities accepting deposits from retail or wholesale clients and engaging in lending activities.',
    capitalRange: {
      min: 10000000,
      display: '$10,000,000+ USD'
    },
    colorScheme: {
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
      border: 'border-l-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    typicalActivities: [
      'Accepting Deposits (A1)',
      'Providing Credit (A2)',
      'Operating an Exchange (A9)',
      'Operating a Clearing House (A10)'
    ]
  },

  // ==========================================
  // Category 2: Principal Dealers & Credit Providers
  // ==========================================
  {
    code: 'Cat 2',
    name: 'Category 2 - Principal Dealers & Credit Providers',
    description:
      'Firms dealing in investments as principal or providing credit facilities. These firms trade on their own account and assume principal risk.',
    capitalRange: {
      min: 2000000,
      max: 9999999,
      display: '$2,000,000 - $9,999,999 USD'
    },
    colorScheme: {
      badge: 'bg-green-100 text-green-800 border-green-300',
      border: 'border-l-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    typicalActivities: ['Dealing in Investments as Principal (A3)']
  },

  // ==========================================
  // Category 3A: Agent Dealers
  // ==========================================
  {
    code: 'Cat 3A',
    name: 'Category 3A - Agent Dealers',
    description:
      'Firms dealing in investments as agent for clients. Note: Base capital requirement reduces from $500,000 to $200,000 effective July 2025.',
    capitalRange: {
      min: 500000,
      max: 1999999,
      display: '$500,000 USD ($200,000 from July 2025)'
    },
    colorScheme: {
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      border: 'border-l-amber-500',
      gradient: 'from-amber-500 to-amber-600'
    },
    typicalActivities: ['Dealing in Investments as Agent (A4)']
  },

  // ==========================================
  // Category 3B: Fund Trustees & Custodians
  // ==========================================
  {
    code: 'Cat 3B',
    name: 'Category 3B - Fund Trustees & Custodians',
    description:
      'Firms providing custody services or acting as trustee of funds. These firms safeguard client assets and provide fiduciary oversight.',
    capitalRange: {
      min: 500000,
      max: 1999999,
      display: '$500,000 USD'
    },
    colorScheme: {
      badge: 'bg-pink-100 text-pink-800 border-pink-300',
      border: 'border-l-pink-500',
      gradient: 'from-pink-500 to-pink-600'
    },
    typicalActivities: [
      'Providing Custody (A11)',
      'Acting as Trustee of a Fund (A14)'
    ]
  },

  // ==========================================
  // Category 3C: Asset Managers & Trust Services
  // ==========================================
  {
    code: 'Cat 3C',
    name: 'Category 3C - Asset Managers & Trust Services',
    description:
      'Firms managing assets, collective investment funds, or providing trust services. Includes discretionary portfolio management and fund management.',
    capitalRange: {
      min: 500000,
      max: 1999999,
      display: '$500,000 USD'
    },
    colorScheme: {
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      border: 'border-l-indigo-500',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    typicalActivities: [
      'Managing Assets (A6)',
      'Managing a Collective Investment Fund (A13)',
      'Insurance Management (A17)',
      'Providing Trust Services (A18)',
      'Managing a PSIA (A19)'
    ]
  },

  // ==========================================
  // Category 3D: Money Services Businesses
  // ==========================================
  {
    code: 'Cat 3D',
    name: 'Category 3D - Money Services Businesses',
    description:
      'Firms providing money transmission, currency exchange, or payment services. Specialized category for money services business activities.',
    capitalRange: {
      min: 140000,
      max: 499999,
      display: '$140,000 USD'
    },
    colorScheme: {
      badge: 'bg-teal-100 text-teal-800 border-teal-300',
      border: 'border-l-teal-500',
      gradient: 'from-teal-500 to-teal-600'
    },
    typicalActivities: ['Providing Money Services (A20)']
  },

  // ==========================================
  // Category 4: Advisory & Arranging Firms
  // ==========================================
  {
    code: 'Cat 4',
    name: 'Category 4 - Advisory & Arranging Firms',
    description:
      'Firms providing advisory or arranging services without holding client money or assets. The lowest capital requirement category for most advisory activities.',
    capitalRange: {
      min: 10000,
      max: 139999,
      display: '$10,000 - $50,000 USD'
    },
    colorScheme: {
      badge: 'bg-purple-100 text-purple-800 border-purple-300',
      border: 'border-l-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    typicalActivities: [
      'Arranging Deals in Investments (A5)',
      'Advising on Financial Products (A7)',
      'Arranging Credit or Advising on Credit (A8)',
      'Arranging Custody (A12)',
      'Providing Fund Administration (A15)',
      'Insurance Intermediation (A16)'
    ]
  },

  // ==========================================
  // Category 5: Islamic Finance & Crowdfunding
  // ==========================================
  {
    code: 'Cat 5',
    name: 'Category 5 - Islamic Finance & Crowdfunding Platforms',
    description:
      'Specialised category for Islamic finance windows, crowdfunding platforms, and related financial service providers.',
    capitalRange: {
      min: 50000,
      max: 500000,
      display: '$50,000 - $500,000 USD'
    },
    colorScheme: {
      badge: 'bg-orange-100 text-orange-800 border-orange-300',
      border: 'border-l-orange-500',
      gradient: 'from-orange-500 to-orange-600'
    },
    typicalActivities: [
      'Islamic Finance Window Operations',
      'Operating a Crowdfunding Platform',
      'Islamic Investment Services'
    ]
  }
];

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get category information by code
 * @param code Prudential category code
 * @returns Category information or undefined if not found
 */
export const getCategoryByCode = (
  code: PrudentialCategory
): PrudentialCategoryInfo | undefined => {
  return prudentialCategories.find((category) => category.code === code);
};

/**
 * Get all categories sorted by capital requirement (highest to lowest)
 * @returns Array of categories sorted by minimum capital
 */
export const getCategoriesByCapital = (): PrudentialCategoryInfo[] => {
  return [...prudentialCategories].sort(
    (a, b) => b.capitalRange.min - a.capitalRange.min
  );
};

/**
 * Get categories within capital range
 * @param minCapital Minimum capital amount
 * @param maxCapital Maximum capital amount
 * @returns Array of matching categories
 */
export const getCategoriesByCapitalRange = (
  minCapital: number,
  maxCapital: number
): PrudentialCategoryInfo[] => {
  return prudentialCategories.filter(
    (category) =>
      category.capitalRange.min >= minCapital &&
      (category.capitalRange.max
        ? category.capitalRange.max <= maxCapital
        : category.capitalRange.min <= maxCapital)
  );
};

/**
 * Get the appropriate category for a given capital amount
 * @param capitalAmount Capital amount in USD
 * @returns Best matching category
 */
export const getCategoryForCapital = (
  capitalAmount: number
): PrudentialCategoryInfo | undefined => {
  // Sort categories by minimum capital (descending)
  const sorted = [...prudentialCategories].sort(
    (a, b) => b.capitalRange.min - a.capitalRange.min
  );

  // Find first category where capital amount meets or exceeds minimum
  return sorted.find((category) => capitalAmount >= category.capitalRange.min);
};

/**
 * Get all unique color badges
 * @returns Array of badge color class strings
 */
export const getAllCategoryColors = (): string[] => {
  return prudentialCategories.map((category) => category.colorScheme.badge);
};

/**
 * Determine if a category requires enhanced supervision
 * Categories 1, 2, and 3 typically require more oversight
 * @param code Category code
 * @returns Boolean indicating enhanced supervision requirement
 */
export const requiresEnhancedSupervision = (
  code: PrudentialCategory
): boolean => {
  return ['Cat 1', 'Cat 2', 'Cat 3A', 'Cat 3B', 'Cat 3C', 'Cat 3D'].includes(
    code
  );
};

/**
 * Get category display name (short form)
 * @param code Category code
 * @returns Short display name
 */
export const getCategoryShortName = (code: PrudentialCategory): string => {
  const category = getCategoryByCode(code);
  return category ? category.code : code;
};

/**
 * Get all categories for selection dropdowns
 * @returns Array of category options
 */
export const getCategoryOptions = (): Array<{
  value: PrudentialCategory;
  label: string;
}> => {
  return prudentialCategories.map((category) => ({
    value: category.code,
    label: `${category.code} - ${category.name.split(' - ')[1] || category.name}`
  }));
};
