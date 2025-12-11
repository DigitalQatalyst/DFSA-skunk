#!/usr/bin/env node

/**
 * DFSA Financial Services Application Form - Database Setup Script
 *
 * This script helps set up the database schema for the FS application form.
 * It can be run in different environments and provides helpful feedback.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️  DFSA Financial Services Application Form - Database Setup');
console.log('===========================================================\n');

// Check if migrations directory exists
const migrationsDir = path.join(__dirname, '..', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  console.error('❌ Migrations directory not found!');
  console.error('Expected location:', migrationsDir);
  process.exit(1);
}

// List available migration files
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql') && file !== 'run_migrations.sql')
  .sort();

console.log('📁 Available migration files:');
migrationFiles.forEach((file, index) => {
  console.log(`   ${index + 1}. ${file}`);
});

console.log('\n📋 Setup Instructions:');
console.log('======================\n');

console.log('🔧 Option 1: Using Supabase CLI (Recommended)');
console.log('   1. Install Supabase CLI: npm install -g supabase');
console.log('   2. Initialize project: supabase init');
console.log('   3. Link to project: supabase link --project-ref YOUR_PROJECT_REF');
console.log('   4. Copy migration files to supabase/migrations/');
console.log('   5. Run: supabase db push\n');

console.log('🔧 Option 2: Manual SQL Execution');
console.log('   1. Open Supabase Dashboard > SQL Editor');
console.log('   2. Run migrations in this order:');
migrationFiles.forEach((file, index) => {
  console.log(`      ${index + 1}. Execute: migrations/${file}`);
});

console.log('\n🔧 Option 3: Run Complete Setup Script');
console.log('   Execute: migrations/run_migrations.sql\n');

console.log('📦 Storage Bucket Setup:');
console.log('========================');
console.log('   Create bucket "fs-application-documents" in Supabase Dashboard:');
console.log('   - Set as private (not public)');
console.log('   - File size limit: 10MB');
console.log('   - Allowed MIME types: PDF, DOCX, XLSX, JPG, PNG\n');

console.log('✅ Verification:');
console.log('================');
console.log('   After setup, run these SQL queries to verify:');
console.log('   - SELECT tablename FROM pg_tables WHERE tablename LIKE \'fs_%\';');
console.log('   - SELECT rule_code FROM rules;');
console.log('   - SELECT generate_application_ref();\n');

console.log('📚 For detailed instructions, see: migrations/README.md');
console.log('🔗 TypeScript service: src/services/fsApplicationSupabaseService.ts');

console.log('\n✨ Setup complete! Ready to implement the form wizard.');

// Check if Supabase CLI is available
import { execSync } from 'child_process';
try {
  execSync('supabase --version', { stdio: 'ignore' });
  console.log('\n🎉 Supabase CLI detected! You can use Option 1 for automated setup.');
} catch (error) {
  console.log('\n💡 Tip: Install Supabase CLI for easier migration management.');
}
