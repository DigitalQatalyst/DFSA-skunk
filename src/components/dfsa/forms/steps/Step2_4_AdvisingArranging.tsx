/**
 * DFSA Step 2-4: Advising & Arranging
 *
 * Activity-specific step for advising and arranging activities
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, MessageSquare, Target, Shield, FileText } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_4Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Advisory service types
const ADVISORY_SERVICE_TYPES = [
  { id: 'investment_advice', label: 'Investment Advice' },
  { id: 'financial_planning', label: 'Financial Planning' },
  { id: 'portfolio_review', label: 'Portfolio Review' },
  { id: 'corporate_finance', label: 'Corporate Finance Advisory' },
  { id: 'ma_advisory', label: 'M&A Advisory' },
  { id: 'capital_raising', label: 'Capital Raising Advisory' },
  { id: 'restructuring', label: 'Restructuring Advisory' },
  { id: 'credit_advisory', label: 'Credit Advisory' }
];

// Arranging service types
const ARRANGING_SERVICE_TYPES = [
  { id: 'deal_arranging', label: 'Arranging Deals in Investments' },
  { id: 'credit_arranging', label: 'Arranging Credit' },
  { id: 'custody_arranging', label: 'Arranging Custody' },
  { id: 'fund_distribution', label: 'Fund Distribution' },
  { id: 'introducing', label: 'Introducing Services' }
];

// Client categories
const CLIENT_CATEGORIES = [
  { value: 'retail', label: 'Retail Clients' },
  { value: 'professional', label: 'Professional Clients' },
  { value: 'market_counterparty', label: 'Market Counterparties' },
  { value: 'mixed', label: 'Mixed Client Base' }
];

// Remuneration models
const REMUNERATION_MODELS = [
  { value: 'fee_based', label: 'Fee-based (fixed or hourly)' },
  { value: 'commission', label: 'Commission-based' },
  { value: 'aum_based', label: 'AUM-based fees' },
  { value: 'success_fee', label: 'Success/Performance fees' },
  { value: 'hybrid', label: 'Hybrid model' }
];

export const Step2_4_AdvisingArranging: React.FC<Step2_4Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  // Initialize advising/arranging data if not present
  const advisingData = (formData as any).advisingArranging || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      advisingArranging: {
        ...advisingData,
        [field]: value
      }
    } as any);
  };

  const handleServiceToggle = (serviceType: 'advisory' | 'arranging', serviceId: string, checked: boolean) => {
    const fieldName = serviceType === 'advisory' ? 'advisoryServices' : 'arrangingServices';
    const currentServices = advisingData[fieldName] || [];
    let updatedServices;

    if (checked) {
      updatedServices = [...currentServices, serviceId];
    } else {
      updatedServices = currentServices.filter((s: string) => s !== serviceId);
    }

    handleFieldChange(fieldName, updatedServices);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This section collects information about your advising and arranging activities.
          Please provide details about the services you intend to offer and your target client base.
        </AlertDescription>
      </Alert>

      {/* Advisory Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Advisory Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the advisory services you intend to provide:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ADVISORY_SERVICE_TYPES.map((service) => (
              <FormCheckbox
                key={service.id}
                id={`advisory_${service.id}`}
                label={service.label}
                checked={(advisingData.advisoryServices || []).includes(service.id)}
                onChange={(checked) => handleServiceToggle('advisory', service.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          <FormTextArea
            id="advisoryServicesDescription"
            label="Description of Advisory Services"
            value={advisingData.advisoryServicesDescription || ''}
            onChange={(value) => handleFieldChange('advisoryServicesDescription', value)}
            placeholder="Provide details of the advisory services you plan to offer..."
            rows={3}
            error={errors['advisingArranging.advisoryServicesDescription']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Arranging Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Arranging Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the arranging services you intend to provide:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ARRANGING_SERVICE_TYPES.map((service) => (
              <FormCheckbox
                key={service.id}
                id={`arranging_${service.id}`}
                label={service.label}
                checked={(advisingData.arrangingServices || []).includes(service.id)}
                onChange={(checked) => handleServiceToggle('arranging', service.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          <FormTextArea
            id="arrangingServicesDescription"
            label="Description of Arranging Services"
            value={advisingData.arrangingServicesDescription || ''}
            onChange={(value) => handleFieldChange('arrangingServicesDescription', value)}
            placeholder="Provide details of the arranging services you plan to offer..."
            rows={3}
            error={errors['advisingArranging.arrangingServicesDescription']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Target Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Target Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="primaryClientCategory"
            label="Primary Client Category"
            value={advisingData.primaryClientCategory || ''}
            onChange={(value) => handleFieldChange('primaryClientCategory', value)}
            options={CLIENT_CATEGORIES}
            required
            error={errors['advisingArranging.primaryClientCategory']}
            placeholder="Select client category"
            disabled={isReadOnly}
          />

          <FormInput
            id="targetClientCount"
            label="Expected Number of Clients (Year 1)"
            value={advisingData.targetClientCount || ''}
            onChange={(value) => handleFieldChange('targetClientCount', value)}
            type="number"
            placeholder="Enter expected client count"
            error={errors['advisingArranging.targetClientCount']}
            disabled={isReadOnly}
          />

          <FormInput
            id="targetGeographies"
            label="Target Client Geographies"
            value={advisingData.targetGeographies || ''}
            onChange={(value) => handleFieldChange('targetGeographies', value)}
            placeholder="e.g., GCC, MENA, Global"
            error={errors['advisingArranging.targetGeographies']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="clientAcquisitionStrategy"
            label="Client Acquisition Strategy"
            value={advisingData.clientAcquisitionStrategy || ''}
            onChange={(value) => handleFieldChange('clientAcquisitionStrategy', value)}
            placeholder="Describe how you plan to acquire clients..."
            rows={3}
            error={errors['advisingArranging.clientAcquisitionStrategy']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Remuneration & Conflicts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Remuneration & Conflicts of Interest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="remunerationModel"
            label="Primary Remuneration Model"
            value={advisingData.remunerationModel || ''}
            onChange={(value) => handleFieldChange('remunerationModel', value)}
            options={REMUNERATION_MODELS}
            required
            error={errors['advisingArranging.remunerationModel']}
            placeholder="Select remuneration model"
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="receivesThirdPartyPayments"
            label="The firm will receive payments from third parties (e.g., product providers)"
            checked={advisingData.receivesThirdPartyPayments || false}
            onChange={(checked) => handleFieldChange('receivesThirdPartyPayments', checked)}
            disabled={isReadOnly}
          />

          {advisingData.receivesThirdPartyPayments && (
            <FormTextArea
              id="thirdPartyPaymentDetails"
              label="Details of Third Party Payments"
              value={advisingData.thirdPartyPaymentDetails || ''}
              onChange={(value) => handleFieldChange('thirdPartyPaymentDetails', value)}
              placeholder="Describe the nature and source of third party payments..."
              rows={3}
              error={errors['advisingArranging.thirdPartyPaymentDetails']}
              disabled={isReadOnly}
            />
          )}

          <FormTextArea
            id="conflictsOfInterestPolicy"
            label="Conflicts of Interest Management"
            value={advisingData.conflictsOfInterestPolicy || ''}
            onChange={(value) => handleFieldChange('conflictsOfInterestPolicy', value)}
            required
            placeholder="Describe how you will identify and manage conflicts of interest..."
            rows={4}
            error={errors['advisingArranging.conflictsOfInterestPolicy']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasWrittenConflictsPolicy"
            label="The firm has a written conflicts of interest policy"
            checked={advisingData.hasWrittenConflictsPolicy || false}
            onChange={(checked) => handleFieldChange('hasWrittenConflictsPolicy', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="confirmSuitabilityAssessment"
            label="I confirm that suitability assessments will be conducted for all advisory services"
            checked={advisingData.confirmSuitabilityAssessment || false}
            onChange={(checked) => handleFieldChange('confirmSuitabilityAssessment', checked)}
            required
            error={errors['advisingArranging.confirmSuitabilityAssessment']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
