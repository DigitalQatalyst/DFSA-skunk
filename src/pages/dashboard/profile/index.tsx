import React from "react";
import { BusinessProfile } from "../../../components/BusinessProfile/BusinessProfile";

interface ProfilePageProps {
  azureId?: string;
}

/**
 * Profile page component that displays the user's business profile
 * Maps data from the API endpoint to the profile dashboard
 */
export const ProfilePage: React.FC<ProfilePageProps> = ({ azureId }) => {
  // Get Azure ID from localStorage, URL params, or auth context
  const getUserAzureId = (): string | undefined => {
    // Priority order: prop > localStorage > sessionStorage
    if (azureId) return azureId;

    const storedAzureId =
      localStorage.getItem("azureId") || sessionStorage.getItem("azureId");
    if (storedAzureId) return storedAzureId;

    // In a real app, you would get this from your auth context/provider
    // For demo purposes, we'll use a default value
    return "8eea5af9-3aaf-f011-bbd3-6045bd159060";
  };

  const userAzureId = getUserAzureId();

  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessProfile activeSection="profile" azureId={userAzureId} />
    </div>
  );
};

export default ProfilePage;
