<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { validatePasswordStrength, getPasswordStrengthText, getPasswordStrengthColor } from '$lib/validation';

	const token = $page.params.token;

	let newPassword = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	const passwordStrength = $derived(validatePasswordStrength(newPassword));
	const passwordsMatch = $derived(newPassword && confirmPassword && newPassword === confirmPassword);

	async function handleResetPassword(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';
		successMessage = '';

		// Validaciones
		if (!newPassword || !confirmPassword) {
			errorMessage = 'Por favor completa todos los campos';
			return;
		}

		if (newPassword !== confirmPassword) {
			errorMessage = 'Las contraseñas no coinciden';
			return;
		}

		if (newPassword.length < 8) {
			errorMessage = 'La contraseña debe tener al menos 8 caracteres';
			return;
		}

		if (passwordStrength < 2) {
			errorMessage = 'Por favor usa una contraseña más segura';
			return;
		}

		isSubmitting = true;

		try {
			const res = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, newPassword })
			});

			const data = await res.json();

			if (res.ok) {
				successMessage = data.message;
				// Redirigir al login después de 2 segundos
				setTimeout(() => {
					goto('/login');
				}, 2000);
			} else {
				errorMessage = data.message || 'Error al restablecer la contraseña';
			}
		} catch (error) {
			errorMessage = 'Error de conexión. Inténtalo más tarde.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-12">
	<!-- Background Pattern -->
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
	
	<!-- Animated Orbs -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute -top-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-blue-600/20 blur-3xl"></div>
		<div class="absolute -bottom-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-cyan-600/20 blur-3xl"></div>
	</div>

	<div class="relative z-10 w-full max-w-md">
		<!-- Card Container -->
		<div class="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-xl">
			<div class="p-8 sm:p-10">
				<!-- Header -->
				<div class="mb-8 text-center">
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
						<svg class="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
						</svg>
					</div>
					<h2 class="mb-2 text-3xl font-bold text-white">
						Restablecer Contraseña
					</h2>
					<p class="text-slate-400">Elige una nueva contraseña segura</p>
				</div>

				<!-- Success Message -->
				{#if successMessage}
					<div class="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
						<div class="flex items-center gap-2">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							{successMessage}
						</div>
						<p class="mt-2 text-xs">Redirigiendo al inicio de sesión...</p>
					</div>
				{/if}

				<!-- Error Message -->
				{#if errorMessage}
					<div class="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
						<div class="flex items-center gap-2">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							{errorMessage}
						</div>
					</div>
				{/if}

				<!-- Form -->
				<form onsubmit={handleResetPassword} class="space-y-5">
					<!-- Nueva Contraseña -->
					<div class="space-y-2">
						<label for="newPassword" class="text-sm font-semibold text-slate-300">Nueva Contraseña</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
								<svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<input
								id="newPassword"
								type={showPassword ? 'text' : 'password'}
								bind:value={newPassword}
								class="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 pl-12 pr-12 text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
								placeholder="••••••••"
								required
							/>
							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition-colors"
							>
								{#if showPassword}
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
									</svg>
								{:else}
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								{/if}
							</button>
						</div>
						
						<!-- Password Strength Indicator -->
						{#if newPassword}
							<div class="space-y-1.5">
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
									<div
										class="h-full transition-all duration-300 {getPasswordStrengthColor(passwordStrength)}"
										style="width: {(passwordStrength / 3) * 100}%"
									></div>
								</div>
								<p class="text-xs {passwordStrength >= 2 ? 'text-green-400' : 'text-yellow-400'}">
									{getPasswordStrengthText(passwordStrength)}
								</p>
							</div>
						{/if}
					</div>

					<!-- Confirmar Contraseña -->
					<div class="space-y-2">
						<label for="confirmPassword" class="text-sm font-semibold text-slate-300">Confirmar Contraseña</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
								<svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
							</div>
							<input
								id="confirmPassword"
								type={showConfirmPassword ? 'text' : 'password'}
								bind:value={confirmPassword}
								class="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 pl-12 pr-12 text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
								placeholder="••••••••"
								required
							/>
							<button
								type="button"
								onclick={() => (showConfirmPassword = !showConfirmPassword)}
								class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition-colors"
							>
								{#if showConfirmPassword}
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
									</svg>
								{:else}
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								{/if}
							</button>
						</div>
						
						<!-- Match Indicator -->
						{#if confirmPassword}
							<div class="flex items-center gap-1.5 text-xs {passwordsMatch ? 'text-green-400' : 'text-red-400'}">
								{#if passwordsMatch}
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
									Las contraseñas coinciden
								{:else}
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
									Las contraseñas no coinciden
								{/if}
							</div>
						{/if}
					</div>

					<!-- Submit Button -->
					<button
						type="submit"
						disabled={isSubmitting || !passwordsMatch || passwordStrength < 2}
						class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold text-white shadow-lg shadow-blue-500/50 transition-all hover:scale-[1.02] hover:shadow-blue-500/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
					>
						<div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-full group-hover:duration-1000"></div>
						<span class="relative flex items-center justify-center gap-2">
							{#if isSubmitting}
								<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Restableciendo...
							{:else}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								Restablecer Contraseña
							{/if}
						</span>
					</button>
				</form>

				<!-- Footer -->
				<p class="mt-8 text-center text-sm text-slate-400">
					¿Recordaste tu contraseña?
					<a href="/login" class="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
						Iniciar Sesión
					</a>
				</p>
			</div>
		</div>

		<!-- Back to Home -->
		<a
			href="/"
			class="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
			Volver al inicio
		</a>
	</div>
</div>
