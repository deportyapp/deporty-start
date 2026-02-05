import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, passwordResetTokens } from '$lib/server/schema';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { token, newPassword } = await request.json();

        // Validar entrada
        if (!token || typeof token !== 'string') {
            return json({ success: false, message: 'Token inválido' }, { status: 400 });
        }

        if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
            return json({ 
                success: false, 
                message: 'La contraseña debe tener al menos 8 caracteres' 
            }, { status: 400 });
        }

        // Buscar token válido (no expirado)
        const [resetToken] = await db
            .select()
            .from(passwordResetTokens)
            .where(
                and(
                    eq(passwordResetTokens.token, token),
                    gt(passwordResetTokens.expiresAt, new Date())
                )
            )
            .limit(1);

        if (!resetToken) {
            return json({ 
                success: false, 
                message: 'Token inválido o expirado' 
            }, { status: 400 });
        }

        // Hashear nueva contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        // Actualizar contraseña del usuario
        await db
            .update(users)
            .set({ passwordHash })
            .where(eq(users.id, resetToken.userId));

        // Eliminar el token usado (y todos los tokens del usuario por seguridad)
        await db
            .delete(passwordResetTokens)
            .where(eq(passwordResetTokens.userId, resetToken.userId));

        return json({ 
            success: true, 
            message: 'Contraseña actualizada exitosamente' 
        });

    } catch (error) {
        console.error('Error en reset-password:', error);
        return json({ 
            success: false, 
            message: 'Error al restablecer la contraseña' 
        }, { status: 500 });
    }
};
