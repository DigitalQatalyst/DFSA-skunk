/**
 * WelcomeStep Component
 * First step of the DFSA onboarding form
 *
 * Features:
 * - Display pathway information
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
import { ClipboardList, Clock, Shield, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'

export const WelcomeStep: React.FC = () => {
  const { watch } = useFormContext<DFSAOnboardingFormData>()

  const activityType = watch('activityType')
  const suggestedCompanyName = watch('suggestedCompanyName')
  const contactName = watch('contactName')
  const contactEmail = watch('contactEmail')

  const { config, questionCount, estimatedMinutes } = usePathwayConfig(activityType)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#b82933] via-[#9a2028] to-[#7d1a20] p-8 md:p-12 shadow-xl">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {config.name} Application
          </h1>
          {/* <p className="text-2xl md:text-3xl font-semibold text-[#a39143] drop-shadow-sm">
            {config.name}
          </p> */}
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto pt-2">
            Complete your application for authorization under the DFSA Regulatory Framework
          </p>
        </div>
      </div>

      {/* Application Overview Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-[#b82933] rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b82933] to-[#8a1f25] flex items-center justify-center shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Application Overview</h3>
                <p className="text-sm text-gray-700 mt-1">
                  This application form is specific to Pathway {config.pathway} - {config.name}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:scale-[1.02]">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#b82933]/10 to-[#a39143]/10 rounded-lg flex items-center justify-center border border-[#b82933]/20">
                    <ClipboardList className="w-6 h-6 text-[#b82933]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Questions</p>
                    <p className="text-2xl font-bold text-[#a39143]">{questionCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:scale-[1.02]">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#b82933]/10 to-[#a39143]/10 rounded-lg flex items-center justify-center border border-[#b82933]/20">
                    <Clock className="w-6 h-6 text-[#b82933]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Estimated Time</p>
                    <p className="text-2xl font-bold text-[#a39143]">{estimatedMinutes} mins</p>
                  </div>
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

      {/* Before You Begin Section */}
      <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-200/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b82933] to-[#8a1f25] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          Before You Begin
        </h3>
        <ul className="space-y-3">
          <li className="group flex items-start gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-amber-50/50 hover:scale-[1.01]">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#b82933]/10 flex items-center justify-center mt-0.5 group-hover:bg-[#b82933]/20 transition-colors">
              <Clock className="w-4 h-4 text-[#b82933]" />
            </div>
            <span className="text-sm text-gray-700 leading-relaxed">
              Your progress will be automatically saved every 60 seconds. You may close and resume
              this application at any time within 30 days.
            </span>
          </li>
          <li className="group flex items-start gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-amber-50/50 hover:scale-[1.01]">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#b82933]/10 flex items-center justify-center mt-0.5 group-hover:bg-[#b82933]/20 transition-colors">
              <AlertCircle className="w-4 h-4 text-[#b82933]" />
            </div>
            <span className="text-sm text-gray-700 leading-relaxed">
              All fields marked with an asterisk (<span className="text-[#b82933] font-semibold">*</span>) are
              required.
            </span>
          </li>
          <li className="group flex items-start gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-amber-50/50 hover:scale-[1.01]">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#b82933]/10 flex items-center justify-center mt-0.5 group-hover:bg-[#b82933]/20 transition-colors">
              <FileText className="w-4 h-4 text-[#b82933]" />
            </div>
            <span className="text-sm text-gray-700 leading-relaxed">
              Ensure you have all necessary documentation prepared, including certificates of
              incorporation, business plans, and identification documents.
            </span>
          </li>
          <li className="group flex items-start gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-amber-50/50 hover:scale-[1.01]">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#b82933]/10 flex items-center justify-center mt-0.5 group-hover:bg-[#b82933]/20 transition-colors">
              <Shield className="w-4 h-4 text-[#b82933]" />
            </div>
            <span className="text-sm text-gray-700 leading-relaxed">
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
