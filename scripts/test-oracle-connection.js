// Script para probar la conexión a Oracle Autonomous Database
// Ejecutar con: node scripts/test-oracle-connection.js

const oracledb = require('oracledb')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

async function testConnection() {
  let connection

  console.log('🔍 Testing Oracle Autonomous Database Connection...')
  console.log('📍 Region: sa-santiago-1')
  console.log('👤 User:', process.env.DB_USERNAME)
  console.log('🆔 Database OCID: ...orqpyq')

  try {
    // Configurar TNS_ADMIN para Oracle
    const walletPath = path.resolve(__dirname, '../wallet')
    process.env.TNS_ADMIN = walletPath
    
    console.log('📁 Wallet location:', walletPath)
    console.log('🔧 TNS_ADMIN set to:', process.env.TNS_ADMIN)

    // Configuración de Oracle
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

    console.log('\n⏳ Attempting to connect...')

    // Opción 1: Usar el nombre de servicio del tnsnames.ora
    const serviceNames = ['chakallfinalproyect_high', 'chakallfinalproyect_medium', 'chakallfinalproyect_low'];
    let connected = false;
    
    for (const serviceName of serviceNames) {
      try {
        console.log(`Trying service: ${serviceName}`);
        connection = await oracledb.getConnection({
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          connectString: serviceName
        });
        console.log(`✅ Connected successfully with service: ${serviceName}`);
        connected = true;
        break;
      } catch (err) {
        console.log(`❌ Failed with ${serviceName}: ${err.message}`);
      }
    }
    
    if (!connected) {
      throw new Error('All service names failed');
    }

    console.log('✅ Connection successful!')

    // Probar una consulta simple
    console.log('\n🔍 Testing query...')
    const result = await connection.execute('SELECT SYSDATE as current_date FROM DUAL')
    
    console.log('📅 Current database date:', result.rows[0].CURRENT_DATE)

    // Verificar información de la sesión
    console.log('\n📊 Session information...')
    const sessionInfo = await connection.execute(`
      SELECT 
        sys_context('USERENV', 'SERVICE_NAME') as service_name,
        sys_context('USERENV', 'SERVER_HOST') as server_host,
        sys_context('USERENV', 'DB_NAME') as db_name
      FROM DUAL
    `)
    
    const session = sessionInfo.rows[0]
    console.log('🗄️  Database name:', session.DB_NAME)
    console.log('🌐 Service name:', session.SERVICE_NAME)
    console.log('🖥️  Server host:', session.SERVER_HOST)

    // Verificar tablas existentes
    console.log('\n📊 Checking available tables...')
    const tables = await connection.execute(`
      SELECT table_name, num_rows 
      FROM user_tables 
      ORDER BY table_name
    `)

    console.log('📋 Available tables:')
    if (tables.rows.length > 0) {
      tables.rows.forEach(table => {
        console.log(`   - ${table.TABLE_NAME} (${table.NUM_ROWS || 'Unknown'} rows)`)
      })
    } else {
      console.log('   No tables found in current schema')
      console.log('   💡 You may need to create tables for your application')
    }

    console.log('\n🎉 Oracle Autonomous Database connection test completed successfully!')

  } catch (error) {
    console.error('\n❌ Connection failed:')
    console.error('Error:', error.message)
    
    if (error.message.includes('ORA-01017')) {
      console.error('💡 Tip: Check username/password in .env.local')
    } else if (error.message.includes('ORA-12545') || error.message.includes('ORA-12541')) {
      console.error('💡 Tip: Check connection string format')
    } else if (error.message.includes('NJS-515')) {
      console.error('💡 Tip: Connection string is required for Autonomous Database')
    } else if (error.message.includes('NJS-516')) {
      console.error('💡 Tip: TNS_ADMIN environment variable set to:', process.env.TNS_ADMIN)
      console.error('💡 Check if wallet directory exists and contains tnsnames.ora')
    }
  } finally {
    if (connection) {
      try {
        await connection.close()
        console.log('🔒 Connection closed')
      } catch (error) {
        console.error('Error closing connection:', error.message)
      }
    }
  }
}

testConnection().catch(console.error)
