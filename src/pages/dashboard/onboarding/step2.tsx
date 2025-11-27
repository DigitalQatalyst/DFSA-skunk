// /home/wanja/Documents/DQ/KF/UAT/MZN-EJP-v2/src/pages/dashboard/onboarding/step2.tsx

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircleIcon } from "lucide-react";
import { businessProfileSchema } from "./validationSchemas";

interface FormData {
  businessPitch: string;
  problemStatement: string;
}

interface Step2Props {
  formData: FormData;
  onDataChange: (data: FormData) => void;
  onValidationChange: (isValid: boolean) => void;
  onValidationTrigger?: (triggerFn: () => Promise<boolean>) => void;
}

export function Step2({
  formData,
  onDataChange,
  onValidationChange,
  onValidationTrigger,
}: Step2Props) {
  const {
    control,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(businessProfileSchema),
    defaultValues: {
      businessPitch: formData.businessPitch || "",
      problemStatement: formData.problemStatement || "",
    },
    mode: "onBlur",
  });

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
  }, [isValid, onValidationChange]);

  // Expose validation trigger function to parent
  React.useEffect(() => {
    if (onValidationTrigger) {
      onValidationTrigger(async () => {
        const result = await trigger();
        return result;
      });
    }
  }, [trigger, onValidationTrigger]);

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Business Profile
        </h2>
        <p className="text-gray-600">Help us understand your business better</p>
      </div>

      <div className="space-y-10">
        {/* Business Description Section */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-lg font-medium text-gray-800">
              Business Description
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Help us understand your business better
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Business Pitch Field */}
            <div className="space-y-2">
              <label
                htmlFor="businessPitch"
                className="block text-sm font-medium text-gray-700"
              >
                Business Pitch
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="businessPitch"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={4}
                    placeholder="Briefly describe what your business does"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.businessPitch
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />

              {errors.businessPitch && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.businessPitch.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                A concise description of your business proposition
              </p>
            </div>

            {/* Problem Statement Field */}
            <div className="space-y-2">
              <label
                htmlFor="problemStatement"
                className="block text-sm font-medium text-gray-700"
              >
                Problem Statement
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="problemStatement"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={4}
                    placeholder="What problem does your business solve?"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.problemStatement
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.problemStatement && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.problemStatement.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Describe the market gap or problem your business addresses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
