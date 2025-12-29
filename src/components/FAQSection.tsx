import React, { useState } from 'react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { faqs, faqCategories, getFAQsByCategory } from '../data/dfsa';
import { ChevronDown, ChevronUp, HelpCircle, ExternalLink } from 'lucide-react';

/**
 * FAQ Section
 * Frequently asked questions about DFSA authorization and compliance
 */
const FAQSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const displayFAQs = selectedCategory === 'all'
    ? faqs
    : getFAQsByCategory(selectedCategory);

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <section className="w-full bg-gray-50 py-16 md:py-24 relative overflow-hidden" id="faq">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-dfsa-teal/5 to-transparent rounded-tr-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <FadeInUpOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              <HelpCircle size={16} />
              <span>Frequently Asked Questions</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              Your DFSA Questions Answered
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about licensing, capital requirements, compliance, and the authorization process.
            </p>
          </div>
        </FadeInUpOnScroll>

        {/* Category Filter */}
        <FadeInUpOnScroll delay={0.2}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.label}
                <span className={`ml-2 text-xs ${
                  selectedCategory === category.id ? 'text-white/80' : 'text-gray-500'
                }`}>
                  ({category.count})
                </span>
              </button>
            ))}
          </div>
        </FadeInUpOnScroll>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {displayFAQs.map((faq, index) => {
            const isExpanded = expandedFAQ === faq.id;

            return (
              <FadeInUpOnScroll key={faq.id} delay={0.05 * index}>
                <div className="mb-4">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        {isExpanded && (
                          <div className="mt-4 text-gray-600 leading-relaxed animate-fade-in">
                            <p>{faq.answer}</p>

                            {/* Related Links */}
                            {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                  Related Resources:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {faq.relatedLinks.map((link, idx) => (
                                    <a
                                      key={idx}
                                      href={link.url}
                                      className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium group"
                                    >
                                      <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                      {link.text}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isExpanded ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </button>
                </div>
              </FadeInUpOnScroll>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <FadeInUpOnScroll delay={0.4}>
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 md:p-12 max-w-3xl mx-auto shadow-lg border border-gray-100">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Our regulatory experts are here to help with personalized guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact#consultation"
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg
                             transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl
                             inline-flex items-center justify-center gap-2"
                >
                  <HelpCircle size={20} />
                  <span>Schedule a Consultation</span>
                </a>
                <a
                  href="mailto:info@dfsaplatform.com"
                  className="px-8 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white
                             font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1
                             inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Email Us</span>
                </a>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Quick Stats */}
        <FadeInUpOnScroll delay={0.6}>
          <div className="mt-12 text-center">
            <div className="inline-flex flex-wrap justify-center gap-8 md:gap-12">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-primary mb-1">12</div>
                <div className="text-sm text-gray-600">Questions Answered</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-dfsa-gold mb-1">6</div>
                <div className="text-sm text-gray-600">Topic Categories</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-dfsa-teal mb-1">24/7</div>
                <div className="text-sm text-gray-600">Resource Access</div>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default FAQSection;
