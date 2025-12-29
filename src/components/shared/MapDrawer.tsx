import React from 'react';
import { XIcon, ArrowLeftIcon, BuildingIcon, GlobeIcon, LinkIcon, PhoneIcon, MailIcon } from 'lucide-react';

interface MapDrawerProps {
  isOpen: boolean;
  position: 'right' | 'bottom';
  isMobile: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
}

export function MapDrawer({
  isOpen,
  position,
  isMobile,
  onClose,
  children,
  height = 300,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}: MapDrawerProps) {
  const drawerClasses = `
    map-drawer
    ${position === 'right' ? 'map-drawer-desktop' : 'map-drawer-mobile'}
    ${isOpen ? 'open' : ''}
  `;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black bg-opacity-10 z-[900] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={drawerClasses}
        style={position === 'bottom' ? { height: `${height}px` } : undefined}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Handle bar for mobile bottom sheet */}
        {isMobile && position === 'bottom' && (
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-2" />
        )}

        <div className="h-full flex flex-col">
          <div className="drawer-content-scroll py-4 md:py-5 px-5 md:px-6 flex-1">
            {children}
          </div>
          <div className="fade-gradient-top" />
          <div className="fade-gradient-bottom" />
        </div>
        <div className="prevent-map-events" />
      </div>

      <style jsx>{`
        .map-drawer {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: transform 0.3s ease-out, opacity 0.3s ease-out;
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

        .prevent-map-events {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: none;
        }

        .drawer-content-scroll:hover ~ .prevent-map-events {
          display: block;
        }
      `}</style>
    </>
  );
}

interface CategoryDrawerContentProps {
  categoryInfo: any;
  organizations: any[];
  onClose: () => void;
  onOrganizationClick: (orgId: string) => void;
}

export function CategoryDrawerContent({
  categoryInfo,
  organizations,
  onClose,
  onOrganizationClick
}: CategoryDrawerContentProps) {
  return (
    <div className="h-full flex flex-col content-fade">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-primary mb-2">{categoryInfo.label}</h3>
          <p className="text-sm text-gray-600">
            {organizations.length} organization{organizations.length !== 1 ? 's' : ''} in this category
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close panel"
        >
          <XIcon size={20} />
        </button>
      </div>

      {/* Organizations List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {organizations.map((org) => (
          <div
            key={org.id}
            onClick={() => onOrganizationClick(org.id)}
            className="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {org.name}
              </h4>
              <div className={`px-2 py-1 rounded-full text-xs ${categoryInfo.color.bg} ${categoryInfo.color.text}`}>
                {org.type}
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{org.description}</p>
            {org.address && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <GlobeIcon size={12} />
                <span>{org.address}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .content-fade {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

interface OrganizationDrawerContentProps {
  organization: any;
  categoryInfo: any;
  onClose: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function OrganizationDrawerContent({
  organization,
  categoryInfo,
  onClose,
  onBack,
  showBackButton = false
}: OrganizationDrawerContentProps) {
  const [showMore, setShowMore] = React.useState(false);

  return (
    <div className="h-full flex flex-col content-fade">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="text-primary hover:text-primary-dark transition-colors text-sm font-medium flex items-center gap-1 mb-2"
            >
              <ArrowLeftIcon size={14} />
              <span>Back</span>
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close panel"
        >
          <XIcon size={20} />
        </button>
      </div>

      {/* Category Badge */}
      <div
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${categoryInfo.color.bg} ${categoryInfo.color.text}`}
      >
        {categoryInfo.label}
      </div>

      {/* Organization Name */}
      <h3 className="text-xl font-bold text-primary mb-4">{organization.name}</h3>

      {/* Organization Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <BuildingIcon size={18} className="text-gray-400 mt-0.5" />
          <div>
            <div className="text-sm text-gray-500">Type</div>
            <div className="font-medium">{organization.type}</div>
          </div>
        </div>

        {organization.address && (
          <div className="flex items-start gap-3">
            <GlobeIcon size={18} className="text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500">Location</div>
              <div className="font-medium">{organization.address}</div>
            </div>
          </div>
        )}

        {organization.phone && (
          <div className="flex items-start gap-3">
            <PhoneIcon size={18} className="text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div className="font-medium">{organization.phone}</div>
            </div>
          </div>
        )}

        {organization.email && (
          <div className="flex items-start gap-3">
            <MailIcon size={18} className="text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{organization.email}</div>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <div className={`text-sm text-gray-600 ${!showMore ? 'line-clamp-3' : ''}`}>
          {organization.description}
        </div>
        {organization.description && organization.description.length > 150 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-primary text-sm font-medium mt-1 flex items-center hover:underline"
          >
            {showMore ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Services */}
      {organization.services && organization.services.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Services</h4>
          <div className="flex flex-wrap gap-2">
            {organization.services.map((service: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <a
          href={organization.link}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 w-full justify-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkIcon size={16} />
          Visit Website
        </a>
      </div>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .content-fade {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
