import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { NeedsAssessmentFormSchema } from "../../components/Forms/form-schemas/NeedsAssessmentFormSchema";

function NeedsAssessmentForm() {
  const [formData, setFormData] = useState<any>({});
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    alert("Form submitted successfully!");
  };
  
  const handleSave = async (data: any) => {
    console.log("Form saved:", data);
    setFormData(data);
    alert("Form saved successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Needs Assessment Form</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4">
          Needs Assessment Form will be implemented here.
        </p>
        {/* Uncomment when schema is ready */}
        {/* <ServiceRequestForm
          schema={NeedsAssessmentFormSchema}
          onSubmit={handleSubmit}
          onSave={handleSave}
          initialData={formData}
          data-id="needs-assessment-form"
        /> */}
      </div>
    </div>
  );
}

// Export the specific form name
export const NeedsAssessmentFormForm = NeedsAssessmentForm;
export default NeedsAssessmentForm;
