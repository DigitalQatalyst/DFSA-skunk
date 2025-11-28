import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '../../../../components/Button/Button'
import { FormData } from './types'
import { RoleContactStep } from './steps/RoleContactStep'
import { FirmDetailsStep } from './steps/FirmDetailsStep'
import { ReviewSubmitStep } from './steps/ReviewSubmitStep'
import { setDemoOnboardingStatus } from '../../../../services/onboardingStatus'

interface Step {
  id: number
  title: string
  subtitle: string
}

const steps: Step[] = [
  { id: 1, title: 'Role & Contact', subtitle: 'Select to begin registration' },
  { id: 2, title: 'Firm Details', subtitle: 'Activity type & Services' },
  { id: 3, title: 'Review & Submit', subtitle: 'Cross-check your info' }
]

interface SuccessModalProps {
  onClose: () => void
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-[90%] text-center">
        <div className="w-16 h-16 bg-[#9B1823] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Submitted Successfully!
        </h3>
        <p className="text-gray-500 text-sm mb-8">
          Thank you for taking the time to submit the details required. This information will be used to build your profile and streamline our service delivery.
        </p>
        <Button
          variant="primary"
          onClick={onClose}
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        >
          See Your Firm Profile Details
        </Button>
      </div>
    </div>
  )
}

interface SteppedFormProps {
  onComplete?: () => void;
  isModal?: boolean;
}

export const SteppedForm: React.FC<SteppedFormProps> = ({ onComplete, isModal = false }) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    applicantRole: '',
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    firmContactFirstName: '',
    firmContactLastName: '',
    firmContactEmail: '',
    firmContactPhone: '',
    suggestedCompanyName: '',
    activityType: '',
    services: []
  })

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSaveAndContinueLater = () => {
    console.log('Saving progress...', formData)
    // In a real app, this would save to backend
    alert('Progress saved! You can continue later.')
  }

  const handleSubmit = () => {
    console.log('Submitting form data:', formData)
    setShowSuccessModal(true)
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false)

    // Set onboarding status to completed in demo mode
    setDemoOnboardingStatus('completed')

    // Call the onComplete callback to trigger navigation and status update
    if (onComplete) {
      onComplete()
    }

    // Navigate to profile page
    navigate('/dashboard/profile')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <RoleContactStep formData={formData} updateFormData={updateFormData} />
      case 2:
        return <FirmDetailsStep formData={formData} updateFormData={updateFormData} />
      case 3:
        return <ReviewSubmitStep formData={formData} onEdit={setCurrentStep} />
      default:
        return null
    }
  }

  if (showSuccessModal) {
    return <SuccessModal onClose={handleCloseModal} />
  }

  return (
    <div className={isModal ? "" : "min-h-screen bg-gray-50 py-12 px-4 sm:px-6"}>
      <div className={isModal ? "" : "max-w-6xl mx-auto"}>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">

          {/* Top Tab Navigation */}
          <div className="flex gap-0 border-b-2 border-gray-200 mb-8 overflow-x-auto">
            {steps.map((step) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <button
                  key={step.id}
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                  disabled={currentStep < step.id}
                  className={`
                    flex-1 min-w-[200px] px-6 py-5 border-none bg-transparent cursor-pointer
                    relative flex items-center gap-3 transition-all
                    hover:bg-gray-50
                    ${isActive ? 'bg-[#9B18230D] border-b-3 border-[#9B1823] -mb-0.5' : ''}
                    ${currentStep < step.id ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}
                  `}
                  style={isActive ? { borderBottomWidth: '3px', borderBottomColor: '#9B1823' } : {}}
                >
                  {/* Tab Number/Icon */}
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    text-sm font-semibold
                    ${isActive ? 'bg-[#9B1823] text-white shadow-md' : ''}
                    ${isCompleted && !isActive ? 'bg-green-500 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500 border-2 border-gray-200' : ''}
                  `}>
                    {isCompleted ? (
                      <Check size={16} />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Tab Content */}
                  <div className="flex flex-col items-start text-left">
                    <span className={`
                      text-sm font-semibold
                      ${isActive ? 'text-[#9B1823]' : 'text-gray-700'}
                      max-sm:hidden
                    `}>
                      {step.title}
                    </span>
                    <span className="text-xs text-gray-500 max-sm:hidden">
                      {step.subtitle}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Main Content */}
          <div className="py-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 gap-4">
            {/* Left side - Previous button */}
            <div>
              {currentStep > 1 && (
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

            {/* Right side - Save & Next/Submit buttons */}
            <div className="flex gap-4">
              {currentStep > 1 && currentStep < steps.length && (
                <Button
                  variant="outline"
                  onClick={handleSaveAndContinueLater}
                  className="border-[#9B1823] text-[#9B1823] hover:bg-[#9B18230D]"
                >
                  Save and continue later
                </Button>
              )}

              {currentStep < steps.length ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  icon={<ChevronRight size={16} />}
                  iconPosition="right"
                  className="bg-[#9B1823] hover:bg-[#7A1319]"
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                  className="bg-[#9B1823] hover:bg-[#7A1319]"
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
