import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { reallocationLoanSchema } from "../../components/Forms/form-schemas/LoanDisbursement";
import { useFormDataMapping } from "../../hooks/useFormDataMapping";

function ReallocationOfLoanDisbursement() {
  const navigate = useNavigate();
  
  // Use the centralized mapping hook (CRM data priority)
  const { mappedData, loading, error } = useFormDataMapping();

  const handleAddNewEnterprise = () => {
    setOnboardingComplete(false);
    navigate("/dashboard/onboarding");
  };

  const handleSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    alert("Form submitted successfully!");
  };
  const handleSave = async (data: any) => {
    console.log("Form saved:", data);
    alert("Form saved successfully!");
  };

  return (<ServiceRequestForm
        schema={reallocationLoanSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={mappedData}
        data-id="reallocation-of-loan-disbursement"
      />);
}

// Export the specific form name
export const ReallocationOfLoanDisbursementForm =
  ReallocationOfLoanDisbursement;
export default ReallocationOfLoanDisbursement;
