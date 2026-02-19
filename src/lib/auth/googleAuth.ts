import { createSupabaseBrowserClient } from '$lib/supabaseClient';

export async function signInWithGoogle(redirectPath = '/auth/callback') {
	const supabase = createSupabaseBrowserClient();
	const redirectTo = new URL(redirectPath, window.location.origin).toString();
	const { error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo
		}
	});

	if (error) {
		return 'No pudimos conectar con Google.';
	}

	return null;
}
