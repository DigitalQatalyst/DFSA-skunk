/**
 * DFSA Financial Services Application - Draft Manager Hook
 *
 * React hook for managing form draft state with localStorage persistence,
 * auto-save functionality, and status indicators.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { FSApplicationFormData } from '../../../types/dfsa';
import {
  SaveStatus,
  DraftData,
  DraftSaveResult,
  DraftAutoSaveManager,
  saveDraftToLocalStorage,
  loadDraftFromLocalStorage,
  clearDraftFromLocalStorage,
  hasDraftInLocalStorage,
  formatLastSavedTimestamp,
  calculateProgressPercent,
  AUTO_SAVE_INTERVAL_MS
} from './draftManager';

/**
 * Hook state interface
 */
export interface UseDraftManagerState {
  /** Current save status for UI indicators */
  saveStatus: SaveStatus;
  /** Last saved timestamp */
  lastSaved: Date | null;
  /** Formatted last saved string for display */
  lastSavedFormatted: string;
  /** Whether a draft exists in localStorage */
  hasDraft: boolean;
  /** Current progress percentage */
  progressPercent: number;
  /** Whether auto-save is currently active */
  isAutoSaveActive: boolean;
}

/**
 * Hook actions interface
 */
export interface UseDraftManagerActions {
  /** Manually save the current draft */
  saveDraft: () => DraftSaveResult;
  /** Load draft from localStorage */
  loadDraft: () => DraftData | null;
  /** Clear draft from localStorage */
  clearDraft: () => boolean;
  /** Start auto-save functionality */
  startAutoSave: () => void;
  /** Stop auto-save functionality */
  stopAutoSave: () => void;
  /** Update progress based on completed steps */
  updateProgress: (completedSteps: string[], applicableSteps: string[]) => void;
}

/**
 * Hook options interface
 */
export interface UseDraftManagerOptions {
  /** Whether to automatically start auto-save on mount */
  autoStart?: boolean;
  /** Callback when save completes */
  onSaveComplete?: (result: DraftSaveResult) => void;
  /** Callback when save status changes */
  onStatusChange?: (status: SaveStatus) => void;
  /** Callback when draft is loaded */
  onDraftLoaded?: (data: DraftData) => void;
}

/**
 * Hook return type
 */
export type UseDraftManagerReturn = UseDraftManagerState & UseDraftManagerActions;

/**
 * React hook for draft management
 *
 * @param formData - Current form data
 * @param currentStep - Current step ID
 * @param currentStepIndex - Current step index
 * @param completedSteps - Array of completed step IDs
 * @param applicableSteps - Array of all applicable step IDs
 * @param applicationId - Optional application ID
 * @param applicationRef - Optional application reference
 * @param options - Optional configuration options
 * @returns Draft manager state and actions
 */
