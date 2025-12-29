// User Service
// Handles user information retrieval from external API

import { API_BASE_URL } from '../config/apiBase';

const GET_ACCOUNTS_BY_ORG_URL = `${API_BASE_URL}/auth/get-accounts-by-org`;

export interface OrganizationUser {
  contactid: string;
  firstname?: string;
  lastname?: string;
  fullname?: string;
  emailaddress1?: string;
  jobtitle?: string | null;
  mobilephone?: string;
  telephone1?: string;
  statecode?: number;
  statuscode?: number;
  createdon?: string;
  modifiedon?: string;
  _parentcustomerid_value?: string;
  kf_accessroles?: number | string | null;
  [key: string]: any;
}

export interface GetAccountsByOrgResponse {
  "@odata.context"?: string;
  value: OrganizationUser[];
}

export class UserService {
  private userCache = new Map<
    string,
    {
      data: OrganizationUser[];
      timestamp: number;
    }
  >();

  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  /**
   * Fetch all users belonging to a specific organization
   */
  async getUsersByOrganization(
    accountId: string
  ): Promise<OrganizationUser[]> {
    // Check cache first
    const cached = this.userCache.get(accountId);
    if (cached) {
      const now = Date.now();
      const age = now - cached.timestamp;

      if (age < this.CACHE_DURATION) {
        console.log(
          `📦 Using cached users for ${accountId} (age: ${Math.round(
            age / 1000
          )}s)`
        );
        return cached.data;
      } else {
        console.log(`🗑️ Cache expired for ${accountId}, fetching fresh data`);
        this.userCache.delete(accountId);
      }
    }

    try {
      const url = `${GET_ACCOUNTS_BY_ORG_URL}/${accountId}`;
      console.log(`🔍 Fetching users for organization: ${accountId}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`No users found for organization ${accountId}`);
          return [];
        }
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const apiData: GetAccountsByOrgResponse = await response.json();

      console.log("📦 API Response:", apiData);

      // Extract users from OData response
      const users = apiData.value || [];

      console.log(`✅ Fetched ${users.length} users for organization`);

      // Cache the result
      this.userCache.set(accountId, {
        data: users,
        timestamp: Date.now(),
      });

      return users;
    } catch (error) {
      console.error("Failed to fetch organization users:", error);
      throw error;
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.userCache.clear();
  }

  /**
   * Clear cache for specific organization
   */
  clearCacheForOrganization(accountId: string): void {
    this.userCache.delete(accountId);
  }
}

// Create singleton instance
export const userService = new UserService();

// Convenience function
export const getUsersByOrganization = (accountId: string) =>
  userService.getUsersByOrganization(accountId);
