<!--
  CountrySelector.svelte
  
  Selector de país/región para la navbar.
  Permite al usuario elegir su país, lo que adapta:
  - Idioma (es/pt)
  - Zona horaria
  - Moneda
  - Deportes populares
-->
<script lang="ts">
	import { countryList, type CountryConfig } from '$lib/config/countries';
	import { userCountry, setUserCountry } from '$lib/stores/locale';
	import { t } from '$lib/i18n';
	import { getCountryConfig } from '$lib/config/countries';

	let isOpen = $state(false);
	let searchQuery = $state('');

	let currentCountry = $derived(getCountryConfig($userCountry));

	let filteredCountries = $derived(
		countryList.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	function selectCountry(config: CountryConfig) {
		setUserCountry(config.code);
		isOpen = false;
		searchQuery = '';
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.country-selector')) {
			isOpen = false;
			searchQuery = '';
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
			searchQuery = '';
		}
	}
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="country-selector relative">
	<button
		onclick={() => (isOpen = !isOpen)}
		class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm transition-all hover:border-blue-300 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		aria-label={$t('country.change')}
		aria-expanded={isOpen}
		aria-haspopup="listbox"
	>
		<span class="text-lg">{currentCountry.flag}</span>
		<span class="hidden font-medium text-gray-700 sm:inline">{currentCountry.code}</span>
		<svg
			class="h-3.5 w-3.5 text-gray-400 transition-transform {isOpen ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
			role="listbox"
			aria-label={$t('country.select')}
		>
			<!-- Buscador -->
			<div class="border-b border-gray-100 p-3">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder={$t('country.select')}
					class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
				/>
			</div>

			<!-- Lista de países -->
			<div class="max-h-64 overflow-y-auto">
				{#each filteredCountries as country (country.code)}
					<button
						onclick={() => selectCountry(country)}
						class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-blue-50 {country.code ===
						$userCountry
							? 'bg-blue-50 font-semibold text-blue-700'
							: 'text-gray-700'}"
						role="option"
						aria-selected={country.code === $userCountry}
					>
						<span class="text-xl">{country.flag}</span>
						<div class="flex-1">
							<span class="block">{country.name}</span>
							<span class="text-xs text-gray-400">{country.currencySymbol} {country.currency}</span>
						</div>
						{#if country.code === $userCountry}
							<svg class="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
					</button>
				{/each}

				{#if filteredCountries.length === 0}
					<div class="px-4 py-6 text-center text-sm text-gray-400">
						No se encontraron países
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
