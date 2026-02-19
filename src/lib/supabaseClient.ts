import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '$env/static/public';

/**
 * Crea un cliente Supabase para uso en el browser (componentes client-side).
 * Maneja cookies automáticamente para sesiones de auth.
 */
export function createSupabaseBrowserClient() {
    return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY);
}
