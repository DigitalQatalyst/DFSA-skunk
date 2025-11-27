import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Building, Clock, Users, Globe, DollarSign, ArrowLeft, HomeIcon, ChevronRight } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { EventRegistrationModal } from './EventRegistrationModal';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_EVENTS } from '../../services/marketplaceQueries';

export const EventDetailsPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Fetch events from backend and find by ID
  const { data: eventsData, loading: eventsLoading, error: eventsError } = useQuery(GET_ALL_EVENTS);

  const raw = useMemo(() => {
    const items = (eventsData as any)?.products?.items || [];
    return items.find((p: any) => String(p?.id) === String(itemId));
  }, [eventsData, itemId]);

  const event = useMemo(() => {
    if (!raw) return undefined as any;
    const cf = (raw as any)?.customFields || {};
    const getFacetValue = (facetCode: string) => {
      const fv = ((raw as any)?.facetValues || []).find((f: any) => f?.facet?.code === facetCode);
      return fv ? fv.name : null;
    };
    let eventDateFormatted = '';
    if (cf.eventStartDate) {
      try {
        const d = new Date(cf.eventStartDate);
        if (!isNaN(d.getTime())) {
          eventDateFormatted = d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        }
      } catch {
        eventDateFormatted = cf.eventStartDate || '';
      }
    }
    const speakersArr = Array.isArray(cf.eventSpeakers) ? cf.eventSpeakers : [];
    const speakers = speakersArr.map((s: any) =>
      typeof s === 'string' ? { name: s, title: '', imageUrl: '' } : s
    );
    const agenda = Array.isArray(cf.eventAgenda) ? cf.eventAgenda : (cf.eventAgenda ? [String(cf.eventAgenda)] : []);
    const benefits = Array.isArray(cf.eventObjectives) ? cf.eventObjectives : (cf.eventObjectives ? [String(cf.eventObjectives)] : []);
    const requirements = Array.isArray(cf.eventRequirements)
      ? cf.eventRequirements
      : (cf.eventRequirements ? String(cf.eventRequirements).split('\n').filter(Boolean) : []);
    const duration = getFacetValue('duration-band') || cf.duration || '';
    return {
      id: (raw as any).id,
      title: (raw as any).name,
      description: (raw as any).description,
      type: cf.eventType || getFacetValue('event-type') || 'Event',
      date: eventDateFormatted,
      time: cf.eventTime || '',
      location: cf.eventLocation || '',
      organizer: cf.organiser || 'Event Organizer',
      capacity: cf.capacity || '',
      duration,
      agenda,
      speakers,
      benefits,
      requirements,
      galleryImages: [] as string[],
      imageUrl: undefined as string | undefined,
    };
  }, [raw]);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [itemId]);

  if (eventsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Loading event...</p>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/marketplace/events')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      
      <div className="flex-grow">
        {/* Hero Section with Event Image */}
        <div className="relative h-96 w-full overflow-hidden bg-gray-900">
          <img
            src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
            alt={event.title}
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              {/* Breadcrumbs */}
              <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                  <li className="inline-flex items-center">
                    <Link
                      to="/"
                      className="text-gray-300 hover:text-white inline-flex items-center text-sm"
                    >
                      <HomeIcon size={16} className="mr-1" />
                      <span>Home</span>
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <ChevronRight size={16} className="text-gray-400" />
                      <Link
                        to="/marketplace/events"
                        className="ml-1 text-gray-300 hover:text-white md:ml-2 text-sm"
                      >
                        Events
                      </Link>
                    </div>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <ChevronRight size={16} className="text-gray-400" />
                      <span className="ml-1 text-gray-400 md:ml-2 text-sm line-clamp-1">
                        {event.title}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>

              <div className="flex items-start gap-4 mb-4">
                <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg">
                  {event.type}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-white">
                <div className="flex items-center">
                  <Calendar className="mr-2" size={20} />
                  <span className="font-medium">{event.date}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2" size={20} />
                  <span className="font-medium">{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Building className="mr-2" size={20} />
                  <span className="font-medium">{event.organizer}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {event.description || `Join us for an exceptional event that brings together industry leaders, innovators, and 
                  professionals. This ${event.type.toLowerCase()} offers a unique opportunity to network, learn, 
                  and grow your business connections in Abu Dhabi's thriving business ecosystem.`}
                </p>
              </div>

              {/* Event Agenda */}
              {event.agenda && event.agenda.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Agenda</h2>
                  <div className="space-y-3">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex items-start border-l-4 border-blue-600 pl-4 py-2">
                        <span className="text-gray-700 text-lg">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Speakers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <img
                          src={speaker.imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'}
                          alt={speaker.name}
                          className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400';
                          }}
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{speaker.name}</p>
                          <p className="text-sm text-gray-600">{speaker.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {event.benefits && event.benefits.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Gain</h2>
                  <ul className="space-y-3">
                    {event.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-6 h-6 text-green-600 flex-shrink-0 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-lg">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {event.requirements && event.requirements.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-3">
                    {event.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-3 mt-2.5 flex-shrink-0" />
                        <span className="text-gray-700 text-lg">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Event Gallery */}
              {event.galleryImages && event.galleryImages.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.galleryImages.map((image, index) => (
                      <div key={index} className="relative h-48 overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`${event.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration CTA */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-8 text-white">
                <h3 className="text-2xl font-bold mb-3">Ready to Attend?</h3>
                <p className="text-green-50 mb-4 text-lg">
                  Secure your spot today! Registration is required to attend this event. 
                  Limited seats available, so register early to avoid disappointment.
                </p>
                <button
                  onClick={() => navigate('/coming-soon')}
                  className="px-8 py-3 bg-white text-green-600 hover:bg-gray-100 font-bold rounded-lg transition-colors text-lg"
                >
                  Register Now
                </button>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Event Details Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Event Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold text-gray-900">{event.date}</p>
                      </div>
                    </div>

                    {event.duration && (
                      <div className="flex items-start space-x-3">
                        <Clock className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-900">{event.duration}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3">
                      <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-semibold text-gray-900">{event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Building className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Organizer</p>
                        <p className="font-semibold text-gray-900">{event.organizer}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Globe className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Event Type</p>
                        <p className="font-semibold text-gray-900">{event.type}</p>
                      </div>
                    </div>

                    {event.capacity && (
                      <div className="flex items-start space-x-3">
                        <Users className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Capacity</p>
                          <p className="font-semibold text-gray-900">{event.capacity}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Register Button */}
                  <button
                    onClick={() => navigate('/coming-soon')}
                    className="w-full mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                  >
                    Register Now
                  </button>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => navigate('/marketplace/events')}
                  className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors flex items-center justify-center"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer isLoggedIn={false} />

      {/* Event Registration Modal */}
      {showRegistration && (
        <EventRegistrationModal
          event={event}
          onClose={() => setShowRegistration(false)}
        />
      )}
    </div>
  );
};
