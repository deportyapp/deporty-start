<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { authStore } from '$lib/authStore';
    import { t } from '$lib/i18n';
    import { setUserCountry } from '$lib/stores/locale';
    import { setUserCity, isLocationComplete } from '$lib/stores/location';

    type Country = { code: string; name: string };

    let countries = $state<Country[]>([]);
    let cities = $state<string[]>([]);
    let isLoadingCountries = $state(true);
    let isLoadingCities = $state(false);
    let selectedCountry = $state('');
    let selectedCity = $state<string | null>(null);
    let errorMessage = $state('');

    onMount(async () => {
        if (!$authStore) {
            goto('/login');
            return;
        }
        if ($isLocationComplete) {
            goto('/');
            return;
        }
        await loadCountries();
    });

    async function loadCountries() {
        isLoadingCountries = true;
        errorMessage = '';
        try {
            const res = await fetch('/api/locations/countries');
            const data = await res.json();
            countries = data.countries ?? [];
        } catch {
            errorMessage = $t('error.network');
        } finally {
            isLoadingCountries = false;
        }
    }

    async function loadCities(countryCode: string) {
        isLoadingCities = true;
        errorMessage = '';
        cities = [];
        try {
            const res = await fetch(`/api/locations/cities?country=${countryCode}`);
            const data = await res.json();
            cities = data.cities ?? [];
        } catch {
            errorMessage = $t('error.network');
        } finally {
            isLoadingCities = false;
        }
    }

    function handleCountryChange(code: string) {
        selectedCountry = code;
        selectedCity = null;
        setUserCountry(code);
        loadCities(code);
    }

    function handleCityChange(city: string) {
        selectedCity = city;
        setUserCity(city);
    }

    async function handleContinue() {
        if (!selectedCountry || !selectedCity || !$authStore) return;
        errorMessage = '';
        try {
            const res = await fetch('/api/users/location', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: $authStore.id,
                    countryCode: selectedCountry,
                    city: selectedCity
                })
            });

            if (!res.ok) {
                const data = await res.json();
                errorMessage = data.message || $t('error.generic');
                return;
            }

            authStore.update((user) => {
                if (!user) return user;
                return {
                    ...user,
                    countryCode: selectedCountry,
                    city: selectedCity
                };
            });

            goto('/');
        } catch {
            errorMessage = $t('error.network');
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-16">
    <div class="mx-auto w-full max-w-2xl">
        <div class="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-xl">
            <div class="p-8 sm:p-10">
                <div class="mb-8 text-center">
                    <h1 class="mb-2 text-3xl font-bold text-white">{$t('onboarding.title')}</h1>
                    <p class="text-slate-400">{$t('onboarding.subtitle')}</p>
                </div>

                {#if errorMessage}
                    <div class="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                        {errorMessage}
                    </div>
                {/if}

                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-sm font-semibold text-slate-300">{$t('onboarding.countryLabel')}</label>
                        <select
                            class="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            disabled={isLoadingCountries}
                            bind:value={selectedCountry}
                            onchange={(e) => handleCountryChange((e.currentTarget as HTMLSelectElement).value)}
                        >
                            <option value="" disabled selected>{$t('onboarding.selectCountry')}</option>
                            {#each countries as country}
                                <option value={country.code}>{country.name}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-semibold text-slate-300">{$t('onboarding.cityLabel')}</label>
                        <select
                            class="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            disabled={!selectedCountry || isLoadingCities}
                            bind:value={selectedCity}
                            onchange={(e) => handleCityChange((e.currentTarget as HTMLSelectElement).value)}
                        >
                            <option value="" disabled selected>
                                {isLoadingCities ? $t('onboarding.loadingCities') : $t('onboarding.selectCity')}
                            </option>
                            {#each cities as city}
                                <option value={city}>{city}</option>
                            {/each}
                        </select>
                    </div>

                    <button
                        onclick={handleContinue}
                        class="mt-2 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={!selectedCountry || !selectedCity || !$isLocationComplete}
                    >
                        {$t('onboarding.continue')}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
