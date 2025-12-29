import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <section className="w-full bg-[#F8FAFC] py-24 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1E293B] mb-4">
            DFSA Licence Categories Information
          </h2>
          <p className="text-lg text-[#64748B] max-w-3xl mx-auto mb-6">
            Information on DFSA licence categories based on AUT Module 3. Each financial service requires specific authorisation.
          </p>
          <div className="max-w-4xl mx-auto p-4 bg-white border border-[#E2E8F0] rounded-lg">
            <p className="text-sm text-[#64748B]">
              All requirements determined by DFSA. Applications assessed individually based on proposed activities and firm structure.
            </p>
          </div>
        </div>

        {/* Category Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {hasMultipleCategories && (
            <>
              <button
                onClick={prevCategory}
                disabled={isTransitioning}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20
                           bg-white hover:bg-[#F8FAFC] text-primary rounded-full p-3 shadow-md
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           hidden md:flex items-center justify-center"
                aria-label="Previous category"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={nextCategory}
                disabled={isTransitioning}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20
                           bg-white hover:bg-[#F8FAFC] text-primary rounded-full p-3 shadow-md
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           hidden md:flex items-center justify-center"
                aria-label="Next category"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Category Card */}
          <div
            className={`transition-opacity duration-500 max-w-2xl mx-auto ${isTransitioning ? 'opacity-0' : 'opacity-100'
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
                className={`transition-colors duration-300 rounded-full ${index === activeIndex
                  ? 'bg-primary w-12 h-3'
                  : 'bg-[#E2E8F0] hover:bg-[#64748B] w-3 h-3'
                  }`}
                aria-label={`Go to ${category.name}`}
                title={category.name}
              />
            ))}
          </div>
        )}

        {/* Category Count */}
        <div className="text-center mt-6 text-[#64748B] text-sm">
          Viewing {activeIndex + 1} of {licenseCategories.length} license categories
        </div>

        {/* Mobile Navigation Buttons */}
        {hasMultipleCategories && (
          <div className="flex md:hidden justify-center gap-4 mt-6">
            <button
              onClick={prevCategory}
              disabled={isTransitioning}
              className="px-6 py-2 bg-white text-dfsa-gold border-2 border-dfsa-gold rounded-md font-semibold
                         hover:bg-[#F8FAFC] transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <button
              onClick={nextCategory}
              disabled={isTransitioning}
              className="px-6 py-2 bg-dfsa-gold text-white rounded-md font-semibold
                         hover:bg-[#1E293B] transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* View All Categories CTA */}
        <div className="text-center mt-12">
          <a
            href="/license-categories"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary border-2 border-primary
                       hover:bg-[#F8FAFC] font-semibold rounded-md
                       transition-colors shadow-sm"
          >
            <span>View All License Categories</span>
            <ChevronRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default LicenseCategoriesSection;
