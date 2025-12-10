import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { AUTHORIZATION_PATHWAYS } from '../../constants/dfsa-pathways';
import SelectablePathwayCard from '../../components/dfsa/SelectablePathwayCard';
import { FadeInUpOnScroll } from '../../components/AnimationUtils';

/**
 * Authorization Page
 * Pathway selection for DFSA Authorization
 * Displays 5 selectable pathway cards
 */
const AuthorizationPage: React.FC = () => {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const handleSelectPathway = (id: string) => {
    setSelectedPathway(selectedPathway === id ? null : id);
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
              <li className="text-gray-700 font-semibold">AUTHORISATION</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-semibold text-[#1E293B] mb-4">
              Authorisation
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mb-6">
              Select the regulatory pathway applicable to your proposed
              Financial Services business.
            </p>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg max-w-4xl">
              <p className="text-sm md:text-base text-gray-700">
                <span className="font-semibold">Important:</span> Pathways are
                mutually exclusive. You may only select one pathway per
                application.
              </p>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Pathway Cards Grid */}
        <FadeInUpOnScroll delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {AUTHORIZATION_PATHWAYS.map((pathway) => (
              <SelectablePathwayCard
                key={pathway.id}
                pathway={pathway}
                isSelected={selectedPathway === pathway.id}
                onSelect={handleSelectPathway}
              />
            ))}
          </div>
        </FadeInUpOnScroll>

        {/* Action Buttons */}
        {selectedPathway && (
          <FadeInUpOnScroll delay={0.4}>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSelectedPathway(null)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300"
              >
                Clear Selection
              </button>
              <button
                className="px-8 py-3 bg-gradient-to-r from-dfsa-gold-500 to-dfsa-gold-600 text-white rounded-lg font-medium hover:from-dfsa-gold-600 hover:to-dfsa-gold-700 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Continue with Selected Pathway
              </button>
            </div>
          </FadeInUpOnScroll>
        )}
      </div>
    </div>
  );
};

export default AuthorizationPage;
