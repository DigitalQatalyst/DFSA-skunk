/**
 * Simplified Profile Data Service
 */
import { ProfileApiResponse, ProfileData } from "../types";
import { getAuthToken } from "../utils/getAuthToken";
import { isFieldMandatory, SectionConfig } from "../utils/config";

interface DocumentMetadata {
    id?: string;
    name: string;
    category: string;
    description?: string;
    expiryDate?: string;
    tags?: string[];
    isConfidential: boolean;
    fileType: string;
    fileSize: string;
    uploadDate: string;
    uploadedBy: string;
    status: string;
    fileUrl: string;
    versionNumber?: number;
    previousVersionId?: string;
}

const API_BASE_URL1 = "https://kfrealexpressserver.vercel.app/api/v1/auth/organization-info";

export async function fetchBusinessProfileData(userEmail: string, id: string) {
    console.log(`🔍 [BUSINESS PROFILE] Preparing to fetch profile for email: ${userEmail} and azureId: ${id}`);

    const payload = {
        // Updated to use the passed-in credentials
        useremail: userEmail,
        azureid: id,
    };

    try {
        const response = await fetch(API_BASE_URL1, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        console.log(`📥 [BUSINESS PROFILE] Response status: ${response.status} ${response.statusText}`);

        // Handle 404 gracefully - this means no profile record exists yet
        if (response.status === 404) {
            console.log("ℹ️ [BUSINESS PROFILE] No profile record found (404) - this is expected for new users");
            return {
                success: false,
                message: "No profile record found",
                organization: null,
            };
        }

        // Handle other non-OK responses
        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            console.error(`❌ [BUSINESS PROFILE] HTTP error! Status: ${response.status} from ${API_BASE_URL1}`);
            console.error(`❌ [BUSINESS PROFILE] Error response:`, errorText);
            throw new Error(`HTTP error! Status: ${response.status} - Could not fetch profile data.`);
        }

        const data = await response.json();
        console.log("📦 [BUSINESS PROFILE] Raw server response:", data);

        // Check for success flag, but don't throw if it's false (might be valid empty response)
        if ('success' in data && data.success !== true) {
            console.warn(`⚠️ [BUSINESS PROFILE] API returned success=false: ${data.message || "Unknown error"}`);
            // Return the data anyway, let the caller decide how to handle it
            return data;
        }

        console.log("✅ [BUSINESS PROFILE] Profile data fetched successfully");
        return data;
    } catch (error) {
        console.error("❌ [BUSINESS PROFILE] Error in fetchBusinessProfileData:", error);
        throw error;
    }
}


//Placeholder API to fetch data from both APIs:-
const API_BASE_URL = "https://kfrealexpressserver.vercel.app/api/v1";
const API_ORG_INFO_URL = `${API_BASE_URL}/auth/organization-info`;
const API_ONBOARDING_URL = `${API_BASE_URL}/onboarding`;
const API_ACCOUNT_DATA_URL = "https://kfrealexpressserver.vercel.app/api/v1/account-data";


