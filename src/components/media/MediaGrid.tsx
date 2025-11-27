import React from "react";

interface MediaFile {
  id: string;
  file_url: string;
  file_type: string;
  caption?: string;
}

interface MediaGridProps {
  mediaFiles: MediaFile[];
  title?: string;
  onImageClick?: (index: number) => void;
  showRemaining?: boolean;
  onShowAll?: () => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  mediaFiles,
  title = "",
  onImageClick,
  showRemaining = true,
  onShowAll,
}) => {
  const renderMediaItem = (
    media: MediaFile,
    index: number,
    className: string = ""
  ) => {
    const isVideo = media.file_type.startsWith("video/");

    return (
      <div
        key={media.id}
        className={`relative rounded-lg overflow-hidden bg-gray-100 ${className}`}
        onClick={() => onImageClick?.(index)}
      >
        {isVideo ? (
          <video
            src={media.file_url}
            controls
            className="w-full h-full object-cover"
            poster="/placeholder.svg"
            onClick={(e) => e.stopPropagation()}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={media.file_url}
            alt={media.caption || `${title} - ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>
    );
  };

  const count = mediaFiles.length;

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className="w-full">
        {renderMediaItem(mediaFiles[0], 0, "max-h-[600px]")}
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {mediaFiles
          .slice(0, 2)
          .map((media, i) => renderMediaItem(media, i, "h-64 md:h-80"))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-2 h-80 md:h-96">
        {renderMediaItem(mediaFiles[0], 0, "row-span-2 h-full")}
        <div className="grid grid-rows-2 gap-2 h-full">
          {renderMediaItem(mediaFiles[1], 1, "h-full")}
          {renderMediaItem(mediaFiles[2], 2, "h-full")}
        </div>
      </div>
    );
  }

  // Four or more images
  const displayMedia = mediaFiles.slice(0, 4);
  const remainingCount = mediaFiles.length - 4;

  return (
    <div className="grid grid-cols-2 gap-2">
      {displayMedia.map((media, index) => (
        <div key={media.id} className="relative">
          {renderMediaItem(media, index, "h-48 md:h-64")}
          {index === 3 && remainingCount > 0 && showRemaining && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowAll?.();
              }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg hover:bg-black/70 transition-colors"
            >
              <span className="text-white text-2xl md:text-3xl font-semibold">
                +{remainingCount}
              </span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
