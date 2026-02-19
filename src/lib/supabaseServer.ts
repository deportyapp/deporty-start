import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '$env/static/public';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Crea un cliente Supabase para uso en el servidor (hooks, +page.server.ts, +server.ts).
 * Maneja cookies automáticamente para sesiones de auth.
 *
 * ⚠️  No almacenar en variables globales — debe crearse por request.
 */
export function createSupabaseServerClient(event: RequestEvent) {
    return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, {
                        ...options,
                        path: options?.path ?? '/',
                    });
                });
            },
        },
    });
}
