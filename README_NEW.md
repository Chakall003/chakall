# Chakall - Event & Song Manager

Una aplicación moderna de gestión de eventos y canciones construida con **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS** y **shadcn/ui**.

## ✨ Características

- 🎉 **Gestión de Eventos**: Crear y actualizar eventos con toda su información
- 🎵 **Catálogo de Canciones**: Administrar el repertorio de canciones disponibles  
- 🎨 **Interfaz Moderna**: UI atractiva con componentes de shadcn/ui
- 🌙 **Modo Oscuro**: Soporte completo para tema oscuro/claro
- 📱 **Responsive**: Diseño adaptativo para todos los dispositivos
- 🔌 **API REST**: Endpoints para operaciones POST y PUT
- 🗄️ **Oracle Database**: Preparado para conectar con base de datos Oracle

## 🛠️ Tecnologías

- **Framework**: Next.js 15.2.4
- **Runtime**: React 19
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 3.4.17
- **Componentes**: shadcn/ui (Radix UI)
- **Iconos**: Lucide React
- **Notificaciones**: Sonner Toast
- **Formularios**: React Hook Form + Zod

## 📦 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <repository-url>
   cd chakall
   ```

2. **Instalar dependencias**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 🏗️ Estructura del Proyecto

```
chakall/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── events/        # Endpoints de eventos
│   │   └── songs/         # Endpoints de canciones
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx          # Página de inicio
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── events-manager.tsx # Gestor de eventos
│   ├── songs-manager.tsx  # Gestor de canciones
│   └── theme-provider.tsx # Proveedor de temas
├── hooks/                # Hooks personalizados
├── lib/                  # Utilidades
└── public/              # Archivos estáticos
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter de código

## 🎯 Características de los Componentes

### EventsManager
- ✅ Crear nuevos eventos
- ✅ Editar eventos existentes
- ✅ Formulario completo con validación
- ✅ Tabla responsiva con datos
- ✅ Integración con API

### SongsManager
- ✅ Gestión de catálogo de canciones
- ✅ Clasificación por tipos (Romántica, Fiesta, Clásica)
- ✅ Estadísticas visuales
- ✅ Interfaz intuitiva

## 🔌 API Endpoints

### Eventos
- `POST /api/events` - Crear evento
- `PUT /api/events` - Actualizar evento

### Canciones
- `POST /api/songs` - Crear canción
- `PUT /api/songs` - Actualizar canción

## 🗄️ Conexión a Base de Datos

Los endpoints están preparados para conectar con **Oracle Database**. Actualmente incluyen:

```typescript
// Ejemplo de parámetros para Oracle
const params = {
  p_event_id: eventData.id,
  p_event_name: eventData.name,
  p_event_date: eventData.event_date,
  // ... más parámetros
}
```

## 🎨 Temas y Estilos

- Sistema de temas con **next-themes**
- Variables CSS personalizadas
- Componentes estilizados con **Tailwind CSS**
- Gradientes y efectos visuales modernos

## 📱 Responsividad

- Diseño mobile-first
- Breakpoints optimizados
- Componentes adaptables
- Hook `useIsMobile` para detección

## 🚀 Mejoras Implementadas

1. **Dependencias corregidas**: Actualización de `react-day-picker` y `date-fns`
2. **Layout mejorado**: Agregado ThemeProvider y Toaster
3. **Eliminación de duplicados**: Hooks consolidados en `/hooks`
4. **Metadatos actualizados**: Información del proyecto en español
5. **Configuración optimizada**: TypeScript y Next.js

## 📝 Próximos Pasos

- [ ] Implementar conexión real a Oracle Database
- [ ] Agregar autenticación de usuarios
- [ ] Implementar operaciones DELETE
- [ ] Agregar paginación en tablas
- [ ] Tests unitarios y de integración
- [ ] Documentación de API con Swagger

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
