interface AuditLogEntry {
  timestamp: string;
  userId?: string;
  action: string;
  details: Record<string, any>;
  userAgent: string;
}

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
