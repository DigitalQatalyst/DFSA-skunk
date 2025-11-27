import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres.nywlgmvnpaeemyxlhttx:DQatalyst%402025%21@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function checkViewDependencies() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase database\n');

    // Check v_media_public and v_media_public_grid views
    const viewsToCheck = ['v_media_public', 'v_media_public_grid', 'v_media_all'];
    
    for (const viewName of viewsToCheck) {
      console.log('='.repeat(80));
      console.log(`VIEW: ${viewName}`);
      console.log('='.repeat(80));
      
      // Get view definition
      const viewDefQuery = `
        SELECT view_definition
        FROM information_schema.views
        WHERE table_schema = 'public' 
          AND table_name = $1;
      `;
      
      const viewDef = await client.query(viewDefQuery, [viewName]);
      
      if (viewDef.rows.length > 0) {
        console.log('\nView Definition:');
        console.log(viewDef.rows[0].view_definition);
        
        // Check if it references cnt_contents
        const def = viewDef.rows[0].view_definition.toLowerCase();
        if (def.includes('cnt_contents')) {
          console.log('\n⚠️  WARNING: This view references cnt_contents!');
        } else if (def.includes('media_items')) {
          console.log('\n✓ This view references media_items (not cnt_contents)');
        } else {
          console.log('\n? Could not determine base table from view definition');
        }
      } else {
        console.log('View not found in public schema');
        
        // Check admin schema
        const adminViewDef = await client.query(`
          SELECT view_definition
          FROM information_schema.views
          WHERE table_schema = 'admin' 
            AND table_name = $1;
        `, [viewName]);
        
        if (adminViewDef.rows.length > 0) {
          console.log('\nFound in admin schema:');
          console.log(adminViewDef.rows[0].view_definition);
          
          const def = adminViewDef.rows[0].view_definition.toLowerCase();
          if (def.includes('cnt_contents')) {
            console.log('\n⚠️  WARNING: This view references cnt_contents!');
          } else if (def.includes('media_items')) {
            console.log('\n✓ This view references media_items (not cnt_contents)');
          }
        }
      }
      
      // Get table dependencies
      const depsQuery = `
        SELECT 
          dependent_ns.nspname as dependent_schema,
          dependent_view.relname as dependent_view,
          source_ns.nspname as source_schema,
          source_table.relname as source_table
        FROM pg_depend
        JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid
        JOIN pg_class as dependent_view ON pg_rewrite.ev_class = dependent_view.oid
        JOIN pg_class as source_table ON pg_depend.refobjid = source_table.oid
        JOIN pg_namespace dependent_ns ON dependent_view.relnamespace = dependent_ns.oid
        JOIN pg_namespace source_ns ON source_table.relnamespace = source_ns.oid
        WHERE dependent_view.relname = $1
          AND dependent_ns.nspname IN ('public', 'admin');
      `;
      
      const deps = await client.query(depsQuery, [viewName]);
      if (deps.rows.length > 0) {
        console.log('\nTable Dependencies:');
        deps.rows.forEach(dep => {
          console.log(`  ${dep.source_schema}.${dep.source_table}`);
          if (dep.source_table === 'cnt_contents') {
            console.log('    ⚠️  WARNING: This view depends on cnt_contents!');
          }
        });
      }
      
      console.log('\n');
    }

    // Also check if media_items table exists
    console.log('='.repeat(80));
    console.log('CHECKING FOR media_items TABLE');
    console.log('='.repeat(80));
    const mediaItemsCheck = await client.query(`
      SELECT table_name, table_schema
      FROM information_schema.tables
      WHERE table_name = 'media_items'
        AND table_type = 'BASE TABLE';
    `);
    
    if (mediaItemsCheck.rows.length > 0) {
      console.log('\n✓ media_items table exists:');
      mediaItemsCheck.rows.forEach(row => {
        console.log(`  Schema: ${row.table_schema}, Table: ${row.table_name}`);
      });
    } else {
      console.log('\n✗ media_items table NOT found');
    }

    // Check if cnt_contents is referenced in any views
    console.log('\n' + '='.repeat(80));
    console.log('CHECKING ALL VIEWS THAT REFERENCE cnt_contents');
    console.log('='.repeat(80));
    const allViewsQuery = `
      SELECT 
        table_schema,
        table_name,
        view_definition
      FROM information_schema.views
      WHERE view_definition ILIKE '%cnt_contents%'
      ORDER BY table_schema, table_name;
    `;
    
    const viewsWithCnt = await client.query(allViewsQuery);
    if (viewsWithCnt.rows.length > 0) {
      console.log('\n⚠️  Views that reference cnt_contents:');
      viewsWithCnt.rows.forEach(view => {
        console.log(`\n  ${view.table_schema}.${view.table_name}`);
        // Show snippet of definition
        const snippet = view.view_definition.substring(0, 200);
        console.log(`    ...${snippet}...`);
      });
    } else {
      console.log('\n✓ No views found that reference cnt_contents');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkViewDependencies();

