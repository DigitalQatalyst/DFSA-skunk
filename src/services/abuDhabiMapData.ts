// Abu Dhabi Map Data - Organizations and Categories
export interface Organization {
  id: string;
  name: string;
  category: string;
  type: string;
  description: string;
  link: string;
  coordinates: [number, number];
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  founded?: string;
  services?: string[];
}

export interface CategoryInfo {
  label: string;
  color: {
    marker: string;
    border: string;
    bg: string;
    text: string;
    pill: string;
    active: string;
  };
}

// Category mapping for Abu Dhabi organizations
export const abuDhabiCategories: Record<string, CategoryInfo> = {
  finance: {
    label: 'Financial Services',
    color: {
      marker: '#0030E3',
      border: '#0026B8',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      pill: 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50',
      active: 'bg-blue-600 text-white'
    }
  },
  technology: {
    label: 'Technology & Innovation',
    color: {
      marker: '#7C3AED',
      border: '#6D28D9',
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      pill: 'bg-white border border-purple-200 text-purple-700 hover:bg-purple-50',
      active: 'bg-purple-600 text-white'
    }
  },
  energy: {
    label: 'Energy & Sustainability',
    color: {
      marker: '#059669',
      border: '#047857',
      bg: 'bg-green-100',
      text: 'text-green-800',
      pill: 'bg-white border border-green-200 text-green-700 hover:bg-green-50',
      active: 'bg-green-600 text-white'
    }
  },
  healthcare: {
    label: 'Healthcare',
    color: {
      marker: '#DC2626',
      border: '#B91C1C',
      bg: 'bg-red-100',
      text: 'text-red-800',
      pill: 'bg-white border border-red-200 text-red-700 hover:bg-red-50',
      active: 'bg-red-600 text-white'
    }
  },
  tourism: {
    label: 'Tourism & Hospitality',
    color: {
      marker: '#EA580C',
      border: '#C2410C',
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      pill: 'bg-white border border-orange-200 text-orange-700 hover:bg-orange-50',
      active: 'bg-orange-600 text-white'
    }
  },
  retail: {
    label: 'Retail & Commerce',
    color: {
      marker: '#DB2777',
      border: '#BE185D',
      bg: 'bg-pink-100',
      text: 'text-pink-800',
      pill: 'bg-white border border-pink-200 text-pink-700 hover:bg-pink-50',
      active: 'bg-pink-600 text-white'
    }
  },
  real_estate: {
    label: 'Real Estate',
    color: {
      marker: '#0891B2',
      border: '#0E7490',
      bg: 'bg-cyan-100',
      text: 'text-cyan-800',
      pill: 'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50',
      active: 'bg-cyan-600 text-white'
    }
  },
  education: {
    label: 'Education',
    color: {
      marker: '#4F46E5',
      border: '#4338CA',
      bg: 'bg-indigo-100',
      text: 'text-indigo-800',
      pill: 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50',
      active: 'bg-indigo-600 text-white'
    }
  }
};

