export interface RequestMembershipPayload {
    azureId: string;
    name: string;
    submittedBy: string;
    emailAddress1: string;
    serviceName: string;
    category: string;
    status: string;
    serviceProvider: string;
}

export async function submitRequestMembership(data: RequestMembershipPayload): Promise<any> {
    try {
        const response = await fetch(
            "https://kfrealexpressserver.vercel.app/api/v1/membership/request-membership",
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
        console.error("submitRequestMembership error:", error.message);
        throw new Error("Failed to submit membership request. Please try again.");
    }
}
