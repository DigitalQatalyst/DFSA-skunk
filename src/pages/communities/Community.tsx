import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/UnifiedAuthProvider";
import { supabase } from "../../supabase/client";
import { safeFetch } from "../../utils/safeFetch";
import { isValidUUID, isValidImageUrl } from "../../utils/validation";
import { MainLayout } from "../../components/layouts/MainLayout";
import { Button } from "../../components/ui/button";
//import { StickyActionButton } from "../../components/Button";
import {
  Users,
  UserPlus,
  UserMinus,
  AlertCircle,
  Plus,
  Settings,
  Home,
  ChevronRight,
  Upload,
  X,
  Pencil,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { MemberList } from "../../components/communities/MemberList";
import { InlineComposer } from "../../components/post/InlineComposer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { format } from "date-fns";
import { PostCard } from "../../components/posts/PostCard";
import { Skeleton } from "../../components/ui/skeleton";
// Import PageLayout components
import {
  PageLayout,
  PageSection,
  SectionHeader,
  SectionContent,
} from "../../components/PageLayout/index";
import { useAuthModal } from "../../contexts/AuthModalContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";

// Allowed image hosting domains for community images
const ALLOWED_IMAGE_DOMAINS = [
  "images.unsplash.com",
  "unsplash.com",
  "imgur.com",
  "i.imgur.com",
  "cloudinary.com",
  "res.cloudinary.com",
  "amazonaws.com",
  "googleusercontent.com",
  "cdn.pixabay.com",
  "pexels.com",
  "images.pexels.com",
];

interface Community {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  imageurl?: string | null;
  category?: string | null;
}
interface Post {
  id: string;
  title: string;
  content: string;
  content_html?: string;
  created_at: string;
  created_by: string;
  community_id: string;
  community_name: string;
  author_username: string;
  author_avatar?: string;
  helpful_count?: number;
  insightful_count?: number;
  comment_count?: number;
  tags?: string[];
  post_type?: "text" | "media" | "poll" | "event" | "article" | "announcement";
  metadata?: any;
  event_date?: string;
  event_location?: string;
}
export default function Community() {
  const { id } = useParams<{
    id: string;
  }>();
  const { user, login } = useAuth();
  const { openModal } = useAuthModal();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [updateImageLoading, setUpdateImageLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  useEffect(() => {
    if (id) {
      fetchCommunity();
      fetchPosts();
      if (user) {
        checkMembership();
      }
    }
  }, [id, user]);
  useEffect(() => {
    if (id) {
      fetchPosts();
    }
  }, [refreshKey]);
  const fetchCommunity = async () => {
    if (!id || !isValidUUID(id)) {
      setError("Invalid community ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const query = supabase
      .from("communities_with_counts")
      .select("*")
      .eq("id", id)
      .single();
    const [data, err] = await safeFetch(query);
    if (err) {
      setError("Failed to load community");
      setLoading(false);
      return;
    }
    if (data) {
      setCommunity({
        id: data.id,
        name: data.name,
        description: data.description,
        created_at: data.created_at,
        imageurl: data.imageurl || null,
        category: data.category || "Community",
      });
      setMemberCount(data.member_count || 0);
      // Fetch the community's creator to check ownership
      if (user) {
        const ownerQuery = supabase
          .from("communities")
          .select("created_by")
          .eq("id", id)
          .maybeSingle();
        const [ownerData] = await safeFetch(ownerQuery);
        const isUserOwner = ownerData?.created_by === user.id;
        setIsOwner(isUserOwner);
        // Check if user is admin
        if (!isUserOwner && user.role === "admin") {
          setIsAdmin(true);
        } else if (!isUserOwner) {
          const roleQuery = supabase
            .from("community_roles")
            .select("role")
            .eq("community_id", id)
            .eq("user_id", user.id)
            .maybeSingle();
          const [roleData] = await safeFetch(roleQuery);
          console.log("user", user, "community", community);
          setIsAdmin(roleData?.role === "admin");
        }
      }
    }
    setLoading(false);
  };
  const checkMembership = async () => {
    if (!user || !id) return;
    const query = supabase
      .from("memberships")
      .select("id")
      .eq("user_id", user.id)
      .eq("community_id", id)
      .maybeSingle();
    const [data] = await safeFetch(query);

    setIsMember(!!data);
  };
  const handleJoinLeave = async () => {
    if (!user) {
      toast.error("Please sign in to join communities");
      return;
    }
    setJoinLoading(true);
    if (isMember) {
      const query = supabase.from("memberships").delete().match({
        user_id: user.id,
        community_id: id,
      });
      const [, error] = await safeFetch(query);
      if (error) {
        toast.error("Failed to leave community");
        console.log(error);
      } else {
        toast.success("Left community");
        setIsMember(false);
        setMemberCount((prev) => Math.max(0, prev - 1));
      }
    } else {
      const query = supabase.from("memberships").insert({
        user_id: user.id,
        community_id: id,
      });
      const [, error] = await safeFetch(query);
      if (error) {
        toast.error("Failed to join community");
      } else {
        toast.success("Joined community!");
        setIsMember(true);
        setMemberCount((prev) => prev + 1);
      }
    }
    setJoinLoading(false);
  };
  const fetchPosts = async () => {
    if (!id) return;
    setPostsLoading(true);
    setPostsError(null);

    // For moderators/admins, query posts table directly to see all statuses
    // For regular users, use the view which only shows active posts
    const isModerator =
      user && (user.role === "admin" || user.role === "moderator");

    // Query posts table directly for all users
    let query = supabase
      .from("posts")
      .select(
        `
        *,
        communities!inner(name),
        users_local!inner(username, avatar_url)
      `
      )
      .eq("community_id", id);

    // Regular users only see active posts
    if (!isModerator) {
      query = query.eq("status", "active");
    }

    query = query.order("created_at", {
      ascending: false,
    });

    const [data, err] = await safeFetch(query);
    if (err) {
      setPostsError("Failed to load posts");
      setPostsLoading(false);
      return;
    }

    if (data) {
      // Fetch reaction and comment counts separately for all users
      const postIds = data.map((p: any) => p.id);

      const { data: reactions } = await supabase
        .from("reactions")
        .select("post_id, reaction_type")
        .in("post_id", postIds);

      const { data: comments } = await supabase
        .from("comments")
        .select("post_id")
        .in("post_id", postIds)
        .eq("status", "active");

      // Count reactions and comments
      const reactionCounts =
        reactions?.reduce((acc: any, r: any) => {
          if (!acc[r.post_id]) acc[r.post_id] = { helpful: 0, insightful: 0 };
          if (r.reaction_type === "helpful") acc[r.post_id].helpful++;
          if (r.reaction_type === "insightful") acc[r.post_id].insightful++;
          return acc;
        }, {}) || {};

      const commentCounts =
        comments?.reduce((acc: any, c: any) => {
          acc[c.post_id] = (acc[c.post_id] || 0) + 1;
          return acc;
        }, {}) || {};

      const posts = data.map((p: any) => ({
        ...p,
        community_name: p.communities?.name,
        author_username: p.users_local?.username,
        author_avatar: p.users_local?.avatar_url,
        helpful_count: reactionCounts[p.id]?.helpful || 0,
        insightful_count: reactionCounts[p.id]?.insightful || 0,
        comment_count: commentCounts[p.id] || 0,
      }));

      setPosts(posts);
    }
    setPostsLoading(false);
  };
  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };
  const handleUpdateImage = async () => {
    if (!id || !user) return;

    // Validate UUID and URL
    if (!isValidUUID(id)) {
      toast.error("Invalid community ID");
      return;
    }

    if (!newImageUrl.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }

    // Validate URL format and allowed domains
    const urlValidation = isValidImageUrl(newImageUrl, ALLOWED_IMAGE_DOMAINS);
    if (!urlValidation.valid) {
      toast.error(urlValidation.error || "Invalid image URL");
      return;
    }
    setUpdateImageLoading(true);
    const updateData = {
      imageurl: newImageUrl.trim(),
    };
    const query = supabase.from("communities").update(updateData).eq("id", id);
    const [, error] = await safeFetch(query);
    if (error) {
      toast.error("Failed to update community image");
      console.error("Image update error:", error);
    } else {
      toast.success("Community image updated successfully");
      setCommunity((prev) =>
        prev
          ? {
              ...prev,
              imageurl: newImageUrl.trim(),
            }
          : null
      );
      setImageDialogOpen(false);
      setNewImageUrl("");
    }
    setUpdateImageLoading(false);
  };

  // Define breadcrumb item type
  interface BreadcrumbItemType {
    label: string;
    href?: string;
    isActive?: boolean;
    icon?: React.ComponentType<any>;
  }

  // Generate breadcrumbs for the community page

  if (loading) {
    return (
      <MainLayout hidePageLayout>
        <PageLayout>
          <div className="flex justify-center items-center min-h-[60vh] bg-white">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading community...</p>
            </div>
          </div>
        </PageLayout>
      </MainLayout>
    );
  }
  if (error || !community) {
    return (
      <MainLayout>
        <PageLayout>
          <PageSection>
            <SectionContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-red-50 p-3 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {error || "Community not found"}
                </h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  We couldn't find the community you're looking for. It may have
                  been removed or you may have followed an incorrect link.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={fetchCommunity}>
                    Try Again
                  </Button>
                  <Button as={Link} to="/communities" variant="default">
                    Browse Communities
                  </Button>
                </div>
              </div>
            </SectionContent>
          </PageSection>
        </PageLayout>
      </MainLayout>
    );
  }
  // Fallback image URL if community image is missing
  const fallbackImageUrl =
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80";
  return (
    <MainLayout>
      <PageLayout>
        <div className="min-h-screen">
          <main className="p-2 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Breadcrumbs */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/community" className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/communities">Communities</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Feed</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <PageLayout>
                {/* Hero Section */}
                <PageSection className="p-0 overflow-hidden mb-6">
                  <div className="relative">
                    {/* Dynamic Image with Fallback */}
                    <div className="relative lg:h-[280px] h-[320px] overflow-hidden ">
                      {community.imageurl ? (
                        <img
                          src={community.imageurl}
                          alt={community.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(224,100%,45%)] to-[hsl(266,93%,64%)]" />
                      )}
                      {/* Gradient Overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
                      {/* Admin/Moderator Control Buttons - Desktop only (top right) */}
                      {(isOwner ||
                        isAdmin ||
                        (user &&
                          (user.role === "admin" ||
                            user.role === "moderator"))) && (
                        <div className="hidden sm:flex absolute top-4 right-4 gap-2 z-10">
                          <Button
                            onClick={() => setImageDialogOpen(true)}
                            variant="secondary"
                            className="bg-white/90 text-gray-700 hover:bg-white"
                            size="sm"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit Cover Image
                          </Button>
                          <Button
                            as={Link}
                            to={`/community/${id}/settings`}
                            variant="secondary"
                            className="bg-white/90 text-gray-700 hover:bg-white"
                            size="sm"
                          >
                            <Settings className="h-3.5 w-3.5 mr-1.5" />
                            Settings
                          </Button>
                        </div>
                      )}

                      {/* Content Container - Centered vertically */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
                          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between">
                            <div className="md:max-w-3xl">
                              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-md">
                                {community.name}
                              </h1>
                              <p className="text-white/90 text-base md:text-lg mt-3 max-w-3xl leading-relaxed">
                                {community.description ||
                                  "No description available"}
                              </p>
                              {/* Community metadata */}
                              <div className="flex flex-wrap items-center gap-3 mt-4">
                                <div className="flex items-center bg-black/30 text-white px-3 py-1.5 rounded-full text-sm">
                                  <Users className="h-4 w-4 mr-2" />
                                  <span>{memberCount} members</span>
                                </div>
                                <div className="flex items-center bg-black/30 text-white px-3 py-1.5 rounded-full text-sm">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>
                                    Created{" "}
                                    {format(
                                      new Date(community.created_at),
                                      "MMM yyyy"
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 md:mt-0 md:ml-8">
                              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
                                {!user ? (
                                  <Button
                                    onClick={login}
                                    className="bg-white text-blue-600 hover:bg-gray-100"
                                  >
                                    Login to Join
                                  </Button>
                                ) : isMember ? (
                                  <Button
                                    onClick={handleJoinLeave}
                                    variant="outline"
                                    className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                                    disabled={joinLoading}
                                  >
                                    {joinLoading
                                      ? "Processing..."
                                      : "Leave Community"}
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={handleJoinLeave}
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                    disabled={joinLoading}
                                  >
                                    {joinLoading
                                      ? "Processing..."
                                      : "Join Community"}
                                  </Button>
                                )}

                                {/* Admin/Moderator Control Buttons - Mobile only (next to join button) */}
                                {(isOwner ||
                                  isAdmin ||
                                  (user &&
                                    (user.role === "admin" ||
                                      user.role === "moderator"))) && (
                                  <div className="flex sm:hidden items-center gap-2">
                                    <Button
                                      onClick={() => setImageDialogOpen(true)}
                                      variant="secondary"
                                      className="bg-white/90 text-gray-700 hover:bg-white"
                                      size="sm"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      as={Link}
                                      to={`/community/${id}/settings`}
                                      variant="secondary"
                                      className="bg-white/90 text-gray-700 hover:bg-white"
                                      size="sm"
                                    >
                                      <Settings className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PageSection>
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Posts Feed */}
                  <div className="lg:col-span-2 space-y-6">
                    <PageSection>
                      <SectionHeader
                        title="Community Posts"
                        description="Latest discussions and updates"
                      />
                      {/* Inline Composer - Only for members */}
                      {user && isMember && (
                        <SectionContent className=" border-b border-gray-200">
                          <InlineComposer
                            communityId={id}
                            onPostCreated={handlePostCreated}
                          />
                        </SectionContent>
                      )}
                      {/* Posts List */}
                      <SectionContent
                        className={user && isMember ? "pt-4" : ""}
                      >
                        {postsLoading ? (
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="bg-gray-50 rounded-lg p-4"
                              >
                                <Skeleton className="h-6 w-1/3 mb-2" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3" />
                              </div>
                            ))}
                          </div>
                        ) : postsError ? (
                          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                            <p>{postsError}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={fetchPosts}
                              className="mt-2"
                            >
                              Retry
                            </Button>
                          </div>
                        ) : posts.length === 0 ? (
                          <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <div className="bg-gray-100 p-3 rounded-full mb-4">
                                <AlertCircle className="h-6 w-6 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No posts yet
                              </h3>
                              <p className="text-gray-500 mb-4">
                                Be the first to start a conversation in this
                                community
                              </p>
                              {user && isMember && (
                                <Button
                                  onClick={() =>
                                    navigate(`/create-post?communityId=${id}`)
                                  }
                                  className="bg-blue-600 text-white hover:bg-blue-700"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Create Post
                                </Button>
                              )}
                              {!user && (
                                <p className="text-gray-400 text-sm">
                                  Join this community to start posting
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {posts.map((post) => (
                              <PostCard
                                key={post.id}
                                post={post}
                                onActionComplete={handlePostCreated}
                              />
                            ))}
                          </div>
                        )}
                      </SectionContent>
                    </PageSection>
                  </div>
                  {/* Sidebar Column */}
                  {/* Main content container with vertical spacing */}
                  <div className="space-y-6 mb-10">
                    {/* Member List Section */}
                    <PageSection>
                      {/* Section header with title and 'View All' button */}
                      <SectionHeader
                        title="Community Members"
                        // actions={
                        //   <Button
                        //     as={Link}
                        //     to={`/community/${id}/members`}
                        //     variant="outline"
                        //     size="sm"
                        //   >
                        //     View All
                        //   </Button>
                        // }
                      />
                      {/* Member list with pagination */}
                      <SectionContent className="p-0">
                        {/* Display first 5 members, hides the section header */}
                        <MemberList
                          communityId={id!}
                          limit={5}
                          hideHeader={true}
                        />
                      </SectionContent>
                    </PageSection>
                    {/* Community Information Section */}
                    <PageSection>
                      <SectionHeader title="About this Community" />
                      <SectionContent>
                        <div className="space-y-4">
                          {/* Community Category */}
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              Category
                            </p>
                            <p className="text-sm text-gray-700 font-medium">
                              {community.category}
                            </p>
                          </div>
                          {/* Community Creation Date */}
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              Created
                            </p>
                            <p className="text-sm text-gray-700 font-medium">
                              {format(
                                new Date(community.created_at),
                                "MMMM d, yyyy"
                              )}
                            </p>
                          </div>
                          {/* Member Count */}
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              Members
                            </p>
                            <p className="text-sm text-gray-700 font-medium">
                              {memberCount} members
                            </p>
                          </div>
                          {/* Admin/owner only settings button */}
                          {(isOwner || isAdmin) && (
                            <div className="pt-4 border-t border-gray-200">
                              <Button
                                as={Link}
                                to={`/community/${id}/settings`}
                                variant="outline"
                                className="w-full justify-center"
                              >
                                <Settings className="h-4 w-4 mr-2" />
                                Manage Community
                              </Button>
                            </div>
                          )}
                        </div>
                      </SectionContent>
                    </PageSection>
                  </div>
                </div>
              </PageLayout>
              {/* Floating Create Post Button */}
              {user && isMember && (
                <Button
                  onClick={() => navigate(`/create-post?communityId=${id}`)}
                  className="fixed bottom-5 right-5 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700 text-white"
                  size="icon"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              )}
              {/* Image Update Dialog */}
              <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent className="max-w-[90vw] sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg">
                      Update Community Image
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 py-3">
                    <div className="space-y-2">
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        placeholder="https://example.com/image.jpg"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter a URL for the community background image
                      </p>
                    </div>
                    {/* Preview */}
                    {newImageUrl && (
                      <div className="relative h-24 sm:h-32 w-full overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={newImageUrl}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              fallbackImageUrl;
                          }}
                        />
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setImageDialogOpen(false);
                          setNewImageUrl("");
                        }}
                        disabled={updateImageLoading}
                        className="w-full sm:w-auto"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdateImage}
                        disabled={updateImageLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                      >
                        {updateImageLoading ? "Updating..." : "Update Image"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </main>
        </div>
      </PageLayout>
    </MainLayout>
  );
}
