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

    // Read migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_create_profile_summary_table.sql');
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

    // Verify table was created
    console.log('🔍 Verifying table creation...');
    const result = await client.query(`
      SELECT 
        table_name,
        column_name,
        data_type
      FROM information_schema.columns
      WHERE table_name = 'profiledomain_profilesummary'
      ORDER BY ordinal_position
      LIMIT 10;
    `);

    if (result.rows.length > 0) {
      console.log('✅ Table verified! Columns:');
      result.rows.forEach(row => {
        console.log(`   - ${row.column_name} (${row.data_type})`);
      });
    } else {
      console.log('⚠️  Table not found - migration may have failed');
    }

    // Check RLS policies
    console.log('\n🔍 Checking RLS policies...');
    const rlsResult = await client.query(`
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual
      FROM pg_policies
      WHERE tablename = 'profiledomain_profilesummary';
    `);

    if (rlsResult.rows.length > 0) {
      console.log('✅ RLS policies found:');
      rlsResult.rows.forEach(row => {
        console.log(`   - ${row.policyname} (${row.cmd})`);
      });
    } else {
      console.log('⚠️  No RLS policies found');
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
runMigration();

