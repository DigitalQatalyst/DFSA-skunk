/**
 * DFSA Financial Services Application - Draft Management Service
 *
 * Provides localStorage-based draft management with auto-save functionality,
 * progress tracking, and draft restoration capabilities.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { FSApplicationFormData } from '../../../types/dfsa';

// Storage keys
export const DRAFT_STORAGE_KEY = 'dfsa-fs-application-draft';
export const DRAFT_METADATA_KEY = 'dfsa-fs-application-draft-metadata';

// Auto-save interval in milliseconds (30 seconds per requirement 2.1)
export const AUTO_SAVE_INTERVAL_MS = 30000;

/**
 * Save status types for UI indicators
 */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Draft metadata stored separately for quick access
 */
export interface DraftMetadata {
  applicationId: string | null;
  applicationRef: string | null;
  currentStep: string;
  currentStepIndex: number;
  completedSteps: string[];
  progressPercent: number;
  lastSaved: string; // ISO date string
  version: number;
}

/**
 * Complete draft data structure
 */
export interface DraftData {
  formData: FSApplicationFormData;
  metadata: DraftMetadata;
}

/**
 * Draft save result
 */
export interface DraftSaveResult {
  success: boolean;
  timestamp: Date;
  error?: string;
}

/**
 * Draft load result
 */
export interface DraftLoadResult {
  success: boolean;
  data: DraftData | null;
  error?: string;
}

/**
 * Calculates progress percentage based on completed steps
 * @param completedSteps - Array of completed step IDs
 * @param applicableSteps - Array of all applicable step IDs
 * @returns Progress percentage (0-100)
 */
export function calculateProgressPercent(
  completedSteps: string[],
  applicableSteps: string[]
): number {
  if (applicableSteps.length === 0) return 0;
  const progress = (completedSteps.length / applicableSteps.length) * 100;
  return Math.round(progress);
}

/**
 * Saves draft data to localStorage
 * Requirement 2.4: Manual save draft functionality
 *
 * @param formData - Current form data
 * @param currentStep - Current step ID
 * @param currentStepIndex - Current step index
 * @param completedSteps - Array of completed step IDs
 * @param applicableSteps - Array of all applicable step IDs
 * @param applicationId - Optional application ID
 * @param applicationRef - Optional application reference
 * @returns Save result with success status and timestamp
 */
export function saveDraftToLocalStorage(
  formData: FSApplicationFormData,
  currentStep: string,
  currentStepIndex: number,
  completedSteps: string[],
  applicableSteps: string[],
  applicationId: string | null = null,
  applicationRef: string | null = null
): DraftSaveResult {
  try {
    const progressPercent = calculateProgressPercent(completedSteps, applicableSteps);
    const timestamp = new Date();

    const metadata: DraftMetadata = {
      applicationId,
      applicationRef,
      currentStep,
      currentStepIndex,
      completedSteps,
      progressPercent,
      lastSaved: timestamp.toISOString(),
      version: 1
    };

    const draftData: DraftData = {
      formData,
      metadata
    };

    // Save complete draft data
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));

    // Save metadata separately for quick access
    localStorage.setItem(DRAFT_METADATA_KEY, JSON.stringify(metadata));

    return {
      success: true,
      timestamp
    };
  } catch (error) {
    console.error('Failed to save draft to localStorage:', error);
    return {
      success: false,
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error saving draft'
    };
  }
}

/**
 * Loads draft data from localStorage
 * Requirement 2.2: Restore previously entered data and current step position
 *
 * @returns Draft load result with data or null if not found
 */
export function loadDraftFromLocalStorage(): DraftLoadResult {
  try {
    const savedData = localStorage.getItem(DRAFT_STORAGE_KEY);

    if (!savedData) {
      return {
        success: true,
        data: null
      };
    }

    const draftData: DraftData = JSON.parse(savedData);

    // Validate the loaded data has required structure
    if (!draftData.formData || !draftData.metadata) {
      return {
        success: false,
        data: null,
        error: 'Invalid draft data structure'
      };
    }

    return {
      success: true,
      data: draftData
    };
  } catch (error) {
    console.error('Failed to load draft from localStorage:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error loading draft'
    };
  }
}

/**
 * Loads only draft metadata for quick access (e.g., showing last saved time)
 *
 * @returns Draft metadata or null if not found
 */
export function loadDraftMetadata(): DraftMetadata | null {
  try {
    const savedMetadata = localStorage.getItem(DRAFT_METADATA_KEY);

    if (!savedMetadata) {
      return null;
    }

    return JSON.parse(savedMetadata);
  } catch (error) {
    console.error('Failed to load draft metadata:', error);
    return null;
  }
}

/**
 * Clears draft data from localStorage
 *
 * @returns True if successful, false otherwise
 */
export function clearDraftFromLocalStorage(): boolean {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    localStorage.removeItem(DRAFT_METADATA_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear draft from localStorage:', error);
    return false;
  }
}

