/**
 * Utility functions for testing API endpoints
 */

const SUPPORT_ENDPOINT = 'https://kfrealexpressserver.vercel.app/api/v1/support/create-support-request';

export interface ApiTestResult {
  success: boolean;
  status: number;
  response: string;
  headers: Record<string, string>;
  error?: string;
}

/**
 * Test the API endpoint with different payload formats
 */
export const testApiEndpoint = async (payload: any, contentType: string = 'application/json'): Promise<ApiTestResult> => {
  try {
    const headers: Record<string, string> = {};
    let body: string | FormData;

    if (contentType === 'application/json') {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(payload);
    } else if (contentType === 'multipart/form-data') {
      // Don't set Content-Type for FormData - browser will set it with boundary
      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        formData.append(key, payload[key]);
      });
      body = formData;
    } else {
      headers['Content-Type'] = contentType;
      body = typeof payload === 'string' ? payload : JSON.stringify(payload);
    }

    console.log('Testing API with:', { payload, contentType, headers });

    const response = await fetch(SUPPORT_ENDPOINT, {
      method: 'POST',
      headers,
      body,
    });

    const responseText = await response.text();
    const responseHeaders = Object.fromEntries(response.headers.entries());

    console.log('API Response:', {
      status: response.status,
      headers: responseHeaders,
      body: responseText
    });

    return {
      success: response.ok,
      status: response.status,
      response: responseText,
      headers: responseHeaders,
    };

  } catch (error) {
    console.error('API Test Error:', error);
    return {
      success: false,
      status: 0,
      response: '',
      headers: {},
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test common payload variations
 */
export const testCommonPayloads = async () => {
  const results: Array<{ name: string; result: ApiTestResult }> = [];

  // Test 1: Minimal JSON payload
  results.push({
    name: 'Minimal JSON',
    result: await testApiEndpoint({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    })
  });

  // Test 2: Full JSON payload
  results.push({
    name: 'Full JSON',
    result: await testApiEndpoint({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      category: 'technical',
      priority: 'medium',
      message: 'Test message',
      timestamp: new Date().toISOString(),
      source: 'web_portal'
    })
  });

  // Test 3: FormData payload
  results.push({
    name: 'FormData',
    result: await testApiEndpoint({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message'
    }, 'multipart/form-data')
  });

  // Test 4: Different field names (snake_case)
  results.push({
    name: 'Snake Case Fields',
    result: await testApiEndpoint({
      user_name: 'Test User',
      user_email: 'test@example.com',
      support_subject: 'Test Subject',
      support_message: 'Test message'
    })
  });

  // Test 5: Power Platform common format
  results.push({
    name: 'Power Platform Format',
    result: await testApiEndpoint({
      title: 'Test Subject',
      description: 'Test message',
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      category: 'technical',
      priority: 'medium'
    })
  });

  return results;
};

/**
 * Check if the endpoint supports CORS and what methods are allowed
 */
export const testEndpointCapabilities = async (): Promise<ApiTestResult> => {
  try {
    const response = await fetch(SUPPORT_ENDPOINT, {
      method: 'OPTIONS',
    });

    const responseHeaders = Object.fromEntries(response.headers.entries());

    return {
      success: response.ok,
      status: response.status,
      response: await response.text(),
      headers: responseHeaders,
    };

  } catch (error) {
    return {
      success: false,
      status: 0,
      response: '',
      headers: {},
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};