<script>
	import Modal from '$components/ui/Modal.svelte';
	import { goto } from '$app/navigation';
	import { onMount, untrack } from 'svelte';
	import { authStore } from '$lib/auth.svelte';
	import { createRow, getRow } from '$lib/appwrite';

	let { children } = $props();
	let isLoading = $state(false);

	$effect(() => {
		if (!authStore.isLoading && !authStore.isAuthenticated) {
			untrack(() => goto('/auth'));
		}
		if (!authStore.isLoading && authStore.isAdmin) {
			untrack(() => goto('/admin'));
		}
	});
</script>

<svelte:head>
	<title>Travel Portal | Hijrah Portal</title>
	<meta
		name="description"
		content="Plan your Hajj and Umrah journey with ease. Book your package now!" />
</svelte:head>

{#if authStore.isLoading || isLoading}
	<Modal text="Loading..." />
{:else if authStore.isAuthenticated}
	<div class="mt-6 md:mt-16">{@render children?.()}</div>
{:else}
	<Modal text="Redirecting..." />
{/if}
