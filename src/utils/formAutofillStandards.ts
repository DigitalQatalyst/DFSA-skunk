/**
 * W3C HTML5 Autocomplete Attribute Standards
 * 
 * Maps form field IDs and labels to appropriate autocomplete values
 * to enable browser autofill and password manager integration.
 * 
 * Reference: https://html.spec.whatwg.org/multipage/forms.html#autofill
 */

/**
 * Simplified form field interface for autofill utilities
 */
interface FormFieldInput {
  id: string;
  label: string;
  type: string;
}

/**
 * Maps field IDs and labels to W3C autocomplete attribute values
 */
export function getAutocompleteAttribute(field: FormFieldInput): string {
  const lowerId = field.id.toLowerCase();
  const lowerLabel = field.label.toLowerCase();

  // Email fields - always use 'email'
  if (field.type === 'email' || lowerId.includes('email') || lowerLabel.includes('email')) {
    return 'email';
  }

  // Phone/Telephone fields - always use 'tel'
  if (field.type === 'tel' || lowerId.includes('phone') || lowerId.includes('mobile') || 
      lowerId.includes('telephone') || lowerLabel.includes('phone') || 
      lowerLabel.includes('mobile') || lowerLabel.includes('telephone')) {
    return 'tel';
  }

  // Name fields
  if (lowerId.includes('name') || lowerLabel.includes('name')) {
    if (lowerId.includes('first') || lowerLabel.includes('first name') || 
        lowerLabel.includes('given')) {
      return 'given-name';
    }
    if (lowerId.includes('last') || lowerLabel.includes('last name') || 
        lowerLabel.includes('family') || lowerLabel.includes('surname')) {
      return 'family-name';
    }
    if (lowerId.includes('full') || lowerLabel.includes('full name') || 
        lowerId.includes('applicant') || lowerLabel.includes('applicant')) {
      return 'name';
    }
    if (lowerId.includes('submitter') || lowerLabel.includes('submitter') || 
        lowerId.includes('requestor') || lowerLabel.includes('requestor')) {
      return 'name';
    }
    // Default for name fields
    return 'name';
  }

  // Company/Organization fields
  if (lowerId.includes('company') || lowerId.includes('organization') || 
      lowerId.includes('organisation') || lowerLabel.includes('company') || 
      lowerLabel.includes('organization') || lowerLabel.includes('organisation')) {
    return 'organization';
  }

  // Position/Title fields
  if (lowerId.includes('position') || lowerId.includes('title') || 
      lowerLabel.includes('position') || lowerLabel.includes('job title') || 
      lowerLabel.includes('role')) {
    return 'organization-title';
  }

  // Address fields
  if (lowerId.includes('address') || lowerLabel.includes('address')) {
    if (lowerId.includes('street') || lowerId.includes('line1') || 
        lowerId.includes('line 1') || lowerLabel.includes('street')) {
      return 'street-address';
    }
    if (lowerId.includes('line2') || lowerId.includes('line 2') || 
        lowerLabel.includes('address line 2')) {
      return 'address-line2';
    }
    if (lowerId.includes('city') || lowerLabel.includes('city')) {
      return 'address-level2'; // City
    }
    if (lowerId.includes('state') || lowerId.includes('province') || 
        lowerLabel.includes('state') || lowerLabel.includes('province')) {
      return 'address-level1'; // State/Province
    }
    if (lowerId.includes('zip') || lowerId.includes('postal') || 
        lowerId.includes('postcode') || lowerLabel.includes('postal code') || 
        lowerLabel.includes('zip code')) {
      return 'postal-code';
    }
    if (lowerId.includes('country') || lowerLabel.includes('country')) {
      return 'country';
    }
    // Default for address
    return 'street-address';
  }

  // Date of birth
  if (lowerId.includes('dob') || lowerId.includes('birth') || 
      lowerLabel.includes('date of birth') || lowerLabel.includes('birth date')) {
    return 'bday';
  }

  // Credit card fields (for financial forms)
  if (lowerId.includes('card') || lowerLabel.includes('card number')) {
    return 'cc-number';
  }
  if (lowerId.includes('cvv') || lowerId.includes('cvc') || lowerLabel.includes('cvv') || 
      lowerLabel.includes('cvc')) {
    return 'cc-csc';
  }
  if (lowerId.includes('cardexpiry') || lowerId.includes('card expiry') || 
      lowerLabel.includes('expiry')) {
    return 'cc-exp';
  }

  // Currency/Amount fields
  if (lowerId.includes('amount') || lowerId.includes('loan') || 
      lowerId.includes('investment') || lowerId.includes('contribution') || 
      lowerLabel.includes('amount') || lowerLabel.includes('loan amount')) {
    return 'transaction-amount';
  }

  // Company/Registration numbers - use 'organization' context but no specific autocomplete
  if (lowerId.includes('registration') || lowerId.includes('company number') || 
      lowerId.includes('companynumber') || lowerId.includes('reg') || 
      lowerLabel.includes('registration number') || lowerLabel.includes('company number')) {
    return 'off'; // Company numbers are unique, can't autofill
  }

  // Funding/Reference numbers - unique identifiers, disable autofill
  if (lowerId.includes('funding') || lowerId.includes('reference') || 
      lowerId.includes('sequence') || lowerLabel.includes('funding number') || 
      lowerLabel.includes('reference number')) {
    return 'off';
  }

  // Password fields
  if (field.type === 'password') {
    if (lowerId.includes('current') || lowerLabel.includes('current password')) {
      return 'current-password';
    }
    if (lowerId.includes('new') || lowerLabel.includes('new password')) {
      return 'new-password';
    }
    return 'current-password'; // Default for password fields
  }

  // Default: disable autofill for unknown fields
  return 'off';
}

/**
 * Gets the appropriate name attribute for form fields
 * This helps password managers identify fields correctly
 */
export function getNameAttribute(field: FormFieldInput): string {
  // Use the field ID as the name attribute for consistency
  // This helps password managers and form libraries identify fields
  return field.id;
}