// Helper for handling API calls and checking the 'success' flag
async function handleApiResponse(response: Response, url: string) {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} from ${url}`);
    }

    const data = await response.json();

    // if (data.success !== true) {
    //     throw new Error(data.message || `Failed to retrieve data from ${url}.`);
    // }
    if ('success' in data && data.success !== true) {
        throw new Error(data.message || `Failed to retrieve data from ${url}.`);
    }

    return data;
}

// 1. Helper for the POST API call (Organization Info)
async function fetchOrgInfo(userEmail: string, azureId: string) {
    const payload = { useremail: userEmail, azureid: azureId };

    const response = await fetch(API_ORG_INFO_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    return handleApiResponse(response, API_ORG_INFO_URL);
}

// 2. Helper for the GET API call (Onboarding Data)
async function fetchOnboardingData(accountIdValue: string) {
    // Validate accountId before making request
    if (!accountIdValue || accountIdValue.trim() === "") {
        throw new Error("Account ID is required to fetch onboarding data");
    }

    const url = `${API_ONBOARDING_URL}/${accountIdValue}`;
    
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        // Handle 404 gracefully - this means no onboarding record exists yet
        if (response.status === 404) {
            return {
                data: [],
                message: "No onboarding record found",
            };
        }

        // Handle other non-OK responses
        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            console.error(`HTTP error! Status: ${response.status} from ${url}`, errorText);
            throw new Error(`HTTP error! Status: ${response.status} from ${url}`);
        }

        // Parse response
        const data = await response.json();

        // Now check for actual data array
        if (!data.data || data.data.length === 0) {
            return data;
        }

        // Return the full JSON object including the "message" and "data" array
        return data;
    } catch (error) {
        // If it's a 404, we already handled it above, but catch any other errors
        if (error instanceof Error && error.message.includes("404")) {
            return {
                data: [],
                message: "No onboarding record found",
            };
        }
        console.error("Error fetching onboarding data:", error);
        throw error;
    }
}


// 3. Helper for the GET API call (Account Data)
async function fetchAccountData(accountIdValue: string) {
    // Validate accountId before making request
    if (!accountIdValue || accountIdValue.trim() === "") {
        throw new Error("Account ID is required to fetch account data");
    }

    const url = `${API_ACCOUNT_DATA_URL}/${accountIdValue}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        // Handle 404 gracefully - this means no account record exists yet
        if (response.status === 404) {
            return {
                data: [],
                message: "No account record found",
            };
        }

        // Handle other non-OK responses
        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            console.error(
                `HTTP error! Status: ${response.status} from ${url}`,
                errorText
            );
            throw new Error(`HTTP error! Status: ${response.status} from ${url}`);
        }

        // Parse response
        const data = await response.json();
        console.log("data in dataverse", data)
        return data;
    } catch (error) {
        // If it's a 404, we already handled it above, but catch any other errors
        if (error instanceof Error && error.message.includes("404")) {
            return {
                data: [],
                message: "No account record found",
            };
        }
        console.error("Error fetching account data:", error);
        throw error;
    }
}


