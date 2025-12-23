/**
 * DFSA Step 1-4: Controllers & Group Structure
 *
 * Controller information and group structure details
 * Requirements: 1.1, 1.3, 6.4, 7.2
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Separator } from '../../../ui/separator';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Badge } from '../../../ui/badge';
import { Info, Plus, Trash2, UserCheck, Upload, FileText, Download } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormCheckbox } from '../FormCheckbox';
import { FormTextArea } from '../FormTextArea';
import { FSApplicationFormData, Controller } from '../../../../types/dfsa';

export interface Step1_4Props {
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

const CONTROLLER_ROLE_OPTIONS = [
  { value: '', label: 'Select role...' },
  { value: 'CEO', label: 'Chief Executive Officer' },
  { value: 'CHAIRMAN', label: 'Chairman' },
  { value: 'DIRECTOR', label: 'Director' },
  { value: 'MANAGING_DIRECTOR', label: 'Managing Director' },
  { value: 'SENIOR_MANAGER', label: 'Senior Manager' },
  { value: 'PARTNER', label: 'Partner' },
  { value: 'OTHER', label: 'Other' },
];

const CONTROL_TYPE_OPTIONS = [
  { value: '', label: 'Select control type...' },
  { value: 'SHAREHOLDING', label: 'Shareholding Control' },
  { value: 'VOTING_RIGHTS', label: 'Voting Rights Control' },
  { value: 'BOARD_CONTROL', label: 'Board Control' },
  { value: 'MANAGEMENT_CONTROL', label: 'Management Control' },
  { value: 'CONTRACTUAL', label: 'Contractual Control' },
  { value: 'OTHER', label: 'Other' },
];

export const Step1_4_ControllersGroupStructure: React.FC<Step1_4Props> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  onPrevious,
  isReadOnly = false
}) => {
  const [fileUploadError, setFileUploadError] = useState<string>('');

  const handleCheckboxChange = (field: keyof FSApplicationFormData) => (checked: boolean) => {
    updateFormData({ [field]: checked });
  };

  const handleInputChange = (field: keyof FSApplicationFormData) => (value: string) => {
    updateFormData({ [field]: value });
  };

  // Controller management
  const addController = () => {
    const newController: Controller = {
      name: '',
      role: '',
      controlType: '',
      percentage: 0,
      nationality: ''
    };

    updateFormData({
      controllers: [...(formData.controllers || []), newController]
    });
  };

  const updateController = (index: number, updates: Partial<Controller>) => {
    const updatedControllers = [...(formData.controllers || [])];
    updatedControllers[index] = { ...updatedControllers[index], ...updates };
    updateFormData({ controllers: updatedControllers });
  };

  const removeController = (index: number) => {
    const updatedControllers = [...(formData.controllers || [])];
    updatedControllers.splice(index, 1);
    updateFormData({ controllers: updatedControllers });
  };

  // File upload handling (simplified for now - will be enhanced in document upload task)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setFileUploadError('Please upload a PDF, DOCX, JPG, or PNG file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setFileUploadError('File size must be less than 10MB');
      return;
    }

    setFileUploadError('');

    // Convert to base64 for storage (temporary solution)
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = {
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        fileData: e.target?.result as string,
        uploadDate: new Date().toISOString()
      };

      updateFormData({ groupStructureChart: fileData });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    updateFormData({ groupStructureChart: undefined });
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please provide information about individuals who exercise control over the firm and describe the group structure if applicable.
          Controllers include those with significant influence over management or operations, regardless of shareholding.
        </AlertDescription>
      </Alert>

      {/* Controllers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Controllers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="hasControllers"
            label="This firm has controllers (individuals exercising significant control)"
            checked={formData.hasControllers}
            onChange={handleCheckboxChange('hasControllers')}
            disabled={isReadOnly}
            description="Controllers include those with significant influence over management, operations, or strategic decisions"
          />

          {formData.hasControllers && (
            <div className="space-y-4">
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Controller Details</h4>
                  <p className="text-sm text-gray-600">
                    List all individuals who exercise significant control over the firm
                  </p>
                </div>
                {formData.controllers && formData.controllers.length > 0 && (
                  <Badge variant="secondary">
                    {formData.controllers.length} controller{formData.controllers.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>

              {formData.controllers && formData.controllers.length > 0 ? (
                <div className="space-y-4">
                  {formData.controllers.map((controller, index) => (
                    <Card key={index} className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-4">
                          <h5 className="font-medium">Controller {index + 1}</h5>
                          {!isReadOnly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeController(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            id={`controller-${index}-name`}
                            label="Full Name"
                            value={controller.name}
                            onChange={(value) => updateController(index, { name: value })}
                            required
                            disabled={isReadOnly}
                            placeholder="Controller's full name"
                          />

                          <FormSelect
                            id={`controller-${index}-role`}
                            label="Role/Position"
                            value={controller.role}
                            onChange={(value) => updateController(index, { role: value })}
                            options={CONTROLLER_ROLE_OPTIONS}
                            required
                            disabled={isReadOnly}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <FormSelect
                            id={`controller-${index}-controlType`}
                            label="Type of Control"
                            value={controller.controlType}
                            onChange={(value) => updateController(index, { controlType: value })}
                            options={CONTROL_TYPE_OPTIONS}
                            required
                            disabled={isReadOnly}
                          />

                          <FormInput
                            id={`controller-${index}-percentage`}
                            label="Control Percentage (if applicable)"
                            type="number"
                            value={controller.percentage?.toString() || ''}
                            onChange={(value) => updateController(index, { percentage: parseFloat(value) || 0 })}
                            disabled={isReadOnly}
                            placeholder="0.00"
                            helpText="Leave blank if not percentage-based"
                          />

                          <FormSelect
                            id={`controller-${index}-nationality`}
                            label="Nationality"
                            value={controller.nationality}
                            onChange={(value) => updateController(index, { nationality: value })}
                            options={COUNTRY_OPTIONS}
                            required
                            disabled={isReadOnly}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No controllers added yet</p>
                </div>
              )}

              {!isReadOnly && (
                <Button
                  variant="outline"
                  onClick={addController}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Controller
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Group Structure Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Group Structure Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            id="groupStructureDescription"
            label="Group Structure Description"
            value={formData.groupStructureDescription || ''}
            onChange={handleInputChange('groupStructureDescription')}
            error={errors.groupStructureDescription}
            disabled={isReadOnly}
            placeholder="Describe the overall group structure, including parent companies, subsidiaries, and related entities..."
            helpText="Provide a clear description of how the firm fits within any group structure"
            rows={6}
            maxLength={1000}
          />
        </CardContent>
      </Card>

      {/* Group Structure Chart Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Group Structure Chart
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please upload an organizational chart showing the group structure, ownership relationships, and control mechanisms.
              Accepted formats: PDF, DOCX, JPG, PNG (max 10MB).
            </AlertDescription>
          </Alert>

          {formData.groupStructureChart ? (
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">
                      {formData.groupStructureChart.fileName}
                    </p>
                    <p className="text-sm text-green-700">
                      {(formData.groupStructureChart.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-green-600">
                      Uploaded: {new Date(formData.groupStructureChart.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // In a real implementation, this would download the file
                      console.log('Download file:', formData.groupStructureChart?.fileName);
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>

                  {!isReadOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <div className="space-y-2">
                <p className="text-gray-600">Upload group structure chart</p>
                <p className="text-sm text-gray-500">
                  PDF, DOCX, JPG, or PNG files up to 10MB
                </p>
              </div>

              {!isReadOnly && (
                <div className="mt-4">
                  <input
                    type="file"
                    id="groupStructureChart"
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('groupStructureChart')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>
          )}

          {fileUploadError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {fileUploadError}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
