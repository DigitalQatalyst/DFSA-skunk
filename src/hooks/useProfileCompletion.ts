import { useState, useEffect } from "react";
import { useProfileData } from "./useProfileData";
import { profileConfig, API_FIELD_MAPPING } from "../utils/config";

interface ProfileCompletionData {
  overallCompletion: number;
  mandatoryCompletion: number;
  sectionCompletions: Record<string, number>;
  mandatoryCompletions: Record<string, any>;
  missingMandatoryFields: any[];
  totalMandatoryFields: number;
  completedMandatoryFields: number;
}

/**
 * Calculate overall completion based on all fields in the profile
 * This matches what the profile page shows
 */
const calculateOverallProfileCompletion = (rawApiData: any): number => {
  if (!rawApiData || !rawApiData.organization) {
    return 0;
  }

  const apiProfile = rawApiData.organization;
  let totalFields = 0;
  let completedFields = 0;

  // Count all fields defined in the profile configuration
  profileConfig.tabs.forEach((tab) => {
    tab.groups.forEach((group) => {
      group.fields.forEach((field) => {
        totalFields++;
        
        const apiFieldName = API_FIELD_MAPPING[field.fieldName];
        if (apiFieldName && apiProfile[apiFieldName] !== undefined) {
          const value = apiProfile[apiFieldName];
          
          // Check if field has a meaningful value
          if (value !== null && value !== undefined && value !== "") {
            // For strings, check if not empty after trimming
            if (typeof value === "string" && value.trim() !== "") {
              completedFields++;
            }
            // For numbers, consider any number (including 0) as completed
            else if (typeof value === "number") {
              completedFields++;
            }
            // For arrays, check if not empty
            else if (Array.isArray(value) && value.length > 0) {
              completedFields++;
            }
            // For other types, consider them completed if they exist
            else if (typeof value !== "string") {
              completedFields++;
            }
          }
        }
      });
    });
  });

  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
};

export const useProfileCompletion = (
  azureId?: string
): ProfileCompletionData & { loading: boolean; error: string | null } => {
  const { profileData: rawProfileData, loading, error } = useProfileData(azureId);
  const [completionData, setCompletionData] = useState<ProfileCompletionData>({
    overallCompletion: 0,
    mandatoryCompletion: 0,
    sectionCompletions: {},
    mandatoryCompletions: {},
    missingMandatoryFields: [],
    totalMandatoryFields: 0,
    completedMandatoryFields: 0,
  });

  useEffect(() => {
<<<<<<< Updated upstream
    if (!profileData) {
      // Reset to defaults when no profile data
      setCompletionData({
        overallCompletion: 0,
        mandatoryCompletion: 0,
        sectionCompletions: {},
        mandatoryCompletions: {},
        missingMandatoryFields: [],
        totalMandatoryFields: 0,
        completedMandatoryFields: 0,
      });
      return;
    }

    const sectionCompletions: Record<string, number> = {};
    const mandatoryCompletions: Record<string, any> = {};
    let totalFields = 0;
    let completedFields = 0;

    // Calculate completion for each section
    profileConfig.tabs.forEach((tab) => {
      const sectionData = profileData.sections?.[tab.id] || { fields: {} };

      // Calculate overall section completion
      const sectionConfig = profileConfig.tabs.find(t => t.id === tab.id);
      sectionCompletions[tab.id] = sectionConfig 
        ? calculateSectionCompletion(sectionData, sectionConfig as any)
        : 0;

      // Calculate mandatory completion for this section
      mandatoryCompletions[tab.id] = calculateMandatoryCompletion(
        sectionData,
        tab.id,
        profileData.companyStage || "",
        profileConfig
      );

      // Count fields for overall completion
      const fields = sectionData.fields || {};
      const fieldCount = Object.keys(fields).length;
      totalFields += fieldCount;

      Object.values(fields).forEach((value: any) => {
        if (value && typeof value === "string" && value.trim() !== "") {
          completedFields++;
        }
      });
    });

    // Calculate overall completion percentage
    const overallCompletion =
      totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

    // Calculate mandatory fields completion
    // Check if we have the required data
    const hasCompanyStage = profileData.companyStage && typeof profileData.companyStage === "string";
    const hasSections = profileData.sections && typeof profileData.sections === "object";
    
    let mandatoryFieldsCheck;
    
    if (hasCompanyStage && hasSections) {
      // Call the function to get actual completion data
      mandatoryFieldsCheck = checkMandatoryFieldsCompletion(
        profileData,
        profileData.companyStage
      );
    } else {
      // Return safe default if data is missing
      mandatoryFieldsCheck = { completed: 0, total: 0, missing: [] };
    }

    const mandatoryCompletion =
      mandatoryFieldsCheck.total > 0
        ? Math.round(
            (mandatoryFieldsCheck.completed / mandatoryFieldsCheck.total) *
              100
          )
        : 0;

    setCompletionData({
      overallCompletion,
      mandatoryCompletion,
      sectionCompletions,
      mandatoryCompletions,
      missingMandatoryFields: mandatoryFieldsCheck.missing,
      totalMandatoryFields: mandatoryFieldsCheck.total,
      completedMandatoryFields: mandatoryFieldsCheck.completed,
    });
  }, [profileData]);
=======
    if (rawProfileData) {
      try {
        // Calculate overall completion using the same logic as the profile page
        const overallCompletion = calculateOverallProfileCompletion(rawProfileData);

        // For now, use overall completion as both overall and mandatory completion
        // This ensures the overview shows the same percentage as the profile page
        const mandatoryCompletion = overallCompletion;

        setCompletionData({
          overallCompletion,
          mandatoryCompletion,
          sectionCompletions: {},
          mandatoryCompletions: {},
          missingMandatoryFields: [],
          totalMandatoryFields: 0,
          completedMandatoryFields: 0,
        });
      } catch (err) {
        console.error('Error calculating profile completion:', err);
        // Set default values on error to prevent white screen
        setCompletionData({
          overallCompletion: 0,
          mandatoryCompletion: 0,
          sectionCompletions: {},
          mandatoryCompletions: {},
          missingMandatoryFields: [],
          totalMandatoryFields: 0,
          completedMandatoryFields: 0,
        });
      }
    } else {
      // Reset to defaults when profileData is null/undefined
      setCompletionData({
        overallCompletion: 0,
        mandatoryCompletion: 0,
        sectionCompletions: {},
        mandatoryCompletions: {},
        missingMandatoryFields: [],
        totalMandatoryFields: 0,
        completedMandatoryFields: 0,
      });
    }
  }, [rawProfileData]);
>>>>>>> Stashed changes

  return {
    ...completionData,
    loading,
    error,
  };
};
