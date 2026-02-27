// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{
				session: Session | null;
				user: User | null;
			}>;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
			isAdmin?: boolean;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '*.svelte?client' {
	import type { Component } from 'svelte';
	const component: Component<any>;
	export default component;
}

declare module 'intl-tel-input/svelteWithUtils' {
	import type { Component } from 'svelte';
	const component: Component<any>;
	export default component;
}

export { };
