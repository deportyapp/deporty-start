import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

// Inicializar el estado desde localStorage si estamos en el navegador
const storedUser = browser ? localStorage.getItem('deporty_user') : null;
const initialValue = storedUser ? JSON.parse(storedUser) : null;

export const authStore = writable<User | null>(initialValue);

// Suscribirse a cambios para persistir en localStorage
if (browser) {
    authStore.subscribe((value) => {
        if (value) {
            localStorage.setItem('deporty_user', JSON.stringify(value));
        } else {
            localStorage.removeItem('deporty_user');
        }
    });
}

export const logout = () => {
    authStore.set(null);
};