// export async function fetchCombinedProfileData(userEmail: string, azureId: string) {
//     let combinedData = {};
//
//     try {
//         // STEP 1: Fetch Organization/Contact Info (POST)
//         const orgInfoData = await fetchOrgInfo(userEmail, azureId);
//
//         // Merge the 'organization' object from the response
//         combinedData = { ...orgInfoData.organization };
//
//         // STEP 2: Extract the linking ID
//         const accountId = orgInfoData.organization.accountId;
//
//         if (!accountId) {
//             return combinedData;
//         }
//
//         // STEP 3: Fetch Onboarding Details (GET)
//         try {
//             const onboardingDataResult = await fetchOnboardingData(accountId);
//
//             // FIX: The API returns data under the 'data' key, which is an array.
//             // We need the first item in the array to merge the object.
//             const onboardingData = onboardingDataResult.data && Array.isArray(onboardingDataResult.data)
//                 ? onboardingDataResult.data[0]
//                 : {};
//
//             // STEP 4: Merge the Onboarding data (The entire successful response object)
//             combinedData = { ...combinedData, ...onboardingData };
//         } catch (onboardingError) {
//             // If onboarding fetch fails (e.g., 404), return org data only
//             // This is non-critical, so we don't throw
//         }
//
//         return combinedData;
//
//     } catch (error) {
//         console.error("Error in fetchCombinedProfileData:", error);
//         throw error;
//     }
// }
export async function fetchCombinedProfileData(userEmail: string, azureId: string) {
    let combinedData = {};

    try {
        // ... (STEP 1 & 2 remain the same)
        const orgInfoData = await fetchOrgInfo(userEmail, azureId);
        combinedData = { ...orgInfoData.organization };
        const accountId = orgInfoData.organization.accountId;

        if (!accountId) {
            return combinedData;
        }

        // STEP 3: Fetch Account Data (GET) and Merge Nested Arrays
        try {
            const accountDataResult = await fetchAccountData(accountId);

            // --- START CORRECTED LOGIC ---

            // 1. Destructure the `data` object and keep all other top-level fields separate.
            // The nested arrays are inside 'data'.
            const { data: nestedApiData, ...topLevelAccountData } = accountDataResult;

            // Merge the top-level fields first (accountId, website, numberofemployees, etc.)
            combinedData = { ...combinedData, ...topLevelAccountData };

            // Check and extract arrays from the nested 'data' property
            const productInnovations = nestedApiData?.productInnovations;
            const salesMarketings = nestedApiData?.salesMarketings;
            // (You can safely ignore 'metadata' and other unused fields)

            // 2. Extract and merge the *first item* from the Product Innovations array
            const productInnovationData =
                productInnovations && Array.isArray(productInnovations) && productInnovations.length > 0
                    ? productInnovations[0]
                    : {};

            // Merge the Product Innovation data directly.
            combinedData = { ...combinedData, ...productInnovationData };

            // 3. Extract and merge the *first item* from the Sales Marketings array
            const salesMarketingData =
                salesMarketings && Array.isArray(salesMarketings) && salesMarketings.length > 0
                    ? salesMarketings[0]
                    : {};

            // Merge the Sales Marketing data directly.
            combinedData = { ...combinedData, ...salesMarketingData };

            // --- END CORRECTED LOGIC ---
        } catch (accountDataError) {
            console.warn("Account Data fetch non-critical failure:", accountDataError);
        }

        // ... (The rest of the function remains the same)

        return combinedData;

    } catch (error) {
        console.error("Error in fetchCombinedProfileData:", error);
        throw error;
    }
}

// Cache for profile data
let dataCache: any | null = null;

