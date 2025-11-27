import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { facilitateCommunicationSchema } from "../../components/Forms/form-schemas/FacilitateCommunicationSchema";
import { useFormDataMapping } from "../../hooks/useFormDataMapping";
import { createFormSubmissionHandler } from "../../services/formSubmissionService";
import { useAuth } from "../../components/Header/context/AuthContext";

function FacilitateCommunication() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { crmprofile, user } = useAuth();
  
  // Use the centralized mapping hook (CRM data priority)
  const { mappedData, loading, error } = useFormDataMapping();

  // Get azureId from auth context (Microsoft Graph user.id or MSAL user.id)
  const azureId = crmprofile?.id || user?.id;
  
  // Debug logging
  console.log("🔍 Auth Debug - crmprofile:", crmprofile);
  console.log("🔍 Auth Debug - user:", user);
  console.log("🔍 Auth Debug - azureId:", azureId);

  // Create submission handler with azureId override
  const submitHandler = createFormSubmissionHandler('facilitate-communication', azureId);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      console.log("📤 Submitting Facilitate Communication form:", data);
      console.log("🔑 Azure ID from auth context:", azureId);
      
      // Submit to API using the submission service
      const response = await submitHandler(data);
      
      console.log("✅ Form submitted successfully:", response);
      
      // Show success message
      alert("Form submitted successfully! Your request has been received.");
      
      // Navigate to dashboard or success page
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error("❌ Form submission error:", error);
      setSubmitError(error.message || "Failed to submit form. Please try again.");
      alert(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (data: any) => {
    console.log("💾 Form saved (draft):", data);
    // TODO: Implement draft save functionality
    alert("Form saved as draft!");
  };

  return (<ServiceRequestForm
        schema={facilitateCommunicationSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={mappedData}
        data-id="facilitate-communication"
      />);
}

// Export the specific form name
export const FacilitateCommunicationForm = FacilitateCommunication;
export default FacilitateCommunication;
