/**
 * usePathwayConfig Hook
 * Provides pathway configuration and visible steps based on activity type
 *
 * Features:
 * - Dynamic step visibility based on pathway
 * - Pathway feature flags
 * - Question count and time estimates
 * - Step navigation helpers
 */

import { useMemo } from 'react'
import { DFSAActivityType } from '../../../../../types/dfsa'
import {
  PathwayConfig,
  StepDefinition,
  PATHWAY_CONFIGS,
  ALL_STEPS,
  getPathwayConfig as getConfig,
  getVisibleSteps as getSteps,
} from '../types'

interface UsePathwayConfigReturn {
  config: PathwayConfig
  visibleSteps: StepDefinition[]
  totalSteps: number
  questionCount: number
  estimatedMinutes: number
  isStepVisible: (stepId: string) => boolean
  getStepNumber: (stepId: string) => number // Get display number for a step
  features: PathwayConfig['features']
}

/**
 * Get pathway configuration and visible steps
 *
 * @param activityType - The DFSA activity type
 * @returns Pathway configuration and helper functions
 *
 * @example
 * ```typescript
 * const { visibleSteps, config, features } = usePathwayConfig('FINANCIAL_SERVICES')
 *
 * // Check if step is visible
 * if (isStepVisible('shareholding')) {
 *   // Render shareholding step
 * }
 *
 * // Check features
 * if (features.mlroRequired) {
 *   // Show MLRO fields
 * }
 * ```
 */
export const usePathwayConfig = (
  activityType: DFSAActivityType
): UsePathwayConfigReturn => {
  // Get pathway configuration (memoized)
  const config = useMemo(() => {
    return getConfig(activityType)
  }, [activityType])

  // Get visible steps for this pathway (memoized)
  const visibleSteps = useMemo(() => {
    return getSteps(activityType)
  }, [activityType])

  // Total number of visible steps
  const totalSteps = visibleSteps.length

  // Question count and estimated time from config
  const { questionCount, estimatedMinutes } = config

  /**
   * Check if a step is visible for this pathway
   */
  const isStepVisible = useMemo(() => {
    const visibleStepIds = new Set(visibleSteps.map(step => step.id))

    return (stepId: string): boolean => {
      return visibleStepIds.has(stepId)
    }
  }, [visibleSteps])

  /**
   * Get the display step number for a step ID
   * (1-indexed for user display)
   */
  const getStepNumber = useMemo(() => {
    const stepNumberMap = new Map(
      visibleSteps.map((step, index) => [step.id, index + 1])
    )

    return (stepId: string): number => {
      return stepNumberMap.get(stepId) || 0
    }
  }, [visibleSteps])

  // Feature flags for conditional rendering
  const features = config.features

  return {
    config,
    visibleSteps,
    totalSteps,
    questionCount,
    estimatedMinutes,
    isStepVisible,
    getStepNumber,
    features,
  }
}

/**
 * Get pathway name for display
 *
 * @param activityType - The DFSA activity type
 * @returns Human-readable pathway name
 *
 * @example
 * ```typescript
 * const pathwayName = getPathwayName('FINANCIAL_SERVICES')
 * // Returns: "Financial Services"
 * ```
 */
export const getPathwayName = (activityType: DFSAActivityType): string => {
  const config = PATHWAY_CONFIGS[activityType]
  return config.name
}

/**
 * Get pathway letter (A, B, C, D, E)
 *
 * @param activityType - The DFSA activity type
 * @returns Pathway letter
 *
 * @example
 * ```typescript
 * const pathwayLetter = getPathwayLetter('FINANCIAL_SERVICES')
 * // Returns: "A"
 * ```
 */
export const getPathwayLetter = (activityType: DFSAActivityType): string => {
  const config = PATHWAY_CONFIGS[activityType]
  return config.pathway
}

/**
 * Get pathway badge color for UI
 *
 * @param activityType - The DFSA activity type
 * @returns Tailwind color class
 *
 * @example
 * ```typescript
 * const badgeColor = getPathwayBadgeColor('FINANCIAL_SERVICES')
 * // Returns: "bg-blue-500"
 * ```
 */
