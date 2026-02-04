<script lang="ts">
	import { onMount } from 'svelte';
	import logo from '$lib/assets/icon.png';

	// ==========================================
	// Estado del Formulario
	// ==========================================

	let fotoPerfil = $state<string | null>(null);
	let nombres = $state('');
	let apellidos = $state('');
	let fechaNacimiento = $state('');

	// Ubicación
	let pais = $state('Colombia');
	let departamento = $state<any>(null);
	let ciudad = $state('');

	let paisesList = $state<any[]>([]);
	let departamentosColombia = $state<any[]>([]);
	let ciudadesColombia = $state<string[]>([]);

	let cargandoPaises = $state(false);
	let cargandoDeptos = $state(false);
	let cargandoCiudades = $state(false);

	// Autenticación
	let email = $state('');
	let confirmEmail = $state('');
	let password = $state('');
	let confirmPassword = $state('');

	let emailError = $state('');
	let passwordError = $state('');
	let passwordStrength = $state(0);

	function validateEmail(e: string) {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(e);
	}

	function validatePasswordStrength(p: string) {
		let score = 0;
		if (p.length >= 8) score++;
		if (/[A-Z]/.test(p)) score++;
		if (/[a-z]/.test(p)) score++;
		if (/[0-9]/.test(p)) score++;
		if (/[^A-Za-z0-9]/.test(p)) score++;
		passwordStrength = score;
	}

	$effect(() => {
		// Validar Email
		if (email && !validateEmail(email)) {
			emailError = 'Formato de correo inválido';
		} else if (confirmEmail && email !== confirmEmail) {
			emailError = 'Los correos no coinciden';
		} else {
			emailError = '';
		}

		// Validar Password
		validatePasswordStrength(password);
		if (password && password.length < 8) {
			passwordError = 'Mínimo 8 caracteres';
		} else if (confirmPassword && password !== confirmPassword) {
			passwordError = 'Las contraseñas no coinciden';
		} else {
			passwordError = '';
		}
	});

	onMount(async () => {
		// 1. Cargar Países (World Bank API)
		cargandoPaises = true;
		try {
			// per_page=300 para traer todos (son ~296 registros incluyendo agregados)
			const response = await fetch('https://api.worldbank.org/v2/country?format=json&per_page=300');
			if (response.ok) {
				const data = await response.json();
				// El formato es [metadata, datos]
				// Filtramos los agregados (regiones) que no son países reales
				if (data[1]) {
					paisesList = data[1]
						.filter((c: any) => c.region.value !== 'Aggregates')
						.sort((a: any, b: any) => a.name.localeCompare(b.name));
				}
			}
		} catch (error) {
			console.error('Error al cargar países:', error);
			// Fallback si falla la API
			paisesList = [{ name: 'Colombia' }, { name: 'United States' }, { name: 'Spain' }];
		} finally {
			cargandoPaises = false;
		}

		// 2. Cargar Departamentos si es Colombia (por defecto)
		if (pais === 'Colombia') {
			cargarDepartamentosColombia();
		}
	});

	async function cargarDepartamentosColombia() {
		cargandoDeptos = true;
		try {
			const response = await fetch('https://api-colombia.com/api/v1/Department');
			if (response.ok) {
				const data = await response.json();
				departamentosColombia = data.sort((a: any, b: any) => a.name.localeCompare(b.name));
			}
		} catch (error) {
			console.error('Error al cargar departamentos:', error);
		} finally {
			cargandoDeptos = false;
		}
	}

	async function cargarCiudades(deptId: number) {
		ciudad = ''; // Reset ciudad
		cargandoCiudades = true;
		try {
			const response = await fetch(`https://api-colombia.com/api/v1/Department/${deptId}/cities`);
			if (response.ok) {
				const data = await response.json();
				ciudadesColombia = data.map((c: any) => c.name).sort();
			}
		} catch (error) {
			console.error('Error al cargar ciudades:', error);
			ciudadesColombia = [];
		} finally {
			cargandoCiudades = false;
		}
	}

	function capitalizeNames(text: string): string {
		return text
			.toLowerCase()
			.split(/(\s+|-|')/) // Split on spaces, hyphens, and apostrophes but keep delimiters
			.map((word, index, array) => {
				// Keep delimiters as-is
				if (word.match(/^\s+$/) || word === '-' || word === "'") {
					return word;
				}
				// Capitalize first letter of each word
				if (word.length > 0) {
					return word.charAt(0).toUpperCase() + word.slice(1);
				}
				return word;
			})
			.join('');
	}

	function handleImageUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const reader = new FileReader();
			reader.onload = (e) => {
				fotoPerfil = e.target?.result as string;
			};
			reader.readAsDataURL(input.files[0]);
		}
	}

	let formularioValido = $derived(
		nombres.trim() !== '' &&
			apellidos.trim() !== '' &&
			fechaNacimiento !== '' &&
			ciudad !== '' &&
			validateEmail(email) &&
			email === confirmEmail &&
			password.length >= 8 &&
			password === confirmPassword
	);

	let isSubmitting = $state(false);
	let errorMessage = $state('');

	async function handleSubmit() {
		if (!formularioValido) return;

		isSubmitting = true;
		errorMessage = '';

		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nombres,
					apellidos,
					fechaNacimiento,
					pais,
					ciudad,
					email,
					password,
					// Estos campos faltan ser procesados completamente en backend
					// pero los enviamos de una vez
					roles: [], // TODO: Conectar con el input de roles si existe
					deportes: [] // TODO: Conectar con el input de deportes si existe
				})
			});

			const data = await res.json();

			if (res.ok) {
				// Éxito
				alert('¡Registro Exitoso! Bienvenido a Deporty.');
				window.location.href = '/'; // Redirigir a Landing/Login
			} else {
				// Error devuelto por API
				errorMessage = data.message || 'Error al registrar usuario';
			}
		} catch (error) {
			console.error(error);
			errorMessage = 'Error de conexión. Inténtalo más tarde.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50 px-4 py-12 font-sans sm:px-6 lg:px-8">
	<div class="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl">
		<!-- Header -->
		<div class="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center text-white">
			<h2 class="font-brand text-3xl font-bold tracking-wider uppercase">Únete</h2>
			<p class="mt-2 text-blue-100">A la comunidad competitiva más grande de Colombia</p>
		</div>

		<div class="space-y-8 p-8">
			<!-- 1. Foto de Perfil -->
			<div class="flex flex-col items-center">
				<div class="group relative cursor-pointer">
					<div
						class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg"
					>
						{#if fotoPerfil}
							<img src={fotoPerfil} alt="Tu foto" class="h-full w-full object-cover" />
						{:else}
							<img
								src={logo}
								alt="Default Logo"
								class="h-20 w-20 opacity-50 grayscale transition-all group-hover:grayscale-0"
							/>
						{/if}

						<!-- Overlay de carga -->
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<span class="text-sm font-bold text-white">📷 Cambiar</span>
						</div>
					</div>
					<input
						type="file"
						accept="image/*"
						onchange={handleImageUpload}
						class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					/>
				</div>
				<p class="mt-2 text-xs text-gray-500">Toca para subir tu foto</p>
			</div>

			<!-- 2. Información Personal -->
			<div class="space-y-4">
				<h3 class="border-b pb-2 text-lg font-bold text-gray-800">Información Personal</h3>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-1">
						<label for="nombres" class="text-sm font-semibold text-gray-700">Nombres</label>
						<input
							id="nombres"
							type="text"
							bind:value={nombres}
							oninput={(e) => (nombres = capitalizeNames(e.currentTarget.value))}
							class="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Ej: Juan David"
						/>
					</div>
					<div class="space-y-1">
						<label for="apellidos" class="text-sm font-semibold text-gray-700">Apellidos</label>
						<input
							id="apellidos"
							type="text"
							bind:value={apellidos}
							oninput={(e) => (apellidos = capitalizeNames(e.currentTarget.value))}
							class="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Ej: Pérez Gomez"
						/>
					</div>
				</div>

				<div class="space-y-1">
					<label for="fecha" class="text-sm font-semibold text-gray-700">Fecha de Nacimiento</label>
					<div class="relative">
						<!-- Input visual (Formateado a gusto) -->
						<input
							type="text"
							placeholder="dd/mm/aaaa"
							readonly
							value={fechaNacimiento
								? new Date(fechaNacimiento + 'T00:00:00').toLocaleDateString('es-CO', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric'
									})
								: ''}
							class="relative z-10 w-full cursor-pointer rounded-xl border bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
							onclick={(e) => {
								// @ts-ignore
								e.currentTarget.nextElementSibling?.showPicker();
							}}
						/>
						<!-- Input real (Nativo, invisible pero funcional) -->
						<input
							id="fecha"
							type="date"
							bind:value={fechaNacimiento}
							class="absolute inset-0 z-0 h-full w-full cursor-pointer opacity-0"
							onchange={(e) => {
								// Forzar actualización visual si es necesario
							}}
						/>
						<!-- Icono calendario (opcional, decorativo) -->
						<div
							class="pointer-events-none absolute top-1/2 right-3 z-20 -translate-y-1/2 text-gray-400"
						>
							📅
						</div>
					</div>
				</div>
			</div>

			<!-- 3. Ubicación -->
			<div class="space-y-4">
				<h3 class="border-b pb-2 text-lg font-bold text-gray-800">Ubicación</h3>

				<div class="flex flex-col gap-4">
					<div class="space-y-1">
						<label for="pais" class="text-sm font-semibold text-gray-700">
							País
							{#if cargandoPaises}
								<span class="ml-2 animate-pulse text-xs text-blue-500">(Cargando...)</span>
							{/if}
						</label>
						<select
							id="pais"
							bind:value={pais}
							onchange={() => {
								if (pais === 'Colombia') {
									cargarDepartamentosColombia();
								} else {
									departamento = null;
									ciudad = '';
								}
							}}
							class="w-full rounded-xl border bg-gray-50 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
						>
							{#each paisesList as p}
								<option value={p.name}>{p.name}</option>
							{/each}
						</select>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<!-- Departamento -->
						<div class="space-y-1">
							<label for="departamento" class="text-sm font-semibold text-gray-700">
								Departamento
								{#if cargandoDeptos}
									<span class="ml-2 animate-pulse text-xs text-blue-500">(Cargando...)</span>
								{/if}
							</label>
							<select
								id="departamento"
								bind:value={departamento}
								onchange={() => departamento && cargarCiudades(departamento.id)}
								disabled={pais !== 'Colombia' || cargandoDeptos}
								class="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
							>
								<option value={null}>Selecciona...</option>
								{#each departamentosColombia as depto}
									<option value={depto}>{depto.name}</option>
								{/each}
							</select>
						</div>

						<!-- Ciudad -->
						<div class="space-y-1">
							<label for="ciudad" class="text-sm font-semibold text-gray-700">
								Ciudad
								{#if cargandoCiudades}
									<span class="ml-2 animate-pulse text-xs text-blue-500">(Cargando...)</span>
								{/if}
							</label>
							<select
								id="ciudad"
								bind:value={ciudad}
								disabled={!departamento || cargandoCiudades}
								class="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
							>
								<option value="">
									{!departamento
										? 'Selecciona un departamento'
										: cargandoCiudades
											? 'Cargando...'
											: 'Selecciona...'}
								</option>
								{#each ciudadesColombia as c}
									<option value={c}>{c}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>
			</div>

			<!-- 4. Cuenta y Seguridad -->
			<div class="space-y-4">
				<h3 class="border-b pb-2 text-lg font-bold text-gray-800">Cuenta y Seguridad</h3>

				<!-- Email -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-1">
						<label for="email" class="text-sm font-semibold text-gray-700">Correo Electrónico</label
						>
						<input
							id="email"
							type="email"
							bind:value={email}
							oninput={(e) => (email = e.currentTarget.value.toLowerCase())}
							class="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="ejemplo@deporty.com"
						/>
					</div>
					<div class="space-y-1">
						<label for="confirmEmail" class="text-sm font-semibold text-gray-700"
							>Confirmar Correo</label
						>
						<input
							id="confirmEmail"
							type="email"
							bind:value={confirmEmail}
							oninput={(e) => (confirmEmail = e.currentTarget.value.toLowerCase())}
							class="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 {emailError
								? 'border-red-500 focus:ring-red-500'
								: ''}"
							placeholder="Repite tu correo"
						/>
					</div>
				</div>
				{#if emailError}
					<p class="text-xs font-medium text-red-500">{emailError}</p>
				{/if}

				<!-- Password -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-1">
						<label for="password" class="text-sm font-semibold text-gray-700">Contraseña</label>
						<input
							id="password"
							type="password"
							bind:value={password}
							class="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="********"
						/>
						<!-- Medidor de fuerza -->
						<div class="mt-1 flex h-1 gap-1">
							<div
								class="flex-1 rounded-full {passwordStrength >= 1
									? 'bg-red-400'
									: 'bg-gray-200'} transition-colors"
							></div>
							<div
								class="flex-1 rounded-full {passwordStrength >= 2
									? 'bg-orange-400'
									: 'bg-gray-200'} transition-colors"
							></div>
							<div
								class="flex-1 rounded-full {passwordStrength >= 3
									? 'bg-yellow-400'
									: 'bg-gray-200'} transition-colors"
							></div>
							<div
								class="flex-1 rounded-full {passwordStrength >= 4
									? 'bg-green-400'
									: 'bg-gray-200'} transition-colors"
							></div>
							<div
								class="flex-1 rounded-full {passwordStrength >= 5
									? 'bg-emerald-500'
									: 'bg-gray-200'} transition-colors"
							></div>
						</div>
						<p class="text-[10px] text-gray-400">
							Debe tener: 8+ caracteres, mayúscula, minúscula, número y símbolo.
						</p>
					</div>
					<div class="space-y-1">
						<label for="confirmPassword" class="text-sm font-semibold text-gray-700"
							>Confirmar Contraseña</label
						>
						<input
							id="confirmPassword"
							type="password"
							bind:value={confirmPassword}
							class="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 {passwordError
								? 'border-red-500 focus:ring-red-500'
								: ''}"
							placeholder="Repite tu contraseña"
						/>
					</div>
				</div>
				{#if passwordError}
					<p class="text-xs font-medium text-red-500">{passwordError}</p>
				{/if}
			</div>

			<!-- Botón Submit -->
			<div class="pt-6">
				{#if errorMessage}
					<div class="mb-4 rounded-lg bg-red-100 p-3 text-center text-sm text-red-700">
						{errorMessage}
					</div>
				{/if}

				<button
					disabled={!formularioValido || isSubmitting}
					onclick={handleSubmit}
					class="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4
					font-bold text-white shadow-xl transition-all hover:scale-[1.01] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
				>
					{#if isSubmitting}
						<svg
							class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Registrando...
					{:else}
						{formularioValido ? '🚀 Registrarme' : 'Completa tu información básica'}
					{/if}
				</button>

				<a
					href="/"
					class="mt-4 block w-full rounded-xl py-3 text-center font-semibold text-gray-500 transition-colors hover:bg-gray-100"
				>
					Cancelar y volver
				</a>
			</div>
		</div>
	</div>
</div>
