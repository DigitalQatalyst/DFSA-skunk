import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiBase";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { DisburseApprovedLoanSchema } from "../../components/Forms/form-schemas/DisburseApprovedLoanSchema";
import { getFormConfig } from "../../config/formConfig";
import { useFormDataMapping } from "../../hooks/useFormDataMapping";

// Helper function to generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper function to generate sequence number
function generateSequenceNumber(): string {
  return `SEQ${Math.floor(Math.random() * 100000)}`;
}

// Helper function to convert any value to string safely
const safeString = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    // Handle DocumentReference objects (from Document Wallet)
    if (value && value.type === 'document' && value.url) {
      return value.url || value.name || "";
    }
    // Handle file objects
    if (value instanceof File) {
      return value.name || "";
    }
    // Handle arrays (for multi-file fields)
    if (Array.isArray(value)) {
      return value.map(item => {
        if (item && typeof item === 'object' && item.type === 'document') {
          return item.url || item.name || "";
        }
        if (item instanceof File) {
          return item.name || "";
        }
        return String(item);
      }).join(', ');
    }
    // Handle other objects
    return JSON.stringify(value);
  }
  return String(value);
};

function DisburseApprovedLoan() {
  const [formStatus, setFormStatus] = useState<"draft" | "submitted">("draft");
  const navigate = useNavigate();
  const formConfig = getFormConfig('disburse-approved-loan');
  
  // Use the centralized mapping hook (CRM data priority)
  const { mappedData, loading, error } = useFormDataMapping();

  const handleSubmit = async (data: any) => {
    try {
      console.log("📋 Form data received:", data);

      // Generate UUID and sequence number
      const azureId = generateUUID();
      const sequenceNumber = generateSequenceNumber();

      // Map form data to Power Apps schema
      // Note: 'name' is automatically populated with serviceName from formConfig
      const powerAppsPayload = {
        azureId: azureId,
        userId: "JohnDoe123", // Hardcoded as per user's request
        name: formConfig.serviceName, // Automatically populated with service name
        submittedBy: safeString(data.submittedBy),
        emailAddress: safeString(data.emailAddress),
        telephoneNumber: safeString(data.telephoneNumber),
        position: safeString(data.position),
        companyName: safeString(data.companyName),
        companyNumber: safeString(data.companyNumber),
        fundingNumber: safeString(data.fundingNumber),
        amountInAED: safeString(data.amountInAED),
        paymentMethod: safeString(data.paymentMethod),
        otherOptional: safeString(data.otherOptional),
        supplierLicense: safeString(data.supplierLicense),
        officialQuotations: safeString(data.officialQuotations),
        invoices: safeString(data.invoices),
        deliveryNotes: safeString(data.deliveryNotes),
        paymentReceipts: safeString(data.paymentReceipts),
        employeeList: safeString(data.employeeList),
        consentAcknowledgement: safeString(data.consentAcknowledgement),
        sequenceNumber: sequenceNumber,
        serviceName: formConfig.serviceName,
        category: formConfig.category, // Automatically from config
        status: "submitted", // Set to "submitted" when form is being submitted
        serviceProvider: "KFS"
      };

      console.log("📤 Power Apps payload:", powerAppsPayload);

      // Submit to Power Apps backend
      const response = await fetch(`${API_BASE_URL}/loan/disburse-loan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(powerAppsPayload),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`API Error: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ API response:", result);
      
      // Update status to "submitted" only after successful submission
      setFormStatus("submitted");
      console.log("✅ Form status updated to: submitted");
      
      alert("✅ Loan disbursement request submitted successfully!");
      
    } catch (error: any) {
      console.error("❌ Submission error:", error);
      alert(`❌ Failed to submit loan disbursement request: ${error.message}`);
      // Status remains "draft" on error
    }
  };

  const handleSave = async (data: any) => {
    console.log("Form saved:", data);
    // Status remains "draft" when form is saved
  };

  return (<ServiceRequestForm
        schema={DisburseApprovedLoanSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={mappedData}
        data-id="disburse-approved-loan"
      />);
}

// Export the specific form name
export const DisburseApprovedLoanForm = DisburseApprovedLoan;
export default DisburseApprovedLoan;
