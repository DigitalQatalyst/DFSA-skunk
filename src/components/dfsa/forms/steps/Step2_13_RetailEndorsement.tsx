/**
 * DFSA Step 2-13: Retail Endorsement
 *
 * Activity-specific step for retail client endorsement
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Users, Shield, FileText, MessageSquare } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_13Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Retail services
const RETAIL_SERVICES = [
  { id: 'investment_advice', label: 'Investment Advice' },
  { id: 'portfolio_management', label: 'Portfolio Management' },
  { id: 'dealing', label: 'Dealing in Investments' },
  { id: 'arranging', label: 'Arranging Deals' },
  { id: 'custody', label: 'Custody Services' }
];

// Communication channels
const COMMUNICATION_CHANNELS = [
  { id: 'face_to_face', label: 'Face-to-face meetings' },
  { id: 'telephone', label: 'Telephone' },
  { id: 'email', label: 'Email' },
  { id: 'online_portal', label: 'Online portal/app' },
  { id: 'video_call', label: 'Video conferencing' }
];

// Complaint handling timeframes
const COMPLAINT_TIMEFRAMES = [
  { value: '5_days', label: 'Within 5 business days' },
  { value: '10_days', label: 'Within 10 business days' },
  { value: '15_days', label: 'Within 15 business days' },
  { value: '30_days', label: 'Within 30 business days' }
];

export const Step2_13_RetailEndorsement: React.FC<Step2_13Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  const retailData = (formData as any).retailEndorsement || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      retailEndorsement: {
        ...retailData,
        [field]: value
      }
    } as any);
  };

  const handleToggle = (field: string, itemId: string, checked: boolean) => {
    const currentItems = retailData[field] || [];
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
          The Retail Endorsement allows you to provide financial services to retail clients.
          This requires enhanced client protection measures and suitability assessments.
        </AlertDescription>
      </Alert>

      {/* Retail Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Services for Retail Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the services you will provide to retail clients:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RETAIL_SERVICES.map((service) => (
              <FormCheckbox
                key={service.id}
                id={`retail_${service.id}`}
                label={service.label}
                checked={(retailData.retailServices || []).includes(service.id)}
                onChange={(checked) => handleToggle('retailServices', service.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          <FormInput
            id="expectedRetailClients"
            label="Expected Number of Retail Clients (Year 1)"
            value={retailData.expectedRetailClients || ''}
            onChange={(value) => handleFieldChange('expectedRetailClients', value)}
            type="number"
            placeholder="Enter expected client count"
            error={errors['retailEndorsement.expectedRetailClients']}
            disabled={isReadOnly}
          />

          <FormInput
            id="minimumInvestment"
            label="Minimum Investment Amount (USD)"
            value={retailData.minimumInvestment || ''}
            onChange={(value) => handleFieldChange('minimumInvestment', value)}
            placeholder="Enter minimum investment"
            error={errors['retailEndorsement.minimumInvestment']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Client Suitability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Client Suitability & Protection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="hasSuitabilityProcess"
            label="A formal suitability assessment process is in place"
            checked={retailData.hasSuitabilityProcess || false}
            onChange={(checked) => handleFieldChange('hasSuitabilityProcess', checked)}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="suitabilityProcess"
            label="Suitability Assessment Process"
            value={retailData.suitabilityProcess || ''}
            onChange={(value) => handleFieldChange('suitabilityProcess', value)}
            required
            placeholder="Describe how you will assess client suitability..."
            rows={4}
            error={errors['retailEndorsement.suitabilityProcess']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasRiskProfiling"
            label="Client risk profiling will be conducted"
            checked={retailData.hasRiskProfiling || false}
            onChange={(checked) => handleFieldChange('hasRiskProfiling', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasKYC"
            label="Enhanced KYC procedures for retail clients are in place"
            checked={retailData.hasKYC || false}
            onChange={(checked) => handleFieldChange('hasKYC', checked)}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="clientProtectionMeasures"
            label="Client Protection Measures"
            value={retailData.clientProtectionMeasures || ''}
            onChange={(value) => handleFieldChange('clientProtectionMeasures', value)}
            placeholder="Describe measures to protect retail clients..."
            rows={3}
            error={errors['retailEndorsement.clientProtectionMeasures']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Client Communication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the communication channels you will use with retail clients:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COMMUNICATION_CHANNELS.map((channel) => (
              <FormCheckbox
                key={channel.id}
                id={`channel_${channel.id}`}
                label={channel.label}
                checked={(retailData.communicationChannels || []).includes(channel.id)}
                onChange={(checked) => handleToggle('communicationChannels', channel.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          <FormCheckbox
            id="hasClearDisclosures"
            label="Clear and fair disclosures will be provided to retail clients"
            checked={retailData.hasClearDisclosures || false}
            onChange={(checked) => handleFieldChange('hasClearDisclosures', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasRiskWarnings"
            label="Appropriate risk warnings will be provided"
            checked={retailData.hasRiskWarnings || false}
            onChange={(checked) => handleFieldChange('hasRiskWarnings', checked)}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Complaints Handling */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Complaints Handling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="hasComplaintsProcess"
            label="A formal complaints handling process is in place"
            checked={retailData.hasComplaintsProcess || false}
            onChange={(checked) => handleFieldChange('hasComplaintsProcess', checked)}
            disabled={isReadOnly}
          />

          <FormSelect
            id="complaintResponseTime"
            label="Target Complaint Response Time"
            value={retailData.complaintResponseTime || ''}
            onChange={(value) => handleFieldChange('complaintResponseTime', value)}
            options={COMPLAINT_TIMEFRAMES}
            error={errors['retailEndorsement.complaintResponseTime']}
            placeholder="Select response timeframe"
            disabled={isReadOnly}
          />

          <FormTextArea
            id="complaintsProcess"
            label="Complaints Handling Process"
            value={retailData.complaintsProcess || ''}
            onChange={(value) => handleFieldChange('complaintsProcess', value)}
            placeholder="Describe your complaints handling process..."
            rows={3}
            error={errors['retailEndorsement.complaintsProcess']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="confirmRetailCompliance"
            label="I confirm that all retail client services will comply with DFSA Conduct of Business requirements"
            checked={retailData.confirmRetailCompliance || false}
            onChange={(checked) => handleFieldChange('confirmRetailCompliance', checked)}
            required
            error={errors['retailEndorsement.confirmRetailCompliance']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
