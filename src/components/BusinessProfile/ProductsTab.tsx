import React, { useState, useMemo } from 'react';
import { useProductsQuery, useUpdateProductsMutation } from '../../hooks/useProfileQueries';
import { ProfileSectionForm } from './ProfileSectionForm';
import { ProfileAccordion } from './ProfileAccordion';
import { Loader2, AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAbility } from '@casl/react';
import { CASLAbilityContext } from '../../context/AbilityContext';
import { AppAbility } from '../../config/abilities';
import { isVisible, filterVisible, type VisibilityRule } from '../../utils/visibility';
import { MatrixField, type MatrixValue } from './MatrixField';

type FieldConfig = {
  id: string;
  label: string;
  fieldName: string;
  fieldType: string;
  uiBlockType?: string;
  visibility?: VisibilityRule;
  matrixDimensions?: { rows: number; columns: number };
  mandatory?: boolean | string[];
  readOnly?: boolean;
  hidden?: boolean;
};

type GroupConfig = {
  id: string;
  groupName: string;
  uiSection?: string;
  section?: string;
  uiBlockType?: string;
  fields: FieldConfig[];
  visibility?: VisibilityRule;
};

type TabSchema = {
  id: string;
  title: string;
  groups: GroupConfig[];
};

export function ProductsTab() {
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Record<string, any>>({});
  const [matrixDrafts, setMatrixDrafts] = useState<Record<string, MatrixValue>>({});

  const ability = useAbility<AppAbility>(CASLAbilityContext);
  const isReadOnly = !ability.can('update', 'user-profile');

  // Fetch Products data
  const { data, isLoading, error, refetch } = useProductsQuery({
    retry: 1,
    retryDelay: 1000,
  });

  // Update mutation
  const updateMutation = useUpdateProductsMutation({
    onSuccess: () => {
      toast.success('Your details have been saved successfully!', {
        duration: 3000,
        description: 'Products has been updated.',
        className: 'bg-green-50 border-green-200 text-green-800',
        style: {
          backgroundColor: '#f0fdf4',
          borderColor: '#bbf7d0',
          color: '#166534',
        },
      });
      setEditingGroupId(null);
      setEditingData({});
      setMatrixDrafts({});
    },
    onError: (error: Error) => {
      let errorMessage = 'Failed to update Products';
      let errorDetails: string[] = [];
      try {
        const errorResponse = (error as any).response;
        if (errorResponse) {
          if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
            errorDetails = errorResponse.errors;
            errorMessage = `Validation failed: ${errorResponse.errors.join(', ')}`;
          } else if (errorResponse.error) {
            errorMessage = errorResponse.error;
          }
        } else if (error.message) {
          try {
            const errorData = JSON.parse(error.message);
            if (errorData?.errors && Array.isArray(errorData.errors)) {
              errorDetails = errorData.errors;
              errorMessage = `Validation failed: ${errorData.errors.join(', ')}`;
            } else if (errorData?.error) {
              errorMessage = errorData.error;
            }
          } catch {
            errorMessage = error.message;
          }
        }
      } catch (parseError) {
        if (error.message) {
          errorMessage = error.message;
        }
      }
      if (errorDetails.length > 0) {
        toast.error(errorMessage, {
          duration: 5000,
          className: 'bg-red-50 border-red-200 text-red-800',
          style: {
            backgroundColor: '#fef2f2',
            borderColor: '#fecaca',
            color: '#991b1b',
          },
        });
      } else {
        toast.error(errorMessage, {
          className: 'bg-red-50 border-red-200 text-red-800',
          style: {
            backgroundColor: '#fef2f2',
            borderColor: '#fecaca',
            color: '#991b1b',
          },
        });
      }
    },
  });

  const schema: TabSchema | undefined = data?.schema;
  const productsData = data?.data || {};

  const visibleGroupsBySection = useMemo(() => {
    if (!schema?.groups) return [] as Array<{ name: string; groups: GroupConfig[] }>;

    const groups = schema.groups as GroupConfig[];
    const sectionMap: Record<string, GroupConfig[]> = {};

    const visibleGroups = groups.filter((group) => isVisible(group.visibility as VisibilityRule, productsData));

    visibleGroups.forEach((group) => {
      const name = group.uiSection || 'Other';
      if (!sectionMap[name]) sectionMap[name] = [];
      sectionMap[name].push(group);
    });

    return Object.entries(sectionMap).map(([name, groups]) => ({ name, groups }));
  }, [schema, productsData]);

  const sectionsForAccordion = useMemo(() => {
    return visibleGroupsBySection.map((section) => {
      const totalFields = section.groups.reduce((acc, g) => acc + g.fields.filter((f) => !f.hidden && !f.readOnly && f.uiBlockType !== 'Matrix').length, 0);
      const filledFields = section.groups.reduce((acc, g) => {
        return (
          acc +
          g.fields.filter((f) => !f.hidden && !f.readOnly && f.uiBlockType !== 'Matrix').reduce((inner, f) => {
            const v = productsData[f.fieldName];
            const hasValue = v !== null && v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0) && (typeof v !== 'boolean' || v === true);
            return inner + (hasValue ? 1 : 0);
          }, 0)
        );
      }, 0);
      const completion = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
      return {
        id: section.name,
        title: section.name,
        completion,
        mandatoryCompletion: completion,
        isRequired: false,
        hasMissingMandatory: false,
      };
    });
  }, [visibleGroupsBySection, productsData]);

  const handleEditGroup = (group: GroupConfig) => {
    const groupData: Record<string, any> = {};
    group.fields.forEach((field) => {
      if (field.uiBlockType === 'matrixAccordion') {
        const val = productsData[field.fieldName];
        setMatrixDrafts((prev) => ({ ...prev, [field.fieldName]: (val as MatrixValue) || {} }));
      } else {
        const value = productsData[field.fieldName];
        groupData[field.fieldName] =
          field.fieldType === 'Boolean'
            ? (typeof value === 'boolean' ? value : undefined)
            : value ?? '';
      }
    });
    setEditingGroupId(group.id);
    setEditingData(groupData);
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setEditingData({});
    setMatrixDrafts({});
  };

  const handleSaveGroup = async (group: GroupConfig, dataToSave: Record<string, any>) => {
    const payload = { ...dataToSave, _groupId: group.id };
    await updateMutation.mutateAsync(payload);
  };

  const handleSaveMatrix = async (group: GroupConfig, field: FieldConfig) => {
    const matrixValue = matrixDrafts[field.fieldName] || {};
    const payload: Record<string, any> = {
      [field.fieldName]: matrixValue,
      _groupId: group.id,
    };
    await updateMutation.mutateAsync(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600">Loading Products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-start">
          <AlertCircleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading Products</h3>
            <p className="mt-1 text-sm text-red-700">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-3 text-sm font-medium text-red-800 hover:text-red-900 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-600">No schema configuration found for Products</p>
      </div>
    );
  }

  const renderGroup = (group: GroupConfig) => {
    const fieldVisibility = (field: FieldConfig) => isVisible(field.visibility as VisibilityRule, productsData);

    const simpleFields = group.fields.filter((f) => f.uiBlockType !== 'matrixAccordion' && fieldVisibility(f) && !f.hidden);
    const matrixFields = group.fields.filter((f) => f.uiBlockType === 'matrixAccordion' && fieldVisibility(f) && !f.hidden);

    const isEditing = editingGroupId === group.id;

    return (
      <div key={group.id} className="space-y-6">
        {simpleFields.length > 0 && (
          isEditing ? (
            <ProfileSectionForm
              groups={[{ ...group, fields: simpleFields }]}
              data={editingData}
              onSubmit={(data) => handleSaveGroup(group, data)}
              onCancel={handleCancelEdit}
              isLoading={updateMutation.isPending}
              isReadOnly={isReadOnly}
            />
          ) : (
            <div className="space-y-4">
              {simpleFields.map((field) => {
                const value = productsData[field.fieldName];
                const isMandatory = field.mandatory === true || (Array.isArray(field.mandatory) && field.mandatory.length > 0);
                const isFieldReadOnly = field.readOnly || isReadOnly;
                let displayValue: React.ReactNode = '-';
                if (value !== null && value !== undefined && value !== '') {
                  if (field.fieldType === 'Date' || field.fieldType === 'Date Only') {
                    displayValue = new Date(value).toLocaleDateString();
                  } else if (field.fieldType === 'Boolean') {
                    displayValue = value ? 'Yes' : 'No';
                  } else if (Array.isArray(value)) {
                    displayValue = value.join(', ');
                  } else if (typeof value === 'object') {
                    displayValue = JSON.stringify(value);
                  } else {
                    displayValue = String(value);
                  }
                }
                return (
                  <div key={field.id} className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">
                      {field.label}
                      {isMandatory && <span className="text-red-500 ml-1">*</span>}
                      {isFieldReadOnly && <span className="text-xs text-gray-400 ml-2">(Read Only)</span>}
                    </label>
                    <div className={`flex-1 text-sm ${isFieldReadOnly ? 'text-gray-500' : 'text-gray-900'}`}>
                      {displayValue}
                    </div>
                  </div>
                );
              })}
              {!isReadOnly && (
                <div className="pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleEditGroup(group)}
                    className="px-4 py-2 text-sm font-medium text-white rounded"
                    style={{ backgroundColor: '#9b1823' }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {matrixFields.map((field) => {
          const currentValue = matrixDrafts[field.fieldName] || (productsData[field.fieldName] as MatrixValue) || {};
          const canEdit = !isReadOnly && editingGroupId === group.id;
          return (
            <div key={field.id} className="space-y-3">
              <MatrixField
                label={field.label}
                fieldName={field.fieldName}
                matrixDimensions={field.matrixDimensions}
                value={currentValue}
                onChange={(next) => setMatrixDrafts((prev) => ({ ...prev, [field.fieldName]: next }))}
                readOnly={!canEdit}
              />
              {matrixFields.length > 0 && !isReadOnly && (
                <div className="flex gap-2">
                  {editingGroupId === group.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSaveMatrix(group, field)}
                        className="px-4 py-2 text-sm font-medium text-white rounded"
                        style={{ backgroundColor: '#9b1823' }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 text-sm font-medium text-gray-600 rounded border border-gray-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGroupId(group.id);
                        setMatrixDrafts((prev) => ({ ...prev, [field.fieldName]: currentValue }));
                      }}
                      className="px-4 py-2 text-sm font-medium text-white rounded"
                      style={{ backgroundColor: '#9b1823' }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overall Completion */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Products & Services</h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-600">Overall Completion</div>
              <div className="text-2xl font-bold text-gray-900">{data?.completion ?? 0}%</div>
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${data?.completion ?? 0}%`,
                  backgroundColor: (data?.completion ?? 0) === 100 ? '#10b981' : (data?.completion ?? 0) >= 70 ? '#9b1823' : '#ef4444',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sections Accordion */}
      <ProfileAccordion
        sections={sectionsForAccordion}
        defaultExpandedIndex={0}
      >
        {(section, sectionIndex) => {
          const sectionData = visibleGroupsBySection[sectionIndex];
          if (!sectionData) return null;
          return (
            <div className="space-y-8">
              {sectionData.groups
                .filter((group) => isVisible(group.visibility as VisibilityRule, productsData))
                .map((group) => (
                  <div key={group.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm text-gray-500">{group.section}</div>
                        <div className="text-base font-semibold text-gray-900">{group.groupName}</div>
                      </div>
                    </div>
                    {renderGroup(group)}
                  </div>
                ))}
            </div>
          );
        }}
      </ProfileAccordion>
    </div>
  );
}
