/**
 * Onboarding API Service
 * Centralized API layer for DFSA onboarding operations
 *
 * Features:
 * - Submit complete application
 * - Save/load drafts
 * - Upload documents
 * - Consistent error handling
 * - Type-safe requests and responses
 */

import { DFSAOnboardingFormData } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kfrealexpressserver.vercel.app/api/v1'

/**
 * Custom error class for onboarding API errors
 */
export class OnboardingApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'OnboardingApiError'
  }
}

/**
 * Submit complete DFSA onboarding application
 *
 * @param data - Complete onboarding form data
 * @returns Application reference and submission timestamp
 * @throws OnboardingApiError if submission fails
 *
 * @example
 * ```typescript
 * const result = await submitOnboardingApplication(formData)
 * console.log('Application Reference:', result.applicationReference)
 * ```
 */
export async function submitOnboardingApplication(
  data: DFSAOnboardingFormData
): Promise<{ applicationReference: string; submittedAt: string }> {
  const response = await fetch(`${API_BASE_URL}/onboarding/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new OnboardingApiError(
      `Failed to submit application: ${response.statusText}`,
      response.status
    )
  }

  return await response.json()
}

/**
 * Save draft of onboarding application
 *
 * @param userId - User ID
 * @param formId - Form ID (UUID)
 * @param data - Partial form data to save
 * @returns Saved timestamp and draft ID
 * @throws OnboardingApiError if save fails
 *
 * @example
 * ```typescript
 * const result = await saveDraft(user.id, formId, partialData)
 * console.log('Saved at:', result.savedAt)
 * ```
 */
export async function saveDraft(
  userId: string,
  formId: string,
  data: Partial<DFSAOnboardingFormData>
): Promise<{ savedAt: string; draftId: string }> {
  const response = await fetch(`${API_BASE_URL}/onboarding/drafts/${userId}/${formId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new OnboardingApiError(
      `Failed to save draft: ${response.statusText}`,
      response.status
    )
  }

  return await response.json()
}

/**
 * Load draft of onboarding application
 *
 * @param userId - User ID
 * @param formId - Form ID (UUID)
 * @returns Partial form data or null if no draft exists
 * @throws OnboardingApiError if load fails (except 404)
 *
 * @example
 * ```typescript
 * const draft = await loadDraft(user.id, formId)
 * if (draft) {
 *   form.reset(draft)
 * }
 * ```
 */
export async function loadDraft(
  userId: string,
  formId: string
): Promise<Partial<DFSAOnboardingFormData> | null> {
  const response = await fetch(`${API_BASE_URL}/onboarding/drafts/${userId}/${formId}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (response.status === 404) {
    return null // No draft exists
  }

  if (!response.ok) {
    throw new OnboardingApiError(
      `Failed to load draft: ${response.statusText}`,
      response.status
    )
  }

  return await response.json()
}

/**
 * Delete draft of onboarding application
 *
 * @param userId - User ID
 * @param formId - Form ID (UUID)
 * @throws OnboardingApiError if delete fails (except 404)
 *
 * @example
 * ```typescript
 * await deleteDraft(user.id, formId)
 * ```
 */
export async function deleteDraft(userId: string, formId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/onboarding/drafts/${userId}/${formId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok && response.status !== 404) {
    throw new OnboardingApiError(
      `Failed to delete draft: ${response.statusText}`,
      response.status
    )
  }
}

/**
 * Upload document for onboarding application
 *
 * @param file - File to upload
 * @param documentType - Type of document (e.g., 'certificateOfIncorporation')
 * @param userId - User ID
 * @returns Azure Blob URL and blob name
 * @throws OnboardingApiError if upload fails
 *
 * @example
 * ```typescript
 * const result = await uploadDocument(file, 'certificateOfIncorporation', user.id)
 * form.setValue('documents.certificateOfIncorporation', result.url)
 * ```
 */
export async function uploadDocument(
  file: File,
  documentType: string,
  userId: string
): Promise<{ url: string; blobName: string }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('documentType', documentType)
  formData.append('userId', userId)

  const response = await fetch(`${API_BASE_URL}/onboarding/documents/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData, // No Content-Type header for FormData
  })

  if (!response.ok) {
    throw new OnboardingApiError(
      `Failed to upload document: ${response.statusText}`,
      response.status
    )
  }

  return await response.json()
}
