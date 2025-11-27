import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { licenseCategories } from '../data/dfsa';
import { LicenseCategoryCard } from './dfsa/LicenseCategoryCard';

/**
 * License Categories Section
 * Carousel display of all DFSA license categories
 */
const LicenseCategoriesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const hasMultipleCategories = licenseCategories.length > 1;

  // Handle auto-cycling between categories
  useEffect(() => {
    if (hasMultipleCategories) {
      autoPlayRef.current = setInterval(() => {
        nextCategory();
      }, 7000); // Auto-cycle every 7 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [activeIndex, hasMultipleCategories]);

  const nextCategory = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % licenseCategories.length);
      setIsTransitioning(false);
    }, 500);
  };

  const prevCategory = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === 0 ? licenseCategories.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 500);
  };

  const goToCategory = (index: number) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);

    // Reset auto-play timer when manually navigating
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 500);
  };

  const activeCategory = licenseCategories[activeIndex];

  const handleCategoryClick = () => {
    // Navigate to license category detail page or open modal
    window.location.href = activeCategory.detailsUrl || `/license-categories/${activeCategory.id}`;
  };

  return (
    <section className="w-full bg-gray-50 py-16 md:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DC2626' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <FadeInUpOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              Find Your DFSA License Category
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Each financial service requires specific authorization. Discover which license category aligns with your business model.
            </p>
          </div>
        </FadeInUpOnScroll>

        {/* Category Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {hasMultipleCategories && (
            <>
              <button
                onClick={prevCategory}
                disabled={isTransitioning}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20
                           bg-white hover:bg-gray-50 text-primary rounded-full p-3 shadow-lg
                           transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed
                           hidden md:flex items-center justify-center"
                aria-label="Previous category"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={nextCategory}
                disabled={isTransitioning}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20
                           bg-white hover:bg-gray-50 text-primary rounded-full p-3 shadow-lg
                           transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed
                           hidden md:flex items-center justify-center"
                aria-label="Next category"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Category Card */}
          <div
            className={`transition-opacity duration-500 max-w-2xl mx-auto ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <LicenseCategoryCard
              category={activeCategory}
              onClick={handleCategoryClick}
            />
          </div>
        </div>

        {/* Navigation Indicators */}
        {hasMultipleCategories && (
          <div className="flex justify-center mt-8 gap-2">
            {licenseCategories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => goToCategory(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex
                    ? 'bg-primary w-12 h-3'
                    : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
                }`}
                aria-label={`Go to ${category.name}`}
                title={category.name}
              />
            ))}
          </div>
        )}

        {/* Category Count */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          Viewing {activeIndex + 1} of {licenseCategories.length} license categories
        </div>

        {/* Mobile Navigation Buttons */}
        {hasMultipleCategories && (
          <div className="flex md:hidden justify-center gap-4 mt-6">
            <button
              onClick={prevCategory}
              disabled={isTransitioning}
              className="px-6 py-2 bg-white text-primary border-2 border-primary rounded-lg font-semibold
                         hover:bg-primary hover:text-white transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <button
              onClick={nextCategory}
              disabled={isTransitioning}
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold
                         hover:bg-primary-dark transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* View All Categories CTA */}
        <FadeInUpOnScroll delay={0.3}>
          <div className="text-center mt-12">
            <a
              href="/license-categories"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary border-2 border-primary
                         hover:bg-primary hover:text-white font-semibold rounded-lg
                         transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl"
            >
              <span>View All License Categories</span>
              <ChevronRight size={20} />
            </a>
          </div>
        </FadeInUpOnScroll>
      </div>
    </section>
  );
};

export default LicenseCategoriesSection;
