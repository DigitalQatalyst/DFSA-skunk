/**
 * DFSA Step 1-5: Permissions & Financial Services
 *
 * Activity selections and financial services matrix - critical for determining visible steps
 * Requirements: 1.1, 1.3, 6.4, 7.2
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Separator } from '../../../ui/separator';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Badge } from '../../../ui/badge';
import { Checkbox } from '../../../ui/checkbox';
import { Label } from '../../../ui/label';
import { Info, Activity, Grid, CheckCircle, AlertTriangle } from 'lucide-react';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';
import { cn } from '../../../../lib/utils';

export interface Step1_5Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Activity definitions
const ACTIVITY_SECTORS = [
  {
    code: 'A1',
    name: 'Financial Services',
    description: 'Dealing, arranging, managing, advising, and custody services',
    hasMatrix: true,
    color: 'blue'
  },
  {
    code: 'A2',
    name: 'Advising & Arranging',
    description: 'Investment advice and arranging deals in investments',
    hasMatrix: false,
    color: 'green'
  },
  {
    code: 'A3',
    name: 'Fund Management',
    description: 'Managing collective investment funds',
    hasMatrix: false,
    color: 'purple'
  },
  {
    code: 'A4',
    name: 'Insurance Business',
    description: 'Insurance and reinsurance activities',
    hasMatrix: false,
    color: 'orange'
  },
  {
    code: 'A5',
    name: 'Insurance Intermediation',
    description: 'Insurance broking and agency services',
    hasMatrix: false,
    color: 'red'
  },
  {
    code: 'A6',
    name: 'Banking Business',
    description: 'Accepting deposits and providing credit',
    hasMatrix: false,
    color: 'indigo'
  },
  {
    code: 'A7',
    name: 'Credit Rating',
    description: 'Providing credit rating services',
    hasMatrix: false,
    color: 'pink'
  },
  {
    code: 'A8',
    name: 'Operating an Exchange',
    description: 'Operating a financial exchange or clearing house',
    hasMatrix: false,
    color: 'teal'
  }
];

// Financial Services Matrix (for A1 activities)
const FINANCIAL_SERVICES_ACTIVITIES = [
  { code: 'FS1', name: 'Dealing in Investments as Principal' },
  { code: 'FS2', name: 'Dealing in Investments as Agent' },
  { code: 'FS3', name: 'Arranging Deals in Investments' },
  { code: 'FS4', name: 'Managing Assets' },
  { code: 'FS5', name: 'Advising on Financial Products' },
  { code: 'FS6', name: 'Custody of Investments' },
  { code: 'FS7', name: 'Arranging Custody' },
  { code: 'FS8', name: 'Operating a Collective Investment Fund' },
  { code: 'FS9', name: 'Providing Fund Administration' }
];

const INVESTMENT_TYPES = [
  { code: 'IT1', name: 'Shares' },
  { code: 'IT2', name: 'Debentures' },
  { code: 'IT3', name: 'Government & Public Securities' },
  { code: 'IT4', name: 'Warrants' },
  { code: 'IT5', name: 'Certificates' },
  { code: 'IT6', name: 'Units in Collective Investment Fund' },
  { code: 'IT7', name: 'Options' },
  { code: 'IT8', name: 'Futures' },
  { code: 'IT9', name: 'Contracts for Differences' },
  { code: 'IT10', name: 'Swaps' },
  { code: 'IT11', name: 'Profit Sharing Investment Accounts' }
];

// Endorsement options
const ENDORSEMENT_OPTIONS = [
  {
    code: 'E1_A1',
    name: 'Islamic Finance Endorsement (A1)',
    description: 'For Islamic financial services activities',
    dependsOn: 'A1'
  },
  {
    code: 'E2_A1',
    name: 'Retail Endorsement (A1)',
    description: 'For providing services to retail clients',
    dependsOn: 'A1'
  },
  {
    code: 'E3_A3',
    name: 'Islamic Fund Management Endorsement',
    description: 'For managing Islamic collective investment funds',
    dependsOn: 'A3'
  }
];

export const Step1_5_PermissionsFinancialServices: React.FC<Step1_5Props> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  onPrevious,
  isReadOnly = false
}) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'matrix' | 'endorsements'>('activities');

  // Activity selection handlers
  const handleActivityChange = (activityCode: string, checked: boolean) => {
    const updatedSelections = {
      ...formData.activitySelections,
      [activityCode]: checked
    };

    // If unchecking A1, clear the financial services matrix
    if (activityCode === 'A1' && !checked) {
      updateFormData({
        activitySelections: updatedSelections,
        financialServicesMatrix: {}
      });
    } else {
      updateFormData({ activitySelections: updatedSelections });
    }
  };

  // Matrix selection handlers
  const handleMatrixChange = (activityCode: string, investmentType: string, checked: boolean) => {
    const currentMatrix = formData.financialServicesMatrix || {};
    const currentSelections = currentMatrix[activityCode] || [];

    let updatedSelections;
    if (checked) {
      updatedSelections = [...currentSelections, investmentType];
    } else {
      updatedSelections = currentSelections.filter(type => type !== investmentType);
    }

    updateFormData({
      financialServicesMatrix: {
        ...currentMatrix,
        [activityCode]: updatedSelections
      }
    });
  };

  // Endorsement selection handlers
  const handleEndorsementChange = (endorsementCode: string, checked: boolean) => {
    updateFormData({
      endorsementSelections: {
        ...formData.endorsementSelections,
        [endorsementCode]: checked
      }
    });
  };

  // Check if matrix is required and has selections
  const isA1Selected = formData.activitySelections?.A1 === true;
  const hasMatrixSelections = isA1Selected && formData.financialServicesMatrix &&
    Object.values(formData.financialServicesMatrix).some(selections => selections.length > 0);

  // Count selected activities
  const selectedActivities = Object.values(formData.activitySelections || {}).filter(Boolean).length;
  const selectedEndorsements = Object.values(formData.endorsementSelections || {}).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Select the activities you wish to conduct. Your selections will determine which additional form sections you need to complete.
          For Financial Services (A1), you must also specify the types of investments you will deal with.
        </AlertDescription>
      </Alert>

      {/* Activity Selection Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Permissions & Activities
          </CardTitle>
          <div className="flex space-x-1 mt-4">
            <Button
              variant={activeTab === 'activities' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('activities')}
            >
              Activities
              {selectedActivities > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedActivities}
                </Badge>
              )}
            </Button>

            <Button
              variant={activeTab === 'matrix' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('matrix')}
              disabled={!isA1Selected}
            >
              Financial Services Matrix
              {hasMatrixSelections && (
                <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
              )}
            </Button>

            <Button
              variant={activeTab === 'endorsements' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('endorsements')}
            >
              Endorsements
              {selectedEndorsements > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedEndorsements}
                </Badge>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Select Activities</h4>
                <p className="text-sm text-gray-600">
                  {selectedActivities} selected
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACTIVITY_SECTORS.map((activity) => {
                  const isSelected = formData.activitySelections?.[activity.code] === true;

                  return (
                    <Card
                      key={activity.code}
                      className={cn(
                        'cursor-pointer transition-all duration-200 hover:shadow-md',
                        isSelected && 'ring-2 ring-blue-500 bg-blue-50'
                      )}
                      onClick={() => !isReadOnly && handleActivityChange(activity.code, !isSelected)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onChange={(checked) => handleActivityChange(activity.code, checked)}
                            disabled={isReadOnly}
                            className="mt-1"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-xs',
                                  activity.color === 'blue' && 'border-blue-500 text-blue-700',
                                  activity.color === 'green' && 'border-green-500 text-green-700',
                                  activity.color === 'purple' && 'border-purple-500 text-purple-700',
                                  activity.color === 'orange' && 'border-orange-500 text-orange-700',
                                  activity.color === 'red' && 'border-red-500 text-red-700',
                                  activity.color === 'indigo' && 'border-indigo-500 text-indigo-700',
                                  activity.color === 'pink' && 'border-pink-500 text-pink-700',
                                  activity.color === 'teal' && 'border-teal-500 text-teal-700'
                                )}
                              >
                                {activity.code}
                              </Badge>
                              {activity.hasMatrix && (
                                <Badge variant="secondary" className="text-xs">
                                  Matrix Required
                                </Badge>
                              )}
                            </div>

                            <h5 className="font-medium text-gray-900 mb-1">
                              {activity.name}
                            </h5>

                            <p className="text-sm text-gray-600">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {errors.activitySelections && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {errors.activitySelections}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Financial Services Matrix Tab */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              {!isA1Selected ? (
                <div className="text-center py-8 text-gray-500">
                  <Grid className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select Financial Services (A1) activity to access this matrix</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Financial Services Matrix</h4>
                    <p className="text-sm text-gray-600">
                      Select investment types for each financial service activity
                    </p>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      For each financial service activity you plan to conduct, select the types of investments you will deal with.
                      This matrix determines your specific permissions and regulatory requirements.
                    </AlertDescription>
                  </Alert>

                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-gray-900 border-b">
                            Financial Service Activity
                          </th>
                          {INVESTMENT_TYPES.map((type) => (
                            <th key={type.code} className="text-center p-2 text-xs font-medium text-gray-700 border-b border-l">
                              <div className="transform -rotate-45 origin-center whitespace-nowrap">
                                {type.code}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {FINANCIAL_SERVICES_ACTIVITIES.map((activity) => (
                          <tr key={activity.code} className="hover:bg-gray-50">
                            <td className="p-3 border-b font-medium text-gray-900">
                              <div>
                                <Badge variant="outline" className="text-xs mb-1">
                                  {activity.code}
                                </Badge>
                                <div className="text-sm">{activity.name}</div>
                              </div>
                            </td>
                            {INVESTMENT_TYPES.map((type) => {
                              const isSelected = formData.financialServicesMatrix?.[activity.code]?.includes(type.code) || false;

                              return (
                                <td key={type.code} className="text-center p-2 border-b border-l">
                                  <Checkbox
                                    checked={isSelected}
                                    onChange={(checked) => handleMatrixChange(activity.code, type.code, checked)}
                                    disabled={isReadOnly}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Investment Type Legend:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {INVESTMENT_TYPES.map((type) => (
                        <div key={type.code} className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {type.code}
                          </Badge>
                          <span className="text-xs">{type.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Endorsements Tab */}
          {activeTab === 'endorsements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Endorsements</h4>
                <p className="text-sm text-gray-600">
                  {selectedEndorsements} selected
                </p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Endorsements provide additional permissions for specific types of activities or client segments.
                  Only select endorsements that are relevant to your selected activities.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {ENDORSEMENT_OPTIONS.map((endorsement) => {
                  const isDependencyMet = formData.activitySelections?.[endorsement.dependsOn] === true;
                  const isSelected = formData.endorsementSelections?.[endorsement.code] === true;

                  return (
                    <Card
                      key={endorsement.code}
                      className={cn(
                        'transition-all duration-200',
                        !isDependencyMet && 'opacity-50',
                        isSelected && isDependencyMet && 'ring-2 ring-green-500 bg-green-50'
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onChange={(checked) => handleEndorsementChange(endorsement.code, checked)}
                            disabled={isReadOnly || !isDependencyMet}
                            className="mt-1"
                          />

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h5 className="font-medium text-gray-900">
                                {endorsement.name}
                              </h5>
                              <Badge variant="outline" className="text-xs">
                                Requires {endorsement.dependsOn}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600">
                              {endorsement.description}
                            </p>

                            {!isDependencyMet && (
                              <p className="text-xs text-orange-600 mt-2">
                                Select {endorsement.dependsOn} activity first to enable this endorsement
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selection Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{selectedActivities}</div>
              <div className="text-sm text-blue-700">Activities Selected</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {hasMatrixSelections ? '✓' : '—'}
              </div>
              <div className="text-sm text-green-700">Matrix Completed</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{selectedEndorsements}</div>
              <div className="text-sm text-purple-700">Endorsements Selected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
