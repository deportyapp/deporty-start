import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const formData = await request.formData();
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const nickname = (formData.get('nickname') as string) ?? '';
		const birthDate = formData.get('birthDate') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		// Validación server-side
		if (!firstName || !lastName || !birthDate || !email || !password) {
			return fail(400, { error: 'missing_fields', email });
		}

		if (Number.isNaN(Date.parse(birthDate))) {
			return fail(400, { error: 'invalid_birth_date', email });
		}

		if (password.length < 8) {
			return fail(400, { error: 'password_short', email });
		}

		if (nickname && !/^[a-zA-Z0-9]+$/.test(nickname)) {
			return fail(400, { error: 'invalid_nickname', email });
		}

		// 1. Crear usuario en Supabase Auth
		// El profile se crea automáticamente via trigger on_auth_user_created
		const { data: authData, error: authError } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName,
					nickname: nickname.trim() || undefined,
					birth_date: birthDate,
					profile_completed: false
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

		// 3. Registro exitoso → redirigir al login
		throw redirect(303, '/login?registered=true');
	}
};
