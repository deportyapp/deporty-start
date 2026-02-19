<script lang="ts">
	import { t } from '$lib/i18n';

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
	let successMessage = $state('');

	const passwordStrength = $derived(getPasswordStrength(password));
	const strengthColor = $derived(getPasswordStrengthColor(passwordStrength));
	const strengthText = $derived(getPasswordStrengthText(passwordStrength));

	function getPasswordStrength(value: string): number {
		let score = 0;
		if (value.length >= 8) score += 1;
		if (value.length >= 12) score += 1;
		if (/[a-z]/.test(value)) score += 1;
		if (/[A-Z]/.test(value)) score += 1;
		if (/[0-9]/.test(value)) score += 1;
		if (/[^A-Za-z0-9]/.test(value)) score += 1;
		return Math.min(score, 5);
	}

	function getPasswordStrengthText(score: number): string {
		switch (score) {
			case 0:
			case 1:
				return $t('register.strengthVeryWeak');
			case 2:
				return $t('register.strengthWeak');
			case 3:
				return $t('register.strengthFair');
			case 4:
				return $t('register.strengthGood');
			case 5:
				return $t('register.strengthStrong');
			default:
				return $t('register.strengthWeak');
		}
	}

	function getPasswordStrengthColor(score: number): string {
		switch (score) {
			case 0:
			case 1:
				return 'bg-red-500/60';
			case 2:
				return 'bg-orange-500/60';
			case 3:
				return 'bg-yellow-500/60';
			case 4:
				return 'bg-lime-500/60';
			case 5:
				return 'bg-green-500/60';
			default:
				return 'bg-red-500/60';
		}
	}

	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();

		successMessage = '';
		errorMessage = '';

		if (!nombres || !apellidos || !email || !confirmEmail || !password || !confirmPassword) {
			errorMessage = $t('register.errorEmpty');
			return;
		}

		if (email !== confirmEmail) {
			errorMessage = $t('register.errorEmailMismatch');
			return;
		}

		if (password !== confirmPassword) {
			errorMessage = $t('register.errorPasswordMismatch');
			return;
		}

		if (password.length < 8) {
			errorMessage = $t('register.errorPasswordShort');
			return;
		}

		isSubmitting = true;
		await new Promise((resolve) => setTimeout(resolve, 600));
		successMessage = $t('register.successSimulated');
		isSubmitting = false;
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-12">
	<!-- Background Pattern (no captura clics) -->
	<div class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

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
					<h2 class="mb-2 text-3xl font-bold text-white">{$t('register.title')}</h2>
					<p class="text-slate-400">{$t('register.subtitle')}</p>
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
				<form onsubmit={handleRegister} class="space-y-4">
					<!-- Name Fields -->
					<div class="grid grid-cols-2 gap-3">
						<div class="space-y-2">
							<label for="firstName" class="text-sm font-semibold text-slate-300">{$t('register.firstNameLabel')}</label>
							<input
								id="firstName"
								type="text"
								bind:value={nombres}
								class="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 px-4 text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
								placeholder={$t('register.firstNamePlaceholder')}
								required
							/>
						</div>
						<div class="space-y-2">
							<label for="lastName" class="text-sm font-semibold text-slate-300">{$t('register.lastNameLabel')}</label>
							<input
								id="lastName"
								type="text"
								bind:value={apellidos}
								class="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 px-4 text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
								placeholder={$t('register.lastNamePlaceholder')}
								required
							/>
						</div>
					</div>

					<!-- Email -->
					<div class="space-y-2">
						<label for="email" class="text-sm font-semibold text-slate-300">{$t('register.emailLabel')}</label>
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
								placeholder={$t('register.emailPlaceholder')}
								required
							/>
						</div>
					</div>

					<!-- Confirm Email -->
					<div class="space-y-2">
						<label for="confirmEmail" class="text-sm font-semibold text-slate-300">{$t('register.confirmEmailLabel')}</label>
						<input
							id="confirmEmail"
							type="email"
							bind:value={confirmEmail}
							oninput={(e) => (confirmEmail = e.currentTarget.value.toLowerCase())}
							class="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 px-4 text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 {confirmEmail && email !== confirmEmail ? 'border-red-500/50' : ''}"
							placeholder={$t('register.confirmEmailPlaceholder')}
							required
						/>
						{#if confirmEmail && email !== confirmEmail}
							<p class="text-xs text-red-400">{$t('register.emailMismatch')}</p>
						{/if}
					</div>

					<!-- Password -->
					<div class="space-y-2">
						<label for="password" class="text-sm font-semibold text-slate-300">{$t('register.passwordLabel')}</label>
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
								placeholder={$t('register.passwordPlaceholder')}
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
						<label for="confirmPassword" class="text-sm font-semibold text-slate-300">{$t('register.confirmPasswordLabel')}</label>
						<div class="relative">
							<input
								id="confirmPassword"
								type={showConfirmPassword ? 'text' : 'password'}
								bind:value={confirmPassword}
								class="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 px-4 pr-12 text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 {confirmPassword && password !== confirmPassword ? 'border-red-500/50' : ''}"
								placeholder={$t('register.confirmPasswordPlaceholder')}
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
							<p class="text-xs text-red-400">{$t('register.passwordMismatch')}</p>
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
								{$t('register.submitting')}
							{:else}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
								</svg>
								{$t('register.submit')}
							{/if}
						</span>
					</button>

					<!-- Terms -->
					<p class="text-center text-xs text-slate-500">
						{$t('register.terms')}
						<a href="/" class="text-blue-400 hover:text-blue-300">{$t('register.termsOfService')}</a>
						{$t('register.and')}
						<a href="/" class="text-blue-400 hover:text-blue-300">{$t('register.privacyPolicy')}</a>
					</p>
				</form>

				<!-- Divider -->
				<div class="my-8 flex items-center gap-4">
					<div class="h-px flex-1 bg-slate-700"></div>
					<span class="text-xs uppercase text-slate-500">{$t('register.divider')}</span>
					<div class="h-px flex-1 bg-slate-700"></div>
				</div>

				<!-- Social Login -->
				<div class="flex justify-center">
					<button
						type="button"
						class="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm font-semibold text-white transition-all hover:border-slate-600 hover:bg-slate-800"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24">
							<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
							<path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
							<path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
							<path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
						</svg>
						{$t('register.google')}
					</button>
				</div>

				<!-- Footer -->
				<p class="mt-8 text-center text-sm text-slate-400">
					{$t('register.hasAccount')}
					<a href="/login" class="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
						{$t('register.login')}
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
			{$t('register.backToHome')}
		</a>
	</div>
</div>
