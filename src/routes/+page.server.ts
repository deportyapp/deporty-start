import type { PageServerLoad } from './$types';

/**
 * Carga de datos para la landing page.
 * Usa el cliente Supabase server-side desde event.locals (configurado en hooks.server.ts).
 */
export const load: PageServerLoad = async ({ locals }) => {
    const { data, error } = await locals.supabase.from('countries').select();

    if (error) {
        console.error('Error trayendo países:', error.message);
    }

    return {
        countries: data ?? [],
    };
};
