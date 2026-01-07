import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';

interface LicenseCard {
  id: string;
  title: string;
  description: string;
  minCapital?: string;
  eligibility: string[];
  nextSteps: string[];
}

interface LicenseRecommendationCardProps {
  cards: LicenseCard[];
  onSelect: (cardId: string) => void;
}

export const LicenseRecommendationCard: React.FC<LicenseRecommendationCardProps> = ({
  cards,
  onSelect,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStart - touchEnd > 50) {
      handleNext();
    }
    if (touchEnd - touchStart > 50) {
      handlePrev();
    }
  };

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col gap-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-xs font-medium text-gray-600 px-2">
        License Recommendations ({currentIndex + 1} of {cards.length})
      </div>

      {/* Swipable Card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary rounded-xl p-6 min-h-[400px] flex flex-col justify-between cursor-grab active:cursor-grabbing transition-all duration-300"
      >
        {/* Card Header */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-primary mb-2">{currentCard.title}</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{currentCard.description}</p>
        </div>

        {/* Minimum Capital */}
        {currentCard.minCapital && (
          <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Minimum Capital Required</p>
            <p className="text-lg font-bold text-primary">{currentCard.minCapital}</p>
          </div>
        )}

        {/* Eligibility Criteria */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            Eligibility Criteria
          </p>
          <ul className="space-y-1">
            {currentCard.eligibility.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            Next Steps
          </p>
          <ol className="space-y-1">
            {currentCard.nextSteps.map((step, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex gap-2">
                <span className="text-primary font-bold">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Navigation Indicators */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="flex gap-1">
            {cards.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-primary w-6' : 'bg-gray-300 w-2'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500">Swipe or use arrows</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2 justify-between">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={() => onSelect(currentCard.id)}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          Select This License
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
