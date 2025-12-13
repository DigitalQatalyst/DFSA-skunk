/**
 * DFSA Form Offline Support Utilities
 *
 * Basic offline support with localStorage backup
 * Requirements: 6.2, 6.3
 */

import { FSApplicationFormData } from '../../../types/dfsa';
import {
  saveDraftToLocalStorage,
  loadDraftFromLocalStorage,
  DraftData,
  DraftSaveResult
} from './draftManager';

/**
 * Online status type
 */
export type OnlineStatus = 'online' | 'offline' | 'unknown';

/**
 * Pending operation for offline queue
 */
export interface PendingOperation {
  id: string;
  type: 'save' | 'submit' | 'upload';
  timestamp: number;
  data: unknown;
  retryCount: number;
  maxRetries: number;
}

/**
 * Offline queue storage key
 */
const OFFLINE_QUEUE_KEY = 'dfsa-fs-offline-queue';

/**
 * Gets the current online status
 */
export function getOnlineStatus(): OnlineStatus {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }
  return navigator.onLine ? 'online' : 'offline';
}

/**
 * Checks if the browser is currently online
 */
export function isOnline(): boolean {
  return getOnlineStatus() === 'online';
}

/**
 * Checks if the browser is currently offline
 */
export function isOffline(): boolean {
  return getOnlineStatus() === 'offline';
}

/**
 * Subscribes to online/offline status changes
 */
export function subscribeToOnlineStatus(
  callback: (status: OnlineStatus) => void
): () => void {
  const handleOnline = () => callback('online');
  const handleOffline = () => callback('offline');

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return unsubscribe function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Saves form data with offline fallback
 *
 * Attempts to save to the server first, falls back to localStorage if offline
 */
export async function saveWithOfflineFallback(
  formData: FSApplicationFormData,
  currentStep: string,
  currentStepIndex: number,
  completedSteps: string[],
  applicableSteps: string[],
  applicationId: string | null,
  applicationRef: string | null,
  serverSave?: () => Promise<boolean>
): Promise<{ success: boolean; savedLocally: boolean; error?: string }> {
  // Always save to localStorage first as backup
  const localResult = saveDraftToLocalStorage(
    formData,
    currentStep,
    currentStepIndex,
    completedSteps,
    applicableSteps,
    applicationId,
    applicationRef
  );

  if (!localResult.success) {
    return {
      success: false,
      savedLocally: false,
      error: 'Failed to save locally'
    };
  }

  // If offline, return success with local save
  if (isOffline()) {
    return {
      success: true,
      savedLocally: true
    };
  }

  // If server save function provided, attempt server save
  if (serverSave) {
    try {
      const serverSuccess = await serverSave();
      return {
        success: serverSuccess,
        savedLocally: true
      };
    } catch (error) {
      // Server save failed, but local save succeeded
      return {
        success: true,
        savedLocally: true,
        error: 'Server save failed, saved locally'
      };
    }
  }

  return {
    success: true,
    savedLocally: true
  };
}

/**
 * Loads form data with offline support
 *
 * Attempts to load from server first, falls back to localStorage
 */
export async function loadWithOfflineFallback(
  serverLoad?: () => Promise<DraftData | null>
): Promise<{ data: DraftData | null; fromLocal: boolean; error?: string }> {
  // If offline, load from localStorage
  if (isOffline()) {
    const localResult = loadDraftFromLocalStorage();
    return {
      data: localResult.data,
      fromLocal: true,
      error: localResult.error
    };
  }

  // If server load function provided, attempt server load
  if (serverLoad) {
    try {
      const serverData = await serverLoad();
      if (serverData) {
        return {
          data: serverData,
          fromLocal: false
        };
      }
    } catch (error) {
      // Server load failed, fall back to local
      console.warn('[offlineSupport] Server load failed, falling back to local:', error);
    }
  }

  // Fall back to localStorage
  const localResult = loadDraftFromLocalStorage();
  return {
    data: localResult.data,
    fromLocal: true,
    error: localResult.error
  };
}

/**
 * Gets pending operations from the offline queue
 */
export function getPendingOperations(): PendingOperation[] {
  try {
    const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Adds an operation to the offline queue
 */
export function addPendingOperation(
  type: PendingOperation['type'],
  data: unknown
): string {
  const operations = getPendingOperations();
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const operation: PendingOperation = {
    id,
    type,
    timestamp: Date.now(),
    data,
    retryCount: 0,
    maxRetries: 3
  };

  operations.push(operation);

  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(operations));
  } catch (error) {
    console.error('[offlineSupport] Failed to add pending operation:', error);
  }

  return id;
}

/**
 * Removes an operation from the offline queue
 */
export function removePendingOperation(id: string): boolean {
  const operations = getPendingOperations();
  const filtered = operations.filter(op => op.id !== id);

  if (filtered.length === operations.length) {
    return false; // Operation not found
  }

  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

/**
 * Updates retry count for a pending operation
 */
export function updateOperationRetryCount(id: string): boolean {
  const operations = getPendingOperations();
  const operation = operations.find(op => op.id === id);

  if (!operation) return false;

  operation.retryCount += 1;

  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(operations));
    return true;
  } catch {
    return false;
  }
}

