// Lightweight IndexedDB helper for onboarding progress
// Stores progress under object store 'onboarding' with keys 'progress' and 'data'

// Onboarding form data interface
interface OnboardingFormData {
  formId?: string;
  userId?: string;
  accountId?: string;
  onboardingState?: string;
  companyName?: string;
  industry?: string;
  businessType?: string;
  companyStage?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  registrationNumber?: string;
  establishmentDate?: string;
  businessSize?: string;
  businessPitch?: string;
  problemStatement?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  employeeCount?: number;
  founders?: string;
  foundingYear?: string;
  initialCapitalUsd?: number;
  fundingNeedsUsd?: number;
  businessRequirements?: string;
  businessNeeds?: string;
  id?: string;
  updatedAt?: string;
}

// IndexedDB record structure
interface IndexedDBRecord {
  key: string;
  value: OnboardingFormData | { lastSavedAt: string; isComplete: boolean };
}

const DB_NAME = "mzn_onboarding_db";
const DB_VERSION = 1;
const STORE_NAME = "onboarding";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      return reject(new Error("IndexedDB not supported"));
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function (ev) {
      const db = (ev.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
    req.onsuccess = function () {
      resolve(req.result);
    };
    req.onerror = function () {
      reject(req.error);
    };
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest
): Promise<T> {
  try {
    const db = await openDB();
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      try {
        const res = action(store);
        res.onsuccess = function (e) {
          resolve((e.target as IDBRequest).result);
        };
        res.onerror = function (e) {
          reject((e.target as IDBRequest).error);
        };
      } catch (err) {
        reject(err);
      }

      tx.oncomplete = function () {
        // no-op
      };
      tx.onerror = function () {
        reject(tx.error);
      };
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

// Keys we use
const PROGRESS_KEY = "progress";
const DATA_KEY = "data";
const STATUS_KEY = "status";

export async function saveProgressIndexedDB(
  data: OnboardingFormData
): Promise<boolean> {
  try {
    await withStore("readwrite", (store) =>
      store.put({
        key: PROGRESS_KEY,
        value: { ...data, updatedAt: new Date().toISOString() },
      })
    );
    await withStore("readwrite", (store) =>
      store.put({
        key: STATUS_KEY,
        value: { lastSavedAt: new Date().toISOString(), isComplete: false },
      })
    );
    return true;
  } catch (e) {
    console.error("IndexedDB saveProgress error", e);
    // fallback to localStorage
    try {
      localStorage.setItem(
        "onboardingProgress",
        JSON.stringify({ ...data, updatedAt: new Date().toISOString() })
      );
      return true;
    } catch (e2) {
      return false;
    }
  }
}

export async function loadProgressIndexedDB(): Promise<OnboardingFormData | null> {
  try {
    const result = await withStore<IndexedDBRecord | undefined>(
      "readonly",
      (store) => store.get(PROGRESS_KEY)
    );
    return result ? (result.value as OnboardingFormData) : null;
  } catch (e) {
    console.error("IndexedDB loadProgress error", e);
    try {
      const raw = localStorage.getItem("onboardingProgress");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

export async function saveDataIndexedDB(
  data: OnboardingFormData
): Promise<boolean> {
  try {
    await withStore("readwrite", (store) =>
      store.put({
        key: DATA_KEY,
        value: {
          ...data,
          updatedAt: new Date().toISOString(),
          id: data.id || Date.now().toString(),
        },
      })
    );
    // REMOVED: We no longer save status to IndexedDB - status is managed via API
    // await withStore("readwrite", (store) =>
    //   store.put({
    //     key: STATUS_KEY,
    //     value: { lastSavedAt: new Date().toISOString(), isComplete: true },
    //   })
    // );
    return true;
  } catch (e) {
    console.error("IndexedDB saveData error", e);
    try {
      localStorage.setItem(
        "onboardingData",
        JSON.stringify({
          ...data,
          updatedAt: new Date().toISOString(),
          id: data.id || Date.now().toString(),
        })
      );
      // REMOVED: localStorage.setItem("onboardingComplete", "true");
      // Onboarding status is now managed via API, not localStorage
      return true;
    } catch {
      return false;
    }
  }
}

export async function loadDataIndexedDB(): Promise<OnboardingFormData | null> {
  try {
    const result = await withStore<IndexedDBRecord | undefined>(
      "readonly",
      (store) => store.get(DATA_KEY)
    );
    if (result && result.value) return result.value as OnboardingFormData;
    // fallback to progress
    const prog = await loadProgressIndexedDB();
    return prog;
  } catch (e) {
    console.error("IndexedDB loadData error", e);
    try {
      const raw = localStorage.getItem("onboardingData");
      if (raw) return JSON.parse(raw);
      const progRaw = localStorage.getItem("onboardingProgress");
      if (progRaw) return JSON.parse(progRaw);
      return null;
    } catch {
      return null;
    }
  }
}

/**
 * DEPRECATED: Load onboarding status from IndexedDB
 * 
 * ⚠️ This function is deprecated. Onboarding status should be checked via API
 * using the checkOnboardingStatus function from onboardingStatus.ts
 * 
 * This function is kept for backward compatibility but always returns null
 * to ensure API-based checks are used instead.
 */
export async function loadStatusIndexedDB(): Promise<{
  lastSavedAt: string;
  isComplete: boolean;
} | null> {
  console.warn("⚠️ [DEPRECATED] loadStatusIndexedDB() called - onboarding status should be checked via API");
  // Always return null to force API check
  return null;
}

export async function resetOnboardingIndexedDB(): Promise<boolean> {
  try {
    await withStore("readwrite", (store) => store.delete(PROGRESS_KEY));
    await withStore("readwrite", (store) => store.delete(DATA_KEY));
    await withStore("readwrite", (store) => store.delete(STATUS_KEY));
    // Clean up localStorage (for cleanup only - status is managed via API)
    localStorage.removeItem("onboardingProgress");
    localStorage.removeItem("onboardingData");
    localStorage.removeItem("onboardingStatus");
    // Also remove the deprecated onboardingComplete key
    localStorage.removeItem("onboardingComplete");
    return true;
  } catch (e) {
    console.error("IndexedDB reset error", e);
    try {
      // Clean up localStorage (for cleanup only - status is managed via API)
      localStorage.removeItem("onboardingProgress");
      localStorage.removeItem("onboardingData");
      localStorage.removeItem("onboardingStatus");
      localStorage.removeItem("onboardingComplete");
      return true;
    } catch {
      return false;
    }
  }
}
