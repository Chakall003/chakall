# 🗄️ Guía de Conexión a Oracle Database

## Configuración Requerida

### 1. **Variables de Entorno**

Crea un archivo `.env.local` con la siguiente configuración:

```env
# Base de datos Oracle
DB_HOST=tu_servidor_oracle
DB_PORT=1521
DB_SERVICE_NAME=XE
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_CONNECTION_STRING=tu_servidor:1521/XE

# Pool de conexiones
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_INCREMENT=2
```

### 2. **Estructura de Base de Datos**

La aplicación espera las siguientes tablas y procedimientos almacenados:

#### Tablas Principales:
- `events` - Almacena información de eventos
- `songs` - Catálogo de canciones
- `venues` - Información de lugares
- `clients` - Datos de clientes

#### Procedimientos Almacenados:
- `PKG_EVENTS.CREATE_EVENT` - Crear nuevo evento
- `PKG_EVENTS.UPDATE_EVENT` - Actualizar evento
- `PKG_EVENTS.GET_ALL_EVENTS` - Obtener todos los eventos
- `PKG_SONGS.CREATE_SONG` - Crear nueva canción
- `PKG_SONGS.UPDATE_SONG` - Actualizar canción
- `PKG_SONGS.GET_ALL_SONGS` - Obtener todas las canciones

## Instalación y Configuración

### Opción 1: Oracle Database Existente

1. **Ejecutar el script de instalación**:
   ```sql
   sqlplus usuario/password@servidor:puerto/servicio @database/oracle_setup.sql
   ```

2. **Configurar variables de entorno**:
   - Copia `.env.example` a `.env.local`
   - Actualiza con los datos de tu servidor Oracle

3. **Verificar conexión**:
   ```bash
   npm run dev
   ```

### Opción 2: Docker Oracle XE (Desarrollo)

1. **Iniciar Oracle con Docker**:
   ```bash
   npm run db:setup
   ```

2. **Esperar que el contenedor esté listo** (puede tomar varios minutos):
   ```bash
   npm run db:logs
   ```

3. **Ejecutar el script de configuración**:
   ```bash
   docker-compose exec oracle-db sqlplus system/ChakallPassword123@localhost:1521/XE @/docker-entrypoint-initdb.d/oracle_setup.sql
   ```

4. **Iniciar la aplicación**:
   ```bash
   npm run dev
   ```

## Parámetros de los Procedimientos Almacenados

### Para Eventos:
```sql
PKG_EVENTS.CREATE_EVENT(
    p_event_id IN NUMBER,
    p_event_name IN VARCHAR2,
    p_event_date IN VARCHAR2,
    p_venue_id IN NUMBER,
    p_package_code IN VARCHAR2,
    p_theme_code IN VARCHAR2,
    p_client_number IN NUMBER,
    p_song_id IN NUMBER,
    p_song_title IN VARCHAR2,
    p_type_code IN VARCHAR2
);
```

### Para Canciones:
```sql
PKG_SONGS.CREATE_SONG(
    p_song_id IN NUMBER,
    p_song_title IN VARCHAR2,
    p_type_code IN VARCHAR2
);
```

## Personalización

### Cambiar Nombres de Procedimientos

Si tus procedimientos almacenados tienen nombres diferentes, actualiza los archivos:

- `app/api/events/route.ts` - Líneas con `PKG_EVENTS.CREATE_EVENT`
- `app/api/songs/route.ts` - Líneas con `PKG_SONGS.CREATE_SONG`

### Agregar Nuevos Campos

1. Modifica las interfaces en `lib/oracle.ts`
2. Actualiza los componentes React correspondientes
3. Modifica los procedimientos almacenados en Oracle

## Troubleshooting

### Error: "ORA-12541: TNS:no listener"
- Verifica que el servidor Oracle esté ejecutándose
- Confirma el puerto y host en las variables de entorno

### Error: "ORA-01017: invalid username/password"
- Verifica las credenciales en `.env.local`
- Asegúrate de que el usuario tenga permisos necesarios

### Error: "Module not found: Can't resolve 'oracledb'"
- Ejecuta: `npm install oracledb dotenv @types/oracledb`

### Conexión lenta o timeouts
- Ajusta los valores del pool de conexiones
- Considera usar un servidor Oracle local para desarrollo

## Scripts Útiles

```bash
# Configurar base de datos
npm run db:setup

# Detener base de datos
npm run db:stop

# Ver logs de Oracle
npm run db:logs

# Conectar a Oracle directamente
npm run db:connect
```

## Seguridad

- **Nunca** incluyas credenciales en el código fuente
- Usa variables de entorno para configuración sensible
- Implementa validación de entrada en los procedimientos
- Considera usar conexión SSL en producción
