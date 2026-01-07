import {
  loadDataIndexedDB,
  loadProgressIndexedDB,
  loadStatusIndexedDB,
  resetOnboardingIndexedDB,
  saveDataIndexedDB,
  saveProgressIndexedDB,
} from "./idbOnboarding";
import { ProfileApiResponse } from "../types";
import { API_BASE_URL } from "../config/apiBase";

// Onboarding form data interface
interface OnboardingFormData {
  formId?: string;
  userId?: string;
  accountId?: string;
  onboardingState?: string;
  companyName?: string;
  industry?: string;
  businessType?: string;
  companyStage?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  registrationNumber?: string;
  establishmentDate?: string;
  businessSize?: string;
  businessPitch?: string;
  problemStatement?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  employeeCount?: number;
  founders?: string;
  foundingYear?: string;
  initialCapitalUsd?: number;
  fundingNeedsUsd?: number;
  businessRequirements?: string;
  businessNeeds?: string;
  id?: string;
  updatedAt?: string;
}

/**
 * DEPRECATED: Check if user has completed onboarding
 * 
 * ⚠️ This function is deprecated. Onboarding status should be checked via API
 * using the checkOnboardingStatus function from onboardingStatus.ts
 * 
 * This function is kept for backward compatibility but always returns false
 * to ensure API-based checks are used instead.
 */
export const checkOnboardingStatus = async (): Promise<boolean> => {
  console.warn("⚠️ [DEPRECATED] onboardingService.checkOnboardingStatus() called - this function is deprecated. Use API-based checkOnboardingStatus() from onboardingStatus.ts instead.");
  // Always return false to force API check
  return false;
};
// Save onboarding progress (intermediate state)
export const saveOnboardingProgress = async (
  formData: OnboardingFormData
): Promise<boolean> => {
  // Try IndexedDB first
  try {
    const ok = await saveProgressIndexedDB(formData);
    if (ok) return true;
  } catch (error) {
    // IndexedDB save failed, falling back to mock API
  }

  // Fallback to mock API/localStorage
  try {
    const result: { success: boolean; message: string } =
      await mockSaveProgress(formData);
    return result.success;
  } catch (error) {
    return false;
  }
};
// Save onboarding data (final submission)
export const saveOnboardingData = async (
  formData: OnboardingFormData
): Promise<boolean> => {
  // Try IndexedDB first
  try {
    const ok = await saveDataIndexedDB(formData);
    if (ok) {
      // If local IndexedDB save succeeded for final submission, clear stored onboarding data
      try {
        await resetOnboardingIndexedDB();
      } catch (e) {
        // Failed to clear onboarding IndexedDB after local save
      }
      return true;
    }
  } catch (error) {
    // IndexedDB save failed, falling back to mock API
  }

  // Fallback to mock API/localStorage
  try {
    const result: { success: boolean; message: string } = await mockSaveData(
      formData
    );
    if (result.success) {
      // On successful remote save, clear any local copies in IndexedDB/localStorage
      try {
        await resetOnboardingIndexedDB();
      } catch (e) {
        // Failed to clear onboarding IndexedDB after remote save
      }
    }
    return result.success;
  } catch (error) {
    return false;
  }
};

// Load onboarding data
export const loadOnboardingData =
  async (): Promise<OnboardingFormData | null> => {
    try {
      const data = await loadDataIndexedDB();
      if (data)       return data;
      return await mockLoadData();
    } catch (error) {
      try {
        return await mockLoadData();
      } catch (e) {
        return null;
      }
    }
  };

// Load onboarding progress
export const loadOnboardingProgress =
  async (): Promise<OnboardingFormData | null> => {
    try {
      const data = await loadProgressIndexedDB();
      if (data)       return data;
      return await mockLoadProgress();
    } catch (error) {
      try {
        return await mockLoadProgress();
      } catch (e) {
        return null;
      }
    }
  };

/**
 * DEPRECATED: Mock function for checking onboarding status
 * 
 * ⚠️ This function is deprecated. Onboarding status should be checked via API.
 * This function is kept for backward compatibility but always returns false.
 */
