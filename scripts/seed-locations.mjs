import { neon } from '@neondatabase/serverless';
import { env } from 'process';

if (!env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const sql = neon(env.DATABASE_URL);
const isDryRun = process.argv.includes('--dry-run');

const insertCountries = `
INSERT INTO "countries" ("code", "name", "locale", "language", "timezone", "currency", "currency_symbol", "phone_code") VALUES
('CO', 'Colombia', 'es-CO', 'es', 'America/Bogota', 'COP', '$', '+57'),
('MX', 'Mexico', 'es-MX', 'es', 'America/Mexico_City', 'MXN', '$', '+52'),
('AR', 'Argentina', 'es-AR', 'es', 'America/Argentina/Buenos_Aires', 'ARS', '$', '+54'),
('BR', 'Brasil', 'pt-BR', 'pt', 'America/Sao_Paulo', 'BRL', 'R$', '+55'),
('CL', 'Chile', 'es-CL', 'es', 'America/Santiago', 'CLP', '$', '+56'),
('PE', 'Peru', 'es-PE', 'es', 'America/Lima', 'PEN', 'S/', '+51'),
('EC', 'Ecuador', 'es-EC', 'es', 'America/Guayaquil', 'USD', '$', '+593'),
('VE', 'Venezuela', 'es-VE', 'es', 'America/Caracas', 'USD', '$', '+58'),
('UY', 'Uruguay', 'es-UY', 'es', 'America/Montevideo', 'UYU', '$U', '+598'),
('PY', 'Paraguay', 'es-PY', 'es', 'America/Asuncion', 'PYG', 'G', '+595'),
('BO', 'Bolivia', 'es-BO', 'es', 'America/La_Paz', 'BOB', 'Bs', '+591'),
('PA', 'Panama', 'es-PA', 'es', 'America/Panama', 'USD', '$', '+507'),
('CR', 'Costa Rica', 'es-CR', 'es', 'America/Costa_Rica', 'CRC', 'C', '+506'),
('DO', 'Republica Dominicana', 'es-DO', 'es', 'America/Santo_Domingo', 'DOP', 'RD$', '+1-809'),
('GT', 'Guatemala', 'es-GT', 'es', 'America/Guatemala', 'GTQ', 'Q', '+502'),
('HN', 'Honduras', 'es-HN', 'es', 'America/Tegucigalpa', 'HNL', 'L', '+504'),
('SV', 'El Salvador', 'es-SV', 'es', 'America/El_Salvador', 'USD', '$', '+503'),
('NI', 'Nicaragua', 'es-NI', 'es', 'America/Managua', 'NIO', 'C$', '+505'),
('CU', 'Cuba', 'es-CU', 'es', 'America/Havana', 'CUP', '$', '+53'),
('PR', 'Puerto Rico', 'es-PR', 'es', 'America/Puerto_Rico', 'USD', '$', '+1-787')
ON CONFLICT DO NOTHING;
`;

const insertCities = `
INSERT INTO "cities" ("country_code", "name") VALUES
('CO', 'Bogota'),
('CO', 'Medellin'),
('CO', 'Cali'),
('CO', 'Barranquilla'),
('CO', 'Bucaramanga'),
('MX', 'Ciudad de Mexico'),
('MX', 'Guadalajara'),
('MX', 'Monterrey'),
('MX', 'Puebla'),
('MX', 'Tijuana'),
('AR', 'Buenos Aires'),
('AR', 'Cordoba'),
('AR', 'Rosario'),
('AR', 'Mendoza'),
('AR', 'La Plata'),
('BR', 'Sao Paulo'),
('BR', 'Rio de Janeiro'),
('BR', 'Brasilia'),
('BR', 'Salvador'),
('BR', 'Fortaleza'),
('CL', 'Santiago'),
('CL', 'Valparaiso'),
('CL', 'Concepcion'),
('CL', 'La Serena'),
('CL', 'Antofagasta'),
('PE', 'Lima'),
('PE', 'Arequipa'),
('PE', 'Trujillo'),
('PE', 'Chiclayo'),
('PE', 'Piura'),
('EC', 'Quito'),
('EC', 'Guayaquil'),
('EC', 'Cuenca'),
('EC', 'Manta'),
('EC', 'Ambato'),
('VE', 'Caracas'),
('VE', 'Maracaibo'),
('VE', 'Valencia'),
('VE', 'Barquisimeto'),
('VE', 'Maracay'),
('UY', 'Montevideo'),
('UY', 'Salto'),
('UY', 'Paysandu'),
('UY', 'Las Piedras'),
('UY', 'Rivera'),
('PY', 'Asuncion'),
('PY', 'Ciudad del Este'),
('PY', 'San Lorenzo'),
('PY', 'Luque'),
('PY', 'Encarnacion'),
('BO', 'La Paz'),
('BO', 'Santa Cruz'),
('BO', 'Cochabamba'),
('BO', 'Oruro'),
('BO', 'Sucre'),
('PA', 'Ciudad de Panama'),
('PA', 'San Miguelito'),
('PA', 'Colon'),
('PA', 'David'),
('PA', 'La Chorrera'),
('CR', 'San Jose'),
('CR', 'Alajuela'),
('CR', 'Cartago'),
('CR', 'Heredia'),
('CR', 'Puntarenas'),
('DO', 'Santo Domingo'),
('DO', 'Santiago'),
('DO', 'La Vega'),
('DO', 'San Pedro'),
('DO', 'San Cristobal'),
('GT', 'Ciudad de Guatemala'),
('GT', 'Mixco'),
('GT', 'Villa Nueva'),
('GT', 'Quetzaltenango'),
('GT', 'Escuintla'),
('HN', 'Tegucigalpa'),
('HN', 'San Pedro Sula'),
('HN', 'La Ceiba'),
('HN', 'Choloma'),
('HN', 'Comayagua'),
('SV', 'San Salvador'),
('SV', 'Santa Ana'),
('SV', 'San Miguel'),
('SV', 'Soyapango'),
('SV', 'Mejicanos'),
('NI', 'Managua'),
('NI', 'Leon'),
('NI', 'Masaya'),
('NI', 'Chinandega'),
('NI', 'Granada'),
('CU', 'La Habana'),
('CU', 'Santiago de Cuba'),
('CU', 'Camaguey'),
('CU', 'Holguin'),
('CU', 'Santa Clara'),
('PR', 'San Juan'),
('PR', 'Bayamon'),
('PR', 'Carolina'),
('PR', 'Ponce'),
('PR', 'Caguas')
ON CONFLICT DO NOTHING;
`;

function findDuplicates(items, keyFn) {
    const seen = new Set();
    const duplicates = new Set();
    for (const item of items) {
        const key = keyFn(item);
        if (seen.has(key)) duplicates.add(key);
        seen.add(key);
    }
    return Array.from(duplicates);
}

async function seed() {
    const countryRows = insertCountries.split('\n').filter((line) => line.trim().startsWith("('"));
    const cityRows = insertCities.split('\n').filter((line) => line.trim().startsWith("('"));
    const countryDupes = findDuplicates(countryRows, (line) => line.split(',')[0]);
    const cityDupes = findDuplicates(cityRows, (line) => line.split(',').slice(0, 2).join(','));

    if (countryDupes.length || cityDupes.length) {
        console.warn('Seed duplicates detected:');
        if (countryDupes.length) console.warn('Countries:', countryDupes.join(' '));
        if (cityDupes.length) console.warn('Cities:', cityDupes.join(' '));
        throw new Error('Duplicate seed data detected');
    }

    if (isDryRun) {
        console.log(`Dry run: ${countryRows.length} countries, ${cityRows.length} cities`);
        return;
    }

    await sql(insertCountries);
    await sql(insertCities);
    console.log('Seed complete: countries and cities');
}

seed().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});
