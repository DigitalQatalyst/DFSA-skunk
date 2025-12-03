/**
 * EntityStructureStep Component
 * Third step of the DFSA onboarding form
 *
 * Features:
 * - Entity type selection
 * - Conditional "other" entity type field
 * - Parent company information (optional)
 * - Group structure details
 *
 * All pathways see this step
 */

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { DFSAOnboardingFormData } from '../types'

export const EntityStructureStep: React.FC = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<DFSAOnboardingFormData>()

  const entityType = watch('entityType')
  const hasParentCompany = watch('hasParentCompany')

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Entity Structure</h2>
        <p className="text-sm text-gray-600 mt-2">
          Provide information about your entity type and corporate structure.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Ref: DFSA Rulebook GEN Module Rule 2.2.6 - Entity Structure Disclosure)
        </p>
      </div>

      {/* Entity Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Entity Type <span className="text-red-500">*</span>
        </label>
        <Controller
          name="entityType"
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              {[
                { value: 'DIFC_INCORPORATION', label: 'DIFC Incorporation' },
                { value: 'OTHER_JURISDICTION', label: 'Other Jurisdiction (Foreign Entity)' },
                { value: 'OTHER', label: 'Other (Please specify)' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer
                    transition-colors
                    ${
                      field.value === option.value
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    {...field}
                    value={option.value}
                    checked={field.value === option.value}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.entityType && (
          <p className="text-xs text-red-500 mt-2">{errors.entityType.message}</p>
        )}
      </div>

      {/* Entity Type Other (conditional) */}
      {entityType === 'OTHER' && (
        <div>
          <label htmlFor="entityTypeOther" className="block text-sm font-medium text-gray-700 mb-1">
            Specify Entity Type <span className="text-red-500">*</span>
          </label>
          <Controller
            name="entityTypeOther"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="entityTypeOther"
                type="text"
                placeholder="Describe your entity type"
                className={`
                  w-full px-3 py-2 border rounded-md text-sm
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.entityTypeOther ? 'border-red-500' : 'border-gray-300'}
                `}
              />
            )}
          />
          {errors.entityTypeOther && (
            <p className="text-xs text-red-500 mt-1">{errors.entityTypeOther.message}</p>
          )}
        </div>
      )}

      {/* Parent Company */}
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Does this entity have a parent company?
        </label>
        <Controller
          name="hasParentCompany"
          control={control}
          render={({ field }) => (
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...field}
                  value="true"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...field}
                  value="false"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          )}
        />
      </div>

      {/* Parent Company Details (conditional) */}
      {hasParentCompany && (
        <div className="space-y-6 pl-6 border-l-4 border-dfsa-gold-500">
          {/* Parent Company Name */}
          <div>
            <label
              htmlFor="parentCompanyName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Parent Company Name <span className="text-red-500">*</span>
            </label>
            <Controller
              name="parentCompanyName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="parentCompanyName"
                  type="text"
                  placeholder="Full legal name of parent company"
                  className={`
                    w-full px-3 py-2 border rounded-md text-sm
                    focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.parentCompanyName ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
              )}
            />
            {errors.parentCompanyName && (
              <p className="text-xs text-red-500 mt-1">{errors.parentCompanyName.message}</p>
            )}
          </div>

          {/* Parent Company Jurisdiction */}
          <div>
            <label
              htmlFor="parentCompanyJurisdiction"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Parent Company Jurisdiction <span className="text-red-500">*</span>
            </label>
            <Controller
              name="parentCompanyJurisdiction"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="parentCompanyJurisdiction"
                  type="text"
                  placeholder="Country of incorporation"
                  className={`
                    w-full px-3 py-2 border rounded-md text-sm
                    focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.parentCompanyJurisdiction ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
              )}
            />
            {errors.parentCompanyJurisdiction && (
              <p className="text-xs text-red-500 mt-1">
                {errors.parentCompanyJurisdiction.message}
              </p>
            )}
          </div>

          {/* Ultimate Parent Company */}
          <div>
            <label
              htmlFor="ultimateParentCompany"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ultimate Parent Company <span className="text-gray-400 text-xs">(if different)</span>
            </label>
            <Controller
              name="ultimateParentCompany"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="ultimateParentCompany"
                  type="text"
                  placeholder="Name of ultimate parent entity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              )}
            />
            <p className="text-xs text-gray-500 mt-1">
              The ultimate controlling entity at the top of the corporate structure.
            </p>
          </div>
        </div>
      )}

      {/* Group Structure Description */}
      <div className="pt-4 border-t border-gray-200">
        <label
          htmlFor="groupStructureDescription"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Group Structure Description{' '}
          <span className="text-gray-400 text-xs">(if applicable)</span>
        </label>
        <Controller
          name="groupStructureDescription"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              id="groupStructureDescription"
              rows={4}
              placeholder="Describe the corporate group structure, including subsidiaries and related entities"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Provide an overview of how your entity fits within a larger corporate group, if
          applicable.
        </p>
      </div>

      {/* Information Note */}
      <div className="bg-dfsa-teal-50 border-l-4 border-dfsa-teal-600 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-dfsa-teal-600" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-dfsa-teal-800">
              You will be required to upload a group structure diagram in the documents section if
              your entity is part of a corporate group.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
