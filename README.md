# Deporty - Plataforma de Gestión de Torneos Deportivos 🏆

Deporty es una aplicación web moderna para gestionar torneos deportivos amateur, construida con SvelteKit y diseñada con Tailwind CSS.

## ✨ Características Principales

### Dashboard Interactivo
- **Vista personalizada** con saludo dinámico basado en la hora del día
- **Estadísticas en tiempo real** de torneos, partidos y equipos
- **Actividad reciente** para seguir todas las actualizaciones
- **Acciones rápidas** para acceder a funcionalidades comunes
- **Reloj en vivo** que muestra la hora actual

### Gestión de Torneos
- ✅ Crear y configurar nuevos torneos
- ✅ Visualizar torneos activos, próximos y finalizados
- ✅ Filtrar torneos por estado y deporte
- ✅ Ver estadísticas detalladas de cada torneo
- ✅ Diseño visual atractivo con gradientes y animaciones

### Gestión de Equipos
- 👥 Registro y administración de equipos
- 📊 Estadísticas completas (victorias, derrotas, empates, puntos)
- 🎯 Vista organizada por torneo
- 👤 Gestión de jugadores por equipo

### Registro de Resultados
- ⚽ Registro de resultados de partidos
- 📅 Calendario de partidos programados
- 🎨 Visualización clara del marcador con colores
- 🔄 Filtros por torneo, estado y fecha

## 🚀 Tecnologías Utilizadas

- **SvelteKit 2.50+** - Framework de aplicación web
- **Svelte 5** - Framework UI reactivo con runes
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos
- **Drizzle ORM** - ORM para base de datos
- **Neon Database** - PostgreSQL serverless
- **Bcrypt.js** - Encriptación de contraseñas

## 📦 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador automáticamente
npm run dev -- --open
```

## 🏗️ Building

Para crear una versión de producción:

```bash
npm run build
```

Para previsualizar la versión de producción:

```bash
npm run preview
```

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: Azul (#3B82F6) → Cyan (#06B6D4)
- **Secundario**: Verde (#10B981), Púrpura (#A855F7), Naranja (#F97316)
- **Neutros**: Grises (#F9FAFB → #111827)

### Características de Diseño
- ✨ Animaciones suaves en hover y transiciones
- 📱 Diseño completamente responsive (mobile-first)
- 🎯 Gradientes modernos en tarjetas y botones
- 🌈 Sistema de colores consistente
- ♿ Accesibilidad mejorada (ARIA labels, contraste)

## 📁 Estructura del Proyecto

```
deportyapp/
├── src/
│   ├── lib/
│   │   ├── authStore.ts          # Store de autenticación
│   │   ├── server/
│   │   │   ├── db.ts             # Configuración de DB
│   │   │   └── schema.ts         # Esquemas de Drizzle
│   │   └── assets/               # Imágenes y recursos
│   ├── routes/
│   │   ├── +page.svelte          # Dashboard principal
│   │   ├── +layout.svelte        # Layout global con navbar
│   │   ├── login/                # Página de inicio de sesión
│   │   ├── register/             # Página de registro
│   │   ├── torneos/
│   │   │   ├── +page.svelte      # Lista de torneos
│   │   │   ├── crear/            # Crear torneo
│   │   │   └── [id]/             # Detalle de torneo
│   │   ├── equipos/
│   │   │   └── +page.svelte      # Gestión de equipos
│   │   ├── resultados/
│   │   │   └── +page.svelte      # Registro de resultados
│   │   └── api/auth/             # API de autenticación
│   └── app.html                  # HTML base
├── static/                       # Archivos estáticos
└── package.json
```

## 🔐 Autenticación

El sistema incluye:
- Registro de usuarios con validación
- Inicio de sesión seguro con bcrypt
- Almacenamiento de sesión en localStorage
- Protección de rutas (redirección automática)
- Cierre de sesión

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Preview de producción
npm run check        # Type checking
npm run lint         # Linting
npm run format       # Formatear código
```

## 📝 Mejoras Implementadas

### Dashboard Principal
✅ Vista personalizada según autenticación
✅ Saludo dinámico basado en hora del día
✅ Reloj en tiempo real
✅ 4 tarjetas de estadísticas con animaciones
✅ Acciones rápidas con iconos
✅ Actividad reciente
✅ Torneos destacados
✅ Gradientes y efectos visuales modernos

### Navegación
✅ Navbar mejorado con enlaces a todas las secciones
✅ Avatar de usuario en navbar
✅ Botón de cierre de sesión mejorado
✅ Links de navegación principales

### Páginas Nuevas
✅ `/torneos` - Lista completa de torneos con filtros
✅ `/torneos/crear` - Formulario de creación de torneos
✅ `/equipos` - Gestión de equipos con estadísticas
✅ `/resultados` - Registro y visualización de resultados

## 🎯 Roadmap

### Próximas Características
- [ ] Implementar JWT para autenticación
- [ ] Sistema de roles (admin, organizador, jugador)
- [ ] Generación automática de fixtures
- [ ] Estadísticas avanzadas y gráficos
- [ ] Notificaciones en tiempo real
- [ ] Exportar datos a PDF/Excel
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)

---

**Desarrollado con 💙 para el deporte amateur**
