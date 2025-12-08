import { seedDFSASchemas } from './parseDFSARequirements';
import { getNonFinancialSupabase } from '../lib/supabase/nonFinancialClient';

async function verifySchemaLinks() {
  console.log('\n=== Verifying Schema Links ===\n');
  
  const supabase = getNonFinancialSupabase();
  
  // Get all schemas
  const { data: schemas, error: schemaError } = await supabase
    .from('service_form_schemas')
    .select('service_id, service_name');
  
  if (schemaError) {
    console.error('Error fetching schemas:', schemaError);
    return;
  }
  
  // Get all services
  const { data: services, error: serviceError } = await supabase
    .from('non_financial_services')
    .select('id, slug, name');
  
  if (serviceError) {
    console.error('Error fetching services:', serviceError);
    return;
  }
  
  console.log(`Found ${schemas?.length || 0} schemas`);
  console.log(`Found ${services?.length || 0} services\n`);
  
  // Check for matches
  const matched: string[] = [];
  const unmatched: string[] = [];
  
  schemas?.forEach(schema => {
    const matchingService = services?.find(
      s => s.slug === schema.service_id || 
           s.id === schema.service_id ||
           s.slug.includes(schema.service_id) ||
           schema.service_id.includes(s.slug)
    );
    
    if (matchingService) {
      matched.push(`✓ ${schema.service_name} → ${matchingService.name}`);
    } else {
      unmatched.push(`✗ ${schema.service_name} (${schema.service_id})`);
    }
  });
  
  console.log('=== Matched Schemas ===');
  matched.forEach(m => console.log(m));
  
  if (unmatched.length > 0) {
    console.log('\n=== Unmatched Schemas ===');
    unmatched.forEach(u => console.log(u));
  }
  
  console.log(`\nTotal Matched: ${matched.length}/${schemas?.length || 0}`);
}

async function seedAll() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   DFSA Services Schema Seeding         ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  try {
    // Seed DFSA schemas from CSV
    await seedDFSASchemas();
    
    // Verify links
    await verifySchemaLinks();
    
    console.log('\n✅ Seeding complete!');
    console.log('\nNext steps:');
    console.log('1. Check the matched/unmatched list above');
    console.log('2. Test a service form at /forms/request-service');
    console.log('3. Required documents should appear automatically\n');
    
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    throw error;
  }
}

// Run
seedAll()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
