import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { createSupabaseServerClient } from '$lib/supabaseServer';

export async function GET({ locals, event }) {
    try {
        const supabaseUrl = env.PUBLIC_SUPABASE_URL;

        let dbTest = 'Not executed';
        let dbError = null;
        try {
            const supabase = createSupabaseServerClient(event as any);
            const { data, error } = await supabase.from('countries').select('id').limit(1);
            dbTest = data ? 'Success' : 'Failed';
            dbError = error;

            // Try city table
            const { data: cityData, error: cityError } = await supabase.from('city').select('city_id').limit(1);
            if (cityError) {
                dbError = cityError;
            }
        } catch (e: any) {
            dbError = e.message;
        }

        return json({
            env: {
                PUBLIC_SUPABASE_URL: supabaseUrl || 'MISSING'
            },
            dbTest,
            dbError
        });
    } catch (e: any) {
        return json({ error: e.message });
    }
}
