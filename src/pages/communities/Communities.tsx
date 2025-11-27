import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  PlusCircle,
  FilterIcon,
  X as XIcon,
  HomeIcon,
  ChevronRightIcon,
} from "lucide-react";
import { SearchBar } from "../../components/communities/SearchBar";
import {
  FilterConfig,
  FilterSidebar,
} from "../../components/marketplace/FilterSidebar";
import { CreateCommunityModal } from "../../components/communities/CreateCommunityModal";
import { CommunityCard } from "../../components/KF eJP Library/Cards/CommunityCard";
import { Button } from "../../components/ui/button";
import { StickyActionButton } from "../../components/Button/StickyActionButton";
import { useAuth } from "../../context/UnifiedAuthProvider";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { useCommunityActions } from "../../hooks/useCommunityActions";
import { supabase } from "../../supabase/client";
import { isValidUUID } from "../../utils/validation";
import { toast } from "sonner";

// Temporary type for communities_with_counts view until types are regenerated
interface CommunityWithCountsRow {
  id: string | null;
  slug?: string | null;
  name: string | null;
  description: string | null;
  category: string | null;
  tags?: string[] | null;
  imageurl: string | null;
  banner_url?: string | null;
  isprivate?: boolean | null;
  status?: string | null;
  created_at: string | null;
  updated_at?: string | null;
  member_count: number | null;
  admin_count?: number | null;
  moderator_count?: number | null;
  recent_posts_count?: number | null;
  recent_comments_count?: number | null;
  last_activity_at?: string | null;
}

export interface Community {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  imageurl?: string;
  banner_url?: string | null;
  category?: string;
  tags?: string[];
  isprivate?: boolean;
  is_member?: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function Communities() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { joinCommunity, isCommunityMember } = useCommunityActions();

  // State for communities data
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(
    []
  );
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Filter sidebar visibility - should be visible on desktop, hidden on mobile by default
  const [showFilters, setShowFilters] = useState(false);

  // Track header height so sticky elements sit directly under it
  const [headerHeight, setHeaderHeight] = useState<number>(46);

