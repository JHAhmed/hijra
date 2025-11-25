<script>
	import Modal from '$components/ui/Modal.svelte';
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';
	import { authStore } from '$lib/auth.svelte';

	let { children } = $props();

	$effect(() => {
		if (!authStore.isLoading && !authStore.isAuthenticated) {
			untrack(() => goto('/auth'));
		}
	});
</script>

<svelte:head>
	<title>Travel Portal | Hijrah Portal</title>
	<meta
		name="description"
		content="Plan your Hajj and Umrah journey with ease. Book your package now!" />
</svelte:head>

{#if authStore.isLoading}
	<Modal text="Loading..." />
{:else if authStore.isAuthenticated}
	<div class="mt-6 md:mt-16">{@render children?.()}</div>
{:else}
	<Modal text="Redirecting..." />
{/if}
