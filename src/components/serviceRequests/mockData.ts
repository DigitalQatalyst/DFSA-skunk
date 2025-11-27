import { ServiceRequest } from "../../types";

export const mockServiceRequests: ServiceRequest[] = [
  {
    id: "sr-001",
    serviceName: "SME Loan Reallocation",
    category: "Financial",
    status: "approved",
    submittedDate: "2025-10-01T10:30:00Z",
    sla: 3,
    serviceProvider: "Khalifa Fund",
    description:
      "Request to reallocate approved loan funds to different areas of business to support changing needs and enhance operations.",
    requestedBy: {
      id: "user-123",
      name: "John Smith",
      email: "john.smith@company.com",
      department: "Marketing",
    },
    approvers: [
      {
        id: "user-456",
        name: "Sarah Johnson",
        role: "IT Manager",
        status: "approved",
        date: "2025-02-16T14:22:00Z",
        comments: "Approved as per current policy guidelines.",
      },
    ],
  },
  {
    id: "sr-002",
    serviceName: "Equity-Based Funding Opportunities",
    category: "Financial",
    status: "under-review",
    submittedDate: "2025-03-18T09:15:00Z",
    sla: 5,
    serviceProvider: "Khalifa Fund",
    description:
      "Request to connect SME with potential investors for equity funding to support business growth and expansion.",
    requestedBy: {
      id: "user-789",
      name: "Emily Davis",
      email: "emily.davis@company.com",
      department: "Human Resources",
    },
    approvers: [
      {
        id: "user-012",
        name: "Michael Wilson",
        role: "Department Head",
        status: "approved",
        date: "2025-03-19T11:05:00Z",
      },
      {
        id: "user-345",
        name: "Jennifer Lee",
        role: "IT Security",
        status: "pending",
      },
    ],
  },
  {
    id: "sr-003",
    serviceName: "Water Management System Enhancement Fund",
    category: "Financial",
    status: "rejected",
    submittedDate: "2025-01-10T14:45:00Z",
    serviceProvider: "Khalifa Fund",
    description:
      "Request for financial support to invest in efficient water management solutions, promoting sustainability and resource conservation.",
    requestedBy: {
      id: "user-678",
      name: "Robert Brown",
      email: "robert.brown@company.com",
      department: "Design",
    },
    approvers: [
      {
        id: "user-901",
        name: "Patricia Garcia",
        role: "Finance Director",
        status: "rejected",
        date: "2025-01-12T16:30:00Z",
        comments: "Budget constraints. Please resubmit in Q1 2024.",
      },
    ],
  },
  {
    id: "sr-004",
    serviceName: "Net House Development Fund",
    category: "Financial",
    status: "under-review",
    submittedDate: "2025-05-20T08:00:00Z",
    serviceProvider: "Khalifa Fund",
    description:
      "Request for funding to construct protective structures for crop cultivation in agribusiness, enhancing productivity and protecting crops.",
    requestedBy: {
      id: "user-234",
      name: "David Martinez",
      email: "david.martinez@company.com",
      department: "Engineering",
    },
  },
  {
    id: "sr-005",
    serviceName: "Supplier & Vendor Support Incentives",
    category: "Non-Financial",
    status: "approved",
    submittedDate: "2025-04-05T11:20:00Z",
    sla: 2,
    serviceProvider: "Fujarah",
    description:
      "Supplier List Registration Fee Exemptions | Priority Access to Vendor Contracts | Supplier and Vendor Network Opportunities| Discounted Supplier Event Access.",
    requestedBy: {
      id: "user-567",
      name: "Lisa Taylor",
      email: "lisa.taylor@company.com",
      department: "Finance",
    },
    approvers: [
      {
        id: "user-890",
        name: "James Wilson",
        role: "Security Officer",
        status: "approved",
        date: "2025-04-06T09:15:00Z",
      },
    ],
  },
  {
    id: "sr-006",
    serviceName: "Pack House and Infrastructure Development",
    category: "Financial",
    status: "under-review",
    submittedDate: "2025-06-17T13:45:00Z",
    sla: 7,
    serviceProvider: "Khalifa Fund",
    description:
      "Request for funding to develop processing and storage infrastructure, enhancing efficiency and capacity within the agricultural sector.",
    requestedBy: {
      id: "user-123",
      name: "John Smith",
      email: "john.smith@company.com",
      department: "Marketing",
    },
    approvers: [
      {
        id: "user-456",
        name: "Sarah Johnson",
        role: "Department Manager",
        status: "approved",
        date: "2025-06-18T10:30:00Z",
      },
      {
        id: "user-901",
        name: "Patricia Garcia",
        role: "Finance Director",
        status: "pending",
      },
    ],
  },
  {
    id: "sr-007",
    serviceName: "Tax & Financial Incentives",
    category: "Non-Financial",
    status: "approved",
    submittedDate: "2025-01-25T15:30:00Z",
    serviceProvider: "Khalifa Fund",
    description:
      "Exemption from Corporate Tax for Startups | Discounted VAT Exemption | Grants for R&D Initiatives.",
    requestedBy: {
      id: "user-678",
      name: "Robert Brown",
      email: "robert.brown@company.com",
      department: "IT",
    },
    approvers: [
      {
        id: "user-012",
        name: "Michael Wilson",
        role: "CTO",
        status: "approved",
        date: "2025-01-27T09:20:00Z",
        comments: "Approved as part of our technical upskilling initiative.",
      },
    ],
  },
  {
    id: "sr-008",
    serviceName: "Tender & Procurement Incentives",
    category: "Non-Financial",
    status: "rejected",
    submittedDate: "2025-03-08T10:15:00Z",
    serviceProvider: "Khalifa Fund",
    description:
      "Exemption from Tender Registration | Tender Submission Fee Discounts.",
    requestedBy: {
      id: "user-234",
      name: "David Martinez",
      email: "david.martinez@company.com",
      department: "Product Development",
    },
    approvers: [
      {
        id: "user-901",
        name: "Patricia Garcia",
        role: "Finance Director",
        status: "rejected",
        date: "2025-03-10T14:25:00Z",
        comments: "Need more detailed justification and ROI analysis.",
      },
    ],
  },
  {
    id: "sr-009",
    serviceName: "Expansion Loan",
    category: "Financial",
    status: "approved",
    submittedDate: "2025-07-19T09:30:00Z",
    sla: 1,
    serviceProvider: "Khalifa Fund",
    description:
      "Request for financing to scale operations, expand facilities, or enter new markets, supporting business growth and strategic expansion.",
    requestedBy: {
      id: "user-567",
      name: "Lisa Taylor",
      email: "lisa.taylor@company.com",
      department: "Operations",
    },
    approvers: [
      {
        id: "user-345",
        name: "Jennifer Lee",
        role: "Office Manager",
        status: "approved",
        date: "2025-07-19T10:45:00Z",
      },
    ],
  },
  {
    id: "sr-010",
    serviceName: "Registration Fee Exemptions Incentives",
    category: "Non-Financial",
    status: "under-review",
    submittedDate: "2025-08-14T16:00:00Z",
    sla: 10,
    serviceProvider: "AbuDhabi Chamber",
    description:
      "Exemption from Licensing Fees | Exemption from Registration Fees.",
    requestedBy: {
      id: "user-123",
      name: "John Smith",
      email: "john.smith@company.com",
      department: "Marketing",
    },
    approvers: [
      {
        id: "user-012",
        name: "Michael Wilson",
        role: "CMO",
        status: "pending",
      },
      {
        id: "user-901",
        name: "Patricia Garcia",
        role: "Finance Director",
        status: "pending",
      },
    ],
  },
  {
    id: "sr-011",
    serviceName: "Trade Facilitation & Export Documentation",
    category: "Non-Financial",
    status: "approved",
    submittedDate: "2025-04-12T11:20:00Z",
    sla: 3,
    serviceProvider: "Fujarah",
    description:
      "Export Documentation Services | Customs Clearance Assistance | Trade Compliance Consulting | Export Licensing Support.",
    requestedBy: {
      id: "user-789",
      name: "Emily Davis",
      email: "emily.davis@company.com",
      department: "Sales",
    },
    approvers: [
      {
        id: "user-890",
        name: "James Wilson",
        role: "Data Protection Officer",
        status: "approved",
        date: "2025-04-13T14:10:00Z",
        comments: "Approved with standard access level.",
      },
    ],
  },
  {
    id: "sr-012",
    serviceName: "Tax Compliance & Advisory",
    category: "Non-Financial",
    status: "under-review",
    submittedDate: "2025-09-20T13:45:00Z",
    serviceProvider: "Khalifa Fund",
    description: "Tax Advisory | Tax Filing Services | Tax Planning.",
    requestedBy: {
      id: "user-234",
      name: "David Martinez",
      email: "david.martinez@company.com",
      department: "Quality Assurance",
    },
  },
  {
    id: "sr-013",
    serviceName: "Request to Cancel Loan",
    category: "Financial",
    status: "draft",
    submittedDate: "2025-09-30T13:45:00Z",
    serviceProvider: "Khalifa Fund",
    description:
      "Explore easy ways to cancel your loan if circumstances necessitate.",
    requestedBy: {
      id: "user-432",
      name: "David Gutierrez",
      email: "david.guti@company.com",
      department: "Marketing",
    },
  },
  {
    id: "sr-014",
    serviceName: "Release Collateral for the Funded Project Assets",
    category: "Financial",
    status: "under-review",
    submittedDate: "2025-09-28T10:15:00Z",
    sla: 5,
    serviceProvider: "Khalifa Fund",
    description:
      "Allows for the release of collateral once the funded project assets meet agreed-upon criteria.",
    requestedBy: {
      id: "user-567",
      name: "Lisa Taylor",
      email: "lisa.taylor@company.com",
      department: "Operations",
    },
    approvers: [
      {
        id: "user-901",
        name: "Patricia Garcia",
        role: "Finance Director",
        status: "approved",
        date: "2025-08-29T15:20:00Z",
        comments:
          "Project milestones verified. Approved for collateral release processing.",
      },
      {
        id: "user-456",
        name: "Sarah Johnson",
        role: "IT Manager",
        status: "pending",
      },
    ],
  },
  {
    id: "sr-015",
    serviceName: "Loan Amendment Service",
    category: "Financial",
    status: "approved",
    submittedDate: "2025-10-05T14:30:00Z",
    sla: 4,
    serviceProvider: "Khalifa Fund",
    description:
      "Through this service, you can request modifications to an existing loan, such as requesting a rescheduling of the loan by changing the grace period and/or repayment period and requesting the addition/cancellation of a partner.",
    requestedBy: {
      id: "user-123",
      name: "John Smith",
      email: "john.smith@company.com",
      department: "Marketing",
    },
    approvers: [
      {
        id: "user-901",
        name: "Patricia Garcia",
        role: "Finance Director",
        status: "approved",
        date: "2025-07-06T11:45:00Z",
        comments:
          "Loan amendment terms reviewed and approved. Grace period extended by 3 months.",
      },
    ],
  },
  {
    id: "sr-016",
    serviceName: "SME Loan Disbursement",
    category: "Financial",
    status: "under-review",
    submittedDate: "2025-10-03T09:20:00Z",
    sla: 3,
    serviceProvider: "Khalifa Fund",
    description:
      "Through this service you can request loan disbursement orders, according to the cash flow.",
    requestedBy: {
      id: "user-789",
      name: "Emily Davis",
      email: "emily.davis@company.com",
      department: "Human Resources",
    },
    approvers: [
      {
        id: "user-901",
        name: "Patricia Garcia",
        role: "Finance Director",
        status: "pending",
      },
      {
        id: "user-012",
        name: "Michael Wilson",
        role: "Department Head",
        status: "pending",
      },
    ],
  },
  {
    id: "sr-017",
    serviceName: "Khalifa Fund Membership Subscription",
    category: "Non-Financial",
    status: "draft",
    submittedDate: "2025-10-10T10:45:00Z",
    sla: 2,
    serviceProvider: "Khalifa Fund",
    description:
      "Through this service, Entrepreneurs gain exclusive access to funding opportunities, business resources, and tailored support to help their business grow and thrive through Khalifa Fund Membership. Note: Costs include AED 2000 for issue date of 2 years and above, and AED 500 for a new trade licence.",
    requestedBy: {
      id: "user-678",
      name: "Robert Brown",
      email: "robert.brown@company.com",
      department: "Design",
    },
    approvers: [
      {
        id: "user-456",
        name: "Sarah Johnson",
        role: "IT Manager",
        status: "approved",
        date: "2025-05-15T13:30:00Z",
        comments:
          "Membership benefits align with company growth objectives. Approved.",
      },
    ],
  },
];

export const serviceCategories = ["Financial", "Non-Financial"];
