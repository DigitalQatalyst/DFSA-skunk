import React from "react";
import { BasePost } from "../types";
import { FileImage } from "lucide-react";
import { useMediaFiles } from "../../../hooks/useMediaFiles";
import { MediaGrid } from "../../media/MediaGrid";

interface PostCardMediaProps {
  post: BasePost;
}

export const PostCardMedia: React.FC<PostCardMediaProps> = ({ post }) => {
  const { mediaFiles, loading } = useMediaFiles(post.id);

  if (loading) {
    return <div className="w-full h-48 bg-gray-100 rounded-lg animate-pulse" />;
  }

  if (mediaFiles.length === 0) {
    return (
      <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center">
        <FileImage className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <MediaGrid
        mediaFiles={mediaFiles}
        title={post.title}
        showRemaining={true}
      />
      {post.content && (
        <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
      )}
    </div>
  );
};
