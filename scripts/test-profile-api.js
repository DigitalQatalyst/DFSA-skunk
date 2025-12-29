/**
 * Test script for Profile API endpoints
 * Tests the /api/profile/domains/:domainKey endpoint
 */

const testProfileAPI = async () => {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
  const testDomainKey = 'profile_summary'; // Will return 404 since schema doesn't exist yet, but tests the route

  console.log('🧪 Testing Profile API Route...\n');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Testing domain: ${testDomainKey}\n`);

  try {
    // Test 1: GET without auth (should return 401)
    console.log('Test 1: GET without authentication');
    const response1 = await fetch(`${baseUrl}/api/profile/domains/${testDomainKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(`Status: ${response1.status}`);
    const data1 = await response1.json().catch(() => ({ error: 'No JSON response' }));
    console.log(`Response: ${JSON.stringify(data1, null, 2)}\n`);

    // Test 2: GET with invalid token (should return 401)
    console.log('Test 2: GET with invalid token');
    const response2 = await fetch(`${baseUrl}/api/profile/domains/${testDomainKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token',
      },
    });
    console.log(`Status: ${response2.status}`);
    const data2 = await response2.json().catch(() => ({ error: 'No JSON response' }));
    console.log(`Response: ${JSON.stringify(data2, null, 2)}\n`);

    // Test 3: OPTIONS (CORS preflight)
    console.log('Test 3: OPTIONS (CORS preflight)');
    const response3 = await fetch(`${baseUrl}/api/profile/domains/${testDomainKey}`, {
      method: 'OPTIONS',
    });
    console.log(`Status: ${response3.status}`);
    console.log(`CORS Headers:`, {
      'Access-Control-Allow-Origin': response3.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response3.headers.get('Access-Control-Allow-Methods'),
    });
    console.log('');

    // Test 4: Invalid domain key format
    console.log('Test 4: Missing domain key');
    const response4 = await fetch(`${baseUrl}/api/profile/domains/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(`Status: ${response4.status}`);
    const data4 = await response4.json().catch(() => ({ error: 'No JSON response' }));
    console.log(`Response: ${JSON.stringify(data4, null, 2)}\n`);

    console.log('✅ API route tests completed!');
    console.log('\nNote: Schema will return 404 until Phase 1 creates the schema JSON file.');
    console.log('Note: Authentication tests require a valid JWT token.');

  } catch (error) {
    console.error('❌ Test error:', error);
    console.error('\nMake sure the dev server is running: npm run vercel:dev');
  }
};

// Run tests
testProfileAPI();



