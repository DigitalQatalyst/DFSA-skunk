import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLinkIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { TabsSimple, SimpleSection } from '../TabsVariations';
interface Program {
  title: string;
  organization: string;
  region: string;
  description: string;
  link: string;
}
interface Partner {
  title: string;
  description: string;
  logo: string;
  link: string;
}
interface ProgramsAndPartnersProps {
  programs: Program[];
  partners: Partner[];
}
// Custom icons for different categories
const icons = {
  government: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L2 9H22L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 9V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 13V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 13V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 20H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  funding: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.31 11.14C10.54 10.69 9.97 10.2 9.97 9.47C9.97 8.63 10.76 8.04 12.07 8.04C13.45 8.04 13.97 8.7 14.01 9.68H15.72C15.67 8.34 14.85 7.11 13.23 6.71V5H10.9V6.69C9.39 7.01 8.18 7.99 8.18 9.5C8.18 11.29 9.67 12.19 11.84 12.71C13.79 13.17 14.18 13.86 14.18 14.58C14.18 15.11 13.79 15.97 12.08 15.97C10.48 15.97 9.85 15.25 9.76 14.33H8.04C8.14 16.03 9.4 16.99 10.9 17.3V19H13.24V17.33C14.76 17.04 15.96 16.17 15.97 14.56C15.96 12.36 14.07 11.6 12.31 11.14Z" fill="currentColor" />
    </svg>,
  network: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5C12.5523 5 13 4.55228 13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4C11 4.55228 11.4477 5 12 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 5C19.5523 5 20 4.55228 20 4C20 3.44772 19.5523 3 19 3C18.4477 3 18 3.44772 18 4C18 4.55228 18.4477 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5C5.55228 5 6 4.55228 6 4C6 3.44772 5.55228 3 5 3C4.44772 3 4 3.44772 4 4C4 4.55228 4.44772 5 5 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 19C12.5523 19 13 18.5523 13 18C13 17.4477 12.5523 17 12 17C11.4477 17 11 17.4477 11 18C11 18.5523 11.4477 19 12 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 19C19.5523 19 20 18.5523 20 18C20 17.4477 19.5523 17 19 17C18.4477 17 18 17.4477 18 18C18 18.5523 18.4477 19 19 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19C5.55228 19 6 18.5523 6 18C6 17.4477 5.55228 17 5 17C4.44772 17 4 17.4477 4 18C4 18.5523 4.44772 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 4H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  hub: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.27002 6.96002L12 12.01L20.73 6.96002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  tech: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  business: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 12H16L14 15H10L8 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11V5.11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
};
// Networks data
const networks = [{
  title: 'Female Fusion Network',
  organization: 'Private',
  region: 'Dubai',
  description: 'Peer learning and networking community for women-led SMEs.',
  link: '#',
  icon: 'network'
}, {
  title: 'Women in Tech UAE',
  organization: 'Industry',
  region: 'Nationwide',
  description: 'Support network for women in technology sectors across the Emirates.',
  link: '#',
  icon: 'tech'
}, {
  title: 'Abu Dhabi Business Women Council',
  organization: 'Government',
  region: 'Abu Dhabi',
  description: 'Empowering women entrepreneurs through mentorship and networking.',
  link: '#',
  icon: 'government'
}, {
  title: 'Dubai Business Women Council',
  organization: 'Government',
  region: 'Dubai',
  description: "Supporting women's participation in the private sector.",
  link: '#',
  icon: 'government'
}, {
  title: 'Sharjah Business Women Council',
  organization: 'Government',
  region: 'Sharjah',
  description: 'Providing resources for women entrepreneurs in Sharjah.',
  link: '#',
  icon: 'government'
}];
// Hubs data
const hubs = [{
  title: 'Hub71',
  organization: 'Abu Dhabi',
  region: 'Abu Dhabi',
  description: 'Global tech ecosystem offering incentive programs for startups.',
  link: '#',
  icon: 'hub'
}, {
  title: 'Sheraa',
  organization: 'Sharjah',
  region: 'Sharjah',
  description: 'Entrepreneurship center supporting innovative startups.',
  link: '#',
  icon: 'hub'
}, {
  title: 'In5',
  organization: 'Dubai',
  region: 'Dubai',
  description: 'Enabling entrepreneurs to develop their ideas into innovative businesses.',
  link: '#',
  icon: 'hub'
}, {
  title: 'startAD',
  organization: 'Abu Dhabi',
  region: 'Abu Dhabi',
  description: 'NYU Abu Dhabi-based incubator for early-stage startups.',
  link: '#',
  icon: 'hub'
}, {
  title: 'TwoFour54',
  organization: 'Abu Dhabi',
  region: 'Abu Dhabi',
  description: 'Media free zone and creative ecosystem for content creators.',
  link: '#',
  icon: 'hub'
}];
const ProgramsAndPartners: React.FC<ProgramsAndPartnersProps> = ({
  programs,
  partners
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const sections: SimpleSection[] = [{
    id: 'programs',
    title: 'Programs'
  }, {
    id: 'councils',
    title: 'Councils & Enablers'
  }, {
    id: 'networks',
    title: 'Networks & Hubs'
  }];
  // Get content based on active tab
  const getActiveContent = () => {
    switch (activeTabIndex) {
      case 0:
        return programs.map(item => ({
          ...item,
          icon: 'business'
        }));
      case 1:
        return partners.slice(0, 6).map(item => ({
          title: item.title,
          organization: 'Partner',
          region: 'UAE',
          description: item.description,
          link: item.link,
          icon: 'government'
        }));
      case 2:
        return activeTabIndex === 2 && activeSubTab === 'networks' ? networks : hubs;
      default:
        return programs;
    }
  };
  const [activeSubTab, setActiveSubTab] = useState('networks');
  const activeContent = getActiveContent();
  // Check scroll position
  const checkScroll = () => {
    if (!cardsContainerRef.current) return;
    const {
      scrollLeft,
      scrollWidth,
      clientWidth
    } = cardsContainerRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
  };
  // Handle scroll buttons
  const handleScroll = (direction: 'left' | 'right') => {
    if (!cardsContainerRef.current) return;
    const scrollAmount = 320; // Approximate width of two cards
    const currentScroll = cardsContainerRef.current.scrollLeft;
    cardsContainerRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
    // Update scroll buttons after animation
    setTimeout(checkScroll, 400);
  };
  // UAE-inspired pattern for background
  const UAEPattern = () => <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full">
        <svg width="100%" height="100%" className="opacity-10">
          <defs>
            <pattern id="uaePattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 0L60 0L30 52L0 0Z" fill="none" stroke="#E8AA33" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#uaePattern)" />
        </svg>
      </div>
    </div>;
  return <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-amber-50/50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Programs & Partners <span className="text-primary">Empowering</span>{' '}
            Women Entrepreneurs
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the organizations and initiatives dedicated to supporting
            women-led businesses across the UAE.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
          {/* UAE-inspired pattern background */}
          <UAEPattern />
          <div className="p-6 relative z-10">
            <TabsSimple sections={sections} activeTabIndex={activeTabIndex} onTabChange={index => {
            setActiveTabIndex(index);
            // Reset scroll position when changing tabs
            if (cardsContainerRef.current) {
              cardsContainerRef.current.scrollLeft = 0;
            }
            // Reset sub-tab when changing main tab
            if (index === 2) {
              setActiveSubTab('networks');
            }
          }} />
            {/* Sub-tabs for Networks & Hubs */}
            {activeTabIndex === 2 && <div className="mt-4 mb-2 flex justify-center gap-4">
                <button onClick={() => setActiveSubTab('networks')} className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${activeSubTab === 'networks' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  Networks
                </button>
                <button onClick={() => setActiveSubTab('hubs')} className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${activeSubTab === 'hubs' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  Innovation Hubs
                </button>
              </div>}
            <div className="mt-8 relative">
              {/* Scroll controls */}
              {showLeftScroll && <motion.button initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-lg p-2 -ml-3" onClick={() => handleScroll('left')}>
                  <ChevronLeftIcon size={20} className="text-primary" />
                </motion.button>}
              {showRightScroll && <motion.button initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-lg p-2 -mr-3" onClick={() => handleScroll('right')}>
                  <ChevronRightIcon size={20} className="text-primary" />
                </motion.button>}
              {/* Horizontal scrollable card container */}
              <div ref={cardsContainerRef} className="flex overflow-x-auto py-6 px-4 gap-5 hide-scrollbar" onScroll={() => checkScroll()}>
                <AnimatePresence mode="wait">
                  {activeContent.map((item, index) => <motion.div key={item.title} className="flex-shrink-0 w-72 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100" initial={{
                  opacity: 0,
                  scale: 0.95
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} transition={{
                  duration: 0.3,
                  delay: index * 0.05
                }} whileHover={{
                  scale: 1.03,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                }}>
                      <div className="p-5">
                        <div className="mb-4 flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                            {icons[item.icon]}
                          </div>
                          <div>
                            <h3 className="font-display text-lg font-bold truncate" title={item.title}>
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {item.organization}
                              </span>
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                {item.region}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 h-12 line-clamp-2">
                          {item.description}
                        </p>
                        <a href={item.link} className="inline-flex items-center text-primary font-medium text-sm hover:underline">
                          Learn More
                          <ExternalLinkIcon size={14} className="ml-1" />
                        </a>
                      </div>
                    </motion.div>)}
                </AnimatePresence>
              </div>
              {/* Connection lines between cards - decorative element */}
              <div className="absolute inset-0 pointer-events-none">
                <svg width="100%" height="100%" className="opacity-10">
                  <defs>
                    <pattern id="connectionGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E8AA33" strokeWidth="0.5" strokeDasharray="2,2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#connectionGrid)" />
                </svg>
              </div>
            </div>
            {/* View all button */}
            <div className="mt-8 text-center">
              <motion.button className="px-6 py-2 bg-white border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-all" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                View All {sections[activeTabIndex].title}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ProgramsAndPartners;