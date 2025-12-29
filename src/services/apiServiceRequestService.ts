// API Service Request Service
// Handles service request operations using external API instead of Supabase

import { ServiceRequest, ServiceRequestStatus } from "../types";

const API_BASE_URL = "https://kfrealexpressserver.vercel.app/api/v1";
const OPPORTUNITIES_API_URL =
  "https://kfrealexpressserver.vercel.app/api/v1/opportunity/get-opportunities-and-cases";

interface ApiServiceRequestItem {
  "@odata.etag"?: string;
  kf_ordercode?: string | null;
  cr85d_emailaddress?: string;
  kf_sequencenumber?: number;
  modifiedon?: string;
  _owninguser_value?: string;
  kf_formid?: string | null;
  kf_servicename?: string;
  kf_cancelloanformid?: string;
  kf_submittedby?: string;
  kf_consentacknowledgement?: string | null;
  kf_telephonenumber?: string;
  overriddencreatedon?: string | null;
  kf_azureid?: string;
  _kf_businessunit_value?: string | null;
  kf_category?: string;
  cr85d_companynumber?: string;
  kf_loancancellation?: string | null;
  importsequencenumber?: number | null;
  _modifiedonbehalfby_value?: string | null;
  kf_serviceproviders?: string;
  statecode?: number;
  versionnumber?: number;
  utcconversiontimezonecode?: number | null;
  kf_fundingnumber?: string;
  kf_name?: string;
  kf_loancancellation_name?: string | null;
  _createdonbehalfby_value?: string | null;
  _modifiedby_value?: string;
  createdon?: string;
  _owningbusinessunit_value?: string;
  cr85d_companyname?: string;
  cr85d_position?: string;
  kf_status?: string;
  statuscode?: number;
  _owningteam_value?: string | null;
  kf_cancellationdetails?: string;
  _ownerid_value?: string;
  _createdby_value?: string;
  timezoneruleversionnumber?: number | null;
}

interface ApiServiceRequestGroup {
  name: string;
  success: boolean;
  data?: {
    "@odata.context": string;
    value: ApiServiceRequestItem[];
  };
  error?: {
    error: {
      code: string;
      message: string;
    };
  };
  count: number;
}

interface ApiResponse {
  userId: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalRecords: number;
  serviceRequests: ApiServiceRequestGroup[];
}

// Opportunities and Cases API interfaces
interface OpportunityItem {
  opportunityid?: string;
  name?: string;
  description?: string;
  statuscode?: number;
  statecode?: number;
  createdon?: string;
  modifiedon?: string;
  estimatedvalue?: number;
  closeprobability?: number;
  estimatedclosedate?: string;
  actualvalue?: number;
  actualclosedate?: string;
  kf_servicecategory?: string | null;
  kf_serviceprovider?: string | null;
  kf_firstname?: string | null;
  kf_lastname?: string | null;
  kf_emailaddress?: string | null;
  emailaddress?: string | null;
  _customerid_value?: string;
  "_customerid_value@OData.Community.Display.V1.FormattedValue"?: string;
  _accountid_value?: string;
  "_accountid_value@OData.Community.Display.V1.FormattedValue"?: string;
  _parentcontactid_value?: string;
  "_parentcontactid_value@OData.Community.Display.V1.FormattedValue"?: string;
  _contactid_value?: string;
  "_contactid_value@OData.Community.Display.V1.FormattedValue"?: string;
  _ownerid_value?: string;
  _createdby_value?: string;
  [key: string]: any;
}

interface CaseItem {
  incidentid?: string;
  ticketnumber?: string;
  title?: string;
  description?: string;
  statuscode?: number;
  statecode?: number;
  createdon?: string;
  modifiedon?: string;
  prioritycode?: number;
  caseorigincode?: number;
  casetypecode?: number;
  kf_servicecategory?: string | null;
  kf_serviceprovider?: string | null;
  kf_firstname?: string | null;
  kf_lastname?: string | null;
  kf_emailaddress?: string | null;
  emailaddress?: string | null;
  kf_phonenumber?: string | null;
  _customerid_value?: string;
  "_customerid_value@OData.Community.Display.V1.FormattedValue"?: string;
  _accountid_value?: string;
  "_accountid_value@OData.Community.Display.V1.FormattedValue"?: string;
  _primarycontactid_value?: string;
  "_primarycontactid_value@OData.Community.Display.V1.FormattedValue"?: string;
  _parentcontactid_value?: string;
  "_parentcontactid_value@OData.Community.Display.V1.FormattedValue"?: string;
  _contactid_value?: string;
  "_contactid_value@OData.Community.Display.V1.FormattedValue"?: string;
  _ownerid_value?: string;
  _createdby_value?: string;
  [key: string]: any;
}

