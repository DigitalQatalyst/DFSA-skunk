/**
 * Form Draft Storage Utility
 * Handles saving and loading form drafts in browser localStorage
 */

import { isFileWithId, isFileWithIdArray, serializeFilesForSubmission } from './fileValidationStandards';

const DRAFT_PREFIX = 'form_draft_';
const DRAFT_EXPIRY_DAYS = 30; // Drafts expire after 30 days

export interface FormDraft {
  formId: string;
  formData: any;
  currentStep: number;
  completedSteps: number[];
  lastSaved: string;
  version: number;
}

/**
 * Generate a storage key for a form draft
 */
function getDraftKey(formId: string): string {
  return `${DRAFT_PREFIX}${formId}`;
}

/**
 * Serialize form data for storage (handles FileWithId arrays, File objects and other non-serializable types)
 */
function serializeFormData(formData: any): any {
  const serialized: any = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (value === null || value === undefined) {
      serialized[key] = value;
    } else if (isFileWithIdArray(value)) {
      // Handle FileWithId arrays - serialize to metadata
      serialized[key] = {
        _type: 'fileWithIdArray',
        files: serializeFilesForSubmission(value)
      };
    } else if (isFileWithId(value)) {
      // Handle single FileWithId
      serialized[key] = {
        _type: 'fileWithId',
        ...serializeFilesForSubmission([value])[0]
      };
    } else if (value instanceof File) {
      // Store file metadata instead of the file object (legacy support)
      serialized[key] = {
        _type: 'file',
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      };
    } else if (value instanceof Date) {
      serialized[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      // Handle arrays that might contain File objects or FileWithId
      serialized[key] = value.map(item => {
        if (isFileWithId(item)) {
          return {
            _type: 'fileWithId',
            ...serializeFilesForSubmission([item])[0]
          };
        } else if (item instanceof File) {
          return {
            _type: 'file',
            name: item.name,
            size: item.size,
            type: item.type,
            lastModified: item.lastModified,
          };
        }
        return item;
      });
    } else if (typeof value === 'object' && value.constructor === Object) {
      // Recursively serialize nested objects
      serialized[key] = serializeFormData(value);
    } else {
      serialized[key] = value;
    }
  }
  
  return serialized;
}

/**
 * Save form draft to localStorage
 */
export function saveFormDraft(
  formId: string,
  formData: any,
  currentStep: number = 0,
  completedSteps: number[] = []
): boolean {
  try {
    // Serialize form data to handle File objects and other non-serializable types
    const serializedData = serializeFormData(formData);
    
    const draft: FormDraft = {
      formId,
      formData: serializedData,
      currentStep,
      completedSteps: [...completedSteps],
      lastSaved: new Date().toISOString(),
      version: 1,
    };

    const key = getDraftKey(formId);
    localStorage.setItem(key, JSON.stringify(draft));
    
    // Also save a timestamp for expiry tracking
    localStorage.setItem(`${key}_expiry`, Date.now().toString());
    
    return true;
  } catch (error) {
    console.error('Error saving form draft:', error);
    // Handle quota exceeded or other storage errors
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing old drafts');
      clearExpiredDrafts();
      // Try once more after cleanup
      try {
        const draft: FormDraft = {
          formId,
          formData: { ...formData },
          currentStep,
          completedSteps: [...completedSteps],
          lastSaved: new Date().toISOString(),
          version: 1,
        };
        localStorage.setItem(getDraftKey(formId), JSON.stringify(draft));
        return true;
      } catch (retryError) {
        console.error('Failed to save draft after cleanup:', retryError);
        return false;
      }
    }
    return false;
  }
}

/**
 * Load form draft from localStorage
 */
export function loadFormDraft(formId: string): FormDraft | null {
  try {
    const key = getDraftKey(formId);
    const draftJson = localStorage.getItem(key);
    
    if (!draftJson) {
      return null;
    }

    const draft: FormDraft = JSON.parse(draftJson);
    
    // Check if draft has expired
    const expiryKey = `${key}_expiry`;
    const expiryTimestamp = localStorage.getItem(expiryKey);
    
    if (expiryTimestamp) {
      const expiryDate = parseInt(expiryTimestamp, 10) + (DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      if (Date.now() > expiryDate) {
        // Draft expired, remove it
        clearFormDraft(formId);
        return null;
      }
    }

    return draft;
  } catch (error) {
    console.error('Error loading form draft:', error);
    return null;
  }
}

/**
 * Clear a specific form draft
 */
export function clearFormDraft(formId: string): void {
  try {
    const key = getDraftKey(formId);
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_expiry`);
  } catch (error) {
    console.error('Error clearing form draft:', error);
  }
}

/**
 * Check if a draft exists for a form
 */
export function hasFormDraft(formId: string): boolean {
  const draft = loadFormDraft(formId);
  return draft !== null;
}

/**
 * Get all form drafts (for management/debugging)
 */
export function getAllFormDrafts(): FormDraft[] {
  const drafts: FormDraft[] = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DRAFT_PREFIX) && !key.endsWith('_expiry')) {
        const draft = loadFormDraft(key.replace(DRAFT_PREFIX, ''));
        if (draft) {
          drafts.push(draft);
        }
      }
    }
  } catch (error) {
    console.error('Error getting all drafts:', error);
  }
  
  return drafts;
}

/**
 * Clear expired drafts (cleanup utility)
 */
export function clearExpiredDrafts(): void {
  try {
    const now = Date.now();
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DRAFT_PREFIX) && key.endsWith('_expiry')) {
        const expiryTimestamp = localStorage.getItem(key);
        if (expiryTimestamp) {
          const expiryDate = parseInt(expiryTimestamp, 10) + (DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
          if (now > expiryDate) {
            const formId = key.replace(DRAFT_PREFIX, '').replace('_expiry', '');
            keysToRemove.push(getDraftKey(formId));
            keysToRemove.push(key);
          }
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    if (keysToRemove.length > 0) {
      console.log(`Cleared ${keysToRemove.length / 2} expired draft(s)`);
    }
  } catch (error) {
    console.error('Error clearing expired drafts:', error);
  }
}

/**
 * Get draft info (last saved time, etc.)
 */
export function getDraftInfo(formId: string): { lastSaved: string; hasDraft: boolean } | null {
  const draft = loadFormDraft(formId);
  if (!draft) {
    return null;
  }
  
  return {
    lastSaved: draft.lastSaved,
    hasDraft: true,
  };
}

