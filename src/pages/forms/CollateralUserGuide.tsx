import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiBase";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { collateralGuideSchema } from "../../components/Forms/form-schemas/CollateralUserGuide";
import { submitCollateralUserGuide } from "../api/stage02-Forms/CollateralUserGuide";
import { FormLayout } from "../../components/layouts";
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

function CollateralUserGuide() {
  const navigate = useNavigate();
  const formConfig = getFormConfig('collateral-user-guide');
  
  // Use the centralized mapping hook (CRM data priority)
  const { mappedData, loading, error } = useFormDataMapping();

  const handleSubmit = async (data: any) => {
    try {
      console.log("📋 Form data received:", data);

      // Generate UUID
      const azureId = generateUUID();

      // Map form data to Power Apps schema
      // Note: 'name' is automatically populated with serviceName from formConfig
      const powerAppsPayload = {
        azureId: azureId,
        name: formConfig.serviceName, // Automatically populated with service name
        submittedBy: safeString(data.submittedBy || ""),
        emailAddress: safeString(data.emailAddress || ""),
        telephoneNumber: safeString(data.telephoneNumber || ""),
        companyName: safeString(data.companyName || ""),
        companyNumber: safeString(data.companyNumber || ""),
        position: safeString(data.position || ""),
        assetName: safeString(data.assetName || ""),
        assetNumber: safeString(data.assetNumber || ""),
        additionalDetails: safeString(data.additionalDetails || ""),
        dataSharingConsent: data.dataSharingConsent ? "consent" : "",
        serviceName: formConfig.serviceName,
        category: formConfig.category, // Automatically from config
        status: "submitted", // Set to "submitted" when form is being submitted
        serviceProvider: "KF"
      };

      console.log("📤 Power Apps payload:", powerAppsPayload);

      // Submit to Power Apps backend
      const response = await fetch(`${API_BASE_URL}/collateral/create-collateraluserguide`, {
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
      console.log("✅ Collateral user guide request submitted successfully");
      
      alert("✅ Collateral user guide request submitted successfully!");
      
    } catch (error: any) {
      console.error("❌ Submission error:", error);
      alert(`❌ Failed to submit collateral user guide request: ${error.message}`);
      // Status remains "draft" on error
    }
  };

  const handleSave = async (data: any) => {
    console.log("Form saved:", data);
    // Status remains "draft" when form is saved
  };

  return (<ServiceRequestForm
        schema={collateralGuideSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={mappedData}
        data-id="collateral-user-guide"
      />);
}

// Export the specific form name
export const CollateralUserGuideForm = CollateralUserGuide;
export default CollateralUserGuide;