/**
 * Checks if a draft exists in localStorage
 *
 * @returns True if draft exists, false otherwise
 */
export function hasDraftInLocalStorage(): boolean {
  try {
    return localStorage.getItem(DRAFT_STORAGE_KEY) !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Gets the last saved timestamp from draft metadata
 *
 * @returns Date object or null if no draft exists
 */
export function getLastSavedTimestamp(): Date | null {
  const metadata = loadDraftMetadata();
  if (metadata?.lastSaved) {
    return new Date(metadata.lastSaved);
  }
  return null;
}

/**
 * Formats the last saved timestamp for display
 * Requirement 2.5: Display last saved timestamp
 *
 * @param timestamp - Date to format
 * @returns Formatted string like "Saved at 2:30 PM" or "Saved today at 2:30 PM"
 */
export function formatLastSavedTimestamp(timestamp: Date | null): string {
  if (!timestamp) {
    return 'Not saved yet';
  }

  const now = new Date();
  const isToday = timestamp.toDateString() === now.toDateString();
  const timeString = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (isToday) {
    return `Saved at ${timeString}`;
  }

  const dateString = timestamp.toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });

  return `Saved ${dateString} at ${timeString}`;
}

/**
 * Auto-save manager class for handling periodic saves
 * Requirement 2.1: Auto-save every 30 seconds
 * Requirement 2.3: Backup to localStorage as fallback
 */
export class DraftAutoSaveManager {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isRunning: boolean = false;
  private lastSaveAttempt: Date | null = null;
  private onSaveCallback: ((result: DraftSaveResult) => void) | null = null;
  private onStatusChangeCallback: ((status: SaveStatus) => void) | null = null;

  /**
   * Sets the callback for save completion
   */
  setOnSaveCallback(callback: (result: DraftSaveResult) => void): void {
    this.onSaveCallback = callback;
  }

  /**
   * Sets the callback for status changes
   */
  setOnStatusChangeCallback(callback: (status: SaveStatus) => void): void {
    this.onStatusChangeCallback = callback;
  }

  /**
   * Starts the auto-save interval
   *
   * @param getSaveData - Function that returns current form state for saving
   */
  start(
    getSaveData: () => {
      formData: FSApplicationFormData;
      currentStep: string;
      currentStepIndex: number;
      completedSteps: string[];
      applicableSteps: string[];
      applicationId: string | null;
      applicationRef: string | null;
    }
  ): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    this.intervalId = setInterval(() => {
      this.performAutoSave(getSaveData);
    }, AUTO_SAVE_INTERVAL_MS);
  }

  /**
   * Stops the auto-save interval
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  /**
   * Performs an immediate save (manual save)
   * Requirement 2.4: Manual save draft functionality
   *
   * @param saveData - Current form state to save
   * @returns Save result
   */
  saveNow(saveData: {
    formData: FSApplicationFormData;
    currentStep: string;
    currentStepIndex: number;
    completedSteps: string[];
    applicableSteps: string[];
    applicationId: string | null;
    applicationRef: string | null;
  }): DraftSaveResult {
    this.onStatusChangeCallback?.('saving');

    const result = saveDraftToLocalStorage(
      saveData.formData,
      saveData.currentStep,
      saveData.currentStepIndex,
      saveData.completedSteps,
      saveData.applicableSteps,
      saveData.applicationId,
      saveData.applicationRef
    );

    this.lastSaveAttempt = new Date();

    if (result.success) {
      this.onStatusChangeCallback?.('saved');
    } else {
      this.onStatusChangeCallback?.('error');
    }

    this.onSaveCallback?.(result);

    return result;
  }

  /**
   * Performs auto-save operation
   */
  private performAutoSave(
    getSaveData: () => {
      formData: FSApplicationFormData;
      currentStep: string;
      currentStepIndex: number;
      completedSteps: string[];
      applicableSteps: string[];
      applicationId: string | null;
      applicationRef: string | null;
    }
  ): void {
    const saveData = getSaveData();
    this.saveNow(saveData);
  }

  /**
   * Returns whether auto-save is currently running
   */
  isAutoSaveRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Returns the last save attempt timestamp
   */
  getLastSaveAttempt(): Date | null {
    return this.lastSaveAttempt;
  }
}

/**
 * Creates a singleton instance of the auto-save manager
 */
let autoSaveManagerInstance: DraftAutoSaveManager | null = null;

export function getAutoSaveManager(): DraftAutoSaveManager {
  if (!autoSaveManagerInstance) {
    autoSaveManagerInstance = new DraftAutoSaveManager();
  }
  return autoSaveManagerInstance;
}

/**
 * Resets the auto-save manager instance (useful for testing)
 */
export function resetAutoSaveManager(): void {
  if (autoSaveManagerInstance) {
    autoSaveManagerInstance.stop();
    autoSaveManagerInstance = null;
  }
}
