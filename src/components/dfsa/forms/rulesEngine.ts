/**
 * DFSA Financial Services Form - Client-Side Rules Engine
 *
 * Evaluates step and field visibility based on form data selections.
 * Uses hardcoded rules initially (before database integration).
 *
 * Requirements: 1.3, 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { FSApplicationFormData } from '../../../types/dfsa';

// ============================================================================
// TYPES
// ============================================================================

export type RuleOperator =
  | 'equals'
  | 'not_equals'
  | 'is_true'
  | 'is_false'
  | 'is_empty'
  | 'is_not_empty'
  | 'length_gt'
  | 'length_gte'
  | 'length_lt'
  | 'length_equals'
  | 'contains'
  | 'not_contains'
  | 'in'
  | 'not_in'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte';

export type GroupOperator = 'AND' | 'OR';

export interface RuleCondition {
  fieldPath: string;
  operator: RuleOperator;
  value?: string | number | boolean | string[];
  groupId?: number;
  groupOperator?: GroupOperator;
}

export interface Rule {
  id: string;
  ruleCode: string;
  ruleName: string;
  ruleType: 'visibility' | 'validation' | 'calculation';
  targetType: 'step' | 'field' | 'section';
  targetId: string;
  conditions: RuleCondition[];
  isActive: boolean;
  priority: number;
}

export interface VisibilityResult {
  visibleSteps: string[];
  visibleFields: Record<string, Record<string, boolean>>;
}

export interface FieldVisibilityMap {
  [fieldId: string]: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets a nested value from an object using dot notation path
 */
export function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current === 'object' && current !== null) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Evaluates a single condition against form data
 */
export function evaluateCondition(
  condition: RuleCondition,
  formData: FSApplicationFormData
): boolean {
  const fieldValue = getValueByPath(formData as unknown as Record<string, unknown>, condition.fieldPath);

  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;

    case 'not_equals':
      return fieldValue !== condition.value;

    case 'is_true':
      return fieldValue === true;

    case 'is_false':
      return fieldValue === false;

    case 'is_empty':
      if (fieldValue === null || fieldValue === undefined) return true;
      if (typeof fieldValue === 'string') return fieldValue.trim() === '';
      if (Array.isArray(fieldValue)) return fieldValue.length === 0;
      if (typeof fieldValue === 'object') return Object.keys(fieldValue).length === 0;
      return false;

    case 'is_not_empty':
      if (fieldValue === null || fieldValue === undefined) return false;
      if (typeof fieldValue === 'string') return fieldValue.trim() !== '';
      if (Array.isArray(fieldValue)) return fieldValue.length > 0;
      if (typeof fieldValue === 'object') return Object.keys(fieldValue).length > 0;
      return true;

    case 'length_gt':
      if (Array.isArray(fieldValue)) {
        return fieldValue.length > (condition.value as number);
      }
      return false;

    case 'length_gte':
      if (Array.isArray(fieldValue)) {
        return fieldValue.length >= (condition.value as number);
      }
      return false;

    case 'length_lt':
      if (Array.isArray(fieldValue)) {
        return fieldValue.length < (condition.value as number);
      }
      return false;

    case 'length_equals':
      if (Array.isArray(fieldValue)) {
        return fieldValue.length === (condition.value as number);
      }
      return false;

    case 'contains':
      if (typeof fieldValue === 'string') {
        return fieldValue.includes(condition.value as string);
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(condition.value);
      }
      return false;

    case 'not_contains':
      if (typeof fieldValue === 'string') {
        return !fieldValue.includes(condition.value as string);
      }
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(condition.value);
      }
      return true;

    case 'in':
      if (Array.isArray(condition.value)) {
        return condition.value.includes(fieldValue as string);
      }
      return false;

    case 'not_in':
      if (Array.isArray(condition.value)) {
        return !condition.value.includes(fieldValue as string);
      }
      return true;

    case 'gt':
      return (fieldValue as number) > (condition.value as number);

    case 'gte':
      return (fieldValue as number) >= (condition.value as number);

    case 'lt':
      return (fieldValue as number) < (condition.value as number);

    case 'lte':
      return (fieldValue as number) <= (condition.value as number);

    default:
      return false;
  }
}

