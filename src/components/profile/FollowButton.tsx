import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { supabase } from "../../supabase/client";
import { useToast } from "../../hooks/use-toast";
interface FollowButtonProps {
  currentUserId: string;
  targetUserId: string;
}
export function FollowButton({
  currentUserId,
  targetUserId,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingBack, setIsFollowingBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    checkFollowStatus();
  }, [currentUserId, targetUserId]);
  const checkFollowStatus = async () => {
    try {
      console.log("Checking follow status:", {
        currentUserId,
        targetUserId,
      });

      // Check if current user is following target user
      const { data: followingData, error: followingError } = await supabase.rpc(
        "get_relationship_status",
        {
          p_follower_id: currentUserId,
          p_following_id: targetUserId,
        }
      );

      if (followingError) throw followingError;
      setIsFollowing(followingData === "follow");

      // Check if target user is following current user (for "Follow Back")
      const { data: followBackData, error: followBackError } =
        await supabase.rpc("get_relationship_status", {
          p_follower_id: targetUserId,
          p_following_id: currentUserId,
        });

      if (followBackError) throw followBackError;
      setIsFollowingBack(followBackData === "follow");

      console.log("Follow status result:", {
        isFollowing: followingData === "follow",
        isFollowingBack: followBackData === "follow",
      });
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };
  const handleToggleFollow = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("toggle_follow", {
        p_follower_id: currentUserId,
        p_following_id: targetUserId,
      });
      if (error) throw error;
      setIsFollowing(data === "following");
      toast({
        title: data === "following" ? "Following" : "Unfollowed",
        description:
          data === "following"
            ? "You are now following this member"
            : "You have unfollowed this member",
        variant: data === "following" ? "success" : "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update follow status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      onClick={handleToggleFollow}
      disabled={loading}
      variant={isFollowing ? "outline" : "default"}
      className="w-full gap-2 min-h-[44px] text-blue-600 bg-blue-200 hover:bg-blue-100"
    >
      {isFollowing ? (
        <>
          <UserCheck className="h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          {isFollowingBack ? "Follow Back" : "Follow"}
        </>
      )}
    </Button>
  );
}
