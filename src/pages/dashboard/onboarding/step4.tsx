import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircleIcon } from "lucide-react";
import { operationsSchema } from "./validationSchemas";
import { useEffect } from "react";

interface FormData {
  employeeCount: number;
  founders: string;
  foundingYear: string;
}

interface Step4Props {
  formData: FormData;
  onDataChange: (data: FormData) => void;
  onValidationChange: (isValid: boolean) => void;
  onValidationTrigger?: (triggerFn: () => Promise<boolean>) => void;
}

export function Step4({
  formData,
  onDataChange,
  onValidationChange,
  onValidationTrigger,
}: Step4Props) {
  const {
    control,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(operationsSchema),
    defaultValues: {
      employeeCount: formData.employeeCount || 0,
      founders: formData.founders || "",
      foundingYear: formData.foundingYear || "",
    },
    mode: "onBlur",
  });

  // Watch for form changes and update parent
  useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value as FormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  // Update validation status when errors change
  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  // Expose validation trigger function to parent
  useEffect(() => {
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
          Operations
        </h2>
        <p className="text-gray-600">
          Information about your team and founding
        </p>
      </div>

      <div className="space-y-10">
        {/* Team & History Section */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-lg font-medium text-gray-800">
              Team & History
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Information about your team and founding
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Employee Count Field */}
            <div className="space-y-2">
              <label
                htmlFor="employeeCount"
                className="block text-sm font-medium text-gray-700"
              >
                Employee Count
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="employeeCount"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="1"
                    placeholder="Enter number of employees"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.employeeCount
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.employeeCount && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.employeeCount.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Current number of employees in your company
              </p>
            </div>

            {/* Founders Field */}
            <div className="space-y-2">
              <label
                htmlFor="founders"
                className="block text-sm font-medium text-gray-700"
              >
                Founders
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="founders"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Names of founders, separated by commas"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.founders
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.founders && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.founders.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Names of all company founders
              </p>
            </div>

            {/* Founding Year Field */}
            <div className="space-y-2">
              <label
                htmlFor="foundingYear"
                className="block text-sm font-medium text-gray-700"
              >
                Founding Year
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="foundingYear"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    placeholder="YYYY-MM-DD"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.foundingYear
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              <p className="text-xs text-gray-500 mt-1">YYYY-MM-DD</p>
              {errors.foundingYear && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.foundingYear.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Date when your company was founded
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
