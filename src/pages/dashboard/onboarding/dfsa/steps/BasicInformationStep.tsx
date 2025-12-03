/**
 * BasicInformationStep Component
 * Second step of the DFSA onboarding form
 *
 * Features:
 * - Legal entity name
 * - Incorporation jurisdiction and date
 * - Registration number
 * - Business address
 * - Conditional mailing address
 * - "Same as business address" checkbox
 *
 * All pathways see this step
 */

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { DFSAOnboardingFormData } from '../types'
import { AddressForm } from '../components/AddressForm'

export const BasicInformationStep: React.FC = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DFSAOnboardingFormData>()

  const sameAsBusinessAddress = watch('sameAsBusinessAddress')
  const businessAddress = watch('businessAddress')

  // Handle "same as business address" toggle
  const handleSameAddressChange = (checked: boolean) => {
    setValue('sameAsBusinessAddress', checked)

    if (checked && businessAddress) {
      // Copy business address to mailing address
      setValue('mailingAddress', { ...businessAddress })
    } else if (!checked) {
      // Clear mailing address when unchecked
      setValue('mailingAddress', {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      })
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-sm text-gray-600 mt-2">
          Provide the legal entity details and registration information.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Ref: DFSA Rulebook GEN Module Rule 2.2.5 - Entity Registration)
        </p>
      </div>

      {/* Legal Entity Name */}
      <div>
        <label htmlFor="legalEntityName" className="block text-sm font-medium text-gray-700 mb-1">
          Legal Entity Name <span className="text-red-500">*</span>
        </label>
        <Controller
          name="legalEntityName"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id="legalEntityName"
              type="text"
              placeholder="Full legal name as registered"
              className={`
                w-full px-3 py-2 border rounded-md text-sm
                focus:ring-2 focus:ring-primary focus:border-transparent
                ${errors.legalEntityName ? 'border-red-500' : 'border-gray-300'}
              `}
            />
          )}
        />
        {errors.legalEntityName && (
          <p className="text-xs text-red-500 mt-1">{errors.legalEntityName.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Enter the exact legal name as it appears on your certificate of incorporation.
        </p>
      </div>

      {/* Incorporation Jurisdiction and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Incorporation Jurisdiction */}
        <div>
          <label
            htmlFor="incorporationJurisdiction"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Jurisdiction of Incorporation <span className="text-red-500">*</span>
          </label>
          <Controller
            name="incorporationJurisdiction"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="incorporationJurisdiction"
                type="text"
                placeholder="e.g., DIFC, Cayman Islands"
                className={`
                  w-full px-3 py-2 border rounded-md text-sm
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.incorporationJurisdiction ? 'border-red-500' : 'border-gray-300'}
                `}
              />
            )}
          />
          {errors.incorporationJurisdiction && (
            <p className="text-xs text-red-500 mt-1">{errors.incorporationJurisdiction.message}</p>
          )}
        </div>

        {/* Incorporation Date */}
        <div>
          <label
            htmlFor="incorporationDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date of Incorporation <span className="text-red-500">*</span>
          </label>
          <Controller
            name="incorporationDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="incorporationDate"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                className={`
                  w-full px-3 py-2 border rounded-md text-sm
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.incorporationDate ? 'border-red-500' : 'border-gray-300'}
                `}
              />
            )}
          />
          {errors.incorporationDate && (
            <p className="text-xs text-red-500 mt-1">{errors.incorporationDate.message}</p>
          )}
        </div>
      </div>

      {/* Registration Number */}
      <div>
        <label
          htmlFor="registrationNumber"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Registration Number <span className="text-red-500">*</span>
        </label>
        <Controller
          name="registrationNumber"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id="registrationNumber"
              type="text"
              placeholder="Company registration number"
              className={`
                w-full px-3 py-2 border rounded-md text-sm
                focus:ring-2 focus:ring-primary focus:border-transparent
                ${errors.registrationNumber ? 'border-red-500' : 'border-gray-300'}
              `}
            />
          )}
        />
        {errors.registrationNumber && (
          <p className="text-xs text-red-500 mt-1">{errors.registrationNumber.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          The unique registration or company number assigned by the incorporating authority.
        </p>
      </div>

      {/* Business Address */}
      <div className="pt-4">
        <AddressForm
          fieldPrefix="businessAddress"
          label="Business Address"
          helpText="The principal place of business for the entity."
        />
      </div>

      {/* Same as Business Address Checkbox */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-start gap-3">
          <Controller
            name="sameAsBusinessAddress"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                id="sameAsBusinessAddress"
                checked={field.value || false}
                onChange={(e) => {
                  field.onChange(e.target.checked)
                  handleSameAddressChange(e.target.checked)
                }}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
            )}
          />
          <label
            htmlFor="sameAsBusinessAddress"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Mailing address is the same as business address
          </label>
        </div>
      </div>

      {/* Mailing Address (conditional) */}
      {!sameAsBusinessAddress && (
        <div className="pt-4">
          <AddressForm
            fieldPrefix="mailingAddress"
            label="Mailing Address"
            helpText="The address where official correspondence should be sent."
          />
        </div>
      )}

      {/* Information Note */}
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">
              Ensure that all information matches your official incorporation documents. Any
              discrepancies may delay the processing of your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
