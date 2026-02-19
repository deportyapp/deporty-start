import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { Handle } from '@sveltejs/kit';

/**
 * Hook principal del servidor.
 * Se ejecuta en CADA request antes de llegar a la ruta.
 *
 * Responsabilidades:
 * 1. Crear el cliente Supabase server-side (per-request, no singleton)
 * 2. Proveer safeGetSession() para obtener sesión validada
 * 3. Adjuntar ambos a event.locals para uso en +page.server.ts, +server.ts, etc.
 */
export const handle: Handle = async ({ event, resolve }) => {
    // 1. Crear Supabase server client para este request
    event.locals.supabase = createSupabaseServerClient(event);

    // 2. Proveer helper seguro para obtener sesión
    //    Usa getUser() que valida el JWT contra Supabase Auth,
    //    a diferencia de getSession() que solo lee cookies (spoofeable).
    event.locals.safeGetSession = async () => {
        const {
            data: { session },
        } = await event.locals.supabase.auth.getSession();

        if (!session) {
            return { session: null, user: null };
        }

        // Validar el usuario con el servidor (seguro, no spoofeable)
        const {
            data: { user },
            error,
        } = await event.locals.supabase.auth.getUser();

        if (error) {
            return { session: null, user: null };
        }

        return { session, user };
    };

    // 3. Resolver la ruta, permitiendo que Supabase serialice cookies en la respuesta
    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            // Supabase necesita pasar content-range para paginación
            return name === 'content-range' || name === 'x-supabase-api-version';
        },
    });
};
