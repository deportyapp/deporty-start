<script lang="ts">
	import './layout.css';
	import { t } from '$lib/i18n';
	import { env } from '$env/dynamic/public';
	import LanguageSelector from '$lib/components/LanguageSelector.svelte';
	let { children, data } = $props();

	const isComingSoon = env.PUBLIC_APP_MODE === 'coming_soon';
	let showLogoutConfirm = $state(false);
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
			<div class="relative flex h-[4.5rem] items-center justify-center sm:h-24">
				<!-- Logo (centered) -->
				<a
					href="/"
					data-sveltekit-preload-data="hover"
					class="flex cursor-pointer items-center gap-3 rounded-lg transition-all hover:opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:gap-4"
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

				<!-- Logout button (absolute right, only when logged in) -->
				{#if !isComingSoon && data.session}
					<button
						type="button"
						onclick={() => (showLogoutConfirm = true)}
						class="absolute right-0 flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
					>
						<svg
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
						<span class="hidden sm:inline">{$t('nav.logout')}</span>
					</button>
				{/if}
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main id="main-content" class="min-h-0 flex-1 overflow-auto">
		{@render children()}
	</main>

	<!-- Language Selector (public pages, above footer) -->
	{#if !data.session}
		<div class="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-4">
			<div class="mx-auto flex max-w-7xl justify-center">
				<LanguageSelector />
			</div>
		</div>
	{/if}

	<!-- Footer -->
	<footer class="flex-shrink-0 border-t border-gray-100 bg-white py-8">
		<div class="mx-auto max-w-7xl px-4 text-center">
			<p class="text-sm text-gray-400">{$t('app.copyright')}</p>
		</div>
	</footer>
</div>

<!-- Logout Confirmation Modal -->
{#if showLogoutConfirm}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => {
			if (e.target === e.currentTarget) showLogoutConfirm = false;
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') showLogoutConfirm = false;
		}}
	>
		<div class="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
			<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
				<svg
					class="h-6 w-6 text-red-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
			</div>
			<h3 class="mb-2 text-center text-lg font-bold text-gray-900">{$t('logout.confirmTitle')}</h3>
			<p class="mb-6 text-center text-sm text-gray-500">{$t('logout.confirmMessage')}</p>
			<div class="flex gap-3">
				<button
					type="button"
					onclick={() => (showLogoutConfirm = false)}
					class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
				>
					{$t('logout.cancel')}
				</button>
				<form method="POST" action="/logout" class="flex-1">
					<button
						type="submit"
						class="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700"
					>
						{$t('logout.confirm')}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
