/**
 * FinancialInformationStep Component
 * Sixth step of the DFSA onboarding form
 *
 * Features:
 * - Accordion-style field groups for financial data
 * - Proposed capital amount (USD)
 * - Funding sources table
 * - Revenue projections and business model description
 *
 * DFSA Compliance:
 * - Maintains capital adequacy requirements
 * - Includes rule references (GEN Module Rule 3.1.4)
 * - Only visible for Pathways A (Financial Services) and C (Crypto Token)
 */

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { DFSAOnboardingFormData } from '../types'
import { CurrencyInput } from '../components/CurrencyInput'
import { FundingSourceTable } from '../components/FundingSourceTable'
import { FormFieldGroup } from '../components/FormFieldGroup'

export const FinancialInformationStep: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<DFSAOnboardingFormData>()

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Financial Information</h2>
        <p className="text-sm text-gray-600 mt-2">
          Provide details of your proposed capital structure and funding arrangements.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Ref: DFSA Rulebook GEN Module Rule 3.1.4 - Capital Adequacy Requirements)
        </p>
      </div>

      {/* Capital Requirements Group */}
      <FormFieldGroup
        title="Capital Requirements"
        groupId="capital-requirements"
        fieldNames={['proposedCapitalUSD']}
        isRequired={true}
        helpText="The DFSA requires minimum capital levels based on the type of licence and proposed activities. Capital requirements are subject to ongoing monitoring. (Ref: DFSA Rulebook GEN Module Rule 3.1.4)"
        fields={
          <div className="space-y-4">
            <CurrencyInput
              name="proposedCapitalUSD"
              label="Total Proposed Capital (USD)"
              required={true}
              placeholder="0.00"
              helpText="The total amount of capital you propose to commit to the licensed activities."
              min={0}
            />

            {/* Minimum Capital Information Box */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-amber-800">Minimum Capital Requirements</h4>
                  <p className="mt-1 text-sm text-amber-800">
                    Ensure your proposed capital meets or exceeds the applicable minimum for your
                    licence category:
                  </p>
                  <ul className="mt-2 text-sm text-amber-800 list-disc pl-5 space-y-1">
                    <li>Category 1: USD 10,000</li>
                    <li>Category 2: USD 50,000</li>
                    <li>Category 3: USD 500,000</li>
                    <li>Category 4: USD 2,000,000</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        }
      />

      {/* Funding Sources Group */}
      <FormFieldGroup
        title="Funding Sources"
        groupId="funding-sources"
        fieldNames={['fundingSources']}
        isRequired={true}
        helpText="Specify all sources of funding for your proposed capital. The total funding amount should equal or exceed your proposed capital. You may be required to provide supporting documentation including bank references or proof of funding commitments."
        fields={
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Add each source of funding below. The total funding amount should match your proposed
              capital.
            </p>
            <FundingSourceTable />
          </div>
        }
      />

      {/* Revenue Projections & Business Model Group */}
      <FormFieldGroup
        title="Revenue Projections & Business Model"
        groupId="revenue-projections"
        fieldNames={[
          'projectedRevenueYear1',
          'projectedRevenueYear2',
          'projectedRevenueYear3',
          'businessModelDescription',
        ]}
        isRequired={false}
        helpText="Provide revenue projections and describe your business model. This information assists in assessing the sustainability of your business model and may be used to determine ongoing capital requirements."
        fields={
          <div className="space-y-6">
            {/* Revenue Projections */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Revenue Projections{' '}
                <span className="text-gray-400 text-xs font-normal">(optional)</span>
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Provide your revenue projections for the first three years of operation.
              </p>

              <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                {/* Year 1 */}
                <CurrencyInput
                  name="projectedRevenueYear1"
                  label="Year 1 Projected Revenue (USD)"
                  required={false}
                  placeholder="0.00"
                />

                {/* Year 2 */}
                <CurrencyInput
                  name="projectedRevenueYear2"
                  label="Year 2 Projected Revenue (USD)"
                  required={false}
                  placeholder="0.00"
                />

                {/* Year 3 */}
                <CurrencyInput
                  name="projectedRevenueYear3"
                  label="Year 3 Projected Revenue (USD)"
                  required={false}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Business Model Description */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Business Model</h4>
              <p className="text-sm text-gray-600 mb-4">
                Describe how your entity will generate revenue and sustain operations.
              </p>

              <Controller
                name="businessModelDescription"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="businessModelDescription"
                    rows={6}
                    placeholder="Describe your revenue model, target clients, pricing structure, and key business activities"
                    className={`
                      w-full px-3 py-2 border rounded-md text-sm
                      focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                      resize-none
                      ${errors.businessModelDescription ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                    `}
                  />
                )}
              />
              {errors.businessModelDescription && (
                <p className="text-xs text-red-500 mt-1">{errors.businessModelDescription.message}</p>
              )}
            </div>

            {/* Information Note */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    Financial information provided will be reviewed as part of the DFSA's assessment of
                    your financial resources and solvency. Supporting documentation may be required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
      />

      {/* Regulatory Note */}
      <div className="text-xs text-gray-500 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
        <p>
          <strong>Note:</strong> Capital requirements are subject to ongoing monitoring. Licence
          holders must maintain minimum capital levels throughout the duration of the licence as
          specified in DFSA Rulebook GEN Module Rule 3.1.4.
        </p>
      </div>
    </div>
  )
}