// Save profile data to Dataverse
export const saveProfileData = async (profileData) => {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In a real implementation, this would be:
    // const response = await fetch('https://your-dataverse-api-endpoint/business-profiles/current', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(profileData),
    // });
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status} ${response.statusText}`);
    // }
    // const data = await response.json();
    // return data;

    // For now, we'll just update our cache
    dataCache = {
        ...dataCache,
        ...profileData,
        // Merge sections rather than replacing them
        sections: {
            ...(dataCache?.sections || {}),
            ...profileData.sections,
        },
    };

    // Store in localStorage for persistence across page reloads
    localStorage.setItem("profileData", JSON.stringify(dataCache));

    // Dispatch custom event to notify other components (same tab)
    // This allows the overview page to update completion percentage immediately
    window.dispatchEvent(new CustomEvent("profileDataUpdated", {
      detail: { profileData: dataCache }
    }));

    return dataCache;
};


// Helper functions for other parts of the app
/**
 * Calculates the completion percentage for a given profile section.
 *
 * @param sectionData The dynamic data (values) saved for the section.
 * @param sectionConfig The static configuration defining all fields in the section.
 * @returns The completion percentage (0-100).
 */
export const calculateSectionCompletion = (
    sectionData: { fields: Record<string, any> }, // Ensure sectionData has a 'fields' property
    sectionConfig: SectionConfig
): number => {
    // 1. Determine the TOTAL FIELDS (The Denominator) from the configuration
    const allFieldNames = sectionConfig.groups.flatMap(group =>
        group.fields.map(field => field.fieldName)
    );

    const totalFields = allFieldNames.length;

    if (totalFields === 0) {
        return 0;
    }

    let completedFields = 0;

    // 2. Iterate over the FIELD NAMES from the config (the Source of Truth)
    allFieldNames.forEach((fieldName) => {
        // Retrieve the value for this specific fieldName from the dynamic data
        // Use safe lookup as the field might not have been saved yet (which is expected)
        const value = sectionData?.fields?.[fieldName];

        let isCompleted = false;

        // 3. Check for completion based on value type
        if (typeof value === "string") {
            // For Text, Multiline Text, Dates, etc.: Check if not empty after trimming
            isCompleted = value.trim() !== "";
        } else if (Array.isArray(value)) {
            // For arrays (Multiselect): Check if it has any items
            isCompleted = value.length > 0;
        } else if (value !== null && value !== undefined) {
            // For Numbers (Whole Number, Decimal) and Objects (Lookup, Table):
            // If the key/value exists and is not null/undefined, it's considered complete.
            // This includes the number 0.
            isCompleted = true;
        }

        if (isCompleted) {
            completedFields++;
        }
    });

    // 4. Calculate and return the rounded percentage
    return Math.round((completedFields / totalFields) * 100);
};

export const calculateMandatoryCompletion = (
    sectionData,
    sectionId,
    companyStage,
    config
) => {
    if (!sectionData || !sectionData.fields || !config) {
        return { completed: 0, total: 0, percentage: 0 };
    }
    const sectionConfig = config.tabs.find((tab) => tab.id === sectionId);
    if (!sectionConfig) return { completed: 0, total: 0, percentage: 0 };

    let mandatoryFields = 0;
    let completedMandatory = 0;

    sectionConfig.groups.forEach((group) => {
        group.fields.forEach((field) => {

            // 2. USE the centralized, safe utility function
            if (isFieldMandatory(field, companyStage)) {
                mandatoryFields++;

                const value = sectionData.fields[field.fieldName];

                // 3. (Refinement) Use robust check for completion, matching TabSection.tsx logic
                let isCompleted = false;
                if (typeof value === "string") {
                    // Check for non-empty string
                    isCompleted = value.trim() !== "";
                } else if (Array.isArray(value)) {
                    // Check for non-empty array (multiselect)
                    isCompleted = value.length > 0;
                } else if (value !== null && value !== undefined) {
                    // Check for non-null/non-undefined values (numbers, dates, objects)
                    isCompleted = true;
                }

                if (isCompleted) {
                    completedMandatory++;
                }
            }
        });
    });

    return {
        completed: completedMandatory,
        total: mandatoryFields,
        percentage:
            mandatoryFields > 0
                ? Math.round((completedMandatory / mandatoryFields) * 100)
                : 100,
    };
};
/**
 * DEPRECATED: Check if user has completed onboarding
 * 
 * ⚠️ This function is deprecated. Onboarding status should be checked via API
 * using the checkOnboardingStatus function from onboardingStatus.ts
 * 
 * This function is kept for backward compatibility but always returns false
 * to ensure API-based checks are used instead.
 */
export const isOnboardingCompleted = () => {
    console.warn("⚠️ [DEPRECATED] isOnboardingCompleted() called - this function is deprecated. Use API-based checkOnboardingStatus() instead.");
    // Always return false to force API check
    return false;
};

/**
 * DEPRECATED: Legacy function for backward compatibility
 * 
 * ⚠️ This function is deprecated. Onboarding status should be checked via API.
 */
export const isOnboardingCompletedLegacy = () => {
  console.warn("⚠️ [DEPRECATED] isOnboardingCompletedLegacy() called - this function is deprecated. Use API-based checkOnboardingStatus() instead.");
  // Always return false to force API check
  return false;
};

/**
 * DEPRECATED: Reset onboarding status
 * 
 * ⚠️ This function is deprecated. Onboarding status is now managed via API.
 * This function only clears localStorage for cleanup purposes.
 */
export const resetOnboardingStatus = () => {
  console.warn("⚠️ [DEPRECATED] resetOnboardingStatus() called - localStorage is no longer used for onboarding status");
  // Only clear localStorage for cleanup, but don't rely on it
  try {
    localStorage.removeItem("onboardingComplete");
    localStorage.removeItem("onboardingProgress");
    localStorage.removeItem("profileData");
    console.log("✅ [CLEANUP] LocalStorage onboarding data cleared (for cleanup only)");
  } catch (error) {
    console.warn("⚠️ [CLEANUP] Failed to clear localStorage:", error);
  }
};

// Document-related functions (for compatibility with existing components)


export const createDocument = async (documentMetadata: DocumentMetadata) => {
  console.log("Creating document in Dataverse:", documentMetadata);

  // Create document with ID
  const newDocument = {
    ...documentMetadata,
    id: Date.now().toString(),
  };

  // Store in localStorage for demo purposes (until real Dataverse is connected)
  const existingDocuments = JSON.parse(
    localStorage.getItem("documents") || "[]"
  );
  existingDocuments.push(newDocument);
  localStorage.setItem("documents", JSON.stringify(existingDocuments));

  console.log("📄 Document saved to Dataverse (localStorage):");
  console.log("├─ Document ID:", newDocument.id);
  console.log("├─ File URL:", newDocument.fileUrl);
  console.log("├─ Name:", newDocument.name);
  console.log("├─ Category:", newDocument.category);
  console.log("└─ Full Document:", newDocument);

  // Simulate API delay (reduced for better UX)
  await new Promise((resolve) => setTimeout(resolve, 100));

  return newDocument;
  /* Real implementation would be:
  const token = await getAuthToken()
  // Format the data for Dataverse
  const dataverseRecord = {
    dq_name: documentMetadata.name,
    dq_category: documentMetadata.category,
    dq_description: documentMetadata.description || '',
    dq_expirydate: documentMetadata.expiryDate,
    dq_tags: documentMetadata.tags?.join(',') || '',
    dq_confidential: documentMetadata.isConfidential,
    dq_status: documentMetadata.status,
    dq_organisation: documentMetadata.uploadedBy, // Will be replaced with org ID from JWT
    dq_latestversion: documentMetadata.versionNumber || 1,
  }
  // Make the API call to create the record
  const response = await fetch(
    `${DATAVERSE_API_URL}/dq_documents`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(dataverseRecord),
    },
  )
  if (!response.ok) {
    throw new Error(`Failed to create document: ${response.statusText}`)
  }
  return await response.json()
  */
};
/**
 * Gets all documents from Dataverse
 * @returns An array of document records
 */
export const getAllDocuments = async () => {
  console.log("Getting all documents from Dataverse");

  // Get documents from localStorage for demo purposes (until real Dataverse is connected)
  const documents = JSON.parse(localStorage.getItem("documents") || "[]");
  console.log("Documents retrieved from localStorage:", documents);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return documents;
};

/**
 * Gets documents for a specific user from Dataverse
 * @param userId The user ID to filter documents by
 * @returns An array of document records for the user
 */
/**
 * Get all documents for an account (shared by all users in that account)
 * Fetches from Dataverse via Express server
 * @param accountId The Dataverse account ID (not used directly - Express server extracts from token)
 * @param userId Optional user ID to filter by specific user (not used - all account documents are returned)
 * @returns Array of documents from Dataverse
 */
export const getAccountDocuments = async (accountId: string, userId?: string) => {
  console.log("Getting documents for account:", accountId);
  if (userId) {
    console.log("   Note: userId filter not supported - returning all account documents");
  } else {
    console.log("   Fetching all documents for account from Dataverse");
  }
  
  try {
    // Get auth token
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    // Fetch documents from Express server (which queries Dataverse)
    const expressServerUrl = import.meta.env.VITE_EXPRESS_SERVER_URL || 
      (import.meta.env.DEV ? 'http://localhost:5000' : 'https://kfrealexpressserver.vercel.app');
    const url = `${expressServerUrl}/api/v1/documents`;
    
    console.log(`🔄 Fetching documents from Dataverse via Express server: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch documents from Dataverse: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      throw new Error(`Failed to fetch documents: ${response.statusText}`);
    }

    const data = await response.json();
    // Express server returns { documents: DocumentDTO[], count: number }
    const accountDocuments = data.documents || [];
    
    console.log(`✅ Found ${accountDocuments.length} documents for account from Dataverse`);
    
    // If userId is provided, filter by uploadedBy (though this is typically not needed for account-level docs)
    if (userId && accountDocuments.length > 0) {
      const filtered = accountDocuments.filter((doc: any) => doc.uploadedBy === userId);
      console.log(`   Filtered to ${filtered.length} documents for user ${userId}`);
      return filtered;
    }
    
    return accountDocuments;
  } catch (error) {
    console.error('Error fetching documents from Dataverse:', error);
    throw error; // Don't fall back to localStorage - fail explicitly
  }
};

