import React from 'react'
import { StepProps } from '../types'
import { InputField } from '../components/InputField'
import { RadioField } from '../components/RadioField'

export const RoleContactStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const isConsultant = formData.applicantRole === 'professional_advisor'

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Applicant Role
      </h2>

      <p className="text-gray-500 mb-6">
        Please select your role in this application.
      </p>

      <div className="mb-8">
        <RadioField
          label="I am applying for my own firm"
          value="own_firm"
          checked={formData.applicantRole === 'own_firm'}
          onChange={(value) => updateFormData('applicantRole', value)}
        />
        <RadioField
          label="I am a professional advisor (consultant)"
          value="professional_advisor"
          checked={formData.applicantRole === 'professional_advisor'}
          onChange={(value) => updateFormData('applicantRole', value)}
        />
      </div>

      {isConsultant && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Firm Contact Information
          </h3>
          <p className="text-gray-500 mb-6">
            Please provide the contact details for the firm you are representing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              value={formData.firmContactFirstName}
              onChange={(value) => updateFormData('firmContactFirstName', value)}
              placeholder="Enter first name (e.g., John)"
              required
            />
            <InputField
              label="Last Name"
              value={formData.firmContactLastName}
              onChange={(value) => updateFormData('firmContactLastName', value)}
              placeholder="Enter last name (e.g., Doe)"
              required
            />
            <InputField
              label="Email Address"
              value={formData.firmContactEmail}
              onChange={(value) => updateFormData('firmContactEmail', value)}
              placeholder="Enter email (e.g., john.doe@company.com)"
              type="email"
              required
            />
            <InputField
              label="Phone Number"
              value={formData.firmContactPhone}
              onChange={(value) => updateFormData('firmContactPhone', value)}
              placeholder="Enter phone (e.g., +971 50 123 4567)"
              type="tel"
              required
            />
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Contact Information
      </h3>
      <p className="text-gray-500 mb-6">
        Please provide your contact details.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="First Name"
          value={formData.contactFirstName}
          onChange={(value) => updateFormData('contactFirstName', value)}
          placeholder="Enter first name (e.g., John)"
          required
        />
        <InputField
          label="Last Name"
          value={formData.contactLastName}
          onChange={(value) => updateFormData('contactLastName', value)}
          placeholder="Enter last name (e.g., Doe)"
          required
        />
        <InputField
          label="Email Address"
          value={formData.contactEmail}
          onChange={(value) => updateFormData('contactEmail', value)}
          placeholder="Enter email (e.g., john.doe@company.com)"
          type="email"
          required
        />
        <InputField
          label="Phone Number"
          value={formData.contactPhone}
          onChange={(value) => updateFormData('contactPhone', value)}
          placeholder="Enter phone (e.g., +971 50 123 4567)"
          type="tel"
          required
        />
      </div>
    </div>
  )
}
