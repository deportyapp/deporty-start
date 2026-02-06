import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { cities } from '$lib/server/schema';
import { eq, ilike, and } from 'drizzle-orm';

export function GET({ url }: { url: URL }) {
    const country = url.searchParams.get('country') ?? '';
    const query = (url.searchParams.get('q') ?? '').trim();
    const limitParam = Number(url.searchParams.get('limit') ?? '50');
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 50;
    if (!country) {
        return json({ country, cities: [] });
    }

    const whereClause = query.length >= 2
        ? and(eq(cities.countryCode, country), ilike(cities.name, `${query}%`))
        : eq(cities.countryCode, country);

    return db
        .select({ name: cities.name })
        .from(cities)
        .where(whereClause)
        .orderBy(cities.name)
        .limit(limit)
        .then((result) => json({
            country,
            cities: result.map((row) => row.name)
        }));
}
