import pg from 'pg';
const { Client } = pg;

// Connection string from user
const connectionString = 'postgresql://postgres.nywlgmvnpaeemyxlhttx:DQatalyst%402025%21@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function extractSchema() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase database\n');

    // Extract schema for content (cnt_contents) table
    console.log('='.repeat(80));
    console.log('CONTENT (cnt_contents) TABLE SCHEMA');
    console.log('='.repeat(80));
    
    const contentTableQuery = `
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default,
        ordinal_position
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = 'cnt_contents'
      ORDER BY ordinal_position;
    `;
    
    const contentColumns = await client.query(contentTableQuery);
    
    if (contentColumns.rows.length === 0) {
      console.log('Table "cnt_contents" not found. Checking for similar table names...\n');
      
      // Check for content-related tables
      const similarTablesQuery = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' 
          AND (table_name LIKE '%content%' OR table_name LIKE '%cnt%')
        ORDER BY table_name;
      `;
      const similarTables = await client.query(similarTablesQuery);
      console.log('Similar tables found:', similarTables.rows.map(r => r.table_name));
    } else {
      console.log('\nColumns:');
      contentColumns.rows.forEach(col => {
        console.log(`  ${col.ordinal_position}. ${col.column_name}`);
        console.log(`     Type: ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''}`);
        console.log(`     Nullable: ${col.is_nullable}`);
        console.log(`     Default: ${col.column_default || 'None'}`);
        console.log('');
      });
      
      // Get constraints
      const contentConstraintsQuery = `
        SELECT
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        LEFT JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.table_schema = 'public' 
          AND tc.table_name = 'cnt_contents'
        ORDER BY tc.constraint_type, tc.constraint_name;
      `;
      
      const contentConstraints = await client.query(contentConstraintsQuery);
      if (contentConstraints.rows.length > 0) {
        console.log('Constraints:');
        contentConstraints.rows.forEach(con => {
          console.log(`  ${con.constraint_type}: ${con.constraint_name}`);
          if (con.constraint_type === 'FOREIGN KEY') {
            console.log(`    ${con.column_name} -> ${con.foreign_table_name}.${con.foreign_column_name}`);
          }
        });
        console.log('');
      }
      
      // Get indexes
      const contentIndexesQuery = `
        SELECT
          indexname,
          indexdef
        FROM pg_indexes
        WHERE schemaname = 'public' 
          AND tablename = 'cnt_contents'
        ORDER BY indexname;
      `;
      
      const contentIndexes = await client.query(contentIndexesQuery);
      if (contentIndexes.rows.length > 0) {
        console.log('Indexes:');
        contentIndexes.rows.forEach(idx => {
          console.log(`  ${idx.indexname}: ${idx.indexdef}`);
        });
        console.log('');
      }
    }

    // Extract schema for taxonomies (txn_*) tables
    console.log('\n' + '='.repeat(80));
    console.log('TAXONOMIES (txn_*) TABLES SCHEMA');
    console.log('='.repeat(80));
    
    // Get all txn_* tables
    const txnTablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' 
        AND table_name LIKE 'txn_%'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    const txnTables = await client.query(txnTablesQuery);
    
    if (txnTables.rows.length === 0) {
      console.log('No txn_* tables found.\n');
    } else {
      for (const table of txnTables.rows) {
        const tableName = table.table_name;
        console.log(`\n--- ${tableName} ---\n`);
        
        const txnColumnsQuery = `
          SELECT 
            column_name,
            data_type,
            character_maximum_length,
            is_nullable,
            column_default,
            ordinal_position
          FROM information_schema.columns
          WHERE table_schema = 'public' 
            AND table_name = $1
          ORDER BY ordinal_position;
        `;
        
        const txnColumns = await client.query(txnColumnsQuery, [tableName]);
        
        console.log('Columns:');
        txnColumns.rows.forEach(col => {
          console.log(`  ${col.ordinal_position}. ${col.column_name}`);
          console.log(`     Type: ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''}`);
          console.log(`     Nullable: ${col.is_nullable}`);
          console.log(`     Default: ${col.column_default || 'None'}`);
          console.log('');
        });
        
        // Get constraints
        const txnConstraintsQuery = `
          SELECT
            tc.constraint_name,
            tc.constraint_type,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          LEFT JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
          WHERE tc.table_schema = 'public' 
            AND tc.table_name = $1
          ORDER BY tc.constraint_type, tc.constraint_name;
        `;
        
        const txnConstraints = await client.query(txnConstraintsQuery, [tableName]);
        if (txnConstraints.rows.length > 0) {
          console.log('Constraints:');
          txnConstraints.rows.forEach(con => {
            console.log(`  ${con.constraint_type}: ${con.constraint_name}`);
            if (con.constraint_type === 'FOREIGN KEY') {
              console.log(`    ${con.column_name} -> ${con.foreign_table_name}.${con.foreign_column_name}`);
            }
          });
          console.log('');
        }
      }
    }

    // Check views and their definitions
    console.log('\n' + '='.repeat(80));
    console.log('VIEWS IN PUBLIC SCHEMA');
    console.log('='.repeat(80));
    const viewsQuery = `
      SELECT table_name, view_definition
      FROM information_schema.views
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    const views = await client.query(viewsQuery);
    console.log('\nViews:');
    views.rows.forEach(view => {
      console.log(`\n--- ${view.table_name} ---`);
      console.log(view.view_definition);
    });

    // Check admin schema views specifically
    console.log('\n' + '='.repeat(80));
    console.log('VIEWS IN ADMIN SCHEMA');
    console.log('='.repeat(80));
    const adminViewsQuery = `
      SELECT table_name, view_definition
      FROM information_schema.views
      WHERE table_schema = 'admin'
      ORDER BY table_name;
    `;
    const adminViews = await client.query(adminViewsQuery);
    console.log('\nAdmin Schema Views:');
    adminViews.rows.forEach(view => {
      console.log(`\n--- ${view.table_name} ---`);
      console.log(view.view_definition);
    });

    // List all tables to help identify the correct table names
    console.log('\n' + '='.repeat(80));
    console.log('ALL TABLES IN PUBLIC SCHEMA');
    console.log('='.repeat(80));
    const allTablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    const allTables = await client.query(allTablesQuery);
    console.log('\nTables:');
    allTables.rows.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

extractSchema();

