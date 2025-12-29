/**
 * Defines the possible data types for a field in the profile.
 */
export type FieldType =
    | "Text"
    | "select"
    | "multiselect"
    | "Whole Number"
    | "Decimal"
    | "Decimal (0–100)"
    | "URL"
    | "Date"
    | "Date Only"
    | "DateTime"
    | "Multiline Text"
    | "File Upload"
    | "Table"; // Based on your 'productPerformanceKpis' field

/**
 * Defines the structure for options in 'select' and 'multiselect' fields.
 */
export interface FieldOption {
    label: string;
    value: string;
}

/**
 * Defines the configuration for an individual data entry field.
 */
export interface FieldConfig {
    id: string; // Used for unique identification, usually same as fieldName or group-specific key
    label: string;
    fieldName: string; // The key used to store/retrieve the data (crucial for your calculation fix)
    fieldType: FieldType;
    /**
     * Defines mandatory stages:
     * - `string[]`: An array of company stage IDs (e.g., ["growth", "mature"])
     * - `true`: Mandatory for all stages.
     */
    mandatory: string[] | boolean;
    options?: FieldOption[];
    placeholder?: string;
    readOnly?: boolean;
}

/**
 * Defines a group of related fields within a section/tab.
 */
export interface GroupConfig {
    groupName: string;
    fields: FieldConfig[];
}

/**
 * Defines the configuration for a single section or tab in the profile.
 */
export interface SectionConfig {
    id: string;
    title: string;
    groups: GroupConfig[];
}

/**
 * Defines the structure for a company stage used in mandatory checks.
 */
export interface CompanyStageConfig {
    id: string;
    label: string;
    color: string;
}

/**
 * The root interface for the entire profile configuration (matching the structure of profileConfig).
 */
export interface ProfileConfig {
    companyStages: CompanyStageConfig[];
    tabs: SectionConfig[];
}

export const API_FIELD_MAPPING: Record<string, string> = {
    //
    // === General Profile/Contact Fields ===
    //
    founderName: "fullname",            // From Org Info (API 2): "Enterprise2 Viewer"
    contactEmail: "useremail",          // From Org Info (API 2): "enterprise2.viewer@..." (Primary Login)
    contactId: "contactId",             // From Org Info (API 2): "415c66d1-..."
    accountId: "accountId",             // From Org Info (API 2): "0d4cd8bd-..."
    mobilePhone: "mobilephone",         // From Org Info (API 2): "4025577032" (Primary Phone)
    secondaryEmail: "kf_emailaddress",  // From Onboarding (API 1): "john.smith@..." (Secondary Email)
    secondaryPhone: "kf_phone",         // From Onboarding (API 1): "+971501234567" (Secondary Phone)
    registrationAuthority: "kf_registrationnumber", // From Onboarding (API 1): "TRN-123456789"


    tradeName: "kf_tradename",
    registrationNumber: "kf_registrationnumber",
    establishmentDate: "kf_yearofestablishment",
    entityType: "kf_entitytype",
    legalStatus: "statuscode",
    businessType: "businesstypecode",
    industry: "industry",
    businessSize: "kf_businesssize",
    annualRevenue: "revenue",
    numberOfEmployees: "numberofemployees",
    businessDescription: "kf_businessdescription",
    primaryIsicCode: "sic",
    primaryIsicDescription: "",
    secondaryIsicCode: "",
    businessCategory: "kf_cf_customertype",
    marketSegment: "accountcategorycode",
    businessLifecycleStage: "kf_cf_businesslifecyclestage",
    fiveYearVision: "kf_cf_visionstrategy_businesstype",
    investmentGoals: "",
    technologyRoadmap: "",
    strategicChallenges: "",



    //
    //Products and Innovation
    //
    productName: "kf_cf_productinnovation_productname",
    productCategory: "kf_cf_productinnovation_productcategory",
    productDescription: "kf_cf_productinnovation_productdescription",
    launchDate: "kf_cf_productinnovation_launchdate",
    productLifecycleStage: "kf_cf_productinnovation_lifecyclestage",
    productPortfolioAge: "kf_cf_productinnovation_portfolioage",
    serviceType: "kf_cf_productinnovation_servicetype",
    serviceDescription: "kf_cf_productinnovation_servicedescription",
    serviceLevelAgreement: "kf_cf_productinnovation_sla",
    rdInvestment: "kf_cf_productinnovation_rdinvestment",
    releaseFrequency: "kf_cf_productinnovation_releasefrequency",
    currentDevelopmentFocus: "kf_cf_productinnovation_currentdevelopment",
    productRoadmap: "kf_cf_productinnovation_productroadmap",
    innovationProcess: "kf_cf_productinnovation_innovationprocess",
    targetSegments: "kf_cf_productinnovation_targetsegments",
    customerBaseSize: "kf_cf_productinnovation_customerbasesize",
    geographicReach: "kf_cf_productinnovation_geographicreach",
    marketShare: "kf_cf_productinnovation_marketshare",
    competitivePosition: "kf_cf_productinnovation_competitiveposition",
    goToMarketStrategy: "kf_cf_productinnovation_gotomarket",
    productTeamSize: "kf_cf_productinnovation_teamsize",
    customerFeedbackMechanism: "kf_cf_productinnovation_feedbackmechanism",
    pricingStrategy: "kf_cf_productinnovation_pricingstrategy",
    innovationMaturityScore: "kf_cf_productinnovation_maturityscore",

    //
    // === Business Overview (New/Expanded Section) ===
    //
    problemStatement: "kf_problemstatement",         // Has value
    businessRequirements: "kf_businessrequirements", // Has value
    businessNeeds: "kf_businessneeds",               // Has value
    founderDetails: "kf_founders",                   // Has value: "John Smith, Jane Doe"

    //
    // === Financial & Legal ===
    //
    initialCapital: "kf_initialcapitalusd",     // Has value: 50000
    fundingNeeds: "kf_fundingneedsusd",         // Has value: 250000

    // Fields below are null in the current sample but kept for future data:
    annualRevenueBase: "revenue_base",
    legalStructure: "kf_legalstructure",
    authorizedSigner: "kf_authorizedsigner",

    //
    //===Sales and Marketing ===
    //
    officialWebsite: "websiteurl",
    brandScore: "kf_cf_salesmarketing_brandscore",
    marketingBudget: "kf_cf_salesmarketing_marketingbudget",
    churnRate: "kf_cf_salesmarketing_churnrate",
    customerAcquisitionCost: "kf_cf_salesmarketing_cac",
    avgDealSize: "kf_cf_salesmarketing_averagedealsize",
    salesCycleDays: "kf_cf_salesmarketing_salescycledays",
    brandStatement: "kf_cf_salesmarketing_brandstatement",
    lastProfileUpdate: "kf_lastmodifiedon",
    activeCampaigns: "kf_cf_salesmarketing_activecampaigns",
    brandPositioningStatement: "kf_cf_salesmarketing_brandstatement",
    salesModel:	"kf_cf_salesmarketing_salesmodel",
    primarySalesChannel: "kf_cf_salesmarketing_primarysaleschannel",
    annualSalesRevenue:	"revenue",
    top3Clients: "kf_cf_salesmarketing_topclients",
    primaryMarketingChannels: "kf_cf_salesmarketing_primarychannels",
    leadConversionRatePercent: "kf_cf_salesmarketing_leadconversionrate",
    targetCustomerProfile: "kf_cf_salesmarketing_targetcustomerprofile",
    customerRetentionRatePercent: "kf_cf_salesmarketing_retentionrate",
    socialMediaHandles:	"kf_cf_salesmarketing_socialmediahandles",
    onlineAdvertisingPlatforms:	"kf_cf_salesmarketing_adplatforms",
    partnershipType: "kf_cf_salesmarketing_partnertype",
    partnershipStrength: "kf_cf_salesmarketing_partnerstrength",
    salesPerformanceIndex: "kf_cf_salesmarketing_performanceindex",
    marketingROI: "kf_cf_salesmarketing_marketingroi",

    //
    // === Operations & IT ===
    //
    // Fields below are null in the current sample but kept for future data:
    warehouseCapacity: "kf_warehousecapacity",
    coresystems: "kf_coresystems",
    erpsystem: "kf_erpsystem",
    cloudProvider: "kf_cloudprovider",
    itMaturity: "kf_itmaturity",
    itSupport: "kf_itsupport",

    //
    // === HR & Governance ===
    //
    department: "department", // From Org Info (API 2): Null in sample but standard field

    // Fields below are null in the current sample but kept for future data:
    hrDepartmentExists: "kf_hrdepartmentexists",
    codeOfConduct: "kf_codeofconduct",
    governanceMaturityScore: "kf_governancematurityscore",

    //
    // === System/Metadata Fields (if needed for display) ===
    //
    modifiedOn: "modifiedon", // Has value: "2025-11-10T13:02:34Z"
    profileId: "kf_firmonboardingid", // Has value: "a09510ac-..."
    statusCode: "statuscode", // Has value: 1
    versionNumber: "versionnumber", // Has value: 30997910
    onboardingStatus: "kf_kf_onboardingstate", // Has value: "yes"
};


