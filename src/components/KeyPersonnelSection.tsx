import React from 'react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { keyPersonnel, fitAndProperCriteria } from '../data/dfsa';
import { PersonnelCard } from './dfsa/PersonnelCard';
import { Users, Shield, AlertCircle } from 'lucide-react';

/**
 * Key Personnel Section
 * Displays the 5 key personnel roles required for DFSA authorization
 */
const KeyPersonnelSection: React.FC = () => {
  return (
    <section className="w-full bg-gray-50 py-16 md:py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/5 to-transparent rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-dfsa-teal/5 to-transparent rounded-tl-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <FadeInUpOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              <Users size={16} />
              <span>Key Personnel Requirements</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              Control Functions & Leadership
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Every authorized firm must appoint qualified individuals to these critical control functions.
              Each role requires DFSA approval through the Fit & Proper assessment.
            </p>

            {/* Fit & Proper Callout */}
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8 border-l-4 border-primary">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-heading font-bold text-gray-900 mb-3">
                    Fit & Proper Assessment Criteria
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    All individuals in control functions must demonstrate:
                  </p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {fitAndProperCriteria.map((criterion, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span>{criterion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Personnel Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {keyPersonnel.map((personnel, index) => (
            <FadeInUpOnScroll key={personnel.id} delay={0.1 * index}>
              <PersonnelCard
                personnel={personnel}
                onClick={() => {
                  // Navigate to contact form or specific personnel detail page
                  window.location.href = '/contact#consultation';
                }}
              />
            </FadeInUpOnScroll>
          ))}
        </div>

        {/* Call to Action */}
        <FadeInUpOnScroll delay={0.6}>
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 md:p-12 max-w-3xl mx-auto shadow-lg border border-gray-100">
              <div className="flex items-center justify-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-heading font-bold text-gray-900">
                  Need Help Finding Qualified Personnel?
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                We assist with candidate assessment, AUT-IND applications, and can provide outsourced compliance officer and MLRO services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact#consultation"
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg
                             transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl
                             inline-flex items-center justify-center gap-2"
                >
                  <span>Discuss Personnel Requirements</span>
                  <Users size={20} />
                </a>
                <a
                  href="/services/outsourced-services"
                  className="px-8 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white
                             font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1
                             inline-flex items-center justify-center gap-2"
                >
                  <span>Explore Outsourced Services</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

export default KeyPersonnelSection;
