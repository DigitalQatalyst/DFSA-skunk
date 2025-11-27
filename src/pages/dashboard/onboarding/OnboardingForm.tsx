// /home/wanja/Documents/DQ/KF/UAT/MZN-EJP-v2/src/pages/dashboard/onboarding/OnboardingForm.tsx

import { Step1 } from "./step1";
import { Step2 } from "./step2";
import { Step3 } from "./step3";
import { Step4 } from "./step4";
import { Step5 } from "./step5";
import { ProgressIndicator } from "./progressIndicator";

import { ArrowLeftIcon } from "lucide-react";
import { onboardingSteps } from "../../../config/onboardingSteps";
import { useAutoSave } from "../../../hooks/useAutoSave";
import { useOnboardingFormRHF } from "../../../hooks/useOnboardingFormRHF";
import { ReviewStep } from "../../../steps/ReviewStep";
import { WelcomeStep } from "../../../steps/WelcomeStep";
import { StepNavigation } from "../../../components/NavigationButtons";
import { useCallback, useMemo, useEffect, useRef } from "react";
import { useOrganizationInfo } from "../../../hooks/useOrganizationInfo";
import { useNavigate } from "react-router-dom";
import { useUnifiedAuthFlow } from "../../../hooks/useUnifiedAuthFlow";
import { invalidateOnboardingStatus, setOnboardingStatusCache } from "../../../hooks/useOnboardingStatus";

interface OnboardingFormProps {
  onComplete: () => void;
  isRevisit?: boolean;
}

