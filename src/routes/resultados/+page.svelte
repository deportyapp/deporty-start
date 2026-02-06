<script lang="ts">
	import { authStore } from '$lib/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!$authStore) {
			goto('/login');
		}
	});

	// Datos de resultados (vacío hasta que los usuarios registren resultados)
	let resultados = $state<any[]>([]);

	let showModal = $state(false);
	let nuevoResultado = $state({
		torneo: '',
		equipoLocal: '',
		equipoVisitante: '',
		golesLocal: 0,
		golesVisitante: 0,
		fecha: ''
	});

	function registrarResultado() {
		showModal = true;
	}

	function getResultadoColor(
		golesLocal: number,
		golesVisitante: number,
		esLocal: boolean
	): string {
		if (golesLocal === golesVisitante) return 'text-gray-700';
		if (esLocal) {
			return golesLocal > golesVisitante ? 'text-green-600' : 'text-red-600';
		} else {
			return golesVisitante > golesLocal ? 'text-green-600' : 'text-red-600';
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">Resultados 📊</h1>
					<p class="mt-2 text-gray-600">Registra y consulta los resultados de todos los partidos</p>
				</div>
				<button
					onclick={registrarResultado}
					class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
				>
					<span class="text-xl">➕</span>
					Registrar Resultado
				</button>
			</div>
		</div>

		<!-- Filtros -->
		<div class="mb-6 rounded-2xl bg-white p-6 shadow-md">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div>
					<label for="filtroTorneo" class="mb-2 block text-sm font-semibold text-gray-700"
						>Filtrar por Torneo</label
					>
					<select
						id="filtroTorneo"
						class="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option>Todos los torneos</option>
						<option>Liga de Fútbol 5</option>
						<option>Copa de Verano</option>
						<option>Torneo de Basketball</option>
					</select>
				</div>
				<div>
					<label for="filtroEstado" class="mb-2 block text-sm font-semibold text-gray-700"
						>Estado</label
					>
					<select
						id="filtroEstado"
						class="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option>Todos</option>
						<option>Finalizados</option>
						<option>Programados</option>
					</select>
				</div>
				<div>
					<label for="filtroFecha" class="mb-2 block text-sm font-semibold text-gray-700"
						>Fecha</label
					>
					<input
						id="filtroFecha"
						type="date"
						class="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>
		</div>

		<!-- Lista de Resultados -->
		<div class="space-y-4">
			{#each resultados as resultado (resultado.id)}
				<div
					class="overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl"
				>
					<div class="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-3">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<span class="text-sm font-semibold text-gray-700">{resultado.torneo}</span>
							</div>
							<div class="flex items-center gap-3">
								<span class="text-sm text-gray-600">
									{new Date(resultado.fecha).toLocaleDateString('es-ES', {
										weekday: 'short',
										day: 'numeric',
										month: 'short'
									})}
								</span>
								<span
									class="rounded-full px-3 py-1 text-xs font-semibold {resultado.estado ===
									'Finalizado'
										? 'bg-green-100 text-green-700'
										: 'bg-blue-100 text-blue-700'}"
								>
									{resultado.estado}
								</span>
							</div>
						</div>
					</div>

					<div class="p-6">
						<div class="flex items-center justify-between">
							<!-- Equipo Local -->
							<div class="flex flex-1 items-center gap-4">
								<div class="text-5xl">{resultado.logoLocal}</div>
								<div class="flex-1">
									<p class="text-lg font-bold text-gray-900">{resultado.equipoLocal}</p>
									<p class="text-sm text-gray-500">Local</p>
								</div>
							</div>

							<!-- Marcador -->
							<div class="mx-8 text-center">
								{#if resultado.estado === 'Finalizado'}
									<div class="flex items-center gap-4">
										<div
											class="text-4xl font-bold {getResultadoColor(
												resultado.golesLocal,
												resultado.golesVisitante,
												true
											)}"
										>
											{resultado.golesLocal}
										</div>
										<div class="text-2xl font-bold text-gray-400">-</div>
										<div
											class="text-4xl font-bold {getResultadoColor(
												resultado.golesLocal,
												resultado.golesVisitante,
												false
											)}"
										>
											{resultado.golesVisitante}
										</div>
									</div>
								{:else}
									<div class="rounded-lg bg-blue-100 px-6 py-3">
										<p class="text-sm font-semibold text-blue-700">vs</p>
									</div>
								{/if}
							</div>

							<!-- Equipo Visitante -->
							<div class="flex flex-1 flex-row-reverse items-center gap-4">
								<div class="text-5xl">{resultado.logoVisitante}</div>
								<div class="flex-1 text-right">
									<p class="text-lg font-bold text-gray-900">{resultado.equipoVisitante}</p>
									<p class="text-sm text-gray-500">Visitante</p>
								</div>
							</div>
						</div>

						<!-- Acciones -->
						{#if resultado.estado === 'Programado'}
							<div class="mt-4 flex gap-2 border-t border-gray-100 pt-4">
								<button
									class="flex-1 rounded-lg bg-green-100 py-2 font-semibold text-green-700 transition-all hover:bg-green-600 hover:text-white"
								>
									Registrar Resultado
								</button>
								<button
									class="flex-1 rounded-lg bg-gray-100 py-2 font-semibold text-gray-700 transition-all hover:bg-gray-600 hover:text-white"
								>
									Editar
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Modal para registrar resultado -->
{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		onclick={(e) => { if (e.target === e.currentTarget) showModal = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') showModal = false; }}
		role="dialog"
		aria-modal="true"
		aria-label="Registrar nuevo resultado"
		tabindex="-1"
	>
		<div
			class="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl"
		>
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Registrar Nuevo Resultado</h2>
			<form class="space-y-4">
				<div>
					<label for="nuevoTorneo" class="mb-2 block text-sm font-semibold text-gray-700">
						Torneo
					</label>
					<select
						id="nuevoTorneo"
						bind:value={nuevoResultado.torneo}
						class="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Seleccionar torneo</option>
						<option>Liga de Fútbol 5</option>
						<option>Copa de Verano</option>
					</select>
				</div>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label for="equipoLocal" class="mb-2 block text-sm font-semibold text-gray-700">
							Equipo Local
						</label>
						<select
							id="equipoLocal"
							bind:value={nuevoResultado.equipoLocal}
							class="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Seleccionar equipo</option>
							<option>Los Leones</option>
							<option>Águilas FC</option>
							<option>Tigres United</option>
						</select>
					</div>
					<div>
						<label for="equipoVisitante" class="mb-2 block text-sm font-semibold text-gray-700">
							Equipo Visitante
						</label>
						<select
							id="equipoVisitante"
							bind:value={nuevoResultado.equipoVisitante}
							class="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Seleccionar equipo</option>
							<option>Los Leones</option>
							<option>Águilas FC</option>
							<option>Tigres United</option>
						</select>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-4">
					<div>
						<label for="golesLocal" class="mb-2 block text-sm font-semibold text-gray-700">
							Goles Local
						</label>
						<input
							id="golesLocal"
							type="number"
							bind:value={nuevoResultado.golesLocal}
							min="0"
							class="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="golesVisitante" class="mb-2 block text-sm font-semibold text-gray-700">
							Goles Visitante
						</label>
						<input
							id="golesVisitante"
							type="number"
							bind:value={nuevoResultado.golesVisitante}
							min="0"
							class="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="fechaPartido" class="mb-2 block text-sm font-semibold text-gray-700">
							Fecha
						</label>
						<input
							id="fechaPartido"
							type="date"
							bind:value={nuevoResultado.fecha}
							class="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
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
						Guardar Resultado
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