interface OpportunitiesAndCasesResponse {
  message?: string;
  data?: any; // Use any for flexibility, we'll type guard at runtime
  filter?: {
    accountid: string;
  };
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}

export class ApiServiceRequestService {
  // Cache for contact information to avoid repeated API calls
  private contactCache = new Map<
    string,
    {
      data: {
        firstname?: string;
        lastname?: string;
        fullname?: string;
        emailaddress1?: string;
      };
      timestamp: number;
    }
  >();

  // Cache duration: 5 minutes
  private readonly CONTACT_CACHE_DURATION = 5 * 60 * 1000;

  /**
   * Fetch contact information by contact ID from the backend API
   */
  private async fetchContactInfo(contactId: string): Promise<{
    firstname?: string;
    lastname?: string;
    fullname?: string;
    emailaddress1?: string;
  } | null> {
    // Check cache first and validate it's not expired
    const cached = this.contactCache.get(contactId);
    if (cached) {
      const now = Date.now();
      const age = now - cached.timestamp;

      if (age < this.CONTACT_CACHE_DURATION) {
        console.log(
          `📦 Using cached contact info for ${contactId} (age: ${Math.round(
            age / 1000
          )}s)`
        );
        return cached.data;
      } else {
        console.log(`🗑️ Cache expired for ${contactId}, fetching fresh data`);
        this.contactCache.delete(contactId);
      }
    }

    try {
      const response = await fetch(
        `https://kfrealexpressserver.vercel.app/api/v1/contact-info/get-contact?contactid=${contactId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.warn(
          `Failed to fetch contact ${contactId}: ${response.status}`
        );
        return null;
      }

      const data = await response.json();
      console.log(`✅ Fetched contact ${contactId}:`, data);

      // Extract contact from response
      // The response structure is: { data: { value: [contactObject] } }
      let contactInfo: {
        firstname?: string;
        lastname?: string;
        fullname?: string;
        emailaddress1?: string;
      } | null = null;

      if (
        data.data?.value &&
        Array.isArray(data.data.value) &&
        data.data.value.length > 0
      ) {
        const contact = data.data.value[0];
        contactInfo = {
          firstname: contact.firstname,
          lastname: contact.lastname,
          fullname: contact.fullname,
          emailaddress1: contact.emailaddress1,
        };
      } else if (data.contact) {
        contactInfo = data.contact;
      } else if (data.data) {
        contactInfo = data.data;
      } else {
        contactInfo = data;
      }

      console.log(`📋 Extracted contact info:`, {
        fullname: contactInfo?.fullname,
        firstname: contactInfo?.firstname,
        lastname: contactInfo?.lastname,
        emailaddress1: contactInfo?.emailaddress1,
      });

      if (!contactInfo) {
        console.warn(`No contact info found for ${contactId}`);
        return null;
      }

      // Cache the result with timestamp
      this.contactCache.set(contactId, {
        data: contactInfo,
        timestamp: Date.now(),
      });

      return contactInfo;
    } catch (error) {
      console.error(`❌ Error fetching contact ${contactId}:`, error);
      return null;
    }
  }

  /**
   * Get all service requests for a user from the opportunities and cases API
   */
  async getServiceRequestsForUser(
    accountId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    serviceRequests: ServiceRequest[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalRecords: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await fetch(
        `${OPPORTUNITIES_API_URL}?accountid=${accountId}&page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const apiData: OpportunitiesAndCasesResponse = await response.json();

      console.log("📦 Full API Response:", apiData);

      // Log sample data to see what fields are available
      if (Array.isArray(apiData.data) && apiData.data.length > 0) {
        const firstItem = apiData.data[0];
        console.log("📦 Sample Item - Type:", firstItem._type);
        console.log("📦 Sample Item - ALL FIELDS:", firstItem);
        console.log("📦 Item Field Names:", Object.keys(firstItem));
      } else if (apiData.data?.opportunities?.value?.[0]) {
        console.log(
          "📦 Sample Opportunity - ALL FIELDS:",
          apiData.data.opportunities.value[0]
        );
        console.log(
          "📦 Opportunity Field Names:",
          Object.keys(apiData.data.opportunities.value[0])
        );
      } else if (apiData.data?.cases?.value?.[0]) {
        console.log(
          "📦 Sample Case - ALL FIELDS:",
          apiData.data.cases.value[0]
        );
        console.log(
          "📦 Case Field Names:",
          Object.keys(apiData.data.cases.value[0])
        );
      }

      // Transform API data to ServiceRequest format
      const serviceRequests: ServiceRequest[] = [];

      // Handle new flat array structure with _type discriminator
      if (Array.isArray(apiData.data)) {
        console.log(
          `📦 Processing ${apiData.data.length} items from flat array`
        );
        for (const item of apiData.data) {
          if (item._type === "opportunity" || item.opportunityid) {
            const serviceRequest =
              await this.transformOpportunityToServiceRequest(
                item as OpportunityItem
              );
            serviceRequests.push(serviceRequest);
          } else if (item._type === "case" || item.incidentid) {
            const serviceRequest = await this.transformCaseToServiceRequest(
              item as CaseItem
            );
            serviceRequests.push(serviceRequest);
          } else {
            console.warn("⚠️ Unknown item type:", item);
          }
        }
      } else {
        // Handle legacy nested structure
        // Transform opportunities
        if (
          apiData.data?.opportunities?.value &&
          Array.isArray(apiData.data.opportunities.value)
        ) {
          for (const opportunity of apiData.data.opportunities.value) {
            const serviceRequest =
              await this.transformOpportunityToServiceRequest(opportunity);
            serviceRequests.push(serviceRequest);
          }
        }

        // Transform cases
        if (
          apiData.data?.cases?.value &&
          Array.isArray(apiData.data.cases.value)
        ) {
          for (const caseItem of apiData.data.cases.value) {
            const serviceRequest = await this.transformCaseToServiceRequest(
              caseItem
            );
            serviceRequests.push(serviceRequest);
          }
        }
      }

      console.log(`✅ Transformed ${serviceRequests.length} service requests`);
      if (serviceRequests.length > 0) {
        console.log("📋 First transformed request:", serviceRequests[0]);
      }

      // Extract pagination data from API response
      const pagination = apiData.pagination || {
        currentPage: page,
        pageSize: pageSize,
        totalRecords: serviceRequests.length,
        totalPages: Math.ceil(serviceRequests.length / pageSize),
      };

      return {
        serviceRequests,
        pagination,
      };
    } catch (error) {
      console.error("Failed to fetch service requests from API:", error);
      throw error;
    }
  }

  /**
   * Map service category option set values to readable labels
   */
  private mapServiceCategory(categoryValue?: string | null): string {
    if (!categoryValue) return "Financial"; // Default for opportunities

    // Map Dynamics option set values to readable labels
    const categoryMap: Record<string, string> = {
      "123950000": "Financial",
      "123950001": "Non-Financial",
    };

    return categoryMap[categoryValue] || categoryValue;
  }

  /**
   * Transform Opportunity to ServiceRequest interface
   */
  private async transformOpportunityToServiceRequest(
    opportunity: OpportunityItem
  ): Promise<ServiceRequest> {
    // Fetch contact information from the API
    // Use _parentcontactid_value which is the actual contact (person), not _customerid_value (account/company)
    const contactId =
      opportunity._parentcontactid_value || opportunity._contactid_value;
    console.log(
      `🔍 Opportunity contact ID (_parentcontactid_value):`,
      contactId
    );
    console.log(
      `🔍 Customer/Account ID (_customerid_value):`,
      opportunity._customerid_value
    );

    let contactInfo: {
      firstname?: string;
      lastname?: string;
      fullname?: string;
      emailaddress1?: string;
    } | null = null;

    if (contactId) {
      contactInfo = await this.fetchContactInfo(contactId);
      console.log(`📋 Contact info for ${contactId}:`, contactInfo);
    }

    const expandedContact = (opportunity as any).customerid_contact;
    console.log(`🔍 Expanded contact:`, expandedContact);
    console.log(
      `🔍 OData formatted customer name:`,
      opportunity["_customerid_value@OData.Community.Display.V1.FormattedValue"]
    );

    // Map Dynamics status codes to our ServiceRequestStatus
    const mapOpportunityStatus = (
      statuscode?: number,
      statecode?: number
    ): ServiceRequestStatus => {
      // statecode: 0 = Open, 1 = Won, 2 = Lost
      // statuscode varies based on statecode
      if (statecode === 1) return "approved"; // Won
      if (statecode === 2) return "rejected"; // Lost

      // Open opportunities (statecode = 0)
      if (statuscode === 1) return "in-progress"; // In Progress
      if (statuscode === 2) return "submitted"; // On Hold

      return "submitted"; // Default for open
    };

    return {
      id: opportunity.opportunityid || crypto.randomUUID(),
      serviceName: opportunity.name || "Opportunity",
      category: this.mapServiceCategory(opportunity.kf_servicecategory), // Map option set value to label
      status: mapOpportunityStatus(
        opportunity.statuscode,
        opportunity.statecode
      ),
      submittedDate: opportunity.createdon || new Date().toISOString(),
      lastUpdated:
        opportunity.modifiedon ||
        opportunity.createdon ||
        new Date().toISOString(),
      sla: undefined,
      serviceProvider: opportunity.kf_serviceprovider || "KFS", // Use API field with fallback
      entityType: "opportunity", // Track that this is an opportunity
      description:
        opportunity.description ||
        `Estimated Value: ${
          opportunity.estimatedvalue
            ? `$${opportunity.estimatedvalue.toLocaleString()}`
            : "N/A"
        }`,
      requestedBy: {
        id:
          opportunity._customerid_value ||
          opportunity._ownerid_value ||
          opportunity._createdby_value ||
          "unknown",
        name: (() => {
          console.log(`🔍 Name resolution - contactInfo:`, contactInfo);

          // Use fetched contact info first
          if (contactInfo) {
            const firstName = contactInfo.firstname?.trim() || "";
            const lastName = contactInfo.lastname?.trim() || "";
            const fullName = contactInfo.fullname?.trim() || "";

            console.log(
              `✅ Using contact info - fullName: "${fullName}", firstName: "${firstName}", lastName: "${lastName}"`
            );

            if (fullName) {
              console.log(`✅ Returning fullname: "${fullName}"`);
              return fullName;
            }
            if (firstName && lastName) {
              console.log(
                `✅ Returning firstName + lastName: "${firstName} ${lastName}"`
              );
              return `${firstName} ${lastName}`;
            }
            if (firstName) return firstName;
            if (lastName) return lastName;
          } else {
            console.log(
              `⚠️ No contactInfo available, falling back to opportunity fields`
            );
          }

          // Try first and last name fields on opportunity
          const firstName = opportunity.kf_firstname?.trim() || "";
          const lastName = opportunity.kf_lastname?.trim() || "";

          if (firstName && lastName) return `${firstName} ${lastName}`;
          if (firstName) return firstName;
          if (lastName) return lastName;

          // Try to get name from OData formatted values
          const customerName =
            opportunity[
              "_customerid_value@OData.Community.Display.V1.FormattedValue"
            ];
          const ownerName =
            opportunity[
              "_ownerid_value@OData.Community.Display.V1.FormattedValue"
            ];
          const createdByName =
            opportunity[
              "_createdby_value@OData.Community.Display.V1.FormattedValue"
            ];

          console.log(
            `⚠️ Using OData formatted values - customerName: "${customerName}", ownerName: "${ownerName}"`
          );

          if (customerName) return customerName;
          if (ownerName) return ownerName;
          if (createdByName) return createdByName;
          return "Customer";
        })(),
        email:
          contactInfo?.emailaddress1 ||
          opportunity.kf_emailaddress ||
          opportunity.emailaddress ||
          "customer@example.com",
        company:
          opportunity[
            "_customerid_value@OData.Community.Display.V1.FormattedValue"
          ] ||
          opportunity[
            "_accountid_value@OData.Community.Display.V1.FormattedValue"
          ] ||
          "Unknown Company",
      },
      approvers: undefined,
    };
  }

  /**
   * Transform Case to ServiceRequest interface
   */
  private async transformCaseToServiceRequest(
    caseItem: CaseItem
  ): Promise<ServiceRequest> {
    // Fetch contact information if available
    // Cases use different fields than opportunities for contact lookup
    // Try: _primarycontactid_value (most common for cases), _parentcontactid_value, _contactid_value
    const contactId =
      (caseItem as any)._primarycontactid_value ||
      caseItem._parentcontactid_value ||
      caseItem._contactid_value;
    console.log(
      `🔍 Case contact ID (_primarycontactid_value):`,
      (caseItem as any)._primarycontactid_value
    );
    console.log(
      `🔍 Case contact ID (_parentcontactid_value):`,
      caseItem._parentcontactid_value
    );
    console.log(
      `🔍 Case contact ID (_contactid_value):`,
      caseItem._contactid_value
    );
    console.log(`🔍 Final contact ID used:`, contactId);
    console.log(
      `🔍 Customer/Account ID (_customerid_value):`,
      caseItem._customerid_value
    );

    let contactInfo: {
      firstname?: string;
      lastname?: string;
      fullname?: string;
      emailaddress1?: string;
    } | null = null;
    if (contactId) {
      contactInfo = await this.fetchContactInfo(contactId);
      console.log(`📋 Contact info for ${contactId}:`, contactInfo);
    }

    // Map Dynamics case status codes to our ServiceRequestStatus
    const mapCaseStatus = (
      statuscode?: number,
      statecode?: number
    ): ServiceRequestStatus => {
      // statecode: 0 = Active, 1 = Resolved, 2 = Canceled
      if (statecode === 1) return "approved"; // Resolved
      if (statecode === 2) return "rejected"; // Canceled

      // Active cases (statecode = 0)
      if (statuscode === 1) return "in-progress"; // In Progress
      if (statuscode === 2) return "submitted"; // On Hold
      if (statuscode === 3) return "submitted"; // Waiting for Details
      if (statuscode === 4) return "in-progress"; // Researching

      return "submitted"; // Default
    };

    // Map priority code
    const mapPriority = (prioritycode?: number): string => {
      switch (prioritycode) {
        case 1:
          return "High";
        case 2:
          return "Normal";
        case 3:
          return "Low";
        default:
          return "Normal";
      }
    };

    // Build requester name from available fields
    const buildRequesterName = (): string => {
      // Use fetched contact info first
      if (contactInfo) {
        const firstName = contactInfo.firstname?.trim() || "";
        const lastName = contactInfo.lastname?.trim() || "";
        const fullName = contactInfo.fullname?.trim() || "";

        if (fullName) return fullName;
        if (firstName && lastName) return `${firstName} ${lastName}`;
        if (firstName) return firstName;
        if (lastName) return lastName;
      }

      // Try first and last name fields on case
      const firstName = caseItem.kf_firstname?.trim() || "";
      const lastName = caseItem.kf_lastname?.trim() || "";

      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      } else if (firstName) {
        return firstName;
      } else if (lastName) {
        return lastName;
      }

      // Try to get name from OData formatted values, but filter out system names
      const customerName =
        caseItem["_customerid_value@OData.Community.Display.V1.FormattedValue"];
      const ownerName =
        caseItem["_ownerid_value@OData.Community.Display.V1.FormattedValue"];
      const createdByName =
        caseItem["_createdby_value@OData.Community.Display.V1.FormattedValue"];

      if (customerName) {
        return customerName;
      } else if (ownerName) {
        return ownerName;
      } else if (createdByName) {
        return createdByName;
      }

      return "Customer";
    };

    // Get email from available fields
    const getRequesterEmail = (): string => {
      return (
        contactInfo?.emailaddress1 ||
        caseItem.kf_emailaddress ||
        caseItem.emailaddress ||
        "customer@example.com"
      );
    };

    return {
      id: caseItem.incidentid || crypto.randomUUID(),
      serviceName: caseItem.title || `Case ${caseItem.ticketnumber || ""}`,
      category:
        this.mapServiceCategory(caseItem.kf_servicecategory) || "Non-Financial", // Map option set value to label
      status: mapCaseStatus(caseItem.statuscode, caseItem.statecode),
      submittedDate: caseItem.createdon || new Date().toISOString(),
      lastUpdated:
        caseItem.modifiedon || caseItem.createdon || new Date().toISOString(),
      sla: undefined,
      serviceProvider: caseItem.kf_serviceprovider || "KFS Support", // Use API field with fallback
      entityType: "case", // Track that this is a case
      description:
        caseItem.description ||
        `Priority: ${mapPriority(caseItem.prioritycode)}`,
      requestedBy: {
        id:
          caseItem._customerid_value ||
          caseItem._ownerid_value ||
          caseItem._createdby_value ||
          "unknown",
        name: buildRequesterName(),
        email: getRequesterEmail(),
        company:
          caseItem[
            "_customerid_value@OData.Community.Display.V1.FormattedValue"
          ] ||
          caseItem[
            "_accountid_value@OData.Community.Display.V1.FormattedValue"
          ] ||
          "Unknown Company",
      },
      approvers: undefined,
    };
  }

