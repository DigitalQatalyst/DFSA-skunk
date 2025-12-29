import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { format, isPast } from 'date-fns';
interface EventPostContentProps {
  postId: string;
  event_date?: string;
  event_location?: string;
  metadata?: {
    start_datetime?: string;
    end_datetime?: string;
    location?: string;
    image?: string;
    rsvp_limit?: number;
    rsvp_count?: number;
    rsvp_enabled?: boolean;
    event_url?: string;
    description?: string;
  };
  content?: string;
  content_html?: string;
}
export function EventPostContent({
  postId,
  event_date,
  event_location,
  metadata,
  content,
  content_html
}: EventPostContentProps) {
  const [rsvpStatus, setRsvpStatus] = useState<'going' | 'maybe' | 'not-going' | null>(null);
  // Use metadata dates if available, fall back to event_date
  const startDateTime = metadata?.start_datetime || event_date;
  const endDateTime = metadata?.end_datetime;
  const location = metadata?.location || event_location;
  const isEventPast = startDateTime ? isPast(new Date(startDateTime)) : false;
  const formatEventDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'EEEE, MMMM d, yyyy h:mm a');
  };
  const handleRsvp = (status: 'going' | 'maybe' | 'not-going') => {
    setRsvpStatus(status);
    // In a real app, you would send this to the server
    console.log(`RSVP status for event ${postId}: ${status}`);
  };
  return <div className="space-y-6">
      {/* Event Banner */}
      {metadata?.image && <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          <img src={metadata.image} alt="Event cover" className="w-full h-48 sm:h-64 object-cover" onError={e => {
        e.currentTarget.style.display = 'none';
      }} />
        </div>}
      {/* Event Details Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date & Time */}
          {startDateTime && <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Date & Time</p>
                <p className="text-sm text-gray-600">
                  {formatEventDate(startDateTime)}
                </p>
                {endDateTime && <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
                    <span>Until {format(new Date(endDateTime), 'h:mm a')}</span>
                  </p>}
              </div>
            </div>}
          {/* Location */}
          {location && <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Location</p>
                <p className="text-sm text-gray-600">{location}</p>
              </div>
            </div>}
        </div>
        {/* RSVP Counter */}
        {metadata?.rsvp_enabled && <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-gray-500" />
              <span>
                {metadata.rsvp_count || 0}{' '}
                {metadata.rsvp_count === 1 ? 'person' : 'people'} attending
              </span>
              {metadata.rsvp_limit && <span className="text-xs text-gray-500">
                  (Limit: {metadata.rsvp_limit})
                </span>}
            </div>
            {/* RSVP Buttons */}
            {!isEventPast && <div className="flex items-center gap-2">
                <Button size="sm" variant={rsvpStatus === 'going' ? 'default' : 'outline'} className={rsvpStatus === 'going' ? 'bg-blue-600 hover:bg-blue-700' : ''} onClick={() => handleRsvp('going')}>
                  Going
                </Button>
                <Button size="sm" variant={rsvpStatus === 'maybe' ? 'default' : 'outline'} className={rsvpStatus === 'maybe' ? 'bg-amber-500 hover:bg-amber-600' : ''} onClick={() => handleRsvp('maybe')}>
                  Maybe
                </Button>
              </div>}
          </div>}
        {/* External Event Link */}
        {metadata?.event_url && <div className="pt-3 border-t border-gray-200">
            <a href={metadata.event_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              View event details
            </a>
          </div>}
      </div>
      {/* Event Description */}
      <div className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600">
        {content_html ? <div dangerouslySetInnerHTML={{
        __html: content_html
      }} /> : content ? <p className="whitespace-pre-wrap leading-relaxed">{content}</p> : metadata?.description ? <p className="whitespace-pre-wrap leading-relaxed">
            {metadata.description}
          </p> : null}
      </div>
      {/* Past Event Notice */}
      {isEventPast && <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <Calendar className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-800">
            This event has already taken place.
          </p>
        </div>}
    </div>;
}