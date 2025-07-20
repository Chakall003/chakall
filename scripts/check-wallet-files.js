const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando archivos del wallet...\n');

const walletPath = path.resolve('./wallet');
console.log('📁 Directorio wallet:', walletPath);

const requiredFiles = [
    'tnsnames.ora',
    'sqlnet.ora', 
    'cwallet.sso',
    'ewallet.p12',
    'keystore.jks',
    'truststore.jks',
    'ojdbc.properties'
];

let missingFiles = [];
let existingFiles = [];

requiredFiles.forEach(file => {
    const filePath = path.join(walletPath, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        existingFiles.push(`✅ ${file} (${stats.size} bytes)`);
    } else {
        missingFiles.push(`❌ ${file}`);
    }
});

console.log('📋 Estado de archivos del wallet:\n');
existingFiles.forEach(file => console.log(file));
missingFiles.forEach(file => console.log(file));

if (missingFiles.length > 0) {
    console.log('\n🚨 Archivos faltantes encontrados!');
    console.log('\n💡 Para solucionar:');
    console.log('1. Ve a Oracle Cloud Console → tu Autonomous Database');
    console.log('2. Clic en "DB Connection" → "Download Wallet"');
    console.log('3. Extrae TODOS los archivos del ZIP a ./wallet/');
    console.log('4. Los archivos cwallet.sso y ewallet.p12 son esenciales');
} else {
    console.log('\n🎉 ¡Wallet completo! Todos los archivos requeridos están presentes.');
}
