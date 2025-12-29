/**
 * DFSA Step 1-1: Introduction & Disclosure
 *
 * First step of the financial services application form
 * Requirements: 1.1, 6.4, 7.2
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Separator } from '../../../ui/separator';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, AlertTriangle } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step1_1Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

export const Step1_1_IntroductionDisclosure: React.FC<Step1_1Props> = ({
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

  return (
    <div className="space-y-6">
      {/* Instructions Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please read the instructions carefully before completing this application. All fields marked with an asterisk (*) are required.
          Ensure all information provided is accurate and complete.
        </AlertDescription>
      </Alert>

      {/* Q1-Q4: Submitter Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Submitter Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="submitterName"
              label="Full Name"
              value={formData.submitterName}
              onChange={handleInputChange('submitterName')}
              required
              error={errors.submitterName}
              disabled={isReadOnly}
              placeholder="Enter your full name"
            />

            <FormInput
              id="submitterFunction"
              label="Function/Title"
              value={formData.submitterFunction}
              onChange={handleInputChange('submitterFunction')}
              required
              error={errors.submitterFunction}
              disabled={isReadOnly}
              placeholder="e.g., CEO, Director, Legal Counsel"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="submitterEmail"
              label="Email Address"
              type="email"
              value={formData.submitterEmail}
              onChange={handleInputChange('submitterEmail')}
              required
              error={errors.submitterEmail}
              disabled={isReadOnly}
              placeholder="your.email@company.com"
            />

            <FormInput
              id="submitterPhone"
              label="Phone Number"
              type="tel"
              value={formData.submitterPhone}
              onChange={handleInputChange('submitterPhone')}
              required
              error={errors.submitterPhone}
              disabled={isReadOnly}
              placeholder="+971 4 XXX XXXX"
            />
          </div>
        </CardContent>
      </Card>

      {/* Q5: Contact Person Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Person</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="contactPersonInternal"
            label="I am an internal contact person for this application"
            checked={formData.contactPersonInternal}
            onChange={handleCheckboxChange('contactPersonInternal')}
            disabled={isReadOnly}
            description="Check this if you are employed by or are a director/partner of the applicant firm"
          />

          {/* Q6-Q8: External Adviser Information (conditional) */}
          {!formData.contactPersonInternal && (
            <>
              <Separator className="my-4" />
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">External Adviser Information</h4>
                <p className="text-sm text-gray-600">
                  Since you are not an internal contact person, please provide details of the external adviser.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    id="externalAdviserName"
                    label="Adviser Name"
                    value={formData.externalAdviserName || ''}
                    onChange={handleInputChange('externalAdviserName')}
                    required={!formData.contactPersonInternal}
                    error={errors.externalAdviserName}
                    disabled={isReadOnly}
                    placeholder="Full name of external adviser"
                  />

                  <FormInput
                    id="externalAdviserEmail"
                    label="Adviser Email"
                    type="email"
                    value={formData.externalAdviserEmail || ''}
                    onChange={handleInputChange('externalAdviserEmail')}
                    required={!formData.contactPersonInternal}
                    error={errors.externalAdviserEmail}
                    disabled={isReadOnly}
                    placeholder="adviser@company.com"
                  />
                </div>

                <FormInput
                  id="externalAdviserCompany"
                  label="Adviser Company"
                  value={formData.externalAdviserCompany || ''}
                  onChange={handleInputChange('externalAdviserCompany')}
                  required={!formData.contactPersonInternal}
                  error={errors.externalAdviserCompany}
                  disabled={isReadOnly}
                  placeholder="Name of adviser's company/firm"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Q9-Q10: Declarations and Confirmations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Declarations and Confirmations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please read each declaration carefully and confirm your agreement by checking the boxes below.
              All declarations must be confirmed to proceed with the application.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <FormCheckbox
              id="instructionsConfirmed"
              label="I confirm that I have read and understood the application instructions"
              checked={formData.instructionsConfirmed}
              onChange={handleCheckboxChange('instructionsConfirmed')}
              required
              error={errors.instructionsConfirmed}
              disabled={isReadOnly}
              description="This includes all guidance documents and requirements for financial services applications"
            />

            <FormCheckbox
              id="disclosureAcknowledged"
              label="I acknowledge the disclosure statement regarding regulatory obligations"
              checked={formData.disclosureAcknowledged}
              onChange={handleCheckboxChange('disclosureAcknowledged')}
              required
              error={errors.disclosureAcknowledged}
              disabled={isReadOnly}
              description="I understand the ongoing compliance and reporting requirements"
            />

            <FormCheckbox
              id="informationAccurate"
              label="I confirm that all information provided in this application is accurate and complete"
              checked={formData.informationAccurate}
              onChange={handleCheckboxChange('informationAccurate')}
              required
              error={errors.informationAccurate}
              disabled={isReadOnly}
              description="I understand that providing false or misleading information may result in application rejection"
            />

            <FormCheckbox
              id="authorizedToSubmit"
              label="I am authorized to submit this application on behalf of the applicant"
              checked={formData.authorizedToSubmit}
              onChange={handleCheckboxChange('authorizedToSubmit')}
              required
              error={errors.authorizedToSubmit}
              disabled={isReadOnly}
              description="I have the necessary authority from the applicant to make this submission"
            />

            <FormCheckbox
              id="difcaConsent"
              label="I consent to DFSA sharing information with DIFCA as required"
              checked={formData.difcaConsent}
              onChange={handleCheckboxChange('difcaConsent')}
              required
              error={errors.difcaConsent}
              disabled={isReadOnly}
              description="This includes information sharing for regulatory and compliance purposes"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
