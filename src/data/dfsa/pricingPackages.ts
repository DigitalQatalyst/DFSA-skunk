import { AuthorizationPackage, ComplianceSubscription } from '../../types/dfsa';

/**
 * Authorization Packages
 * One-time fees for DFSA license application support
 */
export const authorizationPackages: AuthorizationPackage[] = [
  {
    id: 'starter',
    name: 'Starter Package',
    price: '$25,000',
    description: 'Perfect for Category 4 (Advisory Services) applications with streamlined requirements.',
    features: [
      { name: 'Regulatory Business Plan (30 pages)', included: true },
      { name: 'Basic financial model (3 years)', included: true },
      { name: '5 core compliance policies', included: true },
      { name: 'AUT-CORE application assistance', included: true },
      { name: 'AUT-IND for 3 key personnel', included: true },
      { name: 'DFSA meeting support', included: true },
      { name: 'ICAAP/IRAP reports', included: false },
      { name: 'Advanced compliance framework', included: false },
    ],
    timeline: '3-4 months',
    idealFor: ['Category 4'],
    icon: 'Rocket',
    ctaLabel: 'Get Started',
    ctaUrl: '/contact#consultation',
  },
  {
    id: 'professional',
    name: 'Professional Package',
    price: '$45,000',
    popular: true,
    description: 'Comprehensive support for Category 3 (Investment Services) applications.',
    features: [
      { name: 'Regulatory Business Plan (60 pages)', included: true },
      { name: 'Detailed financial model with sensitivity analysis', included: true },
      { name: '10+ comprehensive policies', included: true },
      { name: 'ICAAP/IRAP reports', included: true },
      { name: 'Full application management', included: true },
      { name: 'AUT-IND for all key personnel', included: true },
      { name: 'Regulatory strategy sessions', included: true },
      { name: 'Entity formation support', included: true },
    ],
    timeline: '4-6 months',
    idealFor: ['Category 3A', 'Category 3B', 'Category 3C'],
    icon: 'Briefcase',
    badge: 'Most Popular',
    ctaLabel: 'Get Started',
    ctaUrl: '/contact#consultation',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Package',
    price: '$75,000+',
    description: 'Full-service authorization for complex applications (Categories 1, 2, 5).',
    features: [
      { name: 'Comprehensive RBP (100+ pages)', included: true },
      { name: 'Complex financial modeling', included: true },
      { name: 'Complete governance framework', included: true },
      { name: 'Advanced ICAAP/IRAP', included: true },
      { name: 'Board composition advisory', included: true },
      { name: 'Shareholder structure optimization', included: true },
      { name: 'Technology systems guidance', included: true },
      { name: 'Dedicated project manager', included: true },
      { name: 'Post-license transition support', included: true },
    ],
    timeline: '6-12 months',
    idealFor: ['Category 1', 'Category 2', 'Category 5'],
    icon: 'Building2',
    ctaLabel: 'Contact Us',
    ctaUrl: '/contact#consultation',
  },
  {
    id: 'itl',
    name: 'ITL Package',
    price: '$15,000',
    description: 'Fast-track package for Innovation Testing License applications.',
    features: [
      { name: 'Streamlined business plan', included: true },
      { name: 'Testing framework design', included: true },
      { name: 'Simplified compliance policies', included: true },
      { name: 'Sandbox application support', included: true },
      { name: 'Regulatory engagement', included: true },
      { name: '6-month testing period support', included: true },
      { name: 'Transition to full license planning', included: true, details: 'Optional' },
    ],
    timeline: '2-4 months',
    idealFor: ['ITL', 'FinTech Startups'],
    icon: 'Lightbulb',
    badge: 'Fastest Timeline',
    ctaLabel: 'Apply for ITL',
    ctaUrl: '/contact#itl',
  },
];

/**
 * Ongoing Compliance Subscriptions
 * Monthly retainer packages for post-authorization support
 */
export const complianceSubscriptions: ComplianceSubscription[] = [
  {
    id: 'essential',
    tier: 'essential',
    name: 'Essential Compliance',
    priceMonthly: '$3,000',
    description: 'Basic ongoing compliance support for smaller authorized firms.',
    features: [
      'Quarterly compliance monitoring',
      'Regulatory change alerts',
      'Annual compliance review',
      'Email/phone support',
      'Basic policy updates',
    ],
    icon: 'Shield',
    ctaLabel: 'Subscribe',
    ctaUrl: '/contact#compliance',
  },
  {
    id: 'full-support',
    tier: 'full-support',
    name: 'Full Support',
    priceMonthly: '$6,000',
    popular: true,
    description: 'Comprehensive compliance management with dedicated support.',
    features: [
      'Outsourced Compliance Officer',
      'Monthly compliance monitoring',
      'MLRO services included',
      'Quarterly prudential reporting',
      'Regulatory change management',
      'Staff training (2 sessions/year)',
      'Dedicated compliance manager',
      'Priority support',
    ],
    icon: 'Star',
    ctaLabel: 'Subscribe',
    ctaUrl: '/contact#compliance',
  },
  {
    id: 'comprehensive',
    tier: 'comprehensive',
    name: 'Comprehensive Care',
    priceMonthly: '$10,000',
    description: 'White-glove regulatory support for growing firms.',
    features: [
      'Everything in Full Support, plus:',
      'Outsourced Finance Officer',
      'Monthly prudential reporting',
      'Board meeting attendance',
      'Corporate governance advisory',
      'Audit readiness preparation',
      'VOP application support',
      'Unlimited training sessions',
      'Strategic regulatory advisory',
    ],
    icon: 'Crown',
    ctaLabel: 'Contact Us',
    ctaUrl: '/contact#compliance',
  },
];

/**
 * Helper function to get package by tier
 */
export const getPackageByTier = (tier: string): AuthorizationPackage | undefined => {
  return authorizationPackages.find((pkg) => pkg.id === tier);
};

/**
 * Helper function to get subscription by tier
 */
export const getSubscriptionByTier = (tier: string): ComplianceSubscription | undefined => {
  return complianceSubscriptions.find((sub) => sub.tier === tier);
};

/**
 * Get recommended package for a license category
 */
export const getRecommendedPackage = (categoryCode: string): AuthorizationPackage => {
  if (categoryCode === '4') return authorizationPackages[0]; // Starter
  if (categoryCode.startsWith('3')) return authorizationPackages[1]; // Professional
  if (categoryCode === 'ITL') return authorizationPackages[3]; // ITL
  return authorizationPackages[2]; // Enterprise for 1, 2, 5
};
