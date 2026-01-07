import { API_BASE_URL } from '../../../config/apiBase';

// Helper function to save Vision & Strategy section
export async function saveVisionStrategySection(accountId: string, sectionData: any) {
    const response = await fetch(`${API_BASE_URL}/vision/visionstrategy`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            account: accountId,
            ...sectionData // This spreads all the field values
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to save Vision & Strategy: ${response.status}`);
    }

    return await response.json();
}

export async function saveProductsSection(accountId: string, sectionData: any) {
    const response = await fetch(`${API_BASE_URL}/form/productsandinnovation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ account: accountId, ...sectionData }),
    });

    if (!response.ok) throw new Error(`Failed to save Products: ${response.status}`);
    return await response.json();
}


export async function saveSalesSection(accountId: string, sectionData: any) {
    const response = await fetch(`${API_BASE_URL}/form/salesmarketing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ account: accountId, ...sectionData }),
    });

    if (!response.ok) throw new Error(`Failed to save Sales section: ${response.status}`);
    return await response.json();
}


//Helper function to save Supply and Logistics Section
export async function saveSupplyAndLogisticsSection(accountId: string, sectionData: any) {
    const response = await fetch(`${API_BASE_URL}/form/salesmarketing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ account: accountId, ...sectionData }),
    });

    if (!response.ok) throw new Error(`Failed to save Supply and Logistics: ${response.status}`);
    return await response.json();
}



//Helper function to save Customer Experience Section
export async function saveCustomerExperienceSection(accountId: string, sectionData: any) {
    const response = await fetch(`${API_BASE_URL}/form/salesmarketing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ account: accountId, ...sectionData }),
    });

    if (!response.ok) throw new Error(`Failed to save Customer Experience: ${response.status}`);
    return await response.json();
}



//Helper function to save Service Requests Section
export async function saveServiceRequestsSection(accountId: string, sectionData: any) {
    const response = await fetch(`${API_BASE_URL}/form/salesmarketing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ account: accountId, ...sectionData }),
    });

    if (!response.ok) throw new Error(`Failed to save Service Requests: ${response.status}`);
    return await response.json();
}



//Helper function to save People and Governance Section
export async function savePeopleAndGovernanceSection(accountId: string, sectionData: any) {
    const response = await fetch(`${API_BASE_URL}/form/salesmarketing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ account: accountId, ...sectionData }),
    });

    if (!response.ok) throw new Error(`Failed to save People and Governance: ${response.status}`);
    return await response.json();
}
