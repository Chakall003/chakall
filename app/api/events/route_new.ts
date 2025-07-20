import { type NextRequest, NextResponse } from "next/server"
import { executeStoredProcedure, initializeOracleClient, type EventData } from "@/lib/oracle"

// Inicializar el cliente Oracle al cargar el módulo
initializeOracleClient().catch(console.error)

export async function POST(request: NextRequest) {
  try {
    const eventData: EventData = await request.json()

    console.log('📝 Creating new event:', eventData)

    // Parámetros para el procedimiento almacenado de Oracle
    const params = {
      p_event_id: eventData.id,
      p_event_name: eventData.name,
      p_event_date: eventData.event_date,
      p_venue_id: eventData.venue_id,
      p_package_code: eventData.package_code,
      p_theme_code: eventData.theme_code,
      p_client_number: eventData.client_number,
      p_song_id: eventData.song_id,
      p_song_title: eventData.song_title,
      p_type_code: eventData.type_code,
    }

    // Ejecutar procedimiento almacenado para crear evento
    // Nota: Reemplaza 'PKG_EVENTS.CREATE_EVENT' con el nombre real de tu procedimiento
    await executeStoredProcedure('PKG_EVENTS.CREATE_EVENT', params)

    console.log('✅ Event created successfully in Oracle Database')

    return NextResponse.json({
      success: true,
      message: "Evento creado exitosamente en Oracle Database",
      data: eventData,
    })
  } catch (error) {
    console.error("❌ Error creating event:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Error al crear evento en Oracle Database",
        error: error instanceof Error ? error.message : "Error desconocido"
      }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const eventData: EventData = await request.json()

    console.log('📝 Updating event:', eventData)

    // Parámetros para el procedimiento almacenado de Oracle
    const params = {
      p_event_id: eventData.id,
      p_event_name: eventData.name,
      p_event_date: eventData.event_date,
      p_venue_id: eventData.venue_id,
      p_package_code: eventData.package_code,
      p_theme_code: eventData.theme_code,
      p_client_number: eventData.client_number,
      p_song_id: eventData.song_id,
      p_song_title: eventData.song_title,
      p_type_code: eventData.type_code,
    }

    // Ejecutar procedimiento almacenado para actualizar evento
    // Nota: Reemplaza 'PKG_EVENTS.UPDATE_EVENT' con el nombre real de tu procedimiento
    await executeStoredProcedure('PKG_EVENTS.UPDATE_EVENT', params)

    console.log('✅ Event updated successfully in Oracle Database')

    return NextResponse.json({
      success: true,
      message: "Evento actualizado exitosamente en Oracle Database",
      data: eventData,
    })
  } catch (error) {
    console.error("❌ Error updating event:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Error al actualizar evento en Oracle Database",
        error: error instanceof Error ? error.message : "Error desconocido"
      }, 
      { status: 500 }
    )
  }
}

// Endpoint adicional para obtener eventos
export async function GET() {
  try {
    console.log('📖 Fetching events from Oracle Database')

    // Nota: Reemplaza con tu consulta real
    const events = await executeStoredProcedure('PKG_EVENTS.GET_ALL_EVENTS', {})

    console.log('✅ Events fetched successfully')

    return NextResponse.json({
      success: true,
      message: "Eventos obtenidos exitosamente",
      data: events,
    })
  } catch (error) {
    console.error("❌ Error fetching events:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Error al obtener eventos de Oracle Database",
        error: error instanceof Error ? error.message : "Error desconocido"
      }, 
      { status: 500 }
    )
  }
}
