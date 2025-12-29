import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../../context/UnifiedAuthProvider";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { X, Search, Home } from "lucide-react";
import { supabase } from "../../supabase/client";
import { MainLayout } from "../../components/layouts/MainLayout";
import { FeedSidebar } from "../../components/feed/FeedSidebar";
import { TabsFeed } from "../../components/feed/TabsFeed";
import { InlineComposer } from "../../components/post/InlineComposer";
import {
  PageLayout,
  PageSection,
  SectionContent,
  SectionHeader,
} from "../../components/PageLayout";
import { Button } from "../../components/ui/button";
import { BasePost } from "../../components/posts/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";

export default function CommunityFeed() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { openModal: openLoginModal } = useAuthModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const [myPosts, setMyPosts] = useState<BasePost[]>([]);
  const [globalPosts, setGlobalPosts] = useState<BasePost[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<BasePost[]>([]);
  const [myLoading, setMyLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("my_communities");
  const [currentSort, setCurrentSort] = useState<string>("recent");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filterTag = searchParams.get("tag");

  // Handle unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      openLoginModal();
    }
  }, [loading, user, openLoginModal]);

  useEffect(() => {
    if (user) {
      fetchMyPosts(currentSort, 0);
      fetchGlobalPosts(currentSort, 0);
      fetchTrendingPosts(currentSort, 0);
    }
  }, [user, filterTag]);

  const fetchMyPosts = async (
    _sortBy: string = "recent",
    offset: number = 0
  ) => {
    if (!user) return;
    setMyLoading(true);

    const isModerator = user.role === "admin" || user.role === "moderator";

    // Query posts table directly for all users
    let query = supabase.from("posts").select(
      `
        *,
        communities!inner(name),
        users_local!inner(username, avatar_url)
      `
    );

    // Regular users only see active posts
    if (!isModerator) {
      query = query.eq("status", "active");
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(10)
      .range(offset, offset + 9);

    if (!error && data) {
      // Fetch reaction and comment counts separately
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

      let filteredData = posts;
      if (filterTag) {
        filteredData = posts.filter((post: BasePost) =>
          post.tags?.includes(filterTag)
        );
      }
      setMyPosts(offset === 0 ? filteredData : [...myPosts, ...filteredData]);
    }
    setMyLoading(false);
  };

  const fetchGlobalPosts = async (
    _sortBy: string = "recent",
    offset: number = 0
  ) => {
    if (!user) return;
    setGlobalLoading(true);

    const isModerator = user.role === "admin" || user.role === "moderator";

    // Query posts table directly for all users
    let query = supabase.from("posts").select(
      `
        *,
        communities!inner(name),
        users_local!inner(username, avatar_url)
      `
    );

    // Regular users only see active posts
    if (!isModerator) {
      query = query.eq("status", "active");
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(10)
      .range(offset, offset + 9);

    if (!error && data) {
      // Fetch reaction and comment counts separately
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

      let filteredData = posts;
      if (filterTag) {
        filteredData = posts.filter((post: BasePost) =>
          post.tags?.includes(filterTag)
        );
      }
      setGlobalPosts(
        offset === 0 ? filteredData : [...globalPosts, ...filteredData]
      );
    }
    setGlobalLoading(false);
  };

  const fetchTrendingPosts = async (
    sortBy: string = "recent",
    offset: number = 0
  ) => {
    setTrendingLoading(true);
    const { data, error } = await supabase.rpc("get_feed", {
      feed_tab: "trending",
      sort_by: sortBy,
      user_id_param: user?.id || undefined,
      limit_count: 10,
      offset_count: offset,
    });
    if (!error && data) {
      let filteredData = data;
      if (filterTag) {
        filteredData = data.filter((post: BasePost) =>
          post.tags?.includes(filterTag)
        );
      }
      setTrendingPosts(
        offset === 0 ? filteredData : [...trendingPosts, ...filteredData]
      );
    }
    setTrendingLoading(false);
  };

  const handlePostCreated = () => {
    fetchMyPosts("recent", 0);
    fetchGlobalPosts("recent", 0);
    fetchTrendingPosts("recent", 0);
  };

  const handleSortChange = (sortBy: string) => {
    setCurrentSort(sortBy);
    fetchMyPosts(sortBy, 0);
    fetchGlobalPosts(sortBy, 0);
    fetchTrendingPosts(sortBy, 0);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTagFilter = (tag: string) => {
    setSearchParams({ tag });
  };

  const clearTagFilter = () => {
    setSearchParams({});
  };

  // Filter posts based on search query
  const filterPostsBySearch = useCallback(
    (posts: BasePost[]) => {
      if (!searchQuery.trim()) return posts;

      const query = searchQuery.toLowerCase();
      return posts.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(query);
        const contentMatch = post.content?.toLowerCase().includes(query);
        const authorMatch = post.author_username?.toLowerCase().includes(query);
        const communityMatch = post.community_name
          ?.toLowerCase()
          .includes(query);
        const tagsMatch = post.tags?.some((tag) =>
          tag.toLowerCase().includes(query)
        );

        return (
          titleMatch ||
          contentMatch ||
          authorMatch ||
          communityMatch ||
          tagsMatch
        );
      });
    },
    [searchQuery]
  );

  // Apply search filter to posts
  const filteredMyPosts = useMemo(
    () => filterPostsBySearch(myPosts),
    [myPosts, filterPostsBySearch]
  );

  const filteredGlobalPosts = useMemo(
    () => filterPostsBySearch(globalPosts),
    [globalPosts, filterPostsBySearch]
  );

  const filteredTrendingPosts = useMemo(
    () => filterPostsBySearch(trendingPosts),
    [trendingPosts, filterPostsBySearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleLoadMore = (tab: string) => {
    // Use unfiltered post count for offset to fetch correct next batch
    const offset =
      tab === "my_communities"
        ? myPosts.length
        : tab === "global"
        ? globalPosts.length
        : trendingPosts.length;
    if (tab === "my_communities") fetchMyPosts(currentSort, offset);
    else if (tab === "global") fetchGlobalPosts(currentSort, offset);
    else fetchTrendingPosts(currentSort, offset);
  };

  // Check if we should show load more button
  const canLoadMore = !searchQuery.trim();

  if (loading) {
    return (
      <MainLayout hidePageLayout fullWidth>
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  // Show empty state for unauthenticated users (login modal will be shown automatically)
  if (!user) {
    navigate("/community");
  }

  return (
    <MainLayout>
      <PageLayout>
        <div className="min-h-screen">
          <main className="p-4 lg:p-6">
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
              {/* Page Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Community Feed
                  </h1>
                  <p className="text-gray-600">
                    See updates and posts from your joined communities
                  </p>
                </div>
              </div>
              {/* Tag Filter Badge */}
              {filterTag && (
                <PageSection className="mb-6">
                  <SectionContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">
                        Filtered by:
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-lightBlue text-brand-blue rounded-full text-xs font-medium">
                        #{filterTag}
                        <button
                          onClick={clearTagFilter}
                          className="ml-1 hover:text-brand-darkBlue transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearTagFilter}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Clear filter
                    </Button>
                  </SectionContent>
                </PageSection>
              )}
              <PageSection className="rounded-xl">
                <SectionContent>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                      placeholder="Search posts by title, content, author, community, or tags..."
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                </SectionContent>
              </PageSection>

              {/* Search Results Info */}
              {searchQuery && (
                <div className="text-sm text-gray-600">
                  Showing results for "{searchQuery}"
                  {filteredMyPosts.length === 0 &&
                    filteredGlobalPosts.length === 0 &&
                    filteredTrendingPosts.length === 0 && (
                      <span className="ml-2 text-gray-500">
                        - No posts found
                      </span>
                    )}
                </div>
              )}
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Feed Content - Takes up 2 columns on desktop */}
                <div className="lg:col-span-2 space-y-6">
                  <SectionHeader
                    title="Create a Post"
                    description="Share your thoughts, questions, or updates with the community"
                    children={undefined}
                  />

                  <PageSection className="rounded-xl">
                    {" "}
                    <SectionContent>
                      <InlineComposer onPostCreated={handlePostCreated} />
                    </SectionContent>
                  </PageSection>

                  <TabsFeed
                    myPosts={filteredMyPosts}
                    globalPosts={filteredGlobalPosts}
                    trendingPosts={filteredTrendingPosts}
                    myLoading={myLoading}
                    globalLoading={globalLoading}
                    trendingLoading={trendingLoading}
                    onNewPost={() => navigate("/create-post")}
                    onSortChange={handleSortChange}
                    onLoadMore={handleLoadMore}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    onPostActionComplete={handlePostCreated}
                    canLoadMore={canLoadMore}
                    totalMyPosts={myPosts.length}
                    totalGlobalPosts={globalPosts.length}
                    totalTrendingPosts={trendingPosts.length}
                  />
                </div>

                {/* Sidebar - Shows on all screens */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Search Box */}
                  {/* <PageSection>
              <SectionContent className="p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                    placeholder="Search posts..."
                  />
                </div>
              </SectionContent>
            </PageSection> */}

                  {/* Sidebar Content */}
                  <FeedSidebar onTagClick={handleTagFilter} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </PageLayout>
    </MainLayout>
  );
}
