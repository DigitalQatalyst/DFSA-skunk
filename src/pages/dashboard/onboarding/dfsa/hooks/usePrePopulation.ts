/**
 * usePrePopulation Hook
 * Loads sign-up data from localStorage and maps to onboarding form fields
 *
 * Features:
 * - Loads data from DFSAEnquirySignupModal submission
 * - Maps sign-up fields to onboarding fields
 * - Clears sign-up data after successful load
 * - Handles missing or expired data gracefully
 */

import { useEffect, useState } from 'react'
import { DFSAActivityType, DFSAEntityType } from '../../../../../types/dfsa'
import { DFSAOnboardingFormData, computePathwayFlags } from '../types'

const SIGNUP_STORAGE_KEY = 'dfsa_signup_data'

interface SignUpData {
  companyName: string
  contactName: string
  email: string
  phone: string
  suggestedDate?: string | null
  activityType: DFSAActivityType
  entityType: DFSAEntityType
  entityTypeOther?: string | null
  currentlyRegulated?: boolean | null
  difcaConsent: boolean
  submittedAt?: string // Timestamp of submission
}

interface UsePrePopulationReturn {
  prePopulatedData: Partial<DFSAOnboardingFormData> | null
  hasSignUpData: boolean
  isLoading: boolean
  clearSignUpData: () => void
}

/**
 * Map sign-up data to onboarding form data
 * Handles field name transformations and pathway flag computation
 */
const mapSignUpToOnboarding = (signUpData: SignUpData): Partial<DFSAOnboardingFormData> => {
  // Compute pathway letter from activity type
  const pathwayMap: Record<DFSAActivityType, 'A' | 'B' | 'C' | 'D' | 'E'> = {
    FINANCIAL_SERVICES: 'A',
    DNFBP: 'B',
    CRYPTO_TOKEN: 'C',
    REGISTERED_AUDITOR: 'D',
    CRYPTO_TOKEN_RECOGNITION: 'E',
  }

  // Compute pathway flags based on activity type
  const pathwayFlags = computePathwayFlags(signUpData.activityType)

  return {
    // Meta information
    pathway: pathwayMap[signUpData.activityType],

    // Pre-populated fields from sign-up
    suggestedCompanyName: signUpData.companyName,
    contactName: signUpData.contactName,
    contactEmail: signUpData.email,
    contactPhone: signUpData.phone,
    applicationTargetDate: signUpData.suggestedDate || undefined,
    activityType: signUpData.activityType,
    entityType: signUpData.entityType,
    entityTypeOther: signUpData.entityTypeOther || undefined,
    currentlyRegulated: signUpData.currentlyRegulated ?? undefined,

    // Use suggested company name as default legal entity name
    legalEntityName: signUpData.companyName,

    // Pathway flags (computed from activity type)
    ...pathwayFlags,
  }
}

/**
 * Load sign-up data and pre-populate onboarding form
 *
 * @returns Sign-up data state and control functions
 *
 * @example
 * ```typescript
 * const { prePopulatedData, hasSignUpData, clearSignUpData } = usePrePopulation()
 *
 * useEffect(() => {
 *   if (prePopulatedData) {
 *     form.reset(prePopulatedData)
 *     clearSignUpData() // Clear after loading to prevent re-population
 *   }
 * }, [prePopulatedData])
 * ```
 */
