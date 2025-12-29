/**
 * DFSA Financial Services Activities Data
 * Complete listing of DFSA-regulated financial services activities
 *
 * COMPLIANCE: All descriptions use formal, neutral language per DFSA operating rules
 * REFERENCE: DFSA Rulebook - General Module (GEN) Schedule 1
 * LANGUAGE: British English spelling (authorisation, licence, etc.)
 *
 * Note: All capital requirements, fees, and processing times are indicative
 * and subject to DFSA determination based on individual circumstances.
 */

import { FinancialActivity } from '../types/dfsa-activities';

/**
 * Pathway 1: Banking, Investment, Insurance Intermediation (BII)
 * Activities A1-A20 represent the core financial services activities
 * available under this authorisation pathway
 */
export const financialActivities: FinancialActivity[] = [
  // ==========================================
  // A1: Accepting Deposits
  // ==========================================
  {
    id: 'a1-accepting-deposits',
    activityCode: 'A1',
    activityName: 'Accepting Deposits',
    description: 'Accepting money from the public as deposits or other repayable funds pursuant to the General Module (GEN) and Authorisation Module (AUT). This activity involves taking deposits that are repayable on demand or at agreed intervals.',
    prudentialCategory: 'Cat 1',
    baseCapitalRequirement: {
      amount: 10000000,
      display: '$10,000,000 USD'
    },
    applicationFee: {
      amount: 75000,
      display: '$75,000 USD'
    },
    processingTime: {
      days: 270,
      display: '6-12 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'AMEN', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    products: [
      'Demand Deposits',
      'Time Deposits',
      'Savings Accounts',
      'Current Accounts',
      'Fixed Deposits',
      'Notice Accounts'
    ],
    ruleReferences: ['AUT 3.1.1', 'GEN 2.2', 'GEN Schedule 1'],
    triggersForm: '2-12 Banking'
  },

  // ==========================================
  // A2: Providing Credit
  // ==========================================
  {
    id: 'a2-providing-credit',
    activityCode: 'A2',
    activityName: 'Providing Credit',
    description: 'Granting credits such as consumer credit, mortgage credit, factoring, or commercial lending per the Authorisation Module (AUT). This includes all forms of credit provision to retail, professional, and institutional clients.',
    prudentialCategory: 'Cat 1',
    baseCapitalRequirement: {
      amount: 10000000,
      display: '$10,000,000 USD'
    },
    applicationFee: {
      amount: 75000,
      display: '$75,000 USD'
    },
    processingTime: {
      days: 270,
      display: '6-12 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'AMEN', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    products: [
      'Commercial Loans',
      'Consumer Credit',
      'Mortgage Lending',
      'Trade Finance',
      'Factoring Services',
      'Leasing Arrangements'
    ],
    ruleReferences: ['AUT 3.1.1', 'COB 2.3'],
    triggersForm: '2-12 Banking'
  },

  // ==========================================
  // A3: Dealing in Investments as Principal
  // ==========================================
  {
    id: 'a3-dealing-investments-principal',
    activityCode: 'A3',
    activityName: 'Dealing in Investments as Principal',
    description: 'Buying, selling, subscribing for, or underwriting investments as principal pursuant to the General Module (GEN). The firm acts on its own account rather than as agent for clients.',
    prudentialCategory: 'Cat 2',
    baseCapitalRequirement: {
      amount: 2000000,
      display: '$2,000,000 USD'
    },
    applicationFee: {
      amount: 50000,
      display: '$50,000 USD'
    },
    processingTime: {
      days: 210,
      display: '5-9 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'PIB', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    products: [
      'Shares',
      'Debentures',
      'Government Securities',
      'Derivatives',
      'Warrants',
      'Investment Certificates'
    ],
    ruleReferences: ['AUT 3.1.2', 'GEN Schedule 1'],
    triggersForm: '2-5 Dealing in Investments'
  },

  // ==========================================
  // A4: Dealing in Investments as Agent
  // ==========================================
  {
    id: 'a4-dealing-investments-agent',
    activityCode: 'A4',
    activityName: 'Dealing in Investments as Agent',
    description: 'Buying, selling, subscribing for, or underwriting investments as agent for clients pursuant to the General Module (GEN). The firm acts on behalf of clients rather than on its own account.',
    prudentialCategory: 'Cat 3A',
    baseCapitalRequirement: {
      amount: 500000,
      display: '$500,000 USD'
    },
    applicationFee: {
      amount: 30000,
      display: '$30,000 USD'
    },
    processingTime: {
      days: 180,
      display: '4-8 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'PIB', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    products: [
      'Shares',
      'Debentures',
      'Units in Collective Investment Funds',
      'Derivatives',
      'Structured Products'
    ],
    ruleReferences: ['AUT 3.1.2', 'COB 4.2'],
    triggersForm: '2-5 Dealing in Investments'
  },

  // ==========================================
  // A5: Arranging Deals in Investments
  // ==========================================
  {
    id: 'a5-arranging-deals-investments',
    activityCode: 'A5',
    activityName: 'Arranging Deals in Investments',
    description: 'Making arrangements for another person to buy, sell, subscribe for, or underwrite investments pursuant to the Conduct of Business Module (COB). This includes facilitation and intermediation services.',
    prudentialCategory: 'Cat 4',
    baseCapitalRequirement: {
      amount: 10000,
      display: '$10,000 USD'
    },
    applicationFee: {
      amount: 15000,
      display: '$15,000 USD'
    },
    processingTime: {
      days: 120,
      display: '3-6 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    products: [
      'Shares',
      'Debentures',
      'Warrants',
      'Certificates',
      'Derivatives',
      'Units in Collective Investment Funds'
    ],
    ruleReferences: ['AUT 3.1.3', 'COB 5.1'],
    triggersForm: '2-4 Advising and Arranging'
  },

  // ==========================================
  // A6: Managing Assets
  // ==========================================
  {
    id: 'a6-managing-assets',
    activityCode: 'A6',
    activityName: 'Managing Assets',
    description: 'Managing assets belonging to another person in circumstances which involve the exercise of discretion pursuant to the Conduct of Business Module (COB). Includes discretionary portfolio management and fund management.',
    prudentialCategory: 'Cat 3C',
    baseCapitalRequirement: {
      amount: 500000,
      display: '$500,000 USD'
    },
    applicationFee: {
      amount: 30000,
      display: '$30,000 USD'
    },
    processingTime: {
      days: 180,
      display: '4-8 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    products: [
      'Discretionary Portfolio Management',
      'Fund Management',
      'Managed Accounts',
      'Investment Strategies'
    ],
    ruleReferences: ['AUT 3.1.4', 'COB 6.2'],
    triggersForm: '2-6 Asset Management'
  },

  // ==========================================
  // A7: Advising on Financial Products
  // ==========================================
  {
    id: 'a7-advising-financial-products',
    activityCode: 'A7',
    activityName: 'Advising on Financial Products',
    description: 'Giving advice on the merits of buying, selling, or subscribing for investments pursuant to the Conduct of Business Module (COB). Includes investment advice on financial products and securities.',
    prudentialCategory: 'Cat 4',
    baseCapitalRequirement: {
      amount: 10000,
      display: '$10,000 USD'
    },
    applicationFee: {
      amount: 15000,
      display: '$15,000 USD'
    },
    processingTime: {
      days: 120,
      display: '3-6 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    products: [
      'Shares',
      'Debentures',
      'Warrants',
      'Certificates',
      'Derivatives',
      'Long Term Insurance Contracts',
      'Structured Products',
      'Units in Collective Investment Funds',
      'Crypto Tokens',
      'Contracts for Difference (CFDs)'
    ],
    ruleReferences: ['AUT 3.1.5', 'COB 7.1'],
    triggersForm: '2-4 Advising and Arranging'
  },

  // ==========================================
  // A8: Arranging Credit or Advising on Credit
  // ==========================================
  {
    id: 'a8-arranging-advising-credit',
    activityCode: 'A8',
    activityName: 'Arranging Credit or Advising on Credit',
    description: 'Making arrangements for another person to enter into credit agreements, or providing advice on credit products pursuant to the Conduct of Business Module (COB). Includes credit intermediation and advisory services.',
    prudentialCategory: 'Cat 4',
    baseCapitalRequirement: {
      amount: 10000,
      display: '$10,000 USD'
    },
    applicationFee: {
      amount: 15000,
      display: '$15,000 USD'
    },
    processingTime: {
      days: 120,
      display: '3-6 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    products: [
      'Personal Loans',
      'Mortgage Products',
      'Business Credit',
      'Asset Finance',
      'Credit Cards'
    ],
    ruleReferences: ['AUT 3.1.6', 'COB 8.3'],
    triggersForm: '2-4 Advising and Arranging'
  },

  // ==========================================
  // A9: Operating an Exchange
  // ==========================================
  {
    id: 'a9-operating-exchange',
    activityCode: 'A9',
    activityName: 'Operating an Exchange',
    description: 'Operating a facility which enables ready buyers and sellers of investments to transact with one another pursuant to the Authorised Market Institutions (AMI) Module. Requires Authorised Market Institution status.',
    prudentialCategory: 'Cat 1',
    baseCapitalRequirement: {
      amount: 10000000,
      display: '$10,000,000 USD'
    },
    applicationFee: {
      amount: 100000,
      display: '$100,000 USD'
    },
    processingTime: {
      days: 365,
      display: '9-15 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'AMI'],
    applicableRegimes: ['AMI'],
    applicablePathways: ['bii'],
    ruleReferences: ['AUT 3.2.1', 'AMI 2.1'],
    triggersForm: '2-13 Market Infrastructure'
  },

  // ==========================================
  // A10: Operating a Clearing House
  // ==========================================
  {
    id: 'a10-operating-clearing-house',
    activityCode: 'A10',
    activityName: 'Operating a Clearing House',
    description: 'Providing clearing services for transactions in investments pursuant to the Authorised Market Institutions (AMI) Module. Includes central counterparty and settlement services.',
    prudentialCategory: 'Cat 1',
    baseCapitalRequirement: {
      amount: 10000000,
      display: '$10,000,000 USD'
    },
    applicationFee: {
      amount: 100000,
      display: '$100,000 USD'
    },
    processingTime: {
      days: 365,
      display: '9-15 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'AMI'],
    applicableRegimes: ['AMI'],
    applicablePathways: ['bii'],
    ruleReferences: ['AUT 3.2.2', 'AMI 3.1'],
    triggersForm: '2-13 Market Infrastructure'
  },

  // ==========================================
  // A11: Providing Custody
  // ==========================================
  {
    id: 'a11-providing-custody',
    activityCode: 'A11',
    activityName: 'Providing Custody',
    description: 'Safeguarding and administering investments belonging to another person pursuant to the Conduct of Business Module (COB). Includes custodian services for securities and other financial assets.',
    prudentialCategory: 'Cat 3B',
    baseCapitalRequirement: {
      amount: 500000,
      display: '$500,000 USD'
    },
    applicationFee: {
      amount: 30000,
      display: '$30,000 USD'
    },
    processingTime: {
      days: 180,
      display: '4-8 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    ruleReferences: ['AUT 3.1.7', 'COB 9.2'],
    triggersForm: '2-8 Custody'
  },

  // ==========================================
  // A12: Arranging Custody
  // ==========================================
  {
    id: 'a12-arranging-custody',
    activityCode: 'A12',
    activityName: 'Arranging Custody',
    description: 'Making arrangements for another person to safeguard and administer investments pursuant to the Conduct of Business Module (COB). Involves facilitation of custody arrangements.',
    prudentialCategory: 'Cat 4',
    baseCapitalRequirement: {
      amount: 10000,
      display: '$10,000 USD'
    },
    applicationFee: {
      amount: 15000,
      display: '$15,000 USD'
    },
    processingTime: {
      days: 120,
      display: '3-6 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    ruleReferences: ['AUT 3.1.8', 'COB 9.3'],
    triggersForm: '2-4 Advising and Arranging'
  },

  // ==========================================
  // A13: Managing a Collective Investment Fund
  // ==========================================
  {
    id: 'a13-managing-cif',
    activityCode: 'A13',
    activityName: 'Managing a Collective Investment Fund',
    description: 'Managing the property held for or within a Collective Investment Fund pursuant to the Collective Investment Funds (CIF) Module. Includes fund management and administration services.',
    prudentialCategory: 'Cat 3C',
    baseCapitalRequirement: {
      amount: 500000,
      display: '$500,000 USD'
    },
    applicationFee: {
      amount: 30000,
      display: '$30,000 USD'
    },
    processingTime: {
      days: 180,
      display: '4-8 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'CIF', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    ruleReferences: ['AUT 3.1.9', 'CIF 3.1'],
    triggersForm: '2-10 Fund Management'
  },

  // ==========================================
  // A14: Acting as Trustee of a Fund
  // ==========================================
  {
    id: 'a14-acting-trustee-fund',
    activityCode: 'A14',
    activityName: 'Acting as Trustee of a Fund',
    description: 'Acting as trustee or depositary of a Collective Investment Fund pursuant to the Collective Investment Funds (CIF) Module. Provides oversight and safeguarding of fund property.',
    prudentialCategory: 'Cat 3B',
    baseCapitalRequirement: {
      amount: 500000,
      display: '$500,000 USD'
    },
    applicationFee: {
      amount: 30000,
      display: '$30,000 USD'
    },
    processingTime: {
      days: 180,
      display: '4-8 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'CIF', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    ruleReferences: ['AUT 3.1.10', 'CIF 4.1'],
    triggersForm: '2-9 Fund Trustee'
  },

  // ==========================================
  // A15: Providing Fund Administration
  // ==========================================
  {
    id: 'a15-fund-administration',
    activityCode: 'A15',
    activityName: 'Providing Fund Administration',
    description: 'Providing fund administration services to Collective Investment Funds pursuant to the Collective Investment Funds (CIF) Module. Includes valuation, transfer agency, and regulatory compliance services.',
    prudentialCategory: 'Cat 4',
    baseCapitalRequirement: {
      amount: 50000,
      display: '$50,000 USD'
    },
    applicationFee: {
      amount: 20000,
      display: '$20,000 USD'
    },
    processingTime: {
      days: 150,
      display: '4-7 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'CIF', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    ruleReferences: ['AUT 3.1.11', 'CIF 5.2'],
    triggersForm: '2-11 Fund Administration'
  },

  // ==========================================
  // A16: Insurance Intermediation
  // ==========================================
  {
    id: 'a16-insurance-intermediation',
    activityCode: 'A16',
    activityName: 'Insurance Intermediation',
    description: 'Acting as intermediary in relation to contracts of insurance pursuant to the Conduct of Business Module (COB). Includes insurance broking and agency activities for both general and life insurance.',
    prudentialCategory: 'Cat 4',
    baseCapitalRequirement: {
      amount: 50000,
      display: '$50,000 USD'
    },
    applicationFee: {
      amount: 20000,
      display: '$20,000 USD'
    },
    processingTime: {
      days: 150,
      display: '4-7 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    products: [
      'General Insurance',
      'Life Insurance',
      'Reinsurance',
      'Health Insurance',
      'Travel Insurance'
    ],
    ruleReferences: ['AUT 3.1.12', 'COB 10.1'],
    triggersForm: '2-7 Insurance Intermediation'
  },

  // ==========================================
  // A17: Insurance Management
  // ==========================================
  {
    id: 'a17-insurance-management',
    activityCode: 'A17',
    activityName: 'Insurance Management',
    description: 'Managing the underwriting capacity of a Syndicate as managing agent pursuant to the Insurance Business (PIN) Module. Includes managing insurance risk pools and syndicates.',
    prudentialCategory: 'Cat 3C',
    baseCapitalRequirement: {
      amount: 500000,
      display: '$500,000 USD'
    },
    applicationFee: {
      amount: 30000,
      display: '$30,000 USD'
    },
    processingTime: {
      days: 180,
      display: '4-8 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    ruleReferences: ['AUT 3.1.13', 'PIN 6.1'],
    triggersForm: '2-7 Insurance Intermediation'
  },

  // ==========================================
  // A18: Providing Trust Services
  // ==========================================
  {
    id: 'a18-providing-trust-services',
    activityCode: 'A18',
    activityName: 'Providing Trust Services',
    description: 'Acting as trustee (other than as trustee of a Fund) pursuant to the Trust Service Providers (TSP) Module. Includes private trust and fiduciary services.',
    prudentialCategory: 'Cat 3C',
    baseCapitalRequirement: {
      amount: 500000,
      display: '$500,000 USD'
    },
    applicationFee: {
      amount: 30000,
      display: '$30,000 USD'
    },
    processingTime: {
      days: 180,
      display: '4-8 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'TSP', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    ruleReferences: ['AUT 3.1.14', 'TSP 2.1'],
    triggersForm: '2-14 Trust Services'
  },

  // ==========================================
  // A19: Managing a PSIA
  // ==========================================
  {
    id: 'a19-managing-psia',
    activityCode: 'A19',
    activityName: 'Managing a Profit Sharing Investment Account',
    description: 'Managing a Profit Sharing Investment Account pursuant to the Islamic Finance Business (IFB) Module. Includes management of Sharia-compliant investment accounts.',
    prudentialCategory: 'Cat 3C',
    baseCapitalRequirement: {
      amount: 500000,
      display: '$500,000 USD'
    },
    applicationFee: {
      amount: 30000,
      display: '$30,000 USD'
    },
    processingTime: {
      days: 180,
      display: '4-8 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'IFB', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['bii'],
    ruleReferences: ['AUT 3.1.15', 'IFB 3.2'],
    triggersForm: '2-15 Islamic Finance'
  },

  // ==========================================
  // A20: Providing Money Services
  // ==========================================
  {
    id: 'a20-providing-money-services',
    activityCode: 'A20',
    activityName: 'Providing Money Services',
    description: 'Operating a money services business including money transmission, currency exchange, or cheque cashing services pursuant to the Authorisation Module (AUT). Subject to specific Money Services Business requirements.',
    prudentialCategory: 'Cat 3D',
    baseCapitalRequirement: {
      amount: 140000,
      display: '$140,000 USD'
    },
    applicationFee: {
      amount: 25000,
      display: '$25,000 USD'
    },
    processingTime: {
      days: 150,
      display: '4-7 months'
    },
    regulatoryModules: ['GEN', 'AUT', 'COB', 'AML', 'PIN'],
    applicableRegimes: ['Authorised Firm'],
    applicablePathways: ['msb'],
    products: [
      'Money Transmission',
      'Currency Exchange',
      'Cheque Cashing',
      'Payment Services',
      'Remittance Services'
    ],
    ruleReferences: ['AUT 3.3.1', 'AML 4.1'],
    triggersForm: '2-16 Money Services'
  }
];

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get activity by ID
 * @param id Activity identifier
 * @returns Activity or undefined if not found
 */
export const getActivityById = (id: string): FinancialActivity | undefined => {
  return financialActivities.find((activity) => activity.id === id);
};

/**
 * Get activity by code
 * @param code Activity code (e.g., "A1", "A2")
 * @returns Activity or undefined if not found
 */
export const getActivityByCode = (code: string): FinancialActivity | undefined => {
  return financialActivities.find((activity) => activity.activityCode === code);
};

/**
 * Get activities by pathway
 * @param pathwayId Pathway identifier
 * @returns Array of activities for the specified pathway
 */
export const getActivitiesByPathway = (pathwayId: string): FinancialActivity[] => {
  return financialActivities.filter((activity) =>
    activity.applicablePathways.includes(pathwayId as any)
  );
};

/**
 * Get activities by regime
 * @param regime Regime type
 * @returns Array of activities for the specified regime
 */
export const getActivitiesByRegime = (regime: string): FinancialActivity[] => {
  return financialActivities.filter((activity) =>
    activity.applicableRegimes.includes(regime as any)
  );
};

/**
 * Get activities by prudential category
 * @param category Prudential category
 * @returns Array of activities in the specified category
 */
export const getActivitiesByCategory = (category: string): FinancialActivity[] => {
  return financialActivities.filter(
    (activity) => activity.prudentialCategory === category
  );
};

/**
 * Get activities within capital range
 * @param minCapital Minimum capital requirement
 * @param maxCapital Maximum capital requirement
 * @returns Array of activities within the capital range
 */
export const getActivitiesByCapitalRange = (
  minCapital: number,
  maxCapital: number
): FinancialActivity[] => {
  return financialActivities.filter(
    (activity) =>
      activity.baseCapitalRequirement.amount >= minCapital &&
      activity.baseCapitalRequirement.amount <= maxCapital
  );
};

/**
 * Get all unique regulatory modules
 * @returns Array of unique module codes
 */
export const getAllRegulatoryModules = (): string[] => {
  const modules = new Set<string>();
  financialActivities.forEach((activity) => {
    activity.regulatoryModules.forEach((module) => modules.add(module));
  });
  return Array.from(modules).sort();
};

/**
 * Search activities by query
 * @param query Search query
 * @returns Array of matching activities
 */
export const searchActivities = (query: string): FinancialActivity[] => {
  const lowerQuery = query.toLowerCase();
  return financialActivities.filter(
    (activity) =>
      activity.activityName.toLowerCase().includes(lowerQuery) ||
      activity.activityCode.toLowerCase().includes(lowerQuery) ||
      activity.description.toLowerCase().includes(lowerQuery) ||
      activity.regulatoryModules.some((module) =>
        module.toLowerCase().includes(lowerQuery)
      ) ||
      activity.products?.some((product) =>
        product.toLowerCase().includes(lowerQuery)
      )
  );
};
