import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

function loadStoredUser(): User | null {
    if (!browser) return null;
    try {
        const stored = localStorage.getItem('deporty_user');
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        // Validar que el objeto tiene la forma esperada
        if (parsed && typeof parsed.id === 'string' && typeof parsed.email === 'string') {
            return parsed as User;
        }
        localStorage.removeItem('deporty_user');
        return null;
    } catch {
        localStorage.removeItem('deporty_user');
        return null;
    }
}

function createAuthStore() {
    const { subscribe, set, update } = writable<User | null>(loadStoredUser());

    return {
        subscribe,
        set(value: User | null) {
            if (browser) {
                if (value) {
                    localStorage.setItem('deporty_user', JSON.stringify(value));
                } else {
                    localStorage.removeItem('deporty_user');
                }
            }
            set(value);
        },
        update
    };
}

export const authStore = createAuthStore();

export const logout = () => {
    authStore.set(null);
};
