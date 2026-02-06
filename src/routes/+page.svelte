<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/authStore';
	import { isLocationComplete } from '$lib/stores/location';

	onMount(() => {
		if (!$authStore) {
			goto('/login');
			return;
		}

		if (!$isLocationComplete) {
			goto('/onboarding');
			return;
		}
	});
</script>

<div class="min-h-screen bg-slate-950"></div>
