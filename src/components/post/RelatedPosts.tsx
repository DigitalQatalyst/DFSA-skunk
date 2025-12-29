import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { safeFetch } from "../../utils/safeFetch";
import { format } from "date-fns";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
interface RelatedPost {
  id: string;
  title: string;
  created_at: string;
  helpful_count: number;
  comment_count: number;
}
interface RelatedPostsProps {
  currentPostId: string;
  communityId: string;
  tags: string[];
}
export function RelatedPosts({
  currentPostId,
  communityId,
  tags,
}: RelatedPostsProps) {
  const [posts, setPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchRelatedPosts();
  }, [currentPostId, communityId]);
  const fetchRelatedPosts = async () => {
    setLoading(true);
    const query = supabase
      .from("posts_with_reactions")
      .select("id, title, created_at, helpful_count, comment_count")
      .eq("community_id", communityId)
      .neq("id", currentPostId)
      .order("created_at", {
        ascending: false,
      })
      .limit(3);
    const [data, err] = await safeFetch(query);
    if (!err && data) {
      setPosts(data);
    }
    setLoading(false);
  };
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }
  if (posts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No related posts found.</p>
    );
  }
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/post/${post.id}`}
          className="block group p-4 bg-white border border-border rounded-lg hover:shadow-md  transition-all"
        >
          <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {post.title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{format(new Date(post.created_at), "MMM d")}</span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {post.helpful_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {post.comment_count}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
