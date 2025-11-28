import React from "react";
import { X } from "lucide-react";
import { SteppedForm } from "../../../pages/dashboard/onboarding/dfsa/SteppedForm";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  if (!isOpen) return null;

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleComplete = () => {
    onClose();
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-transparent w-full max-w-6xl my-8 mx-auto relative"
        onClick={handleModalClick}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900 bg-white rounded-full p-2 shadow-lg transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* SteppedForm component */}
        <div className="pt-8">
          <SteppedForm onComplete={handleComplete} isModal={true} />
        </div>
      </div>
    </div>
  );
};
