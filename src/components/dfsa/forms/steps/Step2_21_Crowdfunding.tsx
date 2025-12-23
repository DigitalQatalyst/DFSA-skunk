/**
 * DFSA Step 2-21: Crowdfunding
 *
 * Activity-specific step for crowdfunding platform operations
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Users, Shield, FileText, Target } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_21Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Crowdfunding types
const CROWDFUNDING_TYPES = [
  { value: 'investment', label: 'Investment-based Crowdfunding' },
  { value: 'loan', label: 'Loan-based Crowdfunding' },
  { value: 'property', label: 'Property Crowdfunding' },
  { value: 'mixed', label: 'Mixed Model' }
];

// Investor categories
const INVESTOR_CATEGORIES = [
  { id: 'retail', label: 'Retail Investors' },
  { id: 'professional', label: 'Professional Investors' },
  { id: 'high_net_worth', label: 'High Net Worth Individuals' },
  { id: 'institutional', label: 'Institutional Investors' }
];

// Issuer types
const ISSUER_TYPES = [
  { id: 'startups', label: 'Startups' },
  { id: 'sme', label: 'SMEs' },
  { id: 'real_estate', label: 'Real Estate Projects' },
  { id: 'social_enterprise', label: 'Social Enterprises' },
  { id: 'established', label: 'Established Companies' }
];

export const Step2_21_Crowdfunding: React.FC<Step2_21Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  const crowdfundingData = (formData as any).crowdfunding || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      crowdfunding: {
        ...crowdfundingData,
        [field]: value
      }
    } as any);
  };

  const handleToggle = (field: string, itemId: string, checked: boolean) => {
    const currentItems = crowdfundingData[field] || [];
    const updatedItems = checked
      ? [...currentItems, itemId]
      : currentItems.filter((i: string) => i !== itemId);
    handleFieldChange(field, updatedItems);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This section collects information about your crowdfunding platform operations.
          Crowdfunding platforms are subject to specific investor protection requirements.
        </AlertDescription>
      </Alert>

      {/* Platform Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Platform Type & Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="crowdfundingType"
            label="Type of Crowdfunding"
            value={crowdfundingData.crowdfundingType || ''}
            onChange={(value) => handleFieldChange('crowdfundingType', value)}
            options={CROWDFUNDING_TYPES}
            required
            error={errors['crowdfunding.crowdfundingType']}
            placeholder="Select crowdfunding type"
            disabled={isReadOnly}
          />

          <FormTextArea
            id="platformDescription"
            label="Platform Description"
            value={crowdfundingData.platformDescription || ''}
            onChange={(value) => handleFieldChange('platformDescription', value)}
            required
            placeholder="Describe your crowdfunding platform and business model..."
            rows={4}
            error={errors['crowdfunding.platformDescription']}
            disabled={isReadOnly}
          />

          <FormInput
            id="platformName"
            label="Platform Name/Brand"
            value={crowdfundingData.platformName || ''}
            onChange={(value) => handleFieldChange('platformName', value)}
            placeholder="Enter platform name"
            error={errors['crowdfunding.platformName']}
            disabled={isReadOnly}
          />

          <FormInput
            id="platformUrl"
            label="Platform Website URL"
            value={crowdfundingData.platformUrl || ''}
            onChange={(value) => handleFieldChange('platformUrl', value)}
            placeholder="Enter website URL"
            error={errors['crowdfunding.platformUrl']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Investors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Target Investors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the investor categories you will accept:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INVESTOR_CATEGORIES.map((category) => (
              <FormCheckbox
                key={category.id}
                id={`investor_${category.id}`}
                label={category.label}
                checked={(crowdfundingData.investorCategories || []).includes(category.id)}
                onChange={(checked) => handleToggle('investorCategories', category.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          <FormInput
            id="minimumInvestment"
            label="Minimum Investment Amount (USD)"
            value={crowdfundingData.minimumInvestment || ''}
            onChange={(value) => handleFieldChange('minimumInvestment', value)}
            placeholder="Enter minimum investment"
            error={errors['crowdfunding.minimumInvestment']}
            disabled={isReadOnly}
          />

          <FormInput
            id="maximumInvestment"
            label="Maximum Investment per Retail Investor (USD)"
            value={crowdfundingData.maximumInvestment || ''}
            onChange={(value) => handleFieldChange('maximumInvestment', value)}
            placeholder="Enter maximum investment limit"
            error={errors['crowdfunding.maximumInvestment']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Issuers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Target Issuers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the types of issuers you will accept on the platform:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ISSUER_TYPES.map((issuer) => (
              <FormCheckbox
                key={issuer.id}
                id={`issuer_${issuer.id}`}
                label={issuer.label}
                checked={(crowdfundingData.issuerTypes || []).includes(issuer.id)}
                onChange={(checked) => handleToggle('issuerTypes', issuer.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          <FormInput
            id="maxOfferingSize"
            label="Maximum Offering Size (USD)"
            value={crowdfundingData.maxOfferingSize || ''}
            onChange={(value) => handleFieldChange('maxOfferingSize', value)}
            placeholder="Enter maximum offering size"
            error={errors['crowdfunding.maxOfferingSize']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="issuerDueDiligence"
            label="Issuer Due Diligence Process"
            value={crowdfundingData.issuerDueDiligence || ''}
            onChange={(value) => handleFieldChange('issuerDueDiligence', value)}
            required
            placeholder="Describe your due diligence process for issuers..."
            rows={4}
            error={errors['crowdfunding.issuerDueDiligence']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Investor Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Investor Protection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="hasInvestorAssessment"
            label="Investor appropriateness assessments will be conducted"
            checked={crowdfundingData.hasInvestorAssessment || false}
            onChange={(checked) => handleFieldChange('hasInvestorAssessment', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasCoolingOffPeriod"
            label="A cooling-off period will be provided to investors"
            checked={crowdfundingData.hasCoolingOffPeriod || false}
            onChange={(checked) => handleFieldChange('hasCoolingOffPeriod', checked)}
            disabled={isReadOnly}
          />

          {crowdfundingData.hasCoolingOffPeriod && (
            <FormInput
              id="coolingOffDays"
              label="Cooling-off Period (Days)"
              value={crowdfundingData.coolingOffDays || ''}
              onChange={(value) => handleFieldChange('coolingOffDays', value)}
              type="number"
              placeholder="Enter number of days"
              error={errors['crowdfunding.coolingOffDays']}
              disabled={isReadOnly}
            />
          )}

          <FormCheckbox
            id="hasRiskDisclosures"
            label="Clear risk disclosures will be provided for each offering"
            checked={crowdfundingData.hasRiskDisclosures || false}
            onChange={(checked) => handleFieldChange('hasRiskDisclosures', checked)}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="investorProtectionMeasures"
            label="Investor Protection Measures"
            value={crowdfundingData.investorProtectionMeasures || ''}
            onChange={(value) => handleFieldChange('investorProtectionMeasures', value)}
            placeholder="Describe additional investor protection measures..."
            rows={3}
            error={errors['crowdfunding.investorProtectionMeasures']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasClientMoneyArrangements"
            label="Client money will be held in segregated accounts"
            checked={crowdfundingData.hasClientMoneyArrangements || false}
            onChange={(checked) => handleFieldChange('hasClientMoneyArrangements', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="confirmCrowdfundingCompliance"
            label="I confirm that the platform will comply with DFSA Crowdfunding Rules"
            checked={crowdfundingData.confirmCrowdfundingCompliance || false}
            onChange={(checked) => handleFieldChange('confirmCrowdfundingCompliance', checked)}
            required
            error={errors['crowdfunding.confirmCrowdfundingCompliance']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
