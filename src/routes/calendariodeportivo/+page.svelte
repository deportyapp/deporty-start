<script lang="ts">
	import { t } from '$lib/i18n';
	import { locale } from '$lib/i18n';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import {
		adjustEventToYear,
		getCalendarGrid,
		detectCountryFromGeolocation,
		MONTH_NAMES_ES,
		MONTH_NAMES_PT,
		WEEKDAY_SHORT_ES,
		WEEKDAY_SHORT_PT,
		type CalendarEvent
	} from '$lib/utils/calendarUtils';
	import { createSupabaseBrowserClient } from '$lib/supabaseClient';
	import DateInput from '$lib/components/DateInput.svelte';

	let { data }: { data: import('./$types').PageData & { isAdmin?: boolean } } = $props();

	// ─── State ──────────────────────────────────────────
	const currentDate = new Date();
	let selectedYear = $state(currentDate.getFullYear());
	let selectedMonth = $state(currentDate.getMonth());
	let viewMode = $state<'year' | 'month'>('year');
	let selectedCountryIso = $state('');
	let selectedDepartmentId = $state('');
	let selectedCityId = $state('');
	let selectedSportId = $state('');
	let eventSportId = $state('');
	let showAddModal = $state(false);
	let formLoading = $state(false);
	let formMessage = $state('');
	let formError = $state(false);
	let detectedCountry = $state('');
	let loadedCities = $state<{ city_id: string; name: string; department_id: string }[]>([]);
	let loadingCities = $state(false);
	let loadedEvents = $state<CalendarEvent[]>([]);
	let loadingEvents = $state(false);
	let eventsRequestToken = $state(0);

	type SportOption = { sport_id: string; name: string };

	// ─── Derived ────────────────────────────────────────

	const monthNames = $derived($locale === 'pt' ? MONTH_NAMES_PT : MONTH_NAMES_ES);
	const weekdayShort = $derived($locale === 'pt' ? WEEKDAY_SHORT_PT : WEEKDAY_SHORT_ES);

	function normalizeSportText(text: string): string {
		return text
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
	}

	function getPreferredSportId(sports: SportOption[]): string {
		if (sports.length === 0) return '';

		const preferred = sports.find((sport) => {
			const haystack = normalizeSportText(`${sport.sport_id} ${sport.name}`);
			return (
				haystack.includes('natacion') || haystack.includes('natacao') || haystack.includes('swim')
			);
		});

		return preferred?.sport_id ?? sports[0].sport_id;
	}

	// Countries (returning all loaded LatAm countries)
	const getCountries = $derived(() => {
		return data.countries ?? [];
	});

	// Departments filtered by selected country
	const filteredDepartments = $derived(() => {
		if (!selectedCountryIso) return [];
		const country = (data.countries ?? []).find(
			(c: { iso_code: string }) => c.iso_code === selectedCountryIso
		);
		if (!country) return [];
		return (data.departments ?? []).filter(
			(d: { country_id: number }) => d.country_id === country.id
		);
	});

	$effect(() => {
		const sports = (data.sports ?? []) as SportOption[];
		if (sports.length === 0) {
			selectedSportId = '';
			eventSportId = '';
			return;
		}

		const preferredSportId = getPreferredSportId(sports);
		const selectedExists = sports.some((sport) => sport.sport_id === selectedSportId);
		const eventExists = sports.some((sport) => sport.sport_id === eventSportId);

		if (!selectedExists) {
			selectedSportId = preferredSportId;
		}

		if (!eventExists) {
			eventSportId = preferredSportId;
		}
	});

	// Fetch Municipalities dynamically to avoid URL Too Long Error initially
	$effect(() => {
		if (selectedDepartmentId) {
			loadingCities = true;
			const client = createSupabaseBrowserClient();
			client
				.from('city')
				.select('city_id, name, department_id')
				.eq('department_id', selectedDepartmentId)
				.order('name')
				.then(({ data }) => {
					loadedCities = data ?? [];
					loadingCities = false;
				});
		} else {
			loadedCities = [];
			loadingCities = false;
		}
	});

	// Fetch events dynamically only after municipality/city is selected
	$effect(() => {
		// Read token to establish reactive dependency
		const trigger = eventsRequestToken;

		if (!selectedCityId) {
			loadedEvents = [];
			loadingEvents = false;
			return;
		}

		loadingEvents = true;

		const client = createSupabaseBrowserClient();
		let query = client
			.from('calendar_event')
			.select(
				`
				event_id,
				name,
				sport_id,
				city_id,
				created_by,
				color,
				reference_start,
				reference_end,
				start_day_of_week,
				end_day_of_week,
				is_recurring,
				sport ( name ),
				city ( name, department_id )
			`
			)
			.eq('city_id', selectedCityId)
			.is('deleted_at', null)
			.order('reference_start');

		if (selectedSportId) {
			query = query.eq('sport_id', selectedSportId);
		}

		query.then(({ data: events }) => {
			if (trigger !== eventsRequestToken) {
				return;
			}

			loadedEvents = (events ?? []) as CalendarEvent[];
			loadingEvents = false;
		});
	});

	// Events to render (requires selected municipality/city)
	const filteredEvents = $derived(() => {
		if (!selectedCityId) {
			return [] as CalendarEvent[];
		}

		return loadedEvents;
	});

	// Adjusted events for the selected year
	const adjustedEvents = $derived(() => {
		return filteredEvents().map((ev) => adjustEventToYear(ev, selectedYear));
	});

	// Month view grid derivations
	const mainGrid = $derived(getCalendarGrid(selectedYear, selectedMonth, adjustedEvents()));

	const prevIdx = $derived(selectedMonth === 0 ? 11 : selectedMonth - 1);
	const prevY = $derived(selectedMonth === 0 ? selectedYear - 1 : selectedYear);
	const prevGrid = $derived(getCalendarGrid(prevY, prevIdx, adjustedEvents()));

	const nextIdx = $derived(selectedMonth === 11 ? 0 : selectedMonth + 1);
	const nextY = $derived(selectedMonth === 11 ? selectedYear + 1 : selectedYear);
	const nextGrid = $derived(getCalendarGrid(nextY, nextIdx, adjustedEvents()));

	// ─── Auto-detect country ────────────────────────────
	if (browser) {
		detectCountryFromGeolocation().then((iso) => {
			detectedCountry = iso;
			// Auto-select if no country is already explicitly selected by the user
			if (!selectedCountryIso) {
				const match = (data.countries ?? []).find((c: { iso_code: string }) => c.iso_code === iso);
				if (match) {
					// Preselect the detected LatAm country
					selectedCountryIso = iso;
				} else {
					// Fallback to the first LatAm country if the detected one isn't supported
					const firstCountry = (data.countries ?? [])[0];
					if (firstCountry) selectedCountryIso = firstCountry.iso_code;
				}
			}
		});
	}

	// ─── Active month events (month view footer list) ─────────────────
	const activeMonthEvents = $derived(() => {
		if (!selectedCityId) return [];

		const monthStart = new Date(selectedYear, selectedMonth, 1);
		const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);

		const seen = new Map<
			string,
			{ event_id: string; name: string; color: string; created_by?: string | null }
		>();

		for (const ev of adjustedEvents()) {
			const overlapsMonth = ev.adjustedStart <= monthEnd && ev.adjustedEnd >= monthStart;
			if (!overlapsMonth || seen.has(ev.event_id)) {
				continue;
			}

			seen.set(ev.event_id, {
				event_id: ev.event_id,
				name: ev.name,
				color: ev.color,
				created_by: ev.created_by ?? null
			});
		}

		return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
	});

	// ─── Helpers ────────────────────────────────────────
	function prevMonth() {
		if (selectedMonth === 0) {
			selectedMonth = 11;
			selectedYear--;
		} else {
			selectedMonth--;
		}
	}

	function nextMonth() {
		if (selectedMonth === 11) {
			selectedMonth = 0;
			selectedYear++;
		} else {
			selectedMonth++;
		}
	}

	function handleAddEvent() {
		if (!data.isLoggedIn) {
			window.location.href = '/register';
			return;
		}

		if (!eventSportId) {
			eventSportId = getPreferredSportId((data.sports ?? []) as SportOption[]);
		}

		showAddModal = true;
		formMessage = '';
		formError = false;
	}

	function confirmDeleteEvent(): boolean {
		const confirmText =
			$locale === 'pt'
				? 'Tem certeza de que deseja excluir este evento?'
				: '¿Seguro que deseas eliminar este evento?';

		return window.confirm(confirmText);
	}

	// Color presets
	const colorPresets = [
		'#3B82F6',
		'#EF4444',
		'#10B981',
		'#F59E0B',
		'#8B5CF6',
		'#EC4899',
		'#06B6D4',
		'#F97316',
		'#14B8A6',
		'#6366F1'
	];
