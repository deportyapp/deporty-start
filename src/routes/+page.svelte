<script lang="ts">
	import { t } from '$lib/i18n';
	let { data } = $props();
</script>

<!-- Landing: ocupa toda la altura disponible del main, sin scroll -->
<main
	class="relative flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
>
	<!-- Grid Background Pattern (finer scale, no captura clics) -->
	<div
		class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_30%,#000_60%,transparent_100%)] bg-[size:3rem_3rem]"
	></div>

	<!-- Hero Section: centrado en el espacio disponible, padding responsivo -->
	<section
		class="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
	>
		<div class="relative z-10 mx-auto w-full max-w-2xl text-center">
			<!-- Main Heading: brand font + subtle depth -->
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

			<!-- Subtitle: consistent spacing scale (6 → 8) -->
			<p class="mx-auto mb-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
				{$t('landing.subtitle')}
				<span class="text-blue-400">{$t('landing.subtitleHighlight')}</span>
				{$t('landing.subtitleEnd')}
			</p>

			<!-- CTA Buttons: clear hierarchy + focus states -->
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

		<!-- Animated Gradient Orbs: smaller, softer -->
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
	</section>
</main>
