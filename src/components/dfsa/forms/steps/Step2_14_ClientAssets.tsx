/**
 * DFSA Step 2-14: Client Assets
 *
 * Activity-specific step for client assets/custody activities
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Lock, Building2, Shield, FileText } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_14Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Asset types for custody
const CUSTODY_ASSET_TYPES = [
  { id: 'equities', label: 'Equities' },
  { id: 'fixed_income', label: 'Fixed Income Securities' },
  { id: 'funds', label: 'Fund Units' },
  { id: 'derivatives', label: 'Derivatives' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'cash', label: 'Cash/Money' },
  { id: 'crypto', label: 'Crypto Assets' }
];

// Custody models
const CUSTODY_MODELS = [
  { value: 'direct', label: 'Direct Custody' },
  { value: 'sub_custody', label: 'Sub-Custody Arrangements' },
  { value: 'global_custodian', label: 'Global Custodian Network' },
  { value: 'hybrid', label: 'Hybrid Model' }
];

// Segregation methods
const SEGREGATION_METHODS = [
  { value: 'individual', label: 'Individual Client Segregation' },
  { value: 'omnibus', label: 'Omnibus Account with Records' },
  { value: 'mixed', label: 'Mixed Approach' }
];

export const Step2_14_ClientAssets: React.FC<Step2_14Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  const clientAssetsData = (formData as any).clientAssets || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      clientAssets: {
        ...clientAssetsData,
        [field]: value
      }
    } as any);
  };

  const handleAssetToggle = (assetId: string, checked: boolean) => {
    const currentAssets = clientAssetsData.assetTypes || [];
    const updatedAssets = checked
      ? [...currentAssets, assetId]
      : currentAssets.filter((a: string) => a !== assetId);
    handleFieldChange('assetTypes', updatedAssets);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This section collects information about your client asset custody arrangements.
          Holding client assets requires robust safeguarding and segregation procedures.
        </AlertDescription>
      </Alert>

      {/* Asset Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Asset Types in Custody
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the types of assets you will hold in custody:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CUSTODY_ASSET_TYPES.map((asset) => (
              <FormCheckbox
                key={asset.id}
                id={`asset_${asset.id}`}
                label={asset.label}
                checked={(clientAssetsData.assetTypes || []).includes(asset.id)}
                onChange={(checked) => handleAssetToggle(asset.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          <FormInput
            id="expectedAUC"
            label="Expected Assets Under Custody Year 1 (USD)"
            value={clientAssetsData.expectedAUC || ''}
            onChange={(value) => handleFieldChange('expectedAUC', value)}
            placeholder="Enter expected AUC"
            error={errors['clientAssets.expectedAUC']}
            disabled={isReadOnly}
          />

          <FormInput
            id="expectedClientCount"
            label="Expected Number of Custody Clients"
            value={clientAssetsData.expectedClientCount || ''}
            onChange={(value) => handleFieldChange('expectedClientCount', value)}
            type="number"
            placeholder="Enter expected client count"
            error={errors['clientAssets.expectedClientCount']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Custody Model */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Custody Model & Arrangements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="custodyModel"
            label="Custody Model"
            value={clientAssetsData.custodyModel || ''}
            onChange={(value) => handleFieldChange('custodyModel', value)}
            options={CUSTODY_MODELS}
            required
            error={errors['clientAssets.custodyModel']}
            placeholder="Select custody model"
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="usesSubCustodians"
            label="Will use sub-custodians"
            checked={clientAssetsData.usesSubCustodians || false}
            onChange={(checked) => handleFieldChange('usesSubCustodians', checked)}
            disabled={isReadOnly}
          />

          {clientAssetsData.usesSubCustodians && (
            <>
              <FormInput
                id="subCustodians"
                label="Sub-Custodian Names"
                value={clientAssetsData.subCustodians || ''}
                onChange={(value) => handleFieldChange('subCustodians', value)}
                placeholder="List sub-custodians"
                error={errors['clientAssets.subCustodians']}
                disabled={isReadOnly}
              />

              <FormTextArea
                id="subCustodianDueDiligence"
                label="Sub-Custodian Due Diligence Process"
                value={clientAssetsData.subCustodianDueDiligence || ''}
                onChange={(value) => handleFieldChange('subCustodianDueDiligence', value)}
                placeholder="Describe your due diligence process for sub-custodians..."
                rows={3}
                error={errors['clientAssets.subCustodianDueDiligence']}
                disabled={isReadOnly}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Segregation & Safeguarding */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segregation & Safeguarding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="segregationMethod"
            label="Asset Segregation Method"
            value={clientAssetsData.segregationMethod || ''}
            onChange={(value) => handleFieldChange('segregationMethod', value)}
            options={SEGREGATION_METHODS}
            required
            error={errors['clientAssets.segregationMethod']}
            placeholder="Select segregation method"
            disabled={isReadOnly}
          />

          <FormTextArea
            id="segregationProcedures"
            label="Segregation Procedures"
            value={clientAssetsData.segregationProcedures || ''}
            onChange={(value) => handleFieldChange('segregationProcedures', value)}
            required
            placeholder="Describe how client assets will be segregated from firm assets..."
            rows={4}
            error={errors['clientAssets.segregationProcedures']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasReconciliation"
            label="Regular reconciliation of client assets is performed"
            checked={clientAssetsData.hasReconciliation || false}
            onChange={(checked) => handleFieldChange('hasReconciliation', checked)}
            disabled={isReadOnly}
          />

          <FormInput
            id="reconciliationFrequency"
            label="Reconciliation Frequency"
            value={clientAssetsData.reconciliationFrequency || ''}
            onChange={(value) => handleFieldChange('reconciliationFrequency', value)}
            placeholder="e.g., Daily, Weekly"
            error={errors['clientAssets.reconciliationFrequency']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasClientAssetInsurance"
            label="Insurance coverage for client assets is in place"
            checked={clientAssetsData.hasClientAssetInsurance || false}
            onChange={(checked) => handleFieldChange('hasClientAssetInsurance', checked)}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Reporting & Records */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Reporting & Record Keeping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="clientReportingFrequency"
            label="Client Reporting Frequency"
            value={clientAssetsData.clientReportingFrequency || ''}
            onChange={(value) => handleFieldChange('clientReportingFrequency', value)}
            placeholder="e.g., Monthly, Quarterly"
            error={errors['clientAssets.clientReportingFrequency']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasOnlineAccess"
            label="Clients will have online access to view their holdings"
            checked={clientAssetsData.hasOnlineAccess || false}
            onChange={(checked) => handleFieldChange('hasOnlineAccess', checked)}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="recordKeepingProcedures"
            label="Record Keeping Procedures"
            value={clientAssetsData.recordKeepingProcedures || ''}
            onChange={(value) => handleFieldChange('recordKeepingProcedures', value)}
            placeholder="Describe your record keeping procedures for client assets..."
            rows={3}
            error={errors['clientAssets.recordKeepingProcedures']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="confirmClientAssetCompliance"
            label="I confirm that client assets will be held in accordance with DFSA Client Asset Rules"
            checked={clientAssetsData.confirmClientAssetCompliance || false}
            onChange={(checked) => handleFieldChange('confirmClientAssetCompliance', checked)}
            required
            error={errors['clientAssets.confirmClientAssetCompliance']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
