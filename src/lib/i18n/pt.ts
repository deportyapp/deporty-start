/**
 * Traducciones en Portugués (Brasil).
 * 
 * Brasil es el país más grande de Latinoamérica y tiene
 * una enorme cultura deportiva. Soportar portugués es clave.
 */
const pt: Record<string, string> = {
    // ─── General ──────────────────────────────────────
    'app.name': 'Deporty',
    'app.tagline': 'Gerencie seus torneios como um profissional',
    'app.description': 'Plataforma profissional para gerenciar torneios, ligas e equipes esportivas na América Latina.',
    'app.copyright': '© 2026 Deporty. Feito com 💙 para o esporte latino-americano.',

    // ─── Navegação ────────────────────────────────────
    'nav.dashboard': 'Painel',
    'nav.tournaments': 'Torneios',
    'nav.teams': 'Equipes',
    'nav.results': 'Resultados',
    'nav.login': 'Entrar',
    'nav.register': 'Cadastrar',
    'nav.logout': 'Sair',
    'nav.skipToContent': 'Pular para o conteúdo principal',
    'nav.mainNav': 'Navegação principal',
    'nav.goHome': 'Deporty - Ir para página principal',

    // ─── Saudações ────────────────────────────────────
    'greeting.morning': 'Bom dia',
    'greeting.afternoon': 'Boa tarde',
    'greeting.evening': 'Boa noite',

    // ─── Painel ───────────────────────────────────────
    'dashboard.activeTournaments': 'Torneios Ativos',
    'dashboard.matchesToday': 'Jogos Hoje',
    'dashboard.registeredTeams': 'Equipes Registradas',
    'dashboard.nextMatch': 'Próximo Jogo',
    'dashboard.quickActions': 'Ações Rápidas',
    'dashboard.recentActivity': 'Atividade Recente',
    'dashboard.featuredTournaments': 'Torneios em Destaque',
    'dashboard.viewAll': 'Ver todos',
    'dashboard.viewDetails': 'Ver detalhes',
    'dashboard.clickToStart': 'Clique para começar',
    'dashboard.seeAll': 'Ver tudo',
    'dashboard.currentTime': 'Hora atual',

    // ─── Ações rápidas ────────────────────────────────
    'action.createTournament': 'Criar Torneio',
    'action.viewTournaments': 'Ver Torneios',
    'action.registerResult': 'Registrar Resultado',
    'action.manageTeams': 'Gerenciar Equipes',

    // ─── Landing Page ─────────────────────────────────
    'landing.badge': 'A nova era do esporte amador',
    'landing.heroTitle1': 'Gerencie seus torneios',
    'landing.heroTitle2': 'como um profissional',
    'landing.subtitle': 'Organize ligas, gerencie equipes e acompanhe os resultados em tempo real.',
    'landing.subtitleHighlight': 'Tudo o que você precisa',
    'landing.subtitleEnd': 'para levar sua paixão ao próximo nível.',
    'landing.ctaStart': 'Começar Grátis',
    'landing.ctaLogin': 'Entrar',
    'landing.feature1Title': 'Torneios Ilimitados',
    'landing.feature1Desc': 'Crie e gerencie todos os torneios que precisar',
    'landing.feature2Title': 'Estatísticas ao Vivo',
    'landing.feature2Desc': 'Acompanhe resultados e estatísticas em tempo real',
    'landing.feature3Title': 'Gestão de Equipes',
    'landing.feature3Desc': 'Administre equipes, jogadores e resultados',

    // ─── Onboarding ───────────────────────────────────
    'onboarding.title': 'Configure sua localizacao',
    'onboarding.subtitle': 'Escolha seu pais e cidade para personalizar a experiencia.',
    'onboarding.countryLabel': 'Pais',
    'onboarding.cityLabel': 'Cidade',
    'onboarding.selectCountry': 'Selecione um pais',
    'onboarding.selectCity': 'Selecione uma cidade',
    'onboarding.citySearchPlaceholder': 'Buscar cidade (min 2 letras)',
    'onboarding.citySearchHint': 'Digite pelo menos 2 letras para filtrar sem sobrecarregar o sistema.',
    'onboarding.loadingCities': 'Carregando cidades...',
    'onboarding.continue': 'Continuar',

    // ─── Torneios ─────────────────────────────────────
    'tournaments.myTournaments': 'Meus Torneios',
    'tournaments.manage': 'Gerencie e acompanhe todos os seus torneios esportivos',
    'tournaments.create': 'Criar Torneio',
    'tournaments.filterByStatus': 'Filtrar por Status',
    'tournaments.filterBySport': 'Filtrar por Esporte',
    'tournaments.search': 'Buscar torneios...',
    'tournaments.all': 'Todos',
    'tournaments.inProgress': 'Em andamento',
    'tournaments.upcoming': 'Por começar',
    'tournaments.finished': 'Finalizado',
    'tournaments.teams': 'Equipes',
    'tournaments.matches': 'Jogos',
    'tournaments.empty': 'Você ainda não tem torneios criados',
    'tournaments.emptyDesc': 'Crie seu primeiro torneio e comece a gerenciar competições esportivas!',
    'tournaments.createFirst': 'Criar meu primeiro torneio',

    // ─── Esportes ─────────────────────────────────────
    'sport.futbol': 'Futebol',
    'sport.futsal': 'Futsal',
    'sport.basketball': 'Basquete',
    'sport.volleyball': 'Vôlei',
    'sport.beisbol': 'Beisebol',
    'sport.tenis': 'Tênis',
    'sport.handball': 'Handebol',
    'sport.hockey': 'Hóquei',
    'sport.boxeo': 'Boxe',
    'sport.boxing': 'Boxe',

    // ─── Auth / Login ─────────────────────────────────
    'auth.email': 'E-mail',
    'auth.password': 'Senha',
    'auth.firstName': 'Nome',
    'auth.lastName': 'Sobrenome',
    'auth.confirmPassword': 'Confirmar senha',
    'auth.forgotPassword': 'Esqueceu sua senha?',
    'auth.noAccount': 'Não tem uma conta?',
    'auth.hasAccount': 'Já tem uma conta?',
    'auth.loginButton': 'Entrar',
    'auth.registerButton': 'Criar Conta',
    'auth.resetPassword': 'Redefinir Senha',

    // ─── Validação ────────────────────────────────────
    'validation.required': 'Este campo é obrigatório',
    'validation.invalidEmail': 'E-mail inválido',
    'validation.passwordWeak': 'Fraca',
    'validation.passwordMedium': 'Média',
    'validation.passwordStrong': 'Forte',
    'validation.passwordVeryStrong': 'Muito Forte',
    'validation.passwordsNoMatch': 'As senhas não coincidem',
    'validation.minLength': 'Mínimo de {min} caracteres',

    // ─── Tempo / Datas ────────────────────────────────
    'time.minutes': 'min',
    'time.hours': 'hora',
    'time.hoursShort': 'h',
    'time.days': 'dias',
    'time.ago': 'atrás',

    // ─── Seletor de país ──────────────────────────────
    'country.select': 'Selecionar país',
    'country.change': 'Mudar país',
    'country.current': 'País atual',

    // ─── Erros ────────────────────────────────────────
    'error.generic': 'Ocorreu um erro. Tente novamente.',
    'error.network': 'Erro de conexão. Verifique sua internet.',
    'error.notFound': 'Página não encontrada',
    'error.unauthorized': 'Você precisa estar logado para acessar',
};

export default pt;
