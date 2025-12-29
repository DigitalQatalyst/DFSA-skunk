// Data model for Women Entrepreneurs Ecosystem Map
// Global entity registry for organizations that appear in multiple emirates
export const entityRegistry = {
  entities: {
    Hub71: {
      type: 'sme_operator',
      link: 'https://hub71.com',
      description:
        'Tech hub supporting women-led startups and scaleups with global expansion ambitions.',
      emirates: ['Abu Dhabi', 'Dubai'],
      coordinates: [24.478, 54.362],
    },
    'Khalifa Fund': {
      type: 'sme_operator',
      link: 'https://khalifafund.ae',
      description:
        'Funding and mentorship for Emirati entrepreneurs with dedicated programs for women-led businesses.',
      emirates: ['Abu Dhabi', 'Dubai', 'Sharjah'],
      coordinates: [24.4667, 54.3667],
    },
    startAD: {
      type: 'academic_partner',
      link: 'https://startad.ae',
      description:
        'Accelerator and mentorship program for women entrepreneurs based at NYU Abu Dhabi.',
      emirates: ['Abu Dhabi'],
      coordinates: [24.523, 54.431],
    },
    'Dubai Business Women Council': {
      type: 'local_enabler',
      link: 'https://dbwc.ae',
      description:
        'Networking, mentorship, and international exposure for women entrepreneurs in Dubai.',
      emirates: ['Dubai'],
      coordinates: [25.2285, 55.2867],
    },
    'DIFC Innovation Hub': {
      type: 'tech_support',
      link: 'https://difc.ae/innovation',
      description:
        'Innovation hub located in Dubai International Financial Centre supporting fintech startups.',
      emirates: ['Dubai'],
      coordinates: [25.21176, 55.2757],
    },
    'Sharjah Business Women Council': {
      type: 'local_enabler',
      link: 'https://sbwc.ae',
      description:
        'Business support, training, and exhibitions for women entrepreneurs in Sharjah.',
      emirates: ['Sharjah'],
      coordinates: [25.3463, 55.4209],
    },
    Sheraa: {
      type: 'academic_partner',
      link: 'https://sheraa.ae',
      description:
        'Entrepreneurship center providing incubation, acceleration, and investment opportunities.',
      emirates: ['Sharjah'],
      coordinates: [25.3567, 55.4778],
    },
    'NAMA Women Advancement': {
      type: 'private_sector',
      link: 'https://namawomen.ae',
      description:
        'Organization dedicated to advancing women economically through various programs and initiatives.',
      emirates: ['Sharjah'],
      coordinates: [25.3218, 55.3912],
    },
    'Ajman Chamber of Commerce': {
      type: 'local_enabler',
      link: 'https://ajmanchamber.ae',
      description:
        'Supporting local businesses and entrepreneurs through various services and initiatives.',
      emirates: ['Ajman'],
      coordinates: [25.4023, 55.4811],
    },
    'RAKEZ Economic Zone': {
      type: 'local_enabler',
      link: 'https://rakez.com',
      description:
        'Economic zone offering business setup and support services for entrepreneurs.',
      emirates: ['Ras Al Khaimah'],
      coordinates: [25.7891, 55.9426],
    },
    'Fujairah Chamber of Commerce': {
      type: 'local_enabler',
      link: 'https://fujcci.ae',
      description:
        'Supporting local businesses with a focus on trade and logistics.',
      emirates: ['Fujairah'],
      coordinates: [25.1235, 56.3286],
    },
    'UAQ Business Center': {
      type: 'local_enabler',
      link: 'https://uaqchamber.ae',
      description:
        'Business center offering facilities and support services for local entrepreneurs.',
      emirates: ['Umm Al Quwain'],
      coordinates: [25.5656, 55.553],
    },
    'Emirates Business Women Council': {
      type: 'federal_enabler',
      link: 'https://fbccouncil.ae',
      description:
        'Federal council supporting business women across all emirates through advocacy and policy development.',
      emirates: [
        'Abu Dhabi',
        'Dubai',
        'Sharjah',
        'Ajman',
        'Ras Al Khaimah',
        'Fujairah',
        'Umm Al Quwain',
      ],
      coordinates: [24.466667, 54.366669],
    },
    'UAE Gender Balance Council': {
      type: 'federal_enabler',
      link: 'https://gbc.gov.ae',
      description:
        'Federal entity focused on reducing the gender gap across all sectors including entrepreneurship.',
      emirates: [
        'Abu Dhabi',
        'Dubai',
        'Sharjah',
        'Ajman',
        'Ras Al Khaimah',
        'Fujairah',
        'Umm Al Quwain',
      ],
      coordinates: [25.276987, 55.296249],
    },
    'Female Fusion': {
      type: 'private_sector',
      link: 'https://femalefusion.ae',
      description:
        "UAE's largest community of women entrepreneurs providing networking, resources and support.",
      emirates: ['Dubai', 'Abu Dhabi', 'Sharjah'],
      coordinates: [25.276987, 55.296249],
    },
    'Etisalat by e&': {
      type: 'tech_support',
      link: 'https://etisalat.ae',
      description:
        'Telecommunications provider offering digital solutions and support for women entrepreneurs.',
      emirates: [
        'Abu Dhabi',
        'Dubai',
        'Sharjah',
        'Ajman',
        'Ras Al Khaimah',
        'Fujairah',
        'Umm Al Quwain',
      ],
      coordinates: [24.466667, 54.366669],
    },
    Snapchat: {
      type: 'tech_support',
      link: 'https://snap.com',
      description:
        'Social media platform providing digital marketing support and training for women entrepreneurs.',
      emirates: ['Dubai'],
      coordinates: [25.276987, 55.296249],
    },
    'Khalifa University': {
      type: 'academic_partner',
      link: 'https://ku.ac.ae',
      description:
        'University providing research support, innovation labs, and educational programs for women entrepreneurs.',
      emirates: ['Abu Dhabi'],
      coordinates: [24.4667, 54.3667],
    },
    'Abu Dhabi Business Women Council': {
      type: 'local_enabler',
      link: 'https://adbwc.ae',
      description:
        'Council dedicated to supporting women entrepreneurs in Abu Dhabi through networking, training and advocacy.',
      emirates: ['Abu Dhabi'],
      coordinates: [24.466, 54.366],
    },
    'Dubai SME': {
      type: 'sme_operator',
      link: 'https://sme.ae',
      description:
        'Government agency providing comprehensive support to small and medium enterprises in Dubai.',
      emirates: ['Dubai'],
      coordinates: [25.227, 55.286],
    },
    'Dubai Technology Entrepreneur Campus': {
      type: 'tech_support',
      link: 'https://dtec.ae',
      description:
        'Technology hub and coworking space supporting tech startups and entrepreneurs.',
      emirates: ['Dubai'],
      coordinates: [25.098, 55.173],
    },
    'Sharjah Research Technology and Innovation Park': {
      type: 'tech_support',
      link: 'https://srtip.ae',
      description:
        'Innovation ecosystem fostering R&D and entrepreneurship in key sectors.',
      emirates: ['Sharjah'],
      coordinates: [25.287, 55.586],
    },
    'American University of Sharjah': {
      type: 'academic_partner',
      link: 'https://aus.edu',
      description:
        'University offering entrepreneurship programs and innovation support for students and alumni.',
      emirates: ['Sharjah'],
      coordinates: [25.313, 55.491],
    },
    'Ajman University': {
      type: 'academic_partner',
      link: 'https://ajman.ac.ae',
      description:
        'University with innovation center supporting entrepreneurship and business development.',
      emirates: ['Ajman'],
      coordinates: [25.412, 55.514],
    },
    'RAK Chamber': {
      type: 'local_enabler',
      link: 'https://rakchamber.ae',
      description:
        'Chamber of commerce supporting local businesses and entrepreneurs in Ras Al Khaimah.',
      emirates: ['Ras Al Khaimah'],
      coordinates: [25.794, 55.969],
    },
    'RAK SME': {
      type: 'sme_operator',
      link: 'https://raksme.ae',
      description:
        'Agency supporting small and medium enterprises in Ras Al Khaimah with funding and mentorship.',
      emirates: ['Ras Al Khaimah'],
      coordinates: [25.789, 55.942],
    },
    'Fujairah Creative City': {
      type: 'private_sector',
      link: 'https://creativecity.ae',
      description:
        'Free zone for creative entrepreneurs and businesses in media and related sectors.',
      emirates: ['Fujairah'],
      coordinates: [25.123, 56.328],
    },
    'UAQ Free Trade Zone': {
      type: 'local_enabler',
      link: 'https://uaqftz.com',
      description:
        'Free zone offering business setup and support services for entrepreneurs.',
      emirates: ['Umm Al Quwain'],
      coordinates: [25.585, 55.556],
    },
    'Dubai Internet City': {
      type: 'tech_support',
      link: 'https://dic.ae',
      description:
        'Technology park providing infrastructure and support for tech companies and startups.',
      emirates: ['Dubai'],
      coordinates: [25.099, 55.174],
    },
    'Zayed University': {
      type: 'academic_partner',
      link: 'https://zu.ac.ae',
      description:
        'University with entrepreneurship programs focused on empowering Emirati women.',
      emirates: ['Abu Dhabi', 'Dubai'],
      coordinates: [24.428, 54.436],
    },
    'Dubai Cares': {
      type: 'private_sector',
      link: 'https://dubaicares.ae',
      description:
        'Philanthropic organization supporting education and entrepreneurship initiatives.',
      emirates: ['Dubai'],
      coordinates: [25.227, 55.286],
    },
    'Emirates Development Bank': {
      type: 'federal_enabler',
      link: 'https://edb.gov.ae',
      description:
        'Federal financial institution providing funding and support for SMEs and entrepreneurs.',
      emirates: [
        'Abu Dhabi',
        'Dubai',
        'Sharjah',
        'Ajman',
        'Ras Al Khaimah',
        'Fujairah',
        'Umm Al Quwain',
      ],
      coordinates: [24.482, 54.37],
    },
    'Mohammed Bin Rashid Innovation Fund': {
      type: 'federal_enabler',
      link: 'https://mbrif.ae',
      description:
        'Federal initiative offering funding and support for innovative businesses and entrepreneurs.',
      emirates: [
        'Abu Dhabi',
        'Dubai',
        'Sharjah',
        'Ajman',
        'Ras Al Khaimah',
        'Fujairah',
        'Umm Al Quwain',
      ],
      coordinates: [25.227, 55.286],
    },
    'ADGM Academy': {
      type: 'academic_partner',
      link: 'https://adgmacademy.com',
      description:
        'Educational institution offering financial and entrepreneurship training programs.',
      emirates: ['Abu Dhabi'],
      coordinates: [24.499, 54.383],
    },
    'Dubai Future Accelerators': {
      type: 'tech_support',
      link: 'https://dubaifutureaccelerators.com',
      description:
        'Program connecting startups with government entities to co-create innovative solutions.',
      emirates: ['Dubai'],
      coordinates: [25.227, 55.286],
    },
  },
}

