import { API_BASE_URL } from "../../../config/apiBase";

export interface DisburseLoanPayload {
  azureId: string;
  userId: string;
  name: string;
  submittedBy: string;
  emailAddress: string;
  telephoneNumber: string;
  position: string;
  companyName: string;
  companyNumber: string;
  fundingNumber: string;
  amountInAED: number;
  paymentMethod: string;
  otherOptional?: string;
  supplierLicense: string;
  officialQuotations: string;
  invoices: string;
  deliveryNotes: string;
  paymentReceipts: string;
  employeeList: string;
  consentAcknowledgement: string;
  sequenceNumber: string;
}

export async function submitDisburseLoan(data: DisburseLoanPayload): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/loan/disburse-loan`,
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
    console.error("submitDisburseLoan error:", error.message);
    throw new Error("Failed to submit loan disbursement. Please try again.");
  }
}
