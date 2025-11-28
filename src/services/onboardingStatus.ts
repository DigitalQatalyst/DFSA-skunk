import { isDemoModeEnabled } from '../utils/demoAuthUtils';

const ONBOARDING_API_BASE =
  'https://kfrealexpressserver.vercel.app/api/v1/onboarding';

export type OnboardingState = 'completed' | 'not_completed';

const DEMO_ONBOARDING_KEY = 'demo_onboarding_status';

async function callOnboardingEndpoint(accountId: string) {
  const url = `${ONBOARDING_API_BASE}/${encodeURIComponent(accountId)}`;
  console.log('🔍 [ONBOARDING API] Calling onboarding endpoint:', url);
  console.log('🆔 [ONBOARDING API] Account ID:', accountId);
  
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

/**
 * Set onboarding status in localStorage for demo mode
 * @param status - The onboarding status to set
 */
export function setDemoOnboardingStatus(status: OnboardingState): void {
  if (isDemoModeEnabled()) {
    localStorage.setItem(DEMO_ONBOARDING_KEY, status);
    console.log('💾 [DEMO MODE] Onboarding status set to:', status);
  }
}

/**
 * Get onboarding status from localStorage for demo mode
 * @returns The onboarding status or null if not set
 */
function getDemoOnboardingStatus(): OnboardingState | null {
  if (isDemoModeEnabled()) {
    const status = localStorage.getItem(DEMO_ONBOARDING_KEY) as OnboardingState | null;
    console.log('💾 [DEMO MODE] Retrieved onboarding status:', status);
    return status;
  }
  return null;
}

export async function checkOnboardingStatus(
  accountId?: string | null
): Promise<OnboardingState> {
  console.log('===== ONBOARDING CHECK START =====');
  console.log('🆔 [ONBOARDING CHECK] Account ID:', accountId || 'MISSING');

  // In demo mode, check localStorage instead of API
  if (isDemoModeEnabled()) {
    const demoStatus = getDemoOnboardingStatus();
    const status = demoStatus || 'not_completed';
    console.log('🎭 [DEMO MODE] Returning onboarding status:', status);
    console.log('===================================');
    return status;
  }

  if (!accountId) {
    console.log('⚠️ [ONBOARDING CHECK] No accountId provided - returning not_completed');
    console.log('===================================');
    return 'not_completed';
  }

  let attempt = 0;
  while (attempt < 2) {
    try {
      console.log(`🔄 [ONBOARDING CHECK] Attempt ${attempt + 1}/2`);
      const response = await callOnboardingEndpoint(accountId);
      console.log('📥 [ONBOARDING CHECK] Response status:', response.status, response.statusText);

      if (response.ok) {
        const payload = await response.json().catch(() => null);
        console.log('📦 [ONBOARDING CHECK] Response payload:', payload);
        
        // Check if we have data
        const dataArray = Array.isArray(payload?.data) ? payload?.data : [];
        console.log('📊 [ONBOARDING CHECK] Data array length:', dataArray.length);
        
        if (dataArray.length === 0) {
          console.log('ℹ️ [ONBOARDING CHECK] No onboarding record found (empty array) - returning not_completed');
          console.log('===================================');
          return 'not_completed';
        }

        // SIMPLIFIED CHECK: If a record exists for this accountId, onboarding is completed
        // Records are only created on final form submission, not during auto-save
        const firstRecord = dataArray[0];
        console.log('📋 [ONBOARDING CHECK] First record found:', {
          formId: firstRecord?.kf_firmonboardingid,
          accountId: firstRecord?.kf_accountid_kf,
          createdOn: firstRecord?.createdon,
          companyName: firstRecord?.kf_companyname,
          email: firstRecord?.kf_emailaddress,
        });

        // Record exists = onboarding completed
        console.log('✅ [ONBOARDING CHECK] Record exists for accountId - marking as completed');
        console.log('===================================');
        return 'completed';
      }

      if (response.status === 404) {
        console.log('ℹ️ [ONBOARDING CHECK] No onboarding record found (404) - returning not_completed');
        console.log('===================================');
        return 'not_completed';
      }

      if (response.status >= 500) {
        attempt += 1;
        console.warn(`⚠️ [ONBOARDING CHECK] Server error (${response.status}) - attempt ${attempt}/2`);
        if (attempt < 2) continue;
        console.log('❌ [ONBOARDING CHECK] Max retries reached - returning not_completed');
        console.log('===================================');
        return 'not_completed';
      }

      console.warn(`⚠️ [ONBOARDING CHECK] Unexpected status ${response.status} - returning not_completed`);
      console.log('===================================');
      return 'not_completed';
    } catch (error) {
      attempt += 1;
      console.error(`❌ [ONBOARDING CHECK] Error on attempt ${attempt}:`, error);
      if (attempt < 2) {
        console.log(`🔄 [ONBOARDING CHECK] Retrying... (${attempt + 1}/2)`);
        continue;
      }
      console.log('❌ [ONBOARDING CHECK] Max retries reached after error - returning not_completed');
      console.log('===================================');
      return 'not_completed';
    }
  }

  console.log('❌ [ONBOARDING CHECK] Exhausted all attempts - returning not_completed');
  console.log('===================================');
  return 'not_completed';
}

