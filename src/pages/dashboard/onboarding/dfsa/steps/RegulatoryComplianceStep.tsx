/**
 * RegulatoryComplianceStep Component
 * Seventh step of the DFSA onboarding form
 *
 * Features:
 * - Current regulation status
 * - Regulator details (conditional)
 * - Compliance Officer details (Pathways A, C)
 * - MLRO details (Pathway A only)
 *
 * Visibility:
 * - Pathway A (Financial Services): Always shown, MLRO required
 * - Pathway B (DNFBP): Optional
 * - Pathway C (Crypto Token): Always shown, Compliance Officer required
 * - Pathways D, E: Hidden
 */

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { DFSAOnboardingFormData } from '../types'
import { usePathwayConfig } from '../hooks/usePathwayConfig'
import { FormFieldGroup } from '../components/FormFieldGroup'

export const RegulatoryComplianceStep: React.FC = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<DFSAOnboardingFormData>()

  const activityType = watch('activityType')
  const currentlyRegulated = watch('currentlyRegulated')

  const { features } = usePathwayConfig(activityType)

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Regulatory & Compliance</h2>
        <p className="text-sm text-gray-600 mt-2">
          Provide information about existing regulatory relationships and key compliance personnel.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Ref: DFSA Rulebook GEN Module Rules 5.3.1 - 5.3.7 - Compliance and MLRO Requirements)
        </p>
      </div>

      {/* Regulatory Status Group */}
      <FormFieldGroup
        title="Regulatory Status"
        groupId="regulatory-status"
        fieldNames={
          currentlyRegulated
            ? ['currentlyRegulated', 'regulatorName', 'regulatorLicenceNumber', 'regulatedActivities']
            : ['currentlyRegulated']
        }
        isRequired={true}
        helpText="Disclose existing regulatory relationships. If currently regulated, provide full details of the regulator, licence number, and regulated activities. (Ref: DFSA Rulebook GEN Module Rules 5.3.1 - 5.3.7)"
        fields={
          <div className="space-y-4">
            {/* Current Regulation Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Is this entity currently regulated by any financial services regulator?{' '}
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="currentlyRegulated"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        {...field}
                        value="true"
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        className="w-4 h-4 text-[#9B1823] border-gray-300 focus:ring-2 focus:ring-[#9B1823]"
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        {...field}
                        value="false"
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                        className="w-4 h-4 text-[#9B1823] border-gray-300 focus:ring-2 focus:ring-[#9B1823]"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                )}
              />
              {errors.currentlyRegulated && (
                <p className="text-xs text-red-500 mt-2">{errors.currentlyRegulated.message}</p>
              )}
            </div>

            {/* Regulator Details (conditional) */}
            {currentlyRegulated && (
              <div className="space-y-4 pl-6 border-l-4 border-[#9B1823] bg-gray-50 p-4 rounded-r-lg">
                {/* Regulator Name */}
                <div>
                  <label htmlFor="regulatorName" className="block text-sm font-medium text-gray-700 mb-1">
                    Regulator Name <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="regulatorName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="regulatorName"
                        type="text"
                        placeholder="Name of the regulatory authority"
                        className={`
                          w-full px-3 py-2 border rounded-md text-sm min-h-[44px]
                          focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                          ${errors.regulatorName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
                        `}
                      />
                    )}
                  />
                  {errors.regulatorName && (
                    <p className="text-xs text-red-500 mt-1">{errors.regulatorName.message}</p>
                  )}
                </div>

                {/* Licence/Registration Number */}
                <div>
                  <label
                    htmlFor="regulatorLicenceNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Licence/Registration Number <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="regulatorLicenceNumber"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="regulatorLicenceNumber"
                        type="text"
                        placeholder="Licence or registration reference"
                        className={`
                          w-full px-3 py-2 border rounded-md text-sm min-h-[44px]
                          focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                          ${errors.regulatorLicenceNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
                        `}
                      />
                    )}
                  />
                  {errors.regulatorLicenceNumber && (
                    <p className="text-xs text-red-500 mt-1">{errors.regulatorLicenceNumber.message}</p>
                  )}
                </div>

                {/* Regulated Activities */}
                <div>
                  <label
                    htmlFor="regulatedActivities"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Regulated Activities <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="regulatedActivities"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        id="regulatedActivities"
                        rows={3}
                        placeholder="Describe the activities for which you are currently licensed"
                        className={`
                          w-full px-3 py-2 border rounded-md text-sm
                          focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                          resize-none
                          ${errors.regulatedActivities ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
                        `}
                      />
                    )}
                  />
                  {errors.regulatedActivities && (
                    <p className="text-xs text-red-500 mt-1">{errors.regulatedActivities.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        }
      />

      {/* Compliance Officer Group (Pathways A, C) */}
      {(features.complianceOfficerRequired || features.mlroRequired) && (
        <FormFieldGroup
          title="Compliance Officer"
          groupId="compliance-officer"
          fieldNames={[
            'complianceOfficerName',
            'complianceOfficerEmail',
            'complianceOfficerQualifications',
          ]}
          isRequired={true}
          helpText="Provide details of the individual who will serve as the Compliance Officer. This person is responsible for overseeing compliance with regulatory requirements. (Ref: DFSA Rulebook GEN Module Rules 5.3.1 - 5.3.7)"
          fields={
            <div className="space-y-4">
              {/* Compliance Officer Name */}
              <div>
                <label
                  htmlFor="complianceOfficerName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="complianceOfficerName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="complianceOfficerName"
                      type="text"
                      placeholder="Full legal name"
                      className={`
                        w-full px-3 py-2 border rounded-md text-sm min-h-[44px]
                        focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                        ${errors.complianceOfficerName ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                      `}
                    />
                  )}
                />
                {errors.complianceOfficerName && (
                  <p className="text-xs text-red-500 mt-1">{errors.complianceOfficerName.message}</p>
                )}
              </div>

              {/* Compliance Officer Email */}
              <div>
                <label
                  htmlFor="complianceOfficerEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="complianceOfficerEmail"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="complianceOfficerEmail"
                      type="email"
                      placeholder="email@example.com"
                      className={`
                        w-full px-3 py-2 border rounded-md text-sm min-h-[44px]
                        focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                        ${errors.complianceOfficerEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                      `}
                    />
                  )}
                />
                {errors.complianceOfficerEmail && (
                  <p className="text-xs text-red-500 mt-1">{errors.complianceOfficerEmail.message}</p>
                )}
              </div>

              {/* Compliance Officer Qualifications */}
              <div>
                <label
                  htmlFor="complianceOfficerQualifications"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Qualifications & Experience <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="complianceOfficerQualifications"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      id="complianceOfficerQualifications"
                      rows={4}
                      placeholder="Summarize relevant qualifications, certifications, and compliance experience"
                      className={`
                        w-full px-3 py-2 border rounded-md text-sm
                        focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                        resize-none
                        ${errors.complianceOfficerQualifications ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                      `}
                    />
                  )}
                />
                {errors.complianceOfficerQualifications && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.complianceOfficerQualifications.message}
                  </p>
                )}
              </div>
            </div>
          }
        />
      )}

      {/* MLRO Group (Pathway A only) */}
      {features.mlroRequired && (
        <FormFieldGroup
          title="Money Laundering Reporting Officer (MLRO)"
          groupId="mlro"
          fieldNames={['mlroName', 'mlroEmail', 'mlroQualifications']}
          isRequired={true}
          helpText="Financial services entities must appoint an MLRO responsible for AML/CFT compliance, suspicious activity reporting, and liaison with the DFSA and other authorities. (Ref: DFSA Rulebook GEN Module Rules 5.3.1 - 5.3.7)"
          fields={
            <div className="space-y-4">
              {/* MLRO Information Box */}
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
                      The MLRO must possess appropriate AML/CFT qualifications and experience. The
                      individual will serve as the primary contact for suspicious activity reports and
                      regulatory liaison.
                    </p>
                  </div>
                </div>
              </div>

              {/* MLRO Name */}
              <div>
                <label htmlFor="mlroName" className="block text-sm font-medium text-gray-700 mb-1">
                  MLRO Full Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="mlroName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="mlroName"
                      type="text"
                      placeholder="Full legal name"
                      className={`
                        w-full px-3 py-2 border rounded-md text-sm min-h-[44px]
                        focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                        ${errors.mlroName ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                      `}
                    />
                  )}
                />
                {errors.mlroName && (
                  <p className="text-xs text-red-500 mt-1">{errors.mlroName.message}</p>
                )}
              </div>

              {/* MLRO Email */}
              <div>
                <label htmlFor="mlroEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  MLRO Email Address <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="mlroEmail"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="mlroEmail"
                      type="email"
                      placeholder="email@example.com"
                      className={`
                        w-full px-3 py-2 border rounded-md text-sm min-h-[44px]
                        focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                        ${errors.mlroEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                      `}
                    />
                  )}
                />
                {errors.mlroEmail && (
                  <p className="text-xs text-red-500 mt-1">{errors.mlroEmail.message}</p>
                )}
              </div>

              {/* MLRO Qualifications */}
              <div>
                <label
                  htmlFor="mlroQualifications"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  MLRO Qualifications & Experience <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="mlroQualifications"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      id="mlroQualifications"
                      rows={4}
                      placeholder="Summarize AML/CFT certifications, training, and relevant experience"
                      className={`
                        w-full px-3 py-2 border rounded-md text-sm
                        focus:ring-2 focus:ring-[#9B1823] focus:border-transparent
                        resize-none
                        ${errors.mlroQualifications ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                      `}
                    />
                  )}
                />
                {errors.mlroQualifications && (
                  <p className="text-xs text-red-500 mt-1">{errors.mlroQualifications.message}</p>
                )}
              </div>
            </div>
          }
        />
      )}

      {/* Information Note */}
      <div className="text-xs text-gray-500 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
        <p>
          <strong>Note:</strong> All individuals named as Compliance Officers or MLROs must undergo
          fit and proper assessments. CVs, reference letters, and certification documentation will
          be required in the documents section.
        </p>
      </div>
    </div>
  )
}
