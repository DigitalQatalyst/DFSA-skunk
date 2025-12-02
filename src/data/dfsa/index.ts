/**
 * DFSA Platform Data - Central Export
 * All data structures for the DFSA Regulatory Services Platform
 */

// License Categories
export * from './licenseCategories';

// Authorization Journey
export * from './authorizationSteps';

// Key Personnel
export * from './keyPersonnel';

// Compliance Services
export * from './complianceServices';

// Pricing & Packages
export * from './pricingPackages';

// Testimonials
export * from './testimonials';

// FAQ
export * from './faq';

// Resources
export * from './resources';

/**
 * Quick access exports for commonly used data
 */
import { licenseCategories } from './licenseCategories';
import { authorizationSteps } from './authorizationSteps';
import { keyPersonnel } from './keyPersonnel';
import { complianceServices } from './complianceServices';
import { authorizationPackages, complianceSubscriptions } from './pricingPackages';
import { testimonials } from './testimonials';
import { faqs } from './faq';
import { resources } from './resources';

export const dfsaData = {
  licenseCategories,
  authorizationSteps,
  keyPersonnel,
  complianceServices,
  authorizationPackages,
  complianceSubscriptions,
  testimonials,
  faqs,
  resources,
};

export default dfsaData;