// JSON configuration for the Business Profile layout
export const profileConfig = {
    // Company stages with corresponding labels and colors
    companyStages: [
        { id: "startup", label: "Startup", color: "bg-purple-500" },
        { id: "growth", label: "Growth", color: "bg-blue-500" },
        { id: "mature", label: "Mature", color: "bg-green-500" },
        { id: "enterprise", label: "Enterprise", color: "bg-gray-700" },
    ],
    // All 8 sections (tabs) for the profile
    tabs: [
        {
            id: "basic",
            title: "Vision & Strategy",
            groups: [
                {
                    groupName: "Company Identification",
                    fields: [
                        {
                            id: "tradeName",
                            label: "Trade Name (company name)",
                            fieldName: "tradeName",
                            fieldType: "Text",
                            mandatory: ["startup", "growth", "mature", "enterprise"],
                            placeholder: "Blue Horizon Technologies LLC",
                        },
                        {
                            id: "registrationNumber",
                            label: "Registration Number",
                            fieldName: "registrationNumber",
                            fieldType: "Text",
                            mandatory: ["startup", "growth", "mature", "enterprise"],
                            placeholder: "CN-102345-A",
                        },
                        {
                            id: "establishmentDate",
                            label: "Establishment Date",
                            fieldName: "establishmentDate",
                            fieldType: "Date Only",
                            mandatory: false,
                            placeholder: "2018-06-15",
                        },
                        {
                            id: "entityType",
                            label: "Entity Type",
                            fieldName: "entityType",
                            fieldType: "select",
                            mandatory: false,
                            options: [
                                { label: "Sole Proprietorship", value: "Sole Proprietorship" },
                                { label: "LLC", value: "LLC" },
                                { label: "Partnership", value: "Partnership" },
                                { label: "Public Joint Stock", value: "Public Joint Stock" },
                                { label: "Free Zone Entity", value: "Free Zone Entity" },
                                { label: "Non-Profit", value: "Non-Profit" },
                            ],
                            placeholder:
                                "LLC / Partnership / Public Joint Stock / Free Zone Entity / Non-Profit",
                        },
                        {
                            id: "registrationAuthority",
                            label: "Registration Authority",
                            fieldName: "registrationAuthority",
                            fieldType: "Text",
                            mandatory: false,
                            placeholder: "Abu Dhabi DED / Dubai DED / ADGM / RAK Free Zone / Other",
                        },
                        {
                            id: "legalStatus",
                            label: "Legal Status",
                            fieldName: "legalStatus",
                            fieldType: "select",
                            mandatory: false,
                            options: [
                                { label: "Active", value: "Active" },
                                { label: "Dormant", value: "Dormant" },
                                { label: "Suspended", value: "Suspended" },
                                { label: "Deregistered", value: "Deregistered" },
                                { label: "Other", value: "Other" },
                            ],
                            placeholder: "Active / Dormant / Under Liquidation / Suspended",
                        },
                    ],
                },
                {
                    groupName: "Business Details",
                    fields: [
                        {
                            id: "businessType",
                            label: "Business Type",
                            fieldName: "businessType",
                            fieldType: "select",
                            mandatory: false,
                            options: [
                                { label: "Product Manufacturer", value: "Product Manufacturer" },
                                { label: "Service Provider", value: "Service Provider" },
                                { label: "Distributor", value: "Distributor" },
                                { label: "Retail", value: "Retail" },
                                { label: "Consultancy", value: "Consultancy" },
                                { label: "Tech Startup", value: "Tech Startup" },
                            ],
                            placeholder:
                                "Values: Product Manufacturer / Service Provider / Distributor / Retail / Consultancy / Tech Startup",
                        },
                        {
                            id: "industry",
                            label: "Industry",
                            fieldName: "industry",
                            fieldType: "Text",
                            mandatory: false,
                            placeholder:
                                "Values: Technology / Healthcare / Education / Construction / Manufacturing / Hospitality",
                        },
                        {
                            id: "businessSize",
                            label: "Business Size",
                            fieldName: "businessSize",
                            fieldType: "select",
                            mandatory: false,
                            options: [
                                { label: "Micro (1-10)", value: "Micro (1-10)" },
                                { label: "Small (11-50)", value: "Small (11-50)" },
                                { label: "Medium (51-250)", value: "Medium (51-250)" },
                                { label: "Large (250+)", value: "Large (250+)" },
                            ],
                            placeholder:
                                "Values: Micro (1-10) / Small (11-50) / Medium (51-250) / Large (>250)",
                        },
                        {
                            id: "annualRevenue",
                            label: "Annual Revenue",
                            fieldName: "annualRevenue",
                            fieldType: "Currency",
                            mandatory: ["growth", "mature", "enterprise"],
                            placeholder: "AED 4,500,000",
                        },
                        {
                            id: "numberOfEmployees",
                            label: "Number of Employees",
                            fieldName: "numberOfEmployees",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "mature", "enterprise"],
                            placeholder: "42",
                        },
                        {
                            id: "businessDescription",
                            label: "Business Description",
                            fieldName: "businessDescription",
                            fieldType: "Multiline Text",
                            mandatory: false,
                            placeholder: "Provider of AI-driven logistics optimization solutions.",
                        },
                    ],
                },
                {
                    groupName: "Classification",
                    fields: [
                        {
                            id: "primaryIsicCode",
                            label: "Primary ISIC Code",
                            fieldName: "primaryIsicCode",
                            fieldType: "Text",
                            mandatory: false,
                            placeholder: "6201",
                        },
                        {
                            id: "primaryIsicDescription",
                            label: "Primary ISIC Description",
                            fieldName: "primaryIsicDescription",
                            fieldType: "Text",
                            mandatory: false,
                            placeholder: "Computer programming activities.",
                        },
                        {
                            id: "secondaryIsicCode",
                            label: "Secondary ISIC Code",
                            fieldName: "secondaryIsicCode",
                            fieldType: "Text",
                            mandatory: false,
                            placeholder: "6209",
                        },
                        {
                            id: "businessCategory",
                            label: "Business Category",
                            fieldName: "businessCategory",
                            fieldType: "select",
                            mandatory: false,
                            options: [
                                { label: "B2B", value: "B2B" },
                                { label: "B2C", value: "B2C" },
                                { label: "B2G", value: "B2G" },
                                { label: "Hybrid", value: "Hybrid" },
                            ],
                            placeholder: "Values: B2B / B2C / B2G / Hybrid",
                        },
                        {
                            id: "marketSegment",
                            label: "Market Segment",
                            fieldName: "marketSegment",
                            fieldType: "select",
                            mandatory: false,
                            options: [
                                { label: "SME", value: "SME" },
                                { label: "Enterprise", value: "Enterprise" },
                                { label: "Public Sector", value: "Public Sector" },
                                { label: "Export Market", value: "Export Market" },
                            ],
                            placeholder: "Values: SME / Enterprise / Public Sector / Export Market",
                        },
                        {
                            id: "businessLifecycleStage",
                            label: "Business Lifecycle Stage",
                            fieldName: "businessLifecycleStage",
                            fieldType: "select",
                            mandatory: ["startup", "growth", "mature", "enterprise"],
                            options: [
                                { label: "Ideation", value: "Ideation" },
                                { label: "Launch", value: "Launch" },
                                { label: "Growth", value: "Growth" },
                                { label: "Expansion", value: "Expansion" },
                                { label: "Maturity", value: "Maturity" },
                            ],
                            placeholder:
                                "Values: Ideation, Launch, Growth, Expansion, Optimisation, Transformation",
                        },
                    ],
                },
                {
                    groupName: "Needs & Aspirations",
                    fields: [
                        {
                            id: "fiveYearVision",
                            label: "5-Year Vision",
                            fieldName: "fiveYearVision",
                            fieldType: "Multiline Text",
                            mandatory: false,
                            placeholder: "Expand into three new markets and launch two AI products.",
                        },
                        {
                            id: "investmentGoals",
                            label: "Investment Goals",
                            fieldName: "investmentGoals",
                            fieldType: "Multiline Text",
                            mandatory: false,
                            placeholder: "Secure AED 5 million in Series A funding for scale-up.",
                        },
                        {
                            id: "technologyRoadmap",
                            label: "Technology Roadmap",
                            fieldName: "technologyRoadmap",
                            fieldType: "Multiline Text",
                            mandatory: false,
                            placeholder:
                                "Adopt cloud-native architecture and ML integration by 2026.",
                        },
                        {
                            id: "strategicChallenges",
                            label: "Strategic Challenges",
                            fieldName: "strategicChallenges",
                            fieldType: "Multiline Text",
                            mandatory: false,
                            placeholder: "Limited access to skilled data engineers.",
                        },
                    ],
                },
            ],
        },
        {
            id: "products",
            title: "Products",
            groups: [
                {
                    groupName: "Core Products",
                    fields: [
                        {
                            id: "productName",
                            label: "Product Name",
                            fieldName: "productName",
                            fieldType: "Text", // Text
                            mandatory: ["startup", "growth", "mature", "enterprise"],
                            placeholder: "CRM Software / AI Logistics Platform",
                        },
                        {
                            id: "productCategory",
                            label: "Product Category",
                            fieldName: "productCategory",
                            fieldType: "select",
                            mandatory: ["growth", "mature", "enterprise"],
                            options: [
                                { label: "SaaS", value: "SaaS" },
                                { label: "Hardware", value: "Hardware" },
                                { label: "Mobile App", value: "Mobile App" },
                                { label: "Platform", value: "Platform" },
                                { label: "Marketplace", value: "Marketplace" },
                                { label: "Service", value: "Service" },
                            ],
                            placeholder: "SaaS / Hardware / Mobile App / Platform / Marketplace / Service", // ✅ UPDATED
                        },
                        {
                            id: "productDescription",
                            label: "Product Description",
                            fieldName: "productDescription",
                            fieldType: "Multiline Text", // Multi-line Text
                            mandatory: ["growth", "mature", "enterprise"],
                            placeholder: "Brief technical and commercial summary of the product.",
                        },
                        {
                            id: "launchDate",
                            label: "Launch Date",
                            fieldName: "launchDate",
                            fieldType: "Date Only", // Date Only
                            mandatory: ["growth", "mature", "enterprise"],
                            placeholder: "YYYY-MM-DD",
                        },
                        {
                            id: "productLifecycleStage",
                            label: "Product Lifecycle Stage",
                            fieldName: "productLifecycleStage",
                            fieldType: "select",
                            mandatory: ["growth", "mature", "enterprise"],
                            options: [
                                { label: "Concept", value: "Concept" },
                                { label: "Prototype", value: "Prototype" },
                                { label: "Beta", value: "Beta" },
                                { label: "Live", value: "Live" },
                                { label: "Mature", value: "Mature" },
                                { label: "Sunset", value: "Sunset" },
                            ],
                            placeholder: "Growth / Maturity / Decline",
                        },
                        {
                            id: "productPortfolioAge",
                            label: "Product Portfolio Age",
                            fieldName: "productPortfolioAge",
                            fieldType: "Whole Number", // Whole Number
                            mandatory: ["growth", "mature", "enterprise"],
                            placeholder: "e.g., 5 (years)",
                        },
                    ],
                },
                {
                    groupName: "Services Offered",
                    fields: [
                        {
                            id: "serviceType",
                            label: "Service Type",
                            fieldName: "serviceType",
                            fieldType: "multiselect",
                            mandatory: ["startup", "growth", "mature", "enterprise"],
                            options: [
                                { label: "Implementation", value: "Implementation" },
                                { label: "Managed Services", value: "Managed Services" },
                                { label: "Training", value: "Training" },
                                { label: "Consulting", value: "Consulting" },
                                { label: "Support", value: "Support" },
                            ],
                            placeholder: "Implementation / Managed Services / Training / Consulting / Support",
                        },
                        {
                            id: "serviceDescription",
                            label: "Service Description",
                            fieldName: "serviceDescription",
                            fieldType: "Multiline Text",
                            mandatory: ["growth", "mature", "enterprise"],
                            placeholder: "Detailed outline of the services provided.",
                        },
                        {
                            id: "serviceLevelAgreement",
                            label: "Service Level Agreement (SLA)",
                            fieldName: "serviceLevelAgreement",
                            fieldType: "File Upload",
                            mandatory: ["growth", "mature", "enterprise"],
                            placeholder: "Upload the standard SLA document.",
                        },
                    ],
                },
                {
                    groupName: "Product Development",
                    fields: [
                        {
                            id: "r&dInvestment",
                            label: "R&D Investment (Annual %)",
                            fieldName: "rdInvestment",
                            fieldType: "Decimal (0–100)",
                            // Priority: Medium. Stages: Growth → Expansion (means mandatory from Growth stage onwards)
                            mandatory: ["growth", "mature", "enterprise"],
                            placeholder: "e.g., 8.5",
                        },
                        {
                            id: "developmentMethodology",
                            label: "Development Methodology",
                            fieldName: "developmentMethodology",
                            fieldType: "select",
                            // Priority: Medium. Stages: Growth (means mandatory from Growth stage onwards)
                            mandatory: ["growth", "mature", "enterprise"],
                            options: [
                                { label: "Agile", value: "Agile" },
                                { label: "Waterfall", value: "Waterfall" },
                                { label: "Hybrid", value: "Hybrid" },
                                { label: "Design Thinking", value: "Design Thinking" },
                            ],
                            placeholder: "Agile / Waterfall / Hybrid / Design Thinking",
                        },
                        {
                            id: "releaseFrequency",
                            label: "Release Frequency",
                            fieldName: "releaseFrequency",
                            fieldType: "select",
                            // Priority: Medium. Stages: Growth → Optimisation (means mandatory from Growth stage onwards)
                            mandatory: ["growth", "mature", "enterprise"],
                            options: [
                                { label: "Monthly", value: "Monthly" },
                                { label: "Quarterly", value: "Quarterly" },
                                { label: "Bi-Annual", value: "Bi-Annual" },
                                { label: "Annual", value: "Annual" },
                                { label: "On Demand", value: "On Demand" },
                            ],
                            placeholder: "Monthly / Quarterly / Bi-Annual / Annual / On Demand",
                        },
                        {
                            id: "currentDevelopmentFocus",
                            label: "Current Development Focus",
                            fieldName: "currentDevelopmentFocus",
                            fieldType: "Multiline Text",
                            // Priority: Medium. Stages: Expansion → Transformation (mandatory for Expansion and Transformation)
                            mandatory: ["expansion", "transformation"],
                            placeholder: "Integrating predictive analytics for inventory optimisation.",
                        },
                        {
                            id: "productRoadmap",
                            label: "Product Roadmap",
                            fieldName: "productRoadmap",
                            fieldType: "File Upload", // ✅ UPDATED to File Upload (to cover link/upload requirement)
                            // Priority: Medium. Stages: Expansion → Transformation (mandatory for Expansion and Transformation)
                            mandatory: ["expansion", "transformation"],
                            placeholder: "Upload the document or provide a link (e.g., https://company.com/roadmap-2025.pdf)",
                        },
                        {
                            id: "innovationProcess",
                            label: "Innovation Process",
                            fieldName: "innovationProcess",
                            fieldType: "Multiline Text", // ✅ UPDATED to Multiline Text (based on example text)
                            // Priority: Medium. Stages: Optimisation → Transformation (mandatory for Optimisation and Transformation)
                            mandatory: ["optimisation", "transformation"],
                            placeholder: "All ideas pass through internal hackathons, prototype validation, and client pilot testing.",
                        },
                    ],
                },
                {
                    groupName: "Market Information",
                    fields: [
                        {
                            id: "targetSegments",
                            label: "Target Segments",
                            fieldName: "targetSegments",
                            fieldType: "multiselect", // Choice (Multi-select)
                            // Mandatory Stages: Launch → Growth
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "Retail", value: "Retail" },
                                { label: "Manufacturing", value: "Manufacturing" },
                                { label: "Logistics", value: "Logistics" },
                                { label: "Education", value: "Education" },
                                { label: "Government", value: "Government" },
                            ],
                            placeholder: "Retail / Manufacturing / Logistics / Education / Government",
                        },
                        {
                            id: "customerBaseSize",
                            label: "Customer Base Size",
                            fieldName: "customerBaseSize",
                            fieldType: "Whole Number",
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            placeholder: "e.g., 250",
                        },
                        {
                            id: "geographicReach",
                            label: "Geographic Reach",
                            fieldName: "geographicReach",
                            fieldType: "multiselect", // Choice (Multi-select)
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "Local", value: "Local" },
                                { label: "GCC", value: "GCC" },
                                { label: "MENA", value: "MENA" },
                                { label: "International", value: "International" },
                            ],
                            placeholder: "Local / GCC / MENA / International",
                        },
                        {
                            id: "marketShare",
                            label: "Market Share (%)",
                            fieldName: "marketShare",
                            fieldType: "Decimal (0–100)",
                            // Mandatory Stages: Optimisation (and subsequent Transformation)
                            mandatory: ["optimisation", "transformation"],
                            placeholder: "e.g., 3.2",
                        },
                        {
                            id: "competitivePosition",
                            label: "Competitive Position",
                            fieldName: "competitivePosition",
                            fieldType: "select",
                            // Mandatory Stages: Growth → Optimisation
                            mandatory: ["growth", "expansion", "optimisation"],
                            options: [
                                { label: "Emerging", value: "Emerging" },
                                { label: "Established", value: "Established" },
                                { label: "Market Leader", value: "Market Leader" },
                            ],
                            placeholder: "Emerging / Established / Market Leader",
                        },
                        {
                            id: "goToMarketStrategy",
                            label: "Go-to-Market Strategy",
                            fieldName: "marketStrategy",
                            fieldType: "Multiline Text",
                            // Mandatory Stages: Expansion → Transformation
                            mandatory: ["expansion", "optimisation", "transformation"],
                            placeholder: "Partner with logistics associations to penetrate retail SME sector.",
                        },
                    ],
                },
                {
                    groupName: "Product Management & Feedback",
                    fields: [
                        {
                            id: "productManager",
                            label: "Product Manager",
                            fieldName: "productManager",
                            fieldType: "Text",
                            // Mandatory Stages: Growth → Optimisation
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "John Mathews",
                        },
                        {
                            id: "productTeamSize",
                            label: "Product Team Size",
                            fieldName: "productTeamSize",
                            fieldType: "Whole Number", // Whole Number
                            // Mandatory Stages: Growth → Optimisation
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "6",
                        },
                        {
                            id: "customerFeedbackMechanism",
                            label: "Customer Feedback Mechanism",
                            fieldName: "customerFeedbackMechanism",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Optimisation → Transformation
                            mandatory: ["optimisation", "transformation"],
                            options: [
                                { label: "In-App Surveys", value: "In-App Surveys" },
                                { label: "Focus Groups", value: "Focus Groups" },
                                { label: "Client Portal", value: "Client Portal" },
                                { label: "Email", value: "Email" },
                            ],
                            placeholder: "In-App Surveys / Focus Groups / Client Portal / Email",
                        },
                        {
                            id: "pricingStrategy",
                            label: "Pricing Strategy",
                            fieldName: "pricingStrategy",
                            fieldType: "Multiline Text", // Multiline Text
                            // Mandatory Stages: Growth → Optimisation
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "Subscription-based with tiered enterprise pricing.",
                        },
                    ],
                },
                {
                    groupName: "Internal Metrics / Derived Indicators",
                    fields: [
                        {
                            id: "innovationMaturityScore",
                            label: "Innovation Maturity Score (0–100)",
                            fieldName: "innovationMaturityScore",
                            fieldType: "Decimal (0–100)", // Decimal (0–100)
                            // Low priority, but mandatory for "All" stages
                            // Set to true, which is shorthand for ["startup", "growth", "mature", "enterprise", ...]
                            mandatory: true,
                            placeholder: "82",
                        },
                        {
                            id: "lastProfileUpdate",
                            label: "Last Profile Update",
                            fieldName: "lastProfileUpdate",
                            fieldType: "DateTime",
                            mandatory: true,
                            placeholder: "2025-10-15 08:42 UTC",
                        },
                    ],
                },
            ],
        },
        {
            id: "Sales",
            title: "Sales & Marketing",
            groups: [
                {
                    groupName: "Sales Overview",
                    fields: [
                        {
                            id: "salesModel",
                            label: "Sales Model",
                            fieldName: "salesModel",
                            fieldType: "select",
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "Direct", value: "Direct" },
                                { label: "Indirect", value: "Indirect" },
                                { label: "Online", value: "Online" },
                                { label: "Hybrid", value: "Hybrid" },
                            ],
                            placeholder: "Direct / Indirect / Online / Hybrid",
                        },
                        {
                            id: "primarySalesChannel",
                            label: "Primary Sales Channel",
                            fieldName: "primarySalesChannel",
                            fieldType: "select",
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "E-commerce", value: "E-commerce" },
                                { label: "Retail", value: "Retail" },
                                { label: "Distributor", value: "Distributor" },
                                { label: "Reseller", value: "Reseller" },
                                { label: "Partnership", value: "Partnership" },
                            ],
                            placeholder: "E-commerce / Retail / Distributor / Reseller / Partnership",
                        },
                        {
                            id: "averageDealSize",
                            label: "Average Deal Size",
                            fieldName: "averageDealSize",
                            fieldType: "Decimal",
                            mandatory: ["growth", "expansion"],
                            placeholder: "AED 120,000",
                        },
                        {
                            id: "salesCycleDurationDays",
                            label: "Sales Cycle Duration (Days)",
                            fieldName: "salesCycleDuration",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "expansion"],
                            placeholder: "45",
                        },
                        {
                            id: "annualSalesRevenue",
                            label: "Annual Sales Revenue",
                            fieldName: "annualSalesRevenue",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "AED 4,500,000",
                        },
                        {
                            id: "top3Clients",
                            label: "Top 3 Clients",
                            fieldName: "top3Clients",
                            fieldType: "Multiline Text",
                            mandatory: ["expansion", "optimisation"],
                            placeholder: "Etisalat, AD Ports Group, FAB",
                        },
                    ],
                },
                {
                    groupName: "Marketing Channels & Campaigns",
                    fields: [
                        {
                            id: "primaryMarketingChannels",
                            label: "Primary Marketing Channels",
                            fieldName: "primaryMarketingChannels",
                            fieldType: "multiselect",
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "Social Media", value: "Social Media" },
                                { label: "Email", value: "Email" },
                                { label: "Events", value: "Events" },
                                { label: "Digital Ads", value: "Digital Ads" },
                                { label: "Partnerships", value: "Partnerships" },
                            ],
                            placeholder: "Social Media / Email / Events / Digital Ads / Partnerships",
                        },
                        {
                            id: "marketingBudgetPercent",
                            label: "Marketing Budget (% of Revenue)",
                            fieldName: "marketingBudget",
                            fieldType: "Decimal (0–100)",
                            mandatory: ["growth", "expansion"],
                            placeholder: "7.5",
                        },
                        {
                            id: "activeCampaigns",
                            label: "Active Campaigns",
                            fieldName: "activeCampaigns",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "expansion"],
                            placeholder: "3",
                        },
                        {
                            id: "leadConversionRatePercent",
                            label: "Lead Conversion Rate (%)",
                            fieldName: "leadConversionRate",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "18.2",
                        },
                        {
                            id: "customerAcquisitionCost",
                            label: "Customer Acquisition Cost (CAC)",
                            fieldName: "customerAcquisitionCost",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "AED 420",
                        },
                    ],
                },
                {
                    groupName: "Customer Segmentation & Engagement",
                    fields: [
                        {
                            id: "targetCustomerProfile",
                            label: "Target Customer Profile",
                            fieldName: "targetCustomerProfile",
                            fieldType: "select",
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "Individuals", value: "Individuals" },
                                { label: "SMEs", value: "SMEs" },
                                { label: "Large Enterprises", value: "Large Enterprises" },
                                { label: "Government", value: "Government" },
                            ],
                            placeholder: "Individuals / SMEs / Large Enterprises / Government",
                        },
                        {
                            id: "customerRetentionRatePercent",
                            label: "Customer Retention Rate (%)",
                            fieldName: "customerRetentionRate",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "86.5",
                        },
                        {
                            id: "churnRatePercent",
                            label: "Churn Rate (%)",
                            fieldName: "churnRate",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "13.5",
                        },
                    ],
                },
                {
                    groupName: "Digital Presence & Branding",
                    fields: [
                        {
                            id: "officialWebsite",
                            label: "Official Website",
                            fieldName: "officialWebsite",
                            fieldType: "URL",
                            mandatory: false,
                            placeholder: "https://www.bluesupply.ae",
                        },
                        {
                            id: "socialMediaHandles",
                            label: "Social Media Handles",
                            fieldName: "socialMediaHandles",
                            fieldType: "Multiline Text",
                            mandatory: ["launch", "growth"],
                            placeholder: "LinkedIn: @bluesupply | Twitter: @BS_Tech",
                        },
                        {
                            id: "onlineAdvertisingPlatforms",
                            label: "Online Advertising Platforms",
                            fieldName: "onlineAdvertisingPlatforms",
                            fieldType: "multiselect",
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "Google", value: "Google" },
                                { label: "Meta", value: "Meta" },
                                { label: "LinkedIn", value: "LinkedIn" },
                                { label: "YouTube", value: "YouTube" },
                                { label: "TikTok", value: "TikTok" },
                            ],
                            placeholder: "Google / Meta / LinkedIn / YouTube / TikTok",
                        },
                        {
                            id: "brandPositioningStatement",
                            label: "Brand Positioning Statement",
                            fieldName: "brandPositioningStatement",
                            fieldType: "Multiline Text",
                            mandatory: ["growth", "expansion", "optimisation", "transformation"],
                            placeholder: "We help SMEs digitalize logistics through intuitive AI tools.",
                        },
                        {
                            id: "brandAwarenessScore",
                            label: "Brand Awareness Score (0–100)",
                            fieldName: "brandAwarenessScore",
                            fieldType: "Decimal (0–100)",
                            mandatory: false,
                            placeholder: "72",
                        },
                    ],
                },
                {
                    groupName: "Partnerships & Channels",
                    fields: [
                        {
                            id: "partnershipType",
                            label: "Partnership Type",
                            fieldName: "partnerType",
                            fieldType: "select",
                            mandatory: ["expansion", "optimisation"],
                            options: [
                                { label: "Referral", value: "Referral" },
                                { label: "Reseller", value: "Reseller" },
                                { label: "Strategic Alliance", value: "Strategic Alliance" },
                                { label: "Technology Partner", value: "Technology Partner" },
                            ],
                            placeholder: "Referral / Reseller / Strategic Alliance / Technology Partner",
                        },
                        {
                            id: "partnershipStrength",
                            label: "Partnership Strength",
                            fieldName: "partnershipStrength",
                            fieldType: "select",
                            mandatory: ["optimisation"],
                            options: [
                                { label: "Emerging", value: "Emerging" },
                                { label: "Active", value: "Active" },
                                { label: "Strategic", value: "Strategic" },
                                { label: "Premier", value: "Premier" },
                            ],
                            placeholder: "Emerging / Active / Strategic / Premier",
                        },
                    ],
                },
                {
                    groupName: "Performance Metrics",
                    fields: [
                        {
                            id: "salesPerformanceIndex",
                            label: "Sales Performance Index",
                            fieldName: "salesPerformanceIndex",
                            fieldType: "Decimal (0–100)",
                            mandatory: false,
                            placeholder: "88",
                        },
                        {
                            id: "marketingROI",
                            label: "Marketing ROI (%)",
                            fieldName: "marketingROI",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "165",
                        },
                        {
                            id: "lastProfileUpdate",
                            label: "Last Profile Update",
                            fieldName: "lastProfileUpdate",
                            fieldType: "DateTime",
                            mandatory: false,
                            placeholder: "2025-10-16 08:42 UTC",
                        },
                    ],
                },
            ],
        },
        {
            id: "supply",
            title: "Supply & Logistics",
            groups: [
                {
                    groupName: "Supply Chain Overview",
                    fields: [
                        {
                            id: "supplyChainModel",
                            label: "Supply Chain Model",
                            fieldName: "supplyModel",
                            fieldType: "select",
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "Centralized", value: "Centralized" },
                                { label: "Decentralized", value: "Decentralized" },
                                { label: "Hybrid", value: "Hybrid" },
                            ],
                            placeholder: "Centralized / Decentralized / Hybrid",
                        },
                        {
                            id: "numberOfKeySuppliers",
                            label: "Number of Key Suppliers",
                            fieldName: "keySuppliers",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "expansion"],
                            placeholder: "12",
                        },
                        {
                            id: "averageLeadTimeDays",
                            label: "Average Lead Time (Days)",
                            fieldName: "leadTime",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "30",
                        },
                        {
                            id: "supplyReliabilityPercent",
                            label: "Supply Reliability (%)",
                            fieldName: "supplyReliability",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "93.4",
                        },
                        {
                            id: "keySupplierLocations",
                            label: "Key Supplier Locations",
                            fieldName: "supplierLocations",
                            fieldType: "Multiline Text",
                            mandatory: ["launch", "growth"],
                            placeholder: "UAE, India, China",
                        },
                    ],
                },
                {
                    groupName: "Procurement & Inventory",
                    fields: [
                        {
                            id: "procurementProcessType",
                            label: "Procurement Process Type",
                            fieldName: "procurementType",
                            fieldType: "select",
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "Manual", value: "Manual" },
                                { label: "Semi-Automated", value: "Semi-Automated" },
                                { label: "Fully Automated", value: "Fully Automated" },
                            ],
                            placeholder: "Manual / Semi-Automated / Fully Automated",
                        },
                        {
                            id: "averageProcurementCycleDays",
                            label: "Average Procurement Cycle (Days)",
                            fieldName: "procurementCycle",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "expansion"],
                            placeholder: "20",
                        },
                        {
                            id: "vendorEvaluationFrequency",
                            label: "Vendor Evaluation Frequency",
                            fieldName: "evaluationFrequency",
                            fieldType: "select",
                            mandatory: ["optimisation"],
                            options: [
                                { label: "Quarterly", value: "Quarterly" },
                                { label: "Bi-Annual", value: "Bi-Annual" },
                                { label: "Annual", value: "Annual" },
                            ],
                            placeholder: "Quarterly / Bi-Annual / Annual",
                        },
                        {
                            id: "purchaseApprovalWorkflow",
                            label: "Purchase Approval Workflow",
                            fieldName: "approvalWorkflow",
                            fieldType: "select",
                            mandatory: ["growth", "expansion", "optimisation"],
                            options: [
                                { label: "Manual", value: "Manual" },
                                { label: "Role-Based", value: "Role-Based" },
                                { label: "Automated", value: "Automated" },
                            ],
                            placeholder: "Manual / Role-Based / Automated",
                        },
                    ],
                },
                {
                    groupName: "Warehousing & Fulfilment",
                    fields: [
                        {
                            id: "warehouseLocations",
                            label: "Warehouse Locations",
                            fieldName: "warehouseLocations",
                            fieldType: "Multiline Text",
                            mandatory: ["launch", "growth"],
                            placeholder: "Mussafah Industrial Area, Abu Dhabi",
                        },
                        {
                            id: "totalWarehouseCapacity",
                            label: "Total Warehouse Capacity (m²)",
                            fieldName: "warehouseCapacity",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "expansion"],
                            placeholder: "5,000",
                        },
                        {
                            id: "inventoryManagementSystem",
                            label: "Inventory Management System",
                            fieldName: "inventorySystem",
                            fieldType: "select",
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "Excel", value: "Excel" },
                                { label: "ERP", value: "ERP" },
                                { label: "WMS", value: "WMS" },
                                { label: "Custom Software", value: "Custom Software" },
                            ],
                            placeholder: "Excel / ERP / WMS / Custom Software",
                        },
                        {
                            id: "inventoryAccuracyPercent",
                            label: "Inventory Accuracy (%)",
                            fieldName: "inventoryAccuracy",
                            fieldType: "Decimal",
                            readOnly: true,
                            mandatory: false,
                            placeholder: "97.5",
                        },
                    ],
                },
                {
                    groupName: "Logistics & Distribution",
                    fields: [
                        {
                            id: "primaryLogisticsPartner",
                            label: "Primary Logistics Partner",
                            fieldName: "logisticsPartner",
                            fieldType: "Text",
                            mandatory: ["growth", "expansion"],
                            placeholder: "Aramex Logistics LLC",
                        },
                        {
                            id: "distributionChannels",
                            label: "Distribution Channels",
                            fieldName: "distributionChannels",
                            fieldType: "multiselect",
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "Own Fleet", value: "Own Fleet" },
                                { label: "Courier", value: "Courier" },
                                { label: "Distributor", value: "Distributor" },
                                { label: "3PL", value: "3PL" },
                                { label: "Cross-Docking", value: "Cross-Docking" },
                            ],
                            placeholder: "Own Fleet / Courier / Distributor / 3PL / Cross-Docking",
                        },
                        {
                            id: "averageDeliveryTimeDays",
                            label: "Average Delivery Time (Days)",
                            fieldName: "deliveryTime",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "4",
                        },
                        {
                            id: "onTimeDeliveryRatePercent",
                            label: "On-Time Delivery Rate (%)",
                            fieldName: "deliveryRate",
                            fieldType: "Decimal",
                            readOnly: true,
                            mandatory: false,
                            placeholder: "91.8",
                        },
                        {
                            id: "reverseLogisticsProcess",
                            label: "Reverse Logistics Process",
                            fieldName: "reverseLogistics",
                            fieldType: "select",
                            mandatory: ["expansion", "optimisation"],
                            options: [
                                { label: "None", value: "None" },
                                { label: "Partial", value: "Partial" },
                                { label: "Full Returns Management", value: "Full Returns Management" },
                            ],
                            placeholder: "None / Partial / Full Returns Management",
                        },
                    ],
                },
                {
                    groupName: "Sustainability & Risk",
                    fields: [
                        {
                            id: "sustainableSourcingPolicy",
                            label: "Sustainable Sourcing Policy",
                            fieldName: "sourcingPolicy",
                            fieldType: "select",
                            mandatory: ["growth", "expansion", "optimisation", "transformation"],
                            options: [
                                { label: "None", value: "None" },
                                { label: "Developing", value: "Developing" },
                                { label: "Established", value: "Established" },
                                { label: "Certified", value: "Certified" },
                            ],
                            placeholder: "None / Developing / Established / Certified",
                        },
                        {
                            id: "carbonTrackingMechanism",
                            label: "Carbon Tracking Mechanism",
                            fieldName: "carbonTracking",
                            fieldType: "select",
                            mandatory: ["optimisation", "transformation"],
                            options: [
                                { label: "None", value: "None" },
                                { label: "Manual", value: "Manual" },
                                { label: "Automated", value: "Automated" },
                            ],
                            placeholder: "None / Manual / Automated",
                        },
                        {
                            id: "riskAssessmentFrequency",
                            label: "Risk Assessment Frequency",
                            fieldName: "assessmentFrequency",
                            fieldType: "select",
                            mandatory: ["growth", "expansion", "optimisation"],
                            options: [
                                { label: "Quarterly", value: "Quarterly" },
                                { label: "Bi-Annual", value: "Bi-Annual" },
                                { label: "Annual", value: "Annual" },
                            ],
                            placeholder: "Quarterly / Bi-Annual / Annual",
                        },
                        {
                            id: "supplyChainRiskScore",
                            label: "Supply Chain Risk Score (0–100)",
                            fieldName: "riskScore",
                            fieldType: "Decimal (0–100)",
                            readOnly: true,
                            mandatory: false,
                            placeholder: "78",
                        },
                        {
                            id: "lastProfileUpdate",
                            label: "Last Profile Update",
                            fieldName: "lastProfileUpdate",
                            fieldType: "DateTime",
                            readOnly: true,
                            mandatory: false,
                            placeholder: "2025-10-16 08:42 UTC",
                        },
                    ],
                }
            ],
        },
        {
            id: "service",
            title: "Service Delivery",
            groups: [
                {
                    groupName: "Service Overview",
                    fields: [
                        {
                            id: "serviceDeliveryModel",
                            label: "Service Delivery Model",
                            fieldName: "serviceDeliveryModel",
                            fieldType: "select",
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "In-House", value: "In-House" },
                                { label: "Outsourced", value: "Outsourced" },
                                { label: "Hybrid", value: "Hybrid" },
                            ],
                            placeholder: "In-House / Outsourced / Hybrid",
                        },
                        {
                            id: "numberOfActiveServices",
                            label: "Number of Active Services",
                            fieldName: "activeServices",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "expansion"],
                            placeholder: "5",
                        },
                        {
                            id: "keyServiceAreas",
                            label: "Key Service Areas",
                            fieldName: "keyServiceAreas",
                            fieldType: "multiselect",
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "IT Support", value: "IT Support" },
                                { label: "Consulting", value: "Consulting" },
                                { label: "Training", value: "Training" },
                                { label: "Maintenance", value: "Maintenance" },
                                { label: "Advisory", value: "Advisory" },
                            ],
                            placeholder: "IT Support / Consulting / Training / Maintenance / Advisory",
                        },
                        {
                            id: "primaryDeliveryLocation",
                            label: "Primary Delivery Location",
                            fieldName: "primaryDeliveryLocation",
                            fieldType: "Text",
                            mandatory: ["launch", "growth"],
                            placeholder: "Abu Dhabi, UAE",
                        },
                    ],
                },
                {
                    groupName: "Service Performance & Quality",
                    fields: [
                        {
                            id: "slaAdherenceRatePercent",
                            label: "SLA Adherence Rate (%)",
                            fieldName: "slaAdherence",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "92.3",
                        },
                        {
                            id: "firstTimeResolutionRatePercent",
                            label: "First-Time Resolution Rate (%)",
                            fieldName: "firstTimeResolution",
                            fieldType: "Decimal",
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "88.5",
                        },
                        {
                            id: "incidentResponseTimeHours",
                            label: "Incident Response Time (Hours)",
                            fieldName: "incidentResponseTime",
                            fieldType: "Decimal",
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "2.5",
                        },
                        {
                            id: "qualityCertification",
                            label: "Quality Certification",
                            fieldName: "qualityCertification",
                            fieldType: "select",
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "ISO 9001", value: "ISO 9001" },
                                { label: "ISO 20000", value: "ISO 20000" },
                                { label: "Other", value: "Other" },
                                { label: "None", value: "None" },
                            ],
                            placeholder: "ISO 9001 / ISO 20000 / Other / None",
                        },
                    ],
                },
                {
                    groupName: "Service Operations & Tools",
                    fields: [
                        {
                            id: "serviceManagementPlatform",
                            label: "Service Management Platform",
                            fieldName: "serviceManagementPlatform",
                            fieldType: "select",
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "Excel", value: "Excel" },
                                { label: "CRM", value: "CRM" },
                                { label: "ERP", value: "ERP" },
                                { label: "Custom Portal", value: "Custom Portal" },
                            ],
                            placeholder: "Excel / CRM / ERP / Custom Portal",
                        },
                        {
                            id: "serviceTeamSize",
                            label: "Service Team Size",
                            fieldName: "serviceTeamSize",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "expansion"],
                            placeholder: "18",
                        },
                        {
                            id: "keyServiceProcesses",
                            label: "Key Service Processes",
                            fieldName: "keyServiceProcesses",
                            fieldType: "Multiline Text",
                            mandatory: ["launch", "growth"],
                            placeholder: "Request intake → Diagnosis → Resolution → Feedback loop.",
                        },
                        {
                            id: "processAutomationLevel",
                            label: "Process Automation Level",
                            fieldName: "processAutomationLevel",
                            fieldType: "select",
                            mandatory: ["expansion", "optimisation"],
                            options: [
                                { label: "Manual", value: "Manual" },
                                { label: "Partially Automated", value: "Partially Automated" },
                                { label: "Fully Automated", value: "Fully Automated" },
                            ],
                            placeholder: "Manual / Partially Automated / Fully Automated",
                        },
                        {
                            id: "averageServiceCost",
                            label: "Average Service Cost (AED)",
                            fieldName: "serviceCost",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "AED 1,200",
                        },
                    ],
                },
                {
                    groupName: "Customer Experience & Feedback",
                    fields: [
                        {
                            id: "customerSatisfactionCSATPercent",
                            label: "Customer Satisfaction (CSAT) (%)",
                            fieldName: "customerSatisfaction",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "89.4",
                        },
                        {
                            id: "netPromoterScoreNPS",
                            label: "Net Promoter Score (NPS)",
                            fieldName: "netPromoterScore",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "72",
                        },
                        {
                            id: "feedbackCollectionMethod",
                            label: "Feedback Collection Method",
                            fieldName: "feedbackCollectionMethod",
                            fieldType: "select",
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "In-App", value: "In-App" },
                                { label: "Email", value: "Email" },
                                { label: "Call", value: "Call" },
                                { label: "Survey", value: "Survey" },
                                { label: "Onsite Visit", value: "Onsite Visit" },
                            ],
                            placeholder: "In-App / Email / Call / Survey / Onsite Visit",
                        },
                        {
                            id: "serviceImprovementInitiatives",
                            label: "Service Improvement Initiatives",
                            fieldName: "serviceImprovementInitiatives",
                            fieldType: "Multiline Text",
                            mandatory: ["expansion", "optimisation", "transformation"],
                            placeholder: "Monthly internal reviews and automated NPS tracking introduced.",
                        },
                    ],
                },
                {
                    groupName: "Performance Metrics & Risks",
                    fields: [
                        {
                            id: "serviceDeliveryMaturityScore",
                            label: "Service Delivery Maturity Score (0–100)",
                            fieldName: "maturityScore",
                            fieldType: "Decimal (0–100)",
                            mandatory: false,
                            placeholder: "84",
                        },
                        {
                            id: "riskMitigationProcedures",
                            label: "Risk Mitigation Procedures",
                            fieldName: "riskMitigationProcedures",
                            fieldType: "Multiline Text",
                            mandatory: ["expansion", "optimisation", "transformation"],
                            placeholder: "Redundancy built via cloud-based ticketing and DR site.",
                        },
                        {
                            id: "lastProfileUpdate",
                            label: "Last Profile Update",
                            fieldName: "lastProfileUpdate",
                            fieldType: "DateTime",
                            mandatory: false,
                            placeholder: "2025-10-16 08:42 UTC",
                        },
                    ],
                },
            ],
        },
        {
            id: "customer",
            title: "Customer Experience",
            groups: [
                {
                    groupName: "Customer Service Overview",
                    fields: [
                        {
                            id: "customerSupportModel",
                            label: "Customer Support Model",
                            fieldName: "customerSupportModel",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Launch → Growth
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "Centralized", value: "Centralized" },
                                { label: "Decentralized", value: "Decentralized" },
                                { label: "Hybrid", value: "Hybrid" },
                            ],
                            placeholder: "Centralized / Decentralized / Hybrid",
                        },
                        {
                            id: "supportAvailabilityHours",
                            label: "Support Availability (Hours)",
                            fieldName: "supportAvailabilityHours",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Launch → Growth
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "8x5", value: "8x5" },
                                { label: "24x7", value: "24x7" },
                                { label: "On-Demand", value: "onDemand" },
                            ],
                            placeholder: "8x5 / 24x7 / On-Demand",
                        },
                        {
                            id: "numberOfSupportStaff",
                            label: "Number of Support Staff",
                            fieldName: "supportStaff",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "expansion"],
                            placeholder: "12",
                        },
                        {
                            id: "primarySupportChannel",
                            label: "Primary Support Channel",
                            fieldName: "primarySupportChannel",
                            fieldType: "select",
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "Email", value: "Email" },
                                { label: "Phone", value: "Phone" },
                                { label: "Chat", value: "Chat" },
                                { label: "Portal", value: "Portal" },
                                { label: "Social Media", value: "Social Media" },
                            ],
                            placeholder: "Email / Phone / Chat / Portal / Social Media",
                        },
                    ],
                },
                {
                    groupName: "Customer Interaction Management",
                    fields: [
                        {
                            id: "customerTouchpoints",
                            label: "Customer Touchpoints",
                            fieldName: "customerTouchpoints",
                            fieldType: "multiselect",
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "Website", value: "Website" },
                                { label: "WhatsApp", value: "WhatsApp" },
                                { label: "Call Center", value: "Call Center" },
                                { label: "Events", value: "Events" },
                                { label: "Social Media", value: "Social Media" },
                            ],
                            placeholder: "Website / WhatsApp / Call Center / Events / Social Media",
                        },
                        {
                            id: "averageResponseTimeHours",
                            label: "Average Response Time (Hours)",
                            fieldName: "responseTime",
                            fieldType: "Decimal",
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "1.8",
                        },
                        {
                            id: "averageResolutionTimeHours",
                            label: "Average Resolution Time (Hours)",
                            fieldName: "resolutionTime",
                            fieldType: "Decimal",
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "5.6",
                        },
                        {
                            id: "customerRequestVolumeMonthly",
                            label: "Customer Request Volume (Monthly)",
                            fieldName: "requestVolume",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "expansion"],
                            placeholder: "320",
                        },
                    ],
                },
                {
                    groupName: "Complaints & Escalations",
                    fields: [
                        {
                            id: "complaintManagementProcess",
                            label: "Complaint Management Process",
                            fieldName: "complaintManagementProcess",
                            fieldType: "select",
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "Manual", value: "Manual" },
                                { label: "CRM-Based", value: "CRM-Based" },
                                { label: "Automated", value: "Automated" },
                            ],
                            placeholder: "Manual / CRM-Based / Automated",
                        },
                        {
                            id: "numberOfComplaintsMonthly",
                            label: "Number of Complaints (Monthly)",
                            fieldName: "complaintsCount",
                            fieldType: "Whole Number",
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "8",
                        },
                        {
                            id: "averageResolutionTimeForComplaintsDays",
                            label: "Average Resolution Time for Complaints (Days)",
                            fieldName: "complaintsResolution",
                            fieldType: "Decimal",
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "3.2",
                        },
                        {
                            id: "escalationRatePercent",
                            label: "Escalation Rate (%)",
                            fieldName: "escalationRate",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "11.5",
                        },
                    ],
                },
                {
                    groupName: "Feedback & Satisfaction",
                    fields: [
                        {
                            id: "customerSatisfactionCSATPercent",
                            label: "Customer Satisfaction (CSAT) (%)",
                            fieldName: "customerSatisfaction",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "89.4",
                        },
                        {
                            id: "netPromoterScoreNPS",
                            label: "Net Promoter Score (NPS)",
                            fieldName: "netPromoterScore",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "72",
                        },
                        {
                            id: "feedbackCollectionFrequency",
                            label: "Feedback Collection Frequency",
                            fieldName: "feedbackCollectionFrequency",
                            fieldType: "select",
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "Per Project", value: "Per Project" },
                                { label: "Quarterly", value: "Quarterly" },
                                { label: "Bi-Annual", value: "Bi-Annual" },
                                { label: "Annual", value: "Annual" },
                            ],
                            placeholder: "Per Project / Quarterly / Bi-Annual / Annual",
                        },
                        {
                            id: "primaryFeedbackChannel",
                            label: "Primary Feedback Channel",
                            fieldName: "primaryFeedbackChannel",
                            fieldType: "select",
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "In-App", value: "In-App" },
                                { label: "Email", value: "Email" },
                                { label: "Call", value: "Call" },
                                { label: "Survey", value: "Survey" },
                                { label: "Onsite Visit", value: "Onsite Visit" },
                                { label: "Portal", value: "Portal" },
                            ],
                            placeholder: "In-App / Email / Call / Survey / Portal",
                        },
                        {
                            id: "topCustomerFeedbackThemes",
                            label: "Top Customer Feedback Themes",
                            fieldName: "feedbackThemes",
                            fieldType: "Multiline Text",
                            mandatory: ["expansion", "optimisation", "transformation"],
                            placeholder: "Speed of response and proactive updates highlighted as key strengths.",
                        },
                    ],
                },
                {
                    groupName: "Customer Retention & Loyalty",
                    fields: [
                        {
                            id: "retentionStrategy",
                            label: "Retention Strategy",
                            fieldName: "retentionStrategy",
                            fieldType: "Multiline Text",
                            mandatory: ["expansion", "optimisation", "transformation"],
                            placeholder: "Annual review meetings and loyalty discounts for repeat clients.",
                        },
                        {
                            id: "customerLoyaltyProgram",
                            label: "Customer Loyalty Program",
                            fieldName: "customerLoyaltyProgram",
                            fieldType: "select",
                            mandatory: ["expansion", "optimisation", "transformation"],
                            options: [
                                { label: "None", value: "None" },
                                { label: "Basic", value: "Basic" },
                                { label: "Points-Based", value: "Points-Based" },
                                { label: "Tiered", value: "Tiered" },
                                { label: "Subscription", value: "Subscription" },
                            ],
                            placeholder: "None / Basic / Points-Based / Tiered / Subscription",
                        },
                        {
                            id: "retentionRatePercent",
                            label: "Retention Rate (%)",
                            fieldName: "retentionRate",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "86.5",
                        },
                    ],
                },
                {
                    groupName: "Performance Metrics & Insights",
                    fields: [
                        {
                            id: "customerExperienceIndex",
                            label: "Customer Experience Index (0–100)",
                            fieldName: "customerExperienceIndex",
                            fieldType: "Decimal (0–100)",
                            mandatory: false,
                            placeholder: "81",
                        },
                        {
                            id: "improvementActionsLogged",
                            label: "Improvement Actions Logged",
                            fieldName: "improvementActionsLogged",
                            fieldType: "Whole Number",
                            mandatory: ["optimisation", "transformation"],
                            placeholder: "12",
                        },
                        {
                            id: "lastProfileUpdate",
                            label: "Last Profile Update",
                            fieldName: "lastProfileUpdate",
                            fieldType: "DateTime",
                            mandatory: false,
                            placeholder: "2025-10-16 08:42 UTC",
                        },
                    ],
                },
            ],
        },
        {
            id: "people",
            title: "People & Governance",
            groups: [
                {
                    groupName: "Organizational Structure",
                    fields: [
                        {
                            id: "numberOfEmployees",
                            label: "Number of Employees",
                            fieldName: "numberOfEmployees",
                            fieldType: "Whole Number", // Whole Number
                            // Data is System Modified (Account), so mandatory is false on the form
                            mandatory: false,
                            placeholder: "45",
                        },
                        {
                            id: "legalStructure",
                            label: "Legal Structure",
                            fieldName: "legalStructure",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Ideation → Launch
                            mandatory: ["ideation", "launch"],
                            options: [
                                { label: "Sole Proprietorship", value: "soleProprietorship" },
                                { label: "Partnership", value: "partnership" },
                                { label: "LLC", value: "llc" },
                                { label: "PJSC", value: "pjsc" },
                                { label: "Other", value: "other" },
                            ],
                            placeholder: "Sole Proprietorship / Partnership / LLC / PJSC / Other",
                        },
                        {
                            id: "entityHierarchyType",
                            label: "Entity Hierarchy Type",
                            fieldName: "entityHierarchyType",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "Single Entity", value: "singleEntity" },
                                { label: "Holding", value: "holding" },
                                { label: "Subsidiary", value: "subsidiary" },
                                { label: "Branch", value: "branch" },
                            ],
                            placeholder: "Single Entity / Holding / Subsidiary / Branch",
                        },
                        {
                            id: "organizationalChart",
                            label: "Organizational Chart",
                            fieldName: "organizationalChart",
                            fieldType: "File Upload", // File Upload
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            placeholder: "Upload the organizational chart (e.g., OrgStructure_2025.pdf)",
                        },
                        {
                            id: "departmentsBusinessUnits",
                            label: "Departments / Business Units",
                            fieldName: "departmentsBusinessUnits",
                            fieldType: "Multiline Text", // Multiline Text
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            placeholder: "Operations, Sales, Finance, HR",
                        },
                        {
                            id: "reportingLineModel",
                            label: "Reporting Line Model",
                            fieldName: "reportingLineModel",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Expansion → Optimisation
                            mandatory: ["expansion", "optimisation"],
                            options: [
                                { label: "Functional", value: "functional" },
                                { label: "Matrix", value: "matrix" },
                                { label: "Flat", value: "flat" },
                                { label: "Hybrid", value: "hybrid" },
                            ],
                            placeholder: "Functional / Matrix / Flat / Hybrid",
                        },
                    ],
                },
                {
                    groupName: "Leadership & Governance",
                    fields: [
                        {
                            id: "ceoFounderName",
                            label: "CEO / Founder Name",
                            fieldName: "ceoFounderName",
                            fieldType: "Text", // Text
                            // Data is System Modified (Contact), so mandatory is false on the form
                            mandatory: false,
                            placeholder: "Sara Al Mansoori",
                        },
                        {
                            id: "leadershipTeamRoles",
                            label: "Leadership Team Roles",
                            fieldName: "leadershipTeamRoles",
                            fieldType: "Multiline Text", // Multiline Text
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            placeholder: "CEO, COO, CFO, Head of Sales",
                        },
                        {
                            id: "governanceBodyType",
                            label: "Governance Body Type",
                            fieldName: "governanceBodyType",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Expansion → Transformation
                            mandatory: ["expansion", "optimisation", "transformation"],
                            options: [
                                { label: "None", value: "none" },
                                { label: "Advisory Board", value: "advisoryBoard" },
                                { label: "Executive Committee", value: "executiveCommittee" },
                                { label: "Board of Directors", value: "boardOfDirectors" },
                            ],
                            placeholder: "None / Advisory Board / Executive Committee / Board of Directors",
                        },
                        {
                            id: "decisionMakingModel",
                            label: "Decision-Making Model",
                            fieldName: "decisionMakingModel",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Expansion → Optimisation
                            mandatory: ["expansion", "optimisation"],
                            options: [
                                { label: "Centralized", value: "centralized" },
                                { label: "Decentralized", value: "decentralized" },
                                { label: "Hybrid", value: "hybrid" },
                            ],
                            placeholder: "Centralized / Decentralized / Hybrid",
                        },
                        {
                            id: "meetingFrequency",
                            label: "Meeting Frequency",
                            fieldName: "meetingFrequency",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "Monthly", value: "monthly" },
                                { label: "Quarterly", value: "quarterly" },
                                { label: "Annually", value: "annually" },
                                { label: "Ad-hoc", value: "adhoc" },
                            ],
                            placeholder: "Monthly / Quarterly / Annually / Ad-hoc",
                        },
                    ],
                },
                {
                    groupName: "HR Policies & Employee Management",
                    fields: [
                        {
                            id: "hrDepartmentExists",
                            label: "HR Department Exists",
                            fieldName: "hrDepartmentExists",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" },
                                { label: "Outsourced", value: "outsourced" },
                            ],
                            placeholder: "Yes / No / Outsourced",
                        },
                        {
                            id: "hrSystemUsed",
                            label: "HR System Used",
                            fieldName: "hrSystemUsed",
                            fieldType: "Text", // Text
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            placeholder: "Bayzat",
                        },
                        {
                            id: "employeeOnboardingProcess",
                            label: "Employee Onboarding Process",
                            fieldName: "employeeOnboardingProcess",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "Manual", value: "manual" },
                                { label: "Semi-Automated", value: "semiAutomated" },
                                { label: "Automated", value: "automated" },
                            ],
                            placeholder: "Manual / Semi-Automated / Automated",
                        },
                        {
                            id: "performanceReviewFrequency",
                            label: "Performance Review Frequency",
                            fieldName: "performanceReviewFrequency",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Growth → Optimisation
                            mandatory: ["growth", "expansion", "optimisation"],
                            options: [
                                { label: "Annual", value: "annual" },
                                { label: "Bi-Annual", value: "biAnnual" },
                                { label: "Quarterly", value: "quarterly" },
                                { label: "Monthly", value: "monthly" },
                            ],
                            placeholder: "Annual / Bi-Annual / Quarterly / Monthly",
                        },
                        {
                            id: "employeeTurnoverRatePercent",
                            label: "Employee Turnover Rate (%)",
                            fieldName: "employeeTurnoverRatePercent",
                            fieldType: "Decimal", // Decimal
                            // System-Generated, so mandatory is false on the form
                            mandatory: false,
                            placeholder: "7.5",
                        },
                        {
                            id: "staffSatisfactionScore",
                            label: "Staff Satisfaction Score",
                            fieldName: "staffSatisfactionScore",
                            fieldType: "Decimal", // Decimal
                            // System-Generated, so mandatory is false on the form
                            mandatory: false,
                            placeholder: "84",
                        },
                    ],
                },
                {
                    groupName: "Skills & Capacity Development",
                    fields: [
                        {
                            id: "trainingBudgetPercent",
                            label: "Training Budget (% of Revenue)",
                            fieldName: "trainingBudgetPercent",
                            fieldType: "Decimal", // Decimal
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            placeholder: "4.5",
                        },
                        {
                            id: "averageTrainingHoursPerEmployee",
                            label: "Average Training Hours per Employee",
                            fieldName: "averageTrainingHoursPerEmployee",
                            fieldType: "Decimal", // Decimal
                            // Mandatory Stages: Growth → Optimisation
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "25",
                        },
                        {
                            id: "capabilityAssessmentConducted",
                            label: "Capability Assessment Conducted",
                            fieldName: "capabilityAssessmentConducted",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Expansion → Transformation
                            mandatory: ["expansion", "optimisation", "transformation"],
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" },
                                { label: "Planned", value: "planned" },
                            ],
                            placeholder: "Yes / No / Planned",
                        },
                        {
                            id: "top3SkillAreas",
                            label: "Top 3 Skill Areas",
                            fieldName: "top3SkillAreas",
                            fieldType: "Multiline Text", // Multiline Text
                            // Mandatory Stages: Growth → Optimisation
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "AI, Customer Experience, Project Management",
                        },
                    ],
                },
                {
                    groupName: "Culture & Governance Maturity",
                    fields: [
                        {
                            id: "companyValuesDocumented",
                            label: "Company Values Documented",
                            fieldName: "companyValuesDocumented",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Launch → Growth
                            mandatory: ["launch", "growth"],
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" },
                                { label: "In Progress", value: "inProgress" },
                            ],
                            placeholder: "Yes / No / In Progress",
                        },
                        {
                            id: "codeOfConduct",
                            label: "Code of Conduct",
                            fieldName: "codeOfConduct",
                            fieldType: "File Upload", // File Upload
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            placeholder: "Upload the Code of Conduct (e.g., CodeOfConduct2025.pdf)",
                        },
                        {
                            id: "diversityInclusionPolicy",
                            label: "Diversity & Inclusion Policy",
                            fieldName: "diversityInclusionPolicy",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Expansion → Transformation
                            mandatory: ["expansion", "optimisation", "transformation"],
                            options: [
                                { label: "None", value: "none" },
                                { label: "Basic", value: "basic" },
                                { label: "Formal", value: "formal" },
                                { label: "Certified", value: "certified" },
                            ],
                            placeholder: "None / Basic / Formal / Certified",
                        },
                        {
                            id: "governanceMaturityScore",
                            label: "Governance Maturity Score (0–100)",
                            fieldName: "governanceMaturityScore",
                            fieldType: "Decimal (0–100)", // Decimal (0–100)
                            // System-Generated (All stages), so mandatory is false on the form
                            mandatory: false,
                            placeholder: "82",
                        },
                        {
                            id: "lastProfileUpdate",
                            label: "Last Profile Update",
                            fieldName: "lastProfileUpdate",
                            fieldType: "DateTime", // DateTime
                            // System-Generated (All stages), so mandatory is false on the form
                            mandatory: false,
                            placeholder: "2025-10-16 08:42 UTC",
                        },
                    ],
                },
            ],
        },
        {
            id: "technology",
            title: "Technology & Systems",
            groups: [
                {
                    groupName: "Digital Infrastructure",
                    fields: [
                        {
                            id: "coreSystemsUsed",
                            label: "Core Systems Used",
                            fieldName: "coreSystemsUsed",
                            fieldType: "Multiline Text", // Multiline Text
                            // Mandatory Stages: Launch → Growth
                            mandatory: ["launch", "growth"],
                            placeholder: "Microsoft 365, QuickBooks, HubSpot",
                        },
                        {
                            id: "hostingEnvironment",
                            label: "Hosting Environment",
                            fieldName: "hostingEnvironment",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            options: [
                                { label: "On-Prem", value: "onPrem" },
                                { label: "Cloud", value: "cloud" },
                                { label: "Hybrid", value: "hybrid" },
                            ],
                            placeholder: "On-Prem / Cloud / Hybrid",
                        },
                        {
                            id: "cloudProvider",
                            label: "Cloud Provider",
                            fieldName: "cloudProvider",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Growth → Optimisation
                            mandatory: ["growth", "expansion", "optimisation"],
                            options: [
                                { label: "Azure", value: "azure" },
                                { label: "AWS", value: "aws" },
                                { label: "Google", value: "google" },
                                { label: "Other", value: "other" },
                            ],
                            placeholder: "Azure / AWS / Google / Other",
                        },
                        {
                            id: "primaryErpCrmSystem",
                            label: "Primary ERP/CRM System",
                            fieldName: "primaryErpCrmSystem",
                            fieldType: "Text", // Text
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            placeholder: "Dynamics 365 Business Central",
                        },
                        {
                            id: "networkReliabilityRating",
                            label: "Network Reliability Rating (%)",
                            fieldName: "networkReliabilityRating",
                            fieldType: "Decimal", // Decimal
                            // System-Generated, so mandatory is false on the form
                            mandatory: false,
                            placeholder: "99.5",
                        },
                    ],
                },
                {
                    groupName: "Applications & Tools",
                    fields: [
                        {
                            id: "businessApplicationsUsed",
                            label: "Business Applications Used",
                            fieldName: "businessApplicationsUsed",
                            fieldType: "Multiline Text", // Multiline Text
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            placeholder: "Slack, Zoom, Notion, Salesforce",
                        },
                        {
                            id: "customDevelopedSystems",
                            label: "Custom Developed Systems",
                            fieldName: "customDevelopedSystems",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Expansion → Optimisation
                            mandatory: ["expansion", "optimisation"],
                            options: [
                                { label: "None", value: "none" },
                                { label: "Few", value: "few" },
                                { label: "Extensive", value: "extensive" },
                            ],
                            placeholder: "None / Few / Extensive",
                        },
                        {
                            id: "integrationLevel",
                            label: "Integration Level",
                            fieldName: "integrationLevel",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Expansion → Transformation
                            mandatory: ["expansion", "optimisation", "transformation"],
                            options: [
                                { label: "Low", value: "low" },
                                { label: "Medium", value: "medium" },
                                { label: "High", value: "high" },
                            ],
                            placeholder: "Low / Medium / High",
                        },
                        {
                            id: "primaryBusinessIntelligenceTool",
                            label: "Primary Business Intelligence Tool",
                            fieldName: "primaryBusinessIntelligenceTool",
                            fieldType: "Text", // Text
                            // Mandatory Stages: Growth → Optimisation
                            mandatory: ["growth", "expansion", "optimisation"],
                            placeholder: "Power BI",
                        },
                    ],
                },
                {
                    groupName: "Cyber Security & Governance",
                    fields: [
                        {
                            id: "cyberSecurityFrameworkAdopted",
                            label: "Cyber Security Framework Adopted",
                            fieldName: "cyberSecurityFrameworkAdopted",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Growth → Transformation
                            mandatory: ["growth", "expansion", "optimisation", "transformation"],
                            options: [
                                { label: "ISO 27001", value: "iso27001" },
                                { label: "NIST", value: "nist" },
                                { label: "None", value: "none" },
                            ],
                            placeholder: "ISO 27001 / NIST / None",
                        },
                        {
                            id: "incidentResponsePlanExists",
                            label: "Incident Response Plan Exists",
                            fieldName: "incidentResponsePlanExists",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Expansion → Optimisation
                            mandatory: ["expansion", "optimisation"],
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" },
                                { label: "In Progress", value: "inProgress" },
                            ],
                            placeholder: "Yes / No / In Progress",
                        },
                        {
                            id: "lastSecurityAuditDate",
                            label: "Last Security Audit Date",
                            fieldName: "lastSecurityAuditDate",
                            fieldType: "Date", // Date
                            // Mandatory Stages: Expansion → Optimisation
                            mandatory: ["expansion", "optimisation"],
                            placeholder: "2025-06-20",
                        },
                        {
                            id: "dataBackupFrequency",
                            label: "Data Backup Frequency",
                            fieldName: "dataBackupFrequency",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Growth → Optimisation
                            mandatory: ["growth", "expansion", "optimisation"],
                            options: [
                                { label: "Daily", value: "daily" },
                                { label: "Weekly", value: "weekly" },
                                { label: "Monthly", value: "monthly" },
                            ],
                            placeholder: "Daily / Weekly / Monthly",
                        },
                    ],
                },
                {
                    groupName: "Digital Transformation & Automation",
                    fields: [
                        {
                            id: "automationLevel",
                            label: "Automation Level",
                            fieldName: "automationLevel",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Expansion → Transformation
                            mandatory: ["expansion", "optimisation", "transformation"],
                            options: [
                                { label: "Manual", value: "manual" },
                                { label: "Semi-Automated", value: "semiAutomated" },
                                { label: "Fully Automated", value: "fullyAutomated" },
                            ],
                            placeholder: "Manual / Semi-Automated / Fully Automated",
                        },
                        {
                            id: "dataAnalyticsAdoption",
                            label: "Data Analytics Adoption",
                            fieldName: "dataAnalyticsAdoption",
                            fieldType: "select", // Choice -> select
                            // Mandatory Stages: Expansion → Transformation
                            mandatory: ["expansion", "optimisation", "transformation"],
                            options: [
                                { label: "Basic", value: "basic" },
                                { label: "Intermediate", value: "intermediate" },
                                { label: "Advanced", value: "advanced" },
                            ],
                            placeholder: "Basic / Intermediate / Advanced",
                        },
                        {
                            id: "digitalRoadmapDocument",
                            label: "Digital Roadmap Document",
                            fieldName: "digitalRoadmapDocument",
                            fieldType: "File Upload", // File Upload
                            // Mandatory Stages: Growth → Expansion
                            mandatory: ["growth", "expansion"],
                            placeholder: "Upload the Digital Roadmap (e.g., DigitalRoadmap2025.pdf)",
                        },
                        {
                            id: "itMaturityScore",
                            label: "IT Maturity Score (0-100)",
                            fieldName: "itMaturityScore",
                            fieldType: "Decimal (0–100)", // Decimal (0–100)
                            // System-Generated (All stages), so mandatory is false on the form
                            mandatory: false,
                            placeholder: "78",
                        },
                    ],
                },
            ],
        },
        {
            id: "finance",
            title: "Finance and Performance",
            groups: [
                {
                    groupName: "Company Financials",
                    fields: [
                        {
                            id: "financialYearEnd",
                            label: "Financial Year End",
                            fieldName: "cf_FinPerf_FYEnd",
                            fieldType: "Date Only",
                            mandatory: ["launch", "growth"],
                            placeholder: "2024-12-31",
                        },
                        {
                            id: "accountingSystemUsed",
                            label: "Accounting System Used",
                            fieldName: "cf_FinPerf_AccountingSystem",
                            fieldType: "Text",
                            mandatory: ["launch", "growth"],
                            placeholder: "QuickBooks Online",
                        },
                        {
                            id: "currencyOfReporting",
                            label: "Currency of Reporting",
                            fieldName: "transactioncurrencyid",
                            fieldType: "select",
                            mandatory: ["launch", "growth"],
                            placeholder: "AED",
                        },
                        {
                            id: "annualRevenue",
                            label: "Annual Revenue (AED)",
                            fieldName: "account.revenue",
                            fieldType: "Currency",
                            mandatory: ["growth", "expansion"],
                            placeholder: "2,500,000 AED",
                        },
                        {
                            id: "annualProfit",
                            label: "Annual Profit (AED)",
                            fieldName: "cf_FinPerf_AnnualProfit",
                            fieldType: "Currency",
                            mandatory: false,
                            placeholder: "350,000 AED",
                        },
                        {
                            id: "totalAssets",
                            label: "Total Assets (AED)",
                            fieldName: "cf_FinPerf_TotalAssets",
                            fieldType: "Currency",
                            mandatory: false,
                            placeholder: "1,800,000 AED",
                        },
                        {
                            id: "liabilities",
                            label: "Liabilities (AED)",
                            fieldName: "cf_FinPerf_Liabilities",
                            fieldType: "Currency",
                            mandatory: false,
                            placeholder: "900,000 AED",
                        },
                        {
                            id: "netWorth",
                            label: "Net Worth (AED)",
                            fieldName: "cf_FinPerf_NetWorth",
                            fieldType: "Currency",
                            mandatory: false,
                            readOnly: true,
                            placeholder: "900,000 AED",
                        },
                    ],
                },
                {
                    groupName: "Performance Metrics",
                    fields: [
                        {
                            id: "grossMargin",
                            label: "Gross Margin (%)",
                            fieldName: "cf_FinPerf_GrossMargin",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "32.5",
                        },
                        {
                            id: "operatingMargin",
                            label: "Operating Margin (%)",
                            fieldName: "cf_FinPerf_OperatingMargin",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "18.7",
                        },
                        {
                            id: "debtToEquityRatio",
                            label: "Debt-to-Equity Ratio",
                            fieldName: "cf_FinPerf_DebtEquity",
                            fieldType: "Decimal",
                            mandatory: false,
                            placeholder: "1.4",
                        },
                        {
                            id: "cashFlowStability",
                            label: "Cash Flow Stability",
                            fieldName: "cf_FinPerf_CashFlowStability",
                            fieldType: "select",
                            mandatory: false,
                            options: [
                                { label: "Stable", value: "Stable" },
                                { label: "Moderate", value: "Moderate" },
                                { label: "Volatile", value: "Volatile" },
                            ],
                        },
                    ],
                },
                {
                    groupName: "Financial Health & Growth",
                    fields: [
                        {
                            id: "creditRating",
                            label: "Credit Rating",
                            fieldName: "cf_FinPerf_CreditRating",
                            fieldType: "select",
                            mandatory: false,
                            options: [
                                { label: "Excellent", value: "Excellent" },
                                { label: "Good", value: "Good" },
                                { label: "Fair", value: "Fair" },
                                { label: "Poor", value: "Poor" },
                            ],
                        },
                        {
                            id: "auditorName",
                            label: "Auditor Name",
                            fieldName: "cf_FinPerf_Auditor",
                            fieldType: "Text",
                            mandatory: false,
                            placeholder: "EY UAE",
                        },
                        {
                            id: "lastAuditYear",
                            label: "Last Audit Year",
                            fieldName: "cf_FinPerf_AuditYear",
                            fieldType: "Date Only",
                            mandatory: false,
                            placeholder: "2024-03-31",
                        },
                        {
                            id: "taxRegistrationNumber",
                            label: "Tax Registration Number",
                            fieldName: "account.accountnumber",
                            fieldType: "Text",
                            mandatory: ["ideation", "launch"],
                            placeholder: "100098765432",
                        },
                        {
                            id: "vatComplianceStatus",
                            label: "VAT Compliance Status",
                            fieldName: "cf_FinPerf_VATStatus",
                            fieldType: "select",
                            mandatory: false,
                            options: [
                                { label: "Registered", value: "Registered" },
                                { label: "Exempt", value: "Exempt" },
                                { label: "Non-Registered", value: "Non-Registered" },
                            ],
                        },
                    ],
                },
                {
                    groupName: "Financial Planning & Performance",
                    fields: [
                        {
                            id: "budgetingProcessType",
                            label: "Budgeting Process Type",
                            fieldName: "cf_FinPerf_BudgetProcess",
                            fieldType: "select",
                            mandatory: false,
                            options: [
                                { label: "Top-Down", value: "Top-Down" },
                                { label: "Bottom-Up", value: "Bottom-Up" },
                                { label: "Hybrid", value: "Hybrid" },
                            ],
                        },
                        {
                            id: "forecastingFrequency",
                            label: "Forecasting Frequency",
                            fieldName: "cf_FinPerf_ForecastingFreq",
                            fieldType: "select",
                            mandatory: false,
                            options: [
                                { label: "Monthly", value: "Monthly" },
                                { label: "Quarterly", value: "Quarterly" },
                                { label: "Annually", value: "Annually" },
                            ],
                        },
                        {
                            id: "financialPerformanceMaturityScore",
                            label: "Financial Performance Maturity Score (0-100)",
                            fieldName: "cf_FinPerf_MaturityScore",
                            fieldType: "Decimal (0–100)",
                            mandatory: true ,
                            readOnly: true,
                            placeholder: "83",
                        },
                    ],
                },

            ],
        },
        {
    id: "facilitiesAssets",
    title: "Facilities & Assets",
    groups: [
        {
            groupName: "Facility Details",
            fields: [
                {
                    id: "headOfficeLocation",
                    label: "Head Office Location",
                    fieldName: "account.address1_composite",
                    fieldType: "Text",
                    mandatory: ["launch", "growth"],
                    placeholder: "Abu Dhabi Global Market, Al Maryah Island"
                },
                {
                    id: "operationalBranchesCount",
                    label: "Operational Branches Count",
                    fieldName: "cf_FacAsset_BranchCount",
                    fieldType: "Whole Number",
                    mandatory: ["growth", "expansion"],
                    placeholder: "3"
                },
                {
                    id: "warehouseSpace",
                    label: "Warehouse Space (sqm)",
                    fieldName: "cf_FacAsset_WarehouseSpace",
                    fieldType: "Decimal",
                    mandatory: ["growth", "expansion"],
                    placeholder: "2500"
                },
                {
                    id: "ownedOrLeased",
                    label: "Owned or Leased",
                    fieldName: "cf_FacAsset_OwnedLeased",
                    fieldType: "select",
                    mandatory: ["launch", "growth"],
                    options: [
                        { label: "Owned", value: "owned" },
                        { label: "Leased", value: "leased" },
                        { label: "Mixed", value: "mixed" }
                    ],
                    placeholder: "Owned / Leased / Mixed"
                },
                {
                    id: "leaseExpiryDate",
                    label: "Lease Expiry Date",
                    fieldName: "cf_FacAsset_LeaseExpiry",
                    fieldType: "Date",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "2027-06-30"
                }
            ]
        },

        {
            groupName: "Asset Inventory",
            fields: [
                {
                    id: "totalFixedAssetsValue",
                    label: "Total Fixed Assets Value (AED)",
                    fieldName: "cf_FacAsset_FixedAssetValue",
                    fieldType: "Currency",
                    mandatory: ["growth", "expansion"],
                    placeholder: "1,200,000 AED"
                },
                {
                    id: "machineryCount",
                    label: "Machinery Count",
                    fieldName: "cf_FacAsset_MachineryCount",
                    fieldType: "Whole Number",
                    mandatory: ["growth", "expansion"],
                    placeholder: "12"
                },
                {
                    id: "fleetVehiclesCount",
                    label: "Fleet Vehicles Count",
                    fieldName: "cf_FacAsset_VehicleCount",
                    fieldType: "Whole Number",
                    mandatory: ["growth", "expansion"],
                    placeholder: "5"
                },
                {
                    id: "majorEquipmentList",
                    label: "Major Equipment List",
                    fieldName: "cf_FacAsset_EquipmentList",
                    fieldType: "Multiline Text",
                    mandatory: ["growth", "expansion"],
                    placeholder: "Lathe Machines, CNC Cutters, Forklifts"
                },
                {
                    id: "assetTrackingSystem",
                    label: "Asset Tracking System Used",
                    fieldName: "cf_FacAsset_TrackingSystem",
                    fieldType: "Text",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "SAP EAM"
                }
            ]
        },

        {
            groupName: "Maintenance",
            fields: [
                {
                    id: "preventiveMaintenanceSchedule",
                    label: "Preventive Maintenance Schedule",
                    fieldName: "cf_FacAsset_MaintSchedule",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "Monthly", value: "monthly" },
                        { label: "Quarterly", value: "quarterly" },
                        { label: "Annually", value: "annually" }
                    ],
                    placeholder: "Monthly / Quarterly / Annually"
                },
                {
                    id: "lastMaintenanceAuditDate",
                    label: "Last Maintenance Audit Date",
                    fieldName: "cf_FacAsset_MaintAuditDate",
                    fieldType: "Date",
                    mandatory: ["expansion", "optimisation"],
                    placeholder: "2025-02-15"
                }
            ]
        },

        {
            groupName: "Safety",
            fields: [
                {
                    id: "safetyCertificationStatus",
                    label: "Safety Certification Status",
                    fieldName: "cf_FacAsset_SafetyCert",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "Certified", value: "certified" },
                        { label: "Pending", value: "pending" },
                        { label: "Not Applicable", value: "na" }
                    ],
                    placeholder: "Certified / Pending / Not Applicable"
                },
                {
                    id: "fireSafetyInspectionDate",
                    label: "Fire and Occupational Safety Inspection Date",
                    fieldName: "cf_FacAsset_SafetyInspectionDate",
                    fieldType: "Date",
                    mandatory: ["growth", "expansion"],
                    placeholder: "2024-11-12"
                }
            ]
        },

        {
            groupName: "Sustainability",
            fields: [
                {
                    id: "energyEfficiencyRating",
                    label: "Energy Efficiency Rating",
                    fieldName: "cf_FacAsset_EnergyRating",
                    fieldType: "select",
                    mandatory: ["expansion", "transformation"],
                    options: [
                        { label: "A", value: "a" },
                        { label: "B", value: "b" },
                        { label: "C", value: "c" },
                        { label: "D", value: "d" }
                    ],
                    placeholder: "A / B / C / D"
                },
                {
                    id: "renewableEnergyUsage",
                    label: "Renewable Energy Usage (%)",
                    fieldName: "cf_FacAsset_RenewableUsage",
                    fieldType: "Decimal",
                    mandatory: ["expansion", "transformation"],
                    placeholder: "25.5"
                },
                {
                    id: "wasteManagementPolicy",
                    label: "Waste Management Policy",
                    fieldName: "cf_FacAsset_WastePolicy",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "None", value: "none" },
                        { label: "Basic", value: "basic" },
                        { label: "Formal", value: "formal" }
                    ],
                    placeholder: "None / Basic / Formal"
                },
                {
                    id: "facilitiesMaturityScore",
                    label: "Facilities Maturity Score (0-100)",
                    fieldName: "cf_FacAsset_MaturityScore",
                    fieldType: "Decimal",
                    mandatory: ["all"],
                    placeholder: "79"
                }
            ]
        }
    ]
},
{
    id: "riskCompliance",
    title: "Risk & Compliance",
    groups: [
        {
            groupName: "Regulatory Profile",
            fields: [
                {
                    id: "primaryRegulator",
                    label: "Primary Regulator",
                    fieldName: "cf_RiskComp_PrimaryRegulator",
                    fieldType: "Text",
                    mandatory: ["launch", "growth"],
                    placeholder: "DFSA"
                },
                {
                    id: "regCategory",
                    label: "Regulatory Category / License Type",
                    fieldName: "cf_RiskComp_RegCategory",
                    fieldType: "Text",
                    mandatory: ["launch", "growth"],
                    placeholder: "Category 3C – Asset Management"
                },
                {
                    id: "jurisdictionsOfOperation",
                    label: "Jurisdiction(s) of Operation",
                    fieldName: "cf_RiskComp_Jurisdictions",
                    fieldType: "Multiline Text",
                    mandatory: ["growth", "expansion"],
                    placeholder: "UAE, KSA, Bahrain"
                },
                {
                    id: "regulatedEntityStatus",
                    label: "Regulated Entity Status",
                    fieldName: "cf_RiskComp_RegStatus",
                    fieldType: "select",
                    mandatory: ["launch", "growth"],
                    options: [
                        { label: "Regulated", value: "regulated" },
                        { label: "Unregulated", value: "unregulated" }
                    ],
                    placeholder: "Regulated"
                },
                {
                    id: "highRiskIndustryFlag",
                    label: "High-Risk Industry Flag",
                    fieldName: "cf_RiskComp_HighRiskIndustry",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "Yes", value: "yes" },
                        { label: "No", value: "no" }
                    ],
                    placeholder: "Yes"
                }
            ]
        },

        {
            groupName: "Compliance Framework",
            fields: [
                {
                    id: "complianceFrameworksAdopted",
                    label: "Compliance Frameworks Adopted",
                    fieldName: "cf_RiskComp_Frameworks",
                    fieldType: "Multiline Text",
                    mandatory: ["growth", "expansion"],
                    placeholder: "ISO 27001, ISO 22301, AML Policies"
                },
                {
                    id: "amlCftProgramStatus",
                    label: "AML / CFT Program Status",
                    fieldName: "cf_RiskComp_AMLProgramStatus",
                    fieldType: "select",
                    mandatory: ["launch", "growth"],
                    options: [
                        { label: "Formal Program", value: "formalProgram" },
                        { label: "Informal Program", value: "informalProgram" },
                        { label: "None", value: "none" }
                    ],
                    placeholder: "Formal Program"
                },
                {
                    id: "dataProtectionRegimeCoverage",
                    label: "Data Protection Regime Coverage",
                    fieldName: "cf_RiskComp_DataProtectionRegimes",
                    fieldType: "Multiline Text",
                    mandatory: ["growth", "expansion"],
                    placeholder: "ADGM DP, GDPR (limited), UAE Federal DP Law"
                }
            ]
        },

        {
            groupName: "Risk Profile",
            fields: [
                {
                    id: "overallRiskRating",
                    label: "Overall Risk Rating",
                    fieldName: "cf_RiskComp_OverallRiskRating",
                    fieldType: "select",
                    mandatory: ["growth", "transformation"],
                    options: [
                        { label: "Low", value: "low" },
                        { label: "Medium", value: "medium" },
                        { label: "High", value: "high" }
                    ],
                    placeholder: "Medium"
                },
                {
                    id: "inherentRiskLevel",
                    label: "Inherent Risk Level",
                    fieldName: "cf_RiskComp_InherentRisk",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "Low", value: "low" },
                        { label: "Medium", value: "medium" },
                        { label: "High", value: "high" }
                    ],
                    placeholder: "High"
                },
                {
                    id: "residualRiskLevel",
                    label: "Residual Risk Level",
                    fieldName: "cf_RiskComp_ResidualRisk",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "Low", value: "low" },
                        { label: "Medium", value: "medium" },
                        { label: "High", value: "high" }
                    ],
                    placeholder: "Medium"
                },
                {
                    id: "keyRiskDrivers",
                    label: "Key Risk Drivers",
                    fieldName: "cf_RiskComp_KeyRiskDrivers",
                    fieldType: "Multiline Text",
                    mandatory: ["growth", "expansion"],
                    placeholder: "High client concentration, cross-border flows"
                }
            ]
        },

        {
            groupName: "Controls & Monitoring",
            fields: [
                {
                    id: "internalControlFramework",
                    label: "Internal Control Framework",
                    fieldName: "cf_RiskComp_ControlFramework",
                    fieldType: "select",
                    mandatory: ["growth", "expansion"],
                    options: [
                        { label: "Defined", value: "defined" },
                        { label: "Defined and Implemented", value: "definedImplemented" },
                        { label: "Informal", value: "informal" }
                    ],
                    placeholder: "Defined and Implemented"
                },
                {
                    id: "independentComplianceFunction",
                    label: "Independent Compliance Function",
                    fieldName: "cf_RiskComp_IndepComplianceFn",
                    fieldType: "select",
                    mandatory: ["launch", "growth"],
                    options: [
                        { label: "In-house", value: "inHouse" },
                        { label: "Outsourced", value: "outsourced" }
                    ],
                    placeholder: "In-house"
                },
                {
                    id: "complianceReviewFrequency",
                    label: "Frequency of Compliance Reviews",
                    fieldName: "cf_RiskComp_CompReviewFreq",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "Annual", value: "annual" },
                        { label: "Semi-Annual", value: "semiAnnual" },
                        { label: "Quarterly", value: "quarterly" }
                    ],
                    placeholder: "Annual"
                },
                {
                    id: "keyComplianceSystems",
                    label: "Key Compliance Systems Used",
                    fieldName: "cf_RiskComp_CompSystems",
                    fieldType: "Multiline Text",
                    mandatory: ["growth", "expansion"],
                    placeholder: "Screening tool, transaction monitoring, KYC system"
                }
            ]
        },

        {
            groupName: "Incident History",
            fields: [
                {
                    id: "regActionsLast3Years",
                    label: "Regulatory Actions in Last 3 Years",
                    fieldName: "cf_RiskComp_RegActionsLast3Yrs",
                    fieldType: "select",
                    mandatory: ["growth", "expansion"],
                    options: [
                        { label: "None", value: "none" },
                        { label: "One", value: "one" },
                        { label: "Multiple", value: "multiple" }
                    ],
                    placeholder: "None"
                },
                {
                    id: "materialBreachesLast3Years",
                    label: "Number of Material Breaches (Last 3 Years)",
                    fieldName: "cf_RiskComp_MaterialBreaches3Yrs",
                    fieldType: "Whole Number",
                    mandatory: ["growth", "expansion"],
                    placeholder: "0"
                },
                {
                    id: "recentSignificantIncidents",
                    label: "Description of Recent Significant Incidents",
                    fieldName: "cf_RiskComp_RecentIncidents",
                    fieldType: "Multiline Text",
                    mandatory: ["growth", "expansion"],
                    placeholder: "Minor reporting delay in 2024, remediated"
                },
                {
                    id: "openRemediationActions",
                    label: "Open Remediation Actions",
                    fieldName: "cf_RiskComp_OpenRemediations",
                    fieldType: "Multiline Text",
                    mandatory: ["expansion", "optimisation"],
                    placeholder: "Enhance KYC periodic review workflow"
                }
            ]
        },

        {
            groupName: "Business Continuity",
            fields: [
                {
                    id: "bcpStatus",
                    label: "Business Continuity Plan Status",
                    fieldName: "cf_RiskComp_BCPStatus",
                    fieldType: "select",
                    mandatory: ["growth", "expansion"],
                    options: [
                        { label: "Approved", value: "approved" },
                        { label: "Approved and Tested", value: "approvedTested" },
                        { label: "Draft", value: "draft" }
                    ],
                    placeholder: "Approved and Tested"
                },
                {
                    id: "lastBCPTestDate",
                    label: "Last BCP Test Date",
                    fieldName: "cf_RiskComp_LastBCPTestDate",
                    fieldType: "Date",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "2025-05-10"
                },
                {
                    id: "criticalServicesIdentified",
                    label: "Critical Services Identified",
                    fieldName: "cf_RiskComp_CriticalServicesIdentified",
                    fieldType: "select",
                    mandatory: ["launch", "growth"],
                    options: [
                        { label: "Yes", value: "yes" },
                        { label: "No", value: "no" }
                    ],
                    placeholder: "Yes"
                },
                {
                    id: "thirdPartyDependenciesDocumented",
                    label: "Third-Party Dependencies Documented",
                    fieldName: "cf_RiskComp_ThirdPartyDepsDoc",
                    fieldType: "select",
                    mandatory: ["growth", "expansion"],
                    options: [
                        { label: "Fully", value: "fully" },
                        { label: "Partially", value: "partially" },
                        { label: "No", value: "no" }
                    ],
                    placeholder: "Partially"
                }
            ]
        },

        {
            groupName: "Metrics & Maturity",
            fields: [
                {
                    id: "trainingCompletionRate",
                    label: "Compliance Training Completion Rate (%)",
                    fieldName: "cf_RiskComp_TrainingCompletionRate",
                    fieldType: "Decimal",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "92.0"
                },
                {
                    id: "sarsFiled12Months",
                    label: "Number of SARs / STRs Filed (Last 12 Months)",
                    fieldName: "cf_RiskComp_SARCount12M",
                    fieldType: "Whole Number",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "3"
                },
                {
                    id: "riskComplianceMaturityScore",
                    label: "Risk & Compliance Maturity Score (0–100)",
                    fieldName: "cf_RiskComp_MaturityScore",
                    fieldType: "Decimal",
                    mandatory: ["all"],
                    placeholder: "81"
                }
            ]
        }
    ]
},
{
    id: "partnershipsEcosystem",
    title: "Partnerships & Ecosystem",
    groups: [
        {
            groupName: "Partner Strategy",
            fields: [
                {
                    id: "partnershipStrategyStatement",
                    label: "Partnership Strategy Statement",
                    fieldName: "cf_PartEco_Strategy",
                    fieldType: "Multiline Text",
                    mandatory: ["launch", "growth"],
                    placeholder: "Build reseller network in GCC and co-innovation with cloud hyperscalers."
                },
                {
                    id: "ecosystemObjectives",
                    label: "Ecosystem Objectives (12–24m)",
                    fieldName: "cf_PartEco_Objectives",
                    fieldType: "Multiline Text",
                    mandatory: ["growth", "expansion"],
                    placeholder: "Sign 5 MoUs; 3 co-marketing launches; 2 distributor agreements."
                }
            ]
        },

        {
            groupName: "Portfolio Snapshot",
            fields: [
                {
                    id: "activePartnerCount",
                    label: "Active Partner Count",
                    fieldName: "cf_PartEco_ActivePartnerCount",
                    fieldType: "Whole Number",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "14"
                },
                {
                    id: "agreementCount",
                    label: "MoUs / Formal Agreements Count",
                    fieldName: "cf_PartEco_AgreementCount",
                    fieldType: "Whole Number",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "7"
                },
                {
                    id: "primaryPartnerTypes",
                    label: "Primary Partner Types",
                    fieldName: "cf_PartEco_PrimaryTypes",
                    fieldType: "select-multi",
                    mandatory: ["launch", "expansion"],
                    options: [
                        { label: "Reseller", value: "reseller" },
                        { label: "Distributor", value: "distributor" },
                        { label: "Technology", value: "technology" },
                        { label: "Government", value: "government" },
                        { label: "Academic", value: "academic" }
                    ],
                    placeholder: "Reseller; Distributor; Technology; Government; Academic"
                },
                {
                    id: "geographicFocus",
                    label: "Geographic Focus",
                    fieldName: "cf_PartEco_GeoFocus",
                    fieldType: "select-multi",
                    mandatory: ["growth", "expansion"],
                    options: [
                        { label: "UAE", value: "uae" },
                        { label: "GCC", value: "gcc" },
                        { label: "MENA", value: "mena" },
                        { label: "EU", value: "eu" },
                        { label: "Global", value: "global" }
                    ],
                    placeholder: "UAE; GCC; MENA; EU; Global"
                }
            ]
        },

        {
            groupName: "Governance",
            fields: [
                {
                    id: "dueDiligenceProcess",
                    label: "Due Diligence Process",
                    fieldName: "cf_PartEco_DDProcess",
                    fieldType: "select",
                    mandatory: ["launch", "growth"],
                    options: [
                        { label: "None", value: "none" },
                        { label: "Basic", value: "basic" },
                        { label: "Formal", value: "formal" },
                        { label: "Formal+Risk Scoring", value: "formal_risk_scoring" }
                    ],
                    placeholder: "None / Basic / Formal / Formal+Risk Scoring"
                },
                {
                    id: "dataSharingAgreement",
                    label: "Data Sharing Agreement (DSA) Model",
                    fieldName: "cf_PartEco_DSAType",
                    fieldType: "select",
                    mandatory: ["growth", "expansion"],
                    options: [
                        { label: "None", value: "none" },
                        { label: "NDA Only", value: "nda" },
                        { label: "DPA+NDA", value: "dpa_nda" },
                        { label: "DPA+NDA+SCC", value: "dpa_nda_scc" }
                    ],
                    placeholder: "None / NDA Only / DPA+NDA / DPA+NDA+SCC"
                },
                {
                    id: "thirdPartyRiskTiering",
                    label: "Third-Party Risk Tiering",
                    fieldName: "cf_PartEco_RiskTiering",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "Not Applied", value: "not_applied" },
                        { label: "Basic", value: "basic" },
                        { label: "Quantified", value: "quantified" }
                    ],
                    placeholder: "Not Applied / Basic / Quantified"
                }
            ]
        },

        {
            groupName: "Operations",
            fields: [
                {
                    id: "partnerOnboardingSLA",
                    label: "Partner Onboarding SLA (days)",
                    fieldName: "cf_PartEco_OnboardSLA",
                    fieldType: "Whole Number",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "10"
                },
                {
                    id: "integrationChannel",
                    label: "Integration Channel",
                    fieldName: "cf_PartEco_IntegrationChannel",
                    fieldType: "select-multi",
                    mandatory: ["expansion", "transformation"],
                    options: [
                        { label: "API", value: "api" },
                        { label: "SFTP", value: "sftp" },
                        { label: "Portal Only", value: "portal" },
                        { label: "EDI", value: "edi" }
                    ],
                    placeholder: "API; SFTP; Portal Only; EDI"
                },
                {
                    id: "coMarketingCadence",
                    label: "Co-Marketing Cadence",
                    fieldName: "cf_PartEco_MktCadence",
                    fieldType: "select",
                    mandatory: ["growth", "expansion"],
                    options: [
                        { label: "Ad-hoc", value: "adhoc" },
                        { label: "Quarterly", value: "quarterly" },
                        { label: "Monthly", value: "monthly" }
                    ],
                    placeholder: "Ad-hoc / Quarterly / Monthly"
                }
            ]
        },

        {
            groupName: "Memberships",
            fields: [
                {
                    id: "platformMemberships",
                    label: "Platform/Cluster Memberships",
                    fieldName: "cf_PartEco_Memberships",
                    fieldType: "Multiline Text",
                    mandatory: ["growth", "expansion"],
                    placeholder: "ADGM, Dubai Chamber, KF Partner Network"
                }
            ]
        },

        {
            groupName: "Metrics",
            fields: [
                {
                    id: "activeJointProjects",
                    label: "Active Joint Projects",
                    fieldName: "cf_PartEco_ActiveProjects",
                    fieldType: "Whole Number",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "5"
                },
                {
                    id: "partnerNPS",
                    label: "Partner NPS (Last 12m)",
                    fieldName: "cf_PartEco_PartnerNPS",
                    fieldType: "Decimal",
                    mandatory: ["optimisation", "transformation"],
                    placeholder: "48"
                },
                {
                    id: "ecosystemMaturityScore",
                    label: "Ecosystem Maturity Score (0–100)",
                    fieldName: "cf_PartEco_MaturityScore",
                    fieldType: "Decimal",
                    mandatory: ["all"],
                    placeholder: "76"
                }
            ]
        },

        {
            groupName: "Compliance",
            fields: [
                {
                    id: "antiBriberyClause",
                    label: "Anti-Bribery/Corruption Clause in Templates",
                    fieldName: "cf_PartEco_ABCClause",
                    fieldType: "select",
                    mandatory: ["launch", "growth"],
                    options: [
                        { label: "Yes", value: "yes" },
                        { label: "No", value: "no" }
                    ],
                    placeholder: "Yes / No"
                },
                {
                    id: "sanctionsScreening",
                    label: "Sanctions/Watchlist Screening Applied",
                    fieldName: "cf_PartEco_Screening",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "None", value: "none" },
                        { label: "Onboarding Only", value: "onboarding" },
                        { label: "Ongoing", value: "ongoing" }
                    ],
                    placeholder: "None / Onboarding Only / Ongoing"
                }
            ]
        },

        {
            groupName: "Financials",
            fields: [
                {
                    id: "partnerRevenueContribution",
                    label: "Partner Revenue Contribution (%)",
                    fieldName: "cf_PartEco_RevenuePct",
                    fieldType: "Decimal",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "37.5"
                },
                {
                    id: "mdfBudget",
                    label: "MDF/Co-Marketing Budget (AED)",
                    fieldName: "cf_PartEco_MDF",
                    fieldType: "Currency",
                    mandatory: ["growth", "expansion"],
                    placeholder: "250000"
                }
            ]
        }
    ]
},
{
    id: "knowledgeImprovementChange",
    title: "Knowledge, Improvement & Change",
    groups: [
        {
            groupName: "Capability Strategy",
            fields: [
                {
                    id: "capabilityManagementApproach",
                    label: "Capability Management Approach",
                    fieldName: "cf_KIC_CapMgmtApproach",
                    fieldType: "select",
                    mandatory: ["launch", "growth"],
                    options: [
                        { label: "Centralised", value: "centralised" },
                        { label: "Federated", value: "federated" },
                        { label: "Hybrid", value: "hybrid" }
                    ],
                    placeholder: "Centralised / Federated / Hybrid"
                },
                {
                    id: "targetCapabilityMapVersion",
                    label: "Target Capability Map Version",
                    fieldName: "cf_KIC_CapMapVersion",
                    fieldType: "Text",
                    mandatory: ["growth", "expansion"],
                    placeholder: "CapMap v2.1 (APQC-aligned)"
                },
                {
                    id: "improvementPriorities",
                    label: "Improvement Priorities (12–24m)",
                    fieldName: "cf_KIC_ImprovementPriorities",
                    fieldType: "Multiline Text",
                    mandatory: ["growth", "expansion"],
                    placeholder: "Reduce onboarding cycle by 30%, automate QA checks."
                }
            ]
        },
        {
            groupName: "Methods & Frameworks",
            fields: [
                {
                    id: "primaryImprovementFramework",
                    label: "Primary Improvement Framework",
                    fieldName: "cf_KIC_PrimaryFramework",
                    fieldType: "select",
                    mandatory: ["launch", "optimisation"],
                    options: [
                        { label: "Lean", value: "lean" },
                        { label: "Six Sigma", value: "sixSigma" },
                        { label: "Kaizen", value: "kaizen" },
                        { label: "TPM", value: "tpm" },
                        { label: "Agile", value: "agile" }
                    ],
                    placeholder: "Lean / Six Sigma / Kaizen / TPM / Agile"
                },
                {
                    id: "changeManagementMethod",
                    label: "Change Management Method",
                    fieldName: "cf_KIC_ChangeMethod",
                    fieldType: "select",
                    mandatory: ["launch", "growth"],
                    options: [
                        { label: "ADKAR", value: "adkar" },
                        { label: "Kotter", value: "kotter" },
                        { label: "Prosci", value: "prosci" },
                        { label: "Custom", value: "custom" }
                    ],
                    placeholder: "ADKAR / Kotter / Prosci / Custom"
                },
                {
                    id: "knowledgeManagementModel",
                    label: "Knowledge Management Model",
                    fieldName: "cf_KIC_KMModel",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "Central KB", value: "centralKB" },
                        { label: "Communities", value: "communities" },
                        { label: "Both", value: "both" }
                    ],
                    placeholder: "Central KB / Communities / Both"
                }
            ]
        },
        {
            groupName: "Knowledge Assets",
            fields: [
                {
                    id: "knowledgeBasePlatform",
                    label: "Knowledge Base Platform",
                    fieldName: "cf_KIC_KBPlatform",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "SharePoint", value: "sharepoint" },
                        { label: "Confluence", value: "confluence" },
                        { label: "Wiki.js", value: "wikijs" },
                        { label: "Other", value: "other" }
                    ],
                    placeholder: "SharePoint / Confluence / Wiki.js / Other"
                },
                {
                    id: "curatedPlaybooksSOPs",
                    label: "# Curated Playbooks/ SOPs",
                    fieldName: "cf_KIC_PlaybookCount",
                    fieldType: "Whole Number",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "28"
                },
                {
                    id: "reuseRate",
                    label: "Reuse Rate (% KB articles used monthly)",
                    fieldName: "cf_KIC_ReuseRate",
                    fieldType: "Decimal",
                    mandatory: ["optimisation", "transformation"],
                    placeholder: "63.5"
                }
            ]
        },
        {
            groupName: "Initiative Portfolio",
            fields: [
                {
                    id: "activeImprovementInitiatives",
                    label: "Active Improvement Initiatives",
                    fieldName: "cf_KIC_ActiveInitiatives",
                    fieldType: "Whole Number",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "7"
                },
                {
                    id: "portfolioGovernanceCadence",
                    label: "Portfolio Governance Cadence",
                    fieldName: "cf_KIC_GovernanceCadence",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "Monthly", value: "monthly" },
                        { label: "Quarterly", value: "quarterly" }
                    ],
                    placeholder: "Monthly / Quarterly"
                },
                {
                    id: "benefitsTrackingMethod",
                    label: "Benefits Tracking Method",
                    fieldName: "cf_KIC_BenefitsTracking",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "KPI Ledger", value: "kpiLedger" },
                        { label: "Business Case", value: "businessCase" },
                        { label: "None", value: "none" }
                    ],
                    placeholder: "KPI Ledger / Business Case / None"
                }
            ]
        },
        {
            groupName: "Training & Enablement",
            fields: [
                {
                    id: "ldPlatform",
                    label: "L&D Platform",
                    fieldName: "cf_KIC_LDPlatform",
                    fieldType: "select",
                    mandatory: ["growth", "expansion"],
                    options: [
                        { label: "LMS", value: "lms" },
                        { label: "Off-platform", value: "offPlatform" },
                        { label: "Mixed", value: "mixed" }
                    ],
                    placeholder: "LMS / Off-platform / Mixed"
                },
                {
                    id: "avgTrainingHoursFTE",
                    label: "Avg. Training Hours / FTE (12m)",
                    fieldName: "cf_KIC_TrainingHoursFTE",
                    fieldType: "Decimal",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "14.2"
                },
                {
                    id: "certificationFocusAreas",
                    label: "Certification Focus Areas",
                    fieldName: "cf_KIC_CertFocus",
                    fieldType: "Multiline Text",
                    mandatory: ["growth", "expansion"],
                    placeholder: "PMP, ITIL, Azure, Data Analytics"
                }
            ]
        },
        {
            groupName: "Change Execution",
            fields: [
                {
                    id: "releaseChangeBoardEstablished",
                    label: "Release/Change Board Established",
                    fieldName: "cf_KIC_ChangeBoard",
                    fieldType: "select",
                    mandatory: ["launch", "growth"],
                    options: [
                        { label: "Yes", value: "yes" },
                        { label: "No", value: "no" }
                    ],
                    placeholder: "Yes / No"
                },
                {
                    id: "changeFailureRate",
                    label: "Change Failure Rate (%)",
                    fieldName: "cf_KIC_ChangeFailureRate",
                    fieldType: "Decimal",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "6.8"
                },
                {
                    id: "adoptionMeasurement",
                    label: "Adoption Measurement",
                    fieldName: "cf_KIC_AdoptionMeasure",
                    fieldType: "select",
                    mandatory: ["growth", "optimisation"],
                    options: [
                        { label: "Surveys", value: "surveys" },
                        { label: "Telemetry", value: "telemetry" },
                        { label: "Hybrid", value: "hybrid" }
                    ],
                    placeholder: "Surveys / Telemetry / Hybrid"
                }
            ]
        },
        {
            groupName: "KPIs & Maturity",
            fields: [
                {
                    id: "continuousImprovementSavings",
                    label: "Continuous Improvement Savings (AED, 12m)",
                    fieldName: "cf_KIC_CISavings",
                    fieldType: "Currency",
                    mandatory: ["optimisation", "transformation"],
                    placeholder: "420000"
                },
                {
                    id: "processCycleTimeImprovement",
                    label: "Process Cycle-Time Improvement (%)",
                    fieldName: "cf_KIC_CycleTimeImprove",
                    fieldType: "Decimal",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "22"
                },
                {
                    id: "changeSuccessRate",
                    label: "Change Success Rate (%)",
                    fieldName: "cf_KIC_ChangeSuccessRate",
                    fieldType: "Decimal",
                    mandatory: ["growth", "optimisation"],
                    placeholder: "91"
                },
                {
                    id: "kicMaturityScore",
                    label: "KIC Maturity Score (0–100)",
                    fieldName: "cf_KIC_MaturityScore",
                    fieldType: "Decimal (0–100)",
                    mandatory: ["launch", "growth", "optimisation", "expansion", "transformation", "mature", "enterprise"],
                    placeholder: "78"
                }
            ]
        }
    ]
}
    ],
};

