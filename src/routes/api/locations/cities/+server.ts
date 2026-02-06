import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { cities } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export function GET({ url }: { url: URL }) {
    const country = url.searchParams.get('country') ?? '';
    if (!country) {
        return json({ country, cities: [] });
    }

    return db
        .select({ name: cities.name })
        .from(cities)
        .where(eq(cities.countryCode, country))
        .orderBy(cities.name)
        .then((result) => json({
            country,
            cities: result.map((row) => row.name)
        }));
}
