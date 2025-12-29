import React, { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { signupAPI, SignupFormData } from "../../../services/signupAPI";
import { auditLog } from "../../../utils/auditLogger";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess?: (data: any) => void;
  onSwitchToSignIn?: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onSignupSuccess,
  onSwitchToSignIn,
}) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    countryRegion: "",
    lifecycleStage: "",
    agreeToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Audit log when modal opens
  useEffect(() => {
    if (isOpen) {
      auditLog.log('SIGNUP_MODAL_OPENED', {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Audit log form submission attempt
    auditLog.log('SIGNUP_FORM_SUBMITTED', {
      email: formData.email,
      companyName: formData.companyName,
    });

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate form data
      const validation = signupAPI.validateFormData(formData as SignupFormData);
      if (!validation.isValid) {
        auditLog.log('SIGNUP_VALIDATION_FAILED', {
          errors: validation.errors,
        });
        throw new Error(validation.errors.join(", "));
      }

      // Submit to CRM API
      const result = await signupAPI.submitSignup(formData as SignupFormData);

      if (!result.success) {
        auditLog.log('SIGNUP_FAILED', {
          error: result.message,
          email: formData.email,
        });
        throw new Error(result.message);
      }

      // Audit log successful signup
      auditLog.log('SIGNUP_SUCCESS', {
        email: formData.email,
        companyName: formData.companyName,
      });

      setIsSuccess(true);

      if (onSignupSuccess) {
        onSignupSuccess(result.data);
      }

      // Auto-redirect to dashboard overview after showing success message
      // The ProtectedRoute will handle redirecting to onboarding if needed (for admins)
      setTimeout(() => {
        window.location.href = '/dashboard/overview';
      }, 2000);

    } catch (error) {
      auditLog.log('SIGNUP_ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email: formData.email,
      });
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClose = () => {
    onClose();
    setIsSuccess(false);
    setSubmitError(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      companyName: "",
      countryRegion: "",
      lifecycleStage: "",
      agreeToTerms: false,
    });
  };

  if (isSuccess) {
    return (
      <div
        className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all"
          onClick={handleModalClick}
        >
          {/* Success Header with Gradient */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Account Registration Submitted
              </h2>
              <p className="text-green-100 text-sm">
                Your registration has been recorded and will be reviewed by the DFSA.
              </p>
            </div>
            {/* Decorative elements removed for DFSA compliance */}
          </div>

          {/* Success Content */}
          <div className="px-8 py-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Registration Process Initiated
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-left">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Registration Data Recorded</p>
                    <p className="text-xs text-gray-600">Your details have been securely stored in our system</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-left">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Confirmation Email Sent</p>
                    <p className="text-xs text-gray-600">Check your inbox for your signup details and next steps</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-left">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Awaiting DFSA Review</p>
                    <p className="text-xs text-gray-600">The DFSA will review your application and determine eligibility.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-redirect message */}
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm text-blue-700 font-medium">
                  Redirecting to sign in in a moment...
                </span>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Check your email for confirmation details • You'll be redirected to sign in
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 mx-auto"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-xl">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
            <p className="text-gray-600 text-sm">
              Register to access the DFSA regulatory platform
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 ml-4 flex-shrink-0"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
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

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group 1: Your Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Your Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="+971 50 123 4567"
                />
              </div>
            </div>

            {/* Group 2: Your Enterprise Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Your Enterprise Details
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your company name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country/Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="countryRegion"
                    value={formData.countryRegion}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select your country/region</option>
                    <option value="ae">United Arab Emirates</option>
                    <option value="sa">Saudi Arabia</option>
                    <option value="qa">Qatar</option>
                    <option value="kw">Kuwait</option>
                    <option value="bh">Bahrain</option>
                    <option value="om">Oman</option>
                    <option value="jo">Jordan</option>
                    <option value="lb">Lebanon</option>
                    <option value="eg">Egypt</option>
                    <option value="ma">Morocco</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="de">Germany</option>
                    <option value="fr">France</option>
                    <option value="in">India</option>
                    <option value="sg">Singapore</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lifecycle Stage <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="lifecycleStage"
                    value={formData.lifecycleStage}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select your business stage</option>
                    <option value="startup">Start Up Stage</option>
                    <option value="scaleup">Scale Up Stage</option>
                    <option value="expansion">Expansion Stage</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5 mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that the information provided is accurate and I agree to the Terms of Service and Privacy Policy <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Regulatory Disclaimer */}
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 mb-4">
              <p className="font-medium mb-1">Regulatory Information</p>
              <p>
                Registration does not guarantee approval. The DFSA will review your
                application and determine eligibility based on applicable regulations.
                All decisions are made solely by the DFSA.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting Registration...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => {
                  onClose();
                  if (onSwitchToSignIn) {
                    onSwitchToSignIn();
                  } else {
                    login();
                  }
                }}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                type="button"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};