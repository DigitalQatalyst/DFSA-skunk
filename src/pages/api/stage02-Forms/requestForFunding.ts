import { API_BASE_URL } from "../../../config/apiBase";

export interface RequestForFundingPayload {
    name: string;
    submittedBy: string;
    emailAddress: string;
    telephoneNumber: string;
    azureId: string;
    companyName: string;
    companyNumber: string;
    position: string;
    pleaseSelectTheFundingProgramYouWantToApply: string;
    projectName: string;
    currentInvestment: number;
    loanAmount: number;
    minContribution: number;
    TradeLicence: string;
    scoredReport: string;
    consentAcknowledgement: string;
    fundingProgram: string;
}

export async function submitRequestForFunding(data: RequestForFundingPayload): Promise<any> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/funding/requestfunding`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${errorText}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error("submitRequestForFunding error:", error.message);
        throw new Error("Failed to submit funding request. Please try again.");
    }
}



