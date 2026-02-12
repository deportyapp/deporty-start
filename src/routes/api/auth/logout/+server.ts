import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { REFRESH_COOKIE_NAME } from '$lib/server/jwt';
import { clearAuthCookies, revokeRefreshToken } from '$lib/server/session';

export const POST: RequestHandler = async ({ cookies }) => {
    const refreshToken = cookies.get(REFRESH_COOKIE_NAME);
    if (refreshToken) {
        await revokeRefreshToken(refreshToken);
    }
    clearAuthCookies(cookies);
    return json({ success: true });
};
