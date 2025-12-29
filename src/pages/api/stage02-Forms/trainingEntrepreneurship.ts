import { API_BASE_URL } from "../../../config/apiBase";

export interface TrainingEntrepreneurshipPayload {
  Name: string;
  submittedBy: string;
  emailAddress: string;
  telephoneNumber: string;
}

export async function submitTrainingEntrepreneurship(data: TrainingEntrepreneurshipPayload): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/training/entrepreneurshiptraining`,
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
    console.error("submitTrainingEntrepreneurship error:", error.message);
    throw new Error("Failed to submit training entrepreneurship request. Please try again.");
  }
}
