import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrainingInEntrepreneurshipSchema } from "../../components/Forms/form-schemas/TrainingInEnterprenuershipSchema";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { createFormSubmissionHandler } from "../../services/formSubmissionService";
import { useFormDataMapping } from "../../hooks/useFormDataMapping";

function TrainingInEntrepreneurship() {
  const navigate = useNavigate();
  const submitForm = createFormSubmissionHandler('training-in-entrepreneurship');
  
  // Use the centralized mapping hook
  const { mappedData, loading, error } = useFormDataMapping();

  const handleSubmit = async (data: any) => {
    try {
      const result = await submitForm(data, {
        submittedBy: data.requestorName || "Unknown"
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
        schema={TrainingInEntrepreneurshipSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={mappedData}
        data-id="training-in-entrepreneurship"
      />);
}

// Export the specific form name
export const TrainingInEntrepreneurshipForm = TrainingInEntrepreneurship;
export default TrainingInEntrepreneurship;
