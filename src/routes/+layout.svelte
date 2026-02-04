<script lang="ts">
	import './layout.css';
	import logo from '$lib/assets/icon.png';
	import { authStore, logout } from '$lib/authStore';
	let { children } = $props();
</script>

<!-- Skip to main content (Accessibility) -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
>
	Saltar al contenido principal
</a>

<div class="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
	<!-- Navbar -->
	<nav
		class="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md"
		aria-label="Navegación principal"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<!-- Logo -->
				<a
					href="/"
					class="flex flex-shrink-0 cursor-pointer content-center items-center gap-3 rounded-lg transition-all hover:opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
					aria-label="Deporty - Ir a página principal"
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

				<!-- Navigation -->
				<div class="flex items-center space-x-4">
					{#if $authStore}
						<div class="flex items-center gap-2 sm:gap-4">
							<!-- Enlaces de navegación cuando está autenticado -->
							<nav class="hidden md:flex items-center gap-2">
								<a
									href="/"
									class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
								>
									Dashboard
								</a>
								<a
									href="/torneos"
									class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
								>
									Torneos
								</a>
								<a
									href="/equipos"
									class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
								>
									Equipos
								</a>
								<a
									href="/resultados"
									class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
								>
									Resultados
								</a>
							</nav>
							
							<div class="hidden sm:block h-8 w-px bg-gray-200"></div>
							
							<div class="flex items-center gap-3">
								<div class="hidden sm:flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
									<span class="text-xl">👤</span>
									<span class="text-sm font-bold text-blue-600">{$authStore.firstName}</span>
								</div>
								<button
									onclick={logout}
									class="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white"
								>
									Salir
								</button>
							</div>
						</div>
					{/if}
				</div>
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
			<p class="text-sm text-gray-400">© 2026 Deporty. Hecho con 💙 para el deporte.</p>
		</div>
	</footer>
</div>
