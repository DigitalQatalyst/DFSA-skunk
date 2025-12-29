/**
 * DFSA Pathway Selection Types
 * Type definitions for Authorization, Registration, and Recognition pathways
 */

/**
 * Base interface for pathway/category cards
 */
export interface PathwayCard {
  id: string;
  code: string; // Abbreviation displayed in top-left corner
  title: string;
  description: string;
  meta: string; // Additional information displayed at bottom
}

/**
 * Authorization pathways for financial services
 */
export interface AuthorizationPathway extends PathwayCard {
  activities?: number;
  categories?: string;
}

/**
 * Registration categories
 */
export interface RegistrationCategory extends PathwayCard {
  module: string; // Regulatory module (AUD, AML, etc.)
}

/**
 * Recognition categories
 */
export interface RecognitionCategory extends PathwayCard {
  module: string; // Regulatory module
}

/**
 * Pathway selection state
 */
export interface PathwaySelection {
  selectedId: string | null;
  pathwayType: 'authorization' | 'registration' | 'recognition';
}
