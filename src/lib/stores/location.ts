/**
 * Store para la ubicacion (pais y ciudad) del usuario.
 * Se guarda en localStorage para persistir el onboarding.
 */
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { userCountry, setUserCountry } from '$lib/stores/locale';

function getStoredCity(): string | null {
    if (!browser) return null;
    return localStorage.getItem('deporty_city');
}

export const userCity = writable<string | null>(getStoredCity());

export const isLocationComplete = derived([userCountry, userCity], ([$country, $city]) => {
    return Boolean($country && $city);
});

export function setUserCity(city: string): void {
    userCity.set(city);
    if (browser) {
        localStorage.setItem('deporty_city', city);
    }
}

export function clearLocation(): void {
    if (browser) {
        localStorage.removeItem('deporty_city');
    }
    userCity.set(null);
}

export function setLocation(countryCode: string, city: string): void {
    setUserCountry(countryCode);
    setUserCity(city);
}
