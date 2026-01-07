import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  details?: string[];
}

interface StepsCarouselProps {
  steps: Step[];
}

export const StepsCarousel: React.FC<StepsCarouselProps> = ({ steps }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
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

  if (!steps || steps.length === 0) return null;

  const currentStep = steps[currentIndex];

  return (
    <div className="flex flex-col gap-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-xs font-medium text-gray-600 px-2">
        Process Steps ({currentIndex + 1} of {steps.length})
      </div>

      {/* Swipable Step Card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 min-h-[300px] flex flex-col justify-between cursor-grab active:cursor-grabbing transition-all duration-300"
      >
        {/* Step Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold">
              {currentIndex + 1}
            </div>
            <h3 className="text-2xl font-bold text-blue-900">{currentStep.title}</h3>
          </div>
          <p className="text-gray-700 text-base leading-relaxed">{currentStep.description}</p>
        </div>

        {/* Step Details */}
        {currentStep.details && currentStep.details.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">Details:</p>
            <ul className="space-y-2">
              {currentStep.details.map((detail, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progress Indicators */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-blue-200">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-blue-500 w-6' : 'bg-blue-200 w-2'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500">Swipe to navigate</p>
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

        <div className="flex gap-1">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                idx === currentIndex
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {idx < currentIndex ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>

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
