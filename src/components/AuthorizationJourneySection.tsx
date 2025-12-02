import React from 'react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { authorizationSteps } from '../data/dfsa';
import { TimelineVisualization } from './dfsa/TimelineVisualization';
import { Clock, FileText, AlertCircle } from 'lucide-react';

/**
 * Authorisation Journey Section
 * Displays the 8-step DFSA authorisation process with interactive timeline
 */
const AuthorizationJourneySection: React.FC = () => {
  return (
    <section className="w-full bg-white py-16 md:py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-dfsa-gold/5 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-dfsa-teal/5 to-transparent rounded-tr-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <FadeInUpOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              <Clock size={16} />
              <span>Step-by-Step Process</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              DFSA Authorisation Application Process
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
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

            {/* Process Overview */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">{authorizationSteps.length}</div>
                  <div className="text-sm text-gray-600">Key Steps</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-dfsa-gold/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-dfsa-gold" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">Variable</div>
                  <div className="text-sm text-gray-600">Timeline (DFSA determines)</div>
                </div>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Timeline Visualization */}
        <FadeInUpOnScroll delay={0.2}>
          <TimelineVisualization steps={authorizationSteps} />
        </FadeInUpOnScroll>

        {/* Timeline Information by Category */}
        <FadeInUpOnScroll delay={0.4}>
          <div className="mt-16 md:mt-20">
            <h3 className="text-2xl font-heading font-bold text-gray-900 text-center mb-4">
              Timeline Information by Licence Category
            </h3>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Historical processing times shown below. DFSA determines actual timelines based on application complexity, completeness, and assessment requirements.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Category 4 */}
              <div className="bg-gradient-to-br from-dfsa-teal/5 to-dfsa-teal/10 rounded-xl p-6 border border-dfsa-teal/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-dfsa-teal rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Category 4</h4>
                </div>
                <div className="text-3xl font-bold text-dfsa-teal mb-2">3-4 mo</div>
                <p className="text-sm text-gray-600">Advisory Services</p>
                <p className="text-xs text-gray-500 mt-2">Capital requirement: $10,000 USD per AMEN Module</p>
                <p className="text-xs text-gray-500 mt-1">Historical range only - DFSA determines actual duration</p>
              </div>

              {/* Category 3 */}
              <div className="bg-gradient-to-br from-dfsa-gold/5 to-dfsa-gold/10 rounded-xl p-6 border-2 border-dfsa-gold">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-dfsa-gold rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Category 3</h4>
                  </div>
                </div>
                <div className="text-3xl font-bold text-dfsa-gold mb-2">4-6 mo</div>
                <p className="text-sm text-gray-600">Investment Services</p>
                <p className="text-xs text-gray-500 mt-2">Capital requirements vary per AMEN Module (from $50,000)</p>
                <p className="text-xs text-gray-500 mt-1">Historical range only - DFSA determines actual duration</p>
              </div>

              {/* Categories 1, 2, 5 */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">1,2,5</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Categories 1, 2, 5</h4>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">6-12 mo</div>
                <p className="text-sm text-gray-600">Banking, Principal, Islamic</p>
                <p className="text-xs text-gray-500 mt-2">Higher capital requirements per AMEN Module (from $1M)</p>
                <p className="text-xs text-gray-500 mt-1">Historical range only - DFSA determines actual duration</p>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Information Request CTA */}
        <FadeInUpOnScroll delay={0.6}>
          <div className="mt-16 text-center">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Request Information About Application Requirements
              </h3>
              <p className="text-gray-600 mb-6">
                Submit an information request to receive details about documentation requirements and procedures for your intended financial services activities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact#consultation"
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg
                             transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl
                             inline-flex items-center justify-center gap-2"
                >
                  <span>Submit Information Request</span>
                  <FileText size={20} />
                </a>
                <a
                  href="/resources#authorization-guide"
                  className="px-8 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white
                             font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1
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
        </FadeInUpOnScroll>
      </div>
    </section>
  );
};

export default AuthorizationJourneySection;
