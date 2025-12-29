import { AuthorizationStep } from '../../types/dfsa';

/**
 * DFSA Authorisation Journey - 8 Steps
 * Complete process from initial assessment to final licence issuance
 * DFSA determines all timelines and requirements based on individual circumstances
 */
export const authorizationSteps: AuthorizationStep[] = [
  {
    stepNumber: 1,
    title: 'Initial Assessment',
    duration: 'Variable',
    icon: 'Search',
    description: 'Assessment of proposed activities against DFSA regulatory requirements.',
    whatHappens: [
      'Review proposed financial services activities',
      'Identify applicable licence category per AUT Module 3',
      'Assess regulatory requirements per relevant Sourcebooks',
      'Documentation preparation planning',
      'Documentation requirements assessment',
    ],
    deliverables: [
      'Assessment summary',
      'Applicable regulatory requirements overview',
      'Documentation preparation plan',
    ],
    ctaLabel: 'Request Information',
    ctaUrl: '/contact#consultation',
  },
  {
    stepNumber: 2,
    title: 'Pre-Application Preparation',
    duration: '4-8 weeks (typical)',
    icon: 'FileText',
    description: 'Preparation of application materials and supporting documentation addressing DFSA requirements.',
    whatHappens: [
      'Draft Regulatory Business Plan per DFSA RBP Guide',
      'Develop financial model addressing prudential requirements',
      'Create ICAAP/IRAP reports (if required)',
      'Draft policies required pursuant to COND Module',
      'Prepare governance framework',
      'AML/CTF procedures per AML Module',
    ],
    keyDocuments: [
      'Regulatory Business Plan (DFSA RBP Guide)',
      'Financial projections (AMEN Module requirements)',
      'Risk assessment frameworks (COND Module)',
      'Compliance policies (various Sourcebooks)',
      'Governance documentation',
    ],
    deliverables: [
      'Application documentation package',
      'Pre-submission internal review',
    ],
    ctaLabel: 'View Sample RBP',
    ctaUrl: '/resources#rbp-template',
  },
  {
    stepNumber: 3,
    title: 'DFSA Engagement',
    duration: 'Variable (at DFSA discretion)',
    icon: 'Handshake',
    description: 'Optional preliminary engagement with DFSA. DFSA determines whether to provide pre-submission feedback.',
    whatHappens: [
      'Submit Letter of Intent to DIFC (optional)',
      'Preliminary discussions with DFSA (at DFSA discretion)',
      'DFSA may provide informal feedback',
      'Address any preliminary matters raised',
    ],
    support: [
      'Assist with correspondence preparation',
      'Coordinate meetings if arranged',
      'Support with responding to preliminary queries',
    ],
    ctaLabel: 'Learn More',
    ctaUrl: '/authorization-journey#dfsa-engagement',
  },
  {
    stepNumber: 4,
    title: 'Formal Application Submission',
    duration: '2-4 weeks (preparation)',
    icon: 'Upload',
    description: 'Submission of complete application package pursuant to AUT Module requirements.',
    whatHappens: [
      'Complete AUT-CORE application forms',
      'Submit AUT-IND for key personnel',
      'Submit comprehensive Regulatory Business Plan',
      'Financial model submission',
      'All supporting documentation per AUT Module',
    ],
    fees: {
      category1: 'USD $75,000 (subject to DFSA Fee Schedule)',
      category2: 'USD $50,000 (subject to DFSA Fee Schedule)',
      category3: 'USD $30,000 (subject to DFSA Fee Schedule)',
      category4: 'USD $15,000 (subject to DFSA Fee Schedule)',
      category5: 'USD $75,000 (subject to DFSA Fee Schedule)',
    },
    ctaLabel: 'Fee Structure Guide',
    ctaUrl: '/resources#fee-structure',
  },
  {
    stepNumber: 5,
    title: 'DFSA Review & Assessment',
    duration: 'Variable (determined by DFSA)',
    icon: 'ClipboardCheck',
    description: 'DFSA conducts comprehensive assessment in accordance with DFSA Law Article 41A and AUT Module.',
    whatHappens: [
      'DFSA conducts comprehensive review',
      'Assessment of business model viability',
      'Evaluation of key personnel fitness and propriety',
      'Review of systems and controls adequacy',
      'Interviews with senior management (if required)',
      'Due diligence on shareholders and controllers',
    ],
    support: [
      'Assist with responding to DFSA information requests',
      'Prepare technical responses to regulatory queries',
      'Coordinate interview preparation',
      'Support with addressing compliance matters',
    ],
    ctaLabel: 'Assessment Information',
    ctaUrl: '/services#assessment-support',
  },
  {
    stepNumber: 6,
    title: 'In-Principle Approval',
    duration: '1-2 weeks (if approved)',
    icon: 'CheckCircle',
    description: 'If DFSA grants conditional approval pursuant to AUT 6.5. In-principle approval is conditional and does not constitute authorisation.',
    whatHappens: [
      'Receive conditional approval from DFSA (if granted)',
      'Review conditions specified by DFSA',
      'Plan implementation of conditions',
    ],
    deliverables: [
      'DIFC entity incorporation (required pursuant to AUT 6.5)',
      'Lease office space in DIFC',
      'Open UAE bank account',
      'Deposit capital requirements per AMEN Module',
      'Provide evidence of condition fulfillment to DFSA',
    ],
    ctaLabel: 'Understand Conditions',
    ctaUrl: '/authorization-journey#in-principle-approval',
  },
  {
    stepNumber: 7,
    title: 'Operational Setup',
    duration: '4-6 weeks (typical)',
    icon: 'Settings',
    description: 'Establish operational presence in DIFC and fulfil conditions specified by DFSA in in-principle approval.',
    whatHappens: [
      'Register entity with DIFC Registrar of Companies',
      'Secure office space in DIFC',
      'Set up corporate bank account',
      'Transfer minimum capital per AMEN Module',
      'Implement technology systems',
      'Hire personnel per AMEN Module requirements',
    ],
    support: [
      'Information on entity formation procedures',
      'Information on office space requirements',
      'Information on banking requirements',
      'Information on systems implementation',
    ],
    ctaLabel: 'Setup Information',
    ctaUrl: '/resources#setup-checklist',
  },
  {
    stepNumber: 8,
    title: 'Final Licence Issuance',
    duration: 'Variable (DFSA determines)',
    icon: 'Award',
    description: 'If DFSA determines all conditions satisfied and requirements met pursuant to AUT Module. Authorisation subject to ongoing supervision pursuant to SUP Module.',
    whatHappens: [
      'Submit evidence of condition fulfilment to DFSA',
      'DFSA conducts final review',
      'Financial Services Permission issued (if approved)',
      'Licence number assigned',
      'Public register listing',
    ],
    deliverables: [
      'Authorised DFSA firm (if approved)',
      'Listed on DFSA Public Register',
      'May commence regulated activities',
      'Subject to ongoing supervision (SUP Module)',
    ],
    ctaLabel: 'Post-Authorisation Information',
    ctaUrl: '/services#ongoing-compliance',
  },
];

