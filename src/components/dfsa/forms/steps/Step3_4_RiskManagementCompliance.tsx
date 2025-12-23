/**
 * DFSA Step 3-4: Risk Management & Compliance
 *
 * Core profile step for risk management and compliance details.
 * Hidden when only Representative Office is selected.
 * Requirements: 7.1
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Shield, AlertTriangle, FileCheck, Scale } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step3_4Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Risk management framework maturity levels
const FRAMEWORK_MATURITY_LEVELS = [
  { value: 'developing', label: 'Developing - Framework being established' },
  { value: 'defined', label: 'Defined - Framework documented and implemented' },
  { value: 'managed', label: 'Managed - Framework actively monitored' },
  { value: 'optimized', label: 'Optimized - Framework continuously improved' }
];

// Compliance monitoring frequency
const MONITORING_FREQUENCY = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' }
];

// AML/CFT risk rating
const AML_RISK_RATINGS = [
  { value: 'low', label: 'Low Risk' },
  { value: 'medium', label: 'Medium Risk' },
  { value: 'high', label: 'High Risk' }
];

export const Step3_4_RiskManagementCompliance: React.FC<Step3_4Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  // Initialize risk management data if not present
  const riskData = (formData as any).riskManagement || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      riskManagement: {
        ...riskData,
        [field]: value
      }
    } as any);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This section collects information about your risk management framework and compliance
          arrangements. The DFSA requires all authorized firms to have adequate systems and controls
          to identify, assess, monitor, and manage risks.
        </AlertDescription>
      </Alert>

      {/* Risk Management Framework Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Management Framework
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            id="riskManagementFramework"
            label="Risk Management Framework Overview"
            value={formData.riskManagementFramework || ''}
            onChange={(value) => updateFormData({ riskManagementFramework: value })}
            placeholder="Describe your overall risk management framework, including governance structure, risk appetite, and key policies..."
            rows={5}
            required
            error={errors['riskManagementFramework']}
            disabled={isReadOnly}
            maxLength={5000}
          />

          <FormSelect
            id="frameworkMaturity"
            label="Framework Maturity Level"
            value={riskData.frameworkMaturity || ''}
            onChange={(value) => handleFieldChange('frameworkMaturity', value)}
            options={FRAMEWORK_MATURITY_LEVELS}
            error={errors['riskManagement.frameworkMaturity']}
            placeholder="Select maturity level"
            disabled={isReadOnly}
          />

          <FormInput
            id="chiefRiskOfficer"
            label="Chief Risk Officer / Risk Manager Name"
            value={riskData.chiefRiskOfficer || ''}
            onChange={(value) => handleFieldChange('chiefRiskOfficer', value)}
            placeholder="Enter name of person responsible for risk management"
            error={errors['riskManagement.chiefRiskOfficer']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasRiskCommittee"
            label="Do you have a dedicated Risk Committee?"
            checked={riskData.hasRiskCommittee || false}
            onChange={(checked) => handleFieldChange('hasRiskCommittee', checked)}
            disabled={isReadOnly}
          />

          {riskData.hasRiskCommittee && (
            <FormTextArea
              id="riskCommitteeDetails"
              label="Risk Committee Details"
              value={riskData.riskCommitteeDetails || ''}
              onChange={(value) => handleFieldChange('riskCommitteeDetails', value)}
              placeholder="Describe the composition and responsibilities of your Risk Committee..."
              rows={3}
              error={errors['riskManagement.riskCommitteeDetails']}
              disabled={isReadOnly}
            />
          )}
        </CardContent>
      </Card>

      {/* Key Risk Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Key Risk Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            id="operationalRisks"
            label="Operational Risk Management"
            value={riskData.operationalRisks || ''}
            onChange={(value) => handleFieldChange('operationalRisks', value)}
            placeholder="Describe how you identify and manage operational risks (e.g., systems failures, fraud, human error)..."
            rows={4}
            error={errors['riskManagement.operationalRisks']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="marketRisks"
            label="Market Risk Management"
            value={riskData.marketRisks || ''}
            onChange={(value) => handleFieldChange('marketRisks', value)}
            placeholder="Describe how you identify and manage market risks (e.g., price movements, interest rate changes)..."
            rows={4}
            error={errors['riskManagement.marketRisks']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="creditRisks"
            label="Credit Risk Management"
            value={riskData.creditRisks || ''}
            onChange={(value) => handleFieldChange('creditRisks', value)}
            placeholder="Describe how you identify and manage credit/counterparty risks..."
            rows={4}
            error={errors['riskManagement.creditRisks']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="liquidityRisks"
            label="Liquidity Risk Management"
            value={riskData.liquidityRisks || ''}
            onChange={(value) => handleFieldChange('liquidityRisks', value)}
            placeholder="Describe how you manage liquidity risks and maintain adequate liquid resources..."
            rows={4}
            error={errors['riskManagement.liquidityRisks']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Compliance Arrangements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Compliance Arrangements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="complianceOfficer"
            label="Compliance Officer Name"
            value={riskData.complianceOfficer || ''}
            onChange={(value) => handleFieldChange('complianceOfficer', value)}
            placeholder="Enter name of Compliance Officer"
            required
            error={errors['riskManagement.complianceOfficer']}
            disabled={isReadOnly}
          />

          <FormInput
            id="mlro"
            label="Money Laundering Reporting Officer (MLRO) Name"
            value={riskData.mlro || ''}
            onChange={(value) => handleFieldChange('mlro', value)}
            placeholder="Enter name of MLRO"
            required
            error={errors['riskManagement.mlro']}
            disabled={isReadOnly}
          />

          <FormSelect
            id="complianceMonitoringFrequency"
            label="Compliance Monitoring Frequency"
            value={riskData.complianceMonitoringFrequency || ''}
            onChange={(value) => handleFieldChange('complianceMonitoringFrequency', value)}
            options={MONITORING_FREQUENCY}
            error={errors['riskManagement.complianceMonitoringFrequency']}
            placeholder="Select monitoring frequency"
            disabled={isReadOnly}
          />

          <FormTextArea
            id="complianceMonitoringPlan"
            label="Compliance Monitoring Plan"
            value={riskData.complianceMonitoringPlan || ''}
            onChange={(value) => handleFieldChange('complianceMonitoringPlan', value)}
            placeholder="Describe your compliance monitoring plan and key activities..."
            rows={4}
            error={errors['riskManagement.complianceMonitoringPlan']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasComplianceManual"
            label="Do you have a Compliance Manual/Policies?"
            checked={riskData.hasComplianceManual || false}
            onChange={(checked) => handleFieldChange('hasComplianceManual', checked)}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* AML/CFT Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="w-5 h-5" />
            AML/CFT Arrangements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="amlRiskRating"
            label="Overall AML/CFT Risk Rating"
            value={riskData.amlRiskRating || ''}
            onChange={(value) => handleFieldChange('amlRiskRating', value)}
            options={AML_RISK_RATINGS}
            error={errors['riskManagement.amlRiskRating']}
            placeholder="Select risk rating"
            disabled={isReadOnly}
          />

          <FormTextArea
            id="amlPolicies"
            label="AML/CFT Policies and Procedures"
            value={riskData.amlPolicies || ''}
            onChange={(value) => handleFieldChange('amlPolicies', value)}
            placeholder="Describe your AML/CFT policies and procedures, including customer due diligence, transaction monitoring, and suspicious activity reporting..."
            rows={5}
            error={errors['riskManagement.amlPolicies']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="sanctionsScreening"
            label="Sanctions Screening Procedures"
            value={riskData.sanctionsScreening || ''}
            onChange={(value) => handleFieldChange('sanctionsScreening', value)}
            placeholder="Describe your sanctions screening procedures and systems..."
            rows={3}
            error={errors['riskManagement.sanctionsScreening']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasAmlTraining"
            label="Do you have an AML/CFT training program for staff?"
            checked={riskData.hasAmlTraining || false}
            onChange={(checked) => handleFieldChange('hasAmlTraining', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="usesAmlSoftware"
            label="Do you use automated AML/CFT screening software?"
            checked={riskData.usesAmlSoftware || false}
            onChange={(checked) => handleFieldChange('usesAmlSoftware', checked)}
            disabled={isReadOnly}
          />

          {riskData.usesAmlSoftware && (
            <FormInput
              id="amlSoftwareProvider"
              label="AML Software Provider"
              value={riskData.amlSoftwareProvider || ''}
              onChange={(value) => handleFieldChange('amlSoftwareProvider', value)}
              placeholder="Enter name of AML software provider"
              error={errors['riskManagement.amlSoftwareProvider']}
              disabled={isReadOnly}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
