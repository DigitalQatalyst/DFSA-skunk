/**
 * useAutoSave Hook
 * Auto-saves form data to localStorage at regular intervals
 *
 * Features:
 * - Configurable save interval (default: 60 seconds)
 * - Debounced to prevent excessive saves
 * - Handles form data serialization
 * - Provides save status feedback
 * - Audit logging integration
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { DFSAOnboardingFormData } from '../types'

interface UseAutoSaveOptions {
  interval?: number // Save interval in milliseconds (default: 60000 = 60s)
  enabled?: boolean // Enable/disable auto-save (default: true)
  onSaveSuccess?: () => void // Callback on successful save
  onSaveError?: (error: Error) => void // Callback on save error
}

interface UseAutoSaveReturn {
  isSaving: boolean
  lastSaved: Date | null
  saveNow: () => Promise<void> // Manual save trigger
  clearSaved: () => void // Clear saved data
}

const STORAGE_KEY = 'dfsa_onboarding_draft'

/**
 * Auto-save hook for DFSA onboarding form
 *
 * @param getFormData - Function to retrieve current form data
 * @param options - Configuration options
 * @returns Auto-save state and control functions
 *
 * @example
 * ```typescript
 * const { isSaving, lastSaved, saveNow } = useAutoSave(
 *   () => form.getValues(),
 *   { interval: 60000, enabled: true }
 * )
 * ```
 */
export const useAutoSave = (
  getFormData: () => Partial<DFSAOnboardingFormData>,
  options: UseAutoSaveOptions = {}
): UseAutoSaveReturn => {
  const {
    interval = 60000, // Default 60 seconds
    enabled = true,
    onSaveSuccess,
    onSaveError,
  } = options

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Save form data to localStorage
   */
  const saveToLocalStorage = useCallback(async () => {
    try {
      setIsSaving(true)

      const formData = getFormData()

      // Add timestamp
      const dataToSave = {
        ...formData,
        lastSaved: new Date().toISOString(),
      }

      // Serialize and save
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))

      setLastSaved(new Date())

      // Audit log (optional, can be integrated later)
      console.log('[AutoSave] Form data saved successfully', {
        timestamp: new Date().toISOString(),
        formId: formData.formId,
        activityType: formData.activityType,
      })

      onSaveSuccess?.()
    } catch (error) {
      console.error('[AutoSave] Failed to save form data:', error)
      onSaveError?.(error as Error)
    } finally {
      setIsSaving(false)
    }
  }, [getFormData, onSaveSuccess, onSaveError])

  /**
   * Debounced save - waits for user to stop typing before saving
   * Prevents excessive localStorage writes
   */
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToLocalStorage()
    }, 1000) // 1 second debounce
  }, [saveToLocalStorage])

  /**
   * Manual save trigger
   */
  const saveNow = useCallback(async () => {
    // Clear any pending debounced save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    await saveToLocalStorage()
  }, [saveToLocalStorage])

  /**
   * Clear saved data from localStorage
   */
  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setLastSaved(null)
      console.log('[AutoSave] Saved data cleared')
    } catch (error) {
      console.error('[AutoSave] Failed to clear saved data:', error)
    }
  }, [])

  /**
   * Set up auto-save interval
   */
  useEffect(() => {
    if (!enabled) {
      return
    }

    // Load last saved timestamp on mount
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.lastSaved) {
          setLastSaved(new Date(data.lastSaved))
        }
      }
    } catch (error) {
      console.error('[AutoSave] Failed to load last saved timestamp:', error)
    }

    // Set up interval for auto-save
    intervalRef.current = setInterval(() => {
      debouncedSave()
    }, interval)

    return () => {
      // Cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [enabled, interval, debouncedSave])

  /**
   * Save before user leaves the page
   */
  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Save immediately
      saveNow()

      // Show warning if form has unsaved changes
      const formData = getFormData()
      if (formData && Object.keys(formData).length > 0) {
        event.preventDefault()
        event.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [enabled, saveNow, getFormData])

  return {
    isSaving,
    lastSaved,
    saveNow,
    clearSaved,
  }
}

/**
 * Load saved draft from localStorage
 * Separate function for use in form initialization
 *
 * @returns Saved form data or null if none exists
 *
 * @example
 * ```typescript
 * const savedDraft = loadSavedDraft()
 * if (savedDraft) {
 *   form.reset(savedDraft)
 * }
 * ```
 */
export const loadSavedDraft = (): Partial<DFSAOnboardingFormData> | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return null
    }

    const data = JSON.parse(saved)

    // Check if draft has expired (30 days)
    if (data.lastSaved) {
      const savedDate = new Date(data.lastSaved)
      const now = new Date()
      const daysSinceSaved = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24)

      if (daysSinceSaved > 30) {
        console.log('[AutoSave] Draft has expired (> 30 days), clearing')
        localStorage.removeItem(STORAGE_KEY)
        return null
      }
    }

    console.log('[AutoSave] Loaded saved draft from localStorage')
    return data
  } catch (error) {
    console.error('[AutoSave] Failed to load saved draft:', error)
    return null
  }
}

/**
 * Check if there is a saved draft available
 *
 * @returns True if saved draft exists
 *
 * @example
 * ```typescript
 * if (hasSavedDraft()) {
 *   // Show "Resume application" option
 * }
 * ```
 */
export const hasSavedDraft = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved !== null
  } catch {
    return false
  }
}
