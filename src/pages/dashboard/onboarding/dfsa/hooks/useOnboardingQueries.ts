/**
 * useOnboardingQueries Hook
 * React Query hooks for DFSA onboarding data management
 *
 * Features:
 * - Query hooks for loading drafts
 * - Mutation hooks for saving drafts, submitting applications, uploading documents
 * - Automatic cache invalidation
 * - Type-safe API layer integration
 *
 * DFSA Compliance:
 * - Preserves audit logging requirements
 * - Integrates with OnboardingApiService
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  submitOnboardingApplication,
  saveDraft,
  loadDraft,
  deleteDraft,
  uploadDocument,
} from '../services/OnboardingApiService'
import { DFSAOnboardingFormData } from '../types'

/**
 * Query keys for onboarding data
 * Follows React Query best practices for hierarchical key structure
 */
export const dfsaOnboardingKeys = {
  all: ['dfsa-onboarding'] as const,

  drafts: {
    all: ['dfsa-onboarding', 'drafts'] as const,
    byUser: (userId: string) =>
      [...dfsaOnboardingKeys.drafts.all, userId] as const,
    detail: (userId: string, formId: string) =>
      [...dfsaOnboardingKeys.drafts.byUser(userId), formId] as const,
  },

  submissions: {
    all: ['dfsa-onboarding', 'submissions'] as const,
    detail: (formId: string) =>
      [...dfsaOnboardingKeys.submissions.all, formId] as const,
  },

  documents: {
    all: ['dfsa-onboarding', 'documents'] as const,
    byUser: (userId: string) =>
      [...dfsaOnboardingKeys.documents.all, userId] as const,
  },
}

/**
 * Load draft query
 *
 * @param userId - User ID
 * @param formId - Form ID (UUID)
 * @param enabled - Enable/disable query (default: true)
 * @returns Query result with draft data
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useLoadDraft(user.id, formId)
 * if (data) {
 *   form.reset(data)
 * }
 * ```
 */
export function useLoadDraft(userId: string, formId: string, enabled = true) {
  return useQuery({
    queryKey: dfsaOnboardingKeys.drafts.detail(userId, formId),
    queryFn: () => loadDraft(userId, formId),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once for draft loading
  })
}

/**
 * Save draft mutation
 *
 * @returns Mutation result with save function
 *
 * @example
 * ```typescript
 * const saveDraftMutation = useSaveDraftMutation()
 *
 * await saveDraftMutation.mutateAsync({
 *   userId: user.id,
 *   formId: formId,
 *   data: partialData,
 * })
 * ```
 */
export function useSaveDraftMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      formId,
      data,
    }: {
      userId: string
      formId: string
      data: Partial<DFSAOnboardingFormData>
    }) => {
      return await saveDraft(userId, formId, data)
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific draft query to refetch
      queryClient.invalidateQueries({
        queryKey: dfsaOnboardingKeys.drafts.detail(variables.userId, variables.formId),
      })
    },
  })
}

/**
 * Submit application mutation
 *
 * @returns Mutation result with submit function
 *
 * @example
 * ```typescript
 * const submitMutation = useSubmitApplicationMutation()
 *
 * const result = await submitMutation.mutateAsync(formData)
 * console.log('Application Reference:', result.applicationReference)
 * ```
 */
export function useSubmitApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: DFSAOnboardingFormData) => {
      return await submitOnboardingApplication(data)
    },
    onSuccess: () => {
      // Invalidate drafts (they should be cleared after submission)
      queryClient.invalidateQueries({
        queryKey: dfsaOnboardingKeys.drafts.all,
      })

      // Invalidate submissions list
      queryClient.invalidateQueries({
        queryKey: dfsaOnboardingKeys.submissions.all,
      })
    },
  })
}

/**
 * Upload document mutation
 *
 * @returns Mutation result with upload function
 *
 * @example
 * ```typescript
 * const uploadMutation = useUploadDocumentMutation()
 *
 * const result = await uploadMutation.mutateAsync({
 *   file: fileObject,
 *   documentType: 'certificateOfIncorporation',
 *   userId: user.id,
 * })
 * form.setValue('documents.certificateOfIncorporation', result.url)
 * ```
 */
export function useUploadDocumentMutation() {
  return useMutation({
    mutationFn: async ({
      file,
      documentType,
      userId,
    }: {
      file: File
      documentType: string
      userId: string
    }) => {
      return await uploadDocument(file, documentType, userId)
    },
  })
}

/**
 * Delete draft mutation
 *
 * @returns Mutation result with delete function
 *
 * @example
 * ```typescript
 * const deleteDraftMutation = useDeleteDraftMutation()
 *
 * await deleteDraftMutation.mutateAsync({
 *   userId: user.id,
 *   formId: formId,
 * })
 * ```
 */
export function useDeleteDraftMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      formId,
    }: {
      userId: string
      formId: string
    }) => {
      return await deleteDraft(userId, formId)
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific draft query
      queryClient.invalidateQueries({
        queryKey: dfsaOnboardingKeys.drafts.detail(variables.userId, variables.formId),
      })
    },
  })
}
