import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceRequestForm } from "./Forms/FormPreview";
import { signupFormSchema } from "./Forms/form-schemas/SignupFormSchema";
import { submitUserSignup } from "../pages/api/stage02-Forms/userSignup";
import { useFormAutopopulate } from "../hooks/useFormAutopopulate";
import { useAuth } from "./Header";

interface SignupFormProps {
  onSubmit?: (data: any) => Promise<void>;
  onClose?: () => void;
  className?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  onClose,
  className = "",
}) => {
  const navigate = useNavigate();
  const { crmprofile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Autopopulate form with Microsoft Graph data
  const graphData = crmprofile as any;
  const displayName = graphData?.displayName || '';
  const nameParts = displayName.split(' ');
  const firstName = graphData?.givenName || nameParts[0] || '';
  const lastName = graphData?.surname || nameParts.slice(1).join(' ') || '';

  const autopopulatedData = useFormAutopopulate(
    {
      firstName,
      lastName,
      phoneNumber: graphData?.mobilePhone || graphData?.businessPhones?.[0] || '',
      companyName: graphData?.companyName || '',
    },
    {}
  );

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Transform form data to API format
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName,
        countryRegion: formData.countryRegion,
        lifecycleStage: formData.lifecycleStage,
        agreeToTerms: formData.consent,
      };

      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'companyName', 'countryRegion', 'lifecycleStage', 'agreeToTerms'];
      const missingFields = requiredFields.filter(field => !signupData[field as keyof typeof signupData]);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      if (onSubmit) {
        await onSubmit(signupData);
      } else {
        await submitUserSignup(signupData);
      }

      setIsSuccess(true);

      // Navigate to dashboard overview using React Router
      // The ProtectedRoute will handle redirecting to onboarding if needed (for admins)
      setTimeout(() => {
        navigate('/dashboard/overview');
      }, 1500);

    } catch (error) {
      let userFriendlyMessage = "An unexpected error occurred. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("Missing required fields") || error.message.includes("Please fill in")) {
          userFriendlyMessage = error.message;
        } else if (error.message.includes("API endpoint") || error.message.includes("temporarily unavailable")) {
          userFriendlyMessage = "Our signup service is temporarily unavailable. Please try again in a few moments.";
        } else if (error.message.includes("network") || error.message.includes("connect")) {
          userFriendlyMessage = "Unable to connect to our servers. Please check your internet connection and try again.";
        } else {
          userFriendlyMessage = error.message;
        }
      }

      setSubmitError(userFriendlyMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`max-w-2xl mx-auto p-6 ${className}`}>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎉 Welcome to Enterprise Journey!
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been successfully created! Login details have been sent to your email address.
            Please check your email and use the provided credentials to sign in.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  What happens next?
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your account and contact information have been created</li>
                    <li>You'll receive a welcome email with next steps</li>
                    <li>Our team may contact you to discuss your business needs</li>
                    <li>You can now explore our services and opportunities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue to Dashboard
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Create Another Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {autopopulatedData && Object.keys(autopopulatedData).length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Form Autopopulated
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                We've pre-filled some fields with your account information. Please review and update as needed.
              </div>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Signup Failed
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {submitError}
              </div>
            </div>
          </div>
        </div>
      )}

      {isSubmitting ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Creating your account...</p>
          </div>
        </div>
      ) : (
        <ServiceRequestForm
          schema={signupFormSchema}
          onSubmit={handleSubmit}
          enablePersistence={false}
          enableAutoSave={false}
          initialData={autopopulatedData}
        />
      )}
    </div>
  );
};

export default SignupForm;