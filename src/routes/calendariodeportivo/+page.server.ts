import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { normalizeToIsoDate } from '$lib/utils/dateUtils';

/**
 * Calendario Deportivo — Server Load & Actions.
 * Public page: loads cities, sports, and calendar events from Supabase.
 * Form action for creating events requires authentication.
 */

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;
	const { session, user } = await locals.safeGetSession();

	let isAdmin = false;
	if (user) {
		const { data: profile } = await supabase
			.from('profile')
			.select('is_admin')
			.eq('profile_id', user.id)
			.single();
		if (profile?.is_admin) {
			isAdmin = true;
		}
	}

	try {
		// Load countries (only Latin American by ISO code)
		const latamIsoCodes = [
			'AR',
			'BO',
			'BR',
			'CL',
			'CO',
			'CR',
			'CU',
			'DO',
			'EC',
			'SV',
			'GT',
			'HN',
			'MX',
			'NI',
			'PA',
			'PY',
			'PE',
			'PR',
			'UY',
			'VE'
		];
		const { data: countries, error: errorCountries } = await supabase
			.from('countries')
			.select('id, name, iso_code')
			.in('iso_code', latamIsoCodes)
			.order('name');
		if (errorCountries) throw new Error(`Countries Error: ${errorCountries.message}`);

		const countryIds = (countries ?? []).map((c) => c.id);
		let departments: any[] = [];
		if (countryIds.length > 0) {
			const { data: deps, error: errorDepartments } = await supabase
				.from('department')
				.select('id, name, country_id')
				.in('country_id', countryIds)
				.order('name');
			if (errorDepartments) throw new Error(`Departments Error: ${errorDepartments.message}`);
			departments = deps ?? [];
		}

		// Cities will be fetched dynamically on the client-side to prevent URL length limits
		// and massive payload sizes, passing down an empty array initially.
		let cities: any[] = [];

		// Load sports
		const { data: sports, error: errorSports } = await supabase
			.from('sport')
			.select('sport_id, name')
			.is('deleted_at', null)
			.order('name');
		if (errorSports) throw new Error(`Sports Error: ${errorSports.message}`);

		return {
			countries: countries ?? [],
			departments: departments ?? [],
			cities: cities ?? [],
			sports: sports ?? [],
			events: [],
			isLoggedIn: !!session,
			currentUserId: user?.id ?? null,
			isAdmin
		};
	} catch (e) {
		console.error('Error loading calendar data:', e);
		return {
			countries: [],
			departments: [],
			cities: [],
			sports: [],
			events: [],
			isLoggedIn: !!session,
			currentUserId: user?.id ?? null,
			isAdmin,
			errorMsg: 'No se pudo conectar con la base de datos. Por favor, intenta de nuevo más tarde.'
		};
	}
};

export const actions: Actions = {
	createEvent: async ({ request, locals }) => {
		const { supabase } = locals;
		const { user } = await locals.safeGetSession();

		if (!user) {
			return fail(401, { error: 'unauthorized' });
		}

		// Enforce Admin Only for Create Event
		const { data: profile } = await supabase
			.from('profile')
			.select('is_admin')
			.eq('profile_id', user.id)
			.single();

		if (!profile?.is_admin) {
			return fail(403, { error: 'forbidden_not_admin' });
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const sport_id = formData.get('sport_id') as string;
		const city_id = formData.get('city_id') as string;
		const color = formData.get('color') as string;
		const referenceStartInput = formData.get('reference_start') as string;
		const referenceEndInput = formData.get('reference_end') as string;
		const reference_start = normalizeToIsoDate(referenceStartInput);
		const reference_end = normalizeToIsoDate(referenceEndInput);
		const is_recurring = formData.get('is_recurring') === 'on';

		// Validation
		if (!name || !sport_id || !city_id || !referenceStartInput || !referenceEndInput) {
			return fail(400, { error: 'missing_fields' });
		}

		if (!reference_start || !reference_end) {
			return fail(400, { error: 'missing_fields' });
		}

		// Calculate day-of-week from dates
		const startDate = new Date(reference_start + 'T00:00:00');
		const endDate = new Date(reference_end + 'T00:00:00');

		if (endDate < startDate) {
			return fail(400, { error: 'invalid_dates' });
		}

		const start_day_of_week = startDate.getDay();
		const end_day_of_week = endDate.getDay();

		const { error } = await supabase.from('calendar_event').insert({
			name,
			sport_id,
			city_id,
			color: color || '#3B82F6',
			reference_start,
			reference_end,
			start_day_of_week,
			end_day_of_week,
			is_recurring,
			created_by: user.id
		});

		import('fs').then((fs) => {
			fs.writeFileSync(
				'last_calendar_debug.txt',
				JSON.stringify(
					{
						formData: Object.fromEntries(formData.entries()),
						error: error || 'NONE - SUCCESS',
						dates: { reference_start, reference_end, start_day_of_week, end_day_of_week }
					},
					null,
					2
				)
			);
		});

		if (error) {
			console.error('Error creating calendar event:', error);
			return fail(500, { error: 'db_error' });
		}

		return { success: true };
	},

	deleteEvent: async ({ request, locals }) => {
		const { supabase } = locals;
		const { user } = await locals.safeGetSession();

		if (!user) {
			return fail(401, { error: 'unauthorized' });
		}

		// Enforce Admin Only for Delete Event
		const { data: profile } = await supabase
			.from('profile')
			.select('is_admin')
			.eq('profile_id', user.id)
			.single();

		if (!profile?.is_admin) {
			return fail(403, { error: 'forbidden_not_admin' });
		}

		const formData = await request.formData();
		const eventId = formData.get('event_id');

		if (!eventId || typeof eventId !== 'string') {
			return fail(400, { error: 'missing_fields' });
		}

		const { data: ownedEvent, error: ownershipError } = await supabase
			.from('calendar_event')
			.select('event_id')
			.eq('event_id', eventId)
			.eq('created_by', user.id)
			.is('deleted_at', null)
			.maybeSingle();

		if (ownershipError) {
			console.error('Error validating event ownership:', ownershipError);
			return fail(500, { error: 'db_error' });
		}

		if (!ownedEvent) {
			return fail(403, { error: 'forbidden' });
		}

		const { error } = await supabase
			.from('calendar_event')
			.update({ deleted_at: new Date().toISOString() })
			.eq('event_id', eventId)
			.eq('created_by', user.id)
			.is('deleted_at', null);

		if (error) {
			console.error('Error deleting calendar event:', error);
			return fail(500, { error: 'db_error' });
		}

		return { success: true };
	}
};
