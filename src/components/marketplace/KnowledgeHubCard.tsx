import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MediaCard } from "../Cards/MediaCard";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Calendar,
  Clock,
  MapPin,
  Download,
  FileText,
  BookOpen,
  Tag,
} from "lucide-react";
import { getVideoDuration, VideoDurationInfo } from "../../utils/videoUtils";
import {
  getAudioUrl,
  getVideoUrl,
  getPosterUrl,
  getDuration,
  isAudioItem,
  isVideoItem,
} from "../../utils/mediaSelectors";
// Helper function to resolve the primary audio URL
const resolveAudioUrl = (item: any): string | null => {
  return getAudioUrl(item);
};
export interface KnowledgeHubItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    mediaType?: string;
    provider: {
      name: string;
      logoUrl: string;
    };
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
    processedAudioUrl?: string;
    tags?: string[];
    date?: string;
    downloadCount?: number;
    fileSize?: string;
    duration?: string;
    location?: string;
    category?: string;
    format?: string;
    popularity?: string;
    episodes?: number;
    lastUpdated?: string;
    domain?: string;
    businessStage?: string;
    primaryAuthor?: {
      name?: string | null;
      slug?: string | null;
      photoUrl?: string | null;
      title?: string | null;
      organization?: string | null;
    } | null;
    authors?: Array<{
      name?: string | null;
      slug?: string | null;
      photoUrl?: string | null;
      title?: string | null;
      organization?: string | null;
    }>;
    authorsCount?: number;
    authorSlugs?: string[];
    [key: string]: any;
  };
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onAddToComparison?: () => void;
  onQuickView?: () => void;
  forceProviderMode?: boolean; // When true, always use provider name with Building icon instead of author
}
// Utility function to get the details href for an item
const slugify = (value: string) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

// Try to infer a media type when it's missing
const inferMediaType = (item: KnowledgeHubItemProps["item"]): string => {
  const direct = (item.mediaType ?? "").toString().trim();
  if (direct) return direct;
  const fromFormat = (item.format ?? "").toString().toLowerCase();
  if (fromFormat.includes("event")) return "event";
  if (fromFormat.includes("podcast")) return "podcast";
  if (fromFormat.includes("video") || fromFormat.includes("recorded"))
    return "video";
  if (fromFormat.includes("template") || fromFormat.includes("tool"))
    return "toolkits & templates";
  if (fromFormat.includes("report")) return "report";
  if (fromFormat.includes("guide")) return "guide";
  // Last resort: look at tags
  const tagsJoined = Array.isArray(item.tags)
    ? item.tags.map((t) => String(t).toLowerCase()).join(" ")
    : "";
  if (tagsJoined.includes("event")) return "event";
  if (tagsJoined.includes("podcast")) return "podcast";
  if (tagsJoined.includes("video")) return "video";
  if (tagsJoined.includes("report")) return "report";
  if (tagsJoined.includes("guide")) return "guide";
  return "resource";
};

