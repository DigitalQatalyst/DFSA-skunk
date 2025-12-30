/**
 * ReviewSubmitStep Component
 * Final step of the DFSA onboarding form
 *
 * Features:
 * - Review all submitted information
 * - Collapsible sections with edit buttons
 * - Required declarations
 * - Final submission
 *
 * All pathways see this step
 */

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { DFSAOnboardingFormData } from '../types'
import { ReviewSection, ReviewField } from '../components/ReviewSection'
import { DeclarationCheckbox, DeclarationGroup } from '../components/DeclarationCheckbox'
import { usePathwayConfig } from '../hooks/usePathwayConfig'

interface ReviewSubmitStepProps {
  onEdit: (stepId: string) => void
  onSubmit: () => void
  isSubmitting?: boolean
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({
  onEdit,
  onSubmit,
  isSubmitting = false,
}) => {
  const { watch } = useFormContext<DFSAOnboardingFormData>()
  const formData = watch()

  const { features } = usePathwayConfig(formData.activityType)

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
        <p className="text-sm text-gray-600 mt-2">
          Please review all information before submitting your application.
        </p>
      </div>

      {/* Basic Information */}
      <ReviewSection
        title="Basic Information"
        subtitle={formData.legalEntityName}
        stepId="basic"
        onEdit={onEdit}
      >
        <dl className="divide-y divide-gray-200">
          <ReviewField label="Legal Entity Name" value={formData.legalEntityName} isHighlight />
          <ReviewField label="Jurisdiction" value={formData.incorporationJurisdiction} />
          <ReviewField label="Registration Number" value={formData.registrationNumber} />
        </dl>
      </ReviewSection>

      {/* Declarations */}
      <div className="pt-8 border-t-2 border-gray-300">
        <DeclarationGroup
          title="Declarations"
          subtitle="Please confirm the following declarations."
        >
          <DeclarationCheckbox name="declarations.fitAndProperConfirmation" required>
            I confirm that all individuals are fit and proper persons under DFSA standards.
          </DeclarationCheckbox>

          <DeclarationCheckbox name="declarations.accuracyConfirmation" required>
            I confirm that all information provided is accurate and complete.
          </DeclarationCheckbox>

          <DeclarationCheckbox name="declarations.authorityConfirmation" required>
            I confirm that I have the authority to submit this application.
          </DeclarationCheckbox>

          <DeclarationCheckbox name="declarations.dataConsentProvided" required>
            I consent to the DFSA processing the personal data in this application.
          </DeclarationCheckbox>
        </DeclarationGroup>
      </div>

      {/* Submit Button */}
      <div className="pt-8 border-t border-gray-200">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`
            px-8 py-3 text-white font-semibold rounded-lg
            ${isSubmitting ? 'bg-gray-400' : 'bg-[#b82933] hover:bg-[#a39143]'}
          `}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  )
}
