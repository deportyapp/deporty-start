import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock del navegador para authStore
Object.defineProperty(window, 'localStorage', {
	value: {
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn()
	},
	writable: true
});
