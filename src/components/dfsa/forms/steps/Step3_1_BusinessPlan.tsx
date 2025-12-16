/**
 * DFSA Step 3-1: Business Plan
 *
 * Core profile step for business plan information.
 * Hidden when only Representative Office is selected.
 * Requirements: 7.1
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, FileText, TrendingUp, Target, Calendar } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step3_1Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Business model types
const BUSINESS_MODEL_TYPES = [
  { value: 'b2b', label: 'Business to Business (B2B)' },
  { value: 'b2c', label: 'Business to Consumer (B2C)' },
  { value: 'b2b2c', label: 'Business to Business to Consumer (B2B2C)' },
  { value: 'hybrid', label: 'Hybrid Model' },
  { value: 'other', label: 'Other' }
];

// Revenue model types
const REVENUE_MODEL_TYPES = [
  { value: 'fee_based', label: 'Fee-Based' },
  { value: 'commission_based', label: 'Commission-Based' },
  { value: 'spread_based', label: 'Spread-Based' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'performance_fee', label: 'Performance Fee' },
  { value: 'mixed', label: 'Mixed Revenue Model' }
];


// Projected timeline options
const TIMELINE_OPTIONS = [
  { value: '0-6', label: '0-6 months' },
  { value: '6-12', label: '6-12 months' },
  { value: '12-18', label: '12-18 months' },
  { value: '18-24', label: '18-24 months' },
  { value: '24+', label: 'More than 24 months' }
];

export const Step3_1_BusinessPlan: React.FC<Step3_1Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  // Initialize business plan data if not present
  const businessPlanData = (formData as any).businessPlan || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      businessPlan: {
        ...businessPlanData,
        [field]: value
      }
    } as any);
  };

  // Handle projected financials
  const projectedFinancials = (formData.projectedFinancials as any) || {};

  const handleFinancialsChange = (field: string, value: any) => {
    updateFormData({
      projectedFinancials: {
        ...projectedFinancials,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This section collects information about your business plan, including your business model,
          revenue strategy, and projected financials. Please provide comprehensive details to support
          your application.
        </AlertDescription>
      </Alert>

      {/* Business Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Business Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            id="businessPlanSummary"
            label="Business Plan Summary"
            value={formData.businessPlanSummary || ''}
            onChange={(value) => updateFormData({ businessPlanSummary: value })}
            placeholder="Provide a comprehensive summary of your business plan, including your value proposition, target market, and competitive advantages..."
            rows={6}
            required
            error={errors['businessPlanSummary']}
            disabled={isReadOnly}
            maxLength={5000}
          />

          <FormSelect
            id="businessModelType"
            label="Business Model Type"
            value={businessPlanData.businessModelType || ''}
            onChange={(value) => handleFieldChange('businessModelType', value)}
            options={BUSINESS_MODEL_TYPES}
            required
            error={errors['businessPlan.businessModelType']}
            placeholder="Select business model type"
            disabled={isReadOnly}
          />

          <FormSelect
            id="revenueModel"
            label="Primary Revenue Model"
            value={businessPlanData.revenueModel || ''}
            onChange={(value) => handleFieldChange('revenueModel', value)}
            options={REVENUE_MODEL_TYPES}
            required
            error={errors['businessPlan.revenueModel']}
            placeholder="Select revenue model"
            disabled={isReadOnly}
          />

          <FormTextArea
            id="valueProposition"
            label="Value Proposition"
            value={businessPlanData.valueProposition || ''}
            onChange={(value) => handleFieldChange('valueProposition', value)}
            placeholder="Describe your unique value proposition and how you differentiate from competitors..."
            rows={4}
            error={errors['businessPlan.valueProposition']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Market Strategy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Market Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            id="targetMarket"
            label="Target Market Description"
            value={businessPlanData.targetMarket || ''}
            onChange={(value) => handleFieldChange('targetMarket', value)}
            placeholder="Describe your target market, including geographic focus, client segments, and market size..."
            rows={4}
            error={errors['businessPlan.targetMarket']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="competitiveAnalysis"
            label="Competitive Analysis"
            value={businessPlanData.competitiveAnalysis || ''}
            onChange={(value) => handleFieldChange('competitiveAnalysis', value)}
            placeholder="Provide an analysis of your competitive landscape and your positioning..."
            rows={4}
            error={errors['businessPlan.competitiveAnalysis']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="marketingStrategy"
            label="Marketing & Distribution Strategy"
            value={businessPlanData.marketingStrategy || ''}
            onChange={(value) => handleFieldChange('marketingStrategy', value)}
            placeholder="Describe how you plan to acquire and retain clients..."
            rows={4}
            error={errors['businessPlan.marketingStrategy']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Financial Projections Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Financial Projections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="projectedRevenueYear1"
              label="Projected Revenue - Year 1 (USD)"
              value={projectedFinancials.revenueYear1 || ''}
              onChange={(value) => handleFinancialsChange('revenueYear1', value)}
              type="text"
              placeholder="e.g., 500,000"
              error={errors['projectedFinancials.revenueYear1']}
              disabled={isReadOnly}
            />

            <FormInput
              id="projectedRevenueYear2"
              label="Projected Revenue - Year 2 (USD)"
              value={projectedFinancials.revenueYear2 || ''}
              onChange={(value) => handleFinancialsChange('revenueYear2', value)}
              type="text"
              placeholder="e.g., 1,000,000"
              error={errors['projectedFinancials.revenueYear2']}
              disabled={isReadOnly}
            />

            <FormInput
              id="projectedRevenueYear3"
              label="Projected Revenue - Year 3 (USD)"
              value={projectedFinancials.revenueYear3 || ''}
              onChange={(value) => handleFinancialsChange('revenueYear3', value)}
              type="text"
              placeholder="e.g., 2,000,000"
              error={errors['projectedFinancials.revenueYear3']}
              disabled={isReadOnly}
            />

            <FormInput
              id="breakEvenTimeline"
              label="Expected Break-Even Timeline"
              value={projectedFinancials.breakEvenTimeline || ''}
              onChange={(value) => handleFinancialsChange('breakEvenTimeline', value)}
              type="text"
              placeholder="e.g., 18 months"
              error={errors['projectedFinancials.breakEvenTimeline']}
              disabled={isReadOnly}
            />
          </div>

          <FormInput
            id="initialCapitalRequirement"
            label="Initial Capital Requirement (USD)"
            value={projectedFinancials.initialCapital || ''}
            onChange={(value) => handleFinancialsChange('initialCapital', value)}
            type="text"
            placeholder="e.g., 2,000,000"
            error={errors['projectedFinancials.initialCapital']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="fundingSource"
            label="Source of Funding"
            value={projectedFinancials.fundingSource || ''}
            onChange={(value) => handleFinancialsChange('fundingSource', value)}
            placeholder="Describe the source of your initial and ongoing capital..."
            rows={3}
            error={errors['projectedFinancials.fundingSource']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Operational Timeline Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Operational Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="operationalReadiness"
            label="Expected Time to Operational Readiness"
            value={businessPlanData.operationalReadiness || ''}
            onChange={(value) => handleFieldChange('operationalReadiness', value)}
            options={TIMELINE_OPTIONS}
            error={errors['businessPlan.operationalReadiness']}
            placeholder="Select timeline"
            disabled={isReadOnly}
          />

          <FormTextArea
            id="implementationPlan"
            label="Implementation Plan"
            value={businessPlanData.implementationPlan || ''}
            onChange={(value) => handleFieldChange('implementationPlan', value)}
            placeholder="Describe your implementation plan and key milestones..."
            rows={4}
            error={errors['businessPlan.implementationPlan']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasExistingOperations"
            label="Do you have existing operations in other jurisdictions?"
            checked={businessPlanData.hasExistingOperations || false}
            onChange={(checked) => handleFieldChange('hasExistingOperations', checked)}
            disabled={isReadOnly}
          />

          {businessPlanData.hasExistingOperations && (
            <FormTextArea
              id="existingOperationsDetails"
              label="Existing Operations Details"
              value={businessPlanData.existingOperationsDetails || ''}
              onChange={(value) => handleFieldChange('existingOperationsDetails', value)}
              placeholder="Provide details of your existing operations in other jurisdictions..."
              rows={3}
              error={errors['businessPlan.existingOperationsDetails']}
              disabled={isReadOnly}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
