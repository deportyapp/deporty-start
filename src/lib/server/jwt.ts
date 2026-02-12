import { SignJWT, jwtVerify } from 'jose';
import { env } from '$env/dynamic/private';

const issuer = 'deportyapp';
const accessAudience = 'deportyapp:access';
const refreshAudience = 'deportyapp:refresh';

export const ACCESS_COOKIE_NAME = 'deporty_access';
export const REFRESH_COOKIE_NAME = 'deporty_refresh';
export const ACCESS_TOKEN_TTL_SECONDS = 60 * 15;
export const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;
export const REFRESH_TOKEN_IDLE_SECONDS = 60 * 60 * 24 * 30;

function getJwtSecret() {
    if (!env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not set');
    }
    return new TextEncoder().encode(env.JWT_SECRET);
}

export type JwtUser = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    countryCode?: string | null;
    city?: string | null;
    role?: string | null;
};

export async function signAccessToken(user: JwtUser, expiresIn = '15m') {
    return new SignJWT({ user, type: 'access' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(accessAudience)
        .setExpirationTime(expiresIn)
        .sign(getJwtSecret());
}

export async function signRefreshToken(userId: string, expiresIn = '30d') {
    return new SignJWT({ userId, type: 'refresh' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(refreshAudience)
        .setExpirationTime(expiresIn)
        .sign(getJwtSecret());
}

export async function verifyAccessToken(token: string) {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
        issuer,
        audience: accessAudience,
    });
    if (payload.type !== 'access') {
        throw new Error('Invalid access token');
    }
    return payload as { user: JwtUser; type: 'access' };
}

export async function verifyRefreshToken(token: string) {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
        issuer,
        audience: refreshAudience,
    });
    if (payload.type !== 'refresh') {
        throw new Error('Invalid refresh token');
    }
    return payload as { userId: string; type: 'refresh' };
}