  /**
   * Transform API item to ServiceRequest interface (legacy method for backward compatibility)
   */
  private transformApiItemToServiceRequest(
    item: ApiServiceRequestItem,
    serviceName: string
  ): ServiceRequest {
    // Map API status to our ServiceRequestStatus
    const mapStatus = (apiStatus?: string): ServiceRequestStatus => {
      if (!apiStatus) return "submitted";

      switch (apiStatus.toLowerCase()) {
        case "draft":
        case "pending":
        case "submitted":
          return "submitted";
        case "under-review":
        case "processing":
        case "in-progress":
          return "in-progress";
        case "approved":
        case "completed":
        case "closed":
          return "approved";
        case "rejected":
        case "declined":
          return "rejected";
        default:
          return "submitted";
      }
    };

    // Map category from service name or API category
    const mapCategory = (
      apiCategory?: string,
      serviceName?: string
    ): string => {
      if (apiCategory) return apiCategory;

      // Infer category from service name
      const lowerServiceName = serviceName?.toLowerCase() || "";
      if (
        lowerServiceName.includes("loan") ||
        lowerServiceName.includes("funding")
      ) {
        return "financial";
      }
      return "non-financial";
    };

    return {
      id: item.kf_cancelloanformid || item.kf_formid || crypto.randomUUID(),
      serviceName: item.kf_servicename || serviceName,
      category: mapCategory(item.kf_category, serviceName),
      status: mapStatus(item.kf_status),
      submittedDate:
        item.createdon || item.modifiedon || new Date().toISOString(),
      sla: undefined, // Not provided in API response
      serviceProvider: item.kf_serviceproviders || "KFS",
      description: item.kf_cancellationdetails || undefined,
      requestedBy: {
        id: item.kf_azureid || item._createdby_value || "unknown",
        name: item.kf_submittedby || item.kf_name || "Unknown User",
        email: item.cr85d_emailaddress || "unknown@example.com",
        company: item.cr85d_companyname || "Unknown Company",
      },
      approvers: undefined, // Not provided in API response
    };
  }