  // Filter configuration
  const [filterConfig] = useState<FilterConfig[]>([
    {
      id: "memberCount",
      title: "Member Count",
      options: [
        {
          id: "small",
          name: "0-10 members",
        },
        {
          id: "medium",
          name: "11-50 members",
        },
        {
          id: "large",
          name: "51+ members",
        },
      ],
    },
    {
      id: "activityLevel",
      title: "Activity Level",
      options: [
        {
          id: "high",
          name: "High",
        },
        {
          id: "medium",
          name: "Medium",
        },
        {
          id: "low",
          name: "Low",
        },
      ],
    },
    {
      id: "category",
      title: "Category",
      options: [
        {
          id: "tech",
          name: "Technology",
        },
        {
          id: "business",
          name: "Business",
        },
        {
          id: "creative",
          name: "Creative",
        },
        {
          id: "social",
          name: "Social",
        },
        {
          id: "education",
          name: "Education",
        },
      ],
    },
  ]);
  // Measure header height for correct sticky offset on mobile
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header") as HTMLElement | null;
      setHeaderHeight(header?.offsetHeight || 46);
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, [user]);

  // Apply filters and search
  useEffect(() => {
    if (!communities.length) return;
    let result = [...communities];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (community) =>
          community.name.toLowerCase().includes(query) ||
          (community.description &&
            community.description.toLowerCase().includes(query))
      );
    }

    // Apply member count filter
    if (filters.memberCount && filters.memberCount.length > 0) {
      result = result.filter((community) => {
        const count = community.member_count || 0;
        return filters.memberCount.some((filter) => {
          if (filter === "small") return count < 11;
          if (filter === "medium") return count >= 11 && count <= 50;
          if (filter === "large") return count > 50;
          return false;
        });
      });
    }

    // For demo purposes, randomly assign activity levels based on member count
    if (filters.activityLevel && filters.activityLevel.length > 0) {
      result = result.filter((community) => {
        const count = community.member_count || 0;
        let activityLevel = "low";
        if (count > 50) activityLevel = "high";
        else if (count > 10) activityLevel = "medium";
        return filters.activityLevel.includes(activityLevel);
      });
    }

    // For demo purposes, randomly filter by category
    if (filters.category && filters.category.length > 0) {
      result = result.filter((community) => {
        const communityCategory = community.category?.toLowerCase();
        return (
          communityCategory && filters.category.includes(communityCategory)
        );
      });
    }
    setFilteredCommunities(result);
  }, [communities, searchQuery, filters]);

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("communities_with_counts")
        .select("*")
        .order("member_count", { ascending: false });

      if (error) throw error;

      if (data) {
        console.log("Fetched communities:", data);
        // Enhance communities with membership status and filter out invalid entries
        const enhancedCommunities = (data as CommunityWithCountsRow[])
          .filter((community) => community.id && community.name)
          .map((community) => ({
            id: community.id!,
            name: community.name!,
            description: community.description,
            member_count: community.member_count || 0,
            imageurl: community.imageurl || undefined,
            banner_url: community.banner_url,
            category: community.category || undefined,
            tags: community.tags || [],
            isprivate: community.isprivate || false,
            created_at: community.created_at || undefined,
            updated_at: community.updated_at || undefined,
            is_member: user ? isCommunityMember(community.id!) : false,
          }));

        setCommunities(enhancedCommunities);
        setFilteredCommunities(enhancedCommunities);
      }
    } catch (err) {
      console.error("Error fetching communities:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to load communities")
      );
    } finally {
      setLoading(false);
    }
  }, [user, isCommunityMember]);

  // Fetch communities on mount and when user changes
  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const handleCommunityCreated = () => {
    fetchCommunities();
  };
  const handleFilterChange = useCallback(
    (filterType: string, value: string) => {
      setFilters((prev) => {
        const currentValues = prev[filterType] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        return {
          ...prev,
          [filterType]: newValues,
        };
      });
    },
    []
  );
  const resetFilters = useCallback(() => {
    setFilters({});
    setSearchQuery("");
  }, []);

  // Toggle sidebar visibility (only on mobile)
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);
  const { login } = useAuth();

  const handleViewCommunity = useCallback(
    (communityId: string) => {
      navigate(`/community/${communityId}`);
    },
    [navigate]
  );

  // Fetch communities on mount and when user changes
  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  //const { joinCommunity, isLoading: isJoining } = useCommunityActions();

  const handleJoinCommunity = useCallback(
    async (communityId: string) => {
      if (!user) {
        login();
        return;
      }

      // Validate UUID
      if (!isValidUUID(communityId)) {
        toast.error("Invalid community ID");
        return;
      }

      const success = await joinCommunity(communityId);
      if (success) {
        // The hook handles updating the memberships state
        console.log("Successfully joined the community!");
        // Update the local state to reflect the join
        setCommunities((prev) =>
          prev.map((community) =>
            community.id === communityId
              ? {
                  ...community,
                  member_count: community.member_count + 1,
                  is_member: true,
                }
              : community
          )
        );
        navigate(`/community/${communityId}`);
      }
    },
    [joinCommunity, user, login]
  );
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--gradient-subtle)]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Unified layout for both logged in and logged out users
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/community"
                className="text-gray-600 hover:text-gray-900 inline-flex items-center"
              >
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">Communities</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Communities</h1>
          {/* Only show Create Community button for logged-in users on mobile */}
          {user && user.role === "admin" && (
            <Button
              onClick={() => navigate("/create-community")}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white gap-2 transition-all duration-200 ease-in-out"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          )}
        </div>
        <p className="text-gray-600 mb-6">
          Find and join communities to connect with like-minded individuals and
          organizations.
        </p>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="w-full">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search communities by name or description..."
            />
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div
            className="xl:hidden sticky z-20 bg-gray-50 py-2 shadow-sm"
            style={{ top: `${headerHeight}px` }}
          >
            <div className="flex justify-between items-center">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
                aria-expanded={showFilters}
                aria-controls="filter-sidebar"
              >
                <FilterIcon size={18} />
                {showFilters ? "Hide Filters" : "Show Filters"}
                {Object.values(filters).some((arr) => arr.length > 0) && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue text-xs text-white font-medium ml-2">
                    {Object.values(filters).reduce(
                      (acc, arr) => acc + arr.length,
                      0
                    )}
                  </span>
                )}
              </button>
              {Object.values(filters).some((f) => f.length > 0) && (
                <button
                  onClick={resetFilters}
                  className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Filter sidebar - mobile/tablet */}
          <div
            className={`fixed inset-x-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden ${
              showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleFilters}
            aria-hidden={!showFilters}
            style={{ top: headerHeight, bottom: 0 }}
          >
            <div
              id="filter-sidebar"
              className={`fixed left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                showFilters ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              style={{ top: headerHeight, bottom: 0 }}
            >
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={toggleFilters}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close filters"
                  >
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar
                    filters={filters}
                    filterConfig={filterConfig}
                    onFilterChange={handleFilterChange}
                    onResetFilters={resetFilters}
                    isResponsive={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter sidebar - desktop - always visible */}
          <div className="hidden xl:block xl:w-1/4">
            <div className="bg-white rounded-lg shadow sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-lg font-semibold">Filters</h2>
                {Object.values(filters).some((f) => f.length > 0) && (
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Reset All
                  </button>
                )}
              </div>
              <div className="p-4 overflow-y-auto scrollbar-hide">
                <FilterSidebar
                  filters={filters}
                  filterConfig={filterConfig}
                  onFilterChange={handleFilterChange}
                  onResetFilters={resetFilters}
                  isResponsive={false}
                />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="xl:w-3/4">
            {/* Active filters display */}
            {Object.values(filters).some((arr) => arr.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(filters).map(([key, values]) =>
                  values.map((value) => {
                    const filterSection = filterConfig.find(
                      (f) => f.id === key
                    );
                    const option = filterSection?.options.find(
                      (o) => o.id === value
                    );
                    return (
                      <div
                        key={`${key}-${value}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm"
                      >
                        <span>{option?.name || value}</span>
                        <button onClick={() => handleFilterChange(key, value)}>
                          <XIcon className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })
                )}
                <button
                  onClick={resetFilters}
                  className="text-sm text-brand-blue hover:text-brand-darkBlue font-medium transition-colors duration-150 ease-in-out"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Communities Grid */}
            <div className="">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {[...Array(6)].map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg shadow-sm p-4 h-64 animate-pulse"
                    >
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                      <div className="flex justify-between mt-auto pt-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="border border-red-200 bg-red-50 text-red-800 p-4 rounded-md">
                  {error.message}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={fetchCommunities}
                    className="ml-4"
                  >
                    Retry
                  </Button>
                </div>
              ) : searchQuery.trim() && filteredCommunities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No communities match your search for "{searchQuery}"
                  </p>
                </div>
              ) : filteredCommunities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No communities found.</p>
                </div>
              ) : (
                <>
                  <div className="">
                    <h1 className="text-xl font-medium text-gray-800 mb-2">
                      Available Communities ({filteredCommunities.length})
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                      {filteredCommunities.map((community) => {
                        const count = community.member_count || 0;

                        // Calculate activity level based on member count
                        let activityLevel: "low" | "medium" | "high" = "low";
                        if (count > 50) activityLevel = "high";
                        else if (count > 10) activityLevel = "medium";

                        // Estimate active members (60-90% of total)
                        const activeMembers = Math.floor(
                          count * (0.6 + Math.random() * 0.3)
                        );

                        // Use actual tags from database, or build from available data
                        const tags: string[] =
                          community.tags && community.tags.length > 0
                            ? community.tags
                            : [
                                community.category || "General",
                                activityLevel === "high"
                                  ? "Popular"
                                  : "Growing",
                              ].filter(Boolean);

                        return (
                          <CommunityCard
                            key={community.id}
                            item={{
                              id: community.id,
                              name: community.name || "Unnamed Community",
                              description:
                                community.description ||
                                "No description available",
                              memberCount: community.member_count,
                              activeMembers: activeMembers,
                              category: community.category || "General",
                              tags: tags,
                              imageUrl:
                                community.imageurl ||
                                "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                              isPrivate: community.isprivate || false,
                              activityLevel: activityLevel,
                              recentActivity:
                                count > 0
                                  ? `Active community with ${count} members`
                                  : undefined,
                            }}
                            onJoin={() => handleJoinCommunity(community.id)}
                            onViewDetails={() =>
                              handleViewCommunity(community.id)
                            }
                            isMember={community.is_member === true}
                          />
                        );
                      })}
                    </div>
                  </div>
                  {filteredCommunities.length > 0 && (
                    <p className="text-sm text-muted-foreground text-center mt-6">
                      Showing {filteredCommunities.length} of{" "}
                      {communities.length} communities
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Floating Create Button (mobile) - Only for logged-in users */}
        {user && (
          <div className="sm:hidden">
            <StickyActionButton
              onClick={() => navigate("/communities/create")}
              buttonText=""
            />
          </div>
        )}

        <CreateCommunityModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onCommunityCreated={handleCommunityCreated}
        />
      </div>
      <Footer isLoggedIn={true} />
    </div>
  );
}
