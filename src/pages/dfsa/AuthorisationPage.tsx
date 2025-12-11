import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Info } from 'lucide-react';
import { AUTHORIZATION_PATHWAYS } from '../../constants/dfsa-pathways';
import SelectablePathwayCard from '../../components/dfsa/SelectablePathwayCard';
import { FadeInUpOnScroll } from '../../components/AnimationUtils';

/**
 * Authorisation Page
 * Pathway selection for DFSA Authorisation
 * Displays 5 selectable pathway cards with enhanced visual design
 */
const AuthorisationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const handleSelectPathway = (id: string) => {
    setSelectedPathway(selectedPathway === id ? null : id);
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
              <li className="text-dfsa-red-600 font-semibold">AUTHORISATION</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-12 lg:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Authorisation
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl leading-relaxed">
              Select the regulatory pathway applicable to your proposed
              Financial Services business.
            </p>
          </div>

          {/* Info Box with dfsa-red accent */}
          <div className="bg-gradient-to-r from-dfsa-gold-50/50 to-white border-l-4 border-dfsa-red-600 p-5 md:p-6 rounded-r-xl shadow-sm max-w-4xl mb-12">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <Info className="w-5 h-5 text-dfsa-red-600" />
              </div>
              <div>
                <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                  <span className="font-bold text-dfsa-red-700">Important:</span>{' '}
                  Pathways are mutually exclusive. You may only select one
                  pathway per application.
                </p>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Pathway Cards Grid */}
        <FadeInUpOnScroll delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
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
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setSelectedPathway(null)}
                className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow"
              >
                Clear Selection
              </button>
              <button
                onClick={() => navigate(`/authorisation/${selectedPathway}`)}
                className="px-10 py-3.5 bg-gradient-to-r from-dfsa-gold-600 to-dfsa-gold-700 text-white rounded-xl font-semibold hover:from-dfsa-gold-700 hover:to-dfsa-gold-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Continue with Selected Pathway
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

export default AuthorisationPage;
