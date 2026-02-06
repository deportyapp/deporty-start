/**
 * Configuración de países latinoamericanos soportados por Deporty.
 * 
 * Cada país tiene su propia configuración de:
 * - Idioma y variante regional
 * - Zona horaria principal
 * - Formato de moneda
 * - Formato de fecha
 * - Deportes populares (para ordenar UI)
 */

export interface CountryConfig {
    /** Código ISO 3166-1 alpha-2 */
    code: string;
    /** Nombre del país en su idioma local */
    name: string;
    /** Bandera emoji */
    flag: string;
    /** Código de idioma BCP 47 (ej: es-CO, pt-BR) */
    locale: string;
    /** Idioma base: 'es' o 'pt' */
    language: 'es' | 'pt';
    /** Zona horaria IANA principal */
    timezone: string;
    /** Código de moneda ISO 4217 */
    currency: string;
    /** Símbolo de moneda */
    currencySymbol: string;
    /** Deportes populares ordenados por relevancia */
    popularSports: string[];
    /** Código de llamada telefónica */
    phoneCode: string;
}

export const countries: Record<string, CountryConfig> = {
    CO: {
        code: 'CO',
        name: 'Colombia',
        flag: '🇨🇴',
        locale: 'es-CO',
        language: 'es',
        timezone: 'America/Bogota',
        currency: 'COP',
        currencySymbol: '$',
        popularSports: ['futbol', 'futsal', 'basketball', 'volleyball'],
        phoneCode: '+57',
    },
    MX: {
        code: 'MX',
        name: 'México',
        flag: '🇲🇽',
        locale: 'es-MX',
        language: 'es',
        timezone: 'America/Mexico_City',
        currency: 'MXN',
        currencySymbol: '$',
        popularSports: ['futbol', 'basketball', 'beisbol', 'futsal'],
        phoneCode: '+52',
    },
    AR: {
        code: 'AR',
        name: 'Argentina',
        flag: '🇦🇷',
        locale: 'es-AR',
        language: 'es',
        timezone: 'America/Argentina/Buenos_Aires',
        currency: 'ARS',
        currencySymbol: '$',
        popularSports: ['futbol', 'basketball', 'hockey', 'volleyball'],
        phoneCode: '+54',
    },
    BR: {
        code: 'BR',
        name: 'Brasil',
        flag: '🇧🇷',
        locale: 'pt-BR',
        language: 'pt',
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        currencySymbol: 'R$',
        popularSports: ['futbol', 'futsal', 'volleyball', 'basketball'],
        phoneCode: '+55',
    },
    CL: {
        code: 'CL',
        name: 'Chile',
        flag: '🇨🇱',
        locale: 'es-CL',
        language: 'es',
        timezone: 'America/Santiago',
        currency: 'CLP',
        currencySymbol: '$',
        popularSports: ['futbol', 'basketball', 'volleyball', 'tenis'],
        phoneCode: '+56',
    },
    PE: {
        code: 'PE',
        name: 'Perú',
        flag: '🇵🇪',
        locale: 'es-PE',
        language: 'es',
        timezone: 'America/Lima',
        currency: 'PEN',
        currencySymbol: 'S/',
        popularSports: ['futbol', 'volleyball', 'basketball', 'futsal'],
        phoneCode: '+51',
    },
    EC: {
        code: 'EC',
        name: 'Ecuador',
        flag: '🇪🇨',
        locale: 'es-EC',
        language: 'es',
        timezone: 'America/Guayaquil',
        currency: 'USD',
        currencySymbol: '$',
        popularSports: ['futbol', 'basketball', 'volleyball', 'futsal'],
        phoneCode: '+593',
    },
    VE: {
        code: 'VE',
        name: 'Venezuela',
        flag: '🇻🇪',
        locale: 'es-VE',
        language: 'es',
        timezone: 'America/Caracas',
        currency: 'USD',
        currencySymbol: '$',
        popularSports: ['beisbol', 'futbol', 'basketball', 'futsal'],
        phoneCode: '+58',
    },
    UY: {
        code: 'UY',
        name: 'Uruguay',
        flag: '🇺🇾',
        locale: 'es-UY',
        language: 'es',
        timezone: 'America/Montevideo',
        currency: 'UYU',
        currencySymbol: '$U',
        popularSports: ['futbol', 'basketball', 'handball', 'volleyball'],
        phoneCode: '+598',
    },
    PY: {
        code: 'PY',
        name: 'Paraguay',
        flag: '🇵🇾',
        locale: 'es-PY',
        language: 'es',
        timezone: 'America/Asuncion',
        currency: 'PYG',
        currencySymbol: '₲',
        popularSports: ['futbol', 'futsal', 'volleyball', 'basketball'],
        phoneCode: '+595',
    },
    BO: {
        code: 'BO',
        name: 'Bolivia',
        flag: '🇧🇴',
        locale: 'es-BO',
        language: 'es',
        timezone: 'America/La_Paz',
        currency: 'BOB',
        currencySymbol: 'Bs',
        popularSports: ['futbol', 'futsal', 'basketball', 'volleyball'],
        phoneCode: '+591',
    },
    PA: {
        code: 'PA',
        name: 'Panamá',
        flag: '🇵🇦',
        locale: 'es-PA',
        language: 'es',
        timezone: 'America/Panama',
        currency: 'USD',
        currencySymbol: '$',
        popularSports: ['beisbol', 'futbol', 'basketball', 'boxeo'],
        phoneCode: '+507',
    },
    CR: {
        code: 'CR',
        name: 'Costa Rica',
        flag: '🇨🇷',
        locale: 'es-CR',
        language: 'es',
        timezone: 'America/Costa_Rica',
        currency: 'CRC',
        currencySymbol: '₡',
        popularSports: ['futbol', 'basketball', 'volleyball', 'futsal'],
        phoneCode: '+506',
    },
    DO: {
        code: 'DO',
        name: 'República Dominicana',
        flag: '🇩🇴',
        locale: 'es-DO',
        language: 'es',
        timezone: 'America/Santo_Domingo',
        currency: 'DOP',
        currencySymbol: 'RD$',
        popularSports: ['beisbol', 'basketball', 'volleyball', 'futbol'],
        phoneCode: '+1-809',
    },
    GT: {
        code: 'GT',
        name: 'Guatemala',
        flag: '🇬🇹',
        locale: 'es-GT',
        language: 'es',
        timezone: 'America/Guatemala',
        currency: 'GTQ',
        currencySymbol: 'Q',
        popularSports: ['futbol', 'futsal', 'basketball', 'volleyball'],
        phoneCode: '+502',
    },
    HN: {
        code: 'HN',
        name: 'Honduras',
        flag: '🇭🇳',
        locale: 'es-HN',
        language: 'es',
        timezone: 'America/Tegucigalpa',
        currency: 'HNL',
        currencySymbol: 'L',
        popularSports: ['futbol', 'basketball', 'beisbol', 'futsal'],
        phoneCode: '+504',
    },
    SV: {
        code: 'SV',
        name: 'El Salvador',
        flag: '🇸🇻',
        locale: 'es-SV',
        language: 'es',
        timezone: 'America/El_Salvador',
        currency: 'USD',
        currencySymbol: '$',
        popularSports: ['futbol', 'futsal', 'basketball', 'beisbol'],
        phoneCode: '+503',
    },
    NI: {
        code: 'NI',
        name: 'Nicaragua',
        flag: '🇳🇮',
        locale: 'es-NI',
        language: 'es',
        timezone: 'America/Managua',
        currency: 'NIO',
        currencySymbol: 'C$',
        popularSports: ['beisbol', 'futbol', 'boxeo', 'basketball'],
        phoneCode: '+505',
    },
    CU: {
        code: 'CU',
        name: 'Cuba',
        flag: '🇨🇺',
        locale: 'es-CU',
        language: 'es',
        timezone: 'America/Havana',
        currency: 'CUP',
        currencySymbol: '$',
        popularSports: ['beisbol', 'boxing', 'volleyball', 'futbol'],
        phoneCode: '+53',
    },
    PR: {
        code: 'PR',
        name: 'Puerto Rico',
        flag: '🇵🇷',
        locale: 'es-PR',
        language: 'es',
        timezone: 'America/Puerto_Rico',
        currency: 'USD',
        currencySymbol: '$',
        popularSports: ['beisbol', 'basketball', 'volleyball', 'futbol'],
        phoneCode: '+1-787',
    },
};

/** Lista ordenada alfabéticamente para selectores */
export const countryList: CountryConfig[] = Object.values(countries).sort((a, b) =>
    a.name.localeCompare(b.name)
);

/** País por defecto */
export const DEFAULT_COUNTRY_CODE = 'CO';

/** Obtener configuración de un país, con fallback a Colombia */
export function getCountryConfig(code: string): CountryConfig {
    return countries[code] ?? countries[DEFAULT_COUNTRY_CODE];
}
