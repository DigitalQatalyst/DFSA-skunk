/**
 * DFSA Step 1-2: Standing Data
 *
 * Firm information and standing data collection
 * Requirements: 1.1, 1.3, 6.4, 7.2
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Separator } from '../../../ui/separator';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Building2 } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormCheckbox } from '../FormCheckbox';
import { FormTextArea } from '../FormTextArea';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step1_2Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Country options (simplified list - in production would be comprehensive)
const COUNTRY_OPTIONS = [
  { value: '', label: 'Select a country...' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'SG', label: 'Singapore' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'JP', label: 'Japan' },
  { value: 'AU', label: 'Australia' },
  { value: 'CA', label: 'Canada' },
  // Add more countries as needed
];

const LEGAL_STATUS_OPTIONS = [
  { value: '', label: 'Select legal status...' },
  { value: 'LLC', label: 'Limited Liability Company (LLC)' },
  { value: 'PJSC', label: 'Public Joint Stock Company (PJSC)' },
  { value: 'PLLC', label: 'Professional Limited Liability Company (PLLC)' },
  { value: 'BRANCH', label: 'Branch of Foreign Company' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'SOLE_PROP', label: 'Sole Proprietorship' },
  { value: 'OTHER', label: 'Other' },
];

const GENERAL_STRUCTURE_OPTIONS = [
  { value: '', label: 'Select structure...' },
  { value: 'STANDALONE', label: 'Standalone Entity' },
  { value: 'SUBSIDIARY', label: 'Subsidiary of Parent Company' },
  { value: 'BRANCH', label: 'Branch Office' },
  { value: 'JOINT_VENTURE', label: 'Joint Venture' },
  { value: 'OTHER', label: 'Other' },
];

const IT_LEVEL_OPTIONS = [
  { value: '', label: 'Select level...' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export const Step1_2_StandingData: React.FC<Step1_2Props> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  onPrevious,
  isReadOnly = false
}) => {
  const handleInputChange = (field: keyof FSApplicationFormData) => (value: string) => {
    updateFormData({ [field]: value });
  };

  const handleCheckboxChange = (field: keyof FSApplicationFormData) => (checked: boolean) => {
    updateFormData({ [field]: checked });
  };

  const handleAddressChange = (field: string) => (value: string) => {
    updateFormData({
      headOfficeAddress: {
        ...formData.headOfficeAddress,
        [field]: value
      }
    });
  };

  const handleTradingNamesChange = (value: string) => {
    // Split by comma and clean up
    const names = value.split(',').map(name => name.trim()).filter(name => name.length > 0);
    updateFormData({ tradingNames: names });
  };

  const tradingNamesString = formData.tradingNames?.join(', ') || '';

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please provide complete and accurate information about your firm. This information will be used for
          regulatory assessment and ongoing supervision.
        </AlertDescription>
      </Alert>

      {/* Representative Office Check */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Application Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormCheckbox
            id="isRepresentativeOffice"
            label="This is an application for a Representative Office only"
            checked={formData.isRepresentativeOffice}
            onChange={handleCheckboxChange('isRepresentativeOffice')}
            disabled={isReadOnly}
            description="Representative Offices have limited activities and different requirements"
          />
        </CardContent>
      </Card>

      {/* Legal Structure */}
      {!formData.isRepresentativeOffice && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legal Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                id="legalStatus"
                label="Legal Status"
                value={formData.legalStatus || ''}
                onChange={handleInputChange('legalStatus')}
                options={LEGAL_STATUS_OPTIONS}
                required
                error={errors.legalStatus}
                disabled={isReadOnly}
              />

              <FormSelect
                id="generalStructure"
                label="General Structure"
                value={formData.generalStructure || ''}
                onChange={handleInputChange('generalStructure')}
                options={GENERAL_STRUCTURE_OPTIONS}
                required
                error={errors.generalStructure}
                disabled={isReadOnly}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Firm Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Firm Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="firmName"
            label="Firm Name"
            value={formData.firmName}
            onChange={handleInputChange('firmName')}
            required
            error={errors.firmName}
            disabled={isReadOnly}
            placeholder="Full legal name of the firm"
            maxLength={200}
          />

          <FormTextArea
            id="tradingNames"
            label="Trading Names (if any)"
            value={tradingNamesString}
            onChange={handleTradingNamesChange}
            error={errors.tradingNames}
            disabled={isReadOnly}
            placeholder="Enter trading names separated by commas"
            helpText="List any names under which the firm conducts business, separated by commas"
            rows={2}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              id="registeredCountry"
              label="Country of Registration"
              value={formData.registeredCountry}
              onChange={handleInputChange('registeredCountry')}
              options={COUNTRY_OPTIONS}
              required
              error={errors.registeredCountry}
              disabled={isReadOnly}
            />

            <FormInput
              id="registrationNumber"
              label="Registration Number"
              value={formData.registrationNumber || ''}
              onChange={handleInputChange('registrationNumber')}
              error={errors.registrationNumber}
              disabled={isReadOnly}
              placeholder="Company registration number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="registrationDate"
              label="Registration Date"
              type="date"
              value={formData.registrationDate || ''}
              onChange={handleInputChange('registrationDate')}
              error={errors.registrationDate}
              disabled={isReadOnly}
            />

            <FormInput
              id="financialYearEnd"
              label="Financial Year End"
              type="date"
              value={formData.financialYearEnd || ''}
              onChange={handleInputChange('financialYearEnd')}
              error={errors.financialYearEnd}
              disabled={isReadOnly}
              helpText="Date of your financial year end"
            />
          </div>
        </CardContent>
      </Card>

      {/* Head Office Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Head Office Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="headOfficeAddress.line1"
            label="Address Line 1"
            value={formData.headOfficeAddress.line1}
            onChange={handleAddressChange('line1')}
            required
            error={errors['headOfficeAddress.line1']}
            disabled={isReadOnly}
            placeholder="Street address, building name, floor"
          />

          <FormInput
            id="headOfficeAddress.line2"
            label="Address Line 2 (Optional)"
            value={formData.headOfficeAddress.line2 || ''}
            onChange={handleAddressChange('line2')}
            error={errors['headOfficeAddress.line2']}
            disabled={isReadOnly}
            placeholder="Additional address information"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              id="headOfficeAddress.city"
              label="City"
              value={formData.headOfficeAddress.city}
              onChange={handleAddressChange('city')}
              required
              error={errors['headOfficeAddress.city']}
              disabled={isReadOnly}
              placeholder="City name"
            />

            <FormInput
              id="headOfficeAddress.state"
              label="State/Emirate"
              value={formData.headOfficeAddress.state || ''}
              onChange={handleAddressChange('state')}
              error={errors['headOfficeAddress.state']}
              disabled={isReadOnly}
              placeholder="State or Emirate"
            />

            <FormInput
              id="headOfficeAddress.postalCode"
              label="Postal Code"
              value={formData.headOfficeAddress.postalCode || ''}
              onChange={handleAddressChange('postalCode')}
              error={errors['headOfficeAddress.postalCode']}
              disabled={isReadOnly}
              placeholder="Postal/ZIP code"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              id="headOfficeAddress.country"
              label="Country"
              value={formData.headOfficeAddress.country}
              onChange={handleAddressChange('country')}
              options={COUNTRY_OPTIONS}
              required
              error={errors['headOfficeAddress.country']}
              disabled={isReadOnly}
            />

            <FormInput
              id="headOfficeAddress.poBox"
              label="P.O. Box (Optional)"
              value={formData.headOfficeAddress.poBox || ''}
              onChange={handleAddressChange('poBox')}
              error={errors['headOfficeAddress.poBox']}
              disabled={isReadOnly}
              placeholder="P.O. Box number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Primary Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Primary Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="primaryContactName"
            label="Primary Contact Name"
            value={formData.primaryContactName}
            onChange={handleInputChange('primaryContactName')}
            required
            error={errors.primaryContactName}
            disabled={isReadOnly}
            placeholder="Full name of primary contact person"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="primaryContactEmail"
              label="Primary Contact Email"
              type="email"
              value={formData.primaryContactEmail}
              onChange={handleInputChange('primaryContactEmail')}
              required
              error={errors.primaryContactEmail}
              disabled={isReadOnly}
              placeholder="primary.contact@company.com"
            />

            <FormInput
              id="primaryContactPhone"
              label="Primary Contact Phone"
              type="tel"
              value={formData.primaryContactPhone}
              onChange={handleInputChange('primaryContactPhone')}
              required
              error={errors.primaryContactPhone}
              disabled={isReadOnly}
              placeholder="+971 4 XXX XXXX"
            />
          </div>
        </CardContent>
      </Card>

      {/* IT Systems */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">IT Systems Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please assess your firm's reliance on and complexity of IT systems for business operations.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              id="itReliance"
              label="IT Reliance Level"
              value={formData.itReliance}
              onChange={handleInputChange('itReliance')}
              options={IT_LEVEL_OPTIONS}
              required
              error={errors.itReliance}
              disabled={isReadOnly}
              helpText="How much does your business rely on IT systems?"
            />

            <FormSelect
              id="itComplexity"
              label="IT Complexity Level"
              value={formData.itComplexity}
              onChange={handleInputChange('itComplexity')}
              options={IT_LEVEL_OPTIONS}
              required
              error={errors.itComplexity}
              disabled={isReadOnly}
              helpText="How complex are your IT systems and infrastructure?"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
