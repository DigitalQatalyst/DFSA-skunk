/**
 * DFSA Step 2-12: Banking
 *
 * Activity-specific step for banking activities
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Building, CreditCard, Shield, Users } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_12Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Banking service types
const BANKING_SERVICES = [
  { id: 'deposits', label: 'Accepting Deposits' },
  { id: 'lending', label: 'Lending/Credit Facilities' },
  { id: 'trade_finance', label: 'Trade Finance' },
  { id: 'treasury', label: 'Treasury Services' },
  { id: 'fx', label: 'Foreign Exchange' },
  { id: 'payments', label: 'Payment Services' },
  { id: 'cash_management', label: 'Cash Management' },
  { id: 'documentary_credits', label: 'Documentary Credits' }
];

// Client segments
const CLIENT_SEGMENTS = [
  { id: 'corporate', label: 'Corporate Banking' },
  { id: 'institutional', label: 'Institutional Clients' },
  { id: 'private', label: 'Private Banking' },
  { id: 'retail', label: 'Retail Banking' },
  { id: 'sme', label: 'SME Banking' }
];

// Deposit types
const DEPOSIT_TYPES = [
  { value: 'current', label: 'Current Accounts' },
  { value: 'savings', label: 'Savings Accounts' },
  { value: 'term', label: 'Term Deposits' },
  { value: 'all', label: 'All Types' }
];

export const Step2_12_Banking: React.FC<Step2_12Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  const bankingData = (formData as any).banking || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      banking: {
        ...bankingData,
        [field]: value
      }
    } as any);
  };

  const handleToggle = (field: string, itemId: string, checked: boolean) => {
    const currentItems = bankingData[field] || [];
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
          This section collects information about your banking activities.
          Banking business is subject to enhanced prudential requirements.
        </AlertDescription>
      </Alert>

      {/* Banking Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="w-5 h-5" />
            Banking Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the banking services you intend to provide:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BANKING_SERVICES.map((service) => (
              <FormCheckbox
                key={service.id}
                id={`service_${service.id}`}
                label={service.label}
                checked={(bankingData.services || []).includes(service.id)}
                onChange={(checked) => handleToggle('services', service.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          <FormTextArea
            id="servicesDescription"
            label="Description of Banking Services"
            value={bankingData.servicesDescription || ''}
            onChange={(value) => handleFieldChange('servicesDescription', value)}
            placeholder="Describe your banking services in detail..."
            rows={4}
            error={errors['banking.servicesDescription']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Client Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Target Client Segments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CLIENT_SEGMENTS.map((segment) => (
              <FormCheckbox
                key={segment.id}
                id={`segment_${segment.id}`}
                label={segment.label}
                checked={(bankingData.clientSegments || []).includes(segment.id)}
                onChange={(checked) => handleToggle('clientSegments', segment.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          <FormInput
            id="targetGeographies"
            label="Target Client Geographies"
            value={bankingData.targetGeographies || ''}
            onChange={(value) => handleFieldChange('targetGeographies', value)}
            placeholder="e.g., GCC, MENA, Global"
            error={errors['banking.targetGeographies']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Deposits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Deposit Taking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="acceptsDeposits"
            label="Will accept deposits from customers"
            checked={bankingData.acceptsDeposits || false}
            onChange={(checked) => handleFieldChange('acceptsDeposits', checked)}
            disabled={isReadOnly}
          />

          {bankingData.acceptsDeposits && (
            <>
              <FormSelect
                id="depositTypes"
                label="Types of Deposits"
                value={bankingData.depositTypes || ''}
                onChange={(value) => handleFieldChange('depositTypes', value)}
                options={DEPOSIT_TYPES}
                error={errors['banking.depositTypes']}
                placeholder="Select deposit types"
                disabled={isReadOnly}
              />

              <FormInput
                id="projectedDeposits"
                label="Projected Deposits Year 1 (USD)"
                value={bankingData.projectedDeposits || ''}
                onChange={(value) => handleFieldChange('projectedDeposits', value)}
                placeholder="Enter projected deposits"
                error={errors['banking.projectedDeposits']}
                disabled={isReadOnly}
              />

              <FormCheckbox
                id="hasDepositInsurance"
                label="Deposits will be covered by deposit insurance scheme"
                checked={bankingData.hasDepositInsurance || false}
                onChange={(checked) => handleFieldChange('hasDepositInsurance', checked)}
                disabled={isReadOnly}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Capital & Liquidity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Capital & Liquidity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="proposedCapital"
            label="Proposed Regulatory Capital (USD)"
            value={bankingData.proposedCapital || ''}
            onChange={(value) => handleFieldChange('proposedCapital', value)}
            placeholder="Enter proposed capital"
            error={errors['banking.proposedCapital']}
            disabled={isReadOnly}
          />

          <FormInput
            id="projectedAssets"
            label="Projected Total Assets Year 1 (USD)"
            value={bankingData.projectedAssets || ''}
            onChange={(value) => handleFieldChange('projectedAssets', value)}
            placeholder="Enter projected assets"
            error={errors['banking.projectedAssets']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="liquidityManagement"
            label="Liquidity Management Approach"
            value={bankingData.liquidityManagement || ''}
            onChange={(value) => handleFieldChange('liquidityManagement', value)}
            placeholder="Describe your liquidity management approach..."
            rows={3}
            error={errors['banking.liquidityManagement']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasALCO"
            label="An Asset-Liability Committee (ALCO) will be established"
            checked={bankingData.hasALCO || false}
            onChange={(checked) => handleFieldChange('hasALCO', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="confirmPrudentialCompliance"
            label="I confirm that the bank will comply with DFSA prudential requirements"
            checked={bankingData.confirmPrudentialCompliance || false}
            onChange={(checked) => handleFieldChange('confirmPrudentialCompliance', checked)}
            required
            error={errors['banking.confirmPrudentialCompliance']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