export const getUserDocuments = async (userId: string) => {
  console.log("Getting documents for user:", userId);

  try {
    // Fetch documents from Azure Blob Storage via API
    const response = await fetch(
      `/api/list-documents?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch documents: ${response.status} ${response.statusText}`
      );
      // Fall back to localStorage if API fails
      console.log("Falling back to localStorage...");
      const allDocuments = JSON.parse(
        localStorage.getItem("documents") || "[]"
      );
      const userDocuments = allDocuments.filter(
        (doc: DocumentMetadata) => doc.uploadedBy === userId
      );
      return userDocuments;
    }

    const data = await response.json();
    const userDocuments = data.documents || [];

    console.log(
      `Found ${userDocuments.length} documents for user ${userId} from Azure Blob Storage`
    );

    return userDocuments;
  } catch (error) {
    console.error("Error fetching documents from API:", error);
    // Fall back to localStorage if there's a network error
    console.log("Falling back to localStorage...");
    const allDocuments = JSON.parse(localStorage.getItem("documents") || "[]");
    const userDocuments = allDocuments.filter(
      (doc: DocumentMetadata) => doc.uploadedBy === userId
    );
    return userDocuments;
  }
  /* Real implementation would be:
  const token = await getAuthToken()
  // Make the API call to get user-specific documents
  const response = await fetch(
    `${DATAVERSE_API_URL}/dq_documents?$filter=dq_organisation eq '${orgId}'&$select=dq_documentid,dq_name,dq_category,dq_description,dq_expirydate,dq_tags,dq_confidential,dq_status,dq_organisation,dq_latestversion`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (!response.ok) {
    throw new Error(`Failed to get user documents: ${response.statusText}`)
  }
  const data = await response.json()
  // Transform the data to match our interface
  return data.value.map((record: any) => ({
    id: record.dq_documentid,
    name: record.dq_name,
    category: record.dq_category,
    description: record.dq_description,
    expiryDate: record.dq_expirydate,
    tags: record.dq_tags?.split(',') || [],
    isConfidential: record.dq_confidential,
    status: record.dq_status,
    organisation: record.dq_organisation,
    latestVersion: record.dq_latestversion,
  }))
  */
};
/**
 * Gets a document by ID from Dataverse
 * @param id The document ID
 * @returns The document record
 */
