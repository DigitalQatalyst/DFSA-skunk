export interface BookConsultationPayload {
    azureId: string;
    name: string;
    submittedBy: string;
    emailAddress1: string;
    mobileNumber: string;
    position: string;
    companyName: string;
    compannyNumber: string;
    consultationType: string;
    consultationName: string;
    existingBusiness: string;
    businessOwnership: string;
    worksHere: string;
    selectedAdvice: string;
    otherAdvices: string;
}

export async function submitBookConsultation(data: BookConsultationPayload): Promise<any> {
    try {
        const response = await fetch(
            "https://kfrealexpressserver.vercel.app/api/v1/consultation/book-consultation",
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
        console.error("submitBookConsultation error:", error.message);
        throw new Error("Failed to submit consultation booking. Please try again.");
    }
}
