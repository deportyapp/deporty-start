import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, passwordResetTokens } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export const POST: RequestHandler = async ({ request, url }) => {
    try {
        const { email } = await request.json();

        // Validar email
        if (!email || typeof email !== 'string') {
            return json({ success: false, message: 'Email requerido' }, { status: 400 });
        }

        const emailLower = email.toLowerCase().trim();

        // Buscar usuario
        const [user] = await db.select().from(users).where(eq(users.email, emailLower)).limit(1);

        // Por seguridad, siempre retornamos éxito aunque el usuario no exista
        // Esto previene enumerar usuarios válidos
        if (!user) {
            return json({ 
                success: true, 
                message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.' 
            });
        }

        // Generar token seguro (32 bytes = 64 caracteres hex)
        const token = randomBytes(32).toString('hex');
        
        // Token expira en 1 hora
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        // Eliminar tokens previos del usuario para evitar acumulación
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));

        // Insertar token en la base de datos
        await db.insert(passwordResetTokens).values({
            userId: user.id,
            token,
            expiresAt,
        });

        // Construir URL de reset
        const resetUrl = `${url.origin}/reset-password/${token}`;
        
        // Intentar enviar email con Resend (solo si la API key está configurada)
        if (RESEND_API_KEY && !RESEND_API_KEY.includes('TuAPIKeyAqui')) {
            try {
                await resend.emails.send({
                    from: 'DeportyApp <noreply@resend.dev>', // Cambiar a tu dominio verificado
                    to: [emailLower],
                    subject: 'Restablecer contraseña - DeportyApp',
                    html: `
                        <!DOCTYPE html>
                        <html>
                            <head>
                                <meta charset="utf-8">
                                <style>
                                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                    .header { background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                                    .button { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                                    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                                    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <div class="header">
                                        <h1>🔐 Restablecer Contraseña</h1>
                                    </div>
                                    <div class="content">
                                        <p>Hola <strong>${user.firstName}</strong>,</p>
                                        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en DeportyApp.</p>
                                        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                                        <div style="text-align: center;">
                                            <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                                        </div>
                                        <p>O copia y pega este enlace en tu navegador:</p>
                                        <p style="background: white; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 13px;">
                                            ${resetUrl}
                                        </p>
                                        <div class="warning">
                                            <strong>⚠️ Importante:</strong> Este enlace expirará en <strong>1 hora</strong>.
                                        </div>
                                        <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje de forma segura.</p>
                                    </div>
                                    <div class="footer">
                                        <p>© ${new Date().getFullYear()} DeportyApp. Todos los derechos reservados.</p>
                                        <p style="font-size: 12px;">Este es un email automático, por favor no respondas a este mensaje.</p>
                                    </div>
                                </div>
                            </body>
                        </html>
                    `
                });
                console.log('✅ Email enviado a:', emailLower);
            } catch (emailError) {
                console.error('❌ Error enviando email:', emailError);
                // En desarrollo, mostrar el link en consola como fallback
                console.log('\n🔗 LINK DE RECUPERACIÓN (úsalo para probar):');
                console.log('📧 Para:', emailLower);
                console.log('🌐 URL:', resetUrl);
                console.log('\n');
            }
        } else {
            // API key no configurada - modo desarrollo
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔐 RECUPERACIÓN DE CONTRASEÑA - MODO DESARROLLO');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📧 Email destinatario:', emailLower);
            console.log('👤 Usuario:', user.firstName, user.lastName);
            console.log('🌐 Link de recuperación:');
            console.log('\n   ' + resetUrl + '\n');
            console.log('⏰ Expira en: 1 hora');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        }

        return json({ 
            success: true, 
            message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.'
        });

    } catch (error) {
        console.error('Error en forgot-password:', error);
        return json({ 
            success: false, 
            message: 'Error al procesar la solicitud' 
        }, { status: 500 });
    }
};