/**
 * Evaluates a group of conditions with AND/OR logic
 */
export function evaluateConditionGroup(
  conditions: RuleCondition[],
  formData: FSApplicationFormData
): boolean {
  if (conditions.length === 0) return true;

  // Group conditions by groupId
  const groups: Record<number, RuleCondition[]> = {};
  for (const condition of conditions) {
    const groupId = condition.groupId ?? 0;
    if (!groups[groupId]) {
      groups[groupId] = [];
    }
    groups[groupId].push(condition);
  }

  // Evaluate each group with AND logic within group
  const groupResults: boolean[] = [];
  const groupIds = Object.keys(groups).map(Number);
  for (const groupId of groupIds) {
    const groupConditions = groups[groupId];
    const groupResult = groupConditions.every(condition =>
      evaluateCondition(condition, formData)
    );
    groupResults.push(groupResult);
  }

  // Groups are combined with OR logic (any group passing means rule passes)
  return groupResults.some(result => result);
}

// ============================================================================
// STEP VISIBILITY RULES (Hardcoded)
// ============================================================================

/**
 * Helper to check if financial services matrix has selections for an activity
 */
function hasMatrixActivity(
  formData: FSApplicationFormData,
  activityCode: string
): boolean {
  const matrix = formData.financialServicesMatrix || {};
  const selections = matrix[activityCode];
  return Array.isArray(selections) && selections.length > 0;
}

/**
 * Helper to check if only Representative Office is selected (no other activities)
 */
function isRepresentativeOfficeOnly(formData: FSApplicationFormData): boolean {
  const isRepOffice = formData.isRepresentativeOffice === true;
  const activitySelections = formData.activitySelections || {};

  // Check if any activity sector is selected
  const hasAnyActivity = Object.values(activitySelections).some(v => v === true);

  return isRepOffice && !hasAnyActivity;
}

/**
 * Evaluates visibility for a specific step based on form data
 * Returns true if the step should be visible
 */
