/**
 * Audit Logger for DFSA Compliance
 * AML Module 14.3.1: Record keeping requirements
 */

interface AuditLogEntry {
  timestamp: string;
  userId?: string;
  action: string;
  details: Record<string, any>;
  userAgent: string;
}

/**
 * DFSA Audit Event Types
 * Comprehensive event tracking for regulatory compliance
 */
export const DFSA_AUDIT_EVENTS = {
  // DFSA Enquiry Sign-Up Events
  ENQUIRY_MODAL_OPENED: 'DFSA_ENQUIRY_MODAL_OPENED',
  ENQUIRY_FORM_SUBMITTED: 'DFSA_ENQUIRY_FORM_SUBMITTED',
  ENQUIRY_VALIDATION_FAILED: 'DFSA_ENQUIRY_VALIDATION_FAILED',
  ENQUIRY_SUCCESS: 'DFSA_ENQUIRY_SUCCESS',
  ENQUIRY_FAILED: 'DFSA_ENQUIRY_FAILED',
  ENQUIRY_API_CALL: 'DFSA_ENQUIRY_API_CALL',
  ENQUIRY_API_SUCCESS: 'DFSA_ENQUIRY_API_SUCCESS',
  ENQUIRY_API_ERROR: 'DFSA_ENQUIRY_API_ERROR',

  // Reference Number Generation
  REFERENCE_NUMBER_GENERATED: 'DFSA_REFERENCE_NUMBER_GENERATED',

  // Email and Communications
  EMAIL_SENT: 'DFSA_EMAIL_SENT',
  EMAIL_SEND_FAILED: 'DFSA_EMAIL_SEND_FAILED',

  // CRM Integration
  CRM_RECORD_CREATED: 'DFSA_CRM_RECORD_CREATED',
  CRM_RECORD_FAILED: 'DFSA_CRM_RECORD_FAILED',

  // Team Assignment
  TEAM_ASSIGNED: 'DFSA_TEAM_ASSIGNED',

  // Form Interactions
  SECTION_COMPLETED: 'DFSA_SECTION_COMPLETED',
  CONSENT_PROVIDED: 'DFSA_CONSENT_PROVIDED',
  CONSENT_DECLINED: 'DFSA_CONSENT_DECLINED',
} as const;

/**
 * Type for DFSA audit event names
 */
export type DFSAAuditEvent = typeof DFSA_AUDIT_EVENTS[keyof typeof DFSA_AUDIT_EVENTS];

export const auditLog = {
  /**
   * Log audit events for DFSA compliance
   * @param action - The action being performed (e.g., 'SIGNUP_MODAL_OPENED')
   * @param details - Additional details about the action
   */
  log: (action: string, details: Record<string, any> = {}) => {
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      action,
      details,
      userAgent: navigator.userAgent,
    };

    // Log to console for development/debugging
    console.log('[AUDIT]', entry);

    // TODO: Send to audit logging service when backend is ready
    // Example implementation:
    // fetch('/api/audit/log', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(entry)
    // }).catch(error => {
    //   console.error('Failed to send audit log:', error);
    // });
  }
};