// Helper function to get section metadata for sidebar and overview
export const getSectionsMetadata = () => {
    return profileConfig.tabs.map((tab) => ({
        id: tab.id,
        title: tab.title,
    }));
};

// Get section configuration by ID
export const getSectionConfigById = (sectionId) => {
    return profileConfig.tabs.find((tab) => tab.id === sectionId);
};

// Check if a field is mandatory for a given company stage
// export const isFieldMandatory = (field, companyStage) => {
//   return field.mandatory && field.mandatory.includes(companyStage);
// };
// config.ts: isFieldMandatory
export const isFieldMandatory = (field, companyStage) => {
    // 1. Check if the 'mandatory' property exists.
    if (!field.mandatory) {
        return false;
    }

    // 2. If 'mandatory' is a boolean, return its value (true means mandatory for all stages).
    // This covers your case where mandatory: true or mandatory: false was used.
    if (typeof field.mandatory === 'boolean') {
        return field.mandatory;
    }

    // 3. If 'mandatory' is an array (the expected list of stages),
    // check if the current companyStage is included in the array.
    if (Array.isArray(field.mandatory)) {
        return field.mandatory.includes(companyStage);
    }

    // Default to false if the type is unexpected
    return false;
};

// Get company stage information by ID
export const getCompanyStageById = (stageId) => {
    return profileConfig.companyStages.find((stage) => stage.id === stageId);
};

