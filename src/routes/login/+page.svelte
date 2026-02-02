<script lang="ts">
	let email = $state('');
	let password = $state('');
	let isSubmitting = $state(false);
	let errorMessage = $state('');

	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		if (!email || !password) {
			errorMessage = 'Por favor completa todos los campos';
			return;
		}

		isSubmitting = true;
		errorMessage = '';

		try {
			// TODO: Implementar endpoint /api/auth/login
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			if (res.ok) {
				window.location.href = '/dashboard';
			} else {
				const data = await res.json();
				errorMessage = data.message || 'Credenciales incorrectas';
			}
		} catch (error) {
			errorMessage = 'Error de conexión. Inténtalo más tarde.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
	<div class="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl">
		<!-- Header -->
		<div class="text-center">
			<h2 class="font-brand text-3xl font-bold tracking-wider text-gray-900 uppercase">
				Iniciar Sesión
			</h2>
			<p class="mt-2 text-gray-500">Bienvenido de vuelta a Deporty</p>
		</div>

		<!-- Error Message -->
		{#if errorMessage}
			<div class="rounded-lg bg-red-100 p-3 text-center text-sm text-red-700">
				{errorMessage}
			</div>
		{/if}

		<!-- Form -->
		<form onsubmit={handleLogin} class="space-y-6">
			<!-- Email -->
			<div class="space-y-1">
				<label for="email" class="text-sm font-semibold text-gray-700">Correo Electrónico</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					oninput={(e) => (email = e.currentTarget.value.toLowerCase())}
					class="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="tu@email.com"
					required
				/>
			</div>

			<!-- Password -->
			<div class="space-y-1">
				<label for="password" class="text-sm font-semibold text-gray-700">Contraseña</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="••••••••"
					required
				/>
			</div>

			<!-- Submit Button -->
			<button
				type="submit"
				disabled={isSubmitting}
				class="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4
				font-bold text-white shadow-xl transition-all hover:scale-[1.01] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isSubmitting}
					<svg
						class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Iniciando sesión...
				{:else}
					🔐 Iniciar Sesión
				{/if}
			</button>
		</form>

		<!-- Footer Links -->
		<div class="space-y-2 text-center">
			<p class="text-sm text-gray-500">
				¿No tienes cuenta?
				<a href="/register" class="font-semibold text-blue-600 hover:underline">Regístrate aquí</a>
			</p>
			<a href="/" class="block text-sm text-gray-400 hover:text-gray-600">← Volver al inicio</a>
		</div>
	</div>
</div>
