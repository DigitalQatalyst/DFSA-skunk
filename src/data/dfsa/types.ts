/**
 * DFSA Financial Services Activities - Type Definitions
 * 
 * Hierarchy: Regime → Pathway → Financial Activity → Products
 * This structure focuses on activity-product relationships and form triggers
 * rather than financial/prudential details.
 */

/**
 * Product or Investment Type associated with a Financial Activity
 */
export interface Product {
  code: string;           // e.g., "A2.C2", "MSB.A1.C1"
  name: string;           // e.g., "Shares", "Payment Account"
  description?: string;   // Optional description
}

/**
 * Financial Service Activity within a Pathway
 * Represents a specific regulated activity with its associated products
 */
export interface FinancialActivityHierarchy {
  id: string;             // Unique identifier
  code: string;           // e.g., "A1", "A2", "MSB.A1"
  name: string;           // e.g., "Accepting Deposits"
  description?: string;   // Activity description
  products: Product[];    // Associated products/investment types
  triggersForm?: string;  // e.g., "2-12 Banking", "2-4 Advising and Arranging"
  formCode?: string;      // e.g., "2-12", "2-4"
  pathwayId: string;      // Reference to parent pathway
  regimeId: string;       // Reference to regime

  // Financial details
  prudentialCategory?: string;  // e.g., "Cat 1", "Cat 4"
  baseCapital?: {
    amount: number;
    display: string;
  };
  applicationFee?: {
    amount: number;
    display: string;
  };
  processingTime?: {
    days: number;
    display: string;
  };
}

/**
 * Pathway (Sector) within a Regime
 * Groups related financial service activities
 */
export interface Pathway {
  id: string;             // Unique identifier
  selectionCode: string;  // e.g., "Selection_1.A1", "Selection_1.A2"
  name: string;           // e.g., "Banking, Investment, Insurance Intermediation"
  description?: string;   // Pathway description
  regimeId: string;       // Reference to parent regime
  activities: FinancialActivityHierarchy[];  // Activities within this pathway
}

/**
 * Regime - Top level categorization
 * Represents the type of authorization required
 */
export interface Regime {
  id: string;             // Unique identifier
  code: string;           // e.g., "REGIME_1", "REGIME_2", "REGIME_3"
  name: string;           // e.g., "Authorised Firm"
  fullName: string;       // e.g., "REGIME 1: AUTHORISED FIRM"
  description: string;    // Regime description
  pathways: Pathway[];    // Pathways available in this regime
}

/**
 * Endorsement - Additional permissions or restrictions
 */
export interface Endorsement {
  id: string;
  code: string;           // e.g., "Endorsement2.A1"
  name: string;           // e.g., "Islamic Finance Endorsement"
  applicableTo: string;   // e.g., "Regime 1 (Authorised Firms)"
  effect: string;         // What permission it grants
  triggersForm?: string;  // Form associated with this endorsement
  regulatoryModule?: string; // e.g., "IFR (Islamic Finance Rules)"
}

/**
 * Form Trigger Reference
 * Maps selection codes to required forms
 */
export interface FormTrigger {
  formCode: string;       // e.g., "2-4"
  formName: string;       // e.g., "Advising and Arranging"
  triggerCondition: string; // e.g., "Selection_FS.A2, A3, or A4 selections"
}
