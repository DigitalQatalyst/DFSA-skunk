import React, { useState, useRef, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, ExternalLink } from 'lucide-react';
import { MediaCard } from '../Cards/MediaCard';
import { supabase } from '../../services/supabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';

interface Program {
  id: string;
  title: string;
  provider: string;
  emirate: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaLink: string;
  keyInitiatives: string[];
}

// Updated featured programs data with UAE-specific content
const featuredPrograms: Program[] = [{
  id: 'program1',
  title: 'NAMA Growth Lab',
  provider: 'NAMA Women Advancement',
  emirate: 'Sharjah',
  description: 'Incubator program focused on women-led social enterprises addressing UAE community challenges.',
  image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1374&auto=format&fit=crop',
  ctaLabel: 'Learn More',
  ctaLink: '#apply',
  keyInitiatives: ['Social Enterprise Incubation', 'Seed Funding for Community Solutions', 'Mentorship from Industry Leaders']
}, {
  id: 'program2',
  title: 'Creative Entrepreneurs Network',
  provider: 'Dubai Culture',
  emirate: 'Dubai',
  description: 'Supporting women in creative industries through mentorship and global exposure.',
  image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1374&auto=format&fit=crop',
  ctaLabel: 'Learn More',
  ctaLink: '#apply',
  keyInitiatives: ['Creative Industry Workshops', 'International Exhibition Opportunities', 'Networking with Global Creatives']
}, {
  id: 'program3',
  title: 'SheTech Accelerator',
  provider: 'Hub71',
  emirate: 'Abu Dhabi',
  description: 'Empowering female-led startups in AI, fintech, and sustainability.',
  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&auto=format&fit=crop',
  ctaLabel: 'Learn More',
  ctaLink: '#apply',
  keyInitiatives: ['Startup Acceleration Program', 'Tech Venture Investment', 'Global Market Access Support']
}, {
  id: 'program4',
  title: 'Female Founders Academy',
  provider: 'Khalifa Fund',
  emirate: 'Nationwide',
  description: 'Entrepreneurship readiness and scaling program for UAE women innovators.',
  image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1470&auto=format&fit=crop',
  ctaLabel: 'Learn More',
  ctaLink: '#apply',
  keyInitiatives: ['Business Plan Development', 'Leadership Training', 'Funding Preparation']
}, {
  id: 'program5',
  title: 'Women in FinTech Fellowship',
  provider: 'DIFC FinTech Hive',
  emirate: 'Dubai',
  description: 'Mentorship and funding program for women-led financial technology startups and scale-ups.',
  image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1470&auto=format&fit=crop',
  ctaLabel: 'Learn More',
  ctaLink: '#apply',
  keyInitiatives: ['FinTech Mentorship Program', 'Investor Networking Events', 'Regulatory Sandbox Access']
}, {
  id: 'program6',
  title: 'Agritech Innovation Program',
  provider: 'Al Ain University',
  emirate: 'Al Ain',
  description: 'Specialized program for women entrepreneurs developing sustainable agriculture solutions.',
  image: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=1470&auto=format&fit=crop',
  ctaLabel: 'Learn More',
  ctaLink: '#apply',
  keyInitiatives: ['Sustainable Farming Innovation', 'AgTech Research Grants', 'Food Security Solutions Development']
}];

