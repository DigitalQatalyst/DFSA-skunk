/**
 * DFSA Form Wizard State Management
 *
 * Handles form state, localStorage persistence, and navigation logic
 * Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3
 */

import { FSApplicationFormData } from '../../../types/dfsa';
import { evaluateStepVisibility } from './stepDefinitions';

export interface FormWizardState {
  formData: FSApplicationFormData;
  currentStepIndex: number;
  completedSteps: string[];
  applicableSteps: string[];
  errors: Record<string, string>;
  isSaving: boolean;
  isSubmitting: boolean;
  applicationId: string | null;
  applicationRef: string | null;
  lastSaved: Date | null;
}

const STORAGE_KEY = 'dfsa-fs-application-draft';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

/**
 * Creates initial form data with default values
 */
export function createInitialFormData(): FSApplicationFormData {
  return {
    // Step 1-1: Introduction & Disclosure
    submitterName: '',
    submitterFunction: '',
    submitterEmail: '',
    submitterPhone: '',
    contactPersonInternal: true,
    externalAdviserName: '',
    externalAdviserEmail: '',
    externalAdviserCompany: '',
    instructionsConfirmed: false,
    disclosureAcknowledged: false,
    informationAccurate: false,
    authorizedToSubmit: false,
    difcaConsent: false,

    // Step 1-2: Standing Data
    isRepresentativeOffice: false,
    legalStatus: '',
    generalStructure: '',
    firmName: '',
    tradingNames: [],
    registeredCountry: '',
    registrationNumber: '',
    registrationDate: '',
    financialYearEnd: '',
    headOfficeAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      poBox: ''
    },
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    itReliance: '',
    itComplexity: '',

    // Step 1-3: Ownership Information
    isPartOfGroup: false,
    ultimateHoldingCompany: '',
    shareholders: [],
    beneficialOwners: [],
    publiclyListed: false,
    listingExchange: '',

    // Step 1-4: Controllers & Group Structure
    hasControllers: false,
    controllers: [],
    groupStructureDescription: '',
    groupStructureChart: undefined,

    // Step 1-5: Permissions & Financial Services
    activitySelections: {},
    financialServicesMatrix: {},
    endorsementSelections: {},

    // Stage 3: Core profile data
    businessPlanSummary: '',
    projectedFinancials: {},
    targetClientSegments: [],
    riskManagementFramework: '',
    boardComposition: [],

    // Stage 4: Final submission
    waiverRequests: [],
    feeCalculation: undefined,
    paymentMethod: '',
    individualDeclarations: [],
    finalReview: false,
    submissionDeclaration: false
  };
}

/**
 * Creates initial wizard state
 */
export function createInitialWizardState(): FormWizardState {
  const formData = createInitialFormData();
  const applicableSteps = evaluateStepVisibility(formData);

  return {
    formData,
    currentStepIndex: 0,
    completedSteps: [],
    applicableSteps,
    errors: {},
    isSaving: false,
    isSubmitting: false,
    applicationId: null,
    applicationRef: null,
    lastSaved: null
  };
}

/**
 * Saves form state to localStorage
 */
export function saveToLocalStorage(state: FormWizardState): void {
  try {
    const dataToSave = {
      formData: state.formData,
      currentStepIndex: state.currentStepIndex,
      completedSteps: state.completedSteps,
      applicationId: state.applicationId,
      applicationRef: state.applicationRef,
      lastSaved: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Loads form state from localStorage
 */
export function loadFromLocalStorage(): Partial<FormWizardState> | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);

    return {
      formData: { ...createInitialFormData(), ...parsed.formData },
      currentStepIndex: parsed.currentStepIndex || 0,
      completedSteps: parsed.completedSteps || [],
      applicationId: parsed.applicationId || null,
      applicationRef: parsed.applicationRef || null,
      lastSaved: parsed.lastSaved ? new Date(parsed.lastSaved) : null
    };
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Clears saved form data from localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Updates applicable steps based on current form data
 */
export function updateApplicableSteps(formData: FSApplicationFormData): string[] {
  return evaluateStepVisibility(formData);
}

/**
 * Calculates progress percentage based on completed steps
 */
export function calculateProgress(completedSteps: string[], applicableSteps: string[]): number {
  if (applicableSteps.length === 0) return 0;
  return Math.round((completedSteps.length / applicableSteps.length) * 100);
}

/**
 * Validates if navigation to a step is allowed
 */
export function canNavigateToStep(
  targetStepIndex: number,
  currentStepIndex: number,
  completedSteps: string[],
  applicableSteps: string[]
): boolean {
  // Can always go back to previous steps
  if (targetStepIndex <= currentStepIndex) {
    return true;
  }

  // Can go forward only if all previous steps are completed
  for (let i = 0; i < targetStepIndex; i++) {
    const stepId = applicableSteps[i];
    if (stepId && !completedSteps.includes(stepId)) {
      return false;
    }
  }

  return true;
}

/**
 * Gets the next available step index
 */
export function getNextStepIndex(
  currentStepIndex: number,
  applicableSteps: string[]
): number | null {
  const nextIndex = currentStepIndex + 1;
  return nextIndex < applicableSteps.length ? nextIndex : null;
}

/**
 * Gets the previous available step index
 */
export function getPreviousStepIndex(currentStepIndex: number): number | null {
  const prevIndex = currentStepIndex - 1;
  return prevIndex >= 0 ? prevIndex : null;
}

/**
 * Auto-save functionality
 */
export class AutoSaveManager {
  private intervalId: NodeJS.Timeout | null = null;
  private saveCallback: (state: FormWizardState) => Promise<void>;

  constructor(saveCallback: (state: FormWizardState) => Promise<void>) {
    this.saveCallback = saveCallback;
  }

  start(state: FormWizardState): void {
    this.stop(); // Clear any existing interval

    this.intervalId = setInterval(async () => {
      try {
        await this.saveCallback(state);
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Fallback to localStorage
        saveToLocalStorage(state);
      }
    }, AUTO_SAVE_INTERVAL);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async saveNow(state: FormWizardState): Promise<void> {
    try {
      await this.saveCallback(state);
    } catch (error) {
      console.error('Manual save failed:', error);
      // Fallback to localStorage
      saveToLocalStorage(state);
      throw error;
    }
  }
}
