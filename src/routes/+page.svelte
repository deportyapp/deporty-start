<script lang="ts">
	import { t } from '$lib/i18n';
	import { env } from '$env/dynamic/public';
	import LanguageSelector from '$lib/components/LanguageSelector.svelte';

	let { data } = $props();

	const isComingSoon = env.PUBLIC_APP_MODE === 'coming_soon';
</script>

{#if isComingSoon}
	<!-- ═══════════ COMING SOON MODE ═══════════ -->
	<main
		class="relative flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
	>
		<!-- Grid Background -->
		<div
			class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_30%,#000_60%,transparent_100%)] bg-[size:3rem_3rem]"
		></div>

		<section
			class="relative flex min-h-0 flex-1 flex-col items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
		>
			<!-- Top spacer (balances language selector at bottom) -->
			<div class="flex-1" aria-hidden="true"></div>
			<div class="relative z-10 mx-auto w-full max-w-3xl text-center">
				<!-- Badge -->
				<div
					class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-sm"
				>
					<span class="relative flex h-2 w-2">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"
						></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-blue-400"></span>
					</span>
					{$t('comingSoon.badge')}
				</div>

				<!-- Main Heading -->
				<h1
					class="font-brand mb-6 text-5xl leading-[1.1] font-bold tracking-tight text-white drop-shadow-sm sm:text-6xl lg:text-7xl lg:tracking-tighter"
				>
					{$t('comingSoon.title1')}
					<br />
					<span
						class="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
					>
						{$t('comingSoon.title2')}
					</span>
				</h1>

				<!-- Subtitle -->
				<p class="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">
					{$t('comingSoon.subtitle')}
				</p>

				<!-- Feature Cards -->
				<div class="mx-auto mt-4 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
					<!-- Card 1: Torneos -->
					<div
						class="group rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 backdrop-blur-sm transition-all hover:border-blue-500/40 hover:bg-slate-800/60"
					>
						<div class="mb-3 inline-flex rounded-xl bg-blue-500/15 p-2.5 text-blue-400">
							<svg
								class="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h3 class="mb-1 text-sm font-semibold text-white">{$t('comingSoon.feature1Title')}</h3>
						<p class="text-xs leading-relaxed text-slate-400">{$t('comingSoon.feature1Desc')}</p>
					</div>

					<!-- Card 2: Equipos -->
					<div
						class="group rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 backdrop-blur-sm transition-all hover:border-cyan-500/40 hover:bg-slate-800/60"
					>
						<div class="mb-3 inline-flex rounded-xl bg-cyan-500/15 p-2.5 text-cyan-400">
							<svg
								class="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</div>
						<h3 class="mb-1 text-sm font-semibold text-white">{$t('comingSoon.feature2Title')}</h3>
						<p class="text-xs leading-relaxed text-slate-400">{$t('comingSoon.feature2Desc')}</p>
					</div>

					<!-- Card 3: Resultados -->
					<div
						class="group rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 backdrop-blur-sm transition-all hover:border-teal-500/40 hover:bg-slate-800/60"
					>
						<div class="mb-3 inline-flex rounded-xl bg-teal-500/15 p-2.5 text-teal-400">
							<svg
								class="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<h3 class="mb-1 text-sm font-semibold text-white">{$t('comingSoon.feature3Title')}</h3>
						<p class="text-xs leading-relaxed text-slate-400">{$t('comingSoon.feature3Desc')}</p>
					</div>
				</div>
			</div>

			<!-- Animated Gradient Orbs -->
			<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
				<div
					class="absolute -top-32 -right-32 h-64 w-64 animate-pulse rounded-full bg-blue-600/15 blur-3xl"
				></div>
				<div
					class="absolute -bottom-32 -left-32 h-64 w-64 animate-pulse rounded-full bg-cyan-600/15 blur-3xl"
					style="animation-delay: 1.5s;"
				></div>
				<div
					class="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-500/8 blur-3xl"
					style="animation-delay: 3s;"
				></div>
			</div>
			<!-- Bottom spacer with language selector (balances top spacer) -->
			<div class="relative z-10 flex flex-1 items-end justify-center pb-4">
				<LanguageSelector />
			</div>
		</section>
	</main>
{:else}
	<!-- ═══════════ FULL APP MODE ═══════════ -->
	<main
		class="relative flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
	>
		<!-- Grid Background Pattern -->
		<div
			class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_30%,#000_60%,transparent_100%)] bg-[size:3rem_3rem]"
		></div>

		<section
			class="relative flex min-h-0 flex-1 flex-col items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
		>
			<!-- Top spacer (balances language selector at bottom) -->
			<div class="flex-1" aria-hidden="true"></div>
			<div class="relative z-10 mx-auto w-full max-w-2xl text-center">
				<h1
					class="font-brand mb-6 text-4xl leading-[1.15] font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl lg:tracking-tighter"
				>
					{$t('landing.heroTitle1')}
					<br />
					<span
						class="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(56,189,248,0.15)]"
					>
						{$t('landing.heroTitle2')}
					</span>
				</h1>

				<p class="mx-auto mb-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
					{$t('landing.subtitle')}
					<span class="text-blue-400">{$t('landing.subtitleHighlight')}</span>
					{$t('landing.subtitleEnd')}
				</p>

				<p
					class="mb-4 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase sm:text-sm"
				>
					{$t('landing.optionsTitle')}
				</p>

				<!-- ★ 3 opciones al mismo nivel: Registrarse / Iniciar sesión / Calendario ★ -->
				<div class="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
					<!-- Opción 1: Registrarme (primaria) -->
					<a
						href="/register"
						class="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-blue-400/40 bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-center shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 active:scale-[0.99]"
					>
						<div
							class="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm"
						>
							<svg
								class="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
								/>
							</svg>
						</div>
						<h2 class="font-brand text-lg font-bold text-white">{$t('landing.ctaStart')}</h2>
						<p class="mt-1 text-xs leading-relaxed text-blue-50/90">
							{$t('landing.ctaStartDesc')}
						</p>
					</a>

					<!-- Opción 2: Iniciar sesión -->
					<a
						href="/login"
						class="group relative flex flex-col items-center rounded-2xl border border-slate-600 bg-slate-800/40 p-6 text-center backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-slate-500 hover:bg-slate-700/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 active:scale-[0.99]"
					>
						<div
							class="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-700/60 text-slate-200"
						>
							<svg
								class="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
								/>
							</svg>
						</div>
						<h2 class="font-brand text-lg font-bold text-white">{$t('landing.ctaLogin')}</h2>
						<p class="mt-1 text-xs leading-relaxed text-slate-400">
							{$t('landing.ctaLoginDesc')}
						</p>
					</a>

					<!-- Opción 3: Calendario Deportivo -->
					<a
						href="/calendariodeportivo"
						class="group relative flex flex-col items-center rounded-2xl border border-slate-600 bg-slate-800/40 p-6 text-center backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-slate-500 hover:bg-slate-700/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 active:scale-[0.99]"
					>
						<div
							class="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-700/60 text-slate-200"
						>
							<svg
								class="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h2 class="font-brand text-lg font-bold text-white">{$t('landing.ctaCalendar')}</h2>
						<p class="mt-1 text-xs leading-relaxed text-slate-400">
							{$t('landing.ctaCalendarDesc')}
						</p>
					</a>
				</div>
			</div>

			<!-- Animated Gradient Orbs -->
			<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
				<div
					class="absolute -top-32 -right-32 h-64 w-64 animate-pulse rounded-full bg-blue-600/15 blur-3xl"
				></div>
				<div
					class="absolute -bottom-32 -left-32 h-64 w-64 animate-pulse rounded-full bg-cyan-600/15 blur-3xl"
					style="animation-delay: 1.5s;"
				></div>
				<div
					class="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-500/8 blur-3xl"
					style="animation-delay: 3s;"
				></div>
			</div>
			<!-- Bottom spacer with language selector (balances top spacer) -->
			<div class="relative z-10 flex flex-1 items-end justify-center pb-4">
				<LanguageSelector />
			</div>
		</section>
	</main>
{/if}
