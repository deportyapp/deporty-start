import type { Handle } from '@sveltejs/kit';
import { verifyAccessToken, ACCESS_COOKIE_NAME } from '$lib/server/jwt';

const securityHeaders: Record<string, string> = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
].join('; ');

export const handle: Handle = async ({ event, resolve }) => {
    const start = Date.now();

    const token = event.cookies.get(ACCESS_COOKIE_NAME);
    if (token) {
        try {
            const payload = await verifyAccessToken(token);
            event.locals.user = payload.user;
        } catch {
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    const response = await resolve(event);

    for (const [key, value] of Object.entries(securityHeaders)) {
        response.headers.set(key, value);
    }
    response.headers.set('Content-Security-Policy', csp);

    if (event.url.pathname.startsWith('/api')) {
        const duration = Date.now() - start;
        console.info(`[api] ${event.request.method} ${event.url.pathname} - ${duration}ms`);
    }

    return response;
};
