/**
 * Sistema de internacionalización (i18n) para Deporty.
 * Uso: import { t } from '$lib/i18n'; → {$t('landing.heroTitle1')}
 * Cambiar idioma: setLocale('pt');
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

/** Función de traducción reactiva al idioma actual. */
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

/** Cambia el idioma y lo persiste en localStorage. */
export function setLocale(lang: SupportedLanguage): void {
    locale.set(lang);
    if (browser) {
        localStorage.setItem('deporty_language', lang);
        document.documentElement.lang = lang;
    }
}