const mockCheckStatus = async (): Promise<{ isComplete: boolean }> => {
  console.warn("⚠️ [DEPRECATED] mockCheckStatus() called - localStorage is no longer used for onboarding status");
  // Always return false to force API check
  return { isComplete: false };
};

const mockSaveProgress = async (
  formData: OnboardingFormData
): Promise<{ success: boolean; message: string }> => {
  try {
    localStorage.setItem(
      "onboardingProgress",
      JSON.stringify({
        ...formData,
        updatedAt: new Date().toISOString(),
      })
    );
    return { success: true, message: "Progress saved successfully" };
  } catch (error) {
    return { success: false, message: "Failed to save progress" };
  }
};

const mockSaveData = async (
  formData: OnboardingFormData
): Promise<{ success: boolean; message: string }> => {
  console.warn("⚠️ [DEPRECATED] mockSaveData() called - localStorage is no longer used for onboarding status");
  // Note: We still save form data to localStorage for local progress tracking,
  // but we don't set onboardingComplete anymore - that's managed via API
  try {
    localStorage.setItem(
      "onboardingData",
      JSON.stringify({
        ...formData,
        updatedAt: new Date().toISOString(),
        id: formData.id || Date.now().toString(),
      })
    );
    // REMOVED: localStorage.setItem("onboardingComplete", "true");
    // Onboarding status is now managed via API, not localStorage
    return { success: true, message: "Data saved successfully (local only - status managed via API)" };
  } catch (error) {
    return { success: false, message: "Failed to save data" };
  }
};

const mockLoadData = async (): Promise<OnboardingFormData | null> => {
  try {
    const data = localStorage.getItem("onboardingData");
    if (data) return JSON.parse(data);
    const progress = localStorage.getItem("onboardingProgress");
    return progress ? JSON.parse(progress) : null;
  } catch {
    return null;
  }
};

const mockLoadProgress = async (): Promise<OnboardingFormData | null> => {
  try {
    const progress = localStorage.getItem("onboardingProgress");
    return progress ? JSON.parse(progress) : null;
  } catch {
    return null;
  }
};

/**
 * Map API profile response to onboarding form data
 */
