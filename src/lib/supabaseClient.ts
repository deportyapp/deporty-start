import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

/**
 * Crea un cliente Supabase para uso en el browser (componentes client-side).
 * Maneja cookies automáticamente para sesiones de auth.
 *
 * Usa createBrowserClient de @supabase/ssr para compatibilidad con SSR.
 */
export function createSupabaseBrowserClient() {
    return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}