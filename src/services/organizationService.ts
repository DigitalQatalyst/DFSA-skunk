// Organization Service
// Handles organization information retrieval from external API

const ORGANIZATION_API_URL =
  "https://kfrealexpressserver.vercel.app/api/v1/auth/organization-info";

export interface OrganizationRequest {
  useremail: string;
  azureid: string;
}

export interface ContactInfo {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string | null;
  fullname: string;
  mobilephone: string;
  [key: string]: any;
}

export interface AccountInfo {
  accountId: string;
  accountName: string;
  name: string;
  accountNumber: string | null;
  industrycode: number | null;
  revenue: number | null;
  numberofemployees: number | null;
  website: string | null;
  [key: string]: any;
}

export interface OrganizationInfo {
  azureid: string;
  useremail: string;
  contactId: string;
  accountId: string;
  accountName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string | null;
  hasContact: boolean;
  hasAccount: boolean;
  fetchedAt: string;
  [key: string]: any;
}

export interface OrganizationResponse {
  success: boolean;
  organization: OrganizationInfo;
  message: string;
}

export class OrganizationService {
  private cachedOrganization: OrganizationInfo | null = null;
  private cacheTimestamp: number | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_ACCOUNT_ID = "0518582f-4598-f011-b41b-0022480d8ee5"; // Fallback account ID

  /**
   * Get organization information for a user
   */
  async getOrganizationInfo(
    azureId: string,
    userEmail: string
  ): Promise<OrganizationInfo> {
    // Check cache first
    if (this.isCacheValid()) {
      return this.cachedOrganization!;
    }

    try {
      const requestBody: OrganizationRequest = {
        useremail: userEmail,
        azureid: azureId,
      };

      const response = await fetch(ORGANIZATION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // Provide more specific error messages
        if (response.status === 404) {
          throw new Error(
            `Organization not found (404). This may be a new account that hasn't been fully provisioned yet.`
          );
        }
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data: OrganizationResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch organization info");
      }

      // Cache the result
      this.cachedOrganization = data.organization;
      this.cacheTimestamp = Date.now();

      return data.organization;
    } catch (error) {
      console.error("Failed to fetch organization info:", error);
      throw error;
    }
  }

  /**
   * Get account ID for the current user
   * Falls back to default account ID if API fails
   */
  async getAccountId(azureId: string, userEmail: string): Promise<string> {
    try {
      const orgInfo = await this.getOrganizationInfo(azureId, userEmail);

      if (!orgInfo.accountId) {
        console.warn(
          "Account ID not found in organization info, using default"
        );
        return this.DEFAULT_ACCOUNT_ID;
      }

      return orgInfo.accountId;
    } catch (error) {
      console.warn(
        "Failed to fetch organization info, using default account ID:",
        error
      );
      return this.DEFAULT_ACCOUNT_ID;
    }
  }

  /**
   * Get contact ID for the current user
   */
  async getContactId(azureId: string, userEmail: string): Promise<string> {
    const orgInfo = await this.getOrganizationInfo(azureId, userEmail);

    if (!orgInfo.contactId) {
      throw new Error("Contact ID not found in organization info");
    }

    return orgInfo.contactId;
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(): boolean {
    if (!this.cachedOrganization || !this.cacheTimestamp) {
      return false;
    }

    const now = Date.now();
    return now - this.cacheTimestamp < this.CACHE_DURATION;
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cachedOrganization = null;
    this.cacheTimestamp = null;
  }

  /**
   * Get cached organization info without making API call
   */
  getCachedOrganization(): OrganizationInfo | null {
    if (this.isCacheValid()) {
      return this.cachedOrganization;
    }
    return null;
  }
}

// Create singleton instance
export const organizationService = new OrganizationService();

// Convenience functions
export const getOrganizationInfo = (azureId: string, userEmail: string) =>
  organizationService.getOrganizationInfo(azureId, userEmail);

export const getAccountId = (azureId: string, userEmail: string) =>
  organizationService.getAccountId(azureId, userEmail);

export const getContactId = (azureId: string, userEmail: string) =>
  organizationService.getContactId(azureId, userEmail);

// Alias for compatibility with existing code
export const fetchOrganizationInfo = async (params: OrganizationRequest) => {
  const response = await fetch(ORGANIZATION_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Organization not found (404). This may be a new account that hasn't been fully provisioned yet.`
      );
    }
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
};
