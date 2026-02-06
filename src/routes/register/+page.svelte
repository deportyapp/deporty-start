<script lang="ts">
	import { authStore } from '$lib/authStore';
	import { goto } from '$app/navigation';
	import { setUserCountry } from '$lib/stores/locale';
	import { setUserCity, clearLocation } from '$lib/stores/location';
	import { 
		validateEmail, 
		validatePasswordStrength, 
		getPasswordStrengthText, 
		getPasswordStrengthColor 
	} from '$lib/validation';

	// Form State
	let nombres = $state('');
	let apellidos = $state('');
	let email = $state('');
	let confirmEmail = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	
	// Password Strength
	let passwordStrength = $derived(validatePasswordStrength(password));
	let strengthColor = $derived(getPasswordStrengthColor(passwordStrength));
	let strengthText = $derived(getPasswordStrengthText(passwordStrength));

	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();
		
		if (email !== confirmEmail) {
			errorMessage = 'Los correos no coinciden';
			return;
		}
		
		if (password !== confirmPassword) {
			errorMessage = 'Las contraseñas no coinciden';
			return;
		}
		
		if (password.length < 8) {
			errorMessage = 'La contraseña debe tener al menos 8 caracteres';
			return;
		}

		isSubmitting = true;
		errorMessage = '';

		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nombres,
					apellidos,
					email,
					password
				})
			});

			const data = await res.json();

			if (res.ok) {
				// Login automático después del registro
				const loginRes = await fetch('/api/auth/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password })
				});
				
				const loginData = await loginRes.json();
				if (loginRes.ok) {
					authStore.set(loginData.user);
					const hasCity = Boolean(loginData.user?.city);
					if (loginData.user?.countryCode) {
						setUserCountry(loginData.user.countryCode);
					}
					if (loginData.user?.city) {
						setUserCity(loginData.user.city);
					} else {
						clearLocation();
					}
					goto(hasCity ? '/' : '/onboarding');
				}
			} else {
				errorMessage = data.message || 'Error al crear la cuenta';
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
					<h2 class="mb-2 text-3xl font-bold text-white">
						Crear una cuenta
					</h2>
					<p class="text-slate-400">Únete a Deporty hoy</p>
				</div>

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
				<form onsubmit={handleRegister} class="space-y-4">
					<!-- Name Fields -->
					<div class="grid grid-cols-2 gap-3">
						<div class="space-y-2">
							<label for="firstName" class="text-sm font-semibold text-slate-300">Nombre</label>
							<input
								id="firstName"
								type="text"
								bind:value={nombres}
								class="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 px-4 text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
								placeholder="Juan"
								required
							/>
						</div>
						<div class="space-y-2">
							<label for="lastName" class="text-sm font-semibold text-slate-300">Apellido</label>
							<input
								id="lastName"
								type="text"
								bind:value={apellidos}
								class="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 px-4 text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
								placeholder="Pérez"
								required
							/>
						</div>
					</div>

					<!-- Email -->
					<div class="space-y-2">
						<label for="email" class="text-sm font-semibold text-slate-300">Email</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
								<svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
								</svg>
							</div>
							<input
								id="email"
								type="email"
								bind:value={email}
								oninput={(e) => (email = e.currentTarget.value.toLowerCase())}
								class="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
							placeholder="tunombre@email.com"
								required
							/>
						</div>
					</div>

					<!-- Confirm Email -->
					<div class="space-y-2">
						<label for="confirmEmail" class="text-sm font-semibold text-slate-300">Confirmar Email</label>
						<input
							id="confirmEmail"
							type="email"
							bind:value={confirmEmail}
							oninput={(e) => (confirmEmail = e.currentTarget.value.toLowerCase())}
							class="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 px-4 text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 {confirmEmail && email !== confirmEmail ? 'border-red-500/50' : ''}"
					placeholder="tunombre@email.com"
							required
						/>
						{#if confirmEmail && email !== confirmEmail}
							<p class="text-xs text-red-400">Los correos no coinciden</p>
						{/if}
					</div>

					<!-- Password -->
					<div class="space-y-2">
						<label for="password" class="text-sm font-semibold text-slate-300">Contraseña</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
								<svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<input
								id="password"
								type={showPassword ? 'text' : 'password'}
								bind:value={password}
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
						{#if password}
							<div class="flex items-center gap-2">
								<div class="h-1 flex-1 rounded-full bg-slate-700">
									<div class="h-1 rounded-full transition-all {strengthColor}" style="width: {(passwordStrength / 5) * 100}%"></div>
								</div>
								<span class="text-xs text-slate-400">{strengthText}</span>
							</div>
						{/if}
					</div>

					<!-- Confirm Password -->
					<div class="space-y-2">
						<label for="confirmPassword" class="text-sm font-semibold text-slate-300">Confirmar Contraseña</label>
						<div class="relative">
							<input
								id="confirmPassword"
								type={showConfirmPassword ? 'text' : 'password'}
								bind:value={confirmPassword}
								class="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 px-4 pr-12 text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 {confirmPassword && password !== confirmPassword ? 'border-red-500/50' : ''}"
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
						{#if confirmPassword && password !== confirmPassword}
							<p class="text-xs text-red-400">Las contraseñas no coinciden</p>
						{/if}
					</div>

					<!-- Submit Button -->
					<button
						type="submit"
						disabled={isSubmitting}
						class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold text-white shadow-lg shadow-blue-500/50 transition-all hover:scale-[1.02] hover:shadow-blue-500/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
					>
						<div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-full group-hover:duration-1000"></div>
						<span class="relative flex items-center justify-center gap-2">
							{#if isSubmitting}
								<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Creando cuenta...
							{:else}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
								</svg>
								Crear Cuenta
							{/if}
						</span>
					</button>

					<!-- Terms -->
					<p class="text-center text-xs text-slate-500">
						Al crear una cuenta, aceptas nuestros
						<a href="/terms" class="text-blue-400 hover:text-blue-300">Términos de Servicio</a>
						y
						<a href="/privacy" class="text-blue-400 hover:text-blue-300">Política de Privacidad</a>
					</p>
				</form>

				<!-- Divider -->
				<div class="my-8 flex items-center gap-4">
					<div class="h-px flex-1 bg-slate-700"></div>
					<span class="text-xs uppercase text-slate-500">or continue with</span>
					<div class="h-px flex-1 bg-slate-700"></div>
				</div>

				<!-- Social Login -->
				<div class="grid grid-cols-2 gap-3">
					<button
						type="button"
						class="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm font-semibold text-white transition-all hover:border-slate-600 hover:bg-slate-800"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24">
							<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
							<path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
							<path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
							<path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
						</svg>
						Google
					</button>
					<button
						type="button"
						class="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm font-semibold text-white transition-all hover:border-slate-600 hover:bg-slate-800"
					>
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
						</svg>
						Apple
					</button>
				</div>

				<!-- Footer -->
				<p class="mt-8 text-center text-sm text-slate-400">
					¿Ya tienes cuenta?
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
