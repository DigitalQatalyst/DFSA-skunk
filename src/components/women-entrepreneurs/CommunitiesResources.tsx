import React, { useEffect, useState, useRef, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabsSimple, SimpleSection } from '../TabsVariations';
import { ExternalLinkIcon, ChevronRightIcon, ChevronLeftIcon, MapPinIcon, UsersIcon, ShoppingBagIcon, CpuIcon, PaletteIcon, BuildingIcon, NetworkIcon, GraduationCapIcon, BookOpenIcon, BriefcaseIcon, BarChartIcon, StarIcon, FileTextIcon, GlobeIcon, DollarSignIcon, LightbulbIcon, ScaleIcon, RocketIcon, PresentationIcon, ShoppingCartIcon, LeafIcon, CodeIcon, ImageIcon } from 'lucide-react';
// Import the JSON data
import connectLearnGrowData from '../../data/womenEntrepreneurs/connectLearnGrow.json';
interface ConnectLearnGrowItem {
  id: number;
  title: string;
  description: string;
  emirate: string;
  icon: string;
  link: string;
  womenFocused: boolean;
}
interface CommunitiesResourcesProps {
  selectedEmirate?: string | null;
}
const getIconComponent = (iconName: string, className = '') => {
  const iconProps = {
    className,
    size: 20
  };
  switch (iconName) {
    case 'Users':
      return <UsersIcon {...iconProps} />;
    case 'ShoppingBag':
      return <ShoppingBagIcon {...iconProps} />;
    case 'Cpu':
      return <CpuIcon {...iconProps} />;
    case 'Palette':
      return <PaletteIcon {...iconProps} />;
    case 'Building':
      return <BuildingIcon {...iconProps} />;
    case 'Network':
      return <NetworkIcon {...iconProps} />;
    case 'GraduationCap':
      return <GraduationCapIcon {...iconProps} />;
    case 'BookOpen':
      return <BookOpenIcon {...iconProps} />;
    case 'Briefcase':
      return <BriefcaseIcon {...iconProps} />;
    case 'BarChart':
      return <BarChartIcon {...iconProps} />;
    case 'Star':
      return <StarIcon {...iconProps} />;
    case 'FileText':
      return <FileTextIcon {...iconProps} />;
    case 'Globe':
      return <GlobeIcon {...iconProps} />;
    case 'DollarSign':
      return <DollarSignIcon {...iconProps} />;
    case 'Lightbulb':
      return <LightbulbIcon {...iconProps} />;
    case 'Scale':
      return <ScaleIcon {...iconProps} />;
    case 'Rocket':
      return <RocketIcon {...iconProps} />;
    case 'Presentation':
      return <PresentationIcon {...iconProps} />;
    case 'ShoppingCart':
      return <ShoppingCartIcon {...iconProps} />;
    case 'Leaf':
      return <LeafIcon {...iconProps} />;
    case 'Code':
      return <CodeIcon {...iconProps} />;
    case 'Image':
      return <ImageIcon {...iconProps} />;
    default:
      return <MapPinIcon {...iconProps} />;
  }
};
// Get emirate color based on name
const getEmirateColor = (emirate: string) => {
  switch (emirate) {
    case 'Abu Dhabi':
      return 'bg-primary text-white';
    case 'Dubai':
      return 'bg-teal text-white';
    case 'Sharjah':
      return 'bg-purple text-white';
    case 'Ajman':
      return 'bg-primary-light text-primary-dark';
    case 'Umm Al Quwain':
      return 'bg-teal-light text-teal-dark';
    case 'Ras Al Khaimah':
      return 'bg-purple-light text-purple-dark';
    case 'Fujairah':
      return 'bg-amber-100 text-amber-900';
    case 'Nationwide':
      return 'bg-amber-300 text-amber-900';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
const CommunitiesResources: React.FC<CommunitiesResourcesProps> = ({
  selectedEmirate
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  // Convert the data to the format expected by TabsSimple
  const sections: SimpleSection[] = connectLearnGrowData.tabs.map(tab => ({
    id: tab.id,
    title: tab.title
  }));
  // Filter items based on selected emirate
  const getFilteredItems = () => {
    const items = connectLearnGrowData.tabs[activeTabIndex]?.items || [];
    if (selectedEmirate) {
      return items.filter(item => item.emirate === selectedEmirate || item.emirate === 'Nationwide');
    }
    return items;
  };
  // Get the current active items based on the active tab and selected emirate
  const activeItems = getFilteredItems();
  // Handle scroll position checks
  useEffect(() => {
    checkScroll();
  }, [activeTabIndex, selectedEmirate]);
  const checkScroll = () => {
    if (!cardsContainerRef.current) return;
    const {
      scrollLeft,
      scrollWidth,
      clientWidth
    } = cardsContainerRef.current;
    setScrollPosition(scrollLeft);
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
  };
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
  // UAE skyline SVG for the background
  const SkylineBackground = () => <div className="absolute bottom-0 left-0 right-0 h-24 opacity-10 overflow-hidden">
      <svg viewBox="0 0 1440 120" fill="currentColor" className="text-primary w-full h-full">
        <path d="M0,120 L0,90 L30,90 L30,80 L60,80 L60,70 L90,70 L90,80 L120,80 L120,60 L150,60 L150,50 L180,50 L180,70 L210,70 L210,80 L240,80 L240,60 L270,60 L270,40 L300,40 L300,50 L330,50 L330,40 L360,40 L360,20 L390,20 L390,40 L420,40 L420,30 L450,30 L450,20 L480,20 L480,10 L510,10 L510,0 L540,0 L540,10 L570,10 L570,20 L600,20 L600,30 L630,30 L630,40 L660,40 L660,30 L690,30 L690,20 L720,20 L720,10 L750,10 L750,20 L780,20 L780,10 L810,10 L810,30 L840,30 L840,50 L870,50 L870,60 L900,60 L900,70 L930,70 L930,80 L960,80 L960,70 L990,70 L990,50 L1020,50 L1020,40 L1050,40 L1050,50 L1080,50 L1080,60 L1110,60 L1110,40 L1140,40 L1140,30 L1170,30 L1170,40 L1200,40 L1200,50 L1230,50 L1230,60 L1260,60 L1260,50 L1290,50 L1290,40 L1320,40 L1320,30 L1350,30 L1350,20 L1380,20 L1380,10 L1410,10 L1410,20 L1440,20 L1440,120 Z" />
      </svg>
    </div>;
  // Map dots background pattern
  const MapDotsPattern = () => <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
      {Array.from({
      length: 20
    }).map((_, i) => <div key={i} className="absolute w-1 h-1 rounded-full bg-primary" style={{
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`
    }} />)}
      {Array.from({
      length: 10
    }).map((_, i) => <div key={`line-${i}`} className="absolute border-dashed border-primary" style={{
      width: `${Math.random() * 150 + 50}px`,
      height: '1px',
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      borderTopWidth: '1px',
      transform: `rotate(${Math.random() * 360}deg)`
    }} />)}
    </div>;
  return <section id="connect-learn-grow" className="py-20 px-6 md:px-12 bg-gradient-to-b from-amber-50/30 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Connect · Learn · <span className="text-amber-500">Grow</span>
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Discover communities, resources, and programs that help women-led
            ventures scale from the UAE to the world.
          </p>
          {/* Display the selected emirate if any */}
          {selectedEmirate && <motion.div initial={{
          opacity: 0,
          y: -10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="inline-block mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getEmirateColor(selectedEmirate)}`}>
                Showing resources in {selectedEmirate}
                <button className="ml-2 hover:underline" onClick={() => window.location.hash = 'connect-learn-grow'}>
                  (Clear)
                </button>
              </span>
            </motion.div>}
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
          {/* UAE skyline background */}
          <SkylineBackground />
          {/* Map dots pattern */}
          <MapDotsPattern />
          <div className="p-6 relative z-10">
            <TabsSimple sections={sections} activeTabIndex={activeTabIndex} onTabChange={index => {
            setActiveTabIndex(index);
            // Reset scroll position when changing tabs
            if (cardsContainerRef.current) {
              cardsContainerRef.current.scrollLeft = 0;
            }
          }} />
            <div className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div key={activeTabIndex} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: -20
              }} transition={{
                duration: 0.4
              }} className="relative">
                  {/* Tab background with UAE-inspired styling */}
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-gray-50 rounded-lg -z-10"></div>
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
                  {activeItems.length === 0 ? <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                        <MapPinIcon className="text-amber-500" size={32} />
                      </div>
                      <h3 className="text-lg font-bold mb-2">
                        No resources found
                      </h3>
                      <p className="text-gray-600 text-center max-w-md">
                        {selectedEmirate ? `We couldn't find any ${sections[activeTabIndex].title.toLowerCase()} in ${selectedEmirate} at this time.` : `No ${sections[activeTabIndex].title.toLowerCase()} available.`}
                      </p>
                    </div> : <div ref={cardsContainerRef} className="flex overflow-x-auto py-6 px-4 gap-4 hide-scrollbar" onScroll={() => checkScroll()}>
                      {activeItems.map((item: ConnectLearnGrowItem) => <motion.div key={item.id} className={`flex-shrink-0 w-64 bg-white rounded-lg shadow-sm overflow-hidden 
                            ${item.womenFocused ? 'ring-2 ring-amber-300' : 'border border-gray-100'}`} initial={{
                    opacity: 0,
                    scale: 0.95
                  }} animate={{
                    opacity: 1,
                    scale: 1
                  }} transition={{
                    duration: 0.3,
                    delay: item.id * 0.05
                  }} whileHover={{
                    scale: 1.03,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                  }}>
                          <div className="relative">
                            {/* Emirate badge */}
                            <div className={`absolute top-3 right-3 z-10 text-xs px-2 py-1 rounded-full ${getEmirateColor(item.emirate)}`}>
                              {item.emirate}
                            </div>
                            {/* Women-focused badge */}
                            {item.womenFocused && <div className="absolute top-3 left-3 z-10 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                                Women-Focused
                              </div>}
                            {/* Card content */}
                            <div className="p-5">
                              <div className="mb-3 flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${item.womenFocused ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                                  {getIconComponent(item.icon)}
                                </div>
                                <h3 className="font-display text-lg font-bold truncate" title={item.title}>
                                  {item.title}
                                </h3>
                              </div>
                              <p className="text-gray-600 text-sm mb-4 h-12 line-clamp-2">
                                {item.description}
                              </p>
                              <a href={item.link} className="inline-flex items-center text-primary font-medium text-sm hover:underline">
                                Learn More
                                <ExternalLinkIcon size={14} className="ml-1" />
                              </a>
                            </div>
                          </div>
                        </motion.div>)}
                    </div>}
                  {/* Connection lines between cards - decorative element */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg width="100%" height="100%" className="opacity-10">
                      <defs>
                        <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#0030E3" strokeWidth="0.5" strokeDasharray="2,2" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#mapGrid)" />
                    </svg>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* View all button */}
            <div className="mt-8 text-center">
              <motion.button className="px-6 py-2 bg-white border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-all" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                View All {connectLearnGrowData.tabs[activeTabIndex]?.title}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CommunitiesResources;