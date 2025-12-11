/**
 * DFSA Financial Services Application PDF Export
 *
 * Client-side PDF generation using jsPDF with DFSA branding and formatting.
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { jsPDF } from 'jspdf';
import { FSApplicationFormData, ApplicationStatus } from '../../../types/dfsa';
import { STAGE_NAMES } from './stepDefinitions';

// DFSA Brand Colors
const DFSA_COLORS = {
  primary: '#003366',      // DFSA Navy Blue
  secondary: '#0066CC',    // DFSA Light Blue
  accent: '#CC9900',       // DFSA Gold
  text: '#333333',         // Dark Gray
  lightText: '#666666',    // Medium Gray
  border: '#CCCCCC',       // Light Gray
  background: '#F5F5F5',   // Light Background
  success: '#28A745',      // Green
  warning: '#FFC107',      // Amber
  error: '#DC3545'         // Red
};

// PDF Configuration
const PDF_CONFIG = {
  pageWidth: 210,          // A4 width in mm
  pageHeight: 297,         // A4 height in mm
  marginLeft: 20,
  marginRight: 20,
  marginTop: 25,
  marginBottom: 25,
  contentWidth: 170,       // pageWidth - marginLeft - marginRight
  lineHeight: 6,
  sectionSpacing: 10,
  headerHeight: 35
};

interface PDFGeneratorOptions {
  applicationRef?: string;
  status?: ApplicationStatus;
  generatedAt?: Date;
  includeDocumentList?: boolean;
  documents?: DocumentInfo[];
}

interface DocumentInfo {
  documentType: string;
  documentName: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  stepId?: string;
}

/**
 * Main PDF Generator class for DFSA Financial Services Application
 */
