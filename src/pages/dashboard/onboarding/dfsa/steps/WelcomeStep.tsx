/**
 * WelcomeStep Component
 * First step of the DFSA onboarding form
 *
 * Features:
 * - Display pathway information (A/B/C/D/E badge)
 * - Show pre-populated data from sign-up
 * - Display estimated time and question count
 * - Pathway-specific welcome message
 *
 * All pathways see this step
 */

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { DFSAOnboardingFormData } from '../types'
import { usePathwayConfig } from '../hooks/usePathwayConfig'
import { getPathwayBadgeColor } from '../hooks/usePathwayConfig'

export const WelcomeStep: React.FC = () => {
  const { watch } = useFormContext<DFSAOnboardingFormData>()

  const activityType = watch('activityType')
  const suggestedCompanyName = watch('suggestedCompanyName')
  const contactName = watch('contactName')
  const contactEmail = watch('contactEmail')

  const { config, questionCount, estimatedMinutes } = usePathwayConfig(activityType)

  const badgeColor = getPathwayBadgeColor(activityType)

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">DFSA Licence Application</h1>
          <span
            className={`
              inline-flex items-center justify-center
              w-12 h-12 rounded-full text-white font-bold text-xl
              ${badgeColor}
            `}
          >
            {config.pathway}
          </span>
        </div>
        <p className="text-lg text-gray-600">{config.name}</p>
      </div>

      {/* Pathway Information Card */}
      <div className="bg-dfsa-teal-50 border-l-4 border-dfsa-teal-600 p-6 rounded-r-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Application Overview</h3>
              <p className="text-sm text-dfsa-teal-800 mt-1">
                This application form is specific to Pathway {config.pathway} - {config.name}.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Questions</p>
                  <p className="text-xl font-bold text-primary">{questionCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Estimated Time</p>
                  <p className="text-xl font-bold text-primary">{estimatedMinutes} mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-populated Data Card */}
      {suggestedCompanyName && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-green-900">
                Information Pre-populated from Your Enquiry
              </h3>
              <p className="text-sm text-green-800 mt-1">
                The following information has been carried forward from your enquiry form. You can
                review and modify this information in the subsequent steps.
              </p>

              <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-green-700">Company Name</dt>
                  <dd className="mt-1 text-sm font-semibold text-green-900">
                    {suggestedCompanyName}
                  </dd>
                </div>
                {contactName && (
                  <div>
                    <dt className="text-xs font-medium text-green-700">Contact Person</dt>
                    <dd className="mt-1 text-sm font-semibold text-green-900">{contactName}</dd>
                  </div>
                )}
                {contactEmail && (
                  <div>
                    <dt className="text-xs font-medium text-green-700">Email</dt>
                    <dd className="mt-1 text-sm font-semibold text-green-900">{contactEmail}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* Important Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Before You Begin</h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Your progress will be automatically saved every 60 seconds. You may close and resume
              this application at any time within 30 days.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              All fields marked with an asterisk (<span className="text-red-500">*</span>) are
              required.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Ensure you have all necessary documentation prepared, including certificates of
              incorporation, business plans, and identification documents.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Information provided in this application must be accurate and complete. False or
              misleading information may result in application rejection.
            </span>
          </li>
        </ul>
      </div>

      {/* Regulatory Reference */}
      <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
        <p>
          This application is submitted in accordance with the DFSA Rulebook and applicable DIFC
          Laws.
        </p>
        <p className="mt-1">Reference: GEN Module Rules 2.2.1 - 2.2.29</p>
      </div>
    </div>
  )
}