export function useDraftManager(
  formData: FSApplicationFormData,
  currentStep: string,
  currentStepIndex: number,
  completedSteps: string[],
  applicableSteps: string[],
  applicationId: string | null = null,
  applicationRef: string | null = null,
  options: UseDraftManagerOptions = {}
): UseDraftManagerReturn {
  const {
    autoStart = true,
    onSaveComplete,
    onStatusChange,
    onDraftLoaded
  } = options;

  // State
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isAutoSaveActive, setIsAutoSaveActive] = useState<boolean>(false);

  // Refs for auto-save manager and current data
  const autoSaveManagerRef = useRef<DraftAutoSaveManager | null>(null);
  const formDataRef = useRef(formData);
  const currentStepRef = useRef(currentStep);
  const currentStepIndexRef = useRef(currentStepIndex);
  const completedStepsRef = useRef(completedSteps);
  const applicableStepsRef = useRef(applicableSteps);
  const applicationIdRef = useRef(applicationId);
  const applicationRefRef = useRef(applicationRef);

  // Keep refs updated with latest values
  useEffect(() => {
    formDataRef.current = formData;
    currentStepRef.current = currentStep;
    currentStepIndexRef.current = currentStepIndex;
    completedStepsRef.current = completedSteps;
    applicableStepsRef.current = applicableSteps;
    applicationIdRef.current = applicationId;
    applicationRefRef.current = applicationRef;
  }, [formData, currentStep, currentStepIndex, completedSteps, applicableSteps, applicationId, applicationRef]);

  // Initialize auto-save manager
  useEffect(() => {
    autoSaveManagerRef.current = new DraftAutoSaveManager();

    autoSaveManagerRef.current.setOnSaveCallback((result) => {
      if (result.success) {
        setLastSaved(result.timestamp);
        setHasDraft(true);
      }
      onSaveComplete?.(result);
    });

    autoSaveManagerRef.current.setOnStatusChangeCallback((status) => {
      setSaveStatus(status);
      onStatusChange?.(status);
    });

    return () => {
      autoSaveManagerRef.current?.stop();
    };
  }, [onSaveComplete, onStatusChange]);

  // Check for existing draft on mount
  useEffect(() => {
    setHasDraft(hasDraftInLocalStorage());
  }, []);

  // Update progress when steps change
  useEffect(() => {
    const progress = calculateProgressPercent(completedSteps, applicableSteps);
    setProgressPercent(progress);
  }, [completedSteps, applicableSteps]);

  // Auto-start auto-save if enabled
  useEffect(() => {
    if (autoStart && autoSaveManagerRef.current && !isAutoSaveActive) {
      startAutoSave();
    }
  }, [autoStart]);

  /**
   * Get current save data from refs
   */
  const getSaveData = useCallback(() => ({
    formData: formDataRef.current,
    currentStep: currentStepRef.current,
    currentStepIndex: currentStepIndexRef.current,
    completedSteps: completedStepsRef.current,
    applicableSteps: applicableStepsRef.current,
    applicationId: applicationIdRef.current,
    applicationRef: applicationRefRef.current
  }), []);

  /**
   * Manually save the current draft
   * Requirement 2.4: Manual save draft functionality
   */
  const saveDraft = useCallback((): DraftSaveResult => {
    if (autoSaveManagerRef.current) {
      return autoSaveManagerRef.current.saveNow(getSaveData());
    }

    // Fallback if manager not initialized
    setSaveStatus('saving');
    const result = saveDraftToLocalStorage(
      formDataRef.current,
      currentStepRef.current,
      currentStepIndexRef.current,
      completedStepsRef.current,
      applicableStepsRef.current,
      applicationIdRef.current,
      applicationRefRef.current
    );

    if (result.success) {
      setSaveStatus('saved');
      setLastSaved(result.timestamp);
      setHasDraft(true);
    } else {
      setSaveStatus('error');
    }

    onSaveComplete?.(result);
    return result;
  }, [getSaveData, onSaveComplete]);

  /**
   * Load draft from localStorage
   * Requirement 2.2: Restore previously entered data
   */
  const loadDraft = useCallback((): DraftData | null => {
    const result = loadDraftFromLocalStorage();

    if (result.success && result.data) {
      setLastSaved(new Date(result.data.metadata.lastSaved));
      setProgressPercent(result.data.metadata.progressPercent);
      setHasDraft(true);
      onDraftLoaded?.(result.data);
      return result.data;
    }

    return null;
  }, [onDraftLoaded]);

  /**
   * Clear draft from localStorage
   */
  const clearDraft = useCallback((): boolean => {
    const success = clearDraftFromLocalStorage();
    if (success) {
      setHasDraft(false);
      setLastSaved(null);
      setSaveStatus('idle');
    }
    return success;
  }, []);

  /**
   * Start auto-save functionality
   * Requirement 2.1: Auto-save every 30 seconds
   */
  const startAutoSave = useCallback((): void => {
    if (autoSaveManagerRef.current) {
      autoSaveManagerRef.current.start(getSaveData);
      setIsAutoSaveActive(true);
    }
  }, [getSaveData]);

  /**
   * Stop auto-save functionality
   */
  const stopAutoSave = useCallback((): void => {
    if (autoSaveManagerRef.current) {
      autoSaveManagerRef.current.stop();
      setIsAutoSaveActive(false);
    }
  }, []);

  /**
   * Update progress based on completed steps
   */
  const updateProgress = useCallback((
    newCompletedSteps: string[],
    newApplicableSteps: string[]
  ): void => {
    const progress = calculateProgressPercent(newCompletedSteps, newApplicableSteps);
    setProgressPercent(progress);
  }, []);

  // Format last saved timestamp for display
  const lastSavedFormatted = formatLastSavedTimestamp(lastSaved);

  return {
    // State
    saveStatus,
    lastSaved,
    lastSavedFormatted,
    hasDraft,
    progressPercent,
    isAutoSaveActive,
    // Actions
    saveDraft,
    loadDraft,
    clearDraft,
    startAutoSave,
    stopAutoSave,
    updateProgress
  };
}

export default useDraftManager;
