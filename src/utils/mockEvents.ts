export type EventSpeaker = {
  id: string
  name: string
  title: string
  bio: string
  avatarUrl: string
  linkedinUrl?: string
}
export type EventAgendaItem = {
  startTime: string
  endTime: string
  title: string
  speakerName: string
}
export type EventTicketType = {
  id: string
  name: string
  price: number
  currency: string
  remaining: number
}
export type EventLocation = {
  mode: 'in_person' | 'virtual'
  venue?: string
  city?: string
  country?: string
  meetingUrl?: string
}
export type EventCapacityStatus = 'open' | 'full' | 'waitlist'
export type EventPriceType = 'free' | 'paid'
export type EventCategory =
  | 'Seminar'
  | 'Workshop'
  | 'Training'
  | 'Webinar'
  | 'Conference'
  | 'Networking'
export interface Event {
  id: string
  slug: string
  title: string
  description: string
  category: EventCategory
  startDateTime: string
  start_at: string
  endDateTime: string
  end_at: string
  timezone: string
  location: EventLocation
  priceType: EventPriceType
  ticketTypes: EventTicketType[]
  capacityStatus: EventCapacityStatus
  imageUrl: string
  tags: string[]
  popularityScore: number
  speakers: EventSpeaker[]
  agenda: EventAgendaItem[]
  overview?: string
  objectives?: string[]
  whoShouldAttend?: string
  resources?: {
    title: string
    url: string
    type: string
  }[]
  faqs?: {
    question: string
    answer: string
  }[]
}
// Helper function to generate dates relative to current date
const generateDate = (dayOffset: number, hourOffset: number = 0): string => {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(date.getHours() + hourOffset)
  return date.toISOString()
}
// Create events for different categories (upcoming, ongoing, past)
export const mockEvents: Event[] = [
  // UPCOMING EVENTS (Future dates)
  {
    id: '1',
    slug: 'entrepreneurship-summit-2024',
    title: 'Entrepreneurship Summit 2024',
    description:
      'Join the largest gathering of entrepreneurs in the region to network, learn, and grow your business.',
    category: 'Conference',
    startDateTime: generateDate(14), // 14 days in the future
    endDateTime: generateDate(15),
    timezone: 'GST',
    location: {
      mode: 'in_person',
      venue: 'Abu Dhabi National Exhibition Centre',
      city: 'Abu Dhabi',
      country: 'UAE',
    },
    priceType: 'paid',
    ticketTypes: [
      {
        id: '1-1',
        name: 'Standard',
        price: 500,
        currency: 'AED',
        remaining: 150,
      },
      {
        id: '1-2',
        name: 'VIP',
        price: 1200,
        currency: 'AED',
        remaining: 25,
      },
    ],
    capacityStatus: 'open',
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80%27',
    tags: ['Entrepreneurship', 'Networking', 'Business Growth'],
    popularityScore: 95,
    speakers: [
      {
        id: 's1',
        name: 'Sarah Al Amiri',
        title: 'Minister of State for Advanced Technology',
        bio: 'Sarah is a renowned leader in technology innovation and policy in the UAE.',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        linkedinUrl: 'https://linkedin.com',
      },
      {
        id: 's2',
        name: 'Ahmed Khan',
        title: 'CEO, Future Ventures',
        bio: 'Ahmed has funded over 50 successful startups in the MENA region.',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        linkedinUrl: 'https://linkedin.com',
      },
    ],
    agenda: [
      {
        startTime: '09:00',
        endTime: '10:00',
        title: 'Opening Keynote: The Future of Entrepreneurship',
        speakerName: 'Sarah Al Amiri',
      },
      {
        startTime: '10:15',
        endTime: '11:15',
        title: 'Panel Discussion: Securing Funding in 2024',
        speakerName: 'Ahmed Khan',
      },
    ],
    overview:
      'The Entrepreneurship Summit is the premier event for business leaders, innovators, and aspiring entrepreneurs. This two-day conference features keynote speeches, panel discussions, workshops, and networking opportunities with some of the most successful business minds in the region.',
    objectives: [
      'Connect entrepreneurs with potential investors and partners',
      'Share insights on current market trends and opportunities',
      'Provide practical workshops on business growth strategies',
      'Showcase innovative startups and their solutions',
    ],
    whoShouldAttend:
      'Business owners, startup founders, investors, business development professionals, and anyone interested in entrepreneurship and innovation.',
    resources: [
      {
        title: 'Event Brochure',
        url: '#',
        type: 'PDF',
      },
      {
        title: 'Speaker Presentations',
        url: '#',
        type: 'ZIP',
      },
    ],
    faqs: [
      {
        question: 'Is there parking available at the venue?',
        answer:
          'Yes, the Abu Dhabi National Exhibition Centre has ample parking available for all attendees.',
      },
      {
        question: 'Will the sessions be recorded?',
        answer:
          'Yes, all keynote speeches and panel discussions will be recorded and made available to registered attendees after the event.',
      },
    ],
  },
  {
    id: '2',
    slug: 'digital-marketing-masterclass',
    title: 'Digital Marketing Masterclass',
    description:
      'Learn the latest digital marketing strategies and tools to grow your business online.',
    category: 'Workshop',
    startDateTime: generateDate(7), // 7 days in the future
    endDateTime: generateDate(7, 6), // 7 days in future, 6 hours duration
    timezone: 'GST',
    location: {
      mode: 'virtual',
      meetingUrl: 'https://zoom.us/j/123456789',
    },
    priceType: 'free',
    ticketTypes: [
      {
        id: '2-1',
        name: 'Standard',
        price: 0,
        currency: 'AED',
        remaining: 200,
      },
    ],
    capacityStatus: 'open',
    imageUrl:
      'https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80%27',
    tags: ['Marketing', 'Digital', 'Social Media'],
    popularityScore: 85,
    speakers: [
      {
        id: 's3',
        name: 'Fatima Rahman',
        title: 'Digital Marketing Director, TechGrowth',
        bio: 'Fatima has over 15 years of experience in digital marketing and has helped hundreds of businesses improve their online presence.',
        avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
        linkedinUrl: 'https://linkedin.com',
      },
    ],
    agenda: [
      {
        startTime: '10:00',
        endTime: '11:30',
        title: 'SEO Fundamentals for 2024',
        speakerName: 'Fatima Rahman',
      },
      {
        startTime: '12:30',
        endTime: '14:00',
        title: 'Social Media Strategy Workshop',
        speakerName: 'Fatima Rahman',
      },
      {
        startTime: '14:30',
        endTime: '16:00',
        title: 'Analytics and ROI Measurement',
        speakerName: 'Fatima Rahman',
      },
    ],
    overview:
      'This comprehensive masterclass covers all aspects of digital marketing, from SEO and content marketing to social media and analytics. Participants will leave with practical knowledge they can immediately apply to their businesses.',
    objectives: [
      'Understand current SEO best practices and how to implement them',
      'Develop effective social media strategies for different platforms',
      'Learn how to measure marketing ROI and optimize campaigns',
      'Create a comprehensive digital marketing plan',
    ],
    whoShouldAttend:
      'Marketing professionals, business owners, entrepreneurs, and anyone responsible for growing their business online.',
  },
  {
    id: '3',
    slug: 'financial-planning-for-smes',
    title: 'Financial Planning for SMEs',
    description:
      'Essential financial planning strategies for small and medium enterprises to ensure sustainable growth.',
    category: 'Seminar',
    startDateTime: generateDate(21), // 21 days in the future
    endDateTime: generateDate(21, 3), // 21 days in future, 3 hours duration
    timezone: 'GST',
    location: {
      mode: 'in_person',
      venue: 'Khalifa Fund Headquarters',
      city: 'Abu Dhabi',
      country: 'UAE',
    },
    priceType: 'free',
    ticketTypes: [
      {
        id: '3-1',
        name: 'Standard',
        price: 0,
        currency: 'AED',
        remaining: 0,
      },
    ],
    capacityStatus: 'full',
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2011&q=80%27',
    tags: ['Finance', 'SME', 'Planning'],
    popularityScore: 90,
    speakers: [
      {
        id: 's4',
        name: 'Mohammed Al Hashimi',
        title: 'Financial Advisor, SME Growth Partners',
        bio: 'Mohammed specializes in financial planning for small businesses and has helped over 200 SMEs optimize their financial strategies.',
        avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
        linkedinUrl: 'https://linkedin.com',
      },
    ],
    agenda: [
      {
        startTime: '14:00',
        endTime: '15:00',
        title: 'Financial Planning Fundamentals for SMEs',
        speakerName: 'Mohammed Al Hashimi',
      },
      {
        startTime: '15:15',
        endTime: '16:15',
        title: 'Cash Flow Management Strategies',
        speakerName: 'Mohammed Al Hashimi',
      },
      {
        startTime: '16:15',
        endTime: '17:00',
        title: 'Q&A Session',
        speakerName: 'Mohammed Al Hashimi',
      },
    ],
    overview:
      'This seminar will cover essential financial planning strategies for small and medium enterprises, focusing on practical approaches to manage cash flow, reduce costs, and plan for sustainable growth.',
    objectives: [
      'Understand the basics of financial planning for SMEs',
      'Learn effective cash flow management techniques',
      'Develop strategies for cost optimization',
      'Create a financial roadmap for business growth',
    ],
    whoShouldAttend:
      'Small and medium business owners, financial managers, entrepreneurs, and anyone responsible for financial decision-making in their organization.',
  },
  // ONGOING EVENTS (Current dates - happening now)
  {
    id: '4',
    slug: 'supply-chain-innovation',
    title: 'Supply Chain Innovation Forum',
    description:
      'Explore the latest innovations in supply chain management and logistics for improved efficiency.',
    category: 'Conference',
    startDateTime: generateDate(-1), // Started yesterday
    endDateTime: generateDate(1), // Ends tomorrow
    timezone: 'GST',
    location: {
      mode: 'in_person',
      venue: 'Dubai World Trade Centre',
      city: 'Dubai',
      country: 'UAE',
    },
    priceType: 'paid',
    ticketTypes: [
      {
        id: '4-1',
        name: 'Early Bird',
        price: 350,
        currency: 'AED',
        remaining: 0,
      },
      {
        id: '4-2',
        name: 'Standard',
        price: 500,
        currency: 'AED',
        remaining: 0,
      },
    ],
    capacityStatus: 'full',
    imageUrl:
      'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80%27',
    tags: ['Supply Chain', 'Logistics', 'Innovation'],
    popularityScore: 80,
    speakers: [
      {
        id: 's5',
        name: 'Layla Mansour',
        title: 'Supply Chain Director, Global Logistics Solutions',
        bio: 'Layla has over 20 years of experience in supply chain management and has implemented innovative solutions for multinational companies.',
        avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
        linkedinUrl: 'https://linkedin.com',
      },
      {
        id: 's6',
        name: 'Omar Khalid',
        title: 'CEO, Smart Logistics',
        bio: 'Omar founded Smart Logistics, a technology-driven logistics company that has revolutionized the industry in the MENA region.',
        avatarUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
        linkedinUrl: 'https://linkedin.com',
      },
    ],
    agenda: [
      {
        startTime: '09:00',
        endTime: '10:00',
        title: 'Opening Keynote: The Future of Supply Chain Management',
        speakerName: 'Layla Mansour',
      },
      {
        startTime: '10:30',
        endTime: '11:30',
        title: 'Panel: Technology Integration in Logistics',
        speakerName: 'Omar Khalid',
      },
    ],
    overview:
      'The Supply Chain Innovation Forum brings together industry leaders, technology providers, and logistics experts to discuss the latest trends and innovations in supply chain management. This two-day event features keynote speeches, panel discussions, case studies, and networking opportunities.',
    objectives: [
      'Explore emerging technologies in supply chain management',
      'Share best practices for optimizing logistics operations',
      'Discuss strategies for building resilient supply chains',
      'Network with industry leaders and solution providers',
    ],
    whoShouldAttend:
      'Supply chain managers, logistics professionals, operations managers, procurement specialists, and business leaders interested in improving their supply chain efficiency.',
  },
  {
    id: '5',
    slug: 'e-commerce-strategies-webinar',
    title: 'E-Commerce Strategies Webinar',
    description:
      'Learn proven strategies to boost your online sales and optimize your e-commerce operations.',
    category: 'Webinar',
    startDateTime: generateDate(0, -1), // Started 1 hour ago
    endDateTime: generateDate(0, 1), // Ends 1 hour from now
    timezone: 'GST',
    location: {
      mode: 'virtual',
      meetingUrl: 'https://zoom.us/j/987654321',
    },
    priceType: 'free',
    ticketTypes: [
      {
        id: '5-1',
        name: 'Standard',
        price: 0,
        currency: 'AED',
        remaining: 0,
      },
    ],
    capacityStatus: 'full',
    imageUrl:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80%27',
    tags: ['E-Commerce', 'Digital Marketing', 'Sales'],
    popularityScore: 75,
    speakers: [
      {
        id: 's7',
        name: 'Noor Al Qasimi',
        title: 'E-Commerce Consultant',
        bio: 'Noor has helped over 100 businesses establish and grow their e-commerce presence in the Middle East.',
        avatarUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
        linkedinUrl: 'https://linkedin.com',
      },
    ],
    agenda: [
      {
        startTime: '15:00',
        endTime: '15:45',
        title: 'E-Commerce Trends and Opportunities in 2024',
        speakerName: 'Noor Al Qasimi',
      },
      {
        startTime: '15:45',
        endTime: '16:15',
        title: 'Practical Strategies for E-Commerce Growth',
        speakerName: 'Noor Al Qasimi',
      },
      {
        startTime: '16:15',
        endTime: '16:30',
        title: 'Q&A Session',
        speakerName: 'Noor Al Qasimi',
      },
    ],
    overview:
      'This webinar will provide practical insights and strategies for businesses looking to establish or grow their e-commerce presence. Participants will learn about current trends, best practices, and tools to optimize their online sales channels.',
    objectives: [
      'Understand current e-commerce trends and opportunities',
      'Learn practical strategies for increasing online sales',
      'Discover tools and platforms for e-commerce optimization',
      'Develop an action plan for e-commerce growth',
    ],
    whoShouldAttend:
      'Business owners, marketing professionals, e-commerce managers, and entrepreneurs looking to grow their online sales.',
  },
  // PAST EVENTS (Events that have already ended)
  {
    id: '6',
    slug: 'leadership-development-training',
    title: 'Leadership Development Training',
    description:
      'Comprehensive training program to develop effective leadership skills for managers and executives.',
    category: 'Training',
    startDateTime: generateDate(-10), // 10 days ago
    endDateTime: generateDate(-8), // 8 days ago
    timezone: 'GST',
    location: {
      mode: 'in_person',
      venue: 'Jumeirah Emirates Towers',
      city: 'Dubai',
      country: 'UAE',
    },
    priceType: 'paid',
    ticketTypes: [
      {
        id: '6-1',
        name: 'Standard',
        price: 2500,
        currency: 'AED',
        remaining: 0,
      },
      {
        id: '6-2',
        name: 'Executive',
        price: 3500,
        currency: 'AED',
        remaining: 0,
      },
    ],
    capacityStatus: 'full',
    imageUrl:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80%27',
    tags: ['Leadership', 'Management', 'Professional Development'],
    popularityScore: 95,
    speakers: [
      {
        id: 's8',
        name: 'Dr. Khalid Al Falasi',
        title: 'Leadership Coach and Consultant',
        bio: 'Dr. Khalid is an internationally recognized leadership expert with over 25 years of experience coaching executives and teams.',
        avatarUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
        linkedinUrl: 'https://linkedin.com',
      },
      {
        id: 's9',
        name: 'Aisha Mohammed',
        title: 'HR Director, Global Enterprises',
        bio: 'Aisha specializes in organizational development and has implemented successful leadership programs in multiple Fortune 500 companies.',
        avatarUrl: 'https://randomuser.me/api/portraits/women/26.jpg',
        linkedinUrl: 'https://linkedin.com',
      },
    ],
    agenda: [
      {
        startTime: '09:00',
        endTime: '10:30',
        title:
          'Leadership Fundamentals: Self-Awareness and Emotional Intelligence',
        speakerName: 'Dr. Khalid Al Falasi',
      },
      {
        startTime: '11:00',
        endTime: '12:30',
        title: 'Effective Communication for Leaders',
        speakerName: 'Aisha Mohammed',
      },
      {
        startTime: '14:00',
        endTime: '15:30',
        title: 'Strategic Thinking and Decision Making',
        speakerName: 'Dr. Khalid Al Falasi',
      },
    ],
    overview:
      'This intensive three-day leadership development program is designed for managers and executives who want to enhance their leadership skills. The program covers essential leadership competencies, including emotional intelligence, communication, strategic thinking, and team development.',
    objectives: [
      'Develop self-awareness and emotional intelligence',
      'Enhance communication and influence skills',
      'Strengthen strategic thinking and decision-making abilities',
      'Learn effective team development and management techniques',
      'Create a personal leadership development plan',
    ],
    whoShouldAttend:
      'Managers, executives, team leaders, and professionals aspiring to leadership positions.',
    resources: [
      {
        title: 'Leadership Assessment Tool',
        url: '#',
        type: 'PDF',
      },
      {
        title: 'Leadership Development Workbook',
        url: '#',
        type: 'PDF',
      },
    ],
    faqs: [
      {
        question: 'Is accommodation included in the training fee?',
        answer:
          'No, accommodation is not included in the training fee. However, we have negotiated special rates with Jumeirah Emirates Towers for participants.',
      },
      {
        question: 'Will I receive a certificate upon completion?',
        answer:
          'Yes, all participants who complete the three-day program will receive a Leadership Development Certificate.',
      },
    ],
  },
  {
    id: '7',
    slug: 'business-networking-breakfast',
    title: 'Business Networking Breakfast',
    description:
      'Connect with fellow entrepreneurs and business leaders over breakfast in a structured networking event.',
    category: 'Networking',
    startDateTime: generateDate(-5), // 5 days ago
    endDateTime: generateDate(-5, 2), // 5 days ago, 2 hours duration
    timezone: 'GST',
    location: {
      mode: 'in_person',
      venue: 'Ritz-Carlton Hotel',
      city: 'Abu Dhabi',
      country: 'UAE',
    },
    priceType: 'paid',
    ticketTypes: [
      {
        id: '7-1',
        name: 'Standard',
        price: 150,
        currency: 'AED',
        remaining: 0,
      },
    ],
    capacityStatus: 'full',
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2032&q=80%27',
    tags: ['Networking', 'Business Development', 'Connections'],
    popularityScore: 85,
    speakers: [
      {
        id: 's10',
        name: 'Tariq Al Mahmood',
        title: 'President, Business Network UAE',
        bio: 'Tariq has been facilitating business connections for over 15 years and has helped thousands of entrepreneurs find partners and clients.',
        avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
        linkedinUrl: 'https://linkedin.com',
      },
    ],
    agenda: [
      {
        startTime: '08:00',
        endTime: '08:30',
        title: 'Breakfast and Open Networking',
        speakerName: 'All Attendees',
      },
      {
        startTime: '08:30',
        endTime: '08:45',
        title: 'Welcome and Introduction',
        speakerName: 'Tariq Al Mahmood',
      },
      {
        startTime: '08:45',
        endTime: '09:30',
        title: 'Structured Networking Session',
        speakerName: 'All Attendees',
      },
      {
        startTime: '09:30',
        endTime: '10:00',
        title: 'Open Networking and Closing',
        speakerName: 'All Attendees',
      },
    ],
    overview:
      'The Business Networking Breakfast is a monthly event designed to help entrepreneurs and business professionals make meaningful connections in a structured environment. The event includes both open networking and facilitated introduction sessions to maximize the opportunity to meet potential clients, partners, and collaborators.',
    objectives: [
      'Connect with like-minded business professionals',
      'Expand your professional network',
      'Find potential clients, partners, or collaborators',
      'Share ideas and best practices',
    ],
    whoShouldAttend:
      'Entrepreneurs, business owners, executives, sales professionals, and anyone looking to expand their professional network.',
  },
  {
    id: '8',
    slug: 'ai-for-business-innovation',
    title: 'AI for Business Innovation',
    description:
      'Discover how artificial intelligence can drive innovation and efficiency in your business operations.',
    category: 'Seminar',
    startDateTime: generateDate(-15), // 15 days ago
    endDateTime: generateDate(-15, 3), // 15 days ago, 3 hours duration
    timezone: 'GST',
    location: {
      mode: 'virtual',
      meetingUrl: 'https://teams.microsoft.com/l/meetup-join/123456789',
    },
    priceType: 'free',
    ticketTypes: [
      {
        id: '8-1',
        name: 'Standard',
        price: 0,
        currency: 'AED',
        remaining: 0,
      },
    ],
    capacityStatus: 'full',
    imageUrl:
      'https://images.unsplash.com/photo-1677442135136-760c813a032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80%27',
    tags: ['AI', 'Innovation', 'Technology', 'Digital Transformation'],
    popularityScore: 90,
    speakers: [
      {
        id: 's11',
        name: 'Dr. Mariam Al Zaabi',
        title: 'AI Research Scientist, Tech Innovation Institute',
        bio: 'Dr. Mariam specializes in applied AI and has helped numerous businesses implement AI solutions to solve complex problems.',
        avatarUrl: 'https://randomuser.me/api/portraits/women/79.jpg',
        linkedinUrl: 'https://linkedin.com',
      },
    ],
    agenda: [
      {
        startTime: '13:00',
        endTime: '13:45',
        title: 'Introduction to AI for Business',
        speakerName: 'Dr. Mariam Al Zaabi',
      },
      {
        startTime: '14:00',
        endTime: '14:45',
        title: 'Case Studies: Successful AI Implementation',
        speakerName: 'Dr. Mariam Al Zaabi',
      },
      {
        startTime: '15:00',
        endTime: '15:45',
        title: 'Getting Started with AI in Your Business',
        speakerName: 'Dr. Mariam Al Zaabi',
      },
      {
        startTime: '15:45',
        endTime: '16:00',
        title: 'Q&A Session',
        speakerName: 'Dr. Mariam Al Zaabi',
      },
    ],
    overview:
      'This seminar will explore how businesses can leverage artificial intelligence to drive innovation, improve efficiency, and create competitive advantages. Through practical examples and case studies, participants will learn about AI applications in various business functions and how to get started with AI implementation.',
    objectives: [
      'Understand the fundamentals of AI and its business applications',
      'Learn from real-world case studies of successful AI implementation',
      'Identify AI opportunities in your own business',
      'Develop a roadmap for AI adoption',
    ],
    whoShouldAttend:
      'Business leaders, innovation managers, technology officers, and decision-makers interested in leveraging AI for business growth and efficiency.',
  },
]
// Filter functions for events
export const filterEvents = (
  events: Event[],
  filters: {
    tab?: 'upcoming' | 'ongoing' | 'past'
    search?: string
    category?: EventCategory | ''
    dateRange?: { startDate: string | null; endDate: string | null }
    location?: 'in_person' | 'virtual' | ''
    city?: string
    price?: 'free' | 'paid' | ''
    capacity?: EventCapacityStatus | ''
    tags?: string[]
  },
) => {
  const now = new Date()
  return events.filter((event) => {
    // Filter by tab (upcoming, ongoing, past)
    if (filters.tab) {
      const eventStart = new Date(event.startDateTime)
      const eventEnd = new Date(event.endDateTime)
      if (filters.tab === 'upcoming' && eventStart > now) {
        // Event hasn't started yet
      } else if (
        filters.tab === 'ongoing' &&
        eventStart <= now &&
        eventEnd >= now
      ) {
        // Event is currently happening
      } else if (filters.tab === 'past' && eventEnd < now) {
        // Event has ended
      } else {
        return false
      }
    }
    // Filter by search query
    if (filters.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      if (!matchesSearch) return false
    }
    // Filter by category
    if (filters.category && event.category !== filters.category) {
      return false
    }
    // Filter by date range
    if (filters.dateRange) {
      if (filters.dateRange.startDate) {
        const filterStart = new Date(filters.dateRange.startDate)
        const eventStart = new Date(event.startDateTime)
        if (eventStart < filterStart) return false
      }
      if (filters.dateRange.endDate) {
        const filterEnd = new Date(filters.dateRange.endDate)
        const eventEnd = new Date(event.endDateTime)
        if (eventEnd > filterEnd) return false
      }
    }
    // Filter by location mode
    if (filters.location && event.location.mode !== filters.location) {
      return false
    }
    // Filter by city (only for in-person events)
    if (
      filters.city &&
      filters.city.trim() !== '' &&
      event.location.mode === 'in_person'
    ) {
      if (
        !event.location.city ||
        !event.location.city.toLowerCase().includes(filters.city.toLowerCase())
      ) {
        return false
      }
    }
    // Filter by price type
    if (filters.price && event.priceType !== filters.price) {
      return false
    }
    // Filter by capacity status
    if (filters.capacity && event.capacityStatus !== filters.capacity) {
      return false
    }
    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      if (!event.tags.some((tag) => filters.tags?.includes(tag))) {
        return false
      }
    }
    return true
  })
}
// Sort functions for events
export const sortEvents = (
  events: Event[],
  sortBy: 'soonest' | 'latest' | 'popular' = 'soonest',
) => {
  const sortedEvents = [...events]
  switch (sortBy) {
    case 'soonest':
      sortedEvents.sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() -
          new Date(b.startDateTime).getTime(),
      )
      break
    case 'latest':
      sortedEvents.sort(
        (a, b) =>
          new Date(b.startDateTime).getTime() -
          new Date(a.startDateTime).getTime(),
      )
      break
    case 'popular':
      sortedEvents.sort((a, b) => b.popularityScore - a.popularityScore)
      break
  }
  return sortedEvents
}
// Pagination function
export const paginateEvents = (
  events: Event[],
  page: number,
  pageSize: number,
) => {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  return events.slice(startIndex, endIndex)
}