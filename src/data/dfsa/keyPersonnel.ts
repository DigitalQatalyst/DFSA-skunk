import { PersonnelRole } from '../../types/dfsa';

/**
 * Key Personnel Requirements for DFSA Authorization
 * All authorized firms must appoint qualified individuals to these control functions
 */
export const keyPersonnel: PersonnelRole[] = [
  {
    id: 'seo',
    role: 'Senior Executive Officer',
    fullName: 'SEO',
    mandatory: true,
    mandatoryFor: ['1', '2', '3A', '3B', '3C', '4', '5', 'ITL'],
    icon: 'UserCheck',
    requirements: [
      '10-15+ years relevant financial services experience',
      'Senior management background',
      'Must be ordinarily resident in UAE',
      'Fit & Proper assessment required',
    ],
    responsibilities: [
      'Overall management of the firm',
      'Strategic direction',
      'Regulatory liaison',
      'Board reporting',
    ],
    fitAndProper: true,
    residencyRequired: true,
    yearsExperience: '10-15+',
    support: [
      'Candidate assessment',
      'AUT-IND application preparation',
      'Interview coaching',
    ],
  },
  {
    id: 'compliance-officer',
    role: 'Compliance Officer',
    fullName: 'CO',
    mandatory: true,
    mandatoryFor: ['1', '2', '3A', '3B', '3C', '4', '5', 'ITL'],
    icon: 'Shield',
    requirements: [
      'Strong regulatory compliance background',
      'Relevant qualifications (e.g., ICA Diploma)',
      'Understanding of DFSA Rulebook',
      'Fit & Proper assessment',
    ],
    responsibilities: [
      'Compliance monitoring',
      'Regulatory reporting',
      'Policy development',
      'Training and awareness',
    ],
    fitAndProper: true,
    support: [
      'Outsourced CO services available',
      'Compliance framework setup',
      'Ongoing advisory',
    ],
  },
  {
    id: 'mlro',
    role: 'Money Laundering Reporting Officer',
    fullName: 'MLRO',
    mandatory: true,
    mandatoryFor: ['1', '2', '3A', '3B', '3C', '4', '5', 'ITL'],
    icon: 'Lock',
    requirements: [
      'AML/CTF expertise',
      'Relevant certifications',
      'Understanding of financial crime risks',
      'Fit & Proper assessment',
    ],
    responsibilities: [
      'AML/CTF compliance',
      'Suspicious activity reporting',
      'Staff training',
      'Transaction monitoring',
    ],
    fitAndProper: true,
    support: [
      'Outsourced MLRO services',
      'AML systems implementation',
      'Compliance monitoring',
    ],
  },
  {
    id: 'finance-officer',
    role: 'Finance Officer',
    fullName: 'FO',
    mandatory: false,
    mandatoryFor: ['1', '2'], // Also some Category 3
    icon: 'Calculator',
    requirements: [
      'Qualified accountant (CA, CPA, ACCA)',
      'Financial management experience',
      'Regulatory reporting knowledge',
      'Fit & Proper assessment',
    ],
    responsibilities: [
      'Financial reporting',
      'Prudential returns (EPRS)',
      'Capital adequacy monitoring',
      'Budget management',
    ],
    fitAndProper: true,
    support: [
      'Finance function outsourcing',
      'Prudential reporting services',
    ],
  },
  {
    id: 'board-of-directors',
    role: 'Board of Directors',
    fullName: 'Board',
    mandatory: true,
    mandatoryFor: ['1', '2', '3A', '3B', '3C', '4', '5', 'ITL'],
    icon: 'Users',
    requirements: [
      'Mix of executive and non-executive directors',
      'Independent directors required',
      'Diverse skills and experience',
      'Collective Fit & Proper assessment',
    ],
    responsibilities: [
      'Chair must be non-executive',
      'Audit committee (for larger firms)',
      'Risk committee',
      'Regular board meetings',
      'Minutes and documentation',
    ],
    fitAndProper: true,
    support: [
      'Board composition advisory',
      'Director nominations',
      'Corporate governance framework',
    ],
  },
];

/**
 * Fit & Proper Assessment Criteria
 */
export const fitAndProperCriteria = [
  'Honesty, integrity, reputation',
  'Competence and capability',
  'Financial soundness',
  'Criminal records check',
  'Regulatory history',
];

/**
 * Helper function to get mandatory personnel for a license category
 */
export const getMandatoryPersonnel = (categoryCode: string): PersonnelRole[] => {
  return keyPersonnel.filter(
    (role) => role.mandatory && role.mandatoryFor?.includes(categoryCode)
  );
};

/**
 * Helper function to check if Finance Officer is required
 */
export const isFinanceOfficerRequired = (categoryCode: string): boolean => {
  return ['1', '2'].includes(categoryCode) || categoryCode.startsWith('3');
};
