/**
 * DFSA Step 2-10: Money Services
 *
 * Activity-specific step for money services business
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Banknote, Globe, Shield, FileText } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_10Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Money service types
const MONEY_SERVICE_TYPES = [
  { id: 'remittance', label: 'Money Remittance' },
  { id: 'currency_exchange', label: 'Currency Exchange' },
  { id: 'payment_services', label: 'Payment Services' },
  { id: 'stored_value', label: 'Stored Value Facilities' }
];

// Transaction volume ranges
const VOLUME_RANGES = [
  { value: 'low', label: 'Low (< 1,000 transactions/month)' },
  { value: 'medium', label: 'Medium (1,000 - 10,000 transactions/month)' },
  { value: 'high', label: 'High (> 10,000 transactions/month)' }
];

export const Step2_10_MoneyServices: React.FC<Step2_10Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  const moneyServicesData = (formData as any).moneyServices || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      moneyServices: {
        ...moneyServicesData,
        [field]: value
      }
    } as any);
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    const currentServices = moneyServicesData.serviceTypes || [];
    const updatedServices = checked
      ? [...currentServices, serviceId]
      : currentServices.filter((s: string) => s !== serviceId);
    handleFieldChange('serviceTypes', updatedServices);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This section collects information about your money services business activities.
          Money services are subject to enhanced AML/CFT requirements.
        </AlertDescription>
      </Alert>

      {/* Service Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Banknote className="w-5 h-5" />
            Money Service Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the money services you intend to provide:
          </p>

          <div className="space-y-3">
            {MONEY_SERVICE_TYPES.map((service) => (
              <FormCheckbox
                key={service.id}
                id={`service_${service.id}`}
                label={service.label}
                checked={(moneyServicesData.serviceTypes || []).includes(service.id)}
                onChange={(checked) => handleServiceToggle(service.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          <FormTextArea
            id="serviceDescription"
            label="Description of Services"
            value={moneyServicesData.serviceDescription || ''}
            onChange={(value) => handleFieldChange('serviceDescription', value)}
            placeholder="Describe your money services in detail..."
            rows={4}
            error={errors['moneyServices.serviceDescription']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Geographic Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Geographic Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="corridors"
            label="Primary Remittance Corridors"
            value={moneyServicesData.corridors || ''}
            onChange={(value) => handleFieldChange('corridors', value)}
            placeholder="e.g., UAE to India, UAE to Philippines"
            error={errors['moneyServices.corridors']}
            disabled={isReadOnly}
          />

          <FormInput
            id="correspondentBanks"
            label="Correspondent Banks/Partners"
            value={moneyServicesData.correspondentBanks || ''}
            onChange={(value) => handleFieldChange('correspondentBanks', value)}
            placeholder="List correspondent banks or payment partners"
            error={errors['moneyServices.correspondentBanks']}
            disabled={isReadOnly}
          />

          <FormSelect
            id="expectedVolume"
            label="Expected Transaction Volume"
            value={moneyServicesData.expectedVolume || ''}
            onChange={(value) => handleFieldChange('expectedVolume', value)}
            options={VOLUME_RANGES}
            required
            error={errors['moneyServices.expectedVolume']}
            placeholder="Select volume range"
            disabled={isReadOnly}
          />

          <FormInput
            id="averageTransactionSize"
            label="Average Transaction Size (USD)"
            value={moneyServicesData.averageTransactionSize || ''}
            onChange={(value) => handleFieldChange('averageTransactionSize', value)}
            placeholder="Enter average transaction size"
            error={errors['moneyServices.averageTransactionSize']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* AML/CFT Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            AML/CFT Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="hasAMLPolicy"
            label="The firm has a written AML/CFT policy"
            checked={moneyServicesData.hasAMLPolicy || false}
            onChange={(checked) => handleFieldChange('hasAMLPolicy', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasMLRO"
            label="A Money Laundering Reporting Officer (MLRO) has been appointed"
            checked={moneyServicesData.hasMLRO || false}
            onChange={(checked) => handleFieldChange('hasMLRO', checked)}
            disabled={isReadOnly}
          />

          <FormInput
            id="mlroName"
            label="MLRO Name"
            value={moneyServicesData.mlroName || ''}
            onChange={(value) => handleFieldChange('mlroName', value)}
            placeholder="Enter MLRO name"
            error={errors['moneyServices.mlroName']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasTransactionMonitoring"
            label="Transaction monitoring systems are in place"
            checked={moneyServicesData.hasTransactionMonitoring || false}
            onChange={(checked) => handleFieldChange('hasTransactionMonitoring', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasSanctionsScreening"
            label="Sanctions screening is conducted on all transactions"
            checked={moneyServicesData.hasSanctionsScreening || false}
            onChange={(checked) => handleFieldChange('hasSanctionsScreening', checked)}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="amlProcedures"
            label="AML/CFT Procedures Summary"
            value={moneyServicesData.amlProcedures || ''}
            onChange={(value) => handleFieldChange('amlProcedures', value)}
            placeholder="Summarize your AML/CFT procedures..."
            rows={4}
            error={errors['moneyServices.amlProcedures']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Operational Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Operational Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="settlementBank"
            label="Settlement Bank"
            value={moneyServicesData.settlementBank || ''}
            onChange={(value) => handleFieldChange('settlementBank', value)}
            placeholder="Enter settlement bank name"
            error={errors['moneyServices.settlementBank']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasAgentNetwork"
            label="Will use agent network for distribution"
            checked={moneyServicesData.hasAgentNetwork || false}
            onChange={(checked) => handleFieldChange('hasAgentNetwork', checked)}
            disabled={isReadOnly}
          />

          {moneyServicesData.hasAgentNetwork && (
            <FormTextArea
              id="agentNetworkDetails"
              label="Agent Network Details"
              value={moneyServicesData.agentNetworkDetails || ''}
              onChange={(value) => handleFieldChange('agentNetworkDetails', value)}
              placeholder="Describe your agent network arrangements..."
              rows={3}
              error={errors['moneyServices.agentNetworkDetails']}
              disabled={isReadOnly}
            />
          )}

          <FormCheckbox
            id="confirmAMLCompliance"
            label="I confirm that all money services will comply with DFSA AML/CFT requirements"
            checked={moneyServicesData.confirmAMLCompliance || false}
            onChange={(checked) => handleFieldChange('confirmAMLCompliance', checked)}
            required
            error={errors['moneyServices.confirmAMLCompliance']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
