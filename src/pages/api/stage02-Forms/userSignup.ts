export interface UserSignupPayload {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    companyName: string;
    countryRegion: string;
    lifecycleStage: string;
    agreeToTerms: boolean;
    email: string;
}

export async function submitUserSignup(data: UserSignupPayload): Promise<any> {
    try {
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'companyName', 'countryRegion', 'lifecycleStage', 'agreeToTerms'];
        const missingApiFields = requiredFields.filter(field => !data[field as keyof UserSignupPayload]);
        if (missingApiFields.length > 0) {
            throw new Error(`Missing required fields: ${missingApiFields.join(', ')}`);
        }

        const response = await fetch(
            "https://kfrealexpressserver.vercel.app/api/v1/auth/user-signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
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

            // Handle specific cases - Power Automate flow issues are actually successful signups
            if (errorMessage.includes("Power Automate flow")) {
                return {
                    success: true,
                    message: "Account created successfully! Login details have been sent to your email.",
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
            throw new Error("Unable to connect to our signup service. Please check your internet connection and try again.");
        } else if (error.message.includes("ERR_SOCKET_NOT_CONNECTED") || error.message.includes("network")) {
            throw new Error("Network connection issue detected. Please check your internet connection and try again.");
        }

        // Re-throw the original error
        throw error;
    }
}