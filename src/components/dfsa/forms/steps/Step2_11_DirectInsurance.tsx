/**
 * DFSA Step 2-11: Direct Insurance
 *
 * Activity-specific step for direct insurance business
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Shield, Users, BarChart3, FileText } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_11Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Insurance business types
const INSURANCE_BUSINESS_TYPES = [
  { value: 'general', label: 'General Insurance' },
  { value: 'life', label: 'Life Insurance' },
  { value: 'both', label: 'Both General and Life' },
  { value: 'reinsurance', label: 'Reinsurance' }
];

// Insurance classes for general
const GENERAL_INSURANCE_CLASSES = [
  { id: 'property', label: 'Property' },
  { id: 'liability', label: 'Liability' },
  { id: 'motor', label: 'Motor' },
  { id: 'marine', label: 'Marine' },
  { id: 'aviation', label: 'Aviation' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'miscellaneous', label: 'Miscellaneous' }
];

// Insurance classes for life
const LIFE_INSURANCE_CLASSES = [
  { id: 'term_life', label: 'Term Life' },
  { id: 'whole_life', label: 'Whole Life' },
  { id: 'endowment', label: 'Endowment' },
  { id: 'annuities', label: 'Annuities' },
  { id: 'unit_linked', label: 'Unit-Linked' },
  { id: 'group_life', label: 'Group Life' }
];

export const Step2_11_DirectInsurance: React.FC<Step2_11Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  const insuranceData = (formData as any).directInsurance || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      directInsurance: {
        ...insuranceData,
        [field]: value
      }
    } as any);
  };

  const handleClassToggle = (classType: 'general' | 'life', classId: string, checked: boolean) => {
    const fieldName = classType === 'general' ? 'generalClasses' : 'lifeClasses';
    const currentClasses = insuranceData[fieldName] || [];
    const updatedClasses = checked
      ? [...currentClasses, classId]
      : currentClasses.filter((c: string) => c !== classId);
    handleFieldChange(fieldName, updatedClasses);
  };

  const showGeneralClasses = insuranceData.businessType === 'general' || insuranceData.businessType === 'both';
  const showLifeClasses = insuranceData.businessType === 'life' || insuranceData.businessType === 'both';

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This section collects information about your direct insurance business.
          Please provide details about the classes of insurance you intend to underwrite.
        </AlertDescription>
      </Alert>

      {/* Business Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Insurance Business Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="businessType"
            label="Type of Insurance Business"
            value={insuranceData.businessType || ''}
            onChange={(value) => handleFieldChange('businessType', value)}
            options={INSURANCE_BUSINESS_TYPES}
            required
            error={errors['directInsurance.businessType']}
            placeholder="Select business type"
            disabled={isReadOnly}
          />

          {showGeneralClasses && (
            <>
              <p className="text-sm font-medium text-gray-700 mt-4">General Insurance Classes:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {GENERAL_INSURANCE_CLASSES.map((cls) => (
                  <FormCheckbox
                    key={cls.id}
                    id={`general_${cls.id}`}
                    label={cls.label}
                    checked={(insuranceData.generalClasses || []).includes(cls.id)}
                    onChange={(checked) => handleClassToggle('general', cls.id, checked)}
                    disabled={isReadOnly}
                  />
                ))}
              </div>
            </>
          )}

          {showLifeClasses && (
            <>
              <p className="text-sm font-medium text-gray-700 mt-4">Life Insurance Classes:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LIFE_INSURANCE_CLASSES.map((cls) => (
                  <FormCheckbox
                    key={cls.id}
                    id={`life_${cls.id}`}
                    label={cls.label}
                    checked={(insuranceData.lifeClasses || []).includes(cls.id)}
                    onChange={(checked) => handleClassToggle('life', cls.id, checked)}
                    disabled={isReadOnly}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Underwriting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Underwriting Approach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            id="underwritingStrategy"
            label="Underwriting Strategy"
            value={insuranceData.underwritingStrategy || ''}
            onChange={(value) => handleFieldChange('underwritingStrategy', value)}
            placeholder="Describe your underwriting strategy and risk appetite..."
            rows={4}
            error={errors['directInsurance.underwritingStrategy']}
            disabled={isReadOnly}
          />

          <FormInput
            id="maxSingleRisk"
            label="Maximum Single Risk Retention (USD)"
            value={insuranceData.maxSingleRisk || ''}
            onChange={(value) => handleFieldChange('maxSingleRisk', value)}
            placeholder="Enter maximum single risk"
            error={errors['directInsurance.maxSingleRisk']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasReinsurance"
            label="Will purchase reinsurance protection"
            checked={insuranceData.hasReinsurance || false}
            onChange={(checked) => handleFieldChange('hasReinsurance', checked)}
            disabled={isReadOnly}
          />

          {insuranceData.hasReinsurance && (
            <FormTextArea
              id="reinsuranceArrangements"
              label="Reinsurance Arrangements"
              value={insuranceData.reinsuranceArrangements || ''}
              onChange={(value) => handleFieldChange('reinsuranceArrangements', value)}
              placeholder="Describe your reinsurance arrangements..."
              rows={3}
              error={errors['directInsurance.reinsuranceArrangements']}
              disabled={isReadOnly}
            />
          )}
        </CardContent>
      </Card>

      {/* Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Distribution Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="directSales"
            label="Direct sales to customers"
            checked={insuranceData.directSales || false}
            onChange={(checked) => handleFieldChange('directSales', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="brokerChannel"
            label="Through insurance brokers"
            checked={insuranceData.brokerChannel || false}
            onChange={(checked) => handleFieldChange('brokerChannel', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="agentChannel"
            label="Through insurance agents"
            checked={insuranceData.agentChannel || false}
            onChange={(checked) => handleFieldChange('agentChannel', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="digitalChannel"
            label="Digital/Online channels"
            checked={insuranceData.digitalChannel || false}
            onChange={(checked) => handleFieldChange('digitalChannel', checked)}
            disabled={isReadOnly}
          />

          <FormInput
            id="targetGeographies"
            label="Target Geographies"
            value={insuranceData.targetGeographies || ''}
            onChange={(value) => handleFieldChange('targetGeographies', value)}
            placeholder="e.g., UAE, GCC, MENA"
            error={errors['directInsurance.targetGeographies']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Capital & Solvency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Capital & Solvency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="proposedCapital"
            label="Proposed Regulatory Capital (USD)"
            value={insuranceData.proposedCapital || ''}
            onChange={(value) => handleFieldChange('proposedCapital', value)}
            placeholder="Enter proposed capital"
            error={errors['directInsurance.proposedCapital']}
            disabled={isReadOnly}
          />

          <FormInput
            id="projectedGWP"
            label="Projected Gross Written Premium Year 1 (USD)"
            value={insuranceData.projectedGWP || ''}
            onChange={(value) => handleFieldChange('projectedGWP', value)}
            placeholder="Enter projected GWP"
            error={errors['directInsurance.projectedGWP']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasActuary"
            label="An appointed actuary will be engaged"
            checked={insuranceData.hasActuary || false}
            onChange={(checked) => handleFieldChange('hasActuary', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="confirmSolvencyCompliance"
            label="I confirm that the insurer will maintain solvency in accordance with DFSA requirements"
            checked={insuranceData.confirmSolvencyCompliance || false}
            onChange={(checked) => handleFieldChange('confirmSolvencyCompliance', checked)}
            required
            error={errors['directInsurance.confirmSolvencyCompliance']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
