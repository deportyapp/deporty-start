<script lang="ts">
	import { locale, setLocale, type SupportedLanguage } from '$lib/i18n';

	const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
		{ code: 'es', label: 'ES', flag: '🇪🇸' },
		{ code: 'pt', label: 'PT', flag: '🇧🇷' }
	];

	function handleChange(lang: SupportedLanguage) {
		setLocale(lang);
	}
</script>

<div class="flex items-center gap-1" role="radiogroup" aria-label="Seleccionar idioma">
	{#each languages as lang}
		<button
			type="button"
			role="radio"
			aria-checked={$locale === lang.code}
			onclick={() => handleChange(lang.code)}
			class="rounded-md px-2 py-1 text-xs font-semibold transition-all {$locale === lang.code
				? 'bg-blue-600 text-white shadow-sm'
				: 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}"
		>
			<span aria-hidden="true">{lang.flag}</span>
			{lang.label}
		</button>
	{/each}
</div>
