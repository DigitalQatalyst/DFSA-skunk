/**
 * MobileStepNavigation Component
 * Mobile-friendly dropdown navigation for onboarding steps
 *
 * Features:
 * - Dropdown selector for current step
 * - Touch-friendly buttons (min 44px)
 * - Collapsible step list
 * - Accessible navigation
 *
 * DFSA Compliance:
 * - Maintains formal language
 * - Accessible for screen readers
 * - Clear step indicators
 */

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'

interface Step {
  id: string
  title: string
  description: string
}

interface MobileStepNavigationProps {
  steps: Step[]
  currentStep: number
  onStepClick: (stepIndex: number) => void
  disabled?: boolean
}

/**
 * Mobile navigation component for stepped form
 *
 * Provides a dropdown selector and touch-friendly navigation for mobile devices.
 *
 * @param steps - Array of step objects
 * @param currentStep - Current step index (0-indexed)
 * @param onStepClick - Callback when a step is selected
 * @param disabled - Disable navigation
 *
 * @example
 * ```typescript
 * <MobileStepNavigation
 *   steps={visibleSteps}
 *   currentStep={currentStep}
 *   onStepClick={setCurrentStep}
 * />
 * ```
 */
export const MobileStepNavigation: React.FC<MobileStepNavigationProps> = ({
  steps,
  currentStep,
  onStepClick,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const currentStepData = steps[currentStep]

  const handleStepClick = (stepIndex: number) => {
    // Only allow navigation to completed steps
    if (stepIndex <= currentStep && !disabled) {
      onStepClick(stepIndex)
      setIsExpanded(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Current Step Display */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
        className="w-full flex items-center justify-between p-4 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#9B1823] rounded-lg"
        aria-expanded={isExpanded}
        aria-label={`Current step: ${currentStepData?.title}. Click to view all steps.`}
      >
        <div className="flex items-center gap-3">
          {/* Step Number */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#9B1823] text-white flex items-center justify-center text-sm font-semibold">
            {currentStep + 1}
          </div>

          {/* Step Info */}
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">{currentStepData?.title}</p>
            <p className="text-xs text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Expand Icon */}
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </div>
      </button>

      {/* Dropdown List */}
      {isExpanded && (
        <div
          className="border-t border-gray-200"
          role="menu"
          aria-label="Step navigation"
        >
          {steps.map((step, index) => {
            const isActive = currentStep === index
            const isCompleted = currentStep > index
            const isDisabled = index > currentStep || disabled

            return (
              <button
                key={step.id}
                type="button"
                role="menuitem"
                onClick={() => handleStepClick(index)}
                disabled={isDisabled}
                className={`
                  w-full flex items-center gap-3 p-4 min-h-[44px]
                  border-b border-gray-100 last:border-b-0
                  transition-colors
                  ${isActive ? 'bg-[#9B18230D]' : 'bg-white'}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
                `}
                aria-current={isActive ? 'step' : undefined}
              >
                {/* Step Icon/Number */}
                <div
                  className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    text-sm font-semibold
                    ${isActive ? 'bg-[#9B1823] text-white' : ''}
                    ${isCompleted && !isActive ? 'bg-green-500 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                  `}
                >
                  {isCompleted ? <Check size={16} /> : index + 1}
                </div>

                {/* Step Info */}
                <div className="flex-1 text-left">
                  <p
                    className={`
                      text-sm font-medium
                      ${isActive ? 'text-[#9B1823]' : 'text-gray-700'}
                    `}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
