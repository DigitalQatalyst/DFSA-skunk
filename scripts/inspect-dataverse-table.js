/**
 * Script to inspect Dataverse table structure
 * Run with: node scripts/inspect-dataverse-table.js
 */

// Load environment variables if dotenv is available
try {
  const { config } = await import('dotenv');
  config();
} catch (e) {
  // dotenv not available, use process.env directly
}

const DATAVERSE_BASE_URL = process.env.DATAVERSE_API_URL || 'https://kf-dev-a.crm15.dynamics.com';
const DATAVERSE_TENANT_ID = process.env.DATAVERSE_TENANT_ID || process.env.tenant_id || '199ebd0d-2986-4f3d-8659-4388c5b2a724';
const DATAVERSE_CLIENT_ID = process.env.DATAVERSE_CLIENT_ID || process.env.client_id;
const DATAVERSE_CLIENT_SECRET = process.env.DATAVERSE_CLIENT_SECRET || process.env.client_secret;

async function getAuthToken() {
  const tokenEndpoint = `https://login.microsoftonline.com/${DATAVERSE_TENANT_ID}/oauth2/v2.0/token`;
  const scope = process.env.scope || `${DATAVERSE_BASE_URL}/.default`;
  
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: DATAVERSE_CLIENT_ID,
      client_secret: DATAVERSE_CLIENT_SECRET,
      scope: scope,
      grant_type: process.env.grant_type || 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function inspectTable() {
  try {
    console.log('🔍 Inspecting Dataverse table structure...\n');
    
    const token = await getAuthToken();
    const apiUrl = `${DATAVERSE_BASE_URL}/api/data/v9.2`;
    
    // Try to get table metadata
    console.log('1. Getting table metadata for kf_documents...');
    try {
      const metadataUrl = `${apiUrl}/EntityDefinitions(LogicalName='kf_documents')`;
      const metadataResponse = await fetch(metadataUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0',
        },
      });
      
      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        console.log('✅ Table metadata retrieved');
        console.log('   Display Name:', metadata.DisplayName?.UserLocalizedLabel?.Label);
        console.log('   Logical Name:', metadata.LogicalName);
        console.log('   Primary Id Attribute:', metadata.PrimaryIdAttribute);
        console.log('   Primary Name Attribute:', metadata.PrimaryNameAttribute);
        console.log('\n   Attributes:');
        
        if (metadata.Attributes) {
          metadata.Attributes.forEach(attr => {
            console.log(`   - ${attr.LogicalName} (${attr.AttributeType})`);
          });
        }
      } else {
        console.log('❌ Could not get metadata:', metadataResponse.status, metadataResponse.statusText);
      }
    } catch (e) {
      console.log('❌ Error getting metadata:', e.message);
    }
    
    // Try to query a sample record
    console.log('\n2. Querying sample records from kf_documents...');
    try {
      const queryUrl = `${apiUrl}/kf_documents?$top=1&$select=*`;
      const queryResponse = await fetch(queryUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0',
        },
      });
      
      if (queryResponse.ok) {
        const data = await queryResponse.json();
        console.log('✅ Sample record retrieved');
        if (data.value && data.value.length > 0) {
          console.log('\n   Fields in sample record:');
          Object.keys(data.value[0]).forEach(key => {
            console.log(`   - ${key}: ${typeof data.value[0][key]}`);
          });
        } else {
          console.log('   (No records found, but table exists)');
        }
      } else {
        const errorText = await queryResponse.text();
        console.log('❌ Query failed:', queryResponse.status, queryResponse.statusText);
        console.log('   Error:', errorText);
      }
    } catch (e) {
      console.log('❌ Error querying records:', e.message);
    }
    
    // Try alternative table name
    console.log('\n3. Trying alternative table name: kf_document (singular)...');
    try {
      const queryUrl = `${apiUrl}/kf_document?$top=1&$select=*`;
      const queryResponse = await fetch(queryUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0',
        },
      });
      
      if (queryResponse.ok) {
        const data = await queryResponse.json();
        console.log('✅ Sample record retrieved from kf_document');
        if (data.value && data.value.length > 0) {
          console.log('\n   Fields in sample record:');
          Object.keys(data.value[0]).forEach(key => {
            const value = data.value[0][key];
            console.log(`   - ${key}: ${typeof value}${value !== null ? ` (${JSON.stringify(value).substring(0, 50)})` : ''}`);
          });
        } else {
          console.log('   (No records found, but table exists)');
        }
      } else {
        const errorText = await queryResponse.text();
        console.log('❌ Query failed:', queryResponse.status, queryResponse.statusText);
        console.log('   Error:', errorText);
      }
    } catch (e) {
      console.log('❌ Error querying records:', e.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

inspectTable().catch(err => {
  console.error('Failed to inspect table:', err);
  process.exit(1);
});

