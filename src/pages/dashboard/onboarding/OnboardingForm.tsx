// /home/wanja/Documents/DQ/KF/UAT/MZN-EJP-v2/src/pages/dashboard/onboarding/OnboardingForm.tsx

import { SteppedForm } from "./dfsa/SteppedForm";

interface OnboardingFormProps {
  onComplete: () => void;
  isRevisit?: boolean;
}

export function OnboardingForm({
  onComplete,
  isRevisit = false,
}: OnboardingFormProps) {
  // Simply render the DFSA SteppedForm component
  // All form logic is now self-contained in the SteppedForm

  return <SteppedForm onComplete={onComplete} />;
}