export const usePrePopulation = (): UsePrePopulationReturn => {
  const [prePopulatedData, setPrePopulatedData] = useState<Partial<DFSAOnboardingFormData> | null>(null)
  const [hasSignUpData, setHasSignUpData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Clear sign-up data from localStorage
   */
  const clearSignUpData = () => {
    try {
      localStorage.removeItem(SIGNUP_STORAGE_KEY)
      setHasSignUpData(false)
      console.log('[PrePopulation] Sign-up data cleared from localStorage')
    } catch (error) {
      console.error('[PrePopulation] Failed to clear sign-up data:', error)
    }
  }

  /**
   * Load sign-up data on mount
   */
  useEffect(() => {
    const loadSignUpData = () => {
      try {
        setIsLoading(true)

        const stored = localStorage.getItem(SIGNUP_STORAGE_KEY)

        if (!stored) {
          console.log('[PrePopulation] No sign-up data found in localStorage')
          setIsLoading(false)
          return
        }

        const signUpData: SignUpData = JSON.parse(stored)

        // Check if data has expired (24 hours)
        if (signUpData.submittedAt) {
          const submittedDate = new Date(signUpData.submittedAt)
          const now = new Date()
          const hoursSinceSubmission = (now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60)

          if (hoursSinceSubmission > 24) {
            console.log('[PrePopulation] Sign-up data has expired (> 24 hours), clearing')
            clearSignUpData()
            setIsLoading(false)
            return
          }
        }

        // Map sign-up data to onboarding format
        const mappedData = mapSignUpToOnboarding(signUpData)

        setPrePopulatedData(mappedData)
        setHasSignUpData(true)

        console.log('[PrePopulation] Sign-up data loaded and mapped successfully', {
          activityType: signUpData.activityType,
          pathway: mappedData.pathway,
        })
      } catch (error) {
        console.error('[PrePopulation] Failed to load sign-up data:', error)
        // Clear corrupted data
        clearSignUpData()
      } finally {
        setIsLoading(false)
      }
    }

    loadSignUpData()
  }, [])

  return {
    prePopulatedData,
    hasSignUpData,
    isLoading,
    clearSignUpData,
  }
}

/**
 * Check if sign-up data exists in localStorage
 * Useful for showing "Resume from sign-up" option
 *
 * @returns True if sign-up data exists
 *
 * @example
 * ```typescript
 * if (hasStoredSignUpData()) {
 *   // Show option to use sign-up data
 * }
 * ```
 */
export const hasStoredSignUpData = (): boolean => {
  try {
    const stored = localStorage.getItem(SIGNUP_STORAGE_KEY)
    return stored !== null
  } catch {
    return false
  }
}

/**
 * Manually save sign-up data to localStorage
 * Called by DFSAEnquirySignupModal on successful submission
 *
 * @param signUpData - The sign-up form data
 *
 * @example
 * ```typescript
 * // In DFSAEnquirySignupModal after successful submission:
 * saveSignUpData({
 *   companyName: formData.companyName,
 *   contactName: formData.contactName,
 *   email: formData.email,
 *   phone: formData.phone,
 *   suggestedDate: formData.suggestedDate,
 *   activityType: formData.activityType,
 *   entityType: formData.entityType,
 *   entityTypeOther: formData.entityTypeOther,
 *   currentlyRegulated: formData.currentlyRegulated,
 *   difcaConsent: formData.difcaConsent,
 *   submittedAt: new Date().toISOString(),
 * })
 * ```
 */
export const saveSignUpData = (signUpData: SignUpData): void => {
  try {
    const dataToSave = {
      ...signUpData,
      submittedAt: signUpData.submittedAt || new Date().toISOString(),
    }

    localStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(dataToSave))

    console.log('[PrePopulation] Sign-up data saved to localStorage', {
      activityType: signUpData.activityType,
      timestamp: dataToSave.submittedAt,
    })
  } catch (error) {
    console.error('[PrePopulation] Failed to save sign-up data:', error)
  }
}

/**
 * Get stored sign-up data without loading into state
 * Useful for one-off checks
 *
 * @returns Sign-up data or null
 */
export const getStoredSignUpData = (): SignUpData | null => {
  try {
    const stored = localStorage.getItem(SIGNUP_STORAGE_KEY)
    if (!stored) {
      return null
    }

    return JSON.parse(stored)
  } catch (error) {
    console.error('[PrePopulation] Failed to get stored sign-up data:', error)
    return null
  }
}
