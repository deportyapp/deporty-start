<script lang="ts">
	import { authStore } from '$lib/authStore';
	import { t } from '$lib/i18n';
	import { countryConfig, formatDate, formatTime } from '$lib/stores/locale';
	import { onMount } from 'svelte';

	let currentTime = $state(new Date());
	let timerActive = $state(false);

	onMount(() => {
		timerActive = true;
		const interval = setInterval(() => {
			if (timerActive) {
				currentTime = new Date();
			}
		}, 60000); // Actualizar cada minuto en vez de cada segundo

		return () => {
			timerActive = false;
			clearInterval(interval);
		};
	});

	function getGreeting() {
		const hour = currentTime.getHours();
		if (hour < 12) return $t('greeting.morning');
		if (hour < 18) return $t('greeting.afternoon');
		return $t('greeting.evening');
	}

	// Datos de ejemplo para el dashboard
	let stats = $derived([
		{ label: $t('dashboard.activeTournaments'), value: '3', icon: '🏆', color: 'from-blue-500 to-cyan-400' },
		{ label: $t('dashboard.matchesToday'), value: '5', icon: '⚽', color: 'from-green-500 to-emerald-400' },
		{ label: $t('dashboard.registeredTeams'), value: '12', icon: '👥', color: 'from-purple-500 to-pink-400' },
		{
			label: $t('dashboard.nextMatch'),
			value: '2h',
			icon: '⏰',
			color: 'from-orange-500 to-yellow-400'
		}
	]);

	let recentActivity = [
		{ title: 'Liga de Fútbol 5', action: 'Nuevo resultado registrado', time: '5 min' },
		{ title: 'Torneo de Basketball', action: 'Equipo "Los Leones" inscrito', time: '1 hora' },
		{ title: 'Copa de Verano', action: 'Fixture actualizado', time: '3 horas' }
	];

	let quickActions = $derived([
		{ label: $t('action.createTournament'), icon: '➕', href: '/torneos/crear', color: 'bg-blue-600' },
		{ label: $t('action.viewTournaments'), icon: '📋', href: '/torneos', color: 'bg-green-600' },
		{ label: $t('action.registerResult'), icon: '📊', href: '/resultados', color: 'bg-purple-600' },
		{ label: $t('action.manageTeams'), icon: '⚙️', href: '/equipos', color: 'bg-orange-600' }
	]);
</script>

