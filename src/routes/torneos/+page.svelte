<script lang="ts">
	import { authStore } from '$lib/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		// Redirigir si no está autenticado
		if (!$authStore) {
			goto('/login');
		}
	});

	// Datos de torneos (vacío hasta que los usuarios creen torneos)
	let torneos = $state<any[]>([]);

	let filtroEstado = $state('Todos');
	let filtroDeporte = $state('Todos');

	let torneosFiltrados = $derived(
		torneos.filter((torneo) => {
			const matchEstado = filtroEstado === 'Todos' || torneo.estado === filtroEstado;
			const matchDeporte = filtroDeporte === 'Todos' || torneo.deporte === filtroDeporte;
			return matchEstado && matchDeporte;
		})
	);

	function getEstadoColor(estado: string) {
		switch (estado) {
			case 'En curso':
				return 'bg-green-100 text-green-700';
			case 'Por comenzar':
				return 'bg-blue-100 text-blue-700';
			case 'Finalizado':
				return 'bg-gray-100 text-gray-700';
			default:
				return 'bg-gray-100 text-gray-700';
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">Mis Torneos 🏆</h1>
					<p class="mt-2 text-gray-600">Gestiona y supervisa todos tus torneos deportivos</p>
				</div>
				<a
					href="/torneos/crear"
					class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
				>
					<span class="text-xl">➕</span>
					Crear Torneo
				</a>
			</div>
		</div>

		<!-- Filtros -->
		<div class="mb-6 rounded-2xl bg-white p-6 shadow-md">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div>
					<label for="estado" class="mb-2 block text-sm font-semibold text-gray-700"
						>Filtrar por Estado</label
					>
					<select
						id="estado"
						bind:value={filtroEstado}
						class="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
					>
						<option>Todos</option>
						<option>En curso</option>
						<option>Por comenzar</option>
						<option>Finalizado</option>
					</select>
				</div>
				<div>
					<label for="deporte" class="mb-2 block text-sm font-semibold text-gray-700"
						>Filtrar por Deporte</label
					>
					<select
						id="deporte"
						bind:value={filtroDeporte}
						class="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
					>
						<option>Todos</option>
						<option>Fútbol</option>
						<option>Basketball</option>
						<option>Voleibol</option>
					</select>
				</div>
				<div class="flex items-end">
					<input
						type="text"
						placeholder="Buscar torneos..."
						class="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
					/>
				</div>
			</div>
		</div>

		<!-- Grid de Torneos -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each torneosFiltrados as torneo (torneo.id)}
				<div
					class="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:scale-105 hover:shadow-xl"
				>
					<!-- Header del Torneo -->
					<div
						class="relative h-40 bg-gradient-to-r {torneo.color} p-6 text-white"
					>
						<div class="absolute top-4 right-4 text-6xl opacity-20">{torneo.imagen}</div>
						<div class="relative z-10">
							<h3 class="text-xl font-bold">{torneo.nombre}</h3>
							<p class="mt-1 text-sm opacity-90">{torneo.deporte}</p>
							<span
								class="mt-3 inline-block rounded-full {getEstadoColor(
									torneo.estado
								)} px-3 py-1 text-xs font-semibold"
							>
								{torneo.estado}
							</span>
						</div>
					</div>

					<!-- Contenido del Torneo -->
					<div class="p-6">
						<!-- Estadísticas -->
						<div class="mb-4 grid grid-cols-2 gap-4">
							<div class="rounded-lg bg-gray-50 p-3 text-center">
								<p class="text-sm text-gray-600">Equipos</p>
								<p class="text-2xl font-bold text-gray-900">{torneo.equipos}</p>
							</div>
							<div class="rounded-lg bg-gray-50 p-3 text-center">
								<p class="text-sm text-gray-600">Partidos</p>
								<p class="text-2xl font-bold text-gray-900">{torneo.partidos}</p>
							</div>
						</div>

						<!-- Fecha -->
						<div class="mb-4 flex items-center gap-2 text-sm text-gray-600">
							<span>📅</span>
							<span>Inicio: {new Date(torneo.fechaInicio).toLocaleDateString('es-ES')}</span>
						</div>

						<!-- Acciones -->
						<div class="grid grid-cols-2 gap-2">
							<a
								href="/torneos/{torneo.id}"
								class="rounded-lg bg-gray-100 py-2 text-center font-semibold text-gray-700 transition-all hover:bg-blue-600 hover:text-white"
							>
								Ver detalles
							</a>
							<button
								class="rounded-lg bg-gray-100 py-2 text-center font-semibold text-gray-700 transition-all hover:bg-green-600 hover:text-white"
							>
								Gestionar
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Empty State -->
		{#if torneosFiltrados.length === 0}
			<div class="rounded-2xl bg-white p-12 text-center shadow-md">
				<div class="text-6xl mb-4">🏆</div>
				<h3 class="mb-2 text-xl font-bold text-gray-900">No hay torneos todavía</h3>
				<p class="mb-6 text-gray-600">Crea tu primer torneo para comenzar</p>
				<a
					href="/torneos/crear"
					class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-700"
				>
					➕ Crear Torneo
				</a>
			</div>
		{/if}
	</div>
</div>
