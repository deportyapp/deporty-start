import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { nombres, apellidos, email, password } = body;

        if (
            !email || typeof email !== 'string' ||
            !password || typeof password !== 'string' ||
            !nombres || typeof nombres !== 'string' ||
            !apellidos || typeof apellidos !== 'string'
        ) {
            return json({ success: false, message: 'Faltan campos obligatorios' }, { status: 400 });
        }

        const emailLower = email.toLowerCase().trim();
        const nombresTrim = nombres.trim();
        const apellidosTrim = apellidos.trim();

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailLower)) {
            return json({ success: false, message: 'Formato de email inválido' }, { status: 400 });
        }

        // Validar longitud de contraseña
        if (password.length < 8) {
            return json({ success: false, message: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
        }

        // Validar longitud máxima para prevenir ataques DoS con bcrypt
        if (password.length > 72) {
            return json({ success: false, message: 'La contraseña no puede exceder 72 caracteres' }, { status: 400 });
        }

        // Verificar si el usuario ya existe
        const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.email, emailLower)).limit(1);

        if (existingUser) {
            return json({ success: false, message: 'El correo electrónico ya está registrado' }, { status: 409 });
        }

        // Hash del password con salt rounds de 12 para mayor seguridad
        const passwordHash = await bcrypt.hash(password, 12);

        await db.insert(users).values({
            firstName: nombresTrim,
            lastName: apellidosTrim,
            email: emailLower,
            passwordHash,
            role: 'user'
        });

        return json({ success: true, message: 'Usuario registrado exitosamente' });

    } catch (err) {
        console.error('Error en registro:', err);
        return json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
    }
};
