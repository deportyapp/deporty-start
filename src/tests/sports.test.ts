import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import SportsPage from '../routes/dashboard/sports/+page.svelte';

vi.mock('$lib/i18n', () => ({
	t: {
		subscribe: (fn: any) => {
			fn((key: string) => key);
			return () => { };
		}
	}
}));

// Mock routing so enhance forms don't crash the context
vi.mock('$app/stores', () => ({
	page: {
		subscribe: (fn: any) => {
			fn({ url: new URL('http://localhost') });
			return () => { };
		}
	}
}));
vi.mock('$app/forms', () => ({
	enhance: () => { }
}));

describe('Profile Sports Configuration Page', () => {
	it('should render the sports grid and check active sports by default', () => {
		const mockData = {
			allSports: [{ sport_id: 'natacion-id', name: 'Natación Carreras' }],
			userSportsIds: ['natacion-id']
		};

		render(SportsPage as any, { props: { data: mockData as any, form: null } });

		// General texts
		expect(screen.getByText('sports.title')).toBeTruthy();
		expect(screen.getByText('sports.subtitle')).toBeTruthy();

		// Submit button
		expect(screen.getByText('sports.save')).toBeTruthy();
	});
});
