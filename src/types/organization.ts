/**
 * Organization Types
 * 
 * Type definitions for organization data retrieved from the API
 */

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
  address1: string | null;
  website: string | null;
  industry: string | null;
  revenue: number | null;
  employeeCount: number | null;
  fullname: string;
  mobilephone: string;
  accountnumber: string | null;
  kf_enterprisename: string | null;
  kf_website: string | null;
  kf_registrationnumber: string | null;
  companyStage?: string | null;
  kf_cf_businesslifecyclestage?: string | null;
  department?: string | null;
  kf_accessroles?: number | string | null;
  hasContact: boolean;
  hasAccount: boolean;
  fetchedAt: string;
  [key: string]: any; // Allow additional fields from API
}

export interface OrganizationInfoResponse {
  success: boolean;
  organization: OrganizationInfo;
  profile?: Record<string, any>; // Optional profile field from API
  message: string;
}

export interface OrganizationInfoRequest {
  useremail: string;
  azureid: string;
}

