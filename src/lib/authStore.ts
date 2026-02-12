import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    countryCode?: string | null;
    city?: string | null;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<User | null>(null);

    return {
        subscribe,
        set(value: User | null) {
            set(value);
        },
        update
    };
}

export const authStore = createAuthStore();

export async function initAuth(): Promise<void> {
    if (!browser) return;
    try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
            const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
            if (!refreshRes.ok) {
                authStore.set(null);
                return;
            }
        }

        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
            authStore.set(null);
            return;
        }
        const data = await meRes.json();
        authStore.set(data.user ?? null);
    } catch {
        authStore.set(null);
    }
}

export async function logout(): Promise<void> {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
        // Ignore network errors on logout.
    }
    authStore.set(null);
    if (browser) {
        localStorage.removeItem('deporty_city');
        localStorage.removeItem('deporty_country');
    }
}
