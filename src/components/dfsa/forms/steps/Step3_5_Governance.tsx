/**
 * DFSA Step 3-5: Governance
 *
 * Core profile step for governance structure information.
 * Hidden when only Representative Office is selected.
 * Requirements: 7.1
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Button } from '../../../ui/button';
import { Info, Users, UserCheck, Plus, Trash2, Building2 } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData, Person } from '../../../../types/dfsa';

export interface Step3_5Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Board member roles
const BOARD_ROLES = [
  { value: 'chairman', label: 'Chairman' },
  { value: 'vice_chairman', label: 'Vice Chairman' },
  { value: 'executive_director', label: 'Executive Director' },
  { value: 'non_executive_director', label: 'Non-Executive Director' },
  { value: 'independent_director', label: 'Independent Director' },
  { value: 'ceo', label: 'Chief Executive Officer' },
  { value: 'cfo', label: 'Chief Financial Officer' },
  { value: 'coo', label: 'Chief Operating Officer' },
  { value: 'cro', label: 'Chief Risk Officer' },
  { value: 'other', label: 'Other' }
];

// Committee types
const COMMITTEE_TYPES = [
  { value: 'audit', label: 'Audit Committee' },
  { value: 'risk', label: 'Risk Committee' },
  { value: 'remuneration', label: 'Remuneration Committee' },
  { value: 'nomination', label: 'Nomination Committee' },
  { value: 'compliance', label: 'Compliance Committee' },
  { value: 'investment', label: 'Investment Committee' }
];

// Meeting frequency options
const MEETING_FREQUENCY = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi_weekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
  { value: 'as_needed', label: 'As Needed' }
];

// Empty board member template
const createEmptyBoardMember = (): Person => ({
  name: '',
  role: '',
  nationality: '',
  experience: ''
});

export const Step3_5_Governance: React.FC<Step3_5Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  // Initialize governance data if not present
  const governanceData = (formData as any).governance || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      governance: {
        ...governanceData,
        [field]: value
      }
    } as any);
  };

  // Handle board composition
  const boardComposition = formData.boardComposition || [];

  const handleAddBoardMember = () => {
    updateFormData({
      boardComposition: [...boardComposition, createEmptyBoardMember()]
    });
  };

  const handleRemoveBoardMember = (index: number) => {
    const newBoard = boardComposition.filter((_, i) => i !== index);
    updateFormData({ boardComposition: newBoard });
  };

  const handleBoardMemberChange = (index: number, field: keyof Person, value: string) => {
    const newBoard = [...boardComposition];
    newBoard[index] = { ...newBoard[index], [field]: value };
    updateFormData({ boardComposition: newBoard });
  };

  // Handle committee selections
  const [selectedCommittees, setSelectedCommittees] = useState<string[]>(
    governanceData.committees || []
  );

  const handleCommitteeToggle = (committee: string) => {
    const newCommittees = selectedCommittees.includes(committee)
      ? selectedCommittees.filter(c => c !== committee)
      : [...selectedCommittees, committee];
    setSelectedCommittees(newCommittees);
    handleFieldChange('committees', newCommittees);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This section collects information about your governance structure, including board
          composition, committees, and corporate governance arrangements. The DFSA requires
          authorized firms to have robust governance frameworks.
        </AlertDescription>
      </Alert>

      {/* Board Composition Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Board Composition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="boardSize"
            label="Total Number of Board Members"
            value={governanceData.boardSize || ''}
            onChange={(value) => handleFieldChange('boardSize', value)}
            type="number"
            placeholder="e.g., 5"
            error={errors['governance.boardSize']}
            disabled={isReadOnly}
          />

          <FormInput
            id="independentDirectors"
            label="Number of Independent Directors"
            value={governanceData.independentDirectors || ''}
            onChange={(value) => handleFieldChange('independentDirectors', value)}
            type="number"
            placeholder="e.g., 2"
            error={errors['governance.independentDirectors']}
            disabled={isReadOnly}
          />

          <FormSelect
            id="boardMeetingFrequency"
            label="Board Meeting Frequency"
            value={governanceData.boardMeetingFrequency || ''}
            onChange={(value) => handleFieldChange('boardMeetingFrequency', value)}
            options={MEETING_FREQUENCY}
            error={errors['governance.boardMeetingFrequency']}
            placeholder="Select meeting frequency"
            disabled={isReadOnly}
          />

          {/* Board Members List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Board Members</label>
              {!isReadOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddBoardMember}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Board Member
                </Button>
              )}
            </div>

            {boardComposition.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                No board members added yet. Click "Add Board Member" to add.
              </p>
            )}

            {boardComposition.map((member, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Board Member {index + 1}
                  </span>
                  {!isReadOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBoardMember(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormInput
                    id={`boardMember_${index}_name`}
                    label="Full Name"
                    value={member.name || ''}
                    onChange={(value) => handleBoardMemberChange(index, 'name', value)}
                    placeholder="Enter full name"
                    error={errors[`boardComposition.${index}.name`]}
                    disabled={isReadOnly}
                  />

                  <FormSelect
                    id={`boardMember_${index}_role`}
                    label="Role"
                    value={member.role || ''}
                    onChange={(value) => handleBoardMemberChange(index, 'role', value)}
                    options={BOARD_ROLES}
                    placeholder="Select role"
                    error={errors[`boardComposition.${index}.role`]}
                    disabled={isReadOnly}
                  />

                  <FormInput
                    id={`boardMember_${index}_nationality`}
                    label="Nationality"
                    value={member.nationality || ''}
                    onChange={(value) => handleBoardMemberChange(index, 'nationality', value)}
                    placeholder="Enter nationality"
                    error={errors[`boardComposition.${index}.nationality`]}
                    disabled={isReadOnly}
                  />

                  <FormInput
                    id={`boardMember_${index}_experience`}
                    label="Years of Experience"
                    value={member.experience || ''}
                    onChange={(value) => handleBoardMemberChange(index, 'experience', value)}
                    placeholder="e.g., 15"
                    error={errors[`boardComposition.${index}.experience`]}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Committees Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Board Committees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Select all committees that are established (or will be established)
            </label>
            {COMMITTEE_TYPES.map((committee) => (
              <FormCheckbox
                key={committee.value}
                id={`committee_${committee.value}`}
                label={committee.label}
                checked={selectedCommittees.includes(committee.value)}
                onChange={() => handleCommitteeToggle(committee.value)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          {selectedCommittees.includes('audit') && (
            <FormTextArea
              id="auditCommitteeDetails"
              label="Audit Committee Details"
              value={governanceData.auditCommitteeDetails || ''}
              onChange={(value) => handleFieldChange('auditCommitteeDetails', value)}
              placeholder="Describe the composition and responsibilities of your Audit Committee..."
              rows={3}
              error={errors['governance.auditCommitteeDetails']}
              disabled={isReadOnly}
            />
          )}

          {selectedCommittees.includes('risk') && (
            <FormTextArea
              id="riskCommitteeDetails"
              label="Risk Committee Details"
              value={governanceData.riskCommitteeDetails || ''}
              onChange={(value) => handleFieldChange('riskCommitteeDetails', value)}
              placeholder="Describe the composition and responsibilities of your Risk Committee..."
              rows={3}
              error={errors['governance.riskCommitteeDetails']}
              disabled={isReadOnly}
            />
          )}
        </CardContent>
      </Card>


      {/* Corporate Governance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Corporate Governance Arrangements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            id="governanceFramework"
            label="Governance Framework Overview"
            value={governanceData.governanceFramework || ''}
            onChange={(value) => handleFieldChange('governanceFramework', value)}
            placeholder="Describe your overall corporate governance framework, including key policies and procedures..."
            rows={4}
            error={errors['governance.governanceFramework']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasCodeOfConduct"
            label="Do you have a Code of Conduct/Ethics?"
            checked={governanceData.hasCodeOfConduct || false}
            onChange={(checked) => handleFieldChange('hasCodeOfConduct', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasWhistleblowingPolicy"
            label="Do you have a Whistleblowing Policy?"
            checked={governanceData.hasWhistleblowingPolicy || false}
            onChange={(checked) => handleFieldChange('hasWhistleblowingPolicy', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasConflictOfInterestPolicy"
            label="Do you have a Conflict of Interest Policy?"
            checked={governanceData.hasConflictOfInterestPolicy || false}
            onChange={(checked) => handleFieldChange('hasConflictOfInterestPolicy', checked)}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="delegationOfAuthority"
            label="Delegation of Authority"
            value={governanceData.delegationOfAuthority || ''}
            onChange={(value) => handleFieldChange('delegationOfAuthority', value)}
            placeholder="Describe your delegation of authority framework and approval limits..."
            rows={3}
            error={errors['governance.delegationOfAuthority']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Key Personnel Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Key Personnel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="seniorExecutiveOfficer"
            label="Senior Executive Officer (SEO) Name"
            value={governanceData.seniorExecutiveOfficer || ''}
            onChange={(value) => handleFieldChange('seniorExecutiveOfficer', value)}
            placeholder="Enter name of SEO"
            required
            error={errors['governance.seniorExecutiveOfficer']}
            disabled={isReadOnly}
          />

          <FormInput
            id="financeOfficer"
            label="Finance Officer Name"
            value={governanceData.financeOfficer || ''}
            onChange={(value) => handleFieldChange('financeOfficer', value)}
            placeholder="Enter name of Finance Officer"
            error={errors['governance.financeOfficer']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="successionPlanning"
            label="Succession Planning"
            value={governanceData.successionPlanning || ''}
            onChange={(value) => handleFieldChange('successionPlanning', value)}
            placeholder="Describe your succession planning arrangements for key personnel..."
            rows={3}
            error={errors['governance.successionPlanning']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasOrganizationalChart"
            label="Do you have an organizational chart?"
            checked={governanceData.hasOrganizationalChart || false}
            onChange={(checked) => handleFieldChange('hasOrganizationalChart', checked)}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
