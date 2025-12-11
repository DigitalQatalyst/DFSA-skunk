/**
 * DFSA Step 4-1: Waivers & Modifications
 *
 * Final submission step for waiver and modification requests.
 * Always visible.
 * Requirements: 1.4, 1.5
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Button } from '../../../ui/button';
import { Info, FileWarning, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData, WaiverRequest } from '../../../../types/dfsa';

export interface Step4_1Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Common waiver types
const COMMON_WAIVER_TYPES = [
  { value: 'capital_requirement', label: 'Capital Requirement Modification' },
  { value: 'staffing_requirement', label: 'Staffing Requirement Waiver' },
  { value: 'systems_requirement', label: 'Systems & Controls Modification' },
  { value: 'reporting_requirement', label: 'Reporting Requirement Waiver' },
  { value: 'conduct_requirement', label: 'Conduct of Business Modification' },
  { value: 'other', label: 'Other Waiver/Modification' }
];

const createEmptyWaiver = (): WaiverRequest => ({
  requirement: '',
  justification: '',
  alternativeApproach: ''
});

export const Step4_1_WaiversModifications: React.FC<Step4_1Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  const [hasWaiverRequests, setHasWaiverRequests] = useState<boolean>(
    (formData.waiverRequests && formData.waiverRequests.length > 0) || false
  );

  const waiverRequests = formData.waiverRequests || [];

  const handleHasWaiversChange = (checked: boolean) => {
    setHasWaiverRequests(checked);
    if (checked && waiverRequests.length === 0) {
      // Add an empty waiver request when user indicates they want to request waivers
      updateFormData({
        waiverRequests: [createEmptyWaiver()]
      });
    } else if (!checked) {
      // Clear waiver requests when user indicates no waivers needed
      updateFormData({
        waiverRequests: []
      });
    }
  };

  const handleAddWaiver = () => {
    updateFormData({
      waiverRequests: [...waiverRequests, createEmptyWaiver()]
    });
  };

  const handleRemoveWaiver = (index: number) => {
    const updated = waiverRequests.filter((_, i) => i !== index);
    updateFormData({
      waiverRequests: updated
    });
    if (updated.length === 0) {
      setHasWaiverRequests(false);
    }
  };

  const handleWaiverChange = (index: number, field: keyof WaiverRequest, value: string) => {
    const updated = waiverRequests.map((waiver, i) => {
      if (i === index) {
        return { ...waiver, [field]: value };
      }
      return waiver;
    });
    updateFormData({
      waiverRequests: updated
    });
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          If you wish to request any waivers or modifications to standard DFSA requirements,
          please provide details below. Waiver requests are subject to DFSA review and approval.
          Most applications do not require waivers.
        </AlertDescription>
      </Alert>

      {/* Waiver Request Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileWarning className="w-5 h-5" />
            Waiver & Modification Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="hasWaiverRequests"
            label="I wish to request one or more waivers or modifications to standard DFSA requirements"
            checked={hasWaiverRequests}
            onChange={handleHasWaiversChange}
            disabled={isReadOnly}
            description="Select this option only if you have specific requirements that cannot be met and need DFSA consideration for alternative arrangements."
          />

          {!hasWaiverRequests && (
            <Alert className="bg-green-50 border-green-200">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                No waiver requests will be submitted with this application. You can proceed to the next step.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>


      {/* Waiver Request Forms */}
      {hasWaiverRequests && (
        <div className="space-y-4">
          {waiverRequests.map((waiver, index) => (
            <Card key={index} className="border-orange-200 bg-orange-50/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Waiver Request {index + 1}
                  </CardTitle>
                  {!isReadOnly && waiverRequests.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveWaiver(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  id={`waiver-requirement-${index}`}
                  label="Requirement to be Waived/Modified"
                  value={waiver.requirement}
                  onChange={(value) => handleWaiverChange(index, 'requirement', value)}
                  placeholder="e.g., PIB Rule 3.6.1 - Minimum Capital Requirement"
                  required
                  error={errors[`waiverRequests.${index}.requirement`]}
                  disabled={isReadOnly}
                  helpText="Specify the exact DFSA rule or requirement you are requesting to be waived or modified"
                />

                <FormTextArea
                  id={`waiver-justification-${index}`}
                  label="Justification for Waiver/Modification"
                  value={waiver.justification}
                  onChange={(value) => handleWaiverChange(index, 'justification', value)}
                  placeholder="Explain why you are unable to comply with the standard requirement and the circumstances that justify a waiver or modification..."
                  rows={4}
                  required
                  error={errors[`waiverRequests.${index}.justification`]}
                  disabled={isReadOnly}
                  maxLength={2000}
                />

                <FormTextArea
                  id={`waiver-alternative-${index}`}
                  label="Proposed Alternative Approach"
                  value={waiver.alternativeApproach || ''}
                  onChange={(value) => handleWaiverChange(index, 'alternativeApproach', value)}
                  placeholder="Describe any alternative measures or arrangements you propose to implement in place of the standard requirement..."
                  rows={3}
                  error={errors[`waiverRequests.${index}.alternativeApproach`]}
                  disabled={isReadOnly}
                  maxLength={1500}
                />
              </CardContent>
            </Card>
          ))}

          {/* Add Another Waiver Button */}
          {!isReadOnly && (
            <Button
              variant="outline"
              onClick={handleAddWaiver}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Waiver Request
            </Button>
          )}
        </div>
      )}

      {/* Important Notice */}
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Important:</strong> Waiver requests are reviewed on a case-by-case basis by DFSA.
          Submitting a waiver request does not guarantee approval. DFSA may request additional
          information or impose conditions on any waiver granted. Processing of applications
          with waiver requests may take longer than standard applications.
        </AlertDescription>
      </Alert>
    </div>
  );
};
