import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { RECOGNITION_CATEGORIES } from '../../constants/dfsa-pathways';
import SelectablePathwayCard from '../../components/dfsa/SelectablePathwayCard';
import { FadeInUpOnScroll } from '../../components/AnimationUtils';

/**
 * Recognition Page
 * Category selection for DFSA Recognition
 * Displays 2 selectable category cards (RB, RM)
 */
const RecognitionPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelectCategory = (id: string) => {
    setSelectedCategory(selectedCategory === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dfsa-gold-50/20 via-white to-dfsa-teal-50/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <FadeInUpOnScroll delay={0}>
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs uppercase text-gray-500">
              <li>DFSA LICENSING</li>
              <ChevronRight size={14} />
              <li className="text-gray-700 font-semibold">RECOGNITION</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-semibold text-[#1E293B] mb-4">
              Recognition
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl">
              Select the recognition category applicable to your entity.
            </p>
          </div>
        </FadeInUpOnScroll>

        {/* Category Cards Grid */}
        <FadeInUpOnScroll delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {RECOGNITION_CATEGORIES.map((category) => (
              <SelectablePathwayCard
                key={category.id}
                pathway={category}
                isSelected={selectedCategory === category.id}
                onSelect={handleSelectCategory}
              />
            ))}
          </div>
        </FadeInUpOnScroll>

        {/* Action Buttons */}
        {selectedCategory && (
          <FadeInUpOnScroll delay={0.4}>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300"
              >
                Clear Selection
              </button>
              <button
                className="px-8 py-3 bg-gradient-to-r from-dfsa-gold-500 to-dfsa-gold-600 text-white rounded-lg font-medium hover:from-dfsa-gold-600 hover:to-dfsa-gold-700 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Continue with Selected Category
              </button>
            </div>
          </FadeInUpOnScroll>
        )}
      </div>
    </div>
  );
};

export default RecognitionPage;
