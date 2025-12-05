/**
 * BasicInformationStep Component
 * Second step of the DFSA onboarding form
 *
 * Features:
 * - Accordion-style field groups for better organization
 * - Completion tracking per group
 * - Legal entity name, jurisdiction, and incorporation details
 * - Business and mailing address management
 * - Conditional mailing address based on "same as business" toggle
 *
 * DFSA Compliance:
 * - Maintains formal language
 * - Includes rule references
 * - All pathways see this step
 */

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { DFSAOnboardingFormData } from '../types'
import { AddressForm } from '../components/AddressForm'
import { FormFieldGroup } from '../components/FormFieldGroup'

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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Basic Information</h2>
        <p className="text-sm text-gray-600 mt-2">
          Provide the legal entity details and registration information.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Ref: DFSA Rulebook GEN Module Rule 2.2.5 - Entity Registration)
        </p>
      </div>

      {/* Entity Details Group */}
      <FormFieldGroup
        title="Entity Details"
        groupId="entity-details"
        fieldNames={[
          'legalEntityName',
          'incorporationJurisdiction',
          'incorporationDate',
          'registrationNumber',
        ]}
        isRequired={true}
        helpText="Provide the legal entity details as they appear on your certificate of incorporation. Ensure all information matches your official incorporation documents. Any discrepancies may delay the processing of your application. (Ref: DFSA Rulebook GEN Module Rule 2.2.5)"
        fields={
          <div className="space-y-4">
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
                      w-full px-3 py-2 border rounded-md text-sm min-h-[44px]
                      focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                      ${errors.legalEntityName ? 'border-red-500 bg-red-50' : 'border-gray-300'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        w-full px-3 py-2 border rounded-md text-sm min-h-[44px]
                        focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                        ${errors.incorporationJurisdiction ? 'border-red-500 bg-red-50' : 'border-gray-300'}
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
                        w-full px-3 py-2 border rounded-md text-sm min-h-[44px]
                        focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                        ${errors.incorporationDate ? 'border-red-500 bg-red-50' : 'border-gray-300'}
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
                      w-full px-3 py-2 border rounded-md text-sm min-h-[44px]
                      focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                      ${errors.registrationNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'}
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
          </div>
        }
      />

      {/* Business Address Group */}
      <FormFieldGroup
        title="Business Address"
        groupId="business-address"
        fieldNames={[
          'businessAddress.line1',
          'businessAddress.city',
          'businessAddress.state',
          'businessAddress.postalCode',
          'businessAddress.country',
        ]}
        isRequired={true}
        helpText="The principal place of business for the entity. This address will be used for official correspondence from the DFSA."
        fields={
          <AddressForm
            fieldPrefix="businessAddress"
            label="Business Address"
            helpText="Provide the complete physical address where your business operations are conducted."
          />
        }
      />

      {/* Mailing Address Group */}
      <FormFieldGroup
        title="Mailing Address"
        groupId="mailing-address"
        fieldNames={
          sameAsBusinessAddress
            ? []
            : [
                'mailingAddress.line1',
                'mailingAddress.city',
                'mailingAddress.state',
                'mailingAddress.postalCode',
                'mailingAddress.country',
              ]
        }
        isRequired={false}
        helpText="The address where official correspondence should be sent, if different from the business address."
        fields={
          <div className="space-y-4">
            {/* Same as Business Address Checkbox */}
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
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
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#9B1823] focus:ring-2 focus:ring-[#9B1823]"
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

            {/* Mailing Address Form (conditional) */}
            {!sameAsBusinessAddress && (
              <div className="pt-2">
                <AddressForm
                  fieldPrefix="mailingAddress"
                  label="Mailing Address"
                  helpText="Provide the complete address where you wish to receive official correspondence."
                />
              </div>
            )}
          </div>
        }
      />
    </div>
  )
}
