import React, { useState, useMemo, useEffect } from 'react';
import { useProductsQuery, useUpdateProductsMutation } from '../../hooks/useProfileQueries';
import { ProfileSectionForm } from './ProfileSectionForm';
import { ProfileAccordion } from './ProfileAccordion';
import { Loader2, AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAbility } from '@casl/react';
import { CASLAbilityContext } from '../../context/AbilityContext';
import { AppAbility } from '../../config/abilities';
import { isVisible, type VisibilityRule } from '../../utils/visibility';
import { MatrixField, type MatrixValue } from './MatrixField';

/**
 * Migration function to convert old per-activity matrix format to new unified matrix format
 */
function migrateOldMatrixData(oldData: Record<string, any>): Record<string, any> {
  const newData = { ...oldData };

  // Mapping from old activity field names to new unified matrix structure
  const bankingInvestmentMapping: Record<string, string> = {
    'activity_advising_financial_products': 'advising_financial_products',
    'activity_arranging_custody': 'arranging_custody',
    'activity_arranging_deals': 'arranging_deals',
    'activity_dealing_agent': 'dealing_agent',
    'activity_dealing_principal': 'dealing_principal',
    'activity_managing_assets': 'managing_assets',
    'activity_operating_clearing_house': 'operating_clearing_house',
    'activity_operating_exchange': 'operating_exchange',
    'activity_providing_custody': 'providing_custody',
  };

  // Initialize unified matrices if they don't exist
  if (!newData.banking_investment_activities_matrix) {
    newData.banking_investment_activities_matrix = {};
  }
  if (!newData.insurance_general_activities_matrix) {
    newData.insurance_general_activities_matrix = {};
  }
  if (!newData.insurance_life_activities_matrix) {
    newData.insurance_life_activities_matrix = {};
  }
  if (!newData.money_services_activities_matrix) {
    newData.money_services_activities_matrix = {};
  }

  // Migrate Banking & Investment matrices
  for (const [oldFieldName, activityKey] of Object.entries(bankingInvestmentMapping)) {
    if (oldData[oldFieldName] && typeof oldData[oldFieldName] === 'object') {
      // Convert old format (row_0: { col_0: true }) to new format (activityKey: { productKey: true })
      // Since we don't know the exact mapping of old rows/cols to new product types,
      // we'll preserve the structure but need to map it properly
      // For now, we'll try to preserve boolean values if they exist
      const oldMatrix = oldData[oldFieldName];
      const newActivityData: Record<string, boolean> = {};
      
      // Try to extract values - this is a simplified migration
      // In a real scenario, you'd need the exact mapping from old row/col indices to product types
      Object.keys(oldMatrix).forEach((rowKey) => {
        const rowData = oldMatrix[rowKey];
        if (typeof rowData === 'object') {
          Object.keys(rowData).forEach((colKey) => {
            // Map generic keys to product type keys (simplified - assumes first col is financial_service_only)
            // This is a best-effort migration - exact mapping would require schema knowledge
            const productKey = colKey === 'col_0' ? 'financial_service_only' : 
                              colKey === 'col_1' ? 'certificate' : colKey;
            if (rowKey === 'row_0' || rowData[colKey]) {
              newActivityData[productKey] = Boolean(rowData[colKey]);
            }
          });
        }
      });
      
      if (Object.keys(newActivityData).length > 0) {
        newData.banking_investment_activities_matrix[activityKey] = newActivityData;
      }
    }
  }

  // Migrate Insurance General matrices
  if (oldData.ins_gen_effecting_contracts && typeof oldData.ins_gen_effecting_contracts === 'object') {
    // Map old matrix to new structure - simplified migration
    const oldMatrix = oldData.ins_gen_effecting_contracts;
    const classKeys = ['class_1_accident', 'class_2_sickness', 'class_3_land_vehicles', 
                       'class_4_marine_aviation', 'class_5_fire_property', 'class_6_liability',
                       'class_7a_credit', 'class_7b_suretyship', 'class_8_other'];
    
    const newActivityData: Record<string, boolean> = {};
    Object.keys(oldMatrix).forEach((rowKey, idx) => {
      const rowData = oldMatrix[rowKey];
      if (typeof rowData === 'object' && classKeys[idx]) {
        Object.keys(rowData).forEach((colKey) => {
          if (rowData[colKey]) {
            newActivityData[classKeys[idx]] = true;
          }
        });
      }
    });
    
    if (Object.keys(newActivityData).length > 0) {
      newData.insurance_general_activities_matrix.effecting_contracts = newActivityData;
    }
  }

  if (oldData.ins_gen_carrying_out_contracts && typeof oldData.ins_gen_carrying_out_contracts === 'object') {
    const oldMatrix = oldData.ins_gen_carrying_out_contracts;
    const classKeys = ['class_1_accident', 'class_2_sickness', 'class_3_land_vehicles', 
                       'class_4_marine_aviation', 'class_5_fire_property', 'class_6_liability',
                       'class_7a_credit', 'class_7b_suretyship', 'class_8_other'];
    
    const newActivityData: Record<string, boolean> = {};
    Object.keys(oldMatrix).forEach((rowKey, idx) => {
      const rowData = oldMatrix[rowKey];
      if (typeof rowData === 'object' && classKeys[idx]) {
        Object.keys(rowData).forEach((colKey) => {
          if (rowData[colKey]) {
            newActivityData[classKeys[idx]] = true;
          }
        });
      }
    });
    
    if (Object.keys(newActivityData).length > 0) {
      newData.insurance_general_activities_matrix.carrying_out_contracts = newActivityData;
    }
  }

  // Migrate Insurance Life matrices
  if (oldData.ins_life_effecting_contracts && typeof oldData.ins_life_effecting_contracts === 'object') {
    const oldMatrix = oldData.ins_life_effecting_contracts;
    const classKeys = ['class_i_life_annuity', 'class_ii_marriage_birth', 'class_iii_linked_long_term',
                       'class_iv_permanent_health', 'class_v_tontines', 'class_vi_capital_redemption',
                       'class_vii_pension_fund'];
    
    const newActivityData: Record<string, boolean> = {};
    Object.keys(oldMatrix).forEach((rowKey, idx) => {
      const rowData = oldMatrix[rowKey];
      if (typeof rowData === 'object' && classKeys[idx]) {
        Object.keys(rowData).forEach((colKey) => {
          if (rowData[colKey]) {
            newActivityData[classKeys[idx]] = true;
          }
        });
      }
    });
    
    if (Object.keys(newActivityData).length > 0) {
      newData.insurance_life_activities_matrix.effecting_contracts = newActivityData;
    }
  }

  if (oldData.ins_life_carrying_out_contracts && typeof oldData.ins_life_carrying_out_contracts === 'object') {
    const oldMatrix = oldData.ins_life_carrying_out_contracts;
    const classKeys = ['class_i_life_annuity', 'class_ii_marriage_birth', 'class_iii_linked_long_term',
                       'class_iv_permanent_health', 'class_v_tontines', 'class_vi_capital_redemption',
                       'class_vii_pension_fund'];
    
    const newActivityData: Record<string, boolean> = {};
    Object.keys(oldMatrix).forEach((rowKey, idx) => {
      const rowData = oldMatrix[rowKey];
      if (typeof rowData === 'object' && classKeys[idx]) {
        Object.keys(rowData).forEach((colKey) => {
          if (rowData[colKey]) {
            newActivityData[classKeys[idx]] = true;
          }
        });
      }
    });
    
    if (Object.keys(newActivityData).length > 0) {
      newData.insurance_life_activities_matrix.carrying_out_contracts = newActivityData;
    }
  }

  // Migrate Money Services matrices
  const moneyServicesMapping: Record<string, string> = {
    'ms_payment_account': 'payment_account',
    'ms_money_transmission': 'money_transmission',
    'ms_payment_transactions': 'payment_transactions',
    'ms_payment_instruments': 'payment_instruments',
    'ms_stored_value': 'stored_value',
    'ms_arrangements': 'arrangements',
    'ms_advice': 'advice',
    'ms_account_information': 'account_information',
    'ms_payment_initiation': 'payment_initiation',
  };

  for (const [oldFieldName, activityKey] of Object.entries(moneyServicesMapping)) {
    if (oldData[oldFieldName] && typeof oldData[oldFieldName] === 'object') {
      const oldMatrix = oldData[oldFieldName];
      const newActivityData: Record<string, boolean> = {};
      const serviceTypeKeys = ['arranging_advising', 'providing'];
      
      Object.keys(oldMatrix).forEach((rowKey, idx) => {
        const rowData = oldMatrix[rowKey];
        if (typeof rowData === 'object' && serviceTypeKeys[idx]) {
          Object.keys(rowData).forEach((colKey) => {
            if (rowData[colKey]) {
              newActivityData[serviceTypeKeys[idx]] = true;
            }
          });
        }
      });
      
      if (Object.keys(newActivityData).length > 0) {
        newData.money_services_activities_matrix[activityKey] = newActivityData;
      }
    }
  }

  // Return migrated data (old fields are kept for now to allow rollback if needed)
  return newData;
}