export function OnboardingForm({
  onComplete,
  isRevisit = false,
}: OnboardingFormProps) {
  // Fetch organization info from API
  const { organization, isLoading: isLoadingOrg } = useOrganizationInfo();
  const { refetchOnboarding } = useUnifiedAuthFlow();
  const navigate = useNavigate();

  // Custom hooks for state management
  const {
    currentStep,
    formData,
    loading,
    showStepsDropdown,
    setCurrentStep,
    setShowStepsDropdown,
    validateCurrentStep,
    handleStepDataChange,
    handleStepValidationChange,
    registerStepValidationTrigger,
    handleSubmit: submitForm,
    getStepCompletionStatus,
  } = useOnboardingFormRHF(onboardingSteps, onComplete);

  const { autoSaving, progressSaved, saveProgress } = useAutoSave(
    formData,
    currentStep
  );

  // Set accountId and prepopulate fields from organization data when available
  // Use ref to track if we've already applied organization data to prevent loops
  const hasAppliedOrgDataRef = useRef(false);
  const lastOrgIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!organization) return;

    // Only run once per organization (check if organization.accountId changed)
    const currentOrgId = organization.accountId || null;
    if (hasAppliedOrgDataRef.current && lastOrgIdRef.current === currentOrgId) {
      return;
    }

    const updates: Record<string, any> = {};

    // Always set accountId
    if (organization.accountId) {
      updates.accountId = organization.accountId;
    }

    // Prepopulate Company Name if not already set
    if (!formData.companyName && (organization.accountName || organization.kf_enterprisename)) {
      updates.companyName = organization.accountName || organization.kf_enterprisename;
    }

    // Prepopulate Industry if not already set
    if (!formData.industry && organization.industry) {
      updates.industry = organization.industry;
    }

    // TEMPORARY FIX: Prepopulate Company Stage with safe fallback to "Start Up"
    // Check multiple possible fields for company stage
    const orgCompanyStage =
      (organization as any).companyStage ||
      (organization as any).kf_cf_businesslifecyclestage ||
      (organization as any).department;

    // MODIFIED: Only set companyStage if we have organization data to map from
    // This prevents auto-save from creating partial records with just "Start Up"
    if (!formData.companyStage && orgCompanyStage) {
      // Map the organization company stage to step1 dropdown format
      // This mapping converts profileConfig format (startup, growth, etc.) to step1 format (Start Up, Scale Up, Expansion)
      const validStages = ["Start Up", "Scale Up", "Expansion"];
      const stageMapping: Record<string, string> = {
        "startup": "Start Up",
        "growth": "Scale Up",
        "mature": "Expansion",
        "enterprise": "Expansion",
      };

      const lowerStage = String(orgCompanyStage).toLowerCase().trim();
      const mappedStage = stageMapping[lowerStage];

      // Only use mapped stage if it's valid, otherwise don't set it (let step1 handle the default)
      if (mappedStage && validStages.includes(mappedStage)) {
        updates.companyStage = mappedStage;
      }
    }

    // Prepopulate Contact Name if not already set
    if (!formData.contactName && organization.fullname) {
      updates.contactName = organization.fullname;
    }

    // Prepopulate Email if not already set
    if (!formData.email && organization.email) {
      updates.email = organization.email;
    }

    // Prepopulate Phone if not already set
    if (!formData.phone && (organization.mobilephone || organization.phone)) {
      updates.phone = organization.mobilephone || organization.phone;
    }

    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      handleStepDataChange(updates);
      hasAppliedOrgDataRef.current = true;
      lastOrgIdRef.current = currentOrgId;
    }
  }, [organization, formData.companyName, formData.industry, formData.companyStage, formData.contactName, formData.email, formData.phone, handleStepDataChange]);

  // Ensure onboardingState is always "yes"
  useEffect(() => {
    if (formData.onboardingState !== "yes") {
      handleStepDataChange({ onboardingState: "yes" });
    }
  }, [formData.onboardingState, handleStepDataChange]);

  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      await saveProgress();
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    } else {
      // Scroll to first error field
      const firstErrorElement = document.querySelector(".border-red-300");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [validateCurrentStep, saveProgress, currentStep, setCurrentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  }, [currentStep, setCurrentStep]);

  const handleSubmit = useCallback(async () => {
    if (isRevisit) {
      onComplete();
      return;
    }

    // TEMPORARY FIX: Final safety check for companyStage before submission
    // Ensure companyStage has a valid value to prevent validation errors
    const validStages = ["Start Up", "Scale Up", "Expansion"];
    const currentStage = formData.companyStage;
    if (!currentStage || !validStages.includes(currentStage)) {
      // Force set to "Start Up" if invalid or missing
      handleStepDataChange({ ...formData, companyStage: "Start Up" });
    }

    try {
      await submitForm();
    } catch (error) {
      return;
    }

    // Optimistically update cache to 'completed' for immediate UI feedback
    if (organization?.accountId) {
      setOnboardingStatusCache(organization.accountId, 'completed');
    }

    // Invalidate and refetch onboarding status to ensure consistency
    if (organization?.accountId) {
      invalidateOnboardingStatus(organization.accountId);
    }
    await refetchOnboarding();

    // Call onComplete callback and navigate to overview
    // The unified flow hook will also handle automatic redirects, but we do it here for immediate feedback
    onComplete();
    navigate("/dashboard/overview", { replace: true });
  }, [isRevisit, onComplete, submitForm, refetchOnboarding, navigate, organization?.accountId, formData, handleStepDataChange]);

  // Helper function to safely convert to string
  const safeString = useCallback((value: unknown): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    return "";
  }, []);

  // Memoize step data objects to prevent unnecessary re-renders
  const step1FormData = useMemo(
    () => ({
      formId: safeString(formData.formId) || "",
      userId: safeString(formData.userId) || "",
      accountId: safeString(formData.accountId) || "",
      onboardingState: safeString(formData.onboardingState) || "yes",
      companyName: safeString(formData.companyName) || "",
      industry: safeString(formData.industry) || "",
      businessType: safeString(formData.businessType) || "",
      companyStage: safeString(formData.companyStage) || "",
      contactName: safeString(formData.contactName) || "",
      email: safeString(formData.email) || "",
      phone: safeString(formData.phone) || "",
      registrationNumber: safeString(formData.registrationNumber) || "",
      establishmentDate: safeString(formData.establishmentDate) || "",
      businessSize: safeString(formData.businessSize) || "",
    }),
    [
      formData.formId,
      formData.userId,
      formData.accountId,
      formData.onboardingState,
      formData.companyName,
      formData.industry,
      formData.businessType,
      formData.companyStage,
      formData.contactName,
      formData.email,
      formData.phone,
      formData.registrationNumber,
      formData.establishmentDate,
      formData.businessSize,
      safeString,
    ]
  );

  const step2FormData = useMemo(
    () => ({
      businessPitch: safeString(formData.businessPitch) || "",
      problemStatement: safeString(formData.problemStatement) || "",
    }),
    [formData.businessPitch, formData.problemStatement, safeString]
  );

  const step3FormData = useMemo(
    () => ({
      address: safeString(formData.address) || "",
      city: safeString(formData.city) || "",
      country: safeString(formData.country) || "",
      website: safeString(formData.website) || "",
    }),
    [
      formData.address,
      formData.city,
      formData.country,
      formData.website,
      safeString,
    ]
  );

  const step4FormData = useMemo(
    () => ({
      employeeCount: Number(formData.employeeCount) || 0,
      founders: safeString(formData.founders) || "",
      foundingYear: safeString(formData.foundingYear) || "",
    }),
    [
      formData.employeeCount,
      formData.founders,
      formData.foundingYear,
      safeString,
    ]
  );

  const step5FormData = useMemo(
    () => ({
      initialCapitalUsd: Number(formData.initialCapitalUsd) || 0,
      fundingNeedsUsd: Number(formData.fundingNeedsUsd) || 0,
      businessRequirements: safeString(formData.businessRequirements) || "",
      businessNeeds: safeString(formData.businessNeeds) || "",
    }),
    [
      formData.initialCapitalUsd,
      formData.fundingNeedsUsd,
      formData.businessRequirements,
      formData.businessNeeds,
      safeString,
    ]
  );

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep];
    switch (step.type) {
      case "welcome": {
        // Helper function to safely convert to string, handling null/undefined
        const safeString = (value: unknown): string => {
          if (value === null || value === undefined) return "";
          if (typeof value === "string") return value;
          if (typeof value === "number" || typeof value === "boolean") {
            return String(value);
          }
          return "";
        };

        // Get values with fallback priority: formData > organization > empty string
        const tradeName =
          safeString(formData.companyName) ||
          safeString(organization?.accountName) ||
          safeString(organization?.kf_enterprisename) ||
          "";
        const industry =
          safeString(formData.industry) ||
          safeString(organization?.industry) ||
          "";
        const companyStage = 
          safeString(formData.companyStage) || 
          safeString((organization as any)?.companyStage) || 
          "";
        const contactName =
          safeString(formData.contactName) ||
          safeString(organization?.fullname) ||
          "";
        const email =
          safeString(formData.email) || safeString(organization?.email) || "";
        const phone =
          safeString(formData.phone) ||
          safeString(organization?.mobilephone) ||
          safeString(organization?.phone) ||
          "";

        return (
          <WelcomeStep
            formData={{
              tradeName,
              industry,
              companyStage,
              contactName,
              email,
              phone,
            }}
            isRevisit={isRevisit}
            isLoading={isLoadingOrg}
            organization={organization}
          />
        );
      }

      case "review":
        return <ReviewStep formData={formData} isRevisit={isRevisit} />;

      case "form":
        // Use specific step components based on step ID
        switch (step.id) {
          case "business":
            return (
              <Step1
                formData={step1FormData}
                onDataChange={handleStepDataChange}
                onValidationChange={handleStepValidationChange}
                onValidationTrigger={registerStepValidationTrigger}
                organizationData={organization} // Pass organization data for read-only logic
              />
            );
          case "profile":
            return (
              <Step2
                formData={step2FormData}
                onDataChange={handleStepDataChange}
                onValidationChange={handleStepValidationChange}
                onValidationTrigger={registerStepValidationTrigger}
              />
            );

          case "location":
            return (
              <Step3
                formData={step3FormData}
                onDataChange={handleStepDataChange}
                onValidationChange={handleStepValidationChange}
                onValidationTrigger={registerStepValidationTrigger}
              />
            );

          case "operations":
            return (
              <Step4
                formData={step4FormData}
                onDataChange={handleStepDataChange}
                onValidationChange={handleStepValidationChange}
                onValidationTrigger={registerStepValidationTrigger}
              />
            );

          case "funding":
            return (
              <Step5
                formData={step5FormData}
                onDataChange={handleStepDataChange}
                onValidationChange={handleStepValidationChange}
                onValidationTrigger={registerStepValidationTrigger}
              />
            );
          default:
            return null;
        }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 md:py-20">
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6">
        {/* Back to Dashboard button (only when revisiting) */}
        {isRevisit && (
          <div className="mb-6">
            <button
              onClick={onComplete}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeftIcon size={16} className="mr-1" />
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <ProgressIndicator
          steps={onboardingSteps}
          currentStep={currentStep}
          showStepsDropdown={showStepsDropdown}
          autoSaving={autoSaving}
          progressSaved={progressSaved}
          onToggleDropdown={() => setShowStepsDropdown(!showStepsDropdown)}
          getStepCompletionStatus={getStepCompletionStatus}
        />

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-10 relative">
          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation */}
          <StepNavigation
            currentStep={currentStep}
            totalSteps={onboardingSteps.length}
            loading={loading}
            isRevisit={isRevisit}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSaveProgress={saveProgress}
            onSubmit={handleSubmit}
            savingProgress={autoSaving}
          />
        </div>
      </div>
    </div>
  );
}