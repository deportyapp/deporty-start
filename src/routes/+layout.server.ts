import type { LayoutServerLoad } from './$types';

/**
 * Layout server load: se ejecuta en CADA ruta.
 * Pasa la sesión y usuario validados al layout del cliente.
 */
export const load: LayoutServerLoad = async ({ locals }) => {
    const { session, user } = await locals.safeGetSession();

    return {
        session,
        user,
    };
};
