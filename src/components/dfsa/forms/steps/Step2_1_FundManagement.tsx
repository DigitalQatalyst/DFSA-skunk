/**
 * DFSA Step 2-1: Fund Management
 *
 * Activity-specific step for fund management activities (A10, A11, A13)
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Briefcase, Building2, Users, FileText } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_1Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Fund types
const FUND_TYPES = [
  { value: 'public', label: 'Public Fund' },
  { value: 'exempt', label: 'Exempt Fund' },
  { value: 'qualified_investor', label: 'Qualified Investor Fund' },
  { value: 'domestic', label: 'Domestic Fund' },
  { value: 'foreign', label: 'Foreign Fund' },
  { value: 'umbrella', label: 'Umbrella Fund' },
  { value: 'feeder', label: 'Feeder Fund' }
];

// Investment strategies
const INVESTMENT_STRATEGIES = [
  { value: 'equity', label: 'Equity' },
  { value: 'fixed_income', label: 'Fixed Income' },
  { value: 'money_market', label: 'Money Market' },
  { value: 'balanced', label: 'Balanced/Mixed' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'private_equity', label: 'Private Equity' },
  { value: 'hedge', label: 'Hedge Fund Strategy' },
  { value: 'commodity', label: 'Commodity' },
  { value: 'islamic', label: 'Islamic/Sharia Compliant' },
  { value: 'other', label: 'Other' }
];

// Custodian types
const CUSTODIAN_TYPES = [
  { value: 'internal', label: 'Internal Custody' },
  { value: 'external_difc', label: 'External - DIFC Based' },
  { value: 'external_uae', label: 'External - UAE Based' },
  { value: 'external_international', label: 'External - International' }
];

export const Step2_1_FundManagement: React.FC<Step2_1Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  // Initialize fund management data if not present
  const fundManagementData = (formData as any).fundManagement || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      fundManagement: {
        ...fundManagementData,
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
          This section collects information about your fund management activities.
          Please provide details about the types of funds you intend to manage and your operational structure.
        </AlertDescription>
      </Alert>

      {/* Fund Types Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Fund Types & Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="fundType"
            label="Primary Fund Type"
            value={fundManagementData.fundType || ''}
            onChange={(value) => handleFieldChange('fundType', value)}
            options={FUND_TYPES}
            required
            error={errors['fundManagement.fundType']}
            placeholder="Select fund type"
            disabled={isReadOnly}
          />

          <FormSelect
            id="investmentStrategy"
            label="Primary Investment Strategy"
            value={fundManagementData.investmentStrategy || ''}
            onChange={(value) => handleFieldChange('investmentStrategy', value)}
            options={INVESTMENT_STRATEGIES}
            required
            error={errors['fundManagement.investmentStrategy']}
            placeholder="Select investment strategy"
            disabled={isReadOnly}
          />

          <FormInput
            id="targetFundSize"
            label="Target Fund Size (USD)"
            value={fundManagementData.targetFundSize || ''}
            onChange={(value) => handleFieldChange('targetFundSize', value)}
            type="text"
            placeholder="e.g., 50,000,000"
            error={errors['fundManagement.targetFundSize']}
            disabled={isReadOnly}
          />

          <FormInput
            id="minimumInvestment"
            label="Minimum Investment Amount (USD)"
            value={fundManagementData.minimumInvestment || ''}
            onChange={(value) => handleFieldChange('minimumInvestment', value)}
            type="text"
            placeholder="e.g., 100,000"
            error={errors['fundManagement.minimumInvestment']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Service Providers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Service Providers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="custodianType"
            label="Custodian Arrangement"
            value={fundManagementData.custodianType || ''}
            onChange={(value) => handleFieldChange('custodianType', value)}
            options={CUSTODIAN_TYPES}
            required
            error={errors['fundManagement.custodianType']}
            placeholder="Select custodian type"
            disabled={isReadOnly}
          />

          <FormInput
            id="custodianName"
            label="Custodian Name"
            value={fundManagementData.custodianName || ''}
            onChange={(value) => handleFieldChange('custodianName', value)}
            placeholder="Enter custodian name"
            error={errors['fundManagement.custodianName']}
            disabled={isReadOnly}
          />

          <FormInput
            id="fundAdministrator"
            label="Fund Administrator (if applicable)"
            value={fundManagementData.fundAdministrator || ''}
            onChange={(value) => handleFieldChange('fundAdministrator', value)}
            placeholder="Enter fund administrator name"
            error={errors['fundManagement.fundAdministrator']}
            disabled={isReadOnly}
          />

          <FormInput
            id="auditorName"
            label="Proposed Auditor"
            value={fundManagementData.auditorName || ''}
            onChange={(value) => handleFieldChange('auditorName', value)}
            placeholder="Enter auditor name"
            error={errors['fundManagement.auditorName']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Target Investors Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Target Investors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="targetRetailInvestors"
            label="Retail Investors"
            checked={fundManagementData.targetRetailInvestors || false}
            onChange={(checked) => handleFieldChange('targetRetailInvestors', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="targetProfessionalClients"
            label="Professional Clients"
            checked={fundManagementData.targetProfessionalClients || false}
            onChange={(checked) => handleFieldChange('targetProfessionalClients', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="targetMarketCounterparties"
            label="Market Counterparties"
            checked={fundManagementData.targetMarketCounterparties || false}
            onChange={(checked) => handleFieldChange('targetMarketCounterparties', checked)}
            disabled={isReadOnly}
          />

          <FormInput
            id="targetGeographies"
            label="Target Geographies"
            value={fundManagementData.targetGeographies || ''}
            onChange={(value) => handleFieldChange('targetGeographies', value)}
            placeholder="e.g., GCC, MENA, Global"
            error={errors['fundManagement.targetGeographies']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            id="investmentObjective"
            label="Investment Objective"
            value={fundManagementData.investmentObjective || ''}
            onChange={(value) => handleFieldChange('investmentObjective', value)}
            placeholder="Describe the fund's investment objective..."
            rows={4}
            error={errors['fundManagement.investmentObjective']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="riskFactors"
            label="Key Risk Factors"
            value={fundManagementData.riskFactors || ''}
            onChange={(value) => handleFieldChange('riskFactors', value)}
            placeholder="Describe the key risk factors associated with the fund..."
            rows={4}
            error={errors['fundManagement.riskFactors']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasExistingFunds"
            label="Do you currently manage any existing funds?"
            checked={fundManagementData.hasExistingFunds || false}
            onChange={(checked) => handleFieldChange('hasExistingFunds', checked)}
            disabled={isReadOnly}
          />

          {fundManagementData.hasExistingFunds && (
            <FormTextArea
              id="existingFundsDetails"
              label="Existing Funds Details"
              value={fundManagementData.existingFundsDetails || ''}
              onChange={(value) => handleFieldChange('existingFundsDetails', value)}
              placeholder="Provide details of existing funds under management..."
              rows={3}
              error={errors['fundManagement.existingFundsDetails']}
              disabled={isReadOnly}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
