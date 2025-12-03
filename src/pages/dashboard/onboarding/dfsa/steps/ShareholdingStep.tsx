/**
 * ShareholdingStep Component
 * Fourth step of the DFSA onboarding form
 *
 * Features:
 * - Shareholding table with dynamic rows
 * - 100% total validation
 * - Max 15 shareholders
 *
 * Only visible for Pathways A (Financial Services) and C (Crypto Token)
 */

import React from 'react'
import { ShareholderTable } from '../components/ShareholderTable'

export const ShareholdingStep: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Shareholding Structure</h2>
        <p className="text-sm text-gray-600 mt-2">
          Provide details of all shareholders and their ownership percentages. Total ownership must
          equal 100%.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Ref: DFSA Rulebook GEN Module Rule 2.2.2 - Shareholding Disclosure Requirements)
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
            <h3 className="text-sm font-medium text-yellow-800">Important Requirements</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>All shareholders must be listed, regardless of ownership percentage</li>
                <li>Total ownership percentage must equal exactly 100%</li>
                <li>Provide accurate identification details for each shareholder</li>
                <li>
                  Shareholders holding 25% or more will require additional beneficial ownership
                  disclosure
                </li>
                <li>Corporate shareholders should be identified by their legal entity name</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Shareholder Table */}
      <ShareholderTable />

      {/* Help Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Guidance Notes</h3>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-medium text-gray-700">Name</dt>
            <dd className="text-gray-600 mt-0.5">
              Full legal name of the shareholder. For individual shareholders, use the name as it
              appears on their passport or national ID. For corporate shareholders, use the full
              registered name.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Nationality</dt>
            <dd className="text-gray-600 mt-0.5">
              For individuals, the country of citizenship. For corporate entities, the jurisdiction
              of incorporation.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">ID Type & Number</dt>
            <dd className="text-gray-600 mt-0.5">
              For individuals, passport or national ID details. For corporate entities, the company
              registration number should be provided.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Ownership Percentage</dt>
            <dd className="text-gray-600 mt-0.5">
              The percentage of issued share capital held by the shareholder. This may include
              direct holdings and indirect holdings through other entities. Decimal values up to two
              places are permitted (e.g., 33.33%).
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Date Acquired</dt>
            <dd className="text-gray-600 mt-0.5">
              The date when the shareholder acquired their current shareholding. If acquired over
              multiple transactions, use the date of the most recent acquisition.
            </dd>
          </div>
        </dl>
      </div>

      {/* Regulatory Note */}
      <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
        <p>
          <strong>Note:</strong> Shareholding structures may be verified against corporate registry
          records. Ensure accuracy to avoid processing delays.
        </p>
      </div>
    </div>
  )
}
