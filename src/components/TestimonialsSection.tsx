import React, { useState, useEffect, useRef } from 'react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { testimonials } from '../data/dfsa';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

/**
 * Testimonials Section
 * Client success stories from DFSA authorization projects
 */
const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to active index
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = activeIndex * (carouselRef.current.scrollWidth / testimonials.length);
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-16 md:py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-dfsa-gold/5 to-transparent rounded-tr-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <FadeInUpOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              <Star size={16} className="fill-current" />
              <span>Client Success Stories</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              Trusted by Leading Financial Firms
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              See how we've helped firms navigate the DFSA authorization process and maintain regulatory excellence.
            </p>
          </div>
        </FadeInUpOnScroll>

        {/* Testimonials Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth gap-6 pb-8"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] flex-shrink-0 snap-center"
              >
                <FadeInUpOnScroll delay={index * 0.1}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full flex flex-col">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={18} className="text-dfsa-gold fill-current" />
                      ))}
                    </div>

                    {/* Quote */}
                    <div className="relative mb-6 flex-grow">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10" />
                      <p className="text-gray-700 leading-relaxed pl-6">
                        "{testimonial.quote}"
                      </p>
                    </div>

                    {/* License Category Badge */}
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        {testimonial.licenseCategory}
                      </span>
                    </div>

                    {/* Client Info */}
                    <div className="flex items-start gap-4 pt-4 border-t border-gray-100">
                      {/* Avatar or Company Initial */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-dfsa-gold flex items-center justify-center text-white font-bold flex-shrink-0">
                        {testimonial.name.charAt(0)}
                      </div>

                      <div className="flex-grow">
                        <h4 className="font-heading font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.position}</p>
                        <p className="text-sm font-semibold text-primary">{testimonial.company}</p>
                        <p className="text-xs text-gray-500 mt-1">{testimonial.companyType}</p>
                        {testimonial.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-500">{testimonial.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeInUpOnScroll>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center transform -translate-y-1/2 pointer-events-none px-4">
            <button
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-primary hover:text-white transition-all pointer-events-auto"
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-primary hover:text-white transition-all pointer-events-auto"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Pagination Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index ? 'bg-primary w-8' : 'bg-gray-300 w-2'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <FadeInUpOnScroll delay={0.4}>
          <div className="mt-16 text-center">
            <div className="inline-flex flex-wrap justify-center gap-8 md:gap-12">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-dfsa-gold mb-2">50+</div>
                <div className="text-sm text-gray-600">Licenses Secured</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-dfsa-teal mb-2">4-6mo</div>
                <div className="text-sm text-gray-600">Avg Timeline</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-gray-600">Compliance Rate</div>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>
      </div>

      {/* Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
