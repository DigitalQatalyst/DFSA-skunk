import { useEffect, useState } from "react";
import { useAuth } from "../../context/UnifiedAuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useAuthModal } from "../../contexts/AuthModalContext";
import {
  Users,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { supabase } from "../../supabase/client";
import { safeFetch } from "../../utils/safeFetch";
import { MainLayout } from "../../components/layouts/MainLayout";
import { Button } from "../../components/ui/button";
import { CommunityCard } from "../../components/Cards/CommunityCard";
import { LoginForm } from "../../components/auth/LoginForm";
interface Community {
  id: string;
  name: string;
  description: string;
  member_count: number;
  imageurl: string;
}
interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  community_name: string;
  community_id: string;
  author_username: string;
  author_id: string;
}
export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { openModal: openLoginModal } = useAuthModal();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [communitiesError, setCommunitiesError] = useState<Error | null>(null);
  const [postsError, setPostsError] = useState<Error | null>(null);
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/feed");
    }
  }, [user, authLoading, navigate]);
  useEffect(() => {
    if (!user) {
      fetchTrendingCommunities();
      fetchTrendingPosts();
    }
  }, [user]);
  const fetchTrendingCommunities = async () => {
    setCommunitiesLoading(true);
    setCommunitiesError(null);
    const query = supabase
      .from("communities_with_counts")
      .select("*")
      .order("member_count", {
        ascending: false,
      })
      .limit(6);
    const [data, error] = await safeFetch(query);
    if (error) {
      setCommunitiesError(new Error("Failed to load trending communities"));
    } else if (data) {
      setCommunities(data as Community[]);
    }
    setCommunitiesLoading(false);
  };
  const fetchTrendingPosts = async () => {
    setPostsLoading(true);
    setPostsError(null);
    const query = supabase
      .from("posts_with_meta")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(6);
    const [data, error] = await safeFetch(query);
    if (error) {
      setPostsError(new Error("Failed to load trending posts"));
    } else if (data) {
      setPosts(data as Post[]);
    }
    setPostsLoading(false);
  };
  const getActivityLevel = (memberCount: number): "low" | "medium" | "high" => {
    if (memberCount < 10) return "low";
    if (memberCount < 50) return "medium";
    return "high";
  };
  const getRecentActivity = (communityName: string): string => {
    const activities = [
      `New discussion started in ${communityName}`,
      `Member shared a resource in ${communityName}`,
      `Upcoming event announced in ${communityName}`,
      `Community guidelines updated in ${communityName}`,
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };
  if (authLoading) {
    return (
      <MainLayout hidePageLayout fullWidth>
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </MainLayout>
    );
  }
  return (
    <MainLayout hidePageLayout fullWidth>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          {/* Hero Section */}
          <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center bg-gray-800">
            {/* Background Image with Dark Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1512632578888-169bbbc64f33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Abu Dhabi cityscape"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient from-gray-900/20  to-gray-900/20"></div>
            </div>
            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <span className="text-white/90 text-sm font-medium tracking-wider">
                    Connect • Collaborate • Create
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white max-w-4xl">
                  Join Our Vibrant Community in Abu Dhabi
                </h1>
                <p className="mt-3 text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
                  Explore ideas, connect with innovators, and belong to a
                  growing network of changemakers shaping the future.
                </p>
                <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
                  <Button
                    onClick={openLoginModal}
                    className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center flex items-center justify-center overflow-hidden group"
                    size="lg"
                  >
                    {/* <Sparkles className="mr-2 h-5 w-5" /> */}
                    Join the Community
                    <ArrowRight
                      size={18}
                      className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </Button>
                  <Button
                    onClick={() => navigate("/communities")}
                    className="px-8 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    size="lg"
                    variant="outline"
                  >
                    Explore Communities
                  </Button>
                </div>
              </div>
            </div>
          </section>
          {/* Trending Communities Section */}
          <section className="bg-gray-50 py-16 md:py-20 shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.06)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
                Join Trending Communities
              </h2>
              <p className="mt-2 text-gray-600 text-center max-w-2xl mx-auto">
                Discover the most active and engaging spaces to connect with
                peers who share your interests.
              </p>
              {communitiesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-muted-foreground">
                    Loading communities...
                  </div>
                </div>
              ) : communitiesError ? (
                <div className="border border-red-200 bg-red-50 text-red-800 p-4 rounded-md mt-10">
                  {communitiesError.message}
                </div>
              ) : communities.length === 0 ? (
                <div className="text-center py-8 mt-10">
                  <p>
                    No trending communities yet — be the first to start one.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                    {communities.slice(0, 3).map((community) => {
                      const activityLevel = getActivityLevel(
                        community.member_count || 0
                      );
                      const activeMembers = Math.floor(
                        (community.member_count || 0) *
                        (0.6 + Math.random() * 0.3)
                      );
                      const tags = [
                        "Abu Dhabi",
                        "Innovation",
                        community.name.includes("Tech")
                          ? "Technology"
                          : "Business",
                        activityLevel === "high" ? "Popular" : "Growing",
                      ];
                      const isPrivate = Math.random() > 0.7;
                      return (
                        <div
                          key={community.id}
                          className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                        >
                          <CommunityCard
                            item={{
                              id: community.id,
                              name: community.name || "Unnamed Community",
                              description:
                                community.description ||
                                "No description available",
                              memberCount: community.member_count || 0,
                              activeMembers: activeMembers,
                              category: "Community",
                              tags: tags,
                              imageUrl:
                                community.imageurl ||
                                "https://images.unsplash.com/photo-1534043464124-3be32fe000c9",
                              isPrivate: isPrivate,
                              activityLevel: activityLevel,
                              recentActivity: getRecentActivity(community.name),
                            }}
                            onJoin={() =>
                              navigate(`/community/${community.id}`)
                            }
                            onViewDetails={() =>
                              navigate(`/community/${community.id}`)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                  {communities.length > 3 && (
                    <div className="mt-8 text-center">
                      <Link
                        to="/communities"
                        className="inline-flex items-center text-sm font-medium text-indigo-700 hover:text-indigo-800"
                      >
                        View All Communities
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
          {/* Trending Posts Section */}
          <section className="bg-white py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
                Latest Community Discussions
              </h2>
              <p className="mt-2 text-gray-600 text-center max-w-2xl mx-auto">
                Stay informed with the most engaging conversations happening
                across our communities.
              </p>
              {postsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-muted-foreground">
                    Loading posts...
                  </div>
                </div>
              ) : postsError ? (
                <div className="border border-red-200 bg-red-50 text-red-800 p-4 rounded-md mt-10">
                  {postsError.message}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 mt-10">
                  <p>No posts yet — join and create your first post.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                    {posts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="group transition-all duration-200 hover:drop-shadow-md"
                        onClick={() => navigate(`/post/${post.id}`)}
                      >
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out overflow-hidden cursor-pointer h-full flex flex-col focus-visible:ring-2 focus-visible:ring-brand-teal outline-none">
                          <div className="h-1.5 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
                          <div className="p-6 flex flex-col h-full">
                            {/* Community badge */}
                            <div className="mb-4">
                              <button
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/community/${post.community_id}`);
                                }}
                              >
                                <MessageSquare className="mr-1 h-3 w-3" />
                                {post.community_name || "Finance"}
                              </button>
                            </div>
                            {/* Post title */}
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-indigo-700 transition-colors line-clamp-2 leading-snug">
                              {post.title}
                            </h3>
                            {/* Post content */}
                            <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                              {post.content ? (
                                <>
                                  {post.content.substring(0, 160)}
                                  {post.content.length > 160 ? "..." : ""}
                                </>
                              ) : (
                                <span className="text-gray-400 italic">
                                  this text shows up if the post doesn't have a
                                  description{" "}
                                </span>
                              )}
                            </p>
                            {/* Author info and timestamp */}
                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 border border-gray-200">
                                  <AvatarImage
                                    src={`https://avatar.vercel.sh/${post.author_username || "anonymous"
                                      }`}
                                    alt={post.author_username || "Anonymous"}
                                  />
                                  <AvatarFallback className="text-xs bg-indigo-50 text-indigo-700">
                                    {post.author_username
                                      ?.charAt(0)
                                      .toUpperCase() || "A"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <button
                                    className="text-sm font-medium text-gray-900 hover:text-indigo-700 transition-colors text-left"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/profile/${post.author_id}`);
                                    }}
                                  >
                                    {post.author_username || "Anonymous"}
                                  </button>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {formatDistanceToNow(
                                      new Date(post.created_at),
                                      {
                                        addSuffix: true,
                                      }
                                    )}
                                  </div>
                                </div>
                              </div>
                              {/* Read more link */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 p-0 h-auto"
                              >
                                Read
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <Link
                      to="/feed"
                      className="inline-flex items-center text-sm font-medium text-indigo-700 hover:text-indigo-800"
                    >
                      View All Posts
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </section>
          {/* Features Section */}
          <section className="bg-gray-50 py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
                Why Join Our Community?
              </h2>
              <p className="mt-2 text-gray-600 text-center max-w-2xl mx-auto">
                Our platform offers everything you need to connect, learn, and
                grow with others who share your interests.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                {/* Feature 1 */}
                <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 grid place-content-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Connect with Peers
                  </h3>
                  <p className="text-gray-600">
                    Build meaningful connections with professionals and
                    enthusiasts who share your interests and goals.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 grid place-content-center">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Engage in Discussions
                  </h3>
                  <p className="text-gray-600">
                    Participate in thoughtful conversations that matter to you
                    and contribute your unique perspective.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 grid place-content-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Discover Opportunities
                  </h3>
                  <p className="text-gray-600">
                    Find new opportunities for collaboration, learning, and
                    growth within our vibrant community ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* CTA Section */}
          <section className="bg-white py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-center">
                  Ready to Join Our Community?
                </h2>
                <p className="mt-2 text-white/90 text-center max-w-2xl mx-auto">
                  Join thousands of innovators already collaborating, sharing
                  ideas, and growing together on our platform.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={openLoginModal}
                    className="bg-white text-indigo-700 hover:bg-white/90 font-medium px-6 py-2.5"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Join Now
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
