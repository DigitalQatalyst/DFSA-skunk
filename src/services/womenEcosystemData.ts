// Data model for Women Entrepreneurs Ecosystem Map
// Global entity registry for organizations that appear in multiple emirates
export const entityRegistry = {
    entities: {
      Hub71: {
        type: 'sme_operator',
        link: 'https://hub71.com',
        description: 'Tech hub supporting women-led startups and scaleups with global expansion ambitions.',
        emirates: ['Abu Dhabi', 'Dubai'],
        coordinates: [24.5037, 54.3875] // Abu Dhabi Global Market, Al Maryah Island
      },
      'Khalifa Fund': {
        type: 'sme_operator',
        link: 'https://khalifafund.ae',
        description: 'Funding and mentorship for Emirati entrepreneurs with dedicated programs for women-led businesses.',
        emirates: ['Abu Dhabi', 'Dubai', 'Sharjah'],
        coordinates: [24.4539, 54.3969] // Khalifa Fund headquarters, Abu Dhabi
      },
      startAD: {
        type: 'academic_partner',
        link: 'https://startad.ae',
        description: 'Accelerator and mentorship program for women entrepreneurs based at NYU Abu Dhabi.',
        emirates: ['Abu Dhabi'],
        coordinates: [24.5246, 54.4346] // NYU Abu Dhabi, Saadiyat Island
      },
      'Dubai Business Women Council': {
        type: 'local_enabler',
        link: 'https://dbwc.ae',
        description: 'Networking, mentorship, and international exposure for women entrepreneurs in Dubai.',
        emirates: ['Dubai'],
        coordinates: [25.2648, 55.3291] // Dubai Chamber of Commerce, Deira
      },
      'DIFC Innovation Hub': {
        type: 'tech_support',
        link: 'https://difc.ae/innovation',
        description: 'Innovation hub located in Dubai International Financial Centre supporting fintech startups.',
        emirates: ['Dubai'],
        coordinates: [25.2125, 55.2808] // DIFC, Gate Village
      },
      'Sharjah Business Women Council': {
        type: 'local_enabler',
        link: 'https://sbwc.ae',
        description: 'Business support, training, and exhibitions for women entrepreneurs in Sharjah.',
        emirates: ['Sharjah'],
        coordinates: [25.3573, 55.3927] // Sharjah Chamber of Commerce
      },
      Sheraa: {
        type: 'academic_partner',
        link: 'https://sheraa.ae',
        description: 'Entrepreneurship center providing incubation, acceleration, and investment opportunities.',
        emirates: ['Sharjah'],
        coordinates: [25.3051, 55.5008] // Sheraa, American University of Sharjah area
      },
      'NAMA Women Advancement': {
        type: 'private_sector',
        link: 'https://namawomen.ae',
        description: 'Organization dedicated to advancing women economically through various programs and initiatives.',
        emirates: ['Sharjah'],
        coordinates: [25.3286, 55.4025] // Sharjah city center
      },
      'Ajman Chamber of Commerce': {
        type: 'local_enabler',
        link: 'https://ajmanchamber.ae',
        description: 'Supporting local businesses and entrepreneurs through various services and initiatives.',
        emirates: ['Ajman'],
        coordinates: [25.4111, 55.4352] // Ajman Chamber, downtown
      },
      'RAKEZ Economic Zone': {
        type: 'local_enabler',
        link: 'https://rakez.com',
        description: 'Economic zone offering business setup and support services for entrepreneurs.',
        emirates: ['Ras Al Khaimah'],
        coordinates: [25.6866, 55.9455] // RAKEZ headquarters, Al Hamra area
      },
      'Fujairah Chamber of Commerce': {
        type: 'local_enabler',
        link: 'https://fujcci.ae',
        description: 'Supporting local businesses with a focus on trade and logistics.',
        emirates: ['Fujairah'],
        coordinates: [25.1288, 56.3265] // Fujairah Chamber, city center
      },
      'UAQ Business Center': {
        type: 'local_enabler',
        link: 'https://uaqchamber.ae',
        description: 'Business center offering facilities and support services for local entrepreneurs.',
        emirates: ['Umm Al Quwain'],
        coordinates: [25.5644, 55.5471] // Umm Al Quwain city center
      },
      'Emirates Business Women Council': {
        type: 'federal_enabler',
        link: 'https://fbccouncil.ae',
        description: 'Federal council supporting business women across all emirates through advocacy and policy development.',
        emirates: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
        coordinates: [24.4685, 54.3721] // Abu Dhabi government district
      },
      'UAE Gender Balance Council': {
        type: 'federal_enabler',
        link: 'https://gbc.gov.ae',
        description: 'Federal entity focused on reducing the gender gap across all sectors including entrepreneurship.',
        emirates: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
        coordinates: [25.2048, 55.2708] // Dubai government offices, Trade Centre area
      },
      'Female Fusion': {
        type: 'private_sector',
        link: 'https://femalefusion.ae',
        description: "UAE's largest community of women entrepreneurs providing networking, resources and support.",
        emirates: ['Dubai', 'Abu Dhabi', 'Sharjah'],
        coordinates: [25.2048, 55.2708] // Dubai, Business Bay area
      },
      'Etisalat by e&': {
        type: 'tech_support',
        link: 'https://etisalat.ae',
        description: 'Telecommunications provider offering digital solutions and support for women entrepreneurs.',
        emirates: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
        coordinates: [24.4764, 54.3705] // Etisalat headquarters, Abu Dhabi
      },
      Snapchat: {
        type: 'tech_support',
        link: 'https://snap.com',
        description: 'Social media platform providing digital marketing support and training for women entrepreneurs.',
        emirates: ['Dubai'],
        coordinates: [25.2048, 55.2708] // Dubai, Business Bay/DIFC area
      },
      'Khalifa University': {
        type: 'academic_partner',
        link: 'https://ku.ac.ae',
        description: 'University providing research support, innovation labs, and educational programs for women entrepreneurs.',
        emirates: ['Abu Dhabi'],
        coordinates: [24.4288, 54.6111] // Khalifa University main campus
      },
      'Abu Dhabi Business Women Council': {
        type: 'local_enabler',
        link: 'https://adbwc.ae',
        description: 'Council dedicated to supporting women entrepreneurs in Abu Dhabi through networking, training and advocacy.',
        emirates: ['Abu Dhabi'],
        coordinates: [24.4539, 54.3773] // Abu Dhabi city center
      },
      'Dubai SME': {
        type: 'sme_operator',
        link: 'https://sme.ae',
        description: 'Government agency providing comprehensive support to small and medium enterprises in Dubai.',
        emirates: ['Dubai'],
        coordinates: [25.2648, 55.3291] // Dubai Chamber, part of Dubai Economy
      },
      'Dubai Technology Entrepreneur Campus': {
        type: 'tech_support',
        link: 'https://dtec.ae',
        description: 'Technology hub and coworking space supporting tech startups and entrepreneurs.',
        emirates: ['Dubai'],
        coordinates: [25.0989, 55.1735] // Dubai Silicon Oasis
      },
      'Sharjah Research Technology and Innovation Park': {
        type: 'tech_support',
        link: 'https://srtip.ae',
        description: 'Innovation ecosystem fostering R&D and entrepreneurship in key sectors.',
        emirates: ['Sharjah'],
        coordinates: [25.2948, 55.6895] // SRTIP, University City
      },
      'American University of Sharjah': {
        type: 'academic_partner',
        link: 'https://aus.edu',
        description: 'University offering entrepreneurship programs and innovation support for students and alumni.',
        emirates: ['Sharjah'],
        coordinates: [25.3130, 55.4909] // AUS campus
      },
      'Ajman University': {
        type: 'academic_partner',
        link: 'https://ajman.ac.ae',
        description: 'University with innovation center supporting entrepreneurship and business development.',
        emirates: ['Ajman'],
        coordinates: [25.4181, 55.5053] // Ajman University main campus
      },
      'RAK Chamber': {
        type: 'local_enabler',
        link: 'https://rakchamber.ae',
        description: 'Chamber of commerce supporting local businesses and entrepreneurs in Ras Al Khaimah.',
        emirates: ['Ras Al Khaimah'],
        coordinates: [25.7896, 55.9431] // RAK city center
      },
      'RAK SME': {
        type: 'sme_operator',
        link: 'https://raksme.ae',
        description: 'Agency supporting small and medium enterprises in Ras Al Khaimah with funding and mentorship.',
        emirates: ['Ras Al Khaimah'],
        coordinates: [25.7896, 55.9431] // RAK government area
      },
      'Fujairah Creative City': {
        type: 'private_sector',
        link: 'https://creativecity.ae',
        description: 'Free zone for creative entrepreneurs and businesses in media and related sectors.',
        emirates: ['Fujairah'],
        coordinates: [25.2925, 56.3406] // Fujairah Creative City, Al Shariaa area
      },
      'UAQ Free Trade Zone': {
        type: 'local_enabler',
        link: 'https://uaqftz.com',
        description: 'Free zone offering business setup and support services for entrepreneurs.',
        emirates: ['Umm Al Quwain'],
        coordinates: [25.5445, 55.5865] // UAQ Free Trade Zone
      },
      'Dubai Internet City': {
        type: 'tech_support',
        link: 'https://dic.ae',
        description: 'Technology park providing infrastructure and support for tech companies and startups.',
        emirates: ['Dubai'],
        coordinates: [25.0945, 55.1662] // Dubai Internet City
      },
      'Zayed University': {
        type: 'academic_partner',
        link: 'https://zu.ac.ae',
        description: 'University with entrepreneurship programs focused on empowering Emirati women.',
        emirates: ['Abu Dhabi', 'Dubai'],
        coordinates: [24.3459, 54.5122] // Zayed University Abu Dhabi campus
      },
      'Dubai Cares': {
        type: 'private_sector',
        link: 'https://dubaicares.ae',
        description: 'Philanthropic organization supporting education and entrepreneurship initiatives.',
        emirates: ['Dubai'],
        coordinates: [25.2208, 55.2853] // Dubai Cares, Trade Centre area
      },
      'Emirates Development Bank': {
        type: 'federal_enabler',
        link: 'https://edb.gov.ae',
        description: 'Federal financial institution providing funding and support for SMEs and entrepreneurs.',
        emirates: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
        coordinates: [24.4907, 54.3772] // Emirates Development Bank, Abu Dhabi
      },
      'Mohammed Bin Rashid Innovation Fund': {
        type: 'federal_enabler',
        link: 'https://mbrif.ae',
        description: 'Federal initiative offering funding and support for innovative businesses and entrepreneurs.',
        emirates: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
        coordinates: [25.2208, 55.2853] // Dubai government area, Trade Centre
      },
      'ADGM Academy': {
        type: 'academic_partner',
        link: 'https://adgmacademy.com',
        description: 'Educational institution offering financial and entrepreneurship training programs.',
        emirates: ['Abu Dhabi'],
        coordinates: [24.5037, 54.3875] // ADGM, Al Maryah Island
      },
      'Dubai Future Accelerators': {
        type: 'tech_support',
        link: 'https://dubaifutureaccelerators.com',
        description: 'Program connecting startups with government entities to co-create innovative solutions.',
        emirates: ['Dubai'],
        coordinates: [25.2208, 55.2853] // Dubai Future Foundation, Trade Centre area
      },
      'Emirates Association for Women Entrepreneurs': {
        type: 'federal_enabler',
        link: 'https://www.uae.gov.ae/en/about-the-uae/strategies-initiatives-and-awards/federal-initiatives/emirates-association-for-women-entrepreneurs',
        description: 'Federal initiative supporting women entrepreneurs across all emirates through networking, mentorship, and business development programs.',
        emirates: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
        coordinates: [24.4685, 54.3721] // Abu Dhabi government district
      },
      'Ministry of Community Development': {
        type: 'federal_enabler',
        link: 'https://www.mocd.gov.ae',
        description: 'Federal ministry promoting community development and social empowerment, including women entrepreneurship initiatives and family support programs.',
        emirates: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
        coordinates: [24.4685, 54.3721] // Abu Dhabi government district
      },
      'General Women Union': {
        type: 'federal_enabler',
        link: 'https://www.gwu.ae',
        description: 'Federal organization dedicated to advancing women\'s rights and empowerment across all emirates through advocacy, education, and support programs.',
        emirates: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
        coordinates: [24.4685, 54.3721] // Abu Dhabi government district
      },
      'Rubu Qarn Sharjah': {
        type: 'local_enabler',
        link: 'https://www.rubuqarn.ae',
        description: 'Sharjah-based organization focused on empowering young women and supporting their entrepreneurial journey through various programs and initiatives.',
        emirates: ['Sharjah'],
        coordinates: [25.3573, 55.3927] // Sharjah city center
      },
      'Dubai Women Establishment': {
        type: 'local_enabler',
        link: 'https://www.dwe.gov.ae',
        description: 'Government-led initiative in Dubai dedicated to enhancing women\'s participation in business and leadership through policy development and support programs.',
        emirates: ['Dubai'],
        coordinates: [25.2048, 55.2708] // Dubai government area
      },
      'Saud Bin Saqr Establishment for Youth Enterprise Development': {
        type: 'sme_operator',
        link: 'https://www.sbseyd.ae',
        description: 'Ras Al Khaimah-based organization supporting youth entrepreneurship and business development, with special focus on women-led initiatives.',
        emirates: ['Ras Al Khaimah'],
        coordinates: [25.7896, 55.9431] // RAK city center
      },
      'Maan Social Incubator': {
        type: 'sme_operator',
        link: 'https://www.maan.ae',
        description: 'Social innovation incubator supporting social entrepreneurs and community-focused businesses, with programs specifically for women-led social enterprises.',
        emirates: ['Abu Dhabi'],
        coordinates: [24.4539, 54.3773] // Abu Dhabi city center
      },
      'Women Entrepreneurs Abu Dhabi': {
        type: 'private_sector',
        link: 'https://www.wead.ae',
        description: 'Private sector initiative supporting women entrepreneurs in Abu Dhabi through networking, mentorship, and business development opportunities.',
        emirates: ['Abu Dhabi'],
        coordinates: [24.4539, 54.3773] // Abu Dhabi city center
      },
      'Higher Colleges of Technology': {
        type: 'academic_partner',
        link: 'https://www.hct.ac.ae',
        description: 'Federal higher education institution offering entrepreneurship programs and business development courses specifically designed for women students and alumni.',
        emirates: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
        coordinates: [24.4539, 54.3773] // Abu Dhabi main campus
      },
      'United Arab Emirates University': {
        type: 'academic_partner',
        link: 'https://www.uaeu.ac.ae',
        description: 'Federal university offering comprehensive entrepreneurship and business programs with dedicated support for women students and researchers.',
        emirates: ['Abu Dhabi', 'Al Ain'],
        coordinates: [24.2136, 55.7447] // UAEU Al Ain campus
      },
      'Noon': {
        type: 'tech_support',
        link: 'https://www.noon.com',
        description: 'E-commerce platform providing digital marketplace opportunities and support for women entrepreneurs to sell their products online.',
        emirates: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
        coordinates: [25.2048, 55.2708] // Dubai headquarters
      },
      'eBay': {
        type: 'tech_support',
        link: 'https://www.ebay.ae',
        description: 'Global e-commerce platform offering women entrepreneurs access to international markets and digital selling tools for business growth.',
        emirates: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
        coordinates: [25.2048, 55.2708] // Dubai office
      }
    }
  };
  
  // Emirate-specific data
  export const emiratesData = [{
    id: 'abudhabi',
    emirate: 'Abu Dhabi',
    coordinates: [24.4539, 54.3773],
    zoomLevel: 9,
    boundingBox: [[23.4, 51.5], [24.8, 55.0]],
    overview: {
      title: 'Driving Innovation Through Inclusive Entrepreneurship',
      description: 'A thriving ecosystem of enablers focusing on innovation, funding, and sustainability, supporting women entrepreneurs through comprehensive programs and initiatives.',
      tags: ['Federal', 'Local', 'Operator', 'Academic', 'Tech']
    },
    federal_enablers: ['Emirates Business Women Council', 'UAE Gender Balance Council', 'Emirates Development Bank', 'Mohammed Bin Rashid Innovation Fund', 'Emirates Association for Women Entrepreneurs', 'Ministry of Community Development', 'General Women Union'],
    local_enablers: ['Abu Dhabi Business Women Council'],
    sme_operators: ['Hub71', 'Khalifa Fund', 'Maan Social Incubator'],
    private_sector: ['Female Fusion', 'Women Entrepreneurs Abu Dhabi'],
    academic_partners: ['Khalifa University', 'startAD', 'ADGM Academy', 'Zayed University', 'Higher Colleges of Technology', 'United Arab Emirates University'],
    tech_support: ['Etisalat by e&', 'Noon', 'eBay'],
    programs: [{
      program_name: 'SheTech Accelerator',
      organization: 'Hub71',
      action_label: 'Apply Now',
      link: 'https://hub71.com/programs/shetech'
    }, {
      program_name: 'Women Entrepreneurs Academy',
      organization: 'Khalifa Fund',
      action_label: 'Join Program',
      link: 'https://khalifafund.ae/women-entrepreneurs'
    }, {
      program_name: 'Ibtikari Female Leaders',
      organization: 'startAD',
      action_label: 'Learn More',
      link: 'https://startad.ae/programs/ibtikari'
    }, {
      program_name: 'Entrepreneurship Diploma',
      organization: 'ADGM Academy',
      action_label: 'Enroll Now',
      link: 'https://adgmacademy.com/entrepreneurship'
    }, {
      program_name: "Mubdi'ah Program",
      organization: 'Abu Dhabi Business Women Council',
      action_label: 'Register Interest',
      link: 'https://adbwc.ae/programs/mubdiah'
    }]
  }, {
    id: 'dubai',
    emirate: 'Dubai',
    coordinates: [25.2048, 55.2708],
    zoomLevel: 9,
    boundingBox: [[24.8, 54.9], [25.4, 55.6]],
    overview: {
      title: 'Global Hub for Women Entrepreneurship',
      description: 'A dynamic ecosystem that connects women entrepreneurs to global markets through innovative programs, funding opportunities, and mentorship networks.',
      tags: ['Federal', 'Local', 'Tech', 'Private']
    },
    federal_enablers: ['Emirates Business Women Council', 'UAE Gender Balance Council', 'Emirates Development Bank', 'Mohammed Bin Rashid Innovation Fund', 'Emirates Association for Women Entrepreneurs', 'Ministry of Community Development', 'General Women Union'],
    local_enablers: ['Dubai Business Women Council', 'Dubai Women Establishment'],
    sme_operators: ['Khalifa Fund', 'Dubai SME'],
    private_sector: ['Female Fusion', 'Dubai Cares'],
    academic_partners: ['Zayed University', 'Higher Colleges of Technology'],
    tech_support: ['DIFC Innovation Hub', 'Etisalat by e&', 'Snapchat', 'Dubai Internet City', 'Dubai Technology Entrepreneur Campus', 'Dubai Future Accelerators', 'Noon', 'eBay'],
    programs: [{
      program_name: 'She Leads Program',
      organization: 'Dubai Business Women Council',
      action_label: 'Register Now',
      link: 'https://dbwc.ae/programs/she-leads'
    }, {
      program_name: 'FinTech Hive Accelerator',
      organization: 'DIFC Innovation Hub',
      action_label: 'Apply Now',
      link: 'https://www.difc.ae/fintech-hive'
    }, {
      program_name: 'Intelaq License Program',
      organization: 'Dubai SME',
      action_label: 'Get Started',
      link: 'https://sme.ae/intelaq'
    }, {
      program_name: 'Dubai Next Crowdfunding',
      organization: 'Dubai SME',
      action_label: 'Launch Campaign',
      link: 'https://dubainext.ae'
    }, {
      program_name: 'Women in Tech Mentorship',
      organization: 'Dubai Internet City',
      action_label: 'Join Network',
      link: 'https://dic.ae/women-in-tech'
    }, {
      program_name: 'Snap Accelerate',
      organization: 'Snapchat',
      action_label: 'Apply Now',
      link: 'https://snap.com/accelerate'
    }]
  }, {
    id: 'sharjah',
    emirate: 'Sharjah',
    coordinates: [25.3573, 55.3927],
    zoomLevel: 9,
    boundingBox: [[25.2, 55.3], [25.6, 55.7]],
    overview: {
      title: 'Empowering Women Through Cultural Innovation',
      description: 'A supportive ecosystem that combines cultural heritage with innovation to empower women entrepreneurs through targeted programs and initiatives.',
      tags: ['Federal', 'Local', 'Academic', 'Private']
    },
    federal_enablers: ['Emirates Business Women Council', 'UAE Gender Balance Council', 'Emirates Development Bank', 'Mohammed Bin Rashid Innovation Fund', 'Emirates Association for Women Entrepreneurs', 'Ministry of Community Development', 'General Women Union'],
    local_enablers: ['Sharjah Business Women Council', 'Rubu Qarn Sharjah'],
    sme_operators: ['Khalifa Fund'],
    private_sector: ['NAMA Women Advancement', 'Female Fusion'],
    academic_partners: ['Sheraa', 'American University of Sharjah', 'Higher Colleges of Technology'],
    tech_support: ['Etisalat by e&', 'Sharjah Research Technology and Innovation Park', 'Noon', 'eBay'],
    programs: [{
      program_name: 'SBWC Accelerator',
      organization: 'Sharjah Business Women Council',
      action_label: 'Join Now',
      link: 'https://sbwc.ae/accelerator'
    }, {
      program_name: 'Badiri E-Academy',
      organization: 'NAMA Women Advancement',
      action_label: 'Enroll Today',
      link: 'https://namawomen.ae/badiri'
    }, {
      program_name: 'Sheraa Startup Studio',
      organization: 'Sheraa',
      action_label: 'Apply Now',
      link: 'https://sheraa.ae/startup-studio'
    }, {
      program_name: 'Irthi Contemporary Crafts Council',
      organization: 'NAMA Women Advancement',
      action_label: 'Discover More',
      link: 'https://irthi.com'
    }, {
      program_name: 'SRTI Park Incubator',
      organization: 'Sharjah Research Technology and Innovation Park',
      action_label: 'Join Program',
      link: 'https://srtip.ae/incubator'
    }, {
      program_name: 'AUS New Venture Challenge',
      organization: 'American University of Sharjah',
      action_label: 'Register Team',
      link: 'https://aus.edu/venture-challenge'
    }]
  }, {
    id: 'ajman',
    emirate: 'Ajman',
    coordinates: [25.4052, 55.5136],
    zoomLevel: 10,
    boundingBox: [[25.3, 55.4], [25.5, 55.6]],
    overview: {
      title: 'Fostering Local Entrepreneurial Talent',
      description: 'A growing ecosystem focused on developing local entrepreneurial talent through targeted support programs and community initiatives.',
      tags: ['Federal', 'Local', 'Academic']
    },
    federal_enablers: ['Emirates Business Women Council', 'UAE Gender Balance Council', 'Emirates Development Bank', 'Mohammed Bin Rashid Innovation Fund', 'Emirates Association for Women Entrepreneurs', 'Ministry of Community Development', 'General Women Union'],
    local_enablers: ['Ajman Chamber of Commerce'],
    sme_operators: [],
    private_sector: [],
    academic_partners: ['Ajman University', 'Higher Colleges of Technology'],
    tech_support: ['Etisalat by e&', 'Noon', 'eBay'],
    programs: [{
      program_name: 'Ajman Entrepreneurs Program',
      organization: 'Ajman Chamber of Commerce',
      action_label: 'Learn More',
      link: 'https://ajmanchamber.ae/entrepreneurs'
    }, {
      program_name: 'Reyada Initiative',
      organization: 'Ajman Chamber of Commerce',
      action_label: 'Register Now',
      link: 'https://ajmanchamber.ae/reyada'
    }, {
      program_name: 'Innovation Center Incubator',
      organization: 'Ajman University',
      action_label: 'Apply Today',
      link: 'https://ajman.ac.ae/innovation'
    }, {
      program_name: 'Women Entrepreneurship Workshop Series',
      organization: 'Ajman Chamber of Commerce',
      action_label: 'Register Interest',
      link: 'https://ajmanchamber.ae/workshops'
    }]
  }, {
    id: 'rak',
    emirate: 'Ras Al Khaimah',
    coordinates: [25.7896, 55.9431],
    zoomLevel: 10,
    boundingBox: [[25.5, 55.7], [26.0, 56.2]],
    overview: {
      title: 'Connecting Tourism and Entrepreneurship',
      description: 'An ecosystem that leverages tourism and natural resources to create unique opportunities for women entrepreneurs.',
      tags: ['Federal', 'Local', 'Operator']
    },
    federal_enablers: ['Emirates Business Women Council', 'UAE Gender Balance Council', 'Emirates Development Bank', 'Mohammed Bin Rashid Innovation Fund', 'Emirates Association for Women Entrepreneurs', 'Ministry of Community Development', 'General Women Union'],
    local_enablers: ['RAKEZ Economic Zone', 'RAK Chamber'],
    sme_operators: ['RAK SME', 'Saud Bin Saqr Establishment for Youth Enterprise Development'],
    private_sector: [],
    academic_partners: ['Higher Colleges of Technology'],
    tech_support: ['Etisalat by e&', 'Noon', 'eBay'],
    programs: [{
      program_name: 'RAK SME Program',
      organization: 'RAKEZ Economic Zone',
      action_label: 'Register Interest',
      link: 'https://rakez.com/sme-program'
    }, {
      program_name: 'Sougha Heritage Crafts',
      organization: 'RAK Chamber',
      action_label: 'Join Initiative',
      link: 'https://rakchamber.ae/sougha'
    }, {
      program_name: 'Tourism Entrepreneurship Accelerator',
      organization: 'RAK SME',
      action_label: 'Apply Now',
      link: 'https://raksme.ae/tourism'
    }, {
      program_name: 'RAK Businesswomen Council',
      organization: 'RAK Chamber',
      action_label: 'Become a Member',
      link: 'https://rakchamber.ae/businesswomen'
    }]
  }, {
    id: 'fujairah',
    emirate: 'Fujairah',
    coordinates: [25.1288, 56.3265],
    zoomLevel: 10,
    boundingBox: [[25.0, 56.2], [25.6, 56.5]],
    overview: {
      title: 'Blending Trade and Innovation',
      description: 'A unique ecosystem that combines port trade advantages with innovation to support women-led businesses in various sectors.',
      tags: ['Federal', 'Local', 'Private']
    },
    federal_enablers: ['Emirates Business Women Council', 'UAE Gender Balance Council', 'Emirates Development Bank', 'Mohammed Bin Rashid Innovation Fund', 'Emirates Association for Women Entrepreneurs', 'Ministry of Community Development', 'General Women Union'],
    local_enablers: ['Fujairah Chamber of Commerce'],
    sme_operators: [],
    private_sector: ['Fujairah Creative City'],
    academic_partners: ['Higher Colleges of Technology'],
    tech_support: ['Etisalat by e&', 'Noon', 'eBay'],
    programs: [{
      program_name: 'Fujairah Entrepreneurs Initiative',
      organization: 'Fujairah Chamber of Commerce',
      action_label: 'Discover More',
      link: 'https://fujcci.ae/entrepreneurs'
    }, {
      program_name: 'Creative Business License',
      organization: 'Fujairah Creative City',
      action_label: 'Apply Now',
      link: 'https://creativecity.ae/license'
    }, {
      program_name: 'Women in Trade Program',
      organization: 'Fujairah Chamber of Commerce',
      action_label: 'Join Program',
      link: 'https://fujcci.ae/women-in-trade'
    }, {
      program_name: 'Fujairah Business Incubator',
      organization: 'Fujairah Chamber of Commerce',
      action_label: 'Register Interest',
      link: 'https://fujcci.ae/incubator'
    }]
  }, {
    id: 'uaq',
    emirate: 'Umm Al Quwain',
    coordinates: [25.5644, 55.5471],
    zoomLevel: 10,
    boundingBox: [[25.5, 55.4], [25.7, 55.7]],
    overview: {
      title: 'Building Community-Based Entrepreneurship',
      description: 'A community-focused ecosystem that nurtures local talent and traditional businesses with modern approaches.',
      tags: ['Federal', 'Local']
    },
    federal_enablers: ['Emirates Business Women Council', 'UAE Gender Balance Council', 'Emirates Development Bank', 'Mohammed Bin Rashid Innovation Fund', 'Emirates Association for Women Entrepreneurs', 'Ministry of Community Development', 'General Women Union'],
    local_enablers: ['UAQ Business Center', 'UAQ Free Trade Zone'],
    sme_operators: [],
    private_sector: [],
    academic_partners: ['Higher Colleges of Technology'],
    tech_support: ['Etisalat by e&', 'Noon', 'eBay'],
    programs: [{
      program_name: 'UAQ Women in Business',
      organization: 'UAQ Business Center',
      action_label: 'Join Network',
      link: 'https://uaqchamber.ae/women-in-business'
    }, {
      program_name: 'SME Support Package',
      organization: 'UAQ Free Trade Zone',
      action_label: 'Get Started',
      link: 'https://uaqftz.com/sme-support'
    }, {
      program_name: 'Traditional Crafts Revival',
      organization: 'UAQ Business Center',
      action_label: 'Learn More',
      link: 'https://uaqchamber.ae/crafts'
    }, {
      program_name: 'Entrepreneur License Program',
      organization: 'UAQ Free Trade Zone',
      action_label: 'Apply Now',
      link: 'https://uaqftz.com/entrepreneur-license'
    }]
  }];
  
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
        active: 'bg-primary text-white'
      }
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
        active: 'bg-teal text-white'
      }
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
        active: 'bg-purple text-white'
      }
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
        active: 'bg-purple-light text-purple-dark'
      }
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
        active: 'bg-teal-light text-teal-dark'
      }
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
        active: 'bg-primary-light text-primary-dark'
      }
    }
  };
  
  // GeoJSON data for UAE emirates (simplified)
  export const emirateGeoJSON = {
    abudhabi: {
      type: 'Polygon',
      coordinates: [[[51.5, 24.0], [52.0, 24.3], [52.5, 24.4], [53.0, 24.5], [53.5, 24.6], [54.0, 24.7], [54.3, 24.4], [54.5, 24.2], [54.0, 24.0], [53.5, 23.8], [53.0, 23.6], [52.5, 23.5], [52.0, 23.7], [51.8, 24.0], [51.5, 24.0]]]
    },
    dubai: {
      type: 'Polygon',
      coordinates: [[[55.0, 25.0], [55.1, 25.3], [55.3, 25.4], [55.4, 25.3], [55.6, 25.1], [55.5, 24.9], [55.3, 24.8], [55.1, 24.9], [55.0, 25.0]]]
    },
    sharjah: {
      type: 'Polygon',
      coordinates: [[[55.4, 25.3], [55.5, 25.4], [55.7, 25.5], [55.8, 25.4], [55.7, 25.3], [55.5, 25.2], [55.4, 25.3]]]
    },
    ajman: {
      type: 'Polygon',
      coordinates: [[[55.4, 25.4], [55.5, 25.5], [55.6, 25.4], [55.5, 25.3], [55.4, 25.4]]]
    },
    rak: {
      type: 'Polygon',
      coordinates: [[[55.9, 25.6], [56.0, 25.8], [56.2, 26.0], [56.3, 25.9], [56.2, 25.7], [56.0, 25.6], [55.9, 25.6]]]
    },
    fujairah: {
      type: 'Polygon',
      coordinates: [[[56.2, 25.1], [56.3, 25.3], [56.4, 25.5], [56.5, 25.3], [56.4, 25.1], [56.3, 25.0], [56.2, 25.1]]]
    },
    uaq: {
      type: 'Polygon',
      coordinates: [[[55.5, 25.5], [55.6, 25.6], [55.7, 25.5], [55.6, 25.4], [55.5, 25.5]]]
    }
  };
  
  // Helper function to get all organizations from a specific emirate
  export const getEmirateOrganizations = (emirateId: string) => {
    const emirate = emiratesData.find(e => e.id === emirateId);
    if (!emirate) return [];
    const organizations: any[] = [];
    // Combine all organization types from the emirate
    const addOrganizations = (orgNames: string[], type: string) => {
      orgNames.forEach(name => {
        if (name && entityRegistry.entities[name as keyof typeof entityRegistry.entities]) {
          const entity = entityRegistry.entities[name as keyof typeof entityRegistry.entities];
          organizations.push({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            category: type,
            type: categoryMapping[entity.type as keyof typeof categoryMapping]?.label || type,
            description: entity.description,
            link: entity.link,
            coordinates: entity.coordinates
          });
        }
      });
    };
    // Add organizations from each category
    addOrganizations(emirate.federal_enablers || [], 'federal_enabler');
    addOrganizations(emirate.local_enablers || [], 'local_enabler');
    addOrganizations(emirate.sme_operators || [], 'sme_operator');
    addOrganizations(emirate.private_sector || [], 'private_sector');
    addOrganizations(emirate.academic_partners || [], 'academic_partner');
    addOrganizations(emirate.tech_support || [], 'tech_support');
    return organizations;
  };
  
  // Helper function to get all organizations across all emirates
  export const getAllOrganizations = () => {
    const allOrgs: any[] = [];
    const addedOrgIds = new Set();
    emiratesData.forEach(emirate => {
      const emirateOrgs = getEmirateOrganizations(emirate.id);
      emirateOrgs.forEach(org => {
        if (!addedOrgIds.has(org.id)) {
          allOrgs.push(org);
          addedOrgIds.add(org.id);
        }
      });
    });
    return allOrgs;
  };
  
  // Helper function to get all programs from all emirates
  export const getAllPrograms = () => {
    return emiratesData.flatMap(emirate => emirate.programs.map(program => ({
      ...program,
      emirate: emirate.emirate
    })));
  };
  
  // Helper function to get programs from a specific emirate
  export const getEmiratePrograms = (emirateId: string) => {
    const emirate = emiratesData.find(e => e.id === emirateId);
    return emirate ? emirate.programs : [];
  };
  
  // Featured stories data
  export const featuredStories = [{
    id: 'story1',
    name: 'Aisha Al Khafifi',
    category: 'Technology',
    region: 'Abu Dhabi',
    sector: 'Artificial Intelligence',
    story: 'Founded an AI startup that helps businesses optimize their operations using machine learning algorithms. Her company has grown to serve clients across the GCC region.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
  }, {
    id: 'story2',
    name: 'Fatima Al Mansoor',
    category: 'Sustainability',
    region: 'Sharjah',
    sector: 'Clean Energy',
    story: 'Launched a renewable energy consultancy that has helped implement solar projects across the UAE, reducing carbon footprints for dozens of businesses.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }, {
    id: 'story3',
    name: 'Maryam Al Hashimi',
    category: 'Healthcare',
    region: 'Dubai',
    sector: 'Medical Technology',
    story: 'Created a telemedicine platform that connects patients with doctors, particularly serving women in remote areas who need specialized healthcare consultations.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }, 
  {
    id: 'story5',
    name: 'Laila Al Nuaimi',
    category: 'Finance',
    region: 'Dubai',
    sector: 'FinTech',
    story: 'Developed a financial literacy platform specifically designed for women entrepreneurs, helping them navigate funding options and financial management.',
    image: 'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }, {
    id: 'story6',
    name: 'Hessa Al Harbi',
    category: 'Education',
    region: 'Ras Al Khaimah',
    sector: 'EdTech',
    story: 'Founded an educational technology company that provides interactive learning experiences for students across the UAE, with a focus on STEM education for girls.',
    image: 'https://images.unsplash.com/photo-1573497019707-1c04de26e58c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }, {
    id: 'story7',
    name: 'Salama Al Shamsi',
    category: 'Retail',
    region: 'Abu Dhabi',
    sector: 'E-commerce',
    story: 'Created an online marketplace for locally-made products, supporting artisans and small businesses across the Emirates with a focus on traditional crafts.',
    image: 'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
  }, {
    id: 'story8',
    name: 'Amna Al Zaabi',
    category: 'Agriculture',
    region: 'Umm Al Quwain',
    sector: 'AgriTech',
    story: 'Pioneered vertical farming solutions adapted for the UAE climate, enabling sustainable food production with minimal water usage.',
    image: 'https://images.unsplash.com/photo-1573497019776-45afcc7b9f59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }];
  
  // Story categories data
  export const storyCategories = [{
    id: 'all',
    title: 'All Stories'
  }, {
    id: 'technology',
    title: 'Technology'
  }, {
    id: 'sustainability',
    title: 'Sustainability'
  }, {
    id: 'healthcare',
    title: 'Healthcare'
  }, {
    id: 'creative',
    title: 'Creative'
  }, {
    id: 'finance',
    title: 'Finance'
  }, {
    id: 'education',
    title: 'Education'
  }, {
    id: 'retail',
    title: 'Retail'
  }, {
    id: 'agriculture',
    title: 'Agriculture'
  }];
  
  // Resources data
  export const resourcesData = [{
    id: 'resource1',
    title: 'Women Entrepreneurs Network',
    type: 'Communities',
    category: 'Networking',
    description: 'A nationwide network connecting women entrepreneurs across all sectors for collaboration and knowledge sharing.',
    organization: 'Female Fusion',
    link: 'https://femalefusion.ae'
  }, {
    id: 'resource2',
    title: 'Business Plan Development Workshop',
    type: 'Resources',
    category: 'Business Planning',
    description: 'Step-by-step guide and workshop series on developing comprehensive business plans tailored to different industries.',
    organization: 'Dubai Business Women Council',
    link: 'https://dbwc.ae/workshops'
  }, {
    id: 'resource3',
    title: 'Startup Legal Advisory Service',
    type: 'Services',
    category: 'Legal Support',
    description: 'Pro bono legal consultation services for women entrepreneurs navigating business registration and compliance.',
    organization: 'DIFC Innovation Hub',
    link: 'https://difc.ae/innovation/legal'
  }, {
    id: 'resource4',
    title: 'Tech Entrepreneurs Meetup',
    type: 'Communities',
    category: 'Technology',
    description: 'Monthly gatherings for women in technology to share experiences, challenges, and opportunities in the tech ecosystem.',
    organization: 'Hub71',
    link: 'https://hub71.com/events'
  }, {
    id: 'resource5',
    title: 'Funding Readiness Assessment',
    type: 'Resources',
    category: 'Finance',
    description: 'Comprehensive toolkit to help entrepreneurs assess and improve their readiness for seeking investment funding.',
    organization: 'Khalifa Fund',
    link: 'https://khalifafund.ae/resources'
  }, {
    id: 'resource6',
    title: 'Market Research Assistance',
    type: 'Services',
    category: 'Market Intelligence',
    description: 'Personalized market research support to help entrepreneurs validate business ideas and identify target markets.',
    organization: 'Sharjah Research Technology and Innovation Park',
    link: 'https://srtip.ae/services'
  }, {
    id: 'resource7',
    title: 'Creative Industries Forum',
    type: 'Communities',
    category: 'Creative Arts',
    description: 'Community for women in creative fields including design, media, fashion, and arts to collaborate on projects.',
    organization: 'NAMA Women Advancement',
    link: 'https://namawomen.ae/creative'
  }, {
    id: 'resource8',
    title: 'Digital Marketing Masterclass',
    type: 'Resources',
    category: 'Marketing',
    description: 'Comprehensive guide to digital marketing strategies specifically for small businesses and startups.',
    organization: 'Dubai Internet City',
    link: 'https://dic.ae/resources'
  }, {
    id: 'resource9',
    title: 'Business Mentorship Program',
    type: 'Services',
    category: 'Mentorship',
    description: 'One-on-one mentorship matching program connecting experienced business leaders with women entrepreneurs.',
    organization: 'Abu Dhabi Business Women Council',
    link: 'https://adbwc.ae/mentorship'
  }, {
    id: 'resource10',
    title: 'Women in FinTech Community',
    type: 'Communities',
    category: 'Finance',
    description: 'Exclusive community for women in financial technology, offering networking, mentorship, and industry insights.',
    organization: 'DIFC Innovation Hub',
    link: 'https://difc.ae/fintech-community'
  }, {
    id: 'resource11',
    title: 'Export Readiness Program',
    type: 'Resources',
    category: 'International Trade',
    description: 'Comprehensive program to help women-led businesses prepare for international expansion and export opportunities.',
    organization: 'Dubai Chamber of Commerce',
    link: 'https://dubaichamber.com/export-readiness'
  }, {
    id: 'resource12',
    title: 'IP Protection Services',
    type: 'Services',
    category: 'Legal Support',
    description: 'Specialized intellectual property protection services for women entrepreneurs in technology and creative sectors.',
    organization: 'Abu Dhabi Global Market',
    link: 'https://adgm.com/ip-services'
  }, {
    id: 'resource13',
    title: 'Sustainability Entrepreneurs Circle',
    type: 'Communities',
    category: 'Sustainability',
    description: 'Community focused on sustainable business practices and green entrepreneurship for women-led ventures.',
    organization: 'UAE Ministry of Climate Change',
    link: 'https://moccae.gov.ae/sustainability-circle'
  }, {
    id: 'resource14',
    title: 'Financial Literacy Bootcamp',
    type: 'Resources',
    category: 'Finance',
    description: 'Intensive financial literacy program covering budgeting, investment, and financial planning for entrepreneurs.',
    organization: 'Emirates Development Bank',
    link: 'https://edb.gov.ae/financial-literacy'
  }, {
    id: 'resource15',
    title: 'Digital Transformation Consulting',
    type: 'Services',
    category: 'Technology',
    description: 'Expert consulting services to help traditional businesses embrace digital transformation and technology adoption.',
    organization: 'Dubai Technology Entrepreneur Campus',
    link: 'https://dtec.ae/digital-transformation'
  }, {
    id: 'resource16',
    title: 'Women Angel Investors Network',
    type: 'Communities',
    category: 'Investment',
    description: 'Network of women angel investors providing funding and mentorship to early-stage women-led startups.',
    organization: 'Dubai Business Women Council',
    link: 'https://dbwc.ae/angel-network'
  }, {
    id: 'resource17',
    title: 'E-commerce Launch Toolkit',
    type: 'Resources',
    category: 'E-commerce',
    description: 'Complete toolkit and guide for launching and scaling e-commerce businesses in the UAE market.',
    organization: 'Dubai Internet City',
    link: 'https://dic.ae/ecommerce-toolkit'
  }, {
    id: 'resource18',
    title: 'HR and Talent Acquisition Services',
    type: 'Services',
    category: 'Human Resources',
    description: 'Specialized HR services including recruitment, training, and organizational development for growing businesses.',
    organization: 'Sharjah Business Women Council',
    link: 'https://sbwc.ae/hr-services'
  }, {
    id: 'resource19',
    title: 'HealthTech Innovation Lab',
    type: 'Communities',
    category: 'Healthcare',
    description: 'Innovation lab bringing together women entrepreneurs in healthcare technology for collaboration and development.',
    organization: 'Khalifa University',
    link: 'https://ku.ac.ae/healthtech-lab'
  }, {
    id: 'resource20',
    title: 'Government Procurement Guide',
    type: 'Resources',
    category: 'Government Contracts',
    description: 'Comprehensive guide to accessing government contracts and procurement opportunities for women-led businesses.',
    organization: 'UAE Federal Authority for Government Procurement',
    link: 'https://fagp.gov.ae/women-procurement'
  }];
  
  // Resource categories data
  export const resourceCategories = [{
    id: 'communities',
    title: 'Communities'
  }, {
    id: 'resources',
    title: 'Resources'
  }, {
    id: 'services',
    title: 'Services'
  }];
  
  // Events and Workshops data
  export const eventsData = [{
    id: 'event1',
    title: 'Women in Tech Summit 2024',
    type: 'Conference',
    date: '2024-03-15',
    time: '09:00 - 17:00',
    location: 'Dubai World Trade Centre',
    description: 'Annual summit bringing together women in technology for networking, learning, and collaboration opportunities.',
    organizer: 'Dubai Business Women Council',
    link: 'https://dbwc.ae/tech-summit-2024',
    price: 'Free',
    capacity: 500,
    category: 'Technology'
  }, {
    id: 'event2',
    title: 'Startup Pitch Competition',
    type: 'Competition',
    date: '2024-03-22',
    time: '14:00 - 18:00',
    location: 'Hub71, Abu Dhabi',
    description: 'Pitch competition for women-led startups with AED 100,000 in prizes and mentorship opportunities.',
    organizer: 'Hub71',
    link: 'https://hub71.com/pitch-competition',
    price: 'Free',
    capacity: 50,
    category: 'Funding'
  }, {
    id: 'event3',
    title: 'Financial Planning Workshop',
    type: 'Workshop',
    date: '2024-03-28',
    time: '10:00 - 12:00',
    location: 'Online',
    description: 'Interactive workshop on financial planning, budgeting, and investment strategies for entrepreneurs.',
    organizer: 'Emirates Development Bank',
    link: 'https://edb.gov.ae/financial-workshop',
    price: 'Free',
    capacity: 100,
    category: 'Finance'
  }, {
    id: 'event4',
    title: 'Digital Marketing Masterclass',
    type: 'Masterclass',
    date: '2024-04-05',
    time: '09:00 - 16:00',
    location: 'Dubai Internet City',
    description: 'Comprehensive masterclass on digital marketing strategies, social media, and online presence optimization.',
    organizer: 'Dubai Internet City',
    link: 'https://dic.ae/digital-marketing-masterclass',
    price: 'AED 500',
    capacity: 30,
    category: 'Marketing'
  }, {
    id: 'event5',
    title: 'Legal Essentials for Startups',
    type: 'Workshop',
    date: '2024-04-12',
    time: '14:00 - 16:00',
    location: 'DIFC Innovation Hub',
    description: 'Essential legal knowledge for startups including company registration, contracts, and compliance.',
    organizer: 'DIFC Innovation Hub',
    link: 'https://difc.ae/legal-workshop',
    price: 'Free',
    capacity: 40,
    category: 'Legal'
  }, {
    id: 'event6',
    title: 'Sustainability in Business',
    type: 'Panel Discussion',
    date: '2024-04-19',
    time: '15:00 - 17:00',
    location: 'Sharjah Research Technology and Innovation Park',
    description: 'Panel discussion on integrating sustainability practices into business operations and strategy.',
    organizer: 'SRTIP',
    link: 'https://srtip.ae/sustainability-panel',
    price: 'Free',
    capacity: 80,
    category: 'Sustainability'
  }];
  
  // Mentorship programs data
  export const mentorshipData = [{
    id: 'mentor1',
    name: 'Dr. Aisha Al Mansoori',
    title: 'CEO, TechInnovate Solutions',
    experience: '15+ years in technology and entrepreneurship',
    expertise: ['Technology', 'Leadership', 'Scaling'],
    description: 'Experienced tech entrepreneur and CEO with expertise in scaling technology companies and building high-performing teams.',
    availability: '2-3 mentees',
    location: 'Dubai',
    languages: ['Arabic', 'English'],
    linkedin: 'https://linkedin.com/in/aisha-al-mansoori',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }, {
    id: 'mentor2',
    name: 'Fatima Al Zahra',
    title: 'Founder, GreenTech Ventures',
    experience: '12+ years in sustainability and clean technology',
    expertise: ['Sustainability', 'Clean Technology', 'Funding'],
    description: 'Serial entrepreneur and sustainability expert with successful exits and extensive funding experience.',
    availability: '1-2 mentees',
    location: 'Abu Dhabi',
    languages: ['Arabic', 'English'],
    linkedin: 'https://linkedin.com/in/fatima-al-zahra',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }, {
    id: 'mentor3',
    name: 'Maryam Al Hashimi',
    title: 'Investment Director, Venture Capital',
    experience: '10+ years in venture capital and investment',
    expertise: ['Investment', 'Finance', 'Due Diligence'],
    description: 'Investment professional with deep experience in evaluating and funding early-stage companies across various sectors.',
    availability: '3-4 mentees',
    location: 'Dubai',
    languages: ['Arabic', 'English', 'French'],
    linkedin: 'https://linkedin.com/in/maryam-al-hashimi',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }, {
    id: 'mentor5',
    name: 'Laila Al Nuaimi',
    title: 'FinTech Consultant & Former Banker',
    experience: '20+ years in banking and financial technology',
    expertise: ['FinTech', 'Banking', 'Regulatory Compliance'],
    description: 'Former senior banker turned FinTech consultant with extensive experience in financial services and regulatory compliance.',
    availability: '1-2 mentees',
    location: 'Abu Dhabi',
    languages: ['Arabic', 'English'],
    linkedin: 'https://linkedin.com/in/laila-al-nuaimi',
    image: 'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }];
  
  // Specialized services data
  export const specializedServicesData = [{
    id: 'service1',
    title: 'Business Registration & Licensing',
    category: 'Legal & Compliance',
    description: 'Complete business registration and licensing services for all types of companies in the UAE.',
    provider: 'DIFC Innovation Hub',
    price: 'From AED 2,000',
    duration: '5-10 business days',
    features: ['Company registration', 'Trade license', 'Visa processing', 'Bank account opening'],
    link: 'https://difc.ae/business-registration'
  }, {
    id: 'service2',
    title: 'Digital Marketing Strategy',
    category: 'Marketing & Branding',
    description: 'Comprehensive digital marketing strategy development and implementation for women-led businesses.',
    provider: 'Dubai Internet City',
    price: 'From AED 5,000',
    duration: '4-6 weeks',
    features: ['Strategy development', 'Social media setup', 'Content creation', 'Analytics tracking'],
    link: 'https://dic.ae/digital-marketing'
  }, {
    id: 'service3',
    title: 'Financial Planning & Advisory',
    category: 'Finance & Investment',
    description: 'Professional financial planning and advisory services tailored for women entrepreneurs.',
    provider: 'Emirates Development Bank',
    price: 'Free consultation',
    duration: 'Ongoing',
    features: ['Financial planning', 'Investment advice', 'Loan applications', 'Risk assessment'],
    link: 'https://edb.gov.ae/financial-advisory'
  }, {
    id: 'service4',
    title: 'HR & Talent Management',
    category: 'Human Resources',
    description: 'Complete HR services including recruitment, training, and organizational development.',
    provider: 'Sharjah Business Women Council',
    price: 'From AED 3,000',
    duration: 'As needed',
    features: ['Recruitment', 'Training programs', 'HR policies', 'Performance management'],
    link: 'https://sbwc.ae/hr-services'
  }, {
    id: 'service5',
    title: 'Technology Integration',
    category: 'Technology',
    description: 'Technology integration and digital transformation services for traditional businesses.',
    provider: 'Dubai Technology Entrepreneur Campus',
    price: 'From AED 10,000',
    duration: '6-12 weeks',
    features: ['System integration', 'Cloud migration', 'Process automation', 'Staff training'],
    link: 'https://dtec.ae/technology-integration'
  }, {
    id: 'service6',
    title: 'Export & International Trade',
    category: 'International Business',
    description: 'Comprehensive support for businesses looking to expand internationally and access global markets.',
    provider: 'Dubai Chamber of Commerce',
    price: 'From AED 1,500',
    duration: '3-6 months',
    features: ['Market research', 'Export documentation', 'Trade missions', 'Partnership matching'],
    link: 'https://dubaichamber.com/export-services'
  }];
  
  // REGIONAL HIGHLIGHTS (based on key emirate-level councils and programs)
  export const regionalHighlights = [{
    id: 'abudhabi',
    name: 'Abu Dhabi',
    foundersCount: 1300,
    featuredFounder: 'Hala Al Safi',
    sector: 'Technology & Innovation',
    image: 'https://images.unsplash.com/photo-1624317937315-0ced8736c9e9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop'
  }, {
    id: 'dubai',
    name: 'Dubai',
    foundersCount: 1900,
    featuredFounder: 'Amira Al Marban',
    sector: 'Finance & Trade',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop'
  }, {
    id: 'sharjah',
    name: 'Sharjah',
    foundersCount: 900,
    featuredFounder: 'Salma Al Farisi',
    sector: 'Creative Industries & Education',
    image: 'https://images.unsplash.com/photo-1679197982148-401b618044e2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop'
  }, {
    id: 'ajman',
    name: 'Ajman',
    foundersCount: 460,
    featuredFounder: 'Fiza Al Zahra',
    sector: 'Retail & Services',
    image: 'https://visit-ajman.ae/media/ovhdys3i/ajman-palace-1-of-1-850x400.jpg'
  }, {
    id: 'uaq',
    name: 'Umm Al Quwain',
    foundersCount: 250,
    featuredFounder: 'Mariam Al Ghaithi',
    sector: 'Hospitality & Tourism',
    image: 'https://www.moet.gov.ae/documents/20121/354906/monument_42.jpg/a85ef5b9-f6eb-2544-4bff-cd69c5bf9376'
  }, {
    id: 'rak',
    name: 'Ras Al Khaimah',
    foundersCount: 410,
    featuredFounder: 'Salwa Al Kahim',
    sector: 'Tourism & Sustainability',
    image: 'https://images.unsplash.com/photo-1591609282229-c080f8c25ef4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop'
  }, {
    id: 'fujairah',
    name: 'Fujairah',
    foundersCount: 330,
    featuredFounder: 'Leen Al Dahi',
    sector: 'Trade & Logistics',
    image: 'https://images.unsplash.com/photo-1721939777055-6adbaf3bab0f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop'
  }];
  
  // Impact stats data
  export const impactStats = [{
    id: 'stat1',
    value: '1,025',
    label: 'Women Entrepreneurs Supported',
    iconName: 'Users',
    iconColor: 'text-white',
    iconBgColor: 'bg-primary/80'
  }, {
    id: 'stat2',
    value: 'AED 50,000,000',
    label: 'Funding Facilitated',
    iconName: 'DollarSign',
    iconColor: 'text-white',
    iconBgColor: 'bg-teal/80'
  }, {
    id: 'stat3',
    value: '320',
    label: 'Businesses Launched',
    iconName: 'Briefcase',
    iconColor: 'text-white',
    iconBgColor: 'bg-purple/80'
  }, {
    id: 'stat4',
    value: '7,500',
    label: 'New Jobs Created',
    iconName: 'UserPlus',
    iconColor: 'text-white',
    iconBgColor: 'bg-primary-dark/80'
  }];