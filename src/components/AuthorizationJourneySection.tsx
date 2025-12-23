import React from 'react';
import { authorizationSteps } from '../data/dfsa';
import { TimelineVisualization } from './dfsa/TimelineVisualization';
import { FileText, AlertCircle } from 'lucide-react';

/**
 * Authorisation Journey Section
 * Displays the 8-step DFSA authorisation process with interactive timeline
 */
const AuthorizationJourneySection: React.FC = () => {
  return (
    <section className="w-full bg-white py-24 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1E293B] mb-4">
            DFSA Authorisation Application Process
          </h2>

          <p className="text-lg text-[#64748B] max-w-3xl mx-auto mb-6">
            Stages typically involved in preparing and submitting applications to DFSA. Actual requirements and timelines determined by DFSA based on individual circumstances.
          </p>

            {/* Disclaimer */}
            <div className="max-w-4xl mx-auto mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 text-left">
                  <strong>Note:</strong> This represents a typical process. DFSA may request additional information,
                  conduct further assessments, or require different procedures based on the specific application.
                  All decisions regarding authorisation rest with DFSA.
                </p>
              </div>
            </div>

        </div>

        {/* Timeline Visualization */}
        <TimelineVisualization steps={authorizationSteps} />

        {/* Timeline Information by Category */}
        <div className="mt-16 md:mt-20">
          <h3 className="text-2xl font-semibold text-[#1E293B] text-center mb-4">
            Timeline Information by Licence Category
          </h3>
          <p className="text-center text-[#64748B] mb-8 max-w-2xl mx-auto">
            Historical processing times shown below. DFSA determines actual timelines based on application complexity, completeness, and assessment requirements.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Category 4 */}
            <div className="bg-white rounded-lg p-6 border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <h4 className="font-semibold text-[#1E293B]">Category 4</h4>
              </div>
              <div className="text-3xl font-bold text-[#1E3A8A] mb-2">3-4 mo</div>
              <p className="text-sm text-[#64748B]">Advisory Services</p>
              <p className="text-xs text-[#64748B] mt-2">Capital requirement: $10,000 USD per AMEN Module</p>
              <p className="text-xs text-[#64748B] mt-1">Historical range only - DFSA determines actual duration</p>
            </div>

            {/* Category 3 */}
            <div className="bg-white rounded-lg p-6 border-2 border-[#A39161] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#A39161] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-[#1E293B]">Category 3</h4>
                </div>
              </div>
              <div className="text-3xl font-bold text-[#A39161] mb-2">4-6 mo</div>
              <p className="text-sm text-[#64748B]">Investment Services</p>
              <p className="text-xs text-[#64748B] mt-2">Capital requirements vary per AMEN Module (from $50,000)</p>
              <p className="text-xs text-[#64748B] mt-1">Historical range only - DFSA determines actual duration</p>
            </div>

            {/* Categories 1, 2, 5 */}
            <div className="bg-white rounded-lg p-6 border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1,2,5</span>
                </div>
                <h4 className="font-semibold text-[#1E293B]">Categories 1, 2, 5</h4>
              </div>
              <div className="text-3xl font-bold text-[#1E3A8A] mb-2">6-12 mo</div>
              <p className="text-sm text-[#64748B]">Banking, Principal, Islamic</p>
              <p className="text-xs text-[#64748B] mt-2">Higher capital requirements per AMEN Module (from $1M)</p>
              <p className="text-xs text-[#64748B] mt-1">Historical range only - DFSA determines actual duration</p>
            </div>
          </div>
        </div>

        {/* Information Request CTA */}
        <div className="mt-16 text-center">
          <div className="bg-[#F8FAFC] rounded-lg p-8 md:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-[#1E293B] mb-4">
              Request Information About Application Requirements
            </h3>
            <p className="text-[#64748B] mb-6">
              Submit an information request to receive details about documentation requirements and procedures for your intended financial services activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact#consultation"
                className="px-8 py-3 bg-[#1E3A8A] hover:bg-[#1E293B] text-white font-semibold rounded-md
                           transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Submit Information Request</span>
                <FileText size={20} />
              </a>
              <a
                href="/resources#authorization-guide"
                className="px-8 py-3 bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#F8FAFC]
                           font-semibold rounded-md transition-colors
                           inline-flex items-center justify-center gap-2"
              >
                <span>Download Process Guide</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorizationJourneySection;
