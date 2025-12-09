/**
 * Profile Summary Tab Component
 * Schema-driven component for Profile Summary domain
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useProfileSummaryQuery, useUpdateProfileSummaryMutation } from '../../hooks/useProfileQueries';
import { ProfileSectionForm } from './ProfileSectionForm';
import { ProfileAccordion } from './ProfileAccordion';
import { Loader2, AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAbility } from '@casl/react';
import { CASLAbilityContext } from '../../context/AbilityContext';
import { AppAbility } from '../../config/abilities';

export function ProfileSummaryTab() {
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Record<string, any>>({});
  
  const ability = useAbility<AppAbility>(CASLAbilityContext);
  const isReadOnly = !ability.can('update', 'user-profile');

  // Fetch Profile Summary data
  const { data, isLoading, error, refetch } = useProfileSummaryQuery({
    retry: 1, // Only retry once
    retryDelay: 1000,
  });

  // Update mutation
  const updateMutation = useUpdateProfileSummaryMutation({
    onSuccess: (responseData) => {
      toast.success('Your details have been saved successfully!', {
        duration: 3000,
        description: 'Profile Summary has been updated.',
        className: 'bg-green-50 border-green-200 text-green-800',
        style: {
          backgroundColor: '#f0fdf4',
          borderColor: '#bbf7d0',
          color: '#166534',
        },
      });
      setEditingGroupIndex(null);
      setEditingData({});
      // Cache is already updated with responseData, no need to refetch
      // This ensures immediate UI update without waiting for network request
    },
    onError: (error: Error) => {
      // Extract error message from API response
      let errorMessage = 'Failed to update Profile Summary';
      let errorDetails: string[] = [];
      
      try {
        // Check if error has response attached (from our custom error handling)
        const errorResponse = (error as any).response;
        if (errorResponse) {
          if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
            // Show validation errors
            errorDetails = errorResponse.errors;
            errorMessage = `Validation failed: ${errorResponse.errors.join(', ')}`;
          } else if (errorResponse.error) {
            errorMessage = errorResponse.error;
          }
        } else if (error.message) {
          // Try to parse error message if it's a stringified JSON
          try {
            const errorData = JSON.parse(error.message);
            if (errorData?.errors && Array.isArray(errorData.errors)) {
              errorDetails = errorData.errors;
              errorMessage = `Validation failed: ${errorData.errors.join(', ')}`;
            } else if (errorData?.error) {
              errorMessage = errorData.error;
            }
          } catch {
            // If parsing fails, use the error message as-is
            errorMessage = error.message;
          }
        }
      } catch (parseError) {
        // If all parsing fails, use the error message as-is
        if (error.message) {
          errorMessage = error.message;
        }
      }
      
      // Show toast with error message - styled with red colors matching app palette
      if (errorDetails.length > 0) {
        // Show detailed validation errors
        toast.error(errorMessage, {
          duration: 5000, // Longer duration for validation errors
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

  // Load schema from config as fallback (always available)
  const [schemaFromConfig, setSchemaFromConfig] = useState<any>(null);
  
  useEffect(() => {
    // Always try to load schema from config as fallback
    import('../../config/profileLoader').then(({ getProfileConfig }) => {
      const config = getProfileConfig('apqc');
      const profileSummaryTab = config.tabs.find((tab: any) => tab.id === 'profile_summary');
      if (profileSummaryTab) {
        setSchemaFromConfig(profileSummaryTab);
      }
    }).catch((err) => {
      console.error('Failed to load schema from config:', err);
    });
  }, []);

  // Use schema from API if available, otherwise use config fallback
  const schema = data?.schema || schemaFromConfig;
  const profileData = data?.data || {};

  // Prepare sections for accordion - use useMemo to recalculate when profileData changes
  // IMPORTANT: This hook must be called before any conditional returns to follow Rules of Hooks
  const sections = useMemo(() => {
    if (!schema?.groups) return [];
    
    return schema.groups.map((group, index) => {
    // Calculate completion for this group
    let completedFields = 0;
    let totalFields = 0;

    // Calculate completion for ALL fields (mandatory + optional)
    let totalMandatoryFields = 0;
    let completedMandatoryFields = 0;

    group.fields.forEach((field) => {
      const isMandatory = field.mandatory === true || 
                         (Array.isArray(field.mandatory) && field.mandatory.length > 0);
      
      const value = profileData[field.fieldName];
      const hasValue = value !== null && value !== undefined && value !== '' && 
                      (!Array.isArray(value) || value.length > 0);

      // Count all fields for overall completion
      totalFields++;
      if (hasValue) {
        completedFields++;
      }

      // Count mandatory fields separately
      if (isMandatory) {
        totalMandatoryFields++;
        if (hasValue) {
          completedMandatoryFields++;
        }
      }
    });

    // Overall completion: percentage of all fields that are filled
    const completion = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
    
    // Mandatory completion: percentage of mandatory fields that are filled
    // If no mandatory fields exist, consider it 100% (nothing required)
    const mandatoryCompletion = totalMandatoryFields > 0 
      ? Math.round((completedMandatoryFields / totalMandatoryFields) * 100)
      : 100;

    // Group is only "required" if it has mandatory fields
    const isRequired = totalMandatoryFields > 0;

    return {
      id: group.id,
      title: group.groupName,
      completion,
      mandatoryCompletion,
      isRequired,
      hasMissingMandatory: isRequired && mandatoryCompletion < 100,
    };
  });
  }, [schema, profileData]); // Recalculate when schema or profileData changes

  // Conditional returns must come AFTER all hooks
  if (isLoading && !schemaFromConfig) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // If no schema at all, show error
  if (!schema) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircleIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {error?.message || 'Failed to load Profile Summary'}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Please check the API connection and try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // Show warning if API failed but we're using config fallback
  const usingFallback = !data?.schema && schemaFromConfig;

  const handleEditGroup = (index: number) => {
    const group = schema.groups[index];
    const groupData: Record<string, any> = {};

    // Extract data for this group's fields
    group.fields.forEach((field) => {
      const value = profileData[field.fieldName];
      
      // Handle Address fields - parse JSON if string
      if (field.fieldType === 'Address' && typeof value === 'string') {
        try {
          groupData[field.fieldName] = JSON.parse(value);
        } catch {
          groupData[field.fieldName] = {};
        }
      } else {
        groupData[field.fieldName] = value || '';
      }
    });

    setEditingData(groupData);
    setEditingGroupIndex(index);
  };

  const handleSaveGroup = async (groupIndex: number, formData: Record<string, any>) => {
    try {
      // Prepare data for API
      const updateData: Record<string, any> = {};

      const group = schema.groups[groupIndex];
      group.fields.forEach((field) => {
        let value = formData[field.fieldName];

        // Handle Address fields - stringify JSON
        if (field.fieldType === 'Address' && value && typeof value === 'object') {
          value = JSON.stringify(value);
        }

        // Handle date fields - ensure proper format
        if ((field.fieldType === 'Date' || field.fieldType === 'Date Only') && value) {
          // Ensure date is in YYYY-MM-DD format
          if (value instanceof Date) {
            value = value.toISOString().split('T')[0];
          } else if (typeof value === 'string' && value.includes('T')) {
            value = value.split('T')[0];
          }
        }

        updateData[field.fieldName] = value;
      });

      // Add group ID to indicate we're only updating this group
      updateData._groupId = group.id;

      // Merge with existing data
      const mergedData = {
        ...profileData,
        ...updateData,
      };

      await updateMutation.mutateAsync(mergedData);
    } catch (error) {
      // Error is handled by mutation's onError callback
      console.error('Error saving group:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingGroupIndex(null);
    setEditingData({});
  };

  return (
    <div className="space-y-6">
      {usingFallback && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircleIcon className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                Using offline mode
              </p>
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
          if (!isReadOnly && editingGroupIndex === null) {
            handleEditGroup(index);
          }
        }}
      >
        {(section, sectionIndex, isExpanded) => {
          const group = schema.groups[sectionIndex];
          const isEditing = editingGroupIndex === sectionIndex;

          if (isEditing) {
            return (
              <ProfileSectionForm
                groups={[group]}
                data={editingData}
                onSubmit={(data) => handleSaveGroup(sectionIndex, data)}
                onCancel={handleCancelEdit}
                isLoading={updateMutation.isPending}
                isReadOnly={isReadOnly}
              />
            );
          }

          // Display mode
          return (
            <div className="space-y-4">
              {group.fields.map((field) => {
                const value = profileData[field.fieldName];
                const isMandatory = field.mandatory === true || 
                                   (Array.isArray(field.mandatory) && field.mandatory.length > 0);
                const isFieldReadOnly = (field as any).readOnly === true;

                let displayValue: React.ReactNode = '-';

                if (value !== null && value !== undefined && value !== '') {
                  if (field.fieldType === 'Address' && typeof value === 'string') {
                    try {
                      const addr = JSON.parse(value);
                      displayValue = (
                        <div className="space-y-1">
                          {addr.line1 && <div>{addr.line1}</div>}
                          {addr.line2 && <div>{addr.line2}</div>}
                          <div>
                            {[addr.city, addr.state, addr.postalCode, addr.country]
                              .filter(Boolean)
                              .join(', ')}
                          </div>
                        </div>
                      );
                    } catch {
                      displayValue = value;
                    }
                  } else if (field.fieldType === 'Date' || field.fieldType === 'Date Only') {
                    displayValue = new Date(value).toLocaleDateString();
                  } else if (Array.isArray(value)) {
                    displayValue = value.join(', ');
                  } else {
                    displayValue = String(value);
                  }
                }

                return (
                  <div key={field.id} className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">
                      {field.label}
                      {isMandatory && <span className="text-red-500 ml-1">*</span>}
                      {isFieldReadOnly && (
                        <span className="text-xs text-gray-400 ml-2">(System Generated)</span>
                      )}
                    </label>
                    <div className={`flex-1 text-sm ${isFieldReadOnly ? 'text-gray-500' : 'text-gray-900'}`}>
                      {displayValue}
                    </div>
                  </div>
                );
              })}

              {!isReadOnly && (
                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleEditGroup(sectionIndex)}
                    className="px-4 py-2 text-sm font-medium text-white rounded"
                    style={{ backgroundColor: '#9b1823' }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          );
        }}
      </ProfileAccordion>
    </div>
  );
}