// Emirate-specific data
export const emiratesData = [
  {
    id: 'abudhabi',
    emirate: 'Abu Dhabi',
    coordinates: [24.4539, 54.3773],
    zoomLevel: 9,
    boundingBox: [
      [23.4, 51.5],
      [24.8, 55.0],
    ],
    overview: {
      title: 'Driving Innovation Through Inclusive Entrepreneurship',
      description:
        'A thriving ecosystem of enablers focusing on innovation, funding, and sustainability, supporting women entrepreneurs through comprehensive programs and initiatives.',
      tags: ['Federal', 'Local', 'Operator', 'Academic', 'Tech'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
      'Emirates Development Bank',
      'Mohammed Bin Rashid Innovation Fund',
    ],
    local_enablers: ['Abu Dhabi Business Women Council'],
    sme_operators: ['Hub71', 'Khalifa Fund'],
    private_sector: ['Female Fusion'],
    academic_partners: [
      'Khalifa University',
      'startAD',
      'ADGM Academy',
      'Zayed University',
    ],
    tech_support: ['Etisalat by e&'],
    programs: [
      {
        program_name: 'SheTech Accelerator',
        organization: 'Hub71',
        action_label: 'Apply Now',
        link: 'https://hub71.com/programs/shetech',
      },
      {
        program_name: 'Women Entrepreneurs Academy',
        organization: 'Khalifa Fund',
        action_label: 'Join Program',
        link: 'https://khalifafund.ae/women-entrepreneurs',
      },
      {
        program_name: 'Ibtikari Female Leaders',
        organization: 'startAD',
        action_label: 'Learn More',
        link: 'https://startad.ae/programs/ibtikari',
      },
      {
        program_name: 'Entrepreneurship Diploma',
        organization: 'ADGM Academy',
        action_label: 'Enroll Now',
        link: 'https://adgmacademy.com/entrepreneurship',
      },
      {
        program_name: "Mubdi'ah Program",
        organization: 'Abu Dhabi Business Women Council',
        action_label: 'Register Interest',
        link: 'https://adbwc.ae/programs/mubdiah',
      },
    ],
  },
  {
    id: 'dubai',
    emirate: 'Dubai',
    coordinates: [25.276987, 55.296249],
    zoomLevel: 9,
    boundingBox: [
      [24.8, 54.9],
      [25.4, 55.6],
    ],
    overview: {
      title: 'Global Hub for Women Entrepreneurship',
      description:
        'A dynamic ecosystem that connects women entrepreneurs to global markets through innovative programs, funding opportunities, and mentorship networks.',
      tags: ['Federal', 'Local', 'Tech', 'Private'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
      'Emirates Development Bank',
      'Mohammed Bin Rashid Innovation Fund',
    ],
    local_enablers: ['Dubai Business Women Council'],
    sme_operators: ['Khalifa Fund', 'Dubai SME'],
    private_sector: ['Female Fusion', 'Dubai Cares'],
    academic_partners: ['Zayed University'],
    tech_support: [
      'DIFC Innovation Hub',
      'Etisalat by e&',
      'Snapchat',
      'Dubai Internet City',
      'Dubai Technology Entrepreneur Campus',
      'Dubai Future Accelerators',
    ],
    programs: [
      {
        program_name: 'She Leads Program',
        organization: 'Dubai Business Women Council',
        action_label: 'Register Now',
        link: 'https://dbwc.ae/programs/she-leads',
      },
      {
        program_name: 'FinTech Hive Accelerator',
        organization: 'DIFC Innovation Hub',
        action_label: 'Apply Now',
        link: 'https://www.difc.ae/fintech-hive',
      },
      {
        program_name: 'Intelaq License Program',
        organization: 'Dubai SME',
        action_label: 'Get Started',
        link: 'https://sme.ae/intelaq',
      },
      {
        program_name: 'Dubai Next Crowdfunding',
        organization: 'Dubai SME',
        action_label: 'Launch Campaign',
        link: 'https://dubainext.ae',
      },
      {
        program_name: 'Women in Tech Mentorship',
        organization: 'Dubai Internet City',
        action_label: 'Join Network',
        link: 'https://dic.ae/women-in-tech',
      },
      {
        program_name: 'Snap Accelerate',
        organization: 'Snapchat',
        action_label: 'Apply Now',
        link: 'https://snap.com/accelerate',
      },
    ],
  },
  {
    id: 'sharjah',
    emirate: 'Sharjah',
    coordinates: [25.357119, 55.391068],
    zoomLevel: 9,
    boundingBox: [
      [25.2, 55.3],
      [25.6, 55.7],
    ],
    overview: {
      title: 'Empowering Women Through Cultural Innovation',
      description:
        'A supportive ecosystem that combines cultural heritage with innovation to empower women entrepreneurs through targeted programs and initiatives.',
      tags: ['Federal', 'Local', 'Academic', 'Private'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
      'Emirates Development Bank',
      'Mohammed Bin Rashid Innovation Fund',
    ],
    local_enablers: ['Sharjah Business Women Council'],
    sme_operators: ['Khalifa Fund'],
    private_sector: ['NAMA Women Advancement', 'Female Fusion'],
    academic_partners: ['Sheraa', 'American University of Sharjah'],
    tech_support: [
      'Etisalat by e&',
      'Sharjah Research Technology and Innovation Park',
    ],
    programs: [
      {
        program_name: 'SBWC Accelerator',
        organization: 'Sharjah Business Women Council',
        action_label: 'Join Now',
        link: 'https://sbwc.ae/accelerator',
      },
      {
        program_name: 'Badiri E-Academy',
        organization: 'NAMA Women Advancement',
        action_label: 'Enroll Today',
        link: 'https://namawomen.ae/badiri',
      },
      {
        program_name: 'Sheraa Startup Studio',
        organization: 'Sheraa',
        action_label: 'Apply Now',
        link: 'https://sheraa.ae/startup-studio',
      },
      {
        program_name: 'Irthi Contemporary Crafts Council',
        organization: 'NAMA Women Advancement',
        action_label: 'Discover More',
        link: 'https://irthi.com',
      },
      {
        program_name: 'SRTI Park Incubator',
        organization: 'Sharjah Research Technology and Innovation Park',
        action_label: 'Join Program',
        link: 'https://srtip.ae/incubator',
      },
      {
        program_name: 'AUS New Venture Challenge',
        organization: 'American University of Sharjah',
        action_label: 'Register Team',
        link: 'https://aus.edu/venture-challenge',
      },
    ],
  },
  {
    id: 'ajman',
    emirate: 'Ajman',
    coordinates: [25.399838, 55.479773],
    zoomLevel: 10,
    boundingBox: [
      [25.3, 55.4],
      [25.5, 55.6],
    ],
    overview: {
      title: 'Fostering Local Entrepreneurial Talent',
      description:
        'A growing ecosystem focused on developing local entrepreneurial talent through targeted support programs and community initiatives.',
      tags: ['Federal', 'Local', 'Academic'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
      'Emirates Development Bank',
      'Mohammed Bin Rashid Innovation Fund',
    ],
    local_enablers: ['Ajman Chamber of Commerce'],
    sme_operators: [],
    private_sector: [],
    academic_partners: ['Ajman University'],
    tech_support: ['Etisalat by e&'],
    programs: [
      {
        program_name: 'Ajman Entrepreneurs Program',
        organization: 'Ajman Chamber of Commerce',
        action_label: 'Learn More',
        link: 'https://ajmanchamber.ae/entrepreneurs',
      },
      {
        program_name: 'Reyada Initiative',
        organization: 'Ajman Chamber of Commerce',
        action_label: 'Register Now',
        link: 'https://ajmanchamber.ae/reyada',
      },
      {
        program_name: 'Innovation Center Incubator',
        organization: 'Ajman University',
        action_label: 'Apply Today',
        link: 'https://ajman.ac.ae/innovation',
      },
      {
        program_name: 'Women Entrepreneurship Workshop Series',
        organization: 'Ajman Chamber of Commerce',
        action_label: 'Register Interest',
        link: 'https://ajmanchamber.ae/workshops',
      },
    ],
  },
  {
    id: 'rak',
    emirate: 'Ras Al Khaimah',
    coordinates: [25.789097, 55.942608],
    zoomLevel: 10,
    boundingBox: [
      [25.5, 55.7],
      [26.0, 56.2],
    ],
    overview: {
      title: 'Connecting Tourism and Entrepreneurship',
      description:
        'An ecosystem that leverages tourism and natural resources to create unique opportunities for women entrepreneurs.',
      tags: ['Federal', 'Local', 'Operator'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
      'Emirates Development Bank',
      'Mohammed Bin Rashid Innovation Fund',
    ],
    local_enablers: ['RAKEZ Economic Zone', 'RAK Chamber'],
    sme_operators: ['RAK SME'],
    private_sector: [],
    academic_partners: [],
    tech_support: ['Etisalat by e&'],
    programs: [
      {
        program_name: 'RAK SME Program',
        organization: 'RAKEZ Economic Zone',
        action_label: 'Register Interest',
        link: 'https://rakez.com/sme-program',
      },
      {
        program_name: 'Sougha Heritage Crafts',
        organization: 'RAK Chamber',
        action_label: 'Join Initiative',
        link: 'https://rakchamber.ae/sougha',
      },
      {
        program_name: 'Tourism Entrepreneurship Accelerator',
        organization: 'RAK SME',
        action_label: 'Apply Now',
        link: 'https://raksme.ae/tourism',
      },
      {
        program_name: 'RAK Businesswomen Council',
        organization: 'RAK Chamber',
        action_label: 'Become a Member',
        link: 'https://rakchamber.ae/businesswomen',
      },
    ],
  },
  {
    id: 'fujairah',
    emirate: 'Fujairah',
    coordinates: [25.123474, 56.328609],
    zoomLevel: 10,
    boundingBox: [
      [25.0, 56.2],
      [25.6, 56.5],
    ],
    overview: {
      title: 'Blending Trade and Innovation',
      description:
        'A unique ecosystem that combines port trade advantages with innovation to support women-led businesses in various sectors.',
      tags: ['Federal', 'Local', 'Private'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
      'Emirates Development Bank',
      'Mohammed Bin Rashid Innovation Fund',
    ],
    local_enablers: ['Fujairah Chamber of Commerce'],
    sme_operators: [],
    private_sector: ['Fujairah Creative City'],
    academic_partners: [],
    tech_support: ['Etisalat by e&'],
    programs: [
      {
        program_name: 'Fujairah Entrepreneurs Initiative',
        organization: 'Fujairah Chamber of Commerce',
        action_label: 'Discover More',
        link: 'https://fujcci.ae/entrepreneurs',
      },
      {
        program_name: 'Creative Business License',
        organization: 'Fujairah Creative City',
        action_label: 'Apply Now',
        link: 'https://creativecity.ae/license',
      },
      {
        program_name: 'Women in Trade Program',
        organization: 'Fujairah Chamber of Commerce',
        action_label: 'Join Program',
        link: 'https://fujcci.ae/women-in-trade',
      },
      {
        program_name: 'Fujairah Business Incubator',
        organization: 'Fujairah Chamber of Commerce',
        action_label: 'Register Interest',
        link: 'https://fujcci.ae/incubator',
      },
    ],
  },
  {
    id: 'uaq',
    emirate: 'Umm Al Quwain',
    coordinates: [25.565598, 55.55304],
    zoomLevel: 10,
    boundingBox: [
      [25.5, 55.4],
      [25.7, 55.7],
    ],
    overview: {
      title: 'Building Community-Based Entrepreneurship',
      description:
        'A community-focused ecosystem that nurtures local talent and traditional businesses with modern approaches.',
      tags: ['Federal', 'Local'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
      'Emirates Development Bank',
      'Mohammed Bin Rashid Innovation Fund',
    ],
    local_enablers: ['UAQ Business Center', 'UAQ Free Trade Zone'],
    sme_operators: [],
    private_sector: [],
    academic_partners: [],
    tech_support: ['Etisalat by e&'],
    programs: [
      {
        program_name: 'UAQ Women in Business',
        organization: 'UAQ Business Center',
        action_label: 'Join Network',
        link: 'https://uaqchamber.ae/women-in-business',
      },
      {
        program_name: 'SME Support Package',
        organization: 'UAQ Free Trade Zone',
        action_label: 'Get Started',
        link: 'https://uaqftz.com/sme-support',
      },
      {
        program_name: 'Traditional Crafts Revival',
        organization: 'UAQ Business Center',
        action_label: 'Learn More',
        link: 'https://uaqchamber.ae/crafts',
      },
      {
        program_name: 'Entrepreneur License Program',
        organization: 'UAQ Free Trade Zone',
        action_label: 'Apply Now',
        link: 'https://uaqftz.com/entrepreneur-license',
      },
    ],
  },
]

// Category mapping for UI elements
export const categoryMapping = {
  federal_enabler: {
    label: 'Federal Enabler',
    color: {
      bg: 'bg-primary',
      text: 'text-white',
      marker: '#0030E3',
      border: '#ffffff',
      hover: 'hover:bg-primary-dark',
      pill: 'bg-primary/10 text-primary hover:bg-primary hover:text-white',
      active: 'bg-primary text-white',
    },
  },
  local_enabler: {
    label: 'Local Enabler',
    color: {
      bg: 'bg-teal',
      text: 'text-white',
      marker: '#00E5D1',
      border: '#ffffff',
      hover: 'hover:bg-teal-dark',
      pill: 'bg-teal/10 text-teal hover:bg-teal hover:text-white',
      active: 'bg-teal text-white',
    },
  },
  sme_operator: {
    label: 'SME Operator',
    color: {
      bg: 'bg-purple',
      text: 'text-white',
      marker: '#954BF9',
      border: '#ffffff',
      hover: 'hover:bg-purple-dark',
      pill: 'bg-purple/10 text-purple hover:bg-purple hover:text-white',
      active: 'bg-purple text-white',
    },
  },
  private_sector: {
    label: 'Private Sector',
    color: {
      bg: 'bg-purple-light',
      text: 'text-purple-dark',
      marker: '#C499FF',
      border: '#954BF9',
      hover: 'hover:bg-purple-light/80',
      pill: 'bg-purple-light/30 text-purple-dark hover:bg-purple-light hover:text-purple-dark',
      active: 'bg-purple-light text-purple-dark',
    },
  },
  academic_partner: {
    label: 'Academic Partner',
    color: {
      bg: 'bg-teal-light',
      text: 'text-teal-dark',
      marker: '#99FFF5',
      border: '#00E5D1',
      hover: 'hover:bg-teal-light/80',
      pill: 'bg-teal-light/30 text-teal-dark hover:bg-teal-light hover:text-teal-dark',
      active: 'bg-teal-light text-teal-dark',
    },
  },
  tech_support: {
    label: 'Tech Support',
    color: {
      bg: 'bg-primary-light',
      text: 'text-primary-dark',
      marker: '#99B2FF',
      border: '#0030E3',
      hover: 'hover:bg-primary-light/80',
      pill: 'bg-primary-light/30 text-primary-dark hover:bg-primary-light hover:text-primary-dark',
      active: 'bg-primary-light text-primary-dark',
    },
  },
}

// GeoJSON data for UAE emirates (simplified)
export const emirateGeoJSON = {
  abudhabi: {
    type: 'Polygon',
    coordinates: [
      [
        [51.5, 24.0],
        [52.0, 24.3],
        [52.5, 24.4],
        [53.0, 24.5],
        [53.5, 24.6],
        [54.0, 24.7],
        [54.3, 24.4],
        [54.5, 24.2],
        [54.0, 24.0],
        [53.5, 23.8],
        [53.0, 23.6],
        [52.5, 23.5],
        [52.0, 23.7],
        [51.8, 24.0],
        [51.5, 24.0],
      ],
    ],
  },
  dubai: {
    type: 'Polygon',
    coordinates: [
      [
        [55.0, 25.0],
        [55.1, 25.3],
        [55.3, 25.4],
        [55.4, 25.3],
        [55.6, 25.1],
        [55.5, 24.9],
        [55.3, 24.8],
        [55.1, 24.9],
        [55.0, 25.0],
      ],
    ],
  },
  sharjah: {
    type: 'Polygon',
    coordinates: [
      [
        [55.4, 25.3],
        [55.5, 25.4],
        [55.7, 25.5],
        [55.8, 25.4],
        [55.7, 25.3],
        [55.5, 25.2],
        [55.4, 25.3],
      ],
    ],
  },
  ajman: {
    type: 'Polygon',
    coordinates: [
      [
        [55.4, 25.4],
        [55.5, 25.5],
        [55.6, 25.4],
        [55.5, 25.3],
        [55.4, 25.4],
      ],
    ],
  },
  rak: {
    type: 'Polygon',
    coordinates: [
      [
        [55.9, 25.6],
        [56.0, 25.8],
        [56.2, 26.0],
        [56.3, 25.9],
        [56.2, 25.7],
        [56.0, 25.6],
        [55.9, 25.6],
      ],
    ],
  },
  fujairah: {
    type: 'Polygon',
    coordinates: [
      [
        [56.2, 25.1],
        [56.3, 25.3],
        [56.4, 25.5],
        [56.5, 25.3],
        [56.4, 25.1],
        [56.3, 25.0],
        [56.2, 25.1],
      ],
    ],
  },
  uaq: {
    type: 'Polygon',
    coordinates: [
      [
        [55.5, 25.5],
        [55.6, 25.6],
        [55.7, 25.5],
        [55.6, 25.4],
        [55.5, 25.5],
      ],
    ],
  },
}

// Helper function to get all organizations from a specific emirate
export const getEmirateOrganizations = (emirateId: string) => {
  const emirate = emiratesData.find((e) => e.id === emirateId)
  if (!emirate) return []
  const organizations: any[] = []
  // Combine all organization types from the emirate
  const addOrganizations = (orgNames: string[], type: string) => {
    orgNames.forEach((name) => {
      if (
        name &&
        entityRegistry.entities[name as keyof typeof entityRegistry.entities]
      ) {
        const entity =
          entityRegistry.entities[name as keyof typeof entityRegistry.entities]
        organizations.push({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          category: type,
          type:
            categoryMapping[entity.type as keyof typeof categoryMapping]
              ?.label || type,
          description: entity.description,
          link: entity.link,
          coordinates: entity.coordinates,
        })
      }
    })
  }
  // Add organizations from each category
  addOrganizations(emirate.federal_enablers || [], 'federal_enabler')
  addOrganizations(emirate.local_enablers || [], 'local_enabler')
  addOrganizations(emirate.sme_operators || [], 'sme_operator')
  addOrganizations(emirate.private_sector || [], 'private_sector')
  addOrganizations(emirate.academic_partners || [], 'academic_partner')
  addOrganizations(emirate.tech_support || [], 'tech_support')
  return organizations
}

// Helper function to get all organizations across all emirates
export const getAllOrganizations = () => {
  const allOrgs: any[] = []
  const addedOrgIds = new Set()
  emiratesData.forEach((emirate) => {
    const emirateOrgs = getEmirateOrganizations(emirate.id)
    emirateOrgs.forEach((org) => {
      if (!addedOrgIds.has(org.id)) {
        allOrgs.push(org)
        addedOrgIds.add(org.id)
      }
    })
  })
  return allOrgs
}

// Helper function to get all programs from all emirates
export const getAllPrograms = () => {
  return emiratesData.flatMap((emirate) =>
    emirate.programs.map((program) => ({
      ...program,
      emirate: emirate.emirate,
    })),
  )
}

// Helper function to get programs from a specific emirate
export const getEmiratePrograms = (emirateId: string) => {
  const emirate = emiratesData.find((e) => e.id === emirateId)
  return emirate ? emirate.programs : []
}

// Featured stories data
export const featuredStories = [
  {
    id: 'story1',
    name: 'Aisha Al Mazrouei',
    category: 'Technology',
    region: 'Abu Dhabi',
    sector: 'Artificial Intelligence',
    story:
      'Founded an AI startup that helps businesses optimize their operations using machine learning algorithms. Her company has grown to serve clients across the GCC region.',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
  },
  {
    id: 'story2',
    name: 'Fatima Al Qassimi',
    category: 'Sustainability',
    region: 'Sharjah',
    sector: 'Clean Energy',
    story:
      'Launched a renewable energy consultancy that has helped implement solar projects across the UAE, reducing carbon footprints for dozens of businesses.',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'story3',
    name: 'Maryam Al Hashimi',
    category: 'Healthcare',
    region: 'Dubai',
    sector: 'Medical Technology',
    story:
      'Created a telemedicine platform that connects patients with doctors, particularly serving women in remote areas who need specialized healthcare consultations.',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'story4',
    name: 'Noura Al Kaabi',
    category: 'Creative',
    region: 'Fujairah',
    sector: 'Digital Media',
    story:
      'Built a digital content studio that specializes in creating Arabic content for global streaming platforms, showcasing Middle Eastern stories to international audiences.',
    image:
      'https://images.unsplash.com/photo-1573497019236-61f28a5d1e87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'story5',
    name: 'Laila Al Nuaimi',
    category: 'Finance',
    region: 'Dubai',
    sector: 'FinTech',
    story:
      'Developed a financial literacy platform specifically designed for women entrepreneurs, helping them navigate funding options and financial management.',
    image:
      'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'story6',
    name: 'Hessa Al Ghurair',
    category: 'Education',
    region: 'Ras Al Khaimah',
    sector: 'EdTech',
    story:
      'Founded an educational technology company that provides interactive learning experiences for students across the UAE, with a focus on STEM education for girls.',
    image:
      'https://images.unsplash.com/photo-1573497019707-1c04de26e58c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'story7',
    name: 'Salama Al Shamsi',
    category: 'Retail',
    region: 'Abu Dhabi',
    sector: 'E-commerce',
    story:
      'Created an online marketplace for locally-made products, supporting artisans and small businesses across the Emirates with a focus on traditional crafts.',
    image:
      'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
  },
  {
    id: 'story8',
    name: 'Amna Al Zaabi',
    category: 'Agriculture',
    region: 'Umm Al Quwain',
    sector: 'AgriTech',
    story:
      'Pioneered vertical farming solutions adapted for the UAE climate, enabling sustainable food production with minimal water usage.',
    image:
      'https://images.unsplash.com/photo-1573497019776-45afcc7b9f59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
]

// Story categories data
export const storyCategories = [
  {
    id: 'all',
    title: 'All Stories',
  },
  {
    id: 'technology',
    title: 'Technology',
  },
  {
    id: 'sustainability',
    title: 'Sustainability',
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
  },
  {
    id: 'creative',
    title: 'Creative',
  },
  {
    id: 'finance',
    title: 'Finance',
  },
  {
    id: 'education',
    title: 'Education',
  },
  {
    id: 'retail',
    title: 'Retail',
  },
  {
    id: 'agriculture',
    title: 'Agriculture',
  },
]

// Resources data
export const resourcesData = [
  {
    id: 'resource1',
    title: 'Women Entrepreneurs Network',
    type: 'Communities',
    category: 'Networking',
    description:
      'A nationwide network connecting women entrepreneurs across all sectors for collaboration and knowledge sharing.',
    organization: 'Female Fusion',
    link: 'https://femalefusion.ae',
  },
  {
    id: 'resource2',
    title: 'Business Plan Development Workshop',
    type: 'Resources',
    category: 'Business Planning',
    description:
      'Step-by-step guide and workshop series on developing comprehensive business plans tailored to different industries.',
    organization: 'Dubai Business Women Council',
    link: 'https://dbwc.ae/workshops',
  },
  {
    id: 'resource3',
    title: 'Startup Legal Advisory Service',
    type: 'Services',
    category: 'Legal Support',
    description:
      'Pro bono legal consultation services for women entrepreneurs navigating business registration and compliance.',
    organization: 'DIFC Innovation Hub',
    link: 'https://difc.ae/innovation/legal',
  },
  {
    id: 'resource4',
    title: 'Tech Entrepreneurs Meetup',
    type: 'Communities',
    category: 'Technology',
    description:
      'Monthly gatherings for women in technology to share experiences, challenges, and opportunities in the tech ecosystem.',
    organization: 'Hub71',
    link: 'https://hub71.com/events',
  },
  {
    id: 'resource5',
    title: 'Funding Readiness Assessment',
    type: 'Resources',
    category: 'Finance',
    description:
      'Comprehensive toolkit to help entrepreneurs assess and improve their readiness for seeking investment funding.',
    organization: 'Khalifa Fund',
    link: 'https://khalifafund.ae/resources',
  },
  {
    id: 'resource6',
    title: 'Market Research Assistance',
    type: 'Services',
    category: 'Market Intelligence',
    description:
      'Personalized market research support to help entrepreneurs validate business ideas and identify target markets.',
    organization: 'Sharjah Research Technology and Innovation Park',
    link: 'https://srtip.ae/services',
  },
  {
    id: 'resource7',
    title: 'Creative Industries Forum',
    type: 'Communities',
    category: 'Creative Arts',
    description:
      'Community for women in creative fields including design, media, fashion, and arts to collaborate on projects.',
    organization: 'NAMA Women Advancement',
    link: 'https://namawomen.ae/creative',
  },
  {
    id: 'resource8',
    title: 'Digital Marketing Masterclass',
    type: 'Resources',
    category: 'Marketing',
    description:
      'Comprehensive guide to digital marketing strategies specifically for small businesses and startups.',
    organization: 'Dubai Internet City',
    link: 'https://dic.ae/resources',
  },
  {
    id: 'resource9',
    title: 'Business Mentorship Program',
    type: 'Services',
    category: 'Mentorship',
    description:
      'One-on-one mentorship matching program connecting experienced business leaders with women entrepreneurs.',
    organization: 'Abu Dhabi Business Women Council',
    link: 'https://adbwc.ae/mentorship',
  },
]

// Resource categories data
export const resourceCategories = [
  {
    id: 'communities',
    title: 'Communities',
  },
  {
    id: 'resources',
    title: 'Resources',
  },
  {
    id: 'services',
    title: 'Services',
  },
]

// Regional highlights data
export const regionalHighlights = [
  {
    id: 'abudhabi-highlight',
    name: 'Abu Dhabi',
    foundersCount: 245,
    image:
      'https://images.unsplash.com/photo-1624317937315-0ced8736c9e9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop',
    sector: 'Technology & Innovation',
    featuredFounder: 'Aisha Al Mazrouei',
  },
  {
    id: 'dubai-highlight',
    name: 'Dubai',
    foundersCount: 380,
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop',
    sector: 'FinTech & E-commerce',
    featuredFounder: 'Laila Al Nuaimi',
  },
  {
    id: 'sharjah-highlight',
    name: 'Sharjah',
    foundersCount: 175,
    image:
      'https://images.unsplash.com/photo-1679197982148-401b618044e2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop',
    sector: 'Creative Industries',
    featuredFounder: 'Fatima Al Qassimi',
  },
  {
    id: 'ajman-highlight',
    name: 'Ajman',
    foundersCount: 85,
    image:
      'https://visit-ajman.ae/media/ovhdys3i/ajman-palace-1-of-1-850x400.jpg',
    sector: 'Retail & Consumer Services',
    featuredFounder: 'Reem Al Marzouqi',
  },
  {
    id: 'rak-highlight',
    name: 'Ras Al Khaimah',
    foundersCount: 62,
    image:
      'https://images.unsplash.com/photo-1591609282229-c080f8c25ef4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop',
    sector: 'Tourism & Hospitality',
    featuredFounder: 'Hessa Al Ghurair',
  },
  {
    id: 'fujairah-highlight',
    name: 'Fujairah',
    foundersCount: 48,
    image:
      'https://images.unsplash.com/photo-1721939777055-6adbaf3bab0f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop',
    sector: 'Trade & Logistics',
    featuredFounder: 'Noura Al Kaabi',
  },
  {
    id: 'uaq-highlight',
    name: 'Umm Al Quwain',
    foundersCount: 35,
    image:
      'https://www.moet.gov.ae/documents/20121/354906/monument_42.jpg/a85ef5b9-f6eb-2544-4bff-cd69c5bf9376',
    sector: 'Agriculture & Sustainability',
    featuredFounder: 'Amna Al Zaabi',
  },
]

// Impact stats data
export const impactStats = [
  {
    id: 'stat1',
    value: '1,025',
    label: 'Women Entrepreneurs Supported',
    iconName: 'Users',
    iconColor: 'text-white',
    iconBgColor: 'bg-primary/80',
  },
  {
    id: 'stat2',
    value: 'AED 50,000,000',
    label: 'Funding Facilitated',
    iconName: 'DollarSign',
    iconColor: 'text-white',
    iconBgColor: 'bg-teal/80',
  },
  {
    id: 'stat3',
    value: '320',
    label: 'Businesses Launched',
    iconName: 'Briefcase',
    iconColor: 'text-white',
    iconBgColor: 'bg-purple/80',
  },
  {
    id: 'stat4',
    value: '7,500',
    label: 'New Jobs Created',
    iconName: 'UserPlus',
    iconColor: 'text-white',
    iconBgColor: 'bg-primary-dark/80',
  },
]
