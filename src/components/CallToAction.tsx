import React, { useState } from 'react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { Calendar, MessageSquare, Phone, ArrowRight, CheckCircle2, Mail } from 'lucide-react';

/**
 * Call to Action Section
 * Final CTA for scheduling consultations and getting in touch
 */
const CallToAction: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    licenseCategory: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        licenseCategory: '',
        message: '',
      });
    }, 3000);
  };

  const licenseCategories = [
    { value: '', label: 'Select License Category' },
    { value: 'category-1', label: 'Category 1 - Banking Business' },
    { value: 'category-2', label: 'Category 2 - Principal Dealing' },
    { value: 'category-3a', label: 'Category 3A - Fund Management' },
    { value: 'category-3b', label: 'Category 3B - Individual Portfolio Management' },
    { value: 'category-3c', label: 'Category 3C - Managing Assets' },
    { value: 'category-4', label: 'Category 4 - Advisory Services' },
    { value: 'category-5', label: 'Category 5 - Islamic Finance' },
    { value: 'itl', label: 'Innovation Testing License (ITL)' },
    { value: 'not-sure', label: "I'm not sure yet" },
  ];

  return (
    <section className="w-full relative overflow-hidden" id="contact">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-gray-900"></div>

      {/* Overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <FadeInUpOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
                Ready to Start Your DFSA Authorization Journey?
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Schedule a free consultation with our regulatory experts to discuss your licensing requirements and timeline.
              </p>
            </div>
          </FadeInUpOnScroll>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Contact Options - Left Side */}
            <FadeInUpOnScroll delay={0.2} className="lg:col-span-2">
              <div className="space-y-4">
                <h3 className="text-xl font-heading font-bold text-white mb-6">
                  Get In Touch
                </h3>

                {/* Quick Contact Cards */}
                <a
                  href="tel:+97144221234"
                  className="block bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg p-4 border border-white/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-dfsa-teal rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-white/70 text-sm">Call Us</p>
                      <p className="text-white font-semibold">+971 4 422 1234</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>

                <a
                  href="mailto:info@dfsaplatform.com"
                  className="block bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg p-4 border border-white/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-dfsa-gold rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-white/70 text-sm">Email Us</p>
                      <p className="text-white font-semibold">info@dfsaplatform.com</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>

                {/* Trust Indicators */}
                <div className="mt-8 space-y-2">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle2 size={16} className="text-dfsa-teal" />
                    <span>Former DFSA Supervisors on Team</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle2 size={16} className="text-dfsa-teal" />
                    <span>95% First-Time Authorization Success</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle2 size={16} className="text-dfsa-teal" />
                    <span>Free Initial Consultation</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle2 size={16} className="text-dfsa-teal" />
                    <span>Response Within 24 Hours</span>
                  </div>
                </div>
              </div>
            </FadeInUpOnScroll>

            {/* Contact Form - Right Side */}
            <FadeInUpOnScroll delay={0.4} className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                {!isSubmitted ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-heading font-bold text-gray-900">
                          Schedule Your Consultation
                        </h3>
                        <p className="text-sm text-gray-600">All fields are required</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="Your name"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                            placeholder="+971 50 123 4567"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          License Category of Interest *
                        </label>
                        <select
                          required
                          value={formData.licenseCategory}
                          onChange={(e) => setFormData({ ...formData, licenseCategory: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                        >
                          {licenseCategories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                          placeholder="Tell us about your business and licensing goals..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-lg
                                   transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2 group"
                      >
                        <Calendar size={20} />
                        <span>Schedule Free Consultation</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <p className="text-xs text-gray-500 text-center mt-3">
                        By submitting this form, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We've received your consultation request. Our team will contact you within 24 hours.
                    </p>
                    <p className="text-sm text-gray-500">
                      Check your email for confirmation details.
                    </p>
                  </div>
                )}
              </div>
            </FadeInUpOnScroll>
          </div>

          {/* Bottom Trust Bar */}
          <FadeInUpOnScroll delay={0.6}>
            <div className="mt-12 text-center">
              <p className="text-white/80 text-sm mb-4">Trusted by 50+ Financial Firms in the DIFC</p>
              <div className="flex flex-wrap justify-center gap-6 text-xs text-white/60">
                <span>🔒 Confidential Consultation</span>
                <span>⚡ 24-Hour Response Time</span>
                <span>✓ No Obligation</span>
                <span>📞 Direct Access to Experts</span>
              </div>
            </div>
          </FadeInUpOnScroll>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
