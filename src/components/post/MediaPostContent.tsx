import { useState } from "react";
import { ExternalLink, FileImage } from "lucide-react";
import { Button } from "../ui/button";
import { useMediaFiles } from "../../hooks/useMediaFiles";
import { MediaGrid } from "../media/MediaGrid";

interface MediaPostContentProps {
  postId: string;
  metadata: {
    media_url?: string;
    media_urls?: string[];
    caption?: string;
    media_type?: string;
    source_url?: string;
  };
  title: string;
  content?: string;
  content_html?: string;
}

export function MediaPostContent({
  postId,
  metadata,
  title,
  content,
  content_html,
}: MediaPostContentProps) {
  const { mediaFiles, loading } = useMediaFiles(postId);
  const [showAllImages, setShowAllImages] = useState(false);

  if (loading) {
    return <div className="w-full h-96 bg-gray-100 rounded-lg animate-pulse" />;
  }

  if (mediaFiles.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">No media available for this post.</p>
      </div>
    );
  }

  const renderAllImages = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            All Images ({mediaFiles.length})
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllImages(false)}
          >
            Show less
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mediaFiles.map((media) => (
            <div
              key={media.id}
              className="relative rounded-lg overflow-hidden bg-gray-100 h-80"
            >
              {media.file_type.startsWith("video/") ? (
                <video
                  src={media.file_url}
                  controls
                  className="w-full h-full object-cover"
                  poster="/placeholder.svg"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={media.file_url}
                  alt={media.caption || title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Media Display - Grid or All Images View */}
      {showAllImages ? (
        renderAllImages()
      ) : (
        <>
          <MediaGrid
            mediaFiles={mediaFiles}
            title={title}
            showRemaining={true}
            onShowAll={() => setShowAllImages(true)}
          />
          {mediaFiles.length > 4 && !showAllImages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllImages(true)}
              className="w-full"
            >
              View All {mediaFiles.length} Images
            </Button>
          )}
        </>
      )}

      {/* Caption */}
      {metadata.caption && (
        <p className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-4 py-1">
          {metadata.caption}
        </p>
      )}

      {/* Source Link */}
      {metadata.source_url && (
        <div className="flex items-center text-sm text-blue-600">
          <ExternalLink className="h-4 w-4 mr-1.5" />
          <a
            href={metadata.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View original source
          </a>
        </div>
      )}

      {/* Additional Content */}
      {(content || content_html) && (
        <div className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 mt-4">
          {content_html ? (
            <div dangerouslySetInnerHTML={{ __html: content_html }} />
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
          )}
        </div>
      )}
    </div>
  );
}
