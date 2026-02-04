<script lang="ts">
	import { authStore } from '$lib/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!$authStore) {
			goto('/login');
		}
	});

	let nombre = $state('');
	let deporte = $state('Fútbol');
	let numEquipos = $state(8);
	let fechaInicio = $state('');
	let descripcion = $state('');
	let tipoTorneo = $state('Liga');
	let isSubmitting = $state(false);
	let successMessage = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isSubmitting = true;

		// Simulación de envío
		await new Promise((resolve) => setTimeout(resolve, 1500));

		successMessage = 'Torneo creado exitosamente! 🎉';
		isSubmitting = false;

		setTimeout(() => {
			goto('/torneos');
		}, 2000);
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
	<div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">Crear Nuevo Torneo 🏆</h1>
			<p class="mt-2 text-gray-600">Configura todos los detalles de tu nuevo torneo</p>
		</div>

		<!-- Success Message -->
		{#if successMessage}
			<div
				class="mb-6 rounded-xl bg-green-100 p-4 text-center text-lg font-semibold text-green-700"
			>
				{successMessage}
			</div>
		{/if}

		<!-- Formulario -->
		<form onsubmit={handleSubmit} class="space-y-6 rounded-2xl bg-white p-8 shadow-xl">
			<!-- Información Básica -->
			<div class="space-y-6">
				<div class="border-b border-gray-200 pb-4">
					<h2 class="text-xl font-bold text-gray-900">Información Básica</h2>
				</div>

				<!-- Nombre del Torneo -->
				<div>
					<label for="nombre" class="mb-2 block text-sm font-semibold text-gray-700">
						Nombre del Torneo <span class="text-red-500">*</span>
					</label>
					<input
						id="nombre"
						type="text"
						bind:value={nombre}
						required
						placeholder="Ej: Liga de Verano 2026"
						class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
					/>
				</div>

				<!-- Deporte y Tipo -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label for="deporte" class="mb-2 block text-sm font-semibold text-gray-700">
							Deporte <span class="text-red-500">*</span>
						</label>
						<select
							id="deporte"
							bind:value={deporte}
							required
							class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						>
							<option>Fútbol</option>
							<option>Basketball</option>
							<option>Voleibol</option>
							<option>Tenis</option>
							<option>Padel</option>
							<option>Otro</option>
						</select>
					</div>

					<div>
						<label for="tipoTorneo" class="mb-2 block text-sm font-semibold text-gray-700">
							Tipo de Torneo <span class="text-red-500">*</span>
						</label>
						<select
							id="tipoTorneo"
							bind:value={tipoTorneo}
							required
							class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						>
							<option>Liga</option>
							<option>Copa (Eliminación Directa)</option>
							<option>Mixto</option>
						</select>
					</div>
				</div>

				<!-- Número de Equipos y Fecha -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label for="numEquipos" class="mb-2 block text-sm font-semibold text-gray-700">
							Número de Equipos <span class="text-red-500">*</span>
						</label>
						<input
							id="numEquipos"
							type="number"
							bind:value={numEquipos}
							required
							min="2"
							max="32"
							class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						/>
					</div>

					<div>
						<label for="fechaInicio" class="mb-2 block text-sm font-semibold text-gray-700">
							Fecha de Inicio <span class="text-red-500">*</span>
						</label>
						<input
							id="fechaInicio"
							type="date"
							bind:value={fechaInicio}
							required
							class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						/>
					</div>
				</div>

				<!-- Descripción -->
				<div>
					<label for="descripcion" class="mb-2 block text-sm font-semibold text-gray-700">
						Descripción
					</label>
					<textarea
						id="descripcion"
						bind:value={descripcion}
						rows="4"
						placeholder="Describe tu torneo, reglas especiales, premios, etc."
						class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
					></textarea>
				</div>
			</div>

			<!-- Configuración Adicional -->
			<div class="space-y-6">
				<div class="border-b border-gray-200 pb-4">
					<h2 class="text-xl font-bold text-gray-900">Configuración Adicional</h2>
				</div>

				<div class="space-y-4 rounded-lg bg-gray-50 p-4">
					<label class="flex cursor-pointer items-center gap-3">
						<input type="checkbox" class="h-5 w-5 rounded border-gray-300 text-blue-600" />
						<span class="text-sm font-medium text-gray-700"
							>Permitir inscripciones automáticas</span
						>
					</label>

					<label class="flex cursor-pointer items-center gap-3">
						<input type="checkbox" class="h-5 w-5 rounded border-gray-300 text-blue-600" />
						<span class="text-sm font-medium text-gray-700">Generar fixture automáticamente</span>
					</label>

					<label class="flex cursor-pointer items-center gap-3">
						<input type="checkbox" class="h-5 w-5 rounded border-gray-300 text-blue-600" />
						<span class="text-sm font-medium text-gray-700">Torneo público</span>
					</label>
				</div>
			</div>

			<!-- Botones de Acción -->
			<div class="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">
				<button
					type="button"
					onclick={() => goto('/torneos')}
					class="flex-1 rounded-xl border-2 border-gray-300 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50"
				>
					Cancelar
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if isSubmitting}
						<span class="flex items-center justify-center gap-2">
							<svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
									fill="none"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Creando...
						</span>
					{:else}
						🚀 Crear Torneo
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
