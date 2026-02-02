<script lang="ts">
	// Landing Page Logic (si se necesita alguna animación simple)
</script>

<main class="relative overflow-hidden">
	<!-- Hero Section -->
	<section class="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="hero-heading">
		<div class="relative z-10 mx-auto max-w-4xl text-center">
			<!-- Badge -->
			<div
				class="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold tracking-wide text-blue-600"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
				La nueva era del deporte amateur
			</div>

			<!-- Main Heading -->
			<h1
				id="hero-heading"
				class="mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl"
			>
				Gestiona tus torneos con
				<span
					class="font-brand mt-2 block bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-5xl text-transparent uppercase sm:text-6xl lg:text-7xl"
				>
					Deporty
				</span>
			</h1>

			<!-- Subtitle -->
			<p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
				Organiza ligas, gestiona equipos y sigue los resultados en tiempo real. Todo lo que
				necesitas para llevar tu pasión al siguiente nivel.
			</p>

			<!-- CTA Buttons -->
			<div class="mx-auto flex w-full max-w-md flex-col gap-3 sm:max-w-lg sm:flex-row sm:gap-4">
				<a
					href="/register"
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition-all hover:scale-105 hover:bg-blue-700 sm:px-8 sm:text-lg"
				>
					🚀 Empezar Gratis
				</a>
				<a
					href="/login"
					class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-base font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 sm:px-8 sm:text-lg"
				>
					🔐 Iniciar Sesión
				</a>
			</div>
		</div>

		<!-- Decorative Background Elements -->
		<div
			class="pointer-events-none absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 overflow-hidden"
			aria-hidden="true"
		>
			<div
				class="animate-blob absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-100 opacity-30 mix-blend-multiply blur-3xl filter"
			></div>
			<div
				class="animate-blob animation-delay-2000 absolute top-0 right-1/4 h-96 w-96 rounded-full bg-cyan-100 opacity-30 mix-blend-multiply blur-3xl filter"
			></div>
			<div
				class="animate-blob animation-delay-4000 absolute -bottom-32 left-1/2 h-96 w-96 rounded-full bg-purple-100 opacity-30 mix-blend-multiply blur-3xl filter"
			></div>
		</div>
	</section>
</main>

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
