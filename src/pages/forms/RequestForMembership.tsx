import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { RequestForMembershipSchema } from "../../components/Forms/form-schemas/RequestForMembershipSchema";
import { createFormSubmissionHandler } from "../../services/formSubmissionService";
import { useFormDataMapping } from "../../hooks/useFormDataMapping";

function RequestForMembership() {
  const navigate = useNavigate();
  const submitForm = createFormSubmissionHandler('request-for-membership');
  
  // Use the centralized mapping hook
  const { mappedData, loading, error } = useFormDataMapping();

  const handleAddNewEnterprise = () => {
    setOnboardingComplete(false);
    navigate("/dashboard/onboarding");
  };

  const handleSubmit = async (data: any) => {
    try {
      const result = await submitForm(data, {
        submittedBy: data.applicantFullName || data.name || "Unknown"
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
        schema={RequestForMembershipSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={mappedData}
        data-id="request-for-membership"
      />);
}

// Export the specific form name
export const RequestForMembershipForm = RequestForMembership;
export default RequestForMembership;
