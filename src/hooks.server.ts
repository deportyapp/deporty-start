import { createSupabaseServerClient } from '$lib/supabaseServer';
import { createLogger } from '$lib/server/logger';
import type { Handle } from '@sveltejs/kit';

const logger = createLogger('HooksServer');

/**
 * Hook principal del servidor.
 * Se ejecuta en CADA request antes de llegar a la ruta.
 *
 * Responsabilidades:
 * 1. Crear el cliente Supabase server-side (per-request, no singleton)
 * 2. Proveer safeGetSession() para obtener sesión validada
 * 3. Adjuntar ambos a event.locals para uso en +page.server.ts, +server.ts, etc.
 * 4. Inyectar security headers optimizados
 * 5. Loguear requests importantes
 */
export const handle: Handle = async ({ event, resolve }) => {
	const startTime = Date.now();
	const method = event.request.method;
	const url = event.url;

	logger.debug(`[${method}] ${url.pathname}`);

	// 1. Crear Supabase server client para este request
	event.locals.supabase = createSupabaseServerClient(event);

	// 2. Proveer helper seguro para obtener sesión
	//    Usa getUser() que valida el JWT contra Supabase Auth,
	//    a diferencia de getSession() que solo lee cookies (spoofeable).
	event.locals.safeGetSession = async () => {
		try {
			const {
				data: { session }
			} = await event.locals.supabase.auth.getSession();

			if (!session) {
				return { session: null, user: null };
			}

			// Validar el usuario con el servidor (seguro, no spoofeable)
			const {
				data: { user },
				error
			} = await event.locals.supabase.auth.getUser();

			if (error) {
				logger.warn('Failed to get user from Supabase', { error: error.message });
				return { session: null, user: null };
			}

			return { session, user };
		} catch (e) {
			logger.error('safeGetSession failed', {
				error: e instanceof Error ? e.message : String(e)
			});
			return { session: null, user: null };
		}
	};

	// 3. Resolver la ruta e Inyectar Cabeceras de Seguridad
	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			// Supabase necesita pasar content-range para paginación
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});

	// Si SvelteKit resuelve un 404 (Not Found)
	if (response.status === 404) {
		const { user } = await event.locals.safeGetSession();
		// Si el usuario está activo, mandarlo automáticamente a su panel de control en lugar del Error 404 o el Landing Page
		if (user) {
			return new Response(null, {
				status: 303,
				headers: { location: '/dashboard' }
			});
		}
	}

	// Inyectar Security Headers requeridos
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	response.headers.set('X-XSS-Protection', '1; mode=block');
	response.headers.set(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none'"
	);
	response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');

	// Cache control para assets estáticos
	if (url.pathname.startsWith('/static/') || url.pathname.match(/\.(js|css|woff2?)$/)) {
		response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	} else if (url.pathname.startsWith('/api/')) {
		response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
	}

	return response;
};
