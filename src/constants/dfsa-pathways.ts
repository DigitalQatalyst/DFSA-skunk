/**
 * DFSA Pathway Constants
 * Data for Authorization, Registration, and Recognition pathway selection
 */

import {
  AuthorizationPathway,
  RegistrationCategory,
  RecognitionCategory,
} from '../types/dfsa-pathways';

/**
 * Authorization Pathways
 * 5 distinct pathways for financial services authorization
 */
export const AUTHORIZATION_PATHWAYS: AuthorizationPathway[] = [
  {
    id: 'bii',
    code: 'BII',
    title: 'Banking, Investment, Insurance Intermediation',
    description:
      'Deposit-taking, credit provision, dealing, managing assets, advising, arranging, insurance intermediation.',
    meta: '16 Activities | Categories 1-4',
    activities: 16,
    categories: '1-4',
  },
  {
    id: 'ins-gen',
    code: 'INS-GEN',
    title: 'Insurance (General) Business',
    description:
      'Underwriting general (non-life) insurance contracts as principal.',
    meta: '2 Activities | 8 Classes',
    activities: 2,
  },
  {
    id: 'ins-life',
    code: 'INS-LIFE',
    title: 'Insurance (Life) Business',
    description:
      'Underwriting life and long-term insurance contracts as principal.',
    meta: '2 Activities | 6 Classes',
    activities: 2,
  },
  {
    id: 'msb',
    code: 'MSB',
    title: 'Money Services Business',
    description:
      'Payment services, money transmission, stored value facilities.',
    meta: '1 Activity | 5 Sub-activities',
    activities: 1,
  },
  {
    id: 'rep',
    code: 'REP',
    title: 'Representative Office',
    description:
      'Marketing and promotional activities only. No regulated Financial Services.',
    meta: 'Principal Representative Required',
  },
];

/**
 * Registration Categories
 * 2 categories for entity/individual registration
 */
export const REGISTRATION_CATEGORIES: RegistrationCategory[] = [
  {
    id: 'ra',
    code: 'RA',
    title: 'Registered Auditor',
    description: 'Auditors approved to audit DFSA-regulated firms.',
    meta: 'AUD Module',
    module: 'AUD',
  },
  {
    id: 'dnfbp',
    code: 'DNFBP',
    title: 'Designated Non-Financial Business or Profession',
    description:
      'Lawyers, accountants, real estate agents, dealers in precious metals.',
    meta: 'AML Module',
    module: 'AML',
  },
];

/**
 * Recognition Categories
 * 2 categories for entity recognition
 */
export const RECOGNITION_CATEGORIES: RecognitionCategory[] = [
  {
    id: 'rb',
    code: 'RB',
    title: 'Recognised Body',
    description:
      'Foreign exchange or clearing house recognised to operate in DIFC.',
    meta: 'AMI Module',
    module: 'AMI',
  },
  {
    id: 'rm',
    code: 'RM',
    title: 'Recognised Member',
    description:
      'Member of a recognised body or Authorised Market Institution.',
    meta: 'AMI Module',
    module: 'AMI',
  },
];
