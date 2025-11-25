<script>
	import { auth } from '$lib/auth.svelte';
	import { onMount } from 'svelte';

	import Modal from '$components/ui/Modal.svelte';
	import { goto } from '$app/navigation';

	let { children } = $props();
	let isLoading = $state(true);

	onMount(async () => {
		if (!auth.isLoggedIn) {
			goto('/auth');
		}
		isLoading = false;
	});
</script>

{#if isLoading}
	<Modal text="Loading..." />
{/if}

<div class="mt-6 md:mt-16">{@render children?.()}</div>