const ProgramsInitiatives: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [programs, setPrograms] = useState<Program[]>(featuredPrograms);
  const [visiblePrograms, setVisiblePrograms] = useState<Program[]>(featuredPrograms.slice(0, 3));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load programs from Supabase
  useEffect(() => {
    const loadPrograms = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch from events table
        const { data: eventsData, error: eventsError } = await supabase
          .from('media_items')
          .select('*, events(*)')
          .eq('status', 'Published')
          .eq('visibility', 'Public')
          .not('events', 'is', null)
          .order('published_at', { ascending: false })
          .limit(10);

        if (eventsError) throw eventsError;

        // Map Supabase data to program format
        const mappedPrograms = (eventsData || []).map((item: any, index: number) => ({
          id: item.id || `program-${index}`,
          title: item.title || 'Untitled Program',
          provider: item.tags?.[0] || 'UAE Government',
          emirate: item.tags?.[1] || 'Nationwide',
          description: item.summary || item.seo_description || '',
          image: item.thumbnail_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1374&auto=format&fit=crop',
          ctaLabel: 'Learn More',
          ctaLink: item.canonical_url || '#apply',
          keyInitiatives: Array.isArray(item.tags) ? item.tags.slice(2, 5) : []
        }));

        const finalPrograms = mappedPrograms.length > 0 ? mappedPrograms : featuredPrograms;
        setPrograms(finalPrograms);
        setVisiblePrograms(finalPrograms.slice(0, 3));
      } catch (e) {
        console.error('Failed to load programs from Supabase:', e);
        setError('Failed to load programs');
        // Fallback to mock data
        setPrograms(featuredPrograms);
        setVisiblePrograms(featuredPrograms.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };
    loadPrograms();
  }, []);

  // Handle navigation
  const handleNext = () => {
    const nextIndex = Math.min(activeIndex + 1, programs.length - 3);
    setActiveIndex(nextIndex);
    setVisiblePrograms(programs.slice(nextIndex, nextIndex + 3));
  };

  const handlePrev = () => {
    const prevIndex = Math.max(activeIndex - 1, 0);
    setActiveIndex(prevIndex);
    setVisiblePrograms(programs.slice(prevIndex, prevIndex + 3));
  };

  // Handle dot navigation
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setVisiblePrograms(programs.slice(index, index + 3));
  };

  const handleLearnMore = (program: any) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const handleModalChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedProgram(null);
    }
  };

  return (
    <>
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 font-display">
            Featured Women Entrepreneurship Programs
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover flagship programs and partnerships empowering women
            founders across the UAE.
          </p>
        </div>
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading programs...</p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {/* Programs Carousel */}
        {!isLoading && (
          <>
            <div className="relative mt-8">
              {/* Navigation buttons */}
              <button onClick={handlePrev} className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 p-2.5 rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-all duration-300 ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} aria-label="Previous programs" disabled={activeIndex === 0}>
                <ChevronLeftIcon size={24} />
              </button>
              <button onClick={handleNext} className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 p-2.5 rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-all duration-300 ${activeIndex >= programs.length - 3 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} aria-label="Next programs" disabled={activeIndex >= programs.length - 3}>
                <ChevronRightIcon size={24} />
              </button>
              <div className="px-10" ref={carouselRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visiblePrograms.map(program => (
                    <div key={program.id} className="flex h-full">
                      <MediaCard
                        type="report"
                        title={program.title}
                        description={`${program.provider} | ${program.emirate} - ${program.description}`}
                        image={program.image}
                        badges={program.keyInitiatives}
                        cta={{
                          label: program.ctaLabel || 'Learn More',
                          href: program.ctaLink || '#'
                        }}
                        onClick={() => handleLearnMore(program)}
                        data-id={`program-card-${program.id}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <div className="flex gap-1.5">
                {Array.from({
                length: Math.max(1, programs.length - 2)
              }).map((_, index) => <button key={index} onClick={() => handleDotClick(index)} className={`w-2 h-2 rounded-full ${activeIndex === index ? 'bg-primary' : 'bg-gray-300'} transition-all duration-300`} aria-label={`Go to slide ${index + 1}`} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
    <Dialog open={isModalOpen} onOpenChange={handleModalChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {selectedProgram && (
          <>
            {selectedProgram.image && (
              <div className="-mx-6 -mt-6 mb-6 h-48 overflow-hidden rounded-t-xl">
                <img
                  src={selectedProgram.image}
                  alt={selectedProgram.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <DialogHeader>
              <DialogTitle>{selectedProgram.title}</DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                {selectedProgram.provider}
                {selectedProgram.emirate ? ` • ${selectedProgram.emirate}` : ''}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {selectedProgram.description && (
                <p className="text-gray-700 leading-relaxed">
                  {selectedProgram.description}
                </p>
              )}
              {Array.isArray(selectedProgram.keyInitiatives) && selectedProgram.keyInitiatives.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Initiatives</h4>
                  <ul className="space-y-2 text-gray-700 list-disc pl-5">
                    {selectedProgram.keyInitiatives.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3">
              <button
                onClick={() => handleModalChange(false)}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedProgram.ctaLink && selectedProgram.ctaLink !== '#' && (
                <a
                  href={selectedProgram.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors"
                >
                  <ExternalLink size={16} />
                  Visit Program
                </a>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};
export default ProgramsInitiatives;