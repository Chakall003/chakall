// Script simple sin wallet - conexión directa
const oracledb = require('oracledb')
require('dotenv').config({ path: '.env.local' })

async function testSimpleConnection() {
  let connection

  console.log('🔍 Testing Simple Oracle Connection...')
  console.log('👤 User:', process.env.DB_USERNAME)
  
  try {
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

    console.log('\n⏳ Attempting direct connection...')

    connection = await oracledb.getConnection({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING
    })

    console.log('✅ Connection successful!')
    
    const result = await connection.execute('SELECT SYSDATE as current_date FROM DUAL')
    console.log('📅 Current database date:', result.rows[0].CURRENT_DATE)

    console.log('\n🎉 Simple connection test passed!')

  } catch (error) {
    console.error('\n❌ Connection failed:')
    console.error('Error:', error.message)
    
    // Diagnostico adicional
    if (error.message.includes('ORA-12506')) {
      console.log('\n🔍 Diagnostic Information:')
      console.log('- Error ORA-12506: TNS:listener does not know of SID given in connect descriptor')
      console.log('- This usually means:')
      console.log('  1. Database is not properly started')
      console.log('  2. Service name is incorrect') 
      console.log('  3. Network connectivity issues')
      console.log('\n💡 Suggestions:')
      console.log('- Verify database is AVAILABLE in OCI Console')
      console.log('- Check if you can access the database from Oracle SQL Developer')
      console.log('- Try connecting from OCI Console Database Actions')
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

testSimpleConnection().catch(console.error)
