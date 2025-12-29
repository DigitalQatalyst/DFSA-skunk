import { FAQ } from '../../types/dfsa';

/**
 * Frequently Asked Questions
 * Common questions about DFSA authorization and compliance
 */
export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How long does the DFSA authorization process take?',
    answer: 'The timeline varies by license category. Category 4 (Advisory) typically takes 3-5 months, Category 3 (Investment Services) takes 4-6 months, and Categories 1, 2, and 5 (Banking, Principal Dealing, Islamic Finance) can take 6-12 months. The Innovation Testing License (ITL) is the fastest at 2-4 months.',
    category: 'timeline',
    relatedLinks: [
      { text: 'View Authorization Journey', url: '/authorization-journey' },
      { text: 'License Categories', url: '/license-categories' },
    ],
  },
  {
    id: 'faq-2',
    question: 'What are the minimum capital requirements?',
    answer: 'Capital requirements vary significantly by license category: Category 1 and 5 require $10 million USD, Category 2 requires $1 million USD, Category 3 ranges from $50,000 to $500,000 depending on activities, Category 4 requires only $10,000 USD, and ITL has flexible requirements based on your business model.',
    category: 'capital',
    relatedLinks: [
      { text: 'Complete Capital Requirements Guide', url: '/resources#capital-guide' },
    ],
  },
  {
    id: 'faq-3',
    question: 'Do I need a physical office in the DIFC?',
    answer: 'Yes, once you receive in-principle approval from the DFSA, you must establish a physical office presence in the Dubai International Financial Centre. We can assist with office space recommendations and DIFC entity incorporation.',
    category: 'general',
  },
  {
    id: 'faq-4',
    question: 'Can foreign firms apply for DFSA authorization?',
    answer: 'Yes, foreign firms can apply for DFSA authorization. The DIFC is an international financial center designed to attract global financial services firms. However, certain key personnel (particularly the SEO) must be ordinarily resident in the UAE.',
    category: 'general',
  },
  {
    id: 'faq-5',
    question: 'What is the difference between Category 3C and Category 4?',
    answer: 'Category 3C allows you to manage assets on a discretionary basis (making investment decisions on behalf of clients), while Category 4 only permits non-discretionary advisory services (providing advice without managing assets). Category 3C has higher capital requirements but allows for a broader range of services.',
    category: 'licensing',
  },
  {
    id: 'faq-6',
    question: 'What is the Fit & Proper assessment?',
    answer: 'The Fit & Proper assessment evaluates key personnel on criteria including honesty, integrity, reputation, competence, capability, and financial soundness. The DFSA conducts interviews, reviews backgrounds, checks criminal records, and assesses regulatory history.',
    category: 'personnel',
  },
  {
    id: 'faq-7',
    question: 'What is the Innovation Testing License (ITL)?',
    answer: 'The ITL is a regulatory sandbox license that allows FinTech startups and innovative firms to test new financial products and services in a controlled environment with reduced regulatory requirements. It\'s valid for 6 months (renewable once) with flexible capital requirements.',
    category: 'licensing',
  },
  {
    id: 'faq-8',
    question: 'How often do I need to submit regulatory reports?',
    answer: 'Reporting frequency depends on your license category and size. Prudential returns (EPRS) are typically monthly, quarterly, or annual. You\'ll also need to submit an Annual Regulatory Return, MLRO reports, and ad-hoc reports as requested by the DFSA.',
    category: 'compliance',
  },
  {
    id: 'faq-9',
    question: 'What application fees should I expect?',
    answer: 'DFSA application fees range from $15,000 (Category 4) to $75,000 (Categories 1 and 5). Category 2 is $50,000 and Category 3 is $30,000. These are non-refundable fees payable upon application submission, in addition to our professional services fees.',
    category: 'general',
  },
  {
    id: 'faq-10',
    question: 'Can I start operations while my application is being reviewed?',
    answer: 'No, you cannot conduct regulated financial services activities until you receive your final Financial Services Permission from the DFSA. Operating without authorization is a serious offense. However, you can begin operational setup after receiving in-principle approval.',
    category: 'licensing',
  },
  {
    id: 'faq-11',
    question: 'Do I need to hire all key personnel before applying?',
    answer: 'You should identify candidates for all key roles (SEO, CO, MLRO, FO if required) before applying, but you don\'t necessarily need to hire them immediately. Their applications (AUT-IND) are submitted alongside your firm application. We offer outsourced CO and MLRO services if needed.',
    category: 'personnel',
  },
  {
    id: 'faq-12',
    question: 'What ongoing compliance support do you provide?',
    answer: 'We offer comprehensive post-license support including outsourced Compliance Officer, MLRO services, prudential reporting, annual compliance reviews, regulatory change management, AML systems, corporate governance advisory, VOP applications, and audit readiness preparation.',
    category: 'compliance',
    relatedLinks: [
      { text: 'View All Compliance Services', url: '/services' },
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
