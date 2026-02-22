<script lang="ts">
	import { t } from '$lib/i18n';

	let { data } = $props();
</script>

<div class="mx-auto w-full max-w-2xl">
	<div
		class="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-blue-500/5"
	>
		<div class="p-8 sm:p-10">
			<!-- Quick Actions -->
			<div class="mt-6 grid gap-3 sm:grid-cols-2">
				<a
					href="/dashboard/organizations"
					class="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
				>
					<div
						class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
					>
						<svg
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
					</div>
					{$t('sidebar.organizations')}
				</a>
				<a
					href="/dashboard/profile"
					class="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
				>
					<div
						class="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600"
					>
						<svg
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					{$t('sidebar.profile')}
				</a>
			</div>
		</div>
	</div>
</div>
