import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ArrowLeft, CheckCircle, Loader2, Upload } from "lucide-react";
import { fetchFormSchemaByServiceId } from "../../services/formSchemaService";
import { submitForm, uploadFile, UploadedFile } from "../../services/formSubmissionService";
import {
  CustomTextWidget,
  CustomTextareaWidget,
  CustomSelectWidget,
  CustomCheckboxWidget,
  CustomEmailWidget,
  CustomNumberWidget,
  CustomFileWidget,
} from "../../components/Forms/CustomWidgets";
import {
  CustomFieldTemplate,
  CustomObjectFieldTemplate,
  CustomArrayFieldTemplate,
  CustomErrorListTemplate,
} from "../../components/Forms/CustomTemplates";

const SchemaBasedServiceRequestForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [schema, setSchema] = useState<any>(null);
  const [uiSchema, setUiSchema] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, boolean>>({});

  const serviceDetails = location.state?.service || {
    title: searchParams.get('serviceName') || "General Service Request",
    id: searchParams.get('serviceId') || "general",
    provider: { name: searchParams.get('provider') || "DFSA" }
  };

  useEffect(() => {
    const loadSchema = async () => {
      setIsLoading(true);
      
      // Try to fetch schema by service ID
      let formSchema = await fetchFormSchemaByServiceId(serviceDetails.id);
      
      // If not found and ID contains 'mock-', try without it
      if (!formSchema && serviceDetails.id.startsWith('mock-')) {
        const slug = serviceDetails.id.replace('mock-', '');
        formSchema = await fetchFormSchemaByServiceId(slug);
      }
      
      // If still not found, try the service title as ID
      if (!formSchema && serviceDetails.title) {
        const titleId = serviceDetails.title
          .toLowerCase()
          .replace(/[()]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-');
        formSchema = await fetchFormSchemaByServiceId(titleId);
      }
      
      if (formSchema) {
        // Clean schema - remove data-url format from file fields
        const cleanedSchema = JSON.parse(JSON.stringify(formSchema.json_schema));
        if (cleanedSchema.properties?.documents?.properties) {
          Object.keys(cleanedSchema.properties.documents.properties).forEach(key => {
            delete cleanedSchema.properties.documents.properties[key].format;
          });
        }
        
        setSchema(cleanedSchema);
        setUiSchema(formSchema.ui_schema || {});
      } else {
        // Fallback to default schema
        setSchema(getDefaultSchema());
        setUiSchema(getDefaultUISchema());
      }
      
      setIsLoading(false);
    };

    loadSchema();
  }, [serviceDetails.id, serviceDetails.title]);

  // Listen for file selection events
  useEffect(() => {
    const handleFileSelected = (e: any) => {
      const { fieldId, file } = e.detail;
      setUploadedFiles(prev => ({ ...prev, [fieldId]: file }));
    };
    
    window.addEventListener('fileSelected', handleFileSelected);
    return () => window.removeEventListener('fileSelected', handleFileSelected);
  }, []);

  const getDefaultSchema = () => ({
    title: `${serviceDetails.title} Request`,
    type: "object",
    required: ["firstName", "lastName", "email", "companyName"],
    properties: {
      firstName: { type: "string", title: "First Name" },
      lastName: { type: "string", title: "Last Name" },
      email: { type: "string", title: "Email", format: "email" },
      phone: { type: "string", title: "Phone Number" },
      companyName: { type: "string", title: "Company Name" },
      licenseNumber: { type: "string", title: "License Number (if applicable)" },
      message: { type: "string", title: "Additional Information" },
      agreeToTerms: {
        type: "boolean",
        title: "I agree to the terms and conditions",
        default: false
      }
    }
  });

  const transformErrors = (errors: any[]) => {
    return errors.map(error => {
      if (error.message?.includes('must match format "data-url"')) {
        return {
          ...error,
          message: 'Please upload a valid file'
        };
      }
      if (error.name === 'required') {
        return {
          ...error,
          message: 'This field is required'
        };
      }
      return error;
    });
  };

  const getDefaultUISchema = () => ({
    message: {
      "ui:widget": "textarea",
      "ui:options": { rows: 5 }
    },
    agreeToTerms: {
      "ui:widget": "checkbox"
    }
  });

  const handleSubmit = async ({ formData: submittedData }: any) => {
    setIsSubmitting(true);
    
    try {
      // Upload all files first
      const uploadedFilesList: UploadedFile[] = [];
      
      for (const [fieldName, file] of Object.entries(uploadedFiles)) {
        if (file) {
          setUploadProgress(prev => ({ ...prev, [fieldName]: true }));
          const uploadedFile = await uploadFile(file, serviceDetails.id, fieldName);
          if (uploadedFile) {
            uploadedFilesList.push(uploadedFile);
          }
          setUploadProgress(prev => ({ ...prev, [fieldName]: false }));
        }
      }
      
      // Submit form with uploaded file references
      const submission = await submitForm({
        service_id: serviceDetails.id,
        service_name: serviceDetails.title,
        user_email: submittedData.email || 'anonymous@example.com',
        form_data: submittedData,
        uploaded_files: uploadedFilesList,
      });
      
      if (submission) {
        console.log('Form submitted successfully:', submission);
        setIsSuccess(true);
        setTimeout(() => navigate(-1), 3000);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Request Submitted Successfully!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Your service request has been received. We'll get back to you shortly.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-8 py-3.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
            >
              Return to Services
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary hover:text-primary-dark mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Service
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {serviceDetails.title}
            </h1>
            <p className="text-gray-600 text-lg">
              Provider: <span className="font-medium">{serviceDetails.provider.name}</span>
            </p>
          </div>

          {schema && (
            <Form
              schema={schema}
              uiSchema={uiSchema}
              formData={formData}
              validator={validator}
              onSubmit={handleSubmit}
              onChange={(e) => setFormData(e.formData)}
              disabled={isSubmitting}
              transformErrors={transformErrors}
              widgets={{
                TextWidget: CustomTextWidget,
                TextareaWidget: CustomTextareaWidget,
                SelectWidget: CustomSelectWidget,
                CheckboxWidget: CustomCheckboxWidget,
                EmailWidget: CustomEmailWidget,
                email: CustomEmailWidget,
                NumberWidget: CustomNumberWidget,
                FileWidget: CustomFileWidget,
              }}
              templates={{
                FieldTemplate: CustomFieldTemplate,
                ObjectFieldTemplate: CustomObjectFieldTemplate,
                ArrayFieldTemplate: CustomArrayFieldTemplate,
                ErrorListTemplate: CustomErrorListTemplate,
              }}
              showErrorList="top"
            >
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-6 py-3.5 text-base font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </Form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SchemaBasedServiceRequestForm;
