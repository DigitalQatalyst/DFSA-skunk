import React from "react";
import { BasePost } from "../types";
import { Calendar, MapPin, Users } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
interface PostCardEventProps {
  post: BasePost;
}
export const PostCardEvent: React.FC<PostCardEventProps> = ({ post }) => {
  const eventDate = post.event_date ? new Date(post.event_date) : null;
  const isPastEvent = eventDate && eventDate < new Date();

  // Helper to format location - show domain for URLs, full text for addresses
  const formatLocation = (location: string) => {
    try {
      const url = new URL(location);
      return url.hostname.replace("www.", "");
    } catch {
      return location;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2.5 sm:gap-3">
        {/* Date Badge - Smaller on mobile */}
        {eventDate && (
          <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 border-2 border-blue-200 rounded-lg flex flex-col items-center justify-center">
            <div className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase">
              {format(eventDate, "MMM")}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-700 leading-none">
              {format(eventDate, "d")}
            </div>
            {/* Status badge overlay on mobile - for both past and upcoming */}
            <div className="absolute -top-2 -right-2 sm:hidden">
              {isPastEvent ? (
                <div className="bg-gray-500 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                  ended
                </div>
              ) : (
                <div className="bg-blue-600 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  {formatDistanceToNow(eventDate, { addSuffix: false })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
          {/* Event Details - Stacked vertically for better mobile layout */}
          <div className="space-y-1">
            {eventDate && (
              <div className="hidden sm:flex items-start gap-1.5">
                <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  {/* Date with status - only shows on desktop */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm text-gray-700 font-medium">
                      {format(eventDate, "EEEE, MMMM d, yyyy")}
                    </span>
                    {/* Status text only on desktop - mobile uses badge overlay */}
                    {isPastEvent ? (
                      <span className="text-xs text-gray-500 font-medium">
                        • ended
                      </span>
                    ) : (
                      <span className="text-xs text-blue-60t-xs text-blue-600 font-medium">
                        • {formatDistanceToNow(eventDate, { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {post.event_location && (
              <div className="flex items-start gap-1.5">
                <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span
                  className="text-sm text-gray-600 truncate"
                  title={post.event_location}
                >
                  {formatLocation(post.event_location)}
                </span>
              </div>
            )}

            {post.metadata?.rsvp_count && (
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  {post.metadata.rsvp_count} attending
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {post.content && (
        <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
      )}
    </div>
  );
};
