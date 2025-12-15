/**
 * DFSA Step 4-2: Application Fees
 *
 * Final submission step for fee calculation and payment method selection.
 * Always visible.
 * Requirements: 1.4, 1.5
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Badge } from '../../../ui/badge';
import { Separator } from '../../../ui/separator';
import { Info, DollarSign, CreditCard, Building2, Calculator } from 'lucide-react';
import { FormSelect } from '../FormSelect';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData, FeeCalculation } from '../../../../types/dfsa';

export interface Step4_2Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Payment method options
const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'cheque', label: 'Cheque' }
];

// Fee schedule based on license categories (simplified for demonstration)
const FEE_SCHEDULE = {
  category1: { application: 70000, annual: 50000 },
  category2: { application: 50000, annual: 35000 },
  category3A: { application: 25000, annual: 20000 },
  category3B: { application: 20000, annual: 15000 },
  category3C: { application: 15000, annual: 10000 },
  category4: { application: 10000, annual: 7500 },
  category5: { application: 5000, annual: 3500 },
  representativeOffice: { application: 5000, annual: 2500 },
  default: { application: 15000, annual: 10000 }
};

// Endorsement fees
const ENDORSEMENT_FEES = {
  islamic: 5000,
  retail: 3000,
  crowdfunding: 2500
};

export const Step4_2_ApplicationFees: React.FC<Step4_2Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  // Calculate fees based on form data
  const calculatedFees = useMemo((): FeeCalculation => {
    let applicationFee = FEE_SCHEDULE.default.application;
    let annualFee = FEE_SCHEDULE.default.annual;

    // Determine base fee based on application type
    if (formData.isRepresentativeOffice) {
      applicationFee = FEE_SCHEDULE.representativeOffice.application;
      annualFee = FEE_SCHEDULE.representativeOffice.annual;
    } else {
      // Check activity selections to determine category
      const hasFinancialServices = formData.activitySelections?.A1;
      const hasInsurance = formData.activitySelections?.A2 || formData.activitySelections?.A3;
      const hasBanking = formData.activitySelections?.A6;

      if (hasBanking) {
        applicationFee = FEE_SCHEDULE.category1.application;
        annualFee = FEE_SCHEDULE.category1.annual;
      } else if (hasInsurance) {
        applicationFee = FEE_SCHEDULE.category2.application;
        annualFee = FEE_SCHEDULE.category2.annual;
      } else if (hasFinancialServices) {
        // Check matrix for specific activities
        const matrix = formData.financialServicesMatrix || {};
        const hasDealing = (matrix.A4?.length || 0) > 0;
        const hasManaging = (matrix.A10?.length || 0) > 0 || (matrix.A11?.length || 0) > 0;

        if (hasDealing) {
          applicationFee = FEE_SCHEDULE.category3A.application;
          annualFee = FEE_SCHEDULE.category3A.annual;
        } else if (hasManaging) {
          applicationFee = FEE_SCHEDULE.category3B.application;
          annualFee = FEE_SCHEDULE.category3B.annual;
        } else {
          applicationFee = FEE_SCHEDULE.category3C.application;
          annualFee = FEE_SCHEDULE.category3C.annual;
        }
      }
    }

    // Add endorsement fees
    let endorsementTotal = 0;
    if (formData.endorsementSelections?.E1_A1) {
      endorsementTotal += ENDORSEMENT_FEES.islamic;
    }
    if (formData.endorsementSelections?.E2_A1) {
      endorsementTotal += ENDORSEMENT_FEES.retail;
    }

    const totalFee = applicationFee + endorsementTotal;

    return {
      applicationFee,
      annualFee,
      totalFee,
      currency: 'USD'
    };
  }, [formData.isRepresentativeOffice, formData.activitySelections, formData.financialServicesMatrix, formData.endorsementSelections]);

  // Update form data with calculated fees
  React.useEffect(() => {
    if (JSON.stringify(formData.feeCalculation) !== JSON.stringify(calculatedFees)) {
      updateFormData({ feeCalculation: calculatedFees });
    }
  }, [calculatedFees, formData.feeCalculation, updateFormData]);

  const handlePaymentMethodChange = (value: string) => {
    updateFormData({ paymentMethod: value });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Application fees are calculated based on your selected activities and license category.
          Fees must be paid before your application can be processed. Annual fees are payable
          upon license grant and annually thereafter.
        </AlertDescription>
      </Alert>

      {/* Fee Calculation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Fee Calculation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {/* Application Fee */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Application Fee</span>
              <span className="font-medium">{formatCurrency(calculatedFees.applicationFee)}</span>
            </div>

            {/* Endorsement Fees */}
            {formData.endorsementSelections?.E1_A1 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 ml-4">+ Islamic Finance Endorsement</span>
                <span>{formatCurrency(ENDORSEMENT_FEES.islamic)}</span>
              </div>
            )}
            {formData.endorsementSelections?.E2_A1 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 ml-4">+ Retail Endorsement</span>
                <span>{formatCurrency(ENDORSEMENT_FEES.retail)}</span>
              </div>
            )}

            <Separator />

            {/* Total Due Now */}
            <div className="flex items-center justify-between text-lg font-semibold">
              <span className="text-gray-900">Total Due Now</span>
              <span className="text-blue-600">{formatCurrency(calculatedFees.totalFee)}</span>
            </div>

            <Separator />

            {/* Annual Fee (for information) */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Annual Fee (payable upon license grant)</span>
              <span>{formatCurrency(calculatedFees.annualFee)}</span>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              All fees are in US Dollars (USD). The application fee is non-refundable once
              the application review process has commenced.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="paymentMethod"
            label="Select Payment Method"
            value={formData.paymentMethod || ''}
            onChange={handlePaymentMethodChange}
            options={PAYMENT_METHODS}
            required
            error={errors['paymentMethod']}
            placeholder="Select how you will pay the application fee"
            disabled={isReadOnly}
          />

          {/* Payment Instructions based on method */}
          {formData.paymentMethod === 'bank_transfer' && (
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Bank Transfer Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Bank:</strong> Emirates NBD</p>
                      <p><strong>Account Name:</strong> Dubai Financial Services Authority</p>
                      <p><strong>Account Number:</strong> 1234567890123</p>
                      <p><strong>IBAN:</strong> AE12 0260 0012 3456 7890 123</p>
                      <p><strong>SWIFT Code:</strong> EABORAEAXXX</p>
                      <p><strong>Reference:</strong> Your application reference number (provided after submission)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {formData.paymentMethod === 'credit_card' && (
            <Alert className="bg-green-50 border-green-200">
              <CreditCard className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                You will be redirected to a secure payment portal after submitting your application.
                We accept Visa, Mastercard, and American Express.
              </AlertDescription>
            </Alert>
          )}

          {formData.paymentMethod === 'cheque' && (
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Payable to:</strong> Dubai Financial Services Authority</p>
                  <p><strong>Mail to:</strong> DFSA, Level 13, The Gate, West Wing, DIFC, PO Box 75850, Dubai, UAE</p>
                  <p className="text-amber-600">
                    Note: Application processing will begin only after cheque clearance.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Fee Schedule Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            Fee Schedule Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              Fees are determined by the DFSA Fee Schedule and are based on the type of license
              and activities you are applying for. For the complete fee schedule, please refer to
              the DFSA Fees Module (FER).
            </p>
            <p>
              <a
                href="https://www.dfsa.ae/rulebook/fees-module"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View DFSA Fees Module →
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