const getDetailsHref = (item: KnowledgeHubItemProps["item"]): string => {
  if (item.mediaType === "event") {
    return `/event/${item.id}`;
  }
  return `/media/${item.mediaType}/${item.id}`;
};
export const KnowledgeHubCard: React.FC<KnowledgeHubItemProps> = ({
  item,
  isBookmarked,
  onToggleBookmark,
  onAddToComparison,
  onQuickView,
  forceProviderMode = false,
}) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoDuration, setVideoDuration] = useState<VideoDurationInfo>({
    seconds: 0,
    formatted: "",
    available: false,
  });
  const detailsHref = getDetailsHref(item);
  // Get video duration on component mount
  useEffect(() => {
    if (isVideoItem(item)) {
      const durationInfo = getDuration(item);
      setVideoDuration(durationInfo);
    }
  }, [item]);
  // Update video duration when video metadata is loaded
  useEffect(() => {
    const video = videoRef.current;
    if (video && isVideoItem(item)) {
      const handleLoadedMetadata = () => {
        const updatedDuration = getDuration(item, video);
        setVideoDuration(updatedDuration);
      };
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [videoRef.current, item]);
  // Runtime check for valid href
  useEffect(() => {
    if (!detailsHref || detailsHref === "#" || detailsHref === "about:blank") {
      console.warn(
        `Warning: Invalid href for item ${item.id}: "${detailsHref}"`
      );
    }
  }, [detailsHref, item.id]);
  // Format date to display as "Jan 12, 2024"
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "";
    }
  };
  // Ensure description is plain text (strip any visible HTML)
  const plainDescription = (item.description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  // Build metadata and badges for MediaCard to render
  const buildMetadataAndBadges = () => {
    // Date: prefer lastUpdated, otherwise date
    const dateToUse = item.lastUpdated || item.date
    const formattedDate = formatDate(dateToUse)
    
    // Base metadata common to most content types
    const baseMeta: Record<string, any> = {};
    if (formattedDate) baseMeta.date = formattedDate;
    
    // If forceProviderMode is true, skip author processing and always use provider
    if (forceProviderMode) {
      // Always use provider name with Building icon
      if (item.provider?.name) {
        baseMeta.author = item.provider.name
      }
    } else {
      // Normal author processing
      const authorsArray = Array.isArray(item.authors) ? item.authors.filter((a) => a && a.name) : []
      const primaryAuthor = item.primaryAuthor && item.primaryAuthor.name
        ? item.primaryAuthor
        : authorsArray.length > 0
          ? authorsArray[0]
          : null
      const primaryAuthorName = primaryAuthor?.name || null
      const additionalAuthorsCount = Math.max(
        0,
        (typeof item.authorsCount === 'number'
          ? item.authorsCount
          : authorsArray.length) - (primaryAuthorName ? 1 : 0),
      )
      const authorLabel = primaryAuthorName
        ? `${primaryAuthorName}${additionalAuthorsCount > 0 ? ` +${additionalAuthorsCount}` : ''}`
        : (item.provider?.name || '')

      if (primaryAuthorName) {
        baseMeta.primaryAuthor = {
          name: primaryAuthorName,
          slug: primaryAuthor?.slug || null,
          photoUrl: primaryAuthor?.photoUrl || null,
          title: primaryAuthor?.title || null,
          organization: primaryAuthor?.organization || null,
        }
        baseMeta.additionalAuthorsCount = additionalAuthorsCount
        baseMeta.additionalAuthorsNames = authorsArray.slice(1).map((a) => a?.name).filter(Boolean)
        if (primaryAuthor?.organization) {
          baseMeta.primaryAuthorOrganization = primaryAuthor.organization
        }
        baseMeta.author = authorLabel
      } else if (authorLabel) {
        baseMeta.author = authorLabel
      }
    }

    // Type-specific enrichments
    const type = getCardType();
    if (type === "event") {
      if (item.location) baseMeta.location = item.location;
      if (formattedDate) baseMeta.date = formattedDate;
    }
    if (type === "resource") {
      if (item.fileSize) baseMeta.fileSize = item.fileSize;
      if (item.downloadCount) baseMeta.downloadCount = item.downloadCount;
      // For resources show last updated if available
      if (item.lastUpdated) baseMeta.updated = formatDate(item.lastUpdated);
    }
    if (type === "video" || type === "podcast") {
      // Prefer computed duration if available
      const durationInfo = getDuration(item);
      if (durationInfo?.available && durationInfo.formatted) {
        baseMeta.duration = durationInfo.formatted;
      } else if (item.duration) {
        baseMeta.duration = item.duration;
      }
    }

    // Pills: Only Media Type and Category/Domain (2 tags max)
    const mediaType = (() => {
      const raw = inferMediaType(item);
      try {
        return raw
          .split(" ")
          .map((w: string) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
          .join(" ");
      } catch {
        return raw;
      }
    })()
    const category = item.domain || item.category
    // Only show 2 tags: media type and category/domain
    const badges = [mediaType, category].filter(Boolean).slice(0, 2) as string[]

    return { metadata: baseMeta, badges };
  };
  // Determine the card type based on mediaType
  const getCardType = () => {
    const mt = inferMediaType(item).toLowerCase();
    switch (mt) {
      case "article":
        return "news";
      case "news":
        return "news";
      case "blog":
        return "blog";
      case "event":
        return "event";
      case "video":
        return "video";
      case "podcast":
        return "podcast";
      case "report":
      case "guide":
      case "toolkits & templates":
      case "infographic":
        return "resource";
      case "announcement":
        return "announcement";
      default:
        return "resource";
    }
  };
  // Get primary CTA text based on mediaType
  const getPrimaryCTA = () => {
    const mt = inferMediaType(item).toLowerCase();
    switch (mt) {
      case 'article':
        return 'Read Article'
      case 'news':
      case 'blog':
        return 'Read Article'
      case 'video':
        return 'Watch Now'
      case 'podcast':
        return item.isVideoEpisode ? 'Watch Episode' : 'Listen Now'
      case 'report':
      case 'guide':
      case 'toolkits & templates':
      case 'infographic':
        return 'Download'
      case 'event':
        return 'Register Now'
      case 'announcement':
        return 'View Announcement'
      default:
        return "View Details";
    }
  }
  // Determine primary CTA href (download/registration when available)
  const getPrimaryHref = () => {
    const mt = inferMediaType(item).toLowerCase()
    if ((mt === 'report' || mt === 'guide' || mt === 'toolkits & templates' || mt === 'infographic') && (item as any).downloadUrl) {
      return (item as any).downloadUrl as string
    }
    if (mt === 'event' && (item as any).registrationUrl) {
      return (item as any).registrationUrl as string
    }
    return detailsHref
  }
  // Get appropriate icon for the content type
  const getContentTypeIcon = () => {
    const mt = inferMediaType(item).toLowerCase();
    switch (mt) {
      case "article":
        return <FileText size={16} className="mr-1 text-blue-600" />;
      case "news":
      case "blog":
        return <FileText size={16} className="mr-1 text-blue-600" />;
      case "video":
        return <Play size={16} className="mr-1 text-blue-600" />;
      case "podcast":
        return <Volume2 size={16} className="mr-1 text-blue-600" />;
      case "report":
      case "guide":
        return <BookOpen size={16} className="mr-1 text-blue-600" />;
      case "toolkits & templates":
        return <FileText size={16} className="mr-1 text-blue-600" />;
      case "event":
        return <Calendar size={16} className="mr-1 text-blue-600" />;
      default:
        return <FileText size={16} className="mr-1 text-blue-600" />;
    }
  };
  // Get enhanced tags with content type
  const getEnhancedTags = () => {
    const tags = [...(item.tags || [])];
    // Add mediaType as a tag if it's not already included
    const mediaType = item.mediaType;
    if (mediaType && !tags.includes(mediaType)) {
      tags.unshift(mediaType);
    }
    // Add format as a tag if available and not already included
    if (item.format && !tags.includes(item.format)) {
      tags.push(item.format);
    }
    // Add category as a tag if available and not already included
    if (item.category && !tags.includes(item.category)) {
      tags.push(item.category);
    }
    // Add popularity tag if available (like "Trending", "Most Downloaded")
    if (item.popularity && !tags.includes(item.popularity)) {
      tags.push(item.popularity);
    }
    return tags;
  };
  // Build media-specific URLs and icon for MediaCard
  const getMediaProps = () => {
    const type = getCardType();
    const props: Record<string, any> = { icon: getContentTypeIcon() };
    if (type === "video") props.videoUrl = getVideoUrl(item);
    if (type === "podcast") props.audioUrl = getAudioUrl(item);
    return props;
  };
  // Toggle video playback
  const togglePlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  // Toggle audio mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  // Handle card click
  const handleCardClick = () => {
    // Always navigate directly to the details page for knowledge-hub
    navigate(detailsHref);
  };
  // Handle primary CTA click
  const handlePrimaryCTAClick = (e: React.MouseEvent) => {
    // No need to stop propagation or prevent default
    // Just navigate to the same URL as the card body would
    navigate(detailsHref);
  };
  // Video preview component
  const VideoPreview = () => {
    if (isVideoItem(item)) {
      const videoUrl = getVideoUrl(item);
      if (!videoUrl) return null;
      return (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center space-x-2 pointer-events-auto">
            <button
              onClick={togglePlayback}
              className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors z-10"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="text-white" size={20} />
              ) : (
                <Play className="text-white" size={20} />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors z-10"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="text-white" size={20} />
              ) : (
                <Volume2 className="text-white" size={20} />
              )}
            </button>
          </div>
          <video
            ref={videoRef}
            src={videoUrl}
            className="hidden"
            muted={isMuted}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          {/* Duration badge - Only show if duration is available */}
          {videoDuration.available && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-xs">
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>{videoDuration.formatted}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  const { metadata, badges } = buildMetadataAndBadges();

  return (
    <div className="h-full group" onClick={handleCardClick}>
      <MediaCard
        type={getCardType()}
        title={item.title}
        description={plainDescription}
        image={getPosterUrl(item)}
        {...getMediaProps()}
        metadata={metadata}
        badges={badges}
        cta={{
          label: getPrimaryCTA(),
          href: getPrimaryHref() || '#',
        }}
        secondaryCta={getPrimaryHref() !== detailsHref ? { label: 'View Details', href: detailsHref } : undefined}
      />
    </div>
  );
};
