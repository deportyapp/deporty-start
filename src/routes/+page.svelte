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

				<!-- ★ HERO CARD — Calendario Deportivo ★ -->
				<a
					href="/calendariodeportivo"
					class="group relative mx-auto mb-8 block w-full max-w-lg overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/40 via-slate-800/60 to-cyan-900/40 p-6 backdrop-blur-md transition-all hover:scale-[1.02] hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20 sm:p-8"
				>
					<!-- Glow effect -->
					<div
						class="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl transition-all group-hover:bg-blue-400/30"
					></div>
					<div
						class="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-500/15 blur-2xl transition-all group-hover:bg-cyan-400/25"
					></div>

					<div class="relative flex items-center gap-4 sm:gap-5">
						<div
							class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30 sm:h-16 sm:w-16"
						>
							<svg
								class="h-7 w-7 text-white sm:h-8 sm:w-8"
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
						<div class="text-left">
							<h2 class="font-brand text-xl font-bold text-white sm:text-2xl">
								{$t('calendar.heroTitle')}
							</h2>
							<p class="mt-1 text-sm leading-relaxed text-slate-300 sm:text-base">
								{$t('calendar.heroDesc')}
							</p>
						</div>
					</div>

					<div
						class="relative mt-5 flex items-center justify-end gap-2 text-sm font-semibold text-blue-400 transition-colors group-hover:text-blue-300"
					>
						{$t('calendar.heroCta')}
						<svg
							class="h-4 w-4 transition-transform group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</div>
				</a>

				<!-- CTA Buttons -->
				<div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
					<a
						href="/register"
						class="group relative inline-flex w-full min-w-[12rem] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/40 transition-all hover:scale-[1.02] hover:shadow-blue-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 active:scale-[0.99] sm:w-auto"
					>
						<svg
							class="h-4 w-4 shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
						{$t('landing.ctaStart')}
					</a>
					<a
						href="/login"
						class="group relative inline-flex w-full min-w-[12rem] items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/30 px-6 py-3.5 text-base font-semibold text-slate-200 backdrop-blur-sm transition-all hover:border-slate-500 hover:bg-slate-700/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 active:scale-[0.99] sm:w-auto"
					>
						<svg
							class="h-4 w-4 shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
							/>
						</svg>
						{$t('landing.ctaLogin')}
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
