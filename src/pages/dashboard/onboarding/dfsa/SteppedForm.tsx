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

import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Check, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '../../../../components/Button/Button'
import { DFSAOnboardingFormData, getInitialValues, DFSAActivityType } from './types'
import { getDynamicSchema } from './validation'
import { usePathwayConfig } from './hooks/usePathwayConfig'
import { useAutoSave } from './hooks/useAutoSave'
import { usePrePopulation } from './hooks/usePrePopulation'
import { setDemoOnboardingStatus } from '../../../../services/onboardingStatus'
import { auditLog as auditLogger, DFSA_AUDIT_EVENTS } from '../../../../utils/auditLogger'
import { getStepFields } from './utils/stepFieldMapping'

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

interface SuccessModalProps {
  onClose: () => void
  applicationReference: string
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, applicationReference }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-[90%] text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Application Submitted Successfully!
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Your DFSA licence application has been submitted and is now under review.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
          <p className="text-xs font-medium text-blue-800 mb-1">Application Reference</p>
          <p className="text-lg font-bold text-blue-900">{applicationReference}</p>
        </div>
        <p className="text-gray-500 text-xs mb-8">
          You will receive an email confirmation shortly. The DFSA will review your application and
          may request additional information. Typical processing time is 30-90 business days.
        </p>
        <Button
          variant="primary"
          onClick={onClose}
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}

interface SteppedFormProps {
  onComplete?: () => void
  isModal?: boolean
}

export const SteppedForm: React.FC<SteppedFormProps> = ({ onComplete, isModal = false }) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<number>(0) // 0-indexed for array access
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [applicationReference, setApplicationReference] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-population from sign-up
  const { prePopulatedData, hasSignUpData, clearSignUpData } = usePrePopulation()

  // Initialize form with React Hook Form
  const form = useForm<DFSAOnboardingFormData>({
    resolver: yupResolver(getDynamicSchema('FINANCIAL_SERVICES' as DFSAActivityType)),
    defaultValues: getInitialValues(),
    mode: 'onChange',
  })

  const activityType = form.watch('activityType') as DFSAActivityType

  // Get pathway configuration and visible steps
  const { visibleSteps, totalSteps } = usePathwayConfig(activityType)

  // Auto-save (60 seconds)
  const { isSaving, lastSaved } = useAutoSave(() => form.getValues(), {
    interval: 60000,
    enabled: true,
  })

  // Pre-populate form on mount
  useEffect(() => {
    if (prePopulatedData && hasSignUpData) {
      form.reset(prePopulatedData)
      clearSignUpData()
      auditLogger.log('DFSA_ONBOARDING_PREPOPULATED', {
        activityType: prePopulatedData.activityType,
      })
    }
  }, [prePopulatedData, hasSignUpData])

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
    setIsSubmitting(true)

    try {
      auditLogger.log('DFSA_FORM_SUBMITTED', {
        userId: data.userId,
        activityType: data.activityType,
        pathway: data.pathway,
      })

      // Mock submission (replace with actual API call when backend is ready)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const appRef = `APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 99999)
        .toString()
        .padStart(5, '0')}`

      setApplicationReference(appRef)

      auditLogger.log('DFSA_SUBMISSION_SUCCESS', {
        applicationReference: appRef,
      })

      setShowSuccessModal(true)
    } catch (error) {
      auditLogger.log('DFSA_SUBMISSION_FAILED', {
        error: String(error),
      })
      alert('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
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
            isSubmitting={isSubmitting}
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
            {/* Top Tab Navigation */}
            <div className="flex gap-0 border-b-2 border-gray-200 mb-8 overflow-x-auto">
              {visibleSteps.map((step, index) => {
                const isActive = currentStep === index
                const isCompleted = currentStep > index

                return (
                  <button
                    key={step.id}
                    onClick={() => isCompleted && setCurrentStep(index)}
                    disabled={currentStep < index}
                    className={`
                      flex-1 min-w-[200px] px-6 py-5 border-none bg-transparent cursor-pointer
                      relative flex items-center gap-3 transition-all
                      hover:bg-gray-50
                      ${isActive ? 'bg-[#9B18230D] border-b-3 border-[#9B1823] -mb-0.5' : ''}
                      ${currentStep < index ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}
                    `}
                    style={
                      isActive ? { borderBottomWidth: '3px', borderBottomColor: '#9B1823' } : {}
                    }
                  >
                    {/* Tab Number/Icon */}
                    <div
                      className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                      text-sm font-semibold
                      ${isActive ? 'bg-[#9B1823] text-white shadow-md' : ''}
                      ${isCompleted && !isActive ? 'bg-green-500 text-white' : ''}
                      ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500 border-2 border-gray-200' : ''}
                    `}
                    >
                      {isCompleted ? <Check size={16} /> : index + 1}
                    </div>

                    {/* Tab Content */}
                    <div className="flex flex-col items-start text-left">
                      <span
                        className={`
                        text-sm font-semibold
                        ${isActive ? 'text-[#9B1823]' : 'text-gray-700'}
                        max-sm:hidden
                      `}
                      >
                        {step.title}
                      </span>
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
            <div className="py-8">{renderStepContent()}</div>

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
                    className="bg-[#9B1823] hover:bg-[#7A1319]"
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
