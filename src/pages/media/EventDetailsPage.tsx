import React, { useEffect, useState, Component } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockEvents, Event as EventType } from "../../utils/mockEvents";
import { downloadICSFile, formatDate, formatTime } from "../../utils/dateUtils";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Share2,
  Mail,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Linkedin,
} from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { getSupabaseKnowledgeHub } from "../../lib/supabase";
import { useAuth } from "../../components/Header/context/AuthContext";
export const EventDetailsPage: React.FC = () => {
  const { type, id } = useParams<{
    type: string;
    id: string;
  }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventType | undefined>(
    mockEvents.find((e: EventType) => e.id === id)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});
  // Simulate loading event data
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulate API call with timeout
    const fetchTimeout = setTimeout(async () => {
      try {
        const { data: foundEvent } = await getSupabaseKnowledgeHub()
          // .schema("admin")
          .from("v_media_all")
          .select("*")
          .eq("id", id)
          .single();
        if (foundEvent) {
          console.log(foundEvent);
          setEvent(foundEvent);
          setLoading(false);
        } else {
          setError("Event not found");
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to load event details. Please try again.");
        setLoading(false);
      }
    }, 800); // Simulate network delay
    return () => clearTimeout(fetchTimeout);
  }, [id, type]);
  // Toggle FAQ expansion
  const toggleFaq = (index: number) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  // Handle "Add to Calendar" action
  const handleAddToCalendar = () => {
    downloadICSFile({
      title: eventData.title,
      description: eventData.description,
      startDateTime: eventData.startDateTime,
      endDateTime: eventData.endDateTime,
      location:
        eventData.location.mode === "in_person"
          ? [
              eventData.location.venue,
              eventData.location.city,
              eventData.location.country,
            ]
              .filter(Boolean)
              .join(", ")
          : "Virtual Event",
    });
  };
  // Handle registration
  const { login } = useAuth();

  const handleRegister = () => {
    login();
  };
  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: eventData.title,
          text: eventData.description,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      const shareText = `${eventData.title}\n\n${eventData.description}\n\n${window.location.href}`;
      alert(shareText);
    }
  };

  // Handle contact organizer
  const handleContactOrganizer = () => {
    window.location.href =
      "mailto:organizer@example.com?subject=" +
      encodeURIComponent(`Question about ${eventData.title}`);
  };

  // Format dates
  const formatEventDate = () => {
    try {
      if (!eventData?.startDateTime || !eventData?.endDateTime)
        return "Date not available";

      const startDate = new Date(eventData.startDateTime);
      const endDate = new Date(eventData.endDateTime);

      // Check for invalid dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return "Invalid date";
      }

      // Check if event spans multiple days
      const isMultiDay = startDate.toDateString() !== endDate.toDateString();
      if (isMultiDay) {
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
      }
      return formatDate(startDate);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date not available";
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="lg:w-1/3">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Event not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the event you're looking for.
          </p>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              navigate("/#events", {
                state: { activeTab: "events" },
                replace: true,
              });
            }}
          >
            Back to Events
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Format event times with fallbacks
  const startDate = event?.start_at ? new Date(event.start_at) : new Date();
  const endDate = event?.end_at ? new Date(event.end_at) : new Date();
  const timezone = event?.timezone || "GST";
  const formattedTime = `${formatTime(startDate)} - ${formatTime(
    endDate
  )} ${timezone}`;

  // Fallback event data
  const eventData = {
    id: event?.id,
    slug: event?.slug || "default-event",
    title: event?.title || "Entrepreneurship Summit 2024",
    description: event?.summary || "Join us for an exciting event!",
    category: event?.tags || "Conference",
    startDateTime: event?.start_at || new Date().toISOString(),
    endDateTime: event?.end_at || new Date(Date.now() + 3600000).toISOString(),
    timezone: event?.timezone || "GST",
    location: {
      mode: event?.location?.mode || "in_person",
      venue: event?.venue || "Abu Dhabi National Exhibition Centre",
      city: event?.location?.city || "Abu Dhabi",
      country: event?.location?.country || "UAE",
      meetingUrl: event?.location?.meetingUrl || "#",
    },
    priceType: event?.priceType || "free",
    ticketTypes: event?.ticketTypes?.length
      ? event.ticketTypes
      : [
          {
            id: "1-1",
            name: "Standard",
            price: 0,
            currency: "USD",
            remaining: 100,
          },
          {
            id: "1-2",
            name: "Premium",
            price: 100,
            currency: "USD",
            remaining: 50,
          },
          {
            id: "1-3",
            name: "VIP",
            price: 200,
            currency: "USD",
            remaining: 25,
          },
        ],
    capacity: {
      total: event?.event_agenda?.registration?.capacity || 0,
      open: event?.event_agenda?.registration?.open || false,
      remaining: event?.event_agenda?.registration?.remaining || 0,
    },
    imageUrl:
      event?.thumbnail_url ||
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: event?.tags?.length ? event.tags : ["Event", "Networking"],
    popularityScore: event?.popularityScore || 85,
    speakers: event?.event_agenda?.speakers?.length
      ? event.event_agenda.speakers
      : [
          {
            id: "s3",
            name: "Fatima Rahman",
            title: "Digital Marketing Director, TechGrowth",
            bio: "Fatima has over 15 years of experience in digital marketing and has helped hundreds of businesses improve their online presence.",
            avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
            linkedinUrl: "https://linkedin.com",
          },
        ],
    agenda: event?.event_agenda?.agenda?.length
      ? event.event_agenda.agenda
      : [
          {
            time: event?.event_agenda?.agenda?.time || "09:00 - 10:00",
            session:
              event?.event_agenda?.agenda?.session ||
              "Opening Keynote: The Future of Entrepreneurship",
            speakername:
              event?.event_agenda?.agenda?.speaker || "Sarah Al Amiri",
          },
          {
            time: event?.event_agenda?.agenda?.time || "10:15 - 11:15",
            session:
              event?.event_agenda?.agenda?.session ||
              "Panel Discussion: Securing Funding in 2024",
            speakername: event?.event_agenda?.agenda?.speaker || "Ahmed Khan",
          },
        ],
    overview:
      event?.overview ||
      "This comprehensive masterclass covers all aspects of digital marketing, from SEO and content marketing to social media and analytics. Participants will leave with practical knowledge they can immediately apply to their businesses.",
    objectives: event?.event_agenda?.objectives?.length
      ? event.event_agenda.objectives
      : [
          "Connect entrepreneurs with potential investors and partners",
          "Share insights on current market trends and opportunities",
          "Provide practical workshops on business growth strategies",
          "Showcase innovative startups and their solutions",
        ],
    whoShouldAttend:
      event?.event_agenda?.whoShouldAttend ||
      "Business owners, startup founders, investors, business development professionals, and anyone interested in entrepreneurship and innovation.",
    resources: event?.event_agenda?.resources?.length
      ? event.event_agenda.resources
      : [
          {
            title: "Event Brochure",
            url: "#",
            type: "PDF",
          },
        ],
    faqs: event?.faqs?.length
      ? event.faqs
      : [
          {
            question: "How can I register?",
            answer:
              "You can register by clicking the Register button on this page.",
          },
        ],
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Back to events link */}
        <div className="mb-6">
          <button
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            onClick={() => {
              navigate("/#knowledge-hub", {
                state: { activeTab: "events" },
                replace: true,
              });
            }}
          >
            <ChevronUp size={20} className="rotate-90 mr-1" />
            Back to Events
          </button>
        </div>
        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content column */}
          <div className="lg:w-2/3">
            {/* Event header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center mb-3">
                {eventData.category
                  ? eventData.category.map((tag) => (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mt-2">
                        {tag}
                      </span>
                    ))
                  : null}
                <span
                  className={`text-xs mt-2 font-medium px-2.5 py-0.5 rounded-full ${
                    eventData.capacity.open
                      ? "bg-green-100 text-green-800"
                      : eventData.capacityStatus === "waitlist"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {eventData.capacity.open
                    ? "Open"
                    : eventData.capacityStatus === "waitlist"
                    ? "Waitlist"
                    : "Full"}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {eventData.title}
              </h1>
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
                <span className="inline-flex items-center mr-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatEventDate()}
                </span>
                <span className="inline-flex items-center mr-4">
                  <Clock className="h-4 w-4 mr-1" />
                  {formattedTime}
                </span>
                <span className="inline-flex items-center">
                  {eventData.location.mode === "in_person" ? (
                    <>
                      <MapPin className="h-4 w-4 mr-1" />
                      {[
                        eventData.location.venue,
                        // eventData.location.city,
                        // eventData.location.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4 mr-1" />
                      Virtual Event
                    </>
                  )}
                </span>
              </div>
            </div>
            {/* Event image */}
            {eventData?.imageUrl && (
              <div className="mb-8">
                <img
                  src={eventData.imageUrl}
                  alt={eventData.title}
                  className="w-full h-auto rounded-lg object-cover"
                  style={{
                    maxHeight: "400px",
                  }}
                  onError={(e) => {
                    // Fallback image if the provided URL fails to load
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
                  }}
                />
              </div>
            )}
            {/* Event overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Overview
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p>{eventData.description}</p>
              </div>
            </div>
            {/* Event objectives */}
            {eventData.objectives.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What You'll Learn
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {eventData.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Who should attend */}
            {eventData.whoShouldAttend && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Who Should Attend
                </h2>
                <p className="text-gray-600">{eventData.whoShouldAttend}</p>
              </div>
            )}
            {/* Agenda */}
            {eventData.agenda.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Event Agenda
                </h2>
                <div className="space-y-4">
                  {eventData.agenda.map((item, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4 py-1"
                    >
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-medium text-gray-900">
                          {item.session}
                        </h4>
                        <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                          {item.time}
                        </span>
                      </div>
                      {item.speakername && (
                        <p className="text-sm text-gray-600">
                          Speaker: {item.speakerName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Speakers */}
            {eventData.speakers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Speakers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventData.speakers.map((speaker) => (
                    <div
                      key={speaker.id}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={speaker.avatarUrl}
                        alt={speaker.name}
                        className="h-16 w-16 rounded-full object-cover"
                        onError={(e) => {
                          // Fallback avatar if the provided URL fails to load
                          (e.target as HTMLImageElement).src =
                            "https://randomuser.me/api/portraits/lego/1.jpg";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {speaker.name}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {speaker.role}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {speaker.bio}
                        </p>
                        <a
                          href={speaker.linkedinUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-2 text-sm"
                          onClick={(e) => {
                            if (!speaker.linkedinUrl) {
                              e.preventDefault();
                              alert("LinkedIn profile not available");
                            }
                          }}
                        >
                          <Linkedin className="h-4 w-4 mr-1" />
                          Connect
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Resources */}
            {eventData.resources.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Resources
                </h2>
                <div className="space-y-2">
                  {eventData.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        if (resource.url === "#") {
                          e.preventDefault();
                          alert("Resource not available");
                        }
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {resource.title} ({resource.type})
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {/* FAQs */}
            {eventData.faqs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {eventData.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full px-4 py-3 text-left font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex justify-between items-center"
                        onClick={() => toggleFaq(index)}
                      >
                        <span className="text-left">{faq.question}</span>
                        {expandedFaqs[index] ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
                        )}
                      </button>
                      {expandedFaqs[index] && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Sidebar column */}
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-4">
              {/* Registration card */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Registration
                </h3>
                {/* Ticket types */}
                <div className="space-y-4 mb-6">
                  {eventData?.ticketTypes?.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {ticket.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {ticket.price === 0
                            ? "Free"
                            : `${ticket.price} ${ticket.currency}`}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {ticket.remaining > 0 ? (
                          <span>{ticket.remaining} remaining</span>
                        ) : (
                          <span className="text-red-600">Sold out</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Registration status */}
                <div className="mb-6">
                  <div
                    className={`flex items-center p-3 rounded-lg text-sm font-medium ${
                      eventData.capacity.open
                        ? "bg-green-100 text-green-800"
                        : event.capacityStatus === "waitlist"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <Users size={18} className="mr-2" />
                    {eventData.capacity.open
                      ? "Registration is open"
                      : event.capacityStatus === "waitlist"
                      ? "Waitlist available"
                      : "Event is full"}
                  </div>
                </div>
                {/* Register button */}
                <button
                  className={`w-full py-2 px-4 rounded-md font-medium ${
                    !eventData.capacity.open
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={handleRegister}
                  disabled={!eventData.capacity.open}
                >
                  {event.capacityStatus === "waitlist"
                    ? "Join waitlist"
                    : "Register now"}
                </button>
              </div>
              {/* Date and calendar */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Date & Time
                    </h3>
                    <p className="text-gray-600">{formatEventDate()}</p>
                    <p className="text-gray-600">{formattedTime}</p>
                  </div>
                  <button
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                    onClick={handleAddToCalendar}
                  >
                    <Calendar size={16} className="mr-1" />
                    Add to Calendar
                  </button>
                </div>
                {/* Location */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Location
                  </h3>
                  {event?.location?.mode === "in_person" ? (
                    <div>
                      <p className="text-gray-600 mb-2">
                        {event.location?.venue}
                        <br />
                        {event.location?.city}, {event.location?.country}
                      </p>
                      {/* Map placeholder */}
                      <div className="bg-gray-200 rounded-lg h-40 flex items-center justify-center">
                        <MapPin size={24} className="text-gray-400" />
                        <span className="ml-2 text-gray-500">
                          Map would be displayed here
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Video size={18} className="mr-2 flex-shrink-0" />
                        <span>Virtual Event</span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Meeting link will be provided after registration.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                  <button
                    className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-md font-medium hover:bg-gray-200 flex items-center justify-center"
                    onClick={handleShare}
                  >
                    <Share2 size={18} className="mr-2" />
                    Share Event
                  </button>
                  <button
                    className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-md font-medium hover:bg-gray-200 flex items-center justify-center"
                    onClick={handleContactOrganizer}
                  >
                    <Mail size={18} className="mr-2" />
                    Contact Organizer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
