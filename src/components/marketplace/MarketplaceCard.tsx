import React, { useState } from 'react';
import { BookmarkIcon, ScaleIcon, Calendar, MapPin, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig';

export interface MarketplaceItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    provider: {
      name: string;
      logoUrl: string;
    };
    tags?: string[];
    category?: string;
    deliveryMode?: string;
    formUrl?: string; // Internal route for the form
    imageUrl?: string; // Image URL for events
    date?: string; // Date for events
    type?: string; // Type for events
    location?: string; // Location for events
    organizer?: string; // Organizer for events
    [key: string]: any;
  };
  marketplaceType: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onAddToComparison: () => void;
  onQuickView: () => void;
}

export const MarketplaceCard: React.FC<MarketplaceItemProps> = ({
  item,
  marketplaceType,
  isBookmarked,
  onToggleBookmark,
  onAddToComparison,
  onQuickView
}) => {
  const navigate = useNavigate();
  const config = getMarketplaceConfig(marketplaceType);
  
  

  // Generate route based on marketplace type
  const getItemRoute = () => {
    return `${config.route}/${item.id}`;
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('View Details Clicked - Navigating to:', getItemRoute());
    navigate(getItemRoute());
  };

  // Navigate to the formUrl when the primary action is clicked
  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Log item details for debugging
    console.log('Primary Action Clicked:', {
      itemId: item.id,
      itemTitle: item.title,
      formUrl: item.formUrl,
      marketplaceType,
    });
    // For courses listing, route to coming soon
    if (marketplaceType === 'courses') {
      navigate('/coming-soon');
      return;
    }
    // Apply external fallback if formUrl is null/falsy
    const effectiveUrl = item.formUrl || "https://www.tamm.abudhabi/en/login";
    // Handle external: open in new tab
    if (effectiveUrl.startsWith('http')) {
      window.open(effectiveUrl, '_blank', 'noopener,noreferrer');
      console.log('Opening external URL:', effectiveUrl);
      return;
    }
    // Internal route: normalize with /forms/ prefix if needed
    const targetUrl = effectiveUrl.startsWith('/forms/') ? effectiveUrl : `/forms/${effectiveUrl}`;
    console.log('Navigating to internal route:', targetUrl);
    navigate(targetUrl);
  };

  // Display tags if available, otherwise use category and deliveryMode
  const displayTags = item.tags || [item.category, item.deliveryMode].filter(Boolean);

  // Log item props on render to verify formUrl presence
  console.log('MarketplaceCard Rendered:', {
    itemId: item.id,
    itemTitle: item.title,
    formUrl: item.formUrl,
    marketplaceType,
  });

  // Render event card layout for events marketplace
  if (marketplaceType === 'events') {
    return (
      <>
        <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          {/* Event Image with Date Badge */}
          <div className="relative h-48 overflow-hidden bg-gray-200">
            <img
              src={item.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';
              }}
            />
            {item.date && (
              <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-md shadow-md">
                <span className="text-xs font-semibold text-gray-700">{item.date}</span>
              </div>
            )}
          </div>

          {/* Event Content */}
          <div className="p-4 flex-grow flex flex-col">
            {/* Event Title */}
            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
              {item.title}
            </h3>

            {/* Event Type and Location */}
            <p className="text-sm text-gray-600 mb-4">
              {item.type} at {item.location}
            </p>

            {/* Event Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-2 flex-shrink-0" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Building size={14} className="mr-2 flex-shrink-0" />
                <span>{item.organizer || item.provider.name}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={14} className="mr-2 flex-shrink-0" />
                <span>{item.location}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/marketplace/events/${item.id}`);
                }}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                View Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/coming-soon');
                }}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default card layout for other marketplace types
  return (
    <div
      className="flex flex-col min-h-[340px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
      onClick={onQuickView}
    >
      {/* Card Header with fixed height for title and provider */}
      <div className="px-4 py-5 flex-grow flex flex-col">
        <div className="flex items-start mb-5">
          <img
            src={item.provider.logoUrl}
            alt={`${item.provider.name} logo`}
            className="h-12 w-12 object-contain rounded-lg bg-gray-50 p-2 flex-shrink-0 mr-3"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/mzn_logo.png";
            }}
          />
          <div className="flex-grow min-h-[72px] flex flex-col justify-center">
            <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[48px] leading-snug">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 min-h-[20px] mt-1">
              {item.provider.name}
            </p>
          </div>
        </div>
        {/* Description with consistent height */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
            {item.description}
          </p>
        </div>
        {/* Tags and Actions in same row - fixed position */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-wrap gap-1 max-w-[70%]">
            {displayTags.map((tag, index) => <span key={index} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium truncate ${index === 0 ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                {tag}
              </span>)}
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            {/* <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Bookmark Clicked:', { itemId: item.id, isBookmarked });
                onToggleBookmark();
              }}
              className={`p-1.5 rounded-full ${
                isBookmarked
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <BookmarkIcon size={16} className={isBookmarked ? 'fill-yellow-600' : ''} />
            </button> */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Compare Clicked:', { itemId: item.id });
                onAddToComparison();
              }}
              className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              aria-label="Add to comparison"
              title="Add to comparison"
            >
              <ScaleIcon size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Card Footer - with two buttons */}
      <div className="mt-auto border-t border-gray-100 p-4 pt-5">
        <div className="flex justify-between gap-2">
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap min-w-[120px] flex-1"
          >
            {config.secondaryCTA}
          </button>
          <button
            onClick={handlePrimaryAction}
            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap flex-1"
          >
            {config.primaryCTA}
          </button>
        </div>
      </div>
    </div>
  );
};