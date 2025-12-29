import React from 'react'
import { Edit } from 'lucide-react'
import { FormData } from '../types'

interface ReviewSubmitStepProps {
  formData: FormData
  onEdit: (step: number) => void
}

const ReviewCard: React.FC<{
  title: string
  onEdit?: () => void
  children: React.ReactNode
}> = ({ title, onEdit, children }) => (
  <div className="border-b border-gray-300 p-6 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>
      {onEdit && (
        <button className="p-1 cursor-pointer hover:bg-gray-100 rounded" onClick={onEdit}>
          <Edit size={18} className="text-gray-500" />
        </button>
      )}
    </div>
    {children}
  </div>
)

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center mb-3">
    <span className="text-gray-500 text-sm">
      {label}:
    </span>
    <span className="text-gray-900 text-sm font-medium">
      {value || 'Not provided'}
    </span>
  </div>
)

// Helper functions to format display values
const formatActivityType = (type: string): string => {
  const mapping: Record<string, string> = {
    'financial_services': 'Financial Services',
    'dnfbp': 'DNFBP',
    'registered_auditor': 'Registered Auditor',
    'crypto_token': 'Crypto Token Recognition'
  }
  return mapping[type] || type
}

const formatServices = (services: string[]): string => {
  const mapping: Record<string, string> = {
    'investment_management': 'Investment Management',
    'investment_advisory': 'Investment Advisory',
    'dealing_investments': 'Dealing in Investments',
    'arranging_deals': 'Arranging Deals in Investments',
    'insurance_services': 'Insurance Services',
    'fund_management': 'Fund Management'
  }
  return services.map(s => mapping[s] || s).join(', ')
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ formData, onEdit }) => {
  const isConsultant = formData.applicantRole === 'professional_advisor'

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Review & Submit
      </h2>
      <p className="text-gray-500 mb-8">
        Please review your information before submitting.
      </p>

      <ReviewCard title="Applicant Role" onEdit={() => onEdit(1)}>
        <InfoRow
          label="Role"
          value={formData.applicantRole === 'own_firm' ? 'Own Firm' : 'Professional Advisor'}
        />
      </ReviewCard>

      {isConsultant && (
        <ReviewCard title="Firm Contact Information" onEdit={() => onEdit(1)}>
          <InfoRow label="First Name" value={formData.firmContactFirstName} />
          <InfoRow label="Last Name" value={formData.firmContactLastName} />
          <InfoRow label="Email" value={formData.firmContactEmail} />
          <InfoRow label="Phone" value={formData.firmContactPhone} />
        </ReviewCard>
      )}

      <ReviewCard title="Contact Information" onEdit={() => onEdit(1)}>
        <InfoRow label="First Name" value={formData.contactFirstName} />
        <InfoRow label="Last Name" value={formData.contactLastName} />
        <InfoRow label="Email" value={formData.contactEmail} />
        <InfoRow label="Phone" value={formData.contactPhone} />
      </ReviewCard>

      <ReviewCard title="Firm Details" onEdit={() => onEdit(2)}>
        <InfoRow label="Company Name" value={formData.suggestedCompanyName} />
        <InfoRow label="Activity Type" value={formatActivityType(formData.activityType)} />
        {formData.activityType === 'financial_services' && formData.services.length > 0 && (
          <InfoRow label="Services" value={formatServices(formData.services)} />
        )}
      </ReviewCard>
    </div>
  )
}
