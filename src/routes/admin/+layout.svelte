<script>
	import '../../app.css';

	import { auth } from '$lib/auth.svelte';
	import { onMount } from 'svelte';

	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$components/admin/Sidebar.svelte';
	import Modal from '$components/ui/Modal.svelte';
	import { goto } from '$app/navigation';
	
	let { children, data } = $props();
	let isLoading = $state(true);
	
	// onMount(async () => {
	// 	if (!auth.isLoggedIn) {
	// 		goto('/auth');
	// 	}
	// 	isLoading = false;
	// });
</script>

<!-- {#if isLoading}
	<Modal text="Loading..." />
{/if} -->

<!-- {#if auth.isAdmin} -->
	<Sidebar>
		{@render children?.()}
	</Sidebar>
<!-- {:else}
	<Modal text="Access Denied. Admins only." description="You do not have permission to access this page." spinner={false} />
{/if} -->