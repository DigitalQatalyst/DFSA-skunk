import React from 'react'
import { StepProps } from '../types'
import { InputField } from '../components/InputField'
import { RadioField } from '../components/RadioField'
import { CheckboxField } from '../components/CheckboxField'

const serviceOptions = [
  { value: 'investment_management', label: 'Investment Management' },
  { value: 'investment_advisory', label: 'Investment Advisory' },
  { value: 'dealing_investments', label: 'Dealing in Investments' },
  { value: 'arranging_deals', label: 'Arranging Deals in Investments' },
  { value: 'insurance_services', label: 'Insurance Services' },
  { value: 'fund_management', label: 'Fund Management' },
]

export const FirmDetailsStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const showServices = formData.activityType === 'financial_services'

  const handleServiceToggle = (serviceValue: string) => {
    const currentServices = formData.services || []
    const updatedServices = currentServices.includes(serviceValue)
      ? currentServices.filter(s => s !== serviceValue)
      : [...currentServices, serviceValue]
    updateFormData('services', updatedServices)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Firm Details
      </h2>

      <p className="text-gray-500 mb-6">
        Please provide information about the firm.
      </p>

      <div className="mb-8">
        <InputField
          label="Suggested Company Name"
          value={formData.suggestedCompanyName}
          onChange={(value) => updateFormData('suggestedCompanyName', value)}
          placeholder="Enter company name (e.g., ABC Financial Services Ltd.)"
          required
        />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Activity Type
        </h3>
        <p className="text-gray-500 mb-6">
          Select the primary activity type for your firm.
        </p>

        <RadioField
          label="Financial Services"
          value="financial_services"
          checked={formData.activityType === 'financial_services'}
          onChange={(value) => updateFormData('activityType', value)}
          description="Regulated financial services activities"
        />
        <RadioField
          label="DNFBP"
          value="dnfbp"
          checked={formData.activityType === 'dnfbp'}
          onChange={(value) => updateFormData('activityType', value)}
          description="Designated Non-Financial Businesses and Professions"
        />
        <RadioField
          label="Registered Auditor"
          value="registered_auditor"
          checked={formData.activityType === 'registered_auditor'}
          onChange={(value) => updateFormData('activityType', value)}
          description="Audit and assurance services"
        />
        <RadioField
          label="Crypto Token Recognition"
          value="crypto_token"
          checked={formData.activityType === 'crypto_token'}
          onChange={(value) => updateFormData('activityType', value)}
          description="Cryptocurrency and digital asset services"
        />
      </div>

      {showServices && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Service Details
          </h3>
          <p className="text-gray-500 mb-6">
            Select all services that apply to your firm.
          </p>

          {serviceOptions.map((service) => (
            <CheckboxField
              key={service.value}
              label={service.label}
              checked={(formData.services || []).includes(service.value)}
              onChange={() => handleServiceToggle(service.value)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
