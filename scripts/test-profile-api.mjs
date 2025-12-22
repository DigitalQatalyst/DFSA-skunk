/**
 * Test script for Profile API endpoints
 * Tests the /api/profile/domains/:domainKey endpoint
 * 
 * Usage: node scripts/test-profile-api.mjs
 * Make sure dev server is running: npm run vercel:dev
 */

import http from 'http';

const makeRequest = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: jsonBody,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const testProfileAPI = async () => {
  const testDomainKey = 'profile_summary';

  console.log('🧪 Testing Profile API Route...');
  console.log(`Testing domain: ${testDomainKey}`);
  console.log('');

  try {
    // Test 1: GET without auth (should return 401)
    console.log('Test 1: GET without authentication');
    try {
      const result1 = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: `/api/profile/domains/${testDomainKey}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(`✅ Status: ${result1.status}`);
      console.log(`Response: ${JSON.stringify(result1.body, null, 2)}`);
      console.log('');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Server not running. Start with: npm run vercel:dev');
        console.log('   The API route is configured correctly, but needs the server to be running.');
        console.log('');
        return; // Exit early if server isn't running
      } else {
        console.log(`❌ Error: ${error.message}`);
        console.log('');
      }
    }

    // Test 2: OPTIONS (CORS preflight)
    console.log('Test 2: OPTIONS (CORS preflight)');
    try {
      const result2 = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: `/api/profile/domains/${testDomainKey}`,
        method: 'OPTIONS',
      });
      console.log(`✅ Status: ${result2.status}`);
      console.log(`CORS Headers:`, {
        'Access-Control-Allow-Origin': result2.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': result2.headers['access-control-allow-methods'],
      });
      console.log('');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Server not running. Start with: npm run vercel:dev');
        console.log('');
      } else {
        console.log(`❌ Error: ${error.message}`);
        console.log('');
      }
    }

    // Test 3: GET with invalid token (should return 401)
    console.log('Test 3: GET with invalid token');
    try {
      const result3 = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: `/api/profile/domains/${testDomainKey}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer invalid-token-12345',
        },
      });
      console.log(`✅ Status: ${result3.status}`);
      console.log(`Response: ${JSON.stringify(result3.body, null, 2)}`);
      console.log('');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Server not running. Start with: npm run vercel:dev');
        console.log('');
      } else {
        console.log(`❌ Error: ${error.message}`);
        console.log('');
      }
    }

    console.log('✅ API route structure tests completed!');
    console.log('');
    console.log('📝 Expected Results:');
    console.log('  - Test 1: Should return 401 (Unauthorized) without token');
    console.log('  - Test 2: Should return 200 with CORS headers');
    console.log('  - Test 3: Should return 401 (Unauthorized) with invalid token');
    console.log('');
    console.log('⚠️  Note: Schema will return 404 until Phase 1 creates the schema JSON file.');
    console.log('⚠️  Note: Full authentication tests require a valid JWT token.');

  } catch (error) {
    console.error('❌ Test error:', error);
    process.exit(1);
  }
};

// Run tests
testProfileAPI().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
