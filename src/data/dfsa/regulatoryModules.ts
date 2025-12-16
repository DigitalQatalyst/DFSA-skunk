/**
 * DFSA Regulatory Modules Data
 * Information about DFSA regulatory modules that govern licensed activities
 *
 * COMPLIANCE: Formal, neutral language per DFSA operating rules
 * REFERENCE: DFSA Rulebook (complete module reference)
 * LANGUAGE: British English spelling
 *
 * Each module contains rules and guidance specific to different aspects
 * of financial services regulation in the DIFC.
 */

import { RegulatoryModule } from '../types/dfsa-activities';

/**
 * DFSA Regulatory Modules
 * Complete list of regulatory modules from the DFSA Rulebook
 */
export const regulatoryModules: RegulatoryModule[] = [
  // ==========================================
  // General Modules
  // ==========================================
  {
    code: 'GEN',
    name: 'General Module',
    description:
      'Applies to all Authorised Persons and contains general provisions including definitions, application of rules, and authorisation requirements.',
    type: 'General',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/gen'
  },

  {
    code: 'AUT',
    name: 'Authorisation Module',
    description:
      'Sets out requirements for obtaining and maintaining authorisation to conduct Financial Services in or from the DIFC.',
    type: 'General',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/aut'
  },

  {
    code: 'SUP',
    name: 'Supervision Module',
    description:
      'Contains requirements relating to notification, reports, and regulatory returns that Authorised Firms must submit to the DFSA.',
    type: 'General',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/sup'
  },

  {
    code: 'ENF',
    name: 'Enforcement Module',
    description:
      'Sets out the DFSA\'s enforcement procedures and the imposition of financial penalties and other sanctions.',
    type: 'General',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/enf'
  },

  // ==========================================
  // Conduct of Business Modules
  // ==========================================
  {
    code: 'COB',
    name: 'Conduct of Business Module',
    description:
      'Contains conduct requirements for firms dealing with clients, including client classification, disclosure obligations, and fair treatment standards.',
    type: 'Conduct',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/cob'
  },

  {
    code: 'AMEN',
    name: 'Anti-Money Laundering, Counter-Terrorist Financing and Sanctions Module',
    description:
      'Sets out AML, CTF and sanctions requirements for detecting, preventing and reporting money laundering and terrorist financing activities.',
    type: 'Conduct',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/amen'
  },

  {
    code: 'REP',
    name: 'Representative Office Module',
    description:
      'Contains requirements for firms operating Representative Offices in the DIFC for marketing and liaison purposes only.',
    type: 'Conduct',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/rep'
  },

  // ==========================================
  // Prudential Modules
  // ==========================================
  {
    code: 'PIB',
    name: 'Prudential - Investment, Insurance Intermediation and Banking Module',
    description:
      'Contains prudential requirements for firms conducting Banking, Investment or Insurance Intermediation business, including capital adequacy standards.',
    type: 'Prudential',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/pib'
  },

  {
    code: 'PIN',
    name: 'Prudential - Insurance Business Module',
    description:
      'Sets out prudential requirements for Insurers carrying on Insurance Business or Insurance Intermediation in or from the DIFC.',
    type: 'Prudential',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/pin'
  },

  {
    code: 'PRU',
    name: 'Prudential Returns Module',
    description:
      'Specifies the prudential returns that Authorised Firms must submit to the DFSA for supervisory purposes.',
    type: 'Prudential',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/pru'
  },

  // ==========================================
  // Specialised Modules
  // ==========================================
  {
    code: 'AMI',
    name: 'Authorised Market Institutions Module',
    description:
      'Contains requirements for operating an Authorised Market Institution such as an Exchange, Clearing House or central securities depository.',
    type: 'Specialised',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/ami'
  },

  {
    code: 'CIF',
    name: 'Collective Investment Funds Module',
    description:
      'Sets out requirements for Collective Investment Funds, including Domestic Funds, Foreign Funds and their operators.',
    type: 'Specialised',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/cif'
  },

  {
    code: 'IFR',
    name: 'Islamic Finance Rules Module',
    description:
      'Contains rules and guidance for firms conducting Islamic Financial Business, ensuring compliance with Shari\'a principles.',
    type: 'Specialised',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/ifr'
  },

  {
    code: 'OSR',
    name: 'Operating a Securities or Derivatives Clearing House Module',
    description:
      'Sets out requirements specific to operating a Securities or Derivatives Clearing House in the DIFC.',
    type: 'Specialised',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/osr'
  },

  {
    code: 'CSD',
    name: 'Central Securities Depository Module',
    description:
      'Contains requirements for operating a Central Securities Depository and providing related services.',
    type: 'Specialised',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/csd'
  },

  {
    code: 'CAR',
    name: 'Credit Rating Module',
    description:
      'Sets out requirements for firms operating as Credit Rating Agencies, including governance and methodology standards.',
    type: 'Specialised',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/car'
  },

  {
    code: 'TSP',
    name: 'Trust Service Providers Module',
    description:
      'Contains requirements for firms providing trust services, including acting as trustee or providing fiduciary services.',
    type: 'Specialised',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/tsp'
  },

  {
    code: 'IFB',
    name: 'Islamic Finance Business Module',
    description:
      'Provides specific rules for conducting Islamic finance business activities in compliance with Shari\'a principles.',
    type: 'Specialised',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/ifb'
  },

  {
    code: 'AML',
    name: 'Anti-Money Laundering Module',
    description:
      'Contains anti-money laundering and counter-terrorist financing requirements (note: consolidated into AMEN module).',
    type: 'Conduct',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/aml'
  },

  {
    code: 'CIR',
    name: 'Collective Investment Rules',
    description:
      'Supplementary rules for Collective Investment Funds, their operators and service providers.',
    type: 'Specialised',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/cir'
  },

  {
    code: 'VCC',
    name: 'Variable Capital Company Module',
    description:
      'Requirements for Variable Capital Companies, a corporate structure specifically designed for investment funds.',
    type: 'Specialised',
    ruleBookUrl: 'https://www.dfsa.ae/rulebooks/modules/vcc'
  }
];

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get module by code
 * @param code Module code (e.g., "GEN", "AUT", "COB")
 * @returns Module information or undefined if not found
 */
