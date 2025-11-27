import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircleIcon } from "lucide-react";
import { locationContactSchema } from "./validationSchemas";

interface FormData {
  address: string;
  city: string;
  country: string;
  website: string;
}

interface Step3Props {
  formData: FormData;
  onDataChange: (data: FormData) => void;
  onValidationChange: (isValid: boolean) => void;
  onValidationTrigger?: (triggerFn: () => Promise<boolean>) => void;
}

export function Step3({
  formData,
  onDataChange,
  onValidationChange,
  onValidationTrigger,
}: Step3Props) {
  const {
    control,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(locationContactSchema),
    defaultValues: {
      address: formData.address || "",
      city: formData.city || "",
      country: formData.country || "",
      website: formData.website || "",
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
          Location & Contact
        </h2>
        <p className="text-gray-600">
          Where your business is based and how to reach you
        </p>
      </div>

      <div className="space-y-10">
        {/* Business Location Section */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-lg font-medium text-gray-800">
              Business Location
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Where your business is based
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Address Field */}
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your business address"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.address
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.address && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.address.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Your business street address
              </p>
            </div>

            {/* City Field */}
            <div className="space-y-2">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your city"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.city
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.city && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.city.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                City where your business is located
              </p>
            </div>

            {/* Country Field */}
            <div className="space-y-2">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.country
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select country</option>
                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Oman">Oman</option>
                    <option value="Other">Other</option>
                  </select>
                )}
              />
              {errors.country && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.country.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Country where your business is registered
              </p>
            </div>
          </div>
        </div>

        {/* Online Presence Section */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-lg font-medium text-gray-800">
              Online Presence
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Your business on the web
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Website Field */}
            <div className="space-y-2">
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700"
              >
                Website
              </label>
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    placeholder="https://www.example.com"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.website
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.website && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.website.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Your business website (if available)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
