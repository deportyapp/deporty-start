import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: process.env.VITEST
		? {
				conditions: ['browser']
			}
		: undefined,
	test: {
		include: ['src/tests/**/*.test.ts'],
		environment: 'jsdom',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: ['node_modules/', 'src/tests/']
		},
		globals: true
	}
});
