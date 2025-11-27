// /home/wanja/Documents/DQ/KF/UAT/MZN-EJP-v2/src/pages/dashboard/onboarding/step1.tsx

import React from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircleIcon } from "lucide-react";
import { businessDetailsSchema } from "./validationSchemas";
import { useAuth } from "../../../components/Header";
import { profileConfig } from "../../../utils/profileConfig";

interface FormData {
  formId: string;
  userId: string;
  accountId: string;
  onboardingState: string;
  companyName: string;
  industry: string;
  businessType: string;
  companyStage: string;
  contactName: string;
  email: string;
  phone: string;
  registrationNumber: string;
  establishmentDate: string;
  businessSize: string;
}

interface Step1Props {
  formData: FormData;
  onDataChange: (data: FormData) => void;
  onValidationChange: (isValid: boolean) => void;
  onValidationTrigger?: (triggerFn: () => Promise<boolean>) => void;
  organizationData?: any; // Add organization data prop
}

export function Step1({
  formData,
  onDataChange,
  onValidationChange,
  onValidationTrigger,
  organizationData,
}: Step1Props) {
  const { newUserData } = useAuth();
  
  // Helper function to map company stage value to step1 dropdown format
  // Maps profileConfig ids (startup, growth, etc.) to step1 dropdown values
  const mapCompanyStageToDropdownValue = React.useCallback((stageValue: string): string => {
    if (!stageValue) return "";
    
    // First check if it's already a step1 dropdown value
    const step1Values = ["Start Up", "Scale Up", "Expansion"];
    if (step1Values.includes(stageValue)) {
      return stageValue;
    }
    
    // Map profileConfig ids to step1 dropdown values
    const stageMapping: Record<string, string> = {
      "startup": "Start Up",
      "growth": "Scale Up",
      "mature": "Expansion",
      "enterprise": "Expansion", // Map enterprise to Expansion as closest match
    };
    
    // Try to find by id (case-insensitive)
    const lowerValue = stageValue.toLowerCase();
    if (stageMapping[lowerValue]) {
      return stageMapping[lowerValue];
    }
    
    // Try to find by label (case-insensitive)
    const stageByLabel = profileConfig.companyStages.find(
      (s) => s.label.toLowerCase() === lowerValue
    );
    if (stageByLabel && stageMapping[stageByLabel.id]) {
      return stageMapping[stageByLabel.id];
    }
    
    // If no match, return original value (might work if it matches dropdown)
    return stageValue;
  }, []);
  
  // TEMPORARY FIX: Validate and normalize companyStage to prevent validation errors
  // If value is null, undefined, empty, or invalid, default to "Start Up"
  const normalizeCompanyStage = (value: any): string => {
    const validStages = ["Start Up", "Scale Up", "Expansion"];
    if (!value || typeof value !== "string" || value.trim() === "") {
      return "Start Up";
    }
    const trimmedValue = value.trim();
    return validStages.includes(trimmedValue) ? trimmedValue : "Start Up";
  };

  const {
    control,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(businessDetailsSchema) as Resolver<FormData>,
    defaultValues: {
      formId: formData.formId || "",
      userId: formData.userId || "",
      accountId: formData.accountId || "",
      onboardingState: formData.onboardingState || "yes",
      companyName: formData.companyName || "",
      industry: formData.industry || "",
      businessType: formData.businessType || "",
      companyStage: normalizeCompanyStage(formData.companyStage), // TEMPORARY FIX: Safe fallback
      contactName: formData.contactName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      registrationNumber: formData.registrationNumber || "",
      establishmentDate: formData.establishmentDate || "",
      businessSize: formData.businessSize || "",
    },
    mode: "onBlur",
  });

  // TEMPORARY FIX: Ensure company stage always has a valid value (runs when formData changes)
  // MODIFIED: Only update if the current value is truly invalid (not just empty on first load)
  React.useEffect(() => {
    // Only normalize if there's an actual invalid value, not if it's just empty initially
    if (formData.companyStage && formData.companyStage.trim() !== "") {
      const normalizedValue = normalizeCompanyStage(formData.companyStage);
      // If the normalized value is different from current, update it
      if (formData.companyStage !== normalizedValue) {
        setValue("companyStage", normalizedValue);
        onDataChange({ ...formData, companyStage: normalizedValue });
      }
    }
  }, [formData.companyStage, setValue, onDataChange]); // FIXED: Removed formData to prevent loop

  // Update form values when formData changes from parent
  // Use a ref to track if we've already processed this formData to prevent loops
  const formDataRef = React.useRef(formData);
  React.useEffect(() => {
    // Only update if formData actually changed (not same reference)
    if (formDataRef.current === formData) {
      return;
    }
    formDataRef.current = formData;

    console.log("Step1 received formData:", formData);
    console.log("Step1 organizationData:", organizationData);
    Object.entries(formData).forEach(([key, value]) => {
      // Special handling for companyStage - map to dropdown format and normalize
      if (key === "companyStage") {
        // TEMPORARY FIX: Always normalize companyStage value
        const mappedValue = value ? mapCompanyStageToDropdownValue(value as string) : "";
        const normalizedValue = normalizeCompanyStage(mappedValue);
        setValue(key as keyof FormData, normalizedValue);
      } else {
        setValue(key as keyof FormData, value);
      }
    });
  }, [formData, setValue, organizationData, mapCompanyStageToDropdownValue]);

  // Update form values with user data when available
  React.useEffect(() => {
    if (newUserData?.firstName && newUserData?.lastName) {
      const fullName = `${newUserData.firstName} ${newUserData.lastName}`;
      if (!formData.contactName) {
        setValue("contactName", fullName);
        onDataChange({ ...formData, contactName: fullName });
      }
    }
    if (newUserData?.email && !formData.email) {
      setValue("email", newUserData.email);
      onDataChange({ ...formData, email: newUserData.email });
    }
  }, [newUserData, setValue, onDataChange, formData.contactName, formData.email]); // FIXED: Only watch specific fields

  // Watch for form changes and update parent
  React.useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value as FormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  // Update validation status when errors change
  React.useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange, errors]);

  // Expose validation trigger function to parent
  React.useEffect(() => {
    if (onValidationTrigger) {
      onValidationTrigger(async () => {
        const result = await trigger();
        return result;
      });
    }
  }, [trigger, onValidationTrigger]);

  const renderTooltip = (tooltipText: string) => {
    return (
      <div className="group relative inline-block ml-1">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400 cursor-help"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <div className="absolute z-10 w-64 p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-1/2 transform -translate-x-1/2 mb-1 pointer-events-none">
          {tooltipText}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
        </div>
      </div>
    );
  };

  // Helper function to check if a field should be read-only
  const isFieldReadOnly = (fieldName: keyof FormData): boolean => {
    // Company Name - read-only if populated from organization
    if (fieldName === "companyName") {
      return !!(
        formData.companyName &&
        (organizationData?.accountName || organizationData?.kf_enterprisename)
      );
    }

    // Company Stage - read-only if populated from organization
    if (fieldName === "companyStage") {
      // Check if we have company stage from organization (could be in different fields)
      const orgStage = 
        organizationData?.companyStage || 
        organizationData?.kf_cf_businesslifecyclestage ||
        organizationData?.department;
      return !!(formData.companyStage && orgStage);
    }

    // Contact Name - read-only if from user data OR organization
    if (fieldName === "contactName") {
      return !!(
        (newUserData?.firstName && newUserData?.lastName) ||
        (formData.contactName && organizationData?.fullname)
      );
    }

    // Email - read-only if from user data OR organization
    if (fieldName === "email") {
      return !!(
        newUserData?.email || (formData.email && organizationData?.email)
      );
    }

    // Phone - read-only if populated from organization
    if (fieldName === "phone") {
      return !!(
        formData.phone &&
        (organizationData?.mobilephone || organizationData?.phone)
      );
    }

    return false;
  };

  // Helper to get read-only helper text
  const getReadOnlyHelperText = (fieldName: keyof FormData): string => {
    if (isFieldReadOnly(fieldName)) {
      if (fieldName === "contactName" || fieldName === "email") {
        if (newUserData?.firstName || newUserData?.email) {
          return "Populated from your account information";
        }
      }
      return "Populated from your organization profile";
    }
    return "";
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Business Details
        </h2>
        <p className="text-gray-600">
          Please provide the following essential details
        </p>
      </div>

      <div className="space-y-10">
        {/* Company Identity Section */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-lg font-medium text-gray-800">
              Company Identity
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Basic information about your business
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Company Name Field - READ ONLY */}
            <div className="space-y-2">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your company name"
                    disabled={isFieldReadOnly("companyName")}
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.companyName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } ${
                      isFieldReadOnly("companyName")
                        ? "bg-gray-100 cursor-not-allowed text-gray-700"
                        : ""
                    }`}
                  />
                )}
              />
              {errors.companyName && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.companyName.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {getReadOnlyHelperText("companyName") ||
                  "Your official company name"}
              </p>
            </div>

            {/* Industry Field - EDITABLE */}
            <div className="space-y-2">
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-gray-700"
              >
                Industry
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your industry"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.industry
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.industry && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.industry.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                The industry your business operates in
              </p>
            </div>

            {/* Business Type Field */}
            <div className="space-y-2">
              <label
                htmlFor="businessType"
                className="block text-sm font-medium text-gray-700"
              >
                Business Type
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="businessType"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.businessType
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select business type</option>
                    <option value="Technology">Technology</option>
                    <option value="Retail">Retail</option>
                    <option value="Services">Services</option>
                    <option value="Others">Others</option>
                  </select>
                )}
              />
              {errors.businessType && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.businessType.message}</span>
                </div>
              )}
            </div>

            {/* Company Stage Field - READ ONLY */}
            <div className="space-y-2">
              <label
                htmlFor="companyStage"
                className="block text-sm font-medium text-gray-700"
              >
                Company Stage
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="companyStage"
                control={control}
                render={({ field }) => {
                  // TEMPORARY FIX: Map and normalize the value to ensure it's always valid
                  const mappedValue = field.value ? mapCompanyStageToDropdownValue(field.value) : "";
                  const displayValue = normalizeCompanyStage(mappedValue);

                  return (
                    <select
                      {...field}
                      value={displayValue}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        field.onChange(selectedValue);
                        // Update parent with the selected value
                        onDataChange({ ...formData, companyStage: selectedValue });
                      }}
                      disabled={isFieldReadOnly("companyStage")}
                      className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.companyStage
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } ${
                        isFieldReadOnly("companyStage")
                          ? "bg-gray-100 cursor-not-allowed text-gray-700"
                          : ""
                      }`}
                    >
                      <option value="">Select company stage</option>
                      <option value="Start Up">Start Up</option>
                      <option value="Scale Up">Scale Up</option>
                      <option value="Expansion">Expansion</option>
                    </select>
                  );
                }}
              />
              {errors.companyStage && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.companyStage.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {getReadOnlyHelperText("companyStage") || "Select your company's current stage"}
              </p>
            </div>

            {/* Contact Name Field - READ ONLY */}
            <div className="space-y-2">
              <label
                htmlFor="contactName"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Name
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="contactName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter contact person name"
                    disabled={isFieldReadOnly("contactName")}
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.contactName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } ${
                      isFieldReadOnly("contactName")
                        ? "bg-gray-100 cursor-not-allowed text-gray-700"
                        : ""
                    }`}
                  />
                )}
              />
              {errors.contactName && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.contactName.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {getReadOnlyHelperText("contactName") ||
                  "Primary contact person for this application"}
              </p>
            </div>

            {/* Email Field - READ ONLY */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder="Enter email address"
                    disabled={isFieldReadOnly("email")}
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } ${
                      isFieldReadOnly("email")
                        ? "bg-gray-100 cursor-not-allowed text-gray-700"
                        : ""
                    }`}
                  />
                )}
              />
              {errors.email && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.email.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {getReadOnlyHelperText("email") ||
                  "Primary email address for communication"}
              </p>
            </div>

            {/* Phone Field - READ ONLY */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    placeholder="Enter phone number"
                    disabled={isFieldReadOnly("phone")}
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } ${
                      isFieldReadOnly("phone")
                        ? "bg-gray-100 cursor-not-allowed text-gray-700"
                        : ""
                    }`}
                  />
                )}
              />
              {errors.phone && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.phone.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {getReadOnlyHelperText("phone") ||
                  "Primary phone number for contact"}
              </p>
            </div>

            {/* Registration Number Field */}
            <div className="space-y-2">
              <label
                htmlFor="registrationNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Registration Number
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="registrationNumber"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your registration number"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.registrationNumber
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.registrationNumber && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.registrationNumber.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Your official business registration number
              </p>
            </div>

            {/* Establishment Date Field */}
            <div className="space-y-2">
              <label
                htmlFor="establishmentDate"
                className="block text-sm font-medium text-gray-700"
              >
                Establishment Date
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="establishmentDate"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    placeholder="YYYY-MM-DD"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.establishmentDate
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              <p className="text-xs text-gray-500 mt-1">YYYY-MM-DD</p>
              {errors.establishmentDate && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.establishmentDate.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                The date your company was officially established
              </p>
            </div>

            {/* Business Size Field */}
            <div className="space-y-2">
              <label
                htmlFor="businessSize"
                className="block text-sm font-medium text-gray-700 items-center"
              >
                Business Size
                <span className="ml-1 text-red-500">*</span>
                {renderTooltip(
                  "Business size determines eligibility for certain programs and support services"
                )}
              </label>
              <Controller
                name="businessSize"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.businessSize
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select business size</option>
                    <option value="Micro (1-9 employees)">
                      Micro (1-9 employees)
                    </option>
                    <option value="Small (10-49 employees)">
                      Small (10-49 employees)
                    </option>
                    <option value="Medium (50-249 employees)">
                      Medium (50-249 employees)
                    </option>
                    <option value="Large (250+ employees)">
                      Large (250+ employees)
                    </option>
                  </select>
                )}
              />
              {errors.businessSize && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.businessSize.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}