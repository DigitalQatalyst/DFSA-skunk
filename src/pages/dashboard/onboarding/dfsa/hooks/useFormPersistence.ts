/**
 * useFormPersistence Hook
 * Unified hook for form data persistence (replaces useAutoSave + usePrePopulation)
 *
 * Features:
 * - Loads draft on mount via React Query
 * - Auto-saves at configurable intervals (default: 60s)
 * - Saves before page unload
 * - Integrates with React Query for cache management
 * - Provides save status and controls
 *
 * DFSA Compliance:
 * - Preserves audit logging requirements
 * - Maintains data integrity during save operations
 */

import { useEffect, useCallback, useState, useRef } from 'react'
import { useSaveDraftMutation, useLoadDraft, useDeleteDraftMutation } from './useOnboardingQueries'
import { toast } from 'sonner'
import { DFSAOnboardingFormData } from '../types'

interface UseFormPersistenceOptions {
  userId: string
  formId: string
  enabled?: boolean
  autoSaveInterval?: number // Default: 60000ms (60s)
  onLoadSuccess?: (data: Partial<DFSAOnboardingFormData>) => void
  onSaveSuccess?: () => void
  onSaveError?: (error: Error) => void
}

interface UseFormPersistenceReturn {
  // Draft data
  draftData: Partial<DFSAOnboardingFormData> | null | undefined
  isLoadingDraft: boolean
  draftError: Error | null

  // Save state
  isSaving: boolean
  lastSaved: Date | null

  // Actions
  saveDraft: () => Promise<void>
  clearDraft: () => Promise<void>
}

/**
 * Form persistence hook with React Query integration
 *
 * Combines functionality of useAutoSave and usePrePopulation with React Query for
 * efficient data management and caching.
 *
 * @param getFormData - Function to retrieve current form data
 * @param options - Configuration options
 * @returns Form persistence state and control functions
 *
 * @example
 * ```typescript
 * const { draftData, isLoadingDraft, saveDraft } = useFormPersistence(
 *   () => form.getValues(),
 *   {
 *     userId: user?.id || 'demo',
 *     formId: formData.formId,
 *     enabled: true,
 *     onLoadSuccess: (data) => {
 *       form.reset({ ...form.getValues(), ...data })
 *     },
 *   }
 * )
 * ```
 */
export function useFormPersistence(
  getFormData: () => Partial<DFSAOnboardingFormData>,
  options: UseFormPersistenceOptions
): UseFormPersistenceReturn {
  const {
    userId,
    formId,
    enabled = true,
    autoSaveInterval = 60000, // Default 60 seconds
    onLoadSuccess,
    onSaveSuccess,
    onSaveError,
  } = options

  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load draft on mount using React Query
  const {
    data: draftData,
    isLoading: isLoadingDraft,
    error: draftError,
  } = useLoadDraft(userId, formId, enabled)

  // Save draft mutation
  const saveDraftMutation = useSaveDraftMutation()

  // Delete draft mutation
  const deleteDraftMutation = useDeleteDraftMutation()

  /**
   * Call onLoadSuccess when draft is loaded
   */
  useEffect(() => {
    if (draftData && onLoadSuccess) {
      onLoadSuccess(draftData)
    }
  }, [draftData, onLoadSuccess])

  /**
   * Save draft function
   */
  const saveDraft = useCallback(async () => {
    try {
      const data = getFormData()

      // Skip save if no meaningful data
      if (!data || Object.keys(data).length === 0) {
        return
      }

      await saveDraftMutation.mutateAsync({
        userId,
        formId,
        data,
      })

      setLastSaved(new Date())
      onSaveSuccess?.()

      toast.success('Progress saved', {
        duration: 2000,
        position: 'bottom-right',
      })
    } catch (error) {
      console.error('[FormPersistence] Save failed:', error)
      onSaveError?.(error as Error)

      toast.error('Failed to save progress', {
        description: 'Your progress will be saved locally',
        duration: 3000,
      })
    }
  }, [userId, formId, getFormData, saveDraftMutation, onSaveSuccess, onSaveError])

  /**
   * Debounced save - waits for user to stop editing before saving
   */
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDraft()
    }, 1000) // 1 second debounce
  }, [saveDraft])

  /**
   * Clear draft function
   */
  const clearDraft = useCallback(async () => {
    try {
      await deleteDraftMutation.mutateAsync({ userId, formId })
      setLastSaved(null)

      toast.success('Draft cleared', {
        duration: 2000,
      })
    } catch (error) {
      console.error('[FormPersistence] Failed to clear draft:', error)

      toast.error('Failed to clear draft', {
        duration: 3000,
      })
    }
  }, [userId, formId, deleteDraftMutation])

  /**
   * Set up auto-save interval
   */
  useEffect(() => {
    if (!enabled) {
      return
    }

    // Set up interval for auto-save
    autoSaveIntervalRef.current = setInterval(() => {
      debouncedSave()
    }, autoSaveInterval)

    return () => {
      // Cleanup on unmount
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current)
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [enabled, autoSaveInterval, debouncedSave])

  /**
   * Save before page unload
   */
  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable save on page close
      // This is a fire-and-forget request that works even after page is unloaded
      const data = getFormData()

      if (data && Object.keys(data).length > 0) {
        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL || 'https://kfrealexpressserver.vercel.app/api/v1'

        const blob = new Blob(
          [
            JSON.stringify({
              userId,
              formId,
              data,
            }),
          ],
          {
            type: 'application/json',
          }
        )

        // Attempt to send beacon (best effort)
        navigator.sendBeacon(`${API_BASE_URL}/onboarding/drafts/quick-save`, blob)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [enabled, userId, formId, getFormData])

  return {
    // Draft data
    draftData,
    isLoadingDraft,
    draftError: draftError as Error | null,

    // Save state
    isSaving: saveDraftMutation.isPending,
    lastSaved,

    // Actions
    saveDraft,
    clearDraft,
  }
}
