import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    register: async ({ request, locals }) => {
        const formData = await request.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const nickname = (formData.get('nickname') as string) ?? '';
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Validación server-side
        if (!firstName || !lastName || !email || !password) {
            return fail(400, { error: 'missing_fields', email });
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
                    nickname: nickname.trim() || undefined,
                },
            },
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

        // 3. Si necesita confirmar email (email confirmation habilitado)
        if (authData.user && !authData.session) {
            return { success: true, needsConfirmation: true };
        }

        // Si hay sesión directa, redirect al dashboard
        redirect(303, '/dashboard');
    },
};
