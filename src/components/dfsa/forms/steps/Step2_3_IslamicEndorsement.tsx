/**
 * DFSA Step 2-3: Islamic Endorsement
 *
 * Activity-specific step for Islamic finance endorsement (E1_A1)
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Moon, Users, BookOpen, Shield } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_3Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Sharia governance models
const SHARIA_GOVERNANCE_MODELS = [
  { value: 'internal_board', label: 'Internal Sharia Supervisory Board' },
  { value: 'external_board', label: 'External Sharia Supervisory Board' },
  { value: 'shared_board', label: 'Shared Sharia Board with Group' },
  { value: 'outsourced', label: 'Outsourced Sharia Advisory' }
];

// Islamic product types
const ISLAMIC_PRODUCT_TYPES = [
  { id: 'murabaha', label: 'Murabaha (Cost-plus financing)' },
  { id: 'ijara', label: 'Ijara (Leasing)' },
  { id: 'musharaka', label: 'Musharaka (Partnership)' },
  { id: 'mudaraba', label: 'Mudaraba (Profit-sharing)' },
  { id: 'sukuk', label: 'Sukuk (Islamic bonds)' },
  { id: 'takaful', label: 'Takaful (Islamic insurance)' },
  { id: 'wakala', label: 'Wakala (Agency)' },
  { id: 'salam', label: 'Salam (Forward sale)' },
  { id: 'istisna', label: "Istisna'a (Manufacturing contract)" },
  { id: 'other', label: 'Other Islamic products' }
];

export const Step2_3_IslamicEndorsement: React.FC<Step2_3Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  // Initialize Islamic endorsement data if not present
  const islamicData = (formData as any).islamicEndorsement || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      islamicEndorsement: {
        ...islamicData,
        [field]: value
      }
    } as any);
  };

  const handleProductToggle = (productId: string, checked: boolean) => {
    const currentProducts = islamicData.plannedProducts || [];
    let updatedProducts;

    if (checked) {
      updatedProducts = [...currentProducts, productId];
    } else {
      updatedProducts = currentProducts.filter((p: string) => p !== productId);
    }

    handleFieldChange('plannedProducts', updatedProducts);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The Islamic Financial Business Endorsement allows you to conduct financial services in accordance with Sharia principles.
          You must demonstrate appropriate Sharia governance arrangements and expertise.
        </AlertDescription>
      </Alert>

      {/* Sharia Governance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Sharia Governance Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="shariaGovernanceModel"
            label="Sharia Governance Model"
            value={islamicData.shariaGovernanceModel || ''}
            onChange={(value) => handleFieldChange('shariaGovernanceModel', value)}
            options={SHARIA_GOVERNANCE_MODELS}
            required
            error={errors['islamicEndorsement.shariaGovernanceModel']}
            placeholder="Select governance model"
            disabled={isReadOnly}
          />

          <FormTextArea
            id="shariaGovernanceDescription"
            label="Description of Sharia Governance Arrangements"
            value={islamicData.shariaGovernanceDescription || ''}
            onChange={(value) => handleFieldChange('shariaGovernanceDescription', value)}
            required
            placeholder="Describe your Sharia governance arrangements, including reporting lines and decision-making processes..."
            rows={4}
            error={errors['islamicEndorsement.shariaGovernanceDescription']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasWrittenShariaPolicy"
            label="The firm has a written Sharia compliance policy"
            checked={islamicData.hasWrittenShariaPolicy || false}
            onChange={(checked) => handleFieldChange('hasWrittenShariaPolicy', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasInternalShariaReview"
            label="The firm has internal Sharia review/audit procedures"
            checked={islamicData.hasInternalShariaReview || false}
            onChange={(checked) => handleFieldChange('hasInternalShariaReview', checked)}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Sharia Supervisory Board */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Sharia Supervisory Board
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="ssbMemberCount"
            label="Number of SSB Members"
            value={islamicData.ssbMemberCount || ''}
            onChange={(value) => handleFieldChange('ssbMemberCount', value)}
            type="number"
            required
            placeholder="Enter number of members"
            error={errors['islamicEndorsement.ssbMemberCount']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="ssbMemberDetails"
            label="SSB Member Details"
            value={islamicData.ssbMemberDetails || ''}
            onChange={(value) => handleFieldChange('ssbMemberDetails', value)}
            required
            placeholder="Provide names, qualifications, and experience of proposed SSB members..."
            rows={4}
            error={errors['islamicEndorsement.ssbMemberDetails']}
            disabled={isReadOnly}
          />

          <FormInput
            id="ssbMeetingFrequency"
            label="Proposed SSB Meeting Frequency"
            value={islamicData.ssbMeetingFrequency || ''}
            onChange={(value) => handleFieldChange('ssbMeetingFrequency', value)}
            placeholder="e.g., Quarterly, Monthly"
            error={errors['islamicEndorsement.ssbMeetingFrequency']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="ssbIndependence"
            label="SSB members are independent of the firm's management"
            checked={islamicData.ssbIndependence || false}
            onChange={(checked) => handleFieldChange('ssbIndependence', checked)}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Islamic Products & Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Islamic Products & Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the Islamic financial products/services you intend to offer:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ISLAMIC_PRODUCT_TYPES.map((product) => (
              <FormCheckbox
                key={product.id}
                id={`product_${product.id}`}
                label={product.label}
                checked={(islamicData.plannedProducts || []).includes(product.id)}
                onChange={(checked) => handleProductToggle(product.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          {errors['islamicEndorsement.plannedProducts'] && (
            <p className="text-sm text-red-600 mt-2">
              {errors['islamicEndorsement.plannedProducts']}
            </p>
          )}

          <FormTextArea
            id="productDescription"
            label="Description of Proposed Islamic Products/Services"
            value={islamicData.productDescription || ''}
            onChange={(value) => handleFieldChange('productDescription', value)}
            required
            placeholder="Provide details of the Islamic products/services you plan to offer..."
            rows={4}
            error={errors['islamicEndorsement.productDescription']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Sharia Compliance Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sharia Compliance Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="hasIslamicFinanceExperience"
            label="The firm/key personnel have prior experience in Islamic finance"
            checked={islamicData.hasIslamicFinanceExperience || false}
            onChange={(checked) => handleFieldChange('hasIslamicFinanceExperience', checked)}
            disabled={isReadOnly}
          />

          {islamicData.hasIslamicFinanceExperience && (
            <FormTextArea
              id="islamicFinanceExperienceDetails"
              label="Details of Islamic Finance Experience"
              value={islamicData.islamicFinanceExperienceDetails || ''}
              onChange={(value) => handleFieldChange('islamicFinanceExperienceDetails', value)}
              placeholder="Describe the firm's and key personnel's experience in Islamic finance..."
              rows={3}
              error={errors['islamicEndorsement.islamicFinanceExperienceDetails']}
              disabled={isReadOnly}
            />
          )}

          <FormTextArea
            id="shariaTrainingPlan"
            label="Sharia Training Plan for Staff"
            value={islamicData.shariaTrainingPlan || ''}
            onChange={(value) => handleFieldChange('shariaTrainingPlan', value)}
            placeholder="Describe the training plan to ensure staff understand Sharia principles..."
            rows={3}
            error={errors['islamicEndorsement.shariaTrainingPlan']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="confirmShariaCompliance"
            label="I confirm that all products and services will be conducted in accordance with Sharia principles as determined by the SSB"
            checked={islamicData.confirmShariaCompliance || false}
            onChange={(checked) => handleFieldChange('confirmShariaCompliance', checked)}
            required
            error={errors['islamicEndorsement.confirmShariaCompliance']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
