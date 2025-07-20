"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EventsManager } from "@/components/events-manager"
import { SongsManager } from "@/components/songs-manager"
import { Music, Calendar, Database } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Event & Song Manager
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gestiona eventos y canciones con una interfaz moderna y intuitiva. Conectado a Oracle Database con
            operaciones POST y PUT.
          </p>
        </div>

        {/* Main Content */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Administración de Base de Datos
            </CardTitle>
            <CardDescription>Selecciona una tabla para gestionar sus registros</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="events" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Eventos
                </TabsTrigger>
                <TabsTrigger value="songs" className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Canciones
                </TabsTrigger>
              </TabsList>

              <TabsContent value="events" className="space-y-6">
                <EventsManager />
              </TabsContent>

              <TabsContent value="songs" className="space-y-6">
                <SongsManager />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
