const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '***SET***' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '***SET***' : 'NOT SET');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '***SET***' : 'NOT SET');

// Test database connection
const { Client } = require('pg');

async function testDatabaseConnection() {
  console.log('\n=== DATABASE CONNECTION TEST ===');
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL is not set');
    return;
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('🔄 Attempting to connect to database...');
    await client.connect();
    console.log('✅ Database connection successful!');
    
    const result = await client.query('SELECT version()');
    console.log('📊 Database version:', result.rows[0].version.split(' ')[0]);
    
    await client.end();
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('🔍 Full error:', error);
  }
}

testDatabaseConnection().then(() => {
  console.log('\n=== STARTING APPLICATION ===');
  // Start the actual application
  require('./dist/src/main.js');
}).catch(error => {
  console.error('❌ Startup failed:', error);
  process.exit(1);
});
