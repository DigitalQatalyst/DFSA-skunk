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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

const RESTRICTIONS_SECTION_NAME = 'Restrictions';
const RESTRICTIONS_CONTROL_GROUP_ID = 'restrictions_restrictions_control_questions';
const RESTRICTIONS_CUSTOM_GROUP_ID = 'restrictions_restrictions_custom_restriction';
const CONDITIONS_SECTION_NAME = 'Conditions';
const CONDITIONS_CONTROL_GROUP_ID = 'conditions_conditions_control_questions';

const CRA_APPLY_FIELD = 'cra_apply_flag';
const ATS_APPLY_FIELD = 'ats_apply_flag';
const ISLAMIC_ENDORSEMENT_APPLY_FIELD = 'endorsement_islamic_flag';

const CRA_RECOGNITION_GROUP_ID = 'other_products_services_q104_q107_credit_rating_agency_recognition_type';
const CRA_DETAILS_GROUP_ID = 'other_products_services_q104_q107_credit_rating_agency_details';
const ATS_FACILITY_GROUP_ID = 'other_products_services_q108_q111_alternative_trading_system_facility_type';
const ATS_DETAILS_GROUP_ID = 'other_products_services_q108_q111_alternative_trading_system_details';
const ENDORSEMENT_ISLAMIC_GROUP_ID = 'endorsements_endorsements_end01_islamic_financial_business';
const ENDORSEMENT_ISLAMIC_SUB_GROUP_ID = 'endorsements_endorsements_end01_islamic_sub_options';

const STANDARD_NON_STANDARD_TYPE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Standard', value: 'Standard' },
  { label: 'Non-standard', value: 'Non-standard' },
];

const RESTRICTION_TYPE_OPTIONS = STANDARD_NON_STANDARD_TYPE_OPTIONS;
const CONDITION_TYPE_OPTIONS = STANDARD_NON_STANDARD_TYPE_OPTIONS;

const RESTRICTION_STANDARD_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'RST01 - Dealing as Principal limited to Matched Principal basis only', value: 'RST01' },
  { label: 'RST02 - Managing CIF and Advising restricted to QIF', value: 'RST02' },
  { label: 'RST03 - Managing CIF and Advising restricted to QIF and Exempt Funds', value: 'RST03' },
  { label: 'RST04 - Managing CIF and Advising restricted to QIF and Exempt (VC Form)', value: 'RST04' },
  { label: 'RST05 - Managing CIF and Advising restricted to QIF (VC Funds only)', value: 'RST05' },
  { label: 'RST06 - Managing CIF restricted to QIF', value: 'RST06' },
  { label: 'RST07 - Managing CIF restricted to QIF and Exempt Funds', value: 'RST07' },
  { label: 'RST08 - Managing CIF restricted to QIF and Exempt (VC Form)', value: 'RST08' },
  { label: 'RST09 - Managing CIF restricted to QIF (VC Funds only)', value: 'RST09' },
  { label: 'RST10 - Managing a Restricted Profit Sharing Investment Account', value: 'RST10' },
  { label: 'RST11 - Providing Custody (only if for a Fund)', value: 'RST11' },
  { label: 'RST12 - Trust Services limited to non-express trust trustee', value: 'RST12' },
  { label: "RST13 - Fund Admin limited to Firm's/Group's Funds", value: 'RST13' },
  { label: 'RST14 - Restricted to captive insurance services', value: 'RST14' },
  { label: 'RST15 - Restricted to Class 1 Captive Insurer', value: 'RST15' },
  { label: 'RST16 - Restricted to Class 2 Captive Insurer', value: 'RST16' },
  { label: 'RST17 - Restricted to Class 3 Captive Insurer', value: 'RST17' },
];

function normalizeStandardNonStandardType(value: unknown): string {
  if (value === null || value === undefined) return '';
  const v = String(value).trim();
  if (!v) return '';
  const lower = v.toLowerCase();
  if (lower === 'standard') return 'Standard';
  if (lower === 'non-standard' || lower === 'non_standard' || lower === 'nonstandard') return 'Non-standard';
  return v;
}

