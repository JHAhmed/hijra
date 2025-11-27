<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { toast, Toaster } from 'svelte-sonner';
	import { Footer, Navbar, WhatsAppIcon, CTA } from '$shared';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/auth.svelte';

	let { children, data } = $props();

	// onMount(() => {
	// 	authStore.init();
	// });

	$effect(() => {
		authStore.initFromServer(data.user);

		// authStore.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Hijrah Portal - Hajj & Umrah Portal</title>
	<meta
		name="description"
		content="Hijrah Portal is your trusted partner for Hajj and Umrah services. We provide expert guidance and support for your spiritual journey." />
	<meta property="og:title" content="Hijrah Portal - Hajj & Umrah Portal" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{page.url.origin}/ogimage.png" />
	<meta property="og:url" content="{page.url.origin}/" />
	<meta
		property="og:description"
		content="Hijrah Portal is your trusted partner for Hajj and Umrah services. We provide expert guidance and support for your spiritual journey." />
</svelte:head>

<!-- {#if !auth.isLoading} -->
<div transition:fade>
	<div
		class="mt-8 mb-4 {page.url.pathname.startsWith('/auth') ||
		page.url.pathname.startsWith('/admin')
			? 'hidden'
			: ''}">
		<Navbar sticky={false} floating={page.url.pathname === '/'} />
	</div>

	{#key data.url}
		<div class="selection:bg-primary selection:text-white">{@render children?.()}</div>
	{/key}

	<div
		class={page.url.pathname.startsWith('/auth') || page.url.pathname.startsWith('/admin')
			? 'hidden'
			: ''}>
		<!-- <CTA /> -->
		<Footer />
	</div>

	<!-- <div
		class={page.url.pathname.startsWith('/auth') || page.url.pathname.startsWith('/admin')
			? 'hidden'
			: ''}>
		<WhatsAppIcon />
	</div> -->
</div>
<!-- {/if} -->
