/**
 * DFSA Step 4-3: Fit & Proper Declarations
 *
 * Final submission step for individual declarations from key personnel.
 * Always visible.
 * Requirements: 1.4, 1.5
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Separator } from '../../../ui/separator';
import { Info, UserCheck, Plus, Trash2, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData, IndividualDeclaration } from '../../../../types/dfsa';

export interface Step4_3Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Key personnel roles that require declarations
const PERSONNEL_ROLES = [
  { value: 'senior_executive_officer', label: 'Senior Executive Officer (SEO)' },
  { value: 'finance_officer', label: 'Finance Officer' },
  { value: 'compliance_officer', label: 'Compliance Officer' },
  { value: 'mlro', label: 'Money Laundering Reporting Officer (MLRO)' },
  { value: 'risk_officer', label: 'Risk Officer' },
  { value: 'director', label: 'Director' },
  { value: 'controller', label: 'Controller' },
  { value: 'licensed_function', label: 'Licensed Function Holder' },
  { value: 'other', label: 'Other Key Personnel' }
];

const createEmptyDeclaration = (): IndividualDeclaration => ({
  personName: '',
  role: '',
  declarationSigned: false,
  signedDate: undefined
});

export const Step4_3_FitProperDeclarations: React.FC<Step4_3Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  const declarations = formData.individualDeclarations || [];

  const handleAddDeclaration = () => {
    updateFormData({
      individualDeclarations: [...declarations, createEmptyDeclaration()]
    });
  };

  const handleRemoveDeclaration = (index: number) => {
    const updated = declarations.filter((_, i) => i !== index);
    updateFormData({
      individualDeclarations: updated
    });
  };

  const handleDeclarationChange = (
    index: number,
    field: keyof IndividualDeclaration,
    value: string | boolean
  ) => {
    const updated = declarations.map((declaration, i) => {
      if (i === index) {
        const updatedDeclaration = { ...declaration, [field]: value };
        // Auto-set signed date when declaration is signed
        if (field === 'declarationSigned' && value === true) {
          updatedDeclaration.signedDate = new Date().toISOString().split('T')[0];
        }
        return updatedDeclaration;
      }
      return declaration;
    });
    updateFormData({
      individualDeclarations: updated
    });
  };

  // Calculate completion status
  const completedDeclarations = declarations.filter(d => d.declarationSigned && d.personName && d.role);
  const allDeclarationsComplete = declarations.length > 0 && completedDeclarations.length === declarations.length;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          All individuals who will hold key positions in your firm must complete a Fit & Proper
          declaration. This includes directors, senior executives, compliance officers, and other
          licensed function holders. Each individual must confirm they meet DFSA's fitness and
          propriety requirements.
        </AlertDescription>
      </Alert>

      {/* Fit & Proper Requirements Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Fit & Proper Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Each individual must confirm that they:
          </p>
          <ul className="text-sm text-gray-600 space-y-2 ml-4 list-disc">
            <li>Have not been convicted of any criminal offense involving dishonesty, fraud, or financial crime</li>
            <li>Have not been subject to adverse findings by any regulatory body</li>
            <li>Have not been disqualified from acting as a director or in a management capacity</li>
            <li>Have not been involved in any business that has been wound up or placed into administration</li>
            <li>Are not an undischarged bankrupt</li>
            <li>Have the competence and capability to perform their proposed role</li>
            <li>Have the appropriate qualifications and experience for their proposed role</li>
          </ul>
        </CardContent>
      </Card>


      {/* Declaration Status Summary */}
      <Card className={allDeclarationsComplete ? 'border-green-200 bg-green-50/30' : 'border-amber-200 bg-amber-50/30'}>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {allDeclarationsComplete ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              )}
              <span className="font-medium">
                {allDeclarationsComplete
                  ? 'All declarations complete'
                  : `${completedDeclarations.length} of ${declarations.length} declarations complete`}
              </span>
            </div>
            <Badge variant={allDeclarationsComplete ? 'default' : 'secondary'}>
              {declarations.length} {declarations.length === 1 ? 'person' : 'people'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Individual Declarations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Individual Declarations</h3>
          {!isReadOnly && (
            <Button variant="outline" size="sm" onClick={handleAddDeclaration}>
              <Plus className="w-4 h-4 mr-2" />
              Add Person
            </Button>
          )}
        </div>

        {declarations.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Declarations Added</h4>
              <p className="text-gray-600 mb-4">
                Add individuals who will hold key positions and require Fit & Proper declarations.
              </p>
              {!isReadOnly && (
                <Button onClick={handleAddDeclaration}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Person
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          declarations.map((declaration, index) => (
            <Card key={index} className={declaration.declarationSigned ? 'border-green-200' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <UserCheck className={`w-4 h-4 ${declaration.declarationSigned ? 'text-green-600' : 'text-gray-400'}`} />
                    Person {index + 1}
                    {declaration.declarationSigned && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Signed
                      </Badge>
                    )}
                  </CardTitle>
                  {!isReadOnly && declarations.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDeclaration(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    id={`declaration-name-${index}`}
                    label="Full Name"
                    value={declaration.personName}
                    onChange={(value) => handleDeclarationChange(index, 'personName', value)}
                    placeholder="Enter full legal name"
                    required
                    error={errors[`individualDeclarations.${index}.personName`]}
                    disabled={isReadOnly}
                  />

                  <FormSelect
                    id={`declaration-role-${index}`}
                    label="Proposed Role"
                    value={declaration.role}
                    onChange={(value) => handleDeclarationChange(index, 'role', value)}
                    options={PERSONNEL_ROLES}
                    required
                    error={errors[`individualDeclarations.${index}.role`]}
                    placeholder="Select role"
                    disabled={isReadOnly}
                  />
                </div>

                <Separator />

                <FormCheckbox
                  id={`declaration-signed-${index}`}
                  label="I confirm that I meet the DFSA Fit & Proper requirements"
                  checked={declaration.declarationSigned}
                  onChange={(checked) => handleDeclarationChange(index, 'declarationSigned', checked)}
                  required
                  error={errors[`individualDeclarations.${index}.declarationSigned`]}
                  disabled={isReadOnly}
                  description="By checking this box, the named individual confirms they have read and understood the Fit & Proper requirements and declare that they meet all criteria."
                />

                {declaration.signedDate && (
                  <p className="text-sm text-gray-500 ml-6">
                    Declaration signed on: {new Date(declaration.signedDate).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Important Notice */}
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Important:</strong> DFSA may conduct background checks and request additional
          information to verify the fitness and propriety of proposed individuals. Providing false
          or misleading information is a serious offense and may result in rejection of the
          application and potential regulatory action.
        </AlertDescription>
      </Alert>
    </div>
  );
};
