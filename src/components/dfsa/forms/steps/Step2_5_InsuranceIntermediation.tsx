/**
 * DFSA Step 2-5: Insurance Intermediation
 *
 * Activity-specific step for insurance intermediation activities
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Shield, Building2, Users, FileText } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_5Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Insurance intermediary types
const INTERMEDIARY_TYPES = [
  { value: 'broker', label: 'Insurance Broker' },
  { value: 'agent', label: 'Insurance Agent' },
  { value: 'managing_agent', label: 'Managing Agent' },
  { value: 'reinsurance_broker', label: 'Reinsurance Broker' }
];

// Insurance classes
const INSURANCE_CLASSES = [
  { id: 'general_liability', label: 'General Liability' },
  { id: 'property', label: 'Property Insurance' },
  { id: 'marine', label: 'Marine Insurance' },
  { id: 'aviation', label: 'Aviation Insurance' },
  { id: 'motor', label: 'Motor Insurance' },
  { id: 'health', label: 'Health Insurance' },
  { id: 'life', label: 'Life Insurance' },
  { id: 'professional_indemnity', label: 'Professional Indemnity' },
  { id: 'directors_officers', label: 'Directors & Officers' },
  { id: 'cyber', label: 'Cyber Insurance' },
  { id: 'trade_credit', label: 'Trade Credit' },
  { id: 'reinsurance', label: 'Reinsurance' }
];

// Client money handling options
const CLIENT_MONEY_OPTIONS = [
  { value: 'no_handling', label: 'Will not handle client money' },
  { value: 'risk_transfer', label: 'Risk transfer basis only' },
  { value: 'statutory_trust', label: 'Statutory trust arrangement' },
  { value: 'non_statutory_trust', label: 'Non-statutory trust arrangement' }
];

export const Step2_5_InsuranceIntermediation: React.FC<Step2_5Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  // Initialize insurance intermediation data if not present
  const insuranceData = (formData as any).insuranceIntermediation || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      insuranceIntermediation: {
        ...insuranceData,
        [field]: value
      }
    } as any);
  };

  const handleClassToggle = (classId: string, checked: boolean) => {
    const currentClasses = insuranceData.insuranceClasses || [];
    let updatedClasses;

    if (checked) {
      updatedClasses = [...currentClasses, classId];
    } else {
      updatedClasses = currentClasses.filter((c: string) => c !== classId);
    }

    handleFieldChange('insuranceClasses', updatedClasses);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This section collects information about your insurance intermediation activities.
          Please provide details about the types of insurance you will intermediate and your operational arrangements.
        </AlertDescription>
      </Alert>

      {/* Intermediary Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Intermediary Type & Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="intermediaryType"
            label="Type of Insurance Intermediary"
            value={insuranceData.intermediaryType || ''}
            onChange={(value) => handleFieldChange('intermediaryType', value)}
            options={INTERMEDIARY_TYPES}
            required
            error={errors['insuranceIntermediation.intermediaryType']}
            placeholder="Select intermediary type"
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="isLloydsCorrespondent"
            label="Will act as Lloyd's Correspondent"
            checked={insuranceData.isLloydsCorrespondent || false}
            onChange={(checked) => handleFieldChange('isLloydsCorrespondent', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasTiedArrangements"
            label="Has tied arrangements with specific insurers"
            checked={insuranceData.hasTiedArrangements || false}
            onChange={(checked) => handleFieldChange('hasTiedArrangements', checked)}
            disabled={isReadOnly}
          />

          {insuranceData.hasTiedArrangements && (
            <FormTextArea
              id="tiedArrangementsDetails"
              label="Details of Tied Arrangements"
              value={insuranceData.tiedArrangementsDetails || ''}
              onChange={(value) => handleFieldChange('tiedArrangementsDetails', value)}
              placeholder="Describe the tied arrangements with insurers..."
              rows={3}
              error={errors['insuranceIntermediation.tiedArrangementsDetails']}
              disabled={isReadOnly}
            />
          )}
        </CardContent>
      </Card>

      {/* Insurance Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Insurance Classes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the classes of insurance you intend to intermediate:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {INSURANCE_CLASSES.map((insuranceClass) => (
              <FormCheckbox
                key={insuranceClass.id}
                id={`class_${insuranceClass.id}`}
                label={insuranceClass.label}
                checked={(insuranceData.insuranceClasses || []).includes(insuranceClass.id)}
                onChange={(checked) => handleClassToggle(insuranceClass.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          {errors['insuranceIntermediation.insuranceClasses'] && (
            <p className="text-sm text-red-600 mt-2">
              {errors['insuranceIntermediation.insuranceClasses']}
            </p>
          )}

          <FormTextArea
            id="specializations"
            label="Areas of Specialization"
            value={insuranceData.specializations || ''}
            onChange={(value) => handleFieldChange('specializations', value)}
            placeholder="Describe any specific areas of specialization or expertise..."
            rows={3}
            error={errors['insuranceIntermediation.specializations']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Insurer Relationships */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Insurer Relationships
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="primaryInsurers"
            label="Primary Insurer Partners"
            value={insuranceData.primaryInsurers || ''}
            onChange={(value) => handleFieldChange('primaryInsurers', value)}
            placeholder="List main insurer partners"
            error={errors['insuranceIntermediation.primaryInsurers']}
            disabled={isReadOnly}
          />

          <FormInput
            id="insurerCount"
            label="Number of Insurer Relationships"
            value={insuranceData.insurerCount || ''}
            onChange={(value) => handleFieldChange('insurerCount', value)}
            type="number"
            placeholder="Enter number"
            error={errors['insuranceIntermediation.insurerCount']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasBindingAuthority"
            label="Will have binding authority from insurers"
            checked={insuranceData.hasBindingAuthority || false}
            onChange={(checked) => handleFieldChange('hasBindingAuthority', checked)}
            disabled={isReadOnly}
          />

          {insuranceData.hasBindingAuthority && (
            <FormTextArea
              id="bindingAuthorityDetails"
              label="Binding Authority Details"
              value={insuranceData.bindingAuthorityDetails || ''}
              onChange={(value) => handleFieldChange('bindingAuthorityDetails', value)}
              placeholder="Describe the scope and limits of binding authority..."
              rows={3}
              error={errors['insuranceIntermediation.bindingAuthorityDetails']}
              disabled={isReadOnly}
            />
          )}
        </CardContent>
      </Card>

      {/* Client Money */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Client Money Handling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="clientMoneyArrangement"
            label="Client Money Arrangement"
            value={insuranceData.clientMoneyArrangement || ''}
            onChange={(value) => handleFieldChange('clientMoneyArrangement', value)}
            options={CLIENT_MONEY_OPTIONS}
            required
            error={errors['insuranceIntermediation.clientMoneyArrangement']}
            placeholder="Select arrangement"
            disabled={isReadOnly}
          />

          {insuranceData.clientMoneyArrangement && insuranceData.clientMoneyArrangement !== 'no_handling' && (
            <>
              <FormInput
                id="clientMoneyBank"
                label="Client Money Bank"
                value={insuranceData.clientMoneyBank || ''}
                onChange={(value) => handleFieldChange('clientMoneyBank', value)}
                placeholder="Enter bank name"
                error={errors['insuranceIntermediation.clientMoneyBank']}
                disabled={isReadOnly}
              />

              <FormTextArea
                id="clientMoneyProcedures"
                label="Client Money Handling Procedures"
                value={insuranceData.clientMoneyProcedures || ''}
                onChange={(value) => handleFieldChange('clientMoneyProcedures', value)}
                placeholder="Describe procedures for handling client money..."
                rows={3}
                error={errors['insuranceIntermediation.clientMoneyProcedures']}
                disabled={isReadOnly}
              />
            </>
          )}

          <FormCheckbox
            id="hasPIInsurance"
            label="The firm has Professional Indemnity Insurance"
            checked={insuranceData.hasPIInsurance || false}
            onChange={(checked) => handleFieldChange('hasPIInsurance', checked)}
            disabled={isReadOnly}
          />

          {insuranceData.hasPIInsurance && (
            <FormInput
              id="piInsuranceLimit"
              label="PI Insurance Limit (USD)"
              value={insuranceData.piInsuranceLimit || ''}
              onChange={(value) => handleFieldChange('piInsuranceLimit', value)}
              placeholder="Enter coverage limit"
              error={errors['insuranceIntermediation.piInsuranceLimit']}
              disabled={isReadOnly}
            />
          )}

          <FormCheckbox
            id="confirmClientMoneyCompliance"
            label="I confirm that client money will be handled in accordance with DFSA Client Money Rules"
            checked={insuranceData.confirmClientMoneyCompliance || false}
            onChange={(checked) => handleFieldChange('confirmClientMoneyCompliance', checked)}
            required
            error={errors['insuranceIntermediation.confirmClientMoneyCompliance']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
