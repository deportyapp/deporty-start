import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import DashboardPage from '../routes/dashboard/+page.svelte';

// Mock implementation of t mapping for localization
vi.mock('$lib/i18n', () => ({
	t: {
		subscribe: (fn: any) => {
			fn((key: string) => key);
			return () => {};
		}
	}
}));

describe('Dashboard Main Page', () => {
	it('should render the Call to Action when the user has no sports active', () => {
		const mockData = {
			profile: {
				first_name: 'Test',
				nickname: 'Tester'
			},
			userSports: []
		};

		render(DashboardPage as any, { props: { data: mockData as any } });

		// It should display the empty sport selector state language key
		expect(screen.getByText('dashboard.sportSelector.empty')).toBeTruthy();
		// It should render the button leading to the /sports route
		expect(screen.getByText('sidebar.sports')).toBeTruthy();
	});

	it('should render the sport dropdown and contextual cards when user has sports', () => {
		const mockData = {
			profile: {
				first_name: 'Test',
				nickname: 'Tester'
			},
			userSports: [
				{ sport_id: 'uuid-futbol', name: 'Fútbol' },
				{ sport_id: 'uuid-padel', name: 'Pádel' }
			]
		};

		render(DashboardPage as any, { props: { data: mockData as any } });

		// Validates that the dropdown selector exists
		const selectElement = screen.getByRole('combobox');
		expect(selectElement).toBeTruthy();

		// Should render real sport names
		expect(screen.getByText('Fútbol')).toBeTruthy();
		expect(screen.getByText('Pádel')).toBeTruthy();

		// Dashboard Cards should be active
		expect(screen.getByText('dashboard.cards.upcomingEvents')).toBeTruthy();
		expect(screen.getByText('dashboard.cards.upcomingEventsDesc')).toBeTruthy();
		expect(screen.getByText('dashboard.cards.enrollEvents')).toBeTruthy();
		expect(screen.getByText('dashboard.cards.enrollEventsDesc')).toBeTruthy();
		expect(screen.getByText('dashboard.cards.organizations')).toBeTruthy();
	});
});
