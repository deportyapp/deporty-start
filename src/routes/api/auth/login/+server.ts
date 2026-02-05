import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

export async function POST({ request }) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return error(400, 'Correo y contraseña son obligatorios');
        }

        // 1. Buscar usuario por email
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user) {
            return error(401, 'Credenciales incorrectas');
        }

        // 2. Verificar contraseña
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return error(401, 'Credenciales incorrectas');
        }

        // 3. Retornar información del usuario
        // Nota: En producción, implementar sesiones JWT/cookies seguras
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
        return error(500, 'Error interno del servidor al procesar el inicio de sesión');
    }
}
