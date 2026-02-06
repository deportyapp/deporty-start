/**
 * Sistema de internacionalización (i18n) para Deporty.
 * 
 * Diseñado para ser simple, tipado y reactivo con Svelte stores.
 * 
 * Uso básico:
 *   import { t, locale, setLocale } from '$lib/i18n';
 *   
 *   // En un componente Svelte:
 *   <h1>{$t('nav.dashboard')}</h1>
 *   
 *   // Cambiar idioma:
 *   setLocale('pt');
 */
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import es from './es';
import pt from './pt';

// ─── Tipos ────────────────────────────────────────────

/** Tipo para un diccionario de traducciones */
export type Translations = Record<string, string>;

/** Tipo para las claves de traducción (inferido del archivo español) */
export type TranslationKey = keyof typeof es;

/** Idiomas soportados */
export type SupportedLanguage = 'es' | 'pt';

// ─── Diccionarios ─────────────────────────────────────

const translations: Record<SupportedLanguage, Translations> = {
    es,
    pt,
};

// ─── Detectar idioma del navegador ────────────────────

function detectBrowserLanguage(): SupportedLanguage {
    if (!browser) return 'es';

    // 1. Revisar si hay preferencia guardada
    const stored = localStorage.getItem('deporty_language');
    if (stored && (stored === 'es' || stored === 'pt')) {
        return stored;
    }

    // 2. Detectar del navegador
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('pt')) return 'pt';

    // 3. Default: español
    return 'es';
}

// ─── Stores ───────────────────────────────────────────

/** Store reactivo con el idioma actual */
export const locale = writable<SupportedLanguage>(detectBrowserLanguage());

/** 
 * Store derivado que provee la función de traducción.
 * Se actualiza automáticamente cuando cambia el locale.
 * 
 * Uso: {$t('clave.traduccion')}
 */
export const t = derived(locale, ($locale) => {
    return (key: TranslationKey, params?: Record<string, string | number>): string => {
        let text = translations[$locale]?.[key] ?? translations['es'][key] ?? key;

        // Reemplazar parámetros: {nombre} → valor
        if (params) {
            for (const [param, value] of Object.entries(params)) {
                text = text.replace(`{${param}}`, String(value));
            }
        }

        return text;
    };
});

// ─── Funciones de utilidad ────────────────────────────

/** Cambia el idioma de la aplicación y lo persiste */
export function setLocale(lang: SupportedLanguage): void {
    locale.set(lang);
    if (browser) {
        localStorage.setItem('deporty_language', lang);
        // Actualizar el atributo lang del HTML
        document.documentElement.lang = lang;
    }
}

/** Obtiene el nombre del idioma para mostrar en la UI */
export function getLanguageName(lang: SupportedLanguage): string {
    const names: Record<SupportedLanguage, string> = {
        es: 'Español',
        pt: 'Português',
    };
    return names[lang];
}

/** Lista de idiomas soportados para selectores */
export const supportedLanguages: { code: SupportedLanguage; name: string; flag: string }[] = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
];
