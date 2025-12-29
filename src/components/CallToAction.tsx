import React, { useState } from 'react';
import { Calendar, Phone, ArrowRight, CheckCircle2, Mail, MapPin } from 'lucide-react';

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
    <section className="w-full bg-[#1E3A8A] py-24 md:py-32" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Request Information on DFSA Authorisation Requirements
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Submit your details to receive information about documentation requirements and application procedures for your intended financial services activities.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Contact Options - Left Side */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-semibold text-white mb-6">
                Contact Information
              </h3>

              {/* Quick Contact Cards */}
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Phone</p>
                      <p className="text-white font-medium">+971 4 XXX XXXX</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Email</p>
                      <p className="text-white font-medium">info@[domain].ae</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Address</p>
                      <p className="text-white font-medium text-sm">
                        Dubai International Financial Centre<br/>
                        P.O. Box XXXXX<br/>
                        Dubai, United Arab Emirates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-8">
                {!isSubmitted ? (
                  <>
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-[#1E293B] mb-2">
                        Request Application Information
                      </h3>
                      <p className="text-sm text-[#64748B]">All fields are required</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1E293B] mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-[#E2E8F0] rounded-md focus:border-[#1E3A8A] focus:outline-none transition-colors"
                          placeholder="Your name"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1E293B] mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-[#E2E8F0] rounded-md focus:border-[#1E3A8A] focus:outline-none transition-colors"
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1E293B] mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-[#E2E8F0] rounded-md focus:border-[#1E3A8A] focus:outline-none transition-colors"
                            placeholder="+971 50 123 4567"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1E293B] mb-2">
                          License Category of Interest *
                        </label>
                        <select
                          required
                          value={formData.licenseCategory}
                          onChange={(e) => setFormData({ ...formData, licenseCategory: e.target.value })}
                          className="w-full px-4 py-3 border border-[#E2E8F0] rounded-md focus:border-[#1E3A8A] focus:outline-none transition-colors"
                        >
                          {licenseCategories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1E293B] mb-2">
                          Message *
                        </label>
                        <textarea
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border border-[#E2E8F0] rounded-md focus:border-[#1E3A8A] focus:outline-none transition-colors resize-none"
                          placeholder="Describe your proposed financial services activities and regulatory questions..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#1E3A8A] hover:bg-[#1E293B] text-white font-semibold text-base rounded-md
                                   transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Submit Information Request</span>
                      </button>

                      <p className="text-xs text-[#64748B] mt-4">
                        This platform provides general information and is not a substitute for professional advisory services. By submitting this form, you consent to us contacting you about DFSA licensing and compliance matters. For specific legal matters consult a licensed professional. We strictly adhere to applicable data protection requirements.
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-[#1E293B] mb-2">
                      Thank You
                    </h3>
                    <p className="text-[#64748B] mb-6">
                      We have received your information request. Our team will respond with relevant information about DFSA requirements.
                    </p>
                    <p className="text-sm text-[#64748B]">
                      Check your email for confirmation details.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
