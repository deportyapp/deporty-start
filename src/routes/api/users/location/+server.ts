import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, countries, cities } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export const PATCH: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { userId, countryCode, city } = body;

        if (!userId || typeof userId !== 'string') {
            return json({ success: false, message: 'Usuario invalido' }, { status: 400 });
        }
        if (!countryCode || typeof countryCode !== 'string') {
            return json({ success: false, message: 'Pais invalido' }, { status: 400 });
        }
        if (!city || typeof city !== 'string') {
            return json({ success: false, message: 'Ciudad invalida' }, { status: 400 });
        }

        const [country] = await db
            .select({ code: countries.code })
            .from(countries)
            .where(eq(countries.code, countryCode))
            .limit(1);

        if (!country) {
            return json({ success: false, message: 'Pais invalido' }, { status: 400 });
        }

        const [cityRow] = await db
            .select({ id: cities.id })
            .from(cities)
            .where(and(eq(cities.countryCode, countryCode), eq(cities.name, city)))
            .limit(1);

        if (!cityRow) {
            return json({ success: false, message: 'Ciudad invalida para el pais seleccionado' }, { status: 400 });
        }

        await db
            .update(users)
            .set({ countryCode, city })
            .where(eq(users.id, userId));

        return json({ success: true });
    } catch (error) {
        console.error('Error actualizando ubicacion:', error);
        return json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
    }
};
