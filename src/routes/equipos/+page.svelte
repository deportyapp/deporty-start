<script lang="ts">
	import { authStore } from '$lib/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!$authStore) {
			goto('/login');
		}
	});

	// Datos de equipos (vacío hasta que los usuarios creen equipos)
	let equipos = $state<any[]>([]);

	let showModal = $state(false);
	let nuevoEquipo = $state({ nombre: '', torneo: '', logo: '⚽' });

	function agregarEquipo() {
		showModal = true;
	}

	function calcularPuntos(victorias: number, empates: number) {
		return victorias * 3 + empates;
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">Mis Equipos 👥</h1>
					<p class="mt-2 text-gray-600">Gestiona todos tus equipos y sus estadísticas</p>
				</div>
				<button
					onclick={agregarEquipo}
					class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
				>
					<span class="text-xl">➕</span>
					Nuevo Equipo
				</button>
			</div>
		</div>

		<!-- Estadísticas Generales -->
		<div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
			<div class="rounded-2xl bg-white p-6 shadow-md">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Equipos</p>
						<p class="mt-2 text-3xl font-bold text-gray-900">{equipos.length}</p>
					</div>
					<div
						class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-4xl shadow-lg"
					>
						👥
					</div>
				</div>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-md">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Jugadores</p>
						<p class="mt-2 text-3xl font-bold text-gray-900">
							{equipos.reduce((acc, e) => acc + e.jugadores, 0)}
						</p>
					</div>
					<div
						class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 text-4xl shadow-lg"
					>
						⚽
					</div>
				</div>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-md">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Partidos Jugados</p>
						<p class="mt-2 text-3xl font-bold text-gray-900">
							{equipos.reduce((acc, e) => acc + e.partidos, 0)}
						</p>
					</div>
					<div
						class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 text-4xl shadow-lg"
					>
						📊
					</div>
				</div>
			</div>
		</div>

		<!-- Lista de Equipos -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			{#each equipos as equipo (equipo.id)}
				<div
					class="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:scale-105 hover:shadow-xl"
				>
					<!-- Header -->
					<div class="relative h-32 bg-gradient-to-r {equipo.color} p-6 text-white">
						<div class="absolute top-4 right-4 text-6xl opacity-20">{equipo.logo}</div>
						<div class="relative z-10">
							<h3 class="text-2xl font-bold">{equipo.nombre}</h3>
							<p class="mt-1 text-sm opacity-90">{equipo.torneo}</p>
						</div>
					</div>

					<!-- Contenido -->
					<div class="p-6">
						<!-- Estadísticas -->
						<div class="mb-4 grid grid-cols-4 gap-3">
							<div class="rounded-lg bg-green-50 p-3 text-center">
								<p class="text-xs text-green-600">Victorias</p>
								<p class="text-xl font-bold text-green-700">{equipo.victorias}</p>
							</div>
							<div class="rounded-lg bg-red-50 p-3 text-center">
								<p class="text-xs text-red-600">Derrotas</p>
								<p class="text-xl font-bold text-red-700">{equipo.derrotas}</p>
							</div>
							<div class="rounded-lg bg-gray-50 p-3 text-center">
								<p class="text-xs text-gray-600">Empates</p>
								<p class="text-xl font-bold text-gray-700">{equipo.empates}</p>
							</div>
							<div class="rounded-lg bg-blue-50 p-3 text-center">
								<p class="text-xs text-blue-600">Puntos</p>
								<p class="text-xl font-bold text-blue-700">
									{calcularPuntos(equipo.victorias, equipo.empates)}
								</p>
							</div>
						</div>

						<!-- Jugadores -->
						<div class="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 p-3">
							<span class="text-2xl">👤</span>
							<div>
								<p class="text-sm text-gray-600">Jugadores</p>
								<p class="font-bold text-gray-900">{equipo.jugadores} registrados</p>
							</div>
						</div>

						<!-- Acciones -->
						<div class="grid grid-cols-2 gap-2">
							<button
								class="rounded-lg bg-gray-100 py-2 text-center font-semibold text-gray-700 transition-all hover:bg-blue-600 hover:text-white"
							>
								Ver detalles
							</button>
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
	</div>
</div>

<!-- Modal para nuevo equipo -->
{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		onclick={(e) => { if (e.target === e.currentTarget) showModal = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') showModal = false; }}
		role="dialog"
		aria-modal="true"
		aria-label="Crear nuevo equipo"
		tabindex="-1"
	>
		<div
			class="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
		>
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Crear Nuevo Equipo</h2>
			<form class="space-y-4">
				<div>
					<label for="nombreEquipo" class="mb-2 block text-sm font-semibold text-gray-700">
						Nombre del Equipo
					</label>
					<input
						id="nombreEquipo"
						type="text"
						bind:value={nuevoEquipo.nombre}
						class="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Ej: Los Campeones"
					/>
				</div>
				<div>
					<label for="torneoEquipo" class="mb-2 block text-sm font-semibold text-gray-700">
						Torneo
					</label>
					<select
						id="torneoEquipo"
						bind:value={nuevoEquipo.torneo}
						class="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Seleccionar torneo</option>
						<option>Liga de Fútbol 5</option>
						<option>Torneo de Basketball</option>
						<option>Copa de Verano</option>
					</select>
				</div>
				<div class="flex gap-3 pt-4">
					<button
						type="button"
						onclick={() => (showModal = false)}
						class="flex-1 rounded-lg border-2 border-gray-300 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50"
					>
						Cancelar
					</button>
					<button
						type="submit"
						class="flex-1 rounded-lg bg-blue-600 py-3 font-bold text-white transition-all hover:bg-blue-700"
					>
						Crear Equipo
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
