import React, { useState } from 'react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { complianceServices, getPopularServices } from '../data/dfsa';
import { ServiceCard } from './dfsa/ServiceCard';
import { Shield, TrendingUp, HeartHandshake } from 'lucide-react';

/**
 * Compliance Services Section
 * Displays 9 ongoing compliance and regulatory support services
 */
const ComplianceServicesSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const popularServices = getPopularServices();
  const displayServices = showAll ? complianceServices : complianceServices.slice(0, 6);

  return (
    <section className="w-full bg-white py-16 md:py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-dfsa-teal/5 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-dfsa-gold/5 to-transparent rounded-tr-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <FadeInUpOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              <Shield size={16} />
              <span>Ongoing Compliance Support</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              Post-Authorization Services
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Comprehensive regulatory compliance and advisory services to maintain your DFSA authorization
              and ensure ongoing regulatory excellence.
            </p>

            {/* Value Propositions */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">9</div>
                  <div className="text-sm text-gray-600">Core Services</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-dfsa-gold/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-dfsa-gold" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Active Clients</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-dfsa-teal/10 rounded-full flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6 text-dfsa-teal" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Regulatory Compliance</div>
                </div>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayServices.map((service, index) => (
            <FadeInUpOnScroll key={service.id} delay={0.1 * index}>
              <ServiceCard
                service={service}
                onClick={() => {
                  // Navigate to service detail or contact form
                  if (service.ctaUrl) {
                    window.location.href = service.ctaUrl;
                  }
                }}
              />
            </FadeInUpOnScroll>
          ))}
        </div>

        {/* Show More/Less Button */}
        {complianceServices.length > 6 && (
          <FadeInUpOnScroll delay={0.4}>
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-8 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white
                           font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1
                           inline-flex items-center justify-center gap-2"
              >
                <span>{showAll ? 'Show Less Services' : 'View All Services'}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${showAll ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </FadeInUpOnScroll>
        )}

        {/* Most Popular Services Highlight */}
        <FadeInUpOnScroll delay={0.6}>
          <div className="mt-16 md:mt-20">
            <div className="bg-gradient-to-br from-primary/5 to-dfsa-gold/5 rounded-2xl p-8 md:p-12 border border-primary/10">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">
                  Most Popular Services
                </h3>
                <p className="text-gray-600">
                  Our most frequently engaged compliance solutions for authorized firms
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {popularServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-heading font-bold text-gray-900">{service.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {service.pricing.customNote || `${service.pricing.amount} ${service.pricing.frequency || ''}`}
                      </span>
                      <a
                        href={service.ctaUrl}
                        className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1 group"
                      >
                        <span>Learn More</span>
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Call to Action */}
        <FadeInUpOnScroll delay={0.8}>
          <div className="mt-16 text-center">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Build Your Compliance Package
              </h3>
              <p className="text-gray-600 mb-6">
                Let's discuss your firm's specific compliance needs and create a tailored service package.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact#consultation"
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg
                             transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl
                             inline-flex items-center justify-center gap-2"
                >
                  <span>Schedule Consultation</span>
                  <HeartHandshake size={20} />
                </a>
                <a
                  href="/pricing#subscriptions"
                  className="px-8 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white
                             font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1
                             inline-flex items-center justify-center gap-2"
                >
                  <span>View Pricing Packages</span>
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

export default ComplianceServicesSection;