type FieldConfig = {
  id: string;
  label: string;
  fieldName: string;
  fieldType: string;
  uiBlockType?: string;
  visibility?: VisibilityRule;
  matrixDimensions?: { rows: number; columns: number };
  matrixConfig?: {
    rowLabels?: Array<{ key: string; label: string }>;
    columnLabels?: Array<{ key: string; label: string }>;
    applicableCells?: Record<string, string[]>;
  };
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
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Record<string, any>>({});
  const [matrixDrafts, setMatrixDrafts] = useState<Record<string, MatrixValue>>({});

  const ability = useAbility<AppAbility>(CASLAbilityContext);
  const isReadOnly = !ability.can('update', 'user-profile');

  // Fetch Products data
  const { data, isLoading, error, refetch } = useProductsQuery({
    retry: 1,
    retryDelay: 1000,
  });

  const schema: TabSchema | undefined = data?.schema;
  const rawProductsData = data?.data || {};

  // Debug: Log schema to verify it's loading correctly
  useEffect(() => {
    if (!schema) return;

    const fields = schema.groups?.flatMap(g => g.fields) ?? [];
    const matrices = fields
      .filter(f => f.uiBlockType === 'matrixAccordion' || (typeof f.fieldType === 'string' && f.fieldType.toLowerCase() === 'matrix'))
      .map(f => ({ 
        fieldName: f.fieldName, 
        id: f.id, 
        uiBlockType: f.uiBlockType, 
        fieldType: f.fieldType, 
        section: (f as any).section, 
        uiSection: (f as any).uiSection, 
        groupName: (f as any).groupName 
      }));

    const banking = fields.filter(f =>
      ((f as any).section === 'Banking & Investment' || (f as any).uiSection === 'Banking & Investment')
    ).map(f => ({ 
      fieldName: f.fieldName, 
      id: f.id, 
      uiBlockType: f.uiBlockType, 
      fieldType: f.fieldType, 
      label: f.label 
    }));

    console.log('[ProductsTab][DEBUG] matrices:', matrices);
    console.log('[ProductsTab][DEBUG] banking fields:', banking);
  }, [schema]);

  // Update mutation
  const updateMutation = useUpdateProductsMutation({
    onSuccess: (responseData) => {
      console.log('[ProductsTab] Save successful, response data:', {
        dataKeys: Object.keys(responseData.data || {}),
        matrixFields: Object.keys(responseData.data || {}).filter(k => k.includes('_matrix')),
        bankingMatrix: responseData.data?.banking_investment_activities_matrix,
        bankingMatrixKeys: responseData.data?.banking_investment_activities_matrix ? Object.keys(responseData.data.banking_investment_activities_matrix) : null,
        sampleBankingRow: responseData.data?.banking_investment_activities_matrix && Object.keys(responseData.data.banking_investment_activities_matrix).length > 0 ? {
          rowKey: Object.keys(responseData.data.banking_investment_activities_matrix)[0],
          rowData: responseData.data.banking_investment_activities_matrix[Object.keys(responseData.data.banking_investment_activities_matrix)[0]],
        } : null,
      });
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
      // Clear editing state first
      setEditingBlockId(null);
      setEditingData({});
      setMatrixDrafts({});
      // Refetch to ensure UI shows latest saved data
      // Use setTimeout to ensure cache update completes first
      setTimeout(() => {
        refetch();
      }, 100);
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
  
  // Apply migration if old format data exists
  const productsData = useMemo(() => {
    // Check if old format exists (has activity_* matrix fields)
    const hasOldFormat = Object.keys(rawProductsData).some(key => 
      key.startsWith('activity_') && 
      typeof rawProductsData[key] === 'object' &&
      !Array.isArray(rawProductsData[key])
    ) || Object.keys(rawProductsData).some(key => 
      (key.startsWith('ins_gen_') || key.startsWith('ins_life_') || key.startsWith('ms_')) &&
      typeof rawProductsData[key] === 'object' &&
      !Array.isArray(rawProductsData[key])
    );

    if (hasOldFormat) {
      console.log('🔄 [ProductsTab] Migrating old matrix data to new unified format');
      const migratedData = migrateOldMatrixData(rawProductsData);
      
      // Optionally save migrated data back (this would require a save call)
      // For now, we'll use it in memory and let the user save when they edit
      return migratedData;
    }
    
    // Parse matrix fields if they're stored as JSON strings
    const processedData = { ...rawProductsData };
    const matrixFieldNames = [
      'banking_investment_activities_matrix',
      'insurance_general_activities_matrix',
      'insurance_life_activities_matrix',
      'money_services_activities_matrix',
    ];
    
    matrixFieldNames.forEach(fieldName => {
      if (processedData[fieldName] !== undefined && processedData[fieldName] !== null) {
        // If it's a string, try to parse it as JSON
        if (typeof processedData[fieldName] === 'string') {
          try {
            processedData[fieldName] = JSON.parse(processedData[fieldName]);
            console.log(`[ProductsTab] Parsed ${fieldName} from JSON string`);
          } catch (e) {
            console.warn(`[ProductsTab] Failed to parse ${fieldName} as JSON:`, e);
            // If parsing fails, set to empty object
            processedData[fieldName] = {};
          }
        }
        // If it's already an object, ensure it's the right structure
        else if (typeof processedData[fieldName] === 'object' && !Array.isArray(processedData[fieldName])) {
          // Already in correct format - ensure nested structure is correct
          const matrixValue = processedData[fieldName] as MatrixValue;
          // Validate structure: should be Record<string, Record<string, boolean>>
          const isValid = Object.values(matrixValue).every(row => 
            typeof row === 'object' && !Array.isArray(row) &&
            Object.values(row).every(cell => typeof cell === 'boolean')
          );
          if (!isValid && Object.keys(matrixValue).length > 0) {
            console.warn(`[ProductsTab] Invalid matrix structure for ${fieldName}, resetting`);
            processedData[fieldName] = {};
          }
        } else {
          // Unexpected type, reset to empty object
          console.warn(`[ProductsTab] Unexpected type for ${fieldName}: ${typeof processedData[fieldName]}, resetting`);
          processedData[fieldName] = {};
        }
      } else {
        // Initialize empty matrix if not present
        processedData[fieldName] = {};
      }
    });
    
    return processedData;
  }, [rawProductsData]);

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
      // Count regular fields
      const regularFields = section.groups.flatMap(g => 
        g.fields.filter((f) => !f.hidden && !f.readOnly && f.uiBlockType !== 'matrixAccordion')
      );
      const totalFields = regularFields.length;
      const filledFields = regularFields.reduce((acc, f) => {
        const v = productsData[f.fieldName];
        const hasValue = v !== null && v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0) && (typeof v !== 'boolean' || v === true);
        return acc + (hasValue ? 1 : 0);
      }, 0);

      // Calculate matrix field completion
      const matrixFields = section.groups.flatMap(g => 
        g.fields.filter((f) => f.uiBlockType === 'matrixAccordion' && !f.hidden && !f.readOnly)
      );

      let totalMatrixCells = 0;
      let filledMatrixCells = 0;

      matrixFields.forEach((field) => {
        const matrixValue = productsData[field.fieldName] as MatrixValue | undefined;
        const matrixConfig = field.matrixConfig;
        
        if (matrixConfig) {
          // Count applicable cells
          if (matrixConfig.applicableCells) {
            // Partial matrix: count only applicable cells
            Object.entries(matrixConfig.applicableCells).forEach(([rowKey, colKeys]) => {
              totalMatrixCells += colKeys.length;
              colKeys.forEach((colKey) => {
                if (matrixValue?.[rowKey]?.[colKey] !== undefined) {
                  filledMatrixCells++;
                }
              });
            });
          } else {
            // Full matrix: count all row × column combinations
            const rows = matrixConfig.rowLabels || [];
            const cols = matrixConfig.columnLabels || [];
            totalMatrixCells += rows.length * cols.length;
            rows.forEach((row) => {
              cols.forEach((col) => {
                if (matrixValue?.[row.key]?.[col.key] !== undefined) {
                  filledMatrixCells++;
                }
              });
            });
          }
        }
      });

      // Combine regular fields and matrix cells for total completion
      const totalAllFields = totalFields + totalMatrixCells;
      const filledAllFields = filledFields + filledMatrixCells;
      const completion = totalAllFields > 0 ? Math.round((filledAllFields / totalAllFields) * 100) : 0;
      
      return {
        id: section.name,
        title: section.name,
        completion,
        mandatoryCompletion: completion,
        // Hide required/optional pill for Products; keep data for completion only
        isRequired: undefined,
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
    setEditingBlockId(group.id);
    setEditingData(groupData);
  };

  const handleCancelEdit = () => {
    setEditingBlockId(null);
    setEditingData({});
    setMatrixDrafts({});
  };

  const handleSaveGroup = async (group: GroupConfig, dataToSave: Record<string, any>) => {
    const payload = { ...dataToSave, _groupId: group.id };
    await updateMutation.mutateAsync(payload);
  };

  const handleSaveMatrix = async (group: GroupConfig, field: FieldConfig) => {
    const matrixValue = matrixDrafts[field.fieldName] || {};
    console.log('[ProductsTab] Saving matrix:', {
      fieldName: field.fieldName,
      matrixValue,
      valueKeys: Object.keys(matrixValue),
      sampleRow: Object.keys(matrixValue)[0] ? {
        rowKey: Object.keys(matrixValue)[0],
        rowData: matrixValue[Object.keys(matrixValue)[0]],
      } : null,
    });
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

  const renderSimpleBlock = (group: GroupConfig, simpleFields: FieldConfig[]) => {
    const isEditing = editingBlockId === group.id;

    if (isEditing) {
      return (
        <ProfileSectionForm
          groups={[{ ...group, fields: simpleFields }]}
          data={editingData}
          onSubmit={(data) => handleSaveGroup(group, data)}
          onCancel={handleCancelEdit}
          isLoading={updateMutation.isPending}
          isReadOnly={isReadOnly}
        />
      );
    }

    return (
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
    );
  };

  const renderMatrixBlock = (group: GroupConfig, field: FieldConfig) => {
    const blockId = `${group.id}:${field.fieldName}`;
    const savedValue = (productsData[field.fieldName] as MatrixValue) || {};
    // If we have a draft, use it; otherwise use saved value
    // After save, drafts are cleared, so we should see saved value
    const currentValue = matrixDrafts[field.fieldName] ?? savedValue;
    const canEdit = !isReadOnly && editingBlockId === blockId;
    const matrixConfig = field.matrixConfig || {};
    
    // Debug: Log matrix value loading for all matrices
    console.log(`[ProductsTab] Rendering matrix ${field.fieldName}:`, {
      hasDraft: !!matrixDrafts[field.fieldName],
      hasSavedValue: !!savedValue && Object.keys(savedValue).length > 0,
      savedValueKeys: Object.keys(savedValue),
      currentValueKeys: Object.keys(currentValue),
      sampleSavedRow: Object.keys(savedValue)[0] ? {
        rowKey: Object.keys(savedValue)[0],
        rowData: savedValue[Object.keys(savedValue)[0]],
      } : null,
      sampleCurrentRow: Object.keys(currentValue)[0] ? {
        rowKey: Object.keys(currentValue)[0],
        rowData: currentValue[Object.keys(currentValue)[0]],
      } : null,
    });

    return (
      <div key={field.id} className="space-y-3">
        <div className="text-base font-semibold text-gray-900">{field.label}</div>
        <MatrixField
          label=""
          fieldName={field.fieldName}
          matrixDimensions={field.matrixDimensions}
          rowLabels={matrixConfig.rowLabels}
          columnLabels={matrixConfig.columnLabels}
          applicableCells={matrixConfig.applicableCells}
          value={currentValue}
          onChange={(next) => setMatrixDrafts((prev) => ({ ...prev, [field.fieldName]: next }))}
          readOnly={isReadOnly || !canEdit}
        />
        {!isReadOnly && (
          <div className="flex gap-2">
            {canEdit ? (
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
                  setEditingBlockId(blockId);
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
  };

  return (
    <div className="space-y-6">
      {/* Sections Accordion */}
      <ProfileAccordion
        sections={sectionsForAccordion}
        defaultExpandedIndex={0}
        renderHeader={(section) => (
          <div className="flex flex-col sm:flex-row sm:items-center w-full">
            <div className="flex items-center">
              <h3 className="font-medium text-gray-700 mb-1 sm:mb-0 text-sm sm:text-base break-words">
                {section.title}
              </h3>
              {/* Always show Required badge for Products */}
              <span className="ml-2 flex items-center text-xs px-1.5 py-0.5 rounded-full text-amber-700 bg-amber-100">
                <span className="w-2 h-2 rounded-full mr-1 flex-shrink-0 bg-current" />
                <span className="truncate">Required</span>
              </span>
              {section.completion === 100 && (
                <span className="ml-2 flex items-center text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                  <span className="w-2 h-2 rounded-full mr-1 flex-shrink-0 bg-current" />
                  <span className="truncate">Complete</span>
                </span>
              )}
            </div>
            <div className="sm:ml-3 flex items-center mt-2 sm:mt-0">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    section.completion === 100
                      ? 'bg-green-500'
                      : section.completion && section.completion >= 30
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: `${section.completion || 0}%`,
                    backgroundColor:
                      section.completion &&
                      section.completion >= 70 &&
                      section.completion < 100
                        ? '#9b1823'
                        : undefined,
                  }}
                  aria-valuenow={section.completion || 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  role="progressbar"
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500">{section.completion || 0}%</span>
            </div>
          </div>
        )}
      >
        {(_section, sectionIndex) => {
          const sectionData = visibleGroupsBySection[sectionIndex];
          if (!sectionData) return null;

          // Unified matrix allowlist
          const UNIFIED_MATRIX_FIELDNAMES = new Set([
            'banking_investment_activities_matrix',
            'insurance_general_activities_matrix',
            'insurance_life_activities_matrix',
            'money_services_activities_matrix',
          ]);

          // Check if unified matrix is visible in this section
          const hasUnifiedMatrix = sectionData.groups.some(group => {
            const fieldVisibility = (field: FieldConfig) => isVisible(field.visibility as VisibilityRule, productsData);
            return group.fields.some(f => {
              const isMatrixLike = f.uiBlockType === 'matrixAccordion' || 
                (typeof f.fieldType === 'string' && f.fieldType.toLowerCase() === 'matrix');
              return isMatrixLike && 
                     f.fieldName && 
                     UNIFIED_MATRIX_FIELDNAMES.has(f.fieldName) &&
                     fieldVisibility(f) && 
                     !f.hidden;
            });
          });

          const renderGroups = sectionData.groups
            .filter((group) => isVisible(group.visibility as VisibilityRule, productsData))
            .flatMap((group) => {
              const fieldVisibility = (field: FieldConfig) => isVisible(field.visibility as VisibilityRule, productsData);
              
              // Filter matrix fields: only allow unified matrices
              const matrixFields = group.fields.filter((f) => {
                const isMatrixLike = f.uiBlockType === 'matrixAccordion' || 
                  (typeof f.fieldType === 'string' && f.fieldType.toLowerCase() === 'matrix');
                
                if (!isMatrixLike) return false;
                if (!fieldVisibility(f) || f.hidden) return false;
                if (!f.fieldName) return false;
                
                return UNIFIED_MATRIX_FIELDNAMES.has(f.fieldName);
              });

              // Filter simple fields, but hide old boolean lists when unified matrix is present
              const simpleFields = group.fields.filter((f) => {
                if (f.uiBlockType === 'matrixAccordion' || 
                    (typeof f.fieldType === 'string' && f.fieldType.toLowerCase() === 'matrix')) {
                  return false;
                }
                if (!fieldVisibility(f) || f.hidden) return false;
                
                // Hide old Banking & Investment activity/investment type boolean fields when unified matrix exists
                if (hasUnifiedMatrix && 
                    (sectionData.name === 'Banking & Investment' || 
                     (group as any).uiSection === 'Banking & Investment' ||
                     (group as any).section === 'Banking & Investment')) {
                  // Hide "Investment Types" group
                  if ((group as any).groupName === 'Investment Types') {
                    return false;
                  }
                  // Hide any group that looks like old activities list (but keep "Activities Matrix" which is the unified one)
                  if ((group as any).groupName === 'Activities' && 
                      !group.fields.some(f => f.fieldName === 'banking_investment_activities_matrix')) {
                    return false;
                  }
                }
                
                return true;
              });

              const blocks: Array<{ type: 'simple' | 'matrix'; key: string; group: GroupConfig; field?: FieldConfig; fields?: FieldConfig[] }> = [];
              if (simpleFields.length > 0) {
                blocks.push({ type: 'simple', key: `${group.id}-simple`, group: { ...group, fields: simpleFields }, fields: simpleFields });
              }
              matrixFields.forEach((field) => {
                blocks.push({ type: 'matrix', key: `${group.id}-${field.id}`, group, field });
              });
              return blocks;
            });

          return (
            <div className="space-y-6">
              {renderGroups.map((block) => {
                if (block.type === 'simple' && block.fields) {
                  return (
                    <div key={block.key} className="space-y-4">
                      <div className="text-base font-semibold text-gray-900">{block.group.groupName}</div>
                      {renderSimpleBlock(block.group, block.fields)}
                    </div>
                  );
                }
                if (block.type === 'matrix' && block.field) {
                  return (
                    <div key={block.key} className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                      {renderMatrixBlock(block.group, block.field)}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        }}
      </ProfileAccordion>
    </div>
  );
}
