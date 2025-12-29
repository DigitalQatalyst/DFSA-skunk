import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon, FilterIcon, XIcon } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import ProfileModal from '../components/ProfileModal';
import EnquiryModal from '../components/EnquiryModal';
import { SearchBar } from '../components/SearchBar';
import { fetchDirectoryItems } from '../services/api';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FilterSidebar, FilterConfig } from '../components/marketplace/FilterSidebar';

// Types for our marketplace
interface Business {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address?: string;
  founded?: string;
  employees?: string;
  revenue?: string;
  services?: string[];
}

// Filter options (using only Industry Category via FilterSidebar)

const BusinessDirectoryMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({ category: [] });
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Business | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState<number>(46);
  const pageRef = useRef<HTMLDivElement>(null);

  const toId = (s: string) => String(s || '').toLowerCase().replace(/\s+/g, '-');
  const categoryOptions = useMemo(() => {
    const names = Array.from(new Set(businesses.map((b) => b.category).filter(Boolean))).sort((a, b) =>
      String(a).localeCompare(String(b))
    );
    return names.map((name) => ({ id: toId(String(name)), name: String(name) }));
  }, [businesses]);
  const filterConfig: FilterConfig[] = useMemo(
    () => [
      {
        id: 'category',
        title: 'Industry Category',
        options: categoryOptions,
      },
    ],
    [categoryOptions]
  );

  // Populate the business data from Supabase
  useEffect(() => {
    const load = async () => {
      try {
        const { items } = await fetchDirectoryItems({ page: 1, limit: 200 });
        const mapped: Business[] = items.map((d: any, idx: number) => ({
          id: String(d.id ?? idx + 1),
          name: d.name,
          logo: d.logo ?? d.logo_url ?? '',
          category: d.category ?? 'General',
          description: d.description ?? '',
          phone: d.contactPhone ?? d.contact_phone ?? d.phone ?? '',
          email: d.contactEmail ?? d.contact_email ?? d.email ?? '',
          website: d.website ?? '',
          address: d.address ?? d.location ?? '',
          founded: String(d.establishedYear ?? d.established_year ?? d.founded ?? ''),
          employees: d.employees ?? '',
          revenue: d.revenue ?? '',
          services: Array.isArray(d.services)
            ? d.services
            : (typeof d.services === 'string' ? JSON.parse(d.services) : [])
        }));
        setBusinesses(mapped);
        setFilteredBusinesses(mapped);
      } catch (e) {
        console.error('Failed to load directory items from Supabase:', e);
        // Do not fallback to mock; show empty state
        setBusinesses([]);
        setFilteredBusinesses([]);
      }
    };
    load();
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
    let result = [...businesses];
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (business) =>
          business.name.toLowerCase().includes(query) ||
          business.description.toLowerCase().includes(query) ||
          business.category.toLowerCase().includes(query)
      );
    }
    // Apply category filter (checkbox selections)
    const selectedCats = filters.category || [];
    if (selectedCats.length > 0) {
      result = result.filter((business) => selectedCats.includes(toId(business.category)));
    }
    // Default sorting by name
    result.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredBusinesses(result);
  }, [searchQuery, filters, businesses]);

  // No pagination for this page

  // Handle filter change (toggle)
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

  // Handle view profile
  const handleViewProfile = (business: Business) => {
    setSelectedProfile(business);
    setIsProfileModalOpen(true);
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
                <span className="ml-1 text-gray-500 md:ml-2">Business Directory</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Business Directory</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Connect with leading organizations and service providers in Abu Dhabi's dynamic business ecosystem to foster partnerships and drive growth.
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
        {/* No filter chip summary row to match marketplace/financial */}
        {/* Available Items / Showing header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
            Available Items ({filteredBusinesses.length})
          </h2>
          <div className="text-sm text-gray-500 hidden sm:block">
            Showing {filteredBusinesses.length} of {filteredBusinesses.length} items
          </div>
          {/* Mobile-friendly header */}
          <h2 className="text-lg font-medium text-gray-800 sm:hidden">
            {filteredBusinesses.length} Items Available
          </h2>
        </div>
        {/* Business Grid */}
        <div id="business-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map(business => (
              <ProfileCard key={business.id} name={business.name} logo={business.logo} category={business.category} description={business.description} phone={business.phone} email={business.email} website={business.website} onViewProfile={() => handleViewProfile(business)} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No businesses found</h3>
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
      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} profile={selectedProfile} />
      {/* Enquiry Modal */}
      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} data-id="business-support" />
    </div>
  );
};

export default BusinessDirectoryMarketplace;
