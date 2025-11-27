import React, { useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { isFieldMandatory } from "../../utils/config";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SaveIcon,
  XIcon,
  Loader2,
} from "lucide-react";
import { FileUploadField } from "./FileUploadField";
import { Can } from "../RBAC";

// --- Type Definitions (Updated for Array | Boolean mandatory) ---
type CompanyStageId = string;

interface FieldOption {
  label: string;
  value: string;
}

interface FieldConfig {
  id: string;
  label: string;
  fieldName: string;
  fieldType:
    | "select"
    | "multiselect"
    | "Lookup"
    | "Whole Number"
    | "Decimal"
    | "Decimal (0–100)"
    | "Currency"
    | "URL"
    | "Date"
    | "Date Only"
    | "DateTime"
    | "Multiline Text"
    | "File Upload"
    | "Text";
  // ✅ REVERTED: Mandatory can be boolean or an array of stage IDs
  mandatory: string[] | boolean;
  options?: FieldOption[];
  placeholder?: string;
  readOnly?: boolean;
}

interface GroupConfig {
  groupName: string;
  fields: FieldConfig[];
}

interface FormData {
  fields: Record<string, any>;
  status?: Record<string, string>;
}

interface TabSectionProps {
  config: GroupConfig[];
  data: FormData;
  completion?: any;
  // ✅ RE-INTRODUCED: Now required for stage-dependent validation
  companyStage: CompanyStageId;
  mandatoryCompletion?: any;
  onSaveGroupChanges?: (
    groupIndex: number,
    editingData: Record<string, any>
  ) => void;
  lookupDataFetcher?: (fieldName: string) => Promise<Array<FieldOption>>;
  savingGroupIndex?: number | null;
}

