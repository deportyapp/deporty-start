import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { REFRESH_COOKIE_NAME } from '$lib/server/jwt';
import { rotateRefreshToken, clearAuthCookies } from '$lib/server/session';

export const POST: RequestHandler = async ({ cookies }) => {
    const refreshToken = cookies.get(REFRESH_COOKIE_NAME);
    if (!refreshToken) {
        clearAuthCookies(cookies);
        return json({ user: null }, { status: 401 });
    }

    const user = await rotateRefreshToken(cookies, refreshToken);
    if (!user) {
        return json({ user: null }, { status: 401 });
    }

    return json({ user });
};
