import { createHash } from 'crypto';
import { db } from '$lib/server/db';
import { refreshTokens, users } from '$lib/server/schema';
import { eq, and, gt, isNull } from 'drizzle-orm';
import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';
import {
    ACCESS_COOKIE_NAME,
    REFRESH_COOKIE_NAME,
    ACCESS_TOKEN_TTL_SECONDS,
    REFRESH_TOKEN_TTL_SECONDS,
    REFRESH_TOKEN_IDLE_SECONDS,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    type JwtUser,
} from '$lib/server/jwt';

function hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
}

function setAccessCookie(cookies: Cookies, token: string) {
    cookies.set(ACCESS_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: !dev,
        path: '/',
        maxAge: ACCESS_TOKEN_TTL_SECONDS,
    });
}

function setRefreshCookie(cookies: Cookies, token: string) {
    cookies.set(REFRESH_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: !dev,
        path: '/',
        maxAge: REFRESH_TOKEN_TTL_SECONDS,
    });
}

export function clearAuthCookies(cookies: Cookies) {
    cookies.set(ACCESS_COOKIE_NAME, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: !dev,
        path: '/',
        maxAge: 0,
    });
    cookies.set(REFRESH_COOKIE_NAME, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: !dev,
        path: '/',
        maxAge: 0,
    });
}

export async function issueSession(cookies: Cookies, user: JwtUser) {
    const accessToken = await signAccessToken(user);
    const refreshToken = await signRefreshToken(user.id);
    const refreshHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

    await db.insert(refreshTokens).values({
        userId: user.id,
        tokenHash: refreshHash,
        expiresAt,
        lastUsedAt: new Date(),
    });

    setAccessCookie(cookies, accessToken);
    setRefreshCookie(cookies, refreshToken);
}

export async function rotateRefreshToken(
    cookies: Cookies,
    refreshToken: string
) {
    const now = new Date();
    const idleCutoff = new Date(Date.now() - REFRESH_TOKEN_IDLE_SECONDS * 1000);

    let payload;
    try {
        payload = await verifyRefreshToken(refreshToken);
    } catch {
        clearAuthCookies(cookies);
        return null;
    }

    if (!payload?.userId) {
        clearAuthCookies(cookies);
        return null;
    }

    const refreshHash = hashToken(refreshToken);

    const [tokenRow] = await db
        .select()
        .from(refreshTokens)
        .where(
            and(
                eq(refreshTokens.tokenHash, refreshHash),
                isNull(refreshTokens.revokedAt),
                gt(refreshTokens.expiresAt, now)
            )
        )
        .limit(1);

    if (
        !tokenRow ||
        tokenRow.userId !== payload.userId ||
        (tokenRow.lastUsedAt && tokenRow.lastUsedAt < idleCutoff)
    ) {
        clearAuthCookies(cookies);
        return null;
    }

    const [user] = await db.select().from(users).where(eq(users.id, tokenRow.userId)).limit(1);
    if (!user) {
        clearAuthCookies(cookies);
        return null;
    }

    await db.transaction(async (tx) => {
        await tx
            .update(refreshTokens)
            .set({ revokedAt: now })
            .where(eq(refreshTokens.id, tokenRow.id));

        const newRefreshToken = await signRefreshToken(user.id);
        const newRefreshHash = hashToken(newRefreshToken);
        const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

        await tx.insert(refreshTokens).values({
            userId: user.id,
            tokenHash: newRefreshHash,
            expiresAt: newExpiresAt,
            lastUsedAt: now,
        });

        const safeUser: JwtUser = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            countryCode: user.countryCode ?? null,
            city: user.city ?? null,
            role: user.role ?? null,
        };

        const accessToken = await signAccessToken(safeUser);
        setAccessCookie(cookies, accessToken);
        setRefreshCookie(cookies, newRefreshToken);
    });

    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        countryCode: user.countryCode ?? null,
        city: user.city ?? null,
        role: user.role ?? null,
    } as JwtUser;
}

export async function revokeRefreshToken(refreshToken: string) {
    const refreshHash = hashToken(refreshToken);
    await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.tokenHash, refreshHash));
}