  /**
   * Get service request by ID from the API
   */
  async getServiceRequestById(
    id: string,
    entityType: "opportunity" | "case"
  ): Promise<ServiceRequest | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/opportunity/service-request/${entityType}/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Service request not found: ${entityType} ${id}`);
          return null;
        }
        throw new Error(
          `Failed to fetch service request: ${response.status} ${response.statusText}`
        );
      }

      const apiData: any = await response.json();
      console.log(`📋 Fetched ${entityType} details:`, apiData);

      // Extract the actual data - it might be in data.data or just data
      const itemData = apiData.data?.data || apiData.data || apiData;

      // Transform based on entity type
      if (entityType === "opportunity") {
        return await this.transformOpportunityToServiceRequest(itemData);
      } else {
        return await this.transformCaseToServiceRequest(itemData);
      }
    } catch (error) {
      console.error(
        `❌ Error fetching service request ${entityType} ${id}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Update service request status (placeholder - would need specific API endpoint)
   */
  async updateServiceRequestStatus(
    requestId: string,
    newStatus: ServiceRequestStatus,
    context?: {
      approverId?: string;
      approverName?: string;
      comments?: string;
    }
  ): Promise<ServiceRequest> {
    // This would require a specific API endpoint for updates
    // For now, throw an error as this endpoint doesn't exist in the provided API
    throw new Error(
      "updateServiceRequestStatus not implemented for API service"
    );
  }

  /**
   * Create service request (placeholder - would need specific API endpoint)
   */
  async createServiceRequest(data: any): Promise<ServiceRequest> {
    // This would require a specific API endpoint for creation
    // For now, throw an error as this endpoint doesn't exist in the provided API
    throw new Error("createServiceRequest not implemented for API service");
  }

  /**
   * Soft delete service request by marking it as deleted
   */
  async deleteServiceRequest(
    requestId: string,
    entityType: "opportunity" | "case"
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `https://kfrealexpressserver.vercel.app/api/v1/opportunity/mark-deleted/${entityType}/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete service request: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.success || true;
    } catch (error) {
      console.error("Failed to delete service request:", error);
      throw error;
    }
  }
}

// Create singleton instance
export const apiServiceRequestService = new ApiServiceRequestService();

// Export convenience function
export const getServiceRequestsFromApi = (azureId: string) =>
  apiServiceRequestService.getServiceRequestsForUser(azureId);
