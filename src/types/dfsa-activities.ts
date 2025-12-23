/**
 * DFSA Financial Services Activities - Type Definitions
 * Type system for DFSA-regulated financial services activities
 *
 * COMPLIANCE: Uses British English spelling and formal regulatory language
 * REFERENCE: DFSA Rulebook - Authorisation (AUT) Module
 */

/**
 * Prudential Category Type
 * Defines the regulatory prudential category for licensed activities
 * Higher categories (Cat 1) have stricter capital requirements
 */
export type PrudentialCategory =
  | 'Cat 1'    // Banks, deposit-takers ($10M+ capital)
  | 'Cat 2'    // Principal dealers, credit providers ($2M capital)
  | 'Cat 3A'   // Agent dealers ($500K → $200K from July 2025)
  | 'Cat 3B'   // Fund trustees, custodians ($500K capital)
  | 'Cat 3C'   // Asset managers, trust services ($500K capital)
  | 'Cat 3D'   // Money services providers ($140K capital)
  | 'Cat 4'    // Advisory and arranging firms ($10K-$50K capital)
  | 'Cat 5';   // Islamic finance, crowdfunding ($50K-$500K capital)

/**
 * Regulatory Regime Type
 * The three main DFSA regulatory regimes
 */
export type RegimeType =
  | 'Authorised Firm'          // Regime 1: Entities conducting financial services
  | 'AMI'                      // Regime 2: Authorised Market Institutions
  | 'Representative Office';   // Regime 3: Marketing activities only

/**
 * Pathway ID Type
 * Authorisation pathway identifiers
 */
export type PathwayId =
  | 'bii'         // Banking, Investment, Insurance Intermediation
  | 'ins-gen'     // Insurance (General) Business
  | 'ins-life'    // Insurance (Life) Business
  | 'msb'         // Money Services Business
  | 'cra'         // Credit Rating Agency
  | 'pcc'         // Protected Cell Company
  | 'rep';        // Representative Office

/**
 * Financial Activity Interface
 * Represents a DFSA-regulated financial services activity
 */
export interface FinancialActivity {
  /** Unique identifier (kebab-case) */
  id: string;

  /** Activity code as per DFSA Rulebook (e.g., "A1", "A2") */
  activityCode: string;

  /** Full name of the financial activity */
  activityName: string;

  /**
   * Detailed description of the activity
   * Should include DFSA rule references and formal language
   */
  description: string;

  /** Prudential category determining capital requirements */
  prudentialCategory: PrudentialCategory;

  /** Base capital requirement for this activity */
  baseCapitalRequirement: {
    /** Amount in USD (numeric for filtering/sorting) */
    amount: number;
    /** Formatted display string */
    display: string;
  };

  /** DFSA application fee for this activity */
  applicationFee: {
    /** Amount in USD (numeric for filtering/sorting) */
    amount: number;
    /** Formatted display string */
    display: string;
  };

  /** Typical processing time for application review */
  processingTime: {
    /** Duration in days (numeric for filtering/sorting) */
    days: number;
    /** Human-readable display string */
    display: string;
  };

  /**
   * DFSA regulatory modules applicable to this activity
   * Common modules: GEN, AUT, COB, PIB, AMEN, PIN, AML, AMI, etc.
   */
  regulatoryModules: string[];

  /** Regulatory regimes under which this activity can be conducted */
  applicableRegimes: RegimeType[];

  /** Authorisation pathways that include this activity */
  applicablePathways: PathwayId[];

  /**
   * Optional list of specific products or sub-activities
   * For example, types of deposits, investment products, etc.
   */
  products?: string[];

  /**
   * Optional DFSA rule references
   * Format: "AUT 3.1.1", "GEN 2.2", etc.
   */
  ruleReferences?: string[];

  /**
   * Optional URL to detailed activity page or DFSA rulebook section
   */
  detailsUrl?: string;

  /**
   * Optional form identifier if this activity triggers a specific form
   * Example: "2-12 Banking", "2-4 Advising and Arranging"
   */
  triggersForm?: string;
}

/**
 * Prudential Category Information
 * Detailed information about each prudential category including color schemes
 */
export interface PrudentialCategoryInfo {
  /** Category code */
  code: PrudentialCategory;

  /** Full category name */
  name: string;

  /** Description of the category and typical firms */
  description: string;

  /**
   * Typical capital requirement range
   * Note: Actual requirements determined by DFSA
   */
  capitalRange: {
    min: number;
    max?: number;
    display: string;
  };

  /**
   * Color scheme for UI display
   * Uses Tailwind CSS classes
   */
  colorScheme: {
    /** Badge background and text colors */
    badge: string;
    /** Border color for cards */
    border: string;
    /** Gradient colors for headers */
    gradient: string;
  };

  /** Typical activities for this category */
  typicalActivities?: string[];
}

/**
 * Regulatory Module Information
 * Details about DFSA regulatory modules
 */
export interface RegulatoryModule {
  /** Module code (e.g., "GEN", "AUT", "COB") */
  code: string;

  /** Full module name */
  name: string;

  /** Brief description of the module's scope */
  description: string;

  /** Module type classification */
  type: 'General' | 'Prudential' | 'Conduct' | 'Specialised';

  /** URL to DFSA rulebook module (optional) */
  ruleBookUrl?: string;
}

/**
 * Activity Filter State
 * State interface for filtering financial activities
 */
export interface ActivityFilterState {
  /** Selected regime (single selection) */
  regime: RegimeType | null;

  /** Selected pathways (multi-select) */
  pathways: PathwayId[];

  /** Selected prudential categories (multi-select) */
  categories: PrudentialCategory[];

  /** Capital requirement range filter */
  capitalRange: {
    min: number;
    max: number;
  } | null;

  /** Processing time ranges (multi-select) */
  processingTime: Array<{
    id: string;
    min: number;
    max: number;
  }>;

  /** Search query */
  searchQuery: string;
}

/**
 * Activity Selection State
 * Tracks user's selected activities for application
 */
export interface ActivitySelection {
  /** Selected activity IDs */
  activityIds: string[];

  /** Total estimated capital requirement */
  totalCapitalRequired: number;

  /** Total estimated application fees */
  totalFees: number;

  /** Applicable prudential category (highest among selections) */
  applicableCategory: PrudentialCategory | null;
}

/**
 * Filter Option Interface
 * Generic filter option for dropdowns/checkboxes
 */
export interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

/**
 * Sort Option Type
 * Available sorting options for activities
 */
export type ActivitySortOption =
  | 'activity-code-asc'      // A1, A2, A3...
  | 'activity-code-desc'     // A20, A19, A18...
  | 'name-asc'               // Alphabetical A-Z
  | 'name-desc'              // Alphabetical Z-A
  | 'capital-asc'            // Lowest capital first
  | 'capital-desc'           // Highest capital first
  | 'processing-time-asc'    // Shortest processing time first
  | 'processing-time-desc';  // Longest processing time first
