/**
 * DFSA Step 3-2: Clients
 *
 * Core profile step for client information and strategies.
 * Hidden when only Representative Office is selected.
 * Requirements: 7.1
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Users, Globe, Shield, Target } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step3_2Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Client classification types
const CLIENT_CLASSIFICATIONS = [
  { value: 'retail', label: 'Retail Clients' },
  { value: 'professional', label: 'Professional Clients' },
  { value: 'market_counterparty', label: 'Market Counterparties' }
];

// Geographic focus options
const GEOGRAPHIC_FOCUS = [
  { value: 'uae', label: 'UAE Only' },
  { value: 'gcc', label: 'GCC Region' },
  { value: 'mena', label: 'MENA Region' },
  { value: 'asia', label: 'Asia Pacific' },
  { value: 'europe', label: 'Europe' },
  { value: 'americas', label: 'Americas' },
  { value: 'global', label: 'Global' }
];

// Client acquisition channels
const ACQUISITION_CHANNELS = [
  { value: 'direct', label: 'Direct Sales' },
  { value: 'referral', label: 'Referral Network' },
  { value: 'digital', label: 'Digital Marketing' },
  { value: 'partnerships', label: 'Strategic Partnerships' },
  { value: 'introducers', label: 'Introducers/Agents' },
  { value: 'other', label: 'Other' }
];

export const Step3_2_Clients: React.FC<Step3_2Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  // Initialize clients data if not present
  const clientsData = (formData as any).clients || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      clients: {
        ...clientsData,
        [field]: value
      }
    } as any);
  };

  // Handle target client segments
  const targetClientSegments = formData.targetClientSegments || [];

  const handleSegmentToggle = (segment: string) => {
    const newSegments = targetClientSegments.includes(segment)
      ? targetClientSegments.filter(s => s !== segment)
      : [...targetClientSegments, segment];
    updateFormData({ targetClientSegments: newSegments });
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This section collects information about your target clients, client acquisition strategy,
          and client protection measures. Please provide details about the types of clients you
          intend to serve and how you will protect their interests.
        </AlertDescription>
      </Alert>

      {/* Target Client Segments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Target Client Segments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Client Classifications (select all that apply)
            </label>
            {CLIENT_CLASSIFICATIONS.map((classification) => (
              <FormCheckbox
                key={classification.value}
                id={`clientSegment_${classification.value}`}
                label={classification.label}
                checked={targetClientSegments.includes(classification.value)}
                onChange={() => handleSegmentToggle(classification.value)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          <FormInput
            id="expectedClientCount"
            label="Expected Number of Clients (Year 1)"
            value={clientsData.expectedClientCount || ''}
            onChange={(value) => handleFieldChange('expectedClientCount', value)}
            type="text"
            placeholder="e.g., 50-100"
            error={errors['clients.expectedClientCount']}
            disabled={isReadOnly}
          />

          <FormInput
            id="averageClientValue"
            label="Average Client Portfolio/Transaction Value (USD)"
            value={clientsData.averageClientValue || ''}
            onChange={(value) => handleFieldChange('averageClientValue', value)}
            type="text"
            placeholder="e.g., 500,000"
            error={errors['clients.averageClientValue']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="clientProfile"
            label="Typical Client Profile"
            value={clientsData.clientProfile || ''}
            onChange={(value) => handleFieldChange('clientProfile', value)}
            placeholder="Describe the typical profile of your target clients (e.g., high-net-worth individuals, institutional investors, family offices)..."
            rows={4}
            error={errors['clients.clientProfile']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Geographic Focus Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Geographic Focus
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="primaryGeographicFocus"
            label="Primary Geographic Focus"
            value={clientsData.primaryGeographicFocus || ''}
            onChange={(value) => handleFieldChange('primaryGeographicFocus', value)}
            options={GEOGRAPHIC_FOCUS}
            required
            error={errors['clients.primaryGeographicFocus']}
            placeholder="Select primary geographic focus"
            disabled={isReadOnly}
          />

          <FormTextArea
            id="targetCountries"
            label="Target Countries/Regions"
            value={clientsData.targetCountries || ''}
            onChange={(value) => handleFieldChange('targetCountries', value)}
            placeholder="List the specific countries or regions you plan to target..."
            rows={3}
            error={errors['clients.targetCountries']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="crossBorderServices"
            label="Will you provide cross-border services?"
            checked={clientsData.crossBorderServices || false}
            onChange={(checked) => handleFieldChange('crossBorderServices', checked)}
            disabled={isReadOnly}
          />

          {clientsData.crossBorderServices && (
            <FormTextArea
              id="crossBorderDetails"
              label="Cross-Border Services Details"
              value={clientsData.crossBorderDetails || ''}
              onChange={(value) => handleFieldChange('crossBorderDetails', value)}
              placeholder="Describe the cross-border services you plan to offer and the jurisdictions involved..."
              rows={3}
              error={errors['clients.crossBorderDetails']}
              disabled={isReadOnly}
            />
          )}
        </CardContent>
      </Card>

      {/* Client Acquisition Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Client Acquisition Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="primaryAcquisitionChannel"
            label="Primary Client Acquisition Channel"
            value={clientsData.primaryAcquisitionChannel || ''}
            onChange={(value) => handleFieldChange('primaryAcquisitionChannel', value)}
            options={ACQUISITION_CHANNELS}
            error={errors['clients.primaryAcquisitionChannel']}
            placeholder="Select primary acquisition channel"
            disabled={isReadOnly}
          />

          <FormTextArea
            id="acquisitionStrategy"
            label="Client Acquisition Strategy"
            value={clientsData.acquisitionStrategy || ''}
            onChange={(value) => handleFieldChange('acquisitionStrategy', value)}
            placeholder="Describe your strategy for acquiring new clients..."
            rows={4}
            error={errors['clients.acquisitionStrategy']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="useIntroducers"
            label="Will you use introducers or agents?"
            checked={clientsData.useIntroducers || false}
            onChange={(checked) => handleFieldChange('useIntroducers', checked)}
            disabled={isReadOnly}
          />

          {clientsData.useIntroducers && (
            <FormTextArea
              id="introducerDetails"
              label="Introducer/Agent Details"
              value={clientsData.introducerDetails || ''}
              onChange={(value) => handleFieldChange('introducerDetails', value)}
              placeholder="Describe your introducer/agent arrangements and oversight procedures..."
              rows={3}
              error={errors['clients.introducerDetails']}
              disabled={isReadOnly}
            />
          )}
        </CardContent>
      </Card>

      {/* Client Protection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Client Protection Measures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            id="clientOnboarding"
            label="Client Onboarding Process"
            value={clientsData.clientOnboarding || ''}
            onChange={(value) => handleFieldChange('clientOnboarding', value)}
            placeholder="Describe your client onboarding process, including KYC/AML procedures..."
            rows={4}
            error={errors['clients.clientOnboarding']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="suitabilityAssessment"
            label="Suitability Assessment Process"
            value={clientsData.suitabilityAssessment || ''}
            onChange={(value) => handleFieldChange('suitabilityAssessment', value)}
            placeholder="Describe how you will assess client suitability for products and services..."
            rows={4}
            error={errors['clients.suitabilityAssessment']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="complaintsHandling"
            label="Complaints Handling Procedures"
            value={clientsData.complaintsHandling || ''}
            onChange={(value) => handleFieldChange('complaintsHandling', value)}
            placeholder="Describe your procedures for handling client complaints..."
            rows={4}
            error={errors['clients.complaintsHandling']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasClientAgreementTemplate"
            label="Do you have a standard client agreement template?"
            checked={clientsData.hasClientAgreementTemplate || false}
            onChange={(checked) => handleFieldChange('hasClientAgreementTemplate', checked)}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
