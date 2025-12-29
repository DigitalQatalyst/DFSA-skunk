import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { addDays, isPast } from "date-fns";
import { supabase } from "../supabase/client";
import { safeFetch } from "../utils/safeFetch";
import { isValidUUID } from "../utils/validation";
import { PostAuthorCard } from "../components/post/PostAuthorCard";
import { RelatedPosts } from "../components/post/RelatedPosts";
import { CommentList } from "../components/post/CommentList";
import { AddCommentForm } from "../components/post/AddCommentForm";
import { TextPostContent } from "../components/post/TextPostContent";
import { MediaPostContent } from "../components/post/MediaPostContent";
import { EventPostContent } from "../components/post/EventPostContent";
import { PollPostContent } from "../components/post/PollPostContent";
import { UnsupportedPostContent } from "../components/post/UnsupportedPostContent";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";
import {
  AlertCircle,
  Home,
  ChevronRight,
  MessageSquare,
  MoreVertical,
  Flag,
  Edit,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { GradientAvatar } from "../components/ui/gradient-avatar";
import { format } from "date-fns";
import { PostTypeBadge } from "../components/posts/PostCard/PostTypeBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  ReportModal,
  checkIfAlreadyReported,
} from "../components/moderation/ReportModal";
import { InlineModeratorControls } from "../components/moderation/InlineModeratorControls";
import { usePermissions } from "../hooks/usePermissions";
import { useAuth } from "../context/UnifiedAuthProvider";
import { useToast } from "../hooks/use-toast";
import { WarningBadge } from "../components/moderation/WarningBadge";
import { ModerationAPI } from "../services/ModerationAPI";
// Import PageLayout components
import {
  PageLayout,
  PageSection,
  SectionHeader,
  SectionContent,
  Breadcrumbs,
  BreadcrumbItem,
} from "../components/PageLayout";
import { MainLayout } from "../components/layouts/MainLayout";
import { PostReactions } from "../components/post/PostReactions";
interface Post {
  id: string;
  title: string;
  content: string;
  content_html?: string;
  created_at: string;
  created_by: string;
  author_username: string;
  author_avatar: string | null;
  community_id: string;
  community_name: string;
  tags?: string[];
  helpful_count?: number;
  insightful_count?: number;
  post_type?: string;
  metadata?: any;
  event_date?: string;
  event_location?: string;
  comment_count?: number;
}
export default function PostDetail() {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [warningInfo, setWarningInfo] = useState<{
    hasWarning: boolean;
    reason?: string;
  }>({ hasWarning: false });
  const permissions = usePermissions(post?.community_id);
  const canModeratePosts = permissions.canModeratePosts;
  const { user } = useAuth();
  const { toast } = useToast();
  const commentsSectionRef = useRef<HTMLDivElement>(null);
  const [isPollActive, setIsPollActive] = useState(true);
  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  // Check for warning when post and user are loaded
  useEffect(() => {
    const checkWarning = async () => {
      if (post && user?.id && user.id === post.created_by) {
        const warning = await ModerationAPI.getPostWarning(post.id, user.id);
        setWarningInfo(warning);
      }
    };
    checkWarning();
  }, [post?.id, user?.id, post?.created_by]);

  // Check if poll is still active
  useEffect(() => {
    const checkPollStatus = () => {
      if (post?.post_type === "poll") {
        const metadata = post.metadata || {};

        if (metadata.end_date) {
          const endDate = new Date(metadata.end_date);
          setIsPollActive(!isPast(endDate));
        } else {
          // Calculate based on creation date and duration
          const pollDurationDays = metadata.poll_duration_days || 7;
          const createdAt = new Date(post.created_at);
          const calculatedEndDate = addDays(createdAt, pollDurationDays);
          setIsPollActive(!isPast(calculatedEndDate));
        }
      } else {
        setIsPollActive(true); // Non-poll posts are always "active" for editing
      }
    };

    if (post) {
      checkPollStatus();
    }
  }, [post]);
  const fetchPost = async () => {
    if (!id || !isValidUUID(id)) {
      setError("Invalid post ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    // Query posts table directly to get all fields including content_html, post_type, etc.
    const query = supabase
      .from("posts")
      .select(
        `
        id,
        title,
        content,
        content_html,
        created_at,
        created_by,
        community_id,
        tags,
        post_type,
        metadata,
        event_date,
        event_location,
        communities!inner(name),
        users_local!posts_created_by_fkey(username, avatar_url)
      `
      )
      .eq("id", id)
      .maybeSingle();
    const [data, err] = await safeFetch(query);
    if (err) {
      setError("Failed to load post");
      setLoading(false);
      return;
    }
    if (!data) {
      setError("Post not found");
      setLoading(false);
      return;
    }
    // Get reaction counts separately
    const [reactionsData] = await safeFetch(
      supabase.from("reactions").select("reaction_type").eq("post_id", id)
    );
    // Get comment count
    const [commentsData] = await safeFetch(
      supabase
        .from("comments")
        .select("id", {
          count: "exact",
        })
        .eq("post_id", id)
    );
    const helpfulCount =
      reactionsData?.filter((r: any) => r.reaction_type === "helpful").length ||
      0;
    const insightfulCount =
      reactionsData?.filter((r: any) => r.reaction_type === "insightful")
        .length || 0;

    console.log("commentsData", commentsData);
    const commentCount = commentsData?.length || 0;
    console.log("commentCount", commentCount);
    setPost({
      id: data.id,
      title: data.title,
      content: data.content,
      content_html: data.content_html,
      created_at: data.created_at,
      created_by: data.created_by,
      author_username: data.users_local?.username || "Unknown",
      author_avatar: data.users_local?.avatar_url || null,
      community_id: data.community_id || "",
      community_name: data.communities?.name || "Unknown",
      tags: data.tags || [],
      helpful_count: helpfulCount,
      insightful_count: insightfulCount,
      comment_count: commentCount,
      post_type: data.post_type || "text",
      metadata: data.metadata || {},
      event_date: data.event_date,
      event_location: data.event_location,
    });
    setLoading(false);
  };
  const handleCommentAdded = () => {
    // Update the comment count immediately
    setPost((prevPost) => {
      if (!prevPost) return prevPost;
      return {
        ...prevPost,
        comment_count: (prevPost.comment_count || 0) + 1,
      };
    });

    // Also refresh comments to ensure we have the latest data
    setRefreshKey((prev) => prev + 1);
  };

  const handleModerationAction = () => {
    // Refresh the post data after moderation action
    fetchPost();
  };

  const handleReportClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user?.id || !post) {
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

    if (alreadyReported) {
      toast({
        title: "Already Reported",
        description:
          "You have already reported this post. Our moderation team will review it.",
        variant: "destructive",
      });
      return;
    }

    // Open modal if not already reported
    setShowReportModal(true);
  };
  // Generate breadcrumbs for the post
  const breadcrumbItems: BreadcrumbItem[] = post
    ? [
        {
          label: "Home",
          href: "/",
          icon: Home,
        },
        {
          label: "Communities",
          href: "/communities",
        },
        {
          label: post.community_name,
          href: `/community/${post.community_id}`,
        },
        {
          label: post.title,
          current: true,
        },
      ]
    : [];
  if (loading) {
    return (
      <MainLayout hidePageLayout>
        <div className="py-6">
          <PageLayout>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
              <PageSection>
                <SectionContent>
                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <div className="flex items-center gap-3 mt-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="mt-6">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </SectionContent>
              </PageSection>
              <PageSection className="mt-6">
                <SectionHeader title="Comments" />
                <SectionContent>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 py-4 border-t first:border-t-0"
                    >
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-4 w-full mt-2" />
                        <Skeleton className="h-4 w-3/4 mt-1" />
                      </div>
                    </div>
                  ))}
                </SectionContent>
              </PageSection>
            </div>
          </PageLayout>
        </div>
      </MainLayout>
    );
  }
  if (error || !post) {
    return (
      <MainLayout hidePageLayout>
        <div className="py-6">
          <PageLayout>
            <div className="max-w-4xl mx-auto">
              <PageSection>
                <SectionContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-red-50 p-3 rounded-full mb-4">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {error || "Post not found"}
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-md">
                      We couldn't find the post you're looking for. It may have
                      been removed or you may have followed an incorrect link.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={fetchPost}>
                        Try Again
                      </Button>
                      <Link to="/feed">
                        <Button variant="default">Return to Feed</Button>
                      </Link>
                    </div>
                  </div>
                </SectionContent>
              </PageSection>
            </div>
          </PageLayout>
        </div>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <PageLayout>
        <div className="">
          {/* Breadcrumbs */}
          <div className="max-w-7xl mx-auto mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link
                    to="/community"
                    className="text-gray-600 hover:text-gray-900 inline-flex items-center text-sm"
                  >
                    <Home size={16} className="mr-1" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRight size={16} className="text-gray-400" />
                    <Link
                      to="/feed"
                      className="ml-1 text-sm text-gray-600 hover:text-gray-900 md:ml-2"
                    >
                      Feed
                    </Link>
                  </div>
                </li>
                {post.community_name && (
                  <li>
                    <div className="flex items-center">
                      <ChevronRight size={16} className="text-gray-400" />
                      <Link
                        to={`/community/${post.community_id}`}
                        className="ml-1 text-sm text-gray-600 hover:text-gray-900 md:ml-2"
                      >
                        {post.community_name}
                      </Link>
                    </div>
                  </li>
                )}
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRight size={16} className="text-gray-400" />
                    <span className="ml-1 text-sm font-medium  md:ml-2 line-clamp-1">
                      {post.title}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Column (70%) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Post Header & Metadata */}
              <PageSection>
                <SectionContent className="bg-white">
                  <div className="flex items-center gap-2 mb-4 justify-between flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <PostTypeBadge
                        postType={post.post_type as any}
                        className="text-sm"
                      />
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs font-medium"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Warning badge aligned to the right */}
                    {warningInfo?.hasWarning &&
                      user?.id === post.created_by && (
                        <WarningBadge reason={warningInfo.reason} />
                      )}
                  </div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight flex-1">
                      {post.title}
                    </h1>
                    <div className="flex items-center gap-2">
                      {/* Edit Button - Show for post author 
                      {user?.id === post.created_by && (
                        <>
                          {post.post_type === "poll" && !isPollActive ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                              className="h-8 px-3 text-gray-400 cursor-not-allowed"
                              title="Poll has ended and cannot be edited"
                            >
                              <Edit className="h-4 w-4 mr-1.5" />
                              Edit
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 hover:bg-gray-100"
                              onClick={() => navigate(`/post/edit/${post.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-1.5" />
                              Edit
                            </Button>
                          )}
                        </>
                      )}
*/}
                      {/* Moderator Controls */}
                      {canModeratePosts && (
                        <InlineModeratorControls
                          postId={post.id}
                          communityId={post.community_id}
                          currentStatus={post.metadata?.status}
                          onActionComplete={handleModerationAction}
                        />
                      )}

                      {/* Report Menu - Only show for non-moderators and non-authors */}
                      {!permissions.loading &&
                        !canModeratePosts &&
                        user?.id !== post.created_by && (
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
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4">
                    <Avatar className="h-9 w-9 border border-gray-200">
                      <AvatarImage src={post.author_avatar || undefined} />
                      <AvatarFallback className="p-0 overflow-hidden">
                        <GradientAvatar
                          seed={post.author_username}
                          className="h-full w-full"
                        />
                      </AvatarFallback>
                    </Avatar>
                    {post.created_by ? (
                      <Link
                        to={`/profile/${post.created_by}`}
                        className="font-medium text-gray-700 hover:text-[#0030E3] transition-colors"
                      >
                        {post.author_username}
                      </Link>
                    ) : (
                      <span className="font-medium text-gray-700">
                        {post.author_username}
                      </span>
                    )}
                    <span className="text-gray-400">•</span>
                    <Link
                      to={`/community/${post.community_id}`}
                      className="text-[#0030E3] hover:text-[#002180] transition-colors"
                    >
                      {post.community_name}
                    </Link>
                    <span className="text-gray-400">•</span>
                    <span>
                      {format(new Date(post.created_at), "MMM d, yyyy")}
                    </span>
                    {/* Comment count */}
                    <button
                      onClick={() => {
                        commentsSectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                      className="ml-auto flex items-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4 mr-1.5" />
                      <span>{post.comment_count || 0} comments</span>
                    </button>
                  </div>
                  {/* Type-Specific Content Rendering */}
                  <div className="mt-6">
                    {post.post_type === "text" && (
                      <TextPostContent
                        content={post.content}
                        content_html={post.content_html}
                      />
                    )}
                    {post.post_type === "media" && (
                      <MediaPostContent
                        postId={post.id}
                        metadata={post.metadata || {}}
                        title={post.title}
                        content={post.content}
                        content_html={post.content_html}
                      />
                    )}
                    {post.post_type === "event" && (
                      <EventPostContent
                        postId={post.id}
                        event_date={post.event_date}
                        event_location={post.event_location}
                        metadata={post.metadata}
                        content={post.content}
                        content_html={post.content_html}
                      />
                    )}
                    {post.post_type === "poll" && (
                      <PollPostContent
                        postId={post.id}
                        metadata={post.metadata}
                        content={post.content}
                        content_html={post.content_html}
                      />
                    )}
                    {/* Fallback for unsupported or undefined post types */}
                    {!post.post_type ||
                      (!["text", "media", "event", "poll"].includes(
                        post.post_type
                      ) && (
                        <UnsupportedPostContent
                          post_type={post.post_type}
                          content={post.content}
                        />
                      ))}
                  </div>
                </SectionContent>
              </PageSection>
              {/* Reactions */}
              <PageSection>
                <SectionContent className="py-4 bg-white">
                  <PostReactions
                    helpfulCount={post.helpful_count || 0}
                    insightfulCount={post.insightful_count || 0}
                    postId={post.id}
                  />
                </SectionContent>
              </PageSection>
              {/* Comments Section */}
              <div ref={commentsSectionRef}>
                <PageSection>
                  <SectionHeader title="Comments" />
                  <SectionContent className="bg-white">
                    <CommentList
                      postId={id!}
                      refreshKey={refreshKey}
                      communityId={post.community_id}
                    />
                  </SectionContent>
                </PageSection>
              </div>
              {/* Add Comment Form */}
              <PageSection>
                <SectionHeader title="Join the conversation" />
                <SectionContent className="bg-white">
                  <AddCommentForm
                    postId={id!}
                    onCommentAdded={handleCommentAdded}
                  />
                </SectionContent>
              </PageSection>
              {/* Related Posts - Mobile Only */}
              <div className="lg:hidden">
                <PageSection>
                  <SectionHeader title="Related Posts" />
                  <SectionContent className="bg-white">
                    <RelatedPosts
                      currentPostId={post.id}
                      communityId={post.community_id}
                      tags={post.tags || []}
                    />
                  </SectionContent>
                </PageSection>
              </div>
            </div>
            {/* Sidebar Column (30%) */}
            <aside className="space-y-6">
              {/* Author Card */}
              <PageSection>
                <SectionHeader title="About the Author" />
                <SectionContent className="pb-4 bg-white">
                  <PostAuthorCard
                    authorId={post.created_by}
                    authorUsername={post.author_username}
                    authorAvatar={post.author_avatar}
                    communityName={post.community_name}
                    communityId={post.community_id}
                  />
                </SectionContent>
              </PageSection>
              {/* Related Posts - Desktop Only */}
              <div className="hidden lg:block">
                <PageSection>
                  <SectionHeader title="Related Posts" />
                  <SectionContent>
                    <RelatedPosts
                      currentPostId={post.id}
                      communityId={post.community_id}
                      tags={post.tags || []}
                    />
                  </SectionContent>
                </PageSection>
              </div>
            </aside>
          </div>
        </div>

        {/* Report Modal */}
        {post && (
          <ReportModal
            open={showReportModal}
            onOpenChange={setShowReportModal}
            targetType="post"
            targetId={post.id}
            communityId={post.community_id}
          />
        )}
      </PageLayout>
    </MainLayout>
  );
}
