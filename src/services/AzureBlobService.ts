// Mock implementation of Azure Blob Storage service
// Original implementation used @azure/storage-blob which is not available
/**
 * Service for interacting with Azure Blob Storage
 * Note: This is a client-side implementation that would typically require server-side proxy
 * for secure SAS token generation in production environments.
 */
import { getCachedAccountId } from './UserProfileService';
import { API_ROOT_URL } from '../config/apiBase';

// Configuration values - in a real implementation, these would come from environment variables
const STORAGE_ACCOUNT_NAME = "kfdocumentwallet";
const CONTAINER_NAME = "kf-firm-wallet-container";

/**
 * Generates a SAS URL for uploading a blob (Demo implementation)
 * In production, this should be done server-side to keep storage keys secure
 * @param blobName The name of the blob
 * @param contentType The content type of the blob
 * @param expiryMinutes How long the SAS URL should be valid for (in minutes)
 * @returns The SAS URL for uploading
 */
export const generateUploadSasUrl = async (
  blobName: string,
  contentType: string,
  expiryMinutes: number = 15
): Promise<string> => {
  // For demo purposes, return a placeholder URL
  console.log("Generating upload SAS URL for:", blobName, contentType, "expiry:", expiryMinutes, "min");
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${blobName}?sv=demo&sig=demo&se=${Date.now() + expiryMinutes * 60000}`;
};

/**
 * Generates a SAS URL for downloading a blob (Production implementation)
 * Calls the backend API to generate a secure SAS token
 * @param blobName The name of the blob
 * @param userId The Azure user ID (from MSAL) for access control
 * @param expiryMinutes How long the SAS URL should be valid for (in minutes)
 * @param userEmail
 * @returns The SAS URL for downloading
 */
export const generateDownloadSasUrl = async (
  blobName: string,
  userId?: string,
  userEmail?: string,
  expiryMinutes: number = 60,
): Promise<string> => {
  try {
    console.log("🔵 Generating download SAS URL for:", blobName);
    console.log("🔵 Azure User ID:", userId);
    
    // Get account ID from Azure ID
    let accountId: string;
    if (userId) {
      try {
        accountId = await getCachedAccountId(userId, userEmail);
        console.log("✅ Account ID retrieved for download:", accountId);
      } catch (error) {
        console.error("❌ Failed to get account ID for download:", error);
        // Fallback to userId for backward compatibility
        accountId = userId;
      }
    } else {
      accountId = 'default-user';
    }
    
    const expiresInSeconds = expiryMinutes * 60;
    const apiUrl = `${API_ROOT_URL}/api/download`;
    console.log('Calling API:', apiUrl);

    const normalizedBlobName = (() => {
      try {
        return decodeURIComponent(blobName);
      } catch {
        return blobName;
      }
    })();
    console.log('Blob name sent to backend:', normalizedBlobName);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blobName: normalizedBlobName,
        userId: accountId,
        expiresInSeconds,
      }),
    });

    console.log("🔵 Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("🔴 API Error:", errorData);
      throw new Error(errorData.error || `Failed to generate download URL: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Download SAS URL generated successfully:", data.downloadUrl);
    return data.downloadUrl;
  } catch (error) {
    console.error("🔴 Error generating download SAS URL:", error);
    throw error;
  }
};

/**
 * Uploads a file directly to Azure Blob Storage (Demo implementation)
 * In production, this would use actual Azure SDK or server-side proxy
 * @param file The file to upload
 * @param blobName The name to give the blob (if not provided, will use the file name)
 * @returns The URL of the uploaded blob
 */
export const uploadFileToBlobStorage = async (
  file: File,
  blobName?: string
): Promise<string> => {
  // Use the file name if blobName is not provided
  const finalBlobName = blobName || `${Date.now()}-${file.name}`;
  console.log(
    "Uploading file to blob storage:",
    finalBlobName,
    file.size,
    "bytes"
  );
  // Simulate upload delay based on file size
  const uploadDelay = Math.min(2000, Math.max(500, file.size / 1000));
  await new Promise((resolve) => setTimeout(resolve, uploadDelay));
  // Return a demo URL
  const demoUrl = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${finalBlobName}`;
  console.log("File uploaded successfully to:", demoUrl);
  return demoUrl;
};

/**
 * Deletes a blob from Azure Blob Storage (Demo implementation)
 * @param blobName The name of the blob to delete
 * @returns A promise that resolves when the blob is deleted
 */
export const deleteBlob = async (blobName: string): Promise<void> => {
  console.log("Deleting blob from storage:", blobName);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Blob deleted successfully:", blobName);
};

/**
 * Checks if a blob exists (Demo implementation)
 * @param blobName The name of the blob to check
 * @returns A promise that resolves to true if the blob exists, false otherwise
 */
export const blobExists = async (blobName: string): Promise<boolean> => {
  console.log("Checking if blob exists:", blobName);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  // For demo purposes, return true for any blob name
  return true;
};

/**
 * Gets the properties of a blob (Demo implementation)
 * @param blobName The name of the blob
 * @returns The blob properties
 */
export const getBlobProperties = async (blobName: string) => {
  console.log("Getting blob properties:", blobName);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Return demo properties
  return {
    contentLength: 1024,
    contentType: "application/octet-stream",
    lastModified: new Date(),
    etag: '"demo-etag"',
  };
};

/**
 * Extracts the blob name from a blob URL
 * @param blobUrl The full URL of the blob
 * @returns The blob name (full path after container)
 */
export const getBlobNameFromUrl = (blobUrl: string): string => {
  // Remove any SAS token
  const urlWithoutSas = blobUrl.split("?")[0];
  
  // Parse the URL to extract the blob path
  // Format: https://{account}.blob.core.windows.net/{container}/{blobPath}
  const url = new URL(urlWithoutSas);
  const pathParts = url.pathname.split('/').filter(p => p); // Remove empty parts
  
  // First part is container name, rest is blob path
  if (pathParts.length > 1) {
    const joined = pathParts.slice(1).join('/');
    try {
      return decodeURIComponent(joined);
    } catch {
      return joined;
    }
  }
  
  // Fallback to just the filename if URL parsing fails
  return pathParts[pathParts.length - 1] || '';
};
