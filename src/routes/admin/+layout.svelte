<script>
	import '../../app.css';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/auth.svelte';

	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$components/admin/Sidebar.svelte';
	import Modal from '$components/ui/Modal.svelte';

	let { children, data } = $props();
	let isLoading = $state(true);

	onMount(() => {
		// Only redirect after loading completes
		if (!authStore.isLoading && !authStore.isAuthenticated) {
			goto('/login');
		}
	});

	// onMount(async () => {
	// 	if (!authStore.isAuthenticated) {
	// 		goto('/auth');
	// 	}
	// 	isLoading = false;
	// });
</script>

<!-- {#if isLoading}
	
{/if} -->

<!-- {#if authStore.isAdmin}
	<Sidebar>
		{@render children?.()}
	</Sidebar>
{:else}
	<Modal
		text="Access Denied. Admins only."
		description="You do not have permission to access this page."
		spinner={false} />
{/if} -->

<svelte:head>
	<title>Admin | Hijrah Portal</title>
	<meta name="description" content="Admin dashboard for Hijrah Portal." />
</svelte:head>

{#if authStore.isLoading}
	<Modal text="Checking authentication..." />
{:else if authStore.isAuthenticated}
	<Sidebar>
		{@render children?.()}
	</Sidebar>
{:else}
	<Modal
		text="Access Denied."
		description="You do not have permission to access this page."
		spinner={false} />
{/if}
