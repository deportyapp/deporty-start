import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

// Mock del módulo $app/environment antes de importar authStore
vi.mock('$app/environment', () => ({
	browser: true
}));

import { authStore, logout } from './authStore';

describe('authStore', () => {
	beforeEach(() => {
		// Limpiar localStorage antes de cada test
		localStorage.clear();
		vi.clearAllMocks();
		authStore.set(null);
	});

	it('debería inicializarse como null si no hay datos en localStorage', () => {
		const value = get(authStore);
		expect(value).toBeNull();
	});

	it('debería actualizar el store cuando se establece un usuario', () => {
		const mockUser = {
			id: '123',
			email: 'test@example.com',
			firstName: 'John',
			lastName: 'Doe'
		};

		authStore.set(mockUser);
		const value = get(authStore);

		expect(value).toEqual(mockUser);
	});

	it('debería guardar en localStorage cuando se actualiza el usuario', () => {
		const mockUser = {
			id: '123',
			email: 'test@example.com',
			firstName: 'John',
			lastName: 'Doe'
		};

		authStore.set(mockUser);

		expect(localStorage.setItem).toHaveBeenCalledWith(
			'deporty_user',
			JSON.stringify(mockUser)
		);
	});

	it('debería eliminar de localStorage cuando se hace logout', () => {
		const mockUser = {
			id: '123',
			email: 'test@example.com',
			firstName: 'John',
			lastName: 'Doe'
		};

		authStore.set(mockUser);
		logout();

		const value = get(authStore);
		expect(value).toBeNull();
		expect(localStorage.removeItem).toHaveBeenCalledWith('deporty_user');
	});

	it('debería manejar múltiples actualizaciones correctamente', () => {
		const user1 = {
			id: '1',
			email: 'user1@example.com',
			firstName: 'User',
			lastName: 'One'
		};

		const user2 = {
			id: '2',
			email: 'user2@example.com',
			firstName: 'User',
			lastName: 'Two'
		};

		authStore.set(user1);
		expect(get(authStore)).toEqual(user1);

		authStore.set(user2);
		expect(get(authStore)).toEqual(user2);

		expect(localStorage.setItem).toHaveBeenCalledTimes(2);
	});
});
