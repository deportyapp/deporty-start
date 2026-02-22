<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/i18n';

	let { data, form } = $props();
	let isSubmitting = $state(false);
	let avatarPreview: string | null = $state(null);
	let optimizedAvatarBlob: Blob | null = $state(null);

	async function handleAvatarChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) {
			clearPreview();
			return;
		}

		// Mostrar preview inmediato si se desea o esperar al WebP
		if (avatarPreview) URL.revokeObjectURL(avatarPreview);
		avatarPreview = URL.createObjectURL(file);

		// Optimización WebP
		optimizedAvatarBlob = await optimizeImage(file, 500, 0.8);
	}

	function clearPreview() {
		if (avatarPreview) URL.revokeObjectURL(avatarPreview);
		avatarPreview = null;
		optimizedAvatarBlob = null;
	}

	function optimizeImage(file: File, maxSize: number, quality: number): Promise<Blob> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					// Calcular nuevas dimensiones
					let width = img.width;
					let height = img.height;

					if (width > height) {
						if (width > maxSize) {
							height = Math.round((height * maxSize) / width);
							width = maxSize;
						}
					} else {
						if (height > maxSize) {
							width = Math.round((width * maxSize) / height);
							height = maxSize;
						}
					}

					const canvas = document.createElement('canvas');
					canvas.width = width;
					canvas.height = height;

					const ctx = canvas.getContext('2d');
					if (!ctx) {
						reject(new Error('Canvas context no disponible'));
						return;
					}

					ctx.drawImage(img, 0, 0, width, height);

					// Convertir a WebP
					canvas.toBlob(
						(blob) => {
							if (blob) {
								resolve(blob);
							} else {
								reject(new Error('Fallo al comprimir la imagen'));
							}
						},
						'image/webp',
						quality
					);
				};
				img.onerror = () => reject(new Error('No se pudo cargar la imagen para optimizar'));
				img.src = e.target?.result as string;
			};
			reader.onerror = () => reject(new Error('Fallo al leer el archivo original'));
			reader.readAsDataURL(file);
		});
	}

	$effect(() => {
		return () => {
			if (avatarPreview) URL.revokeObjectURL(avatarPreview);
		};
	});
</script>

<div class="mx-auto w-full max-w-2xl">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-900">{$t('profile.title')}</h1>
		<p class="mt-1 text-gray-500">{$t('profile.subtitle')}</p>
	</div>

	<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-500/5 sm:p-10">
		<form
			method="POST"
			enctype="multipart/form-data"
			use:enhance={({ formData }) => {
				// Inject the optimized WebP file instead of the original one if available
				if (optimizedAvatarBlob) {
					formData.set('avatar', optimizedAvatarBlob, 'avatar.webp');
				}

				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-6"
		>
			<!-- Error Message -->
			{#if form?.error}
				<div class="rounded-lg bg-red-50 p-4 text-sm text-red-600">
					{#if form.error === 'invalid_nickname'}
						{$t('auth.error.invalid_nickname')}
					{:else}
						{$t('profile.error')}
					{/if}
				</div>
			{/if}

			<!-- Avatar -->
			<div class="flex items-center gap-4">
				<div class="group relative inline-block shrink-0">
					<div
						class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl font-bold text-white shadow-lg"
					>
						{#if avatarPreview}
							<img src={avatarPreview} alt="Avatar preview" class="h-full w-full object-cover" />
						{:else if data.profile?.avatar_url}
							<img
								src={data.profile.avatar_url}
								alt="Current avatar"
								class="h-full w-full object-cover"
							/>
						{:else}
							{data.profile?.first_name?.[0] ?? '?'}{data.profile?.last_name?.[0] ?? ''}
						{/if}
					</div>
					<label
						for="avatar-input"
						class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
					>
						{$t('profile.changePhoto') || 'Foto'}
					</label>
					<input
						type="file"
						id="avatar-input"
						name="avatar"
						accept="image/*"
						class="sr-only"
						onchange={handleAvatarChange}
					/>
				</div>
				<div>
					<p class="text-lg font-semibold text-gray-900">
						{data.profile?.first_name ?? ''}
						{data.profile?.last_name ?? ''}
					</p>
					{#if data.profile?.nickname}
						<p class="text-sm text-blue-600">@{data.profile.nickname}</p>
					{/if}
				</div>
			</div>

			<hr class="border-gray-100" />

			<!-- Email (read-only) -->
			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
					{$t('profile.emailLabel')}
				</label>
				<input
					type="email"
					id="email"
					value={data.user?.email ?? ''}
					disabled
					class="block w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
				/>
				<p class="mt-1 text-xs text-gray-400">{$t('profile.emailHint')}</p>
			</div>

			<!-- First Name & Last Name -->
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="firstName" class="mb-2 block text-sm font-medium text-gray-700">
						{$t('register.firstNameLabel')}
					</label>
					<input
						type="text"
						id="firstName"
						name="firstName"
						value={form?.firstName ?? data.profile?.first_name ?? ''}
						required
						placeholder={$t('register.firstNamePlaceholder')}
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
					/>
				</div>
				<div>
					<label for="lastName" class="mb-2 block text-sm font-medium text-gray-700">
						{$t('register.lastNameLabel')}
					</label>
					<input
						type="text"
						id="lastName"
						name="lastName"
						value={form?.lastName ?? data.profile?.last_name ?? ''}
						required
						placeholder={$t('register.lastNamePlaceholder')}
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
					/>
				</div>
			</div>

			<!-- Nickname -->
			<div>
				<label for="nickname" class="mb-2 block text-sm font-medium text-gray-700">
					{$t('register.nicknameLabel')}
				</label>
				<input
					type="text"
					id="nickname"
					name="nickname"
					value={form?.nickname ?? data.profile?.nickname ?? ''}
					placeholder={$t('register.nicknamePlaceholder')}
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
				/>
				<p class="mt-1 text-xs text-gray-400">{$t('register.nicknameHint')}</p>
			</div>

			<!-- Birth Date -->
			<div>
				<label for="birthDate" class="mb-2 block text-sm font-medium text-gray-700">
					{$t('register.birthDateLabel')}
				</label>
				<input
					type="date"
					id="birthDate"
					name="birthDate"
					value={form?.birthDate ?? data.profile?.birth_date ?? ''}
					required
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
				/>
			</div>

			<!-- Submit -->
			<button
				type="submit"
				disabled={isSubmitting}
				class="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
			>
				{isSubmitting ? $t('profile.saving') : $t('profile.save')}
			</button>
		</form>
	</div>
</div>
