import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Edit2, Calendar, Mail } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { GradientAvatar } from "../../components/ui/gradient-avatar";
import { RoleBadge } from "./RoleBadge";
import { useUserRole } from "../hooks/useUserRole";
interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatar_url: string | null;
  created_at: string;
}
interface ProfileSummaryCardProps {
  profile: UserProfile;
  onUpdate: () => void;
  isOwnProfile?: boolean;
  followButton?: React.ReactNode;
}
export function ProfileSummaryCard({
  profile,
  onUpdate,
  isOwnProfile = true,
  followButton,
}: ProfileSummaryCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { role } = useUserRole(profile.id);
  return (
    <>
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-fade-in">
        <CardHeader className="border-b border-gray-200 bg-gray-50 pb-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="p-0 overflow-hidden">
                <GradientAvatar
                  seed={profile.username}
                  className="h-full w-full"
                />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {profile.username}
                    </h2>
                    <RoleBadge role={role} />
                    {/* {isOwnProfile && <span className="text-sm font-normal text-gray-500">(You)</span>} */}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Member since{" "}
                    {format(new Date(profile.created_at), "MMMM yyyy")}
                  </p>
                </div>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
              {!isOwnProfile && followButton && (
                <div className="mt-3">{followButton}</div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {profile.email && (
            <div className="flex items-center gap-3 text-gray-700 mb-6">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-sm">{profile.email}</span>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Bio</h3>
              <p className="text-sm text-gray-600">
                No bio added yet.{" "}
                {isOwnProfile && 'Click "Edit Profile" to add one.'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Website
              </h3>
              <p className="text-sm text-gray-600">No website added yet.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Profile editing feature coming soon. This will allow you to update
              your bio, website, and avatar.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
