import oracledb from 'oracledb'

// Configuración del cliente Oracle para Autonomous Database
let initialized = false

export interface ConnectionConfig {
  user: string
  password: string
  connectionString?: string
  connectString?: string
  walletLocation?: string
  walletPassword?: string
  poolMin?: number
  poolMax?: number
  poolIncrement?: number
}

const dbConfig: ConnectionConfig = {
  user: process.env.DB_USERNAME || 'ADMIN',
  password: process.env.DB_PASSWORD || '',
  connectString: process.env.DB_CONNECTION_STRING || '',
  walletLocation: process.env.WALLET_LOCATION || '',
  walletPassword: process.env.WALLET_PASSWORD || '',
  poolMin: parseInt(process.env.DB_POOL_MIN || '2'),
  poolMax: parseInt(process.env.DB_POOL_MAX || '10'),
  poolIncrement: parseInt(process.env.DB_POOL_INCREMENT || '2'),
}

export async function initializeOracleClient() {
  if (initialized) {
    return
  }

  try {
    // Configurar TNS_ADMIN para el wallet
    const path = require('path')
    const walletPath = path.resolve(process.cwd(), 'wallet')
    process.env.TNS_ADMIN = walletPath
    
    console.log('📁 Wallet location:', walletPath)

    // Configurar el modo de acceso automático para objetos de base de datos
    oracledb.autoCommit = true
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

    // Si se usa wallet para Autonomous Database
    if (dbConfig.walletLocation) {
      oracledb.initOracleClient({
        libDir: process.env.ORACLE_CLIENT_LIB_DIR,
        configDir: dbConfig.walletLocation
      })
    }

    // Crear el pool de conexiones para Autonomous Database
    const poolConfig: any = {
      user: dbConfig.user,
      password: dbConfig.password,
      poolMin: dbConfig.poolMin,
      poolMax: dbConfig.poolMax,
      poolIncrement: dbConfig.poolIncrement,
    }

    // Usar connectString para Autonomous Database
    if (dbConfig.connectString) {
      poolConfig.connectString = dbConfig.connectString
    } else if (dbConfig.connectionString) {
      poolConfig.connectionString = dbConfig.connectionString
    }

    await oracledb.createPool(poolConfig)

    console.log('🔗 Oracle Autonomous Database pool created successfully')
    console.log('📍 Region: sa-santiago-1')
    console.log('🆔 Database OCID: ...orqpyq (last 6 chars)')
    initialized = true
  } catch (error) {
    console.error('❌ Error initializing Oracle Autonomous Database client:', error)
    throw error
  }
}

export async function getConnection() {
  if (!initialized) {
    await initializeOracleClient()
  }

  try {
    const connection = await oracledb.getConnection()
    return connection
  } catch (error) {
    console.error('❌ Error getting Oracle connection:', error)
    throw error
  }
}

export async function closePool() {
  try {
    await oracledb.getPool().close(10)
    console.log('🔒 Oracle Database pool closed')
  } catch (error) {
    console.error('❌ Error closing Oracle pool:', error)
  }
}

// Tipos para los datos
export interface EventData {
  id: number
  name: string
  event_date: string
  venue_id: number
  package_code: string
  theme_code: string
  client_number: number
  song_id: number
  song_title: string
  type_code: string
}

export interface SongData {
  id: number
  title: string
  type_code: string
}

// Función para ejecutar procedimientos almacenados
export async function executeStoredProcedure(
  procedureName: string,
  parameters: Record<string, any>
): Promise<any> {
  let connection

  try {
    connection = await getConnection()
    
    // Construir la llamada al procedimiento almacenado
    const bindVars: Record<string, any> = {}
    const paramNames: string[] = []

    Object.keys(parameters).forEach((key) => {
      bindVars[key] = parameters[key]
      paramNames.push(`:${key}`)
    })

    const sql = `BEGIN ${procedureName}(${paramNames.join(', ')}); END;`
    
    console.log('🔍 Executing SQL:', sql)
    console.log('📝 Parameters:', bindVars)

    const result = await connection.execute(sql, bindVars)
    
    console.log('✅ Procedure executed successfully')
    return result

  } catch (error) {
    console.error(`❌ Error executing ${procedureName}:`, error)
    throw error
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (closeError) {
        console.error('❌ Error closing connection:', closeError)
      }
    }
  }
}

// Función para ejecutar consultas SELECT
export async function executeQuery(
  sql: string,
  parameters: Record<string, any> = {}
): Promise<any> {
  let connection

  try {
    connection = await getConnection()
    
    console.log('🔍 Executing Query:', sql)
    console.log('📝 Parameters:', parameters)

    const result = await connection.execute(sql, parameters)
    
    console.log('✅ Query executed successfully')
    return result.rows

  } catch (error) {
    console.error('❌ Error executing query:', error)
    throw error
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (closeError) {
        console.error('❌ Error closing connection:', closeError)
      }
    }
  }
}
