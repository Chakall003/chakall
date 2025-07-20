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
import { Plus, Edit, Music, Hash, Type } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Song {
  id: number
  title: string
  type_code: string
}

export function SongsManager() {
  const [songs, setSongs] = useState<Song[]>([
    { id: 201, title: "Perfect", type_code: "ROMANTIC" },
    { id: 202, title: "Celebration", type_code: "PARTY" },
    { id: 203, title: "Canon in D", type_code: "CLASSICAL" },
    { id: 204, title: "Happy", type_code: "UPBEAT" },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    type_code: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const songData = {
      ...formData,
      id: Number.parseInt(formData.id),
    }

    try {
      if (editingSong) {
        // PUT request - Update existing song
        const response = await fetch("/api/songs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(songData),
        })

        if (response.ok) {
          setSongs(songs.map((song) => (song.id === editingSong.id ? songData : song)))
          toast({ title: "Canción actualizada exitosamente" })
        }
      } else {
        // POST request - Create new song
        const response = await fetch("/api/songs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(songData),
        })

        if (response.ok) {
          setSongs([...songs, songData])
          toast({ title: "Canción creada exitosamente" })
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
      title: "",
      type_code: "",
    })
    setEditingSong(null)
  }

  const openEditDialog = (song: Song) => {
    setEditingSong(song)
    setFormData({
      id: song.id.toString(),
      title: song.title,
      type_code: song.type_code,
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      ROMANTIC: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      PARTY: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      CLASSICAL: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      UPBEAT: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    }
    return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Music className="h-6 w-6 text-purple-600" />
            Gestión de Canciones
          </h2>
          <p className="text-muted-foreground">Administra el catálogo de canciones disponibles</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Canción
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSong ? "Editar Canción" : "Crear Nueva Canción"}</DialogTitle>
              <DialogDescription>
                {editingSong
                  ? "Modifica los datos de la canción"
                  : "Completa la información para agregar una nueva canción"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  ID de la Canción
                </Label>
                <Input
                  id="id"
                  type="number"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  required
                  placeholder="Ej: 205"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Título de la Canción
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Ej: Thinking Out Loud"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type_code" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Código de Tipo
                </Label>
                <Input
                  id="type_code"
                  value={formData.type_code}
                  onChange={(e) => setFormData({ ...formData, type_code: e.target.value })}
                  required
                  placeholder="Ej: ROMANTIC, PARTY, CLASSICAL"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  {editingSong ? "Actualizar" : "Crear"} Canción
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Songs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Canciones</CardTitle>
          <CardDescription>Canciones disponibles en la base de datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {songs.map((song) => (
                  <TableRow key={song.id}>
                    <TableCell className="font-medium">{song.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{song.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(song.type_code)}>{song.type_code}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(song)}>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Canciones</p>
                <p className="text-2xl font-bold">{songs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <div>
                <p className="text-sm text-muted-foreground">Románticas</p>
                <p className="text-2xl font-bold">{songs.filter((s) => s.type_code === "ROMANTIC").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <div>
                <p className="text-sm text-muted-foreground">Fiesta</p>
                <p className="text-2xl font-bold">{songs.filter((s) => s.type_code === "PARTY").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <div>
                <p className="text-sm text-muted-foreground">Clásicas</p>
                <p className="text-2xl font-bold">{songs.filter((s) => s.type_code === "CLASSICAL").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
