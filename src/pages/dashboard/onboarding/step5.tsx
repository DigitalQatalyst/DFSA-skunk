import React from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircleIcon } from "lucide-react";
import { fundingSchema } from "./validationSchemas";

interface FormData {
  initialCapitalUsd: number;
  fundingNeedsUsd?: number | undefined;
  businessRequirements: string;
  businessNeeds: string;
}

interface Step5Props {
  formData: FormData;
  onDataChange: (data: FormData) => void;
  onValidationChange: (isValid: boolean) => void;
  onValidationTrigger?: (triggerFn: () => Promise<boolean>) => void;
}

export function Step5({
  formData,
  onDataChange,
  onValidationChange,
  onValidationTrigger,
}: Step5Props) {
  const {
    control,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(fundingSchema) as Resolver<FormData>,
    defaultValues: {
      initialCapitalUsd: formData.initialCapitalUsd || 0,
      fundingNeedsUsd: formData.fundingNeedsUsd || 0,
      businessRequirements: formData.businessRequirements || "",
      businessNeeds: formData.businessNeeds || "",
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Funding</h2>
        <p className="text-gray-600">
          Details about your business finances and requirements
        </p>
      </div>

      <div className="space-y-10">
        {/* Financial Information Section */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-lg font-medium text-gray-800">
              Financial Information
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Details about your business finances
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Initial Capital Field */}
            <div className="space-y-2">
              <label
                htmlFor="initialCapitalUsd"
                className="block text-sm font-medium text-gray-700"
              >
                Initial Capital (USD)
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="initialCapitalUsd"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    placeholder="Enter initial capital amount"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.initialCapitalUsd
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.initialCapitalUsd && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.initialCapitalUsd.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Initial investment used to start the business
              </p>
            </div>

            {/* Funding Needs Field */}
            <div className="space-y-2">
              <label
                htmlFor="fundingNeedsUsd"
                className="block text-sm font-medium text-gray-700"
              >
                Funding Needs (USD)
              </label>
              <Controller
                name="fundingNeedsUsd"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    placeholder="Enter funding needs amount"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.fundingNeedsUsd
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.fundingNeedsUsd && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.fundingNeedsUsd.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Additional funding you are currently seeking (if applicable)
              </p>
            </div>
          </div>
        </div>

        {/* Business Requirements Section */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-lg font-medium text-gray-800">
              Business Requirements
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              What your business needs to grow
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Business Requirements Field */}
            <div className="space-y-2">
              <label
                htmlFor="businessRequirements"
                className="block text-sm font-medium text-gray-700"
              >
                Business Requirements
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="businessRequirements"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={4}
                    placeholder="List your business requirements (e.g., infrastructure, technology, partnerships)"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.businessRequirements
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.businessRequirements && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.businessRequirements.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Describe what your business requires to operate effectively
              </p>
            </div>

            {/* Business Needs Field */}
            <div className="space-y-2">
              <label
                htmlFor="businessNeeds"
                className="block text-sm font-medium text-gray-700"
              >
                Business Needs
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="businessNeeds"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={4}
                    placeholder="List your top business needs (e.g., marketing, technology, mentorship)"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.businessNeeds
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.businessNeeds && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.businessNeeds.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Describe what your business needs to succeed and grow
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
