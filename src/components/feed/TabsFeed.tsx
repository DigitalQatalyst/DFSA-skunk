import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Home, Globe, TrendingUp, Plus } from "lucide-react";
import { PostCard } from "../../components/posts/PostCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { BasePost } from "../posts/types";
interface TabsFeedProps {
  myPosts: BasePost[];
  globalPosts: BasePost[];
  trendingPosts: BasePost[];
  myLoading: boolean;
  globalLoading: boolean;
  trendingLoading: boolean;
  onNewPost: () => void;
  onSortChange: (sortBy: string) => void;
  onLoadMore: (tab: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onPostActionComplete?: () => void;
  canLoadMore?: boolean;
  totalMyPosts?: number;
  totalGlobalPosts?: number;
  totalTrendingPosts?: number;
}
export function TabsFeed({
  myPosts,
  globalPosts,
  trendingPosts,
  myLoading,
  globalLoading,
  trendingLoading,
  onNewPost,
  onSortChange,
  onLoadMore,
  activeTab,
  onTabChange,
  onPostActionComplete,
  canLoadMore = true,
  totalMyPosts = 0,
  totalGlobalPosts = 0,
  totalTrendingPosts = 0,
}: TabsFeedProps) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("recent");
  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sortMap: Record<string, string> = {
      newest: "recent",
      "most-reacted": "most_reacted",
      "most-commented": "most_commented",
    };
    onSortChange(sortMap[value] || "recent");
  };

  return (
    <Card className="shadow-sm border border-gray-100 overflow-hidden bg-white">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <CardHeader className="pb-3 sm:pb-0 bg-white border-b border-gray-100">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2">
            <TabsList className="bg-gray-50 p-1 rounded-lg border-0 h-auto w-full sm:w-auto overflow-x-auto flex-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <TabsTrigger
                value="my_communities"
                className="relative data-[state=active]:bg-transparent data-[state=active]:text-[#0030E3] data-[state=active]:shadow-none transition-all duration-200 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0030E3] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200 whitespace-nowrap"
              >
                <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span>My Communities</span>
              </TabsTrigger>
              <TabsTrigger
                value="global"
                className="relative data-[state=active]:bg-transparent data-[state=active]:text-[#0030E3] data-[state=active]:shadow-none transition-all duration-200 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0030E3] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200 whitespace-nowrap"
              >
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="relative data-[state=active]:bg-transparent data-[state=active]:text-[#0030E3] data-[state=active]:shadow-none transition-all duration-200 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0030E3] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200 whitespace-nowrap"
              >
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span>Trending</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[120px] sm:w-[140px] bg-white border-gray-200 hover:border-[#0030E3] transition-colors text-xs sm:text-sm">
                  <SelectValue
                    placeholder="Sort by"
                    className="text-xs sm:text-sm"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="most_reacted">Most Reacted</SelectItem>
                  <SelectItem value="most_commented">Most Commented</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => navigate("/create-post")}
                className="bg-[#0030E3] text-white hover:bg-[#002180] transition-all duration-200 text-xs sm:text-sm font-medium whitespace-nowrap"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Post
              </Button>
            </div>
          </div>
        </CardHeader>

        <TabsContent value="my_communities" className="mt-0">
          <CardContent className="p-4 space-y-3">
            {myLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse space-y-4">
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            ) : myPosts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Home className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-900 font-semibold mb-2">
                  No posts yet — start a discussion!
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Join communities or create your first post to get started.
                </p>
                <Button
                  onClick={() => navigate("/post/create")}
                  className="bg-[#0030E3] hover:bg-[#002180] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              </div>
            ) : (
              <>
                {myPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onActionComplete={onPostActionComplete}
                  />
                ))}
                {canLoadMore
                  ? totalMyPosts >= 10 && (
                      <div className="flex justify-center pt-4">
                        <Button
                          variant="outline"
                          onClick={() => onLoadMore("my_communities")}
                          className="border-[#0030E3] text-[#0030E3] hover:bg-blue-50 transition-colors"
                        >
                          Load More Posts
                        </Button>
                      </div>
                    )
                  : myPosts.length < totalMyPosts &&
                    totalMyPosts >= 10 && (
                      <div className="text-center py-4 text-sm text-gray-500">
                        Showing {myPosts.length} of {totalMyPosts} posts. Clear
                        search to load more.
                      </div>
                    )}
              </>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="global" className="mt-0">
          <CardContent className="p-4 space-y-3">
            {globalLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse space-y-4">
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            ) : globalPosts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Globe className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-900 font-semibold mb-2">
                  No posts yet — be the first!
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Share your ideas with the global community.
                </p>
                <Button
                  onClick={() => navigate("/post/create")}
                  className="bg-[#0030E3] hover:bg-[#002180] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create a Post
                </Button>
              </div>
            ) : (
              <>
                {globalPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onActionComplete={onPostActionComplete}
                  />
                ))}
                {canLoadMore
                  ? totalGlobalPosts >= 10 && (
                      <div className="flex justify-center pt-4">
                        <Button
                          variant="outline"
                          onClick={() => onLoadMore("global")}
                          className="border-[#0030E3] text-[#0030E3] hover:bg-blue-50 transition-colors"
                        >
                          Load More Posts
                        </Button>
                      </div>
                    )
                  : globalPosts.length < totalGlobalPosts &&
                    totalGlobalPosts >= 10 && (
                      <div className="text-center py-4 text-sm text-gray-500">
                        Showing {globalPosts.length} of {totalGlobalPosts}{" "}
                        posts. Clear search to load more.
                      </div>
                    )}
              </>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="trending" className="mt-0">
          <CardContent className="p-4 space-y-3">
            {trendingLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse space-y-4">
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            ) : trendingPosts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-900 font-semibold mb-2">
                  No trending posts yet
                </p>
                <p className="text-sm text-gray-600">
                  Check back later for popular content!
                </p>
              </div>
            ) : (
              <>
                {trendingPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onActionComplete={onPostActionComplete}
                  />
                ))}
                {canLoadMore
                  ? totalTrendingPosts >= 10 && (
                      <div className="flex justify-center pt-4">
                        <Button
                          variant="outline"
                          onClick={() => onLoadMore("trending")}
                          className="border-[#0030E3] text-[#0030E3] hover:bg-blue-50 transition-colors"
                        >
                          Load More Posts
                        </Button>
                      </div>
                    )
                  : trendingPosts.length < totalTrendingPosts &&
                    totalTrendingPosts >= 10 && (
                      <div className="text-center py-4 text-sm text-gray-500">
                        Showing {trendingPosts.length} of {totalTrendingPosts}{" "}
                        posts. Clear search to load more.
                      </div>
                    )}
              </>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
