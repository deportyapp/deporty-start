<!--
  LanguageToggle.svelte
  
  Toggle simple para alternar entre Español y Português.
  Se muestra en la navbar junto al selector de país.
-->
<script lang="ts">
	import { locale, setLocale, supportedLanguages, type SupportedLanguage } from '$lib/i18n';
</script>

<div class="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5">
	{#each supportedLanguages as lang (lang.code)}
		<button
			onclick={() => setLocale(lang.code)}
			class="rounded-md px-2 py-1 text-xs font-semibold transition-all {$locale === lang.code
				? 'bg-blue-600 text-white shadow-sm'
				: 'text-gray-500 hover:text-gray-700'}"
			aria-label={lang.name}
			aria-pressed={$locale === lang.code}
		>
			{lang.flag} {lang.code.toUpperCase()}
		</button>
	{/each}
</div>
