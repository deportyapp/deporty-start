<script lang="ts">
	import { authStore } from '$lib/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	onMount(() => {
		if (!$authStore) {
			goto('/login');
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
	<div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="rounded-2xl bg-white p-8 shadow-md">
			<h1 class="text-3xl font-bold text-gray-900">Detalle de Torneo</h1>
			<p class="mt-2 text-gray-600">
				Torneo: <span class="font-semibold">{$page.params.id}</span>
			</p>
			<p class="mt-4 text-gray-600">
				Esta pagina es un placeholder inicial. Aqui se mostraran los datos del torneo,
				calendario, equipos y resultados.
			</p>
			<div class="mt-6 flex gap-3">
				<a
					href="/torneos"
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
				>
					Volver a Torneos
				</a>
			</div>
		</div>
	</div>
</div>
