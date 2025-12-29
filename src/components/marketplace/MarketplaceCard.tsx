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

  // Navigate to the generic request form when the primary action is clicked
  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For courses listing, route to coming soon
    if (marketplaceType === 'courses') {
      navigate('/coming-soon');
      return;
    }

    // Navigate to the generic service request form
    console.log('Navigating to generic request form for:', item.title);
    navigate('/forms/request-service', { 
      state: { 
        service: item 
      } 
    });
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

  // Define gradients based on marketplace type
  const getGradient = () => {
    switch (marketplaceType) {
      case 'financial':
        return 'from-primary to-primary-light';
      case 'non-financial':
        return 'from-primary to-dfsa-gold';
      case 'courses':
        return 'from-dfsa-gold to-yellow-500';
      case 'events':
        return 'from-primary-dark to-primary';
      default:
        return 'from-gray-600 to-gray-400';
    }
  };

  const gradient = getGradient();

  // Default card layout for other marketplace types
  return (
    <div
      className="flex flex-col min-h-[340px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={onQuickView}
    >
      
      <div className="px-5 py-5 flex-grow flex flex-col">
        <div className="flex items-start mb-4">
          <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${gradient} p-0.5 flex-shrink-0 mr-4 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
             <div className="h-full w-full bg-white rounded-[7px] flex items-center justify-center overflow-hidden">
                <img
                    src="/logo/dfsa-logo.png"
                    alt={`${item.provider.name} logo`}
                    className="h-8 w-8 object-contain"
                />
             </div>
          </div>
          <div className="flex-grow min-h-[60px] flex flex-col justify-center">
            <h3 className="font-bold text-gray-900 line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">
              {item.provider.name}
            </p>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-5 flex-grow">
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {item.description}
          </p>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
            {displayTags.slice(0, 3).map((tag, index) => (
                <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
                >
                    {tag}
                </span>
            ))}
            {displayTags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                    +{displayTags.length - 3}
                </span>
            )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-3 relative z-10">
             <button
                onClick={handleViewDetails}
                className="px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                {config.secondaryCTA}
              </button>
              <button
                onClick={handlePrimaryAction}
                className="px-4 py-2 text-sm font-bold text-white rounded-lg bg-dfsa-gold hover:bg-yellow-600 hover:shadow-md hover:opacity-90 transition-all"
              >
                {config.primaryCTA}
              </button>
        </div>
      </div>
    </div>
  );
};