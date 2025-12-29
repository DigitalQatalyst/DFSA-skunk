/**
 * DFSA Step 4-4: Review & Submit
 *
 * Final submission step for reviewing application and submitting.
 * Always visible.
 * Requirements: 1.4, 1.5, 5.1, 5.2, 5.3, 5.4, 5.5
 */

import React, { useMemo, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Badge } from '../../../ui/badge';
import { Separator } from '../../../ui/separator';
import { Button } from '../../../ui/button';
import {
  Info,
  FileText,
  CheckCircle,
  AlertCircle,
  Building2,
  Users,
  Briefcase,
  Shield,
  DollarSign,
  FileWarning,
  Send,
  Download,
  Loader2
} from 'lucide-react';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';
import { generateApplicationPDF } from '../pdfExport';

export interface Step4_4Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
  applicationRef?: string;
  applicationStatus?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';
}

interface SectionSummary {
  title: string;
  icon: React.ReactNode;
  items: { label: string; value: string | React.ReactNode; status?: 'complete' | 'incomplete' | 'warning' }[];
  status: 'complete' | 'incomplete' | 'warning';
}

export const Step4_4_ReviewSubmit: React.FC<Step4_4Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false,
  applicationRef = 'DRAFT',
  applicationStatus = 'draft'
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  // Generate application summary sections
  const sections = useMemo((): SectionSummary[] => {
    const summaries: SectionSummary[] = [];

    // Firm Information Section
    const firmComplete = !!(formData.firmName && formData.registeredCountry && formData.primaryContactEmail);
    summaries.push({
      title: 'Firm Information',
      icon: <Building2 className="w-5 h-5" />,
      status: firmComplete ? 'complete' : 'incomplete',
      items: [
        { label: 'Firm Name', value: formData.firmName || 'Not provided', status: formData.firmName ? 'complete' : 'incomplete' },
        { label: 'Legal Status', value: formData.legalStatus || 'Not specified', status: formData.legalStatus ? 'complete' : 'warning' },
        { label: 'Country of Registration', value: formData.registeredCountry || 'Not provided', status: formData.registeredCountry ? 'complete' : 'incomplete' },
        { label: 'Representative Office', value: formData.isRepresentativeOffice ? 'Yes' : 'No' },
        { label: 'Primary Contact', value: formData.primaryContactName || 'Not provided', status: formData.primaryContactName ? 'complete' : 'incomplete' },
        { label: 'Contact Email', value: formData.primaryContactEmail || 'Not provided', status: formData.primaryContactEmail ? 'complete' : 'incomplete' }
      ]
    });

    // Ownership Section
    const shareholdersCount = formData.shareholders?.length || 0;
    const ownersCount = formData.beneficialOwners?.length || 0;
    summaries.push({
      title: 'Ownership & Control',
      icon: <Users className="w-5 h-5" />,
      status: shareholdersCount > 0 ? 'complete' : 'warning',
      items: [
        { label: 'Part of Group', value: formData.isPartOfGroup ? 'Yes' : 'No' },
        { label: 'Ultimate Holding Company', value: formData.ultimateHoldingCompany || 'N/A' },
        { label: 'Shareholders', value: `${shareholdersCount} registered`, status: shareholdersCount > 0 ? 'complete' : 'warning' },
        { label: 'Beneficial Owners', value: `${ownersCount} registered`, status: ownersCount > 0 ? 'complete' : 'warning' },
        { label: 'Publicly Listed', value: formData.publiclyListed ? `Yes - ${formData.listingExchange || 'Exchange not specified'}` : 'No' }
      ]
    });

    // Activities Section
    const selectedActivities = Object.entries(formData.activitySelections || {})
      .filter(([_, selected]) => selected)
      .map(([code]) => code);
    const hasActivities = selectedActivities.length > 0 || formData.isRepresentativeOffice;
    summaries.push({
      title: 'Proposed Activities',
      icon: <Briefcase className="w-5 h-5" />,
      status: hasActivities ? 'complete' : 'incomplete',
      items: [
        {
          label: 'Selected Activities',
          value: hasActivities
            ? (formData.isRepresentativeOffice ? 'Representative Office' : `${selectedActivities.length} activity sectors selected`)
            : 'No activities selected',
          status: hasActivities ? 'complete' : 'incomplete'
        },
        {
          label: 'Islamic Endorsement',
          value: formData.endorsementSelections?.E1_A1 ? 'Requested' : 'Not requested'
        },
        {
          label: 'Retail Endorsement',
          value: formData.endorsementSelections?.E2_A1 ? 'Requested' : 'Not requested'
        }
      ]
    });

    // Declarations Section
    const declarations = formData.individualDeclarations || [];
    const signedDeclarations = declarations.filter(d => d.declarationSigned);
    const declarationsComplete = declarations.length > 0 && signedDeclarations.length === declarations.length;
    summaries.push({
      title: 'Fit & Proper Declarations',
      icon: <Shield className="w-5 h-5" />,
      status: declarationsComplete ? 'complete' : declarations.length > 0 ? 'warning' : 'incomplete',
      items: [
        {
          label: 'Total Declarations',
          value: `${declarations.length} individuals`,
          status: declarations.length > 0 ? 'complete' : 'incomplete'
        },
        {
          label: 'Signed Declarations',
          value: `${signedDeclarations.length} of ${declarations.length} signed`,
          status: declarationsComplete ? 'complete' : 'warning'
        }
      ]
    });

    // Fees Section
    const feeCalculation = formData.feeCalculation;
    const paymentMethodSelected = !!formData.paymentMethod;
    summaries.push({
      title: 'Application Fees',
      icon: <DollarSign className="w-5 h-5" />,
      status: paymentMethodSelected ? 'complete' : 'incomplete',
      items: [
        {
          label: 'Application Fee',
          value: feeCalculation ? `$${feeCalculation.applicationFee.toLocaleString()}` : 'Not calculated'
        },
        {
          label: 'Total Due',
          value: feeCalculation ? `$${feeCalculation.totalFee.toLocaleString()}` : 'Not calculated'
        },
        {
          label: 'Payment Method',
          value: formData.paymentMethod
            ? formData.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
            : 'Not selected',
          status: paymentMethodSelected ? 'complete' : 'incomplete'
        }
      ]
    });

    // Waivers Section
    const waivers = formData.waiverRequests || [];
    summaries.push({
      title: 'Waivers & Modifications',
      icon: <FileWarning className="w-5 h-5" />,
      status: 'complete', // Waivers are optional
      items: [
        {
          label: 'Waiver Requests',
          value: waivers.length > 0 ? `${waivers.length} request(s)` : 'None'
        }
      ]
    });

    return summaries;
  }, [formData]);

  // Calculate overall readiness
  const isReadyToSubmit = useMemo(() => {
    const requiredSections = sections.filter(s =>
      s.title !== 'Waivers & Modifications' // Waivers are optional
    );
    const allComplete = requiredSections.every(s => s.status === 'complete');
    return allComplete && formData.finalReview && formData.submissionDeclaration;
  }, [sections, formData.finalReview, formData.submissionDeclaration]);

  const incompleteCount = sections.filter(s => s.status === 'incomplete').length;
  const warningCount = sections.filter(s => s.status === 'warning').length;

  /**
   * Handle PDF download
   * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
   */
  const handleDownloadPDF = useCallback(async () => {
    setIsGeneratingPDF(true);
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));

      generateApplicationPDF(formData, {
        applicationRef,
        status: applicationStatus,
        generatedAt: new Date(),
        includeDocumentList: true,
        documents: [] // TODO: Pass actual documents when document upload is implemented
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [formData, applicationRef, applicationStatus]);

  const getStatusIcon = (status: 'complete' | 'incomplete' | 'warning') => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'incomplete':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: 'complete' | 'incomplete' | 'warning') => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>;
      case 'warning':
        return <Badge className="bg-amber-100 text-amber-800">Review Needed</Badge>;
      case 'incomplete':
        return <Badge className="bg-red-100 text-red-800">Incomplete</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please review all sections of your application before submitting. Ensure all required
          information is complete and accurate. Once submitted, you will not be able to make
          changes without contacting DFSA.
        </AlertDescription>
      </Alert>


      {/* Overall Status */}
      <Card className={isReadyToSubmit ? 'border-green-200 bg-green-50/30' : 'border-amber-200 bg-amber-50/30'}>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isReadyToSubmit ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isReadyToSubmit ? 'Ready to Submit' : 'Application Not Ready'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isReadyToSubmit
                    ? 'All required sections are complete. You may submit your application.'
                    : `${incompleteCount} incomplete section(s), ${warningCount} section(s) need review`}
                </p>
              </div>
            </div>
            <Send className={`w-8 h-8 ${isReadyToSubmit ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
        </CardContent>
      </Card>

      {/* Application Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Application Summary
            </CardTitle>
            {/* PDF Download Button - Requirements: 5.1, 5.2, 5.3, 5.4, 5.5 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section, index) => (
            <div key={index}>
              {index > 0 && <Separator className="mb-6" />}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                  </div>
                  {getStatusBadge(section.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-2">
                      {item.status && getStatusIcon(item.status)}
                      <div>
                        <span className="text-sm text-gray-500">{item.label}:</span>
                        <span className="text-sm text-gray-900 ml-1">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Final Declarations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Final Declarations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            id="finalReview"
            label="I have reviewed all sections of this application"
            checked={formData.finalReview || false}
            onChange={(checked) => updateFormData({ finalReview: checked })}
            required
            error={errors['finalReview']}
            disabled={isReadOnly}
            description="Confirm that you have reviewed all information provided in this application and that it is complete."
          />

          <FormCheckbox
            id="submissionDeclaration"
            label="I declare that all information provided is true, complete, and accurate"
            checked={formData.submissionDeclaration || false}
            onChange={(checked) => updateFormData({ submissionDeclaration: checked })}
            required
            error={errors['submissionDeclaration']}
            disabled={isReadOnly}
            description="I understand that providing false or misleading information is a serious offense and may result in rejection of this application and potential regulatory action."
          />
        </CardContent>
      </Card>

      {/* Submission Notice */}
      <Alert className={isReadyToSubmit ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}>
        {isReadyToSubmit ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Ready to Submit:</strong> Your application is complete. Click the "Submit Application"
              button below to submit your application to DFSA. You will receive a confirmation email
              with your application reference number.
            </AlertDescription>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Action Required:</strong> Please complete all required sections and confirm the
              declarations above before submitting. Use the sidebar navigation to return to incomplete
              sections.
            </AlertDescription>
          </>
        )}
      </Alert>

      {/* Important Information */}
      <Card className="bg-gray-50">
        <CardContent className="pt-4">
          <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal ml-4">
            <li>Upon submission, you will receive a confirmation email with your application reference number.</li>
            <li>DFSA will conduct an initial review of your application within 5 business days.</li>
            <li>You may be contacted for additional information or clarification.</li>
            <li>The standard processing time is 3-6 months, depending on the complexity of your application.</li>
            <li>You can track your application status through the DFSA portal using your reference number.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
