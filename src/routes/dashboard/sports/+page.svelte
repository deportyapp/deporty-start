<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/i18n';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isSubmitting = $state(false);

	let userSports = $state<string[]>([]);

	// Svelte 5 recommends re-syncing props into state if the load data changes
	$effect(() => {
		if (data.userSportsIds) {
			userSports = data.userSportsIds;
		}
	});

	function toggleSport(sportId: string) {
		if (userSports.includes(sportId)) {
			userSports = userSports.filter((s) => s !== sportId);
		} else {
			userSports = [...userSports, sportId];
		}
	}
</script>

<div class="mx-auto w-full max-w-2xl">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-900">{$t('sports.title')}</h1>
		<p class="mt-1 text-gray-500">{$t('sports.subtitle')}</p>
	</div>

	<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-500/5 sm:p-10">
		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-8"
		>
			<!-- Status Messages -->
			{#if form?.error}
				<div class="rounded-lg bg-red-50 p-4 text-sm text-red-600">
					{$t('sports.error')}
				</div>
			{/if}

			<!-- Hidden inputs to submit the array -->
			{#each userSports as sport}
				<input type="hidden" name="sports" value={sport} />
			{/each}

			<div class="grid gap-4 sm:grid-cols-2">
				{#each data.allSports as sport (sport.sport_id)}
					{@const isSelected = userSports.includes(sport.sport_id)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="group relative flex cursor-pointer rounded-xl border p-4 transition-all hover:-translate-y-0.5
                         {isSelected
							? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10'
							: 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'}"
						onclick={() => toggleSport(sport.sport_id)}
					>
						<div class="flex items-center gap-4">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-full text-2xl
                                {isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100'}"
							>
								🏅
							</div>
							<div>
								<h3
									class="font-semibold transition-colors
                                    {isSelected
										? 'text-blue-900'
										: 'text-gray-900 group-hover:text-blue-600'}"
								>
									{sport.name}
								</h3>
							</div>
						</div>

						<!-- Checkmark icon for selected state -->
						{#if isSelected}
							<div class="absolute top-1/2 right-4 -translate-y-1/2 text-blue-500">
								<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Submit Button -->
			<button
				type="submit"
				disabled={isSubmitting}
				class="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
			>
				{isSubmitting ? $t('sports.saving') : $t('sports.save')}
			</button>
		</form>
	</div>
</div>
