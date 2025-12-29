import { Testimonial } from '../../types/dfsa';

/**
 * Client Testimonials
 * Success stories from firms we've helped authorize
 */
export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote: 'The team\'s expertise in navigating the DFSA authorization process was invaluable. They handled every detail with professionalism and ensured we achieved our Category 3C license within 5 months.',
    name: 'Sarah Al Mansoori',
    position: 'CEO',
    company: 'Gulf Asset Management',
    companyType: 'Asset Management Firm',
    licenseCategory: 'Category 3C',
    rating: 5,
    location: 'DIFC, Dubai',
    image: '/testimonials/sarah-al-mansoori.jpg',
  },
  {
    id: 'testimonial-2',
    quote: 'Their ongoing compliance support has been exceptional. Having an outsourced MLRO and Compliance Officer allows us to focus on growing our business while maintaining full regulatory compliance.',
    name: 'Mohammed Al Zaabi',
    position: 'Managing Director',
    company: 'Emirates Advisory Partners',
    companyType: 'Financial Advisory Firm',
    licenseCategory: 'Category 4',
    rating: 5,
    location: 'DIFC, Dubai',
    image: '/testimonials/mohammed-al-zaabi.jpg',
  },
  {
    id: 'testimonial-3',
    quote: 'Securing our Category 2 license was complex, but their former DFSA supervisors on the team made all the difference. They anticipated every regulatory question and prepared us thoroughly.',
    name: 'Fatima Al Hashimi',
    position: 'Chief Operating Officer',
    company: 'MENA Capital Partners',
    companyType: 'Principal Trading Firm',
    licenseCategory: 'Category 2',
    rating: 5,
    location: 'DIFC, Dubai',
    image: '/testimonials/fatima-al-hashimi.jpg',
  },
];

/**
 * Additional testimonials for expanded carousel
 */
export const extendedTestimonials: Testimonial[] = [
  ...testimonials,
  {
    id: 'testimonial-4',
    quote: 'The Innovation Testing License pathway allowed us to pilot our FinTech solution quickly. Their regulatory sandbox expertise accelerated our market entry by months.',
    name: 'James Chen',
    position: 'Founder & CEO',
    company: 'PayTech Innovations',
    companyType: 'FinTech Startup',
    licenseCategory: 'ITL',
    rating: 5,
    location: 'DIFC, Dubai',
  },
  {
    id: 'testimonial-5',
    quote: 'Their Variation of Permission service helped us expand our license to include crypto asset activities seamlessly. The regulatory engagement was handled expertly.',
    name: 'Aisha Rahman',
    position: 'Head of Compliance',
    company: 'Digital Assets DIFC',
    companyType: 'Digital Asset Manager',
    licenseCategory: 'Category 3C + Crypto Endorsement',
    rating: 5,
    location: 'DIFC, Dubai',
  },
];
