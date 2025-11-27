// ProfileContext.tsx
// REFACTORED: Server state removed - now managed by React Query
// This context now only stores true client-side UI state
import { createContext, useContext, useState, ReactNode } from "react";

// Define the structure of the data you want to share globally
// NOTE: Server state (apiProfileData, isProfileLoading) has been removed
// These are now managed by React Query in the Profile module
interface ProfileContextType {
  companyName: string | null;
  setCompanyName: (name: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [companyName, setCompanyName] = useState<string | null>(null);

  const contextValue = {
    companyName,
    setCompanyName,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
