import { AuthorizationStep } from '../../types/dfsa';

/**
 * DFSA Authorization Journey - 8 Steps
 * Complete timeline from discovery to final license issuance
 */
export const authorizationSteps: AuthorizationStep[] = [
  {
    stepNumber: 1,
    title: 'Discovery & Strategy',
    duration: '1-2 weeks',
    icon: 'Search',
    description: 'Initial consultation and strategic planning to determine the optimal path for your DFSA authorization.',
    whatHappens: [
      'Initial consultation with our regulatory experts',
      'Business model assessment',
      'License category determination',
      'Feasibility analysis',
      'Cost and timeline projections',
    ],
    deliverables: [
      'Strategic roadmap',
      'Gap analysis report',
      'Budget proposal',
    ],
    ctaLabel: 'Book Discovery Call',
    ctaUrl: '/contact#consultation',
  },
  {
    stepNumber: 2,
    title: 'Pre-Application Preparation',
    duration: '4-8 weeks',
    icon: 'FileText',
    description: 'Comprehensive preparation of all application materials and supporting documentation.',
    whatHappens: [
      'Draft Regulatory Business Plan (RBP)',
      'Develop 3-year financial model',
      'Create ICAAP/IRAP reports',
      'Draft compliance policies and procedures',
      'Prepare governance framework',
      'AML/CTF compliance manuals',
    ],
    keyDocuments: [
      'Regulatory Business Plan',
      'Financial projections',
      'Risk assessment frameworks',
      'Compliance manuals',
      'Governance policies',
    ],
    deliverables: [
      'Complete application package',
      'Pre-submission review',
    ],
    ctaLabel: 'View Sample RBP',
    ctaUrl: '/resources#rbp-template',
  },
  {
    stepNumber: 3,
    title: 'DFSA Engagement',
    duration: '1-2 weeks',
    icon: 'Handshake',
    description: 'Initial engagement with the DFSA to introduce your application and receive preliminary feedback.',
    whatHappens: [
      'Submit Letter of Intent to DIFC',
      'Preliminary discussions with DFSA',
      'Review draft RBP with regulator',
      'Address initial feedback',
      'Finalize approach',
    ],
    support: [
      'Attend all DFSA meetings',
      'Manage correspondence',
      'Navigate regulatory queries',
    ],
    ctaLabel: 'Learn More',
    ctaUrl: '/authorization-journey#dfsa-engagement',
  },
  {
    stepNumber: 4,
    title: 'Formal Application Submission',
    duration: '2-4 weeks',
    icon: 'Upload',
    description: 'Submission of complete application package including all forms, documentation, and application fees.',
    whatHappens: [
      'Complete AUT-CORE application forms',
      'Submit AUT-IND for key personnel',
      'Submit comprehensive RBP',
      'Financial model submission',
      'All supporting documentation',
    ],
    fees: {
      category1: 'USD $75,000',
      category2: 'USD $50,000',
      category3: 'USD $30,000',
      category4: 'USD $15,000',
      category5: 'USD $75,000',
    },
    ctaLabel: 'Fee Structure Guide',
    ctaUrl: '/resources#fee-structure',
  },
  {
    stepNumber: 5,
    title: 'DFSA Review & Assessment',
    duration: '8-16 weeks',
    icon: 'ClipboardCheck',
    description: 'Comprehensive review by DFSA of your application, business model, personnel, and systems.',
    whatHappens: [
      'DFSA conducts comprehensive review',
      'Assessment of business model',
      'Evaluation of key personnel (Fit & Proper)',
      'Review of systems and controls',
      'Interviews with senior management',
      'Due diligence on shareholders and controllers',
    ],
    support: [
      'We manage all DFSA queries',
      'Prepare technical responses',
      'Coordinate interviews',
      'Address compliance concerns',
    ],
    ctaLabel: 'Prepare for Assessment',
    ctaUrl: '/services#assessment-support',
  },
  {
    stepNumber: 6,
    title: 'In-Principle Approval',
    duration: '1-2 weeks',
    icon: 'CheckCircle',
    description: 'Receive conditional approval from DFSA subject to fulfilling specific operational requirements.',
    whatHappens: [
      'Receive conditional approval from DFSA',
      'Review conditions to be satisfied',
      'Plan implementation of conditions',
    ],
    deliverables: [
      'DIFC entity incorporation',
      'Lease office space in DIFC',
      'Open UAE bank account',
      'Deposit capital requirements',
      'Provide evidence of compliance',
    ],
    ctaLabel: 'Understand Conditions',
    ctaUrl: '/authorization-journey#in-principle-approval',
  },
  {
    stepNumber: 7,
    title: 'Operational Setup',
    duration: '4-6 weeks',
    icon: 'Settings',
    description: 'Establish your operational presence in DIFC and fulfill all approval conditions.',
    whatHappens: [
      'Register entity with DIFC Registrar of Companies',
      'Secure office space in DIFC',
      'Set up corporate bank account',
      'Transfer minimum capital',
      'Implement technology systems',
      'Hire required personnel',
    ],
    support: [
      'Entity formation assistance',
      'Office space recommendations',
      'Banking introductions',
      'Systems implementation',
    ],
    ctaLabel: 'Setup Checklist',
    ctaUrl: '/resources#setup-checklist',
  },
  {
    stepNumber: 8,
    title: 'Final License Issuance',
    duration: '1-2 weeks',
    icon: 'Award',
    description: 'Final review by DFSA and issuance of your Financial Services Permission.',
    whatHappens: [
      'Submit evidence of condition fulfillment',
      'Final DFSA review',
      'Financial Services Permission issued',
      'License number assigned',
      'Public register listing',
    ],
    deliverables: [
      'Fully authorized DFSA firm',
      'Listed on DFSA Public Register',
      'Ready to commence operations',
      'Subject to ongoing supervision',
    ],
    ctaLabel: 'Post-License Support',
    ctaUrl: '/services#ongoing-compliance',
  },
];

/**
 * Timeline overview by license category
 */
export const timelineOverview = {
  simple: {
    category: 'Category 4 (Advisory)',
    duration: '3-4 months',
    description: 'Simplest and fastest authorization path',
  },
  moderate: {
    category: 'Category 3C (Fund Manager)',
    duration: '4-6 months',
    description: 'Standard authorization timeline',
  },
  complex: {
    category: 'Categories 1, 2, 5',
    duration: '6-12 months',
    description: 'Complex authorizations with higher capital requirements',
  },
};

/**
 * Helper function to get total estimated duration
 */
export const getTotalDuration = (categoryCode: string): string => {
  switch (categoryCode) {
    case '4':
      return '3-4 months';
    case '3A':
    case '3B':
    case '3C':
      return '4-6 months';
    case '1':
    case '2':
    case '5':
      return '6-12 months';
    case 'ITL':
      return '2-4 months';
    default:
      return '3-6 months';
  }
};
