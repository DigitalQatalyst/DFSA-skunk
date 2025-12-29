import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../context/UnifiedAuthProvider";
import { ThumbsUp, Lightbulb, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
interface PostReactionsProps {
  postId: string;
  helpfulCount: number;
  insightfulCount: number;
}
export function PostReactions({
  postId,
  helpfulCount: initialHelpfulCount,
  insightfulCount: initialInsightfulCount,
}: PostReactionsProps) {
  const { user } = useAuth();
  const [hasReactedHelpful, setHasReactedHelpful] = useState(false);
  const [hasReactedInsightful, setHasReactedInsightful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(initialHelpfulCount);
  const [insightfulCount, setInsightfulCount] = useState(
    initialInsightfulCount
  );
  useEffect(() => {
    if (user) {
      checkUserReactions();
    }
  }, [user, postId]);
  const checkUserReactions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("reactions")
      .select("reaction_type")
      .eq("post_id", postId)
      .eq("user_id", user.id);
    if (data) {
      setHasReactedHelpful(data.some((r) => r.reaction_type === "helpful"));
      setHasReactedInsightful(
        data.some((r) => r.reaction_type === "insightful")
      );
    }
  };
  const handleReaction = async (type: "helpful" | "insightful") => {
    if (!user) {
      toast.error("Please sign in to react to posts");
      return;
    }
    const hasReacted =
      type === "helpful" ? hasReactedHelpful : hasReactedInsightful;
    if (hasReacted) {
      // Remove reaction
      await supabase
        .from("reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .eq("reaction_type", type);
      if (type === "helpful") {
        setHelpfulCount((prev) => prev - 1);
        setHasReactedHelpful(false);
      } else {
        setInsightfulCount((prev) => prev - 1);
        setHasReactedInsightful(false);
      }
    } else {
      // Add reaction
      await supabase.from("reactions").insert({
        post_id: postId,
        user_id: user.id,
        reaction_type: type,
      });
      if (type === "helpful") {
        setHelpfulCount((prev) => prev + 1);
        setHasReactedHelpful(true);
      } else {
        setInsightfulCount((prev) => prev + 1);
        setHasReactedInsightful(true);
      }
    }
  };
  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/post/${postId}`;
      if (navigator.share) {
        await navigator.share({
          title: "Check out this post",
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Post link copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        className={`h-9 px-4 gap-2 rounded-full transition-all ${
          hasReactedHelpful
            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
            : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
        }`}
        onClick={() => handleReaction("helpful")}
      >
        <ThumbsUp
          className={`h-4 w-4 ${hasReactedHelpful ? "fill-white" : ""}`}
        />
        <span className="font-medium">{helpfulCount}</span>
        <span>Helpful</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={`h-9 px-4 gap-2 rounded-full transition-all ${
          hasReactedInsightful
            ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:border-amber-600"
            : "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
        }`}
        onClick={() => handleReaction("insightful")}
      >
        <Lightbulb
          className={`h-4 w-4 ${hasReactedInsightful ? "fill-white" : ""}`}
        />
        <span className="font-medium">{insightfulCount}</span>
        <span>Insightful</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-9 px-4 gap-2 rounded-full hover:bg-gray-50"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button>
    </div>
  );
}
