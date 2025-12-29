import { Resource } from '../../types/dfsa';

/**
 * Resource Library Content
 * Guides, templates, regulatory updates, videos, and case studies
 */
export const resources: Resource[] = [
  // Guides & White Papers
  {
    id: 'guide-category-3c',
    title: 'Complete Guide to DFSA Category 3C Licensing',
    description: 'Comprehensive 45-page guide covering all aspects of Category 3C asset management authorization.',
    type: 'guide',
    fileType: 'PDF',
    icon: 'FileText',
    url: '#', // Placeholder
    downloadable: true,
    fileSize: '2.5 MB',
    publishedDate: '2024-11-01',
    category: ['licensing', 'category-3'],
    featured: true,
  },
  {
    id: 'guide-capital-requirements',
    title: 'Understanding DIFC Capital Requirements',
    description: 'Detailed explanation of capital adequacy requirements for all license categories.',
    type: 'guide',
    fileType: 'PDF',
    icon: 'FileText',
    url: '#',
    downloadable: true,
    fileSize: '1.8 MB',
    publishedDate: '2024-10-15',
    category: ['capital', 'licensing'],
    featured: true,
  },
  {
    id: 'guide-aml-ctf',
    title: 'AML/CTF Compliance in the DIFC',
    description: 'Best practices guide for anti-money laundering and counter-terrorism financing compliance.',
    type: 'guide',
    fileType: 'PDF',
    icon: 'FileText',
    url: '#',
    downloadable: true,
    fileSize: '3.2 MB',
    publishedDate: '2024-09-20',
    category: ['compliance', 'aml'],
  },
  {
    id: 'guide-governance',
    title: 'Board Governance for DFSA Firms',
    description: 'Corporate governance framework and best practices for authorized firms.',
    type: 'guide',
    fileType: 'PDF',
    icon: 'FileText',
    url: '#',
    downloadable: true,
    fileSize: '1.5 MB',
    publishedDate: '2024-08-10',
    category: ['governance'],
  },

  // Templates & Tools
  {
    id: 'template-rbp',
    title: 'Regulatory Business Plan Template',
    description: 'Editable RBP template with guidance notes for DFSA applications.',
    type: 'template',
    fileType: 'DOCX',
    icon: 'File',
    url: '#',
    downloadable: true,
    fileSize: '450 KB',
    publishedDate: '2024-11-10',
    category: ['application', 'templates'],
    featured: true,
  },
  {
    id: 'template-compliance-manual',
    title: 'Compliance Manual Template',
    description: 'Comprehensive compliance policies and procedures template.',
    type: 'template',
    fileType: 'DOCX',
    icon: 'File',
    url: '#',
    downloadable: true,
    fileSize: '680 KB',
    publishedDate: '2024-10-25',
    category: ['compliance', 'templates'],
  },
  {
    id: 'template-financial-model',
    title: 'Financial Model Spreadsheet',
    description: '3-year financial projection model with ICAAP calculations.',
    type: 'template',
    fileType: 'XLSX',
    icon: 'FileSpreadsheet',
    url: '#',
    downloadable: true,
    fileSize: '850 KB',
    publishedDate: '2024-10-01',
    category: ['financial', 'templates'],
  },

  // Regulatory Updates
  {
    id: 'update-2024-q4',
    title: 'DFSA Regulatory Updates Q4 2024',
    description: 'Latest DFSA circulars, Dear SEO letters, and rulebook amendments.',
    type: 'update',
    fileType: 'PDF',
    icon: 'Bell',
    url: '#',
    downloadable: true,
    publishedDate: '2024-11-20',
    category: ['regulatory-updates'],
    featured: true,
  },
  {
    id: 'update-crypto-assets',
    title: 'New Crypto Asset Regulations',
    description: 'Analysis of updated virtual asset and crypto asset endorsement requirements.',
    type: 'update',
    fileType: 'ARTICLE',
    icon: 'TrendingUp',
    url: '#',
    downloadable: false,
    publishedDate: '2024-11-05',
    category: ['regulatory-updates', 'crypto'],
  },

  // Videos & Webinars
  {
    id: 'video-authorization-process',
    title: 'DFSA Authorization Process Explained',
    description: 'Step-by-step video walkthrough of the complete authorization journey.',
    type: 'video',
    fileType: 'MP4',
    icon: 'Video',
    url: '#',
    downloadable: false,
    thumbnail: '/videos/authorization-process.jpg',
    duration: '15 min',
    publishedDate: '2024-10-20',
    category: ['licensing', 'education'],
    featured: true,
  },
  {
    id: 'webinar-itl',
    title: 'Innovation Testing License Workshop',
    description: 'Recorded webinar on navigating the DFSA regulatory sandbox.',
    type: 'video',
    fileType: 'WEBINAR',
    icon: 'Video',
    url: '#',
    downloadable: false,
    duration: '45 min',
    publishedDate: '2024-09-15',
    category: ['licensing', 'itl', 'education'],
  },

  // Case Studies
  {
    id: 'case-study-asset-manager',
    title: 'Category 3C Success Story: Gulf Asset Management',
    description: 'How we helped a regional asset manager secure DFSA authorization in 5 months.',
    type: 'case-study',
    fileType: 'PDF',
    icon: 'Award',
    url: '#',
    downloadable: true,
    publishedDate: '2024-08-30',
    category: ['case-studies', 'category-3'],
  },
  {
    id: 'case-study-fintech',
    title: 'FinTech Sandbox to Full License Journey',
    description: 'From ITL to Category 4: A successful transition story.',
    type: 'case-study',
    fileType: 'PDF',
    icon: 'Award',
    url: '#',
    downloadable: true,
    publishedDate: '2024-07-20',
    category: ['case-studies', 'itl'],
  },
];

/**
 * Helper function to get resources by type
 */
export const getResourcesByType = (type: string): Resource[] => {
  return resources.filter((resource) => resource.type === type);
};

/**
 * Helper function to get featured resources
 */
export const getFeaturedResources = (): Resource[] => {
  return resources.filter((resource) => resource.featured);
};

/**
 * Helper function to search resources
 */
export const searchResources = (query: string): Resource[] => {
  const lowerQuery = query.toLowerCase();
  return resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(lowerQuery) ||
      resource.description.toLowerCase().includes(lowerQuery) ||
      resource.category?.some((cat) => cat.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Resource type labels for tabs
 */
export const resourceTypes = [
  { id: 'all', label: 'All Resources', icon: 'Grid' },
  { id: 'guide', label: 'Guides & White Papers', icon: 'FileText' },
  { id: 'template', label: 'Templates & Tools', icon: 'File' },
  { id: 'update', label: 'Regulatory Updates', icon: 'Bell' },
  { id: 'video', label: 'Videos', icon: 'Video' },
  { id: 'case-study', label: 'Case Studies', icon: 'Award' },
];
