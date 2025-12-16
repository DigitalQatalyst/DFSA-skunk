/**
 * DFSA Step 2-6: Asset Management
 *
 * Activity-specific step for asset management activities
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, TrendingUp, Target, Shield, BarChart3 } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_6Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Asset classes
const ASSET_CLASSES = [
  { id: 'equities', label: 'Equities' },
  { id: 'fixed_income', label: 'Fixed Income' },
  { id: 'money_market', label: 'Money Market' },
  { id: 'real_estate', label: 'Real Estate' },
  { id: 'private_equity', label: 'Private Equity' },
  { id: 'hedge_funds', label: 'Hedge Funds' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'derivatives', label: 'Derivatives' },
  { id: 'structured_products', label: 'Structured Products' },
  { id: 'alternative', label: 'Alternative Investments' }
];

// Management styles
const MANAGEMENT_STYLES = [
  { value: 'discretionary', label: 'Discretionary Management' },
  { value: 'advisory', label: 'Advisory/Non-Discretionary' },
  { value: 'both', label: 'Both Discretionary and Advisory' }
];

// Investment approaches
const INVESTMENT_APPROACHES = [
  { value: 'active', label: 'Active Management' },
  { value: 'passive', label: 'Passive/Index Tracking' },
  { value: 'quantitative', label: 'Quantitative/Systematic' },
  { value: 'fundamental', label: 'Fundamental Analysis' },
  { value: 'mixed', label: 'Mixed Approach' }
];

export const Step2_6_AssetManagement: React.FC<Step2_6Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  const assetMgmtData = (formData as any).assetManagement || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      assetManagement: {
        ...assetMgmtData,
        [field]: value
      }
    } as any);
  };

  const handleAssetClassToggle = (classId: string, checked: boolean) => {
    const currentClasses = assetMgmtData.assetClasses || [];
    const updatedClasses = checked
      ? [...currentClasses, classId]
      : currentClasses.filter((c: string) => c !== classId);
    handleFieldChange('assetClasses', updatedClasses);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This section collects information about your asset management activities.
          Please provide details about your investment approach and target assets under management.
        </AlertDescription>
      </Alert>

      {/* Management Style */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Management Style & Approach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="managementStyle"
            label="Management Style"
            value={assetMgmtData.managementStyle || ''}
            onChange={(value) => handleFieldChange('managementStyle', value)}
            options={MANAGEMENT_STYLES}
            required
            error={errors['assetManagement.managementStyle']}
            placeholder="Select management style"
            disabled={isReadOnly}
          />

          <FormSelect
            id="investmentApproach"
            label="Investment Approach"
            value={assetMgmtData.investmentApproach || ''}
            onChange={(value) => handleFieldChange('investmentApproach', value)}
            options={INVESTMENT_APPROACHES}
            required
            error={errors['assetManagement.investmentApproach']}
            placeholder="Select investment approach"
            disabled={isReadOnly}
          />

          <FormTextArea
            id="investmentPhilosophy"
            label="Investment Philosophy"
            value={assetMgmtData.investmentPhilosophy || ''}
            onChange={(value) => handleFieldChange('investmentPhilosophy', value)}
            placeholder="Describe your investment philosophy and process..."
            rows={4}
            error={errors['assetManagement.investmentPhilosophy']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Asset Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Asset Classes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the asset classes you will manage:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ASSET_CLASSES.map((assetClass) => (
              <FormCheckbox
                key={assetClass.id}
                id={`asset_${assetClass.id}`}
                label={assetClass.label}
                checked={(assetMgmtData.assetClasses || []).includes(assetClass.id)}
                onChange={(checked) => handleAssetClassToggle(assetClass.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AUM & Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Assets Under Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="currentAUM"
            label="Current AUM (USD)"
            value={assetMgmtData.currentAUM || ''}
            onChange={(value) => handleFieldChange('currentAUM', value)}
            placeholder="Enter current AUM"
            error={errors['assetManagement.currentAUM']}
            disabled={isReadOnly}
          />

          <FormInput
            id="targetAUM"
            label="Target AUM Year 1 (USD)"
            value={assetMgmtData.targetAUM || ''}
            onChange={(value) => handleFieldChange('targetAUM', value)}
            placeholder="Enter target AUM"
            error={errors['assetManagement.targetAUM']}
            disabled={isReadOnly}
          />

          <FormInput
            id="minimumAccountSize"
            label="Minimum Account Size (USD)"
            value={assetMgmtData.minimumAccountSize || ''}
            onChange={(value) => handleFieldChange('minimumAccountSize', value)}
            placeholder="Enter minimum account size"
            error={errors['assetManagement.minimumAccountSize']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Risk Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            id="riskManagementProcess"
            label="Risk Management Process"
            value={assetMgmtData.riskManagementProcess || ''}
            onChange={(value) => handleFieldChange('riskManagementProcess', value)}
            placeholder="Describe your risk management process..."
            rows={4}
            error={errors['assetManagement.riskManagementProcess']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasRiskCommittee"
            label="The firm has a dedicated Risk Committee"
            checked={assetMgmtData.hasRiskCommittee || false}
            onChange={(checked) => handleFieldChange('hasRiskCommittee', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="usesDerivatives"
            label="Will use derivatives for hedging or investment purposes"
            checked={assetMgmtData.usesDerivatives || false}
            onChange={(checked) => handleFieldChange('usesDerivatives', checked)}
            disabled={isReadOnly}
          />

          {assetMgmtData.usesDerivatives && (
            <FormTextArea
              id="derivativesPolicy"
              label="Derivatives Usage Policy"
              value={assetMgmtData.derivativesPolicy || ''}
              onChange={(value) => handleFieldChange('derivativesPolicy', value)}
              placeholder="Describe how derivatives will be used..."
              rows={3}
              error={errors['assetManagement.derivativesPolicy']}
              disabled={isReadOnly}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
