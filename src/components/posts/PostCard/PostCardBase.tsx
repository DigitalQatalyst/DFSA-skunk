import React, { ReactNode, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  ThumbsUp,
  Lightbulb,
  MessageSquare,
  MoreVertical,
  Flag,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { GradientAvatar } from "../../ui/gradient-avatar";
import { PostTypeBadge } from "./PostTypeBadge";
import { BasePost } from "../types";
import { ModerationBadge } from "../../moderation/ModerationBadge";
import { InlineModeratorControls } from "../../moderation/InlineModeratorControls";
import {
  ReportModal,
  checkIfAlreadyReported,
} from "../../moderation/ReportModal";
import { useToast } from "../../../hooks/use-toast";
import { HiddenContentPlaceholder } from "../../moderation/HiddenContentPlaceholder";
import { usePermissions } from "../../hooks/usePermissions";
import { useAuth } from "../../../context/UnifiedAuthProvider";
import { WarningBadge } from "../../moderation/WarningBadge";
import { ModerationAPI } from "../../../services/ModerationAPI";
import { useEffect } from "react";
interface PostCardBaseProps {
  post: BasePost;
  children: ReactNode;
  onReaction: (type: "helpful" | "insightful") => void;
  hasReactedHelpful: boolean;
  hasReactedInsightful: boolean;
  helpfulCount: number;
  insightfulCount: number;
  highlightBorder?: boolean;
  onActionComplete?: () => void;
}
export const PostCardBase: React.FC<PostCardBaseProps> = ({
  post,
  children,
  onReaction,
  hasReactedHelpful,
  hasReactedInsightful,
  helpfulCount,
  insightfulCount,
  highlightBorder = false,
  onActionComplete,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showReportModal, setShowReportModal] = useState(false);
  const [warningInfo, setWarningInfo] = useState<{
    hasWarning: boolean;
    reason?: string;
  }>({ hasWarning: false });
  const permissions = usePermissions(post.community_id);
  const canModeratePosts = permissions.canModeratePosts;

  // Check if post has a warning (only for author)
  useEffect(() => {
    const checkWarning = async () => {
      if (user?.id === post.created_by) {
        const warning = await ModerationAPI.getPostWarning(post.id, user.id);
        setWarningInfo(warning);
      }
    };
    checkWarning();
  }, [post.id, user?.id, post.created_by]);

  const handleReportClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user?.id) {
      console.log("🚫 No user ID, showing auth toast");
      toast({
        title: "Authentication Required",
        description: "You must be logged in to report content",
        variant: "destructive",
      });
      return;
    }

    // Check if already reported
    const alreadyReported = await checkIfAlreadyReported(
      user.id,
      "post",
      post.id
    );

    console.log("✅ Already reported check complete:", alreadyReported);

    if (alreadyReported) {
      console.log("🔔 Showing already reported toast");
      const result = toast({
        title: "Already Reported",
        description:
          "You have already reported this post. Our moderation team will review it.",
        variant: "destructive",
      });
      console.log("🔔 Toast called, result:", result);

      return;
    }

    // Open modal if not already reported
    console.log("📂 Opening report modal");
    setShowReportModal(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest('[role="button"]')
    ) {
      return;
    }
    navigate(`/post/${post.id}`);
  };

  return (
    <Card
      className={`relative shadow-sm hover:shadow-md transition-all duration-200 bg-white rounded-2xl overflow-hidden group cursor-pointer ${
        highlightBorder ? "border-2 border-amber-300" : "border border-gray-100"
      }`}
      onClick={handleCardClick}
    >
      {/* Warning badge positioned in top-right corner 
      {warningInfo?.hasWarning && user?.id === post.created_by && (
        <div className="absolute top-1 right-2 z-10">
          <WarningBadge reason={warningInfo.reason} />
        </div>
      )}*/}

      <CardHeader className="p-4 pb-3 bg-white relative">
        {/* Absolute positioned moderation controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {/* Show moderation badge for non-active posts to moderators/admins */}
          {post.status !== "active" && canModeratePosts && (
            <ModerationBadge
              status={post.status as "flagged" | "deleted" | "active"}
            />
          )}

          {/* Show moderator toolbar if user can moderate */}
          {canModeratePosts && (
            <InlineModeratorControls
              postId={post.id}
              communityId={post.community_id}
              currentStatus={post.status}
              onActionComplete={onActionComplete}
            />
          )}

          {/* Show report menu only for non-moderators (wait for permissions to load) */}
          {!permissions.loading && !canModeratePosts && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  className="text-red-600 hover:bg-red-50"
                  onClick={handleReportClick}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-start gap-3 pr-24">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={post.author_avatar || undefined} />
            <AvatarFallback className="p-0 overflow-hidden">
              <GradientAvatar
                seed={post.author_username}
                className="h-full w-full"
              />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {post.created_by ? (
                <Link
                  to={`/profile/${post.created_by}`}
                  className="font-semibold text-gray-900 text-sm hover:text-primary transition-colors"
                >
                  {post.author_username}
                </Link>
              ) : (
                <span className="font-semibold text-gray-900 text-sm">
                  {post.author_username}
                </span>
              )}
              <Badge
                variant="secondary"
                className="inline-flex items-center h-5 px-2 text-xs font-medium bg-primary/10 text-primary border-0 rounded-full max-w-[120px] sm:max-w-none"
                title={post.community_name}
              >
                <span className="block truncate">{post.community_name}</span>
              </Badge>
              <PostTypeBadge postType={(post.post_type as any) || undefined} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-3">
        {post.status === "flagged" || post.status === "deleted" ? (
          <HiddenContentPlaceholder
            contentType="post"
            canModerate={canModeratePosts}
          >
            <>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base">
                {post.title}
              </h3>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center h-6 px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
                      title={tag}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {children}
            </>
          </HiddenContentPlaceholder>
        ) : (
          <>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base">
              {post.title}
            </h3>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center h-6 px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
                    title={tag}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {children}
          </>
        )}
      </CardContent>

      <CardFooter className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 w-full flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            className={`h-auto py-1.5 px-3 text-xs gap-1.5 transition-all duration-200 rounded-md ${
              hasReactedHelpful
                ? "bg-primary text-white hover:bg-primary/90"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onReaction("helpful");
            }}
          >
            <ThumbsUp
              className={`h-3.5 w-3.5 ${
                hasReactedHelpful ? "fill-current" : ""
              }`}
            />
            <span className="font-semibold">{helpfulCount}</span>
            <span>Helpful</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-auto py-1.5 px-3 text-xs gap-1.5 transition-all duration-200 rounded-md ${
              hasReactedInsightful
                ? "bg-teal-500 text-white hover:bg-teal-600"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onReaction("insightful");
            }}
          >
            <Lightbulb
              className={`h-3.5 w-3.5 ${
                hasReactedInsightful ? "fill-current" : ""
              }`}
            />
            <span className="font-semibold">{insightfulCount}</span>
            <span>Insightful</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto py-1.5 px-3 text-xs gap-1.5 hover:bg-gray-100 text-gray-600 transition-all duration-200 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/post/${post.id}`);
            }}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="font-semibold">{post.comment_count || 0}</span>
            <span>Comments</span>
          </Button>
        </div>
      </CardFooter>

      {/* Report Modal */}
      <ReportModal
        open={showReportModal}
        onOpenChange={setShowReportModal}
        targetType="post"
        targetId={post.id}
        communityId={post.community_id}
      />
    </Card>
  );
};
