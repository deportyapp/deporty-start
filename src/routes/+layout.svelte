<script lang="ts">
	import './layout.css';
	import logo from '$lib/assets/icon.png';
	import { authStore, initAuth, logout } from '$lib/authStore';
	import { t } from '$lib/i18n';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	let { children } = $props();

	$effect(() => {
		authStore.set($page.data.user ?? null);
	});

	onMount(() => {
		initAuth();
	});
</script>

<!-- Skip to main content (Accessibility) -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
>
	{$t('nav.skipToContent')}
</a>

<div class="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
	<!-- Navbar -->
	<nav
		class="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md"
		aria-label={$t('nav.mainNav')}
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<!-- Logo -->
				<a
					href="/"
					class="flex flex-shrink-0 cursor-pointer content-center items-center gap-3 rounded-lg transition-all hover:opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
					aria-label={$t('nav.goHome')}
				>
					<img
						src={logo}
						alt=""
						class="h-10 w-10 object-contain drop-shadow-md"
						aria-hidden="true"
					/>
					<span
						class="font-brand bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-2xl font-bold tracking-wide text-transparent"
					>
						DEPORTY
					</span>
				</a>

				{#if $authStore}
					<div class="flex items-center gap-3">
						<span class="text-sm font-semibold text-gray-700">
							{$authStore.firstName}
						</span>
						<button
							type="button"
							class="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							onclick={logout}
						>
							{$t('nav.logout')}
						</button>
					</div>
				{/if}
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main id="main-content" class="flex-grow">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="mt-auto border-t border-gray-100 bg-white py-8">
		<div class="mx-auto max-w-7xl px-4 text-center">
			<p class="text-sm text-gray-400">{$t('app.copyright')}</p>
		</div>
	</footer>
</div>
