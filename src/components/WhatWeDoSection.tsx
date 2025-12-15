import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, ClipboardCheck, ArrowRight, LucideIcon } from 'lucide-react';
import { FadeInUpOnScroll, StaggeredFadeIn } from './AnimationUtils';

/**
 * ServiceItem Interface
 * Defines the structure for each service card
 */
interface ServiceItem {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  learnMoreUrl: string;
}

/**
 * What We Do Section
 * Premium 3-card display of core DFSA service areas
 * Features: scroll animations, hover effects, gradients, and enhanced UX
 *
 * Displays three core DFSA services:
 * - Authorization: DFSA authorization and licensing
 * - Recognition: Recognition of firms, crypto tokens, international entities
 * - Registration: Registration of individuals, DNFBPs, other entities
 */
const WhatWeDoSection: React.FC = () => {
  const services: ServiceItem[] = [
    {
      id: 'authorisation',
      icon: Shield,
      label: 'Authorisation',
      description:
        'Obtain DFSA authorisation and licensing to conduct financial services in or from the DIFC. Our streamlined process covers asset management, banking, securities, funds, custody, Islamic finance, and insurance.',
      learnMoreUrl: '/authorisation',
    },
    {
      id: 'recognition',
      icon: Award,
      label: 'Recognition',
      description:
        "Facilitate recognition of crypto tokens, international firms, and foreign entities. DFSA's framework enables cross-border operations with recognized jurisdictions including UK, EU, Canada, Singapore, and Hong Kong.",
      learnMoreUrl: '/recognition',
    },
    {
      id: 'registration',
      icon: ClipboardCheck,
      label: 'Registration',
      description:
        'Register individuals and Designated Non-Financial Businesses or Professions (DNFBPs) including real estate developers, company service providers, and corporate services in the DIFC.',
      learnMoreUrl: '/registration',
    },
  ];

  return (
    <section
      className="w-full bg-gradient-to-br from-dfsa-gold-50/20 via-white to-dfsa-teal-50/20 py-16 md:py-24 lg:py-32"
      role="region"
      aria-labelledby="services-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header with Scroll Animation */}
        <FadeInUpOnScroll delay={0} threshold={0.1}>
          <div className="text-center mb-16">
            <h2
              id="services-heading"
              className="text-3xl md:text-4xl font-sans font-semibold text-[#1E293B] mb-4"
            >
              Our Regulatory Regimes
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
              Comprehensive regulatory services for financial institutions in
              the DIFC
            </p>
          </div>
        </FadeInUpOnScroll>

        {/* Service Cards Grid with Staggered Animation */}
        <StaggeredFadeIn
          staggerDelay={0.15}
          threshold={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                className="group flex flex-col bg-white border-2 border-gray-200 rounded-lg p-8 md:p-12 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-dfsa-gold-500 hover:bg-gradient-to-br hover:from-dfsa-gold-50/50 hover:via-dfsa-teal-50/30 hover:to-white transition-all duration-300 ease-in-out"
                style={{ minHeight: '380px' }}
              >
                {/* Icon Container with Gradient Background */}
                <div
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-dfsa-gold-500 to-dfsa-gold-600 shadow-md group-hover:shadow-lg flex items-center justify-center mb-6 transition-all duration-300"
                  aria-label={`${service.label} icon`}
                >
                  <Icon
                    size={36}
                    strokeWidth={2}
                    className="text-white transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Service Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {service.label}
                  </h3>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed flex-1">
                    {service.description}
                  </p>

                  {/* Learn More Link */}
                  <Link
                    to={service.learnMoreUrl}
                    className="text-dfsa-gold-600 hover:text-dfsa-gold-700 font-medium flex items-center gap-2 transition-all duration-300 hover:underline focus-visible:ring-2 focus-visible:ring-dfsa-gold-500 focus-visible:ring-offset-2 rounded outline-none"
                    aria-label={`Learn more about ${service.label}`}
                  >
                    Learn more
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </StaggeredFadeIn>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
