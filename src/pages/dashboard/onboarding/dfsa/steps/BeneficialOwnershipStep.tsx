/**
 * BeneficialOwnershipStep Component
 * Fifth step of the DFSA onboarding form
 *
 * Features:
 * - Beneficial ownership table with dynamic rows
 * - 100% total control validation
 * - Max 15 beneficial owners
 * - Control type selection (direct, indirect, voting rights)
 *
 * Only visible for Pathways A (Financial Services) and C (Crypto Token)
 */

import React from 'react'
import { BeneficialOwnerTable } from '../components/BeneficialOwnerTable'

export const BeneficialOwnershipStep: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Beneficial Ownership</h2>
        <p className="text-sm text-gray-600 mt-2">
          Identify all beneficial owners with 25% or more control. Total control must equal 100%.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Ref: DFSA Rulebook GEN Module Rule 2.2.3 - Beneficial Ownership Disclosure Requirements)
        </p>
      </div>

      {/* Important Information */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Beneficial Ownership Definition
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p className="mb-2">
                A beneficial owner is an individual who ultimately owns or controls the entity,
                either:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Direct ownership:</strong> Holds 25% or more of the shares or voting
                  rights
                </li>
                <li>
                  <strong>Indirect ownership:</strong> Controls 25% or more through other entities
                  or arrangements
                </li>
                <li>
                  <strong>Other control:</strong> Exercises control through other means (e.g., veto
                  rights, board appointments)
                </li>
              </ul>
              <p className="mt-2">
                <strong>Note:</strong> If no individual meets these thresholds, identify the senior
                managing officials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Beneficial Owner Table */}
      <BeneficialOwnerTable />

      {/* Help Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Guidance Notes</h3>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-medium text-gray-700">Who qualifies as a beneficial owner?</dt>
            <dd className="text-gray-600 mt-0.5">
              Only natural persons (individuals) can be beneficial owners. If the immediate
              shareholder is a corporate entity, you must identify the natural persons who
              ultimately control that entity.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Control Type - Direct</dt>
            <dd className="text-gray-600 mt-0.5">
              The individual directly holds shares or voting rights in the applicant entity.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Control Type - Indirect</dt>
            <dd className="text-gray-600 mt-0.5">
              The individual holds control through one or more intermediate entities. For example,
              Person A owns 100% of Company B, which owns 50% of the applicant entity. Person A has
              50% indirect control.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Control Type - Voting Rights</dt>
            <dd className="text-gray-600 mt-0.5">
              The individual controls voting rights through special arrangements, such as voting
              agreements, proxies, or nominee arrangements, even if they do not directly hold
              shares.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Percentage of Control</dt>
            <dd className="text-gray-600 mt-0.5">
              Express as a percentage of total control (0-100%). For complex ownership structures,
              calculate the ultimate effective control percentage. The total across all beneficial
              owners must equal 100%.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Date of Birth</dt>
            <dd className="text-gray-600 mt-0.5">
              Required for identity verification purposes. Must match official identification
              documents.
            </dd>
          </div>
        </dl>
      </div>

      {/* Additional Requirements */}
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
            <h3 className="text-sm font-medium text-dfsa-teal-800">Document Requirements</h3>
            <p className="mt-1 text-sm text-dfsa-teal-800">
              You will be required to provide identification documents (passport or national ID) for
              all beneficial owners in the documents section. If beneficial ownership is exercised
              through complex structures, a beneficial ownership diagram may be requested.
            </p>
          </div>
        </div>
      </div>

      {/* Regulatory Note */}
      <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
        <p>
          <strong>Note:</strong> Beneficial ownership information is subject to verification and may
          be shared with relevant authorities in accordance with anti-money laundering regulations.
          Providing false or misleading information is a serious offense.
        </p>
      </div>
    </div>
  )
}
