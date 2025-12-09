/**
 * SteppedForm Component - DFSA Onboarding
 * Main form orchestrator with React Hook Form integration
 *
 * Features:
 * - 9-step wizard with dynamic visibility based on pathway
 * - React Hook Form for state management
 * - 60-second auto-save
 * - Pre-population from sign-up
 * - Step-by-step validation
 * - Audit logging
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Check, ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from '../../../../components/Button/Button'
import { DFSAOnboardingFormData, getInitialValues, DFSAActivityType } from './types'
import { getDynamicSchema } from './validation'
import { usePathwayConfig } from './hooks/usePathwayConfig'
import { useFormPersistence } from './hooks/useFormPersistence'
import { useSubmitApplicationMutation } from './hooks/useOnboardingQueries'
import { setDemoOnboardingStatus } from '../../../../services/onboardingStatus'
import { auditLog as auditLogger, DFSA_AUDIT_EVENTS } from '../../../../utils/auditLogger'
import { getStepFields } from './utils/stepFieldMapping'
import { toast } from 'sonner'
import { SuccessModal } from './components/SuccessModal'
import { LoadingStep } from './components/LoadingStep'

// Import all step components
import { WelcomeStep } from './steps/WelcomeStep'
import { BasicInformationStep } from './steps/BasicInformationStep'
import { EntityStructureStep } from './steps/EntityStructureStep'
import { ShareholdingStep } from './steps/ShareholdingStep'
import { BeneficialOwnershipStep } from './steps/BeneficialOwnershipStep'
import { FinancialInformationStep } from './steps/FinancialInformationStep'
import { RegulatoryComplianceStep } from './steps/RegulatoryComplianceStep'
import { DocumentUploadsStep } from './steps/DocumentUploadsStep'
import { ReviewSubmitStep } from './steps/ReviewSubmitStep'

interface SteppedFormProps {
  onComplete?: () => void
  isModal?: boolean
}

export const SteppedForm: React.FC<SteppedFormProps> = ({ onComplete, isModal = false }) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<number>(0) // 0-indexed for array access
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [applicationReference, setApplicationReference] = useState('')

  // Initialize form with React Hook Form
  const form = useForm<DFSAOnboardingFormData>({
    resolver: yupResolver(getDynamicSchema('FINANCIAL_SERVICES' as DFSAActivityType)),
    defaultValues: getInitialValues(),
    mode: 'onChange',
  })

  const activityType = form.watch('activityType') as DFSAActivityType
  const formId = form.watch('formId')

  // Get pathway configuration and visible steps
  const { visibleSteps, totalSteps } = usePathwayConfig(activityType)

  // Form persistence with React Query (replaces useAutoSave + usePrePopulation)
  const { draftData, isLoadingDraft, isSaving, lastSaved } = useFormPersistence(
    () => form.getValues(),
    {
      userId: 'demo', // Replace with actual user ID when auth is implemented
      formId: formId,
      enabled: true,
      autoSaveInterval: 60000, // 60 seconds
      onLoadSuccess: (data) => {
        // Merge loaded draft with current form values
        form.reset({ ...form.getValues(), ...data })
        auditLogger.log('DFSA_ONBOARDING_DRAFT_LOADED', {
          activityType: data.activityType,
        })
      },
    }
  )

  // Submit application mutation
  const submitMutation = useSubmitApplicationMutation()

  // Step completion tracking
  const [stepCompletions, setStepCompletions] = useState<Record<string, number>>({})

  // Calculate completion percentage for a step
  const calculateStepCompletion = useCallback(
    (stepId: string) => {
      const fieldsToCheck = getStepFields(stepId)

      if (fieldsToCheck.length === 0) {
        return 0
      }

      const formValues = form.getValues()
      let completedCount = 0

      fieldsToCheck.forEach((fieldPath) => {
        // Get nested field value (e.g., "businessAddress.line1")
        const value = fieldPath.split('.').reduce((obj: any, key) => obj?.[key], formValues)

        // Check if field has a value
        if (value !== null && value !== undefined && value !== '') {
          // Handle arrays (e.g., shareholders)
          if (Array.isArray(value) && value.length > 0) {
            completedCount++
          }
          // Handle boolean values
          else if (typeof value === 'boolean') {
            completedCount++
          }
          // Handle strings and numbers
          else if (value) {
            completedCount++
          }
        }
      })

      return Math.round((completedCount / fieldsToCheck.length) * 100)
    },
    [form]
  )

  // Update completion tracking when form values change
  useEffect(() => {
    const subscription = form.watch(() => {
      const newCompletions: Record<string, number> = {}

      visibleSteps.forEach((step) => {
        newCompletions[step.id] = calculateStepCompletion(step.id)
      })

      setStepCompletions(newCompletions)
    })

    // Initial calculation
    const initialCompletions: Record<string, number> = {}
    visibleSteps.forEach((step) => {
      initialCompletions[step.id] = calculateStepCompletion(step.id)
    })
    setStepCompletions(initialCompletions)

    return () => subscription.unsubscribe()
  }, [form, visibleSteps, calculateStepCompletion])

  // Log onboarding start
  useEffect(() => {
    auditLogger.log('DFSA_ONBOARDING_STARTED', {
      timestamp: new Date().toISOString(),
    })
  }, [])

  // Get current step data
  const currentStepData = useMemo(() => {
    return visibleSteps[currentStep] || visibleSteps[0]
  }, [visibleSteps, currentStep])

  // Handle step navigation - Edit from review
  const handleEdit = (stepId: string) => {
    const stepIndex = visibleSteps.findIndex((step) => step.id === stepId)
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex)
      window.scrollTo(0, 0)
    }
  }

  // Handle next button
  const handleNext = async () => {
    if (currentStep >= totalSteps - 1) return

    // Get fields to validate for current step
    const fieldsToValidate = getStepFields(currentStepData.id)

    // Skip validation for display-only steps (e.g., welcome, review)
    let isValid = true
    if (fieldsToValidate.length > 0) {
      // Validate only current step's fields
      isValid = await form.trigger(fieldsToValidate as any)
    }

    if (isValid) {
      auditLogger.log('DFSA_SECTION_COMPLETED', {
        step: currentStepData.id,
        stepNumber: currentStep + 1,
      })
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  // Handle previous button
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Handle final submission
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      auditLogger.log('DFSA_FORM_SUBMITTED', {
        userId: data.userId,
        activityType: data.activityType,
        pathway: data.pathway,
      })

      // Submit application using React Query mutation
      const result = await submitMutation.mutateAsync(data)

      setApplicationReference(result.applicationReference)

      auditLogger.log('DFSA_SUBMISSION_SUCCESS', {
        applicationReference: result.applicationReference,
        submittedAt: result.submittedAt,
      })

      toast.success('Application submitted successfully!', {
        description: `Reference: ${result.applicationReference}`,
      })

      setShowSuccessModal(true)
    } catch (error) {
      auditLogger.log('DFSA_SUBMISSION_FAILED', {
        error: String(error),
      })
      toast.error('Submission failed. Please try again.', {
        description: 'If the problem persists, please contact support.',
        duration: 5000,
      })
    }
  })

  // Handle modal close
  const handleCloseModal = () => {
    setShowSuccessModal(false)
    setDemoOnboardingStatus('completed')

    if (onComplete) {
      onComplete()
    }

    navigate('/dashboard/profile')
  }

  // Render current step content
  const renderStepContent = () => {
    const stepId = currentStepData?.id

    switch (stepId) {
      case 'welcome':
        return <WelcomeStep />
      case 'basic':
        return <BasicInformationStep />
      case 'entity':
        return <EntityStructureStep />
      case 'shareholding':
        return <ShareholdingStep />
      case 'beneficial':
        return <BeneficialOwnershipStep />
      case 'financial':
        return <FinancialInformationStep />
      case 'regulatory':
        return <RegulatoryComplianceStep />
      case 'documents':
        return <DocumentUploadsStep />
      case 'review':
        return (
          <ReviewSubmitStep
            onEdit={handleEdit}
            onSubmit={handleSubmit}
            isSubmitting={submitMutation.isPending}
          />
        )
      default:
        return <WelcomeStep />
    }
  }

  if (showSuccessModal) {
    return <SuccessModal onClose={handleCloseModal} applicationReference={applicationReference} />
  }

  return (
    <FormProvider {...form}>
      <div className={isModal ? '' : 'min-h-screen bg-gray-50 py-12 px-4 sm:px-6'}>
        <div className={isModal ? '' : 'max-w-6xl mx-auto'}>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
            {/* Enhanced Progress Indicator */}
            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep + 1} of {totalSteps}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#9B1823] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={currentStep + 1}
                  aria-valuemin={0}
                  aria-valuemax={totalSteps}
                  aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Estimated time remaining: {Math.max(1, totalSteps - currentStep - 1) * 5} minutes
              </p>
            </div>

            {/* Top Tab Navigation */}
            <div className="flex gap-0 border-b-2 border-gray-200 mb-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {visibleSteps.map((step, index) => {
                const isActive = currentStep === index
                const isCompleted = currentStep > index
                const completion = stepCompletions[step.id] || 0

                return (
                  <button
                    key={step.id}
                    onClick={() => isCompleted && setCurrentStep(index)}
                    disabled={currentStep < index}
                    className={`
                      flex-1 min-w-[200px] px-6 py-5 border-none bg-transparent cursor-pointer
                      relative flex items-center gap-3 transition-all duration-300
                      hover:bg-gray-50
                      ${isActive ? 'bg-[#b82933]/5 border-b-3 border-[#b82933] -mb-0.5' : ''}
                      ${currentStep < index ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}
                    `}
                    style={
                      isActive ? { borderBottomWidth: '3px', borderBottomColor: '#b82933' } : {}
                    }
                  >
                    {/* Tab Number/Icon */}
                    <div
                      className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                      text-sm font-semibold transition-all duration-300
                      ${isActive ? 'bg-[#b82933] text-white shadow-lg scale-110' : ''}
                      ${isCompleted && !isActive ? 'bg-[#a39143] text-white shadow-md' : ''}
                      ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500 border-2 border-gray-300' : ''}
                    `}
                    >
                      {isCompleted ? <Check size={16} /> : index + 1}
                    </div>

                    {/* Tab Content */}
                    <div className="flex flex-col items-start text-left flex-1">
                      <div className="flex items-center gap-2 w-full">
                        <span
                          className={`
                          text-sm font-semibold transition-colors
                          ${isActive ? 'text-[#b82933]' : 'text-gray-700'}
                          max-sm:hidden
                        `}
                        >
                          {step.title}
                        </span>

                        {/* Completion Badge - only show for steps with progress */}
                        {completion > 0 && (
                          <span
                            className={`
                            flex items-center text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-semibold
                            transition-all duration-300
                            ${
                              completion === 100
                                ? 'bg-[#a39143]/10 text-[#a39143] border border-[#a39143]/30'
                                : 'bg-[#a39143]/10 text-[#a39143] border border-[#a39143]/30'
                            }
                            max-sm:hidden
                          `}
                          >
                            {completion === 100 ? (
                              <>
                                <Check size={12} className="mr-1" />
                                {completion}%
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#a39143] mr-1" />
                                {completion}%
                              </>
                            )}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 max-sm:hidden">{step.description}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Auto-save Indicator */}
            {isSaving && (
              <div className="mb-4 text-xs text-gray-500 flex items-center gap-2">
                <svg
                  className="animate-spin h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </div>
            )}

            {lastSaved && !isSaving && (
              <div className="mb-4 text-xs text-green-600 flex items-center gap-2">
                <Check size={12} />
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}

            {/* Main Content */}
            <div className="py-8">
              {isLoadingDraft ? <LoadingStep /> : renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            {currentStepData?.id !== 'review' && (
              <div className="flex justify-between items-center mt-8 pt-6 gap-4">
                {/* Left side - Previous button */}
                <div>
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      icon={<ArrowLeft size={16} />}
                      iconPosition="left"
                    >
                      Previous
                    </Button>
                  )}
                </div>

                {/* Right side - Next button */}
                <div>
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    icon={<ChevronRight size={16} />}
                    iconPosition="right"
                    className="bg-[#b82933] hover:bg-[#a39143] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold px-8"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
