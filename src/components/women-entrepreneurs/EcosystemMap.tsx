import React, { useCallback, useEffect, useState, useRef, createElement } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinIcon, SearchIcon, ExternalLinkIcon, XIcon, LayersIcon, ChevronRightIcon, ChevronLeftIcon, MapIcon, BuildingIcon, GlobeIcon, LinkIcon, ArrowRightIcon, UsersIcon, BookOpenIcon, SettingsIcon, ArrowLeftIcon, InfoIcon, EyeIcon } from 'lucide-react';
import { PillFilters } from '../../components/PillFilters';
import { emiratesData, entityRegistry, categoryMapping, emirateGeoJSON, getEmirateOrganizations, getAllOrganizations, getEmiratePrograms, getAllPrograms } from '../../services/womenEcosystemData';
// Define types for the data structure
interface Program {
  program_name: string;
  organization: string;
  action_label: string;
  link: string;
  emirate?: string;
}
interface Organization {
  id: string;
  name: string;
  category: string;
  type: string;
  description: string;
  link: string;
  coordinates: [number, number];
}
// Main component
const EcosystemMap: React.FC = () => {
  // Map references and state
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const emirateBoundaryRef = useRef<L.GeoJSON | null>(null);
  const touchStartY = useRef<number | null>(null);
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  // UI state
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [mapView, setMapView] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [isMapMenuOpen, setIsMapMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMoreDescription, setShowMoreDescription] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [wasScrollLocked, setWasScrollLocked] = useState<boolean>(false);
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerPosition, setDrawerPosition] = useState<'right' | 'bottom'>('right');
  const [drawerHeight, setDrawerHeight] = useState<number>(300); // For mobile bottom drawer
  // Content state
  const [viewLevel, setViewLevel] = useState<'uae' | 'emirate' | 'organization'>('uae');
  const [selectedEmirateId, setSelectedEmirateId] = useState<string | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  // Derived state
  const selectedEmirate = selectedEmirateId ? emiratesData.find(e => e.id === selectedEmirateId) || null : null;
  const organizations = selectedEmirateId ? getEmirateOrganizations(selectedEmirateId) : getAllOrganizations();
  const selectedOrganization = selectedEmirate && selectedOrganizationId ? organizations.find(o => o.id === selectedOrganizationId) || null : null;
  const filteredOrganizations = activeCategory ? organizations.filter(org => org.category === activeCategory) : organizations;
  const programs = selectedEmirateId ? getEmiratePrograms(selectedEmirateId) : getAllPrograms();
  // Calculate total organizations count
  const totalOrganizations = getAllOrganizations().length;
  // Prepare filter options for PillFilters component
  const emirateFilterOptions = [{
    value: 'all',
    label: 'All UAE'
  }, ...emiratesData.map(emirate => ({
    value: emirate.id,
    label: emirate.emirate
  }))];
  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
      setDrawerPosition(isMobile ? 'bottom' : 'right');
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // Intersection Observer to detect when the map section is in view
  useEffect(() => {
    if (!sectionRef.current || intersectionObserverRef.current) return;
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the element is visible
    };
    intersectionObserverRef.current = new IntersectionObserver(entries => {
      const [entry] = entries;
      setIsInView(entry.isIntersecting);
    }, options);
    intersectionObserverRef.current.observe(sectionRef.current);
    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, []);
  // Handle body scroll locking when map is in view
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight && isInView;
      // Lock scroll when map is fully visible and user is interacting with it
      if (isFullyVisible && !wasScrollLocked) {
        document.body.style.overflow = 'hidden';
        setWasScrollLocked(true);
      }
      // Unlock scroll when map is not fully visible
      else if (!isFullyVisible && wasScrollLocked) {
        document.body.style.overflow = '';
        setWasScrollLocked(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    if (isInView) {
      handleScroll();
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Ensure scroll is re-enabled when component unmounts
      document.body.style.overflow = '';
    };
  }, [isInView, wasScrollLocked]);
  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;
    // Create map instance
    const map = L.map(mapRef.current, {
      center: [24.7, 54.5],
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
      minZoom: 6,
      maxZoom: 12,
      maxBounds: L.latLngBounds(L.latLng(22.0, 51.0),
      // Southwest corner of UAE bounds
      L.latLng(26.5, 57.0)),
      zoomSnap: 0.5,
      zoomDelta: 0.5
    });
    // Add zoom control to top-right
    L.control.zoom({
      position: 'topright'
    }).addTo(map);
    // Add attribution control to bottom-right
    L.control.attribution({
      position: 'bottomright',
      prefix: '© OpenStreetMap contributors'
    }).addTo(map);
    // Add base map tiles
    updateMapTiles(map, mapView);
    // Create a layer group for markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    // Store map reference
    leafletMapRef.current = map;
    // Add UAE outline as a semi-transparent overlay
    addUAEOutline(map);
    // Set map as loaded
    setIsMapLoaded(true);
    // Clean up on unmount
    return () => {
      if (map) {
        map.remove();
        leafletMapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, [mapView]);
  // Add UAE outline to the map
  const addUAEOutline = (map: L.Map) => {
    // This is a simplified outline - in a real implementation, you'd use a GeoJSON file with accurate UAE boundaries
    const uaeOutline = L.polygon([[24.0, 51.5], [24.2, 51.8], [24.3, 52.5], [24.5, 53.0], [24.7, 54.5], [25.0, 55.0], [25.5, 56.0], [26.0, 56.3], [26.0, 55.0], [25.5, 54.0], [25.0, 53.0], [24.5, 52.0], [24.0, 51.5]], {
      color: 'transparent',
      fillColor: 'transparent',
      fillOpacity: 0,
      weight: 0,
      opacity: 0
    }).addTo(map);
  };
  // Add emirate boundary to the map
  const addEmirateBoundary = (emirateId: string) => {
    if (!leafletMapRef.current) return;
    // Remove existing boundary if any
    if (emirateBoundaryRef.current) {
      leafletMapRef.current.removeLayer(emirateBoundaryRef.current);
      emirateBoundaryRef.current = null;
    }
    // Get GeoJSON data for the emirate
    const geoData = emirateGeoJSON[emirateId as keyof typeof emirateGeoJSON];
    if (geoData) {
      // Create GeoJSON layer
      const boundary = L.geoJSON({
        type: 'Feature',
        properties: {},
        geometry: geoData
      }, {
        style: {
          color: 'transparent',
          fillColor: 'transparent',
          fillOpacity: 0,
          weight: 0,
          opacity: 0
        }
      }).addTo(leafletMapRef.current);
      // Store reference
      emirateBoundaryRef.current = boundary;
      // Add hover effect to the boundary
      boundary.on('mouseover', function () {
        boundary.setStyle({
          fillOpacity: 0,
          weight: 0
        });
      });
      boundary.on('mouseout', function () {
        boundary.setStyle({
          fillOpacity: 0,
          weight: 0
        });
      });
      // Add a pulsing animation effect
      const pulseAnimation = () => {
        if (emirateBoundaryRef.current) {
          // Find all paths in the GeoJSON layer
          const paths = document.querySelectorAll('.leaflet-interactive');
          paths.forEach(path => {
            if (path.getAttribute('stroke') === '#3182ce') {
              path.classList.add('boundary-pulse');
              setTimeout(() => {
                path.classList.remove('boundary-pulse');
              }, 1000);
            }
          });
        }
      };
      // Run animation once
      setTimeout(pulseAnimation, 100);
      // Fit map to boundary with padding
      const selectedEmirate = emiratesData.find(e => e.id === emirateId);
      if (selectedEmirate && selectedEmirate.boundingBox) {
        const bounds = L.latLngBounds(L.latLng(selectedEmirate.boundingBox[0][0], selectedEmirate.boundingBox[0][1]), L.latLng(selectedEmirate.boundingBox[1][0], selectedEmirate.boundingBox[1][1]));
        leafletMapRef.current.fitBounds(bounds, {
          padding: [40, 40],
          animate: true,
          duration: 0.5
        });
      } else {
        // Fallback to center on emirate coordinates with zoom level
        const emirate = emiratesData.find(e => e.id === emirateId);
        if (emirate) {
          leafletMapRef.current.setView(emirate.coordinates, emirate.zoomLevel, {
            animate: true,
            duration: 0.5,
            easeLinearity: 0.5
          });
        }
      }
    }
  };
  // Function to update map tiles based on selected view
  const updateMapTiles = (map: L.Map, view: 'standard' | 'satellite' | 'hybrid') => {
    // Remove existing tile layers
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    // Add new tile layer based on view
    let tileLayer;
    switch (view) {
      case 'satellite':
        tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri',
          maxZoom: 19
        });
        break;
      case 'hybrid':
        // Add satellite first
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri',
          maxZoom: 19
        }).addTo(map);
        // Add roads/labels on top
        tileLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.png', {
          attribution: 'Map tiles by Stamen Design, CC BY 3.0',
          subdomains: 'abcd',
          minZoom: 0,
          maxZoom: 20,
          opacity: 0.7
        });
        break;
      default:
        // standard
        tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors, © CARTO',
          subdomains: 'abcd',
          maxZoom: 19
        });
    }
    tileLayer.addTo(map);
  };
  // Update map when view changes
  useEffect(() => {
    if (leafletMapRef.current) {
      updateMapTiles(leafletMapRef.current, mapView);
    }
  }, [mapView]);
  // Update markers based on view level and selected emirate
  useEffect(() => {
    if (!markersLayerRef.current || !leafletMapRef.current || !isMapLoaded) return;
    // Clear existing markers
    markersLayerRef.current.clearLayers();
    if (viewLevel === 'uae') {
      // If no emirate is selected, show all emirates
      if (!selectedEmirateId) {
        addEmirateMarkers();
        // Fit map to UAE bounds
        if (leafletMapRef.current) {
          leafletMapRef.current.setView([24.7, 54.5], 7, {
            animate: true,
            duration: 0.5
          });
        }
      } else {
        // If an emirate is selected but we're still in UAE view, show only that emirate's marker
        const emirate = emiratesData.find(e => e.id === selectedEmirateId);
        if (emirate) {
          addSingleEmirateMarker(emirate);
          // Fit to emirate bounds or center on coordinates
          if (leafletMapRef.current) {
            if (emirate.boundingBox) {
              const bounds = L.latLngBounds(L.latLng(emirate.boundingBox[0][0], emirate.boundingBox[0][1]), L.latLng(emirate.boundingBox[1][0], emirate.boundingBox[1][1]));
              leafletMapRef.current.fitBounds(bounds, {
                padding: [40, 40],
                animate: true,
                duration: 0.5
              });
            } else {
              leafletMapRef.current.setView(emirate.coordinates, emirate.zoomLevel, {
                animate: true,
                duration: 0.5
              });
            }
            // Add emirate boundary
            addEmirateBoundary(emirate.id);
          }
        }
      }
    } else if (viewLevel === 'emirate' && selectedEmirate) {
      // Add organization markers for the selected emirate
      addOrganizationMarkers();
      // Fit to emirate bounds or center on coordinates
      if (leafletMapRef.current) {
        if (selectedEmirate.boundingBox) {
          const bounds = L.latLngBounds(L.latLng(selectedEmirate.boundingBox[0][0], selectedEmirate.boundingBox[0][1]), L.latLng(selectedEmirate.boundingBox[1][0], selectedEmirate.boundingBox[1][1]));
          leafletMapRef.current.fitBounds(bounds, {
            padding: [40, 40],
            animate: true,
            duration: 0.5
          });
        } else {
          leafletMapRef.current.setView(selectedEmirate.coordinates, selectedEmirate.zoomLevel, {
            animate: true,
            duration: 0.5
          });
        }
        // Add emirate boundary
        addEmirateBoundary(selectedEmirate.id);
      }
    }
  }, [viewLevel, selectedEmirateId, activeCategory, isMapLoaded, selectedOrganizationId]);
  // Add all emirate markers to the map
  const addEmirateMarkers = () => {
    if (!markersLayerRef.current || !leafletMapRef.current) return;
    emiratesData.forEach(emirate => {
      addEmirateMarker(emirate);
    });
  };
  // Add a single emirate marker with animation
  const addSingleEmirateMarker = (emirate: any) => {
    if (!markersLayerRef.current || !leafletMapRef.current) return;
    addEmirateMarker(emirate, true);
  };
  // Add an emirate marker to the map
  const addEmirateMarker = (emirate: any, animate = false) => {
    if (!markersLayerRef.current) return;
    // Create custom marker icon for emirates
    const customIcon = L.divIcon({
      className: 'custom-emirate-marker',
      html: `
        <div class="emirate-marker ${animate ? 'animate-bounce-once' : ''}" style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 48, 227, 0.8);
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        ">
          <div style="
            text-align: center;
            line-height: 1;
          ">
            ${emirate.emirate.substring(0, 2)}
          </div>
        </div>
        <div class="marker-pulse" style="
          background: rgba(0, 48, 227, 0.3);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          position: absolute;
          margin-left: -25px;
          margin-top: -25px;
          animation: pulse 2s infinite;
        "></div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
    // Create marker
    const marker = L.marker(emirate.coordinates, {
      icon: customIcon,
      title: emirate.emirate,
      riseOnHover: true
    });
    // Add tooltip
    marker.bindTooltip(emirate.emirate, {
      direction: 'top',
      offset: L.point(0, -20),
      opacity: 0.9,
      className: 'custom-tooltip'
    });
    // Add click handler
    marker.on('click', () => {
      handleEmirateClick(emirate.id);
    });
    // Add marker to layer group
    marker.addTo(markersLayerRef.current!);
  };
  // Add organization markers to the map
  const addOrganizationMarkers = () => {
    if (!markersLayerRef.current || !leafletMapRef.current || !selectedEmirateId) return;
    console.log('Adding organization markers for emirate:', selectedEmirateId);
    // Clear existing markers
    markersLayerRef.current.clearLayers();
    // Get filtered organizations
    const orgsToShow = activeCategory ? filteredOrganizations : organizations;
    console.log('Organizations to show:', orgsToShow.length, orgsToShow);
    orgsToShow.forEach(org => {
      if (!org.coordinates || !Array.isArray(org.coordinates) || org.coordinates.length !== 2) {
        console.error('Invalid coordinates for organization:', org.name, org.coordinates);
        return;
      }
      const categoryType = org.category as keyof typeof categoryMapping;
      const colors = categoryMapping[categoryType]?.color || categoryMapping.federal_enabler.color;
      // Create custom marker icon
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
            position: relative;
            cursor: pointer;
            ${selectedOrganizationId === org.id ? 'transform: rotate(-45deg) scale(1.2); box-shadow: 0 0 15px rgba(0,0,0,0.3);' : ''}
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></svg>
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
            ${selectedOrganizationId === org.id ? 'background: ' + colors.marker + '66; width: 40px; height: 40px; margin-left: -20px; margin-top: -20px;' : ''}
          "></div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
      });
      // Create marker
      try {
        const marker = L.marker(org.coordinates, {
          icon: customIcon,
          title: org.name,
          riseOnHover: true,
          zIndexOffset: org.id === selectedOrganizationId ? 1000 : 0
        });
        // Add tooltip
        marker.bindTooltip(org.name, {
          direction: 'top',
          offset: L.point(0, -40),
          opacity: 0.9,
          className: 'custom-tooltip'
        });
        // Add click handler
        marker.on('click', () => {
          handleOrganizationClick(org.id);
        });
        // Add marker to layer group
        marker.addTo(markersLayerRef.current!);
      } catch (error) {
        console.error('Error adding marker for organization:', org.name, error);
      }
    });
  };
  // Handle map style change
  const handleMapStyleChange = (style: 'standard' | 'satellite' | 'hybrid') => {
    setMapView(style);
    setIsMapMenuOpen(false);
  };
  // Handle emirate filter click
  const handleEmirateFilterClick = (emirateId: string | null) => {
    if (emirateId === selectedEmirateId) {
      // If clicking the already selected emirate, do nothing
      return;
    }
    // Clear organization selection
    setSelectedOrganizationId(null);
    if (emirateId === null) {
      // All UAE view
      setSelectedEmirateId(null);
      setViewLevel('uae');
      setIsDrawerOpen(false);
      // Remove emirate boundary
      if (emirateBoundaryRef.current && leafletMapRef.current) {
        leafletMapRef.current.removeLayer(emirateBoundaryRef.current);
        emirateBoundaryRef.current = null;
      }
      // Reset map view
      if (leafletMapRef.current) {
        leafletMapRef.current.setView([24.7, 54.5], 7, {
          animate: true,
          duration: 0.5
        });
      }
    } else {
      // Emirate view
      setSelectedEmirateId(emirateId);
      setViewLevel('emirate');
      setIsDrawerOpen(true);
      // Find the emirate
      const emirate = emiratesData.find(e => e.id === emirateId);
      if (emirate && leafletMapRef.current) {
        // Fit to emirate bounds or center on coordinates
        if (emirate.boundingBox) {
          const bounds = L.latLngBounds(L.latLng(emirate.boundingBox[0][0], emirate.boundingBox[0][1]), L.latLng(emirate.boundingBox[1][0], emirate.boundingBox[1][1]));
          leafletMapRef.current.fitBounds(bounds, {
            padding: [40, 40],
            animate: true,
            duration: 0.5
          });
        } else {
          // Fallback to center on emirate coordinates with zoom level
          leafletMapRef.current.setView(emirate.coordinates, emirate.zoomLevel, {
            animate: true,
            duration: 0.5
          });
        }
        // Add emirate boundary
        addEmirateBoundary(emirate.id);
      }
    }
  };
  // Handle emirate marker click
  const handleEmirateClick = (emirateId: string) => {
    setSelectedEmirateId(emirateId);
    setViewLevel('emirate');
    setIsDrawerOpen(true);
  };
  // Handle organization click
  const handleOrganizationClick = (organizationId: string) => {
    setSelectedOrganizationId(organizationId);
    setViewLevel('organization');
    setIsDrawerOpen(true);
  };
  // Handle back to UAE overview
  const handleBackToUAE = () => {
    setViewLevel('uae');
    setSelectedEmirateId(null);
    setSelectedOrganizationId(null);
    setActiveCategory(null);
    setIsDrawerOpen(false);
    // Remove emirate boundary
    if (emirateBoundaryRef.current && leafletMapRef.current) {
      leafletMapRef.current.removeLayer(emirateBoundaryRef.current);
      emirateBoundaryRef.current = null;
    }
    // Reset map view
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([24.7, 54.5], 7, {
        animate: true,
        duration: 0.5
      });
    }
  };
  // Handle back to emirate view
  const handleBackToEmirate = () => {
    setViewLevel('emirate');
    setSelectedOrganizationId(null);
  };
  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  // Handle close drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // If in organization view, go back to emirate view but keep drawer closed
    if (viewLevel === 'organization') {
      setViewLevel('emirate');
      setSelectedOrganizationId(null);
    }
  };
  // Handle touch start for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobileView && drawerPosition === 'bottom') {
      touchStartY.current = e.touches[0].clientY;
    }
  };
  // Handle touch move for mobile swipe
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isMobileView && drawerPosition === 'bottom' && touchStartY.current !== null) {
      const touchY = e.touches[0].clientY;
      const diff = touchY - touchStartY.current;
      // If swiping down
      if (diff > 0) {
        // Calculate new drawer height
        const newHeight = Math.max(100, drawerHeight - diff);
        setDrawerHeight(newHeight);
      }
    }
  };
  // Handle touch end for mobile swipe
  const handleTouchEnd = () => {
    if (isMobileView && drawerPosition === 'bottom' && touchStartY.current !== null) {
      // If drawer is less than 150px tall, close it
      if (drawerHeight < 150) {
        handleCloseDrawer();
      } else {
        // Reset to default height
        setDrawerHeight(300);
      }
      touchStartY.current = null;
    }
  };
  // Toggle show more description
  const toggleShowMoreDescription = () => {
    setShowMoreDescription(!showMoreDescription);
  };
  // Handle filter change from PillFilters component
  const handleFilterChange = useCallback((value: string) => {
    const emirateId = value === 'all' ? null : value;
    handleEmirateFilterClick(emirateId);
  }, []);
  // Add CSS for animations
  useEffect(() => {
    if (!document.getElementById('ecosystem-map-animations')) {
      const style = document.createElement('style');
      style.id = 'ecosystem-map-animations';
      style.innerHTML = `
        @keyframes pulse {
          0% {
            transform: scale(0.5);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(0.5);
            opacity: 0;
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInBottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes bounceOnce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes boundaryPulse {
          0% {
            stroke-width: 1.5;
            stroke-opacity: 0.8;
          }
          50% {
            stroke-width: 3;
            stroke-opacity: 1;
          }
          100% {
            stroke-width: 1.5;
            stroke-opacity: 0.8;
          }
        }
        .custom-tooltip {
          background-color: white;
          border: none;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 6px 10px;
          border-radius: 4px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 12px;
          font-weight: 500;
        }
        .emirate-marker:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(0,0,0,0.3);
        }
        .active-pulse {
          animation: pulse 1.5s infinite;
          background-color: rgba(0, 48, 227, 0.5) !important;
        }
        .drawer-slide-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
        .drawer-slide-bottom {
          animation: slideInBottom 0.3s ease-out forwards;
        }
        .content-fade {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-bounce-once {
          animation: bounceOnce 0.5s ease-in-out;
        }
        .boundary-pulse {
          animation: boundaryPulse 1s ease-in-out;
        }
        .filter-scroll-container::-webkit-scrollbar {
          height: 0;
          width: 0;
          background: transparent;
        }
        .filter-fade-left {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 40px;
          background: linear-gradient(to right, rgba(249, 250, 251, 1) 0%, rgba(249, 250, 251, 0) 100%);
          pointer-events: none;
          z-index: 10;
        }
        .filter-fade-right {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 40px;
          background: linear-gradient(to left, rgba(249, 250, 251, 1) 0%, rgba(249, 250, 251, 0) 100%);
          pointer-events: none;
          z-index: 10;
        }
        .map-section-wrapper {
          position: relative;
          height: 80vh;
          min-height: 600px;
          z-index: 10;
        }
        .map-container {
          position: relative;
          height: 100%;
          width: 100%;
          overflow: hidden;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .map-section-sticky-header {
          position: sticky;
          top: 0;
          z-index: 20;
          background-color: rgba(249, 250, 251, 0.9);
          backdrop-filter: blur(8px);
          padding: 1rem 0;
          border-bottom: 1px solid rgba(229, 231, 235, 0.5);
          transition: all 0.3s ease;
        }
        .drawer-content-scroll {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          max-height: 100%;
        }
        .prevent-map-events {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: none;
        }
        .drawer-content-scroll:hover ~ .prevent-map-events {
          display: block;
        }
        /* Improve drawer styling */
        .map-drawer {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
          overflow: hidden;
          transition: transform 0.3s ease-out, opacity 0.3s ease-out;
          z-index: 1100;
        }
        .map-drawer-desktop {
          position: absolute;
          top: 1rem;
          bottom: 1rem;
          right: 1rem;
          width: 40%;
          max-width: 450px;
          z-index: 1100;
          transform: translateX(100%);
          opacity: 0;
        }
        .map-drawer-desktop.open {
          transform: translateX(0);
          opacity: 1;
        }
        .map-drawer-mobile {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1100;
          border-radius: 1rem 1rem 0 0;
          transform: translateY(100%);
          opacity: 0;
          max-height: 80%;
        }
        .map-drawer-mobile.open {
          transform: translateY(0);
          opacity: 1;
        }
        /* Map footer styling */
        .map-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.5rem 1rem;
          background-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(4px);
          border-top: 1px solid rgba(229, 231, 235, 0.5);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
          transition: opacity 0.3s ease;
        }
        .map-section-wrapper {
          position: relative;
          height: 65vh;
          min-height: 400px;
          max-height: 800px;
          z-index: 10;
          margin-bottom: 1.5rem;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        @media (min-width: 768px) {
          .map-section-wrapper {
            height: 70vh;
            min-height: 500px;
            margin-bottom: 2rem;
          }
        }
        @media (min-width: 1024px) {
          .map-section-wrapper {
            height: 75vh;
            min-height: 600px;
          }
        }
        /* Drawer styling */
        .map-drawer {
          background-color: white;
          border-radius: 1rem;
          box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition:
            transform 0.3s ease-out,
            opacity 0.3s ease-out;
          z-index: 1100;
        }
        .map-drawer-desktop {
          position: absolute;
          top: 1rem;
          bottom: 1rem;
          right: 1rem;
          width: 90%;
          max-width: 350px;
          transform: translateX(100%);
          opacity: 0;
        }
        @media (min-width: 768px) {
          .map-drawer-desktop {
            width: 60%;
            max-width: 400px;
          }
        }
        @media (min-width: 1024px) {
          .map-drawer-desktop {
            width: 40%;
            max-width: 450px;
          }
        }
        .map-drawer-desktop.open {
          transform: translateX(0);
          opacity: 1;
        }
        .map-drawer-mobile {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          border-radius: 1rem 1rem 0 0;
          transform: translateY(100%);
          opacity: 0;
          max-height: 85%;
        }
        .map-drawer-mobile.open {
          transform: translateY(0);
          opacity: 1;
        }
        .drawer-content-scroll {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          position: relative;
          height: 100%;
          scrollbar-width: thin;
        }
        .drawer-content-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .drawer-content-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .drawer-content-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        /* Fade gradients for scroll indication */
        .fade-gradient-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0) 100%
          );
          pointer-events: none;
          z-index: 1;
        }
        .fade-gradient-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(
            to top,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0) 100%
          );
          pointer-events: none;
          z-index: 1;
        }
        /* Filter bar styling */
        .filter-fade-left {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 40px;
          background: linear-gradient(
            to right,
            rgba(249, 250, 251, 1) 0%,
            rgba(249, 250, 251, 0) 100%
          );
          pointer-events: none;
          z-index: 10;
        }
        .filter-fade-right {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 40px;
          background: linear-gradient(
            to left,
            rgba(249, 250, 251, 1) 0%,
            rgba(249, 250, 251, 0) 100%
          );
          pointer-events: none;
          z-index: 10;
        }
        /* Map footer styling */
        .map-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.5rem 1rem;
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          border-top: 1px solid rgba(229, 231, 235, 0.5);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
          transition: opacity 0.3s ease;
        }
        /* Map container styling */
        .map-container {
          position: relative;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }
        /* Prevent map events */
        .prevent-map-events {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: none;
        }
        .drawer-content-scroll:hover ~ .prevent-map-events {
          display: block;
        }
        /* Map section sticky header */
        .map-section-sticky-header {
          position: relative;
          z-index: 20;
          background-color: rgba(249, 250, 251, 0.9);
          backdrop-filter: blur(8px);
          padding: 0.5rem 0;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        @media (min-width: 768px) {
          .map-section-sticky-header {
            padding: 0.75rem 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  // Render the drawer content based on view level
  const renderDrawerContent = () => {
    if (viewLevel === 'emirate' && selectedEmirate) {
      return <div className="h-full flex flex-col content-fade">
          {/* Header with Breadcrumb */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center mb-2">
                <button onClick={handleBackToUAE} className="text-primary hover:text-primary-dark transition-colors text-sm font-medium flex items-center gap-1">
                  <ArrowLeftIcon size={14} />
                  <span>UAE</span>
                </button>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm font-medium text-gray-800">
                  {selectedEmirate.emirate}
                </span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {selectedEmirate.overview.title}
              </h3>
            </div>
            <button onClick={handleCloseDrawer} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close panel">
              <XIcon size={20} />
            </button>
          </div>
          {/* Description with Show More toggle */}
          <div className="mb-6">
            <div className={`text-sm text-gray-600 ${!showMoreDescription ? 'line-clamp-2' : ''}`}>
              {selectedEmirate.overview.description}
            </div>
            <button onClick={toggleShowMoreDescription} className="text-primary text-sm font-medium mt-1 flex items-center hover:underline">
              {showMoreDescription ? 'Show less' : 'Show more'}
            </button>
          </div>
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(categoryMapping).map(([category, info]) => <button key={category} onClick={() => handleCategoryFilter(category)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${activeCategory === category ? info.color.active : info.color.pill}`}>
                {info.label}
              </button>)}
          </div>
          {/* Organizations */}
          <div className="mb-6 flex-grow overflow-hidden">
            <h4 className="text-lg font-semibold mb-3">Key Organizations</h4>
            <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2 scrollbar-thin">
              {filteredOrganizations.length > 0 ? filteredOrganizations.map(org => {
              const categoryType = org.category as keyof typeof categoryMapping;
              const colors = categoryMapping[categoryType]?.color || categoryMapping.federal_enabler.color;
              return <div key={org.id} onClick={() => handleOrganizationClick(org.id)} className={`p-3 rounded-lg border transition-all cursor-pointer ${selectedOrganizationId === org.id ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-primary hover:bg-gray-50'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">
                            {org.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {org.description}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${colors.bg} ${colors.text}`}>
                          {categoryMapping[categoryType]?.label || 'Other'}
                        </div>
                      </div>
                    </div>;
            }) : <div className="text-center text-gray-500 py-4">
                  No organizations match the selected filter
                </div>}
            </div>
          </div>
          {/* Programs & Initiatives */}
          {programs.length > 0 && <div className="mt-auto pt-4">
              <h4 className="text-lg font-semibold mb-3">
                Programs & Initiatives
              </h4>
              <div className="space-y-3">
                {programs.map((program, index) => <div key={index} className="p-3 rounded-lg border border-gray-200 bg-white">
                    <div className="font-medium text-gray-900 mb-1">
                      {program.program_name}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      By {program.organization}
                    </div>
                    <a href={program.link} className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                      {program.action_label}
                      <ChevronRightIcon size={16} />
                    </a>
                  </div>)}
              </div>
            </div>}
        </div>;
    } else if (viewLevel === 'organization' && selectedOrganization) {
      const categoryType = selectedOrganization.category as keyof typeof categoryMapping;
      const colors = categoryMapping[categoryType]?.color || categoryMapping.federal_enabler.color;
      return <div className="h-full flex flex-col content-fade">
          {/* Header with Breadcrumb */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center mb-2">
              <button onClick={handleBackToUAE} className="text-primary hover:text-primary-dark transition-colors text-sm font-medium flex items-center gap-1">
                <ArrowLeftIcon size={14} />
                <span>UAE</span>
              </button>
              <span className="mx-2 text-gray-400">/</span>
              <button onClick={handleBackToEmirate} className="text-primary hover:text-primary-dark transition-colors text-sm font-medium">
                {selectedEmirate?.emirate}
              </button>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-sm font-medium text-gray-800">
                {selectedOrganization.name}
              </span>
            </div>
            <button onClick={handleCloseDrawer} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close panel">
              <XIcon size={20} />
            </button>
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${colors.bg} ${colors.text}`}>
            {categoryMapping[categoryType]?.label || 'Other'}
          </div>
          <h3 className="text-xl font-bold text-primary mb-4">
            {selectedOrganization.name}
          </h3>
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <BuildingIcon size={18} className="text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-medium">{selectedOrganization.type}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GlobeIcon size={18} className="text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">Region</div>
                <div className="font-medium">{selectedEmirate?.emirate}</div>
              </div>
            </div>
          </div>
          {/* Description with Show More toggle */}
          <div className="mb-6">
            <div className={`text-sm text-gray-600 ${!showMoreDescription ? 'line-clamp-2' : ''}`}>
              {selectedOrganization.description}
            </div>
            <button onClick={toggleShowMoreDescription} className="text-primary text-sm font-medium mt-1 flex items-center hover:underline">
              {showMoreDescription ? 'Show less' : 'Show more'}
            </button>
          </div>
          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <a href={selectedOrganization.link} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 w-full justify-center" target="_blank" rel="noopener noreferrer">
              <LinkIcon size={16} />
              Contact Organization
            </a>
          </div>
        </div>;
    }
    return null;
  };
  return <section id="ecosystem-map" ref={sectionRef} className="py-12 md:py-16 lg:py-20 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3 md:mb-4 font-display">
            Women Entrepreneurs Ecosystem Map
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            Discover the organizations, institutions, and initiatives supporting
            women entrepreneurs across the UAE's vibrant ecosystem.
          </p>
        </div>
        {/* Sticky Emirate Filter Bar */}
        <div className="map-section-sticky-header mb-4 md:mb-6">
          <div ref={filterContainerRef} className="relative overflow-hidden">
            <div className="filter-fade-left"></div>
            <div className="filter-fade-right"></div>
            <div className="overflow-x-auto scrollbar-none py-2 px-1">
              <div className="flex space-x-2 min-w-max">
                {emirateFilterOptions.map(option => <button key={option.value} onClick={() => handleFilterChange(option.value)} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                      ${option.value === (selectedEmirateId || 'all') ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md' : 'bg-transparent border border-gray-200 text-gray-800 hover:bg-gray-50'}`}>
                    {option.label}
                  </button>)}
              </div>
            </div>
          </div>
        </div>
        {/* Map Container with Responsive Height */}
        <div className="map-section-wrapper">
          <div className="map-container">
            {/* Search Box */}
            <div className="absolute top-3 md:top-4 left-3 md:left-4 z-20 w-full max-w-[calc(100%-80px)] md:max-w-xs">
              <div className="relative">
                <input type="text" placeholder="Search organizations, emirate..." value={searchQuery} onChange={handleSearchChange} className="w-full py-1.5 md:py-2 pl-8 md:pl-10 pr-3 md:pr-4 bg-white rounded-lg shadow-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                <SearchIcon className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
            </div>
            {/* Map Style Selector */}
            <div className="absolute top-3 md:top-4 right-3 md:right-4 z-20">
              <div className="relative">
                <button onClick={() => setIsMapMenuOpen(!isMapMenuOpen)} className="flex items-center gap-1 md:gap-2 py-1.5 md:py-2 px-2 md:px-3 bg-white rounded-lg shadow-md text-xs md:text-sm hover:bg-gray-50 transition-all">
                  <LayersIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
                  <span className="hidden sm:inline">
                    {mapView.charAt(0).toUpperCase() + mapView.slice(1)}
                  </span>
                </button>
                {isMapMenuOpen && <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-md py-1 w-28 md:w-32 z-30">
                    <button onClick={() => handleMapStyleChange('standard')} className={`w-full text-left px-3 py-1.5 text-xs md:text-sm ${mapView === 'standard' ? 'bg-blue-50 text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
                      Standard
                    </button>
                    <button onClick={() => handleMapStyleChange('satellite')} className={`w-full text-left px-3 py-1.5 text-xs md:text-sm ${mapView === 'satellite' ? 'bg-blue-50 text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
                      Satellite
                    </button>
                    <button onClick={() => handleMapStyleChange('hybrid')} className={`w-full text-left px-3 py-1.5 text-xs md:text-sm ${mapView === 'hybrid' ? 'bg-blue-50 text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
                      Hybrid
                    </button>
                  </div>}
              </div>
            </div>
            {/* Map */}
            <div className="w-full h-full">
              <div ref={mapRef} className="w-full h-full"></div>
              {/* Map overlay when drawer is open */}
              {isDrawerOpen && <div className="absolute inset-0 bg-black bg-opacity-10 z-[900] transition-opacity duration-300" onClick={handleCloseDrawer}></div>}
              {/* In-Map Drawer - Desktop (Right Side) - Only render if not mobile */}
              {!isMobileView && <div className={`map-drawer map-drawer-desktop ${isDrawerOpen ? 'open' : ''}`}>
                  <div className="h-full flex flex-col">
                    <div className="drawer-content-scroll py-4 md:py-5 px-5 md:px-6 flex-1">
                      {renderDrawerContent()}
                    </div>
                    <div className="fade-gradient-top"></div>
                    <div className="fade-gradient-bottom"></div>
                  </div>
                  <div className="prevent-map-events"></div>
                </div>}
              {/* In-Map Drawer - Mobile (Bottom Sheet) - Only render if mobile */}
              {isMobileView && <div className={`map-drawer map-drawer-mobile ${isDrawerOpen ? 'open' : ''}`} style={{
              height: `${drawerHeight}px`
            }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                  {/* Handle bar for bottom sheet */}
                  <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-2 md:mb-3"></div>
                  <div className="relative flex-1 h-full">
                    <div className="px-4 md:px-5 pb-6 drawer-content-scroll" style={{
                  maxHeight: `${drawerHeight - 20}px`
                }}>
                      {renderDrawerContent()}
                    </div>
                    <div className="fade-gradient-top"></div>
                    <div className="fade-gradient-bottom"></div>
                  </div>
                  <div className="prevent-map-events"></div>
                </div>}
              {/* Map Info Footer */}
              <div className={`map-footer ${isDrawerOpen && isMobileView ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="text-xs sm:text-sm text-gray-600">
                  {selectedEmirateId ? `${filteredOrganizations.length} organization${filteredOrganizations.length !== 1 ? 's' : ''} in ${selectedEmirate?.emirate}${activeCategory ? ` (${categoryMapping[activeCategory as keyof typeof categoryMapping]?.label})` : ''}` : `${totalOrganizations} organizations across UAE`}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  {selectedEmirateId ? <button onClick={handleBackToUAE} className="text-primary text-xs sm:text-sm font-medium flex items-center gap-1 hover:underline">
                      <EyeIcon size={14} className="hidden sm:inline" />
                      View All
                    </button> : <button onClick={() => {}} className="text-gray-500 text-xs sm:text-sm flex items-center gap-1">
                      <InfoIcon size={14} className="hidden sm:inline" />
                      <span>Select an emirate</span>
                    </button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        /* Custom scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        /* Map section styling */
        .map-section-wrapper {
          position: relative;
          height: 65vh;
          min-height: 400px;
          max-height: 800px;
          z-index: 10;
          margin-bottom: 1.5rem;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        @media (min-width: 768px) {
          .map-section-wrapper {
            height: 70vh;
            min-height: 500px;
            margin-bottom: 2rem;
          }
        }
        @media (min-width: 1024px) {
          .map-section-wrapper {
            height: 75vh;
            min-height: 600px;
          }
        }
        /* Drawer styling */
        .map-drawer {
          background-color: white;
          border-radius: 1rem;
          box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition:
            transform 0.3s ease-out,
            opacity 0.3s ease-out;
          z-index: 1100;
        }
        .map-drawer-desktop {
          position: absolute;
          top: 1rem;
          bottom: 1rem;
          right: 1rem;
          width: 90%;
          max-width: 350px;
          transform: translateX(100%);
          opacity: 0;
        }
        @media (min-width: 768px) {
          .map-drawer-desktop {
            width: 60%;
            max-width: 400px;
          }
        }
        @media (min-width: 1024px) {
          .map-drawer-desktop {
            width: 40%;
            max-width: 450px;
          }
        }
        .map-drawer-desktop.open {
          transform: translateX(0);
          opacity: 1;
        }
        .map-drawer-mobile {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          border-radius: 1rem 1rem 0 0;
          transform: translateY(100%);
          opacity: 0;
          max-height: 85%;
        }
        .map-drawer-mobile.open {
          transform: translateY(0);
          opacity: 1;
        }
        .drawer-content-scroll {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          position: relative;
          height: 100%;
          scrollbar-width: thin;
        }
        .drawer-content-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .drawer-content-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .drawer-content-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        /* Fade gradients for scroll indication */
        .fade-gradient-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0) 100%
          );
          pointer-events: none;
          z-index: 1;
        }
        .fade-gradient-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(
            to top,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0) 100%
          );
          pointer-events: none;
          z-index: 1;
        }
        /* Filter bar styling */
        .filter-fade-left {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 40px;
          background: linear-gradient(
            to right,
            rgba(249, 250, 251, 1) 0%,
            rgba(249, 250, 251, 0) 100%
          );
          pointer-events: none;
          z-index: 10;
        }
        .filter-fade-right {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 40px;
          background: linear-gradient(
            to left,
            rgba(249, 250, 251, 1) 0%,
            rgba(249, 250, 251, 0) 100%
          );
          pointer-events: none;
          z-index: 10;
        }
        /* Map footer styling */
        .map-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.5rem 1rem;
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          border-top: 1px solid rgba(229, 231, 235, 0.5);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
          transition: opacity 0.3s ease;
        }
        /* Map container styling */
        .map-container {
          position: relative;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }
        /* Prevent map events */
        .prevent-map-events {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: none;
        }
        .drawer-content-scroll:hover ~ .prevent-map-events {
          display: block;
        }
        /* Map section sticky header */
        .map-section-sticky-header {
          position: relative;
          z-index: 20;
          background-color: rgba(249, 250, 251, 0.9);
          backdrop-filter: blur(8px);
          padding: 0.5rem 0;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        @media (min-width: 768px) {
          .map-section-sticky-header {
            padding: 0.75rem 0;
          }
        }
      `}</style>
    </section>;
};
export default EcosystemMap;