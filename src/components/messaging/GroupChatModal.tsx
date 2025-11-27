import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Checkbox } from "../../components/ui/checkbox";

import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../context/UnifiedAuthProvider";
interface Community {
  id: string;
  name: string;
  description: string | null;
}
interface Member {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  email: string;
}
interface GroupChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated: (conversationId: string) => void;
}
export function GroupChatModal({
  open,
  onOpenChange,
  onGroupCreated,
}: GroupChatModalProps) {
  const [step, setStep] = useState(1);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(
    null
  );
  const [groupName, setGroupName] = useState("");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const currentUserId = user?.id || null;

  useEffect(() => {
    if (open) {
      console.log("user cred", user);
      resetForm();
    }
  }, [open]);
  useEffect(() => {
    if (currentUserId) {
      fetchCommunities();
    }
  }, [currentUserId]);
  useEffect(() => {
    if (selectedCommunity) {
      fetchCommunityMembers(selectedCommunity);
    }
  }, [selectedCommunity]);
  const resetForm = () => {
    setStep(1);
    setSelectedCommunity(null);
    setGroupName("");
    setSelectedMembers(new Set());
    setMembers([]);
  };

  const fetchCommunities = async () => {
    try {
      if (!currentUserId) {
        console.log("[GroupChatModal] No currentUserId for fetchCommunities");
        return;
      }
      console.log(
        "[GroupChatModal] Fetching communities for user:",
        currentUserId
      );
      const { data: memberships } = await supabase
        .from("memberships")
        .select("community_id")
        .eq("user_id", currentUserId);
      console.log("[GroupChatModal] Memberships:", memberships);
      if (!memberships || memberships.length === 0) {
        setCommunities([]);
        return;
      }
      const communityIds = memberships
        .map((m) => m.community_id)
        .filter((id): id is string => id !== null);
      const { data, error } = await supabase
        .from("communities")
        .select("id, name, description")
        .in("id", communityIds)
        .order("name");
      if (error) throw error;
      console.log("[GroupChatModal] Communities fetched:", data);
      setCommunities(data || []);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };
  const fetchCommunityMembers = async (communityId: string) => {
    try {
      console.log(
        "[GroupChatModal] Fetching members for community:",
        communityId
      );
      const { data: memberships, error: membershipError } = await supabase
        .from("memberships")
        .select("user_id")
        .eq("community_id", communityId);
      console.log("[GroupChatModal] Memberships for community:", memberships);
      if (membershipError) throw membershipError;
      if (!memberships || memberships.length === 0) {
        console.log("[GroupChatModal] No memberships found");
        setMembers([]);
        return;
      }
      const userIds = memberships
        .map((m) => m.user_id)
        .filter((id): id is string => id !== null);
      console.log("[GroupChatModal] Fetching users:", userIds);
      const { data: users, error: usersError } = await supabase
        .from("users_local")
        .select("id, username, avatar_url, email")
        .in("id", userIds);
      console.log("[GroupChatModal] Users fetched:", users);
      if (usersError) throw usersError;
      // Exclude current user from selectable members (they're automatically added as owner)
      const formattedMembers =
        users
          ?.filter((u) => u.id !== currentUserId)
          .map((u) => ({
            user_id: u.id,
            username: u.username,
            avatar_url: u.avatar_url,
            email: u.email,
          })) || [];
      console.log(
        "[GroupChatModal] Formatted members (excluding current user):",
        formattedMembers
      );
      setMembers(formattedMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
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
  const createGroupChat = async () => {
    if (!currentUserId || !selectedCommunity || !groupName.trim()) return;
    setLoading(true);
    try {
      // Create conversation with group name
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .insert({
          type: "group",
          community_id: selectedCommunity,
          name: groupName.trim(), // Store the group name
        })
        .select()
        .single();
      if (convError) throw convError;

      // Add creator as owner and selected members (excluding current user if they selected themselves)
      const participants = [
        {
          conversation_id: conversation.id,
          user_id: currentUserId,
          role: "owner",
        },
        ...Array.from(selectedMembers)
          .filter((userId) => userId !== currentUserId) // Exclude current user to avoid duplicates
          .map((userId) => ({
            conversation_id: conversation.id,
            user_id: userId,
            role: "member",
          })),
      ];
      const { error: participantsError } = await supabase
        .from("conversation_participants")
        .insert(participants);
      if (participantsError) throw participantsError;

      // Create notifications for added members
      const notifications = Array.from(selectedMembers).map((userId) => ({
        user_id: userId,
        type: "community_update" as const,
        title: "Added to group chat",
        message: `You've been added to ${groupName}`,
        link: `/messages?conversation=${conversation.id}`,
        community_id: selectedCommunity,
        related_user_id: currentUserId,
      }));
      if (notifications.length > 0) {
        await supabase.from("notifications").insert(notifications);
      }
      toast({
        title: "Group chat created",
        variant: "success",
        description: `${groupName} has been created successfully.`,
      });
      onGroupCreated(conversation.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating group chat:", error);
      toast({
        title: "Failed to create group chat",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const nextStep = () => {
    if (step === 1 && !selectedCommunity) {
      toast({
        title: "Select a community",
        description: "Please select a community to continue.",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && !groupName.trim()) {
      toast({
        title: "Enter group name",
        description: "Please enter a name for the group.",
        variant: "destructive",
      });
      return;
    }
    if (step === 3) {
      createGroupChat();
      return;
    }
    setStep(step + 1);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Group Chat - Step {step} of 3</DialogTitle>
          <DialogDescription>
            {step === 1 && "Choose a community for your group chat"}
            {step === 2 && "Give your group a name"}
            {step === 3 && "Review and create your group chat"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid gap-4">
                  {communities.map((community) => (
                    <div
                      key={community.id}
                      className={`p-4 border rounded-lg cursor-pointer hover:bg-accent ${
                        selectedCommunity === community.id
                          ? "border-primary"
                          : ""
                      }`}
                      onClick={() => setSelectedCommunity(community.id)}
                    >
                      <h3 className="font-medium">{community.name}</h3>
                      {community.description && (
                        <p className="text-sm text-muted-foreground">
                          {community.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Add Members</Label>
                <ScrollArea className="h-[300px] pr-4 border rounded-lg">
                  <div className=" p-2 space-y-2 max-h-60">
                    {members.map((member) => (
                      <div
                        key={member.user_id}
                        className="flex items-center space-x-3 p-2 hover:bg-accent rounded"
                      >
                        <Checkbox
                          id={`member-${member.user_id}`}
                          checked={selectedMembers.has(member.user_id)}
                          onCheckedChange={() => toggleMember(member.user_id)}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={member.avatar_url || ""}
                            alt={member.username || ""}
                          />
                          <AvatarFallback>
                            {member.username?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {member.username || member.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Group Details</h3>
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <span className="font-medium">{groupName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Community:
                    </span>
                    <span>
                      {
                        communities.find((c) => c.id === selectedCommunity)
                          ?.name
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Members:
                    </span>
                    <span>{selectedMembers.size + 1} members</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Selected Members</h3>
                <div className="border rounded-lg p-2 space-y-2 max-h-60 overflow-y-auto">
                  {(() => {
                    const currentMember = members.find(
                      (m) => m.user_id === currentUserId
                    );
                    return (
                      <div className="flex items-center space-x-3 p-2 bg-accent/50 rounded">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={currentMember?.avatar_url || ""}
                            alt={currentMember?.username || "You"}
                          />
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">You (Owner)</p>
                          <p className="text-xs text-muted-foreground">
                            {currentMember?.email || ""}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                  {members
                    .filter((member) => selectedMembers.has(member.user_id))
                    .map((member) => (
                      <div
                        key={member.user_id}
                        className="flex items-center space-x-3 p-2"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={member.avatar_url || ""}
                            alt={member.username || ""}
                          />
                          <AvatarFallback>
                            {member.username?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {member.username || member.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1 || loading}
              >
                Back
              </Button>
            )}
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={nextStep}
              disabled={loading}
            >
              {loading ? "Creating..." : step === 3 ? "Create Group" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
