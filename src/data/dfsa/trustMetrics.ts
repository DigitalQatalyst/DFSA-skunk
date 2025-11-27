import { TrustMetric } from '../../types/dfsa';

/**
 * Trust metrics displayed in the Hero Section
 * These highlight our track record and credibility
 */
export const trustMetrics: TrustMetric[] = [
  {
    id: 'firms-licensed',
    value: 791,
    label: 'Firms Licensed',
    description: 'Total financial services firms we\'ve helped secure DFSA authorization',
    icon: 'Building2',
  },
  {
    id: 'average-timeline',
    value: 4.5,
    label: '3-6 Month Timeline',
    description: 'Average time from application to final license issuance',
    icon: 'Clock',
  },
  {
    id: 'success-rate',
    value: 95,
    label: '95% Success Rate',
    description: 'First-time application approval rate for our clients',
    icon: 'TrendingUp',
  },
  {
    id: 'expert-advisors',
    value: 15,
    label: 'Expert Regulatory Advisors',
    description: 'Former DFSA supervisors and regulatory specialists on our team',
    icon: 'Users',
  },
];