export function evaluateStepVisibility(
  stepId: string,
  formData: FSApplicationFormData
): boolean {
  const activitySelections = formData.activitySelections || {};
  const endorsementSelections = formData.endorsementSelections || {};

  // Check sector selections
  const isFinancialServicesSector = activitySelections.A1 === true;
  const isInsuranceSector = activitySelections.A2 === true || activitySelections.A3 === true;

  switch (stepId) {
    // Stage 1 - Always visible
    case 'step-1-1':
    case 'step-1-2':
    case 'step-1-3':
    case 'step-1-4':
    case 'step-1-5':
      return true;

    // Stage 2 - Conditional based on Step 1-5 selections
    case 'step-2-1': // Fund Management
      return isFinancialServicesSector && (
        hasMatrixActivity(formData, 'A10') ||
        hasMatrixActivity(formData, 'A11') ||
        hasMatrixActivity(formData, 'A13') ||
        hasMatrixActivity(formData, 'FS8') // Operating a Collective Investment Fund
      );

    case 'step-2-2': // Representative Office
      return formData.isRepresentativeOffice === true;

    case 'step-2-3': // Islamic Endorsement
      return endorsementSelections.E1_A1 === true;

    case 'step-2-4': // Advising & Arranging
      return isFinancialServicesSector && (
        hasMatrixActivity(formData, 'A6') ||
        hasMatrixActivity(formData, 'A7') ||
        hasMatrixActivity(formData, 'A8') ||
        hasMatrixActivity(formData, 'A9') ||
        hasMatrixActivity(formData, 'A14') ||
        hasMatrixActivity(formData, 'FS3') || // Arranging Deals in Investments
        hasMatrixActivity(formData, 'FS5')    // Advising on Financial Products
      );

    case 'step-2-5': // Insurance Intermediation
      return isInsuranceSector && (
        hasMatrixActivity(formData, 'A8') ||
        hasMatrixActivity(formData, 'A9')
      );

    case 'step-2-6': // Asset Management
      return isFinancialServicesSector && (
        hasMatrixActivity(formData, 'A5') ||
        hasMatrixActivity(formData, 'A7') ||
        hasMatrixActivity(formData, 'A10') ||
        hasMatrixActivity(formData, 'A11') ||
        hasMatrixActivity(formData, 'A13') ||
        hasMatrixActivity(formData, 'FS4') // Managing Assets
      );

    case 'step-2-7': // Sales & Trading
      return isFinancialServicesSector && (
        hasMatrixActivity(formData, 'A4') ||
        hasMatrixActivity(formData, 'A5') ||
        hasMatrixActivity(formData, 'A14') ||
        hasMatrixActivity(formData, 'FS1') || // Dealing in Investments as Principal
        hasMatrixActivity(formData, 'FS2')    // Dealing in Investments as Agent
      );

    case 'step-2-10': // Money Services
      return activitySelections.A5 === true;

    case 'step-2-11': // Direct Insurance
      return activitySelections.A2 === true;

    case 'step-2-12': // Banking
      return isFinancialServicesSector && (
        hasMatrixActivity(formData, 'A1') ||
        hasMatrixActivity(formData, 'A2')
      ) || activitySelections.A6 === true; // Banking Business sector

    case 'step-2-13': // Retail Endorsement
      return endorsementSelections.E2_A1 === true;

    case 'step-2-14': // Client Assets
      const hasCustodyActivity = isFinancialServicesSector && (
        hasMatrixActivity(formData, 'A4') ||
        hasMatrixActivity(formData, 'A11') ||
        hasMatrixActivity(formData, 'A17') ||
        hasMatrixActivity(formData, 'FS6') || // Custody of Investments
        hasMatrixActivity(formData, 'FS7')    // Arranging Custody
      );
      const hasClientAssetsEndorsement = endorsementSelections.E2_A5 === true;
      return hasCustodyActivity || hasClientAssetsEndorsement;

    case 'step-2-21': // Crowdfunding
      return isFinancialServicesSector && (
        hasMatrixActivity(formData, 'A14') ||
        hasMatrixActivity(formData, 'A18')
      );

    // Stage 3 - Hidden when ONLY Representative Office is selected
    case 'step-3-1': // Business Plan
    case 'step-3-2': // Clients
    case 'step-3-4': // Risk Management & Compliance
    case 'step-3-5': // Governance
      return !isRepresentativeOfficeOnly(formData);

    // Stage 4 - Always visible
    case 'step-4-1':
    case 'step-4-2':
    case 'step-4-3':
    case 'step-4-4':
      return true;

    default:
      // Unknown step - default to visible
      return true;
  }
}

/**
 * Gets all visible steps based on current form data
 */
export function getVisibleSteps(formData: FSApplicationFormData): string[] {
  const allSteps = [
    // Stage 1
    'step-1-1', 'step-1-2', 'step-1-3', 'step-1-4', 'step-1-5',
    // Stage 2
    'step-2-1', 'step-2-2', 'step-2-3', 'step-2-4', 'step-2-5',
    'step-2-6', 'step-2-7', 'step-2-10', 'step-2-11', 'step-2-12',
    'step-2-13', 'step-2-14', 'step-2-21',
    // Stage 3
    'step-3-1', 'step-3-2', 'step-3-4', 'step-3-5',
    // Stage 4
    'step-4-1', 'step-4-2', 'step-4-3', 'step-4-4'
  ];

  return allSteps.filter(stepId => evaluateStepVisibility(stepId, formData));
}

// ============================================================================
// FIELD VISIBILITY RULES (Hardcoded)
// ============================================================================

/**
 * Field visibility rules for Step 1-1
 */
