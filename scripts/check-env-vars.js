/**
 * Script to check if required environment variables are set
 * Run with: node scripts/check-env-vars.js
 */

const requiredVars = {
  'DATAVERSE_TENANT_ID or tenant_id': process.env.DATAVERSE_TENANT_ID || process.env.tenant_id,
  'DATAVERSE_CLIENT_ID or client_id': process.env.DATAVERSE_CLIENT_ID || process.env.client_id,
  'DATAVERSE_CLIENT_SECRET or client_secret': process.env.DATAVERSE_CLIENT_SECRET || process.env.client_secret,
  'DATAVERSE_API_URL or DATAVERSE_BASE_URL': process.env.DATAVERSE_API_URL || process.env.DATAVERSE_BASE_URL,
  'scope': process.env.scope,
  'grant_type': process.env.grant_type,
};

console.log('🔍 Checking Environment Variables...\n');

let allSet = true;
for (const [name, value] of Object.entries(requiredVars)) {
  if (value) {
    console.log(`✅ ${name}: Set (${value.substring(0, 20)}...)`);
  } else {
    console.log(`❌ ${name}: Missing`);
    allSet = false;
  }
}

console.log('\n' + '='.repeat(50));
if (allSet) {
  console.log('✅ All required environment variables are set!');
} else {
  console.log('❌ Some environment variables are missing.');
  console.log('\nPlease add them to your .env file:');
  console.log(`
# Dataverse Configuration
DATAVERSE_TENANT_ID=your-tenant-id-here
DATAVERSE_CLIENT_ID=your-client-id-here
DATAVERSE_CLIENT_SECRET=your-client-secret-here
DATAVERSE_API_URL=https://your-org.crm.dynamics.com
scope=https://your-org.crm.dynamics.com/.default
grant_type=client_credentials
  `);
}

