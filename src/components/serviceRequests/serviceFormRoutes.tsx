// serviceFormRoutes.ts
// Map service names to their edit form routes

export const serviceFormRoutes: Record<string, string> = {
  // Financial Services
  "SME Loan Reallocation": "",
  "Equity-Based Funding Opportunities": "",
  "Water Management System Enhancement Fund": "",
  "Net House Development Fund": "",
  "Pack House and Infrastructure Development": "",
  "Expansion Loan": "",
  "Request to Cancel Loan": "/forms/cancel-loan",
  "Release Collateral for the Funded Project Assets": "",
  "Loan Amendment Service": "/forms/request-to-amend-existing-loan-details",
  "SME Loan Disbursement": "/forms/disburse-approved-loan",

  // Non-Financial Services
  "Supplier & Vendor Support Incentives": "",
  "Tax & Financial Incentives": "",
  "Tender & Procurement Incentives": "",
  "Registration Fee Exemptions Incentives": "",
  "Trade Facilitation & Export Documentation": "",
  "Tax Compliance & Advisory": "",
  "Khalifa Fund Membership Subscription": "/forms/request-for-membership",
};

// Helper function to get the edit route for a service
export const getServiceEditRoute = (
  serviceName: string,
  requestId: string
): string => {
  const baseRoute = serviceFormRoutes[serviceName];

  if (!baseRoute) {
    console.warn(`No route mapping found for service: ${serviceName}`);
    return "#"; // Return hash as fallback
  }

  // Append the request ID to the route for editing
  return `${baseRoute}?requestId=${requestId}`;
};
