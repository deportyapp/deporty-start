import { describe, it, expect, beforeEach } from 'vitest';
import {
	user,
	session,
	loading,
	notifications,
	isAuthenticated,
	isLoading,
	addNotification,
	removeNotification,
	resetStores
} from '$lib/stores';
import type { User, Session } from '@supabase/supabase-js';

describe('Stores', () => {
	beforeEach(() => {
		resetStores();
	});

	describe('user store', () => {
		it('should start as null', () => {
			let value: User | null = null;
			user.subscribe((v) => {
				value = v;
			});
			expect(value).toBeNull();
		});

		it('should allow setting user', () => {
			const mockUser = { id: '123', email: 'test@example.com' } as User;
			let value: User | null = null;

			user.subscribe((v) => {
				value = v;
			});

			user.set(mockUser);
			expect(value).toEqual(mockUser);
		});
	});

	describe('loading store', () => {
		it('should start as false', () => {
			let value: boolean = false;
			loading.subscribe((v) => {
				value = v;
			});
			expect(value).toBe(false);
		});

		it('should toggle loading state', () => {
			let value: boolean = false;
			loading.subscribe((v) => {
				value = v;
			});

			loading.set(true);
			expect(value).toBe(true);

			loading.set(false);
			expect(value).toBe(false);
		});
	});

	describe('isAuthenticated derived store', () => {
		it('should be false when user is null', () => {
			let value: boolean = false;
			isAuthenticated.subscribe((v) => {
				value = v;
			});
			expect(value).toBe(false);
		});

		it('should be true when user is set', () => {
			let value: boolean = false;
			isAuthenticated.subscribe((v) => {
				value = v;
			});

			user.set({ id: '123', email: 'test@example.com' } as User);
			expect(value).toBe(true);
		});
	});

	describe('isLoading derived store', () => {
		it('should be false when loading is false', () => {
			let value: boolean = false;
			isLoading.subscribe((v) => {
				value = v;
			});
			expect(value).toBe(false);
		});

		it('should be true when loading is true', () => {
			let value: boolean = false;
			isLoading.subscribe((v) => {
				value = v;
			});

			loading.set(true);
			expect(value).toBe(true);
		});
	});

	describe('notifications store', () => {
		it('should start as empty array', () => {
			let value: any[] = [];
			notifications.subscribe((v) => {
				value = v;
			});
			expect(value).toEqual([]);
		});

		it('should add notification', () => {
			let value: any[] = [];
			notifications.subscribe((v) => {
				value = v;
			});

			addNotification('Test message', 'info');
			expect(value).toHaveLength(1);
			expect(value[0].message).toBe('Test message');
			expect(value[0].type).toBe('info');
		});

		it('should remove notification', () => {
			let value: any[] = [];
			notifications.subscribe((v) => {
				value = v;
			});

			const id = addNotification('Test message');
			expect(value).toHaveLength(1);

			removeNotification(id);
			expect(value).toHaveLength(0);
		});

		it('should auto-remove notification after duration', async () => {
			let value: any[] = [];
			notifications.subscribe((v) => {
				value = v;
			});

			addNotification('Auto remove', 'success', 100);
			expect(value).toHaveLength(1);

			await new Promise((resolve) => setTimeout(resolve, 150));
			expect(value).toHaveLength(0);
		});
	});

	describe('resetStores', () => {
		it('should reset all stores', () => {
			user.set({ id: '123', email: 'test@example.com' } as User);
			loading.set(true);
			addNotification('test');

			resetStores();

			let userData: User | null = null;
			let loadingValue: boolean = false;
			let notificationsValue: any[] = [];

			user.subscribe((v) => {
				userData = v;
			});
			loading.subscribe((v) => {
				loadingValue = v;
			});
			notifications.subscribe((v) => {
				notificationsValue = v;
			});

			expect(userData).toBeNull();
			expect(loadingValue).toBe(false);
			expect(notificationsValue).toHaveLength(0);
		});
	});
});
