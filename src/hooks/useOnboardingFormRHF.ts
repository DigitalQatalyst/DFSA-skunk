/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import { onboardingSchema } from "../pages/dashboard/onboarding/validationSchemas";
import { useAuth } from "../context/UnifiedAuthProvider";
import {
  loadOnboardingData,
  loadOnboardingProgress,
  fetchAndMapProfileToOnboarding,
} from "../services/onboardingService";
import { resetOnboardingIndexedDB } from "../services/idbOnboarding";

interface Step {
  id: string;
  title: string;
  type: string;
  sections?: Array<{
    title: string;
    description?: string;
    fields?: Array<{
      fieldName: string;
      required?: boolean;
    }>;
  }>;
  fields?: Array<{
    fieldName: string;
    required?: boolean;
  }>;
}

export function useOnboardingFormRHF(steps: Step[], onComplete: () => void) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showStepsDropdown, setShowStepsDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stepValidationStatus, setStepValidationStatus] = useState<{
    [key: number]: boolean;
  }>({});
  const [stepValidationTriggers, setStepValidationTriggers] = useState<{
    [key: number]: () => Promise<boolean>;
  }>({});

  const stepsDropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Extract user data for form defaults
  const newUserData = user ? {
    firstName: user.givenName || "",
    lastName: user.familyName || "",
    email: user.email || "",
  } : null;

  // Initialize React Hook Form with combined schema
  const form = useForm({
    resolver: yupResolver(onboardingSchema),
    defaultValues: {
      // Required fields from API schema
      formId: uuidv4(),
      // userId: user?.id || "",
      userId: user?.id || "",
      accountId: "",
      onboardingState: "yes",
      companyName: "",
      industry: "",
      businessType: "",
      companyStage: "",
      contactName:
        newUserData?.firstName && newUserData?.lastName
          ? `${newUserData.firstName} ${newUserData.lastName}`
          : "",
      email: newUserData?.email || "",
      phone: "",

      // Business Details
      registrationNumber: "",
      establishmentDate: "",
      businessSize: "",

      // Business Profile
      businessPitch: "",
      problemStatement: "",

      // Location & Contact
      address: "",
      city: "",
      country: "",
      website: "",

      // Operations
      employeeCount: 0,
      founders: "",
      foundingYear: "",

      // Funding
      initialCapitalUsd: 0,
      fundingNeedsUsd: 0,
      businessRequirements: "",
      businessNeeds: "",
    },
    mode: "onChange",
  });

  const {
    watch,
    formState: { errors, isValid },
    setValue,
    getValues,
  } = form;

  // Subscribe to form values via react-hook-form so we get updates
  // only when fields change. Avoid calling getValues() every render
  // because that returns a new object and can cause excessive re-renders.
  const currentFormData = watch();

  // Track if initial data has been loaded to prevent infinite loops
  const hasInitializedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const lastFormIdRef = useRef<string | null>(null);
  const hasLoadedSavedDataRef = useRef(false);

  // Load initial data and ensure userId and formId are set
  useEffect(() => {
    // Only run once on mount or when user.id changes
    if (hasInitializedRef.current && lastUserIdRef.current === user?.id) {
      return;
    }

    const currentValues = getValues();
    let hasChanges = false;

    // Ensure userId is set when user becomes available
    if (user?.id) {
      const currentUserId = currentValues.userId;
      if (!currentUserId || currentUserId === "") {
        setValue("userId", user.id, { shouldDirty: false });
        hasChanges = true;
      }
      lastUserIdRef.current = user.id;
    }

    // Populate form with user data from auth context (only once)
    if (newUserData && !hasInitializedRef.current) {
      const currentContactName = currentValues.contactName;
      const currentEmail = currentValues.email;

      // Set contact name if not already set
      if (
        (!currentContactName || currentContactName === "") &&
        newUserData.firstName &&
        newUserData.lastName
      ) {
        const fullName = `${newUserData.firstName} ${newUserData.lastName}`;
        console.log("Setting contactName from auth:", fullName);
        setValue("contactName", fullName, { shouldDirty: false });
        hasChanges = true;
      }

      // Set email if not already set
      if ((!currentEmail || currentEmail === "") && newUserData.email) {
        console.log("Setting email from auth:", newUserData.email);
        setValue("email", newUserData.email, { shouldDirty: false });
        hasChanges = true;
      }
    }

    // Ensure formId is set (only once)
    const currentFormId = String(currentValues.formId || "");
    if (!currentFormId || currentFormId === "") {
      const newFormId = uuidv4();
      setValue("formId", newFormId, { shouldDirty: false });
      lastFormIdRef.current = newFormId;
      hasChanges = true;
    } else {
      lastFormIdRef.current = currentFormId;
    }

    // Ensure onboardingState is set to "yes" only if it's not already set
    const currentOnboardingState = currentValues.onboardingState;
    if (currentOnboardingState !== "yes") {
      setValue("onboardingState", "yes", { shouldDirty: false });
      hasChanges = true;
    }

    if (hasChanges) {
      console.log("Initial form data set");
    }

    hasInitializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, user?.id]); // Only depend on user.id, not the whole user object or newUserData

  // Load saved progress/data from storage (IndexedDB/localStorage/mockAPI)
  // and prefill from API if no saved data exists
  useEffect(() => {
    // Only run once - use ref to track if we've already loaded
    if (hasLoadedSavedDataRef.current) {
      return;
    }

    let cancelled = false;
    (async () => {
      hasLoadedSavedDataRef.current = true;
      setLoading(true);
      
      try {
        console.log("🔍 [ONBOARDING FORM] Loading saved progress/data...");
        
        // First, try to load saved progress/data
        const progress = await loadOnboardingProgress();
        const data = progress || (await loadOnboardingData());
        
        if (data && !cancelled) {
          console.log("✅ [ONBOARDING FORM] Found saved data, restoring...");
          // Restore values into the form from saved data
          Object.entries(data).forEach(([key, value]) => {
            if (key === "currentStep") {
              const stepNum = Number(value || 0);
              setCurrentStep(stepNum);
            } else {
              try {
                setValue(key as any, value, { shouldDirty: false });
              } catch (e) {
                // Ignore unknown fields
              }
            }
          });
          console.log("✅ [ONBOARDING FORM] Saved data restored");
        } else if (user?.id && !cancelled) {
          console.log("🔍 [ONBOARDING FORM] No saved data, prefilling from API...");
          // No saved data, try to prefill from API
          const apiData = await fetchAndMapProfileToOnboarding(user.id);
          
          if (apiData && !cancelled) {
            console.log("✅ [ONBOARDING FORM] API data received, prefilling form...");
            // Prefill form with API data
            // Only set values that have actual data from API
            Object.entries(apiData).forEach(([key, value]) => {
              if (value !== undefined && value !== null && value !== "") {
                try {
                  // For numbers, allow 0 as a valid value
                  if (typeof value === "number") {
                    setValue(key as any, value, { shouldDirty: false });
                  } else {
                    // For strings, only set if not empty
                    const stringValue = String(value).trim();
                    if (stringValue !== "") {
                      setValue(key as any, value, { shouldDirty: false });
                    }
                  }
                } catch (e) {
                  // Ignore unknown fields
                }
              }
            });

            // Note: accountId should come from organization data (welcome card), not prefill API
            // Do not set accountId here - it comes from organization data

            // Ensure onboardingState is set to "yes" only if not already set
            const currentOnboardingState = getValues("onboardingState");
            if (currentOnboardingState !== "yes") {
              setValue("onboardingState", "yes", { shouldDirty: false });
            }
            console.log("✅ [ONBOARDING FORM] Form prefilled from API");
          }
        }
      } catch (e) {
        console.error("❌ [ONBOARDING FORM] Failed to load saved onboarding progress:", e);
        hasLoadedSavedDataRef.current = false; // Allow retry on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        stepsDropdownRef.current &&
        !stepsDropdownRef.current.contains(event.target)
      ) {
        setShowStepsDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validate current step
  const validateCurrentStep = async () => {
    if (currentStep === 0) return true; // Welcome step - always valid
    if (currentStep === steps.length - 1) return true; // Review step

    // Use the step's own validation trigger if available
    const stepTrigger = stepValidationTriggers[currentStep];
    if (stepTrigger) {
      const result = await stepTrigger();
      return result;
    }

    // Fallback to checking step validation status
    const statusResult = stepValidationStatus[currentStep];
    return statusResult;
  };

  // Get step completion status
  const getStepCompletionStatus = (stepIndex: number): boolean => {
    if (stepIndex === 0 || stepIndex === steps.length - 1) return true;

    const step = steps[stepIndex];
    const fields: Array<{ fieldName: string; required?: boolean }> = [];

    if (step.sections) {
      step.sections.forEach((section) => {
        if (section.fields) fields.push(...section.fields);
      });
    } else if (step.fields) {
      fields.push(...step.fields);
    }

    return fields.every((field) => {
      if (!field.required) return true;

      const value: any = getValues(field.fieldName as any);
      return (
        value && (typeof value !== "string" || (value as string).trim() !== "")
      );
    });
  };

  // Handle step data change
  const handleStepDataChange = useCallback(
    (stepData: any) => {
      Object.entries(stepData).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    },
    [setValue]
  );

  // Handle step validation change
  const handleStepValidationChange = useCallback(
    (isValid: boolean) => {
      // Track individual step validation status
      setStepValidationStatus((prev) => ({
        ...prev,
        [currentStep]: isValid,
      }));
    },
    [currentStep]
  );

  // Register step validation trigger
  const registerStepValidationTrigger = useCallback(
    (triggerFn: () => Promise<boolean>) => {
      setStepValidationTriggers((prev) => ({
        ...prev,
        [currentStep]: triggerFn,
      }));
    },
    [currentStep]
  );

  // Simple form submission function
  const handleSubmit = useCallback(async () => {
    try {
      console.log("🚀 [ONBOARDING SUBMIT] Starting form submission...");
      setLoading(true);

      // Get all form data and generate new UUID for this submission
      const formData = getValues();
      console.log("📋 [ONBOARDING SUBMIT] Initial form data:", formData);
      
      // Validate required fields before submission
      const requiredFields = [
        'userId',
        'companyName',
        'industry',
        'companyStage',
        'contactName',
        'email',
        'phone',
        'businessPitch',
        'problemStatement',
        'address',
        'city',
        'country',
        'employeeCount',
        'founders',
        'foundingYear',
        'initialCapitalUsd',
        'businessRequirements',
        'businessNeeds'
      ];
      
      const missingFields = requiredFields.filter(field => {
        const value = formData[field as keyof typeof formData];
        if (field === 'employeeCount' || field === 'initialCapitalUsd') {
          return value === undefined || value === null;
        }
        return !value || (typeof value === 'string' && value.trim() === '');
      });
      
      if (missingFields.length > 0) {
        console.error("❌ [ONBOARDING SUBMIT] Missing required fields:", missingFields);
        console.error("❌ [ONBOARDING SUBMIT] Form data values:", Object.entries(formData).map(([key, value]) => ({ key, value, type: typeof value })));
        alert(`Please fill in all required fields. Missing: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Prepare submission data
      formData.formId = uuidv4(); // Generate new UUID for each submission
      formData.userId = user?.id || ""; // Ensure we have the current userId
      formData.onboardingState = "yes"; // Hardcode onboardingState to "yes"
      // Note: accountId should already be set from organization data (welcome card)

      // Validate accountId is present (required by schema)
      const accountId = String(formData.accountId || "").trim();
      if (!accountId) {
        console.error("❌ [ONBOARDING SUBMIT] Missing accountId - this is required!");
        alert("Account ID is missing. Please ensure you've selected an organization from the Welcome step.");
        setLoading(false);
        return;
      }
      formData.accountId = accountId; // Ensure it's a string

      // Validate using yup schema before submission
      try {
        console.log("🔍 [ONBOARDING SUBMIT] Validating form data with schema...");
        await onboardingSchema.validate(formData, { abortEarly: false });
        console.log("✅ [ONBOARDING SUBMIT] Schema validation passed");
      } catch (validationError: any) {
        console.error("❌ [ONBOARDING SUBMIT] Schema validation failed:", validationError);
        if (validationError.errors) {
          const errorMessages = validationError.errors.join("\n");
          console.error("❌ [ONBOARDING SUBMIT] Validation errors:", errorMessages);
          alert(`Form validation failed:\n\n${errorMessages}\n\nPlease fix these errors and try again.`);
        } else {
          alert(`Form validation failed: ${validationError.message}\n\nPlease check all required fields and try again.`);
        }
        setLoading(false);
        return;
      }

      console.log("📤 [ONBOARDING SUBMIT] Submitting data to API:", {
        url: "https://kfrealexpressserver.vercel.app/api/v1/auth/onboarding",
        method: "POST",
        dataKeys: Object.keys(formData),
        dataPreview: {
          userId: formData.userId,
          companyName: formData.companyName,
          accountId: formData.accountId,
          formId: formData.formId,
          onboardingState: formData.onboardingState,
        },
        fullData: formData
      });

      const response = await fetch(
        "https://kfrealexpressserver.vercel.app/api/v1/auth/onboarding",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("📥 [ONBOARDING SUBMIT] API Response status:", response.status, response.statusText);
      console.log("📥 [ONBOARDING SUBMIT] API Response headers:", Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const responseData = await response.json().catch(() => ({}));
        console.log("✅ [ONBOARDING SUBMIT] Success! Response data:", responseData);
        // Success - complete onboarding
        // Note: Onboarding status is now managed via API, not localStorage
        // The onComplete callback will trigger a refetch of onboarding status from API
        console.log("✅ [ONBOARDING SUBMIT] Onboarding submitted successfully - status will be checked via API");
        onComplete();
        await resetOnboardingIndexedDB();
        console.log("✅ [ONBOARDING SUBMIT] Onboarding completed and IndexedDB reset");
      } else {
        // Handle error - get error details
        let errorData;
        try {
          errorData = await response.json();
          console.error("❌ [ONBOARDING SUBMIT] API Error Response:", errorData);
        } catch (e) {
          const errorText = await response.text().catch(() => "Unknown error");
          console.error("❌ [ONBOARDING SUBMIT] API Error (non-JSON):", errorText);
          errorData = { message: errorText || `HTTP ${response.status}: ${response.statusText}` };
        }
        
        const errorMessage = errorData?.message || errorData?.error || `HTTP ${response.status}: ${response.statusText}`;
        console.error("❌ [ONBOARDING SUBMIT] Full error details:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
          submittedData: formData
        });
        
        alert(`Failed to submit form: ${errorMessage}\n\nPlease check the console for more details.`);
      }
    } catch (error) {
      console.error("❌ [ONBOARDING SUBMIT] Exception during submission:", error);
      console.error("❌ [ONBOARDING SUBMIT] Error stack:", error instanceof Error ? error.stack : "No stack trace");
      console.error("❌ [ONBOARDING SUBMIT] Error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        formData: getValues()
      });
      
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      alert(`An error occurred: ${errorMessage}\n\nPlease check the console for more details.`);
    } finally {
      setLoading(false);
      console.log("🏁 [ONBOARDING SUBMIT] Submission process completed");
    }
  }, [getValues, onComplete, user]);

  // Handle jump to step
  const handleJumpToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex !== currentStep) {
        setCurrentStep(stepIndex);
        window.scrollTo(0, 0);
        setShowStepsDropdown(false);
      }
    },
    [currentStep]
  );

  return {
    // Form state
    currentStep,
    formData: currentFormData,
    errors,
    isValid,
    showStepsDropdown,
    loading,
    stepsDropdownRef,

    // Form methods
    form,
    watch,
    setValue,
    getValues,

    // Actions
    setCurrentStep,
    setShowStepsDropdown,
    validateCurrentStep,
    handleStepDataChange,
    handleStepValidationChange,
    registerStepValidationTrigger,
    handleSubmit,
    handleJumpToStep,
    getStepCompletionStatus,
  };
}