export const getModuleByCode = (code: string): RegulatoryModule | undefined => {
  return regulatoryModules.find(
    (module) => module.code.toUpperCase() === code.toUpperCase()
  );
};

/**
 * Get modules by type
 * @param type Module type
 * @returns Array of modules of the specified type
 */
export const getModulesByType = (
  type: 'General' | 'Prudential' | 'Conduct' | 'Specialised'
): RegulatoryModule[] => {
  return regulatoryModules.filter((module) => module.type === type);
};

/**
 * Get all general modules
 * @returns Array of general modules
 */
export const getGeneralModules = (): RegulatoryModule[] => {
  return getModulesByType('General');
};

/**
 * Get all conduct modules
 * @returns Array of conduct modules
 */
export const getConductModules = (): RegulatoryModule[] => {
  return getModulesByType('Conduct');
};

/**
 * Get all prudential modules
 * @returns Array of prudential modules
 */
export const getPrudentialModules = (): RegulatoryModule[] => {
  return getModulesByType('Prudential');
};

/**
 * Get all specialised modules
 * @returns Array of specialised modules
 */
export const getSpecialisedModules = (): RegulatoryModule[] => {
  return getModulesByType('Specialised');
};

/**
 * Get modules for specific activity
 * @param moduleCodes Array of module codes
 * @returns Array of module information
 */
export const getModulesForActivity = (
  moduleCodes: string[]
): RegulatoryModule[] => {
  return moduleCodes
    .map((code) => getModuleByCode(code))
    .filter((module): module is RegulatoryModule => module !== undefined);
};

/**
 * Check if module is core/mandatory
 * GEN and AUT are typically applicable to all authorised persons
 * @param code Module code
 * @returns Boolean indicating if module is core
 */
export const isCoreModule = (code: string): boolean => {
  return ['GEN', 'AUT'].includes(code.toUpperCase());
};

/**
 * Get module display name (code and name)
 * @param code Module code
 * @returns Formatted display string
 */
export const getModuleDisplayName = (code: string): string => {
  const module = getModuleByCode(code);
  return module ? `${module.code} - ${module.name}` : code;
};

/**
 * Get all module codes for dropdown selections
 * @returns Array of module codes sorted alphabetically
 */
export const getAllModuleCodes = (): string[] => {
  return regulatoryModules.map((module) => module.code).sort();
};

/**
 * Search modules by query
 * @param query Search query
 * @returns Array of matching modules
 */
export const searchModules = (query: string): RegulatoryModule[] => {
  const lowerQuery = query.toLowerCase();
  return regulatoryModules.filter(
    (module) =>
      module.code.toLowerCase().includes(lowerQuery) ||
      module.name.toLowerCase().includes(lowerQuery) ||
      module.description.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get module options for selection components
 * @returns Array of module options
 */
export const getModuleOptions = (): Array<{ value: string; label: string }> => {
  return regulatoryModules.map((module) => ({
    value: module.code,
    label: `${module.code} - ${module.name}`
  }));
};
