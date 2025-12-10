import React from "react";
import { BellIcon, ExternalLinkIcon } from "lucide-react";

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  publishedOn: string;
  linkUrl: string;
  isExternal?: boolean;
}

interface AnnouncementsProps {
  isLoading: boolean;
  announcements?: Announcement[]; // Accept announcements from API (optional for now)
  error?: string | null;
  limit?: number;
  onViewAllClick?: () => void;
}

// Mock announcements data (temporary - will be removed when API integrated)
const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "New Funding Opportunities Available",
    summary: "Check out the new funding programs for small businesses in the technology sector.",
    publishedOn: "2025-11-20T00:00:00Z",
    linkUrl: "#",
    isExternal: false,
  },
  {
    id: "2",
    title: "System Maintenance Notice",
    summary: "The portal will be unavailable on November 25th from 22:00-23:00 for scheduled maintenance.",
    publishedOn: "2025-11-25T00:00:00Z",
    linkUrl: "#",
    isExternal: false,
  },
  {
    id: "3",
    title: "Updated Business Registration Process",
    summary: "We have simplified the business registration process. Learn about the changes.",
    publishedOn: "2025-11-15T00:00:00Z",
    linkUrl: "#",
    isExternal: false,
  },
];

export const Announcements: React.FC<AnnouncementsProps> = ({
  isLoading,
  announcements = mockAnnouncements, // Use mock data if not provided
  error,
  limit = 5,
  onViewAllClick,
}) => {
  const handleViewAllClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewAllClick?.();
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 p-4">
        Failed to load announcements: {error}
      </div>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <p className="text-gray-600 mb-2">No announcements</p>
        <p className="text-sm text-gray-500">Check back later for updates</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.slice(0, limit).map((announcement) => (
        <div
          key={announcement.id}
          className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-200 hover:bg-primary-50/30 transition-all hover:shadow-md"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <BellIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {announcement.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(announcement.publishedOn).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {announcement.summary}
              </p>
              <a
                href={announcement.linkUrl}
                target={announcement.isExternal ? "_blank" : "_self"}
                rel={announcement.isExternal ? "noopener noreferrer" : undefined}
                className="mt-2 inline-flex items-center text-xs font-medium text-primary hover:text-primary-dark"
              >
                Read more
                {announcement.isExternal && <ExternalLinkIcon className="ml-1 h-3 w-3" />}
              </a>
            </div>
          </div>
        </div>
      ))}
      <div className="pt-2 text-center">
        <button
          onClick={handleViewAllClick}
          className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
        >
          View All Announcements
        </button>
      </div>
    </div>
  );
};
