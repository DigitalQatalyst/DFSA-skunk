import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
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
  Crown,
  Shield,
  User,
  MoreVertical,
  UserMinus,
  UserPlus,
  Search,
  X,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
interface Participant {
  user_id: string;
  role: string;
  joined_at: string;
  username: string | null;
  avatar_url: string | null;
  email: string;
}
interface Member {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  email: string;
}

interface ParticipantListProps {
  conversationId: string;
  currentUserId: string;
  currentUserRole: string;
  communityId?: string | null;
  groupName?: string | null;
  onParticipantRemoved?: () => void;
}
export function ParticipantList({
  conversationId,
  currentUserId,
  currentUserRole,
  communityId,
  groupName,
  onParticipantRemoved,
}: ParticipantListProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [addingMembers, setAddingMembers] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Participant | null>(
    null
  );
  const [verifiedUserRole, setVerifiedUserRole] =
    useState<string>(currentUserRole);
  const { toast } = useToast();

  // Fetch current user's role directly from database
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data } = await supabase
        .from("conversation_participants")
        .select("role")
        .eq("conversation_id", conversationId)
        .eq("user_id", currentUserId)
        .single();

      if (data?.role) {
        setVerifiedUserRole(data.role);
        console.log("[ParticipantList] Verified user role:", data.role);
      }
    };

    if (currentUserId) {
      fetchUserRole();
    }
  }, [conversationId, currentUserId]);

  useEffect(() => {
    fetchParticipants();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`participants-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversation_participants",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          fetchParticipants();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    if (showAddMembers && communityId) {
      fetchAvailableMembers();
    }
  }, [showAddMembers, participants]);

  const fetchParticipants = async () => {
    try {
      const { data: participantData, error: participantsError } = await supabase
        .from("conversation_participants")
        .select("user_id, role, joined_at")
        .eq("conversation_id", conversationId)
        .is("left_at", null);
      if (participantsError) throw participantsError;
      if (!participantData || participantData.length === 0) {
        setParticipants([]);
        setLoading(false);
        return;
      }
      const userIds = participantData.map((p) => p.user_id);
      const { data: userData, error: usersError } = await supabase
        .from("users_local")
        .select("id, username, avatar_url, email")
        .in("id", userIds);
      if (usersError) throw usersError;
      const combined = participantData.map((p) => {
        const user = userData?.find((u) => u.id === p.user_id);
        return {
          user_id: p.user_id,
          role: p.role || "member",
          joined_at: p.joined_at,
          username: user?.username || null,
          avatar_url: user?.avatar_url || null,
          email: user?.email || "",
        };
      });
      setParticipants(combined);
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAvailableMembers = async () => {
    if (!communityId) return;
    try {
      // Get existing participants
      const existingUserIds = participants.map((p) => p.user_id);

      // Get community members
      const { data: memberships } = await supabase
        .from("memberships")
        .select("user_id")
        .eq("community_id", communityId);
      if (!memberships || memberships.length === 0) return;
      const communityUserIds = memberships
        .map((m) => m.user_id)
        .filter((id): id is string => id !== null);
      const availableUserIds = communityUserIds.filter(
        (id) => !existingUserIds.includes(id)
      );
      if (availableUserIds.length === 0) {
        setAvailableMembers([]);
        return;
      }
      const { data: users } = await supabase
        .from("users_local")
        .select("id, username, avatar_url, email")
        .in("id", availableUserIds);
      const formattedMembers =
        users?.map((u) => ({
          user_id: u.id,
          username: u.username,
          avatar_url: u.avatar_url,
          email: u.email,
        })) || [];
      setAvailableMembers(formattedMembers);
    } catch (error) {
      console.error("Error fetching available members:", error);
    }
  };

  const toggleMember = (userId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedMembers(newSelected);
  };

  const addMembers = async () => {
    if (selectedMembers.size === 0) return;
    setAddingMembers(true);
    try {
      const newParticipants = Array.from(selectedMembers).map((userId) => ({
        conversation_id: conversationId,
        user_id: userId,
        role: "member",
      }));
      const { error: participantsError } = await supabase
        .from("conversation_participants")
        .insert(newParticipants);
      if (participantsError) throw participantsError;

      // Create notifications
      const notifications = Array.from(selectedMembers).map((userId) => ({
        user_id: userId,
        type: "community_update" as const,
        title: "Added to group chat",
        message: "You've been added to a group conversation",
        link: `/messages?conversation=${conversationId}`,
        community_id: communityId,
        related_user_id: currentUserId,
      }));
      await supabase.from("notifications").insert(notifications);
      toast({
        title: "Members added",
        description: `${selectedMembers.size} member(s) added successfully.`,
      });
      setShowAddMembers(false);
      setSelectedMembers(new Set());
      setSearchQuery("");
      fetchParticipants();
    } catch (error) {
      console.error("Error adding members:", error);
      toast({
        title: "Failed to add members",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingMembers(false);
    }
  };

  const handleRemoveClick = (participant: Participant) => {
    setMemberToRemove(participant);
    setShowRemoveDialog(true);
  };

  const removeParticipant = async () => {
    if (!memberToRemove) return;

    try {
      const { error } = await supabase
        .from("conversation_participants")
        .update({
          left_at: new Date().toISOString(),
        })
        .eq("conversation_id", conversationId)
        .eq("user_id", memberToRemove.user_id);
      if (error) throw error;

      // Get current user's name for notification
      const { data: currentUser } = await supabase
        .from("users_local")
        .select("username")
        .eq("id", currentUserId)
        .single();

      // Create notification with group name and remover's name
      const removerName = currentUser?.username || "An admin";
      const groupDisplayName = groupName || "a group chat";

      await supabase.from("notifications").insert({
        user_id: memberToRemove.user_id,
        type: "system" as const,
        title: "Removed from group chat",
        message: `${removerName} removed you from ${groupDisplayName}`,
        related_user_id: currentUserId,
      });

      toast({
        title: "Member removed",
        description: `${
          memberToRemove.username || "The member"
        } has been removed from the group.`,
        variant: "success",
      });

      setShowRemoveDialog(false);
      setMemberToRemove(null);
      onParticipantRemoved?.();
    } catch (error) {
      console.error("Error removing participant:", error);
      toast({
        title: "Failed to remove member",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3" />;
      case "admin":
        return <Shield className="h-3 w-3" />;
      default:
        return null;
    }
  };
  const canRemove =
    verifiedUserRole === "owner" || verifiedUserRole === "admin";

  console.log("[ParticipantList] Debug info:", {
    propRole: currentUserRole,
    verifiedUserRole,
    canRemove,
    currentUserId,
    participantCount: participants.length,
    participants: participants.map((p) => ({
      id: p.user_id,
      name: p.username,
      role: p.role,
      isCurrentUser: p.user_id === currentUserId,
      canBeRemoved:
        canRemove && p.user_id !== currentUserId && p.role !== "owner",
    })),
  });

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const canManage = currentUserRole === "owner" || currentUserRole === "admin";
  const filteredAvailableMembers = availableMembers.filter(
    (m) =>
      m.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {canManage && communityId && (
        <div className="p-4 border-b flex-shrink-0">
          {!showAddMembers ? (
            <Button
              onClick={() => setShowAddMembers(true)}
              className="w-full gap-2"
              variant="outline"
            >
              <UserPlus className="h-4 w-4" />
              Add Members
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Add Members</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddMembers(false);
                    setSelectedMembers(new Set());
                    setSearchQuery("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto border rounded-lg">
                {filteredAvailableMembers.length === 0 ? (
                  <div className="text-center py-4">
                    <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {availableMembers.length === 0
                        ? "All community members are already in this chat"
                        : "No members found"}
                    </p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredAvailableMembers.map((member) => (
                      <div
                        key={member.user_id}
                        className="flex items-center gap-2 p-2 rounded hover:bg-accent transition-colors"
                      >
                        <Checkbox
                          checked={selectedMembers.has(member.user_id)}
                          onCheckedChange={() => toggleMember(member.user_id)}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {member.username?.[0]?.toUpperCase() || (
                              <User className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {member.username || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                onClick={addMembers}
                disabled={addingMembers || selectedMembers.size === 0}
                className="w-full bg-blue-600"
                size="sm"
              >
                {addingMembers
                  ? "Adding..."
                  : `Add ${selectedMembers.size || ""} Member${
                      selectedMembers.size === 1 ? "" : "s"
                    }`}
              </Button>
            </div>
          )}
        </div>
      )}
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {participants.map((participant) => (
            <div
              key={participant.user_id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={participant.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {participant.username?.[0]?.toUpperCase() || (
                    <User className="h-5 w-5" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">
                    {participant.username || "Unknown"}
                    {participant.user_id === currentUserId && (
                      <span className="text-xs text-muted-foreground ml-2">
                        (You)
                      </span>
                    )}
                  </p>
                  {participant.role !== "member" && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      {getRoleIcon(participant.role)}
                      {participant.role}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {participant.role}
                </p>
              </div>

              {/* Debug info - remove after testing */}
              {/* <div className="text-xs text-gray-500">
                {canRemove ? "✓" : "✗"}
              </div> */}

              {/* Show remove button for eligible participants */}
              {canRemove &&
                participant.user_id !== currentUserId &&
                participant.role !== "owner" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100 border border-gray-500"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem
                        onClick={() => handleRemoveClick(participant)}
                        className="text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove from group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member from group?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {memberToRemove?.username || "this member"}
              </span>{" "}
              from the group? They will no longer be able to see or send
              messages in this conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={removeParticipant}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
