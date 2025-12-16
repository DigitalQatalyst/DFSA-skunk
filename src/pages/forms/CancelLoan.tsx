import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { loanCancellationSchema } from "../../components/Forms/form-schemas/CancelLoans";
import { getFormConfig } from "../../config/formConfig";
import { useFetchLoanData } from "../../hooks/useFetchLoanData";

function CancelLoan() {
  const navigate = useNavigate();
  const formConfig = getFormConfig('cancel-loan');
  
  const submitForm = async (data: any) => {
    console.log('Form submitted:', data);
    // Handle submission here
  };

  // Get loan ID from URL params (can be loan ID or Azure ID)
  const loanId = new URLSearchParams(window.location.search).get('loanId') || 
                 new URLSearchParams(window.location.search).get('azureId') || 
                 null; // Use null if no loanId provided

  // Use the centralized mapping hook with loan data (same pattern as other forms)
  const {
    formData: mappedData,
    loading,
    error,
  } = useFetchLoanData(loanId);

  const handleSubmit = async (data: any) => {
    try {
      const result = await submitForm(data, {
        submittedBy: data.submittedBy || "Unknown"
      });
      
      console.log("✅ API response:", result);
    } catch (error: any) {
      console.error("❌ Submission error:", error.message);
    }
  };

  const handleSave = async (data: any) => {
    console.log("Form saved:", data);
  };

  return (
    <ServiceRequestForm
      schema={loanCancellationSchema}
      onSubmit={handleSubmit}
      onSave={handleSave}
      initialData={mappedData}
      data-id="cancel-loan"
    />
  );
}

export const CancelLoanForm = CancelLoan;
export default CancelLoan;
