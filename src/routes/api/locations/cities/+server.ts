import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { cities } from '$lib/server/schema';
import { eq, and, sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

type CacheEntry = { data: string[]; expiresAt: number };
type RateEntry = { count: number; resetAt: number };

const cache = new Map<string, CacheEntry>();
const rateMap = new Map<string, RateEntry>();

const CACHE_TTL_MS = 60_000;
const MAX_OFFSET = 5000;
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;

const redisUrl = env.UPSTASH_REDIS_REST_URL || '';
const redisToken = env.UPSTASH_REDIS_REST_TOKEN || '';
const redisEnabled = Boolean(redisUrl && redisToken);

async function redisGet(key: string) {
    const res = await fetch(`${redisUrl}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${redisToken}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.result ?? null;
}

async function redisSetEx(key: string, ttlSeconds: number, value: string) {
    const res = await fetch(`${redisUrl}/setex/${encodeURIComponent(key)}/${ttlSeconds}/${encodeURIComponent(value)}`, {
        headers: { Authorization: `Bearer ${redisToken}` }
    });
    return res.ok;
}

async function redisIncr(key: string) {
    const res = await fetch(`${redisUrl}/incr/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${redisToken}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Number(data?.result ?? 0);
}

async function redisExpire(key: string, ttlSeconds: number) {
    await fetch(`${redisUrl}/expire/${encodeURIComponent(key)}/${ttlSeconds}`, {
        headers: { Authorization: `Bearer ${redisToken}` }
    });
}

async function getCachedCities(cacheKey: string) {
    if (redisEnabled) {
        const value = await redisGet(cacheKey);
        if (value) {
            try {
                return JSON.parse(value);
            } catch {
                return null;
            }
        }
    }

    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.data;
    }
    return null;
}

async function setCachedCities(cacheKey: string, data: string[]) {
    cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
    if (redisEnabled) {
        await redisSetEx(cacheKey, Math.floor(CACHE_TTL_MS / 1000), JSON.stringify(data));
    }
}

async function isRateLimited(ip: string) {
    if (redisEnabled) {
        const key = `rl:cities:${ip}`;
        const count = await redisIncr(key);
        if (count === 1) {
            await redisExpire(key, Math.floor(RATE_WINDOW_MS / 1000));
        }
        return count !== null && count > RATE_LIMIT;
    }

    const now = Date.now();
    const entry = rateMap.get(ip);
    if (!entry || entry.resetAt <= now) {
        rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return false;
    }
    entry.count += 1;
    return entry.count > RATE_LIMIT;
}

function getClientIp(request: Request, getClientAddress?: () => string) {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    const realIp = request.headers.get('x-real-ip');
    if (realIp) return realIp.trim();
    return getClientAddress ? getClientAddress() : 'unknown';
}

export async function GET({ url, request, getClientAddress }: { url: URL; request: Request; getClientAddress?: () => string }) {
    const country = url.searchParams.get('country') ?? '';
    const query = (url.searchParams.get('q') ?? '').trim();
    const limitParam = Number(url.searchParams.get('limit') ?? '50');
    const offsetParam = Number(url.searchParams.get('offset') ?? '0');
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 50;
    const offset = Number.isFinite(offsetParam) ? Math.min(Math.max(offsetParam, 0), MAX_OFFSET) : 0;
    if (!country) {
        return json({ country, cities: [] });
    }
    if (query.length === 1) {
        return json({ country, cities: [] });
    }

    const ip = getClientIp(request, getClientAddress);
    if (await isRateLimited(ip)) {
        return json({ country, cities: [], message: 'Rate limit exceeded' }, { status: 429 });
    }

    const cacheKey = `${country}|${query}|${limit}|${offset}`;
    const cachedData = await getCachedCities(cacheKey);
    if (cachedData) {
        return json({ country, cities: cachedData });
    }

    const whereClause = query.length >= 2
        ? and(eq(cities.countryCode, country), sql`lower(${cities.name}) like ${query.toLowerCase() + '%'} `)
        : eq(cities.countryCode, country);

    const result = await db
        .select({ name: cities.name })
        .from(cities)
        .where(whereClause)
        .orderBy(cities.name)
        .limit(limit)
        .offset(offset);

    const cityNames = result.map((row) => row.name);
    await setCachedCities(cacheKey, cityNames);

    return json({
        country,
        cities: cityNames
    });
}
