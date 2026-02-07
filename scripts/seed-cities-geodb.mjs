import { neon } from '@neondatabase/serverless';
import { env } from 'process';

const apiKey = env.RAPIDAPI_KEY;
const apiHost = env.RAPIDAPI_HOST || 'wft-geo-db.p.rapidapi.com';
const isDryRun = process.argv.includes('--dry-run');

if (!env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}
if (!apiKey) {
    console.error('RAPIDAPI_KEY is not set');
    process.exit(1);
}

const sql = neon(env.DATABASE_URL);
const baseUrl = `https://${apiHost}/v1/geo`;
const limit = 100;

async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getCountries() {
    const rows = await sql("select code from countries order by code");
    return rows.map((row) => row.code);
}

async function fetchCities(countryCode, offset) {
    const url = `${baseUrl}/countries/${countryCode}/cities?limit=${limit}&offset=${offset}&sort=-population`;
    const res = await fetch(url, {
        headers: {
            'x-rapidapi-host': apiHost,
            'x-rapidapi-key': apiKey,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GeoDB error ${res.status} for ${countryCode}: ${text}`);
    }

    return res.json();
}

async function insertCity(countryCode, name) {
    await sql`insert into cities (country_code, name)
        values (${countryCode}, ${name})
        on conflict do nothing`;
}

async function seedCountry(countryCode) {
    let offset = 0;
    let total = 0;
    let hasMore = true;

    while (hasMore) {
        const data = await fetchCities(countryCode, offset);
        const cities = data?.data ?? [];

        if (cities.length === 0) {
            hasMore = false;
            break;
        }

        if (isDryRun) {
            total += cities.length;
        } else {
            for (const city of cities) {
                const name = String(city.name || '').trim();
                if (!name) continue;
                await insertCity(countryCode, name);
                total += 1;
            }
        }

        offset += limit;
        hasMore = data?.metadata?.totalCount ? offset < data.metadata.totalCount : cities.length === limit;

        // Be gentle with rate limits
        await delay(250);
    }

    return total;
}

async function seedAll() {
    const countries = await getCountries();
    let grandTotal = 0;

    for (const code of countries) {
        try {
            const count = await seedCountry(code);
            grandTotal += count;
            console.log(`${code}: ${count} cities`);
        } catch (error) {
            console.error(`Failed for ${code}:`, error.message || error);
        }
    }

    if (isDryRun) {
        console.log(`Dry run complete: ${grandTotal} cities`);
    } else {
        console.log(`Seed complete: ${grandTotal} cities`);
    }
}

seedAll().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});
