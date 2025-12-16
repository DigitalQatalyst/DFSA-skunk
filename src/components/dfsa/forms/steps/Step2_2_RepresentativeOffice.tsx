/**
 * DFSA Step 2-2: Representative Office
 *
 * Activity-specific step for representative office applications
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, Building, Globe, Users, FileText } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_2Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Parent company regulatory status options
const REGULATORY_STATUS_OPTIONS = [
  { value: 'regulated_home', label: 'Regulated in Home Jurisdiction' },
  { value: 'regulated_multiple', label: 'Regulated in Multiple Jurisdictions' },
  { value: 'not_regulated', label: 'Not Currently Regulated' },
  { value: 'pending_regulation', label: 'Regulation Pending' }
];

// Activities that can be conducted
const REP_OFFICE_ACTIVITIES = [
  { id: 'marketing', label: 'Marketing and promotional activities' },
  { id: 'liaison', label: 'Liaison with existing clients' },
  { id: 'research', label: 'Market research and analysis' },
  { id: 'referral', label: 'Referral of potential clients to head office' },
  { id: 'support', label: 'Administrative support for head office' },
  { id: 'relationship', label: 'Relationship management' }
];

export const Step2_2_RepresentativeOffice: React.FC<Step2_2Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  // Initialize representative office data if not present
  const repOfficeData = (formData as any).representativeOffice || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      representativeOffice: {
        ...repOfficeData,
        [field]: value
      }
    } as any);
  };

  const handleActivityToggle = (activityId: string, checked: boolean) => {
    const currentActivities = repOfficeData.plannedActivities || [];
    let updatedActivities;

    if (checked) {
      updatedActivities = [...currentActivities, activityId];
    } else {
      updatedActivities = currentActivities.filter((a: string) => a !== activityId);
    }

    handleFieldChange('plannedActivities', updatedActivities);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          A Representative Office is permitted to conduct limited activities on behalf of its parent company.
          It cannot conduct regulated financial services activities or enter into contracts with clients.
        </AlertDescription>
      </Alert>

      {/* Parent Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="w-5 h-5" />
            Parent Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="parentCompanyName"
            label="Parent Company Name"
            value={repOfficeData.parentCompanyName || ''}
            onChange={(value) => handleFieldChange('parentCompanyName', value)}
            required
            placeholder="Enter parent company name"
            error={errors['representativeOffice.parentCompanyName']}
            disabled={isReadOnly}
          />

          <FormInput
            id="parentCompanyCountry"
            label="Country of Incorporation"
            value={repOfficeData.parentCompanyCountry || ''}
            onChange={(value) => handleFieldChange('parentCompanyCountry', value)}
            required
            placeholder="Enter country"
            error={errors['representativeOffice.parentCompanyCountry']}
            disabled={isReadOnly}
          />

          <FormSelect
            id="parentRegulatoryStatus"
            label="Regulatory Status of Parent Company"
            value={repOfficeData.parentRegulatoryStatus || ''}
            onChange={(value) => handleFieldChange('parentRegulatoryStatus', value)}
            options={REGULATORY_STATUS_OPTIONS}
            required
            error={errors['representativeOffice.parentRegulatoryStatus']}
            placeholder="Select regulatory status"
            disabled={isReadOnly}
          />

          <FormInput
            id="parentRegulator"
            label="Name of Regulator (if applicable)"
            value={repOfficeData.parentRegulator || ''}
            onChange={(value) => handleFieldChange('parentRegulator', value)}
            placeholder="Enter regulator name"
            error={errors['representativeOffice.parentRegulator']}
            disabled={isReadOnly}
          />

          <FormInput
            id="parentLicenseNumber"
            label="License/Registration Number (if applicable)"
            value={repOfficeData.parentLicenseNumber || ''}
            onChange={(value) => handleFieldChange('parentLicenseNumber', value)}
            placeholder="Enter license number"
            error={errors['representativeOffice.parentLicenseNumber']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Parent Company Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Parent Company Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            id="parentBusinessDescription"
            label="Description of Parent Company's Business"
            value={repOfficeData.parentBusinessDescription || ''}
            onChange={(value) => handleFieldChange('parentBusinessDescription', value)}
            required
            placeholder="Describe the main business activities of the parent company..."
            rows={4}
            error={errors['representativeOffice.parentBusinessDescription']}
            disabled={isReadOnly}
          />

          <FormInput
            id="parentYearsInBusiness"
            label="Years in Business"
            value={repOfficeData.parentYearsInBusiness || ''}
            onChange={(value) => handleFieldChange('parentYearsInBusiness', value)}
            type="number"
            placeholder="Enter number of years"
            error={errors['representativeOffice.parentYearsInBusiness']}
            disabled={isReadOnly}
          />

          <FormInput
            id="parentEmployeeCount"
            label="Number of Employees (Global)"
            value={repOfficeData.parentEmployeeCount || ''}
            onChange={(value) => handleFieldChange('parentEmployeeCount', value)}
            type="number"
            placeholder="Enter employee count"
            error={errors['representativeOffice.parentEmployeeCount']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Planned Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Planned Activities in DIFC
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the activities the Representative Office intends to conduct:
          </p>

          <div className="space-y-3">
            {REP_OFFICE_ACTIVITIES.map((activity) => (
              <FormCheckbox
                key={activity.id}
                id={`activity_${activity.id}`}
                label={activity.label}
                checked={(repOfficeData.plannedActivities || []).includes(activity.id)}
                onChange={(checked) => handleActivityToggle(activity.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          {errors['representativeOffice.plannedActivities'] && (
            <p className="text-sm text-red-600 mt-2">
              {errors['representativeOffice.plannedActivities']}
            </p>
          )}

          <FormTextArea
            id="activitiesDescription"
            label="Detailed Description of Planned Activities"
            value={repOfficeData.activitiesDescription || ''}
            onChange={(value) => handleFieldChange('activitiesDescription', value)}
            required
            placeholder="Provide a detailed description of the activities the Representative Office will conduct..."
            rows={4}
            error={errors['representativeOffice.activitiesDescription']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Staffing & Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Staffing & Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="proposedStaffCount"
            label="Proposed Number of Staff in DIFC"
            value={repOfficeData.proposedStaffCount || ''}
            onChange={(value) => handleFieldChange('proposedStaffCount', value)}
            type="number"
            required
            placeholder="Enter number of staff"
            error={errors['representativeOffice.proposedStaffCount']}
            disabled={isReadOnly}
          />

          <FormInput
            id="headOfOffice"
            label="Proposed Head of Representative Office"
            value={repOfficeData.headOfOffice || ''}
            onChange={(value) => handleFieldChange('headOfOffice', value)}
            required
            placeholder="Enter name"
            error={errors['representativeOffice.headOfOffice']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="headOfOfficeExperience"
            label="Head of Office - Relevant Experience"
            value={repOfficeData.headOfOfficeExperience || ''}
            onChange={(value) => handleFieldChange('headOfOfficeExperience', value)}
            placeholder="Describe the relevant experience of the proposed Head of Office..."
            rows={3}
            error={errors['representativeOffice.headOfOfficeExperience']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="confirmNoRegulatedActivities"
            label="I confirm that the Representative Office will not conduct any regulated financial services activities"
            checked={repOfficeData.confirmNoRegulatedActivities || false}
            onChange={(checked) => handleFieldChange('confirmNoRegulatedActivities', checked)}
            required
            error={errors['representativeOffice.confirmNoRegulatedActivities']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
