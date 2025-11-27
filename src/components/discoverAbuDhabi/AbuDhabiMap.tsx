import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SearchIcon, LayersIcon, InfoIcon } from 'lucide-react';
import { MapDrawer, OrganizationDrawerContent, CategoryDrawerContent } from '../shared/MapDrawer';
import {
  abuDhabiOrganizations,
  abuDhabiCategories,
  abuDhabiMapConfig,
  Organization
} from '../../services/abuDhabiMapData';
import { fetchDirectoryItems } from '../../services/api';

const AbuDhabiMap: React.FC = () => {
  // Map references
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // UI state
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [mapView, setMapView] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [isMapMenuOpen, setIsMapMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState<'right' | 'bottom'>('right');
  const [drawerHeight, setDrawerHeight] = useState(300);
  const touchStartY = useRef<number | null>(null);

  // Content state
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [allOrganizations, setAllOrganizations] = useState<Organization[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);
  const [orgsError, setOrgsError] = useState<string | null>(null);

  // Derived state
  const selectedOrganization = selectedOrganizationId
    ? organizations.find(o => o.id === selectedOrganizationId) || null
    : null;

  // Load organizations from Supabase
  useEffect(() => {
    const loadOrganizations = async () => {
      setIsLoadingOrgs(true);
      setOrgsError(null);
      try {
        const { items } = await fetchDirectoryItems({ limit: 100 });
        
        // Map directory items to Organization format with coordinates from mock data
        const mappedOrgs: Organization[] = items.map((item: any, index: number) => {
          // Try to find matching organization in mock data for coordinates
          const mockOrg = abuDhabiOrganizations.find(
            org => org.name.toLowerCase() === item.name.toLowerCase()
          );
          
          // Use mock coordinates if available, otherwise use default Abu Dhabi center with slight offset
          const coordinates: [number, number] = mockOrg?.coordinates || [
            24.4539 + (Math.random() - 0.5) * 0.1,
            54.3773 + (Math.random() - 0.5) * 0.1
          ];
          
          // Map category to lowercase with underscore
          const categoryMap: Record<string, string> = {
            'Technology': 'technology',
            'Finance': 'finance',
            'Energy': 'energy',
            'Healthcare': 'healthcare',
            'Tourism': 'tourism',
            'Retail': 'retail',
            'Real Estate': 'real_estate',
            'Education': 'education',
            'Logistics': 'logistics',
            'Media': 'technology'
          };
          
          return {
            id: item.id || `org-${index}`,
            name: item.name,
            category: categoryMap[item.category] || 'finance',
            type: item.category || 'Organization',
            description: item.description || '',
            link: item.website ? `https://${item.website.replace(/^https?:\/\//, '')}` : '',
            coordinates,
            phone: item.contact_phone || '',
            email: item.contact_email || '',
            website: item.website || '',
            address: item.address || item.location || '',
            founded: item.established_year ? String(item.established_year) : '',
            services: Array.isArray(item.services) ? item.services : 
                     (typeof item.services === 'string' ? JSON.parse(item.services || '[]') : [])
          };
        });
        
        setAllOrganizations(mappedOrgs);
        setOrganizations(mappedOrgs);
      } catch (e) {
        console.error('Failed to load organizations from Supabase:', e);
        setOrgsError('Failed to load organizations');
        // Fallback to mock data
        setAllOrganizations(abuDhabiOrganizations);
        setOrganizations(abuDhabiOrganizations);
      } finally {
        setIsLoadingOrgs(false);
      }
    };
    loadOrganizations();
  }, []);

  // Filter organizations by category
  useEffect(() => {
    if (activeCategory) {
      setOrganizations(allOrganizations.filter(org => org.category === activeCategory));
    } else {
      setOrganizations(allOrganizations);
    }
  }, [activeCategory, allOrganizations]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
      setDrawerPosition(isMobile ? 'bottom' : 'right');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      center: abuDhabiMapConfig.center,
      zoom: abuDhabiMapConfig.zoom,
      zoomControl: false,
      attributionControl: false,
      minZoom: abuDhabiMapConfig.minZoom,
      maxZoom: abuDhabiMapConfig.maxZoom,
      maxBounds: L.latLngBounds(
        L.latLng(abuDhabiMapConfig.bounds.southwest[0], abuDhabiMapConfig.bounds.southwest[1]),
        L.latLng(abuDhabiMapConfig.bounds.northeast[0], abuDhabiMapConfig.bounds.northeast[1])
      )
    });

    // Add zoom control
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add attribution
    L.control.attribution({
      position: 'bottomright',
      prefix: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add base tiles
    updateMapTiles(map, mapView);

    // Create markers layer
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    leafletMapRef.current = map;
    setIsMapLoaded(true);

    return () => {
      if (map) {
        map.remove();
        leafletMapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // Update map tiles
  const updateMapTiles = (map: L.Map, view: 'standard' | 'satellite' | 'hybrid') => {
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileLayer;
    switch (view) {
      case 'satellite':
        tileLayer = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { attribution: '© Esri', maxZoom: 19 }
        );
        break;
      case 'hybrid':
        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { attribution: '© Esri', maxZoom: 19 }
        ).addTo(map);
        tileLayer = L.tileLayer(
          'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.png',
          {
            attribution: 'Map tiles by Stamen Design',
            subdomains: 'abcd',
            maxZoom: 20,
            opacity: 0.7
          }
        );
        break;
      default:
        tileLayer = L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          {
            attribution: '© OpenStreetMap contributors, © CARTO',
            subdomains: 'abcd',
            maxZoom: 19
          }
        );
    }
    tileLayer.addTo(map);
  };

  // Update map view
  useEffect(() => {
    if (leafletMapRef.current) {
      updateMapTiles(leafletMapRef.current, mapView);
    }
  }, [mapView]);

  // Update markers
  useEffect(() => {
    if (!markersLayerRef.current || !isMapLoaded) return;

    markersLayerRef.current.clearLayers();
    organizations.forEach(org => addOrganizationMarker(org));
  }, [organizations, isMapLoaded, selectedOrganizationId]);

  // Add organization marker
  const addOrganizationMarker = (org: Organization) => {
    if (!markersLayerRef.current) return;

    const categoryInfo = abuDhabiCategories[org.category];
    const colors = categoryInfo?.color || abuDhabiCategories.finance.color;

    const customIcon = L.divIcon({
      className: 'custom-marker-container',
      html: `
        <div class="marker-pin ${selectedOrganizationId === org.id ? 'active' : ''}" style="
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: ${colors.marker};
          border: 2px solid ${colors.border};
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          cursor: pointer;
          ${selectedOrganizationId === org.id ? 'transform: rotate(-45deg) scale(1.2); box-shadow: 0 0 15px rgba(0,0,0,0.3);' : ''}
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: 12px;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12" y2="8"/>
            </svg>
          </div>
        </div>
        <div class="marker-pulse ${selectedOrganizationId === org.id ? 'active-pulse' : ''}" style="
          background: ${colors.marker}33;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          position: absolute;
          margin-left: -15px;
          margin-top: -15px;
          animation: pulse 1.5s infinite;
        "></div>
      `,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -40]
    });

    const marker = L.marker(org.coordinates, {
      icon: customIcon,
      title: org.name,
      riseOnHover: true,
      zIndexOffset: org.id === selectedOrganizationId ? 1000 : 0
    });

    marker.bindTooltip(org.name, {
      direction: 'top',
      offset: L.point(0, -40),
      opacity: 0.9,
      className: 'custom-tooltip'
    });

    marker.on('click', () => handleOrganizationClick(org.id));
    marker.addTo(markersLayerRef.current!);
  };

  // Handlers
  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
      setIsDrawerOpen(false);
      setSelectedOrganizationId(null);
    } else {
      setActiveCategory(category);
      setIsDrawerOpen(true);
      setSelectedOrganizationId(null); // Clear selected org to show category list
    }
  };

  const handleOrganizationClick = (orgId: string) => {
    setSelectedOrganizationId(orgId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedOrganizationId(null);
  };

  const handleMapStyleChange = (style: 'standard' | 'satellite' | 'hybrid') => {
    setMapView(style);
    setIsMapMenuOpen(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobileView && drawerPosition === 'bottom') {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isMobileView && drawerPosition === 'bottom' && touchStartY.current !== null) {
      const touchY = e.touches[0].clientY;
      const diff = touchY - touchStartY.current;
      if (diff > 0) {
        const newHeight = Math.max(100, drawerHeight - diff);
        setDrawerHeight(newHeight);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isMobileView && drawerPosition === 'bottom' && touchStartY.current !== null) {
      if (drawerHeight < 150) {
        handleCloseDrawer();
      } else {
        setDrawerHeight(300);
      }
      touchStartY.current = null;
    }
  };

  // Add CSS animations
  useEffect(() => {
    if (!document.getElementById('abu-dhabi-map-animations')) {
      const style = document.createElement('style');
      style.id = 'abu-dhabi-map-animations';
      style.innerHTML = `
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(0.5); opacity: 0; }
        }
        .custom-tooltip {
          background-color: white;
          border: none;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        .marker-pin:hover {
          transform: rotate(-45deg) scale(1.1) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <section className="relative py-12 md:py-16 lg:py-20 bg-gray-50 z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3 md:mb-4">
            Discover Abu Dhabi Business Ecosystem
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            Explore leading organizations and institutions across Abu Dhabi's dynamic business landscape.
          </p>
        </div>

        {/* Category Filters - Top */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(abuDhabiCategories).map(([key, info]) => (
              <button
                key={key}
                onClick={() => handleCategoryClick(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === key ? info.color.active : info.color.pill
                }`}
              >
                {info.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="relative h-[65vh] min-h-[500px] max-h-[800px] rounded-xl overflow-hidden shadow-lg">
          {/* Search Box */}
          <div className="absolute top-4 left-4 z-20 w-full max-w-xs">
            <div className="relative">
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 bg-white rounded-lg shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Map Style Selector */}
          <div className="absolute top-4 right-4 z-20">
            <div className="relative">
              <button
                onClick={() => setIsMapMenuOpen(!isMapMenuOpen)}
                className="flex items-center gap-2 py-2 px-3 bg-white rounded-lg shadow-md text-sm hover:bg-gray-50"
              >
                <LayersIcon className="w-4 h-4 text-gray-600" />
                <span className="hidden sm:inline">
                  {mapView.charAt(0).toUpperCase() + mapView.slice(1)}
                </span>
              </button>
              {isMapMenuOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-md py-1 w-32 z-30">
                  <button
                    onClick={() => handleMapStyleChange('standard')}
                    className={`w-full text-left px-3 py-1.5 text-sm ${
                      mapView === 'standard'
                        ? 'bg-blue-50 text-primary font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => handleMapStyleChange('satellite')}
                    className={`w-full text-left px-3 py-1.5 text-sm ${
                      mapView === 'satellite'
                        ? 'bg-blue-50 text-primary font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    Satellite
                  </button>
                  <button
                    onClick={() => handleMapStyleChange('hybrid')}
                    className={`w-full text-left px-3 py-1.5 text-sm ${
                      mapView === 'hybrid'
                        ? 'bg-blue-50 text-primary font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    Hybrid
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Loading Overlay */}
          {isLoadingOrgs && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-30">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading organizations...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {orgsError && !isLoadingOrgs && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-md z-30">
              <p className="text-sm">{orgsError}</p>
            </div>
          )}

          {/* Map */}
          <div ref={mapRef} className="w-full h-full" />

          {/* Drawer */}
          <MapDrawer
            isOpen={isDrawerOpen}
            position={drawerPosition}
            isMobile={isMobileView}
            onClose={handleCloseDrawer}
            height={drawerHeight}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {selectedOrganization ? (
              <OrganizationDrawerContent
                organization={selectedOrganization}
                categoryInfo={abuDhabiCategories[selectedOrganization.category]}
                onClose={handleCloseDrawer}
                onBack={() => setSelectedOrganizationId(null)}
                showBackButton={true}
              />
            ) : activeCategory ? (
              <CategoryDrawerContent
                categoryInfo={abuDhabiCategories[activeCategory]}
                organizations={organizations}
                onClose={handleCloseDrawer}
                onOrganizationClick={handleOrganizationClick}
              />
            ) : null}
          </MapDrawer>

          {/* Map Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-200 z-10">
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-600">
                {activeCategory
                  ? `${organizations.length} ${abuDhabiCategories[activeCategory].label} organizations`
                  : `${allOrganizations.length || organizations.length} organizations in Abu Dhabi`}
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <InfoIcon size={14} />
                <span className="text-xs">Click markers for details</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AbuDhabiMap;