export const mapApiProfileToOnboardingForm = (
  apiProfile: ProfileApiResponse["profile"]
): Partial<OnboardingFormData> => {
  const mapped: Partial<OnboardingFormData> = {};

  // Note: accountId should come from organization data (welcome card), not from prefill API
  // Do not include accountId in the mapped data

  // Company Information
  if (apiProfile.kf_companyname) {
    mapped.companyName = apiProfile.kf_companyname;
  } else if (apiProfile.accountName) {
    mapped.companyName = apiProfile.accountName;
  } else if (apiProfile.companyName) {
    mapped.companyName = apiProfile.companyName;
  }

  if (apiProfile.kf_industry) {
    mapped.industry = apiProfile.kf_industry;
  } else if (apiProfile.industry) {
    mapped.industry = apiProfile.industry;
  }

  if (apiProfile.kf_businesstype) {
    mapped.businessType = apiProfile.kf_businesstype;
  }

  if (apiProfile.kf_registrationnumber) {
    mapped.registrationNumber = apiProfile.kf_registrationnumber;
  } else if (apiProfile.registrationNumber) {
    mapped.registrationNumber = apiProfile.registrationNumber;
  }

  if (apiProfile.kf_establishmentdate) {
    mapped.establishmentDate = apiProfile.kf_establishmentdate;
  } else if (apiProfile.establishmentDate) {
    mapped.establishmentDate = apiProfile.establishmentDate;
  }

  // Contact Information
  if (apiProfile.fullname) {
    mapped.contactName = apiProfile.fullname;
  } else if (apiProfile.contactName) {
    mapped.contactName = apiProfile.contactName;
  } else if (apiProfile.firstName && apiProfile.lastName) {
    mapped.contactName = `${apiProfile.firstName} ${apiProfile.lastName}`;
  }

  if (apiProfile.email) {
    mapped.email = apiProfile.email;
  } else if (apiProfile.emailaddress1) {
    mapped.email = apiProfile.emailaddress1;
  } else if (apiProfile.emailAddress) {
    mapped.email = apiProfile.emailAddress;
  }

  if (apiProfile.mobilephone) {
    mapped.phone = apiProfile.mobilephone;
  } else if (apiProfile.phone) {
    mapped.phone = apiProfile.phone;
  } else if (apiProfile.telephone1) {
    mapped.phone = apiProfile.telephone1;
  } else if (apiProfile.phoneNumber) {
    mapped.phone = apiProfile.phoneNumber;
  }

  // Business Profile
  if (apiProfile.kf_businesspitch) {
    mapped.businessPitch = apiProfile.kf_businesspitch;
  } else if (apiProfile.businessPitch) {
    mapped.businessPitch = apiProfile.businessPitch;
  }

  // Address Information
  if (apiProfile.kf_address) {
    mapped.address = apiProfile.kf_address;
  } else if (apiProfile.address1_line1) {
    mapped.address = apiProfile.address1_line1;
    if (apiProfile.address1_line2) {
      mapped.address += `, ${apiProfile.address1_line2}`;
    }
    if (apiProfile.address1_line3) {
      mapped.address += `, ${apiProfile.address1_line3}`;
    }
  } else if (apiProfile.address) {
    mapped.address = apiProfile.address;
  }

  if (apiProfile.kf_city) {
    mapped.city = apiProfile.kf_city;
  } else if (apiProfile.address1_city) {
    mapped.city = apiProfile.address1_city;
  } else if (apiProfile.city) {
    mapped.city = apiProfile.city;
  }

  if (apiProfile.address1_country) {
    mapped.country = apiProfile.address1_country;
  }

  if (apiProfile.websiteurl) {
    mapped.website = apiProfile.websiteurl;
  } else if (apiProfile.kf_website) {
    mapped.website = apiProfile.kf_website;
  } else if (apiProfile.website) {
    mapped.website = apiProfile.website;
  }

  // Operations
  if (apiProfile.kf_employeecount !== undefined && apiProfile.kf_employeecount !== null) {
    mapped.employeeCount = apiProfile.kf_employeecount;
  } else if (apiProfile.employeeCount !== undefined && apiProfile.employeeCount !== null) {
    mapped.employeeCount = apiProfile.employeeCount;
  }

  if (apiProfile.kf_founders) {
    mapped.founders = apiProfile.kf_founders;
  } else if (apiProfile.founders) {
    mapped.founders = apiProfile.founders;
  }

  if (apiProfile.kf_foundingyear) {
    mapped.foundingYear = apiProfile.kf_foundingyear;
  } else if (apiProfile.foundingYear) {
    mapped.foundingYear = apiProfile.foundingYear;
  }

  // Funding
  if (apiProfile.kf_initialcapitalusd !== undefined && apiProfile.kf_initialcapitalusd !== null) {
    mapped.initialCapitalUsd = apiProfile.kf_initialcapitalusd;
  } else if (apiProfile.initialCapitalUSD !== undefined && apiProfile.initialCapitalUSD !== null) {
    mapped.initialCapitalUsd = apiProfile.initialCapitalUSD;
  }

  if (apiProfile.kf_fundingneedsusd !== undefined && apiProfile.kf_fundingneedsusd !== null) {
    mapped.fundingNeedsUsd = apiProfile.kf_fundingneedsusd;
  } else if (apiProfile.fundingNeedsUSD !== undefined && apiProfile.fundingNeedsUSD !== null) {
    mapped.fundingNeedsUsd = apiProfile.fundingNeedsUSD;
  }

  if (apiProfile.kf_businessrequirements) {
    mapped.businessRequirements = apiProfile.kf_businessrequirements;
  } else if (apiProfile.businessRequirements) {
    mapped.businessRequirements = apiProfile.businessRequirements;
  }

  if (apiProfile.kf_businessneeds) {
    mapped.businessNeeds = apiProfile.kf_businessneeds;
  }

  return mapped;
};

/**
 * Fetch profile data from API and map to onboarding form
 */
export const fetchAndMapProfileToOnboarding = async (
  azureId: string
): Promise<Partial<OnboardingFormData> | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/get-user-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ azureid: azureId }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: ProfileApiResponse = await response.json();

    if (data.success && data.profile) {
      const mapped = mapApiProfileToOnboardingForm(data.profile);
      return mapped;
    }

    return null;
  } catch (error) {
    return null;
  }
};
