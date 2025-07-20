require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');

async function testAutonomousConnection() {
    console.log('🔧 Testing Autonomous Database Connection Format...');
    console.log('📧 User:', process.env.DB_USERNAME);
    
    // Usar el service name exacto del .env.local
    const configs = [
        {
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            connectString: 'adb.sa-santiago-1.oraclecloud.com:1522/gb9296650d69026_chakallfinalproyect_high.adb.oraclecloud.com'
        },
        {
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            connectString: 'adb.sa-santiago-1.oraclecloud.com:1522/gb9296650d69026_chakallfinalproyect_medium.adb.oraclecloud.com'
        },
        {
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            connectString: 'adb.sa-santiago-1.oraclecloud.com:1522/gb9296650d69026_chakallfinalproyect_low.adb.oraclecloud.com'
        }
    ];

    for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        const serviceName = config.connectString.split('/')[1];
        console.log(`\n⏳ Testing service: ${serviceName}`);
        
        try {
            const connection = await oracledb.getConnection(config);
            console.log('✅ Connection successful!');
            
            const result = await connection.execute('SELECT SYSDATE FROM DUAL');
            console.log('📅 Database time:', result.rows[0][0]);
            
            await connection.close();
            console.log('🎉 Test completed successfully!');
            return;
        } catch (error) {
            console.log(`❌ Service ${serviceName} failed:`, error.message);
        }
    }
    
    console.log('\n❌ All autonomous service formats failed');
    console.log('\n💡 Possible solutions:');
    console.log('1. Download the wallet from Oracle Cloud Console');
    console.log('2. Check if the database is properly started');
    console.log('3. Verify network access lists in OCI Console');
}

testAutonomousConnection().catch(console.error);