// --- Dynamic Yup Schema Builder (Updated to accept companyStage) ---
const buildValidationSchema = (
  group: GroupConfig,
  companyStage: CompanyStageId
) => {
  const shape: Record<string, yup.AnySchema> = {};

  group.fields.forEach((field) => {
    let validator: yup.AnySchema;

    const isMandatory = isFieldMandatory(field, companyStage); // Use the utility function

    // Determine base validator type
    switch (field.fieldType) {
      case "Currency":
        validator = yup
          .number()
          .transform((value, originalValue) => {
            // Remove currency symbols and commas before validation
            if (typeof originalValue === "string") {
              const cleaned = originalValue.replace(/[^\d.-]/g, ""); // Remove non-numeric except . and -
              return cleaned.trim() === "" ? null : Number(cleaned);
            }
            return String(originalValue).trim() === "" ? null : value;
          })
          .nullable(true)
          .typeError("Must be a valid amount")
          .positive("Amount must be positive"); // ✨ Currency is usually positive
        break;

      case "Whole Number":
      case "Decimal":
      case "Decimal (0–100)":
        validator = yup
          .number()
          .transform((value, originalValue) =>
            // Treat empty string as null for number validation
            String(originalValue).trim() === "" ? null : value
          )
          .nullable(true)
          .typeError("Must be a valid number");

        if (field.fieldType === "Whole Number") {
          validator = (validator as yup.NumberSchema).integer(
            "Must be a whole number"
          );
        }

        if (field.fieldType === "Decimal (0–100)") {
          validator = (validator as yup.NumberSchema)
            .min(0, "Must be between 0 and 100")
            .max(100, "Must be between 0 and 100");
        }
        break;

      case "multiselect":
        validator = yup.array().of(yup.string().required());
        break;

      case "URL":
        validator = yup.string().url("Must be a valid URL");
        break;

      case "Date":
      case "Date Only":
        validator = yup
          .string()
          .matches(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date (YYYY-MM-DD)");
        break;

      case "DateTime":
        validator = yup
          .string()
          .matches(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
            "Must be a valid date and time"
          );
        break;

      default:
        validator = yup.string();
        break;
    }

    // Apply mandatory check based on stage-dependent logic
    if (isMandatory) {
      if (field.fieldType === "multiselect") {
        validator = (validator as yup.ArraySchema<any>)
          .min(1, "At least one option is required")
          .required("This field is required");
      } else if (
        field.fieldType === "Whole Number" ||
        field.fieldType === "Decimal" ||
        field.fieldType === "Decimal (0–100)"
      ) {
        validator = validator.required("This field is required");
      } else {
        validator = (validator as yup.StringSchema).required(
          "This field is required"
        );
      }
    } else {
      // Ensure optional fields are nullable/not required
      if (field.fieldType === "multiselect") {
        validator = validator.nullable().notRequired();
      } else if (
        field.fieldType === "Whole Number" ||
        field.fieldType === "Decimal" ||
        field.fieldType === "Decimal (0–100)"
      ) {
        validator = validator.nullable().notRequired();
      } else {
        validator = (validator as yup.StringSchema).nullable().notRequired();
      }
    }

    shape[field.fieldName] = validator;
  });

  return yup.object().shape(shape);
};
// --- End Yup Schema Builder ---

/**
 * LookupField component to handle async options loading.
 */
interface LookupFieldProps {
  fieldConfig: FieldConfig;
  fieldProps: {
    onChange: (...event: any[]) => void;
    onBlur: (...event: any[]) => void;
    value: any;
    name: string;
    ref: React.Ref<any>;
  };
  inputClassName: string;
  isInvalid: boolean;
  lookupDataFetcher?: (fieldName: string) => Promise<Array<FieldOption>>;
  isMandatory: boolean;
}

const LookupField: React.FC<LookupFieldProps> = ({
  fieldConfig,
  fieldProps,
  inputClassName,
  isInvalid,
  lookupDataFetcher,
  isMandatory,
}) => {
  const [options, setOptions] = useState<FieldOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!lookupDataFetcher) {
      setError("Lookup data fetcher not provided.");
      setIsLoading(false);
      return;
    }

    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const fetchedOptions = await lookupDataFetcher(fieldConfig.fieldName);
        setOptions(fetchedOptions);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch lookup options:", err);
        setError("Failed to load options.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptions();
  }, [fieldConfig.fieldName, lookupDataFetcher]);

  if (isLoading) {
    return (
      <div
        className={`${inputClassName} flex items-center justify-center bg-gray-50 text-gray-500`}
      >
        <Loader2 size={16} className="animate-spin mr-2" />
        Loading options...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${inputClassName} flex items-center justify-center bg-red-50 text-red-600 border-red-300`}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <select
      {...fieldProps}
      className={inputClassName}
      aria-required={isMandatory}
      aria-invalid={isInvalid}
      value={fieldProps.value || ""}
    >
      <option value="" disabled>
        {isMandatory ? "Select a required option" : "Select an option"}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// --- TabSection Component Refactored (using RHF, Yup, and Stage-Dependent Logic) ---
export function TabSection({
  config,
  data,
  companyStage, // Company stage is now required for validation logic
  onSaveGroupChanges,
  lookupDataFetcher,
  savingGroupIndex,
}: TabSectionProps) {
  // Track expanded section (Accordion behavior: only one open at a time)
  const [expandedSection, setExpandedSection] = useState<number>(0);
  // Track the section currently in edit mode
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(
    null
  );

  // --- Accordion Logic ---
  const toggleSection = (index: number) => {
    if (editingGroupIndex !== null) return; // Disable collapse while editing

    // If clicked section is already open, close it (set to -1 or null)
    if (expandedSection === index) {
      setExpandedSection(-1);
    } else {
      // Open the clicked section, closing others implicitly
      setExpandedSection(index);
    }
  };

  // --- Utility Functions (Updated to use stage-dependent mandatory check) ---

  const checkIfMandatory = useCallback(
    (field: FieldConfig) => {
      return isFieldMandatory(field, companyStage);
    },
    [companyStage]
  ); // Dependency added

  const isMandatoryFieldMissing = useCallback(
    (field: FieldConfig) => {
      if (!checkIfMandatory(field) || !data?.fields) return false;

      const value = data.fields[field.fieldName];

      if (typeof value === "string") {
        return !value || value.trim() === "";
      }
      if (Array.isArray(value)) {
        return value.length === 0;
      }
      // Handles null, undefined, or empty objects being missing
      return (
        !value || (typeof value === "object" && Object.keys(value).length === 0)
      );
    },
    [data?.fields, checkIfMandatory]
  );

  // const calculateGroupCompletion = useCallback((group: GroupConfig) => {
  //     if (!data || !data.fields) return 0;
  //     let completedFields = 0;
  //     let totalFields = 0;
  //     group.fields.forEach((field) => {
  //         totalFields++;
  //         const value = data.fields[field.fieldName];
  //
  //         let isCompleted = false;
  //         if (typeof value === "string") {
  //             isCompleted = value.trim() !== "";
  //         } else if (Array.isArray(value)) {
  //             isCompleted = value.length > 0;
  //         } else if (value !== null && value !== undefined) {
  //             isCompleted = true;
  //         }
  //
  //         if (isCompleted) {
  //             completedFields++;
  //         }
  //     });
  //     return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 100;
  // }, [data?.fields]);
  const calculateGroupCompletion = useCallback(
    (group: GroupConfig) => {
      if (!data || !data.fields) return 0; // If no data, 0% complete

      let completedFields = 0;
      let totalFieldsInGroup = group.fields.length; // Denominator for ALL fields in the group

      if (totalFieldsInGroup === 0) return 100; // No fields, so consider it 100% complete

      let hasMandatoryFields = false;

      group.fields.forEach((field) => {
        const value = data.fields[field.fieldName];
        const isMandatory = checkIfMandatory(field);

        if (isMandatory) {
          hasMandatoryFields = true;
        }

        // Determine if the field is truly completed (has a non-empty value)
        let isCompleted = false;
        if (typeof value === "string") {
          isCompleted = value.trim() !== "";
        } else if (Array.isArray(value)) {
          isCompleted = value.length > 0;
        } else if (value !== null && value !== undefined) {
          // Check for non-empty objects (e.g., Lookup results)
          isCompleted =
            typeof value === "object" ? Object.keys(value).length > 0 : true;
        }

        if (isCompleted) {
          completedFields++;
        }
      });

      // Special handling for sections with no mandatory fields but all optional fields are empty
      if (!hasMandatoryFields && completedFields === 0) {
        return 0; // If all fields are optional and none are filled, it's 0%
      }

      // Otherwise, calculate based on all fields in the group
      return totalFieldsInGroup > 0
        ? Math.round((completedFields / totalFieldsInGroup) * 100)
        : 100;
    },
    [data?.fields, checkIfMandatory]
  );

  const calculateGroupMandatoryCompletion = useCallback(
    (group: GroupConfig) => {
      if (!data || !data.fields)
        return { completed: 0, total: 0, percentage: 0 };

      let mandatoryFields = 0;
      let completedMandatory = 0;

      group.fields.forEach((field) => {
        // Check if the field is mandatory for the current company stage
        if (isFieldMandatory(field, companyStage)) {
          mandatoryFields++;

          // Use the utility function that checks for missing data based on field type
          const isMissing = isMandatoryFieldMissing(field);

          if (!isMissing) {
            completedMandatory++;
          }
        }
      });

      return {
        completed: completedMandatory,
        total: mandatoryFields,
        percentage:
          mandatoryFields > 0
            ? Math.round((completedMandatory / mandatoryFields) * 100)
            : 100, // 100 if no mandatory fields
      };
    },
    [data?.fields, companyStage, isMandatoryFieldMissing]
  ); // ADDED isMandatoryFieldMissing to dependencies

  // --- React Hook Form Logic ---
  const editingGroup = useMemo(() => {
    return editingGroupIndex !== null ? config[editingGroupIndex] : null;
  }, [editingGroupIndex, config]);

  const validationSchema = useMemo(() => {
    // Pass the companyStage to the schema builder
    return editingGroup
      ? buildValidationSchema(editingGroup, companyStage)
      : null;
  }, [editingGroup, companyStage]); // Dependency added

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    mode: "onBlur",
    defaultValues: useMemo(() => {
      const initialValues: Record<string, any> = {};
      if (editingGroup) {
        editingGroup.fields.forEach((field) => {
          // Initialize with current data, or an appropriate default value
          let value = data?.fields?.[field.fieldName];

          if (field.fieldType === "multiselect") {
            // Ensure multiselect defaults to array
            initialValues[field.fieldName] = Array.isArray(value) ? value : [];
          } else if (
            field.fieldType === "Lookup" &&
            typeof value === "object" &&
            value !== null
          ) {
            // Extract the value part from a complex Lookup object for the form
            initialValues[field.fieldName] = value.value || "";
          } else {
            // Default to string for other types
            initialValues[field.fieldName] = value ?? "";
          }
        });
      }
      return initialValues;
    }, [editingGroup, data?.fields]),
  });

  // 🚨 CRITICAL FIX: Reset form with current data when entering edit mode
  React.useEffect(() => {
    if (editingGroupIndex !== null && editingGroup) {
      const currentValues: Record<string, unknown> = {};
      editingGroup.fields.forEach((field) => {
        let value = data?.fields?.[field.fieldName];

        if (field.fieldType === "multiselect") {
          currentValues[field.fieldName] = Array.isArray(value) ? value : [];
        } else if (
          field.fieldType === "Lookup" &&
          typeof value === "object" &&
          value !== null
        ) {
          currentValues[field.fieldName] = value.value || "";
        } else {
          currentValues[field.fieldName] = value ?? "";
        }
      });
      reset(currentValues);
    }
  }, [editingGroupIndex, editingGroup, data?.fields, reset]);

  // --- Handlers ---
  const toggleEditMode = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (editingGroupIndex === index) {
      // Exit edit mode - clear form state
      reset();
      setEditingGroupIndex(null);
    } else {
      // Enter edit mode
      setEditingGroupIndex(index);
      // Ensure the section is expanded when entering edit mode
      setExpandedSection(index);
    }
  };

  const handleCancelChanges = (event: React.MouseEvent) => {
    event.stopPropagation();
    // Simply exit edit mode and discard changes by resetting
    reset();
    setEditingGroupIndex(null);
  };

  const onSubmit = (formData: Record<string, unknown>) => {
    if (editingGroupIndex === null) return;

    if (onSaveGroupChanges) {
      onSaveGroupChanges(editingGroupIndex, formData);
    }

    // Exit edit mode and clear states
    reset();
    setEditingGroupIndex(null);
  };

  const handleSaveChanges = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleSubmit(onSubmit)(event);
  };

  // --- Render Logic ---
  return (
    <div className="space-y-4">
      {config.map((group, groupIndex) => {
        const isExpanded = expandedSection === groupIndex;
        const isEditing = editingGroupIndex === groupIndex;
        const groupCompletion = calculateGroupCompletion(group);
        const groupMandatoryCompletion =
          calculateGroupMandatoryCompletion(group);

        const hasMandatoryFields = group.fields.some((field) =>
          isFieldMandatory(field, companyStage)
        );
        const hasMissingMandatory =
          hasMandatoryFields && groupMandatoryCompletion.percentage < 100;

        const statusText = (() => {
          // 1. All Optional, 0% complete -> "Optional"
          if (
            groupCompletion === 0 &&
            groupMandatoryCompletion.total === 0 &&
            group.fields.length > 0
          ) {
            return "Optional";
          }
          // 2. 0% complete, but Mandatory fields are present -> "Required"
          if (groupCompletion === 0 && groupMandatoryCompletion.total > 0) {
            return "Required";
          }
          // 3. Partial Completion (1% - 99%) -> "Working"
          // Note: We use 'Working' (or 'In Progress') only if it's > 0% but < 100%
          if (groupCompletion > 0 && groupCompletion < 100) {
            // You can change 'Working' back to 'In Progress' if preferred, but 'Working' sounds more active.
            return "Working";
          }
          // Fallback for cases like an empty group
          return "";
        })();

        // NEW: Color logic (simplified color assignment)
        const statusColorClasses =
          groupCompletion === 0
            ? "text-amber-700 bg-amber-100" // Amber for 0% progress ("Required" or "Optional" text)
            : "bg-indigo-100 text-indigo-700";

        return (
          <div
            key={groupIndex}
            className={`rounded-lg border overflow-hidden transition-all ${
              hasMissingMandatory ? "border-amber-300" : "border-gray-200"
            } ${isExpanded ? "shadow-sm" : "bg-gray-50"}`}
          >
            {/* Header (Accordion/Edit Toggle) */}
            <div
              className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 cursor-pointer hover:bg-gray-50 min-h-[48px] ${
                isExpanded ? "border-b border-gray-200" : ""
              } ${hasMissingMandatory ? "bg-amber-50" : ""}`}
              onClick={() => toggleSection(groupIndex)}
              role="button"
              aria-expanded={isExpanded}
              aria-controls={`section-${groupIndex}-content`}
            >
              {/* Status and Name */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-700 mb-1 sm:mb-0 text-sm sm:text-base break-words">
                    {group.groupName}
                  </h3>
                  {groupCompletion === 100 ? (
                    // STATE 1: 100% Complete (Green styling handled externally)
                    <span className="ml-2 flex items-center text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                      <CheckCircleIcon
                        size={14}
                        className="mr-1 flex-shrink-0"
                      />
                      <span className="truncate">Complete</span>
                    </span>
                  ) : (
                    // STATE 2 & 3: Partial or Incomplete (Color logic handled externally)
                    <span
                      className={`ml-2 flex items-center text-xs px-1.5 py-0.5 rounded-full ${statusColorClasses}`}
                    >
                      <span className="w-2 h-2 rounded-full mr-1 flex-shrink-0 bg-current" />
                      <span className="truncate">{statusText}</span>
                    </span>
                  )}
                </div>

                <div className="sm:ml-3 flex items-center mt-2 sm:mt-0">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        groupCompletion === 100
                          ? "bg-green-500"
                          : groupCompletion >= 70
                          ? "bg-blue-500"
                          : groupCompletion >= 30
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${groupCompletion}%` }}
                      aria-valuenow={groupCompletion}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      role="progressbar"
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    {groupCompletion}%
                  </span>
                </div>
              </div>

              {/* Edit Button and Chevron */}
              <div className="flex items-center justify-between sm:justify-end mt-2 sm:mt-0">
                {!isEditing && isExpanded && (
                  <Can I="update" a="user-profile">
                    <button
                      className="mr-3 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 min-h-[32px]"
                      onClick={(e) => toggleEditMode(groupIndex, e)}
                      aria-label={`Edit ${group.groupName} section`}
                    >
                      Edit Section
                    </button>
                  </Can>
                )}
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUpIcon size={16} />
                  ) : (
                    <ChevronDownIcon size={16} />
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            {isExpanded && (
              <div
                className="p-3 sm:p-4 bg-white"
                id={`section-${groupIndex}-content`}
              >
                {group.fields.length > 0 ? (
                  <div className="space-y-3">
                    {group.fields.map((field, fieldIndex) => {
                      const fieldValue = data?.fields?.[field.fieldName];
                      const fieldStatus = data?.status?.[field.fieldName] || "";
                      const isMandatory = checkIfMandatory(field); // ⚠️ Uses stage logic
                      const isMissing = isMandatoryFieldMissing(field); // ⚠️ Uses stage logic
                      const hasError = isEditing && !!errors[field.fieldName];
                      const isReadOnly = field.readOnly === true;

                      // Create a display variable that handles different field types
                      const getDisplayValue = () => {
                        if (Array.isArray(fieldValue) && field.options) {
                          // Handle multiselect with options
                          return fieldValue
                            .map(
                              (val) =>
                                field.options?.find((opt) => opt.value === val)
                                  ?.label
                            )
                            .filter(Boolean)
                            .join(", ");
                        }

                        switch (field.fieldType) {
                          case "Currency":
                            if (
                              fieldValue !== null &&
                              fieldValue !== undefined
                            ) {
                              const formatted = new Intl.NumberFormat("en-AE", {
                                style: "currency",
                                currency: "AED",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(Number(fieldValue));
                              return formatted; // Shows as "AED 4,500.00"
                            }
                            return null;

                          case "URL":
                            return fieldValue ? (
                              <a
                                href={fieldValue}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline break-all"
                              >
                                {fieldValue}
                              </a>
                            ) : null;
                          case "File Upload":
                            return fieldValue ? (
                              <a
                                href={fieldValue}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                View Document
                              </a>
                            ) : null;
                          case "Lookup":
                            // Handle lookup fields - assume the data contains display labels
                            if (typeof fieldValue === "object" && fieldValue) {
                              return (
                                fieldValue.label ||
                                fieldValue.name ||
                                fieldValue.value
                              );
                            }
                            return fieldValue;

                          case "Date":
                          case "Date Only":
                            return fieldValue
                              ? new Date(fieldValue).toLocaleDateString()
                              : null;

                          case "DateTime":
                            return fieldValue
                              ? new Date(fieldValue).toISOString()
                              : null;

                          default:
                            return fieldValue;
                        }
                      };

                      const displayValue = getDisplayValue();

                      return (
                        <div
                          key={fieldIndex}
                          className={`flex flex-col py-1 ${
                            isMissing && !isEditing
                              ? "border border-red-200 bg-red-50 rounded px-2 sm:px-3 py-2"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div className="text-sm flex-shrink-0 sm:w-1/3 pr-2 sm:pr-4 mb-1 sm:mb-0">
                              <span
                                className={`${
                                  isMandatory
                                    ? "text-gray-700 font-medium"
                                    : "text-gray-500"
                                } break-words`}
                              >
                                {field.label}
                              </span>
                              {isMandatory && (
                                <span className="ml-1 text-red-500">*</span>
                              )}
                            </div>
                            <div className="flex-grow">
                              {isEditing && !isReadOnly ? (
                                <Controller
                                  name={field.fieldName}
                                  control={control}
                                  render={({ field: fieldProps }) => {
                                    const isInvalid = !!(
                                      hasError ||
                                      (isMissing && !fieldProps.value)
                                    );
                                    const inputClassName = `w-full text-sm border rounded px-3 py-2 min-h-[44px] ${
                                      hasError
                                        ? "border-red-300 bg-red-50"
                                        : isMissing && !fieldProps.value
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                    }`;

                                    const commonProps = {
                                      className: inputClassName,
                                      "aria-required": isMandatory,
                                      "aria-invalid": isInvalid,
                                      placeholder:
                                        field.placeholder ||
                                        (isMandatory ? "Required" : "Optional"),
                                    };

                                    const onChangeHandler = (
                                      e: React.ChangeEvent<
                                        | HTMLInputElement
                                        | HTMLTextAreaElement
                                        | HTMLSelectElement
                                      >
                                    ) => {
                                      const value = e.target.value;
                                      if (
                                        field.fieldType.includes("Number") ||
                                        field.fieldType.includes("Decimal")
                                      ) {
                                        fieldProps.onChange(
                                          value === "" ? null : value
                                        );
                                      } else {
                                        fieldProps.onChange(value);
                                      }
                                    };

                                    switch (field.fieldType) {
                                      case "multiselect":
                                        return field.options ? (
                                          <div className="space-y-2">
                                            {/* Show selected items as pills */}
                                            {Array.isArray(fieldProps.value) &&
                                              fieldProps.value.length > 0 && (
                                                <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                                                  {fieldProps.value.map(
                                                    (selectedValue) => {
                                                      const option =
                                                        field.options?.find(
                                                          (opt) =>
                                                            opt.value ===
                                                            selectedValue
                                                        );
                                                      return (
                                                        <span
                                                          key={selectedValue}
                                                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                                                        >
                                                          {option?.label ||
                                                            selectedValue}
                                                          <button
                                                            type="button"
                                                            onClick={() => {
                                                              // Remove this option
                                                              const newValue =
                                                                fieldProps.value.filter(
                                                                  (v) =>
                                                                    v !==
                                                                    selectedValue
                                                                );
                                                              fieldProps.onChange(
                                                                newValue
                                                              );
                                                            }}
                                                            className="ml-1 hover:text-blue-900"
                                                          >
                                                            <XIcon size={12} />
                                                          </button>
                                                        </span>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              )}

                                            {/* Checkboxes for selection */}
                                            <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-gray-300 rounded-md">
                                              {field.options.map((option) => {
                                                const isSelected =
                                                  Array.isArray(
                                                    fieldProps.value
                                                  ) &&
                                                  fieldProps.value.includes(
                                                    option.value
                                                  );
                                                return (
                                                  <label
                                                    key={option.value}
                                                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={isSelected}
                                                      onChange={(e) => {
                                                        const currentValue =
                                                          Array.isArray(
                                                            fieldProps.value
                                                          )
                                                            ? fieldProps.value
                                                            : [];
                                                        const newValue = e
                                                          .target.checked
                                                          ? [
                                                              ...currentValue,
                                                              option.value,
                                                            ] // Add
                                                          : currentValue.filter(
                                                              (v) =>
                                                                v !==
                                                                option.value
                                                            ); // Remove
                                                        fieldProps.onChange(
                                                          newValue
                                                        );
                                                      }}
                                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                      {option.label}
                                                    </span>
                                                  </label>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        ) : null;

                                      case "select":
                                        return field.options ? (
                                          <select
                                            {...fieldProps}
                                            {...commonProps}
                                            onChange={onChangeHandler}
                                            value={fieldProps.value || ""}
                                          >
                                            <option value="" disabled>
                                              {isMandatory
                                                ? "Select a required option"
                                                : "Select an option"}
                                            </option>
                                            {field.options.map((option) => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                        ) : null;

                                      case "Lookup":
                                        return (
                                          <LookupField
                                            fieldConfig={field}
                                            fieldProps={fieldProps}
                                            inputClassName={inputClassName}
                                            isInvalid={isInvalid}
                                            lookupDataFetcher={
                                              lookupDataFetcher
                                            }
                                            isMandatory={isMandatory}
                                          />
                                        );

                                      case "Currency":
                                        return (
                                          <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                              AED
                                            </span>
                                            <input
                                              type="number"
                                              step="0.01"
                                              min="0"
                                              {...fieldProps}
                                              {...commonProps}
                                              className={`${inputClassName} pl-14`} // ✨ Add left padding for "AED"
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                fieldProps.onChange(
                                                  value === "" ? null : value
                                                );
                                              }}
                                            />
                                          </div>
                                        );

                                      case "Whole Number":
                                        return (
                                          <input
                                            type="number"
                                            step="1"
                                            {...fieldProps}
                                            {...commonProps}
                                            onChange={onChangeHandler}
                                          />
                                        );

                                      case "Decimal":
                                      case "Decimal (0–100)":
                                        return (
                                          <input
                                            type="number"
                                            step="0.01"
                                            min={
                                              field.fieldType ===
                                              "Decimal (0–100)"
                                                ? "0"
                                                : undefined
                                            }
                                            max={
                                              field.fieldType ===
                                              "Decimal (0–100)"
                                                ? "100"
                                                : undefined
                                            }
                                            {...fieldProps}
                                            {...commonProps}
                                            onChange={onChangeHandler}
                                          />
                                        );

                                      case "Date":
                                      case "Date Only":
                                        return (
                                          <input
                                            type="date"
                                            {...fieldProps}
                                            {...commonProps}
                                            onChange={onChangeHandler}
                                          />
                                        );

                                      case "DateTime":
                                        return (
                                          <input
                                            type="datetime-local"
                                            {...fieldProps}
                                            {...commonProps}
                                            onChange={onChangeHandler}
                                          />
                                        );

                                      case "URL":
                                        return (
                                          <input
                                            type="url"
                                            {...fieldProps}
                                            {...commonProps}
                                            onChange={onChangeHandler}
                                          />
                                        );

                                      case "Multiline Text":
                                        return (
                                          <textarea
                                            rows={3}
                                            {...fieldProps}
                                            {...commonProps}
                                            onChange={onChangeHandler}
                                          />
                                        );

                                      case "File Upload":
                                        return (
                                          <FileUploadField
                                            value={fieldProps.value || null}
                                            onChange={fieldProps.onChange}
                                            placeholder={field.placeholder}
                                            isMandatory={isMandatory}
                                            isInvalid={isInvalid}
                                          />
                                        );

                                      default:
                                        return (
                                          <input
                                            type="text"
                                            {...fieldProps}
                                            {...commonProps}
                                            onChange={onChangeHandler}
                                          />
                                        );
                                    }
                                  }}
                                />
                              ) : (
                                // View Mode Display
                                <div className="flex items-center justify-between w-full">
                                  <div
                                    className={`text-sm ${
                                      !displayValue
                                        ? "text-gray-400 italic"
                                        : "text-gray-800"
                                    } break-words`}
                                  >
                                    {displayValue || (
                                      <span className="italic">
                                        {isMandatory
                                          ? "Not provided"
                                          : "Not provided"}
                                      </span>
                                    )}
                                  </div>
                                  {fieldStatus === "completed" && (
                                    <CheckCircleIcon
                                      size={12}
                                      className="text-green-500 flex-shrink-0 ml-2"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Error and Missing Mandatory Indicator */}
                          {isEditing && errors[field.fieldName] ? (
                            <div className="sm:ml-[33%] mt-1">
                              <p className="text-xs text-red-600">
                                {errors[field.fieldName]?.message}
                              </p>
                            </div>
                          ) : (
                            isMissing &&
                            !isEditing && (
                              <div className="sm:ml-[33%] mt-1">
                                <p className="text-xs text-red-600">
                                  This field is required
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500 italic">
                    No fields defined for this group
                  </div>
                )}
                {/* Save/Cancel Buttons */}
                {isEditing && (
                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 border-t border-gray-100 pt-4">
                    <button
                      className="px-3 py-2 text-sm font-medium text-gray-600 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleCancelChanges}
                      aria-label="Cancel editing"
                      disabled={savingGroupIndex === groupIndex}
                    >
                      <XIcon size={16} className="mr-1" />
                      Cancel
                    </button>
                    <button
                      className="px-3 py-2 text-sm font-medium text-white rounded bg-blue-600 hover:bg-blue-700 flex items-center justify-center min-h-[44px] disabled:opacity-70 disabled:cursor-not-allowed"
                      onClick={handleSaveChanges}
                      aria-label="Save changes"
                      disabled={savingGroupIndex === groupIndex}
                    >
                      {savingGroupIndex === groupIndex ? (
                        <>
                          <Loader2 size={16} className="mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <SaveIcon size={16} className="mr-1" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      {/* Empty state */}
      {(!config || config.length === 0) && (
        <div className="py-8 sm:py-10 md:py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 px-4">
            No data groups defined for this section
          </p>
        </div>
      )}
    </div>
  );
}
