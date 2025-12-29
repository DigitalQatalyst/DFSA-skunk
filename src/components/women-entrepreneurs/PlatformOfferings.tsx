import React, { useEffect, useState, useRef } from 'react';
import { TabsSimple } from '../TabVariations';
import { resourcesData, mentorshipData, specializedServicesData } from '../../services/womenEcosystemData';
import { ExternalLinkIcon, BookOpenIcon, UsersIcon, SettingsIcon, ChevronLeftIcon, ChevronRightIcon, CalendarIcon, UserCheckIcon, ClockIcon, MapPinIcon, DollarSignIcon } from 'lucide-react';
import { MediaCard, CommunityCard, ServiceCard } from '../KF eJP Library/Cards';
import PlatformFeaturesModal from './PlatformFeaturesModal';
import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS, GET_ALL_EVENTS } from '../../services/marketplaceQueries';
import { supabase } from '../../supabase/client';
import { useNavigate } from 'react-router-dom';
import { KnowledgeHubCard } from '../marketplace/KnowledgeHubCard';
import { MarketplaceCard } from '../marketplace/MarketplaceCard';
import { getSupabaseKnowledgeHub } from '../../lib/supabase';

// Define the platform offerings categories
const platformCategories = [{
  id: 'communities',
  title: 'Communities'
}, {
  id: 'resources',
  title: 'Resources'
}, {
  id: 'services',
  title: 'Services'
}, {
  id: 'events',
  title: 'Events & Workshops'
}, 
// {
//   id: 'mentorship',
//   title: 'Mentorship'
// }
];
// Icon mapping for categories
const categoryIcons = {
  Communities: UsersIcon,
  Resources: BookOpenIcon,
  Services: SettingsIcon,
  'Events & Workshops': CalendarIcon,
  Mentorship: UserCheckIcon
};
// Type mapping for MediaCard
const typeMapping: Record<string, string> = {
  Communities: 'case-study',
  Resources: 'toolkit',
  Services: 'tool',
  'Events & Workshops': 'event',
  Mentorship: 'tool'
};
const PlatformOfferings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [errorServices, setErrorServices] = useState<string | null>(null);
  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);
  const [errorCommunities, setErrorCommunities] = useState<string | null>(null);
  const [knowledgeItems, setKnowledgeItems] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const { data: productsData, loading: productsLoading, error: productsError } = useQuery<{ products: { items: any[] } }>(GET_PRODUCTS);
  const { data: eventsQueryData, loading: eventsLoading, error: eventsError } = useQuery<{ products: { items: any[] } }>(GET_ALL_EVENTS);

  useEffect(() => {
    setIsLoadingServices(productsLoading);
    if (productsError) {
      setErrorServices('Failed to load services');
      return;
    }

    if (!productsLoading && productsData?.products?.items) {
      try {
        const filtered = (productsData.products.items || []).filter((product: any) => {
          const val = product?.customFields?.EmpowermentandLeadership;
          if (!val) return false;
          if (Array.isArray(val)) {
            return val.some((v: any) => String(v).trim().toLowerCase() === 'women-led enterprises');
          }
          return String(val).trim().toLowerCase() === 'women-led enterprises';
        });

        const fallbackLogos = ['/mzn_logo.png'];
        const mapped = filtered.map((product: any) => {
          const randomFallbackLogo = fallbackLogos[Math.floor(Math.random() * fallbackLogos.length)];
          const rawFormUrl = product?.customFields?.formUrl;
          const finalFormUrl = rawFormUrl || 'https://www.tamm.abudhabi/en/login';
          return {
            id: product.id,
            type: 'services',
            title: product.name,
            organization: product?.customFields?.Industry || 'Khalifa Fund',
            description:
              product.description ||
              'Through this service, you can easily reallocate your approved loan funds to different areas of your business to support changing needs and enhance growth.',
            category: product?.customFields?.BusinessStage || product?.customFields?.Industry || 'Support',
            link: finalFormUrl,
            providerLogoUrl: randomFallbackLogo,
          };
        });

        const uniqueById = Array.from(new Map(mapped.map((item: any) => [String(item.id), item])).values());
        setServices(uniqueById);
        setErrorServices(null);
      } catch (e) {
        console.error('Failed to process services from GraphQL:', e);
        setErrorServices('Failed to load services');
      }
    }
  }, [productsData, productsLoading, productsError]);

  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoadingCommunities(true);
      setErrorCommunities(null);
      try {
        const { data, error } = await supabase
          .from('communities_with_counts')
          .select('*')
          .order('member_count', { ascending: false });
        if (error) throw error;
        const categories = ['Technology', 'Business', 'Creative', 'Social', 'Education'];
        const hash = (s: string) => {
          let h = 0;
          for (let i = 0; i < s.length; i++) {
            h = ((h << 5) - h) + s.charCodeAt(i);
            h = h | 0;
          }
          return Math.abs(h);
        };
        const enhanced = (data || []).map((c: any) => {
          const idStr = String(c.id || '');
          const count = c.member_count || 0;
          const h = hash(idStr);
          const category = categories[h % categories.length];
          const activityLevel: 'low' | 'medium' | 'high' = count > 50 ? 'high' : count > 10 ? 'medium' : 'low';
          const factor = 0.6 + ((h % 10000) / 10000) * 0.3;
          const activeMembers = Math.floor(count * factor);
          const isPrivate = (h % 10) > 6;
          const tags = ['Abu Dhabi', category, activityLevel === 'high' ? 'Popular' : 'Growing'];
          return { ...c, category, tags, isPrivate, activeMembers, activityLevel };
        });
        setCommunities(enhanced);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setErrorCommunities('Failed to load communities');
      } finally {
        setIsLoadingCommunities(false);
      }
    };
    fetchCommunities();
  }, []);

  // Load Knowledge Hub resources for the Resources tab (same source as /marketplace/knowledge-hub)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const supabase = getSupabaseKnowledgeHub();
        const { data, error } = await supabase
          .from('v_media_public')
          .select('*')
          .eq('visibility', 'Public')
          .eq('status', 'Published')
          .order('published_at', { ascending: false })
          .order('id', { ascending: false })
          .limit(12);
        if (error) throw error;
        const rows = data || [];
        const stripHtml = (html: string): string => {
          try {
            const tmp = document.createElement('div');
            tmp.innerHTML = String(html || '');
            return (tmp.textContent || tmp.innerText || '')
              .replace(/\s+/g, ' ')
              .trim();
          } catch {
            return String(html || '')
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
          }
        };
        const mapped = rows.map((row: any) => ({
          id: String(row.id),
          title: row.title,
          description: stripHtml((row as any).summary || (row as any).body_html || (row as any).article_body_html || ''),
          mediaType: row.type || undefined,
          domain: (row as any).domain || null,
          businessStage: (row as any).business_stage || null,
          format: (row as any).format || null,
          popularity: (row as any).popularity || null,
          provider: {
            name: (row as any).provider_name || 'Knowledge Hub',
            logoUrl: (row as any).provider_logo_url || null,
          },
          primaryAuthor: (row as any).primary_author_name
            ? {
                name: (row as any).primary_author_name,
                slug: (row as any).primary_author_slug || null,
                photoUrl: (row as any).primary_author_photo_url || null,
              }
            : null,
          authors: Array.isArray((row as any).authors) ? (row as any).authors : [],
          authorsCount: (row as any).authors_count ?? undefined,
          authorSlugs: Array.isArray((row as any).author_slugs) ? (row as any).author_slugs : undefined,
          imageUrl: (row as any).thumbnail_url || (row as any).image_url || undefined,
          downloadUrl: (row as any).report_document_url || (row as any).tool_document_url || undefined,
          tags: (row as any).tags || [],
          date: (row as any).published_at,
          lastUpdated: (row as any).updated_at,
        }));
        if (mounted) setKnowledgeItems(mapped);
      } catch (e) {
        console.warn('Failed to load knowledge hub items', e);
        if (mounted) setKnowledgeItems([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load Events for the Events & Workshops tab using same logic as /marketplace/events
  useEffect(() => {
    try {
      if (eventsLoading || eventsError) return;
      const items = eventsQueryData?.products?.items || [];
      // Filter products belonging to Events marketplace (facet value id "25")
      const rawEvents = items.filter((product: any) =>
        (product?.facetValues || []).some((fv: any) => fv?.id === '25')
      );

      const mapped = rawEvents.map((event: any) => {
        const cf = event?.customFields || {};

        // Format event start date for display (matches Marketplace mapping)
        let eventDateFormatted = '';
        if (cf.eventStartDate) {
          try {
            const d = new Date(cf.eventStartDate);
            if (!isNaN(d.getTime())) {
              eventDateFormatted = d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
            }
          } catch {
            eventDateFormatted = cf.eventStartDate || '';
          }
        }

        const getFacetValue = (facetCode: string) => {
          const fv = (event?.facetValues || []).find((f: any) => f?.facet?.code === facetCode);
          return fv ? fv.name : null;
        };

        // Derive simple price label from cost-type facet when available
        const costType = getFacetValue('cost-type');
        const tickets = String(cf.eventTickets || '').toLowerCase();
        const price = costType || (tickets.includes('free') ? 'Free' : (tickets ? 'Ticketed' : ''));

        return {
          id: event.id,
          title: event.name,
          description: event.description,
          type: cf.eventType || getFacetValue('event-type') || 'Event',
          date: eventDateFormatted,
          time: cf.eventTime || '',
          location: cf.eventLocation || '',
          organizer: cf.organiser || 'Event Organizer',
          capacity: cf.capacity || '',
          price,
          // Align with MarketplaceCard expectations for provider structure
          provider: {
            name: cf.organiser || 'Event Organizer',
            logoUrl: undefined,
            description: ''
          },
        };
      });

      const uniqueMapped = Array.from(new Map(mapped.map((it: any) => [String(it.id), it])).values());
      setEvents(uniqueMapped);
    } catch (e) {
      console.error('Failed to process events from GraphQL:', e);
      setEvents([]);
    }
  }, [eventsQueryData, eventsLoading, eventsError]);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    // Handle mouse movement for dynamic background
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const tabSections = platformCategories.map(category => ({
    id: category.id,
    title: category.title
  }));
  const activeCategory = platformCategories[activeTabIndex].id;

  // Get filtered data based on active category
  const getFilteredData = () => {
    switch (activeCategory) {
      case 'communities':
        return communities;
      case 'resources':
        return knowledgeItems;
      case 'services':
        return services;
      case 'events':
        return events;
      case 'mentorship':
        return mentorshipData;
      default:
        return [];
    }
  };

  const filteredData = getFilteredData();

  // Check scroll position to show/hide scroll buttons
  const checkScrollPosition = () => {
    if (!carouselRef.current) return;
    const {
      scrollLeft,
      scrollWidth,
      clientWidth
    } = carouselRef.current;
    setShowLeftScroll(scrollLeft > 20);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 20);
  };
  // Handle scroll buttons
  const handleScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      return () => carousel.removeEventListener('scroll', checkScrollPosition);
    }
  }, [filteredData]);
  // Reset scroll position when category changes
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
      checkScrollPosition();
    }
  }, [activeTabIndex]);
  // Calculate background position based on mouse movement
  const bgPositionX = 50 + (mousePosition.x - 0.5) * 10;
  const bgPositionY = 50 + (mousePosition.y - 0.5) * 10;
  // Enhanced descriptions for resources to make them more full
  const getEnhancedDescription = (resource: any) => {
    const baseDescription = resource.description;
    const organization = resource.organization;
    // Add more context based on resource type
    switch (resource.type.toLowerCase()) {
      case 'communities':
        return `${baseDescription} Connect with like-minded entrepreneurs and industry experts to share knowledge, experiences, and opportunities through ${organization}.`;
      case 'services':
        return `${baseDescription} This comprehensive service provided by ${organization} offers tailored solutions to help accelerate your business growth and overcome challenges.`;
      default:
        return `${organization} - ${baseDescription} Access valuable insights and practical tools designed to empower women entrepreneurs at every stage of their business journey.`;
    }
  };
  // Generate consistent member count based on item ID (hash function)
  const getConsistentMemberCount = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 500) + 100; // Returns a number between 100-599
  };
  // Map resource to appropriate card component
  const renderResourceCard = (item: any) => {
    // Handle different data structures based on category
    if (activeCategory === 'events') {
      return (
        <MarketplaceCard
          key={item.id}
          item={item}
          marketplaceType="events"
          isBookmarked={false}
          onToggleBookmark={() => {}}
          onAddToComparison={() => {}}
          onQuickView={() => {}}
        />
      );
    }
    
    if (activeCategory === 'mentorship') {
      return (
        <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full object-cover" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-primary font-medium text-sm">{item.title}</p>
              <p className="text-gray-500 text-sm">{item.experience}</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {item.expertise.map((skill: string, index: number) => (
              <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
          <div className="space-y-2 mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <MapPinIcon size={16} />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon size={16} />
              <span>{item.availability}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Languages: {item.languages.join(', ')}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <a href={item.linkedin} className="text-primary font-medium hover:text-primary-dark transition-colors text-sm">
              View Profile
            </a>
            <button 
              onClick={() => navigate('/coming-soon')}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Request Mentorship
            </button>
          </div>
        </div>
      );
    }
    
    // Handle original resource types
    const enhancedDescription = getEnhancedDescription(item);
    switch (item.type?.toLowerCase()) {
      case 'communities':
        return null;
      case 'services':
        return <ServiceCard key={item.id} item={{
          id: item.id,
          title: item.title,
          provider: item.organization,
          description: enhancedDescription,
          tags: [item.category, 'Support', 'Business Growth'],
          providerLogoUrl: item.providerLogoUrl || '/mzn_logo.png'
        }} onApply={() => window.open(item.link, '_blank')} onLearnMore={() => window.open(item.link, '_blank')} />;
      default:
        return (
          <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.organization}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-grow">{enhancedDescription}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{item.category}</span>
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Knowledge Resource</span>
            </div>
            <div className="flex justify-between items-center mt-auto">
              <a href={item.link} className="text-primary font-medium hover:text-primary-dark transition-colors text-sm">
                View Details
              </a>
              <button 
                onClick={() => window.open(item.link, '_blank')}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        );
    }
  };

  const renderKnowledgeItem = (item: any) => {
    return (
      <KnowledgeHubCard
        item={item}
        isBookmarked={false}
        onToggleBookmark={() => {}}
      />
    );
  };

  const renderCommunityCard = (community: any) => {
    const count = community.member_count || 0;
    const activityLevel: 'low' | 'medium' | 'high' = community.activityLevel || (count > 50 ? 'high' : count > 10 ? 'medium' : 'low');
    const activeMembers = community.activeMembers ?? count;
    const category = community.category || 'Business';
    const tags = Array.isArray(community.tags) && community.tags.length ? community.tags : ['Abu Dhabi', category, activityLevel === 'high' ? 'Popular' : 'Growing'];
    const isPrivate = !!community.isPrivate;
    const imageUrl = community.imageurl || 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

    return (
      <CommunityCard
        key={community.id}
        item={{
          id: community.id,
          name: community.name || 'Unnamed Community',
          description: community.description || 'No description available',
          memberCount: community.member_count,
          activeMembers,
          category,
          tags,
          imageUrl,
          isPrivate,
          activityLevel,
          recentActivity: `New discussion started in ${community.name}`,
        }}
        onJoin={() => navigate(`/community/${community.id}`)}
        onViewDetails={() => navigate(`/community/${community.id}`)}
        isMember={community.is_member === true}
      />
    );
  };

  return <section className="py-16 md:py-24 relative overflow-hidden" style={{
    background: `linear-gradient(135deg, rgba(0, 48, 227, 0.03) 0%, rgba(0, 229, 209, 0.05) 50%, rgba(149, 75, 249, 0.03) 100%)`,
    backgroundPosition: `${bgPositionX}% ${bgPositionY}%`,
    transition: 'background-position 0.5s ease-out'
  }}>
    {/* Dynamic background elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" style={{
        transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        transition: 'transform 0.8s ease-out'
      }}></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-teal/10 blur-3xl" style={{
        transform: `translate(${-mousePosition.x * 20}px, ${-mousePosition.y * 20}px)`,
        transition: 'transform 0.8s ease-out'
      }}></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple/10 blur-3xl" style={{
        transform: `translate(${mousePosition.y * 15}px, ${-mousePosition.x * 15}px)`,
        transition: 'transform 0.8s ease-out'
      }}></div>
    </div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 font-display">
            Discover What the Platform Offers
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Explore the communities you can join, the resources you can access,
            and the services you can apply for â€” all through the Enterprise
            Journey platform.
          </p>
        </div>
        {/* Custom styled tabs */}
        <div className="mb-10">
          <div className="flex justify-center mb-2">
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm border border-gray-100/50">
              {tabSections.map((section, index) => {
              const isActive = activeTabIndex === index;
              const CategoryIcon = categoryIcons[section.title as keyof typeof categoryIcons] || BookOpenIcon;
              return <button key={section.id} onClick={() => setActiveTabIndex(index)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`} aria-selected={isActive} role="tab">
                    <CategoryIcon size={18} />
                    <span className="font-medium">{section.title}</span>
                  </button>;
            })}
            </div>
          </div>
        </div>
        {/* Horizontal scrollable cards with scroll buttons */}
        <div className="relative">
          {/* Scroll buttons */}
          <button onClick={() => handleScroll('left')} className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2.5 rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-all ${showLeftScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-label="Scroll left">
            <ChevronLeftIcon size={24} />
          </button>
          <button onClick={() => handleScroll('right')} className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2.5 rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-all ${showRightScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-label="Scroll right">
            <ChevronRightIcon size={24} />
          </button>
          {/* Left fade gradient */}
          <div className={`absolute left-0 top-0 bottom-0 w-16 z-[1] bg-gradient-to-r from-[rgba(249,250,252,0.9)] to-transparent pointer-events-none transition-opacity duration-300 ${showLeftScroll ? 'opacity-100' : 'opacity-0'}`}></div>
          {/* Right fade gradient */}
          <div className={`absolute right-0 top-0 bottom-0 w-16 z-[1] bg-gradient-to-l from-[rgba(249,250,252,0.9)] to-transparent pointer-events-none transition-opacity duration-300 ${showRightScroll ? 'opacity-100' : 'opacity-0'}`}></div>
          {/* Scrollable container with fixed width cards */}
          <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-8 px-4 snap-x snap-mandatory no-scrollbar" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
            {filteredData.map(item => (
              <div key={item.id} className="min-w-[320px] w-[320px] flex-shrink-0 snap-start h-[500px]">
                {activeCategory === 'communities'
                  ? renderCommunityCard(item)
                  : activeCategory === 'resources'
                    ? renderKnowledgeItem(item)
                    : renderResourceCard(item)}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
          >
            Explore All Platform Features
            <ExternalLinkIcon size={18} />
          </button>
        </div>
      </div>
      <PlatformFeaturesModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        data-id="platform-features-modal"
      />
    </section>;
};
export default PlatformOfferings;
