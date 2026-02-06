/**
 * Store de localización regional del usuario.
 * 
 * Maneja la preferencia de país del usuario, lo que determina:
 * - Zona horaria para mostrar fechas/horas
 * - Formato de moneda
 * - Deportes populares (orden en la UI)
 * - Locale para formateo de números/fechas
 * 
 * Se persiste en localStorage para recordar entre sesiones.
 */
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { getCountryConfig, DEFAULT_COUNTRY_CODE, type CountryConfig } from '$lib/config/countries';
import { setLocale, type SupportedLanguage } from '$lib/i18n';

// ─── Detectar país ───────────────────────────────────

function detectUserCountry(): string {
    if (!browser) return DEFAULT_COUNTRY_CODE;

    // 1. Preferencia guardada
    const stored = localStorage.getItem('deporty_country');
    if (stored) return stored;

    // 2. Intentar detectar por idioma del navegador
    const lang = navigator.language.toLowerCase();
    if (lang === 'pt-br' || lang === 'pt') return 'BR';
    if (lang === 'es-mx') return 'MX';
    if (lang === 'es-ar') return 'AR';
    if (lang === 'es-cl') return 'CL';
    if (lang === 'es-pe') return 'PE';
    if (lang === 'es-ve') return 'VE';
    if (lang === 'es-ec') return 'EC';
    if (lang === 'es-co') return 'CO';

    // 3. Default
    return DEFAULT_COUNTRY_CODE;
}

// ─── Store principal ──────────────────────────────────

/** Código de país seleccionado */
export const userCountry = writable<string>(detectUserCountry());

/** Configuración completa del país seleccionado (derivado reactivo) */
export const countryConfig = derived(userCountry, ($country) => {
    return getCountryConfig($country);
});

// ─── Cambiar país ─────────────────────────────────────

/** 
 * Cambiar el país del usuario.
 * Automáticamente actualiza el idioma según el país.
 */
export function setUserCountry(code: string): void {
    const config = getCountryConfig(code);
    userCountry.set(code);

    if (browser) {
        localStorage.setItem('deporty_country', code);
    }

    // Sincronizar idioma con el país
    setLocale(config.language as SupportedLanguage);
}

// ─── Utilidades de formateo regional ──────────────────

/**
 * Formatea una fecha según la configuración regional del usuario.
 */
export function formatDate(date: Date, config: CountryConfig, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: config.timezone,
    };
    return date.toLocaleDateString(config.locale, options ?? defaultOptions);
}

/**
 * Formatea una hora según la configuración regional del usuario.
 */
export function formatTime(date: Date, config: CountryConfig): string {
    return date.toLocaleTimeString(config.locale, {
        timeZone: config.timezone,
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Formatea un monto de dinero según la moneda del país.
 */
export function formatCurrency(amount: number, config: CountryConfig): string {
    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Formatea un número según el locale del usuario.
 */
export function formatNumber(num: number, config: CountryConfig): string {
    return new Intl.NumberFormat(config.locale).format(num);
}
