import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { RECOGNITION_CATEGORIES } from '../../constants/dfsa-pathways';
import SelectablePathwayCard from '../../components/dfsa/SelectablePathwayCard';
import { FadeInUpOnScroll } from '../../components/AnimationUtils';

/**
 * Recognition Page
 * Category selection for DFSA Recognition
 * Displays 2 selectable category cards (RB, RM) with enhanced visual design
 */
const RecognitionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelectCategory = (id: string) => {
    setSelectedCategory(selectedCategory === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <FadeInUpOnScroll delay={0}>
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs uppercase tracking-wide">
              <li>
                <a
                  href="/"
                  className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  HOME
                </a>
              </li>
              <ChevronRight size={14} className="text-gray-400" />
              <li className="text-dfsa-red-600 font-semibold">RECOGNITION</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-12 lg:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Recognition
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl leading-relaxed">
              Select the recognition category applicable to your entity.
            </p>
          </div>
        </FadeInUpOnScroll>

        {/* Category Cards Grid */}
        <FadeInUpOnScroll delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
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
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow"
              >
                Clear Selection
              </button>
              <button
                onClick={() => navigate(`/recognition/${selectedCategory}`)}
                className="px-10 py-3.5 bg-gradient-to-r from-dfsa-gold-600 to-dfsa-gold-700 text-white rounded-xl font-semibold hover:from-dfsa-gold-700 hover:to-dfsa-gold-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Continue with Selected Category
              </button>
            </div>
          </FadeInUpOnScroll>
        )}

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-dfsa-gold-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-dfsa-red-100/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      </div>
    </div>
  );
};

export default RecognitionPage;
