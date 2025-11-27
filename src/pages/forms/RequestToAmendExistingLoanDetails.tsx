import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { amendExistingLoanSchema } from "../../components/Forms/form-schemas/AmendExistingLoanSchema";
import { createFormSubmissionHandler } from "../../services/formSubmissionService";
import { useFormDataMapping } from "../../hooks/useFormDataMapping";

function RequestToAmendExistingLoanDetails() {
  const navigate = useNavigate();
  const submitForm = createFormSubmissionHandler('request-to-amend-existing-loan-details');
  
  // Use the centralized mapping hook (CRM data priority)
  const { mappedData, loading, error } = useFormDataMapping();

  const handleSubmit = async (data: any) => {
    try {
      const result = await submitForm(data, {
        submittedBy: data.applicantName || data.name || "Unknown"
      });
      
      console.log("✅ API response:", result);
    } catch (error: any) {
      console.error("❌ Submission error:", error.message);
    }
  };

  const handleSave = async (data: any) => {
    console.log("Form saved:", data);
  };

  return (<ServiceRequestForm
        schema={amendExistingLoanSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={mappedData}
        data-id="request-to-amend-existing-loan-details"
      />);
}

// Export the specific form name
export const RequestToAmendExistingLoanDetailsForm =
  RequestToAmendExistingLoanDetails;
export default RequestToAmendExistingLoanDetails;
