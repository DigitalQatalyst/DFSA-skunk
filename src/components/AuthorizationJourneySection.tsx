import React from 'react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { authorizationSteps, getTotalDuration } from '../data/dfsa';
import { TimelineVisualization } from './dfsa/TimelineVisualization';
import { Clock, TrendingUp, CheckCircle2 } from 'lucide-react';

/**
 * Authorization Journey Section
 * Displays the 8-step DFSA authorization process with interactive timeline
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
              Your Path to DFSA Authorization
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              A proven, structured approach to securing your DFSA license—from initial consultation to full operational approval.
            </p>

            {/* Timeline Overview Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
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
                  <div className="text-2xl font-bold text-gray-900">3-6 mo</div>
                  <div className="text-sm text-gray-600">Avg Timeline</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-dfsa-teal/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-dfsa-teal" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Timeline Visualization */}
        <FadeInUpOnScroll delay={0.2}>
          <TimelineVisualization steps={authorizationSteps} />
        </FadeInUpOnScroll>

        {/* Timeline Overview by Category */}
        <FadeInUpOnScroll delay={0.4}>
          <div className="mt-16 md:mt-20">
            <h3 className="text-2xl font-heading font-bold text-gray-900 text-center mb-8">
              Timeline Varies by License Category
            </h3>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Simple Category */}
              <div className="bg-gradient-to-br from-dfsa-teal/5 to-dfsa-teal/10 rounded-xl p-6 border border-dfsa-teal/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-dfsa-teal rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Category 4</h4>
                </div>
                <div className="text-3xl font-bold text-dfsa-teal mb-2">3-4 mo</div>
                <p className="text-sm text-gray-600">Advisory Services</p>
                <p className="text-xs text-gray-500 mt-2">Simplest and fastest authorization path</p>
              </div>

              {/* Moderate Category */}
              <div className="bg-gradient-to-br from-dfsa-gold/5 to-dfsa-gold/10 rounded-xl p-6 border-2 border-dfsa-gold">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-dfsa-gold rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Category 3</h4>
                  </div>
                  <span className="text-xs font-semibold text-dfsa-gold bg-dfsa-gold/10 px-2 py-1 rounded-full">
                    Most Common
                  </span>
                </div>
                <div className="text-3xl font-bold text-dfsa-gold mb-2">4-6 mo</div>
                <p className="text-sm text-gray-600">Investment Services</p>
                <p className="text-xs text-gray-500 mt-2">Standard authorization timeline</p>
              </div>

              {/* Complex Category */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">1,2,5</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Categories 1, 2, 5</h4>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">6-12 mo</div>
                <p className="text-sm text-gray-600">Banking, Principal, Islamic</p>
                <p className="text-xs text-gray-500 mt-2">Complex authorizations with higher requirements</p>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Call to Action */}
        <FadeInUpOnScroll delay={0.6}>
          <div className="mt-16 text-center">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Ready to Begin Your Authorization Journey?
              </h3>
              <p className="text-gray-600 mb-6">
                Book a free discovery call with our regulatory experts to discuss your specific requirements and timeline.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact#consultation"
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg
                             transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl
                             inline-flex items-center justify-center gap-2"
                >
                  <span>Schedule Discovery Call</span>
                  <CheckCircle2 size={20} />
                </a>
                <a
                  href="/resources#authorization-guide"
                  className="px-8 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white
                             font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1
                             inline-flex items-center justify-center gap-2"
                >
                  <span>Download Guide</span>
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
