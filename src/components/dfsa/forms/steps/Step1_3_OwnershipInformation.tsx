/**
 * DFSA Step 1-3: Ownership Information
 *
 * Shareholder and ownership structure information
 * Requirements: 1.1, 1.3, 6.4, 7.2
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Separator } from '../../../ui/separator';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Badge } from '../../../ui/badge';
import { Info, Plus, Trash2, Users, Building } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData, Shareholder, BeneficialOwner } from '../../../../types/dfsa';

export interface Step1_3Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Country options (simplified)
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
];

const ENTITY_TYPE_OPTIONS = [
  { value: '', label: 'Select entity type...' },
  { value: 'CORPORATION', label: 'Corporation' },
  { value: 'LLC', label: 'Limited Liability Company' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'TRUST', label: 'Trust' },
  { value: 'FUND', label: 'Investment Fund' },
  { value: 'GOVERNMENT', label: 'Government Entity' },
  { value: 'OTHER', label: 'Other' },
];

export const Step1_3_OwnershipInformation: React.FC<Step1_3Props> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  onPrevious,
  isReadOnly = false
}) => {
  const [activeTab, setActiveTab] = useState<'shareholders' | 'beneficial'>('shareholders');

  const handleCheckboxChange = (field: keyof FSApplicationFormData) => (checked: boolean) => {
    updateFormData({ [field]: checked });
  };

  const handleInputChange = (field: keyof FSApplicationFormData) => (value: string) => {
    updateFormData({ [field]: value });
  };

  // Shareholder management
  const addShareholder = () => {
    const newShareholder: Shareholder = {
      name: '',
      percentage: 0,
      country: '',
      isIndividual: true,
      entityType: ''
    };

    updateFormData({
      shareholders: [...(formData.shareholders || []), newShareholder]
    });
  };

  const updateShareholder = (index: number, updates: Partial<Shareholder>) => {
    const updatedShareholders = [...(formData.shareholders || [])];
    updatedShareholders[index] = { ...updatedShareholders[index], ...updates };
    updateFormData({ shareholders: updatedShareholders });
  };

  const removeShareholder = (index: number) => {
    const updatedShareholders = [...(formData.shareholders || [])];
    updatedShareholders.splice(index, 1);
    updateFormData({ shareholders: updatedShareholders });
  };

  // Beneficial owner management
  const addBeneficialOwner = () => {
    const newOwner: BeneficialOwner = {
      name: '',
      percentage: 0,
      nationality: '',
      dateOfBirth: '',
      passportNumber: ''
    };

    updateFormData({
      beneficialOwners: [...(formData.beneficialOwners || []), newOwner]
    });
  };

  const updateBeneficialOwner = (index: number, updates: Partial<BeneficialOwner>) => {
    const updatedOwners = [...(formData.beneficialOwners || [])];
    updatedOwners[index] = { ...updatedOwners[index], ...updates };
    updateFormData({ beneficialOwners: updatedOwners });
  };

  const removeBeneficialOwner = (index: number) => {
    const updatedOwners = [...(formData.beneficialOwners || [])];
    updatedOwners.splice(index, 1);
    updateFormData({ beneficialOwners: updatedOwners });
  };

  // Calculate total shareholding percentage
  const totalShareholding = (formData.shareholders || []).reduce((sum, sh) => sum + (sh.percentage || 0), 0);
  const totalBeneficial = (formData.beneficialOwners || []).reduce((sum, bo) => sum + (bo.percentage || 0), 0);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please provide complete ownership information. All shareholders with 5% or more ownership must be disclosed.
          Beneficial owners with 25% or more ultimate ownership must also be identified.
        </AlertDescription>
      </Alert>

      {/* Group Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="w-5 h-5" />
            Group Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="isPartOfGroup"
            label="This firm is part of a group structure"
            checked={formData.isPartOfGroup}
            onChange={handleCheckboxChange('isPartOfGroup')}
            disabled={isReadOnly}
            description="Check if this firm has parent companies, subsidiaries, or related entities"
          />

          {formData.isPartOfGroup && (
            <FormInput
              id="ultimateHoldingCompany"
              label="Ultimate Holding Company"
              value={formData.ultimateHoldingCompany || ''}
              onChange={handleInputChange('ultimateHoldingCompany')}
              required={formData.isPartOfGroup}
              error={errors.ultimateHoldingCompany}
              disabled={isReadOnly}
              placeholder="Name of the ultimate parent company"
            />
          )}
        </CardContent>
      </Card>

      {/* Public Listing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Public Listing Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="publiclyListed"
            label="This firm (or its parent) is publicly listed"
            checked={formData.publiclyListed || false}
            onChange={handleCheckboxChange('publiclyListed')}
            disabled={isReadOnly}
            description="Check if the firm or any parent company is listed on a stock exchange"
          />

          {formData.publiclyListed && (
            <FormInput
              id="listingExchange"
              label="Stock Exchange"
              value={formData.listingExchange || ''}
              onChange={handleInputChange('listingExchange')}
              required={formData.publiclyListed}
              error={errors.listingExchange}
              disabled={isReadOnly}
              placeholder="e.g., Dubai Financial Market, NASDAQ, LSE"
            />
          )}
        </CardContent>
      </Card>

      {/* Ownership Information Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Ownership Information
          </CardTitle>
          <div className="flex space-x-1 mt-4">
            <Button
              variant={activeTab === 'shareholders' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('shareholders')}
              disabled={isReadOnly}
            >
              Shareholders
              {formData.shareholders && formData.shareholders.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {formData.shareholders.length}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === 'beneficial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('beneficial')}
              disabled={isReadOnly}
            >
              Beneficial Owners
              {formData.beneficialOwners && formData.beneficialOwners.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {formData.beneficialOwners.length}
                </Badge>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Shareholders Tab */}
          {activeTab === 'shareholders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Shareholders (5% or more)</h4>
                  <p className="text-sm text-gray-600">
                    List all shareholders with 5% or more ownership
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Total: {totalShareholding.toFixed(2)}%
                  </p>
                  {totalShareholding > 100 && (
                    <p className="text-sm text-red-600">Exceeds 100%</p>
                  )}
                </div>
              </div>

              {formData.shareholders && formData.shareholders.length > 0 ? (
                <div className="space-y-4">
                  {formData.shareholders.map((shareholder, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-4">
                          <h5 className="font-medium">Shareholder {index + 1}</h5>
                          {!isReadOnly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeShareholder(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            id={`shareholder-${index}-name`}
                            label="Name"
                            value={shareholder.name}
                            onChange={(value) => updateShareholder(index, { name: value })}
                            required
                            disabled={isReadOnly}
                            placeholder="Shareholder name"
                          />

                          <FormInput
                            id={`shareholder-${index}-percentage`}
                            label="Ownership Percentage"
                            type="number"
                            value={shareholder.percentage?.toString() || ''}
                            onChange={(value) => updateShareholder(index, { percentage: parseFloat(value) || 0 })}
                            required
                            disabled={isReadOnly}
                            placeholder="0.00"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormSelect
                            id={`shareholder-${index}-country`}
                            label="Country"
                            value={shareholder.country}
                            onChange={(value) => updateShareholder(index, { country: value })}
                            options={COUNTRY_OPTIONS}
                            required
                            disabled={isReadOnly}
                          />

                          <div className="space-y-2">
                            <FormCheckbox
                              id={`shareholder-${index}-individual`}
                              label="Individual (not entity)"
                              checked={shareholder.isIndividual}
                              onChange={(checked) => updateShareholder(index, { isIndividual: checked })}
                              disabled={isReadOnly}
                            />

                            {!shareholder.isIndividual && (
                              <FormSelect
                                id={`shareholder-${index}-entityType`}
                                label="Entity Type"
                                value={shareholder.entityType || ''}
                                onChange={(value) => updateShareholder(index, { entityType: value })}
                                options={ENTITY_TYPE_OPTIONS}
                                required={!shareholder.isIndividual}
                                disabled={isReadOnly}
                              />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No shareholders added yet</p>
                </div>
              )}

              {!isReadOnly && (
                <Button
                  variant="outline"
                  onClick={addShareholder}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Shareholder
                </Button>
              )}
            </div>
          )}

          {/* Beneficial Owners Tab */}
          {activeTab === 'beneficial' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Beneficial Owners (25% or more)</h4>
                  <p className="text-sm text-gray-600">
                    List individuals with 25% or more ultimate beneficial ownership
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Total: {totalBeneficial.toFixed(2)}%
                  </p>
                </div>
              </div>

              {formData.beneficialOwners && formData.beneficialOwners.length > 0 ? (
                <div className="space-y-4">
                  {formData.beneficialOwners.map((owner, index) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-4">
                          <h5 className="font-medium">Beneficial Owner {index + 1}</h5>
                          {!isReadOnly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBeneficialOwner(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            id={`beneficial-${index}-name`}
                            label="Full Name"
                            value={owner.name}
                            onChange={(value) => updateBeneficialOwner(index, { name: value })}
                            required
                            disabled={isReadOnly}
                            placeholder="Full legal name"
                          />

                          <FormInput
                            id={`beneficial-${index}-percentage`}
                            label="Beneficial Ownership %"
                            type="number"
                            value={owner.percentage?.toString() || ''}
                            onChange={(value) => updateBeneficialOwner(index, { percentage: parseFloat(value) || 0 })}
                            required
                            disabled={isReadOnly}
                            placeholder="0.00"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <FormSelect
                            id={`beneficial-${index}-nationality`}
                            label="Nationality"
                            value={owner.nationality}
                            onChange={(value) => updateBeneficialOwner(index, { nationality: value })}
                            options={COUNTRY_OPTIONS}
                            required
                            disabled={isReadOnly}
                          />

                          <FormInput
                            id={`beneficial-${index}-dob`}
                            label="Date of Birth"
                            type="date"
                            value={owner.dateOfBirth || ''}
                            onChange={(value) => updateBeneficialOwner(index, { dateOfBirth: value })}
                            disabled={isReadOnly}
                          />

                          <FormInput
                            id={`beneficial-${index}-passport`}
                            label="Passport Number"
                            value={owner.passportNumber || ''}
                            onChange={(value) => updateBeneficialOwner(index, { passportNumber: value })}
                            disabled={isReadOnly}
                            placeholder="Passport or ID number"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No beneficial owners added yet</p>
                </div>
              )}

              {!isReadOnly && (
                <Button
                  variant="outline"
                  onClick={addBeneficialOwner}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Beneficial Owner
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
