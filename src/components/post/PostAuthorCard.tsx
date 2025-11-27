import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { GradientAvatar } from "../../components/ui/gradient-avatar";
import { FollowButton } from "../profile/FollowButton";
import { useAuth } from "../../context/UnifiedAuthProvider";
interface PostAuthorCardProps {
  authorId?: string;
  authorUsername: string;
  authorAvatar: string | null;
  communityName: string;
  communityId: string;
  postCount?: number;
}
export function PostAuthorCard({
  authorId,
  authorUsername,
  authorAvatar,
  communityName,
  communityId,
  postCount = 0,
}: PostAuthorCardProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === authorId;

  return (
    <div className="flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <Link to={`/profile/${authorId}`} className="flex-shrink-0">
          <Avatar className="h-14 w-14 border-2 border-border hover:border-blue-300 transition-colors cursor-pointer">
            <AvatarImage src={authorAvatar || undefined} />
            <AvatarFallback className="p-0 overflow-hidden">
              <GradientAvatar seed={authorUsername} className="h-full w-full" />
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          {authorId ? (
            <Link
              to={`/profile/${authorId}`}
              className="font-semibold text-foreground hover:text-primary transition-colors truncate block"
            >
              {authorUsername}
            </Link>
          ) : (
            <h4 className="font-semibold text-foreground truncate">
              {authorUsername}
            </h4>
          )}
          <Link
            to={`/community/${communityId}`}
            className="text-sm text-primary hover:underline transition-colors truncate block"
          >
            {communityName}
          </Link>
          {postCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {postCount} posts in community
            </p>
          )}
        </div>
      </div>
      {!isOwnProfile && user?.id && authorId && (
        <FollowButton currentUserId={user.id} targetUserId={authorId} />
      )}
    </div>
  );
}
