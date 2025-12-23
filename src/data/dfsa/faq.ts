import { FAQ } from '../../types/dfsa';

/**
 * Frequently Asked Questions
 * These FAQs provide general information only. Specific requirements determined by DFSA based
 * on individual circumstances. Refer to DFSA Rulebook for authoritative guidance.
 */
export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How long does the DFSA authorisation process take?',
    answer: 'The timeline varies by licence category and individual circumstances. DFSA determines processing duration based on application complexity, completeness, and assessment requirements. Historical processing times: Category 4 (Advisory) typically 3-5 months, Category 3 (Investment Services) 4-6 months, and Categories 1, 2, and 5 (Banking, Principal Dealing, Islamic Finance) 6-12 months. The Innovation Testing Licence (ITL) typically 2-4 months. Refer to AUT Module for procedural information. Historical processing times do not guarantee future timelines.',
    category: 'timeline',
    relatedLinks: [
      { text: 'View Authorisation Journey', url: '/authorization-journey' },
      { text: 'Licence Categories', url: '/license-categories' },
    ],
  },
  {
    id: 'faq-2',
    question: 'What are the minimum capital requirements?',
    answer: 'Capital requirements per AMEN Module vary by licence category: Category 1 and 5 require $10 million USD, Category 2 requires $1 million USD, Category 3 ranges from $50,000 to $500,000 depending on activities, Category 4 requires $10,000 USD, and ITL has requirements determined by DFSA based on business model. All requirements subject to DFSA determination and may vary based on specific circumstances.',
    category: 'capital',
    relatedLinks: [
      { text: 'Capital Requirements Information', url: '/resources#capital-guide' },
    ],
  },
  {
    id: 'faq-3',
    question: 'Do I need a physical office in the DIFC?',
    answer: 'Yes, pursuant to AUT 6.5, once you receive in-principle approval from the DFSA, you must establish a physical office presence in the Dubai International Financial Centre. We can provide information on office space requirements and DIFC entity incorporation procedures.',
    category: 'general',
  },
  {
    id: 'faq-4',
    question: 'Can foreign firms apply for DFSA authorisation?',
    answer: 'Yes, foreign firms can apply for DFSA authorisation. The DIFC is an international financial centre designed to attract global financial services firms. Per AMEN Module requirements, certain key personnel (particularly the Senior Executive Officer) must be ordinarily resident in the UAE. Specific requirements determined by DFSA based on firm structure and activities.',
    category: 'general',
  },
  {
    id: 'faq-5',
    question: 'What is the difference between Category 3C and Category 4?',
    answer: 'Per AUT Module 3.1.3 and 3.1.4: Category 3C permits managing assets on a discretionary basis (making investment decisions on behalf of clients), whilst Category 4 permits only non-discretionary advisory services (providing advice without managing assets). Category 3C has higher capital requirements per AMEN Module but permits a broader range of services. Specific authorisation scope determined by DFSA based on application.',
    category: 'licensing',
  },
  {
    id: 'faq-6',
    question: 'What is the Fit & Proper assessment?',
    answer: 'The Fit & Proper assessment (per DFSA Law and AMEN Module) evaluates key personnel on criteria including honesty, integrity, reputation, competence, capability, and financial soundness. The DFSA conducts interviews, reviews backgrounds, checks criminal records, and assesses regulatory history. DFSA determines fitness and propriety on a case-by-case basis.',
    category: 'personnel',
  },
  {
    id: 'faq-7',
    question: 'What is the Innovation Testing Licence (ITL)?',
    answer: 'The ITL (per AUT Module 2) is a regulatory sandbox licence that allows FinTech startups and innovative firms to test new financial products and services in a controlled environment with tailored regulatory requirements. Testing period and conditions determined by DFSA. Capital requirements are flexible and determined by DFSA based on business model.',
    category: 'licensing',
  },
  {
    id: 'faq-8',
    question: 'How often do I need to submit regulatory reports?',
    answer: 'Reporting frequency (per SUP Module) depends on your licence category and size. Prudential returns (EPRS) are typically monthly, quarterly, or annual. You will also need to submit an Annual Regulatory Return, MLRO reports per AML Module, and ad-hoc reports as requested by the DFSA. Specific requirements determined by DFSA based on your authorisation.',
    category: 'compliance',
  },
  {
    id: 'faq-9',
    question: 'What application fees should I expect?',
    answer: 'DFSA application fees per DFSA Fee Schedule: $15,000 (Category 4), $30,000 (Category 3), $50,000 (Category 2), and $75,000 (Categories 1 and 5). These are non-refundable fees payable directly to DFSA upon application submission. Fees subject to change per DFSA Fee Schedule. Additional fees for documentation preparation services are separate.',
    category: 'general',
  },
  {
    id: 'faq-10',
    question: 'Can I start operations whilst my application is being reviewed?',
    answer: 'No, pursuant to DFSA Law Article 41A, you cannot conduct regulated financial services activities until you receive your final Financial Services Permission from the DFSA. Operating without authorisation is a serious offence. However, you may begin operational setup (entity formation, office leasing, bank accounts) after receiving in-principle approval pursuant to AUT 6.5, subject to conditions specified by DFSA.',
    category: 'licensing',
  },
  {
    id: 'faq-11',
    question: 'Do I need to hire all key personnel before applying?',
    answer: 'You should identify candidates for all key roles (SEO, Compliance Officer, MLRO, Finance Officer if required per AMEN Module) before applying. Their individual applications (AUT-IND) addressing fitness and propriety per AMEN Module are submitted alongside your firm application. DFSA assesses all key personnel as part of the authorisation process. We can provide information on key personnel requirements.',
    category: 'personnel',
  },
  {
    id: 'faq-12',
    question: 'What ongoing compliance support do you provide?',
    answer: 'We provide post-authorisation documentation support including: assistance with compliance reporting per SUP Module, MLRO procedures per AML Module, prudential reporting, annual compliance reviews, regulatory change monitoring, corporate governance documentation, VOP application preparation, and audit readiness preparation. All ongoing compliance obligations determined by DFSA based on your authorisation.',
    category: 'compliance',
    relatedLinks: [
      { text: 'View Compliance Services Information', url: '/services' },
    ],
  },
];

/**
 * Helper function to get FAQs by category
 */
export const getFAQsByCategory = (category: string): FAQ[] => {
  return faqs.filter((faq) => faq.category === category);
};

/**
 * FAQ Categories for filtering
 */
export const faqCategories = [
  { id: 'all', label: 'All Questions', count: faqs.length },
  { id: 'general', label: 'General', count: getFAQsByCategory('general').length },
  { id: 'licensing', label: 'Licensing', count: getFAQsByCategory('licensing').length },
  { id: 'capital', label: 'Capital', count: getFAQsByCategory('capital').length },
  { id: 'personnel', label: 'Personnel', count: getFAQsByCategory('personnel').length },
  { id: 'compliance', label: 'Compliance', count: getFAQsByCategory('compliance').length },
  { id: 'timeline', label: 'Timeline', count: getFAQsByCategory('timeline').length },
];
