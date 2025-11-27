import React, { useState } from "react";
import {
  submitSupportRequest,
  type SupportRequestData,
} from "../../services/supportService";

/**
 * Demo component to test the Power App integration
 * This can be used for testing the API endpoint
 */
export const SupportIntegrationDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [testType, setTestType] = useState<'basic' | 'minimal' | 'custom'>('basic');
  const [customPayload, setCustomPayload] = useState('');

  const testBasicIntegration = async () => {
    const testData: SupportRequestData = {
      name: "Test User",
      email: "test@example.com",
      subject: "API Integration Test",
      category: "technical",
      priority: "medium",
      message:
        "This is a test message to verify the Power App integration is working correctly.",
    };

    const response = await submitSupportRequest(testData);
    
    if (response.success) {
      setResult(`✅ Success! Ticket ID: ${response.ticketId}\nMessage: ${response.message}`);
    } else {
      setResult(`❌ Failed: ${response.message}`);
    }
  };

  const testMinimalIntegration = async () => {
    const testData: SupportRequestData = {
      name: "Test",
      email: "test@test.com",
      subject: "Test",
      category: "other",
      priority: "low",
      message: "Test message",
    };

    const response = await submitSupportRequest(testData);
    
    if (response.success) {
      setResult(`✅ Minimal test success! Ticket ID: ${response.ticketId}`);
    } else {
      setResult(`❌ Minimal test failed: ${response.message}`);
    }
  };

  const testCustomPayload = async () => {
    try {
      const payload = JSON.parse(customPayload);
      const response = await fetch('https://kfrealexpressserver.vercel.app/api/v1/support/create-support-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      setResult(`Status: ${response.status}\nResponse: ${responseText}`);
    } catch (error) {
      setResult(`❌ Custom test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testIntegration = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      switch (testType) {
        case 'basic':
          await testBasicIntegration();
          break;
        case 'minimal':
          await testMinimalIntegration();
          break;
        case 'custom':
          await testCustomPayload();
          break;
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testEndpointAvailability = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // Test if endpoint is reachable with OPTIONS request
      const response = await fetch('https://kfrealexpressserver.vercel.app/api/v1/support/create-support-request', {
        method: 'OPTIONS',
      });
      
      setResult(`OPTIONS Response: ${response.status}\nHeaders: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
    } catch (error) {
      setResult(`❌ Endpoint test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Power App Integration Test
      </h3>
      
      <p className="text-sm text-gray-600 mb-4">
        Test the integration with the Power App endpoint:
        <br />
        <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
          https://kfrealexpressserver.vercel.app/api/v1/support/create-support-request
        </code>
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Test Type:</label>
        <select 
          value={testType} 
          onChange={(e) => setTestType(e.target.value as any)}
          className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="basic">Basic Test (Full Form Data)</option>
          <option value="minimal">Minimal Test (Required Fields Only)</option>
          <option value="custom">Custom Payload</option>
        </select>
      </div>

      {testType === 'custom' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Custom JSON Payload:</label>
          <textarea
            value={customPayload}
            onChange={(e) => setCustomPayload(e.target.value)}
            placeholder='{"name": "Test", "email": "test@test.com", "message": "Test"}'
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24"
          />
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={testIntegration}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Testing...
            </>
          ) : (
            'Test Integration'
          )}
        </button>

        <button
          onClick={testEndpointAvailability}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Test Endpoint
        </button>
      </div>

      {result && (
        <div
          className={`mt-4 p-3 rounded-md ${
            result.startsWith("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Debug Tips:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Check browser console for detailed logs</li>
          <li>• Try different test types to isolate the issue</li>
          <li>• Verify the API endpoint is accessible</li>
          <li>• Check if the API expects specific field names or formats</li>
        </ul>
      </div>
    </div>
  );
};