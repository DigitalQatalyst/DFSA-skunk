import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { MessageBubble } from "./MessageBubble";
import { useAuth } from "../../context/UnifiedAuthProvider";

import { ParticipantList } from "./ParticipantList";
import { AddMemberModal } from "./AddMemberModal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Send,
  Users,
  User,
  LogOut,
  Trash2,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { Skeleton } from "../../components/ui/skeleton";
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
}
interface ChatWindowProps {
  conversationId: string;
  isOnline: boolean;
  onBack?: () => void; // For mobile back navigation
  onConversationDeleted?: () => void; // Callback to refresh conversation list
  refreshTrigger?: number; // Trigger to force refresh
}
export function ChatWindow({
  conversationId,
  isOnline,
  onBack,
  onConversationDeleted,
  refreshTrigger,
}: ChatWindowProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("member");
  const [conversationInfo, setConversationInfo] = useState<any>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [showMembersSheet, setShowMembersSheet] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  useEffect(() => {
    fetchMessages();
    fetchConversationInfo();
    // Scroll to bottom when conversation changes
    setTimeout(() => scrollToBottom(), 100);
  }, [conversationId]);

  // Refetch when refresh is triggered from parent
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      console.log("[ChatWindow] Refresh triggered from parent");
      fetchMessages();
    }
  }, [refreshTrigger]);

  // Set up real-time subscription after we have currentUserId
  useEffect(() => {
    if (!currentUserId || !user) return;

    console.log(
      "[ChatWindow] Setting up real-time subscription for conversation:",
      conversationId,
      "user:",
      currentUserId
    );

    // Create a unique channel name to avoid conflicts
    const channelName = `messages-${conversationId}-${currentUserId}`;

    const channel = supabase
      .channel(channelName, {
        config: {
          broadcast: { self: false },
          presence: { key: currentUserId },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          console.log(
            "[ChatWindow] New message received via real-time:",
            payload
          );

          try {
            const newMsg = payload.new as Message;

            // Check for duplicates first
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === newMsg.id);
              if (exists) {
                console.log("[ChatWindow] Message already exists, skipping");
                return prev;
              }
              return prev;
            });

            // Fetch the complete message with sender info from database
            const { data: completeMessage, error } = await supabase
              .from("messages")
              .select(
                `
                *,
                sender:users_local!messages_sender_id_fkey (id, username, avatar_url)
              `
              )
              .eq("id", newMsg.id)
              .single();

            if (error) {
              console.error(
                "[ChatWindow] Error fetching complete message:",
                error
              );
              return;
            }

            if (completeMessage) {
              console.log("[ChatWindow] Adding complete message to state");
              setMessages((prev) => {
                // Double-check for duplicates
                const exists = prev.some((m) => m.id === completeMessage.id);
                if (exists) return prev;
                return [...prev, completeMessage];
              });
            }
          } catch (error) {
            console.error(
              "[ChatWindow] Error handling real-time message:",
              error
            );
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log("[ChatWindow] Message updated via real-time:", payload);
          const updatedMsg = payload.new as Message;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMsg.id ? { ...msg, ...updatedMsg } : msg
            )
          );
        }
      )
      .subscribe(async (status, err) => {
        console.log("[ChatWindow] Subscription status:", status);
        if (err) {
          console.error("[ChatWindow] Subscription error:", err);
        }
        if (status === "SUBSCRIBED") {
          console.log(
            "[ChatWindow] Successfully subscribed to real-time updates"
          );

          // Verify session
          const {
            data: { session },
          } = await supabase.auth.getSession();
          console.log(
            "[ChatWindow] Current session:",
            session ? "Valid" : "Invalid"
          );
        }
        if (status === "CHANNEL_ERROR") {
          console.error("[ChatWindow] Channel error - real-time may not work");
        }
        if (status === "TIMED_OUT") {
          console.error("[ChatWindow] Subscription timed out");
        }
        if (status === "CLOSED") {
          console.log("[ChatWindow] Channel closed");
        }
      });

    return () => {
      console.log("[ChatWindow] Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId, user]);
  useEffect(() => {
    scrollToBottom();
    markMessagesAsRead();
  }, [messages]);

  // Mark messages as read when window is focused
  useEffect(() => {
    const handleFocus = () => {
      markMessagesAsRead();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [messages, currentUserId]);

  // Polling with tab visibility detection
  useEffect(() => {
    if (!currentUserId) return;

    let pollInterval: NodeJS.Timeout;

    const startPolling = () => {
      pollInterval = setInterval(() => {
        // Only poll if tab is visible
        if (!document.hidden) {
          console.log("[ChatWindow] Polling for new messages (tab active)");
          fetchMessages();
        }
      }, 2000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("[ChatWindow] Tab hidden - stopping poll");
        clearInterval(pollInterval);
      } else {
        console.log("[ChatWindow] Tab visible - starting poll");
        fetchMessages(); // Immediate fetch when tab becomes visible
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
  }, [conversationId, currentUserId]);
  const fetchConversationInfo = async () => {
    try {
      // Use the correct user from auth context
      if (!user?.id) {
        console.log("[ChatWindow] No authenticated user for conversation info");
        return;
      }

      // Get current user's role
      const { data: participantData } = await supabase
        .from("conversation_participants")
        .select("role")
        .eq("conversation_id", conversationId)
        .eq("user_id", user.id)
        .single();
      if (participantData) {
        setCurrentUserRole(participantData.role || "member");
      }
      const { data: conv } = await supabase
        .from("conversations")
        .select(
          `
          id,
          type,
          community_id,
          name,
          communities (name)
        `
        )
        .eq("id", conversationId)
        .single();
      if (conv?.type === "direct") {
        const { data: participants } = await supabase
          .from("conversation_participants")
          .select(
            `
            users_local (id, username, avatar_url)
          `
          )
          .eq("conversation_id", conversationId)
          .neq("user_id", user.id);
        setConversationInfo({
          type: "direct",
          other_user: participants?.[0]?.users_local,
        });
      } else if (conv?.type === "group") {
        const { data: participants } = await supabase
          .from("conversation_participants")
          .select(
            `
            users_local (id, username, avatar_url)
          `
          )
          .eq("conversation_id", conversationId)
          .is("left_at", null);
        setConversationInfo({
          type: "group",
          community_id: conv.community_id,
          name: conv.name,
          // Group name
          community_name: conv.communities?.name,
          // Community name (for badge)
          participants: participants?.map((p) => p.users_local) || [],
        });
      }
    } catch (error) {
      console.error("Error fetching conversation info:", error);
    }
  };
  const fetchMessages = async () => {
    try {
      // Use the correct user from auth context
      if (!user?.id) {
        console.log("[ChatWindow] No authenticated user found");
        setLoading(false);
        return;
      }

      console.log("[ChatWindow] Using authenticated user:", user);
      setCurrentUserId(user.id);
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:users_local!messages_sender_id_fkey (id, username, avatar_url)
        `
        )
        .eq("conversation_id", conversationId)
        .order("created_at", {
          ascending: true,
        });
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("[ChatWindow] Error fetching messages:", error);
      toast({
        title: "Error loading messages",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!currentUserId) return;
    const unreadMessages = messages.filter(
      (m) => !m.is_read && m.sender_id !== currentUserId
    );
    if (unreadMessages.length === 0) return;

    const { error } = await supabase
      .from("messages")
      .update({
        is_read: true,
      })
      .in(
        "id",
        unreadMessages.map((m) => m.id)
      );

    if (!error) {
      // Update local state immediately
      setMessages((prev) =>
        prev.map((msg) =>
          unreadMessages.some((um) => um.id === msg.id)
            ? { ...msg, is_read: true }
            : msg
        )
      );
    }
  };
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      // Use smooth scrolling for better UX
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId || !isOnline) return;
    const messageContent = newMessage.trim();
    setNewMessage("");
    setSending(true);

    // Create optimistic message for immediate display
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`, // Temporary ID
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: messageContent,
      created_at: new Date().toISOString(),
      is_read: true,
      sender: {
        id: currentUserId,
        username: "You", // Will be replaced when real message comes through
        avatar_url: null,
      },
    };

    // Add message immediately to local state
    setMessages((prev) => [...prev, optimisticMessage]);

    // Scroll to bottom immediately
    setTimeout(scrollToBottom, 100);

    try {
      // Get receiver_id for direct messages
      let receiverId = null;
      if (
        conversationInfo?.type === "direct" &&
        conversationInfo?.other_user?.id
      ) {
        receiverId = conversationInfo.other_user.id;
      }

      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          receiver_id: receiverId, // Set for direct messages, null for group messages
          content: messageContent,
        })
        .select(
          `
        *,
        sender:users_local!messages_sender_id_fkey (id, username, avatar_url)
      `
        )
        .single();

      if (error) throw error;

      // Replace optimistic message with real message
      if (data) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === optimisticMessage.id
              ? ({ ...data, sender: data.sender || undefined } as Message)
              : msg
          )
        );
      }

      // Trigger notification for other participants
      const { data: participants } = await supabase
        .from("conversation_participants")
        .select("user_id")
        .eq("conversation_id", conversationId)
        .neq("user_id", currentUserId);
      if (participants) {
        const notificationPromises = participants.map((p) =>
          supabase.from("notifications").insert({
            user_id: p.user_id,
            type: "comment",
            title: "New message",
            message: `You have a new message: ${messageContent.substring(
              0,
              50
            )}${messageContent.length > 50 ? "..." : ""}`,
            link: "/messages",
            related_user_id: currentUserId,
          })
        );
        await Promise.all(notificationPromises);
      }
    } catch (error) {
      console.error("[ChatWindow] Error sending message:", error);

      // Remove the optimistic message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );

      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };
  const leaveGroup = async () => {
    if (!currentUserId) return;
    try {
      const { error } = await supabase
        .from("conversation_participants")
        .update({
          left_at: new Date().toISOString(),
        })
        .eq("conversation_id", conversationId)
        .eq("user_id", currentUserId);
      if (error) throw error;
      toast({
        title: "Left group",
        description: "You have left this group conversation.",
        variant: "success",
      });

      // Trigger refresh and navigate
      onConversationDeleted?.();
      navigate("/messages");
    } catch (error) {
      console.error("Error leaving group:", error);
      toast({
        title: "Failed to leave group",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteGroup = async () => {
    try {
      console.log(
        "[deleteGroup] Starting deletion for conversation:",
        conversationId
      );
      console.log("[deleteGroup] Current user role:", currentUserRole);
      console.log("[deleteGroup] Current user ID:", currentUserId);

      // Check if user is owner
      if (currentUserRole !== "owner") {
        toast({
          title: "Permission denied",
          description: "Only the group owner can delete the group.",
          variant: "destructive",
        });
        return;
      }

      // Step 1: Delete all messages in the conversation
      const { error: messagesError } = await supabase
        .from("messages")
        .delete()
        .eq("conversation_id", conversationId);

      if (messagesError) {
        console.error("[deleteGroup] Error deleting messages:", messagesError);
        throw messagesError;
      }
      console.log("[deleteGroup] Messages deleted successfully");

      // Step 2: Delete all participants
      const { error: participantsError } = await supabase
        .from("conversation_participants")
        .delete()
        .eq("conversation_id", conversationId);

      if (participantsError) {
        console.error(
          "[deleteGroup] Error deleting participants:",
          participantsError
        );
        throw participantsError;
      }
      console.log("[deleteGroup] Participants deleted successfully");

      // Step 3: Delete the conversation itself
      const { error: conversationError } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

      if (conversationError) {
        console.error(
          "[deleteGroup] Error deleting conversation:",
          conversationError
        );
        throw conversationError;
      }
      console.log("[deleteGroup] Conversation deleted successfully");

      toast({
        title: "Group deleted",
        description: "The group has been permanently deleted.",
        variant: "success",
      });

      // Trigger refresh and navigate
      onConversationDeleted?.();
      navigate("/messages");
    } catch (error) {
      console.error("[deleteGroup] Error deleting group:", error);
      toast({
        title: "Failed to delete group",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };
  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-border p-4">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-16 w-64 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full overflow-hidden bg-card">
      <div className="border-b border-border p-4 flex items-center justify-between flex-shrink-0 h-[72px]">
        <div className="flex items-center gap-3 h-[72px]">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={conversationInfo?.other_user?.avatar_url || undefined}
            />
            <AvatarFallback className="bg-blue-500 text-primary-foreground">
              {conversationInfo?.type === "direct" ? (
                conversationInfo.other_user?.username?.[0]?.toUpperCase() || (
                  <User className="h-5 w-5" />
                )
              ) : (
                <Users className="h-5 w-5" />
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2 ">
              {conversationInfo?.type === "direct"
                ? conversationInfo.other_user?.username || "Unknown User"
                : conversationInfo?.name || "Group Chat"}
              {conversationInfo?.type === "group" &&
                conversationInfo?.community_name && (
                  <Badge variant="secondary" className="text-xs sm:hidden">
                    {conversationInfo.community_name}
                  </Badge>
                )}
            </h3>
            {conversationInfo?.type === "group" && (
              <p className="text-xs text-muted-foreground">
                {conversationInfo.participants?.length || 0} members
              </p>
            )}
          </div>
        </div>

        {conversationInfo?.type === "group" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => setShowMembersSheet(true)}
                className="cursor-pointer"
              >
                <Users className="h-4 w-4 mr-2" />
                Members
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {currentUserRole !== "owner" ? (
                <DropdownMenuItem
                  onClick={() => setShowLeaveDialog(true)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Group
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Group
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Members Sheet */}
      <Sheet open={showMembersSheet} onOpenChange={setShowMembersSheet}>
        <SheetContent className="bg-white">
          <SheetHeader>
            <SheetTitle>Group Members</SheetTitle>
            <SheetDescription>
              Manage participants in this group chat
            </SheetDescription>
          </SheetHeader>
          <ParticipantList
            conversationId={conversationId}
            currentUserId={currentUserId || ""}
            currentUserRole={currentUserRole}
            communityId={conversationInfo?.community_id}
            groupName={conversationInfo?.name}
            onParticipantRemoved={fetchConversationInfo}
          />
        </SheetContent>
      </Sheet>

      {/* Leave Group Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Leave group?</AlertDialogTitle>
            <AlertDialogDescription>
              You will no longer receive messages from this group. You can be
              added back by an admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (e) => {
                e.preventDefault();
                await leaveGroup();
                setShowLeaveDialog(false);
              }}
              className="bg-blue-600"
            >
              Leave Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Group Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete group?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the group and all its messages. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (e) => {
                e.preventDefault();
                await deleteGroup();
                setShowDeleteDialog(false);
              }}
              className="bg-blue-600"
            >
              Delete Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex-1 overflow-y-auto min-h-0 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-center">
            <div>
              <div className="rounded-full bg-muted p-4 inline-flex mb-3">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No messages yet
              </p>
              <p className="text-xs text-muted-foreground">
                Be the first to send a message
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.sender_id === currentUserId}
              />
            ))}
          </div>
        )}
      </div>
      {/* Message input form - always visible at bottom */}
      <div className="border-t border-border p-4 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              isOnline
                ? "Type a message..."
                : "Offline - messages will send when online"
            }
            disabled={!isOnline || sending}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || !isOnline || sending}
            className={`transition-all duration-200 flex-shrink-0 ${
              newMessage.trim() && isOnline && !sending
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Send
              className={`h-4 w-4 transition-transform duration-200 ${
                newMessage.trim() && isOnline && !sending ? "scale-110" : ""
              }`}
            />
          </Button>
        </form>
      </div>

      {conversationInfo?.type === "group" && (
        <AddMemberModal
          open={isAddMemberOpen}
          onOpenChange={setIsAddMemberOpen}
          conversationId={conversationId}
          communityId={conversationInfo.community_id}
        />
      )}
    </div>
  );
}
