/**
 * Global Svelte stores for shared state
 * Use these in +page.svelte or +layout.svelte with $store syntax
 */

import { writable, derived } from 'svelte/store';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Current authenticated user
 * Set from +page.server.ts or +layout.server.ts via data prop
 */
export const user = writable<User | null>(null);

/**
 * Current session
 * Set from +page.server.ts or +layout.server.ts via data prop
 */
export const session = writable<Session | null>(null);

/**
 * Global loading state
 * Use when making async requests to show spinners/loaders
 */
export const loading = writable(false);

/**
 * Global notification state
 */
export interface Notification {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	duration?: number;
}

export const notifications = writable<Notification[]>([]);

/**
 * Derived store: check if user is authenticated
 */
export const isAuthenticated = derived(user, ($user) => $user !== null);

/**
 * Derived store: check if loading
 */
export const isLoading = derived(loading, ($loading) => $loading === true);

/**
 * Helper function to add notification
 */
export function addNotification(
	message: string,
	type: 'success' | 'error' | 'info' | 'warning' = 'info',
	duration = 3000
) {
	const id = Math.random().toString(36).substr(2, 9);
	const notification: Notification = { id, message, type, duration };

	notifications.update((n) => [...n, notification]);

	if (duration) {
		setTimeout(() => {
			removeNotification(id);
		}, duration);
	}

	return id;
}

/**
 * Helper function to remove notification
 */
export function removeNotification(id: string) {
	notifications.update((n) => n.filter((notification) => notification.id !== id));
}

/**
 * Reset all stores (useful for logout)
 */
export function resetStores() {
	user.set(null);
	session.set(null);
	loading.set(false);
	notifications.set([]);
}