export const getDocumentById = async (id: string) => {
  console.log("Getting document by ID:", id);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return null;
};

export const updateDocument = async (
  id: string,
  documentMetadata: Partial<DocumentMetadata>
) => {
  console.log("Updating document:", id, documentMetadata);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return documentMetadata;
};

export const deleteDocument = async (id: string) => {
  console.log("Deleting document from Dataverse:", id);

  // Remove from localStorage for demo purposes (until real Dataverse is connected)
  const existingDocuments = JSON.parse(
    localStorage.getItem("documents") || "[]"
  );
  const updatedDocuments = existingDocuments.filter(
    (doc: any) => doc.id !== id
  );
  localStorage.setItem("documents", JSON.stringify(updatedDocuments));

  console.log("Document deleted from localStorage:", id);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  /* Real implementation would be:
  const token = await getAuthToken()
  // Make the API call to delete the record
  const response = await fetch(
    `${DATAVERSE_API_URL}/dq_documents(${id})`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (!response.ok) {
    throw new Error(`Failed to delete document: ${response.statusText}`)
  }
  */
};
/**
 * Gets all versions of a document
 * @param documentId The document ID
 * @returns An array of document versions
 */
export const getDocumentVersions = async (documentId: string) => {
  console.log("Getting document versions:", documentId);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [];
  /* Real implementation would be:
  const token = await getAuthToken()
  // Make the API call to get all versions of the document
  const response = await fetch(
    `${DATAVERSE_API_URL}/dq_documentversions?$filter=dq_document eq '${documentId}'&$select=dq_documentversionid,dq_document,dq_versionnumber,dq_blobpath,dq_filename,dq_fileextension,dq_filesize,dq_uploadedby,dq_uploadedon`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (!response.ok) {
    throw new Error(`Failed to get document versions: ${response.statusText}`)
  }
  const data = await response.json()
  // Transform the data to match our interface
  return data.value.map((record: any) => ({
    id: record.dq_documentversionid,
    documentId: record.dq_document,
    versionNumber: record.dq_versionnumber,
    blobPath: record.dq_blobpath,
    filename: record.dq_filename,
    fileExtension: record.dq_fileextension,
    fileSize: record.dq_filesize,
    uploadedBy: record.dq_uploadedby,
    uploadedOn: record.dq_uploadedon,
  }))
  */
};

