require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');
const path = require('path');
const fs = require('fs');

async function testWalletConnection() {
    console.log('🔧 Testing Wallet Connection to Autonomous Database...');
    
    // Verificar si existen los archivos del wallet
    const walletPath = path.resolve('./wallet');
    console.log('📁 Checking wallet files in:', walletPath);
    
    const requiredFiles = ['tnsnames.ora', 'sqlnet.ora', 'cwallet.sso'];
    let walletExists = true;
    
    for (const file of requiredFiles) {
        const filePath = path.join(walletPath, file);
        if (fs.existsSync(filePath)) {
            console.log('✅', file, 'found');
        } else {
            console.log('❌', file, 'missing');
            walletExists = false;
        }
    }
    
    if (!walletExists) {
        console.log('\n💡 To download the wallet:');
        console.log('1. Go to Oracle Cloud Console (https://cloud.oracle.com)');
        console.log('2. Navigate to: Menu → Oracle Database → Autonomous Database');
        console.log('3. Select your database "chakallfinalproyect"');
        console.log('4. Click "DB Connection"');
        console.log('5. Click "Download Wallet"');
        console.log('6. Set a wallet password (e.g., wallet123)');
        console.log('7. Extract all files to ./wallet/ directory');
        return;
    }
    
    console.log('\n🎉 Wallet files found! Testing connection...');
    
    // Configurar TNS_ADMIN
    process.env.TNS_ADMIN = walletPath;
    
    try {
        // Leer el tnsnames.ora para obtener los service names disponibles
        const tnsnamesPath = path.join(walletPath, 'tnsnames.ora');
        const tnsnamesContent = fs.readFileSync(tnsnamesPath, 'utf8');
        console.log('\n📋 Available service names:');
        
        const serviceNames = tnsnamesContent.match(/^[a-zA-Z0-9_]+(?=\s*=)/gm);
        if (serviceNames) {
            serviceNames.forEach((name, index) => {
                console.log(`${index + 1}. ${name}`);
            });
        }
        
        // Probar conexión con el primer service name
        const firstServiceName = serviceNames ? serviceNames[0] : 'chakallfinalproyect_high';
        
        console.log(`\n⏳ Testing connection with service: ${firstServiceName}`);
        
        const connection = await oracledb.getConnection({
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            connectString: firstServiceName
        });
        
        console.log('✅ Connection successful!');
        
        // Probar consultas
        const result = await connection.execute('SELECT SYSDATE FROM DUAL');
        console.log('📅 Database time:', result.rows[0][0]);
        
        const versionResult = await connection.execute('SELECT BANNER FROM V$VERSION WHERE ROWNUM = 1');
        console.log('💾 Database version:', versionResult.rows[0][0]);
        
        await connection.close();
        console.log('\n🎉 Perfect! Your Oracle Autonomous Database is fully connected!');
        console.log('🚀 The application is ready to use the database.');
        
    } catch (error) {
        console.log('\n❌ Connection failed:');
        console.log('Error:', error.message);
        
        if (error.message.includes('ORA-01017')) {
            console.log('\n💡 Invalid username/password. Please check:');
            console.log('- Username should be: ADMIN');
            console.log('- Password should be the one you set when creating the database');
        }
    }
}

testWalletConnection().catch(console.error);
