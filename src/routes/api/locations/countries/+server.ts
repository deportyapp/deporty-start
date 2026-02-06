import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { countries } from '$lib/server/schema';

export function GET() {
    return db
        .select({
            code: countries.code,
            name: countries.name,
        })
        .from(countries)
        .orderBy(countries.name)
        .then((result) => json({ countries: result }));
}
