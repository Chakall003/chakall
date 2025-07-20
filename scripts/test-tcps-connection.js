require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');

async function testTCPSConnection() {
    console.log('🔧 Testing TCPS (SSL) Connection to Autonomous Database...');
    console.log('📧 User:', process.env.DB_USERNAME);
    
    // Usar el connection string completo con TCPS del .env.local
    const connectionString = process.env.DB_CONNECTION_STRING;
    console.log('🔗 Connection String:', connectionString.substring(0, 100) + '...');
    
    const config = {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        connectString: connectionString
    };
    
    try {
        console.log('\n⏳ Attempting TCPS connection...');
        const connection = await oracledb.getConnection(config);
        console.log('✅ Connection successful!');
        
        // Probar una consulta simple
        const result = await connection.execute('SELECT SYSDATE FROM DUAL');
        console.log('📅 Database time:', result.rows[0][0]);
        
        // Probar otra consulta
        const versionResult = await connection.execute('SELECT BANNER FROM V$VERSION WHERE ROWNUM = 1');
        console.log('💾 Database version:', versionResult.rows[0][0]);
        
        await connection.close();
        console.log('🎉 Test completed successfully!');
        
        console.log('\n✨ Perfect! Your Oracle Autonomous Database is ready to use!');
        console.log('🚀 The application can now connect to the database.');
        
    } catch (error) {
        console.log('\n❌ TCPS Connection failed:');
        console.log('Error:', error.message);
        
        if (error.message.includes('wallet')) {
            console.log('\n💡 Solution: This requires a wallet file from Oracle Cloud Console');
            console.log('1. Go to Oracle Cloud Console');
            console.log('2. Navigate to your Autonomous Database');
            console.log('3. Click "DB Connection"');
            console.log('4. Download "Instance Wallet"');
            console.log('5. Extract files to ./wallet directory');
        } else if (error.message.includes('certificate')) {
            console.log('\n💡 Solution: SSL certificate issue');
            console.log('This might be resolved by downloading the proper wallet');
        }
    }
}

testTCPSConnection().catch(console.error);
