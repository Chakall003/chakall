# 🚀 Configuración Oracle Autonomous Database - Chakall

## 📍 Tu Base de Datos
- **OCID**: `ocid1.autonomousdatabase.oc1.sa-santiago-1.anzwgljrhgwqreqachcranmktuw7crae3hzo3cr3nsw4gpjrj3id57orqpyq`
- **Región**: `sa-santiago-1` (Chile - Santiago)
- **Tipo**: Autonomous Database

## 🔧 Información Que Necesito de Ti

### 1. **Credenciales de Base de Datos**
```
Usuario: (generalmente es 'ADMIN' para Autonomous DB)
Contraseña: [NECESITO QUE ME PROPORCIONES ESTA]
```

### 2. **Connection String**
Ve a tu **OCI Console** y obtén el connection string:

1. **Oracle Cloud Console** → **Oracle Database** → **Autonomous Database**
2. Busca tu base de datos con OCID: `...orqpyq`
3. Click en el nombre de la base de datos
4. **DB Connection** → **Instance connection**
5. Copia uno de estos connection strings:
   - **High**: Para operaciones complejas
   - **Medium**: Para uso general  
   - **Low**: Para reportes

Ejemplo de connection string que verás:
```
(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb-free_xxxxxxx.adb.sa-santiago-1.oraclecloud.com))(connect_data=(service_name=xxxxxxx_dbname_high.adb.oraclecloud.com))(security=(ssl_server_cert_dn="CN=adwc.sa-santiago-1.oraclecloud.com, OU=Oracle BMCS US, O=Oracle Corporation, L=Redwood City, ST=California, C=US")))
```

### 3. **Método de Conexión**

Tienes dos opciones:

#### **Opción A: Sin Wallet (TLS/SSL automático)**
- Solo necesitas el connection string
- Más simple de configurar
- Recomendado para desarrollo

#### **Opción B: Con Wallet (más seguro)**
- Descargar el wallet desde OCI Console
- Configurar archivos adicionales
- Recomendado para producción

## ⚡ **Pasos para Configurar**

### **Paso 1: Obtener tus datos**
Accede a **OCI Console** y toma nota de:
- [ ] Usuario de base de datos (normalmente `ADMIN`)
- [ ] Contraseña de base de datos
- [ ] Connection string (HIGH, MEDIUM o LOW)
- [ ] Nombre de tu base de datos

### **Paso 2: Configurar variables de entorno**
Crea el archivo `.env.local` con:
```env
DB_USERNAME=ADMIN
DB_PASSWORD=tu_contraseña_aqui
DB_CONNECTION_STRING=tu_connection_string_completo_aqui
```

### **Paso 3: Ejecutar la aplicación**
```bash
cd chakall
npm run dev
```

## 📋 **Lo Que Necesito Que Me Proporciones:**

1. **Contraseña del usuario ADMIN** (o el usuario que uses)
2. **Connection String completo** desde OCI Console
3. **Nombre de tu base de datos** (visible en OCI Console)

### **¿Cómo obtener el Connection String?**

1. Ve a: https://cloud.oracle.com
2. Inicia sesión en tu cuenta
3. **Menu** → **Oracle Database** → **Autonomous Database**
4. Click en tu base de datos
5. **DB Connection** → Copia el connection string

### **¿Necesitas ayuda accediendo a OCI Console?**

Si tienes problemas accediendo, dime:
- ¿Tienes acceso directo al OCI Console?
- ¿Alguien más administra la base de datos?
- ¿Puedes acceder a Oracle Database Actions desde el navegador?

## 🚨 **Información de Seguridad**

- **NUNCA** compartas credenciales en chat públicos
- Usa variables de entorno para datos sensibles
- El connection string puede ser compartido (no contiene credenciales)

Una vez que me proporciones estos datos, podré configurar completamente la conexión.

## 📞 **Siguiente Paso**

Necesito que me envíes:
1. La contraseña de tu usuario ADMIN
2. El connection string completo desde OCI Console

Con eso tendré todo listo para conectar tu aplicación Chakall a Oracle Cloud.
