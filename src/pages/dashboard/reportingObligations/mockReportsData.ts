export const mockReportData = {
  // Summary data for KPIs
  summaryData: {
    totalReports: 32,
    completed: 24,
    pending: 6,
    overdue: 2,
    complianceRate: 88,
  },
  // Upcoming obligations
  upcomingObligations: [
    {
      id: "1",
      name: "Quarterly Financial Statement",
      dueDate: "2025-12-15",
      status: "Due Soon",
      assignedTo: "John Smith",
      type: "Financial",
    },
    {
      id: "2",
      name: "Annual Environmental Compliance Report",
      dueDate: "2025-12-31",
      status: "Upcoming",
      assignedTo: "Sarah Johnson",
      type: "Environmental",
    },
    {
      id: "3",
      name: "Employee Health & Safety Assessment",
      dueDate: "2025-11-30",
      status: "Upcoming",
      assignedTo: "Ahmed Al Mansoori",
      type: "Compliance",
    },
    {
      id: "4",
      name: "Regulatory Capital Adequacy Report",
      dueDate: "2025-12-20",
      status: "Upcoming",
      assignedTo: "Fatima Al Zaabi",
      type: "Regulatory",
    },
    {
      id: "5",
      name: "Data Protection Compliance Audit",
      dueDate: "2025-12-10",
      status: "Due Soon",
      assignedTo: "Michael Chen",
      type: "Compliance",
    },
  ],
  // Submitted reports
  submittedReports: [
    {
      id: "1",
      name: "Q3 Financial Statement",
      type: "Financial",
      status: "Approved",
      submittedDate: "2025-09-15",
      reviewer: "ADGM Financial Authority",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/q3-financial.pdf",
    },
    {
      id: "2",
      name: "Anti-Money Laundering Compliance",
      type: "Regulatory",
      status: "Approved",
      submittedDate: "2025-08-30",
      reviewer: "Financial Services Regulatory Authority",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/aml-compliance.pdf",
    },
    {
      id: "3",
      name: "Employee Diversity Report",
      type: "Operational",
      status: "Pending Review",
      submittedDate: "2025-10-05",
      reviewer: "Ministry of Human Resources",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/diversity.pdf",
    },
    {
      id: "4",
      name: "Carbon Footprint Assessment",
      type: "Environmental",
      status: "Approved",
      submittedDate: "2025-07-22",
      reviewer: "Environment Agency Abu Dhabi",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/carbon-footprint.pdf",
    },
    {
      id: "5",
      name: "Data Security Incident Report",
      type: "Compliance",
      status: "Rejected",
      submittedDate: "2025-09-28",
      reviewer: "ADGM Data Protection Commissioner",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/security-incident.pdf",
    },
    {
      id: "6",
      name: "Corporate Governance Statement",
      type: "Regulatory",
      status: "Approved",
      submittedDate: "2025-06-15",
      reviewer: "ADGM Registration Authority",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/governance.pdf",
    },
    {
      id: "7",
      name: "Q2 Financial Statement",
      type: "Financial",
      status: "Approved",
      submittedDate: "2025-06-15",
      reviewer: "ADGM Financial Authority",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/q2-financial.pdf",
    },
  ],
  // Received reports
  receivedReports: [
    {
      id: "1",
      title: "Industry Compliance Standards Update",
      source: "ADGM Financial Services Regulatory Authority",
      receivedDate: "2025-10-09",
      priority: "High",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/industry-standards.pdf",
    },
    {
      id: "2",
      title: "Market Risk Assessment",
      source: "Central Bank of UAE",
      receivedDate: "2025-10-06",
      priority: "Medium",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/market-risk.pdf",
    },
    {
      id: "3",
      title: "Quarterly Economic Outlook",
      source: "Abu Dhabi Department of Economic Development",
      receivedDate: "2025-10-04",
      priority: "Low",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/economic-outlook.pdf",
    },
    {
      id: "4",
      title: "Cybersecurity Threat Advisory",
      source: "UAE Computer Emergency Response Team",
      receivedDate: "2025-10-02",
      priority: "High",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/cybersecurity-advisory.pdf",
    },
  ],
  // Document wallet integration
  reportDocuments: [
    {
      id: "1",
      name: "Q3 Financial Statement.pdf",
      category: "Financial",
      fileType: "pdf",
      fileSize: "2.4 MB",
      uploadDate: "2025-09-15",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/q3-financial.pdf",
    },
    {
      id: "2",
      name: "Anti-Money Laundering Compliance.pdf",
      category: "Regulatory",
      fileType: "pdf",
      fileSize: "3.1 MB",
      uploadDate: "2025-08-30",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/aml-compliance.pdf",
    },
    {
      id: "3",
      name: "Employee Diversity Report.xlsx",
      category: "Operational",
      fileType: "excel",
      fileSize: "1.8 MB",
      uploadDate: "2025-10-05",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/diversity.xlsx",
    },
    {
      id: "4",
      name: "Carbon Footprint Assessment.pdf",
      category: "Environmental",
      fileType: "pdf",
      fileSize: "4.2 MB",
      uploadDate: "2025-07-22",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/carbon-footprint.pdf",
    },
    {
      id: "5",
      name: "Data Security Incident Report.pdf",
      category: "Compliance",
      fileType: "pdf",
      fileSize: "1.5 MB",
      uploadDate: "2025-09-28",
      fileUrl:
        "https://example.com/dashboard/reporting-obligations/security-incident.pdf",
    },
  ],
};
