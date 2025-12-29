export interface CancelLoanPayload {
  azureId: string;
git   sequenceNumber: string;
  name: string;
  submittedBy: string;
  emailAddress: string;
  telephoneNumber: string;
  companyName: string;
  companyNumber: string;
  position: string;
  fundingNumber: string;
  cancellationDetails: string;
  consentAcknowledgement: string;
}

export async function submitCancelLoan(data: CancelLoanPayload): Promise<any> {
  try {
    const response = await fetch(
      "https://kfrealexpressserver.vercel.app/api/v1/loan/cancel-loan",
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

    return await response.json()
  } catch (error: unknown) {
    console.error("submitCancelLoan error:", error.message);
    throw new Error("Failed to submit loan cancellation. Please try again.");
  }
}