{#if $authStore}
	<!-- Dashboard para usuarios autenticados -->
	<div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<!-- Header del Dashboard -->
			<div class="mb-8">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
							{getGreeting()}, {$authStore.firstName}! 👋
						</h1>
						<p class="mt-2 text-gray-600">
							{formatDate(currentTime, $countryConfig)}
						</p>
					</div>
					<div class="hidden md:block">
						<div class="text-right">
							<div class="text-2xl font-bold text-blue-600">
								{formatTime(currentTime, $countryConfig)}
							</div>
							<div class="text-sm text-gray-500">{$t('dashboard.currentTime')} ({$countryConfig.timezone.split('/').pop()})</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Estadísticas -->
			<div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{#each stats as stat}
					<div
						class="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-xl"
					>
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-600">{stat.label}</p>
								<p class="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
							</div>
							<div
								class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br {stat.color} text-4xl shadow-lg"
							>
								{stat.icon}
							</div>
						</div>
						<div class="mt-4 h-1 w-full rounded-full bg-gray-100">
							<div class="h-1 w-2/3 rounded-full bg-gradient-to-r {stat.color}"></div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Acciones Rápidas y Actividad Reciente -->
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<!-- Acciones Rápidas -->
				<div class="lg:col-span-2">
					<div class="rounded-2xl bg-white p-6 shadow-md">
						<div class="mb-6 flex items-center justify-between">
							<h2 class="text-xl font-bold text-gray-900">{$t('dashboard.quickActions')}</h2>
							<span class="text-2xl">⚡</span>
						</div>
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{#each quickActions as action}
								<a
									href={action.href}
									class="group flex items-center gap-4 rounded-xl border-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:scale-105 hover:border-blue-200 hover:shadow-lg"
								>
									<div
										class="{action.color} flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl shadow-md transition-transform group-hover:scale-110"
									>
										{action.icon}
									</div>
									<div>
										<p class="font-semibold text-gray-900">{action.label}</p>
										<p class="text-sm text-gray-500">{$t('dashboard.clickToStart')}</p>
									</div>
								</a>
							{/each}
						</div>
					</div>
				</div>

				<!-- Actividad Reciente -->
				<div class="lg:col-span-1">
					<div class="rounded-2xl bg-white p-6 shadow-md">
						<div class="mb-6 flex items-center justify-between">
							<h2 class="text-xl font-bold text-gray-900">{$t('dashboard.recentActivity')}</h2>
							<span class="text-2xl">📱</span>
						</div>
						<div class="space-y-4">
							{#each recentActivity as activity}
								<div
									class="group cursor-pointer rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50"
								>
									<div class="flex items-start justify-between">
										<div class="flex-1">
											<p class="font-semibold text-gray-900">{activity.title}</p>
											<p class="mt-1 text-sm text-gray-600">{activity.action}</p>
										</div>
										<span
											class="ml-2 flex-shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
										>
											{activity.time}
										</span>
									</div>
								</div>
							{/each}
						</div>
						<button
							class="mt-6 w-full rounded-xl border-2 border-gray-200 py-3 font-semibold text-gray-700 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
						>
							{$t('dashboard.seeAll')}
						</button>
					</div>
				</div>
			</div>

			<!-- Sección de Torneos Destacados -->
			<div class="mt-8">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-2xl font-bold text-gray-900">{$t('dashboard.featuredTournaments')}</h2>
					<a
						href="/torneos"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700"
					>
						{$t('dashboard.viewAll')}
					</a>
				</div>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each [
						{ name: 'Liga de Fútbol 5', teams: 8, matches: 24, status: 'En curso' },
						{ name: 'Torneo de Basketball', teams: 6, matches: 15, status: 'Por comenzar' },
						{ name: 'Copa de Verano', teams: 12, matches: 36, status: 'En curso' }
					] as torneo}
						<div
							class="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:scale-105 hover:shadow-xl"
						>
							<div
								class="h-32 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 p-6 text-white"
							>
								<h3 class="text-xl font-bold">{torneo.name}</h3>
								<span
									class="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm"
								>
									{torneo.status}
								</span>
							</div>
							<div class="p-6">
								<div class="grid grid-cols-2 gap-4">
									<div>
										<p class="text-sm text-gray-500">{$t('tournaments.teams')}</p>
										<p class="text-2xl font-bold text-gray-900">{torneo.teams}</p>
									</div>
									<div>
										<p class="text-sm text-gray-500">{$t('tournaments.matches')}</p>
										<p class="text-2xl font-bold text-gray-900">{torneo.matches}</p>
									</div>
								</div>
								<button
									class="mt-4 w-full rounded-lg bg-gray-100 py-2 font-semibold text-gray-700 transition-all group-hover:bg-blue-600 group-hover:text-white"
								>
									{$t('dashboard.viewDetails')}
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{:else}
	<!-- Landing Page para usuarios no autenticados -->
	<main class="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
		<!-- Grid Background Pattern -->
		<div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
		
		<!-- Hero Section -->
		<section class="relative px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
			<div class="relative z-10 mx-auto max-w-6xl">
				<!-- Badge -->
				<div class="mb-8 flex justify-center">
					<div
						class="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 backdrop-blur-sm"
					>
						<span class="relative flex h-2 w-2">
							<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
							<span class="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
						</span>
						{$t('landing.badge')}
					</div>
				</div>

				<!-- Main Heading -->
				<h1
					class="mb-8 text-center text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
				>
					{$t('landing.heroTitle1')}
					<br />
					<span
						class="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
					>
						{$t('landing.heroTitle2')}
					</span>
				</h1>

				<!-- Subtitle -->
				<p class="mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-slate-300 sm:text-xl">
					{$t('landing.subtitle')}
					<span class="text-blue-400">{$t('landing.subtitleHighlight')}</span> {$t('landing.subtitleEnd')}
				</p>

				<!-- CTA Buttons -->
				<div class="mb-16 flex justify-center">
					<div class="flex w-full max-w-md flex-col gap-4 sm:flex-row">
						<a
							href="/register"
							class="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-bold text-white shadow-2xl shadow-blue-500/50 transition-all hover:scale-105 hover:shadow-blue-500/70"
						>
							<span class="relative flex items-center gap-2">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
								{$t('landing.ctaStart')}
							</span>
						</a>
						<a
							href="/login"
							class="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900/50 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-500 hover:bg-slate-800/50"
						>
							<span class="relative flex items-center gap-2">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
								</svg>
								{$t('landing.ctaLogin')}
							</span>
						</a>
					</div>
				</div>

				<!-- Features Grid -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
					{#each [
						{ icon: '🏆', title: $t('landing.feature1Title'), desc: $t('landing.feature1Desc') },
						{ icon: '📊', title: $t('landing.feature2Title'), desc: $t('landing.feature2Desc') },
						{ icon: '👥', title: $t('landing.feature3Title'), desc: $t('landing.feature3Desc') }
					] as feature}
						<div
							class="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:border-blue-500/50 hover:bg-slate-800/50"
						>
							<div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
							<div class="relative">
								<div class="mb-4 text-5xl">{feature.icon}</div>
								<h3 class="mb-2 text-xl font-bold text-white">{feature.title}</h3>
								<p class="text-slate-400">{feature.desc}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Animated Gradient Orbs -->
			<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
				<div class="absolute -top-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-blue-600/20 blur-3xl"></div>
				<div class="absolute -bottom-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-cyan-600/20 blur-3xl" style="animation-delay: 2s;"></div>
				<div class="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-purple-600/10 blur-3xl" style="animation-delay: 4s;"></div>
			</div>
		</section>
	</main>
{/if}

<style>
	/* Animaciones Custom */
	@keyframes blob {
		0% {
			transform: translate(0px, 0px) scale(1);
		}
		33% {
			transform: translate(30px, -50px) scale(1.1);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.9);
		}
		100% {
			transform: translate(0px, 0px) scale(1);
		}
	}

	.animate-blob {
		animation: blob 7s infinite;
	}

	.animation-delay-2000 {
		animation-delay: 2s;
	}

	.animation-delay-4000 {
		animation-delay: 4s;
	}
</style>