export class DFSAPDFGenerator {
  private doc: jsPDF;
  private currentY: number;
  private pageNumber: number;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    this.currentY = PDF_CONFIG.marginTop;
    this.pageNumber = 1;
  }

  /**
   * Generate PDF from form data
   * Requirement 5.1: Generate formatted PDF containing all form data
   */
  public generatePDF(
    formData: FSApplicationFormData,
    options: PDFGeneratorOptions = {}
  ): jsPDF {
    const {
      applicationRef = 'DRAFT',
      status = 'draft',
      generatedAt = new Date(),
      includeDocumentList = true,
      documents = []
    } = options;

    // Add header to first page
    this.addHeader(applicationRef, status);

    // Add generation info
    this.addGenerationInfo(generatedAt, applicationRef);

    // Add form sections
    this.addStage1Content(formData);
    this.addStage2Content(formData);
    this.addStage3Content(formData);
    this.addStage4Content(formData);

    // Add document list if requested
    // Requirement 5.4: List all uploaded documents in the PDF
    if (includeDocumentList && documents.length > 0) {
      this.addDocumentList(documents);
    }

    // Add footer to all pages
    this.addFooterToAllPages(applicationRef);

    return this.doc;
  }


  /**
   * Download the generated PDF
   * Requirement 5.5: Provide file with filename format "{ApplicationRef}-Application.pdf"
   */
  public downloadPDF(applicationRef: string = 'DRAFT'): void {
    const filename = this.generateFilename(applicationRef);
    this.doc.save(filename);
  }

  /**
   * Get PDF as blob for preview or other uses
   */
  public getPDFBlob(): Blob {
    return this.doc.output('blob');
  }

  /**
   * Get PDF as base64 string
   */
  public getPDFBase64(): string {
    return this.doc.output('datauristring');
  }

  /**
   * Generate filename following DFSA format
   * Requirement 5.5: Filename format "{ApplicationRef}-Application.pdf"
   */
  private generateFilename(applicationRef: string): string {
    const sanitizedRef = applicationRef.replace(/[^a-zA-Z0-9-]/g, '_');
    return `${sanitizedRef}-Application.pdf`;
  }

  /**
   * Add DFSA branded header
   * Requirement 5.2: Include DFSA branding, application reference, and status
   */
  private addHeader(applicationRef: string, status: ApplicationStatus): void {
    // Header background
    this.doc.setFillColor(DFSA_COLORS.primary);
    this.doc.rect(0, 0, PDF_CONFIG.pageWidth, PDF_CONFIG.headerHeight, 'F');

    // DFSA Title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DUBAI FINANCIAL SERVICES AUTHORITY', PDF_CONFIG.marginLeft, 15);

    // Subtitle
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Financial Services Application Form', PDF_CONFIG.marginLeft, 22);

    // Application Reference and Status (right side)
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    const refText = `Ref: ${applicationRef}`;
    const refWidth = this.doc.getTextWidth(refText);
    this.doc.text(refText, PDF_CONFIG.pageWidth - PDF_CONFIG.marginRight - refWidth, 15);

    // Status badge
    const statusText = this.formatStatus(status);
    const statusWidth = this.doc.getTextWidth(statusText);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(statusText, PDF_CONFIG.pageWidth - PDF_CONFIG.marginRight - statusWidth, 22);

    // Gold accent line
    this.doc.setDrawColor(DFSA_COLORS.accent);
    this.doc.setLineWidth(1);
    this.doc.line(0, PDF_CONFIG.headerHeight, PDF_CONFIG.pageWidth, PDF_CONFIG.headerHeight);

    this.currentY = PDF_CONFIG.headerHeight + 10;
  }

  /**
   * Add generation information
   */
  private addGenerationInfo(generatedAt: Date, _applicationRef: string): void {
    this.doc.setTextColor(DFSA_COLORS.lightText);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'italic');

    const dateStr = generatedAt.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    this.doc.text(`Generated: ${dateStr}`, PDF_CONFIG.marginLeft, this.currentY);
    this.currentY += PDF_CONFIG.lineHeight + 5;
  }

  /**
   * Format status for display
   */
  private formatStatus(status: ApplicationStatus): string {
    const statusMap: Record<ApplicationStatus, string> = {
      draft: 'DRAFT',
      submitted: 'SUBMITTED',
      under_review: 'UNDER REVIEW',
      approved: 'APPROVED',
      rejected: 'REJECTED',
      withdrawn: 'WITHDRAWN'
    };
    return statusMap[status] || status.toUpperCase();
  }

  /**
   * Check if new page is needed and add if necessary
   */
  private checkPageBreak(requiredSpace: number = 20): void {
    if (this.currentY + requiredSpace > PDF_CONFIG.pageHeight - PDF_CONFIG.marginBottom) {
      this.addNewPage();
    }
  }

  /**
   * Add a new page
   */
  private addNewPage(): void {
    this.doc.addPage();
    this.pageNumber++;
    this.currentY = PDF_CONFIG.marginTop;
  }

  /**
   * Add section header
   * Requirement 5.3: Organize data into logical sections with clear headings
   */
  private addSectionHeader(title: string, stageNumber?: number): void {
    this.checkPageBreak(25);

    // Section background
    this.doc.setFillColor(DFSA_COLORS.background);
    this.doc.rect(PDF_CONFIG.marginLeft, this.currentY - 2, PDF_CONFIG.contentWidth, 10, 'F');

    // Left border accent
    this.doc.setFillColor(DFSA_COLORS.secondary);
    this.doc.rect(PDF_CONFIG.marginLeft, this.currentY - 2, 3, 10, 'F');

    // Section title
    this.doc.setTextColor(DFSA_COLORS.primary);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');

    const displayTitle = stageNumber ? `Stage ${stageNumber}: ${title}` : title;
    this.doc.text(displayTitle, PDF_CONFIG.marginLeft + 6, this.currentY + 5);

    this.currentY += 15;
  }

  /**
   * Add subsection header
   */
  private addSubsectionHeader(title: string): void {
    this.checkPageBreak(15);

    this.doc.setTextColor(DFSA_COLORS.secondary);
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, PDF_CONFIG.marginLeft, this.currentY);

    // Underline
    this.doc.setDrawColor(DFSA_COLORS.border);
    this.doc.setLineWidth(0.3);
    this.doc.line(PDF_CONFIG.marginLeft, this.currentY + 2, PDF_CONFIG.marginLeft + PDF_CONFIG.contentWidth, this.currentY + 2);

    this.currentY += 8;
  }


  /**
   * Add a field with label and value
   */
  private addField(label: string, value: string | undefined | null, indent: number = 0): void {
    this.checkPageBreak(10);

    const xPos = PDF_CONFIG.marginLeft + indent;
    const labelWidth = 60;
    const valueX = xPos + labelWidth;

    // Label
    this.doc.setTextColor(DFSA_COLORS.lightText);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`${label}:`, xPos, this.currentY);

    // Value
    this.doc.setTextColor(DFSA_COLORS.text);
    this.doc.setFont('helvetica', 'normal');
    const displayValue = value || 'Not provided';

    // Handle long values with text wrapping
    const maxValueWidth = PDF_CONFIG.contentWidth - labelWidth - indent;
    const lines = this.doc.splitTextToSize(displayValue, maxValueWidth);
    this.doc.text(lines, valueX, this.currentY);

    this.currentY += Math.max(PDF_CONFIG.lineHeight, lines.length * 4);
  }

  /**
   * Add a boolean field (Yes/No)
   */
  private addBooleanField(label: string, value: boolean | undefined, indent: number = 0): void {
    this.addField(label, value === true ? 'Yes' : value === false ? 'No' : 'Not specified', indent);
  }

  /**
   * Add a list of items
   */
  private addList(items: string[], indent: number = 5): void {
    items.forEach(item => {
      this.checkPageBreak(8);
      this.doc.setTextColor(DFSA_COLORS.text);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`• ${item}`, PDF_CONFIG.marginLeft + indent, this.currentY);
      this.currentY += PDF_CONFIG.lineHeight;
    });
  }

  /**
   * Add spacing
   */
  private addSpacing(space: number = PDF_CONFIG.sectionSpacing): void {
    this.currentY += space;
  }


  /**
   * Add Stage 1: General Requirements content
   */
  private addStage1Content(formData: FSApplicationFormData): void {
    this.addSectionHeader(STAGE_NAMES[1], 1);

    // Step 1-1: Introduction & Disclosure
    this.addSubsectionHeader('Introduction & Disclosure');
    this.addField('Submitter Name', formData.submitterName);
    this.addField('Submitter Function', formData.submitterFunction);
    this.addField('Submitter Email', formData.submitterEmail);
    this.addField('Submitter Phone', formData.submitterPhone);
    this.addBooleanField('Internal Contact Person', formData.contactPersonInternal);

    if (!formData.contactPersonInternal) {
      this.addField('External Adviser Name', formData.externalAdviserName, 5);
      this.addField('External Adviser Email', formData.externalAdviserEmail, 5);
      this.addField('External Adviser Company', formData.externalAdviserCompany, 5);
    }

    this.addBooleanField('Instructions Confirmed', formData.instructionsConfirmed);
    this.addBooleanField('Disclosure Acknowledged', formData.disclosureAcknowledged);
    this.addBooleanField('Information Accurate', formData.informationAccurate);
    this.addBooleanField('Authorized to Submit', formData.authorizedToSubmit);
    this.addBooleanField('DIFCA Consent', formData.difcaConsent);
    this.addSpacing();

    // Step 1-2: Standing Data
    this.addSubsectionHeader('Standing Data');
    this.addBooleanField('Representative Office', formData.isRepresentativeOffice);
    this.addField('Legal Status', formData.legalStatus);
    this.addField('General Structure', formData.generalStructure);
    this.addField('Firm Name', formData.firmName);

    if (formData.tradingNames && formData.tradingNames.length > 0) {
      this.addField('Trading Names', formData.tradingNames.join(', '));
    }

    this.addField('Registered Country', formData.registeredCountry);
    this.addField('Registration Number', formData.registrationNumber);
    this.addField('Registration Date', formData.registrationDate);
    this.addField('Financial Year End', formData.financialYearEnd);
    this.addSpacing(5);


    // Head Office Address
    if (formData.headOfficeAddress) {
      this.doc.setTextColor(DFSA_COLORS.lightText);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text('Head Office Address:', PDF_CONFIG.marginLeft, this.currentY);
      this.currentY += PDF_CONFIG.lineHeight;

      const addr = formData.headOfficeAddress;
      this.addField('Address Line 1', addr.line1, 5);
      if (addr.line2) this.addField('Address Line 2', addr.line2, 5);
      this.addField('City', addr.city, 5);
      if (addr.state) this.addField('State/Province', addr.state, 5);
      if (addr.postalCode) this.addField('Postal Code', addr.postalCode, 5);
      this.addField('Country', addr.country, 5);
      if (addr.poBox) this.addField('PO Box', addr.poBox, 5);
    }

    this.addSpacing(5);
    this.addField('Primary Contact Name', formData.primaryContactName);
    this.addField('Primary Contact Email', formData.primaryContactEmail);
    this.addField('Primary Contact Phone', formData.primaryContactPhone);
    this.addField('IT Reliance', formData.itReliance);
    this.addField('IT Complexity', formData.itComplexity);
    this.addSpacing();

    // Step 1-3: Ownership Information
    this.addSubsectionHeader('Ownership Information');
    this.addBooleanField('Part of Group', formData.isPartOfGroup);
    if (formData.isPartOfGroup) {
      this.addField('Ultimate Holding Company', formData.ultimateHoldingCompany, 5);
    }
    this.addBooleanField('Publicly Listed', formData.publiclyListed);
    if (formData.publiclyListed) {
      this.addField('Listing Exchange', formData.listingExchange, 5);
    }

    // Shareholders
    if (formData.shareholders && formData.shareholders.length > 0) {
      this.addSpacing(5);
      this.doc.setTextColor(DFSA_COLORS.lightText);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text(`Shareholders (${formData.shareholders.length}):`, PDF_CONFIG.marginLeft, this.currentY);
      this.currentY += PDF_CONFIG.lineHeight;

      formData.shareholders.forEach((sh, idx) => {
        this.checkPageBreak(20);
        this.addField(`${idx + 1}. Name`, sh.name, 5);
        this.addField('   Percentage', `${sh.percentage}%`, 5);
        this.addField('   Country', sh.country, 5);
        this.addField('   Type', sh.isIndividual ? 'Individual' : (sh.entityType || 'Entity'), 5);
      });
    }


    // Beneficial Owners
    if (formData.beneficialOwners && formData.beneficialOwners.length > 0) {
      this.addSpacing(5);
      this.doc.setTextColor(DFSA_COLORS.lightText);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text(`Beneficial Owners (${formData.beneficialOwners.length}):`, PDF_CONFIG.marginLeft, this.currentY);
      this.currentY += PDF_CONFIG.lineHeight;

      formData.beneficialOwners.forEach((bo, idx) => {
        this.checkPageBreak(20);
        this.addField(`${idx + 1}. Name`, bo.name, 5);
        this.addField('   Percentage', `${bo.percentage}%`, 5);
        this.addField('   Nationality', bo.nationality, 5);
      });
    }
    this.addSpacing();

    // Step 1-4: Controllers & Group Structure
    this.addSubsectionHeader('Controllers & Group Structure');
    this.addBooleanField('Has Controllers', formData.hasControllers);

    if (formData.hasControllers && formData.controllers && formData.controllers.length > 0) {
      this.addSpacing(5);
      this.doc.setTextColor(DFSA_COLORS.lightText);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text(`Controllers (${formData.controllers.length}):`, PDF_CONFIG.marginLeft, this.currentY);
      this.currentY += PDF_CONFIG.lineHeight;

      formData.controllers.forEach((ctrl, idx) => {
        this.checkPageBreak(20);
        this.addField(`${idx + 1}. Name`, ctrl.name, 5);
        this.addField('   Role', ctrl.role, 5);
        this.addField('   Control Type', ctrl.controlType, 5);
        if (ctrl.percentage) this.addField('   Percentage', `${ctrl.percentage}%`, 5);
        this.addField('   Nationality', ctrl.nationality, 5);
      });
    }

    if (formData.groupStructureDescription) {
      this.addField('Group Structure Description', formData.groupStructureDescription);
    }
    this.addSpacing();

    // Step 1-5: Permissions & Financial Services
    this.addSubsectionHeader('Permissions & Financial Services');
    this.addActivitiesSection(formData);
  }


  /**
   * Add activities and endorsements section
   */
  private addActivitiesSection(formData: FSApplicationFormData): void {
    // Activity Selections
    const selectedActivities = Object.entries(formData.activitySelections || {})
      .filter(([_, selected]) => selected)
      .map(([code]) => this.getActivityName(code));

    if (selectedActivities.length > 0) {
      this.doc.setTextColor(DFSA_COLORS.lightText);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text('Selected Activity Sectors:', PDF_CONFIG.marginLeft, this.currentY);
      this.currentY += PDF_CONFIG.lineHeight;
      this.addList(selectedActivities);
    } else if (formData.isRepresentativeOffice) {
      this.addField('Application Type', 'Representative Office');
    } else {
      this.addField('Selected Activities', 'None selected');
    }

    // Financial Services Matrix
    const matrixEntries = Object.entries(formData.financialServicesMatrix || {})
      .filter(([_, types]) => types && types.length > 0);

    if (matrixEntries.length > 0) {
      this.addSpacing(5);
      this.doc.setTextColor(DFSA_COLORS.lightText);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text('Financial Services Matrix:', PDF_CONFIG.marginLeft, this.currentY);
      this.currentY += PDF_CONFIG.lineHeight;

      matrixEntries.forEach(([activity, types]) => {
        this.checkPageBreak(10);
        const activityName = this.getActivityName(activity);
        this.addField(activityName, (types as string[]).join(', '), 5);
      });
    }

    // Endorsements
    const selectedEndorsements = Object.entries(formData.endorsementSelections || {})
      .filter(([_, selected]) => selected)
      .map(([code]) => this.getEndorsementName(code));

    if (selectedEndorsements.length > 0) {
      this.addSpacing(5);
      this.doc.setTextColor(DFSA_COLORS.lightText);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text('Requested Endorsements:', PDF_CONFIG.marginLeft, this.currentY);
      this.currentY += PDF_CONFIG.lineHeight;
      this.addList(selectedEndorsements);
    }
  }


  /**
   * Get human-readable activity name
   */
  private getActivityName(code: string): string {
    const activityNames: Record<string, string> = {
      'A1': 'Financial Services',
      'A2': 'Direct Insurance',
      'A3': 'Insurance Intermediation',
      'A4': 'Dealing in Investments',
      'A5': 'Money Services',
      'A6': 'Banking',
      'A7': 'Managing Assets',
      'A8': 'Advising on Financial Products',
      'A9': 'Arranging Deals in Investments',
      'A10': 'Managing a Collective Investment Fund',
      'A11': 'Providing Custody',
      'A12': 'Arranging Custody',
      'A13': 'Managing a REIT',
      'A14': 'Operating a Crowdfunding Platform',
      'A15': 'Providing Trust Services',
      'A16': 'Providing Fund Administration',
      'A17': 'Acting as Trustee of a Fund',
      'A18': 'Operating an Alternative Trading System'
    };
    return activityNames[code] || code;
  }

  /**
   * Get human-readable endorsement name
   */
  private getEndorsementName(code: string): string {
    const endorsementNames: Record<string, string> = {
      'E1_A1': 'Islamic Financial Business Endorsement',
      'E2_A1': 'Retail Endorsement',
      'E2_A5': 'Client Assets Endorsement',
      'E3_A1': 'Professional Client Endorsement'
    };
    return endorsementNames[code] || code;
  }

  /**
   * Add Stage 2: Activity-Specific Information content
   */
  private addStage2Content(formData: FSApplicationFormData): void {
    // Only add if there are activity-specific selections
    const hasStage2Content = formData.isRepresentativeOffice ||
      Object.values(formData.activitySelections || {}).some(v => v) ||
      Object.values(formData.financialServicesMatrix || {}).some(v => v && v.length > 0);

    if (!hasStage2Content) return;

    this.addSectionHeader(STAGE_NAMES[2], 2);

    // Note about activity-specific information
    this.doc.setTextColor(DFSA_COLORS.lightText);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'italic');
    this.doc.text(
      'Activity-specific information has been collected based on your selected activities.',
      PDF_CONFIG.marginLeft,
      this.currentY
    );
    this.currentY += PDF_CONFIG.lineHeight;
    this.doc.text(
      'Please refer to the individual step submissions for detailed activity information.',
      PDF_CONFIG.marginLeft,
      this.currentY
    );
    this.currentY += PDF_CONFIG.lineHeight * 2;
  }


  /**
   * Add Stage 3: Core Profile content
   */
  private addStage3Content(formData: FSApplicationFormData): void {
    // Skip Stage 3 for Representative Office only applications
    const isRepOfficeOnly = formData.isRepresentativeOffice &&
      !Object.values(formData.activitySelections || {}).some(v => v);

    if (isRepOfficeOnly) return;

    this.addSectionHeader(STAGE_NAMES[3], 3);

    // Business Plan
    this.addSubsectionHeader('Business Plan');
    if (formData.businessPlanSummary) {
      this.doc.setTextColor(DFSA_COLORS.text);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      const lines = this.doc.splitTextToSize(formData.businessPlanSummary, PDF_CONFIG.contentWidth);
      lines.forEach((line: string) => {
        this.checkPageBreak(8);
        this.doc.text(line, PDF_CONFIG.marginLeft, this.currentY);
        this.currentY += 4;
      });
    } else {
      this.addField('Business Plan Summary', 'Not provided');
    }
    this.addSpacing();

    // Target Client Segments
    if (formData.targetClientSegments && formData.targetClientSegments.length > 0) {
      this.addSubsectionHeader('Target Clients');
      this.addList(formData.targetClientSegments);
      this.addSpacing();
    }

    // Risk Management
    this.addSubsectionHeader('Risk Management & Compliance');
    if (formData.riskManagementFramework) {
      this.doc.setTextColor(DFSA_COLORS.text);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      const lines = this.doc.splitTextToSize(formData.riskManagementFramework, PDF_CONFIG.contentWidth);
      lines.forEach((line: string) => {
        this.checkPageBreak(8);
        this.doc.text(line, PDF_CONFIG.marginLeft, this.currentY);
        this.currentY += 4;
      });
    } else {
      this.addField('Risk Management Framework', 'Not provided');
    }
    this.addSpacing();

    // Board Composition
    if (formData.boardComposition && formData.boardComposition.length > 0) {
      this.addSubsectionHeader('Governance - Board Composition');
      formData.boardComposition.forEach((person, idx) => {
        this.checkPageBreak(15);
        this.addField(`${idx + 1}. Name`, person.name, 5);
        this.addField('   Role', person.role, 5);
        this.addField('   Nationality', person.nationality, 5);
        if (person.experience) this.addField('   Experience', person.experience, 5);
      });
    }
  }


  /**
   * Add Stage 4: Final Submission content
   */
  private addStage4Content(formData: FSApplicationFormData): void {
    this.addSectionHeader(STAGE_NAMES[4], 4);

    // Waivers & Modifications
    this.addSubsectionHeader('Waivers & Modifications');
    if (formData.waiverRequests && formData.waiverRequests.length > 0) {
      formData.waiverRequests.forEach((waiver, idx) => {
        this.checkPageBreak(25);
        this.addField(`${idx + 1}. Requirement`, waiver.requirement, 5);
        this.addField('   Justification', waiver.justification, 5);
        if (waiver.alternativeApproach) {
          this.addField('   Alternative Approach', waiver.alternativeApproach, 5);
        }
      });
    } else {
      this.addField('Waiver Requests', 'None');
    }
    this.addSpacing();

    // Application Fees
    this.addSubsectionHeader('Application Fees');
    if (formData.feeCalculation) {
      const fee = formData.feeCalculation;
      this.addField('Application Fee', `${fee.currency} ${fee.applicationFee.toLocaleString()}`);
      this.addField('Annual Fee', `${fee.currency} ${fee.annualFee.toLocaleString()}`);
      this.addField('Total Fee', `${fee.currency} ${fee.totalFee.toLocaleString()}`);
    } else {
      this.addField('Fee Calculation', 'Not calculated');
    }
    this.addField('Payment Method', formData.paymentMethod?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()));
    this.addSpacing();

    // Fit & Proper Declarations
    this.addSubsectionHeader('Fit & Proper Declarations');
    if (formData.individualDeclarations && formData.individualDeclarations.length > 0) {
      formData.individualDeclarations.forEach((decl, idx) => {
        this.checkPageBreak(15);
        this.addField(`${idx + 1}. Person`, decl.personName, 5);
        this.addField('   Role', decl.role, 5);
        this.addBooleanField('   Declaration Signed', decl.declarationSigned, 5);
        if (decl.signedDate) this.addField('   Signed Date', decl.signedDate, 5);
      });
    } else {
      this.addField('Individual Declarations', 'None recorded');
    }
    this.addSpacing();

    // Final Review
    this.addSubsectionHeader('Final Review & Submission');
    this.addBooleanField('Application Reviewed', formData.finalReview);
    this.addBooleanField('Submission Declaration', formData.submissionDeclaration);
  }


  /**
   * Add document list section
   * Requirement 5.4: List all uploaded documents in the PDF
   */
  private addDocumentList(documents: DocumentInfo[]): void {
    this.addSectionHeader('Uploaded Documents');

    if (documents.length === 0) {
      this.addField('Documents', 'No documents uploaded');
      return;
    }

    // Table header
    this.checkPageBreak(20);
    this.doc.setFillColor(DFSA_COLORS.background);
    this.doc.rect(PDF_CONFIG.marginLeft, this.currentY - 2, PDF_CONFIG.contentWidth, 8, 'F');

    this.doc.setTextColor(DFSA_COLORS.primary);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');

    const colWidths = [60, 50, 30, 30];
    let xPos = PDF_CONFIG.marginLeft + 2;

    this.doc.text('Document Name', xPos, this.currentY + 3);
    xPos += colWidths[0];
    this.doc.text('Type', xPos, this.currentY + 3);
    xPos += colWidths[1];
    this.doc.text('Size', xPos, this.currentY + 3);
    xPos += colWidths[2];
    this.doc.text('Upload Date', xPos, this.currentY + 3);

    this.currentY += 10;

    // Table rows
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(DFSA_COLORS.text);

    documents.forEach((doc, idx) => {
      this.checkPageBreak(10);

      // Alternate row background
      if (idx % 2 === 0) {
        this.doc.setFillColor(250, 250, 250);
        this.doc.rect(PDF_CONFIG.marginLeft, this.currentY - 3, PDF_CONFIG.contentWidth, 7, 'F');
      }

      xPos = PDF_CONFIG.marginLeft + 2;

      // Truncate long names
      const truncatedName = doc.documentName.length > 30
        ? doc.documentName.substring(0, 27) + '...'
        : doc.documentName;

      this.doc.text(truncatedName, xPos, this.currentY);
      xPos += colWidths[0];
      this.doc.text(doc.documentType, xPos, this.currentY);
      xPos += colWidths[1];
      this.doc.text(this.formatFileSize(doc.fileSize), xPos, this.currentY);
      xPos += colWidths[2];
      this.doc.text(this.formatDate(doc.uploadDate), xPos, this.currentY);

      this.currentY += 7;
    });

    this.addSpacing();
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * Format date for display
   */
  private formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }


  /**
   * Add footer to all pages
   */
  private addFooterToAllPages(applicationRef: string): void {
    const totalPages = this.doc.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);

      // Footer line
      this.doc.setDrawColor(DFSA_COLORS.border);
      this.doc.setLineWidth(0.3);
      this.doc.line(
        PDF_CONFIG.marginLeft,
        PDF_CONFIG.pageHeight - 15,
        PDF_CONFIG.pageWidth - PDF_CONFIG.marginRight,
        PDF_CONFIG.pageHeight - 15
      );

      // Footer text
      this.doc.setTextColor(DFSA_COLORS.lightText);
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');

      // Left: DFSA reference
      this.doc.text(
        `DFSA Financial Services Application - ${applicationRef}`,
        PDF_CONFIG.marginLeft,
        PDF_CONFIG.pageHeight - 10
      );

      // Right: Page number
      const pageText = `Page ${i} of ${totalPages}`;
      const pageTextWidth = this.doc.getTextWidth(pageText);
      this.doc.text(
        pageText,
        PDF_CONFIG.pageWidth - PDF_CONFIG.marginRight - pageTextWidth,
        PDF_CONFIG.pageHeight - 10
      );
    }
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Generate and download PDF from form data
 * Main entry point for PDF generation
 */
export function generateApplicationPDF(
  formData: FSApplicationFormData,
  options: PDFGeneratorOptions = {}
): void {
  const generator = new DFSAPDFGenerator();
  generator.generatePDF(formData, options);
  generator.downloadPDF(options.applicationRef);
}

/**
 * Generate PDF and return as Blob
 */
export function generateApplicationPDFBlob(
  formData: FSApplicationFormData,
  options: PDFGeneratorOptions = {}
): Blob {
  const generator = new DFSAPDFGenerator();
  generator.generatePDF(formData, options);
  return generator.getPDFBlob();
}

/**
 * Generate PDF and return as base64 string
 */
export function generateApplicationPDFBase64(
  formData: FSApplicationFormData,
  options: PDFGeneratorOptions = {}
): string {
  const generator = new DFSAPDFGenerator();
  generator.generatePDF(formData, options);
  return generator.getPDFBase64();
}

// Export types
export type { PDFGeneratorOptions, DocumentInfo };
