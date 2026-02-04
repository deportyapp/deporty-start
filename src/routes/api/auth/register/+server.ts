import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

export async function POST({ request }) {
    const { nombres, apellidos, email, password } = await request.json();

    // Validaciones básicas
    if (!email || !password || !nombres || !apellidos) {
        return error(400, 'Faltan campos obligatorios');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return error(400, 'Formato de email inválido');
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
        return error(400, 'La contraseña debe tener al menos 8 caracteres');
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await db.select().from(users).where(eq(users.email, email));

        if (existingUser.length > 0) {
            return error(409, 'El correo electrónico ya está registrado');
        }

        // Hash del password
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear usuario
        await db.insert(users).values({
            firstName: nombres,
            lastName: apellidos,
            email,
            passwordHash,
            role: 'user' // Rol por defecto
        });

        return json({ success: true, message: 'Usuario registrado exitosamente' });

    } catch (err) {
        console.error('Error en registro:', err);
        return error(500, 'Error interno del servidor al procesar el registro');
    }
}