function getStep1_1FieldVisibility(formData: FSApplicationFormData): FieldVisibilityMap {
  const isExternalContact = formData.contactPersonInternal === false;
  const instructionsNotConfirmed = formData.instructionsConfirmed === false;

  return {
    externalAdviserName: isExternalContact,
    externalAdviserEmail: isExternalContact,
    externalAdviserCompany: isExternalContact,
    contactDFSASection: instructionsNotConfirmed
  };
}

/**
 * Field visibility rules for Step 1-2
 */
function getStep1_2FieldVisibility(formData: FSApplicationFormData): FieldVisibilityMap {
  const isNotRepOffice = formData.isRepresentativeOffice === false;
  const isPubliclyListed = formData.publiclyListed === true;

  return {
    legalStatus: isNotRepOffice,
    generalStructure: isNotRepOffice,
    registrationDetails: isNotRepOffice,
    registrationNumber: isNotRepOffice,
    registrationDate: isNotRepOffice,
    financialYearEnd: isNotRepOffice,
    listingExchange: isPubliclyListed
  };
}

/**
 * Field visibility rules for Step 1-3
 */
function getStep1_3FieldVisibility(formData: FSApplicationFormData): FieldVisibilityMap {
  const isPartOfGroup = formData.isPartOfGroup === true;
  const isPubliclyListed = formData.publiclyListed === true;

  return {
    ultimateHoldingCompany: isPartOfGroup,
    groupStructureSection: isPartOfGroup,
    listingExchange: isPubliclyListed
  };
}

/**
 * Field visibility rules for Step 1-4
 */
function getStep1_4FieldVisibility(formData: FSApplicationFormData): FieldVisibilityMap {
  const hasControllers = formData.hasControllers === true;
  const isPartOfGroup = formData.isPartOfGroup === true;

  return {
    controllersSection: hasControllers,
    controllersList: hasControllers,
    groupStructureDescription: isPartOfGroup,
    groupStructureChart: isPartOfGroup
  };
}

/**
 * Field visibility rules for Step 1-5
 */
function getStep1_5FieldVisibility(formData: FSApplicationFormData): FieldVisibilityMap {
  const activitySelections = formData.activitySelections || {};
  const isFinancialServicesSector = activitySelections.A1 === true;
  const isNotRepOffice = formData.isRepresentativeOffice === false;

  // Check for insurance-related matrix selections
  const hasInsuranceMatrixSelections =
    hasMatrixActivity(formData, 'A8') || hasMatrixActivity(formData, 'A9');

  // Check for fund-related matrix selections
  const hasFundMatrixSelections = hasMatrixActivity(formData, 'A10');

  return {
    // Financial Services Matrix (Q99) - only show when A1 is selected
    financialServicesMatrix: isFinancialServicesSector,
    matrixSection: isFinancialServicesSector,

    // Endorsements section - hide for Representative Office
    endorsementsSection: isNotRepOffice,

    // Specific endorsement visibility
    E2_A1: isFinancialServicesSector, // Retail endorsement
    E2_A4: hasInsuranceMatrixSelections, // Insurance Monies
    E2_A5: hasInsuranceMatrixSelections, // Long Term Insurance
    E2_A6: hasFundMatrixSelections // Fund Platform ICC
  };
}

/**
 * Gets field visibility for a specific step
 */
export function getFieldVisibility(
  stepId: string,
  formData: FSApplicationFormData
): FieldVisibilityMap {
  switch (stepId) {
    case 'step-1-1':
      return getStep1_1FieldVisibility(formData);
    case 'step-1-2':
      return getStep1_2FieldVisibility(formData);
    case 'step-1-3':
      return getStep1_3FieldVisibility(formData);
    case 'step-1-4':
      return getStep1_4FieldVisibility(formData);
    case 'step-1-5':
      return getStep1_5FieldVisibility(formData);
    default:
      return {};
  }
}

/**
 * Checks if a specific field should be visible
 */
