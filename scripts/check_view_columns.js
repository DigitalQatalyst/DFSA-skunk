import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres.nywlgmvnpaeemyxlhttx:DQatalyst%402025%21@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function checkViewColumns() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase database\n');

    const viewsToCheck = ['v_media_public', 'v_media_public_grid', 'v_media_all'];
    
    for (const viewName of viewsToCheck) {
      console.log('='.repeat(80));
      console.log(`VIEW COLUMNS: ${viewName}`);
      console.log('='.repeat(80));
      
      // Get columns from view
      const columnsQuery = `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public' 
          AND table_name = $1
        ORDER BY ordinal_position;
      `;
      
      const columns = await client.query(columnsQuery, [viewName]);
      
      if (columns.rows.length > 0) {
        console.log('\nColumns:');
        columns.rows.forEach(col => {
          const isContentSubtype = col.column_name === 'content_subtype';
          console.log(`  ${col.column_name} (${col.data_type})${isContentSubtype ? ' ⭐' : ''}`);
        });
        
        const hasContentSubtype = columns.rows.some(col => col.column_name === 'content_subtype');
        if (hasContentSubtype) {
          console.log('\n✓ This view EXPOSES content_subtype - can filter in queries');
        } else {
          console.log('\n✗ This view does NOT expose content_subtype');
        }
      } else {
        // Check admin schema
        const adminColumns = await client.query(`
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_schema = 'admin' 
            AND table_name = $1
          ORDER BY ordinal_position;
        `, [viewName]);
        
        if (adminColumns.rows.length > 0) {
          console.log('\nColumns (admin schema):');
          adminColumns.rows.forEach(col => {
            const isContentSubtype = col.column_name === 'content_subtype';
            console.log(`  ${col.column_name} (${col.data_type})${isContentSubtype ? ' ⭐' : ''}`);
          });
          
          const hasContentSubtype = adminColumns.rows.some(col => col.column_name === 'content_subtype');
          if (hasContentSubtype) {
            console.log('\n✓ This view EXPOSES content_subtype - can filter in queries');
          } else {
            console.log('\n✗ This view does NOT expose content_subtype');
          }
        }
      }
      console.log('\n');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkViewColumns();

