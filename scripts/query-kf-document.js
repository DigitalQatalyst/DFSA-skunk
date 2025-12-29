/**
 * Query kf_document table to see its structure
 */

// Use the existing middleware code
import { getAuthToken } from '../api/middleware/dataverse-client.js';

const DATAVERSE_BASE_URL = process.env.DATAVERSE_API_URL || 'https://kf-dev-a.crm15.dynamics.com';
const DATAVERSE_TENANT_ID = process.env.DATAVERSE_TENANT_ID || process.env.tenant_id || '199ebd0d-2986-4f3d-8659-4388c5b2a724';
const DATAVERSE_CLIENT_ID = process.env.DATAVERSE_CLIENT_ID || process.env.client_id;
const DATAVERSE_CLIENT_SECRET = process.env.DATAVERSE_CLIENT_SECRET || process.env.client_secret;

async function queryTable() {
  try {
    console.log('🔍 Querying kf_document table...\n');
    
    // Get token
    const tokenEndpoint = `https://login.microsoftonline.com/${DATAVERSE_TENANT_ID}/oauth2/v2.0/token`;
    const scope = process.env.scope || `${DATAVERSE_BASE_URL}/.default`;
    
    console.log('1. Getting auth token...');
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DATAVERSE_CLIENT_ID,
        client_secret: DATAVERSE_CLIENT_SECRET,
        scope: scope,
        grant_type: 'client_credentials',
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`Token failed: ${tokenResponse.statusText}`);
    }
    
    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;
    console.log('✅ Token obtained\n');
    
    // Query table
    const apiUrl = `${DATAVERSE_BASE_URL}/api/data/v9.2`;
    console.log('2. Querying kf_document table...');
    
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
      console.log('✅ Query successful!\n');
      
      if (data.value && data.value.length > 0) {
        console.log('📋 Fields found in kf_document table:\n');
        const record = data.value[0];
        Object.keys(record).sort().forEach(key => {
          const value = record[key];
          const type = typeof value;
          const preview = value !== null && value !== undefined 
            ? String(value).substring(0, 50) 
            : 'null';
          console.log(`   ${key.padEnd(40)} ${type.padEnd(10)} ${preview}`);
        });
      } else {
        console.log('   (No records found, but table exists)');
        console.log('   Trying to get metadata...\n');
        
        // Get metadata
        const metadataUrl = `${apiUrl}/EntityDefinitions(LogicalName='kf_documents')?$select=LogicalName,DisplayName&$expand=Attributes($select=LogicalName,DisplayName,AttributeType)`;
        const metaResponse = await fetch(metadataUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (metaResponse.ok) {
          const meta = await metaResponse.json();
          console.log('📋 Attributes from metadata:\n');
          if (meta.Attributes) {
            meta.Attributes.forEach(attr => {
              console.log(`   ${attr.LogicalName.padEnd(40)} ${attr.AttributeType}`);
            });
          }
        }
      }
    } else {
      const errorText = await queryResponse.text();
      console.log('❌ Query failed:', queryResponse.status);
      console.log('   Error:', errorText);
      
      // Try singular form
      console.log('\n3. Trying kf_document (singular)...');
      const queryUrl2 = `${apiUrl}/kf_document?$top=1&$select=*`;
      const queryResponse2 = await fetch(queryUrl2, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0',
        },
      });
      
      if (queryResponse2.ok) {
        const data2 = await queryResponse2.json();
        console.log('✅ Query successful with singular form!\n');
        if (data2.value && data2.value.length > 0) {
          console.log('📋 Fields found:\n');
          Object.keys(data2.value[0]).sort().forEach(key => {
            console.log(`   ${key}`);
          });
        }
      } else {
        const errorText2 = await queryResponse2.text();
        console.log('❌ Also failed:', queryResponse2.status);
        console.log('   Error:', errorText2);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

queryTable();

