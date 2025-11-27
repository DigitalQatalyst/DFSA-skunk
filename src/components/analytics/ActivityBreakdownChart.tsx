import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";
import { safeFetch } from "../../utils/safeFetch";
import { Skeleton } from "../../components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
interface Community {
  id: string;
  name: string;
}
interface ActivityData {
  name: string;
  posts: number;
  comments: number;
}
interface ActivityBreakdownChartProps {
  communities: Community[];
  refreshKey?: number;
}
export function ActivityBreakdownChart({
  communities,
  refreshKey,
}: ActivityBreakdownChartProps) {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchActivityData();
  }, [communities, refreshKey]);
  const fetchActivityData = async () => {
    if (communities.length === 0) return;
    setLoading(true);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activityData: ActivityData[] = await Promise.all(
      communities.map(async (community) => {
        // Get posts count for this community
        const postsQuery = supabase
          .from("posts")
          .select("id", { count: "exact" })
          .eq("community_id", community.id)
          .gte("created_at", thirtyDaysAgo.toISOString())
          .eq("status", "active");

        // Get all posts in this community to filter comments
        const postsInCommunityQuery = supabase
          .from("posts")
          .select("id")
          .eq("community_id", community.id);

        // Get all comments in the time period
        const commentsQuery = supabase
          .from("comments")
          .select("id, post_id")
          .gte("created_at", thirtyDaysAgo.toISOString())
          .eq("status", "active");

        // Execute queries directly to get count
        const postsCountResult = await postsQuery;
        const [postsInCommunity, commentsResult] = await Promise.all([
          safeFetch(postsInCommunityQuery),
          safeFetch(commentsQuery),
        ]);

        let commentsCount = 0;
        if (commentsResult[0] && postsInCommunity[0]) {
          const postIds = new Set(postsInCommunity[0].map((p: any) => p.id));
          commentsCount = commentsResult[0].filter((c: any) =>
            postIds.has(c.post_id)
          ).length;
        }

        const result = {
          name:
            community.name.length > 15
              ? community.name.substring(0, 15) + "..."
              : community.name,
          posts: postsCountResult.count ?? 0,
          comments: commentsCount,
        };

        console.log(`Activity data for ${community.name}:`, result);
        return result;
      })
    );
    setData(activityData);
    setLoading(false);
  };
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Activity Breakdown</h2>
        <p className="text-sm text-gray-600 mt-1">
          Posts vs Comments by community (last 30 days)
        </p>
      </div>
      <div className="p-6">
        {data.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-500">No activity data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 12,
                  fill: "#6b7280",
                }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{
                  fontSize: 12,
                  fill: "#6b7280",
                }}
                stroke="#9ca3af"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                }}
                iconType="circle"
              />
              <Bar
                dataKey="posts"
                fill="#3b82f6"
                name="Posts"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="comments"
                fill="#10b981"
                name="Comments"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
