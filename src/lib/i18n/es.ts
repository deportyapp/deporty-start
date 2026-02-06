/**
 * Traducciones en Español (idioma por defecto).
 * 
 * Estructura organizada por secciones de la aplicación.
 * Usamos una estructura plana con namespaces separados por punto
 * para facilitar el acceso: t('nav.dashboard') → "Dashboard"
 */
const es = {
    // ─── General ──────────────────────────────────────
    'app.name': 'Deporty',
    'app.tagline': 'Gestiona tus torneos como un profesional',
    'app.description': 'Plataforma profesional para gestionar torneos, ligas y equipos deportivos en Latinoamérica.',
    'app.copyright': '© 2026 Deporty. Hecho con 💙 para el deporte latinoamericano.',

    // ─── Navegación ───────────────────────────────────
    'nav.dashboard': 'Dashboard',
    'nav.tournaments': 'Torneos',
    'nav.teams': 'Equipos',
    'nav.results': 'Resultados',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registrarse',
    'nav.logout': 'Salir',
    'nav.skipToContent': 'Saltar al contenido principal',
    'nav.mainNav': 'Navegación principal',
    'nav.goHome': 'Deporty - Ir a página principal',

    // ─── Saludos ──────────────────────────────────────
    'greeting.morning': 'Buenos días',
    'greeting.afternoon': 'Buenas tardes',
    'greeting.evening': 'Buenas noches',

    // ─── Dashboard ────────────────────────────────────
    'dashboard.activeTournaments': 'Torneos Activos',
    'dashboard.matchesToday': 'Partidos Hoy',
    'dashboard.registeredTeams': 'Equipos Registrados',
    'dashboard.nextMatch': 'Próximo Partido',
    'dashboard.quickActions': 'Acciones Rápidas',
    'dashboard.recentActivity': 'Actividad Reciente',
    'dashboard.featuredTournaments': 'Torneos Destacados',
    'dashboard.viewAll': 'Ver todos',
    'dashboard.viewDetails': 'Ver detalles',
    'dashboard.clickToStart': 'Click para comenzar',
    'dashboard.seeAll': 'Ver todo',
    'dashboard.currentTime': 'Hora actual',

    // ─── Acciones rápidas ─────────────────────────────
    'action.createTournament': 'Crear Torneo',
    'action.viewTournaments': 'Ver Torneos',
    'action.registerResult': 'Registrar Resultado',
    'action.manageTeams': 'Gestionar Equipos',

    // ─── Landing Page ─────────────────────────────────
    'landing.badge': 'La nueva era del deporte amateur',
    'landing.heroTitle1': 'Gestiona tus torneos',
    'landing.heroTitle2': 'como un profesional',
    'landing.subtitle': 'Organiza ligas, gestiona equipos y sigue los resultados en tiempo real.',
    'landing.subtitleHighlight': 'Todo lo que necesitas',
    'landing.subtitleEnd': 'para llevar tu pasión al siguiente nivel.',
    'landing.ctaStart': 'Empezar Gratis',
    'landing.ctaLogin': 'Iniciar Sesión',
    'landing.feature1Title': 'Torneos Ilimitados',
    'landing.feature1Desc': 'Crea y gestiona todos los torneos que necesites',
    'landing.feature2Title': 'Estadísticas en Vivo',
    'landing.feature2Desc': 'Sigue los resultados y estadísticas en tiempo real',
    'landing.feature3Title': 'Gestión de Equipos',
    'landing.feature3Desc': 'Administra equipos, jugadores y resultados',

    // ─── Onboarding ───────────────────────────────────
    'onboarding.title': 'Configura tu ubicacion',
    'onboarding.subtitle': 'Elige tu pais y ciudad para personalizar la experiencia.',
    'onboarding.countryLabel': 'Pais',
    'onboarding.cityLabel': 'Ciudad',
    'onboarding.selectCountry': 'Selecciona un pais',
    'onboarding.selectCity': 'Selecciona una ciudad',
    'onboarding.citySearchPlaceholder': 'Buscar ciudad (min 2 letras)',
    'onboarding.citySearchHint': 'Escribe al menos 2 letras para filtrar sin sobrecargar el sistema.',
    'onboarding.loadingCities': 'Cargando ciudades...',
    'onboarding.continue': 'Continuar',

    // ─── Torneos ──────────────────────────────────────
    'tournaments.myTournaments': 'Mis Torneos',
    'tournaments.manage': 'Gestiona y supervisa todos tus torneos deportivos',
    'tournaments.create': 'Crear Torneo',
    'tournaments.filterByStatus': 'Filtrar por Estado',
    'tournaments.filterBySport': 'Filtrar por Deporte',
    'tournaments.search': 'Buscar torneos...',
    'tournaments.all': 'Todos',
    'tournaments.inProgress': 'En curso',
    'tournaments.upcoming': 'Por comenzar',
    'tournaments.finished': 'Finalizado',
    'tournaments.teams': 'Equipos',
    'tournaments.matches': 'Partidos',
    'tournaments.empty': 'No tienes torneos creados aún',
    'tournaments.emptyDesc': '¡Crea tu primer torneo y empieza a gestionar competiciones deportivas!',
    'tournaments.createFirst': 'Crear mi primer torneo',

    // ─── Deportes ─────────────────────────────────────
    'sport.futbol': 'Fútbol',
    'sport.futsal': 'Fútbol Sala',
    'sport.basketball': 'Basketball',
    'sport.volleyball': 'Voleibol',
    'sport.beisbol': 'Béisbol',
    'sport.tenis': 'Tenis',
    'sport.handball': 'Handball',
    'sport.hockey': 'Hockey',
    'sport.boxeo': 'Boxeo',
    'sport.boxing': 'Boxeo',

    // ─── Auth / Login ─────────────────────────────────
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.firstName': 'Nombre',
    'auth.lastName': 'Apellido',
    'auth.confirmPassword': 'Confirmar contraseña',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    'auth.loginButton': 'Iniciar Sesión',
    'auth.registerButton': 'Crear Cuenta',
    'auth.resetPassword': 'Restablecer Contraseña',

    // ─── Validación ───────────────────────────────────
    'validation.required': 'Este campo es obligatorio',
    'validation.invalidEmail': 'Correo electrónico inválido',
    'validation.passwordWeak': 'Débil',
    'validation.passwordMedium': 'Media',
    'validation.passwordStrong': 'Fuerte',
    'validation.passwordVeryStrong': 'Muy Fuerte',
    'validation.passwordsNoMatch': 'Las contraseñas no coinciden',
    'validation.minLength': 'Mínimo {min} caracteres',

    // ─── Tiempo / Fechas ─────────────────────────────
    'time.minutes': 'min',
    'time.hours': 'hora',
    'time.hoursShort': 'h',
    'time.days': 'días',
    'time.ago': 'hace',

    // ─── Selector de país ─────────────────────────────
    'country.select': 'Seleccionar país',
    'country.change': 'Cambiar país',
    'country.current': 'País actual',

    // ─── Errores ──────────────────────────────────────
    'error.generic': 'Ha ocurrido un error. Intenta de nuevo.',
    'error.network': 'Error de conexión. Verifica tu internet.',
    'error.notFound': 'Página no encontrada',
    'error.unauthorized': 'Debes iniciar sesión para acceder',
};

export default es;