// Abu Dhabi organizations data
export const abuDhabiOrganizations: Organization[] = [
  {
    id: 'adgm',
    name: 'Abu Dhabi Global Market',
    category: 'finance',
    type: 'Financial Center',
    description: 'International financial center located on Al Maryah Island, providing a broad range of financial services and regulatory framework for businesses.',
    link: 'https://adgm.com',
    coordinates: [24.5007, 54.3894],
    phone: '+971 2 333 8888',
    email: 'contact@adgm.com',
    website: 'adgm.com',
    address: 'Al Maryah Island, Abu Dhabi, UAE',
    founded: '2013',
    services: ['Financial Licensing', 'Regulatory Framework', 'Business Setup', 'Legal Services']
  },
  {
    id: 'hub71',
    name: 'Hub71',
    category: 'technology',
    type: 'Tech Ecosystem',
    description: 'Global tech ecosystem that enables startups to scale globally through access to funding, networks, and business opportunities.',
    link: 'https://hub71.com',
    coordinates: [24.5015, 54.3905],
    phone: '+971 2 449 7777',
    email: 'hello@hub71.com',
    website: 'hub71.com',
    address: 'Al Maryah Island, Abu Dhabi, UAE',
    founded: '2019',
    services: ['Startup Incubation', 'Venture Capital', 'Mentorship', 'Networking']
  },
  {
    id: 'masdar',
    name: 'Masdar',
    category: 'energy',
    type: 'Renewable Energy Company',
    description: 'Renewable energy company that advances the development, commercialization and deployment of clean energy solutions.',
    link: 'https://masdar.ae',
    coordinates: [24.4289, 54.6107],
    phone: '+971 2 653 3333',
    email: 'info@masdar.ae',
    website: 'masdar.ae',
    address: 'Masdar City, Abu Dhabi, UAE',
    founded: '2006',
    services: ['Renewable Energy', 'Sustainable Development', 'Clean Technology', 'Urban Planning']
  },
  {
    id: 'cleveland-clinic',
    name: 'Cleveland Clinic Abu Dhabi',
    category: 'healthcare',
    type: 'Hospital',
    description: 'Multispecialty hospital offering patients the highest level of specialized care across 40+ medical and surgical specialties.',
    link: 'https://clevelandclinicabudhabi.ae',
    coordinates: [24.5020, 54.3910],
    phone: '+971 2 659 9999',
    email: 'info@ccad.ae',
    website: 'clevelandclinicabudhabi.ae',
    address: 'Al Maryah Island, Abu Dhabi, UAE',
    founded: '2015',
    services: ['Medical Care', 'Surgical Services', 'Research', 'Medical Education']
  },
  {
    id: 'emirates-palace',
    name: 'Emirates Palace',
    category: 'tourism',
    type: 'Luxury Hotel',
    description: 'Luxury hotel located in the heart of Abu Dhabi, offering world-class hospitality and stunning Arabian Gulf views.',
    link: 'https://emiratespalace.com',
    coordinates: [24.4619, 54.3170],
    phone: '+971 2 690 9000',
    email: 'reservations@emiratespalace.ae',
    website: 'emiratespalace.com',
    address: 'West Corniche Road, Abu Dhabi, UAE',
    founded: '2005',
    services: ['Luxury Accommodation', 'Fine Dining', 'Conference Facilities', 'Spa Services']
  },
  {
    id: 'yas-mall',
    name: 'Yas Mall',
    category: 'retail',
    type: 'Shopping Mall',
    description: 'Premier shopping, dining and entertainment destination located on Yas Island, featuring over 370 international brands.',
    link: 'https://yasmall.ae',
    coordinates: [24.4881, 54.6078],
    phone: '+971 2 565 7000',
    email: 'customerservice@yasmall.ae',
    website: 'yasmall.ae',
    address: 'Yas Island, Abu Dhabi, UAE',
    founded: '2014',
    services: ['Retail Space', 'Entertainment', 'Dining', 'Events']
  },
  {
    id: 'etihad-airways',
    name: 'Etihad Airways',
    category: 'tourism',
    type: 'Airline',
    description: 'The national airline of the UAE, connecting Abu Dhabi to the world with a fleet of modern aircraft.',
    link: 'https://etihad.com',
    coordinates: [24.4330, 54.6511],
    phone: '+971 2 599 0000',
    email: 'info@etihad.ae',
    website: 'etihad.com',
    address: 'Khalifa City, Abu Dhabi, UAE',
    founded: '2003',
    services: ['Air Travel', 'Cargo Services', 'Loyalty Program', 'Holiday Packages']
  },
  {
    id: 'mubadala',
    name: 'Mubadala Investment Company',
    category: 'finance',
    type: 'Sovereign Wealth Fund',
    description: 'Sovereign wealth fund investing in diversified sectors globally to transform the UAE economy.',
    link: 'https://mubadala.com',
    coordinates: [24.4539, 54.3773],
    phone: '+971 2 413 0000',
    email: 'info@mubadala.ae',
    website: 'mubadala.com',
    address: 'Al Mamoura Building, Abu Dhabi, UAE',
    founded: '2002',
    services: ['Investment Management', 'Strategic Development', 'Portfolio Management', 'Economic Diversification']
  },
  {
    id: 'aldar',
    name: 'Aldar Properties',
    category: 'real_estate',
    type: 'Real Estate Developer',
    description: 'Leading real estate developer with iconic developments across Abu Dhabi and beyond.',
    link: 'https://aldar.com',
    coordinates: [24.4907, 54.6020],
    phone: '+971 2 810 5555',
    email: 'customercare@aldar.com',
    website: 'aldar.com',
    address: 'Al Raha Beach, Abu Dhabi, UAE',
    founded: '2005',
    services: ['Property Development', 'Asset Management', 'Retail Management', 'Hospitality']
  },
  {
    id: 'nyuad',
    name: 'NYU Abu Dhabi',
    category: 'education',
    type: 'University',
    description: 'World-class research university offering undergraduate and graduate programs in arts, sciences, and engineering.',
    link: 'https://nyuad.nyu.edu',
    coordinates: [24.5246, 54.4346],
    phone: '+971 2 628 4000',
    email: 'nyuad.info@nyu.edu',
    website: 'nyuad.nyu.edu',
    address: 'Saadiyat Island, Abu Dhabi, UAE',
    founded: '2010',
    services: ['Higher Education', 'Research', 'Cultural Programs', 'Student Services']
  },
  {
    id: 'louvre',
    name: 'Louvre Abu Dhabi',
    category: 'tourism',
    type: 'Museum',
    description: 'Universal museum showcasing artworks from around the world, bridging Eastern and Western cultures.',
    link: 'https://louvreabudhabi.ae',
    coordinates: [24.5338, 54.3984],
    phone: '+971 600 565566',
    email: 'contact@louvreabudhabi.ae',
    website: 'louvreabudhabi.ae',
    address: 'Saadiyat Island, Abu Dhabi, UAE',
    founded: '2017',
    services: ['Art Exhibitions', 'Cultural Events', 'Educational Programs', 'Guided Tours']
  },
  {
    id: 'adnoc',
    name: 'ADNOC',
    category: 'energy',
    type: 'Energy Company',
    description: 'State-owned oil company responsible for petroleum and natural gas production in Abu Dhabi.',
    link: 'https://adnoc.ae',
    coordinates: [24.4764, 54.3705],
    phone: '+971 2 602 9000',
    email: 'info@adnoc.ae',
    website: 'adnoc.ae',
    address: 'Corniche Road, Abu Dhabi, UAE',
    founded: '1971',
    services: ['Oil & Gas Production', 'Refining', 'Distribution', 'Petrochemicals']
  }
];

// Abu Dhabi map configuration
export const abuDhabiMapConfig = {
  center: [24.4539, 54.3773] as [number, number], // Abu Dhabi city center
  zoom: 11,
  minZoom: 10,
  maxZoom: 15,
  bounds: {
    southwest: [24.2, 54.2] as [number, number],
    northeast: [24.7, 54.7] as [number, number]
  }
};

// Helper functions
export function getOrganizationsByCategory(category: string | null): Organization[] {
  if (!category) return abuDhabiOrganizations;
  return abuDhabiOrganizations.filter(org => org.category === category);
}

export function searchOrganizations(query: string): Organization[] {
  const lowercaseQuery = query.toLowerCase();
  return abuDhabiOrganizations.filter(
    org =>
      org.name.toLowerCase().includes(lowercaseQuery) ||
      org.description.toLowerCase().includes(lowercaseQuery) ||
      org.category.toLowerCase().includes(lowercaseQuery)
  );
}
