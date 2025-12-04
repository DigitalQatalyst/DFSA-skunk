/**
 * DFSA Authorisation Enquiry - Sign Up Modal
 * Technical Specification v1.0
 *
 * Single-page form with 5 sections implementing DFSA compliance requirements.
 * AML Module 14.3.1: Record keeping requirements (audit logging)
 */

import React, { useState, useEffect } from "react";
import { X, CheckCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auditLog, DFSA_AUDIT_EVENTS } from "../../../utils/auditLogger";
import { dfsaEnquiryAPI } from "../../../services/dfsaEnquiryAPI";
import {
  dfsaEnquirySignupValidationSchema,
  isDFSASectionComplete,
} from "../../Forms/form-schemas/DFSAEnquirySignupSchema";
import type { DFSAActivityType, DFSAEntityType } from "../../../types/dfsa";
import { saveSignUpData } from "../../../pages/dashboard/onboarding/dfsa/hooks/usePrePopulation";

interface DFSAEnquirySignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (referenceNumber: string) => void;
}

export const DFSAEnquirySignupModal: React.FC<DFSAEnquirySignupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    // Section 1: Contact Information
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    suggestedDate: "",

    // Section 2: Activity Type
    activityType: "" as DFSAActivityType | "",

    // Section 3: Entity Type
    entityType: "" as DFSAEntityType | "",
    entityTypeOther: "",

    // Section 4: Regulatory Status (conditional)
    currentlyRegulated: null as boolean | null,

    // Section 5: Data Consent
    difcaConsent: null as boolean | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Step management for wizard navigation
  const [currentStep, setCurrentStep] = useState(1);

  // Audit log when modal opens
  useEffect(() => {
    if (isOpen) {
      auditLog.log(DFSA_AUDIT_EVENTS.ENQUIRY_MODAL_OPENED, {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper function to get step title by step number
  const getStepTitleByNumber = (stepNum: number): string => {
    switch (stepNum) {
      case 1:
        return 'Contact Information';
      case 2:
        return 'Activity Type';
      case 3:
        return 'Entity Type';
      case 4:
        return 'Regulatory Status';
      case 5:
        return 'Data Consent';
      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "radio"
        ? value === "true"
          ? true
          : value === "false"
          ? false
          : value
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Step validation function
  const validateCurrentStep = (): boolean => {
    const stepErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1: // Contact Information
        if (!formData.companyName || formData.companyName.length < 2) {
          stepErrors.companyName = "Please enter a company name";
        }
        if (!formData.contactName || formData.contactName.length < 2) {
          stepErrors.contactName = "Please enter your name";
        }
        if (!formData.email || !formData.email.includes('@')) {
          stepErrors.email = "Please enter a valid email address";
        }
        if (!formData.phone || formData.phone.length < 8) {
          stepErrors.phone = "Please enter a valid telephone number";
        }
        break;

      case 2: // Activity Type
        if (!formData.activityType) {
          stepErrors.activityType = "Please select an activity type";
        }
        break;

      case 3: // Entity Type
        if (!formData.entityType) {
          stepErrors.entityType = "Please select how the applicant will apply";
        }
        if (formData.entityType === 'OTHER' && !formData.entityTypeOther) {
          stepErrors.entityTypeOther = "Please specify the entity type";
        }
        break;

      case 4: // Regulatory Status
        if (formData.activityType === 'FINANCIAL_SERVICES' && formData.currentlyRegulated === null) {
          stepErrors.currentlyRegulated = "Please indicate if currently regulated";
        }
        break;

      case 5: // Data Consent
        if (formData.difcaConsent === null) {
          stepErrors.difcaConsent = "Please indicate your consent preference";
        }
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Navigate to next step with skip logic for step 4
  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Skip step 4 if not Financial Services
    if (currentStep === 3 && formData.activityType !== 'FINANCIAL_SERVICES') {
      setCurrentStep(5); // Skip to step 5
    } else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step with skip logic for step 4
  const handleBack = () => {
    // Skip step 4 if not Financial Services
    if (currentStep === 5 && formData.activityType !== 'FINANCIAL_SERVICES') {
      setCurrentStep(3); // Go back to step 3
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Audit log submission attempt
    auditLog.log(DFSA_AUDIT_EVENTS.ENQUIRY_FORM_SUBMITTED, {
      email: formData.email,
      companyName: formData.companyName,
      activityType: formData.activityType,
    });

    setIsSubmitting(true);
    setSubmitError(null);
    setErrors({});

    try {
      // Validate form data
      await dfsaEnquirySignupValidationSchema.validate(formData, {
        abortEarly: false,
      });

      // Submit to API
      const result = await dfsaEnquiryAPI.submitEnquiry({
        contactInfo: {
          companyName: formData.companyName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          suggestedDate: formData.suggestedDate || null,
        },
        activityType: formData.activityType as DFSAActivityType,
        entityType: formData.entityType as DFSAEntityType,
        entityTypeOther: formData.entityTypeOther || null,
        currentlyRegulated: formData.currentlyRegulated,
        difcaConsent: formData.difcaConsent === true,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      // Audit log success
      auditLog.log(DFSA_AUDIT_EVENTS.ENQUIRY_SUCCESS, {
        referenceNumber: result.referenceNumber,
        email: formData.email,
        companyName: formData.companyName,
        activityType: formData.activityType,
      });

      // Save sign-up data to localStorage for pre-population in onboarding form
      saveSignUpData({
        companyName: formData.companyName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        suggestedDate: formData.suggestedDate || null,
        activityType: formData.activityType as DFSAActivityType,
        entityType: formData.entityType as DFSAEntityType,
        entityTypeOther: formData.entityTypeOther || null,
        currentlyRegulated: formData.currentlyRegulated,
        difcaConsent: formData.difcaConsent === true,
        submittedAt: new Date().toISOString(),
      });

      setReferenceNumber(result.referenceNumber || null);
      setIsSuccess(true);

      if (onSuccess && result.referenceNumber) {
        onSuccess(result.referenceNumber);
      }
    } catch (error: any) {
      // Handle validation errors
      if (error.name === "ValidationError") {
        const validationErrors: Record<string, string> = {};
        error.inner.forEach((err: any) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);

        // Navigate to first step with errors
        const errorFields = Object.keys(validationErrors);
        if (errorFields.length > 0) {
          const firstErrorField = errorFields[0];

          // Map fields to steps
          const fieldStepMap: Record<string, number> = {
            companyName: 1,
            contactName: 1,
            email: 1,
            phone: 1,
            suggestedDate: 1,
            activityType: 2,
            entityType: 3,
            entityTypeOther: 3,
            currentlyRegulated: 4,
            difcaConsent: 5,
          };

          const errorStep = fieldStepMap[firstErrorField] || 1;
          setCurrentStep(errorStep);

          // Show user-friendly message
          setSubmitError(
            `Please correct the errors in ${getStepTitleByNumber(errorStep)} before submitting.`
          );
        }

        auditLog.log(DFSA_AUDIT_EVENTS.ENQUIRY_VALIDATION_FAILED, {
          errors: validationErrors,
        });
      } else {
        // Handle submission errors
        auditLog.log(DFSA_AUDIT_EVENTS.ENQUIRY_FAILED, {
          error: error.message,
          email: formData.email,
        });
        setSubmitError(
          error.message || "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setIsSuccess(false);
    setReferenceNumber(null);
    setSubmitError(null);
    setErrors({});
    setCurrentStep(1); // Reset to first step
    setFormData({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      suggestedDate: "",
      activityType: "",
      entityType: "",
      entityTypeOther: "",
      currentlyRegulated: null,
      difcaConsent: null,
    });
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Render functions for each step
  const renderContactInformation = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Suggested company name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b82933] transition-all ${
            errors.companyName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter the proposed name for your DIFC entity"
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b82933] transition-all ${
            errors.contactName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Full name of primary contact person"
        />
        {errors.contactName && (
          <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b82933] transition-all ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Business email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your telephone number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b82933] transition-all ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+971 50 123 4567"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Suggested date for future application
        </label>
        <input
          type="date"
          name="suggestedDate"
          value={formData.suggestedDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b82933] transition-all ${
            errors.suggestedDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <p className="mt-1 text-xs text-gray-500">
          When do you anticipate submitting a formal application?
        </p>
        {errors.suggestedDate && (
          <p className="mt-1 text-sm text-red-600">{errors.suggestedDate}</p>
        )}
      </div>
    </div>
  );

  const renderActivityType = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Which best describes the activities the potential applicant intends to
        undertake? <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {[
          {
            value: 'FINANCIAL_SERVICES',
            label: 'Financial Services',
            description: 'Providing regulated financial services in/from DIFC',
          },
          {
            value: 'DNFBP',
            label: 'Designated Non-Financial Business or Profession (DNFBP)',
            description: 'AML-supervised professions (lawyers, accountants, etc.)',
          },
          {
            value: 'REGISTERED_AUDITOR',
            label: 'Registered Auditor',
            description: 'DIFC registered audit firm',
          },
          {
            value: 'CRYPTO_TOKEN',
            label: 'Crypto Token',
            description: 'Financial services involving crypto tokens',
          },
          {
            value: 'CRYPTO_TOKEN_RECOGNITION',
            label: 'Application for Crypto Token Recognition only',
            description: 'Recognition of specific crypto token (no FS activities)',
          },
        ].map((option) => (
          <label
            key={option.value}
            className="flex items-start p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="radio"
              name="activityType"
              value={option.value}
              checked={formData.activityType === option.value}
              onChange={handleChange}
              className="mt-1 h-4 w-4 focus:ring-[#b82933]"
              style={{ accentColor: '#b82933' }}
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{option.label}</p>
              <p className="text-xs text-gray-600">{option.description}</p>
            </div>
          </label>
        ))}
      </div>
      {errors.activityType && (
        <p className="mt-1 text-sm text-red-600">{errors.activityType}</p>
      )}
    </div>
  );

  const renderEntityType = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Will the potential applicant apply as: <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {[
          {
            value: 'DIFC_INCORPORATION',
            label: 'A company/partnership incorporated in the DIFC',
            description: 'New DIFC entity to be established',
          },
          {
            value: 'OTHER_JURISDICTION',
            label: 'A company/partnership incorporated in another jurisdiction',
            description: 'Branch or subsidiary of existing entity',
          },
          {
            value: 'OTHER',
            label: 'Other, please specify',
            description: '',
          },
        ].map((option) => (
          <label
            key={option.value}
            className="flex items-start p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="radio"
              name="entityType"
              value={option.value}
              checked={formData.entityType === option.value}
              onChange={handleChange}
              className="mt-1 h-4 w-4 focus:ring-[#b82933]"
              style={{ accentColor: '#b82933' }}
            />
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{option.label}</p>
              {option.description && (
                <p className="text-xs text-gray-600">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
      {errors.entityType && (
        <p className="mt-1 text-sm text-red-600">{errors.entityType}</p>
      )}

      {/* Conditional: Entity Type Other */}
      {formData.entityType === 'OTHER' && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Please specify the entity type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="entityTypeOther"
            value={formData.entityTypeOther}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b82933] transition-all ${
              errors.entityTypeOther ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Specify entity type"
          />
          {errors.entityTypeOther && (
            <p className="mt-1 text-sm text-red-600">{errors.entityTypeOther}</p>
          )}
        </div>
      )}
    </div>
  );

  const renderRegulatoryStatus = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Is the potential applicant currently regulated to provide Financial Services
        or is an entity within its group currently licensed to provide regulated
        Financial Services? <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {[
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ].map((option) => (
          <label
            key={option.label}
            className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="radio"
              name="currentlyRegulated"
              value={option.value.toString()}
              checked={formData.currentlyRegulated === option.value}
              onChange={handleChange}
              className="h-4 w-4 focus:ring-[#b82933]"
              style={{ accentColor: '#b82933' }}
            />
            <span className="ml-3 text-sm font-medium text-gray-900">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {errors.currentlyRegulated && (
        <p className="mt-1 text-sm text-red-600">{errors.currentlyRegulated}</p>
      )}
    </div>
  );

  const renderDataConsent = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Disclosure of information to the Dubai International Financial Centre
        Authority (DIFCA)
      </label>

      {/* DIFCA Consent Text */}
      <div className="p-4 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700 mb-4 space-y-2 max-h-96 overflow-y-auto">
        <p>
          <strong>a.</strong> References to "Information" include the personal data
          and information, including confidential information, provided via this
          online submission.
        </p>
        <p>
          <strong>b.</strong> The DFSA uses the Information in the performance of its
          functions and carrying out of its powers as a financial services regulator
          in the DIFC, including its objectives set out in the DIFC Regulatory Law
          2004 (as amended) and Dubai Law No. 5 of 2021 (as amended).
        </p>
        <p>
          <strong>c.</strong> In carrying out its objectives, the DFSA may also
          disclose certain Information to the Dubai International Financial Centre
          Authority (DIFCA), where necessary, for the exercise of DIFCA's powers and
          functions.
        </p>
        <p>
          <strong>d.</strong> In giving your consent below:
        </p>
        <p className="pl-4">
          <strong>i.</strong> You understand and agree that the DFSA may disclose the
          Information to DIFCA for the purposes stated in paragraph 20.c.
        </p>
        <p className="pl-4">
          <strong>ii.</strong> You confirm that you have the legal power and authority
          to provide the Information to the DFSA and to consent to the above
          disclosure to DIFCA.
        </p>
        <p className="font-medium mt-2">Important:</p>
        <p>
          It is not mandatory to provide consent. If you do not consent to disclosure
          of the Information to DIFCA, we ask that you consider keeping DIFCA
          informed, as appropriate, of your online submission.
        </p>
        <p className="mt-2">
          Please keep in mind this online submission is not any form of application
          for DFSA authorisation to conduct Financial Services in or from the DIFC,
          and nor should this online submission be relied upon as an indication of the
          DFSA's approach, nor create any form of legitimate expectation should the
          concerned firm make an application for DFSA authorisation.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Please indicate your consent preference <span className="text-red-500">*</span>
        </label>
        {[
          { value: true, label: 'I consent' },
          { value: false, label: 'I do not consent' },
        ].map((option) => (
          <label
            key={option.label}
            className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="radio"
              name="difcaConsent"
              value={option.value.toString()}
              checked={formData.difcaConsent === option.value}
              onChange={handleChange}
              className="h-4 w-4 focus:ring-[#b82933]"
              style={{ accentColor: '#b82933' }}
            />
            <span className="ml-3 text-sm font-medium text-gray-900">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {errors.difcaConsent && (
        <p className="mt-1 text-sm text-red-600">{errors.difcaConsent}</p>
      )}
    </div>
  );

  // Render the current step based on currentStep state
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderContactInformation();
      case 2:
        return renderActivityType();
      case 3:
        return renderEntityType();
      case 4:
        // Only render if Financial Services selected
        if (formData.activityType === 'FINANCIAL_SERVICES') {
          return renderRegulatoryStatus();
        }
        // Fallback - should not reach here due to navigation logic
        return null;
      case 5:
        return renderDataConsent();
      default:
        return null;
    }
  };

  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Contact Information';
      case 2:
        return 'Activity Type';
      case 3:
        return 'Entity Type';
      case 4:
        return 'Regulatory Status';
      case 5:
        return 'Data Consent';
      default:
        return '';
    }
  };

  // Calculate total steps (skip step 4 if not Financial Services)
  const getTotalSteps = () => {
    return formData.activityType === 'FINANCIAL_SERVICES' ? 5 : 4;
  };

  // Get display step number (adjusts for skipped step 4)
  const getDisplayStepNumber = () => {
    if (formData.activityType !== 'FINANCIAL_SERVICES' && currentStep === 5) {
      return 4; // Display as step 4 if step 4 was skipped
    }
    return currentStep;
  };

  // Success Modal
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
          {/* Success Header */}
          <div className="px-8 py-6 text-center relative overflow-hidden" style={{ background: 'linear-gradient(to right, #b82933, #a39143)' }}>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Enquiry Submitted Successfully
              </h2>
              <p className="text-white/90 text-sm">
                Your enquiry has been recorded and will be reviewed by the DFSA.
              </p>
            </div>
          </div>

          {/* Success Content */}
          <div className="px-8 py-6">
            {/* Reference Number */}
            <div className="mb-6 p-4 rounded-lg text-center" style={{ backgroundColor: '#fef2f2', border: '2px solid #fecaca' }}>
              <p className="text-sm text-gray-600 mb-1">Your Reference Number</p>
              <p className="text-2xl font-bold" style={{ color: '#b82933' }}>{referenceNumber}</p>
              <p className="text-xs text-gray-500 mt-1">
                Please retain this reference number for your records
              </p>
            </div>

            {/* Next Steps */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3 text-left">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Enquiry Recorded</p>
                  <p className="text-xs text-gray-600">
                    Your details have been securely stored
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-left">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Confirmation Email</p>
                  <p className="text-xs text-gray-600">
                    A confirmation will be sent to your email address
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-left">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">DFSA Review</p>
                  <p className="text-xs text-gray-600">
                    The DFSA will review your enquiry and contact you with next steps
                  </p>
                </div>
              </div>
            </div>

            {/* Regulatory Disclaimer */}
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 mb-4">
              <p className="font-medium mb-1">Important Information</p>
              <p>
                This confirmation does not constitute approval or guarantee of any licence
                or registration. All applications are subject to review and assessment by
                the DFSA in accordance with applicable regulations.
              </p>
            </div>

            {/* Mock Data Notice (remove when backend is ready) */}
            {/* <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-800 mb-4">
              <p className="font-medium">Frontend Demo</p>
              <p>
                This is a frontend demonstration. Backend integration (email confirmation,
                CRM record creation) will be added when services are ready.
              </p>
            </div> */}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  handleClose();
                  navigate('/dashboard/onboarding');
                }}
                className="w-full text-white font-medium py-3 px-6 rounded-md transition-colors"
                style={{ backgroundColor: '#b82933' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a02028'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#b82933'}
              >
                Proceed to onboarding
              </button>
              <button
                onClick={handleClose}
                className="w-full text-gray-700 font-medium py-3 px-6 rounded-md border-2 border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Do this later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Form
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8 mx-auto"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-xl">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              DFSA Authorisation Enquiry
            </h2>
            <p className="text-gray-600 text-sm">
              Initial registration and interest capture for DIFC authorisation
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

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Step {getDisplayStepNumber()} of {getTotalSteps()}
            </span>
            <span className="text-sm font-medium" style={{ color: '#b82933' }}>{getStepTitle()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(getDisplayStepNumber() / getTotalSteps()) * 100}%`,
                background: 'linear-gradient(to right, #b82933, #a39143)'
              }}
            />
          </div>
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
                  Submission Failed
                </h3>
                <div className="mt-2 text-sm text-red-700">{submitError}</div>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
          {/* Current Step Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2 flex items-center">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-2 text-white" style={{ backgroundColor: '#b82933' }}>
                {getDisplayStepNumber()}
              </span>
              {getStepTitle()}
            </h3>

            {/* Render current step */}
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            {/* Back Button */}
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}

            {/* Next/Submit Button */}
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-6 py-2 text-white font-medium rounded-md transition-colors flex items-center"
                style={{ backgroundColor: '#b82933' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a02028'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#b82933'}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="ml-auto px-6 py-2 text-white font-medium rounded-md transition-colors"
                style={{ backgroundColor: isSubmitting ? '#d1949a' : '#b82933' }}
                onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#a02028')}
                onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#b82933')}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                    Submitting...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