/**
 * Clears all pending operations
 */
export function clearPendingOperations(): void {
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  } catch (error) {
    console.error('[offlineSupport] Failed to clear pending operations:', error);
  }
}

/**
 * Processes pending operations when coming back online
 */
export async function processPendingOperations(
  handlers: {
    save?: (data: unknown) => Promise<boolean>;
    submit?: (data: unknown) => Promise<boolean>;
    upload?: (data: unknown) => Promise<boolean>;
  }
): Promise<{ processed: number; failed: number }> {
  const operations = getPendingOperations();
  let processed = 0;
  let failed = 0;

  for (const operation of operations) {
    const handler = handlers[operation.type];

    if (!handler) {
      // No handler for this operation type
      removePendingOperation(operation.id);
      continue;
    }

    try {
      const success = await handler(operation.data);

      if (success) {
        removePendingOperation(operation.id);
        processed++;
      } else {
        updateOperationRetryCount(operation.id);

        if (operation.retryCount >= operation.maxRetries) {
          removePendingOperation(operation.id);
          failed++;
        }
      }
    } catch (error) {
      updateOperationRetryCount(operation.id);

      if (operation.retryCount >= operation.maxRetries) {
        removePendingOperation(operation.id);
        failed++;
      }
    }
  }

  return { processed, failed };
}

/**
 * React hook for online status
 */
export function useOnlineStatus(): OnlineStatus {
  const [status, setStatus] = React.useState<OnlineStatus>(getOnlineStatus);

  React.useEffect(() => {
    const unsubscribe = subscribeToOnlineStatus(setStatus);
    return unsubscribe;
  }, []);

  return status;
}

// Import React for the hook
import React from 'react';

/**
 * React hook for offline-aware form operations
 */
export function useOfflineSupport() {
  const onlineStatus = useOnlineStatus();
  const [pendingCount, setPendingCount] = React.useState(0);

  // Update pending count when status changes
  React.useEffect(() => {
    setPendingCount(getPendingOperations().length);
  }, [onlineStatus]);

  // Process pending operations when coming back online
  React.useEffect(() => {
    if (onlineStatus === 'online' && pendingCount > 0) {
      // Notify that we're back online with pending operations
      console.log(`[offlineSupport] Back online with ${pendingCount} pending operations`);
    }
  }, [onlineStatus, pendingCount]);

  return {
    isOnline: onlineStatus === 'online',
    isOffline: onlineStatus === 'offline',
    onlineStatus,
    pendingCount,
    addPendingOperation,
    processPendingOperations,
    clearPendingOperations
  };
}