export const getPathwayBadgeColor = (activityType: DFSAActivityType): string => {
  const colorMap = {
    FINANCIAL_SERVICES: 'bg-blue-500',
    DNFBP: 'bg-green-500',
    CRYPTO_TOKEN: 'bg-purple-500',
    REGISTERED_AUDITOR: 'bg-orange-500',
    CRYPTO_TOKEN_RECOGNITION: 'bg-pink-500',
  }

  return colorMap[activityType]
}

/**
 * Get all step IDs that should be visible for a pathway
 *
 * @param activityType - The DFSA activity type
 * @returns Array of step IDs
 *
 * @example
 * ```typescript
 * const stepIds = getVisibleStepIds('FINANCIAL_SERVICES')
 * // Returns: ['welcome', 'basic', 'entity', 'shareholding', ...]
 * ```
 */
export const getVisibleStepIds = (activityType: DFSAActivityType): string[] => {
  const config = PATHWAY_CONFIGS[activityType]
  return [...config.requiredSteps, ...config.optionalSteps]
}

/**
 * Check if a step is required (vs. optional) for a pathway
 *
 * @param activityType - The DFSA activity type
 * @param stepId - The step ID to check
 * @returns True if step is required
 *
 * @example
 * ```typescript
 * if (isStepRequired('FINANCIAL_SERVICES', 'shareholding')) {
 *   // Show as required
 * }
 * ```
 */
export const isStepRequired = (
  activityType: DFSAActivityType,
  stepId: string
): boolean => {
  const config = PATHWAY_CONFIGS[activityType]
  return config.requiredSteps.includes(stepId)
}

/**
 * Get the next visible step ID
 *
 * @param activityType - The DFSA activity type
 * @param currentStepId - The current step ID
 * @returns Next step ID or null if at last step
 *
 * @example
 * ```typescript
 * const nextStepId = getNextStepId('FINANCIAL_SERVICES', 'welcome')
 * // Returns: 'basic'
 * ```
 */
export const getNextStepId = (
  activityType: DFSAActivityType,
  currentStepId: string
): string | null => {
  const visibleSteps = getSteps(activityType)
  const currentIndex = visibleSteps.findIndex(step => step.id === currentStepId)

  if (currentIndex === -1 || currentIndex === visibleSteps.length - 1) {
    return null
  }

  return visibleSteps[currentIndex + 1].id
}

/**
 * Get the previous visible step ID
 *
 * @param activityType - The DFSA activity type
 * @param currentStepId - The current step ID
 * @returns Previous step ID or null if at first step
 *
 * @example
 * ```typescript
 * const prevStepId = getPreviousStepId('FINANCIAL_SERVICES', 'basic')
 * // Returns: 'welcome'
 * ```
 */
export const getPreviousStepId = (
  activityType: DFSAActivityType,
  currentStepId: string
): string | null => {
  const visibleSteps = getSteps(activityType)
  const currentIndex = visibleSteps.findIndex(step => step.id === currentStepId)

  if (currentIndex === -1 || currentIndex === 0) {
    return null
  }

  return visibleSteps[currentIndex - 1].id
}

/**
 * Calculate form completion percentage
 *
 * @param activityType - The DFSA activity type
 * @param currentStepId - The current step ID
 * @returns Completion percentage (0-100)
 *
 * @example
 * ```typescript
 * const completion = getCompletionPercentage('FINANCIAL_SERVICES', 'shareholding')
 * // Returns: 44 (if on step 4 of 9)
 * ```
 */
export const getCompletionPercentage = (
  activityType: DFSAActivityType,
  currentStepId: string
): number => {
  const visibleSteps = getSteps(activityType)
  const currentIndex = visibleSteps.findIndex(step => step.id === currentStepId)

  if (currentIndex === -1) {
    return 0
  }

  // +1 because we count the current step as in progress
  return Math.round(((currentIndex + 1) / visibleSteps.length) * 100)
}
