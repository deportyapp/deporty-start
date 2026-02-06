/**
 * Ciudades principales por pais (lista corta para onboarding inicial).
 * Luego puede migrarse a base de datos.
 */
export const citiesByCountry: Record<string, string[]> = {
    CO: ['Bogota', 'Medellin', 'Cali', 'Barranquilla', 'Bucaramanga'],
    MX: ['Ciudad de Mexico', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
    AR: ['Buenos Aires', 'Cordoba', 'Rosario', 'Mendoza', 'La Plata'],
    BR: ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador', 'Fortaleza'],
    CL: ['Santiago', 'Valparaiso', 'Concepcion', 'La Serena', 'Antofagasta'],
    PE: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura'],
    EC: ['Quito', 'Guayaquil', 'Cuenca', 'Manta', 'Ambato'],
    VE: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay'],
    UY: ['Montevideo', 'Salto', 'Paysandu', 'Las Piedras', 'Rivera'],
    PY: ['Asuncion', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Encarnacion'],
    BO: ['La Paz', 'Santa Cruz', 'Cochabamba', 'Oruro', 'Sucre'],
    PA: ['Ciudad de Panama', 'San Miguelito', 'Colon', 'David', 'La Chorrera'],
    CR: ['San Jose', 'Alajuela', 'Cartago', 'Heredia', 'Puntarenas'],
    DO: ['Santo Domingo', 'Santiago', 'La Vega', 'San Pedro', 'San Cristobal'],
    GT: ['Ciudad de Guatemala', 'Mixco', 'Villa Nueva', 'Quetzaltenango', 'Escuintla'],
    HN: ['Tegucigalpa', 'San Pedro Sula', 'La Ceiba', 'Choloma', 'Comayagua'],
    SV: ['San Salvador', 'Santa Ana', 'San Miguel', 'Soyapango', 'Mejicanos'],
    NI: ['Managua', 'Leon', 'Masaya', 'Chinandega', 'Granada'],
    CU: ['La Habana', 'Santiago de Cuba', 'Camaguey', 'Holguin', 'Santa Clara'],
    PR: ['San Juan', 'Bayamon', 'Carolina', 'Ponce', 'Caguas'],
};

export function getCitiesByCountry(countryCode: string): string[] {
    return citiesByCountry[countryCode] ?? [];
}