</script>

<svelte:head>
	<title>{$t('calendar.title')} | Deporty</title>
	<meta name="description" content={$t('calendar.subtitle')} />
</svelte:head>

<div class="min-h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
	<!-- Grid background -->
	<div
		class="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem]"
	></div>

	<div class="relative mx-auto max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8">
		<!-- ═══ HEADER ═══ -->
		<header class="mb-8 text-center">
			<h1
				class="font-brand mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
			>
				{$t('calendar.title')}
			</h1>
			<p class="text-sm text-slate-400 sm:text-base">{$t('calendar.subtitle')}</p>
		</header>

		{#if data.errorMsg}
			<div
				class="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400"
			>
				{data.errorMsg}
			</div>
		{/if}

		<!-- ═══ FILTERS BAR ═══ -->
		<div
			class="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm"
		>
			<!-- Country filter -->
			<div class="min-w-[140px] flex-1">
				<label for="filter-country" class="mb-1 block text-xs font-medium text-slate-400">
					{$t('calendar.filterCountry')}
				</label>
				<select
					id="filter-country"
					bind:value={selectedCountryIso}
					onchange={() => {
						selectedDepartmentId = '';
						selectedCityId = '';
					}}
					class="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				>
					<option value="">—</option>
					{#each getCountries() as country (country.id)}
						<option value={country.iso_code}>{country.name}</option>
					{/each}
				</select>
			</div>

			<!-- Department filter -->
			<div class="min-w-[160px] flex-1">
				<label for="filter-department" class="mb-1 block text-xs font-medium text-slate-400">
					Departamento/Provincia
				</label>
				<select
					id="filter-department"
					bind:value={selectedDepartmentId}
					disabled={!selectedCountryIso}
					onchange={() => {
						selectedCityId = '';
					}}
					class="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
				>
					<option value="">Selecciona un depto.</option>
					{#each filteredDepartments() as dept (dept.id)}
						<option value={dept.id}>{dept.name}</option>
					{/each}
				</select>
			</div>

			<!-- City filter -->
			<div class="min-w-[160px] flex-1">
				<label for="filter-city" class="mb-1 block text-xs font-medium text-slate-400">
					Municipio/Ciudad
				</label>
				<select
					id="filter-city"
					bind:value={selectedCityId}
					disabled={!selectedDepartmentId || loadingCities}
					class="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
				>
					<option value="">{loadingCities ? 'Cargando...' : 'Selecciona una ciudad'}</option>
					{#each loadedCities as city (city.city_id)}
						<option value={city.city_id}>{city.name}</option>
					{/each}
				</select>
			</div>

			<!-- Sport filter -->
			<div class="min-w-[160px] flex-1">
				<label for="filter-sport" class="mb-1 block text-xs font-medium text-slate-400">
					{$t('calendar.filterSport')}
				</label>
				<select
					id="filter-sport"
					bind:value={selectedSportId}
					class="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				>
					<option value="">{$t('calendar.filterAllSports')}</option>
					{#each data.sports ?? [] as sport (sport.sport_id)}
						<option value={sport.sport_id}>{sport.name}</option>
					{/each}
				</select>
			</div>

			<!-- View toggle + year nav -->
			<div class="flex items-end gap-2">
				<button
					type="button"
					onclick={() => (viewMode = 'year')}
					class="rounded-lg px-3 py-2 text-sm font-medium transition-colors {viewMode === 'year'
						? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
						: 'border border-slate-600 text-slate-300 hover:bg-slate-700'}"
				>
					{$t('calendar.viewYear')}
				</button>
				<button
					type="button"
					onclick={() => (viewMode = 'month')}
					class="rounded-lg px-3 py-2 text-sm font-medium transition-colors {viewMode === 'month'
						? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
						: 'border border-slate-600 text-slate-300 hover:bg-slate-700'}"
				>
					{$t('calendar.viewMonth')}
				</button>
			</div>

			<!-- Add event button (Admin only) -->
			{#if data.isAdmin}
				<button
					type="button"
					onclick={handleAddEvent}
					class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-blue-500/50"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					{$t('calendar.addEvent')}
				</button>
			{/if}
		</div>

		<!-- Year navigation -->
		<div class="mb-4 flex items-center justify-center gap-4">
			<button
				type="button"
				onclick={() => selectedYear--}
				class="rounded-lg border border-slate-600 px-3 py-1.5 text-slate-300 transition-colors hover:bg-slate-700"
				aria-label="Previous year"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/></svg
				>
			</button>
			<span class="font-brand text-2xl font-bold text-white">{selectedYear}</span>
			<button
				type="button"
				onclick={() => selectedYear++}
				class="rounded-lg border border-slate-600 px-3 py-1.5 text-slate-300 transition-colors hover:bg-slate-700"
				aria-label="Next year"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					/></svg
				>
			</button>
		</div>

		<!-- ═══ YEAR VIEW ═══ -->
		{#if viewMode === 'year'}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each Array.from({ length: 12 }, (_, i) => i) as monthIdx (monthIdx)}
					{@const grid = getCalendarGrid(selectedYear, monthIdx, adjustedEvents())}
					<button
						type="button"
						onclick={() => {
							selectedMonth = monthIdx;
							viewMode = 'month';
						}}
						class="group cursor-pointer rounded-xl border border-slate-700/50 bg-slate-800/40 p-3 backdrop-blur-sm transition-all hover:border-blue-500/40 hover:bg-slate-800/60"
					>
						<h3
							class="mb-2 text-center text-sm font-semibold text-blue-400 group-hover:text-blue-300"
						>
							{monthNames[monthIdx]}
						</h3>
						<!-- Weekday headers -->
						<div class="mb-1 grid grid-cols-7 gap-px">
							{#each weekdayShort as wd (wd)}
								<div class="text-center text-[9px] font-medium text-slate-500">{wd[0]}</div>
							{/each}
						</div>
						<!-- Days grid -->
						{#each grid as week}
							<div class="grid grid-cols-7 gap-px">
								{#each week as cell}
									{@const isToday =
										cell.date.getDate() === currentDate.getDate() &&
										cell.date.getMonth() === currentDate.getMonth() &&
										cell.date.getFullYear() === currentDate.getFullYear()}
									<div
										class="relative flex h-5 items-center justify-center rounded-sm text-[10px] transition-colors
										{cell.isCurrentMonth ? 'text-slate-300' : 'text-slate-600'}
										{isToday ? 'font-bold text-blue-400 ring-1 ring-blue-400/50' : ''}"
									>
										{cell.day}
										{#if cell.events.length > 0}
											<div class="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-px">
												{#each cell.events.slice(0, 3) as ev}
													<span
														class="block h-1 w-1 rounded-full"
														style="background-color: {ev.color};"
													></span>
												{/each}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/each}
					</button>
				{/each}
			</div>

			<!-- ═══ MONTH VIEW ═══ -->
		{:else}
			<div class="flex items-center justify-center gap-2 overflow-hidden sm:gap-4">
				<!-- Previous month (blurred) -->
				<div
					class="hidden w-48 shrink-0 opacity-30 blur-[1px] transition-all sm:block lg:w-56"
					aria-hidden="true"
				>
					<div class="rounded-xl border border-slate-700/30 bg-slate-800/30 p-3">
						<h3 class="mb-2 text-center text-xs font-semibold text-slate-500">
							{monthNames[prevIdx]}
							{prevY}
						</h3>
						<div class="mb-1 grid grid-cols-7 gap-px">
							{#each weekdayShort as wd (wd)}
								<div class="text-center text-[8px] text-slate-600">{wd[0]}</div>
							{/each}
						</div>
						{#each prevGrid as week}
							<div class="grid grid-cols-7 gap-px">
								{#each week as cell}
									<div
										class="flex h-4 items-center justify-center text-[9px] {cell.isCurrentMonth
											? 'text-slate-500'
											: 'text-slate-700'}"
									>
										{cell.day}
									</div>
								{/each}
							</div>
						{/each}
					</div>
				</div>

				<!-- MAIN month (center) -->
				<div class="w-full max-w-2xl flex-1">
					<!-- Month nav -->
					<div class="mb-4 flex items-center justify-center gap-4">
						<button
							type="button"
							onclick={prevMonth}
							class="rounded-lg border border-slate-600 px-3 py-1.5 text-slate-300 transition-colors hover:bg-slate-700"
							aria-label="Previous month"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 19l-7-7 7-7"
								/></svg
							>
						</button>
						<h2
							class="font-brand min-w-[200px] text-center text-xl font-bold text-white sm:text-2xl"
						>
							{monthNames[selectedMonth]}
							{selectedYear}
						</h2>
						<button
							type="button"
							onclick={nextMonth}
							class="rounded-lg border border-slate-600 px-3 py-1.5 text-slate-300 transition-colors hover:bg-slate-700"
							aria-label="Next month"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/></svg
							>
						</button>
					</div>

					<div
						class="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm sm:p-6"
					>
						<!-- Weekday headers -->
						<div class="mb-2 grid grid-cols-7 gap-1">
							{#each weekdayShort as wd (wd)}
								<div class="text-center text-xs font-semibold text-slate-400">{wd}</div>
							{/each}
						</div>
						<!-- Days -->
						{#each mainGrid as week}
							<div class="grid grid-cols-7 gap-1">
								{#each week as cell}
									{@const isToday =
										cell.date.getDate() === currentDate.getDate() &&
										cell.date.getMonth() === currentDate.getMonth() &&
										cell.date.getFullYear() === currentDate.getFullYear()}
									<div
										class="group relative min-h-[4rem] rounded-lg border p-1 transition-colors sm:min-h-[5rem] sm:p-2
										{cell.isCurrentMonth
											? 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
											: 'border-transparent bg-slate-900/20'}
										{isToday ? 'ring-2 ring-blue-500/50' : ''}"
									>
										<span
											class="text-xs font-medium {cell.isCurrentMonth
												? 'text-slate-300'
												: 'text-slate-600'} {isToday ? 'text-blue-400' : ''}"
										>
											{cell.day}
										</span>
										{#if cell.events.length > 0}
											<div class="mt-0.5 space-y-0.5">
												{#each cell.events.slice(0, 2) as ev}
													<div
														class="truncate rounded px-1 py-0.5 text-[10px] font-medium text-white sm:text-xs"
														style="background-color: {ev.color}20; border-left: 2px solid {ev.color}; color: {ev.color};"
														title={ev.name}
													>
														{ev.name}
													</div>
												{/each}
												{#if cell.events.length > 2}
													<span class="text-[9px] text-slate-500">+{cell.events.length - 2}</span>
												{/if}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/each}
					</div>
				</div>

				<!-- Next month (blurred) -->
				<div
					class="hidden w-48 shrink-0 opacity-30 blur-[1px] transition-all sm:block lg:w-56"
					aria-hidden="true"
				>
					<div class="rounded-xl border border-slate-700/30 bg-slate-800/30 p-3">
						<h3 class="mb-2 text-center text-xs font-semibold text-slate-500">
							{monthNames[nextIdx]}
							{nextY}
						</h3>
						<div class="mb-1 grid grid-cols-7 gap-px">
							{#each weekdayShort as wd (wd)}
								<div class="text-center text-[8px] text-slate-600">{wd[0]}</div>
							{/each}
						</div>
						{#each nextGrid as week}
							<div class="grid grid-cols-7 gap-px">
								{#each week as cell}
									<div
										class="flex h-4 items-center justify-center text-[9px] {cell.isCurrentMonth
											? 'text-slate-500'
											: 'text-slate-700'}"
									>
										{cell.day}
									</div>
								{/each}
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		{#if viewMode === 'month'}
			{#if !selectedCityId}
				<div class="mt-6 rounded-xl border border-slate-700/30 bg-slate-800/20 p-8 text-center">
					<p class="text-sm text-slate-400">{$t('calendar.selectCityToView')}</p>
				</div>
			{:else if loadingEvents}
				<div class="mt-6 rounded-xl border border-slate-700/30 bg-slate-800/20 p-8 text-center">
					<p class="text-sm text-slate-400">{$t('calendar.loadingEvents')}</p>
				</div>
			{:else if activeMonthEvents().length > 0}
				<div
					class="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/40 p-3 backdrop-blur-sm"
				>
					{#each activeMonthEvents() as item (item.event_id)}
						<div
							class="flex items-center gap-2 rounded-lg border border-slate-700/40 bg-slate-800/60 px-2 py-1"
						>
							<span class="h-3 w-3 rounded-full" style="background-color: {item.color};"></span>
							<span class="text-xs text-slate-300">{item.name}</span>
							{#if data.isLoggedIn && data.currentUserId && item.created_by === data.currentUserId && data.isAdmin}
								<form
									method="POST"
									action="?/deleteEvent"
									onsubmit={(event) => {
										if (!confirmDeleteEvent()) {
											event.preventDefault();
										}
									}}
								>
									<input type="hidden" name="event_id" value={item.event_id} />
									<button
										type="submit"
										class="rounded border border-red-500/40 px-1.5 py-0.5 text-[10px] font-semibold text-red-300 transition-colors hover:bg-red-500/10"
									>
										{$t('crud.delete')}
									</button>
								</form>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<div class="mt-6 rounded-xl border border-slate-700/30 bg-slate-800/20 p-8 text-center">
					<p class="text-sm text-slate-500">{$t('calendar.noEvents')}</p>
				</div>
			{/if}
		{/if}
	</div>
</div>

<!-- ═══ ADD EVENT MODAL ═══ -->
{#if showAddModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => {
			if (e.target === e.currentTarget) showAddModal = false;
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') showAddModal = false;
		}}
	>
		<div class="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
			<h3 class="mb-4 text-lg font-bold text-white">{$t('calendar.addEvent')}</h3>

			{#if formMessage}
				<div
					class="mb-4 rounded-lg px-3 py-2 text-sm {formError
						? 'border border-red-500/30 bg-red-500/10 text-red-400'
						: 'border border-green-500/30 bg-green-500/10 text-green-400'}"
				>
					{formMessage}
				</div>
			{/if}

			<form
				method="POST"
				action="?/createEvent"
				use:enhance={() => {
					formLoading = true;
					formMessage = '';
					return async ({ result }) => {
						formLoading = false;
						if (result.type === 'success') {
							formMessage = $t('calendar.eventSuccess');
							formError = false;
							eventsRequestToken++; // Trigger background refetch seamlessly
							setTimeout(() => {
								showAddModal = false;
							}, 1200);
						} else {
							formMessage = $t('calendar.eventError');
							formError = true;
						}
					};
				}}
				class="space-y-4"
			>
				<!-- Event name -->
				<div>
					<label for="event-name" class="mb-1 block text-sm font-medium text-slate-300">
						{$t('calendar.eventName')}
					</label>
					<input
						type="text"
						id="event-name"
						name="name"
						required
						placeholder={$t('calendar.eventNamePlaceholder')}
						class="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<!-- Sport -->
				<div>
					<label for="event-sport" class="mb-1 block text-sm font-medium text-slate-300">
						{$t('calendar.eventSport')}
					</label>
					<select
						id="event-sport"
						name="sport_id"
						bind:value={eventSportId}
						required
						class="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					>
						<option value="" disabled>—</option>
						{#each data.sports ?? [] as sport (sport.sport_id)}
							<option value={sport.sport_id}>{sport.name}</option>
						{/each}
					</select>
				</div>

				<!-- Location Selection -->
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					<!-- Country -->
					<div>
						<label for="event-country" class="mb-1 block text-sm font-medium text-slate-300">
							{$t('calendar.filterCountry')}
						</label>
						<select
							id="event-country"
							bind:value={selectedCountryIso}
							onchange={() => {
								selectedDepartmentId = '';
								selectedCityId = '';
							}}
							required
							class="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						>
							<option value="">—</option>
							{#each getCountries() as country (country.id)}
								<option value={country.iso_code}>{country.name}</option>
							{/each}
						</select>
					</div>

					<!-- Department -->
					<div>
						<label for="event-department" class="mb-1 block text-sm font-medium text-slate-300">
							Depto./Prov.
						</label>
						<select
							id="event-department"
							bind:value={selectedDepartmentId}
							disabled={!selectedCountryIso}
							onchange={() => {
								selectedCityId = '';
							}}
							required
							class="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
						>
							<option value="">—</option>
							{#each filteredDepartments() as dept (dept.id)}
								<option value={dept.id}>{dept.name}</option>
							{/each}
						</select>
					</div>

					<!-- City -->
					<div>
						<label for="event-city" class="mb-1 block text-sm font-medium text-slate-300">
							Municipio
						</label>
						<select
							id="event-city"
							name="city_id"
							bind:value={selectedCityId}
							disabled={!selectedDepartmentId || loadingCities}
							required
							class="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
						>
							<option value="">{loadingCities ? 'Cargando...' : '—'}</option>
							{#each loadedCities as city (city.city_id)}
								<option value={city.city_id}>{city.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Dates -->
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label for="event-start" class="mb-1 block text-sm font-medium text-slate-300">
							{$t('calendar.eventStartDate')}
						</label>
						<DateInput
							id="event-start"
							name="reference_start"
							required={true}
							class="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<div>
						<label for="event-end" class="mb-1 block text-sm font-medium text-slate-300">
							{$t('calendar.eventEndDate')}
						</label>
						<DateInput
							id="event-end"
							name="reference_end"
							required={true}
							class="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
				</div>

				<!-- Color -->
				<div>
					<p id="event-color-label" class="mb-2 block text-sm font-medium text-slate-300">
						{$t('calendar.eventColor')}
					</p>
					<div role="radiogroup" aria-labelledby="event-color-label" class="flex flex-wrap gap-2">
						{#each colorPresets as preset (preset)}
							<label class="cursor-pointer">
								<input
									type="radio"
									name="color"
									value={preset}
									class="peer sr-only"
									checked={preset === '#3B82F6'}
								/>
								<span
									class="block h-7 w-7 rounded-full border-2 border-transparent transition-all peer-checked:border-white peer-checked:ring-2 peer-checked:ring-blue-400"
									style="background-color: {preset};"
								></span>
							</label>
						{/each}
					</div>
				</div>

				<!-- Recurring -->
				<label class="flex items-center gap-2 text-sm text-slate-300">
					<input
						type="checkbox"
						name="is_recurring"
						checked
						class="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
					/>
					{$t('calendar.eventRecurring')}
				</label>

				<!-- Actions -->
				<div class="flex gap-3 pt-2">
					<button
						type="button"
						onclick={() => (showAddModal = false)}
						class="flex-1 rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700"
					>
						{$t('calendar.eventCancel')}
					</button>
					<button
						type="submit"
						disabled={formLoading}
						class="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
					>
						{formLoading ? $t('calendar.eventCreating') : $t('calendar.eventSubmit')}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