/**
 * Utility function to clear all documents from localStorage (for testing)
 */
export const clearAllDocuments = () => {
  localStorage.removeItem("documents");
  console.log("All documents cleared from localStorage");
};

// Generate mock data structure that simulates Dataverse API response
function generateMockDataverseResponse() {
  // Check if we have stored data in localStorage
  const storedData = localStorage.getItem("profileData");
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error("Error parsing stored profile data:", error);
    }
  }
  return {
    id: "12345",
    name: "FutureTech LLC",
    companyType: "Information Technology",
    companySize: "Medium Enterprise",
    companyStage: "growth",
    sections: {
      basic: {
        fields: {
          tradeName: "Future Tech",
          registrationNumber: "FT12345678",
          establishmentDate: "15-Mar-2010",
          entityType: "Limited Liability Company",
          registrationAuthority: "ADGM Registration Authority",
          legalStatus: "Active",
          businessType: "Limited Liability Company",
          industry: "Information Technology",
          businessSize: "Medium Enterprise",
          annualRevenue: "AED 25M - AED 50M",
          numberOfEmployees: "120",
          businessDescription:
            "Enterprise software solutions specializing in cloud-based enterprise management systems with AI-driven analytics capabilities. Our flagship products serve various industries including finance, healthcare, and manufacturing.",
          licenseExpiry: "31-Dec-2023",
          renewalStatus: "Pending",
          complianceStatus: "Compliant",
          lastUpdated: "10-Jun-2023",
          primaryIsicCode: "6201",
          primaryIsicDescription: "Computer programming activities",
          secondaryIsicCode: "6202",
          businessCategory: "Technology",
          marketSegment: "Enterprise Solutions",
          vatRegistrationNumber: "100123456700003",
          commercialLicenseNumber: "CN-12345",
          dunsNumber: "123456789",
          leiCode: "984500B38RH80URRT231",
          chamberOfCommerceNumber: "ADCCI-12345",
          fiveYearVision:
            "To become the leading enterprise software provider in the MENA region, with a focus on AI-driven solutions that transform business operations across industries.",
          investmentGoals: "AED 15M by Q2 2024 (Series B) - 60% complete",
          technologyRoadmap:
            "2023 Q4: Launch AI analytics platform\n2024 Q2: Expand IoT integration capabilities\n2024 Q4: Develop industry-specific solutions for healthcare\n2025: Blockchain integration for secure transactions",
        },
        status: {
          tradeName: "completed",
          registrationNumber: "completed",
          establishmentDate: "completed",
          entityType: "completed",
          registrationAuthority: "completed",
          legalStatus: "completed",
          businessType: "completed",
          industry: "completed",
          businessSize: "completed",
          annualRevenue: "completed",
          numberOfEmployees: "completed",
          businessDescription: "completed",
          licenseExpiry: "completed",
          renewalStatus: "editable",
          complianceStatus: "completed",
          lastUpdated: "completed",
          primaryIsicCode: "completed",
          primaryIsicDescription: "completed",
          secondaryIsicCode: "editable",
          businessCategory: "completed",
          marketSegment: "completed",
          vatRegistrationNumber: "completed",
          commercialLicenseNumber: "completed",
          dunsNumber: "completed",
          leiCode: "completed",
          chamberOfCommerceNumber: "completed",
          fiveYearVision: "completed",
          investmentGoals: "editable",
          technologyRoadmap: "completed",
        },
      },
      contact: {
        fields: {
          contactName: "John Smith",
          position: "Chief Executive Officer",
          email: "jsmith.futuretech@gmail.com",
          phone: "+971 50 123 4567",
          nationality: "British",
          languages: "English, Arabic",
          addressLine1: "Level 42, Al Maqam Tower",
          addressLine2: "ADGM Square, Al Maryah Island",
          city: "Abu Dhabi",
          country: "United Arab Emirates",
          poBox: "P.O. Box 12345",
          geoCoordinates: "24.4991° N, 54.3816° E",
          mainPhone: "+971 2 123 4567",
          website: "www.futuretech.com",
          generalEmail: "info@futuretech.com",
          supportEmail: "support@futuretech.com",
          fax: "+971 2 123 4568",
          socialMedia: "@futuretechllc",
        },
        status: {
          contactName: "completed",
          position: "completed",
          email: "completed",
          phone: "completed",
          nationality: "completed",
          languages: "completed",
          addressLine1: "completed",
          addressLine2: "completed",
          city: "completed",
          country: "completed",
          poBox: "completed",
          geoCoordinates: "editable",
          mainPhone: "completed",
          website: "completed",
          generalEmail: "completed",
          supportEmail: "completed",
          fax: "editable",
          socialMedia: "completed",
        },
      },
      legal: {
        fields: {
          legalForm: "Limited Liability Company",
          jurisdiction: "Abu Dhabi Global Market (ADGM)",
          registrationAuthority: "ADGM Registration Authority",
          governingLaw: "ADGM Companies Regulations 2020",
          foreignBranchStatus: "Not Applicable",
          legalCapacity: "Full",
          taxRegistrationNumber: "100123456700003",
          taxStatus: "Compliant",
          lastFilingDate: "31-Mar-2023",
          taxJurisdiction: "UAE",
          vatRegistrationDate: "01-Jan-2018",
          taxYearEnd: "31-Dec",
        },
        status: {
          legalForm: "completed",
          jurisdiction: "completed",
          registrationAuthority: "completed",
          governingLaw: "completed",
          foreignBranchStatus: "editable",
          legalCapacity: "completed",
          taxRegistrationNumber: "completed",
          taxStatus: "completed",
          lastFilingDate: "completed",
          taxJurisdiction: "completed",
          vatRegistrationDate: "completed",
          taxYearEnd: "completed",
        },
      },
      // Add empty structures for all other sections to support empty states
      financial: { fields: {}, status: {} },
      operational: { fields: {}, status: {} },
      ownership: { fields: {}, status: {} },
      licensing: { fields: {}, status: {} },
      compliance: { fields: {}, status: {} },
      industry: { fields: {}, status: {} },
      employees: { fields: {}, status: {} },
      facilities: { fields: {}, status: {} },
      products: { fields: {}, status: {} },
      certifications: { fields: {}, status: {} },
    },
  };
}
