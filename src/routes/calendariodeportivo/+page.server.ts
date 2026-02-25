import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

/**
 * Calendario Deportivo — Server Load & Actions.
 * Public page: loads cities, sports, and calendar events from Supabase.
 * Form action for creating events requires authentication.
 */

export const load: PageServerLoad = async ({ locals }) => {
    const { supabase } = locals;
    const { session } = await locals.safeGetSession();

    // Load countries (for filter)
    const { data: countries, error: errorCountries } = await supabase
        .from('countries')
        .select('id, name, iso_code')
        .order('name');
    if (errorCountries) throw error(500, `Countries Error: ${errorCountries.message}`);

    // Load cities with country info
    const { data: cities, error: errorCities } = await supabase
        .from('city')
        .select('city_id, name, country_id')
        .order('name');
    if (errorCities) throw error(500, `Cities Error: ${errorCities.message}`);

    // Load sports
    const { data: sports, error: errorSports } = await supabase
        .from('sport')
        .select('sport_id, name')
        .is('deleted_at', null)
        .order('name');
    if (errorSports) throw error(500, `Sports Error: ${errorSports.message}`);

    // Load calendar events with sport and city names
    const { data: events, error: errorEvents } = await supabase
        .from('calendar_event')
        .select(`
			event_id,
			name,
			sport_id,
			city_id,
			color,
			reference_start,
			reference_end,
			start_day_of_week,
			end_day_of_week,
			is_recurring,
			sport ( name ),
			city ( name, country_id )
		`)
        .is('deleted_at', null)
        .order('reference_start');
    if (errorEvents) throw error(500, `Events Error: ${errorEvents.message}`);

    return {
        countries: countries ?? [],
        cities: cities ?? [],
        sports: sports ?? [],
        events: events ?? [],
        isLoggedIn: !!session
    };
};

export const actions: Actions = {
    createEvent: async ({ request, locals }) => {
        const { supabase } = locals;
        const { user } = await locals.safeGetSession();

        if (!user) {
            return fail(401, { error: 'unauthorized' });
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const sport_id = formData.get('sport_id') as string;
        const city_id = formData.get('city_id') as string;
        const color = formData.get('color') as string;
        const reference_start = formData.get('reference_start') as string;
        const reference_end = formData.get('reference_end') as string;
        const is_recurring = formData.get('is_recurring') === 'on';

        // Validation
        if (!name || !sport_id || !city_id || !reference_start || !reference_end) {
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

        if (error) {
            console.error('Error creating calendar event:', error);
            return fail(500, { error: 'db_error' });
        }

        return { success: true };
    }
};
