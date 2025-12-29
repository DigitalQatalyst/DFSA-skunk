/**
 * Vision & Strategy Tab Component (APQC Domain 1.0)
 * Schema-driven component for vision_strategy domain.
 *
 * De-duplication: shows selected Profile Summary values as read-only references
 * and does not persist them in vision_strategy.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, AlertCircleIcon } from 'lucide-react';
import { useAbility } from '@casl/react';
import { CASLAbilityContext } from '../../context/AbilityContext';
import { AppAbility } from '../../config/abilities';
import { CountrySelect } from '../Forms/CountrySelect';
import { getCountryByCode } from '../../utils/countryData';
import { filterVisible, type VisibilityRule } from '../../utils/visibility';
import { ProfileAccordion } from './ProfileAccordion';
import { useProfileDomainQuery, useUpdateProfileDomainMutation, useProfileSummaryQuery } from '../../hooks/useProfileQueries';

const EMPTY_RECORD: Record<string, any> = {};

type FieldConfig = {
  id: string;
  label: string;
  fieldName: string;
  fieldType: string;
  mandatory?: boolean | string[];
  readOnly?: boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  uiBlockType?: string;
  visibility?: VisibilityRule;
};

type GroupConfig = {
  id: string;
  groupName: string;
  fields: FieldConfig[];
};

type DomainSchema = {
  id: string;
  title: string;
  groups: GroupConfig[];
};

function isMandatory(field: FieldConfig): boolean {
  return field.mandatory === true || (Array.isArray(field.mandatory) && field.mandatory.length > 0);
}

function formatValue(field: FieldConfig, value: any): React.ReactNode {
  if (value === null || value === undefined || value === '') return '-';

  if (field.fieldType === 'Country') {
    const country = typeof value === 'string' ? getCountryByCode(value) : undefined;
    return country?.name ?? String(value);
  }

  if (field.fieldType === 'Boolean') {
    return value === true ? 'Yes' : value === false ? 'No' : '-';
  }

  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

function Toggle({
  value,
  onChange,
  disabled,
  id,
}: {
  id: string;
  value: boolean | undefined;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  const checked = value === true;
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-red-800' : 'bg-gray-200'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function VisionStrategyTab() {
  const ability = useAbility<AppAbility>(CASLAbilityContext);
  const isReadOnly = !ability.can('update', 'user-profile');

  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);
  const [schemaFromConfig, setSchemaFromConfig] = useState<DomainSchema | null>(null);

  const { data, isLoading, error } = useProfileDomainQuery('vision_strategy', { retry: 1, retryDelay: 1000 });
  const { data: profileSummary } = useProfileSummaryQuery({ retry: 1, retryDelay: 1000 });

  const form = useForm<Record<string, any>>({ defaultValues: {}, mode: 'onChange' });
  const { control, handleSubmit, watch, formState, reset } = form;
  const watched = watch();
  const lastResetSignatureRef = useRef<string | null>(null);

  const updateMutation = useUpdateProfileDomainMutation('vision_strategy', {
    onSuccess: () => {
      toast.success('Vision & Strategy saved successfully', {
        duration: 3000,
        className: 'bg-green-50 border-green-200 text-green-800',
        style: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' },
      });
      setEditingGroupIndex(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to save Vision & Strategy', {
        className: 'bg-red-50 border-red-200 text-red-800',
        style: { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' },
      });
    },
  });

  useEffect(() => {
    import('../../config/profileLoader')
      .then(({ getProfileConfig }) => {
        const cfg = getProfileConfig('apqc');
        const tab = cfg.tabs.find((t: any) => t.id === 'vision_strategy');
        if (tab) setSchemaFromConfig(tab as DomainSchema);
      })
      .catch(() => setSchemaFromConfig(null));
  }, []);

  const schema: DomainSchema | null = useMemo(
    () => ((data?.schema as any) || schemaFromConfig) as DomainSchema | null,
    [data?.schema, schemaFromConfig]
  );
  const domainData: Record<string, any> = useMemo(
    () => (data?.data as Record<string, any> | undefined) ?? EMPTY_RECORD,
    [data?.data]
  );
  const profileSummaryData: Record<string, any> =
    (profileSummary?.data as Record<string, any> | undefined) ?? EMPTY_RECORD;

  const usingFallback = !data?.schema && !!schemaFromConfig;

  const sections = useMemo(() => {
    if (!schema?.groups) return [];
    return schema.groups.map((group) => {
      const visible = filterVisible(group.fields || [], domainData);
      const userFillable = visible.filter((f) => !f.readOnly);
      const total = userFillable.length;
      const answered = userFillable.filter((f) => {
        const v = domainData?.[f.fieldName];
        if (f.fieldType === 'Boolean') return typeof v === 'boolean';
        if (typeof v === 'string') return v.trim().length > 0;
        return v !== null && v !== undefined;
      }).length;
      const completion = total > 0 ? Math.round((answered / total) * 100) : 0;
      return { id: group.id, title: group.groupName, completion };
    });
  }, [schema, domainData]);

  const beginEditGroup = (index: number) => {
    if (isReadOnly || !schema?.groups?.[index]) return;
    const group = schema.groups[index];
    const defaults = group.fields.reduce<Record<string, any>>((acc, field) => {
      const v = domainData?.[field.fieldName];
      acc[field.fieldName] = v ?? (field.fieldType === 'Boolean' ? undefined : '');
      return acc;
    }, {});
    lastResetSignatureRef.current = `${group.id}:${JSON.stringify(defaults)}`;
    reset(defaults);
    setEditingGroupIndex(index);
  };

  useEffect(() => {
    if (editingGroupIndex === null) return;
    if (!schema?.groups?.[editingGroupIndex]) return;
    const group = schema.groups[editingGroupIndex];
    const defaults = group.fields.reduce<Record<string, any>>((acc, field) => {
      const v = domainData?.[field.fieldName];
      acc[field.fieldName] = v ?? (field.fieldType === 'Boolean' ? undefined : '');
      return acc;
    }, {});
    const nextSignature = `${group.id}:${JSON.stringify(defaults)}`;
    if (lastResetSignatureRef.current === nextSignature) return;
    lastResetSignatureRef.current = nextSignature;
    reset(defaults);
  }, [editingGroupIndex, schema, domainData, reset]);

  if (isLoading && !schemaFromConfig) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircleIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">{(error as any)?.message || 'Failed to load Vision & Strategy'}</p>
        </div>
      </div>
    );
  }

  const renderReferenceBlock = () => {
    return (
      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Reference (from Profile Summary)</div>
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <div className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-1">Authorisation Category</div>
            <div className="flex-1 text-sm text-gray-600">{profileSummaryData.authorisation_category ?? '-'}</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <div className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-1">Legal Status</div>
            <div className="flex-1 text-sm text-gray-600">{profileSummaryData.legal_status ?? '-'}</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <div className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-1">DIFC/Non-DIFC Entity</div>
            <div className="flex-1 text-sm text-gray-600">{profileSummaryData.entity_type ?? '-'}</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <div className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-1">Incorporation Jurisdiction</div>
            <div className="flex-1 text-sm text-gray-600">{profileSummaryData.jurisdiction ?? '-'}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {usingFallback && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircleIcon className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">Using offline mode</p>
              <p className="text-xs text-amber-700 mt-1">
                Unable to connect to API. Showing form fields, but data won't be saved until connection is restored.
              </p>
            </div>
          </div>
        </div>
      )}

      <ProfileAccordion
        sections={sections}
        defaultExpandedIndex={0}
        onSectionToggle={(index) => {
          if (!isReadOnly && editingGroupIndex === null) beginEditGroup(index);
        }}
      >
        {(section, sectionIndex) => {
          const group = schema.groups[sectionIndex];
          const isEditing = editingGroupIndex === sectionIndex;

          const referenceGroup = group.id === 'difc_presence_relocation';

          if (!isEditing) {
            const visibleFields = filterVisible(group.fields || [], domainData);
            return (
              <div className="space-y-4">
                {referenceGroup && renderReferenceBlock()}
                {visibleFields.map((field) => (
                  <div key={field.id} className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">
                      {field.label}
                      {isMandatory(field) && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="flex-1 text-sm text-gray-900">{formatValue(field, domainData[field.fieldName])}</div>
                  </div>
                ))}

                {!isReadOnly && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => beginEditGroup(sectionIndex)}
                      className="px-4 py-2 text-sm font-medium text-white rounded"
                      style={{ backgroundColor: '#9b1823' }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // Edit mode
          const visibleFields = filterVisible(group.fields || [], watched);

          const onSubmit = async (formData: Record<string, any>) => {
            const updateData: Record<string, any> = {};
            group.fields.forEach((field) => {
              updateData[field.fieldName] = formData[field.fieldName];
            });
            updateData._groupId = group.id;

            const merged = { ...domainData, ...updateData };
            await updateMutation.mutateAsync(merged);
          };

          return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {referenceGroup && renderReferenceBlock()}

              {visibleFields.map((field) => {
                const disabled = isReadOnly || updateMutation.isPending || field.readOnly === true;
                const mandatory = isMandatory(field);
                const value = watched?.[field.fieldName];
                const errorMsg = (formState.errors as any)?.[field.fieldName]?.message as string | undefined;

                return (
                  <div key={field.id} className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2" htmlFor={field.fieldName}>
                      {field.label}
                      {mandatory && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="flex-1">
                      <Controller
                        name={field.fieldName}
                        control={control}
                        rules={{
                          validate: (v) => {
                            if (!mandatory || disabled) return true;
                            if (field.fieldType === 'Boolean') {
                              return typeof v === 'boolean' ? true : `${field.label} is required`;
                            }
                            return v === undefined || v === null || String(v).trim() === ''
                              ? `${field.label} is required`
                              : true;
                          },
                        }}
                        render={({ field: formField }) => {
                          if (field.fieldType === 'Boolean') {
                            return (
                              <Toggle
                                id={field.fieldName}
                                value={typeof value === 'boolean' ? value : undefined}
                                onChange={(next) => formField.onChange(next)}
                                disabled={disabled}
                              />
                            );
                          }

                          if (field.fieldType === 'Enum') {
                            const options = field.options || [];
                            return (
                              <select
                                id={field.fieldName}
                                value={typeof formField.value === 'string' ? formField.value : ''}
                                onChange={(e) => formField.onChange(e.target.value)}
                                disabled={disabled}
                                className={`w-full text-sm border rounded px-3 py-2 min-h-[44px] ${
                                  errorMsg ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              >
                                <option value="">{mandatory ? 'Select a required option' : 'Select an option'}</option>
                                {options.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            );
                          }

                          if (field.fieldType === 'Country') {
                            return (
                              <CountrySelect
                                id={field.fieldName}
                                value={typeof formField.value === 'string' ? formField.value : ''}
                                onChange={(v) => formField.onChange(v)}
                                onBlur={formField.onBlur}
                                required={mandatory}
                                placeholder={field.placeholder || 'Select a country'}
                                error={errorMsg}
                                className={disabled ? 'pointer-events-none opacity-60' : ''}
                              />
                            );
                          }

                          const isTextarea = field.uiBlockType === 'textarea';
                          if (isTextarea) {
                            return (
                              <textarea
                                id={field.fieldName}
                                value={typeof formField.value === 'string' ? formField.value : ''}
                                onChange={(e) => formField.onChange(e.target.value)}
                                disabled={disabled}
                                className={`w-full text-sm border rounded px-3 py-2 min-h-[120px] ${
                                  errorMsg ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              />
                            );
                          }

                          return (
                            <input
                              id={field.fieldName}
                              type="text"
                              value={typeof formField.value === 'string' ? formField.value : ''}
                              onChange={(e) => formField.onChange(e.target.value)}
                              disabled={disabled}
                              placeholder={field.placeholder || (mandatory ? 'Required' : 'Optional')}
                              className={`w-full text-sm border rounded px-3 py-2 min-h-[44px] ${
                                errorMsg ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                          );
                        }}
                      />
                      {errorMsg && <p className="mt-1 text-xs text-red-600">{errorMsg}</p>}
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingGroupIndex(null)}
                  className="px-3 py-2 text-sm font-medium text-gray-600 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm font-medium text-white rounded disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#9b1823' }}
                  disabled={updateMutation.isPending || !formState.isDirty}
                >
                  {updateMutation.isPending ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          );
        }}
      </ProfileAccordion>
    </div>
  );
}
