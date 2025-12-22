/**
 * Run Supabase Migration Script
 * Executes SQL migration files against Supabase PostgreSQL database
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get connection string from environment
const connectionString = process.env.SUPABASE_DB_URL || 
  'postgresql://postgres.rakpwveywiokbwmtbvkq:DQatalyst%402025%21@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';

console.log('🚀 Starting Supabase migration...\n');
console.log(`Connection: ${connectionString.replace(/:[^:@]+@/, ':****@')}\n`);

async function runMigration() {
  // Get migration file path from command-line argument
  const migrationFileArg = process.argv[2];
  if (!migrationFileArg) {
    console.error('❌ Error: Migration file path is required');
    console.error('Usage: node scripts/run-supabase-migration.mjs <migration-file-path>');
    console.error('Example: node scripts/run-supabase-migration.mjs supabase/migrations/002_create_products_tables.sql');
    process.exit(1);
  }

  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false // Supabase requires SSL but may use self-signed certs
    }
  });

  try {
    console.log('🔌 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    // Resolve migration file path (can be relative or absolute)
    const migrationPath = path.isAbsolute(migrationFileArg) 
      ? migrationFileArg 
      : path.join(process.cwd(), migrationFileArg);
    
    console.log(`📄 Reading migration file: ${migrationPath}`);
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('✅ Migration file loaded\n');

    console.log('🚀 Executing migration...');
    console.log('---');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    console.log('---');
    console.log('✅ Migration executed successfully!\n');

    // Extract table name from migration file name for verification
    const migrationFileName = path.basename(migrationPath, '.sql');
    console.log(`📊 Migration file: ${migrationFileName}`);
    
    // Try to detect tables created in this migration
    // For products migration, check for profiledomain_products
    const tablesToCheck = migrationFileName.includes('products') 
      ? ['profiledomain_products', 'firm_license_category', 'activity_master']
      : ['profiledomain_profilesummary'];

    console.log('\n🔍 Verifying table creation...');
    for (const tableName of tablesToCheck) {
      const result = await client.query(`
        SELECT 
          table_name,
          COUNT(*) as column_count
        FROM information_schema.columns
        WHERE table_name = $1
        GROUP BY table_name;
      `, [tableName]);

      if (result.rows.length > 0) {
        console.log(`✅ Table '${tableName}' verified (${result.rows[0].column_count} columns)`);
      } else {
        console.log(`⚠️  Table '${tableName}' not found`);
      }
    }

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:');
    console.error(error.message);
    
    if (error.code === '42P07') {
      console.error('\n⚠️  Table already exists. Migration may have been run before.');
      console.error('   If you want to recreate it, drop the table first.');
    }
    
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Run migration
runMigration().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});