export function isFieldVisible(
  stepId: string,
  fieldId: string,
  formData: FSApplicationFormData
): boolean {
  const fieldVisibility = getFieldVisibility(stepId, formData);

  // If field is not in the visibility map, default to visible
  if (!(fieldId in fieldVisibility)) {
    return true;
  }

  return fieldVisibility[fieldId];
}

// ============================================================================
// RULES ENGINE CLASS
// ============================================================================

/**
 * Client-side rules engine for evaluating step and field visibility
 */
export class RulesEngine {
  private rules: Rule[] = [];
  private useHardcodedRules: boolean = true;

  constructor(useHardcodedRules: boolean = true) {
    this.useHardcodedRules = useHardcodedRules;
  }

  /**
   * Load rules from database (for future integration)
   */
  async loadRules(): Promise<void> {
    // TODO: Load rules from Supabase when database integration is ready
    // For now, we use hardcoded rules
    this.rules = [];
  }

  /**
   * Evaluate all step visibility rules
   */
  evaluateStepVisibility(formData: FSApplicationFormData): string[] {
    if (this.useHardcodedRules) {
      return getVisibleSteps(formData);
    }

    // Database-driven evaluation (future)
    const visibleSteps: string[] = [];
    const stepRules = this.rules.filter(
      r => r.ruleType === 'visibility' && r.targetType === 'step' && r.isActive
    );

    // Sort by priority
    stepRules.sort((a, b) => a.priority - b.priority);

    for (const rule of stepRules) {
      const isVisible = evaluateConditionGroup(rule.conditions, formData);
      if (isVisible) {
        visibleSteps.push(rule.targetId);
      }
    }

    return visibleSteps;
  }

  /**
   * Evaluate field visibility for a specific step
   */
  evaluateFieldVisibility(
    stepId: string,
    formData: FSApplicationFormData
  ): FieldVisibilityMap {
    if (this.useHardcodedRules) {
      return getFieldVisibility(stepId, formData);
    }

    // Database-driven evaluation (future)
    const fieldVisibility: FieldVisibilityMap = {};
    const fieldRules = this.rules.filter(
      r =>
        r.ruleType === 'visibility' &&
        r.targetType === 'field' &&
        r.isActive &&
        r.targetId.startsWith(stepId)
    );

    for (const rule of fieldRules) {
      const fieldId = rule.targetId.replace(`${stepId}.`, '');
      fieldVisibility[fieldId] = evaluateConditionGroup(rule.conditions, formData);
    }

    return fieldVisibility;
  }

  /**
   * Check if a specific step is visible
   */
  isStepVisible(stepId: string, formData: FSApplicationFormData): boolean {
    if (this.useHardcodedRules) {
      return evaluateStepVisibility(stepId, formData);
    }

    const visibleSteps = this.evaluateStepVisibility(formData);
    return visibleSteps.includes(stepId);
  }

  /**
   * Check if a specific field is visible
   */
  isFieldVisible(
    stepId: string,
    fieldId: string,
    formData: FSApplicationFormData
  ): boolean {
    if (this.useHardcodedRules) {
      return isFieldVisible(stepId, fieldId, formData);
    }

    const fieldVisibility = this.evaluateFieldVisibility(stepId, formData);
    return fieldVisibility[fieldId] ?? true;
  }

  /**
   * Get complete visibility result for form
   */
  getVisibilityResult(formData: FSApplicationFormData): VisibilityResult {
    const visibleSteps = this.evaluateStepVisibility(formData);
    const visibleFields: Record<string, Record<string, boolean>> = {};

    for (const stepId of visibleSteps) {
      visibleFields[stepId] = this.evaluateFieldVisibility(stepId, formData);
    }

    return {
      visibleSteps,
      visibleFields
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

// Create a default rules engine instance
export const rulesEngine = new RulesEngine(true);

// Export for testing
export { hasMatrixActivity, isRepresentativeOfficeOnly };