/**
 * Timeline information by licence category
 * Note: These are historical averages only. DFSA determines actual processing timelines
 * based on application complexity, completeness, and regulatory assessment requirements.
 */
export const timelineOverview = {
  category4: {
    category: 'Category 4 (Advisory)',
    typicalRange: '3-4 months',
    description: 'Lower capital requirements per AMEN Module. Timeline determined by DFSA.',
  },
  category3: {
    category: 'Category 3 (Investment Services)',
    typicalRange: '4-6 months',
    description: 'Variable capital requirements. Timeline determined by DFSA based on scope.',
  },
  categories125: {
    category: 'Categories 1, 2, 5',
    typicalRange: '6-12 months',
    description: 'Higher capital requirements per AMEN Module. Timeline determined by DFSA.',
  },
};

/**
 * Helper function to get typical duration range
 * IMPORTANT: These are historical ranges only. Actual timeline determined by DFSA.
 */
export const getTotalDuration = (categoryCode: string): string => {
  switch (categoryCode) {
    case '4':
      return '3-4 months (typical)';
    case '3A':
    case '3B':
    case '3C':
      return '4-6 months (typical)';
    case '1':
    case '2':
    case '5':
      return '6-12 months (typical)';
    case 'ITL':
      return '2-4 months (typical)';
    default:
      return '3-6 months (typical)';
  }
};
