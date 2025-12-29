export interface CollateralUserGuidePayload {
    azureId: string;
    name: string;
    submittedBy: string;
    emailAddress: string;
    telephoneNumber: string;
    companyName: string;
    companyNumber: string;
    position: string;
    assetName: string;
    assetNumber: string;
    additionalDetails: string;
    serviceName: string;
    category: string;
    status: string;
    serviceProvider: string;
}

export async function submitCollateralUserGuide(
    data: CollateralUserGuidePayload
): Promise<any> {
    try {
        const response = await fetch(
            "https://kfrealexpressserver.vercel.app/api/v1/collateral/create-collateraluserguide",
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
        console.error("submitCollateralUserGuide error:", error.message);
        throw new Error(
            "Failed to submit collateral user guide. Please try again."
        );
    }
}
