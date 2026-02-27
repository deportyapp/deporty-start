import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;
	const { user } = await locals.safeGetSession();

	// Load all available sports
	const { data: allSports } = await supabase
		.from('sport')
		.select('sport_id, name')
		.is('deleted_at', null)
		.order('name');

	// Load user's selected sports via relational table
	let userSportsIds: string[] = [];
	if (user) {
		const { data: userSports } = await supabase
			.from('profile_sport')
			.select('sport_id')
			.eq('profile_id', user.id);

		userSportsIds = (userSports ?? []).map(s => s.sport_id);
	}

	return {
		allSports: allSports ?? [],
		userSportsIds
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) {
			return fail(401, { error: 'unauthorized' });
		}

		try {
			const formData = await request.formData();
			const sports = formData.getAll('sports') as string[];

			// 1. Delete existing associations
			const { error: deleteError } = await locals.supabase
				.from('profile_sport')
				.delete()
				.eq('profile_id', user.id);

			if (deleteError) {
				console.error('Error deleting old sports:', deleteError);
				return fail(500, { error: 'sports_update_failed' });
			}

			// 2. Insert new associations
			if (sports.length > 0) {
				const insertions = sports.map((sport_id) => ({
					profile_id: user.id,
					sport_id
				}));

				const { error: insertError } = await locals.supabase
					.from('profile_sport')
					.insert(insertions);

				if (insertError) {
					console.error('Error inserting new sports:', insertError);
					return fail(500, { error: 'sports_update_failed' });
				}
			}
		} catch (error) {
			console.error('Action sports error:', error);
			return fail(500, { error: 'Unknown server error' });
		}

		throw redirect(303, '/dashboard');
	}
};