// Get all mandatory fields for a given company stage
export const getMandatoryFieldsForStage = (stageId) => {
    const mandatoryFields: any = [];
    profileConfig.tabs.forEach((tab) => {
        tab.groups.forEach((group) => {
            group.fields.forEach((field) => {
                if (isFieldMandatory(field, stageId)) {
                    mandatoryFields.push({
                        tabId: tab.id,
                        groupName: group.groupName,
                        ...field,
                    } as any);
                }
            });
        });
    });
    return mandatoryFields;
};


export const checkMandatoryFieldsCompletion = (profileData, companyStage) => {
    const mandatoryFields = getMandatoryFieldsForStage(companyStage);
    const missingFields: any = [];

    mandatoryFields.forEach((field) => {
        const sectionData = profileData.sections[field.tabId];

        // Safety check: ensure the section data and fields exist
        if (!sectionData || !sectionData.fields) {
            missingFields.push(field);
            return;
        }

        const value = sectionData.fields[field.fieldName];
        let isMissing = false;

        // --- Core Fix ---
        if (typeof value === 'string') {
            // 1. If it's a string (Text, Multiline, Date, etc.), check if it's empty after trimming
            isMissing = value.trim() === "";
        } else if (Array.isArray(value)) {
            // 2. If it's an array (Multiselect), check if it's empty
            isMissing = value.length === 0;
        } else if (value === null || value === undefined) {
            // 3. If it's null or undefined (often how empty number/select fields are stored)
            isMissing = true;
        }
        // Note: For Numbers, if the value is 0, it will evaluate to false (not missing),
        // which is usually correct unless 0 is logically considered "not provided" for a field.

        // If the data exists and is a number, it will pass the checks above (unless it's null/undefined).
        // The previous error came from applying .trim() to a non-string. This logic avoids that.

        if (isMissing) {
            missingFields.push(field);
        }
    });


    return {
        total: mandatoryFields.length,
        completed: mandatoryFields.length - missingFields.length,
        missing: missingFields,
    };
};