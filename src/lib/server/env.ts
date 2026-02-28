/**
 * Environment variables validation
 * Validates required env vars at startup
 * Throws error if any required var is missing
 */

const requiredPublicEnvVars = ['PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_ANON_KEY'];

const missing = requiredPublicEnvVars.filter(v => !process.env[v]);

if (missing.length > 0) {
	throw new Error(`❌ Missing required environment variables: ${missing.join(', ')}`);
}

export const env = {
	// Public env vars (safe to expose to client)
	PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL!,
	PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY!,

	// Private env vars (server-only)
	NODE_ENV: process.env.NODE_ENV || 'development',
	LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const;

export type Env = typeof env;
