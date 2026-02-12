<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<!-- Landing Page visual -->
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
								href="/login"
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

