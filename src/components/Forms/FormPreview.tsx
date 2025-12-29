/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
} from "@floating-ui/react";

import {
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  Upload,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Eye,
  EyeOff,
  Download,
  Lock,
} from "lucide-react";
import {useScrollLock} from "../../hooks/useScrollLock";
import { generateFormPDF, formatFieldValueForPDF, FormFieldData } from "../../utils/pdfExport";
import { saveFormDraft, loadFormDraft, clearFormDraft, hasFormDraft, getDraftInfo } from "../../utils/formDraftStorage";
import { getAutocompleteAttribute, getNameAttribute } from "../../utils/formAutofillStandards";
import { Can } from "../RBAC/Can";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

// CSS to handle autofilled content
const autofillStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #000 !important;
    transition: background-color 5000s ease-in-out 0s;
  }
  
  input[data-autocompleted] {
    background-color: transparent !important;
  }
`;

// Types
export interface FormField {
  id: string;
  label: string;
  type:
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "checkbox-group"
  | "radio"
  | "switch"
  | "date"
  | "daterange"
  | "time"
  | "datetime"
  | "file"
  | "multi-file"
  | "image-upload"
  | "number"
  | "email"
  | "tel"
  | "password"
  | "address"
  | "currency"
  | "slider"
  | "rating"
  | "stepper"
  | "lookup"
  | "autocomplete"
  | "tags"
  | "signature"
  | "consent"
  | "course-table"
  | "table";
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: string;
    message?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    step?: number;
    fileTypes?: string[];
    maxFileSize?: number;
    strength?: "weak" | "medium" | "strong";
    required?: string;
  };
  options?: Array<{
    value: string;
    label: string;
    assetName?: string;
    assetNumber?: string;
  }>;
  tableConfig?: {
    columns: Array<{ key: string; label: string }>;
    selectable?: boolean;
    emptyMessage?: string;
  };
  globalOptionSet?: string;
  conditionalLogic?: {
    dependsOn: string;
    showWhen: string | string[];
  };
  defaultValue?: any;
  helperText?: string;
  currency?: string;
  searchEndpoint?: string;
  readOnly?: boolean; // 👈 Add readOnly property
}

export interface FormGroup {
  groupTitle: string;
  groupDescription?: string;
  conditionalLogic?: {  // Add this for group-level conditional logic
    dependsOn: string;
    showWhen: string | string[];
  };
  fields: FormField[];
}

export interface FormStep {
  stepTitle: string;
  stepDescription?: string;
  groups: FormGroup[];
}

export interface FormSchema {
  formId: string;
  formTitle: string;
  formDescription?: string;
  multiStep: boolean;
  steps?: FormStep[];
  groups?: FormGroup[];
  submitEndpoint?: string;
  allowSaveAndContinue?: boolean;
  autoSaveInterval?: number;
}

export interface ServiceRequestFormProps {
  schema?: FormSchema;
  onSubmit?: (data: any) => Promise<void>;
  onSave?: (data: any) => Promise<void>;
  initialData?: any;
  "data-id"?: string;
  enablePersistence?: boolean;
  enableAutoSave?: boolean;
}

// Utility functions
const validateField = (field: FormField, value: any): string | null => {
  if (field.required) {
    if (field.type === "table") {
      if (!value || !Array.isArray(value) || value.length === 0) {
        return field.validation?.required || `${field.label} is required`;
      }
    } else if (field.type === "checkbox-group" || field.type === "multiselect") {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return `${field.label} is required`;
      }
    } else {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `${field.label} is required`;
      }
    }
  }

  if (!value) return null;

  if (field.validation) {
    const { pattern, message, minLength, maxLength, min, max } = field.validation;
    if (pattern && !new RegExp(pattern).test(value)) {
      return message || `${field.label} format is invalid`;
    }
    if (minLength && value.length < minLength) {
      return `${field.label} must be at least ${minLength} characters`;
    }
    if (maxLength && value.length > maxLength) {
      return `${field.label} must not exceed ${maxLength} characters`;
    }
    if (min !== undefined && Number(value) < min) {
      return `${field.label} must be at least ${min}`;
    }
    if (max !== undefined && Number(value) > max) {
      return `${field.label} must not exceed ${max}`;
    }
  }

  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
  }

  if (field.type === "tel" && value) {
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(value.replace(/\s|-/g, ""))) {
      return "Please enter a valid phone number";
    }
  }

  return null;
};

const shouldShowSuccessState = (field: FormField): boolean => {
  const criticalFieldTypes = [
    "email",
    "tel",
    "password",
    "file",
    "multi-file",
    "image-upload",
    "table",
  ];
  return criticalFieldTypes.includes(field.type);
};

const getPasswordStrength = (password: string) => {
  if (!password)
    return {
      score: 0,
      label: "",
      color: "",
    };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const strengthMap = {
    0: {
      label: "",
      color: "",
    },
    1: {
      label: "Weak",
      color: "text-red-600",
    },
    2: {
      label: "Fair",
      color: "text-orange-600",
    },
    3: {
      label: "Good",
      color: "text-blue-600",
    },
    4: {
      label: "Strong",
      color: "text-green-600",
    },
  };
  return {
    score,
    ...strengthMap[score as keyof typeof strengthMap],
  };
};

const getGlobalOptions = (optionSetId: string) => {
  const globalOptions: Record<
    string,
    Array<{
      value: string;
      label: string;
    }>
  > = {
    countries: [
      {
        value: "ae",
        label: "United Arab Emirates",
      },
      {
        value: "sa",
        label: "Saudi Arabia",
      },
      {
        value: "qa",
        label: "Qatar",
      },
      {
        value: "kw",
        label: "Kuwait",
      },
      {
        value: "bh",
        label: "Bahrain",
      },
      {
        value: "om",
        label: "Oman",
      },
      {
        value: "jo",
        label: "Jordan",
      },
      {
        value: "lb",
        label: "Lebanon",
      },
      {
        value: "eg",
        label: "Egypt",
      },
      {
        value: "ma",
        label: "Morocco",
      },
      {
        value: "us",
        label: "United States",
      },
      {
        value: "uk",
        label: "United Kingdom",
      },
      {
        value: "ca",
        label: "Canada",
      },
      {
        value: "au",
        label: "Australia",
      },
      {
        value: "de",
        label: "Germany",
      },
      {
        value: "fr",
        label: "France",
      },
      {
        value: "in",
        label: "India",
      },
      {
        value: "sg",
        label: "Singapore",
      },
      {
        value: "other",
        label: "Other",
      },
    ],
    serviceTypes: [
      {
        value: "consultation",
        label: "Business Consultation",
      },
      {
        value: "funding",
        label: "Funding & Investment",
      },
      {
        value: "technical",
        label: "Technical Support",
      },
      {
        value: "training",
        label: "Training & Development",
      },
      {
        value: "other",
        label: "Other",
      },
    ],
    priorities: [
      {
        value: "low",
        label: "Low - Within 1 week",
      },
      {
        value: "medium",
        label: "Medium - Within 3 days",
      },
      {
        value: "high",
        label: "High - Within 24 hours",
      },
      {
        value: "urgent",
        label: "Urgent - Same day",
      },
    ],
    budgetRanges: [
      {
        value: "under-5000",
        label: "Under $5,000",
      },
      {
        value: "5000-25000",
        label: "$5,000 - $25,000",
      },
      {
        value: "25000-100000",
        label: "$25,000 - $100,000",
      },
      {
        value: "100000-plus",
        label: "$100,000+",
      },
    ],
    currencies: [
      {
        value: "AED",
        label: "UAE Dirham (AED)",
      },
      {
        value: "USD",
        label: "US Dollar (USD)",
      },
      {
        value: "EUR",
        label: "Euro (EUR)",
      },
      {
        value: "GBP",
        label: "British Pound (GBP)",
      },
    ],
  };
  return globalOptions[optionSetId] || [];
};

const validateSchema = (schema: FormSchema | undefined): FormSchema => {
  if (!schema) {
    throw new Error(
      "ServiceRequestForm: No schema provided. A valid schema is required."
    );
  }
  if (!schema.formId || !schema.formTitle) {
    throw new Error(
      "ServiceRequestForm: Invalid schema, missing required fields (formId or formTitle)."
    );
  }
  if (schema.multiStep) {
    if (
      !schema.steps ||
      !Array.isArray(schema.steps) ||
      schema.steps.length === 0
    ) {
      throw new Error(
        "ServiceRequestForm: Multi-step schema missing valid steps."
      );
    }
    // Check that each step has groups (groups can have empty fields for review steps)
    const hasValidSteps = schema.steps.every(
      (step) =>
        step.groups &&
        Array.isArray(step.groups) &&
        step.groups.length > 0
        // Note: Groups can have empty fields array (used for Review & Summary steps)
        // We only validate that groups array exists and is not empty
    );
    if (!hasValidSteps) {
      throw new Error(
        "ServiceRequestForm: Multi-step schema has invalid step structure."
      );
    }
  } else {
    if (
      !schema.groups ||
      !Array.isArray(schema.groups) ||
      schema.groups.length === 0
    ) {
      throw new Error(
        "ServiceRequestForm: Single-step schema missing valid groups."
      );
    }
    // Check if groups exist (groups can have empty fields for review steps)
    const hasValidGroups = schema.groups && Array.isArray(schema.groups) && schema.groups.length > 0;
    if (!hasValidGroups) {
      throw new Error(
        "ServiceRequestForm: Single-step schema has no valid groups."
      );
    }
  }
  return schema;
};

// Custom Select Component
const CustomSelect: React.FC<{
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  placeholder?: string;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
}> = ({
  id,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Select an option",
  error = false,
  success = false,
  disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: "bottom-start",
      middleware: [offset(4), flip(), shift(), size()],
      whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, {
      role: "listbox",
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
      role,
    ]);

    const selectedOption = options.find((opt) => opt.value === value);

    const getTriggerClasses = () => {
      const baseClasses =
        "w-full h-11 px-4 bg-white border rounded-md transition-all duration-200 focus:outline-none focus:ring-2";
      if (disabled) return `${baseClasses} bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed`;
      if (error) return `${baseClasses} border-red-500 focus:ring-red-500`;
      if (success) return `${baseClasses} border-green-500 focus:ring-green-500`;
      return `${baseClasses} border-gray-300 hover:border-gray-400 focus:ring-blue-500`;
    };

    const handleBlur = () => {
      if (hasInteracted && !isOpen) {
        onBlur?.();
      }
    };

    return (
      <div className="relative">
        <button
          type="button"
          id={id}
          ref={refs.setReference}
          className={getTriggerClasses()}
          onBlur={handleBlur}
          disabled={disabled}
          {...getReferenceProps()}
        >
          <div className="flex items-center justify-between h-full">
            <span
              className={`block truncate text-left ${selectedOption ? "text-gray-900" : "text-gray-500"
                }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""
                }`}
            />
          </div>
        </button>
        {success && (
          <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none" />
        )}
        {isOpen &&
          createPortal(
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                className="rounded-lg bg-white shadow-lg ring-1 ring-gray-200 z-50 max-h-80 overflow-auto"
                style={floatingStyles}
                {...getFloatingProps()}
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    className={`px-3 py-2 text-sm cursor-pointer transition-colors ${option.value === value
                      ? "bg-blue-50 border-l-2 border-blue-500"
                      : "hover:bg-gray-100"
                      }`}
                    onClick={() => {
                      onChange(option.value);
                      setHasInteracted(true);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </FloatingFocusManager>,
            document.body
          )}
      </div>
    );
  };

// Asset Table Component
interface AssetTableData {
  assetName: string;
  assetNumber: string;
  selected?: boolean;
}

const AssetTableField: React.FC<{
  value: AssetTableData[];
  onChange: (value: AssetTableData[]) => void;
  options?: Array<{ assetName: string; assetNumber: string }>;
  error?: string;
  emptyMessage?: string;
}> = ({ value, onChange, options = [], error, emptyMessage = "There are no assets in your account." }) => {
  const [selectedAssets, setSelectedAssets] = useState<AssetTableData[]>(value || []);

  useEffect(() => {
    setSelectedAssets(value || []);
  }, [value]);

  const handleCheckboxChange = (asset: AssetTableData, isChecked: boolean) => {
    let newSelection: AssetTableData[];

    if (isChecked) {
      newSelection = [...selectedAssets, { ...asset, selected: true }];
    } else {
      newSelection = selectedAssets.filter(item =>
        item.assetNumber !== asset.assetNumber
      );
    }

    setSelectedAssets(newSelection);
    onChange(newSelection);
  };

  const isAssetSelected = (assetNumber: string) => {
    return selectedAssets.some(asset => asset.assetNumber === assetNumber);
  };

  return (
    <div className="asset-table-container">
      <div className="table-wrapper border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset Number
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {options && options.length > 0 ? (
              options.map((asset, index) => (
                <tr
                  key={asset.assetNumber}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isAssetSelected(asset.assetNumber)}
                      onChange={(e) => handleCheckboxChange(asset, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {asset.assetName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {asset.assetNumber}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {options && options.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          {selectedAssets.length} asset(s) selected
        </div>
      )}
    </div>
  );
};

// Form Field Component
const FormField: React.FC<{
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  isVisible: boolean;
  onBlur?: () => void;
  formId?: string; // Add formId prop to detect cancel-loan form
  isPrefilled?: boolean; // Add isPrefilled prop to make field read-only
}> = ({ field, value, onChange, error, isVisible, onBlur, formId, isPrefilled = false }) => {
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDocumentSelectorOpen, setIsDocumentSelectorOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isCancelLoanForm = formId === "cancel-loan";
  
  const fieldOptions = useMemo(() => {
    if (field.globalOptionSet) {
      return getGlobalOptions(field.globalOptionSet);
    }
    return field.options || [];
  }, [field.globalOptionSet, field.options]);

  // Effect to watch for Fake Filler value changes on cancel-loan form
  useEffect(() => {
    if (!isCancelLoanForm) return;
    
    const input = inputRef.current || textareaRef.current;
    if (!input) return;
    
    let lastValue = input.value;
    
    // Watch for value property changes (Fake Filler sets this directly)
    const checkValue = () => {
      if (input.value !== lastValue && input.value !== (value || "")) {
        // Value changed externally - sync to React state immediately
        onChange(input.value);
        lastValue = input.value;
      }
    };
    
    // Check frequently for cancel-loan form to catch Fake Filler
    const interval = setInterval(checkValue, 50); // Check every 50ms
    
    // Also listen to input events as backup
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.value !== (value || "")) {
        onChange(target.value);
      }
    };
    
    input.addEventListener('input', handleInput);
    
    return () => {
      clearInterval(interval);
      input.removeEventListener('input', handleInput);
    };
  }, [isCancelLoanForm, value, onChange, field.id]);

  if (!isVisible) return null;

  const getFieldClasses = () => {
    const baseClasses =
      "w-full h-11 px-4 bg-white border rounded-md transition-all duration-200 focus:outline-none focus:ring-2";
    
    // Read-only styling (for both field.readOnly and isPrefilled)
    if (field.readOnly || isPrefilled) {
      return `${baseClasses} bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed`;
    }
    
    if (error) return `${baseClasses} border-red-500 focus:ring-red-500`;
    if (value && !error && hasBeenTouched && shouldShowSuccessState(field)) {
      return `${baseClasses} border-green-500 focus:ring-green-500`;
    }
    return `${baseClasses} border-gray-300 hover:border-gray-400 focus:ring-blue-500`;
  };

  const handleBlur = () => {
    setHasBeenTouched(true);
    onBlur?.();
  };

  const fieldId = `field-${field.id}`;

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel": {
        const autocompleteValue = getAutocompleteAttribute(field);
        const nameValue = getNameAttribute(field);
        const autoCompleteAttr = isCancelLoanForm 
          ? (autocompleteValue || "off") // Use standard autocomplete or "off" instead of "new-password"
          : (autocompleteValue || "new-password");
        
        return (
          <div className="relative">
            <input
              ref={inputRef}
              id={fieldId}
              name={nameValue}
              type={field.type}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              onInput={(e) => {
                // Immediate sync for Fake Filler on cancel-loan form
                if (isCancelLoanForm) {
                  const target = e.target as HTMLInputElement;
                  if (target.value !== (value || "")) {
                    onChange(target.value);
                  }
                }
              }}
              onBlur={handleBlur}
              placeholder={field.placeholder}
              autoComplete={autoCompleteAttr}
              aria-label={field.label}
              className={getFieldClasses()}
              readOnly={field.readOnly || isPrefilled} // 👈 Add readOnly for prefilled fields
              {...(isCancelLoanForm ? {} : { "data-form-type": "other" })} // Remove data-form-type for cancel-loan
            />
            {value &&
              !error &&
              hasBeenTouched &&
              shouldShowSuccessState(field) && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
          </div>
        );
      }
      case "password": {
        const strength = getPasswordStrength(value || "");
        const autocompleteValue = getAutocompleteAttribute(field);
        const nameValue = getNameAttribute(field);
        return (
          <div className="space-y-2">
            <div className="relative">
              <input
                id={fieldId}
                name={nameValue}
                type={showPassword ? "text" : "password"}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                onBlur={handleBlur}
                placeholder={field.placeholder}
                autoComplete={autocompleteValue || "new-password"}
                aria-label={field.label}
                className={getFieldClasses()}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {value &&
                  !error &&
                  hasBeenTouched &&
                  shouldShowSuccessState(field) && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {value && strength.score > 0 && (
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${strength.score === 1
                      ? "bg-red-500"
                      : strength.score === 2
                        ? "bg-orange-500"
                        : strength.score === 3
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                    style={{
                      width: `${(strength.score / 4) * 100}%`,
                    }}
                  />
                </div>
                <span className={`text-sm font-medium ${strength.color}`}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>
        );
      }
      case "number": {
        const autocompleteValue = getAutocompleteAttribute(field);
        const nameValue = getNameAttribute(field);
        const autoCompleteAttr = isCancelLoanForm 
          ? (autocompleteValue || "off")
          : (autocompleteValue || "new-password");
        
        return (
          <input
            ref={inputRef}
            id={fieldId}
            name={nameValue}
            type="number"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onInput={(e) => {
              // Immediate sync for Fake Filler on cancel-loan form
              if (isCancelLoanForm) {
                const target = e.target as HTMLInputElement;
                if (target.value !== (value || "")) {
                  onChange(target.value);
                }
              }
            }}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            step={field.validation?.step}
            autoComplete={autoCompleteAttr}
            aria-label={field.label}
            className={getFieldClasses()}
            readOnly={field.readOnly || isPrefilled}
            {...(isCancelLoanForm ? {} : { "data-form-type": "other" })} // Remove data-form-type for cancel-loan
          />
        );
      }
      case "currency": {
        const currencySymbol =
          field.currency === "USD" ? "$" : field.currency || "$";
        const formatCurrency = (val: string) => {
          const number = val.replace(/[^0-9]/g, "");
          if (!number) return "";
          return Number(number).toLocaleString();
        };
        const autocompleteValue = getAutocompleteAttribute(field);
        const nameValue = getNameAttribute(field);
        const autoCompleteAttr = isCancelLoanForm 
          ? (autocompleteValue || "off")
          : (autocompleteValue || "new-password");

        return (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              {currencySymbol}
            </div>
            <input
              ref={inputRef}
              id={fieldId}
              name={nameValue}
              type="text"
              value={value ? formatCurrency(value.toString()) : ""}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, "");
                onChange(rawValue ? Number(rawValue) : "");
              }}
              readOnly={field.readOnly || isPrefilled}
              onInput={(e) => {
                // Immediate sync for Fake Filler on cancel-loan form
                if (isCancelLoanForm) {
                  const target = e.target as HTMLInputElement;
                  const rawValue = target.value.replace(/[^0-9]/g, "");
                  const numValue = rawValue ? Number(rawValue) : "";
                  if (numValue !== value) {
                    onChange(numValue);
                  }
                }
              }}
              onBlur={handleBlur}
              placeholder={field.placeholder}
              autoComplete={autoCompleteAttr}
              aria-label={field.label}
              className={getFieldClasses().replace("px-4", "pl-8 pr-4")}
              {...(isCancelLoanForm ? {} : { "data-form-type": "other" })} // Remove data-form-type for cancel-loan
            />
          </div>
        );
      }
      case "textarea": {
        const autocompleteValue = getAutocompleteAttribute(field);
        const nameValue = getNameAttribute(field);
        const autoCompleteAttr = isCancelLoanForm 
          ? (autocompleteValue || "off")
          : (autocompleteValue || "new-password");
        
        return (
          <div className="space-y-2">
            <textarea
              ref={textareaRef}
              id={fieldId}
              name={nameValue}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              onInput={(e) => {
                // Immediate sync for Fake Filler on cancel-loan form
                if (isCancelLoanForm) {
                  const target = e.target as HTMLTextAreaElement;
                  if (target.value !== (value || "")) {
                    onChange(target.value);
                  }
                }
              }}
              onBlur={handleBlur}
              placeholder={field.placeholder}
              autoComplete={autoCompleteAttr}
              aria-label={field.label}
              rows={4}
              className={getFieldClasses().replace(
                "h-11",
                "min-h-[100px] py-3"
              )}
              readOnly={field.readOnly || isPrefilled}
              {...(isCancelLoanForm ? {} : { "data-form-type": "other" })} // Remove data-form-type for cancel-loan
            />
            {field.validation?.maxLength && (
              <div className="text-right text-xs text-gray-500">
                {(value || "").length}/{field.validation.maxLength}
              </div>
            )}
          </div>
        );
      }
      case "select":
        return (
          <CustomSelect
            id={fieldId}
            value={value || ""}
            onChange={onChange}
            onBlur={handleBlur}
            options={fieldOptions}
            placeholder={field.placeholder}
            error={!!error}
            success={
              value && !error && hasBeenTouched && shouldShowSuccessState(field)
            }
            disabled={field.readOnly || isPrefilled}
          />
        );
      case "radio":
        return (
          <div className="space-y-1">
            {fieldOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-3 py-2">
                <input
                  id={`${fieldId}-${option.value}`}
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={handleBlur}
                  className="h-4 w-4 text-blue-600"
                />
                <label
                  htmlFor={`${fieldId}-${option.value}`}
                  className="text-sm text-gray-900"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      case "checkbox-group": {
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-1">
            {fieldOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-3 py-2">
                <input
                  id={`${fieldId}-${option.value}`}
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v) => v !== option.value);
                    onChange(newValues);
                  }}
                  onBlur={handleBlur}
                  className="h-4 w-4 text-blue-600"
                />
                <label
                  htmlFor={`${fieldId}-${option.value}`}
                  className="text-sm text-gray-900"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      }
      case "checkbox":
        // Handle simple boolean checkbox fields
        if (fieldOptions.length === 0) {
          return (
            <div className="flex items-center gap-3 py-2">
              <input
                id={fieldId}
                type="checkbox"
                name={field.id}
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
                onBlur={handleBlur}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor={fieldId}
                className="text-sm text-gray-900 cursor-pointer"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
          );
        }
        // Handle checkbox with options (checkbox-group style)
        return (
          <div className="space-y-1">
            {fieldOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-3 py-2">
                <input
                  id={`${fieldId}-${option.value}`}
                  type="checkbox"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={handleBlur}
                  className="h-4 w-4 text-blue-600"
                />
                <label
                  htmlFor={`${fieldId}-${option.value}`}
                  className="text-sm text-gray-900"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      case "consent":
        return (
          <div className="flex items-center gap-3 py-2">
            <input
              id={fieldId}
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={handleBlur}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor={fieldId} className="text-sm text-gray-900">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );
      case "date": {
        const autocompleteValue = getAutocompleteAttribute(field);
        const nameValue = getNameAttribute(field);
        return (
          <input
            id={fieldId}
            name={nameValue}
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            autoComplete={autocompleteValue || "off"}
            aria-label={field.label}
            className={getFieldClasses()}
          />
        );
      }
      case "file":
      case "image-upload": {
        // Helper to check if value is DocumentReference
        const isDocumentReference = (val: any): val is DocumentReference => {
          return val && typeof val === 'object' && val.type === 'document';
        };
        
        // Get file name from value (File or DocumentReference)
        const getFileName = () => {
          if (!value) return null;
          if (isDocumentReference(value)) return value.name;
          if (value instanceof File) return value.name;
          return value.name || 'Unknown';
        };
        
        // Get display info
        const fileName = getFileName();
        const isFromWallet = value && isDocumentReference(value);
        
        // Get allowed file types from field validation
        const allowedFileTypes = field.validation?.fileTypes || [];
        const maxFileSize = field.validation?.maxFileSize || 5242880; // 5MB default
        
        return (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsDocumentSelectorOpen(true)}
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to select</span> from Document Wallet or upload
                </p>
                {allowedFileTypes.length > 0 && (
                  <p className="text-xs text-gray-400">
                    Allowed: {allowedFileTypes.join(', ')}
                  </p>
                )}
              </div>
            </button>
            
            {value && (
              <div className={`flex items-center justify-between p-3 border rounded-lg ${
                isFromWallet 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-3 ${
                    isFromWallet ? 'text-blue-500' : 'text-green-500'
                  }`} />
                  <div>
                    <span className={`text-sm font-medium ${
                      isFromWallet ? 'text-blue-800' : 'text-green-800'
                    }`}>
                      {fileName}
                    </span>
                    {isFromWallet && (
                      <span className="ml-2 text-xs text-blue-600">
                        (from Document Wallet)
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <DocumentSelector
              open={isDocumentSelectorOpen}
              onOpenChange={setIsDocumentSelectorOpen}
              onSelect={(selection) => {
                onChange(selection);
                setIsDocumentSelectorOpen(false);
              }}
              mode="single"
              allowedFileTypes={allowedFileTypes}
              maxFileSize={maxFileSize}
              fieldLabel={field.label.toLowerCase()}
            />
          </div>
        );
      }

      case "multi-file": {
        // Helper to check if item is DocumentReference
        const isDocumentReference = (val: any): val is DocumentReference => {
          return val && typeof val === 'object' && val.type === 'document';
        };
        
        // Get files array - can contain File objects or DocumentReference objects
        const files = Array.isArray(value) ? value : [];
        const maxFiles = field.validation?.max || 5; // Default max 5 files
        const maxFileSize = field.validation?.maxFileSize || 5242880; // Default 5MB in bytes
        const allowedTypes = field.validation?.fileTypes || [
          ".pdf",
          ".doc",
          ".docx",
          ".jpg",
          ".jpeg",
          ".png",
          ".txt",
        ];
        
        // Get file name helper
        const getFileName = (item: File | DocumentReference | any) => {
          if (isDocumentReference(item)) return item.name;
          if (item instanceof File) return item.name;
          if (item && typeof item === 'object' && 'name' in item) return item.name;
          return 'Unknown';
        };
        
        // Get file size helper (only for File objects)
        const getFileSize = (item: File | DocumentReference) => {
          if (item instanceof File) return (item.size / 1024).toFixed(1) + ' KB';
          if (isDocumentReference(item)) return 'from Document Wallet';
          return '';
        };
        
        // Remove file handler
        const handleRemoveFile = (index: number) => {
          const newFiles = files.filter((_, i) => i !== index);
          onChange(newFiles.length > 0 ? newFiles : []);
        };

        return (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsDocumentSelectorOpen(true)}
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to select</span> from Document Wallet or upload
                </p>
                <p className="text-xs text-gray-400">
                  Max {maxFiles} files, {(maxFileSize / 1048576).toFixed(1)}MB each
                </p>
                <p className="text-xs text-gray-400">
                  {allowedTypes.join(", ")}
                </p>
              </div>
            </button>

            {fileError && (
              <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{fileError}</p>
              </div>
            )}

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file: File | DocumentReference, index: number) => {
                  const isFromWallet = isDocumentReference(file);
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        isFromWallet
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <CheckCircle className={`w-5 h-5 mr-3 flex-shrink-0 ${
                          isFromWallet ? 'text-blue-500' : 'text-green-500'
                        }`} />
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${
                            isFromWallet ? 'text-blue-800' : 'text-green-800'
                          }`}>
                            {getFileName(file)}
                          </p>
                          <p className={`text-xs ${
                            isFromWallet ? 'text-blue-600' : 'text-green-600'
                          }`}>
                            {getFileSize(file)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFileError(null);
                          handleRemoveFile(index);
                        }}
                        className="text-red-500 hover:text-red-700 ml-3 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {files.length > 0 && (
              <p className="text-sm text-gray-600">
                {files.length} of {maxFiles} file{files.length !== 1 ? "s" : ""}{" "}
                selected
              </p>
            )}
            
            <DocumentSelector
              open={isDocumentSelectorOpen}
              onOpenChange={setIsDocumentSelectorOpen}
              onSelect={(selection) => {
                // Handle both single and array selections
                const newSelection = Array.isArray(selection) ? selection : [selection];
                const currentFiles = Array.isArray(value) ? value : [];
                const remainingSlots = maxFiles - currentFiles.length;
                
                if (newSelection.length > remainingSlots) {
                  setFileError(
                    remainingSlots === 0
                      ? `Maximum of ${maxFiles} files reached. Remove files to add more.`
                      : `You can only add ${remainingSlots} more file${remainingSlots !== 1 ? 's' : ''}. Maximum ${maxFiles} files total.`
                  );
                  return;
                }
                
                // Merge with existing files
                const updatedFiles = [...currentFiles, ...newSelection];
                onChange(updatedFiles);
                setFileError(null);
                setIsDocumentSelectorOpen(false);
              }}
              mode="multi"
              allowedFileTypes={allowedTypes}
              maxFileSize={maxFileSize}
              maxFiles={maxFiles}
              fieldLabel={field.label.toLowerCase()}
            />
          </div>
        );
      }

      case "table":
        return (
          <AssetTableField
            value={value || []}
            onChange={onChange}
            options={field.options as Array<{ assetName: string; assetNumber: string }>}
            error={error}
            emptyMessage={field.tableConfig?.emptyMessage}
          />
        );
      case "course-table":
        return <CourseTableField value={value || []} onChange={onChange} />;
      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Unsupported field type: {field.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      {!["checkbox", "switch", "consent"].includes(field.type) && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-semibold text-gray-900"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderField()}
      {field.helperText && !error && (
        <p className="text-xs text-gray-500">{field.helperText}</p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Progress Indicator
const ProgressIndicator: React.FC<{
  steps: FormStep[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (stepIndex: number) => void;
}> = ({ steps, currentStep, completedSteps, onStepClick }) => {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-4 mb-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex items-center">
              <button
                onClick={() => completedSteps.has(index) && onStepClick(index)}
                disabled={!completedSteps.has(index) && index !== currentStep}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${completedSteps.has(index)
                  ? "bg-green-500 text-white cursor-pointer hover:bg-green-600"
                  : currentStep === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 cursor-not-allowed"
                  }`}
              >
                {completedSteps.has(index) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </button>
              <div className="ml-4 hidden sm:block">
                <p
                  className={`text-sm font-medium ${currentStep === index ? "text-blue-600" : "text-gray-500"
                    }`}
                >
                  {step.stepTitle}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-6 transition-all duration-300 ${completedSteps.has(index) ? "bg-green-500" : "bg-gray-200"
                  }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Error Summary
const ErrorSummary: React.FC<{
  errors: Record<string, string>;
}> = ({ errors }) => {
  const errorCount = Object.keys(errors).length;
  if (errorCount === 0) return null;

  return (
    <div
      className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-6"
      role="alert"
    >
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">
            Please correct {errorCount} error{errorCount !== 1 ? "s" : ""} below
            to continue
          </p>
        </div>
      </div>
    </div>
  );
};

// Success State
const SuccessState: React.FC<{
  onClose?: () => void;
  referenceId?: string;
  formTitle?: string;
}> = ({ onClose, referenceId, formTitle }) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Submission Successful!
      </h2>
      <p className="text-gray-600 mb-2 max-w-md mx-auto">
        Your {formTitle || 'request'} has been successfully submitted to our system.
      </p>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Our team will review your submission and get back to you shortly.
      </p>
      {referenceId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 inline-block">
          <p className="text-sm text-blue-700 font-medium mb-1">Reference Number</p>
          <p className="font-mono text-xl font-bold text-blue-900">
            {referenceId}
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Please save this reference number for tracking your request
          </p>
        </div>
      )}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
        <p className="text-sm text-gray-700">
          <strong>What happens next?</strong>
        </p>
        <ul className="text-sm text-gray-600 mt-2 space-y-1 text-left">
          <li>• Your request is now in our CRM system</li>
          <li>• You'll receive a confirmation email shortly</li>
          <li>• Our team will review and process your submission</li>
          <li>• You can track the status in your dashboard</li>
        </ul>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Return to Dashboard
        </button>
      )}
    </div>
  );
};

// Form Preview Component
const FormPreview: React.FC<{
  formData: any;
  schema: FormSchema;
  onClose: () => void;
  isInline?: boolean;
}> = ({ formData, schema, onClose, isInline = false }) => {
  // NOTE: useScrollLock is omitted here as it must be called unconditionally
  // if (!isInline) { useScrollLock(true); }

  const formatValue = (field: FormField, value: any): string => {
    if (!value) return "Not provided";

    switch (field.type) {
      case "checkbox-group":
      case "multiselect":
        return Array.isArray(value) ? value.join(", ") : String(value);
      case "radio":
      case "select": {
        const options = field.globalOptionSet
          ? getGlobalOptions(field.globalOptionSet)
          : field.options || [];
        const selectedOption = options.find(opt => opt.value === value);
        return selectedOption ? selectedOption.label : String(value);
      }
      case "checkbox":
      case "consent":
        return value ? "Yes" : "No";
      case "file":
      case "image-upload": {
        // Handle DocumentReference
        if (value && typeof value === 'object' && value.type === 'document') {
          return value.name || "Document from Wallet";
        }
        // Handle File object
        return value?.name || "File uploaded";
      }
      case "multi-file": {
        if (!Array.isArray(value) || value.length === 0) {
          return "No files selected";
        }
        // Count files and document references
        const fileCount = value.length;
        const walletCount = value.filter((v: any) => v && typeof v === 'object' && v.type === 'document').length;
        const fileCountOnly = fileCount - walletCount;
        
        const parts: string[] = [];
        if (fileCountOnly > 0) parts.push(`${fileCountOnly} file${fileCountOnly !== 1 ? 's' : ''}`);
        if (walletCount > 0) parts.push(`${walletCount} from Document Wallet`);
        
        return parts.length > 0 ? parts.join(', ') : `${fileCount} file${fileCount !== 1 ? 's' : ''} selected`;
      }
      case "table":
        return Array.isArray(value)
          ? `${value.length} asset(s) selected`
          : "No assets selected";
      case "currency": {
        const currencySymbol = field.currency === "USD" ? "$" : field.currency || "$";
        return `${currencySymbol}${Number(value).toLocaleString()}`;
      }
      default:
        return String(value);
    }
  };

  const getVisibleFields = (groups: FormGroup[]) => {
    const visibleFields: { group: FormGroup; field: FormField; value: any }[] = [];

    groups.forEach(group => {
      group.fields.forEach(field => {
        if (field.conditionalLogic) {
          const { dependsOn, showWhen } = field.conditionalLogic;
          const dependentValue = formData[dependsOn];
          const isVisible = Array.isArray(showWhen)
            ? showWhen.includes(dependentValue)
            : dependentValue === showWhen;
          if (!isVisible) return;
        }

        const value = formData[field.id];
        if (value !== undefined && value !== null && value !== "") {
          visibleFields.push({ group, field, value });
        }
      });
    });

    return visibleFields;
  };


  const allGroups = schema.multiStep
    ? schema.steps?.flatMap(step => step.groups) || []
    : schema.groups || [];

  const visibleFields = getVisibleFields(allGroups);

  // Use a map to track which group title has already been rendered.
  const groupTitleMap = new Map<string, number>();
  // let currentGroupIndex = 0;

  // 2. Define the core content of the preview
  const content = (
    <div className={`p-5 ${isInline ? 'border-none' : 'border w-full max-w-4xl shadow-lg rounded-md'} bg-white`}>

        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${isInline ? 'text-gray-800' : 'text-gray-900'}`}>
            Review Entered Data
          </h2>
          {/* Only show close button if it's NOT inline (i.e., a modal) */}
          {!isInline && (
              <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
          )}
        </div>

        <div
            className="space-y-4 max-h-[35rem] overflow-y-auto pr-2"
        >
          {visibleFields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No data to preview
              </div>
          ) : (
              visibleFields.map(({ group, field, value }, index) => {
                const isFirstFieldInGroup = !groupTitleMap.has(group.groupTitle) || groupTitleMap.get(group.groupTitle) === index;

                // If it's the first field of a group, update the map and display the title.
                if (!groupTitleMap.has(group.groupTitle)) {
                  groupTitleMap.set(group.groupTitle, index);
                }

                // Determine the label to display
                let displayLabel = field.label;
                if (field.type === 'consent' || field.type === 'checkbox') {
                  // 1. Split the label into words
                  const words = field.label.split(/\s+/);
                  // 2. Take the first 10 words (or whatever number looks best)
                  const shortLabel = words.slice(0, 10).join(' ');

                  // 3. Use the shortened label
                  displayLabel = shortLabel + (words.length > 10 ? '...' : '');
                }

                return (
                    <div key={index} className="border-b border-gray-200 py-3">
                      {/* 1. Show group title only once */}
                      {isFirstFieldInGroup && (
                          <h3 className="text-sm font-semibold text-blue-600 mb-2 mt-2">
                            {group.groupTitle}
                          </h3>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4">
                        {/* Label: Give it fixed space (col-span-1 on small, col-span-1 on medium+) */}
                        <div className="col-span-1 pr-2">
                          <p className="text-sm font-medium text-gray-700">
                            {displayLabel}
                          </p>
                        </div>
                        {/* Value: Let it take the remaining space and ensure proper word wrapping */}
                        <div className="col-span-1 sm:col-span-2">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                            {formatValue(field, value)}
                          </p>
                        </div>
                      </div>
                    </div>
                )
              })
          )}
        </div>

        {/* PDF Export Button - Show for both inline and modal */}
        {visibleFields.length > 0 && (
            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                  onClick={() => {
                    const formFields: FormFieldData[] = visibleFields.map(({ group, field, value }) => ({
                      label: field.label,
                      value: formatFieldValueForPDF(field, value),
                      group: group.groupTitle,
                    }));
                    generateFormPDF(formData, formFields, schema.formTitle || 'Form Submission');
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export to PDF
              </button>
              {/* Only show close button if it's NOT inline (i.e., a modal) */}
        {!isInline && (
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Close
                </button>
              )}
            </div>
        )}

        {/* 4. Only show the close button if it's NOT inline and no fields (i.e., a modal) */}
        {!isInline && visibleFields.length === 0 && (
            <div className="mt-6 flex justify-end">
              <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
        )}
    </div>
  );

  // 5. Return the modal wrapper if it's a modal, otherwise return just the content
  if (isInline) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-8">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto max-w-4xl">
        {content}
      </div>
    </div>
  );
};

// Course Table Component
interface CourseTableData {
  courseName: string;
  language: string;
  meetingType: string;
  startDate: string;
  description: string;
  time: string;
  duration: string;
  location: string;
  trainer: string;
  fees: string;
}

const CourseTableField: React.FC<{
  value: CourseTableData[];
  onChange: (value: CourseTableData[]) => void;
}> = ({ value, onChange }) => {
  const [courses, setCourses] = useState<CourseTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<CourseTableData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const coursesPerPage = 10;

  // Filter states
  const [filters, setFilters] = useState({
    courseName: "",
    language: "",
    meetingType: "",
    startDate: "",
  });

  const courseNameOptions = [
    { value: "business-fundamentals", label: "Business Fundamentals" },
    { value: "marketing-strategy", label: "Marketing Strategy" },
    { value: "financial-management", label: "Financial Management" },
    { value: "leadership-development", label: "Leadership Development" },
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "project-management", label: "Project Management" },
  ];

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "arabic", label: "Arabic" },
    { value: "french", label: "French" },
    { value: "spanish", label: "Spanish" },
  ];

  const meetingTypeOptions = [
    { value: "online", label: "Online" },
    { value: "in-person", label: "In-Person" },
    { value: "hybrid", label: "Hybrid" },
  ];

  // Simulate fetching courses from server
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Replace this with actual API call
        // const response = await fetch('/api/courses');
        // const data = await response.json();

        // Mock data for demonstration
        const mockCourses: CourseTableData[] = [
          {
            courseName: "business-fundamentals",
            language: "english",
            meetingType: "online",
            startDate: "2025-10-15",
            description: "Learn the core principles of business management",
            time: "10:00 AM - 12:00 PM",
            duration: "8 weeks",
            location: "Virtual Classroom",
            trainer: "Dr. Sarah Johnson",
            fees: "$499"
          },
          {
            courseName: "marketing-strategy",
            language: "english",
            meetingType: "hybrid",
            startDate: "2025-10-20",
            description: "Master modern marketing techniques",
            time: "2:00 PM - 4:00 PM",
            duration: "6 weeks",
            location: "Room 301 / Online",
            trainer: "Michael Chen",
            fees: "$599"
          },
          // Add more mock courses to test pagination
          ...Array.from({ length: 15 }, (_, i) => ({
            courseName: courseNameOptions[i % courseNameOptions.length].value,
            language: languageOptions[i % languageOptions.length].value,
            meetingType: meetingTypeOptions[i % meetingTypeOptions.length].value,
            startDate: `2025-${String(10 + (i % 3)).padStart(2, '0')}-${String(15 + i).padStart(2, '0')}`,
            description: `Course description for course ${i + 3}`,
            time: `${9 + (i % 8)}:00 AM - ${11 + (i % 8)}:00 AM`,
            duration: `${4 + (i % 8)} weeks`,
            location: i % 2 === 0 ? "Virtual Classroom" : `Room ${200 + i}`,
            trainer: `Instructor ${i + 3}`,
            fees: `$${400 + (i * 50)}`
          }))
        ];

        setCourses(mockCourses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  //Conditionally confirm whether the scroll lock should be called or not
  const shouldLockScroll = showModal && !!selectedCourse;
  useScrollLock(shouldLockScroll);


  // Filter courses
  const filteredCourses = courses.filter((course) => {
    return (
      (!filters.courseName || course.courseName === filters.courseName) &&
      (!filters.language || course.language === filters.language) &&
      (!filters.meetingType || course.meetingType === filters.meetingType) &&
      (!filters.startDate || course.startDate === filters.startDate)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      courseName: "",
      language: "",
      meetingType: "",
      startDate: "",
    });
    setCurrentPage(1);
  };

  const handleRowClick = (course: CourseTableData) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleConfirmSelection = () => {
    if (selectedCourse) {
      // Add selected course to value array
      onChange([...value, selectedCourse]);
      setShowModal(false);
      setSelectedCourse(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getLabel = (options: Array<{ value: string; label: string }>, value: string) => {
    return options.find(opt => opt.value === value)?.label || value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Name
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.courseName}
              onChange={(e) => handleFilterChange('courseName', e.target.value)}
            >
              <option value="">All Courses</option>
              {courseNameOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="">All Languages</option>
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.meetingType}
              onChange={(e) => handleFilterChange('meetingType', e.target.value)}
            >
              <option value="">All Types</option>
              {meetingTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredCourses.length === courses.length
              ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredCourses.length)} of ${courses.length} courses`
              : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredCourses.length)} of ${filteredCourses.length} filtered courses (${courses.length} total)`
            }
          </div>
          {(filters.courseName || filters.language || filters.meetingType || filters.startDate) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No courses match the current filters
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meeting Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCourses.map((course, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(course)}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {getLabel(courseNameOptions, course.courseName)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {getLabel(languageOptions, course.language)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {getLabel(meetingTypeOptions, course.meetingType)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {course.startDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Selection Modal */}
      {showModal && selectedCourse && (
        <>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center !mt-0">
            <div className="relative mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Confirm Course Selection
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Course Details */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Course Name
                    </label>
                    <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                      {getLabel(courseNameOptions, selectedCourse.courseName)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Language
                    </label>
                    <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                      {getLabel(languageOptions, selectedCourse.language)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Meeting Type
                    </label>
                    <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                      {getLabel(meetingTypeOptions, selectedCourse.meetingType)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Start Date
                    </label>
                    <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                      {selectedCourse.startDate}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Time
                    </label>
                    <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                      {selectedCourse.time}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Duration
                    </label>
                    <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                      {selectedCourse.duration}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                      {selectedCourse.location}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Trainer
                    </label>
                    <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                      {selectedCourse.trainer}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Fees
                    </label>
                    <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md font-semibold">
                      {selectedCourse.fees}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                    {selectedCourse.description}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSelection}
                  className="px-6 py-2.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};



// Main ServiceRequestForm Component
export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  schema: providedSchema,
  onSubmit,
  onSave,
  initialData = {},
  "data-id": dataId,
}) => {
  const schema = useMemo(
    () => validateSchema(providedSchema),
    [providedSchema]
  );
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    // If no initialData provided or it's empty, start with empty object
    if (!initialData || Object.keys(initialData).length === 0) {
      return {};
    }
    return initialData;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string>();
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(
    new Set()
  );
  const formRef = useRef<HTMLDivElement>(null);
  const defaultsSetRef = useRef(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [prefilledFields, setPrefilledFields] = useState<Set<string>>(new Set());

  // Update formData when initialData changes and track prefilled fields
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      console.log('🔄 FormPreview: Setting form data from initialData:', initialData);
      setFormData(initialData);
      
      // Track which fields were prefilled (have non-empty values)
      const prefilled = new Set<string>();
      Object.keys(initialData).forEach(key => {
        const value = initialData[key];
        if (value !== undefined && value !== null && value !== '') {
          prefilled.add(key);
        }
      });
      setPrefilledFields(prefilled);
      console.log('🔒 Prefilled fields (read-only):', Array.from(prefilled));
    }
  }, [initialData]);

  // Force clear any unexpected data on mount (only if no initialData)
  useEffect(() => {
    if (!initialData || Object.keys(initialData).length === 0) {
      setFormData({});
    }
    
    // Clear any persisted form data from browser
    const clearBrowserData = () => {
      try {
        // Clear any potential localStorage/sessionStorage
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('form') || key.includes('signup')) {
            localStorage.removeItem(key);
          }
        });
        
        const sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach(key => {
          if (key.includes('form') || key.includes('signup')) {
            sessionStorage.removeItem(key);
          }
        });
      } catch (e) {
        // Ignore errors
      }
    };
    
    clearBrowserData();
  }, []);

  // Autofill detection and sync - detects browser autofill and syncs to React state
  // This makes autofilled values visible immediately without requiring user interaction
  useEffect(() => {
    const detectAndSyncAutofill = () => {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach((input: any) => {
        const fieldId = input.id?.replace('field-', '');
        if (!fieldId) return;
        
        // Check if DOM has value but React state doesn't (indicates autofill)
        const hasDomValue = input.value && input.value !== '';
        
        // Get current formData value for this field
        setFormData((prev: any) => {
          const hasReactValue = prev[fieldId] !== undefined && prev[fieldId] !== '';
          
          // If DOM has value but React state doesn't, it's autofill
          // Sync it to React state
          if (hasDomValue && !hasReactValue) {
            return {
              ...prev,
              [fieldId]: input.value
            };
          }
          
          // No change needed
          return prev;
        });
      });
    };

    // Check multiple times as autofill happens asynchronously
    // Check immediately, then at intervals to catch delayed autofill
    detectAndSyncAutofill();
    const timeout1 = setTimeout(detectAndSyncAutofill, 100);
    const timeout2 = setTimeout(detectAndSyncAutofill, 500);
    const timeout3 = setTimeout(detectAndSyncAutofill, 1000);
    const timeout4 = setTimeout(detectAndSyncAutofill, 2000);
    
    // Set up an interval to periodically check for autofill
    // This catches autofill that happens after the initial checks
    // Stop checking after 10 seconds as autofill typically happens quickly
    const interval = setInterval(detectAndSyncAutofill, 1000);
    const stopInterval = setTimeout(() => {
      clearInterval(interval);
    }, 10000); // Stop checking after 10 seconds
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearTimeout(stopInterval);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - the interval will catch autofill events

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        const currentGroups = schema.multiStep
          ? schema.steps?.[currentStep]?.groups || []
          : schema.groups || [];
        const initialCollapsed = new Set<number>();
        currentGroups.forEach((_, index) => {
          if (index > 0) initialCollapsed.add(index);
        });
        setCollapsedSections(initialCollapsed);
      } else {
        setCollapsedSections(new Set());
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [currentStep, schema]);


  // Load draft on mount
  useEffect(() => {
    if (!schema.formId || defaultsSetRef.current) return;
    defaultsSetRef.current = true;

    const draft = loadFormDraft(schema.formId);
    if (draft && draft.formData && Object.keys(draft.formData).length > 0) {
      // Merge draft data with initialData (initialData takes precedence if provided)
      const mergedData = Object.keys(initialData).length > 0
        ? { ...draft.formData, ...initialData } // Initial data overrides draft
        : draft.formData; // Use draft if no initial data
      
      setFormData(mergedData);
      
      // Restore step position if multi-step
      if (schema.multiStep && draft.currentStep !== undefined) {
        setCurrentStep(draft.currentStep);
        if (draft.completedSteps && draft.completedSteps.length > 0) {
          setCompletedSteps(new Set(draft.completedSteps));
        }
      }
      
      setDraftRestored(true);
      setTimeout(() => setDraftRestored(false), 3000);
      
      // Update last saved reference
      lastSavedRef.current = JSON.stringify(mergedData);
    } else {
      // No draft, use initialData or set defaults
      if (Object.keys(initialData).length > 0) {
        setFormData(initialData);
      } else {
    const defaults: any = {};
    const allGroups = schema.multiStep
      ? schema.steps?.flatMap((step) => step.groups) || []
      : schema.groups || [];

    allGroups.forEach((group) => {
      group.fields.forEach((field) => {
        // Only set default if field doesn't already have a value
            if (field.defaultValue !== undefined) {
          defaults[field.id] = field.defaultValue;
        }
      });
    });

    if (Object.keys(defaults).length > 0) {
          setFormData(defaults);
        }
      }
      lastSavedRef.current = JSON.stringify(formData);
    }
  }, [schema.formId]); // Only run once on mount

  // Auto-save draft whenever form data changes
  useEffect(() => {
    if (!schema.formId) return;
    if (!draftRestored && Object.keys(formData).length === 0) return; // Don't save empty form immediately

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Debounce auto-save (save 2 seconds after last change)
    autoSaveTimeoutRef.current = setTimeout(() => {
      const currentDataString = JSON.stringify(formData);
      
      // Only save if data has changed
      if (currentDataString !== lastSavedRef.current) {
        setDraftSaving(true);
        const completedStepsArray = Array.from(completedSteps);
        const saved = saveFormDraft(
          schema.formId,
          formData,
          currentStep,
          completedStepsArray
        );
        
        if (saved) {
          lastSavedRef.current = currentDataString;
          setTimeout(() => setDraftSaving(false), 1000);
        } else {
          setDraftSaving(false);
        }
      }
    }, 2000); // 2 second debounce

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, currentStep, completedSteps, schema.formId, draftRestored]);

  const handleFieldChange = useCallback(
    (fieldId: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
      }));
      if (errors[fieldId]) {
        setErrors((prev) => {
          const newErrors = {
            ...prev,
          };
          delete newErrors[fieldId];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleFieldBlur = (fieldId: string) => {
    const allGroups = schema.multiStep
      ? schema.steps?.flatMap((step) => step.groups) || []
      : schema.groups || [];
    const field = allGroups
      .flatMap((group) => group.fields)
      .find((f) => f.id === fieldId);

    if (field) {
      const fieldValue = formData[fieldId];
      if (
        fieldValue &&
        (typeof fieldValue !== "string" || fieldValue.trim() !== "")
      ) {
        const error = validateField(field, fieldValue);
        if (error) {
          setErrors((prev) => ({
            ...prev,
            [fieldId]: error,
          }));
        }
      }
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    navigate("/dashboard/requests"); // redirect to requests page
  };

  const validateStep = (stepIndex?: number): boolean => {
    const currentGroups = schema.multiStep
      ? schema.steps?.[stepIndex ?? currentStep]?.groups || []
      : schema.groups || [];
    const stepErrors: Record<string, string> = {};
    let isValid = true;
    
    // If no groups or all groups have no fields, the step is valid (e.g., Review & Summary step)
    const hasFields = currentGroups.some(group => group.fields && group.fields.length > 0);
    if (!hasFields) {
      setErrors({});
      return true;
    }
    
    currentGroups.forEach((group) => {
      // Skip validation for groups with no fields
      if (!group.fields || group.fields.length === 0) {
        return;
      }
      group.fields.forEach((field) => {
        if (field.conditionalLogic) {
          const { dependsOn, showWhen } = field.conditionalLogic;
          const dependentValue = formData[dependsOn];
          const isVisible = Array.isArray(showWhen)
            ? showWhen.includes(dependentValue)
            : dependentValue === showWhen;
          if (!isVisible) return;
        }
        const error = validateField(field, formData[field.id]);
        if (error) {
          stepErrors[field.id] = error;
          isValid = false;
        }
      });
    });
    setErrors(stepErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep((prev) => prev + 1);
      formRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    formRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleStepClick = (stepIndex: number) => {
    if (completedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
      formRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const handleSaveAndClose = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (sectionIndex: number) => {
    setCollapsedSections((prev) => {
      const newCollapsed = new Set(prev);
      if (newCollapsed.has(sectionIndex)) {
        newCollapsed.delete(sectionIndex);
      } else {
        newCollapsed.add(sectionIndex);
      }
      return newCollapsed;
    });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      const refId = `REQ-${Date.now().toString().slice(-6)}`;
      setReferenceId(refId);
      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" }); // 👈 scroll to top
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentGroups = schema.multiStep
    ? schema.steps?.[currentStep]?.groups || []
    : schema.groups || [];
  const currentStepData = schema.multiStep ? schema.steps?.[currentStep] : null;
  const isLastStep = schema.multiStep
    ? currentStep === (schema.steps?.length || 1) - 1
    : true;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50" data-id={dataId}>
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-6 sm:py-8">
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <SuccessState
              // onClose={() => setShowSuccess(false)}
              onClose={handleClose}
              referenceId={referenceId}
              formTitle={schema.formTitle}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{autofillStyles}</style>
      <div className="min-h-screen bg-gray-50" ref={formRef} data-id={dataId}>
        <div className="max-w-12xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
          <div className="flex justify-end items-center mb-4">
            {/* Draft status indicators */}
            <div className="flex items-center gap-2">
              {draftRestored && (
                <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span>Draft restored</span>
                </div>
              )}
              {draftSaving && (
                <div className="flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  <Save className="w-4 h-4 animate-pulse" />
                  <span>Saving...</span>
                </div>
              )}
              {!draftSaving && !draftRestored && schema.formId && hasFormDraft(schema.formId) && (
                <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span>Draft saved</span>
                </div>
              )}
            </div>
          </div>

          {schema.multiStep && schema.steps && (
            <ProgressIndicator
              steps={schema.steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />
          )}

          <form autoComplete="new-password" onSubmit={(e) => e.preventDefault()} data-lpignore="true" data-1p-ignore="true">
            {/* Multiple honeypot fields to confuse autofill */}
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', height: 0, overflow: 'hidden' }}>
              <input type="text" name="username" tabIndex={-1} autoComplete="new-password" />
              <input type="password" name="password" tabIndex={-1} autoComplete="new-password" />
              <input type="email" name="email" tabIndex={-1} autoComplete="new-password" />
              <input type="text" name="firstName" tabIndex={-1} autoComplete="new-password" />
              <input type="text" name="lastName" tabIndex={-1} autoComplete="new-password" />
              <input type="text" name="name" tabIndex={-1} autoComplete="new-password" />
              <input type="tel" name="phone" tabIndex={-1} autoComplete="new-password" />
              <input type="text" name="company" tabIndex={-1} autoComplete="new-password" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            {schema.multiStep && currentStepData && (
              <div className="mb-8">
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  Step {currentStep + 1}: {currentStepData.stepTitle}
                </h1>
                {currentStepData.stepDescription && (
                  <p className="text-sm text-gray-600 mt-1">
                    {currentStepData.stepDescription}
                  </p>
                )}
              </div>
            )}

            {!schema.multiStep && (
              <div className="mb-8">
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  {schema.formTitle}
                </h1>
                {schema.formDescription && (
                  <p className="text-sm text-gray-600 mt-1">
                    {schema.formDescription}
                  </p>
                )}
              </div>
            )}

            <ErrorSummary errors={errors} />

            {/* Handles the File Preview display - Only show on Review/Summary steps, not on consent steps */}
            {schema.multiStep && currentStepData && currentStepData.stepTitle && (
              (currentStepData.stepTitle.toLowerCase().includes('review') || 
               currentStepData.stepTitle.toLowerCase().includes('summary')) ? (
                <div className="mb-8"> {/* Provides proper spacing before the field group */}
                  <FormPreview
                      formData={formData}
                      schema={schema}
                      onClose={() => {}}
                      isInline={true} // Ensures in-line rendering
                  />
                </div>
              ) : null
            )}

            <div className="space-y-10">
              {currentGroups.map((group, index) => {
                const isCollapsed = isMobile && collapsedSections.has(index);
                
                // Handle empty groups (used for Review & Summary steps)
                if (!group.fields || group.fields.length === 0) {
                  // Only show group description if it exists
                  if (group.groupDescription) {
                    return (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 bg-white p-6"
                      >
                        <h3 className="text-sm font-semibold text-blue-600 mb-2">
                          {group.groupTitle}
                        </h3>
                        {group.groupDescription && (
                          <p className="text-sm text-gray-600">
                            {group.groupDescription}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }
                
                return (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-white"
                  >
                    <div className="px-8 py-6 pb-0">
                      {isMobile ? (
                        <button
                          type="button"
                          onClick={() => toggleSection(index)}
                          className="w-full flex items-center justify-between py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                        >
                          <h3 className="text-sm font-semibold text-blue-600">
                            {group.groupTitle}
                          </h3>
                          {isCollapsed ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      ) : (
                        <h3 className="text-sm font-semibold text-blue-600">
                          {group.groupTitle}
                        </h3>
                      )}
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed
                        ? "max-h-0 opacity-0"
                        : "max-h-none opacity-100"
                        }`}
                    >
                      <div className="px-8 pb-6 mt-4 space-y-4">
                        {group.fields.map((field) => {
                          const isVisible = field.conditionalLogic
                            ? (() => {
                              const { dependsOn, showWhen } =
                                field.conditionalLogic;
                              const dependentValue = formData[dependsOn];
                              return Array.isArray(showWhen)
                                ? showWhen.includes(dependentValue)
                                : dependentValue === showWhen;
                            })()
                            : true;
                          if (!isVisible) return null;

                          const nextField =
                            group.fields[group.fields.indexOf(field) + 1];
                          const isNextFieldLastName =
                            nextField?.id === "lastName";
                          if (field.id === "firstName" && isNextFieldLastName) {
                            return (
                              <div
                                key={field.id}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                              >
                                <FormField
                                  field={field}
                                  value={formData[field.id]}
                                  onChange={(value) =>
                                    handleFieldChange(field.id, value)
                                  }
                                  onBlur={() => handleFieldBlur(field.id)}
                                  error={errors[field.id]}
                                  isVisible={true}
                                  isPrefilled={prefilledFields.has(field.id)}
                                />
                                <FormField
                                  field={nextField}
                                  value={formData[nextField.id]}
                                  onChange={(value) =>
                                    handleFieldChange(nextField.id, value)
                                  }
                                  onBlur={() => handleFieldBlur(nextField.id)}
                                  error={errors[nextField.id]}
                                  isVisible={true}
                                  isPrefilled={prefilledFields.has(nextField.id)}
                                />
                              </div>
                            );
                          }
                          if (field.id === "lastName") {
                            const prevField =
                              group.fields[group.fields.indexOf(field) - 1];
                            if (prevField?.id === "firstName") return null;
                          }
                          return (
                            <FormField
                              key={field.id}
                              field={field}
                              value={formData[field.id]}
                              onChange={(value) =>
                                handleFieldChange(field.id, value)
                              }
                              onBlur={() => handleFieldBlur(field.id)}
                              error={errors[field.id]}
                              isVisible={true}
                              formId={schema.formId} // Pass formId for cancel-loan form detection
                              isPrefilled={prefilledFields.has(field.id)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-8 mt-1">
              <div
                className={`flex gap-4 ${isMobile
                  ? "flex-col space-y-2"
                  : "flex-row justify-between items-center"
                  }`}
              >
                <div
                  className={`flex gap-3 ${isMobile ? "flex-col space-y-2" : "flex-row"
                    }`}
                >
                  {schema.multiStep && currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className={`inline-flex items-center justify-center min-h-12 px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isMobile ? "w-full" : "w-full sm:w-auto"
                        }`}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                  )}
                  {schema.allowSaveAndContinue && !isLastStep && (
                    <button
                      type="button"
                      onClick={handleSaveAndClose}
                      disabled={isSaving}
                      className={`inline-flex items-center justify-center min-h-12 px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${isMobile ? "w-full" : "w-full sm:w-auto"
                        }`}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save & Close"}
                    </button>
                  )}
                </div>

                <div>
                  {isLastStep ? (
                    <Can I="create" a="user-forms" passThrough>
                      {(allowed) => {
                        const button = (
                          <button
                            type="button"
                            onClick={allowed ? handleSubmit : undefined}
                            disabled={isSubmitting || !allowed}
                            className={`inline-flex items-center justify-center min-h-12 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-base font-semibold text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm ${isMobile ? "w-full" : "w-full sm:w-auto"
                              }`}
                            aria-disabled={isSubmitting || !allowed}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {isSubmitting ? "Submitting..." : "Submit Request"}
                          </button>
                        );

                        if (!allowed && !isSubmitting) {
                          return (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className={`inline-block ${isMobile ? "w-full" : "w-full sm:w-auto"}`}>
                                    {button}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>You don't have permission to submit forms</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        }

                        return button;
                      }}
                    </Can>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className={`inline-flex items-center justify-center min-h-12 px-6 py-3 bg-blue-600 text-base font-semibold text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm ${isMobile ? "w-full" : "w-full sm:w-auto"
                        }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};