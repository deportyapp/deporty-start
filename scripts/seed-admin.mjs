import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import { env } from 'process';

const databaseUrl = env.DATABASE_URL;
const adminEmail = env.ADMIN_EMAIL;
const adminPassword = env.ADMIN_PASSWORD;
const adminFirstName = env.ADMIN_FIRST_NAME || 'Admin';
const adminLastName = env.ADMIN_LAST_NAME || 'Deporty';

if (!databaseUrl) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}
if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL or ADMIN_PASSWORD is not set');
    process.exit(1);
}
if (adminPassword.length < 8 || adminPassword.length > 72) {
    console.error('ADMIN_PASSWORD must be between 8 and 72 characters');
    process.exit(1);
}

const sql = neon(databaseUrl);

async function seedAdmin() {
    const emailLower = adminEmail.toLowerCase().trim();
    const existing = await sql('select id from users where email = $1 limit 1', [emailLower]);
    if (existing.length > 0) {
        console.log('Admin user already exists');
        return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await sql(
        'insert into users (first_name, last_name, email, password_hash, role) values ($1, $2, $3, $4, $5)',
        [adminFirstName.trim(), adminLastName.trim(), emailLower, passwordHash, 'admin']
    );

    console.log('Admin user created');
}

seedAdmin().catch((error) => {
    console.error('Admin seed failed:', error);
    process.exit(1);
});
