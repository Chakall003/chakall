"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Calendar, MapPin, Package, Palette, User, Music } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Event {
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

export function EventsManager() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      name: "Boda de Primavera",
      event_date: "2024-05-15",
      venue_id: 101,
      package_code: "PREMIUM",
      theme_code: "SPRING",
      client_number: 1001,
      song_id: 201,
      song_title: "Perfect",
      type_code: "ROMANTIC",
    },
    {
      id: 2,
      name: "Cumpleaños Corporativo",
      event_date: "2024-06-20",
      venue_id: 102,
      package_code: "STANDARD",
      theme_code: "CORPORATE",
      client_number: 1002,
      song_id: 202,
      song_title: "Celebration",
      type_code: "PARTY",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    event_date: "",
    venue_id: "",
    package_code: "",
    theme_code: "",
    client_number: "",
    song_id: "",
    song_title: "",
    type_code: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const eventData = {
      ...formData,
      id: Number.parseInt(formData.id),
      venue_id: Number.parseInt(formData.venue_id),
      client_number: Number.parseInt(formData.client_number),
      song_id: Number.parseInt(formData.song_id),
    }

    try {
      if (editingEvent) {
        // PUT request - Update existing event
        const response = await fetch("/api/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        })

        if (response.ok) {
          setEvents(events.map((event) => (event.id === editingEvent.id ? eventData : event)))
          toast({ title: "Evento actualizado exitosamente" })
        }
      } else {
        // POST request - Create new event
        const response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        })

        if (response.ok) {
          setEvents([...events, eventData])
          toast({ title: "Evento creado exitosamente" })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar la solicitud",
        variant: "destructive",
      })
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      event_date: "",
      venue_id: "",
      package_code: "",
      theme_code: "",
      client_number: "",
      song_id: "",
      song_title: "",
      type_code: "",
    })
    setEditingEvent(null)
  }

  const openEditDialog = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      id: event.id.toString(),
      name: event.name,
      event_date: event.event_date,
      venue_id: event.venue_id.toString(),
      package_code: event.package_code,
      theme_code: event.theme_code,
      client_number: event.client_number.toString(),
      song_id: event.song_id.toString(),
      song_title: event.song_title,
      type_code: event.type_code,
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Gestión de Eventos
          </h2>
          <p className="text-muted-foreground">Administra eventos y sus canciones asociadas</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Editar Evento" : "Crear Nuevo Evento"}</DialogTitle>
              <DialogDescription>
                {editingEvent ? "Modifica los datos del evento" : "Completa la información para crear un nuevo evento"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    ID del Evento
                  </Label>
                  <Input
                    id="id"
                    type="number"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Nombre del Evento
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha del Evento
                  </Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue_id" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    ID del Venue
                  </Label>
                  <Input
                    id="venue_id"
                    type="number"
                    value={formData.venue_id}
                    onChange={(e) => setFormData({ ...formData, venue_id: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package_code" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Código de Paquete
                  </Label>
                  <Input
                    id="package_code"
                    value={formData.package_code}
                    onChange={(e) => setFormData({ ...formData, package_code: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme_code" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Código de Tema
                  </Label>
                  <Input
                    id="theme_code"
                    value={formData.theme_code}
                    onChange={(e) => setFormData({ ...formData, theme_code: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_number" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Número de Cliente
                  </Label>
                  <Input
                    id="client_number"
                    type="number"
                    value={formData.client_number}
                    onChange={(e) => setFormData({ ...formData, client_number: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="song_id" className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    ID de Canción
                  </Label>
                  <Input
                    id="song_id"
                    type="number"
                    value={formData.song_id}
                    onChange={(e) => setFormData({ ...formData, song_id: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="song_title" className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Título de Canción
                  </Label>
                  <Input
                    id="song_title"
                    value={formData.song_title}
                    onChange={(e) => setFormData({ ...formData, song_title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type_code" className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Código de Tipo
                  </Label>
                  <Input
                    id="type_code"
                    value={formData.type_code}
                    onChange={(e) => setFormData({ ...formData, type_code: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  {editingEvent ? "Actualizar" : "Crear"} Evento
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos</CardTitle>
          <CardDescription>Eventos registrados en la base de datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Paquete</TableHead>
                  <TableHead>Tema</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Canción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.id}</TableCell>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.event_date}</TableCell>
                    <TableCell>{event.venue_id}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{event.package_code}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.theme_code}</Badge>
                    </TableCell>
                    <TableCell>{event.client_number}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{event.song_title}</span>
                        <span className="text-xs text-muted-foreground">{event.type_code}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
