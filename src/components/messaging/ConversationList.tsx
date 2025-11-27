import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../context/UnifiedAuthProvider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Search, Users, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "../../components/ui/skeleton";
interface Conversation {
  id: string;
  type: "direct" | "group";
  community_id: string | null;
  created_at: string;
  name?: string; // Group name for group chats
  other_user?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
  community?: {
    name: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
  participant_count?: number;
}
interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  refreshTrigger?: number;
}
export function ConversationList({
  selectedConversationId,
  onSelectConversation,
  refreshTrigger,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchConversations();
  }, [refreshTrigger]);

  // Refresh when conversation selection changes (to update unread counts)
  useEffect(() => {
    if (selectedConversationId) {
      // Small delay to allow messages to be marked as read
      const timer = setTimeout(() => {
        fetchConversations();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedConversationId]);

  // Polling with tab visibility detection
  useEffect(() => {
    if (!currentUserId) return;

    let pollInterval: NodeJS.Timeout;

    const startPolling = () => {
      pollInterval = setInterval(() => {
        // Only poll if tab is visible
        if (!document.hidden) {
          console.log("[ConversationList] Polling for updates (tab active)");
          fetchConversations();
        }
      }, 5000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("[ConversationList] Tab hidden - stopping poll");
        clearInterval(pollInterval);
      } else {
        console.log("[ConversationList] Tab visible - starting poll");
        fetchConversations(); // Immediate fetch when tab becomes visible
        startPolling();
      }
    };

    // Start polling if tab is visible
    if (!document.hidden) {
      startPolling();
    }

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUserId]);

  // Set up real-time subscription after we have currentUserId
  useEffect(() => {
    if (!currentUserId) return;

    console.log(
      "[ConversationList] Setting up real-time subscription for user:",
      currentUserId
    );

    const channel = supabase
      .channel("conversation-list-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("[ConversationList] Message change detected:", payload);
          fetchConversations();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        (payload) => {
          console.log(
            "[ConversationList] Conversation change detected:",
            payload
          );
          fetchConversations();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversation_participants",
        },
        (payload) => {
          console.log(
            "[ConversationList] Participant change detected:",
            payload
          );
          fetchConversations();
        }
      )
      .subscribe((status) => {
        console.log("[ConversationList] Subscription status:", status);
      });

    return () => {
      console.log("[ConversationList] Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);
  const fetchConversations = async () => {
    try {
      // Use the correct user from auth context
      if (!user?.id) {
        console.log("[ConversationList] No authenticated user found");
        setLoading(false);
        return;
      }

      console.log("[ConversationList] Using authenticated user:", user);
      setCurrentUserId(user.id);

      // Get conversations the user is part of (and hasn't left)
      const { data: participantData, error: participantError } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id)
        .is("left_at", null);
      if (participantError) throw participantError;

      console.log(
        "[ConversationList] User's active conversations:",
        participantData
      );

      const conversationIds =
        participantData?.map((p) => p.conversation_id) || [];

      if (conversationIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Get conversation details
      const { data: convData, error: convError } = await supabase
        .from("conversations")
        .select(
          `
          id,
          type,
          community_id,
          created_at,
          name,
          communities (name)
        `
        )
        .in("id", conversationIds)
        .order("created_at", {
          ascending: false,
        });
      if (convError) throw convError;

      // Get all participants for all conversations in one query (only active participants)
      const { data: allParticipants } = await supabase
        .from("conversation_participants")
        .select(
          `
          conversation_id,
          user_id,
          users_local (id, username, avatar_url)
        `
        )
        .in("conversation_id", conversationIds)
        .neq("user_id", user.id)
        .is("left_at", null);

      console.log(
        "[ConversationList] All participants (excluding current user):",
        allParticipants
      );

      // Let's also get ALL participants including current user to see the full picture (only active)
      const { data: allParticipantsIncludingMe } = await supabase
        .from("conversation_participants")
        .select(
          `
          conversation_id,
          user_id,
          created_at,
          left_at,
          users_local (id, username, avatar_url, email)
        `
        )
        .in("conversation_id", conversationIds)
        .is("left_at", null);

      console.log(
        "[ConversationList] ALL active participants (including current user):",
        allParticipantsIncludingMe
      );

      // Get recent messages for all conversations (limit to reduce data transfer)
      // We fetch more than the number of conversations to ensure we get at least one per conversation
      const { data: allLastMessages } = await supabase
        .from("messages")
        .select("conversation_id, content, created_at, sender_id")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false })
        .limit(conversationIds.length * 2); // Fetch 2x conversations to ensure coverage

      // Get unread counts for all conversations in a SINGLE query (optimized)
      const { data: unreadMessages } = await supabase
        .from("messages")
        .select("conversation_id")
        .in("conversation_id", conversationIds)
        .eq("is_read", false)
        .neq("sender_id", user.id);

      // Count unread messages per conversation
      const unreadCounts = conversationIds.map((convId) => ({
        conversation_id: convId,
        count:
          unreadMessages?.filter((m) => m.conversation_id === convId).length ||
          0,
      }));

      // Process conversations with details
      const conversationsWithDetails = (convData || []).map((conv) => {
        // Get participants for this conversation
        const participants =
          allParticipants?.filter((p) => p.conversation_id === conv.id) || [];
        const otherUser = participants[0]?.users_local;

        // Get last message for this conversation
        const lastMessage = allLastMessages?.find(
          (m) => m.conversation_id === conv.id
        );

        // Get unread count for this conversation
        const unreadData = unreadCounts.find(
          (u) => u.conversation_id === conv.id
        );
        const unreadCount = unreadData?.count || 0;

        return {
          id: conv.id,
          type: conv.type,
          community_id: conv.community_id,
          created_at: conv.created_at,
          name: conv.name || undefined, // Fix null to undefined
          other_user: otherUser
            ? {
                id: otherUser.id,
                username: otherUser.username,
                avatar_url: otherUser.avatar_url,
              }
            : undefined,
          community: conv.communities
            ? {
                name: conv.communities.name,
              }
            : undefined,
          last_message: lastMessage || undefined,
          unread_count: unreadCount,
          participant_count: participants.length + 1,
        };
      });
      // Sort conversations by last message time (most recent first)
      const sortedConversations = conversationsWithDetails.sort((a, b) => {
        const aTime = a.last_message?.created_at || a.created_at;
        const bTime = b.last_message?.created_at || b.created_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      setConversations(sortedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (conv.type === "direct" && conv.other_user?.username) {
      return conv.other_user.username.toLowerCase().includes(query);
    }
    if (conv.type === "group") {
      return (
        conv.name?.toLowerCase().includes(query) ||
        conv.community?.name.toLowerCase().includes(query)
      );
    }
    return false;
  });
  if (loading) {
    return (
      <div className=" bg-card p-4 shadow-sm">
        <Skeleton className="h-10 w-full mb-4" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 mb-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full overflow-hidden bg-card">
      <div className="p-4 border-b border-border flex-shrink-0 h-[72px] flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="rounded-full bg-muted p-4 inline-flex mb-3">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              No conversations yet
            </p>
            <p className="text-xs text-muted-foreground">
              Start a new conversation to get started
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full p-3 rounded-lg flex items-center gap-3 hover:bg-accent/50 transition-colors ${
                  selectedConversationId === conv.id ? "bg-accent" : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={conv.other_user?.avatar_url || undefined}
                    />
                    <AvatarFallback className="bg-blue-600 text-primary-foreground">
                      {conv.type === "direct" ? (
                        conv.other_user?.username?.[0]?.toUpperCase() || (
                          <User className="h-5 w-5" />
                        )
                      ) : (
                        <Users className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {conv.unread_count > 0 && (
                    <Badge
                      variant="default"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold"
                    >
                      {conv.unread_count}
                    </Badge>
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {conv.type === "direct"
                        ? conv.other_user?.username || "Unknown User"
                        : conv.name || "Group Chat"}
                    </p>
                    {conv.last_message && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(conv.last_message.created_at),
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.last_message?.content || "No messages yet"}
                  </p>
                  {conv.type === "group" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {conv.participant_count} members
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
