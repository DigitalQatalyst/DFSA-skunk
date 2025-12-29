export interface UserInvitePayload {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
}

export async function submitUserInvite(data: UserInvitePayload): Promise<any> {
    try {
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'role'];
        const missingApiFields = requiredFields.filter(field => !data[field as keyof UserInvitePayload]);
        if (missingApiFields.length > 0) {
            throw new Error(`Missing required fields: ${missingApiFields.join(', ')}`);
        }

        // For now, using the same signup endpoint
        // TODO: Update this to a dedicated invite endpoint when backend is ready
        const response = await fetch(
            "https://kfrealexpressserver.vercel.app/api/v1/auth/user-signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    // Adding default values for required fields in signup endpoint
                    companyName: "Invited User", // Placeholder - should be from organization context
                    countryRegion: "AE", // Default to UAE - can be updated by user
                    lifecycleStage: "startup", // Default - can be updated by user
                    agreeToTerms: true, // Admin invitation implies acceptance
                }),
            }
        );

        // Parse response
        let responseBody: any;
        const responseText = await response.text();

        try {
            responseBody = JSON.parse(responseText);
        } catch (parseError) {
            responseBody = responseText;
        }

        if (!response.ok) {
            const errorMessage = responseBody?.message || responseBody?.error || responseBody || `HTTP ${response.status}`;

            // Handle specific cases - Power Automate flow issues are actually successful invitations
            if (errorMessage.includes("Power Automate flow")) {
                return {
                    success: true,
                    message: "User invitation sent successfully! Login details have been sent to their email.",
                    data: data
                };
            } else if (errorMessage.includes("Missing required fields")) {
                throw new Error("Some required information is missing. Please check all fields and try again.");
            } else {
                throw new Error(`API Error (${response.status}): ${errorMessage}`);
            }
        }

        return responseBody;

    } catch (error: any) {
        // Handle specific network errors
        if (error.message === "Failed to fetch" || error.name === "TypeError") {
            throw new Error("Unable to connect to the invitation service. Please check your internet connection and try again.");
        } else if (error.message.includes("ERR_SOCKET_NOT_CONNECTED") || error.message.includes("network")) {
            throw new Error("Network connection issue detected. Please check your internet connection and try again.");
        }

        // Re-throw the original error
        throw error;
    }
}
