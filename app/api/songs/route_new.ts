import { type NextRequest, NextResponse } from "next/server"
import { executeStoredProcedure, initializeOracleClient, type SongData } from "@/lib/oracle"

// Inicializar el cliente Oracle al cargar el módulo
initializeOracleClient().catch(console.error)

export async function POST(request: NextRequest) {
  try {
    const songData: SongData = await request.json()

    console.log('📝 Creating new song:', songData)

    // Parámetros para el procedimiento almacenado de Oracle
    const params = {
      p_song_id: songData.id,
      p_song_title: songData.title,
      p_type_code: songData.type_code,
    }

    // Ejecutar procedimiento almacenado para crear canción
    // Nota: Reemplaza 'PKG_SONGS.CREATE_SONG' con el nombre real de tu procedimiento
    await executeStoredProcedure('PKG_SONGS.CREATE_SONG', params)

    console.log('✅ Song created successfully in Oracle Database')

    return NextResponse.json({
      success: true,
      message: "Canción creada exitosamente en Oracle Database",
      data: songData,
    })
  } catch (error) {
    console.error("❌ Error creating song:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Error al crear canción en Oracle Database",
        error: error instanceof Error ? error.message : "Error desconocido"
      }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const songData: SongData = await request.json()

    console.log('📝 Updating song:', songData)

    // Parámetros para el procedimiento almacenado de Oracle
    const params = {
      p_song_id: songData.id,
      p_song_title: songData.title,
      p_type_code: songData.type_code,
    }

    // Ejecutar procedimiento almacenado para actualizar canción
    // Nota: Reemplaza 'PKG_SONGS.UPDATE_SONG' con el nombre real de tu procedimiento
    await executeStoredProcedure('PKG_SONGS.UPDATE_SONG', params)

    console.log('✅ Song updated successfully in Oracle Database')

    return NextResponse.json({
      success: true,
      message: "Canción actualizada exitosamente en Oracle Database",
      data: songData,
    })
  } catch (error) {
    console.error("❌ Error updating song:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Error al actualizar canción en Oracle Database",
        error: error instanceof Error ? error.message : "Error desconocido"
      }, 
      { status: 500 }
    )
  }
}

// Endpoint adicional para obtener canciones
export async function GET() {
  try {
    console.log('📖 Fetching songs from Oracle Database')

    // Nota: Reemplaza con tu consulta real
    const songs = await executeStoredProcedure('PKG_SONGS.GET_ALL_SONGS', {})

    console.log('✅ Songs fetched successfully')

    return NextResponse.json({
      success: true,
      message: "Canciones obtenidas exitosamente",
      data: songs,
    })
  } catch (error) {
    console.error("❌ Error fetching songs:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Error al obtener canciones de Oracle Database",
        error: error instanceof Error ? error.message : "Error desconocido"
      }, 
      { status: 500 }
    )
  }
}
