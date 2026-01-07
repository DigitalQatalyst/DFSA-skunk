/**
 * ProfileSectionForm Component
 * Generic form renderer based on schema
 * Will be enhanced per tab with specific field types
 */

import { useForm, Controller } from 'react-hook-form';
import { Can } from '../RBAC/Can';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export interface FieldConfig {
  id: string;
  label: string;
  fieldName: string;
  fieldType: string;
  mandatory?: boolean | string[];
  readOnly?: boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  tooltip?: {
    title?: string;
    body?: string;
  };
  addressFields?: Record<string, {
    label: string;
    fieldName: string;
    mandatory?: boolean;
  }>;
  validation?: {
    type?: string;
  };
}

export interface GroupConfig {
  id: string;
  groupName: string;
  fields: FieldConfig[];
}

interface ProfileSectionFormProps {
  groups: GroupConfig[];
  data?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  isReadOnly?: boolean;
}

export function ProfileSectionForm({
  groups,
  data = {},
  onSubmit,
  onCancel,
  isLoading = false,
  isReadOnly = false,
}: ProfileSectionFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data,
  });

  const handleFormSubmit = async (formData: Record<string, any>) => {
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {groups.map((group) => (
        <div key={group.id} className="space-y-4">
          <div className="space-y-4">
            {group.fields.map((field) => {
              const isMandatory =
                field.mandatory === true ||
                (Array.isArray(field.mandatory) && field.mandatory.length > 0);
              const isFieldReadOnly = field.readOnly === true || isReadOnly;
              const hasError = !!errors[field.fieldName];
              const isBooleanField = field.fieldType === 'Boolean';

              return (
                <div key={field.id} className="flex flex-col sm:flex-row sm:items-start gap-2">
                  <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">
                    <span className="inline-flex items-center gap-1">
                      <span>{field.label}</span>
                      {field.tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="Auto-derived field info"
                              >
                                <span aria-hidden>ⓘ</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              {field.tooltip.title && (
                                <div className="font-semibold">{field.tooltip.title}</div>
                              )}
                              {field.tooltip.body && (
                                <div className={field.tooltip.title ? 'mt-1 text-xs' : 'text-xs'}>
                                  {field.tooltip.body}
                                </div>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </span>
                    {isMandatory && <span className="text-red-500 ml-1">*</span>}
                    {isFieldReadOnly && field.readOnly && (
                      <span className="text-xs text-gray-400 ml-2">(System Generated)</span>
                    )}
                  </label>

                  <div className="flex-1">
	                  <Controller
	                    name={field.fieldName}
	                    control={control}
	                    rules={{
	                      validate: (value) => {
	                        if (isMandatory && !isFieldReadOnly) {
	                          if (isBooleanField) {
	                            if (typeof value !== 'boolean') {
	                              return `${field.label} is required`;
	                            }
	                          } else if (value === undefined || value === null || value === '') {
	                            return `${field.label} is required`;
	                          }
	                        }

	                        if (field.fieldType === 'Integer') {
	                          if (
	                            value !== undefined &&
	                            value !== null &&
	                            value !== '' &&
	                            (!Number.isFinite(value) || !Number.isInteger(value))
	                          ) {
	                            return `${field.label} must be a whole number`;
	                          }
	                        }

	                        if (field.fieldType === 'Text' && field.validation?.type === 'email' && value) {
	                          const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
	                          if (!emailRegex.test(value)) {
	                            return `${field.label} must be a valid email address`;
	                          }
	                        }
	                        return true;
	                      },
	                    }}
	                    render={({ field: formField }) => {
	                      const isEnumField = field.fieldType === 'Enum';
	                      const isMultiSelectField = field.fieldType === 'MultiSelect';
	                      const isIntegerField = field.fieldType === 'Integer';

	                      // Boolean: render checkbox (checked = active/true, unchecked = inactive/false)
	                      if (isBooleanField) {
                          const value = formField.value;
                          if (isFieldReadOnly) {
                            return (
                              <div className="text-sm text-gray-700">
                                {value === true ? 'Yes' : value === false ? 'No' : '-'}
                              </div>
                            );
                          }
                          return (
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value === true}
                                onChange={(e) => formField.onChange(e.target.checked)}
                                disabled={isFieldReadOnly || isLoading}
                                className="h-4 w-4 text-red-800 focus:ring-red-800 rounded border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                              />
                            </label>
                          );
	                      }

	                      // Enum: render <select> (string)
	                      if (isEnumField) {
	                        const value = typeof formField.value === 'string' ? formField.value : '';
	                        if (isFieldReadOnly) {
	                          const label =
	                            field.options?.find((o) => o.value === value)?.label ?? value ?? '-';
	                          return <div className="text-sm text-gray-700">{label || '-'}</div>;
	                        }
	                        if (!field.options || field.options.length === 0) {
	                          return (
	                            <input
	                              {...formField}
	                              type="text"
	                              disabled={isFieldReadOnly || isLoading}
	                              placeholder={field.placeholder || (isMandatory ? 'Required' : 'Optional')}
	                              className={`w-full text-sm border rounded px-3 py-2 min-h-[44px] ${
	                                hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
	                              } ${isFieldReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
	                            />
	                          );
	                        }
	                        return (
	                          <select
	                            value={value}
	                            onChange={(e) => formField.onChange(e.target.value)}
	                            disabled={isFieldReadOnly || isLoading}
	                            className={`w-full text-sm border rounded px-3 py-2 min-h-[44px] ${
	                              hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
	                            } ${isFieldReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
	                          >
	                            <option value="">
	                              {isMandatory ? 'Select a required option' : 'Select an option'}
	                            </option>
	                            {field.options.map((option) => (
	                              <option key={option.value} value={option.value}>
	                                {option.label}
	                              </option>
	                            ))}
	                          </select>
	                        );
	                      }

	                      // MultiSelect: store string[] (render checkbox list if options exist; else freeform lines)
	                      if (isMultiSelectField) {
	                        const current: string[] = Array.isArray(formField.value) ? formField.value : [];
	                        if (isFieldReadOnly) {
	                          const labels =
	                            field.options && field.options.length > 0
	                              ? current
	                                  .map((v) => field.options?.find((o) => o.value === v)?.label ?? v)
	                                  .filter(Boolean)
	                              : current;
	                          return (
	                            <div className="text-sm text-gray-700">
	                              {labels.length > 0 ? labels.join(', ') : '-'}
	                            </div>
	                          );
	                        }

	                        if (field.options && field.options.length > 0) {
	                          return (
	                            <div className="space-y-2">
	                              {field.options.map((opt) => {
	                                const checked = current.includes(opt.value);
	                                return (
	                                  <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700">
	                                    <input
	                                      type="checkbox"
	                                      className="h-4 w-4 text-red-800 focus:ring-red-800 rounded border-gray-300"
	                                      checked={checked}
	                                      disabled={isFieldReadOnly || isLoading}
	                                      onChange={(e) => {
	                                        const next = e.target.checked
	                                          ? Array.from(new Set([...current, opt.value]))
	                                          : current.filter((v) => v !== opt.value);
	                                        formField.onChange(next);
	                                      }}
	                                    />
	                                    <span>{opt.label}</span>
	                                  </label>
	                                );
	                              })}
	                            </div>
	                          );
	                        }

	                        return (
	                          <textarea
	                            value={current.join('\n')}
	                            onChange={(e) => {
	                              const lines = e.target.value
	                                .split('\n')
	                                .map((s) => s.trim())
	                                .filter(Boolean);
	                              formField.onChange(lines);
	                            }}
	                            disabled={isFieldReadOnly || isLoading}
	                            placeholder={field.placeholder || 'Enter one value per line'}
	                            className={`w-full text-sm border rounded px-3 py-2 min-h-[96px] ${
	                              hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
	                            } ${isFieldReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
	                          />
	                        );
	                      }

	                      // Integer: store number|null (prevent NaN)
	                      if (isIntegerField) {
	                        const current = typeof formField.value === 'number' ? formField.value : null;
	                        if (isFieldReadOnly) {
	                          return (
	                            <div className="text-sm text-gray-700">
	                              {current === null || current === undefined ? '-' : String(current)}
	                            </div>
	                          );
	                        }
	                        return (
	                          <input
	                            type="number"
	                            inputMode="numeric"
	                            step={1}
	                            value={current ?? ''}
	                            onChange={(e) => {
	                              const raw = e.target.value;
	                              if (raw === '') {
	                                formField.onChange(null);
	                                return;
	                              }
	                              const n = Number(raw);
	                              if (!Number.isFinite(n)) {
	                                formField.onChange(null);
	                                return;
	                              }
	                              formField.onChange(Math.trunc(n));
	                            }}
	                            disabled={isFieldReadOnly || isLoading}
	                            placeholder={field.placeholder || (isMandatory ? 'Required' : 'Optional')}
	                            className={`w-full text-sm border rounded px-3 py-2 min-h-[44px] ${
	                              hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
	                            } ${isFieldReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
	                          />
	                        );
	                      }

	                      // Basic field rendering - will be enhanced per field type
	                      if (field.fieldType === 'select' && field.options) {
	                        return (
                            <select
                              {...formField}
                              disabled={isFieldReadOnly || isLoading}
                              className={`w-full text-sm border rounded px-3 py-2 min-h-[44px] ${
                                hasError
                                  ? 'border-red-300 bg-red-50'
                                  : 'border-gray-300'
                              } ${isFieldReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            >
                              <option value="">
                                {isMandatory
                                  ? 'Select a required option'
                                  : 'Select an option'}
                              </option>
                              {field.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          );
                        }

                        if (field.fieldType === 'Date' || field.fieldType === 'Date Only') {
                          return (
                            <input
                              {...formField}
                              type="date"
                              disabled={isFieldReadOnly || isLoading}
                              className={`w-full text-sm border rounded px-3 py-2 min-h-[44px] ${
                                hasError
                                  ? 'border-red-300 bg-red-50'
                                  : 'border-gray-300'
                              } ${isFieldReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                          );
                        }

                        // Address field (multi-field)
                        if (field.fieldType === 'Address' && field.addressFields) {
                          const addressValue = typeof formField.value === 'string' 
                            ? (formField.value ? JSON.parse(formField.value) : {})
                            : (formField.value || {});
                          
                          return (
                            <div className="space-y-3 border border-gray-200 rounded-md p-4 bg-gray-50">
                              {Object.entries(field.addressFields).map(([key, addrField]) => {
                                const addrFieldConfig = addrField as any;
                                const addrFieldName = addrFieldConfig.fieldName || key;
                                const isAddrMandatory = addrFieldConfig.mandatory === true;
                                const addrValue = addressValue[addrFieldName] || addressValue[key] || '';
                                
                                return (
                                  <div key={key}>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      {addrFieldConfig.label}
                                      {isAddrMandatory && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    <input
                                      type="text"
                                      value={addrValue}
                                      onChange={(e) => {
                                        const newAddress = {
                                          ...addressValue,
                                          [addrFieldName]: e.target.value,
                                          [key]: e.target.value, // Support both keys
                                        };
                                        formField.onChange(JSON.stringify(newAddress));
                                      }}
                                      disabled={isFieldReadOnly || isLoading}
                                      placeholder={addrFieldConfig.placeholder || ''}
                                      className={`w-full text-sm border rounded px-3 py-2 ${
                                        'border-gray-300'
                                      } ${isFieldReadOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }

                        // Email input
                        if (field.fieldType === 'Text' && field.validation?.type === 'email') {
                          return (
                            <input
                              {...formField}
                              type="email"
                              disabled={isFieldReadOnly || isLoading}
                              placeholder={field.placeholder || 'email@example.com'}
                              className={`w-full text-sm border rounded px-3 py-2 min-h-[44px] ${
                                hasError
                                  ? 'border-red-300 bg-red-50'
                                  : 'border-gray-300'
                              } ${isFieldReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                          );
                        }

                        // Default: text input
                        return (
                          <input
                            {...formField}
                            type="text"
                            disabled={isFieldReadOnly || isLoading}
                            placeholder={field.placeholder || (isMandatory ? 'Required' : 'Optional')}
                            className={`w-full text-sm border rounded px-3 py-2 min-h-[44px] ${
                              hasError
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300'
                            } ${isFieldReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          />
                        );
                      }}
                    />

                    {hasError && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors[field.fieldName]?.message as string}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      {!isReadOnly && (
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 border-t border-gray-100 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-600 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <Can I="update" a="user-profile">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white rounded disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#9b1823' }}
              onMouseEnter={(e) =>
                !e.currentTarget.disabled &&
                (e.currentTarget.style.backgroundColor = '#7a1319')
              }
              onMouseLeave={(e) =>
                !e.currentTarget.disabled &&
                (e.currentTarget.style.backgroundColor = '#9b1823')
              }
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </Can>
        </div>
      )}
    </form>
  );
}
