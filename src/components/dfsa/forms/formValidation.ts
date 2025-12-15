/**
 * DFSA Form Validation Utilities
 *
 * Validation functions for form wizard steps
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { FSApplicationFormData, ValidationResult } from '../../../types/dfsa';

/**
 * Validates Step 1-1: Introduction & Disclosure
 */
export function validateStep1_1(formData: FSApplicationFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Required fields validation
  if (!formData.submitterName?.trim()) {
    errors.submitterName = 'Submitter name is required';
  }

  if (!formData.submitterFunction?.trim()) {
    errors.submitterFunction = 'Submitter function is required';
  }

  if (!formData.submitterEmail?.trim()) {
    errors.submitterEmail = 'Submitter email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.submitterEmail)) {
    errors.submitterEmail = 'Please enter a valid email address';
  }

  if (!formData.submitterPhone?.trim()) {
    errors.submitterPhone = 'Submitter phone is required';
  }

  // External adviser validation (conditional)
  if (!formData.contactPersonInternal) {
    if (!formData.externalAdviserName?.trim()) {
      errors.externalAdviserName = 'External adviser name is required';
    }
    if (!formData.externalAdviserEmail?.trim()) {
      errors.externalAdviserEmail = 'External adviser email is required';
    }
    if (!formData.externalAdviserCompany?.trim()) {
      errors.externalAdviserCompany = 'External adviser company is required';
    }
  }

  // Declaration checkboxes
  if (!formData.instructionsConfirmed) {
    errors.instructionsConfirmed = 'You must confirm you have read the instructions';
  }

  if (!formData.disclosureAcknowledged) {
    errors.disclosureAcknowledged = 'You must acknowledge the disclosure statement';
  }

  if (!formData.informationAccurate) {
    errors.informationAccurate = 'You must confirm the information is accurate';
  }

  if (!formData.authorizedToSubmit) {
    errors.authorizedToSubmit = 'You must confirm you are authorized to submit';
  }

  if (!formData.difcaConsent) {
    errors.difcaConsent = 'You must provide DIFCA consent';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Step 1-2: Standing Data
 */
export function validateStep1_2(formData: FSApplicationFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!formData.firmName?.trim()) {
    errors.firmName = 'Firm name is required';
  }

  if (!formData.registeredCountry?.trim()) {
    errors.registeredCountry = 'Registered country is required';
  }

  if (!formData.headOfficeAddress?.line1?.trim()) {
    errors['headOfficeAddress.line1'] = 'Address line 1 is required';
  }

  if (!formData.headOfficeAddress?.city?.trim()) {
    errors['headOfficeAddress.city'] = 'City is required';
  }

  if (!formData.headOfficeAddress?.country?.trim()) {
    errors['headOfficeAddress.country'] = 'Country is required';
  }

  if (!formData.primaryContactName?.trim()) {
    errors.primaryContactName = 'Primary contact name is required';
  }

  if (!formData.primaryContactEmail?.trim()) {
    errors.primaryContactEmail = 'Primary contact email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryContactEmail)) {
    errors.primaryContactEmail = 'Please enter a valid email address';
  }

  if (!formData.primaryContactPhone?.trim()) {
    errors.primaryContactPhone = 'Primary contact phone is required';
  }

  if (!formData.itReliance?.trim()) {
    errors.itReliance = 'IT reliance level is required';
  }

  if (!formData.itComplexity?.trim()) {
    errors.itComplexity = 'IT complexity level is required';
  }

  // Legal status required if not representative office
  if (!formData.isRepresentativeOffice && !formData.legalStatus?.trim()) {
    errors.legalStatus = 'Legal status is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Step 1-3: Ownership Information
 */
export function validateStep1_3(formData: FSApplicationFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate shareholders if any exist
  if (formData.shareholders && formData.shareholders.length > 0) {
    formData.shareholders.forEach((shareholder, index) => {
      if (!shareholder.name?.trim()) {
        errors[`shareholder-${index}-name`] = 'Shareholder name is required';
      }
      if (!shareholder.percentage || shareholder.percentage <= 0) {
        errors[`shareholder-${index}-percentage`] = 'Valid ownership percentage is required';
      }
      if (!shareholder.country?.trim()) {
        errors[`shareholder-${index}-country`] = 'Country is required';
      }
      if (!shareholder.isIndividual && !shareholder.entityType?.trim()) {
        errors[`shareholder-${index}-entityType`] = 'Entity type is required for non-individuals';
      }
    });

    // Check total shareholding doesn't exceed 100%
    const totalPercentage = formData.shareholders.reduce((sum, sh) => sum + (sh.percentage || 0), 0);
    if (totalPercentage > 100) {
      errors.shareholdingTotal = 'Total shareholding cannot exceed 100%';
    }
  }

  // Validate beneficial owners if any exist
  if (formData.beneficialOwners && formData.beneficialOwners.length > 0) {
    formData.beneficialOwners.forEach((owner, index) => {
      if (!owner.name?.trim()) {
        errors[`beneficial-${index}-name`] = 'Beneficial owner name is required';
      }
      if (!owner.percentage || owner.percentage < 25) {
        errors[`beneficial-${index}-percentage`] = 'Beneficial ownership must be 25% or more';
      }
      if (!owner.nationality?.trim()) {
        errors[`beneficial-${index}-nationality`] = 'Nationality is required';
      }
    });
  }

  // Ultimate holding company required if part of group
  if (formData.isPartOfGroup && !formData.ultimateHoldingCompany?.trim()) {
    errors.ultimateHoldingCompany = 'Ultimate holding company is required';
  }

  // Listing exchange required if publicly listed
  if (formData.publiclyListed && !formData.listingExchange?.trim()) {
    errors.listingExchange = 'Stock exchange is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Step 1-4: Controllers & Group Structure
 */
export function validateStep1_4(formData: FSApplicationFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate controllers if any exist
  if (formData.hasControllers && formData.controllers && formData.controllers.length > 0) {
    formData.controllers.forEach((controller, index) => {
      if (!controller.name?.trim()) {
        errors[`controller-${index}-name`] = 'Controller name is required';
      }
      if (!controller.role?.trim()) {
        errors[`controller-${index}-role`] = 'Controller role is required';
      }
      if (!controller.controlType?.trim()) {
        errors[`controller-${index}-controlType`] = 'Control type is required';
      }
      if (!controller.nationality?.trim()) {
        errors[`controller-${index}-nationality`] = 'Nationality is required';
      }
    });
  } else if (formData.hasControllers) {
    errors.controllers = 'Please add at least one controller or uncheck the controllers option';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Step 1-5: Permissions & Financial Services
 */
export function validateStep1_5(formData: FSApplicationFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Check if at least one activity is selected
  const hasActivitySelection = formData.activitySelections &&
    Object.values(formData.activitySelections).some(selected => selected === true);

  if (!hasActivitySelection && !formData.isRepresentativeOffice) {
    errors.activitySelections = 'Please select at least one activity or choose Representative Office';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Step 4-1: Waivers & Modifications
 */
export function validateStep4_1(formData: FSApplicationFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate waiver requests if any exist
  if (formData.waiverRequests && formData.waiverRequests.length > 0) {
    formData.waiverRequests.forEach((waiver, index) => {
      if (!waiver.requirement?.trim()) {
        errors[`waiverRequests.${index}.requirement`] = 'Requirement to be waived is required';
      }
      if (!waiver.justification?.trim()) {
        errors[`waiverRequests.${index}.justification`] = 'Justification is required';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Step 4-2: Application Fees
 */
export function validateStep4_2(formData: FSApplicationFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!formData.paymentMethod?.trim()) {
    errors.paymentMethod = 'Please select a payment method';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Step 4-3: Fit & Proper Declarations
 */
export function validateStep4_3(formData: FSApplicationFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // At least one declaration is required
  if (!formData.individualDeclarations || formData.individualDeclarations.length === 0) {
    errors.individualDeclarations = 'At least one individual declaration is required';
  } else {
    formData.individualDeclarations.forEach((declaration, index) => {
      if (!declaration.personName?.trim()) {
        errors[`individualDeclarations.${index}.personName`] = 'Person name is required';
      }
      if (!declaration.role?.trim()) {
        errors[`individualDeclarations.${index}.role`] = 'Role is required';
      }
      if (!declaration.declarationSigned) {
        errors[`individualDeclarations.${index}.declarationSigned`] = 'Declaration must be signed';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Step 4-4: Review & Submit (final submission step)
 */
export function validateFinalSubmission(formData: FSApplicationFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!formData.finalReview) {
    errors.finalReview = 'You must review the application before submission';
  }

  if (!formData.submissionDeclaration) {
    errors.submissionDeclaration = 'You must make the submission declaration';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates a specific step by ID
 */
export function validateStep(stepId: string, formData: FSApplicationFormData): ValidationResult {
  switch (stepId) {
    case 'step-1-1':
      return validateStep1_1(formData);
    case 'step-1-2':
      return validateStep1_2(formData);
    case 'step-1-3':
      return validateStep1_3(formData);
    case 'step-1-4':
      return validateStep1_4(formData);
    case 'step-1-5':
      return validateStep1_5(formData);
    case 'step-4-1':
      return validateStep4_1(formData);
    case 'step-4-2':
      return validateStep4_2(formData);
    case 'step-4-3':
      return validateStep4_3(formData);
    case 'step-4-4':
      return validateFinalSubmission(formData);
    default:
      // For steps not yet implemented, return valid
      return { isValid: true, errors: {} };
  }
}

/**
 * Checks if a step can be marked as completed
 */
export function canCompleteStep(stepId: string, formData: FSApplicationFormData): boolean {
  const validation = validateStep(stepId, formData);
  return validation.isValid;
}
