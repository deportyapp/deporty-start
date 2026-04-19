import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { normalizeToIsoDate } from '$lib/utils/dateUtils';

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const formData = await request.formData();
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const nickname = (formData.get('nickname') as string) ?? '';
		const birthDateInput = formData.get('birthDate') as string;
		const phoneInput = (formData.get('phone') as string) ?? '';
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const birthDate = normalizeToIsoDate(birthDateInput);
		const phone = phoneInput.trim();
		const e164Regex = /^\+[1-9]\d{6,14}$/;

		// Validación server-side
		if (!firstName || !lastName || !birthDateInput || !phone || !email || !password) {
			return fail(400, { error: 'missing_fields', email });
		}

		if (!e164Regex.test(phone)) {
			return fail(400, { error: 'invalid_phone', email });
		}

		if (!birthDate) {
			return fail(400, { error: 'invalid_birth_date', email });
		}

		if (password.length < 8) {
			return fail(400, { error: 'password_short', email });
		}

		// 1. Crear usuario en Supabase Auth
		// El profile se crea automáticamente via trigger en la BD
		const { data: authData, error: authError } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName,
					birth_date: birthDate,
					nickname: nickname.trim() || undefined,
					phone
				}
			}
		});

		if (authError) {
			console.error('Auth signup error:', authError.message);

			if (authError.message.includes('already registered')) {
				return fail(400, { error: 'email_exists', email });
			}
			if (authError.message.includes('valid email')) {
				return fail(400, { error: 'invalid_email', email });
			}

			return fail(500, { error: 'auth_error', email });
		}

		// 2. Verificar si el usuario ya existía
		if (authData.user && authData.user.identities?.length === 0) {
			return fail(400, { error: 'email_exists', email });
		}

		// 2.1 Crear perfil en tabla profile
		if (!authData.user?.id) {
			console.error('No user ID found after signup');
			return fail(500, { error: 'auth_error_no_id', email });
		}

		console.log('Attempting to create profile for user:', authData.user.id);

		const { error: profileError } = await locals.supabase.from('profile').upsert(
			{
				profile_id: authData.user.id,
				first_name: firstName,
				last_name: lastName,
				nickname: nickname.trim() || null,
				birth_date: birthDate,
				phone
			},
			{ onConflict: 'profile_id' }
		);

		if (profileError) {
			console.error('Profile insert error details:', {
				message: profileError.message,
				code: profileError.code,
				hint: profileError.hint,
				details: profileError.details
			});
			return fail(500, { error: 'profile_error', message: profileError.message, email });
		}

		if (authData.session) {
			throw redirect(303, '/dashboard');
		}

		console.log('Profile created successfully for:', email);

		// 3. Si necesita confirmar email (email confirmation habilitado)
		if (authData.user && !authData.session) {
			return { success: true, needsConfirmation: true };
		}

		throw redirect(303, '/login?registered=true');
	}
};
