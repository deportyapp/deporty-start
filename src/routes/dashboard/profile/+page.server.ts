import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		return { profile: null };
	}

	const { data: profile } = await locals.supabase
		.from('profile')
		.select('*')
		.eq('profile_id', user.id)
		.single();

	return {
		profile
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user)
			return fail(401, {
				error: 'unauthorized',
				firstName: '',
				lastName: '',
				nickname: '',
				birthDate: ''
			});

		const formData = await request.formData();
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const nickname = (formData.get('nickname') as string)?.trim() || null;
		const birthDate = formData.get('birthDate') as string;
		const avatarFile = formData.get('avatar') as File | null;

		if (!firstName || !lastName || !birthDate) {
			return fail(400, {
				error: 'missing_fields',
				firstName: firstName ?? '',
				lastName: lastName ?? '',
				nickname: nickname ?? '',
				birthDate: birthDate ?? ''
			});
		}

		if (nickname && !/^[a-zA-Z0-9]+$/.test(nickname)) {
			return fail(400, {
				error: 'invalid_nickname',
				firstName,
				lastName,
				nickname,
				birthDate
			});
		}

		// 1. Manejar subida de Avatar si existe
		let avatarUrl: string | undefined = undefined;

		if (avatarFile && avatarFile.size > 0 && avatarFile.name) {
			const fileExt = avatarFile.name.split('.').pop() || 'webp';
			const filePath = `${user.id}/avatar.${fileExt}`;

			// Limpiar cualquier imagen anterior que tenga otra extensión (png, jpg, jpeg)
			// para no acumular basura si el usuario sube diferentes formatos.
			const possibleOldFiles = ['avatar.png', 'avatar.jpg', 'avatar.jpeg', 'avatar.webp']
				.filter(name => name !== `avatar.${fileExt}`)
				.map(name => `${user.id}/${name}`);

			await locals.supabase.storage.from('avatars').remove(possibleOldFiles);

			const { error: uploadError } = await locals.supabase.storage
				.from('avatars')
				.upload(filePath, avatarFile, { upsert: true, contentType: avatarFile.type });

			if (uploadError) {
				console.error('Avatar upload error:', uploadError);
				// Let's fail gracefully and not block the rest if we don't want to,
				// or we can fail the request. Let's log it but continue or fail?
				// User expects profile to be updated. It's better to continue with old avatar and log.
			} else {
				const { data: publicUrlData } = locals.supabase.storage
					.from('avatars')
					.getPublicUrl(filePath);

				// Agregamos un timestamp para forzar que el cliente refresque la cache de la img
				avatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
			}
		}

		// 2. Update user_metadata in Supabase Auth to keep session in sync
		const authUpdateData: any = {
			first_name: firstName,
			last_name: lastName,
			nickname,
			profile_completed: true // Marcar como completo al guardar el perfil
		};
		if (avatarUrl) {
			authUpdateData.avatar_url = avatarUrl;
		}

		const { error: authError } = await locals.supabase.auth.updateUser({
			data: authUpdateData
		});

		if (authError) {
			console.error('Auth metadata update error:', authError);
			// We continue even if this fails, to not block the main profile update,
			// but in an ideal scenario this should be an all-or-nothing transaction.
		}

		// 3. Delete from DB Profile
		const dbUpdateData: any = {
			first_name: firstName,
			last_name: lastName,
			nickname,
			birth_date: birthDate,
			updated_at: new Date().toISOString()
		};
		if (avatarUrl) {
			dbUpdateData.avatar_url = avatarUrl;
		}

		const { error: profileError } = await locals.supabase
			.from('profile')
			.update(dbUpdateData)
			.eq('profile_id', user.id);

		if (profileError) {
			console.error('Profile update error:', profileError);
			return fail(500, {
				error: 'update_error',
				firstName,
				lastName,
				nickname: nickname ?? '',
				birthDate
			});
		}

		redirect(303, '/dashboard');
	}
};
