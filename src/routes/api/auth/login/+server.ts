import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
            return json({ success: false, message: 'Correo y contraseña son obligatorios' }, { status: 400 });
        }

        const emailLower = email.toLowerCase().trim();

        const [user] = await db.select().from(users).where(eq(users.email, emailLower)).limit(1);

        if (!user) {
            // Hash ficticio para prevenir timing attacks
            await bcrypt.hash(password, 10);
            return json({ success: false, message: 'Credenciales incorrectas' }, { status: 401 });
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return json({ success: false, message: 'Credenciales incorrectas' }, { status: 401 });
        }

        return json({
            success: true,
            message: 'Sesión iniciada correctamente',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (err) {
        console.error('Error en login:', err);
        return json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
    }
};
