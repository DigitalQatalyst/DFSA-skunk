import { useState, useEffect, useCallback } from "react";
import { ProfileData } from "../types";
import { fetchCombinedProfileData } from "../services/DataverseService";
import { useAuth } from "../components/Header/context/AuthContext";
import { profileConfig, API_FIELD_MAPPING } from "../utils/config";

/**
 * Maps API profile data to section data structure
 */
const mapApiProfileToSectionData = (
  apiProfile: Record<string, any>,
  apiFieldMapping: Record<string, string>,
  sectionId: string
) => {
  const sectionConfig = profileConfig.tabs.find((c) => c.id === sectionId);
  if (!sectionConfig) return { fields: {} };

  const sectionFields: Record<string, any> = {};

  sectionConfig.groups.forEach((group) => {
    group.fields.forEach((field) => {
      const internalFieldName = field.fieldName;
      const apiFieldName = apiFieldMapping[internalFieldName];

      if (apiFieldName && apiProfile[apiFieldName] !== undefined) {
        let value = apiProfile[apiFieldName];

        // Transform date strings to YYYY-MM-DD format
        if (field.fieldType === "Date Only" && typeof value === "string") {
          value = value.split("T")[0];
        }

        sectionFields[internalFieldName] = value;
      }
    });
  });

  return {
    fields: sectionFields,
  };
};

interface UseProfileDataReturn {
  profileData: ProfileData | null;
  loading: boolean;
  error: string | null;
  refetch: (azureId?: string, userEmail?: string) => Promise<void>;
}

/**
 * Custom hook for managing profile data fetching and state
 * @param azureId Optional Azure ID for the logged-in user (will use auth context if not provided)
 * @returns Profile data, loading state, error state, and refetch function
 */
export const useProfileData = (azureId?: string): UseProfileDataReturn => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (userAzureId?: string, userEmail?: string) => {
      // Use provided values or fall back to auth context
      const targetAzureId = userAzureId || azureId || user?.id;
      const targetEmail = userEmail || user?.email;

      if (!targetAzureId) {
        setError("Azure ID is required to fetch profile data");
        setLoading(false);
        return;
      }

      if (!targetEmail) {
        setError("User email is required to fetch profile data");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch combined profile data (organization + onboarding)
        const apiProfile = await fetchCombinedProfileData(targetEmail, targetAzureId);
        
        // Check localStorage for saved profile data (always check, might have sections)
        const savedProfileData = localStorage.getItem("profileData");
        let savedSections: Record<string, any> = {};
        if (savedProfileData) {
          try {
            const parsed = JSON.parse(savedProfileData);
            if (parsed.sections && typeof parsed.sections === 'object') {
              savedSections = parsed.sections;
            }
          } catch (e) {
            // Silently handle parse errors
          }
        }
        
        // Check if we got valid API data
        if (!apiProfile || (typeof apiProfile === 'object' && 'success' in apiProfile && !apiProfile.success)) {
          // If we have saved sections, use them
          if (Object.keys(savedSections).length > 0) {
            setProfileData({
              companyStage: savedProfileData ? JSON.parse(savedProfileData).companyStage || "growth" : "growth",
              name: savedProfileData ? JSON.parse(savedProfileData).name || "Untitled Company" : "Untitled Company",
              sections: savedSections,
            });
            setLoading(false);
            return;
          }
          
          // No valid data, return empty structure
          setProfileData({
            companyStage: "growth",
            name: "Untitled Company",
            sections: {},
          });
          setLoading(false);
          return;
        }

        // Map API response to sections structure
        const mappedSections: Record<string, any> = {};
        
        for (const section of profileConfig.tabs) {
          const sectionData = mapApiProfileToSectionData(
            apiProfile,
            API_FIELD_MAPPING,
            section.id
          );
          
          // Merge with saved sections if available (saved data takes precedence)
          if (savedSections[section.id] && savedSections[section.id].fields) {
            mappedSections[section.id] = {
              fields: {
                ...sectionData.fields,
                ...savedSections[section.id].fields, // Saved data overrides API data
              },
            };
          } else {
            mappedSections[section.id] = sectionData;
          }
        }

        // Determine companyStage - try multiple sources
        const rawCompanyStage = 
          (apiProfile as any).kf_cf_businesslifecyclestage || 
          (apiProfile as any).department || 
          (savedProfileData ? JSON.parse(savedProfileData).companyStage : null) ||
          null;
        
        // Normalize companyStage to match config values
        const validStages = profileConfig.companyStages.map(s => s.id);
        let finalCompanyStage = "growth"; // Default fallback
        
        if (rawCompanyStage) {
          const normalized = String(rawCompanyStage)
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/-/g, '')
            .replace(/_/g, '');
          
          // Try to match normalized value
          const matchedStage = validStages.find(stage => {
            const stageNormalized = stage.toLowerCase().replace(/\s+/g, '');
            return normalized.includes(stageNormalized) || stageNormalized.includes(normalized);
          });
          
          if (matchedStage) {
            finalCompanyStage = matchedStage;
          } else if (validStages.includes(String(rawCompanyStage).toLowerCase())) {
            finalCompanyStage = String(rawCompanyStage).toLowerCase();
          } else {
            // Try partial matching for common variations
            if (normalized.includes('start') || normalized.includes('ideation')) {
              finalCompanyStage = "startup";
            } else if (normalized.includes('growth') || normalized.includes('launch')) {
              finalCompanyStage = "growth";
            } else if (normalized.includes('mature') || normalized.includes('expansion')) {
              finalCompanyStage = "mature";
            } else if (normalized.includes('enterprise') || normalized.includes('large')) {
              finalCompanyStage = "enterprise";
            }
          }
        }

        // Create ProfileData structure
        const transformedData: ProfileData = {
          companyStage: finalCompanyStage,
          name: (apiProfile as any).kf_companyname || 
                (apiProfile as any).accountName || 
                (savedProfileData ? JSON.parse(savedProfileData).name : null) ||
                "Untitled Company",
          sections: mappedSections,
        };

        setProfileData(transformedData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch profile data";
        setError(errorMessage);
        
        // Try to load from localStorage on error
        const savedProfileData = localStorage.getItem("profileData");
        if (savedProfileData) {
          try {
            const parsed = JSON.parse(savedProfileData);
            if (parsed.sections) {
              setProfileData(parsed);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Silently handle parse errors
          }
        }
        
        setProfileData(null); // Clear any existing data on error
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    },
    [azureId, user?.id, user?.email]
  );

  const refetch = useCallback(
    async (userAzureId?: string, userEmail?: string) => {
      await fetchData(userAzureId, userEmail);
    },
    [fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for localStorage changes to update profile data dynamically
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only react to changes in profileData
      if (e.key === "profileData") {
        fetchData();
      }
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events (from same tab)
    const handleCustomStorageChange = () => {
      fetchData();
    };
    window.addEventListener("profileDataUpdated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileDataUpdated", handleCustomStorageChange);
    };
  }, [fetchData]);

  return {
    profileData,
    loading,
    error,
    refetch,
  };
};
