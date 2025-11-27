import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon, TrendingUpIcon, ZapIcon, DatabaseIcon, GlobeIcon, ShoppingBagIcon, HeartIcon, BookOpenIcon, TruckIcon, LeafIcon, PaletteIcon, PlaneIcon, FilterIcon, XIcon, CheckIcon, DownloadIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import SectorCard from '../components/SectorCard';
import { SearchBar } from '../components/SearchBar';
import { FilterSidebar, FilterConfig } from '../components/marketplace/FilterSidebar';
import { fetchGrowthAreas } from '../services/api';
// Types for our marketplace
interface Sector {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  growth: string;
  investment: string;
  color: string;
  detailsContent?: React.ReactNode;
  growthValue: number;
  investmentValue: number;
  category: string;
}
// Filter options - align with Business Directory (checkbox-based via FilterSidebar)
const GrowthAreasMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [filteredSectors, setFilteredSectors] = useState<Sector[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({ category: [] });
  // pagination removed
  const pageRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState<number>(46);

  const handleDownloadReport = (sectorTitle: string) => {
    try {
      const blob = new Blob([`Report for ${sectorTitle}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sectorTitle}-report.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.log('Download not available for', sectorTitle);
    }
  };

  // Helper function to get icon component from title or icon name
  const getIconComponent = (title: string, colorClass: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'Technology': <TrendingUpIcon size={28} className={colorClass} />,
      'Energy': <ZapIcon size={28} className={colorClass} />,
      'Finance': <DatabaseIcon size={28} className={colorClass} />,
      'Tourism': <GlobeIcon size={28} className={colorClass} />,
      'Retail': <ShoppingBagIcon size={28} className={colorClass} />,
      'Healthcare': <HeartIcon size={28} className={colorClass} />,
      'Education': <BookOpenIcon size={28} className={colorClass} />,
      'Logistics': <TruckIcon size={28} className={colorClass} />,
      'Agritech': <LeafIcon size={28} className={colorClass} />,
      'Creative Industries': <PaletteIcon size={28} className={colorClass} />,
      'Aerospace': <PlaneIcon size={28} className={colorClass} />,
    };
    return iconMap[title] || <TrendingUpIcon size={28} className={colorClass} />;
  };

  // Helper function to get color class from color string
  const getColorClass = (color: string | null | undefined): string => {
    if (!color) return 'bg-primary';
    // If color already includes 'bg-', return as is, otherwise add it
    if (color.startsWith('bg-')) return color;
    return `bg-${color}`;
  };

  // Helper function to get text color class for icons
  const getIconColorClass = (color: string | null | undefined): string => {
    if (!color) return 'text-primary';
    const colorMap: Record<string, string> = {
      'primary': 'text-primary',
      'teal': 'text-teal',
      'purple': 'text-purple',
      'primary-light': 'text-primary-light',
      'teal-light': 'text-teal-light',
      'purple-light': 'text-purple-light',
    };
    // Remove 'bg-' prefix if present
    const baseColor = color.replace('bg-', '');
    return colorMap[baseColor] || 'text-primary';
  };

  // Populate the sectors data from Supabase
  useEffect(() => {
    const loadSectors = async () => {
      try {
        const data = await fetchGrowthAreas();
        const mapped: Sector[] = data.map((item: any) => {
          const color = getColorClass(item.color);
          const iconColorClass = getIconColorClass(item.color);
          const icon = getIconComponent(item.title, iconColorClass);
          
          // Parse key_opportunities from JSONB
          const keyOpportunities = Array.isArray(item.key_opportunities) 
            ? item.key_opportunities 
            : (typeof item.key_opportunities === 'string' 
              ? JSON.parse(item.key_opportunities || '[]') 
              : []);

          // Create detailsContent with key opportunities and download button
          const detailsContent = (
            <div>
              <h4 className="font-display text-lg font-bold mb-4">
                Key Opportunities
              </h4>
              {keyOpportunities.length > 0 ? (
                <ul className="space-y-3">
                  {keyOpportunities.map((opp: string, idx: number) => (
                    <li key={idx} className="flex">
                      <CheckIcon size={18} className={`${iconColorClass} mr-3 mt-1 flex-shrink-0`} />
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No opportunities listed.</p>
              )}
              <div className="mt-6">
                <button 
                  id={`download-${item.title}`} 
                  className={`inline-flex items-center px-4 py-2 ${color} text-white rounded-lg font-medium hover:opacity-90 transition-colors shadow-sm`}
                  onClick={() => handleDownloadReport(item.title)}
                >
                  <DownloadIcon size={16} className="mr-2" />
                  Download Report
                </button>
              </div>
            </div>
          );

          return {
            id: String(item.id || ''),
            title: item.title || '',
            description: item.description || '',
            icon,
            growth: item.growth || '0%',
            investment: item.investment || '$0',
            color,
            detailsContent,
            growthValue: Number(item.growthValue || item.growth_value || 0),
            investmentValue: Number(item.investmentValue || item.investment_value || 0),
            category: item.category || 'General',
          };
        });
        setSectors(mapped);
        setFilteredSectors(mapped);
      } catch (e) {
        console.error('Failed to load growth areas from Supabase:', e);
        // Do not fallback to mock; show empty state
        setSectors([]);
        setFilteredSectors([]);
      }
    };
    loadSectors();
  }, []);
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
      }
    }, {
      threshold: 0.1
    });
    if (pageRef.current) {
      observer.observe(pageRef.current);
    }
    return () => {
      if (pageRef.current) {
        observer.unobserve(pageRef.current);
      }
    };
  }, []);
  // Measure header height for correct sticky offset on mobile
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header") as HTMLElement | null;
      setHeaderHeight(header?.offsetHeight || 46);
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);
  // Apply filters and sorting
  useEffect(() => {
    let result = [...sectors];
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(sector => sector.title.toLowerCase().includes(query) || sector.description.toLowerCase().includes(query));
    }
    // Apply category filter (checkbox selections via FilterSidebar)
    const selectedCats = filters.category || [];
    if (selectedCats.length > 0) {
      const toId = (s: string) => String(s || '').toLowerCase().replace(/\s+/g, '-');
      result = result.filter((sector) => selectedCats.includes(toId(sector.category)));
    }
    // Sorting removed
    setFilteredSectors(result);
  }, [searchQuery, filters, sectors]);

  // Build FilterSidebar config from sector categories
  const toId = (s: string) => String(s || '').toLowerCase().replace(/\s+/g, '-');
  const categoryOptions = React.useMemo(() => {
    const names = Array.from(new Set(sectors.map((s) => s.category).filter(Boolean))).sort((a, b) =>
      String(a).localeCompare(String(b))
    );
    return names.map((name) => ({ id: toId(String(name)), name: String(name) }));
  }, [sectors]);
  const filterConfig: FilterConfig[] = React.useMemo(
    () => [
      {
        id: 'category',
        title: 'Sector Category',
        options: categoryOptions,
      },
    ],
    [categoryOptions]
  );

  // Filter handlers to match Business Directory
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => {
      const set = new Set(prev[filterType] || []);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, [filterType]: Array.from(set) };
    });
  };
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({ category: [] });
    setShowFilters(false);
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div ref={pageRef} className="container mx-auto px-4 py-8 flex-grow opacity-0 -translate-y-4 transition-all duration-1000">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">Growth Areas</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Growth Areas</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Discover Abu Dhabi's commitment to innovation, sustainability, and global investment through diverse sectors offering exceptional growth opportunities.
        </p>
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="xl:hidden sticky z-20 bg-gray-50 py-2 shadow-sm" style={{ top: `${headerHeight}px` }}>
            <div className="flex justify-between items-center">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center" aria-expanded={showFilters}>
                <FilterIcon size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              {(filters.category && filters.category.length > 0) && (
                <button onClick={resetFilters} className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2">
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Filter sidebar - mobile/tablet */}
          <div className={`fixed inset-x-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowFilters(false)} style={{ top: headerHeight, bottom: 0 }}>
            <div className={`fixed left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()} style={{ top: headerHeight, bottom: 0 }}>
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="p-1 rounded-full hover:bg-gray-100">
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar
                    filters={filters}
                    filterConfig={filterConfig}
                    onFilterChange={handleFilterChange}
                    onResetFilters={resetFilters}
                    isResponsive={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter sidebar - desktop - always visible */}
          <div className="hidden xl:block xl:w-1/4">
            <div className="bg-white rounded-lg shadow sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-lg font-semibold">Filters</h2>
                {Object.values(filters).some((f) => f.length > 0) && (
                  <button onClick={resetFilters} className="text-blue-600 text-sm font-medium">
                    Reset All
                  </button>
                )}
              </div>
              <div className="p-4 overflow-y-auto scrollbar-hide">
                <FilterSidebar
                  filters={filters}
                  filterConfig={filterConfig}
                  onFilterChange={handleFilterChange}
                  onResetFilters={resetFilters}
                  isResponsive={false}
                />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="xl:w-3/4">
            {/* Available Items / Showing header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
                Available Items ({filteredSectors.length})
              </h2>
              <div className="text-sm text-gray-500 hidden sm:block">
                Showing {filteredSectors.length} of {filteredSectors.length} items
              </div>
              {/* Mobile-friendly header */}
              <h2 className="text-lg font-medium text-gray-800 sm:hidden">
                {filteredSectors.length} Items Available
              </h2>
            </div>

            {/* Sector Grid */}
            <div id="sector-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredSectors.length > 0 ? (
                filteredSectors.map(sector => (
                  <SectorCard
                    key={sector.id}
                    title={sector.title}
                    description={sector.description}
                    icon={sector.icon}
                    growth={sector.growth}
                    investment={sector.investment}
                    color={sector.color}
                    detailsContent={sector.detailsContent}
                    onDownloadReport={handleDownloadReport}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold mb-2">No sectors found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                  <button onClick={resetFilters} className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};
export default GrowthAreasMarketplace;