import { json, type RequestHandler } from '@sveltejs/kit';
import { createLogger } from '$lib/server/logger';
import { handleError, errors } from '$lib/server/errors';

const logger = createLogger('Health API');

/**
 * Health check endpoint
 * GET /api/health
 *
 * Returns:
 * 200 - Server is healthy
 * 503 - Server is unhealthy
 */
export const GET: RequestHandler = async (event) => {
	try {
		logger.debug('Health check requested');

		// Check Supabase connection
		try {
			const { data, error } = await event.locals.supabase
				.from('users')
				.select('count', { count: 'exact' })
				.limit(1);

			if (error) {
				logger.warn('Supabase health check failed', { error: error.message });
				return json(
					{
						status: 'unhealthy',
						message: 'Database connection failed',
						timestamp: new Date().toISOString()
					},
					{ status: 503 }
				);
			}
		} catch (e) {
			logger.error('Supabase connection error', {
				error: e instanceof Error ? e.message : String(e)
			});
			return json(
				{
					status: 'unhealthy',
					message: 'Service unavailable',
					timestamp: new Date().toISOString()
				},
				{ status: 503 }
			);
		}

		// All checks passed
		return json(
			{
				status: 'healthy',
				timestamp: new Date().toISOString(),
				uptime: process.uptime()
			},
			{ status: 200 }
		);
	} catch (error) {
		const errorResponse = handleError(error);
		logger.error('Health check failed', { error: errorResponse });

		return json(errorResponse, { status: errorResponse.status });
	}
};