const normalizeRestrictionType = normalizeStandardNonStandardType;
const normalizeConditionType = normalizeStandardNonStandardType;

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
  const [savingMatrixFieldName, setSavingMatrixFieldName] = useState<string | null>(null);
  type LicenseSubTab =
    | 'categorySelection'
    | 'bankingInvestment'
    | 'insuranceGeneral'
    | 'insuranceLife'
    | 'moneyServices';
  const [activeLicenseSubTab, setActiveLicenseSubTab] = useState<LicenseSubTab>('categorySelection');
  type PendingMatrixEdit = { blockId: string; fieldName: string; currentValue: MatrixValue };
  const [unsavedLicenseDialogOpen, setUnsavedLicenseDialogOpen] = useState(false);
  const [pendingMatrixEdit, setPendingMatrixEdit] = useState<PendingMatrixEdit | null>(null);
  const [resolvingUnsavedLicenseDialog, setResolvingUnsavedLicenseDialog] = useState(false);

  const ability = useAbility<AppAbility>(CASLAbilityContext);
  const isReadOnly = !ability.can('update', 'user-profile');

  // Fetch Products data
  const { data, isLoading, error, refetch } = useProductsQuery({
    retry: 1,
    retryDelay: 1000,
  });

  const schema: TabSchema | undefined = data?.schema;
  const rawProductsData = data?.data || {};

  const LICENSE_CATEGORY_GROUP_ID = 'license_category_license_category_q98_category_selection';
  const UNIFIED_MATRIX_SECTION_NAMES = new Set([
    'Banking & Investment',
    'Insurance General',
    'Insurance Life',
    'Money Services',
  ]);
  const UNIFIED_MATRIX_TABS = [
    {
      subTabId: 'bankingInvestment' as const,
      tabLabel: 'Banking & Investment',
      licenseFieldName: 'license_category_financial_services',
      matrixFieldName: 'banking_investment_activities_matrix',
    },
    {
      subTabId: 'insuranceGeneral' as const,
      tabLabel: 'Insurance General',
      licenseFieldName: 'license_category_insurance_general',
      matrixFieldName: 'insurance_general_activities_matrix',
    },
    {
      subTabId: 'insuranceLife' as const,
      tabLabel: 'Insurance Life',
      licenseFieldName: 'license_category_insurance_life',
      matrixFieldName: 'insurance_life_activities_matrix',
    },
    {
      subTabId: 'moneyServices' as const,
      tabLabel: 'Money Services',
      licenseFieldName: 'license_category_money_services',
      matrixFieldName: 'money_services_activities_matrix',
    },
  ];

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

  const licenseCategoryGroupForSave = useMemo(() => {
    const groups = (schema?.groups as GroupConfig[]) || [];
    return groups.find((g) => g.id === LICENSE_CATEGORY_GROUP_ID) || null;
  }, [schema]);

  const licenseCategoryFieldNames = useMemo(() => {
    return (licenseCategoryGroupForSave?.fields || [])
      .filter((f) => f.fieldType === 'Boolean')
      .map((f) => f.fieldName);
  }, [licenseCategoryGroupForSave]);

  const hasUnsavedLicenseCategoryChanges = useMemo(() => {
    if (editingBlockId !== LICENSE_CATEGORY_GROUP_ID) return false;
    if (licenseCategoryFieldNames.length === 0) return false;
    return licenseCategoryFieldNames.some((fieldName) => {
      return Boolean(editingData?.[fieldName]) !== Boolean(productsData?.[fieldName]);
    });
  }, [editingBlockId, editingData, licenseCategoryFieldNames, productsData]);

  // When editing the License Category group, use the draft answers for visibility + matrix tabs
  const visibilityAnswers = useMemo(() => {
    if (editingBlockId === LICENSE_CATEGORY_GROUP_ID) {
      return { ...productsData, ...editingData };
    }
    return productsData;
  }, [editingBlockId, editingData, productsData]);

  const visibleGroupsBySection = useMemo(() => {
    if (!schema?.groups) return [] as Array<{ name: string; groups: GroupConfig[] }>;

    const groups = schema.groups as GroupConfig[];
    const sectionMap: Record<string, GroupConfig[]> = {};

    const craApplied = productsData?.[CRA_APPLY_FIELD] === true;
    const atsApplied = productsData?.[ATS_APPLY_FIELD] === true;
    const islamicEndorsementApplied = productsData?.[ISLAMIC_ENDORSEMENT_APPLY_FIELD] === true;

    const visibleGroups = groups
      .filter((group) => isVisible(group.visibility as VisibilityRule, productsData))
      .filter((group) => {
        const sectionName = group.uiSection || 'Other';
        if (sectionName !== RESTRICTIONS_SECTION_NAME) return true;

        // Restrictions UX (Phase 3):
        // - Use restriction_standard_selection as the single source-of-truth for Standard restrictions.
        // - Do not render RST01–RST17 detail groups or the legacy custom group; they duplicate the selection.
        // - Always render only the control questions group, which handles Standard vs Non-standard inputs.
        return group.id === RESTRICTIONS_CONTROL_GROUP_ID;
      })
      .filter((group) => {
        const sectionName = group.uiSection || 'Other';
        if (sectionName !== CONDITIONS_SECTION_NAME) return true;
        // Phase 3 UI: show Conditions via a single control block (selector/textarea), hide legacy custom group.
        return group.id === CONDITIONS_CONTROL_GROUP_ID;
      })
      .filter((group) => {
        // Progressive disclosure for CRA / ATS / Islamic endorsement (UI-level gating)
        if (group.id === CRA_RECOGNITION_GROUP_ID || group.id === CRA_DETAILS_GROUP_ID) return craApplied;
        if (group.id === ATS_FACILITY_GROUP_ID || group.id === ATS_DETAILS_GROUP_ID) return atsApplied;
        if (group.id === ENDORSEMENT_ISLAMIC_SUB_GROUP_ID) return islamicEndorsementApplied;
        return true;
      });

    visibleGroups.forEach((group) => {
      const name = group.uiSection || 'Other';
      if (!sectionMap[name]) sectionMap[name] = [];
      sectionMap[name].push(group);
    });

    return Object.entries(sectionMap)
      .filter(([name]) => !UNIFIED_MATRIX_SECTION_NAMES.has(name))
      .map(([name, groups]) => ({ name, groups }));
  }, [schema, productsData]);

  const unifiedMatrixByFieldName = useMemo(() => {
    const groups = (schema?.groups as GroupConfig[]) || [];
    const map: Record<
      string,
      { group: GroupConfig; field: FieldConfig; tabLabel: string; licenseFieldName: string }
    > = {};

    for (const tab of UNIFIED_MATRIX_TABS) {
      const group = groups.find((g) =>
        (g.fields || []).some((f) => f.fieldName === tab.matrixFieldName)
      );
      const field = group?.fields?.find((f) => f.fieldName === tab.matrixFieldName);
      if (group && field) {
        map[tab.matrixFieldName] = {
          group,
          field,
          tabLabel: tab.tabLabel,
          licenseFieldName: tab.licenseFieldName,
        };
      }
    }

    return map;
  }, [schema]);

  const visibleUnifiedMatrixTab = useMemo(() => {
    for (const t of UNIFIED_MATRIX_TABS) {
      const matrix = unifiedMatrixByFieldName[t.matrixFieldName];
      if (!matrix) continue;
      if (!visibilityAnswers?.[t.licenseFieldName]) continue;
      if (!isVisible(matrix.group.visibility as VisibilityRule, visibilityAnswers)) continue;
      if (!isVisible(matrix.field.visibility as VisibilityRule, visibilityAnswers)) continue;
      if (matrix.field.hidden) continue;
      return { ...t, ...matrix };
    }
    return null;
  }, [unifiedMatrixByFieldName, visibilityAnswers]);

  useEffect(() => {
    if (activeLicenseSubTab === 'categorySelection') return;
    if (!visibleUnifiedMatrixTab || visibleUnifiedMatrixTab.subTabId !== activeLicenseSubTab) {
      setActiveLicenseSubTab('categorySelection');
    }
  }, [activeLicenseSubTab, visibleUnifiedMatrixTab]);

  const sectionsForAccordion = useMemo(() => {
    return visibleGroupsBySection.map((section) => {
      const isAnswered = (field: FieldConfig, value: any): boolean => {
        if (value === null || value === undefined) return false;

        switch (field.fieldType) {
          case 'Boolean':
            return typeof value === 'boolean';
          case 'Enum':
            return typeof value === 'string' && value.trim().length > 0;
          case 'MultiSelect':
            return Array.isArray(value) && value.length > 0;
          case 'Integer':
            return typeof value === 'number' && Number.isFinite(value);
          case 'Text':
            return typeof value === 'string' && value.trim().length > 0;
          default:
            if (typeof value === 'boolean') return true;
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === 'number') return Number.isFinite(value);
            if (typeof value === 'object') return Object.keys(value).length > 0;
            return String(value).trim() !== '';
        }
      };

      const isMandatoryField = (field: FieldConfig) => {
        return (
          field.mandatory === true ||
          (Array.isArray(field.mandatory) && field.mandatory.length > 0) ||
          (typeof field.mandatory === 'string' && field.mandatory.trim().length > 0)
        );
      };

      let totalFields = 0;
      let filledFields = 0;

      if (section.name === RESTRICTIONS_SECTION_NAME) {
        // Restrictions completion (Phase 3):
        // - Count restriction_add_flag as answered when boolean.
        // - If restriction_add_flag === true: count restriction_type, plus only the visible dependent field.
        const addFlagValue = productsData?.restriction_add_flag;
        const hasRestriction = addFlagValue === true;
        const addFlagAnswered = typeof addFlagValue === 'boolean';
        const restrictionType = normalizeRestrictionType(productsData?.restriction_type);

        totalFields += 1;
        filledFields += addFlagAnswered ? 1 : 0;

        if (hasRestriction) {
          totalFields += 1;
          filledFields += restrictionType.trim().length > 0 ? 1 : 0;

          if (restrictionType === 'Standard') {
            totalFields += 1;
            const selected = productsData?.restriction_standard_selection;
            const answered = Array.isArray(selected) ? selected.length > 0 : false;
            filledFields += answered ? 1 : 0;
          } else if (restrictionType === 'Non-standard') {
            totalFields += 1;
            const text = productsData?.restriction_custom_text;
            const answered = typeof text === 'string' && text.trim().length > 0;
            filledFields += answered ? 1 : 0;
          }
        }

        // Include visible RST detail group fields in completion only when they are rendered.
        // (They are filtered out of visibleGroupsBySection unless restriction_type === "Standard" and relevant codes are selected.)
        const alreadyCounted = new Set([
          'restriction_add_flag',
          'restriction_type',
          'restriction_standard_selection',
          'restriction_custom_text',
        ]);

        const visibleDetailFields = section.groups
          .filter((g) => g.id !== RESTRICTIONS_CONTROL_GROUP_ID)
          .flatMap((g) =>
            g.fields.filter((f) => {
              if (alreadyCounted.has(f.fieldName)) return false;
              if (f.hidden || f.readOnly) return false;
              if (f.uiBlockType === 'matrixAccordion') return false;
              return isVisible(f.visibility as VisibilityRule, productsData);
            })
          );

        totalFields += visibleDetailFields.length;
        filledFields += visibleDetailFields.reduce((acc, f) => {
          const v = productsData[f.fieldName];
          return acc + (isAnswered(f, v) ? 1 : 0);
        }, 0);
      } else if (section.name === CONDITIONS_SECTION_NAME) {
        // Conditions completion (Phase 3):
        // - Count condition_add_flag as answered when boolean.
        // - If condition_add_flag === true: count condition_type, plus only the visible dependent field.
        const addFlagValue = productsData?.condition_add_flag;
        const hasCondition = addFlagValue === true;
        const addFlagAnswered = typeof addFlagValue === 'boolean';
        const conditionType = normalizeConditionType(productsData?.condition_type);

        totalFields += 1;
        filledFields += addFlagAnswered ? 1 : 0;

        if (hasCondition) {
          totalFields += 1;
          filledFields += conditionType.trim().length > 0 ? 1 : 0;

          if (conditionType === 'Standard') {
            totalFields += 1;
            const selected = productsData?.condition_standard_selection;
            const answered = Array.isArray(selected) ? selected.length > 0 : false;
            filledFields += answered ? 1 : 0;
          } else if (conditionType === 'Non-standard') {
            totalFields += 1;
            const text = productsData?.condition_custom_text;
            const answered = typeof text === 'string' && text.trim().length > 0;
            filledFields += answered ? 1 : 0;
          }
        }
      } else {
        // Count regular fields
        const regularFields = section.groups.flatMap(g =>
          g.fields.filter((f) =>
            !f.hidden &&
            !f.readOnly &&
            f.uiBlockType !== 'matrixAccordion' &&
            isVisible(f.visibility as VisibilityRule, productsData)
          )
        );
        totalFields = regularFields.length;
        filledFields = regularFields.reduce((acc, f) => {
          const v = productsData[f.fieldName];
          return acc + (isAnswered(f, v) ? 1 : 0);
        }, 0);
      }

      // Calculate matrix field completion
      const matrixFields = section.groups.flatMap(g => 
        g.fields.filter((f) =>
          f.uiBlockType === 'matrixAccordion' &&
          !f.hidden &&
          !f.readOnly &&
          isVisible(f.visibility as VisibilityRule, productsData)
        )
      );

      let totalMatrixCells = 0;
      let filledMatrixCells = 0;

      const countMatrix = (matrixValue: MatrixValue | undefined, matrixConfig: any) => {
        if (!matrixConfig) return;

        if (matrixConfig.applicableCells) {
          Object.entries(matrixConfig.applicableCells).forEach(([rowKey, colKeys]) => {
            totalMatrixCells += (colKeys as string[]).length;
            (colKeys as string[]).forEach((colKey) => {
              if (typeof matrixValue?.[rowKey]?.[colKey] === 'boolean') {
                filledMatrixCells++;
              }
            });
          });
          return;
        }

        const rows = matrixConfig.rowLabels || [];
        const cols = matrixConfig.columnLabels || [];
        totalMatrixCells += rows.length * cols.length;
        rows.forEach((row: any) => {
          cols.forEach((col: any) => {
            if (typeof matrixValue?.[row.key]?.[col.key] === 'boolean') {
              filledMatrixCells++;
            }
          });
        });
      };

      matrixFields.forEach((field) => {
        countMatrix(productsData[field.fieldName] as MatrixValue | undefined, field.matrixConfig);
      });

      // Matrices are rendered under License Category tabs.
      // Keep License Category section completion intuitive by counting visible unified matrix cells.
      if (section.name === 'License Category') {
        UNIFIED_MATRIX_TABS.forEach((t) => {
          if (!productsData?.[t.licenseFieldName]) return;
          const matrix = unifiedMatrixByFieldName[t.matrixFieldName];
          if (!matrix) return;
          if (!isVisible(matrix.group.visibility as VisibilityRule, productsData)) return;
          if (!isVisible(matrix.field.visibility as VisibilityRule, productsData)) return;
          countMatrix(
            productsData[t.matrixFieldName] as MatrixValue | undefined,
            (matrix.field as any).matrixConfig
          );
        });
      }

      // Combine regular fields and matrix cells for total completion
      const totalAllFields = totalFields + totalMatrixCells;
      const filledAllFields = filledFields + filledMatrixCells;
      const completion = totalAllFields > 0 ? Math.round((filledAllFields / totalAllFields) * 100) : 0;

      const hasRequiredFields = section.groups.some((group) => {
        if (!isVisible(group.visibility as VisibilityRule, productsData)) return false;
        return (group.fields || []).some((f) => {
          if (f.hidden || f.readOnly) return false;
          if (!isVisible(f.visibility as VisibilityRule, productsData)) return false;
          return isMandatoryField(f);
        });
      });
      
      return {
        id: section.name,
        title: section.name,
        completion,
        mandatoryCompletion: completion,
        // Show "Required" only when the schema marks something as mandatory; otherwise show no pill.
        isRequired: hasRequiredFields ? true : undefined,
        hasMissingMandatory: false,
      };
    });
  }, [visibleGroupsBySection, productsData, unifiedMatrixByFieldName]);

  const handleEditGroup = (group: GroupConfig) => {
    const groupData: Record<string, any> = {};
    group.fields.forEach((field) => {
      if (field.uiBlockType === 'matrixAccordion') {
        const val = productsData[field.fieldName];
        setMatrixDrafts((prev) => ({ ...prev, [field.fieldName]: (val as MatrixValue) || {} }));
      } else {
        const value = productsData[field.fieldName];
        if (field.fieldType === 'Boolean') {
          if (group.id === LICENSE_CATEGORY_GROUP_ID) {
            groupData[field.fieldName] = Boolean(value);
            return;
          }
          groupData[field.fieldName] = typeof value === 'boolean' ? value : undefined;
          return;
        }

        if (field.fieldType === 'MultiSelect') {
          if (Array.isArray(value)) {
            groupData[field.fieldName] = value;
            return;
          }
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value);
              groupData[field.fieldName] = Array.isArray(parsed) ? parsed : [];
              return;
            } catch {
              groupData[field.fieldName] = [];
              return;
            }
          }
          groupData[field.fieldName] = [];
          return;
        }

        if (field.fieldType === 'Integer') {
          if (typeof value === 'number' && Number.isFinite(value)) {
            groupData[field.fieldName] = value;
            return;
          }
          if (typeof value === 'string' && value.trim() !== '') {
            const n = Number(value);
            groupData[field.fieldName] = Number.isFinite(n) ? Math.trunc(n) : null;
            return;
          }
          groupData[field.fieldName] = null;
          return;
        }

        // Enum/Text/other scalar types default to string (or empty string)
        groupData[field.fieldName] = value ?? '';
      }
    });

    if (group.id === RESTRICTIONS_CONTROL_GROUP_ID) {
      groupData.restriction_type = normalizeRestrictionType(productsData?.restriction_type ?? '');
      groupData.restriction_custom_text =
        typeof productsData?.restriction_custom_text === 'string' ? productsData.restriction_custom_text : '';
    }

    if (group.id === CONDITIONS_CONTROL_GROUP_ID) {
      groupData.condition_type = normalizeConditionType(productsData?.condition_type ?? '');
      groupData.condition_custom_text =
        typeof productsData?.condition_custom_text === 'string' ? productsData.condition_custom_text : '';
    }

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

  const beginEditMatrix = (blockId: string, fieldName: string, currentValue: MatrixValue) => {
    setEditingBlockId(blockId);
    setMatrixDrafts((prev) => ({ ...prev, [fieldName]: currentValue }));
  };

  const requestEditMatrix = (blockId: string, fieldName: string, currentValue: MatrixValue) => {
    if (hasUnsavedLicenseCategoryChanges) {
      setPendingMatrixEdit({ blockId, fieldName, currentValue });
      setUnsavedLicenseDialogOpen(true);
      return;
    }
    beginEditMatrix(blockId, fieldName, currentValue);
  };

  const handleUnsavedLicenseDialogSaveAndContinue = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!pendingMatrixEdit) return;

    if (!licenseCategoryGroupForSave) {
      toast.error('Unable to save License Category changes', {
        description: 'Category Selection configuration is missing.',
        className: 'bg-red-50 border-red-200 text-red-800',
        style: {
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca',
          color: '#991b1b',
        },
      });
      return;
    }

    setResolvingUnsavedLicenseDialog(true);
    const pending = pendingMatrixEdit;
    try {
      await handleSaveGroup(licenseCategoryGroupForSave, editingData);
      setUnsavedLicenseDialogOpen(false);
      setPendingMatrixEdit(null);
      beginEditMatrix(pending.blockId, pending.fieldName, pending.currentValue);
    } catch {
      // Errors/toasts handled by mutation onError.
    } finally {
      setResolvingUnsavedLicenseDialog(false);
    }
  };

  const handleUnsavedLicenseDialogDiscardAndContinue = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!pendingMatrixEdit) return;

    const pending = pendingMatrixEdit;
    handleCancelEdit();
    setUnsavedLicenseDialogOpen(false);
    setPendingMatrixEdit(null);
    beginEditMatrix(pending.blockId, pending.fieldName, pending.currentValue);
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
    setSavingMatrixFieldName(field.fieldName);
    try {
      await updateMutation.mutateAsync(payload);
    } finally {
      setSavingMatrixFieldName(null);
    }
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
    const islamicEndorsementApplied = productsData?.[ISLAMIC_ENDORSEMENT_APPLY_FIELD] === true;
    const effectiveSimpleFields =
      group.id === ENDORSEMENT_ISLAMIC_GROUP_ID && !islamicEndorsementApplied
        ? simpleFields.filter((f) => f.fieldName === ISLAMIC_ENDORSEMENT_APPLY_FIELD)
        : simpleFields;

    if (group.id === LICENSE_CATEGORY_GROUP_ID) {
      const fields = effectiveSimpleFields.filter((f) => f.fieldType === 'Boolean');
      const selectedFieldName =
        fields.find((f) => editingData?.[f.fieldName] === true)?.fieldName ||
        fields.find((f) => productsData?.[f.fieldName] === true)?.fieldName ||
        '';

        if (isEditing) {
          const handleSelect = (fieldName: string) => {
            const next: Record<string, boolean> = {};
            fields.forEach((f) => {
              next[f.fieldName] = f.fieldName === fieldName;
            });
            setEditingData(next);
          };

        return (
          <div className="space-y-4">
            <div className="space-y-2">
              {fields.map((field) => (
                <label key={field.id} className="flex items-center gap-2 text-sm text-gray-800">
                  <input
                    type="radio"
                    name="license-category"
                    className="h-4 w-4"
                    checked={selectedFieldName === field.fieldName}
                    onChange={() => handleSelect(field.fieldName)}
                    disabled={isReadOnly || updateMutation.isPending}
                  />
                  <span>{field.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleSaveGroup(group, editingData)}
                disabled={isReadOnly || updateMutation.isPending || !selectedFieldName}
                className="px-4 py-2 text-sm font-medium text-white rounded"
                style={{ backgroundColor: '#9b1823', opacity: updateMutation.isPending ? 0.7 : 1 }}
              >
                <span className="inline-flex items-center">
                  {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </span>
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={updateMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-gray-600 rounded border border-gray-300"
                style={{ opacity: updateMutation.isPending ? 0.7 : 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        );
      }

      const selectedLabel = fields.find((f) => f.fieldName === selectedFieldName)?.label || '-';
      return (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">
              Selected Category
            </label>
            <div className="flex-1 text-sm text-gray-900">{selectedLabel}</div>
          </div>
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
    }

    if (group.id === RESTRICTIONS_CONTROL_GROUP_ID) {
      const addFlagValue = isEditing ? editingData?.restriction_add_flag : productsData?.restriction_add_flag;
      const hasRestriction = addFlagValue === true;
      const restrictionType = normalizeRestrictionType(
        isEditing ? editingData?.restriction_type : productsData?.restriction_type
      );

      const getStandardSelection = (source: Record<string, any>) => {
        const selected = source?.restriction_standard_selection;
        if (Array.isArray(selected)) return selected as string[];
        return [];
      };

      const getCustomText = (source: Record<string, any>) => {
        const v = source?.restriction_custom_text;
        return typeof v === 'string' ? v : '';
      };

      const renderDisplayRow = (label: string, value: React.ReactNode) => (
        <div className="flex flex-col sm:flex-row sm:items-start gap-2">
          <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">{label}</label>
          <div className="flex-1 text-sm text-gray-900">{value}</div>
        </div>
      );

      if (!isEditing) {
        const selected = getStandardSelection(productsData);
        const standardField = simpleFields.find((f) => f.fieldName === 'restriction_standard_selection');
        const standardOptions = standardField?.options ?? RESTRICTION_STANDARD_OPTIONS;
        const selectedLabels = selected.map((v) => {
          const rawLabel = standardOptions.find((o) => o.value === v)?.label;
          if (typeof rawLabel !== 'string' || rawLabel.trim().length === 0) return v;
          const prefix = `${v} - `;
          if (rawLabel.startsWith(prefix)) {
            return `${v} — ${rawLabel.slice(prefix.length)}`;
          }
          return rawLabel;
        });

        const standardSelectionNode =
          selectedLabels.length > 0 ? (
            <ul className="space-y-1">
              {selectedLabels.map((line) => (
                <li key={line} className="text-sm text-gray-900">
                  {line}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-700">No standard restrictions selected.</div>
          );

        return (
          <div className="space-y-4">
            {renderDisplayRow('Do you want to add a Restriction?', addFlagValue === true ? 'Yes' : addFlagValue === false ? 'No' : '-')}
            {hasRestriction && renderDisplayRow('Standard or Non-standard Restriction?', restrictionType || '-')}
            {hasRestriction &&
              restrictionType === 'Standard' &&
              renderDisplayRow('Selected standard restrictions', standardSelectionNode)}
            {hasRestriction &&
              restrictionType === 'Non-standard' &&
              renderDisplayRow(
                'Please add the proposed non-standard Restriction',
                getCustomText(productsData).trim() ? getCustomText(productsData) : '-'
              )}

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
      }

      // Edit mode (custom)
      const selected = getStandardSelection(editingData);
      const customText = getCustomText(editingData);

      const setAddFlag = (next: boolean) => {
        setEditingData((prev) => {
          if (!next) {
            return {
              ...prev,
              restriction_add_flag: false,
              restriction_type: '',
              restriction_standard_selection: [],
              restriction_custom_text: '',
            };
          }
          return { ...prev, restriction_add_flag: true };
        });
      };

      const setRestrictionType = (next: string) => {
        const normalized = normalizeRestrictionType(next);
        setEditingData((prev) => {
          if (normalized === 'Standard') {
            return { ...prev, restriction_type: 'Standard', restriction_custom_text: '' };
          }
          if (normalized === 'Non-standard') {
            return { ...prev, restriction_type: 'Non-standard', restriction_standard_selection: [] };
          }
          return { ...prev, restriction_type: normalized };
        });
      };

      const toggleStandardCode = (code: string, checked: boolean) => {
        setEditingData((prev) => {
          const current: string[] = Array.isArray(prev.restriction_standard_selection)
            ? prev.restriction_standard_selection
            : [];
          const next = checked
            ? Array.from(new Set([...current, code]))
            : current.filter((v) => v !== code);
          return { ...prev, restriction_standard_selection: next };
        });
      };

      const handleSaveRestrictions = async () => {
        const currentAddFlag = editingData?.restriction_add_flag === true;
        const type = normalizeRestrictionType(editingData?.restriction_type);

        // IMPORTANT:
        // - The backend enforces group-scoped field allowlists for Products updates.
        // - restriction_custom_text belongs to a different group than restriction_add_flag/restriction_type.
        // - To keep a single Save action and still persist/clear conflicting values, send this update without _groupId.
        const payload: Record<string, any> = {};

        payload.restriction_add_flag = currentAddFlag;

        if (!currentAddFlag) {
          payload.restriction_type = '';
          payload.restriction_standard_selection = [];
          payload.restriction_custom_text = '';
        } else {
          payload.restriction_type = type;
          if (type === 'Standard') {
            payload.restriction_standard_selection = selected;
            payload.restriction_custom_text = '';
          } else if (type === 'Non-standard') {
            payload.restriction_standard_selection = [];
            payload.restriction_custom_text = customText;
          } else {
            payload.restriction_standard_selection = [];
            payload.restriction_custom_text = '';
          }
        }

        await updateMutation.mutateAsync(payload);
      };

      return (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">
              Do you want to add a Restriction?
            </label>
            <div className="flex-1">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingData?.restriction_add_flag === true}
                  onChange={(e) => setAddFlag(e.target.checked)}
                  disabled={isReadOnly || updateMutation.isPending}
                  className="h-4 w-4 text-red-800 focus:ring-red-800 rounded border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                />
              </label>
            </div>
          </div>

          {hasRestriction && (
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">
                Standard or Non-standard Restriction?
              </label>
              <div className="flex-1">
                <select
                  value={restrictionType}
                  onChange={(e) => setRestrictionType(e.target.value)}
                  disabled={isReadOnly || updateMutation.isPending}
                  className="w-full text-sm border rounded px-3 py-2 min-h-[44px] border-gray-300"
                >
                  <option value="">Select an option</option>
                  {RESTRICTION_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {hasRestriction && restrictionType === 'Standard' && (
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">
                Please select the standard Restriction(s) required
              </label>
              <div className="flex-1 space-y-2">
                {RESTRICTION_STANDARD_OPTIONS.map((opt) => {
                  const checked = selected.includes(opt.value);
                  return (
                    <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-red-800 focus:ring-red-800 rounded border-gray-300"
                        checked={checked}
                        disabled={isReadOnly || updateMutation.isPending}
                        onChange={(e) => toggleStandardCode(opt.value, e.target.checked)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {hasRestriction && restrictionType === 'Non-standard' && (
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">
                Please add the proposed non-standard Restriction
              </label>
              <div className="flex-1">
                <textarea
                  value={customText}
                  onChange={(e) =>
                    setEditingData((prev) => ({ ...prev, restriction_custom_text: e.target.value }))
                  }
                  disabled={isReadOnly || updateMutation.isPending}
                  placeholder="Enter the proposed restriction"
                  className="w-full text-sm border rounded px-3 py-2 min-h-[120px] border-gray-300"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSaveRestrictions}
              disabled={isReadOnly || updateMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white rounded"
              style={{ backgroundColor: '#9b1823', opacity: updateMutation.isPending ? 0.7 : 1 }}
            >
              <span className="inline-flex items-center">
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {updateMutation.isPending ? 'Saving...' : 'Save'}
              </span>
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={updateMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-gray-600 rounded border border-gray-300"
              style={{ opacity: updateMutation.isPending ? 0.7 : 1 }}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (group.id === CONDITIONS_CONTROL_GROUP_ID) {
      const addFlagValue = isEditing ? editingData?.condition_add_flag : productsData?.condition_add_flag;
      const hasCondition = addFlagValue === true;
      const conditionType = normalizeConditionType(isEditing ? editingData?.condition_type : productsData?.condition_type);

      const getStandardSelection = (source: Record<string, any>) => {
        const selected = source?.condition_standard_selection;
        if (Array.isArray(selected)) return selected as string[];
        return [];
      };

      const getCustomText = (source: Record<string, any>) => {
        const v = source?.condition_custom_text;
        return typeof v === 'string' ? v : '';
      };

      const renderDisplayRow = (label: string, value: React.ReactNode) => (
        <div className="flex flex-col sm:flex-row sm:items-start gap-2">
          <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">{label}</label>
          <div className="flex-1 text-sm text-gray-900">{value}</div>
        </div>
      );

      const standardField = effectiveSimpleFields.find((f) => f.fieldName === 'condition_standard_selection');
      const standardOptions = standardField?.options ?? [];

      if (!isEditing) {
        const selected = getStandardSelection(productsData);
        const selectedLabels =
          standardOptions.length > 0
            ? selected
                .map((v) => standardOptions.find((o) => o.value === v)?.label ?? v)
                .filter(Boolean)
            : selected;

        const dependentValue =
          hasCondition && conditionType === 'Standard'
            ? selectedLabels.length > 0
              ? selectedLabels.join(', ')
              : '-'
            : hasCondition && conditionType === 'Non-standard'
              ? (getCustomText(productsData).trim() ? getCustomText(productsData) : '-')
              : null;

        return (
          <div className="space-y-4">
            {renderDisplayRow(
              'Do you want to add a Condition?',
              addFlagValue === true ? 'Yes' : addFlagValue === false ? 'No' : '-'
            )}
            {hasCondition && renderDisplayRow('Standard or Non-standard Condition?', conditionType || '-')}
            {dependentValue !== null &&
              renderDisplayRow(
                conditionType === 'Standard'
                  ? 'Please select the standard Condition(s) required'
                  : 'Please add the proposed non-standard Condition',
                dependentValue
              )}

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
      }

      const selected = getStandardSelection(editingData);
      const customText = getCustomText(editingData);

      const setAddFlag = (next: boolean) => {
        setEditingData((prev) => {
          if (!next) {
            return {
              ...prev,
              condition_add_flag: false,
              condition_type: '',
              condition_standard_selection: [],
              condition_custom_text: '',
            };
          }
          return { ...prev, condition_add_flag: true };
        });
      };

      const setConditionType = (next: string) => {
        const normalized = normalizeConditionType(next);
        setEditingData((prev) => {
          if (normalized === 'Standard') {
            return { ...prev, condition_type: 'Standard', condition_custom_text: '' };
          }
          if (normalized === 'Non-standard') {
            return { ...prev, condition_type: 'Non-standard', condition_standard_selection: [] };
          }
          return { ...prev, condition_type: normalized };
        });
      };

      const toggleStandardValue = (value: string, checked: boolean) => {
        setEditingData((prev) => {
          const current: string[] = Array.isArray(prev.condition_standard_selection)
            ? prev.condition_standard_selection
            : [];
          const next = checked
            ? Array.from(new Set([...current, value]))
            : current.filter((v) => v !== value);
          return { ...prev, condition_standard_selection: next };
        });
      };

      const handleSaveConditions = async () => {
        const currentAddFlag = editingData?.condition_add_flag === true;
        const type = normalizeConditionType(editingData?.condition_type);

        // IMPORTANT:
        // - The backend enforces group-scoped field allowlists for Products updates.
        // - condition_custom_text belongs to a different group than condition_add_flag/condition_type.
        // - To keep a single Save action and still persist/clear conflicting values, send this update without _groupId.
        const payload: Record<string, any> = {};

        payload.condition_add_flag = currentAddFlag;

        if (!currentAddFlag) {
          payload.condition_type = '';
          payload.condition_standard_selection = [];
          payload.condition_custom_text = '';
        } else {
          payload.condition_type = type;
          if (type === 'Standard') {
            payload.condition_standard_selection = selected;
            payload.condition_custom_text = '';
          } else if (type === 'Non-standard') {
            payload.condition_standard_selection = [];
            payload.condition_custom_text = customText;
          } else {
            payload.condition_standard_selection = [];
            payload.condition_custom_text = '';
          }
        }

        await updateMutation.mutateAsync(payload);
      };

      const setFreeformLines = (text: string) => {
        const lines = text
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
        setEditingData((prev) => ({ ...prev, condition_standard_selection: lines }));
      };

      return (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">Do you want to add a Condition?</label>
            <div className="flex-1">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingData?.condition_add_flag === true}
                  onChange={(e) => setAddFlag(e.target.checked)}
                  disabled={isReadOnly || updateMutation.isPending}
                  className="h-4 w-4 text-red-800 focus:ring-red-800 rounded border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                />
              </label>
            </div>
          </div>

          {hasCondition && (
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">
                Standard or Non-standard Condition?
              </label>
              <div className="flex-1">
                <select
                  value={conditionType}
                  onChange={(e) => setConditionType(e.target.value)}
                  disabled={isReadOnly || updateMutation.isPending}
                  className="w-full text-sm border rounded px-3 py-2 min-h-[44px] border-gray-300"
                >
                  <option value="">Select an option</option>
                  {CONDITION_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {hasCondition && conditionType === 'Standard' && (
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">
                Please select the standard Condition(s) required
              </label>
              <div className="flex-1">
                {standardOptions.length > 0 ? (
                  <div className="space-y-2">
                    {standardOptions.map((opt) => {
                      const checked = selected.includes(opt.value);
                      return (
                        <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-red-800 focus:ring-red-800 rounded border-gray-300"
                            checked={checked}
                            disabled={isReadOnly || updateMutation.isPending}
                            onChange={(e) => toggleStandardValue(opt.value, e.target.checked)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    value={selected.join('\n')}
                    onChange={(e) => setFreeformLines(e.target.value)}
                    disabled={isReadOnly || updateMutation.isPending}
                    placeholder="Enter one value per line"
                    className="w-full text-sm border rounded px-3 py-2 min-h-[96px] border-gray-300"
                  />
                )}
              </div>
            </div>
          )}

          {hasCondition && conditionType === 'Non-standard' && (
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <label className="text-sm font-medium text-gray-700 sm:w-1/3 sm:pt-2">
                Please add the proposed non-standard Condition
              </label>
              <div className="flex-1">
                <textarea
                  value={customText}
                  onChange={(e) => setEditingData((prev) => ({ ...prev, condition_custom_text: e.target.value }))}
                  disabled={isReadOnly || updateMutation.isPending}
                  placeholder="Enter the proposed condition"
                  className="w-full text-sm border rounded px-3 py-2 min-h-[120px] border-gray-300"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSaveConditions}
              disabled={isReadOnly || updateMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white rounded"
              style={{ backgroundColor: '#9b1823', opacity: updateMutation.isPending ? 0.7 : 1 }}
            >
              <span className="inline-flex items-center">
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {updateMutation.isPending ? 'Saving...' : 'Save'}
              </span>
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={updateMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-gray-600 rounded border border-gray-300"
              style={{ opacity: updateMutation.isPending ? 0.7 : 1 }}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (isEditing) {
      return (
        <ProfileSectionForm
          groups={[{ ...group, fields: effectiveSimpleFields }]}
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
        {effectiveSimpleFields.map((field) => {
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
    const isSavingThisMatrix = updateMutation.isPending && savingMatrixFieldName === field.fieldName;
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
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span>— Not answered</span>
            <span>Yes Selected</span>
            <span>No Explicitly not selected</span>
          </div>
          <div className="mt-1 text-gray-600">
            Selections represent regulatory permissions under the selected license category.
          </div>
        </div>
        <div className={isSavingThisMatrix ? 'opacity-70 pointer-events-none' : undefined} aria-busy={isSavingThisMatrix}>
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
        </div>
        {!isReadOnly && (
          <div className="flex gap-2">
            {canEdit ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSaveMatrix(group, field)}
                  disabled={isSavingThisMatrix}
                  className="px-4 py-2 text-sm font-medium text-white rounded"
                  style={{ backgroundColor: '#9b1823', opacity: isSavingThisMatrix ? 0.7 : 1 }}
                >
                  <span className="inline-flex items-center">
                    {isSavingThisMatrix && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSavingThisMatrix ? 'Saving...' : 'Save'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSavingThisMatrix}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded border border-gray-300"
                  style={{ opacity: isSavingThisMatrix ? 0.7 : 1 }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  requestEditMatrix(blockId, field.fieldName, currentValue);
                }}
                disabled={updateMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white rounded"
                style={{ backgroundColor: '#9b1823', opacity: updateMutation.isPending ? 0.7 : 1 }}
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
      <AlertDialog
        open={unsavedLicenseDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setUnsavedLicenseDialogOpen(false);
            setPendingMatrixEdit(null);
            setResolvingUnsavedLicenseDialog(false);
          }
        }}
      >
        <AlertDialogContent className="bg-white text-slate-900 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved License Category selections. Save them before editing the matrix?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={resolvingUnsavedLicenseDialog || updateMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnsavedLicenseDialogDiscardAndContinue}
              disabled={resolvingUnsavedLicenseDialog || updateMutation.isPending || !pendingMatrixEdit}
              className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Discard & Continue
            </AlertDialogAction>
            <AlertDialogAction
              onClick={handleUnsavedLicenseDialogSaveAndContinue}
              disabled={resolvingUnsavedLicenseDialog || updateMutation.isPending || !pendingMatrixEdit}
              className="text-white"
              style={{ backgroundColor: '#9b1823', opacity: resolvingUnsavedLicenseDialog ? 0.7 : 1 }}
            >
              <span className="inline-flex items-center">
                {resolvingUnsavedLicenseDialog && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save & Continue
              </span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sections Accordion */}
      <ProfileAccordion
        sections={sectionsForAccordion}
        defaultExpandedIndex={0}
      >
        {(_section, sectionIndex) => {
          const sectionData = visibleGroupsBySection[sectionIndex];
          if (!sectionData) return null;

          if (sectionData.name === 'License Category') {
            const licenseGroup = sectionData.groups.find((g) => g.id === LICENSE_CATEGORY_GROUP_ID);
            const licenseFields = (licenseGroup?.fields || []).filter(
              (f) => !f.hidden && !f.readOnly && isVisible(f.visibility as VisibilityRule, visibilityAnswers)
            );

            return (
              <div className="space-y-4">
                <div className="flex gap-2 border-b border-gray-200" role="tablist" aria-label="License Category">
                  <button
                    key="category-selection"
                    type="button"
                    className={`px-3 py-2 text-sm font-medium rounded-t ${
                      activeLicenseSubTab === 'categorySelection'
                        ? 'bg-white border border-b-0 border-gray-200 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    style={
                      activeLicenseSubTab === 'categorySelection'
                        ? { borderTopColor: '#9b1823', borderTopWidth: 2 }
                        : undefined
                    }
                    onClick={() => setActiveLicenseSubTab('categorySelection')}
                    role="tab"
                    aria-selected={activeLicenseSubTab === 'categorySelection'}
                  >
                    Category Selection
                  </button>

                  {visibleUnifiedMatrixTab && (
                    <button
                      key={visibleUnifiedMatrixTab.matrixFieldName}
                      type="button"
                      className={`px-3 py-2 text-sm font-medium rounded-t ${
                        activeLicenseSubTab === visibleUnifiedMatrixTab.subTabId
                          ? 'bg-white border border-b-0 border-gray-200 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      style={
                        activeLicenseSubTab === visibleUnifiedMatrixTab.subTabId
                          ? { borderTopColor: '#9b1823', borderTopWidth: 2 }
                          : undefined
                      }
                      onClick={() => setActiveLicenseSubTab(visibleUnifiedMatrixTab.subTabId)}
                      role="tab"
                      aria-selected={activeLicenseSubTab === visibleUnifiedMatrixTab.subTabId}
                    >
                      {visibleUnifiedMatrixTab.tabLabel}
                    </button>
                  )}
                </div>

                {activeLicenseSubTab === 'categorySelection' && licenseGroup && (
                  <div className="space-y-4">
                    <div className="text-base font-semibold text-gray-900">{licenseGroup.groupName}</div>
                    {renderSimpleBlock({ ...licenseGroup, fields: licenseFields }, licenseFields)}
                  </div>
                )}

                {visibleUnifiedMatrixTab && activeLicenseSubTab === visibleUnifiedMatrixTab.subTabId && (
                  <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    {renderMatrixBlock(visibleUnifiedMatrixTab.group, visibleUnifiedMatrixTab.field)}
                  </div>
                )}
              </div>
            );
          }

          const renderGroups = sectionData.groups
            .filter((group) => isVisible(group.visibility as VisibilityRule, productsData))
            .flatMap((group) => {
              const fieldVisibility = (field: FieldConfig) => isVisible(field.visibility as VisibilityRule, productsData);
              
              const matrixFields: FieldConfig[] = [];

              // Filter simple fields, but hide old boolean lists when unified matrix is present
              const simpleFields = group.fields.filter((f) => {
                if (f.uiBlockType === 'matrixAccordion' || 
                    (typeof f.fieldType === 'string' && f.fieldType.toLowerCase() === 'matrix')) {
                  return false;
                }
                if (!fieldVisibility(f) || f.hidden) return false;

                return true;
              });

              const blocks: Array<{ type: 'simple' | 'matrix'; key: string; group: GroupConfig; field?: FieldConfig; fields?: FieldConfig[] }> = [];
              if (simpleFields.length > 0) {
                blocks.push({ type: 'simple', key: `${group.id}-simple`, group: { ...group, fields: simpleFields }, fields: simpleFields });
              }
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
