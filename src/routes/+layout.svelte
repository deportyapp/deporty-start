<script lang="ts">
	import './layout.css';
	import { t } from '$lib/i18n';
	import LanguageSelector from '$lib/components/LanguageSelector.svelte';
	let { children, data } = $props();
</script>

<!-- Skip to main content (Accessibility) -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
>
	{$t('nav.skipToContent')}
</a>

<div
	class="flex h-[var(--app-height)] max-h-[var(--app-height)] min-h-[100vh] flex-col overflow-hidden bg-gray-50 font-sans text-gray-900"
>
	<!-- Navbar -->
	<nav
		class="relative z-20 flex-shrink-0 border-b border-gray-100 bg-white/80 backdrop-blur-md"
		aria-label={$t('nav.mainNav')}
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-[4.5rem] items-center justify-between sm:h-24">
				<!-- Logo: siempre enlaza a la página de inicio -->
				<a
					href="/"
					data-sveltekit-preload-data="hover"
					class="flex flex-shrink-0 cursor-pointer content-center items-center gap-3 rounded-lg transition-all hover:opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:gap-4"
					aria-label={$t('nav.goHome')}
				>
					<svg
						class="h-12 w-12 shrink-0 object-contain drop-shadow-md"
						viewBox="0 0 277 231"
						aria-hidden="true"
						style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g transform="matrix(1,0,0,1,-42.778136,-256.726076)">
							<g transform="matrix(1,0,0,1,36.634139,100.399991)">
								<g transform="matrix(1,0,0,1,-120.239655,90.43053)">
									<path
										d="M177.87,236.405L137.674,296.261C265.438,300.413 353.402,241.655 403.106,125.804L361.734,125.711C316.538,189.25 255.687,228.79 177.87,236.405Z"
									/>
								</g>
								<g transform="matrix(1,0,0,1,-122.01667,87.900085)">
									<path
										d="M128.161,238.41L246.262,68.426L394.5,68.426L362.998,127.135L254.454,125.77L179.013,237.952L128.161,238.41Z"
									/>
								</g>
							</g>
						</g>
					</svg>
					<span class="font-brand text-3xl font-bold tracking-wide text-black sm:text-4xl">
						DEPORTY
					</span>
				</a>

				<!-- Language Selector -->
				<LanguageSelector />
			</div>
		</div>
	</nav>

	<!-- Main Content: ocupa el resto; scroll solo si el contenido lo requiere (p. ej. login/register) -->
	<main id="main-content" class="min-h-0 flex-1 overflow-auto">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="flex-shrink-0 border-t border-gray-100 bg-white py-8">
		<div class="mx-auto max-w-7xl px-4 text-center">
			<p class="text-sm text-gray-400">{$t('app.copyright')}</p>
		</div>
	</footer>
</div>
