import { ComplianceService } from '../../types/dfsa';

/**
 * Ongoing Compliance Services
 * Post-authorization regulatory support and compliance management
 */
export const complianceServices: ComplianceService[] = [
  {
    id: 'outsourced-co',
    title: 'Outsourced Compliance Officer Services',
    icon: 'Shield',
    description: 'Dedicated regulatory compliance officer providing comprehensive compliance monitoring and advisory.',
    whatWeProvide: [
      'Dedicated regulatory compliance officer',
      'Quarterly compliance monitoring reviews',
      'Regulatory change management',
      'Policy updates and maintenance',
      'Staff training programs',
      'Compliance attestations',
    ],
    pricing: {
      model: 'monthly',
      amount: '$3,000+',
      frequency: 'Monthly retainer',
    },
    idealFor: [
      'Smaller authorized firms',
      'Firms without full-time compliance resource',
      'Cost-effective compliance solution',
    ],
    ctaLabel: 'Get Quote',
    ctaUrl: '/contact#consultation',
  },
  {
    id: 'mlro-services',
    title: 'Money Laundering Reporting Officer (MLRO)',
    icon: 'Lock',
    description: 'Outsourced MLRO function with comprehensive AML/CTF compliance management.',
    whatWeProvide: [
      'Outsourced MLRO function',
      'AML/CTF transaction monitoring',
      'Suspicious activity reporting (SAR filing)',
      'Customer due diligence oversight',
      'AML systems implementation',
      'Staff training and awareness',
    ],
    deliverables: [
      'Monthly monitoring reports',
      'Annual MLRO report to DFSA',
      'SAR submissions as required',
    ],
    pricing: {
      model: 'monthly',
      amount: '$2,500+',
      frequency: 'Monthly retainer',
    },
    ctaLabel: 'Learn More',
    ctaUrl: '/services/mlro',
  },
  {
    id: 'prudential-reporting',
    title: 'Prudential Reporting (EPRS)',
    icon: 'BarChart3',
    description: 'Electronic Prudential Reporting System submissions and capital adequacy monitoring.',
    whatWeProvide: [
      'Electronic Prudential Reporting System (EPRS) submissions',
      'Capital adequacy monitoring',
      'Liquidity management reporting',
      'Large exposures reporting',
      'PIB returns preparation',
    ],
    deliverables: [
      'Monthly, quarterly, or annual submissions',
      'Ad-hoc reporting as required',
    ],
    pricing: {
      model: 'per-return',
      amount: '$500+',
      customNote: 'Per return',
    },
    ctaLabel: 'Reporting Calendar',
    ctaUrl: '/resources#reporting-calendar',
  },
  {
    id: 'annual-compliance-reviews',
    title: 'Annual Compliance Monitoring Reviews',
    icon: 'ClipboardCheck',
    description: 'Independent compliance assessment with gap analysis and recommendations.',
    whatWeProvide: [
      'Independent compliance assessment',
      'Gap analysis against DFSA Rulebook',
      'Risk assessment updates',
      'Recommendations report',
      'Management action plans',
    ],
    deliverables: [
      'Comprehensive compliance report',
      'Executive summary for board',
      'Action plan with priorities',
    ],
    pricing: {
      model: 'project',
      amount: '$5,000+',
    },
    ctaLabel: 'Schedule Review',
    ctaUrl: '/contact#consultation',
  },
  {
    id: 'regulatory-change-management',
    title: 'Regulatory Change Management',
    icon: 'RefreshCcw',
    description: 'Stay ahead of regulatory changes with proactive monitoring and implementation support.',
    whatWeProvide: [
      'Monitoring DFSA regulatory updates',
      'Impact assessment of new rules',
      'Implementation guidance',
      'Policy and procedure updates',
      'Staff training on changes',
    ],
    deliverables: [
      'DFSA circulars and Dear SEO letters',
      'Rulebook amendments tracking',
      'Consultation papers analysis',
      'International regulatory changes updates',
    ],
    pricing: {
      model: 'retainer',
      amount: 'Included',
      customNote: 'Included in retainer services',
    },
    ctaLabel: 'Subscribe to Updates',
    ctaUrl: '/services/regulatory-updates',
  },
  {
    id: 'aml-systems',
    title: 'AML/CTF Systems & Controls',
    icon: 'Network',
    description: 'Advanced AML/CTF technology solutions with transaction monitoring and screening.',
    whatWeProvide: [
      'Transaction monitoring systems',
      'Customer screening tools',
      'Risk assessment frameworks',
      'Sanctions screening',
      'PEP identification',
      'Adverse media monitoring',
    ],
    deliverables: [
      'Leading RegTech solutions',
      'API integrations',
      'Real-time monitoring',
    ],
    pricing: {
      model: 'project',
      amount: '$10,000+',
      customNote: 'Setup from $10,000 + monthly licensing',
    },
    ctaLabel: 'View Solutions',
    ctaUrl: '/services/aml-systems',
  },
  {
    id: 'governance-advisory',
    title: 'Corporate Governance Advisory',
    icon: 'Building2',
    description: 'Board effectiveness and corporate governance framework development.',
    whatWeProvide: [
      'Board effectiveness reviews',
      'Committee structure design',
      'Terms of reference',
      'Board meeting support',
      'Director training',
      'Governance policy development',
    ],
    deliverables: [
      'DFSA governance requirements',
      'International standards compliance',
      'ESG considerations',
    ],
    pricing: {
      model: 'project',
      amount: '$5,000+',
      customNote: 'Project-based pricing',
    },
    ctaLabel: 'Improve Governance',
    ctaUrl: '/services/governance',
  },
  {
    id: 'vop',
    title: 'Variation of Permission (VOP)',
    icon: 'Plus',
    description: 'Expand your license scope with VOP applications for new services and activities.',
    whatWeProvide: [
      'VOP application preparation',
      'Regulatory engagement',
      'Implementation planning',
      'Systems and controls updates',
    ],
    deliverables: [
      'Adding new financial services',
      'Expanding to retail clients',
      'Crypto asset endorsements',
      'Virtual asset activities',
    ],
    pricing: {
      model: 'project',
      amount: '$10,000+',
    },
    timeline: '2-4 months',
    ctaLabel: 'Plan Your Expansion',
    ctaUrl: '/services/vop',
  },
  {
    id: 'audit-readiness',
    title: 'Regulatory Audit Readiness',
    icon: 'FileCheck',
    description: 'Prepare for DFSA supervision with mock audits and documentation reviews.',
    whatWeProvide: [
      'Pre-audit compliance reviews',
      'Documentation preparation',
      'Management information pack',
      'Mock audit simulations',
      'Response preparation training',
    ],
    deliverables: [
      'Risk-based assessment preparation',
      'Thematic review readiness',
      'On-site visit support',
      'Document request management',
    ],
    pricing: {
      model: 'project',
      amount: '$7,500+',
    },
    ctaLabel: 'Prepare for Audit',
    ctaUrl: '/contact#consultation',
  },
];

/**
 * Helper function to get services by pricing model
 */
export const getServicesByPricingModel = (model: string): ComplianceService[] => {
  return complianceServices.filter((service) => service.pricing.model === model);
};

/**
 * Helper function to get most popular services (can be customized)
 */
export const getPopularServices = (): ComplianceService[] => {
  return complianceServices.filter((service) =>
    ['outsourced-co', 'mlro-services', 'prudential-reporting'].includes(service.id)
  );
};
