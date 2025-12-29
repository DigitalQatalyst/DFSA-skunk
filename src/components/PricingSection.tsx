import React, { useState } from 'react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { authorizationPackages, complianceSubscriptions } from '../data/dfsa';
import * as LucideIcons from 'lucide-react';
import { Check, X, DollarSign, Clock, ArrowRight } from 'lucide-react';

/**
 * Pricing Section
 * Displays authorization packages and compliance subscriptions
 */
const PricingSection: React.FC = () => {
  const [pricingType, setPricingType] = useState<'authorization' | 'compliance'>('authorization');

  return (
    <section className="w-full bg-white py-16 md:py-24 relative overflow-hidden" id="pricing">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-dfsa-teal/5 to-transparent rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-dfsa-gold/5 to-transparent rounded-tl-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <FadeInUpOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              <DollarSign size={16} />
              <span>Transparent Pricing</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              Flexible Packages for Every Need
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose from our authorization packages for getting licensed, or ongoing compliance subscriptions for post-authorization support.
            </p>

            {/* Pricing Type Toggle */}
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPricingType('authorization')}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 ${
                  pricingType === 'authorization'
                    ? 'bg-white text-primary shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Authorization Packages
              </button>
              <button
                onClick={() => setPricingType('compliance')}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 ${
                  pricingType === 'compliance'
                    ? 'bg-white text-primary shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Compliance Subscriptions
              </button>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Authorization Packages */}
        {pricingType === 'authorization' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {authorizationPackages.map((pkg, index) => {
              const IconComponent = LucideIcons[pkg.icon as keyof typeof LucideIcons] as any;

              return (
                <FadeInUpOnScroll key={pkg.id} delay={index * 0.1}>
                  <div
                    className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col ${
                      pkg.popular ? 'border-2 border-primary' : 'border border-gray-200'
                    }`}
                  >
                    {/* Popular Badge */}
                    {pkg.badge && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full shadow-md">
                          {pkg.badge}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* Icon */}
                      <div className="mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-dfsa-gold/10 rounded-lg flex items-center justify-center">
                          {IconComponent && <IconComponent className="w-7 h-7 text-primary" />}
                        </div>
                      </div>

                      {/* Package Name */}
                      <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                        {pkg.name}
                      </h3>

                      {/* Price */}
                      <div className="text-4xl font-bold text-primary mb-4">
                        {pkg.price}
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Clock size={16} className="text-dfsa-teal" />
                        <span>{pkg.timeline}</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-6">
                        {pkg.description}
                      </p>

                      {/* Features */}
                      <div className="mb-6 flex-grow">
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                          What's Included:
                        </h4>
                        <ul className="space-y-2">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="text-sm flex items-start">
                              {feature.included ? (
                                <Check className="w-4 h-4 text-dfsa-teal mr-2 mt-0.5 flex-shrink-0" />
                              ) : (
                                <X className="w-4 h-4 text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
                              )}
                              <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                                {feature.name}
                                {feature.details && (
                                  <span className="text-xs text-gray-500"> ({feature.details})</span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Ideal For */}
                      {pkg.idealFor && pkg.idealFor.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                            Ideal For:
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {pkg.idealFor.map((item, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-dfsa-gold/10 text-dfsa-gold text-xs font-medium rounded"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA Button */}
                      <a
                        href={pkg.ctaUrl}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 group ${
                          pkg.popular
                            ? 'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl'
                            : 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        <span>{pkg.ctaLabel}</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>

                    {/* Gradient Border Effect */}
                    {pkg.popular && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-dfsa-gold/5 pointer-events-none" />
                    )}
                  </div>
                </FadeInUpOnScroll>
              );
            })}
          </div>
        )}

        {/* Compliance Subscriptions */}
        {pricingType === 'compliance' && (
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {complianceSubscriptions.map((subscription, index) => {
              const IconComponent = LucideIcons[subscription.icon as keyof typeof LucideIcons] as any;

              return (
                <FadeInUpOnScroll key={subscription.id} delay={index * 0.1}>
                  <div
                    className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col ${
                      subscription.popular ? 'border-2 border-primary' : 'border border-gray-200'
                    }`}
                  >
                    {/* Popular Badge */}
                    {subscription.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full shadow-md">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* Icon */}
                      <div className="mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-dfsa-teal/10 to-primary/10 rounded-lg flex items-center justify-center">
                          {IconComponent && <IconComponent className="w-7 h-7 text-primary" />}
                        </div>
                      </div>

                      {/* Subscription Name */}
                      <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                        {subscription.name}
                      </h3>

                      {/* Price */}
                      <div className="mb-1">
                        <span className="text-4xl font-bold text-primary">{subscription.priceMonthly}</span>
                        <span className="text-gray-600 text-lg">/month</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-6">
                        {subscription.description}
                      </p>

                      {/* Features */}
                      <div className="mb-6 flex-grow">
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                          Features:
                        </h4>
                        <ul className="space-y-2">
                          {subscription.features.map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <Check className="w-4 h-4 text-dfsa-teal mr-2 mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button */}
                      <a
                        href={subscription.ctaUrl}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 group ${
                          subscription.popular
                            ? 'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl'
                            : 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        <span>{subscription.ctaLabel}</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>

                    {/* Gradient Border Effect */}
                    {subscription.popular && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-dfsa-teal/5 pointer-events-none" />
                    )}
                  </div>
                </FadeInUpOnScroll>
              );
            })}
          </div>
        )}

        {/* Custom Packages CTA */}
        <FadeInUpOnScroll delay={0.6}>
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 max-w-3xl mx-auto border border-gray-100">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Need a Custom Package?
              </h3>
              <p className="text-gray-600 mb-6">
                Every firm's regulatory journey is unique. Let's discuss your specific requirements and create a tailored solution that fits your needs and budget.
              </p>
              <a
                href="/contact#consultation"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg
                           transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <span>Request Custom Quote</span>
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Trust Footer */}
        <FadeInUpOnScroll delay={0.8}>
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-3">Trusted by 50+ authorized firms in the DIFC</p>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-dfsa-teal rounded-full"></div>
                <span>No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-dfsa-gold rounded-full"></div>
                <span>Flexible Payment Plans</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>
      </div>
    </section>
  );
};

export default PricingSection;
